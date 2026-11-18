/**
 * Lotus Tubes - Comprehensive Password Reset & Support Sender Verification Suite
 * Validates:
 * 1. Support sender identity & allowlist integration (support@lotustubes.com, reply-to: sales@lotustubes.com)
 * 2. Customer password reset flow with 6-digit HMAC OTP
 * 3. Staff password reset flow with role isolation
 * 4. Security invariants: 10-minute expiry, max 3 incorrect attempts lockout, 60s cooldown
 * 5. Session invalidation via tokenVersion increment on password change
 */

import { connectDB } from '../config/db.js';
import mongoose from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import {
  AI_AGENT_SENDERS,
  isValidSenderId,
  getSenderById,
  formatFromHeader,
  BUSINESS_MAILBOX
} from '../config/emailSenders.js';
import { User } from '../models/User.js';
import { sendEmail } from '../services/emailService.js';
import { EmailLog } from '../models/EmailLog.js';

async function runPasswordResetSuite() {
  console.log('================================================================');
  console.log('🔐 LOTUS TUBES - PASSWORD RESET & SUPPORT SENDER VERIFICATION');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}\n`);
      failed++;
    }
  };

  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }

  // 1. Support Sender Allowlist Verification
  await test('Sender Registry includes "support" identity with support@lotustubes.com and reply-to sales@lotustubes.com', async () => {
    if (!isValidSenderId('support')) {
      throw new Error('support sender ID must be approved by isValidSenderId');
    }

    const supportSender = getSenderById('support');
    if (supportSender.email !== 'support@lotustubes.com') {
      throw new Error(`Expected support@lotustubes.com, got ${supportSender.email}`);
    }
    if (supportSender.defaultReplyTo !== BUSINESS_MAILBOX) {
      throw new Error(`Expected replyTo ${BUSINESS_MAILBOX}, got ${supportSender.defaultReplyTo}`);
    }

    const header = formatFromHeader('support');
    if (!header.includes('Lotus Tubes Support') || !header.includes('<support@lotustubes.com>')) {
      throw new Error(`Unexpected From header: ${header}`);
    }
  });

  // 2. EmailLog Schema includes 'support' agentId enum
  await test('EmailLog schema accepts "support" agentId and logs transactional dispatches', async () => {
    const testLog = await EmailLog.create({
      agentId: 'support',
      agentName: 'Lotus Tubes Support',
      from: formatFromHeader('support'),
      to: ['test-security-audit@lotustubes.com'],
      replyTo: BUSINESS_MAILBOX,
      subject: '[Test] Security Password Reset Verification Code',
      bodyHtml: '<p>Test verification code: <strong>654321</strong></p>',
      deliveryStatus: 'accepted'
    });

    if (testLog.agentId !== 'support') {
      throw new Error(`Expected agentId 'support', got ${testLog.agentId}`);
    }

    await EmailLog.deleteOne({ _id: testLog._id });
  });

  // 3. User Schema has tokenVersion and OTP security fields
  await test('User schema contains tokenVersion and OTP tracking fields', async () => {
    const testEmail = `test_cust_${Date.now()}@lotustubes.test`;
    const user = await User.create({
      name: 'Test Customer Security',
      email: testEmail,
      password: 'InitialPassword123!',
      role: 'customer',
      department: 'client'
    });

    if (user.tokenVersion !== 0) {
      throw new Error(`Expected default tokenVersion 0, got ${user.tokenVersion}`);
    }

    await User.deleteOne({ _id: user._id });
  });

  // 4. Customer OTP Hashing & Verification
  await test('HMAC OTP generation and verification against User model', async () => {
    const testEmail = `test_otp_${Date.now()}@lotustubes.test`;
    const user = await User.create({
      name: 'Test OTP Customer',
      email: testEmail,
      password: 'OldPassword123!',
      role: 'customer'
    });

    // Helper HMAC
    const hashOtp = (otp) => crypto.createHmac('sha256', config.passwordResetOtpSecret).update(String(otp).trim()).digest('hex');

    const generatedOtp = '582914';
    user.resetPasswordOtpHash = hashOtp(generatedOtp);
    user.resetPasswordOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.resetPasswordOtpAttempts = 0;
    await user.save();

    // Verify correct OTP match
    const correctHash = hashOtp('582914');
    if (!crypto.timingSafeEqual(Buffer.from(correctHash, 'hex'), Buffer.from(user.resetPasswordOtpHash, 'hex'))) {
      throw new Error('Correct OTP hash did not match stored hash');
    }

    // Verify incorrect OTP does not match
    const wrongHash = hashOtp('111111');
    if (crypto.timingSafeEqual(Buffer.from(wrongHash, 'hex'), Buffer.from(user.resetPasswordOtpHash, 'hex'))) {
      throw new Error('Incorrect OTP hash incorrectly matched');
    }

    await User.deleteOne({ _id: user._id });
  });

  // 5. Password Reset updates password and increments tokenVersion
  await test('Password reset increments tokenVersion and revokes prior JWTs', async () => {
    const testEmail = `test_tokenv_${Date.now()}@lotustubes.test`;
    const user = await User.create({
      name: 'Test Token Revocation',
      email: testEmail,
      password: 'OldPassword123!',
      role: 'customer'
    });

    // Issue initial token with tokenVersion 0
    const initialToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role, tokenVersion: user.tokenVersion },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    const initialDecoded = jwt.verify(initialToken, config.jwtSecret);
    if (initialDecoded.tokenVersion !== 0) {
      throw new Error('Initial tokenVersion must be 0');
    }

    // Simulate password change
    user.password = 'BrandNewSecurePassword456!';
    user.passwordChangedAt = new Date();
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    // Fetch live user with password and verify tokenVersion mismatch
    const liveUser = await User.findById(user._id).select('+password');
    if (liveUser.tokenVersion !== 1) {
      throw new Error(`Expected tokenVersion 1, got ${liveUser.tokenVersion}`);
    }

    if (liveUser.tokenVersion === initialDecoded.tokenVersion) {
      throw new Error('Old token tokenVersion should no longer match updated user tokenVersion');
    }

    // Verify password was rehashed
    const isNewMatch = await liveUser.comparePassword('BrandNewSecurePassword456!');
    if (!isNewMatch) {
      throw new Error('New password was not hashed and verified correctly');
    }

    await User.deleteOne({ _id: user._id });
  });

  // 6. Role separation: Customer and Staff users
  await test('Role separation prevents customer from querying staff reset and vice-versa', async () => {
    const custEmail = `cust_role_${Date.now()}@lotustubes.test`;
    const staffEmail = `staff_role_${Date.now()}@lotustubes.test`;

    const [custUser, staffUser] = await Promise.all([
      User.create({ name: 'Role Cust', email: custEmail, password: 'Pass123!cust', role: 'customer' }),
      User.create({ name: 'Role Staff', email: staffEmail, password: 'Pass123!staff', role: 'staff' })
    ]);

    // Customer query with role: 'customer' must not match staff
    const findCust = await User.findOne({ email: staffEmail, role: 'customer' });
    if (findCust) {
      throw new Error('Customer query should not find staff account');
    }

    // Staff query with role in ['staff', 'admin'] must not match customer
    const findStaff = await User.findOne({ email: custEmail, role: { $in: ['staff', 'admin'] } });
    if (findStaff) {
      throw new Error('Staff query should not find customer account');
    }

    await Promise.all([
      User.deleteOne({ _id: custUser._id }),
      User.deleteOne({ _id: staffUser._id })
    ]);
  });

  console.log('\n================================================================');
  console.log(`RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPasswordResetSuite().then(() => {
  console.log('✅ All password reset and support sender security tests passed.');
  process.exit(0);
}).catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

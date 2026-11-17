/**
 * Lotus Tubes - Automated Verification Suite for Resend 4-Agent Email Automation
 * Validates Sender Identities, Super Admin Approval, Webhooks, Idempotency, and CRM API.
 */

import { connectDB } from '../config/db.js';
import app from '../app.js';
import mongoose from 'mongoose';
import http from 'http';
import crypto from 'crypto';
import {
  AI_AGENT_SENDERS,
  isValidSenderId,
  getSenderById,
  formatFromHeader,
  BUSINESS_MAILBOX
} from '../config/emailSenders.js';
import { sendEmail, dispatchPendingEmail, isSecureAttachmentPath } from '../services/emailService.js';
import { EmailLog } from '../models/EmailLog.js';
import { verifyWebhookSignature, processWebhookEvent } from '../services/emailWebhookService.js';
import {
  buildQuotationEmail,
  buildInvoiceEmail,
  buildInquiryReplyEmail,
  buildOperationsUpdateEmail
} from '../utils/emailTemplates.js';

let server;
const PORT = 5057;
const BASE_URL = `http://localhost:${PORT}/api`;

async function runEmailTestSuite() {
  console.log('================================================================');
  console.log('🚀 LOTUS TUBES - RESEND 4-AGENT EMAIL AUTOMATION VERIFICATION');
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

  // Connect to DB if needed
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }

  // 1. Sender Allowlist and Identity Definitions
  await test('Sender Registry defines all 4 dedicated AI agents and system sender with verified domains', async () => {
    const agents = ['ananya-mehta', 'riya-shah', 'neha-desai', 'arjun-yadav', 'system'];
    for (const aId of agents) {
      if (!isValidSenderId(aId)) {
        throw new Error(`Agent ID "${aId}" is missing or rejected by allowlist`);
      }
    }

    const ananya = getSenderById('ananya-mehta');
    if (ananya.email !== 'ananyamehta@lotustubes.com') throw new Error('Ananya email mismatch');
    if (ananya.defaultReplyTo !== BUSINESS_MAILBOX) throw new Error('Ananya reply-to must be sales@lotustubes.com');

    const riya = getSenderById('riya-shah');
    if (riya.email !== 'riyashah@lotustubes.com') throw new Error('Riya email mismatch');

    const neha = getSenderById('neha-desai');
    if (neha.email !== 'nehadesai@lotustubes.com') throw new Error('Neha email mismatch');

    const arjun = getSenderById('arjun-yadav');
    if (arjun.email !== 'arjunyadav@lotustubes.com') throw new Error('Arjun email mismatch');
  });

  await test('Server blocks arbitrary unauthorized From sender IDs', async () => {
    try {
      await sendEmail({
        agentId: 'unauthorized-spoof-agent',
        to: 'client@example.com',
        subject: 'Test Spoof',
        html: '<p>Test</p>'
      });
      throw new Error('Should have thrown an error for unauthorized sender');
    } catch (err) {
      if (!err.message.includes('SECURITY VIOLATION') && !err.message.includes('Unauthorized agent')) {
        throw err;
      }
    }
  });

  // 2. Email Dispatch & Provider Acceptance vs Delivered Status
  await test('Dispatched email via Ananya Mehta marks status as "accepted" (NOT "delivered")', async () => {
    const testRef = `LT-TEST-QT-${Date.now()}`;
    const html = buildQuotationEmail({
      customerName: 'Acro Pharma Ltd',
      quotationNumber: testRef,
      lineItems: [
        {
          description: 'SS 316L Sanitary Pipe 1.5" OD x 1.65mm',
          grade: 'SS 316L',
          quantity: 20,
          unit: 'Meters',
          unitPrice: 850,
          lineTotal: 17000
        }
      ],
      subtotal: 17000,
      taxTotal: 3060,
      grandTotal: 20060
    });

    const result = await sendEmail({
      agentId: 'ananya-mehta',
      to: 'procurement@acropharma.com',
      subject: `[Official Quotation ${testRef}] Lotus Tubes Sanitary Sourcing`,
      html,
      reference: testRef,
      idempotencyKey: `idemp_${testRef}`
    });

    if (!result.success) throw new Error('sendEmail did not succeed');
    if (!result.accepted) throw new Error('Email should be marked accepted');
    if (result.delivered) throw new Error('CRITICAL BUG: Provider acceptance must NOT be marked delivered!');

    const log = await EmailLog.findById(result.emailLogId);
    if (!log) throw new Error('EmailLog was not persisted to database');
    if (log.agentId !== 'ananya-mehta') throw new Error(`Expected agentId ananya-mehta, got ${log.agentId}`);
    if (log.from !== 'Ananya Mehta <ananyamehta@lotustubes.com>') throw new Error(`Incorrect from: ${log.from}`);
    if (log.replyTo !== 'sales@lotustubes.com') throw new Error(`Incorrect replyTo: ${log.replyTo}`);
    if (log.deliveryStatus !== 'accepted') throw new Error(`Delivery status should be 'accepted', got '${log.deliveryStatus}'`);
  });

  // 3. Idempotency Check
  await test('Idempotency key prevents duplicate sends and returns existing record', async () => {
    const key = `test_idempotency_${Date.now()}`;
    const res1 = await sendEmail({
      agentId: 'riya-shah',
      to: 'accounts@client.com',
      subject: 'Invoice Test',
      html: '<p>Invoice</p>',
      idempotencyKey: key
    });

    const res2 = await sendEmail({
      agentId: 'riya-shah',
      to: 'accounts@client.com',
      subject: 'Invoice Test',
      html: '<p>Invoice</p>',
      idempotencyKey: key
    });

    if (!res2.duplicate) throw new Error('Second dispatch did not detect duplicate idempotency key');
    if (String(res1.emailLogId) !== String(res2.emailLogId)) {
      throw new Error('Duplicate dispatch returned a different emailLogId');
    }
  });

  // 4. Human-in-the-Loop Super Admin Approval
  await test('Super Admin approval workflow holds unapproved emails in pending_approval', async () => {
    const queueRes = await sendEmail({
      agentId: 'neha-desai',
      to: 'buyer@client.com',
      subject: 'Unapproved Response',
      html: '<p>Response text</p>',
      requireApproval: true
    });

    if (!queueRes.pendingApproval) throw new Error('Email was not held for pending approval');

    const queuedLog = await EmailLog.findById(queueRes.emailLogId);
    if (queuedLog.deliveryStatus !== 'pending_approval') {
      throw new Error(`Expected deliveryStatus 'pending_approval', got '${queuedLog.deliveryStatus}'`);
    }

    // Try approving with non-admin
    try {
      await dispatchPendingEmail(queuedLog._id, { role: 'staff', name: 'Regular Staff' });
      throw new Error('Regular staff should not be able to approve queued email');
    } catch (err) {
      if (!err.message.includes('FORBIDDEN')) throw err;
    }

    // Approve with Super Admin
    const approveRes = await dispatchPendingEmail(queuedLog._id, {
      role: 'admin',
      name: 'Chirag Shah',
      _id: new mongoose.Types.ObjectId()
    });

    if (!approveRes.success) throw new Error('Super Admin approval failed');

    const updatedLog = await EmailLog.findById(queuedLog._id);
    if (updatedLog.approvalStatus !== 'approved') {
      throw new Error(`Expected approvalStatus 'approved', got '${updatedLog.approvalStatus}'`);
    }
  });

  // 5. Attachment Path Traversal Security
  await test('Attachment security blocks directory traversal outside project root', async () => {
    const isSafeProject = isSecureAttachmentPath('public/sample-quotation.pdf');
    if (!isSafeProject) throw new Error('Project file should be considered safe');

    const isSafeTraversal = isSecureAttachmentPath('../../../../../../../windows/system32/calc.exe');
    if (isSafeTraversal) throw new Error('Directory traversal should be rejected');
  });

  // 6. Resend Webhook Svix Signature Verification
  await test('Svix cryptographic webhook signature verification succeeds for authentic payloads and rejects tampered bodies', async () => {
    const testSecret = 'whsec_mfKQ9rJ7gC5bY4bYyH0bN2zL9xV1wQ7p';
    const msgId = 'msg_test_12345';
    const msgTimestamp = Math.floor(Date.now() / 1000).toString();
    const rawBody = JSON.stringify({ type: 'email.delivered', data: { email_id: 're_test_999' } });

    // Compute expected Svix signature
    const cleanSecret = testSecret.slice(6);
    const secretBuffer = Buffer.from(cleanSecret, 'base64');
    const toSign = `${msgId}.${msgTimestamp}.${rawBody}`;
    const validSignature = crypto.createHmac('sha256', secretBuffer).update(toSign).digest('base64');

    const validHeaders = {
      'svix-id': msgId,
      'svix-timestamp': msgTimestamp,
      'svix-signature': `v1,${validSignature}`
    };

    const isVerified = verifyWebhookSignature(validHeaders, rawBody, testSecret);
    if (!isVerified) throw new Error('Authentic webhook signature verification failed');

    // Tampered body test
    const tamperedBody = JSON.stringify({ type: 'email.delivered', data: { email_id: 're_hacked' } });
    const isTamperedVerified = verifyWebhookSignature(validHeaders, tamperedBody, testSecret);
    if (isTamperedVerified) throw new Error('Tampered body was incorrectly accepted');
  });

  // 7. Webhook Event Processing Updates Status from 'accepted' to 'delivered'
  await test('Webhook event "email.delivered" updates EmailLog from "accepted" to "delivered" with timestamp', async () => {
    const mockMsgId = `re_webhook_test_${Date.now()}`;
    const log = await EmailLog.create({
      resendMessageId: mockMsgId,
      agentId: 'arjun-yadav',
      agentName: 'Arjun Yadav',
      from: 'Arjun Yadav <arjunyadav@lotustubes.com>',
      to: ['client@domain.com'],
      subject: 'Webhook Delivery Test',
      bodyHtml: '<p>Testing</p>',
      deliveryStatus: 'accepted'
    });

    const eventPayload = {
      type: 'email.delivered',
      data: {
        email_id: mockMsgId,
        created_at: new Date().toISOString()
      }
    };

    const processRes = await processWebhookEvent(eventPayload);
    if (!processRes.success) throw new Error('Webhook processing returned unsuccessful');

    const updatedLog = await EmailLog.findById(log._id);
    if (updatedLog.deliveryStatus !== 'delivered') {
      throw new Error(`Expected deliveryStatus 'delivered', got '${updatedLog.deliveryStatus}'`);
    }
    if (!updatedLog.deliveredAt) {
      throw new Error('deliveredAt timestamp was not populated');
    }
  });

  console.log('\n================================================================');
  console.log(`RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runEmailTestSuite().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});

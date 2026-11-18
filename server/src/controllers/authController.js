import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { Enquiry } from '../models/Enquiry.js';
import { Quote } from '../models/Quote.js';
import { Invoice } from '../models/Invoice.js';
import { AuditLog } from '../models/AuditLog.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { config } from '../config/env.js';
import { getDBStatus, assertDatabaseConnected } from '../config/db.js';
import { recordAuditEvent } from '../utils/auditLogger.js';
import { sendEmail } from '../services/emailService.js';
import { escapeHtml, sanitizeText } from '../utils/security.js';

// Helper to generate JWT token with full RBAC claims
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department || 'sales',
      permissions: user.permissions || [],
      company: user.company || '',
      phone: user.phone || '',
      tokenVersion: user.tokenVersion || 0
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

/**
 * Register a new Customer (Public registration strictly restricted to 'customer' role)
 */
export const registerCustomer = async (req, res, next) => {
  try {
    const { name, email, password, company, phone, country } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email, and password are required', 400);
    }

    if (password.length < 8) {
      return errorResponse(res, 'Password must be at least 8 characters long for security', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    assertDatabaseConnected();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return errorResponse(res, 'An account with this email address already exists. Please sign in.', 409);
    }

    // Role is strictly forced to customer; public registration cannot grant staff/admin privileges
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'customer',
      department: 'client',
      permissions: ['self:access'],
      company: (company || '').trim(),
      phone: (phone || '').trim(),
      country: (country || 'India').trim(),
      isEmailVerified: true,
      accountStatus: 'active'
    });

    const token = generateToken(user);
    return successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          permissions: user.permissions,
          company: user.company,
          phone: user.phone,
          country: user.country
        }
      },
      'Customer registered successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Customer Login
 */
export const loginCustomer = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Please provide both email and password', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    assertDatabaseConnected();

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid credentials. No account found.', 401);
    }

    if (user.role !== 'customer') {
      return errorResponse(res, 'Please use the Staff Workspace portal for administrative access.', 403);
    }

    if (user.accountStatus === 'suspended') {
      return errorResponse(res, 'This customer account has been suspended. Please contact support.', 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials. Incorrect password.', 401);
    }

    const token = generateToken(user);
    return successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          permissions: user.permissions,
          company: user.company,
          phone: user.phone,
          country: user.country
        }
      },
      'Customer logged in successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Staff Login (Enforces staff and admin accounts only)
 */
export const loginStaff = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Please provide staff email and password', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    assertDatabaseConnected();

    const user = await User.findOne({
      email: normalizedEmail,
      role: { $in: ['staff', 'admin'] }
    }).select('+password');

    if (!user) {
      return errorResponse(res, 'Invalid staff credentials or account not provisioned.', 401);
    }

    if (user.accountStatus !== 'active') {
      return errorResponse(res, 'Your staff account is currently inactive. Contact your Super Admin.', 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await recordAuditEvent({
        actor: { email: normalizedEmail, role: 'staff' },
        action: 'STAFF_LOGIN_FAILED',
        targetType: 'User',
        targetId: user._id,
        metadata: { reason: 'Incorrect password' },
        ip: req.ip
      });
      return errorResponse(res, 'Invalid staff credentials.', 401);
    }

    user.lastLoginAt = new Date();
    await user.save();

    await recordAuditEvent({
      actor: { id: user._id, name: user.name, email: user.email, role: user.role },
      action: 'STAFF_LOGIN_SUCCESS',
      targetType: 'User',
      targetId: user._id,
      metadata: { department: user.department },
      ip: req.ip
    });

    const token = generateToken(user);
    return successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          designation: user.designation || 'Staff',
          permissions: user.permissions,
          company: user.company,
          phone: user.phone || user.contactNumber,
          contactNumber: user.contactNumber || user.phone,
          dateOfBirth: user.dateOfBirth,
          mustChangePassword: !!user.mustChangePassword
        }
      },
      'Staff workspace authenticated successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user profile
 */
export const getMe = async (req, res) => {
  return successResponse(res, { user: req.user });
};

/**
 * Get quotations and RFQs submitted by the current customer
 */
export const getMyQuotations = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const userEmail = (req.user.email || '').toLowerCase().trim();
    assertDatabaseConnected();

    const [enquiries, quotes, invoices] = await Promise.all([
      Enquiry.find({ $or: [{ customerId: userId }, { email: userEmail }] }).sort({ createdAt: -1 }),
      Quote.find({ $or: [{ customerId: userId }, { email: userEmail }] }).sort({ createdAt: -1 }),
      Invoice.find({ $or: [{ customerId: userId }, { email: userEmail }] }).sort({ createdAt: -1 })
    ]);

    return successResponse(res, { enquiries, quotes, invoices });
  } catch (error) {
    next(error);
  }
};

/**
 * Super Admin: List all staff accounts
 */
export const getStaffUsers = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const staffList = await User.find({ role: { $in: ['staff', 'admin'] } })
      .select('-password')
      .sort({ createdAt: -1 });

    return successResponse(res, staffList);
  } catch (error) {
    next(error);
  }
};

/**
 * Helper: Normalize department strings to canonical database enums
 */
const normalizeDepartment = (dept) => {
  if (!dept) return 'sales';
  const d = String(dept).trim().toLowerCase();
  if (d.includes('sales') || d.includes('commercial')) return 'sales';
  if (d.includes('account') || d.includes('billing') || d.includes('finance')) return 'accounts';
  if (d.includes('inventory') || d.includes('sourcing') || d.includes('procurement') || d.includes('logistics') || d.includes('dispatch') || d.includes('warehouse')) return 'inventory';
  if (d.includes('operation') || d.includes('quality') || d.includes('inspection')) return 'operations';
  if (d.includes('manage') || d.includes('executive') || d.includes('admin')) return 'management';
  if (d === 'client') return 'client';
  return 'sales';
};

/**
 * Super Admin: Create a new Staff Account (New Staff Appointment)
 * Personal fields: Name, Contact Number, Email ID, Password, Date of Birth.
 * Professional fields: Department, Designation, Role, Permissions.
 */
export const createStaffUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = 'staff',
      department = 'sales',
      designation = 'Sales Executive',
      contactNumber,
      phone,
      dateOfBirth,
      permissions,
      company = 'Lotus Tubes'
    } = req.body;

    const safeContact = (contactNumber || phone || '').trim();

    if (!name || !email || !password) {
      return errorResponse(res, 'Full name, email, and initial password are required', 400);
    }

    if (!safeContact) {
      return errorResponse(res, 'Contact phone number is required for staff appointments', 400);
    }

    if (!dateOfBirth) {
      return errorResponse(res, 'Date of birth is required for staff appointments', 400);
    }

    if (password.length < 8) {
      return errorResponse(res, 'Password must be at least 8 characters long for security', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    assertDatabaseConnected();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return errorResponse(res, 'A user account with this email address already exists', 409);
    }

    const newStaff = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: role === 'admin' ? 'admin' : 'staff',
      department: normalizeDepartment(department),
      designation: designation.trim() || 'Sales Executive',
      contactNumber: safeContact,
      phone: safeContact,
      dateOfBirth: new Date(dateOfBirth),
      permissions: Array.isArray(permissions) && permissions.length ? permissions : undefined,
      company: company || 'Lotus Tubes',
      mustChangePassword: true,
      isEmailVerified: true,
      accountStatus: 'active'
    });

    await recordAuditEvent({
      actor: req.user,
      action: 'STAFF_CREATED',
      targetType: 'User',
      targetId: newStaff._id,
      targetRef: newStaff.email,
      metadata: {
        staffName: newStaff.name,
        role: newStaff.role,
        department: newStaff.department,
        designation: newStaff.designation
      },
      ip: req.ip
    });

    return successResponse(
      res,
      {
        id: newStaff._id,
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role,
        department: newStaff.department,
        designation: newStaff.designation,
        contactNumber: newStaff.contactNumber,
        dateOfBirth: newStaff.dateOfBirth,
        permissions: newStaff.permissions,
        accountStatus: newStaff.accountStatus
      },
      'Staff member appointed successfully. Initial credentials provisioned.',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Super Admin: Update Staff permissions, department, designation, or status
 */
export const updateStaffUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      department,
      designation,
      role,
      permissions,
      accountStatus,
      contactNumber,
      phone,
      dateOfBirth
    } = req.body;
    assertDatabaseConnected();

    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, 'Staff member not found', 404);
    }

    // Prevent removing the last super admin
    if (user.role === 'admin' && role === 'staff') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return errorResponse(res, 'Cannot downgrade the primary Super Administrator account', 400);
      }
    }

    const previousRole = user.role;
    const previousStatus = user.accountStatus;

    if (name) user.name = name.trim();
    if (department) user.department = normalizeDepartment(department);
    if (designation) user.designation = designation.trim();
    if (role && (role === 'staff' || role === 'admin')) user.role = role;
    if (Array.isArray(permissions)) user.permissions = permissions;
    if (accountStatus) user.accountStatus = accountStatus;
    if (contactNumber || phone) {
      user.contactNumber = (contactNumber || phone).trim();
      user.phone = user.contactNumber;
    }
    if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);

    await user.save();

    await recordAuditEvent({
      actor: req.user,
      action: 'STAFF_UPDATED',
      targetType: 'User',
      targetId: user._id,
      targetRef: user.email,
      metadata: {
        staffName: user.name,
        previousRole,
        newRole: user.role,
        previousStatus,
        newStatus: user.accountStatus,
        department: user.department
      },
      ip: req.ip
    });

    return successResponse(
      res,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        contactNumber: user.contactNumber,
        dateOfBirth: user.dateOfBirth,
        permissions: user.permissions,
        accountStatus: user.accountStatus
      },
      'Staff member updated successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Staff Self-Service: Change Password
 */
export const changeStaffPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    assertDatabaseConnected();

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 'Both current password and new password are required', 400);
    }

    if (newPassword.length < 8) {
      return errorResponse(res, 'New password must be at least 8 characters long', 400);
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return errorResponse(res, 'User account not found', 404);
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return errorResponse(res, 'Current password verification failed', 401);
    }

    user.password = newPassword;
    user.passwordChangedAt = new Date();
    user.mustChangePassword = false;
    await user.save();

    await recordAuditEvent({
      actor: req.user,
      action: 'PASSWORD_CHANGED',
      targetType: 'User',
      targetId: user._id,
      targetRef: user.email,
      metadata: { reason: 'User completed password change' },
      ip: req.ip
    });

    return successResponse(res, null, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

// Cryptographically secure keyed HMAC for OTP
const hashOtp = (otp) => {
  return crypto
    .createHmac('sha256', config.passwordResetOtpSecret)
    .update(String(otp).trim())
    .digest('hex');
};

// Timing-safe comparison to prevent side-channel timing attacks
const timingSafeHashCompare = (hashA, hashB) => {
  if (!hashA || !hashB || typeof hashA !== 'string' || typeof hashB !== 'string') return false;
  try {
    const bufA = Buffer.from(hashA, 'hex');
    const bufB = Buffer.from(hashB, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch (err) {
    return false;
  }
};

// Branded HTML email generator for Lotus Tubes Password Reset
const buildPasswordResetEmailHtml = ({ name, otp, portalName = 'Account Portal' }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lotus Tubes - Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);" cellspacing="0" cellpadding="0">
          <!-- Header -->
          <tr>
            <td style="background-color: #0F172A; padding: 28px 32px; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.5px;">LOTUS TUBES</h1>
                    <p style="margin: 4px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #38BDF8;">Hygienic Process Solutions & Security</p>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 10px; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 9999px; font-size: 11px; font-weight: 600; color: #38BDF8;">
                      Security Verification
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: #0F172A;">Password Reset Verification Code</h2>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #475569;">
                Hello <strong>${escapeHtml(name)}</strong>,<br>
                We received a request to reset your password for the <strong>Lotus Tubes ${escapeHtml(portalName)}</strong>. Enter the 6-digit verification code below to proceed with setting a new password.
              </p>

              <!-- OTP Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                <tr>
                  <td align="center" style="background: linear-gradient(135deg, #F0FDF4 0%, #F8FAFC 100%); border: 2px dashed #0EA5E9; border-radius: 10px; padding: 22px;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #0284C7; margin-bottom: 8px;">Your 6-Digit Verification Code</div>
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; letter-spacing: 10px; color: #0F172A; text-shadow: 0 1px 2px rgba(0,0,0,0.05); padding-left: 10px;">
                      ${otp}
                    </div>
                    <div style="margin-top: 10px; font-size: 12px; color: #64748B;">
                      ⏱️ <strong>Valid for 10 minutes only</strong> • Single-use code
                    </div>
                  </td>
                </tr>
              </table>

              <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #92400E;">
                  <strong>Security Advisory:</strong> Lotus Tubes staff will never contact you asking for your verification code or password. If you did not initiate this request, you can safely ignore this email; your account credentials remain unchanged.
                </p>
              </div>

              <p style="margin: 0; font-size: 13px; color: #64748B; line-height: 1.5;">
                Need assistance? Contact our support team at <a href="mailto:sales@lotustubes.com" style="color: #0284C7; text-decoration: none; font-weight: 600;">sales@lotustubes.com</a> or phone <a href="tel:+919324718035" style="color: #0284C7; text-decoration: none;">+91 93247 18035</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F1F5F9; padding: 20px 32px; border-top: 1px solid #E2E8F0; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 11px; color: #64748B;">
                Sent by Lotus Tubes Support Desk • <a href="https://lotustubes.com" style="color: #0284C7; text-decoration: none;">lotustubes.com</a>
              </p>
              <p style="margin: 0; font-size: 10px; color: #94A3B8;">
                Replies to this email are routed directly to sales@lotustubes.com.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Customer Password Reset Request (OTP Generation)
 * Sends short-lived, rate-limited OTP to verified email without exposing existence
 */
export const forgotCustomerPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return errorResponse(res, 'Please provide your registered customer email address', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    assertDatabaseConnected();

    const user = await User.findOne({
      email: normalizedEmail,
      role: 'customer'
    });

    if (user) {
      const now = Date.now();
      const cooldownMs = 60 * 1000; // 60 seconds cooldown between dispatches
      const oneHourMs = 60 * 60 * 1000;

      // Rate limit check: hourly window
      if (!user.resetPasswordOtpWindowStart || now - user.resetPasswordOtpWindowStart.getTime() > oneHourMs) {
        user.resetPasswordOtpWindowStart = new Date(now);
        user.resetPasswordOtpRequestCount = 0;
      }

      // Check cooldown and hourly request cap
      const isCoolingDown = user.resetPasswordOtpRequestedAt && now - user.resetPasswordOtpRequestedAt.getTime() < cooldownMs;
      const isExceededCap = (user.resetPasswordOtpRequestCount || 0) >= 5;

      if (!isCoolingDown && !isExceededCap) {
        const otpNum = crypto.randomInt(100000, 1000000).toString();
        const otpHash = hashOtp(otpNum);

        user.resetPasswordOtpHash = otpHash;
        user.resetPasswordOtpExpiresAt = new Date(now + 10 * 60 * 1000); // 10 minutes expiry
        user.resetPasswordOtpAttempts = 0;
        user.resetPasswordOtpRequestedAt = new Date(now);
        user.resetPasswordOtpRequestCount = (user.resetPasswordOtpRequestCount || 0) + 1;
        await user.save();

        // Dispatch via Lotus Tubes Support identity (replies routed to sales@lotustubes.com)
        await sendEmail({
          agentId: 'support',
          to: user.email,
          replyTo: 'sales@lotustubes.com',
          subject: 'Your Lotus Tubes Password Reset Verification Code',
          html: buildPasswordResetEmailHtml({ name: user.name, otp: otpNum, portalName: 'Customer Portal' }),
          metadata: { category: 'password_reset', role: 'customer' }
        });

        await recordAuditEvent({
          actor: { email: normalizedEmail, role: 'customer' },
          action: 'CUSTOMER_PASSWORD_RESET_OTP_ISSUED',
          targetType: 'User',
          targetId: user._id,
          targetRef: user.email,
          metadata: { expiresAt: user.resetPasswordOtpExpiresAt },
          ip: req.ip
        });
      }
    }

    // Generic response to prevent user account enumeration
    return successResponse(
      res,
      null,
      'If your account is registered, a secure 6-digit verification code has been dispatched to your email address.'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Customer Password Reset Verification & Completion
 */
export const resetCustomerPasswordWithOtp = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    assertDatabaseConnected();

    if (!email || !otp || !newPassword) {
      return errorResponse(res, 'Email, OTP verification code, and new password are required', 400);
    }

    if (newPassword.length < 8) {
      return errorResponse(res, 'New password must be at least 8 characters long for security', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({
      email: normalizedEmail,
      role: 'customer'
    }).select('+resetPasswordOtpHash +resetPasswordOtpExpiresAt +resetPasswordOtpAttempts');

    if (!user || !user.resetPasswordOtpHash || !user.resetPasswordOtpExpiresAt) {
      return errorResponse(res, 'Invalid or expired verification session. Please request a new OTP.', 400);
    }

    if (new Date() > user.resetPasswordOtpExpiresAt) {
      user.resetPasswordOtpHash = null;
      user.resetPasswordOtpExpiresAt = null;
      user.resetPasswordOtpAttempts = 0;
      await user.save();
      return errorResponse(res, 'Verification code has expired. Please request a new OTP.', 400);
    }

    if ((user.resetPasswordOtpAttempts || 0) >= 3) {
      user.resetPasswordOtpHash = null;
      user.resetPasswordOtpExpiresAt = null;
      user.resetPasswordOtpAttempts = 0;
      await user.save();
      return errorResponse(res, 'Maximum verification attempts exceeded. Please request a new OTP.', 429);
    }

    const suppliedHash = hashOtp(otp);
    if (!timingSafeHashCompare(suppliedHash, user.resetPasswordOtpHash)) {
      user.resetPasswordOtpAttempts = (user.resetPasswordOtpAttempts || 0) + 1;
      if (user.resetPasswordOtpAttempts >= 3) {
        user.resetPasswordOtpHash = null;
        user.resetPasswordOtpExpiresAt = null;
      }
      await user.save();
      return errorResponse(res, 'Invalid verification code. Please check and try again.', 401);
    }

    // Validated: Reset password securely and increment tokenVersion to revoke old sessions
    user.password = newPassword;
    user.passwordChangedAt = new Date();
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    user.resetPasswordOtpHash = null;
    user.resetPasswordOtpExpiresAt = null;
    user.resetPasswordOtpAttempts = 0;
    user.resetPasswordOtpRequestedAt = null;
    await user.save();

    await recordAuditEvent({
      actor: { id: user._id, name: user.name, email: user.email, role: user.role },
      action: 'CUSTOMER_PASSWORD_RESET_COMPLETED',
      targetType: 'User',
      targetId: user._id,
      targetRef: user.email,
      metadata: { reason: 'Password successfully reset via customer OTP' },
      ip: req.ip
    });

    return successResponse(res, null, 'Password reset successfully. You may now log in with your new password.');
  } catch (error) {
    next(error);
  }
};

/**
 * Staff Password Reset Request (OTP Generation)
 * Sends short-lived, rate-limited OTP to verified email without exposing existence
 */
export const forgotStaffPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return errorResponse(res, 'Please provide your registered staff email address', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    assertDatabaseConnected();

    const user = await User.findOne({
      email: normalizedEmail,
      role: { $in: ['staff', 'admin'] }
    });

    if (user) {
      const now = Date.now();
      const cooldownMs = 60 * 1000;
      const oneHourMs = 60 * 60 * 1000;

      if (!user.resetPasswordOtpWindowStart || now - user.resetPasswordOtpWindowStart.getTime() > oneHourMs) {
        user.resetPasswordOtpWindowStart = new Date(now);
        user.resetPasswordOtpRequestCount = 0;
      }

      const isCoolingDown = user.resetPasswordOtpRequestedAt && now - user.resetPasswordOtpRequestedAt.getTime() < cooldownMs;
      const isExceededCap = (user.resetPasswordOtpRequestCount || 0) >= 5;

      if (!isCoolingDown && !isExceededCap) {
        const otpNum = crypto.randomInt(100000, 1000000).toString();
        const otpHash = hashOtp(otpNum);

        user.resetPasswordOtpHash = otpHash;
        user.resetPasswordOtpExpiresAt = new Date(now + 10 * 60 * 1000); // 10 minutes expiry
        user.resetPasswordOtpAttempts = 0;
        user.resetPasswordOtpRequestedAt = new Date(now);
        user.resetPasswordOtpRequestCount = (user.resetPasswordOtpRequestCount || 0) + 1;
        await user.save();

        // Dispatch via Lotus Tubes Support identity (replies routed to sales@lotustubes.com)
        await sendEmail({
          agentId: 'support',
          to: user.email,
          replyTo: 'sales@lotustubes.com',
          subject: '[Lotus Tubes Staff Security] Your Password Reset Verification Code',
          html: buildPasswordResetEmailHtml({ name: user.name, otp: otpNum, portalName: 'Staff Workspace' }),
          metadata: { category: 'password_reset', role: user.role }
        });

        await recordAuditEvent({
          actor: { email: normalizedEmail, role: user.role },
          action: 'STAFF_PASSWORD_RESET_OTP_ISSUED',
          targetType: 'User',
          targetId: user._id,
          targetRef: user.email,
          metadata: { expiresAt: user.resetPasswordOtpExpiresAt },
          ip: req.ip
        });
      }
    }

    // Generic response to prevent user enumeration
    return successResponse(
      res,
      null,
      'If your account is registered, a secure 6-digit verification code has been dispatched to your email address.'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Staff Password Reset Verification & Completion
 */
export const resetStaffPasswordWithOtp = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    assertDatabaseConnected();

    if (!email || !otp || !newPassword) {
      return errorResponse(res, 'Email, OTP verification code, and new password are required', 400);
    }

    if (newPassword.length < 8) {
      return errorResponse(res, 'New password must be at least 8 characters long for security', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({
      email: normalizedEmail,
      role: { $in: ['staff', 'admin'] }
    }).select('+resetPasswordOtpHash +resetPasswordOtpExpiresAt +resetPasswordOtpAttempts');

    if (!user || !user.resetPasswordOtpHash || !user.resetPasswordOtpExpiresAt) {
      return errorResponse(res, 'Invalid or expired verification session. Please request a new OTP.', 400);
    }

    if (new Date() > user.resetPasswordOtpExpiresAt) {
      user.resetPasswordOtpHash = null;
      user.resetPasswordOtpExpiresAt = null;
      user.resetPasswordOtpAttempts = 0;
      await user.save();
      return errorResponse(res, 'Verification code has expired. Please request a new OTP.', 400);
    }

    // Verify OTP attempt count
    if ((user.resetPasswordOtpAttempts || 0) >= 3) {
      user.resetPasswordOtpHash = null;
      user.resetPasswordOtpExpiresAt = null;
      user.resetPasswordOtpAttempts = 0;
      await user.save();
      return errorResponse(res, 'Maximum verification attempts exceeded. Please request a new OTP.', 429);
    }

    const suppliedHash = hashOtp(otp);
    if (!timingSafeHashCompare(suppliedHash, user.resetPasswordOtpHash)) {
      user.resetPasswordOtpAttempts = (user.resetPasswordOtpAttempts || 0) + 1;
      if (user.resetPasswordOtpAttempts >= 3) {
        user.resetPasswordOtpHash = null;
        user.resetPasswordOtpExpiresAt = null;
      }
      await user.save();
      return errorResponse(res, 'Invalid verification code. Please check and try again.', 401);
    }

    // Validated: Reset password securely and increment tokenVersion to revoke old sessions
    user.password = newPassword;
    user.passwordChangedAt = new Date();
    user.mustChangePassword = false;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    user.resetPasswordOtpHash = null;
    user.resetPasswordOtpExpiresAt = null;
    user.resetPasswordOtpAttempts = 0;
    user.resetPasswordOtpRequestedAt = null;
    await user.save();

    await recordAuditEvent({
      actor: { id: user._id, name: user.name, email: user.email, role: user.role },
      action: 'STAFF_PASSWORD_RESET_COMPLETED',
      targetType: 'User',
      targetId: user._id,
      targetRef: user.email,
      metadata: { reason: 'Password successfully reset via staff OTP' },
      ip: req.ip
    });

    return successResponse(res, null, 'Password reset successfully. You may now log in with your new credentials.');
  } catch (error) {
    next(error);
  }
};

/**
 * Super Admin: Get Audit Logs
 */
export const getAuditLogs = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { action, targetType, page = 1, limit = 50 } = req.query;

    const query = {};
    if (action && action !== 'All') query.action = action;
    if (targetType && targetType !== 'All') query.targetType = targetType;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      AuditLog.countDocuments(query)
    ]);

    return successResponse(res, {
      logs,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    next(error);
  }
};

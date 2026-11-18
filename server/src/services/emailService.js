import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';
import { config } from '../config/env.js';
import {
  AI_AGENT_SENDERS,
  isValidSenderId,
  getSenderById,
  formatFromHeader,
  BUSINESS_MAILBOX
} from '../config/emailSenders.js';
import { EmailLog } from '../models/EmailLog.js';
import { validateEmail } from '../middleware/validateRequest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../../');

let resendClient = null;
const isPlaceholderKey = !config.resend.apiKey || config.resend.apiKey.includes('placeholder') || config.resend.apiKey.startsWith('re_placeholder');

if (!isPlaceholderKey) {
  try {
    resendClient = new Resend(config.resend.apiKey);
  } catch (err) {
    console.warn('⚠️ Failed to initialize Resend client:', err.message);
  }
} else {
  console.log('ℹ️ Resend API Key is unconfigured or a placeholder. Transactional emails will run in verified demo mode.');
}

/**
 * Validates file path to prevent directory traversal attacks
 * @param {string} filePath 
 * @returns {boolean}
 */
export const isSecureAttachmentPath = (filePath) => {
  if (!filePath || typeof filePath !== 'string') return false;
  const resolved = path.resolve(filePath);
  // Allow paths within project root or system temp
  return resolved.startsWith(PROJECT_ROOT);
};

/**
 * Converts attachments into Resend-compatible format
 * @param {Array<Object>} attachments 
 * @returns {Promise<Array<Object>>}
 */
const resolveAttachments = async (attachments = []) => {
  if (!Array.isArray(attachments) || attachments.length === 0) return [];

  const resolved = [];
  for (const att of attachments) {
    if (!att || !att.filename) continue;

    if (att.content) {
      // Content already supplied as buffer or base64
      const contentBuffer = Buffer.isBuffer(att.content) ? att.content : Buffer.from(att.content);
      resolved.push({
        filename: att.filename,
        content: contentBuffer
      });
    } else if (att.path) {
      if (!isSecureAttachmentPath(att.path)) {
        console.warn('⚠️ Rejected potentially unsafe attachment path:', att.path);
        continue;
      }
      if (fs.existsSync(att.path)) {
        const fileData = await fs.promises.readFile(att.path);
        resolved.push({
          filename: att.filename,
          content: fileData
        });
      } else {
        console.warn('⚠️ Attachment file does not exist on disk:', att.path);
      }
    }
  }
  return resolved;
};

/**
 * Centralized Resend Email Service for Lotus Tubes
 * Dispatches emails through authorized AI agent identities or system default.
 * Persists complete communication history to MongoDB EmailLog.
 *
 * @param {Object} options
 * @param {string} [options.agentId='system'] - 'ananya-mehta' | 'riya-shah' | 'neha-desai' | 'arjun-yadav' | 'system'
 * @param {string|string[]} options.to - Recipient email(s)
 * @param {string} options.subject - Subject line
 * @param {string} options.html - HTML body
 * @param {string} [options.text] - Plain text fallback
 * @param {string} [options.replyTo] - Defaults to sales@lotustubes.com
 * @param {string[]} [options.cc] - CC recipients
 * @param {string[]} [options.bcc] - BCC recipients
 * @param {Array<Object>} [options.attachments] - Array of attachment objects
 * @param {string} [options.idempotencyKey] - Unique key to prevent duplicate sends
 * @param {string} [options.reference] - Associated quote, invoice, or enquiry reference
 * @param {string} [options.customerId] - Associated Customer ID
 * @param {string} [options.quoteId] - Associated Quote ID
 * @param {string} [options.invoiceId] - Associated Invoice ID
 * @param {string} [options.enquiryId] - Associated Enquiry ID
 * @param {string} [options.agentTaskId] - Associated AgentTask ID
 * @param {boolean} [options.requireApproval=false] - If true, queues for Super Admin review without sending
 * @param {Object} [options.approvedBy] - User object if already approved
 * @param {Object} [options.metadata] - Additional contextual metadata
 * @returns {Promise<Object>}
 */
export const sendEmail = async (options = {}) => {
  const {
    agentId = 'system',
    to,
    subject,
    html,
    text = '',
    replyTo = BUSINESS_MAILBOX,
    cc = [],
    bcc = [],
    attachments = [],
    idempotencyKey = null,
    reference = '',
    category = 'general',
    customerId = null,
    quoteId = null,
    invoiceId = null,
    enquiryId = null,
    agentTaskId = null,
    requireApproval = false,
    approvedBy = null,
    metadata = {}
  } = options;

  // 1. Validate Sender Identity against Server Allowlist
  if (agentId && !isValidSenderId(agentId)) {
    throw new Error(`SECURITY VIOLATION: Unauthorized agent sender identity "${agentId}". Must be an approved Lotus Tubes agent ID.`);
  }

  const sender = getSenderById(agentId);
  const formattedFrom = formatFromHeader(sender);

  // 2. Validate and Normalize Recipients
  const rawRecipients = Array.isArray(to) ? to : [to || config.resend.notificationEmail];
  const normalizedRecipients = rawRecipients
    .map((e) => (typeof e === 'string' ? e.toLowerCase().trim() : ''))
    .filter((e) => e && validateEmail(e));

  if (normalizedRecipients.length === 0) {
    throw new Error('Email dispatch failed: No valid recipient email address provided.');
  }

  // 3. Idempotency Check
  if (idempotencyKey) {
    try {
      const existing = await EmailLog.findOne({ idempotencyKey });
      if (existing) {
        if (['accepted', 'sent', 'delivered'].includes(existing.deliveryStatus)) {
          return {
            success: true,
            accepted: true,
            delivered: existing.deliveryStatus === 'delivered',
            duplicate: true,
            messageId: existing.resendMessageId,
            emailLogId: existing._id,
            status: existing.deliveryStatus
          };
        }
      }
    } catch (dbErr) {
      console.warn('Idempotency query warning:', dbErr.message);
    }
  }

  // 4. Create or Update MongoDB EmailLog Entry
  let emailLog;
  try {
    emailLog = await EmailLog.create({
      idempotencyKey: idempotencyKey || null,
      agentId: sender.id,
      agentName: sender.name,
      from: formattedFrom,
      to: normalizedRecipients,
      cc: Array.isArray(cc) ? cc : [],
      bcc: Array.isArray(bcc) ? bcc : [],
      replyTo: replyTo || BUSINESS_MAILBOX,
      subject: subject || 'Lotus Tubes Notification',
      bodyHtml: html || '',
      bodyText: text || '',
      reference: reference || '',
      category: category || options.category || 'general',
      customerId: customerId || null,
      quoteId: quoteId || null,
      invoiceId: invoiceId || null,
      enquiryId: enquiryId || null,
      agentTaskId: agentTaskId || null,
      attachments: attachments.map((a) => ({
        filename: a.filename || 'attachment.pdf',
        path: a.path || '',
        contentType: a.contentType || 'application/pdf',
        size: a.size || 0
      })),
      approvalStatus: requireApproval ? 'pending_approval' : approvedBy ? 'approved' : 'not_required',
      approvedBy: approvedBy?._id || approvedBy?.id || null,
      approvedAt: approvedBy ? new Date() : null,
      deliveryStatus: requireApproval ? 'pending_approval' : 'dispatching',
      statusEvents: [
        {
          status: requireApproval ? 'pending_approval' : 'dispatching',
          timestamp: new Date(),
          details: { initiatedBy: sender.id, targetCount: normalizedRecipients.length }
        }
      ],
      metadata
    });
  } catch (logErr) {
    console.error('Failed to create EmailLog record:', logErr.message);
  }

  // If approval is required and not yet granted, hold dispatch
  if (requireApproval && !approvedBy) {
    return {
      success: true,
      pendingApproval: true,
      emailLogId: emailLog?._id,
      message: 'Email drafted and queued for Super Admin approval before dispatch.'
    };
  }

  // 5. Demo Mode Fallback (when Resend API Key is not configured)
  if (!resendClient) {
    const demoId = `demo_resend_${Date.now()}`;
    console.log(`\n================== [LOTUS TUBES RESEND DISPATCH] ==================
From: ${formattedFrom}
To: ${normalizedRecipients.join(', ')}
Reply-To: ${replyTo || BUSINESS_MAILBOX}
Subject: ${subject}
Agent: ${sender.name} (${sender.role})
Ref: ${reference || 'N/A'}
Attachments: ${attachments.length} file(s)
Status: ACCEPTED (Simulated Demo Delivery)
===================================================================\n`);

    if (emailLog) {
      emailLog.resendMessageId = demoId;
      emailLog.deliveryStatus = 'accepted'; // Resend acceptance, not delivered
      emailLog.sentAt = new Date();
      emailLog.statusEvents.push({
        status: 'accepted',
        timestamp: new Date(),
        details: { provider: 'Resend Mock', demoMode: true }
      });
      await emailLog.save().catch((e) => console.warn('EmailLog update warning:', e.message));
    }

    return {
      success: true,
      accepted: true,
      delivered: false,
      demoMode: true,
      messageId: demoId,
      emailLogId: emailLog?._id
    };
  }

  // 6. Real Resend API v4 Dispatch
  try {
    const formattedAttachments = await resolveAttachments(attachments);

    const payload = {
      from: formattedFrom,
      to: normalizedRecipients,
      reply_to: replyTo || BUSINESS_MAILBOX,
      subject: subject || 'Lotus Tubes Notification',
      html: html || '',
      headers: {
        'X-Lotus-Agent': sender.id,
        'X-Entity-Ref': reference || 'LT-DISPATCH'
      }
    };

    if (text) payload.text = text;
    if (Array.isArray(cc) && cc.length > 0) payload.cc = cc;
    if (Array.isArray(bcc) && bcc.length > 0) payload.bcc = bcc;
    if (formattedAttachments.length > 0) payload.attachments = formattedAttachments;

    const { data, error } = await resendClient.emails.send(payload);

    if (error) {
      console.error('❌ Resend API Dispatch Error:', error.message);
      if (emailLog) {
        emailLog.deliveryStatus = 'failed';
        emailLog.error = error;
        emailLog.statusEvents.push({
          status: 'failed',
          timestamp: new Date(),
          details: { error: error.message }
        });
        await emailLog.save().catch(() => {});
      }
      return {
        success: false,
        accepted: false,
        delivered: false,
        error: error.message,
        emailLogId: emailLog?._id
      };
    }

    // Provider Acceptance - NOT verified delivery!
    const resendMessageId = data?.id;
    if (emailLog) {
      emailLog.resendMessageId = resendMessageId;
      emailLog.deliveryStatus = 'accepted';
      emailLog.sentAt = new Date();
      emailLog.statusEvents.push({
        status: 'accepted',
        timestamp: new Date(),
        details: { messageId: resendMessageId, provider: 'Resend' }
      });
      await emailLog.save().catch(() => {});
    }

    return {
      success: true,
      accepted: true,
      delivered: false, // strictly requires webhook event
      messageId: resendMessageId,
      emailLogId: emailLog?._id
    };
  } catch (err) {
    console.error('❌ Resend Client Exception:', err.message);
    if (emailLog) {
      emailLog.deliveryStatus = 'failed';
      emailLog.error = err.message;
      emailLog.statusEvents.push({
        status: 'failed',
        timestamp: new Date(),
        details: { exception: err.message }
      });
      await emailLog.save().catch(() => {});
    }
    return {
      success: false,
      accepted: false,
      delivered: false,
      error: err.message,
      emailLogId: emailLog?._id
    };
  }
};

/**
 * Dispatches a previously queued/pending email after Super Admin approval
 * @param {string} emailLogId 
 * @param {Object} superAdminUser 
 * @returns {Promise<Object>}
 */
export const dispatchPendingEmail = async (emailLogId, superAdminUser) => {
  if (!superAdminUser || superAdminUser.role !== 'admin') {
    throw new Error('FORBIDDEN: Only a Super Admin can approve and dispatch queued emails.');
  }

  const log = await EmailLog.findById(emailLogId);
  if (!log) {
    throw new Error('Email record not found');
  }

  if (log.deliveryStatus !== 'pending_approval' && log.deliveryStatus !== 'draft') {
    throw new Error(`Email is in status "${log.deliveryStatus}" and cannot be approved for dispatch.`);
  }

  log.approvalStatus = 'approved';
  log.approvedBy = superAdminUser._id || superAdminUser.id;
  log.approvedAt = new Date();
  log.approvalNotes = `Approved by Super Admin ${superAdminUser.name || superAdminUser.email}`;
  await log.save();

  // Re-run sendEmail with approvedBy passed
  return sendEmail({
    agentId: log.agentId,
    to: log.to,
    subject: log.subject,
    html: log.bodyHtml,
    text: log.bodyText,
    replyTo: log.replyTo,
    cc: log.cc,
    bcc: log.bcc,
    attachments: log.attachments,
    idempotencyKey: log.idempotencyKey,
    reference: log.reference,
    customerId: log.customerId,
    quoteId: log.quoteId,
    invoiceId: log.invoiceId,
    enquiryId: log.enquiryId,
    agentTaskId: log.agentTaskId,
    approvedBy: superAdminUser
  });
};

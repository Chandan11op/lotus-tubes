import crypto from 'crypto';
import { EmailLog } from '../models/EmailLog.js';
import { Quote } from '../models/Quote.js';
import { Invoice } from '../models/Invoice.js';
import { config } from '../config/env.js';

const WEBHOOK_TOLERANCE_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Verifies the Svix / Resend webhook signature
 * 
 * @param {Object} headers - Express request headers (svix-id, svix-timestamp, svix-signature)
 * @param {string|Buffer} rawBody - The unparsed request body string or buffer
 * @param {string} [secret] - The webhook signing secret (whsec_...)
 * @returns {boolean}
 */
export const verifyWebhookSignature = (headers = {}, rawBody, secret = config.resend.webhookSecret) => {
  if (!secret) {
    console.warn('⚠️ RESEND_WEBHOOK_SECRET is not configured. Webhook signature cannot be verified.');
    return false;
  }

  const msgId = headers['svix-id'] || headers['x-svix-id'];
  const msgTimestamp = headers['svix-timestamp'] || headers['x-svix-timestamp'];
  const msgSignature = headers['svix-signature'] || headers['x-svix-signature'];

  if (!msgId || !msgTimestamp || !msgSignature || !rawBody) {
    return false;
  }

  // Prevent replay attacks by checking timestamp
  const timestampNum = parseInt(msgTimestamp, 10);
  if (isNaN(timestampNum)) return false;

  const timestampMs = timestampNum * 1000;
  const now = Date.now();
  if (Math.abs(now - timestampMs) > WEBHOOK_TOLERANCE_MS) {
    console.warn('⚠️ Webhook timestamp outside 5-minute tolerance window.');
    return false;
  }

  // Parse signing secret (strip 'whsec_' if present, then base64 decode)
  let cleanSecret = secret.startsWith('whsec_') ? secret.slice(6) : secret;
  let secretBuffer;
  try {
    secretBuffer = Buffer.from(cleanSecret, 'base64');
  } catch (e) {
    secretBuffer = Buffer.from(cleanSecret, 'utf8');
  }

  const bodyString = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
  const toSign = `${msgId}.${msgTimestamp}.${bodyString}`;

  const expectedSignature = crypto
    .createHmac('sha256', secretBuffer)
    .update(toSign)
    .digest('base64');

  // svix-signature may contain multiple space-separated signatures (e.g. "v1,signature1 v1,signature2")
  const signatures = msgSignature.split(' ').map((sig) => {
    const parts = sig.split(',');
    return parts.length > 1 ? parts[1] : parts[0];
  });

  for (const sig of signatures) {
    try {
      const sigBuf = Buffer.from(sig);
      const expectedBuf = Buffer.from(expectedSignature);
      if (sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf)) {
        return true;
      }
    } catch {
      // Continue checking next signature candidate
    }
  }

  return false;
};

/**
 * Processes an individual Resend webhook event idempotently
 * 
 * @param {Object} event - Resend event payload
 * @returns {Promise<Object>}
 */
export const processWebhookEvent = async (event = {}) => {
  const { type, data, created_at } = event;
  const emailId = data?.email_id || data?.id;

  if (!emailId) {
    return { ignored: true, reason: 'Missing email_id in event payload' };
  }

  // Find corresponding EmailLog
  const emailLog = await EmailLog.findOne({ resendMessageId: emailId });
  if (!emailLog) {
    return { ignored: true, reason: `No EmailLog found for Resend messageId: ${emailId}` };
  }

  // Check if this exact event type is already logged to prevent duplicates
  const alreadyProcessed = emailLog.statusEvents.some(
    (ev) => ev.status === type && ev.details?.created_at === created_at
  );

  if (alreadyProcessed) {
    return { success: true, duplicate: true, emailLogId: emailLog._id };
  }

  // Update status based on event type
  let newDeliveryStatus = emailLog.deliveryStatus;
  const eventTime = created_at ? new Date(created_at) : new Date();

  switch (type) {
    case 'email.sent':
      if (emailLog.deliveryStatus !== 'delivered') {
        newDeliveryStatus = 'sent';
      }
      break;

    case 'email.delivered':
      newDeliveryStatus = 'delivered';
      emailLog.deliveredAt = eventTime;
      break;

    case 'email.delivery_delayed':
      newDeliveryStatus = 'delivery_delayed';
      break;

    case 'email.bounced':
      newDeliveryStatus = 'bounced';
      emailLog.bouncedAt = eventTime;
      break;

    case 'email.complained':
      newDeliveryStatus = 'complained';
      break;

    default:
      console.log(`ℹ️ Unhandled Resend event type: ${type}`);
      break;
  }

  emailLog.deliveryStatus = newDeliveryStatus;
  emailLog.statusEvents.push({
    status: type,
    timestamp: eventTime,
    details: data || {}
  });

  await emailLog.save();

  // Cascade status update to associated Quotation or Invoice if applicable
  if (emailLog.quoteId && (type === 'email.delivered' || type === 'email.bounced')) {
    try {
      const quote = await Quote.findById(emailLog.quoteId);
      if (quote) {
        quote.emailStatus = type === 'email.delivered' ? 'delivered' : 'bounced';
        quote.activityLog.push({
          action: type === 'email.delivered' ? 'Email Delivered' : 'Email Bounced',
          performedBy: `Resend Webhook (${emailLog.agentName || 'Agent'})`,
          note: `Verified delivery webhook received for ${quote.quotationNumber} via Resend (${emailId})`
        });
        await quote.save();
      }
    } catch (quoteErr) {
      console.warn('Failed to update quote delivery status:', quoteErr.message);
    }
  }

  if (emailLog.invoiceId && (type === 'email.delivered' || type === 'email.bounced')) {
    try {
      const invoice = await Invoice.findById(emailLog.invoiceId);
      if (invoice) {
        if (type === 'email.delivered') {
          invoice.deliveryRecords.emailDelivered = true;
          invoice.deliveryRecords.emailDeliveredAt = eventTime;
        } else {
          invoice.deliveryRecords.emailBounced = true;
        }
        await invoice.save();
      }
    } catch (invErr) {
      console.warn('Failed to update invoice delivery status:', invErr.message);
    }
  }

  return {
    success: true,
    emailLogId: emailLog._id,
    resendMessageId: emailId,
    newStatus: newDeliveryStatus
  };
};

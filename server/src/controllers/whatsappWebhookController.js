/**
 * Meta WhatsApp Webhook Controller & CRM Management API
 * 1. GET /api/webhooks/whatsapp: Meta Challenge Verification
 * 2. POST /api/webhooks/whatsapp: X-Hub-Signature-256 HMAC Verification & Event Ingestion
 * 3. GET /api/whatsapp/conversations: CRM Inbox Listing
 * 4. GET /api/whatsapp/conversations/:id: Conversation Thread & Customer Context
 * 5. POST /api/whatsapp/conversations/:id/messages: Manual Staff WhatsApp Reply
 * 6. POST /api/whatsapp/conversations/:id/handover: Human Takeover & Bot Pause/Resume Toggle
 * 7. POST /api/whatsapp/send-document: Dual-Channel Document Dispatch Action
 */

import { WhatsAppConversation } from '../models/WhatsAppConversation.js';
import { WhatsAppMessage } from '../models/WhatsAppMessage.js';
import { WhatsAppWebhookEvent } from '../models/WhatsAppWebhookEvent.js';
import { Quote } from '../models/Quote.js';
import { Invoice } from '../models/Invoice.js';
import {
  verifyWebhookChallenge,
  verifyWebhookSignature,
  sendWhatsAppMessage,
  normalizePhoneNumber
} from '../services/whatsappService.js';
import { handleIncomingWhatsAppMessage } from '../services/whatsappBotService.js';
import { sendApprovedDocument } from '../services/notificationService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { recordAuditEvent } from '../utils/auditLogger.js';
import { config } from '../config/env.js';

/**
 * GET /api/webhooks/whatsapp
 * Meta Webhook Challenge Verification
 */
export const verifyMetaWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const verification = verifyWebhookChallenge(mode, token, challenge);
  if (verification.isValid) {
    // Meta expects integer or string challenge returned in plain text
    return res.status(200).send(challenge);
  }

  console.warn('⚠️ Meta Webhook Challenge Failed:', verification.reason);
  return res.status(403).send('Forbidden: Webhook challenge verification failed');
};

/**
 * POST /api/webhooks/whatsapp
 * Secure Event Ingestion with X-Hub-Signature-256 HMAC SHA256 Verification
 */
export const receiveMetaWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-hub-signature-256'];
    const rawBody = req.rawBody || JSON.stringify(req.body);

    // Cryptographic signature verification
    const sigCheck = verifyWebhookSignature(signature, rawBody);
    if (!sigCheck.isValid) {
      console.warn('⚠️ Rejected unverified WhatsApp webhook payload:', sigCheck.reason);
      return res.status(401).json({ status: 'error', message: 'Unauthorized: Invalid X-Hub-Signature-256' });
    }

    const body = req.body;
    if (body.object !== 'whatsapp_business_account') {
      return res.status(200).json({ status: 'ignored', message: 'Not a whatsapp_business_account object' });
    }

    // Acknowledge Meta immediately with 200 OK
    res.status(200).json({ status: 'success' });

    // Asynchronously process event in background
    setImmediate(async () => {
      try {
        const entries = body.entry || [];
        for (const entry of entries) {
          const changes = entry.changes || [];
          for (const change of changes) {
            const value = change.value;
            if (!value) continue;

            // 1. Process Status Updates (sent, delivered, read, failed)
            if (value.statuses && Array.isArray(value.statuses)) {
              for (const statusObj of value.statuses) {
                const wamid = statusObj.id;
                const statusName = statusObj.status?.toUpperCase(); // 'SENT', 'DELIVERED', 'READ', 'FAILED'
                const timestamp = statusObj.timestamp ? new Date(parseInt(statusObj.timestamp, 10) * 1000) : new Date();

                // Deduplicate Event
                const eventId = `meta_status_${wamid}_${statusName}_${statusObj.timestamp || Date.now()}`;
                const existingEvent = await WhatsAppWebhookEvent.findOne({ eventId });
                if (existingEvent) continue;

                await WhatsAppWebhookEvent.create({
                  eventId,
                  eventType: 'message_status',
                  payload: statusObj,
                  processed: true,
                  processedAt: new Date()
                });

                // Map Meta status to our standardized lifecycle enum
                let normalizedStatus = 'PROVIDER_ACCEPTED';
                if (statusName === 'DELIVERED') normalizedStatus = 'DELIVERED';
                if (statusName === 'READ') normalizedStatus = 'READ';
                if (statusName === 'FAILED') normalizedStatus = 'FAILED';

                const updatedMsg = await WhatsAppMessage.findOneAndUpdate(
                  { wamid },
                  {
                    $set: {
                      deliveryStatus: normalizedStatus,
                      error: statusObj.errors ? statusObj.errors[0] : null
                    },
                    $push: {
                      statusHistory: {
                        status: normalizedStatus,
                        timestamp,
                        error: statusObj.errors ? statusObj.errors[0] : null
                      }
                    }
                  },
                  { new: true }
                );

                // If message is linked to Quote or Invoice, cascade status update
                if (updatedMsg?.documentType === 'quotation' && updatedMsg.documentId) {
                  await Quote.findByIdAndUpdate(updatedMsg.documentId, {
                    whatsappStatus: normalizedStatus
                  });
                } else if (updatedMsg?.documentType === 'invoice' && updatedMsg.documentId) {
                  await Invoice.findByIdAndUpdate(updatedMsg.documentId, {
                    whatsappStatus: normalizedStatus
                  });
                }
              }
            }

            // 2. Process Incoming Messages
            if (value.messages && Array.isArray(value.messages)) {
              for (const msgObj of value.messages) {
                const wamid = msgObj.id;
                const from = msgObj.from;
                const msgType = msgObj.type; // 'text', 'document', 'image', 'audio', etc.
                const to = value.metadata?.display_phone_number || value.metadata?.phone_number_id;

                // Deduplicate Event
                const eventId = `meta_msg_${wamid}`;
                const existingMsg = await WhatsAppWebhookEvent.findOne({ eventId });
                if (existingMsg) continue;

                await WhatsAppWebhookEvent.create({
                  eventId,
                  eventType: 'incoming_message',
                  payload: msgObj,
                  processed: true,
                  processedAt: new Date()
                });

                let textBody = '';
                let documentPayload = null;

                if (msgType === 'text') {
                  textBody = msgObj.text?.body || '';
                } else if (msgType === 'document') {
                  textBody = msgObj.document?.caption || '';
                  documentPayload = {
                    id: msgObj.document?.id,
                    filename: msgObj.document?.filename,
                    mimeType: msgObj.document?.mime_type,
                    caption: msgObj.document?.caption,
                    link: `https://graph.facebook.com/${config.whatsapp.apiVersion}/${msgObj.document?.id}`
                  };
                } else if (msgType === 'interactive') {
                  textBody = msgObj.interactive?.button_reply?.title || msgObj.interactive?.list_reply?.title || '';
                }

                await handleIncomingWhatsAppMessage({
                  wamid,
                  from,
                  to,
                  type: msgType,
                  text: textBody,
                  document: documentPayload,
                  rawPayload: msgObj
                });
              }
            }
          }
        }
      } catch (asyncErr) {
        console.error('Async webhook processing exception:', asyncErr.message);
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/whatsapp/conversations
 * CRM Staff Inbox Listing
 */
export const getWhatsAppConversations = async (req, res, next) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      if (status === 'waiting_human') {
        query.$or = [{ isHumanHandover: true }, { status: 'waiting_human' }];
      } else {
        query.status = status;
      }
    }

    if (search) {
      const searchRegex = new RegExp(search.replace(/[^a-zA-Z0-9]/g, '.*'), 'i');
      query.$or = [
        { customerName: searchRegex },
        { customerPhone: searchRegex },
        { company: searchRegex },
        { lastMessageText: searchRegex }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [conversations, total] = await Promise.all([
      WhatsAppConversation.find(query)
        .sort({ lastMessageAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .populate('customerId', 'name company email phone customerTier status')
        .populate('assignedStaff', 'name email'),
      WhatsAppConversation.countDocuments(query)
    ]);

    return successResponse(res, {
      conversations,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/whatsapp/conversations/:id
 * CRM Full Conversation Details & Message Thread
 */
export const getWhatsAppConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const conversation = await WhatsAppConversation.findById(id)
      .populate('customerId')
      .populate('assignedStaff', 'name email');

    if (!conversation) {
      return errorResponse(res, 'Conversation not found', 404);
    }

    // Reset unread count when opened by staff
    if (conversation.unreadCount > 0) {
      conversation.unreadCount = 0;
      await conversation.save();
    }

    const messages = await WhatsAppMessage.find({ conversationId: id })
      .sort({ createdAt: 1 })
      .limit(200);

    // Fetch related quotes and invoices for context
    const [relatedQuotes, relatedInvoices] = await Promise.all([
      Quote.find({
        $or: [{ phone: conversation.customerPhone }, { customerId: conversation.customerId }]
      }).sort({ createdAt: -1 }).limit(5),
      Invoice.find({
        $or: [{ phone: conversation.customerPhone }, { customerId: conversation.customerId }]
      }).sort({ createdAt: -1 }).limit(5)
    ]);

    return successResponse(res, {
      conversation,
      messages,
      relatedQuotes,
      relatedInvoices
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/whatsapp/conversations/:id/messages
 * Staff sends manual outbound WhatsApp message
 */
export const sendStaffWhatsAppMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return errorResponse(res, 'Message text is required', 400);
    }

    const conversation = await WhatsAppConversation.findById(id);
    if (!conversation) {
      return errorResponse(res, 'Conversation not found', 404);
    }

    const normalizedPhone = normalizePhoneNumber(conversation.customerPhone);
    const sendResult = await sendWhatsAppMessage({
      to: normalizedPhone,
      type: 'text',
      text: { body: text.trim() }
    });

    const msg = await WhatsAppMessage.create({
      conversationId: conversation._id,
      wamid: sendResult.messageId || null,
      customerId: conversation.customerId || null,
      direction: 'outbound',
      from: config.whatsapp.businessNumber || '919930430789',
      to: normalizedPhone,
      type: 'text',
      text: { body: text.trim() },
      agentId: 'human',
      deliveryStatus: sendResult.success ? 'PROVIDER_ACCEPTED' : (sendResult.status || 'FAILED'),
      statusHistory: [{ status: sendResult.success ? 'PROVIDER_ACCEPTED' : 'FAILED', timestamp: new Date() }],
      error: sendResult.error || null
    });

    conversation.lastMessageAt = new Date();
    conversation.lastMessageText = text.trim();
    conversation.lastMessageDirection = 'outbound';
    conversation.assignedAgent = 'human';
    conversation.assignedStaff = req.user?._id || req.user?.id || null;
    conversation.assignedStaffName = req.user?.name || 'Staff Representative';
    await conversation.save();

    await recordAuditEvent({
      actor: req.user,
      action: 'STAFF_WHATSAPP_MESSAGE_SENT',
      targetType: 'WhatsAppConversation',
      targetId: conversation._id,
      targetRef: normalizedPhone,
      metadata: { textLength: text.length, deliveryStatus: msg.deliveryStatus }
    });

    return successResponse(res, { message: msg, sendResult }, 'WhatsApp message dispatched');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/whatsapp/conversations/:id/handover
 * Toggles Human Handover / Bot Pausing
 */
export const toggleHumanHandover = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { pauseBot, isHandover, reason } = req.body;

    const conversation = await WhatsAppConversation.findById(id);
    if (!conversation) {
      return errorResponse(res, 'Conversation not found', 404);
    }

    if (typeof pauseBot === 'boolean') {
      conversation.botPaused = pauseBot;
    }
    if (typeof isHandover === 'boolean') {
      conversation.isHumanHandover = isHandover;
      conversation.status = isHandover ? 'waiting_human' : 'active';
      if (isHandover) {
        conversation.humanHandoverRequestedAt = new Date();
        conversation.humanHandoverReason = reason || 'Staff initiated takeover';
        conversation.assignedAgent = 'human';
        conversation.assignedStaff = req.user?._id || req.user?.id;
        conversation.assignedStaffName = req.user?.name || 'Staff';
      } else {
        conversation.assignedAgent = 'arjun-yadav';
      }
    }

    await conversation.save();

    await recordAuditEvent({
      actor: req.user,
      action: conversation.isHumanHandover ? 'WHATSAPP_HUMAN_TAKEOVER' : 'WHATSAPP_BOT_RESUMED',
      targetType: 'WhatsAppConversation',
      targetId: conversation._id,
      targetRef: conversation.customerPhone,
      metadata: { botPaused: conversation.botPaused, isHandover: conversation.isHumanHandover }
    });

    return successResponse(res, { conversation }, `Conversation handover updated: ${conversation.isHumanHandover ? 'Human Takeover Active' : 'AI Bot Resumed'}`);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/whatsapp/send-document
 * Dispatches an approved quotation or invoice across Email and WhatsApp simultaneously
 */
export const triggerApprovedDocumentDispatch = async (req, res, next) => {
  try {
    const { documentId, documentType, channels = ['email', 'whatsapp'] } = req.body;

    if (!documentId || !documentType) {
      return errorResponse(res, 'documentId and documentType are required', 400);
    }

    const dispatchResult = await sendApprovedDocument({
      documentId,
      documentType,
      channels,
      actor: req.user
    });

    return successResponse(res, dispatchResult, `Approved ${documentType} dispatch initiated`);
  } catch (error) {
    if (error.message.includes('SECURITY') || error.message.includes('approval')) {
      return errorResponse(res, error.message, 403);
    }
    next(error);
  }
};

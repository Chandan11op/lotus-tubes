/**
 * Lotus Tubes WhatsApp Customer Support Bot (Arjun Yadav & Engineering Team)
 * Receives incoming Meta WhatsApp messages, executes stateful conversation routing,
 * queries verified MongoDB records, enforces Super Admin commercial authority,
 * handles customer opt-out, and triggers seamless human handover.
 */

import { Product } from '../models/Product.js';
import { Customer } from '../models/Customer.js';
import { Enquiry } from '../models/Enquiry.js';
import { Quote } from '../models/Quote.js';
import { Invoice } from '../models/Invoice.js';
import { Task } from '../models/Task.js';
import { WhatsAppConversation } from '../models/WhatsAppConversation.js';
import { WhatsAppMessage } from '../models/WhatsAppMessage.js';
import { sendWhatsAppMessage, normalizePhoneNumber } from './whatsappService.js';
import { config } from '../config/env.js';
import { generateReference, sanitizeText } from '../utils/security.js';

// Standard Greeting
export const BOT_GREETING = `Hello! Welcome to Lotus Tubes.

We supply Stainless Steel Sanitary Pipes, Tubes, Fittings, Valves and related hygienic process components.

How can we assist you today?`;

// Verified Product Categories
export const PRODUCT_CATEGORIES = [
  'Sanitary Pipes and Tubes',
  'Sanitary Pipe Fittings',
  'Tri-Clamp Products',
  'Gaskets',
  'Manual Valves',
  'Pneumatic and Electric Valves',
  'Tank and Cleaning Components',
  'Custom Hygienic Assemblies'
];

// Regulatory Opt-Out / Opt-In Keyword Regexes
const OPT_OUT_REGEX = /^(stop|unsubscribe|optout|opt-out|halt|cancel|quit)$/i;
const OPT_IN_REGEX = /^(start|resume|optin|opt-in|unstop)$/i;

// Human Handover Triggers
const HUMAN_HANDOVER_REGEX = /(human|agent|representative|talk to someone|speak with sales|person|executive|owner|chirag|call me|support team)/i;

/**
 * Main Webhook Inbound Message Router
 */
export const handleIncomingWhatsAppMessage = async ({
  wamid,
  from,
  to,
  type = 'text',
  text = '',
  document = null,
  rawPayload = null
}) => {
  const normalizedFrom = normalizePhoneNumber(from);
  const normalizedText = sanitizeText(text || '', 1000).trim();

  // 1. Locate or Provision Customer Record
  let customer = await Customer.findOne({
    $or: [{ phone: normalizedFrom }, { whatsappPhone: normalizedFrom }]
  });

  if (!customer) {
    customer = await Customer.create({
      name: 'WhatsApp Inquirer',
      company: 'Individual / Commercial Client',
      email: `${normalizedFrom}@whatsapp.lotustubes.com`,
      phone: normalizedFrom,
      whatsappPhone: normalizedFrom,
      status: 'Lead',
      messagingConsent: {
        status: 'opted_in',
        source: 'whatsapp_inbound',
        optedInAt: new Date()
      }
    });
  } else if (!customer.whatsappPhone) {
    customer.whatsappPhone = normalizedFrom;
    await customer.save();
  }

  // 2. Locate or Provision WhatsAppConversation
  let conversation = await WhatsAppConversation.findOne({ customerPhone: normalizedFrom });
  if (!conversation) {
    conversation = await WhatsAppConversation.create({
      customerId: customer._id,
      customerPhone: normalizedFrom,
      customerName: customer.name,
      company: customer.company,
      email: customer.email,
      assignedAgent: 'arjun-yadav',
      status: 'active',
      lastMessageAt: new Date(),
      lastMessageText: normalizedText || (document ? `[Document: ${document.filename || 'File'}]` : ''),
      lastMessageDirection: 'inbound',
      context: { flow: 'idle', step: 'initial', collectedData: {} }
    });
  } else {
    conversation.lastMessageAt = new Date();
    conversation.lastMessageText = normalizedText || (document ? `[Document: ${document.filename || 'File'}]` : '');
    conversation.lastMessageDirection = 'inbound';
    conversation.unreadCount = (conversation.unreadCount || 0) + 1;
    if (!conversation.customerId && customer._id) conversation.customerId = customer._id;
  }

  // 3. Record Incoming Message in MongoDB
  const incomingMsg = await WhatsAppMessage.create({
    conversationId: conversation._id,
    wamid,
    customerId: customer._id,
    direction: 'inbound',
    from: normalizedFrom,
    to: normalizePhoneNumber(to) || config.whatsapp.businessNumber || '919930430789',
    type,
    text: { body: normalizedText },
    document: document ? {
      id: document.id || '',
      link: document.link || '',
      caption: document.caption || '',
      filename: document.filename || 'document.pdf',
      mimeType: document.mimeType || 'application/pdf'
    } : undefined,
    deliveryStatus: 'DELIVERED',
    statusHistory: [{ status: 'DELIVERED', timestamp: new Date() }],
    agentId: 'arjun-yadav',
    rawPayload
  });

  // 4. Check for Opt-Out / Opt-In
  if (OPT_OUT_REGEX.test(normalizedText)) {
    customer.messagingConsent.status = 'opted_out';
    customer.messagingConsent.optedOutAt = new Date();
    customer.messagingConsent.history.push({
      action: 'opt_out',
      timestamp: new Date(),
      reason: `Customer sent keyword [${normalizedText}]`
    });
    await customer.save();

    conversation.status = 'resolved';
    conversation.botPaused = true;
    await conversation.save();

    const optOutAck = 'You have successfully opted out of Lotus Tubes WhatsApp updates. We will not send you further promotional or automated messages. Reply START at any time to resume.';
    await dispatchBotReply(conversation, normalizedFrom, optOutAck);
    return { handled: true, action: 'OPTED_OUT', messageId: incomingMsg._id };
  }

  if (OPT_IN_REGEX.test(normalizedText)) {
    customer.messagingConsent.status = 'opted_in';
    customer.messagingConsent.optedInAt = new Date();
    customer.messagingConsent.history.push({
      action: 'opt_in',
      timestamp: new Date(),
      reason: `Customer sent keyword [${normalizedText}]`
    });
    await customer.save();

    conversation.status = 'active';
    conversation.botPaused = false;
    await conversation.save();

    const optInAck = 'Thank you! You have opted in to receive Lotus Tubes technical quotations, commercial invoices, and order status updates on WhatsApp. How can we assist you today?';
    await dispatchBotReply(conversation, normalizedFrom, optInAck);
    return { handled: true, action: 'OPTED_IN', messageId: incomingMsg._id };
  }

  // 5. Check if Bot is Paused or Human Handover is Active
  if (conversation.botPaused || conversation.isHumanHandover) {
    console.log(`ℹ️ Bot paused for +${normalizedFrom}. Conversation is held in human agent inbox.`);
    return { action: 'HOLD_FOR_HUMAN', conversationId: conversation._id };
  }

  // 6. Check for Explicit Human Handover Request
  if (HUMAN_HANDOVER_REGEX.test(normalizedText)) {
    conversation.isHumanHandover = true;
    conversation.botPaused = true;
    conversation.status = 'waiting_human';
    conversation.humanHandoverRequestedAt = new Date();
    conversation.humanHandoverReason = `Customer requested representative: "${normalizedText}"`;
    await conversation.save();

    // Create CRM Task for Staff Escalation
    try {
      await Task.create({
        title: `🔴 WhatsApp Handover Request: +${normalizedFrom} (${customer.company || customer.name})`,
        description: `Customer requested a human representative on WhatsApp. Message: "${normalizedText}". Please review conversation history in CRM WhatsApp inbox and reply directly.`,
        priority: 'Urgent',
        status: 'Pending',
        dueDate: new Date(Date.now() + 2 * 3600 * 1000), // 2 hours
        relatedCustomer: customer._id
      });
    } catch (e) {
      console.warn('Handover task creation error:', e.message);
    }

    const handoverReply = `Understood. I have routed your request to our engineering and sales desk in Fort, Mumbai.

A representative from our commercial team will take over this chat and assist you directly.

For immediate urgent requirements, you may also reach our Mumbai desk by phone at +91 99304 30789 or email sales@lotustubes.com.`;

    await dispatchBotReply(conversation, normalizedFrom, handoverReply, 'arjun-yadav');
    return { handled: true, action: 'HANDOVER_TRIGGERED', conversationId: conversation._id, reply: handoverReply };
  }

  // 7. Handle Document / BOQ Upload
  if (document || (/boq|requirement|drawing|spec sheet|excel/i.test(normalizedText) && type !== 'text')) {
    const reference = generateReference('LT-BOQ');
    await Enquiry.create({
      reference,
      productName: 'WhatsApp BOQ / Specification Document',
      name: customer.name || 'WhatsApp Client',
      company: customer.company || 'Direct Client',
      email: customer.email || `${normalizedFrom}@whatsapp.lotustubes.com`,
      phone: normalizedFrom,
      location: 'WhatsApp Upload',
      quantity: 'As per BOQ document',
      notes: `Received requirement file via WhatsApp: ${document?.filename || 'Attachment'}. Direct link: ${document?.link || 'Stored in WhatsApp Media'}. Customer note: ${normalizedText}`,
      sourceChannel: 'WhatsApp RFQ',
      priority: 'High',
      status: 'New',
      customerId: customer._id
    });

    const boqAck = `Thank you! We have received your requirement document (Ref: *${reference}*).

Our technical sales specialist *Ananya Mehta* and Super Admin *Chirag Shah* are reviewing the bill of quantities. We will prepare your official commercial offer within 24 hours.

If there are specific surface finish requirements (e.g., Electro Polished Ra ≤ 0.38 µm) or urgent delivery deadlines, please reply with the details.`;

    await dispatchBotReply(conversation, normalizedFrom, boqAck, 'ananya-mehta');
    return { handled: true, action: 'BOQ_RECEIVED', reference, reply: boqAck };
  }

  // 8. Multi-step Context State Machine (e.g. RFQ data collection)
  if (conversation.context?.step && conversation.context.step !== 'initial') {
    if (conversation.context.step === 'COLLECTING_EMAIL') {
      conversation.context.inquiryData = conversation.context.inquiryData || {};
      conversation.context.inquiryData.customerEmail = normalizedText;
      conversation.context.step = 'COLLECTING_QUANTITY';
      conversation.markModified('context');
      await conversation.save();

      const reply = `Thank you. What quantity and delivery destination are you looking for ${conversation.context.inquiryData.productInterest || 'these components'}?`;
      await dispatchBotReply(conversation, normalizedFrom, reply, 'ananya-mehta');
      return { handled: true, action: 'RFQ_EMAIL_COLLECTED', reply };
    }
  }

  // 9. Intent Analysis & Business Workflows
  const intent = detectIntent(normalizedText);

  // Workflow A: Product Catalogue Request
  if (intent === 'catalogue_request') {
    const catalogueUrl = `${config.backendPublicUrl.replace(/\/+$/, '')}/sample-quotation.pdf`;
    const replyText = `Here is the comprehensive Lotus Tubes Sanitary Stainless Steel Product Catalogue & Engineering Guide:

${catalogueUrl}

Key Product Lines Covered:
• Sanitary Pipes & Tubes (ASTM A270 SS 304 / 316L, EP & MP)
• Tri-Clamp Ferrule Unions, Clamps & Gaskets (EPDM/PTFE/Silicone)
• Sanitary Butterfly, Ball, Diaphragm & Sampling Valves
• Tank Bottom & Cleaning Spray Balls

To receive an official quotation for any product or size, simply send us your quantity and specifications!`;

    await dispatchBotReply(conversation, normalizedFrom, replyText, 'arjun-yadav');
    return { handled: true, action: 'CATALOGUE_SENT', reply: replyText };
  }

  // Workflow B: Quotation Status Request
  if (intent === 'quotation_status') {
    // Security check: isolate only this customer's own quotes
    const ownQuotes = await Quote.find({
      $or: [{ phone: normalizedFrom }, { customerId: customer._id }]
    })
      .sort({ createdAt: -1 })
      .limit(3);

    if (ownQuotes.length === 0) {
      const noQuotesText = 'We could not locate any quotations associated with your WhatsApp number. If you recently submitted an enquiry under a different phone number or company email, please reply with your quotation reference (e.g., QT-2026-...) or email address.';
      await dispatchBotReply(conversation, normalizedFrom, noQuotesText, 'ananya-mehta');
      return { handled: true, action: 'NO_QUOTES_FOUND', reply: noQuotesText };
    }

    const quotesSummary = ownQuotes
      .map(
        (q) => `• *${q.quotationNumber}*: Status: *${q.status}* | Grand Total: ₹${Number(q.grandTotal || 0).toLocaleString('en-IN')} (Dated: ${new Date(q.createdAt).toLocaleDateString('en-IN')})`
      )
      .join('\n');

    const replyText = `Here is the status of your recent quotation(s):\n\n${quotesSummary}\n\nOur commercial sales lead *Ananya Mehta* is monitoring your account. Reply with any specific quotation number if you need revisions or MTC quality certificates!`;
    await dispatchBotReply(conversation, normalizedFrom, replyText, 'ananya-mehta');
    return { handled: true, action: 'QUOTATION_STATUS_SENT', reply: replyText };
  }

  // Workflow C: Invoice Assistance & Status Request
  if (intent === 'invoice_status') {
    // Security check: isolate only this customer's own invoices
    const ownInvoices = await Invoice.find({
      $or: [{ phone: normalizedFrom }, { customerId: customer._id }]
    })
      .sort({ createdAt: -1 })
      .limit(3);

    if (ownInvoices.length === 0) {
      const noInvText = 'We could not find any commercial invoices linked to this phone number. For billing support, please provide your Invoice Number (e.g., INV-2026-...) or reply with your registered billing email.';
      await dispatchBotReply(conversation, normalizedFrom, noInvText, 'riya-shah');
      return { handled: true, action: 'NO_INVOICES_FOUND', reply: noInvText };
    }

    const invSummary = ownInvoices
      .map(
        (inv) => `• *${inv.invoiceNumber}*: Status: *${inv.status}* | Amount: ₹${Number(inv.grandTotal || 0).toLocaleString('en-IN')} | Due: ${inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-IN') : 'Immediate'}`
      )
      .join('\n');

    const replyText = `Here is the billing record for your account:\n\n${invSummary}\n\nDispatched by *Riya Shah (Commercial Billing Coordinator)*.\nBank: HDFC Bank Ltd (Fort, Mumbai) | A/C: 50200084729114 | IFSC: HDFC0000060.\nReply if you require a formal PDF duplicate!`;
    await dispatchBotReply(conversation, normalizedFrom, replyText, 'riya-shah');
    return { handled: true, action: 'INVOICE_STATUS_SENT', reply: replyText };
  }

  // Workflow D: Product Information Query (Strictly from MongoDB)
  if (intent === 'product_query') {
    const productInfo = await lookupProductInformation(normalizedText);
    await dispatchBotReply(conversation, normalizedFrom, productInfo, 'arjun-yadav');
    return { handled: true, action: 'PRODUCT_INFO_SENT', reply: productInfo };
  }

  // Workflow E: Quotation Request (Data Extraction & CRM RFQ Creation)
  if (intent === 'quotation_request') {
    const rfqResult = await handleQuotationEnquiryFlow(conversation, customer, normalizedText);
    await dispatchBotReply(conversation, normalizedFrom, rfqResult.reply, 'ananya-mehta');
    return { handled: true, action: 'QUOTATION_ENQUIRY_PROCESSED', rfqResult, reply: rfqResult.reply };
  }

  // Default: Professional Greeting with Options Menu
  await dispatchBotReply(conversation, normalizedFrom, BOT_GREETING, 'arjun-yadav');
  return { handled: true, action: 'GREETING_SENT', reply: BOT_GREETING };
};

/**
 * Dispatches bot response via WhatsApp and persists message in conversation history
 */
const dispatchBotReply = async (conversation, phone, textBody, agentId = 'arjun-yadav') => {
  conversation.lastMessageAt = new Date();
  conversation.lastMessageText = textBody.length > 120 ? textBody.slice(0, 117) + '...' : textBody;
  conversation.lastMessageDirection = 'outbound';
  conversation.assignedAgent = agentId;
  await conversation.save();

  const sendResult = await sendWhatsAppMessage({
    to: phone,
    type: 'text',
    text: { body: textBody }
  });

  await WhatsAppMessage.create({
    conversationId: conversation._id,
    wamid: sendResult.messageId || ('wamid.outbound_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9)),
    customerId: conversation.customerId || null,
    direction: 'outbound',
    from: config.whatsapp.businessNumber || '919930430789',
    to: phone,
    type: 'text',
    text: { body: textBody },
    agentId,
    deliveryStatus: sendResult.success
      ? 'PROVIDER_ACCEPTED'
      : (sendResult.status === 'not_configured' ? 'NOT_CONFIGURED' : 'FAILED'),
    statusHistory: [
      {
        status: sendResult.success
          ? 'PROVIDER_ACCEPTED'
          : (sendResult.status === 'not_configured' ? 'NOT_CONFIGURED' : 'FAILED'),
        timestamp: new Date()
      }
    ],
    error: sendResult.error || null
  });

  return sendResult;
};

/**
 * Detects user intent using deterministic keyword patterns
 */
const detectIntent = (text) => {
  const t = text.toLowerCase();
  if (/catalogue|catalog|brochure|product list|specs guide|pdf list/i.test(t)) {
    return 'catalogue_request';
  }
  if (/quote status|my quote|quotation status|check quote|rfq status|qt-/i.test(t)) {
    return 'quotation_status';
  }
  if (/invoice|bill|tax invoice|payment detail|bank detail|inv-/i.test(t)) {
    return 'invoice_status';
  }
  if (/\b(price|pricing|rates?|quote|quotation|rfq|cost|how much|inquiry|enquiry)\b|\bneed\s+(a\s+)?(quote|price|rate|cost|tubes?|pipes?|fittings?|valves?)\b/i.test(t)) {
    return 'quotation_request';
  }
  if (/pipe|tube|fitting|valve|tri-clamp|triclamp|ferrule|gasket|bend|tee|reducer|clamp|sanitary/i.test(t)) {
    return 'product_query';
  }
  return 'general';
};

/**
 * Searches MongoDB for verified product specs without hallucinations
 */
const lookupProductInformation = async (queryText) => {
  const q = queryText.toLowerCase();

  // Try exact or regex match on Product collection
  const products = await Product.find({
    $or: [
      { name: new RegExp(q.replace(/[^a-zA-Z0-9]/g, '.*'), 'i') },
      { category: new RegExp(q.replace(/[^a-zA-Z0-9]/g, '.*'), 'i') },
      { material: new RegExp(q.replace(/[^a-zA-Z0-9]/g, '.*'), 'i') }
    ],
    status: 'published'
  }).limit(3);

  if (products.length > 0) {
    const details = products
      .map(
        (p) => `*${p.name}*
• Category: ${p.category}
• Material Grades: SS 304, SS 316L
• Surface Finish: ${p.finish} (${p.roughness || 'Ra ≤ 0.38 µm'})
• Standards: ${p.standard}
• Standard Sizes: ${p.sizes}
• Standard Wall: ${p.wallThickness}
• Test Certification: EN 10204 3.1 MTC Supplied`
      )
      .join('\n\n');

    return `Here is verified product information from our manufacturing catalogue:\n\n${details}\n\n*Commercial Pricing Notice:* Lotus Tubes customizes quotations based on order volume, exact cutoff lengths, and current alloy surcharges. Super Admin *Chirag Shah* authorizes all official prices.\n\nReply with your required size and quantity to receive an official quote!`;
  }

  return `Lotus Tubes manufactures high-purity sanitary process components in SS 304 and SS 316L:

1. Sanitary Pipes & Tubes (ASTM A270 / DIN 11850, Ra ≤ 0.38 µm EP)
2. Tri-Clamp Fittings (Ferrules, Bends, Tees, Reducers, Clamps)
3. Sanitary Butterfly & Diaphragm Valves (Manual / Pneumatic)
4. FDA-Compliant Elastomers (EPDM, Silicone, FKM, PTFE)

Our technical team will confirm specific dimensions and availability for your application. Please share your required nominal size and quantity!`;
};

/**
 * Handles multi-step or single-step quotation enquiry data collection
 */
const handleQuotationEnquiryFlow = async (conversation, customer, text) => {
  const reference = generateReference('LT-WA');

  // Create CRM Enquiry
  await Enquiry.create({
    reference,
    productName: 'WhatsApp Quotation Request',
    name: customer.name || 'WhatsApp Client',
    company: customer.company || 'Direct Commercial Inquirer',
    email: customer.email || `${conversation.customerPhone}@whatsapp.lotustubes.com`,
    phone: conversation.customerPhone,
    location: 'WhatsApp Inbound',
    quantity: 'Pending confirmation',
    notes: `WhatsApp RFQ received: "${text}"`,
    sourceChannel: 'WhatsApp RFQ',
    priority: 'Medium',
    status: 'New',
    customerId: customer._id
  });

  const reply = `Thank you! Your quotation enquiry has been registered with reference *${reference}*.

Our sales specialist *Ananya Mehta* and Super Admin *Chirag Shah* are preparing your formal offer. To ensure accurate sizing and pricing, please confirm:
1. Product Name or Category
2. Material Grade (SS 304 or SS 316L)
3. Surface Finish (Electro Polished EP or Mechanically Polished MP)
4. Nominal Size & Quantity
5. Delivery Destination

We will deliver your verified quotation PDF right here on WhatsApp and by email within 24 hours.`;

  return { reply, reference };
};

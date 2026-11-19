/**
 * Meta WhatsApp Cloud API Service for Lotus Tubes
 * Handles:
 * 1. Webhook Challenge Verification (GET)
 * 2. X-Hub-Signature-256 HMAC-SHA256 Payload Signature Verification (POST)
 * 3. Text & Interactive Message Dispatch (Arjun Yadav Customer Support)
 * 4. Template-Based Document Delivery with PDF Headers (Ananya Mehta Quotes & Riya Shah Invoices)
 * 5. Opt-in / Opt-out Regulatory Compliance (STOP / START)
 * 6. Direct wa.me fallback links when API credentials are not yet configured
 */

import crypto from 'crypto';
import { config } from '../config/env.js';
import { Customer } from '../models/Customer.js';

/**
 * Normalizes phone numbers to standard E.164 digits without '+' (required by Meta Graph API).
 * Defaulting to India (+91) for 10-digit mobile numbers.
 */
export const normalizePhoneNumber = (phone) => {
  if (!phone) return '';
  let cleaned = String(phone).replace(/[\s\-\(\)\.]/g, '');
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  // Remove leading 0 if present before country code
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }
  // If 10 digits starting with 6-9, assume India (91)
  if (cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned)) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
};

/**
 * Checks whether Meta WhatsApp credentials are fully configured on the server
 */
export const isWhatsAppConfigured = () => {
  const token = config.whatsapp.accessToken;
  const phoneId = config.whatsapp.phoneNumberId;
  return Boolean(
    token &&
    phoneId &&
    token !== 'your_meta_system_user_access_token' &&
    token !== 'your_whatsapp_access_token_here' &&
    phoneId !== 'your_meta_phone_number_id'
  );
};

/**
 * Verifies Meta Webhook challenge during endpoint registration (GET)
 */
export const verifyWebhookChallenge = (mode, token, challenge) => {
  const verifyToken = config.whatsapp.webhookVerifyToken;
  if (!verifyToken) {
    return { isValid: false, reason: 'WHATSAPP_WEBHOOK_VERIFY_TOKEN not configured on server' };
  }
  if (mode === 'subscribe' && token === verifyToken) {
    return { isValid: true, challenge };
  }
  return { isValid: false, reason: 'Token mismatch or invalid verification mode' };
};

/**
 * Cryptographically verifies X-Hub-Signature-256 for incoming Meta webhooks (POST)
 * Uses Meta App Secret and the raw unparsed request buffer.
 */
export const verifyWebhookSignature = (signatureHeader, rawBody, customAppSecret = null) => {
  const secret = customAppSecret || config.whatsapp.metaAppSecret;
  if (!secret) {
    // If secret not configured in dev, warn and reject
    return { isValid: false, reason: 'META_APP_SECRET not configured on server' };
  }
  if (!signatureHeader || !signatureHeader.startsWith('sha256=')) {
    return { isValid: false, reason: 'Missing or malformed X-Hub-Signature-256 header' };
  }

  const expectedHash = signatureHeader.slice(7); // Strip 'sha256='
  const bodyBuffer = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody || '', 'utf8');
  const calculatedHash = crypto.createHmac('sha256', secret).update(bodyBuffer).digest('hex');

  const expectedBuf = Buffer.from(expectedHash, 'utf8');
  const calcBuf = Buffer.from(calculatedHash, 'utf8');

  if (expectedBuf.length !== calcBuf.length) {
    return { isValid: false, reason: 'Signature buffer length mismatch' };
  }

  const isValid = crypto.timingSafeEqual(expectedBuf, calcBuf);
  return { isValid, reason: isValid ? 'Valid' : 'Signature digest mismatch' };
};

/**
 * Core HTTP Dispatcher to Meta Graph API
 */
export const sendWhatsAppMessage = async ({
  to,
  type = 'text',
  text,
  template,
  document,
  interactive,
  previewUrl = true
}) => {
  const normalizedPhone = normalizePhoneNumber(to);
  if (!normalizedPhone) {
    return {
      success: false,
      status: 'FAILED',
      error: 'Invalid recipient phone number'
    };
  }

  // Check customer messaging consent
  try {
    const customer = await Customer.findOne({
      $or: [{ phone: normalizedPhone }, { whatsappPhone: normalizedPhone }]
    });
    if (customer?.messagingConsent?.status === 'opted_out') {
      return {
        success: false,
        status: 'SKIPPED_NO_CONSENT',
        message: 'Customer has opted out of WhatsApp commercial communications',
        phone: normalizedPhone
      };
    }
  } catch (err) {
    // Proceed if DB lookup encounters non-fatal issue
  }

  if (!isWhatsAppConfigured()) {
    console.log(`ℹ️ [WhatsApp Service] Meta Cloud API unconfigured. Safe fallback for +${normalizedPhone}.`);
    return {
      success: false,
      status: 'not_configured',
      message: 'WhatsApp Business API credentials not configured on server.',
      directLink: `https://wa.me/${config.whatsapp.businessNumber?.replace(/[^0-9]/g, '') || '919930430789'}?text=${encodeURIComponent(
        text?.body || 'Hello Lotus Tubes, I am inquiring about sanitary stainless steel process components.'
      )}`
    };
  }

  const apiVersion = config.whatsapp.apiVersion || 'v21.0';
  const phoneNumberId = config.whatsapp.phoneNumberId;
  const token = config.whatsapp.accessToken;
  const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: normalizedPhone,
    type
  };

  if (type === 'text' && text) {
    payload.text = {
      preview_url: previewUrl,
      body: text.body
    };
  } else if (type === 'document' && document) {
    payload.document = {
      link: document.link,
      filename: document.filename || 'Lotus-Tubes-Document.pdf',
      caption: document.caption || ''
    };
  } else if (type === 'template' && template) {
    payload.template = {
      name: template.name,
      language: { code: template.language || config.whatsapp.templateLanguage || 'en' },
      components: template.components || []
    };
  } else if (type === 'interactive' && interactive) {
    payload.interactive = interactive;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn('⚠️ Meta WhatsApp Cloud API Error:', JSON.stringify(data));
      return {
        success: false,
        status: 'FAILED',
        error: data.error?.message || 'Meta Cloud API rejected request',
        metaErrorCode: data.error?.code,
        metaErrorSubcode: data.error?.error_subcode,
        response: data
      };
    }

    const messageId = data.messages?.[0]?.id;
    return {
      success: true,
      status: 'PROVIDER_ACCEPTED',
      messageId,
      response: data
    };
  } catch (error) {
    console.error('⚠️ WhatsApp Dispatch Exception:', error.message);
    return {
      success: false,
      status: 'FAILED',
      error: error.message
    };
  }
};

/**
 * Dispatches an approved document (Quotation or Invoice) via Meta approved Template with PDF Header
 */
export const sendApprovedDocumentWhatsApp = async ({
  phone,
  customerName,
  documentType = 'quotation', // 'quotation' | 'invoice'
  documentNumber,
  totalAmount,
  currency = 'INR',
  pdfUrl,
  agentName,
  templateName = null
}) => {
  const normalizedPhone = normalizePhoneNumber(phone);
  const defaultTemplate = documentType === 'invoice'
    ? config.whatsapp.invoiceTemplate
    : config.whatsapp.quotationTemplate;

  const activeTemplate = templateName || defaultTemplate;
  const fullPdfUrl = pdfUrl?.startsWith('http')
    ? pdfUrl
    : `${config.backendPublicUrl.replace(/\/+$/, '')}/${pdfUrl ? pdfUrl.replace(/^\/+/, '') : 'sample-quotation.pdf'}`;

  const filename = documentType === 'invoice'
    ? `Lotus-Tubes-Invoice-${documentNumber || 'INV'}.pdf`
    : `Lotus-Tubes-Quotation-${documentNumber || 'QT'}.pdf`;

  // Fallback direct wa.me link
  const directLink = `https://wa.me/${config.whatsapp.businessNumber?.replace(/[^0-9]/g, '') || '919930430789'}?text=${encodeURIComponent(
    `Hello Lotus Tubes, requesting copy of ${documentType.toUpperCase()} ${documentNumber || ''}.`
  )}`;

  if (!isWhatsAppConfigured()) {
    console.log(`ℹ️ [WhatsApp Service] Meta API unconfigured for ${documentType} to +${normalizedPhone}.`);
    return {
      success: false,
      status: 'not_configured',
      directLink,
      message: 'WhatsApp Business API credentials not configured on server.'
    };
  }

  // Build Meta Cloud API template components with DOCUMENT header
  const templateComponents = [
    {
      type: 'header',
      parameters: [
        {
          type: 'document',
          document: {
            link: fullPdfUrl,
            filename
          }
        }
      ]
    },
    {
      type: 'body',
      parameters: [
        { type: 'text', text: customerName || 'Valued Client' },
        { type: 'text', text: documentNumber || 'Commercial Document' },
        { type: 'text', text: `${currency} ${Number(totalAmount || 0).toLocaleString('en-IN')}` },
        { type: 'text', text: agentName || 'Lotus Tubes Desk' }
      ]
    }
  ];

  const result = await sendWhatsAppMessage({
    to: normalizedPhone,
    type: 'template',
    template: {
      name: activeTemplate,
      language: config.whatsapp.templateLanguage || 'en',
      components: templateComponents
    }
  });

  return {
    ...result,
    directLink,
    documentUrl: fullPdfUrl
  };
};

/**
 * Backward compatibility: Agent 1 (Ananya Mehta) Quotation dispatch
 */
export const sendWhatsAppQuotation = async ({ phone, customerName, reference, productName, quantity, samplePdfUrl }) => {
  const normalizedPhone = normalizePhoneNumber(phone);
  const directLink = `https://wa.me/919930430789?text=${encodeURIComponent(
    `Hello Lotus Tubes, I submitted quotation request ${reference} for ${productName || 'Sanitary Component'} (Qty: ${quantity}).`
  )}`;

  if (!isWhatsAppConfigured()) {
    return {
      success: false,
      status: 'not_configured',
      message: 'WhatsApp Business API credentials not configured on server.',
      directLink
    };
  }

  const pdfUrl = samplePdfUrl || `${config.backendPublicUrl}/sample-quotation.pdf`;
  const bodyText = `Dear ${customerName || 'Customer'},\n\nThank you for choosing Lotus Tubes.\n\nYour Quotation Request (Ref: *${reference}*) for *${productName || 'Sanitary Component'}* (Qty: ${quantity}) has been registered.\n\nOur commercial sales lead *Ananya Mehta* and Super Admin *Chirag Shah* are preparing your formal quote within 24 hours.\n\nDownload Initial Specification: ${pdfUrl}\n\n*Lotus Tubes (Lotus Impex)*\nSales Desk: +91 99304 30789\nEmail: sales@lotustubes.com`;

  return sendWhatsAppMessage({
    to: normalizedPhone,
    type: 'text',
    text: { body: bodyText }
  });
};

/**
 * Backward compatibility: Agent 2 (Riya Shah) Invoice dispatch
 */
export const sendWhatsAppInvoice = async ({ phone, customerName, invoiceNumber, grandTotal, pdfUrl }) => {
  const normalizedPhone = normalizePhoneNumber(phone);
  const directLink = `https://wa.me/919930430789?text=${encodeURIComponent(
    `Hello Riya Shah, I am requesting verified invoice ${invoiceNumber || ''} (Total: ₹${grandTotal || 'N/A'}).`
  )}`;

  if (!isWhatsAppConfigured()) {
    return { success: false, status: 'not_configured', directLink };
  }

  const downloadUrl = pdfUrl || `${config.backendPublicUrl}/sample-quotation.pdf`;
  const bodyText = `Dear ${customerName || 'Customer'},\n\nYour verified Commercial Invoice (*${invoiceNumber}*) for ₹${Number(grandTotal || 0).toLocaleString('en-IN')} has been authorized by Super Admin Chirag Shah.\n\nDownload Invoice PDF: ${downloadUrl}\n\nDispatched by:\n*Riya Shah (AI Commercial Billing Coordinator)*\nEmail: riyashah@lotustubes.com\nLotus Tubes (Lotus Impex), Fort, Mumbai`;

  return sendWhatsAppMessage({
    to: normalizedPhone,
    type: 'text',
    text: { body: bodyText }
  });
};

/**
 * Backward compatibility: Agent 3 (Neha Desai) Inquiry reply dispatch
 */
export const sendWhatsAppInquiryReply = async ({ phone, customerName, reference, replyText }) => {
  const normalizedPhone = normalizePhoneNumber(phone);
  const directLink = `https://wa.me/919930430789?text=${encodeURIComponent(
    `Hello Neha Desai, regarding inquiry ${reference}.`
  )}`;

  if (!isWhatsAppConfigured()) {
    return { success: false, status: 'not_configured', directLink };
  }

  const bodyText = `Dear ${customerName || 'Customer'},\n\n*Update on your Lotus Tubes Inquiry (${reference})*:\n\n${replyText}\n\n✓ *Verified & Confirmed by Super Admin Chirag Shah*\n\nDispatched by:\n*Neha Desai (AI Quality & Compliance Lead)*\nEmail: nehadesai@lotustubes.com\nLotus Tubes Desk: +91 99304 30789`;

  return sendWhatsAppMessage({
    to: normalizedPhone,
    type: 'text',
    text: { body: bodyText }
  });
};

/**
 * WhatsApp Delivery Service for Lotus Tubes Quotation Management
 * Uses Meta WhatsApp Business Cloud API.
 * Gracefully handles unconfigured credentials and records actual provider delivery status.
 */

export const normalizePhoneNumber = (phone) => {
  if (!phone) return '';
  // Remove spaces, hyphens, parentheses
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // If starts with +, remove +
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  // If 10 digits without country code, assume India (+91)
  if (cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned)) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
};

export const sendWhatsAppQuotation = async ({ phone, customerName, reference, productName, quantity, samplePdfUrl }) => {
  const normalizedPhone = normalizePhoneNumber(phone);
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId || token === 'your_whatsapp_access_token_here') {
    console.log(`ℹ️ [WhatsApp Service] Cloud API credentials not configured. Skipping automated WhatsApp message to +${normalizedPhone}.`);
    return {
      success: false,
      status: 'not_configured',
      message: 'WhatsApp Business API credentials not configured on server.',
      directLink: `https://wa.me/919930430789?text=${encodeURIComponent(
        `Hello Lotus Tubes, I submitted quotation request ${reference} for ${productName || 'Sanitary Component'} (Qty: ${quantity}). Please provide price and stock availability.`
      )}`
    };
  }

  try {
    const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: normalizedPhone,
      type: 'text',
      text: {
        preview_url: true,
        body: `Dear ${customerName || 'Customer'},\n\nThank you for your interest in Lotus Tubes sanitary products.\n\nYour Quotation Request (Ref: ${reference}) for *${productName || 'Sanitary Component'}* (Qty: ${quantity}) has been registered.\n\nA sample quotation document is available for initial specification review: ${samplePdfUrl || 'https://lotustubes.com/sample-quotation.pdf'}\n\nOur sales desk will verify final pricing and stock availability shortly.\n\n*Lotus Tubes (Lotus Impex)*\nSales Desk: +91 99304 30789\nEmail: sales@lotustubes.com`
      }
    };

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
      console.warn('⚠️ WhatsApp API error:', data);
      return {
        success: false,
        status: 'failed',
        error: data.error?.message || 'Failed to dispatch WhatsApp message',
        directLink: `https://wa.me/919930430789?text=${encodeURIComponent(
          `Hello Lotus Tubes, I submitted quotation request ${reference} for ${productName}.`
        )}`
      };
    }

    return {
      success: true,
      status: 'sent',
      messageId: data.messages?.[0]?.id,
      response: data
    };
  } catch (error) {
    console.error('⚠️ WhatsApp service execution error:', error.message);
    return {
      success: false,
      status: 'failed',
      error: error.message
    };
  }
};

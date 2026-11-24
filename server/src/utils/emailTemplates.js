/**
 * Lotus Tubes - Corporate HTML Email Design System
 * 
 * Reusable, responsive table-based email template system with inline CSS
 * for broad compatibility across Apple Mail, Gmail, Outlook, and mobile clients.
 * 
 * Brand Palette:
 * - Deep Navy: #0B1B3A
 * - Lotus Blue: #1769AA
 * - Cyan Accent: #00BCEB
 * - White: #FFFFFF
 * - Light Background: #F4F7FB
 * - Main Text: #172033
 * - Muted Text: #667085
 * - Border: #E2E8F0
 */

import { getSenderById, BUSINESS_MAILBOX, BUSINESS_NAME } from '../config/emailSenders.js';
import { escapeHtml } from './security.js';

export const BRAND_NAVY = '#0C225E';
export const BRAND_NAVY_DARK = '#081D5B';
export const BRAND_PINK = '#E93984';
export const BRAND_PINK_LIGHT = '#FC63A7';
export const BRAND_PINK_BG = '#FDF2F8';
export const BRAND_PINK_BORDER = '#FBCFE8';
export const BRAND_BLUE = '#E93984';
export const BRAND_CYAN = '#FC63A7';
export const BRAND_WHITE = '#FFFFFF';
export const BRAND_LIGHT_BG = '#F8FAFC';
export const BRAND_BORDER = '#E2E8F0';
export const BRAND_TEXT = '#0F172A';
export const BRAND_MUTED = '#475569';
export const BRAND_SUCCESS = '#15803D';
export const BRAND_SUCCESS_BG = '#F0FDF4';
export const BRAND_SUCCESS_BORDER = '#BBF7D0';

export const COMPANY_ADDRESS = 'Shop No. 9, Jain Bhavan CHSL, Dr Bhajekar Lane, opp. to 11th Lane, Charni Road East, Khetwadi, Girgaon, Mumbai 400004, Maharashtra, India';
export const COMPANY_PHONE = '+91 9867304316';
export const COMPANY_WEBSITE = 'https://lotustubes.com/';
export const COMPANY_GSTIN = '27AAFHC5384L1ZX';

/**
 * PHASE 8 — Professional Consistent Agent Email Signatures
 */
export const buildAgentSignatureHtml = (agentId = 'sales') => {
  const sender = getSenderById(agentId);
  return `
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 24px; border-top: 2px solid ${BRAND_BORDER}; padding-top: 18px;">
      <tr>
        <td style="vertical-align: top;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align: top; padding-right: 14px;">
                <div style="width: 48px; height: 48px; border-radius: 10px; background-color: ${BRAND_NAVY}; color: #FFFFFF; text-align: center; line-height: 48px; font-weight: 800; font-size: 16px; border: 2px solid ${BRAND_PINK}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  LT
                </div>
              </td>
              <td style="vertical-align: top; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <p style="margin: 0; font-size: 15px; font-weight: 800; color: ${BRAND_NAVY};">${escapeHtml(sender.name)}</p>
                <p style="margin: 2px 0 0 0; font-size: 12.5px; color: ${BRAND_PINK}; font-weight: 700;">${escapeHtml(sender.title)}</p>
                <p style="margin: 2px 0 0 0; font-size: 11.5px; color: ${BRAND_MUTED};">Department: ${escapeHtml(sender.department)}</p>
                <p style="margin: 6px 0 0 0; font-size: 12px; color: ${BRAND_TEXT}; line-height: 1.5;">
                  <strong style="color: ${BRAND_NAVY};">LOTUS TUBES</strong> • SS 304 &amp; SS 316L Sanitary Pipes, Tubes, Fittings &amp; Valves<br/>
                  Email: <a href="mailto:${escapeHtml(sender.email)}" style="color: ${BRAND_PINK}; text-decoration: none; font-weight: 700;">${escapeHtml(sender.email)}</a><br/>
                  Website: <a href="${COMPANY_WEBSITE}" style="color: ${BRAND_NAVY}; text-decoration: none; font-weight: 600;">${COMPANY_WEBSITE}</a> | Desk: <strong style="color: ${BRAND_TEXT};">${COMPANY_PHONE}</strong>
                </p>
                <div style="margin-top: 8px; display: inline-block; padding: 4px 10px; background-color: ${BRAND_PINK_BG}; border: 1px solid ${BRAND_PINK_BORDER}; border-radius: 6px; font-size: 11px; color: ${BRAND_NAVY}; font-weight: 600;">
                  🛡️ Verified Lotus Tubes Representative • Supervised by Chirag Shah (Owner &amp; Managing Director)
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `.trim();
};

/**
 * Creates outer corporate branded HTML wrapper for all emails
 */
export const wrapCorporateEmail = ({
  title = 'Lotus Tubes',
  subtitle = 'High Purity Sanitary Stainless Steel Piping Systems',
  preheader = '',
  contentHtml,
  agentId = 'sales',
  showSignature = true
}) => {
  const signatureHtml = showSignature ? buildAgentSignatureHtml(agentId) : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 24px 12px; background-color: ${BRAND_LIGHT_BG}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${BRAND_TEXT}; line-height: 1.6; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  ${preheader ? `<div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all; font-size: 1px; color: ${BRAND_LIGHT_BG};">${escapeHtml(preheader)}</div>` : ''}

  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 640px; margin: 0 auto; background-color: ${BRAND_WHITE}; border: 1px solid ${BRAND_BORDER}; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(12, 34, 94, 0.08);">
    <!-- Top Accent Bar -->
    <tr>
      <td height="4" style="background-color: ${BRAND_PINK}; line-height: 4px; font-size: 4px;">&nbsp;</td>
    </tr>

    <!-- Corporate Header with Lotus Tubes Logo Image -->
    <tr>
      <td style="background: linear-gradient(135deg, #081D5B 0%, #0C225E 100%); background-color: #081D5B; padding: 24px 32px; text-align: left; border-bottom: 2px solid ${BRAND_BORDER};">
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align: middle;">
              <a href="${COMPANY_WEBSITE}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="https://lotustubes.com/banner-image.png" alt="Lotus Tubes - High Purity Sanitary Stainless Steel" width="210" height="48" style="display: block; max-width: 210px; height: auto; border: 0;" />
              </a>
              <p style="color: ${BRAND_PINK_LIGHT}; margin: 6px 0 0 0; font-size: 11.5px; font-weight: 700; letter-spacing: 0.5px;">
                ${escapeHtml(subtitle)}
              </p>
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <span style="display: inline-block; padding: 5px 12px; background-color: rgba(233, 57, 132, 0.18); border: 1.5px solid ${BRAND_PINK}; border-radius: 9999px; font-size: 10px; font-weight: 800; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.06em;">
                ASME BPE • ASTM A270
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Main Content Area -->
    <tr>
      <td style="padding: 32px 32px 24px 32px; background-color: ${BRAND_WHITE};">
        ${contentHtml}
        ${signatureHtml}
      </td>
    </tr>

    <!-- Corporate Footer -->
    <tr>
      <td style="background-color: ${BRAND_LIGHT_BG}; padding: 24px 32px; border-top: 1px solid ${BRAND_BORDER}; text-align: center; font-size: 11.5px; color: ${BRAND_MUTED}; line-height: 1.6;">
        <p style="margin: 0 0 6px 0; font-weight: 800; font-size: 12.5px; color: ${BRAND_NAVY};">
          Lotus Tubes (Engineering Division of Lotus Impex) — Established 1989
        </p>
        <p style="margin: 0 0 6px 0; color: #334155;">
          ${COMPANY_ADDRESS}
        </p>
        <p style="margin: 0 0 8px 0; color: #475569;">
          GSTIN: <strong>${COMPANY_GSTIN}</strong> • Direct Sales Desk: <strong style="color: ${BRAND_NAVY};">${COMPANY_PHONE}</strong>
        </p>
        <p style="margin: 0; color: #94A3B8; font-size: 10.5px;">
          Replies to this message route directly to our commercial sales desk: <a href="mailto:${BUSINESS_MAILBOX}" style="color: ${BRAND_PINK}; text-decoration: none; font-weight: 600;">${BUSINESS_MAILBOX}</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};
  `.trim();
};

/**
 * Backward compatibility alias for wrapEmailTemplate
 */
export const wrapEmailTemplate = wrapCorporateEmail;

/* ========================================================================= */
/* EMAIL TEMPLATE 1 — QUOTATION REQUEST ACKNOWLEDGEMENT                      */
/* Trigger: When customer submits quotation request                         */
/* ========================================================================= */
export const buildQuotationAcknowledgementEmail = ({
  customerName,
  referenceNumber,
  reference,
  productName,
  materialGrade,
  nominalSize,
  outsideDiameter,
  wallThickness,
  standard,
  quantity,
  unit = 'Meter',
  destination,
  notes
}) => {
  const displayRef = referenceNumber || reference || 'QT-PENDING';

  const contentHtml = `
    <h2 style="color: ${BRAND_NAVY}; margin: 0 0 12px 0; font-size: 20px; font-weight: 800;">
      We Have Received Your Quotation Request
    </h2>
    
    <p style="margin: 0 0 14px 0; font-size: 14.5px; line-height: 1.6; color: ${BRAND_TEXT};">
      Dear <strong>${escapeHtml(customerName || 'Valued Client')}</strong>,
    </p>

    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #334155;">
      Thank you for choosing Lotus Tubes. We have successfully received your official quotation request. Our commercial sales engineering team is evaluating your specifications against our Mumbai inventory.
    </p>

    <!-- 24-Hour Turnaround Commitment Card -->
    <div style="background-color: ${BRAND_SUCCESS_BG}; border: 1.5px solid ${BRAND_SUCCESS_BORDER}; border-radius: 8px; padding: 14px 18px; margin: 18px 0;">
      <p style="margin: 0; font-size: 13.5px; color: ${BRAND_SUCCESS}; line-height: 1.6;">
        ⏱️ <strong>Commercial Review in Progress (24-Hour Commitment):</strong> Our team aims to review your requirements, verify metallurgical availability, and provide your formal quotation within the next <strong>24 hours</strong>. If additional technical details are needed, our engineering desk will reach out promptly.
      </p>
    </div>

    <!-- Specification Summary Table -->
    <div style="background-color: ${BRAND_LIGHT_BG}; border: 1px solid ${BRAND_BORDER}; border-radius: 8px; padding: 18px 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 12px 0; font-size: 13.5px; font-weight: 800; color: ${BRAND_NAVY}; text-transform: uppercase; letter-spacing: 0.5px;">
        Submitted Requirement Summary
      </h3>
      <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 13px; line-height: 1.8;">
        <tr>
          <td style="width: 40%; color: ${BRAND_MUTED};"><strong>Quotation Reference:</strong></td>
          <td style="color: ${BRAND_BLUE}; font-weight: 700; font-family: monospace; font-size: 14px;">${escapeHtml(displayRef)}</td>
        </tr>
        <tr>
          <td style="color: ${BRAND_MUTED};"><strong>Product:</strong></td>
          <td style="color: ${BRAND_TEXT}; font-weight: 600;">${escapeHtml(productName || 'Sanitary Component')}</td>
        </tr>
        ${materialGrade ? `
        <tr>
          <td style="color: ${BRAND_MUTED};"><strong>Material Grade:</strong></td>
          <td style="color: ${BRAND_TEXT}; font-weight: 600;">${escapeHtml(materialGrade)}</td>
        </tr>` : ''}
        ${nominalSize ? `
        <tr>
          <td style="color: ${BRAND_MUTED};"><strong>Nominal Size:</strong></td>
          <td style="color: ${BRAND_TEXT};">${escapeHtml(nominalSize)}${outsideDiameter ? ` (OD: ${escapeHtml(outsideDiameter)})` : ''}</td>
        </tr>` : ''}
        ${wallThickness ? `
        <tr>
          <td style="color: ${BRAND_MUTED};"><strong>Wall Thickness:</strong></td>
          <td style="color: ${BRAND_TEXT};">${escapeHtml(wallThickness)}</td>
        </tr>` : ''}
        ${standard ? `
        <tr>
          <td style="color: ${BRAND_MUTED};"><strong>Standard:</strong></td>
          <td style="color: ${BRAND_TEXT};">${escapeHtml(standard)}</td>
        </tr>` : ''}
        <tr>
          <td style="color: ${BRAND_MUTED};"><strong>Quantity:</strong></td>
          <td style="color: ${BRAND_TEXT}; font-weight: 600;">${escapeHtml(String(quantity))} ${escapeHtml(unit)}</td>
        </tr>
        ${destination ? `
        <tr>
          <td style="color: ${BRAND_MUTED};"><strong>Delivery Destination:</strong></td>
          <td style="color: ${BRAND_TEXT};">${escapeHtml(destination)}</td>
        </tr>` : ''}
        ${notes ? `
        <tr>
          <td style="color: ${BRAND_MUTED}; vertical-align: top;"><strong>Technical Notes:</strong></td>
          <td style="color: ${BRAND_TEXT};">${escapeHtml(notes)}</td>
        </tr>` : ''}
      </table>
    </div>

    <p style="margin: 0 0 14px 0; font-size: 13px; line-height: 1.6; color: #475569;">
      Your enquiry is important to us. If you need to make immediate changes to this request, reply directly to this email or contact our Mumbai sales desk.
    </p>

    <div style="background-color: #F8FAFC; border-left: 3px solid ${BRAND_BLUE}; padding: 12px 14px; margin: 18px 0; font-size: 12.5px; color: ${BRAND_TEXT};">
      Direct Commercial Assistance: <a href="mailto:${BUSINESS_MAILBOX}" style="color: ${BRAND_BLUE}; font-weight: 700; text-decoration: none;">${BUSINESS_MAILBOX}</a> | WhatsApp / Desk: <strong>${COMPANY_PHONE}</strong>
    </div>
  `;

  return wrapCorporateEmail({
    title: 'We Have Received Your Quotation Request | Lotus Tubes',
    subtitle: 'Commercial Quotation Request Acknowledgement',
    preheader: `Thank you for choosing Lotus Tubes. Quotation reference ${displayRef} is under review with 24-hour turnaround commitment.`,
    contentHtml,
    agentId: 'ananya-mehta'
  });
};

export const buildQuotationAcknowledgementText = ({
  customerName,
  referenceNumber,
  reference,
  productName,
  materialGrade,
  nominalSize,
  outsideDiameter,
  wallThickness,
  standard,
  quantity,
  unit = 'Meter',
  destination,
  notes
}) => {
  const displayRef = referenceNumber || reference || 'QT-PENDING';
  return `
Dear ${customerName || 'Valued Client'},

Thank you for choosing Lotus Tubes.
We have successfully received your official quotation request.

Our commercial team is reviewing your requirements and will work towards sharing your quotation within the next 24 hours. Your enquiry is important to us, and our team will contact you if additional technical information is required.

Submitted Requirement Summary:
- Quotation Reference: ${displayRef}
- Product: ${productName || 'Sanitary Component'}
${materialGrade ? `- Material Grade: ${materialGrade}\n` : ''}${nominalSize ? `- Nominal Size: ${nominalSize}${outsideDiameter ? ` (OD: ${outsideDiameter})` : ''}\n` : ''}${wallThickness ? `- Wall Thickness: ${wallThickness}\n` : ''}${standard ? `- Standard: ${standard}\n` : ''}- Quantity: ${quantity} ${unit}
${destination ? `- Destination: ${destination}\n` : ''}${notes ? `- Notes: ${notes}\n` : ''}

Contact / Assistance:
sales@lotustubes.com | +91 99304 30789
Website: https://lotustubes.com/

Regards,
Lotus Tubes Commercial Team
  `.trim();
};

/* ========================================================================= */
/* EMAIL TEMPLATE 2 — OFFICIAL QUOTATION DELIVERY                            */
/* Trigger: Only after Super Admin approval                                  */
/* ========================================================================= */
export const buildQuotationDeliveryEmail = ({
  customerName,
  quotationNumber,
  reference,
  lineItems = [],
  subtotal = 0,
  taxTotal = 0,
  grandTotal = 0,
  leadTime = '3-5 Working Days ex-stock Mumbai',
  validityDays = 15,
  paymentTerms = '100% advance against Proforma or approved credit terms',
  deliveryTerms = 'Ex-Works Mumbai / Door Delivery at Actuals',
  downloadPdfUrl = 'https://lotustubes.com/sample-quotation.pdf'
}) => {
  const itemsRows = lineItems
    .map(
      (item, idx) => `
      <tr style="background: ${idx % 2 === 0 ? BRAND_WHITE : BRAND_LIGHT_BG};">
        <td style="padding: 10px 12px; border: 1px solid ${BRAND_BORDER}; font-size: 12.5px; color: ${BRAND_TEXT};">${escapeHtml(item.description)}</td>
        <td style="padding: 10px 12px; border: 1px solid ${BRAND_BORDER}; font-size: 12px; text-align: center; color: ${BRAND_TEXT}; font-weight: 600;">${escapeHtml(item.grade || 'SS 316L')}</td>
        <td style="padding: 10px 12px; border: 1px solid ${BRAND_BORDER}; font-size: 12px; text-align: center; color: ${BRAND_TEXT};">${item.quantity} ${escapeHtml(item.unit || 'Pcs')}</td>
        <td style="padding: 10px 12px; border: 1px solid ${BRAND_BORDER}; font-size: 12px; text-align: right; color: ${BRAND_TEXT};">₹${Number(item.unitPrice || 0).toLocaleString('en-IN')}</td>
        <td style="padding: 10px 12px; border: 1px solid ${BRAND_BORDER}; font-size: 12.5px; text-align: right; font-weight: 700; color: ${BRAND_NAVY};">₹${Number(item.lineTotal || 0).toLocaleString('en-IN')}</td>
      </tr>
    `
    )
    .join('');

  const contentHtml = `
    <div style="display: inline-block; background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 9999px; padding: 3px 10px; font-size: 11px; font-weight: 700; color: #166534; margin-bottom: 10px;">
      ✓ Super Admin Authorized Official Document
    </div>
    <h2 style="color: ${BRAND_NAVY}; margin: 0 0 12px 0; font-size: 20px; font-weight: 800;">
      Your Official Quotation | Lotus Tubes
    </h2>
    <p style="margin: 0 0 14px 0; font-size: 14.5px;">Dear <strong>${escapeHtml(customerName || 'Valued Client')}</strong>,</p>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155; line-height: 1.6;">
      Thank you for submitting your hygienic fluid handling requirements. Your formal commercial quotation <strong>${escapeHtml(quotationNumber)}</strong> has been verified by our engineering desk and authorized by <strong>Super Admin Chirag Shah</strong>.
    </p>

    <div style="background-color: ${BRAND_LIGHT_BG}; border: 1px solid ${BRAND_BORDER}; border-radius: 8px; padding: 12px 18px; margin-bottom: 18px;">
      <span style="font-size: 12px; color: ${BRAND_MUTED}; font-weight: 600;">Quotation Reference:</span>
      <span style="font-size: 14px; font-weight: 800; color: ${BRAND_BLUE}; font-family: monospace; margin-left: 6px;">${escapeHtml(quotationNumber)}</span>
      ${reference ? `<span style="font-size: 12px; color: ${BRAND_MUTED}; margin-left: 14px;">(RFQ: ${escapeHtml(reference)})</span>` : ''}
    </div>

    <!-- Pricing & Specification Table -->
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr style="background-color: ${BRAND_NAVY}; color: ${BRAND_WHITE};">
          <th style="padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Component / Spec</th>
          <th style="padding: 10px 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Grade</th>
          <th style="padding: 10px 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
          <th style="padding: 10px 12px; text-align: right; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Unit Rate</th>
          <th style="padding: 10px 12px; text-align: right; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
      <tfoot>
        <tr style="background: ${BRAND_LIGHT_BG};">
          <td colspan="4" style="padding: 10px 12px; text-align: right; border: 1px solid ${BRAND_BORDER}; font-size: 12.5px;"><strong>Subtotal (Taxable Value):</strong></td>
          <td style="padding: 10px 12px; text-align: right; border: 1px solid ${BRAND_BORDER}; font-size: 12.5px; font-weight: 600;">₹${Number(subtotal).toLocaleString('en-IN')}</td>
        </tr>
        <tr style="background: ${BRAND_LIGHT_BG};">
          <td colspan="4" style="padding: 10px 12px; text-align: right; border: 1px solid ${BRAND_BORDER}; font-size: 12.5px;"><strong>Applicable GST (18% HSN):</strong></td>
          <td style="padding: 10px 12px; text-align: right; border: 1px solid ${BRAND_BORDER}; font-size: 12.5px; font-weight: 600;">₹${Number(taxTotal).toLocaleString('en-IN')}</td>
        </tr>
        <tr style="background: #EFF6FF; font-weight: 800;">
          <td colspan="4" style="padding: 12px; text-align: right; border: 1px solid ${BRAND_BORDER}; font-size: 13.5px; color: ${BRAND_NAVY};">Grand Total (INR):</td>
          <td style="padding: 12px; text-align: right; border: 1px solid ${BRAND_BORDER}; font-size: 15px; color: ${BRAND_BLUE};">₹${Number(grandTotal).toLocaleString('en-IN')}</td>
        </tr>
      </tfoot>
    </table>

    <!-- Commercial Terms -->
    <div style="background-color: ${BRAND_LIGHT_BG}; border: 1px solid ${BRAND_BORDER}; border-radius: 8px; padding: 14px 18px; font-size: 12.5px; margin-bottom: 20px; line-height: 1.6;">
      <p style="margin: 0 0 4px 0;"><strong>Delivery Timeline:</strong> ${escapeHtml(leadTime)}</p>
      <p style="margin: 0 0 4px 0;"><strong>Delivery Terms:</strong> ${escapeHtml(deliveryTerms)}</p>
      <p style="margin: 0 0 4px 0;"><strong>Payment Terms:</strong> ${escapeHtml(paymentTerms)}</p>
      <p style="margin: 0 0 4px 0;"><strong>Quotation Validity:</strong> ${validityDays} Days from date of issue</p>
      <p style="margin: 0;"><strong>Quality Certification:</strong> EN 10204 3.1 Mill Test Certificate (MTC) supplied with dispatch</p>
    </div>

    ${downloadPdfUrl ? `
      <div style="text-align: center; margin: 24px 0;">
        <a href="${escapeHtml(downloadPdfUrl)}" target="_blank" style="display: inline-block; background-color: ${BRAND_BLUE}; color: ${BRAND_WHITE}; text-decoration: none; font-weight: 700; font-size: 13.5px; padding: 12px 28px; border-radius: 8px; letter-spacing: 0.3px; box-shadow: 0 2px 6px rgba(2, 132, 199, 0.25);">
          📄 Download Official Quotation PDF
        </a>
      </div>
    ` : ''}

    <p style="margin: 16px 0 0 0; font-size: 12.5px; color: ${BRAND_MUTED}; line-height: 1.5;">
      To convert this quotation into a Purchase Order, reply directly with your PO copy or contact Ananya Mehta at <a href="mailto:ananyamehta@lotustubes.com" style="color: ${BRAND_BLUE}; text-decoration: none;">ananyamehta@lotustubes.com</a>.
    </p>
  `;

  return wrapCorporateEmail({
    title: `Your Official Quotation | Lotus Tubes | ${quotationNumber}`,
    subtitle: 'Official Quotation & Commercial Proposals Desk',
    preheader: `Official Quotation ${quotationNumber} authorized by Super Admin Chirag Shah. Grand Total: ₹${Number(grandTotal).toLocaleString('en-IN')}.`,
    contentHtml,
    agentId: 'ananya-mehta'
  });
};

export const buildQuotationEmail = buildQuotationDeliveryEmail;

/* ========================================================================= */
/* EMAIL TEMPLATE 3 — INVOICE DELIVERY                                       */
/* Trigger: Only after Super Admin approval                                  */
/* ========================================================================= */
export const buildInvoiceDeliveryEmail = ({
  customerName,
  invoiceNumber,
  quotationNumber,
  subtotal = 0,
  taxTotal = 0,
  grandTotal = 0,
  paymentTerms = '100% advance against Proforma or 30 days credit for approved clients',
  bankDetails = {
    bankName: 'Bank of Baroda',
    branch: 'Fort, Mumbai 400001',
    accountName: 'Lotus Impex (Lotus Tubes)',
    accountNumber: '03910200001109',
    ifscCode: 'BARB0FORTXX',
    upiId: '9930430789@okbizaxis'
  },
  downloadPdfUrl = 'https://lotustubes.com/sample-quotation.pdf'
}) => {
  const contentHtml = `
    <div style="display: inline-block; background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 9999px; padding: 3px 10px; font-size: 11px; font-weight: 700; color: #166534; margin-bottom: 10px;">
      ✓ Super Admin Authorized Official Invoice
    </div>
    <h2 style="color: ${BRAND_NAVY}; margin: 0 0 12px 0; font-size: 20px; font-weight: 800;">
      Your Official Invoice | Lotus Tubes | ${escapeHtml(invoiceNumber)}
    </h2>
    <p style="margin: 0 0 14px 0; font-size: 14.5px;">Dear <strong>${escapeHtml(customerName || 'Valued Client')}</strong>,</p>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155; line-height: 1.6;">
      Your commercial tax invoice <strong>${escapeHtml(invoiceNumber)}</strong> has been audited, checked for 18% GST / HSN compliance, and authorized by <strong>Super Admin Chirag Shah</strong>.
    </p>

    <div style="background-color: ${BRAND_LIGHT_BG}; border: 1px solid ${BRAND_BORDER}; border-radius: 8px; padding: 12px 18px; margin-bottom: 18px;">
      <span style="font-size: 12px; color: ${BRAND_MUTED}; font-weight: 600;">Invoice Number:</span>
      <span style="font-size: 14px; font-weight: 800; color: ${BRAND_BLUE}; font-family: monospace; margin-left: 6px;">${escapeHtml(invoiceNumber)}</span>
      ${quotationNumber ? `<span style="font-size: 12px; color: ${BRAND_MUTED}; margin-left: 14px;">(Against Quote: ${escapeHtml(quotationNumber)})</span>` : ''}
    </div>

    <!-- Financial Breakdown Table -->
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
      <tr>
        <td style="padding: 10px 14px; border: 1px solid ${BRAND_BORDER}; background: ${BRAND_LIGHT_BG};"><strong>Taxable Value (Subtotal):</strong></td>
        <td style="padding: 10px 14px; border: 1px solid ${BRAND_BORDER}; text-align: right; font-weight: 600;">₹${Number(subtotal).toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; border: 1px solid ${BRAND_BORDER}; background: ${BRAND_LIGHT_BG};"><strong>Goods &amp; Services Tax (18% GST):</strong></td>
        <td style="padding: 10px 14px; border: 1px solid ${BRAND_BORDER}; text-align: right; font-weight: 600;">₹${Number(taxTotal).toLocaleString('en-IN')}</td>
      </tr>
      <tr style="background: #EFF6FF; font-weight: 800;">
        <td style="padding: 12px 14px; border: 1px solid ${BRAND_BORDER}; font-size: 14px; color: ${BRAND_NAVY};">Total Invoice Amount:</td>
        <td style="padding: 12px 14px; border: 1px solid ${BRAND_BORDER}; text-align: right; font-size: 16px; color: ${BRAND_BLUE};">₹${Number(grandTotal).toLocaleString('en-IN')}</td>
      </tr>
    </table>

    <!-- Verified Bank Remittance Details -->
    <div style="background-color: ${BRAND_LIGHT_BG}; border: 1px solid ${BRAND_BORDER}; border-radius: 8px; padding: 16px 20px; font-size: 12.5px; margin-bottom: 20px; line-height: 1.6;">
      <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 800; color: ${BRAND_NAVY}; text-transform: uppercase; letter-spacing: 0.5px;">
        Verified Bank Remittance Details
      </h4>
      <p style="margin: 0 0 3px 0;">Beneficiary: <strong>${escapeHtml(bankDetails.accountName)}</strong></p>
      <p style="margin: 0 0 3px 0;">Bank: <strong>${escapeHtml(bankDetails.bankName)}</strong> | Branch: ${escapeHtml(bankDetails.branch)}</p>
      <p style="margin: 0 0 3px 0;">Account No: <strong style="font-family: monospace; font-size: 13px;">${escapeHtml(bankDetails.accountNumber)}</strong></p>
      <p style="margin: 0 0 3px 0;">IFSC Code: <strong style="font-family: monospace;">${escapeHtml(bankDetails.ifscCode)}</strong></p>
      <p style="margin: 0 0 6px 0;">UPI ID: <strong style="color: ${BRAND_BLUE};">${escapeHtml(bankDetails.upiId)}</strong></p>
      <p style="margin: 6px 0 0 0; color: ${BRAND_MUTED}; font-size: 12px;">Payment Terms: ${escapeHtml(paymentTerms)}</p>
    </div>

    ${downloadPdfUrl ? `
      <div style="text-align: center; margin: 24px 0;">
        <a href="${escapeHtml(downloadPdfUrl)}" target="_blank" style="display: inline-block; background-color: ${BRAND_BLUE}; color: ${BRAND_WHITE}; text-decoration: none; font-weight: 700; font-size: 13.5px; padding: 12px 28px; border-radius: 8px; letter-spacing: 0.3px; box-shadow: 0 2px 6px rgba(2, 132, 199, 0.25);">
          📥 Download Official Invoice PDF
        </a>
      </div>
    ` : ''}

    <p style="margin: 16px 0 0 0; font-size: 12px; color: ${BRAND_MUTED};">
      After remittance, please forward your UTR / payment reference to Riya Shah at <a href="mailto:riyashah@lotustubes.com" style="color: ${BRAND_BLUE}; text-decoration: none;">riyashah@lotustubes.com</a> for immediate dispatch clearance.
    </p>
  `;

  return wrapCorporateEmail({
    title: `Your Official Invoice | Lotus Tubes | ${invoiceNumber}`,
    subtitle: 'Commercial Billing & Invoicing Desk',
    preheader: `Tax Invoice ${invoiceNumber} issued. Total Payable: ₹${Number(grandTotal).toLocaleString('en-IN')}. Remittance details inside.`,
    contentHtml,
    agentId: 'riya-shah'
  });
};

export const buildInvoiceEmail = buildInvoiceDeliveryEmail;

/* ========================================================================= */
/* EMAIL TEMPLATE 4 — PASSWORD RESET OTP                                     */
/* Sender: support@lotustubes.com                                            */
/* ========================================================================= */
export const buildPasswordResetOtpEmail = ({
  name,
  otp,
  portalName = 'Lotus Tubes Account Portal',
  expiryMinutes = 10,
  resetUrl = 'https://lotustubes.com/#login'
}) => {
  const contentHtml = `
    <h2 style="color: ${BRAND_NAVY}; margin: 0 0 12px 0; font-size: 20px; font-weight: 800;">
      Your Lotus Tubes Account Verification Code
    </h2>

    <p style="margin: 0 0 14px 0; font-size: 14.5px;">Dear <strong>${escapeHtml(name || 'User')}</strong>,</p>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155; line-height: 1.6;">
      We received a request to reset the password for your Lotus Tubes account on the <strong>${escapeHtml(portalName)}</strong>. Please use the one-time verification code below to authorize your password update:
    </p>

    <!-- Prominent OTP Code Box -->
    <div style="background-color: ${BRAND_LIGHT_BG}; border: 2px dashed ${BRAND_BLUE}; border-radius: 12px; padding: 22px; text-align: center; margin: 24px 0;">
      <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: ${BRAND_MUTED}; font-weight: 700; display: block; margin-bottom: 8px;">
        One-Time Verification Code (OTP)
      </span>
      <span style="font-size: 38px; font-weight: 900; letter-spacing: 10px; color: ${BRAND_NAVY}; font-family: ui-monospace, Menlo, Consolas, monospace; display: inline-block;">
        ${escapeHtml(String(otp))}
      </span>
      <span style="display: block; margin-top: 10px; font-size: 12px; color: ${BRAND_MUTED}; font-weight: 600;">
        ⏱️ Valid for <strong>${expiryMinutes} minutes</strong> only
      </span>
    </div>

    <!-- Security Warning Banner -->
    <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 12px 16px; border-radius: 4px; margin: 20px 0; font-size: 12.5px; color: #991B1B; line-height: 1.5;">
      <strong>Security Warning:</strong> Never share this verification code with anyone, including Lotus Tubes personnel. Lotus Tubes staff will never contact you asking for your password or OTP.
    </div>

    <p style="margin: 16px 0 0 0; font-size: 13px; color: #475569; line-height: 1.5;">
      If you did not request this password reset, please ignore this email or notify our security desk immediately at <a href="mailto:support@lotustubes.com" style="color: ${BRAND_BLUE}; text-decoration: none; font-weight: 600;">support@lotustubes.com</a>.
    </p>

    <div style="text-align: center; margin: 22px 0 10px 0;">
      <a href="${escapeHtml(resetUrl)}" target="_blank" style="display: inline-block; background-color: ${BRAND_NAVY}; color: ${BRAND_WHITE}; text-decoration: none; font-size: 13px; font-weight: 700; padding: 10px 22px; border-radius: 6px;">
        Open Password Reset Page →
      </a>
    </div>
  `;

  return wrapCorporateEmail({
    title: 'Your Lotus Tubes Account Verification Code',
    subtitle: 'Client Security & Authentication Desk',
    preheader: `Your verification code is ${otp}. Valid for ${expiryMinutes} minutes. Do not share with anyone.`,
    contentHtml,
    agentId: 'support',
    showSignature: false
  });
};

/* ========================================================================= */
/* EMAIL TEMPLATE 5 — PASSWORD RESET SUCCESS                                 */
/* ========================================================================= */
export const buildPasswordResetSuccessEmail = ({
  name,
  timestamp = new Date().toUTCString(),
  portalName = 'Lotus Tubes Account Portal'
}) => {
  const contentHtml = `
    <div style="display: inline-block; background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 9999px; padding: 3px 10px; font-size: 11px; font-weight: 700; color: #166534; margin-bottom: 10px;">
      ✓ Password Updated Successfully
    </div>
    <h2 style="color: ${BRAND_NAVY}; margin: 0 0 12px 0; font-size: 20px; font-weight: 800;">
      Your Lotus Tubes Password Has Been Updated
    </h2>
    <p style="margin: 0 0 14px 0; font-size: 14.5px;">Dear <strong>${escapeHtml(name || 'User')}</strong>,</p>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155; line-height: 1.6;">
      This email confirms that the password for your Lotus Tubes account on the <strong>${escapeHtml(portalName)}</strong> was successfully changed on <strong>${escapeHtml(timestamp)}</strong>.
    </p>

    <div style="background-color: ${BRAND_LIGHT_BG}; border: 1px solid ${BRAND_BORDER}; border-radius: 8px; padding: 16px; font-size: 13px; margin: 18px 0; line-height: 1.6;">
      <p style="margin: 0 0 6px 0; font-weight: 700; color: ${BRAND_NAVY};">Security &amp; Session Status:</p>
      <p style="margin: 0 0 4px 0;">• Prior authentication tokens have been invalidated across all sessions.</p>
      <p style="margin: 0 0 4px 0;">• You can now sign in using your new credentials.</p>
      <p style="margin: 0;">• Keep your credentials confidential at all times.</p>
    </div>

    <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 12px 16px; border-radius: 4px; margin: 18px 0; font-size: 12.5px; color: #92400E; line-height: 1.5;">
      <strong>Didn't make this change?</strong> If you did not perform this update, please contact our support desk immediately at <a href="mailto:support@lotustubes.com" style="color: ${BRAND_BLUE}; font-weight: 700; text-decoration: none;">support@lotustubes.com</a> or call <strong>${COMPANY_PHONE}</strong> to lock your account.
    </div>

    <div style="text-align: center; margin: 24px 0 10px 0;">
      <a href="https://lotustubes.com/#login" target="_blank" style="display: inline-block; background-color: ${BRAND_BLUE}; color: ${BRAND_WHITE}; text-decoration: none; font-size: 13px; font-weight: 700; padding: 10px 24px; border-radius: 6px;">
        Sign In to Account →
      </a>
    </div>
  `;

  return wrapCorporateEmail({
    title: 'Your Lotus Tubes Password Has Been Updated',
    subtitle: 'Security & Account Protection Desk',
    preheader: 'Your account password has been updated successfully. If this was not you, contact support immediately.',
    contentHtml,
    agentId: 'support',
    showSignature: false
  });
};

/* ========================================================================= */
/* EMAIL TEMPLATE 6 — CUSTOMER CONTACT ENQUIRY ACKNOWLEDGEMENT               */
/* ========================================================================= */
export const buildContactEnquiryEmail = ({
  customerName,
  reference,
  category = 'Technical Sourcing Inquiry',
  message,
  submittedDate = new Date().toLocaleDateString('en-IN')
}) => {
  const contentHtml = `
    <h2 style="color: ${BRAND_NAVY}; margin: 0 0 12px 0; font-size: 20px; font-weight: 800;">
      Thank You for Contacting Lotus Tubes
    </h2>
    <p style="margin: 0 0 14px 0; font-size: 14.5px;">Dear <strong>${escapeHtml(customerName || 'Valued Client')}</strong>,</p>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155; line-height: 1.6;">
      We have received your inquiry regarding <strong>${escapeHtml(category)}</strong>. Your message has been logged in our client management system under reference <strong>${escapeHtml(reference)}</strong>.
    </p>

    <div style="background-color: ${BRAND_LIGHT_BG}; border: 1px solid ${BRAND_BORDER}; border-radius: 8px; padding: 16px 20px; margin: 18px 0; font-size: 13px; line-height: 1.6;">
      <p style="margin: 0 0 6px 0;"><strong>Inquiry Reference:</strong> <span style="font-family: monospace; color: ${BRAND_BLUE}; font-weight: 700;">${escapeHtml(reference)}</span></p>
      <p style="margin: 0 0 6px 0;"><strong>Category:</strong> ${escapeHtml(category)}</p>
      <p style="margin: 0 0 6px 0;"><strong>Submission Date:</strong> ${escapeHtml(submittedDate)}</p>
      ${message ? `<p style="margin: 8px 0 0 0; border-top: 1px dashed ${BRAND_BORDER}; padding-top: 8px; color: #475569;"><em>"${escapeHtml(message)}"</em></p>` : ''}
    </div>

    <p style="margin: 0 0 14px 0; font-size: 13.5px; color: #334155; line-height: 1.6;">
      Our client resolution specialist <strong>Neha Desai</strong> is reviewing your message. Our engineering team will respond within <strong>24 business hours</strong> with the requested specifications, documentation, or quotation guidance.
    </p>

    <div style="background-color: #F8FAFC; border-left: 3px solid ${BRAND_BLUE}; padding: 12px 14px; margin: 18px 0; font-size: 12.5px; color: ${BRAND_TEXT};">
      Need urgent resolution? Reach our customer concierge directly at <a href="mailto:nehadesai@lotustubes.com" style="color: ${BRAND_BLUE}; font-weight: 700; text-decoration: none;">nehadesai@lotustubes.com</a>.
    </div>
  `;

  return wrapCorporateEmail({
    title: `Enquiry Received: ${reference} | Lotus Tubes`,
    subtitle: 'Customer Inquiries & Technical Support Desk',
    preheader: `Thank you for contacting Lotus Tubes. Inquiry reference ${reference} has been received.`,
    contentHtml,
    agentId: 'neha-desai'
  });
};

/* ========================================================================= */
/* EMAIL TEMPLATE 7 — CUSTOMER SUPPORT RESPONSE                              */
/* ========================================================================= */
export const buildSupportResponseEmail = ({
  customerName,
  subject,
  reference,
  approvedReply,
  agentId = 'neha-desai'
}) => {
  const contentHtml = `
    <h2 style="color: ${BRAND_NAVY}; margin: 0 0 12px 0; font-size: 20px; font-weight: 800;">
      Response to Your Inquiry: ${escapeHtml(subject || 'Lotus Tubes Support')}
    </h2>
    <p style="margin: 0 0 14px 0; font-size: 14.5px;">Dear <strong>${escapeHtml(customerName || 'Valued Client')}</strong>,</p>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155; line-height: 1.6;">
      Thank you for your patience. Here is the verified technical response regarding inquiry reference <strong>${escapeHtml(reference || 'LT-INQ')}</strong>:
    </p>

    <!-- Verified Support Response Box -->
    <div style="background-color: #F8FAFC; border-left: 4px solid ${BRAND_BLUE}; padding: 18px 20px; margin: 18px 0; border-radius: 4px;">
      <h4 style="margin: 0 0 8px 0; color: ${BRAND_BLUE}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
        Engineering &amp; Support Resolution:
      </h4>
      <div style="margin: 0; line-height: 1.7; color: #1E293B; font-size: 13.5px;">
        ${escapeHtml(approvedReply).replace(/\n/g, '<br/>')}
      </div>
    </div>

    <p style="margin: 16px 0 0 0; font-size: 12.5px; color: ${BRAND_MUTED}; line-height: 1.5;">
      If you require additional mill test reports (EN 10204 3.1 MTC), dimensional drawings, or sample coupons, simply reply to this email to reach our desk.
    </p>
  `;

  return wrapCorporateEmail({
    title: `Support Response: ${subject || 'Lotus Tubes Inquiry'}`,
    subtitle: 'Customer Inquiries & Technical Resolution Desk',
    preheader: `Response regarding ${subject || 'your inquiry'} from Lotus Tubes support desk.`,
    contentHtml,
    agentId
  });
};

export const buildInquiryReplyEmail = buildSupportResponseEmail;

/* ========================================================================= */
/* EMAIL TEMPLATE 8 — ORDER STATUS UPDATE                                    */
/* ========================================================================= */
export const buildOrderUpdateEmail = ({
  customerName,
  orderNumber,
  reference,
  status = 'In Fabrication / Inspection',
  dispatchDate,
  courierName,
  trackingNumber,
  trackingUrl,
  notes
}) => {
  const displayRef = orderNumber || reference || 'LT-ORD';

  const contentHtml = `
    <h2 style="color: ${BRAND_NAVY}; margin: 0 0 12px 0; font-size: 20px; font-weight: 800;">
      An Update Regarding Your Lotus Tubes Order
    </h2>
    <p style="margin: 0 0 14px 0; font-size: 14.5px;">Dear <strong>${escapeHtml(customerName || 'Valued Client')}</strong>,</p>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155; line-height: 1.6;">
      Here is the latest operational status update regarding order reference <strong>${escapeHtml(displayRef)}</strong>.
    </p>

    <!-- Order Status Box -->
    <div style="background-color: ${BRAND_LIGHT_BG}; border: 1px solid ${BRAND_BORDER}; border-radius: 8px; padding: 18px 20px; margin: 18px 0; font-size: 13px; line-height: 1.7;">
      <p style="margin: 0 0 6px 0;"><strong>Order Reference:</strong> <span style="font-family: monospace; color: ${BRAND_BLUE}; font-weight: 700;">${escapeHtml(displayRef)}</span></p>
      <p style="margin: 0 0 6px 0;"><strong>Current Status:</strong> <span style="display: inline-block; background-color: #EFF6FF; color: ${BRAND_BLUE}; padding: 2px 8px; border-radius: 4px; font-weight: 700;">${escapeHtml(status)}</span></p>
      ${dispatchDate ? `<p style="margin: 0 0 6px 0;"><strong>Dispatch / Ready Date:</strong> ${escapeHtml(dispatchDate)}</p>` : ''}
      ${courierName ? `<p style="margin: 0 0 6px 0;"><strong>Logistics Partner:</strong> ${escapeHtml(courierName)}</p>` : ''}
      ${trackingNumber ? `<p style="margin: 0 0 6px 0;"><strong>Tracking / Waybill No:</strong> <strong style="font-family: monospace;">${escapeHtml(trackingNumber)}</strong></p>` : ''}
      ${notes ? `<p style="margin: 8px 0 0 0; border-top: 1px dashed ${BRAND_BORDER}; padding-top: 8px; color: #475569;">${escapeHtml(notes)}</p>` : ''}
    </div>

    ${trackingUrl ? `
      <div style="text-align: center; margin: 22px 0;">
        <a href="${escapeHtml(trackingUrl)}" target="_blank" style="display: inline-block; background-color: ${BRAND_BLUE}; color: ${BRAND_WHITE}; text-decoration: none; font-size: 13px; font-weight: 700; padding: 10px 22px; border-radius: 6px;">
          🚚 Track Consignment Live →
        </a>
      </div>
    ` : ''}

    <p style="margin: 16px 0 0 0; font-size: 12.5px; color: ${BRAND_MUTED}; line-height: 1.5;">
      Operations cross-coordinated by Arjun Yadav with Super Admin oversight. For immediate logistics inquiries, reply directly to this update or contact <a href="mailto:arjunyadav@lotustubes.com" style="color: ${BRAND_BLUE}; text-decoration: none;">arjunyadav@lotustubes.com</a>.
    </p>
  `;

  return wrapCorporateEmail({
    title: `An Update Regarding Your Lotus Tubes Order | ${displayRef}`,
    subtitle: 'Logistics, Operations & Live Order Tracking',
    preheader: `Order update for ${displayRef}: Current status is ${status}.`,
    contentHtml,
    agentId: 'arjun-yadav'
  });
};

export const buildOperationsUpdateEmail = buildOrderUpdateEmail;

/* ========================================================================= */
/* EMAIL TEMPLATE 9 — INTERNAL TEAM NOTIFICATION                             */
/* ========================================================================= */
export const buildInternalTeamNotificationEmail = ({
  notificationType = 'New Quotation Request',
  reference,
  summary,
  customerName,
  customerCompany,
  crmLink = 'https://lotustubes.com/#crm'
}) => {
  const contentHtml = `
    <div style="display: inline-block; background-color: #FEF3C7; border: 1px solid #FCD34D; border-radius: 9999px; padding: 3px 10px; font-size: 11px; font-weight: 700; color: #92400E; margin-bottom: 10px;">
      🔔 Internal Commercial Notification
    </div>
    <h2 style="color: ${BRAND_NAVY}; margin: 0 0 12px 0; font-size: 20px; font-weight: 800;">
      [INTERNAL] ${escapeHtml(notificationType)}: ${escapeHtml(reference || 'N/A')}
    </h2>

    <p style="margin: 0 0 14px 0; font-size: 14px; color: #334155; line-height: 1.6;">
      An action item has been registered in the Lotus Tubes CRM requiring commercial review or Super Admin authorization:
    </p>

    <div style="background-color: ${BRAND_LIGHT_BG}; border: 1px solid ${BRAND_BORDER}; border-radius: 8px; padding: 18px; margin: 18px 0; font-size: 13px; line-height: 1.7;">
      <p style="margin: 0 0 6px 0;"><strong>Event Type:</strong> <span style="color: ${BRAND_BLUE}; font-weight: 700;">${escapeHtml(notificationType)}</span></p>
      <p style="margin: 0 0 6px 0;"><strong>Record Reference:</strong> <span style="font-family: monospace; font-weight: 700;">${escapeHtml(reference || 'N/A')}</span></p>
      ${customerName ? `<p style="margin: 0 0 6px 0;"><strong>Client Name:</strong> ${escapeHtml(customerName)} ${customerCompany ? `(${escapeHtml(customerCompany)})` : ''}</p>` : ''}
      ${summary ? `<p style="margin: 8px 0 0 0; border-top: 1px dashed ${BRAND_BORDER}; padding-top: 8px; color: #1E293B;"><strong>Details:</strong> ${escapeHtml(summary)}</p>` : ''}
    </div>

    <div style="text-align: center; margin: 24px 0 10px 0;">
      <a href="${escapeHtml(crmLink)}" target="_blank" style="display: inline-block; background-color: ${BRAND_NAVY}; color: ${BRAND_WHITE}; text-decoration: none; font-size: 13px; font-weight: 700; padding: 10px 24px; border-radius: 6px;">
        Open Secure CRM Dashboard →
      </a>
    </div>

    <p style="margin: 16px 0 0 0; font-size: 11.5px; color: ${BRAND_MUTED}; text-align: center;">
      Confidential internal transmission for authorized Lotus Tubes staff &amp; Super Admin Chirag Shah.
    </p>
  `;

  return wrapCorporateEmail({
    title: `[INTERNAL] ${notificationType}: ${reference || 'Alert'}`,
    subtitle: 'Internal CRM Dispatch & Operational Alerts',
    preheader: `[Internal Alert] ${notificationType} - Reference: ${reference || 'N/A'}. Action required in CRM.`,
    contentHtml,
    agentId: 'system',
    showSignature: false
  });
};

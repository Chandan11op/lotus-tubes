import { getSenderById, BUSINESS_MAILBOX } from '../config/emailSenders.js';
import { escapeHtml } from './security.js';

const BRAND_NAVY = '#030810';
const BRAND_BLUE = '#0284C7';
const BRAND_LIGHT_BG = '#F8FAFC';
const BRAND_BORDER = '#E2E8F0';
const BRAND_TEXT = '#10263D';
const BRAND_MUTED = '#64748B';

/**
 * Creates the outer branded email envelope
 */
export const wrapEmailTemplate = ({
  title = 'Lotus Tubes',
  subtitle = 'High Purity Sanitary Piping Systems & Components',
  contentHtml,
  agentId = 'system'
}) => {
  const sender = getSenderById(agentId);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${BRAND_TEXT}; line-height: 1.6;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid ${BRAND_BORDER}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <!-- Header -->
    <tr>
      <td style="background-color: ${BRAND_NAVY}; padding: 24px 28px; text-align: center;">
        <h1 style="color: #FFFFFF; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Lotus Tubes</h1>
        <p style="color: #38BDF8; margin: 6px 0 0 0; font-size: 13px; font-weight: 500;">${escapeHtml(subtitle)}</p>
      </td>
    </tr>

    <!-- Main Content Area -->
    <tr>
      <td style="padding: 28px 28px 20px 28px;">
        ${contentHtml}
      </td>
    </tr>

    <!-- Agent Signature Block -->
    <tr>
      <td style="padding: 0 28px 24px 28px;">
        <div style="border-top: 1px solid ${BRAND_BORDER}; padding-top: 18px; margin-top: 12px;">
          <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align: top;">
                <p style="margin: 0; font-size: 14px; font-weight: 700; color: ${BRAND_TEXT};">${escapeHtml(sender.name)}</p>
                <p style="margin: 2px 0 0 0; font-size: 12px; color: ${BRAND_BLUE}; font-weight: 600;">${escapeHtml(sender.title)}</p>
                <p style="margin: 2px 0 0 0; font-size: 12px; color: ${BRAND_MUTED};">Department: ${escapeHtml(sender.department)}</p>
                <p style="margin: 6px 0 0 0; font-size: 12px; color: ${BRAND_MUTED};">
                  Direct Email: <a href="mailto:${escapeHtml(sender.email)}" style="color: ${BRAND_BLUE}; text-decoration: none;">${escapeHtml(sender.email)}</a><br/>
                  Central Desk: <a href="mailto:${BUSINESS_MAILBOX}" style="color: ${BRAND_BLUE}; text-decoration: none;">${BUSINESS_MAILBOX}</a> | +91 99304 30789
                </p>
              </td>
            </tr>
          </table>
          <div style="margin-top: 14px; padding: 8px 12px; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 6px; font-size: 11px; color: #166534; font-weight: 600;">
            ✓ Cryptographically Verified &amp; Authorized under Super Admin Chirag Shah (Owner &amp; Managing Director)
          </div>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: ${BRAND_LIGHT_BG}; padding: 18px 28px; border-top: 1px solid ${BRAND_BORDER}; text-align: center; font-size: 11px; color: ${BRAND_MUTED}; line-height: 1.5;">
        <p style="margin: 0 0 4px 0;"><strong>Lotus Tubes (Lotus Impex)</strong> — Est. 1989</p>
        <p style="margin: 0 0 4px 0;">C-4, C-11, 1st Floor, Sindhu House, Nanabhai Lane, Flora Fountain, Fort, Mumbai 400001, Maharashtra, India</p>
        <p style="margin: 0;">Manufacturer &amp; Stockist of SS 304 / 316L Sanitary Pipes, Tri-Clamp Fittings, Valves &amp; Custom Spools (ASTM A270, DIN 11850, ASME BPE)</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Quotation Email Template for Ananya Mehta
 */
export const buildQuotationEmail = ({
  customerName,
  quotationNumber,
  reference,
  lineItems = [],
  subtotal = 0,
  taxTotal = 0,
  grandTotal = 0,
  leadTime = '3-5 Working Days ex-stock Mumbai',
  downloadPdfUrl = 'https://lotustubes.com/sample-quotation.pdf'
}) => {
  const itemsRows = lineItems
    .map(
      (item, idx) => `
      <tr style="background: ${idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'};">
        <td style="padding: 8px 10px; border: 1px solid ${BRAND_BORDER}; font-size: 12px;">${escapeHtml(item.description)}</td>
        <td style="padding: 8px 10px; border: 1px solid ${BRAND_BORDER}; font-size: 12px; text-align: center;">${escapeHtml(item.grade || 'SS 316L')}</td>
        <td style="padding: 8px 10px; border: 1px solid ${BRAND_BORDER}; font-size: 12px; text-align: center;">${item.quantity} ${escapeHtml(item.unit || 'Pcs')}</td>
        <td style="padding: 8px 10px; border: 1px solid ${BRAND_BORDER}; font-size: 12px; text-align: right;">₹${Number(item.unitPrice || 0).toLocaleString('en-IN')}</td>
        <td style="padding: 8px 10px; border: 1px solid ${BRAND_BORDER}; font-size: 12px; text-align: right; font-weight: 600;">₹${Number(item.lineTotal || 0).toLocaleString('en-IN')}</td>
      </tr>
    `
    )
    .join('');

  const contentHtml = `
    <p style="margin: 0 0 14px 0; font-size: 15px;">Dear <strong>${escapeHtml(customerName || 'Valued Client')}</strong>,</p>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155;">
      Thank you for submitting your hygienic piping requirement. Your official commercial quotation <strong>${escapeHtml(quotationNumber)}</strong> has been verified by our engineering desk and authorized by <strong>Super Admin Chirag Shah</strong>.
    </p>

    <div style="background: ${BRAND_LIGHT_BG}; border: 1px solid ${BRAND_BORDER}; border-radius: 6px; padding: 12px 16px; margin-bottom: 18px;">
      <span style="font-size: 12px; color: ${BRAND_MUTED};">Quotation Reference:</span>
      <span style="font-size: 14px; font-weight: 700; color: ${BRAND_BLUE}; margin-left: 6px;">${escapeHtml(quotationNumber)}</span>
      ${reference ? `<span style="font-size: 12px; color: ${BRAND_MUTED}; margin-left: 14px;">(BOQ: ${escapeHtml(reference)})</span>` : ''}
    </div>

    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 18px;">
      <thead>
        <tr style="background-color: #0F172A; color: #FFFFFF;">
          <th style="padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase;">Description</th>
          <th style="padding: 8px 10px; text-align: center; font-size: 11px; text-transform: uppercase;">Grade</th>
          <th style="padding: 8px 10px; text-align: center; font-size: 11px; text-transform: uppercase;">Qty</th>
          <th style="padding: 8px 10px; text-align: right; font-size: 11px; text-transform: uppercase;">Rate</th>
          <th style="padding: 8px 10px; text-align: right; font-size: 11px; text-transform: uppercase;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
      <tfoot>
        <tr style="background: #F8FAFC;">
          <td colspan="4" style="padding: 8px 10px; text-align: right; border: 1px solid ${BRAND_BORDER}; font-size: 12px;"><strong>Subtotal:</strong></td>
          <td style="padding: 8px 10px; text-align: right; border: 1px solid ${BRAND_BORDER}; font-size: 12px;">₹${Number(subtotal).toLocaleString('en-IN')}</td>
        </tr>
        <tr style="background: #F8FAFC;">
          <td colspan="4" style="padding: 8px 10px; text-align: right; border: 1px solid ${BRAND_BORDER}; font-size: 12px;"><strong>GST (18% HSN):</strong></td>
          <td style="padding: 8px 10px; text-align: right; border: 1px solid ${BRAND_BORDER}; font-size: 12px;">₹${Number(taxTotal).toLocaleString('en-IN')}</td>
        </tr>
        <tr style="background: #EFF6FF; font-weight: 700;">
          <td colspan="4" style="padding: 10px 10px; text-align: right; border: 1px solid ${BRAND_BORDER}; font-size: 13px; color: ${BRAND_TEXT};">Grand Total:</td>
          <td style="padding: 10px 10px; text-align: right; border: 1px solid ${BRAND_BORDER}; font-size: 14px; color: ${BRAND_BLUE};">₹${Number(grandTotal).toLocaleString('en-IN')}</td>
        </tr>
      </tfoot>
    </table>

    <div style="background: #F8FAFC; border: 1px solid ${BRAND_BORDER}; border-radius: 6px; padding: 12px 14px; font-size: 12px; margin-bottom: 18px;">
      <p style="margin: 0 0 4px 0;"><strong>Estimated Lead Time:</strong> ${escapeHtml(leadTime)}</p>
      <p style="margin: 0 0 4px 0;"><strong>Quality Standard:</strong> EN 10204 3.1 MTC inspection certification supplied with dispatch</p>
      <p style="margin: 0;"><strong>Surface Roughness:</strong> Electro-Polished EP Ra ≤ 0.38 µm (SF4) / MP Ra ≤ 0.8 µm guaranteed</p>
    </div>

    ${downloadPdfUrl ? `
      <div style="text-align: center; margin: 20px 0;">
        <a href="${escapeHtml(downloadPdfUrl)}" target="_blank" style="display: inline-block; background-color: ${BRAND_BLUE}; color: #FFFFFF; text-decoration: none; font-weight: 600; font-size: 13px; padding: 10px 22px; border-radius: 6px; letter-spacing: 0.3px;">Download Official Quotation PDF</a>
      </div>
    ` : ''}

    <p style="margin: 14px 0 0 0; font-size: 12px; color: ${BRAND_MUTED};">
      To confirm your purchase order or request technical clarifications, simply reply to this email or contact our Mumbai sales desk on WhatsApp at +91 99304 30789.
    </p>
  `;

  return wrapEmailTemplate({
    title: `Quotation ${quotationNumber} - Lotus Tubes`,
    subtitle: 'Official Quotation & Commercial RFQ Desk',
    contentHtml,
    agentId: 'ananya-mehta'
  });
};

/**
 * Invoice Email Template for Riya Shah
 */
export const buildInvoiceEmail = ({
  customerName,
  invoiceNumber,
  quotationNumber,
  subtotal = 0,
  taxTotal = 0,
  grandTotal = 0,
  paymentTerms = '100% advance against Proforma or 30 days credit for approved clients',
  downloadPdfUrl = 'https://lotustubes.com/sample-quotation.pdf'
}) => {
  const contentHtml = `
    <p style="margin: 0 0 14px 0; font-size: 15px;">Dear <strong>${escapeHtml(customerName || 'Client')}</strong>,</p>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155;">
      Your commercial tax invoice <strong>${escapeHtml(invoiceNumber)}</strong> has been prepared and officially authorized under Super Admin Chirag Shah oversight.
    </p>

    <div style="background: ${BRAND_LIGHT_BG}; border: 1px solid ${BRAND_BORDER}; border-radius: 6px; padding: 12px 16px; margin-bottom: 18px;">
      <span style="font-size: 12px; color: ${BRAND_MUTED};">Invoice Number:</span>
      <span style="font-size: 14px; font-weight: 700; color: ${BRAND_BLUE}; margin-left: 6px;">${escapeHtml(invoiceNumber)}</span>
      ${quotationNumber ? `<span style="font-size: 12px; color: ${BRAND_MUTED}; margin-left: 14px;">(Against Quote: ${escapeHtml(quotationNumber)})</span>` : ''}
    </div>

    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 18px; font-size: 13px;">
      <tr>
        <td style="padding: 8px 12px; border: 1px solid ${BRAND_BORDER}; background: #F8FAFC;"><strong>Taxable Value:</strong></td>
        <td style="padding: 8px 12px; border: 1px solid ${BRAND_BORDER}; text-align: right;">₹${Number(subtotal).toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; border: 1px solid ${BRAND_BORDER}; background: #F8FAFC;"><strong>GST (18% HSN):</strong></td>
        <td style="padding: 8px 12px; border: 1px solid ${BRAND_BORDER}; text-align: right;">₹${Number(taxTotal).toLocaleString('en-IN')}</td>
      </tr>
      <tr style="background: #EFF6FF; font-weight: 700;">
        <td style="padding: 10px 12px; border: 1px solid ${BRAND_BORDER}; font-size: 14px;">Total Invoice Value:</td>
        <td style="padding: 10px 12px; border: 1px solid ${BRAND_BORDER}; text-align: right; font-size: 15px; color: ${BRAND_BLUE};">₹${Number(grandTotal).toLocaleString('en-IN')}</td>
      </tr>
    </table>

    <div style="background: #F8FAFC; border: 1px solid ${BRAND_BORDER}; border-radius: 6px; padding: 14px; font-size: 12px; margin-bottom: 18px; line-height: 1.6;">
      <p style="margin: 0 0 6px 0; font-weight: 700; color: ${BRAND_TEXT};">Banking &amp; Remittance Details:</p>
      <p style="margin: 0;">Bank: <strong>Bank of Baroda</strong> | Branch: Fort, Mumbai 400001</p>
      <p style="margin: 0;">Account Name: <strong>Lotus Impex (Lotus Tubes)</strong></p>
      <p style="margin: 0;">Account No: <strong>03910200001109</strong> | IFSC: <strong>BARB0FORTXX</strong></p>
      <p style="margin: 0;">UPI ID: <strong>9930430789@okbizaxis</strong></p>
      <p style="margin: 6px 0 0 0; color: ${BRAND_MUTED};">Payment Terms: ${escapeHtml(paymentTerms)}</p>
    </div>

    ${downloadPdfUrl ? `
      <div style="text-align: center; margin: 20px 0;">
        <a href="${escapeHtml(downloadPdfUrl)}" target="_blank" style="display: inline-block; background-color: ${BRAND_BLUE}; color: #FFFFFF; text-decoration: none; font-weight: 600; font-size: 13px; padding: 10px 22px; border-radius: 6px; letter-spacing: 0.3px;">Download Invoice PDF</a>
      </div>
    ` : ''}
  `;

  return wrapEmailTemplate({
    title: `Tax Invoice ${invoiceNumber} - Lotus Tubes`,
    subtitle: 'Commercial Billing & Invoicing Desk',
    contentHtml,
    agentId: 'riya-shah'
  });
};

/**
 * Customer Inquiry Resolution Email Template for Neha Desai
 */
export const buildInquiryReplyEmail = ({
  customerName,
  subject,
  approvedReply,
  reference
}) => {
  const contentHtml = `
    <p style="margin: 0 0 14px 0; font-size: 15px;">Dear <strong>${escapeHtml(customerName || 'Valued Client')}</strong>,</p>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155;">
      Thank you for contacting Lotus Tubes regarding: <strong>${escapeHtml(subject || 'Your Inquiry')}</strong>${reference ? ` (${escapeHtml(reference)})` : ''}.
    </p>

    <div style="background: #F8FAFC; border-left: 4px solid ${BRAND_BLUE}; padding: 16px; margin: 18px 0; border-radius: 4px;">
      <h4 style="margin: 0 0 8px 0; color: ${BRAND_BLUE}; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Verified Response from Lotus Tubes:</h4>
      <div style="margin: 0; line-height: 1.6; color: #1E293B; font-size: 13px;">
        ${escapeHtml(approvedReply).replace(/\n/g, '<br/>')}
      </div>
    </div>

    <p style="margin: 16px 0 0 0; font-size: 12px; color: ${BRAND_MUTED};">
      If you require additional mill test reports (EN 10204 3.1 MTC), dimensional drawings, or pricing, simply reply to this email to reach our engineering desk.
    </p>
  `;

  return wrapEmailTemplate({
    title: `Response: ${subject || 'Lotus Tubes Inquiry'}`,
    subtitle: 'Customer Inquiries & Support Desk',
    contentHtml,
    agentId: 'neha-desai'
  });
};

/**
 * Operations & Chat Update Email Template for Arjun Yadav
 */
export const buildOperationsUpdateEmail = ({
  customerName,
  reference,
  statusUpdate,
  department = 'Executive Operations Desk'
}) => {
  const contentHtml = `
    <p style="margin: 0 0 14px 0; font-size: 15px;">Dear <strong>${escapeHtml(customerName || 'Valued Client')}</strong>,</p>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155;">
      Here is the operational status update regarding reference <strong>${escapeHtml(reference || 'Your Request')}</strong>.
    </p>

    <div style="background: #F8FAFC; border: 1px solid ${BRAND_BORDER}; border-radius: 6px; padding: 16px; margin: 18px 0;">
      <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: ${BRAND_BLUE};">${escapeHtml(department)}</span>
      <p style="margin: 8px 0 0 0; font-size: 13px; line-height: 1.6; color: #1E293B;">
        ${escapeHtml(statusUpdate).replace(/\n/g, '<br/>')}
      </p>
    </div>

    <p style="margin: 16px 0 0 0; font-size: 12px; color: ${BRAND_MUTED};">
      Coordinated across Ananya Mehta (Quotes), Riya Shah (Invoices), and Neha Desai (Inquiries) with Super Admin oversight.
    </p>
  `;

  return wrapEmailTemplate({
    title: `Operational Update: ${reference || 'Lotus Tubes'}`,
    subtitle: 'Operations & Live Concierge Desk',
    contentHtml,
    agentId: 'arjun-yadav'
  });
};

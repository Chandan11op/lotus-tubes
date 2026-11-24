import { Contact } from '../models/Contact.js';
import { Customer } from '../models/Customer.js';
import { Enquiry } from '../models/Enquiry.js';
import { sendEmail } from '../services/emailService.js';
import { processContactWithNeha } from '../services/agentOrchestrator.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { assertDatabaseConnected } from '../config/db.js';
import { escapeHtml, generateReference, sanitizeText } from '../utils/security.js';
import { validateEmail } from '../middleware/validateRequest.js';
import { config } from '../config/env.js';
import { wrapEmailTemplate } from '../utils/emailTemplates.js';

export const submitContact = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { name, company, email, phone, subject, message } = req.body;

    const safeName = sanitizeText(name, 100);
    const safeCompany = sanitizeText(company || 'Individual / Business Client', 120);
    const safeEmail = (email || '').toLowerCase().trim();
    const safePhone = sanitizeText(phone, 30);
    const safeSubject = sanitizeText(subject || 'General Enquiry', 150);
    const safeMessage = sanitizeText(message || '', 2000);
    const reference = generateReference('LT-CNT');

    // Save Contact document
    const savedContact = await Contact.create({
      name: safeName,
      company: safeCompany,
      email: safeEmail,
      phone: safePhone,
      subject: safeSubject,
      message: safeMessage,
      status: 'New'
    });

    // Automatically capture into CRM leads & Customer directory
    let customer = await Customer.findOne({ email: safeEmail });
    if (!customer) {
      customer = await Customer.create({
        name: safeName,
        company: safeCompany,
        email: safeEmail,
        phone: safePhone,
        status: 'Lead',
        notes: [{ content: `Contact inquiry received (${reference}): ${safeSubject}`, author: 'Contact Form' }]
      });
    }

    await Enquiry.create({
      reference,
      productName: `Contact Inquiry: ${safeSubject}`,
      name: safeName,
      company: safeCompany,
      email: safeEmail,
      phone: safePhone,
      location: 'Website Contact Page',
      quantity: 'General',
      notes: safeMessage,
      sourceChannel: 'Website RFQ',
      priority: 'Medium',
      status: 'New',
      customerId: customer._id
    });

    // Route inquiry to Agent 3: Neha Desai (enforcing Super Admin confirmation workflow)
    try {
      await processContactWithNeha(savedContact, customer._id);
    } catch (agentErr) {
      console.warn('Agent 3 (Neha Desai) task creation warning:', agentErr.message);
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #10263D; max-width: 600px; margin: 0 auto; border: 1px solid #E3E8EF; border-radius: 8px; overflow: hidden;">
        <div style="background: #10263D; padding: 20px; text-align: center;">
          <h2 style="color: #FFFFFF; margin: 0;">Lotus Tubes</h2>
          <p style="color: #CBD5E1; margin: 4px 0 0 0; font-size: 13px;">New Contact Message Received</p>
        </div>
        <div style="padding: 24px;">
          <h3>Contact Inquiry (${escapeHtml(reference)})</h3>
          <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
          <p><strong>Company:</strong> ${escapeHtml(safeCompany)}</p>
          <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(safePhone)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background:#F8FAFC;padding:12px;border-left:4px solid #0284C7;margin:12px 0;">
            ${escapeHtml(safeMessage).replace(/\n/g, '<br/>')}
          </blockquote>
        </div>
      </div>
    `;

    // Asynchronously dispatch internal notification and customer acknowledgement
    setImmediate(async () => {
      try {
        // 1. Internal business notification to sales@lotustubes.com
        await sendEmail({
          agentId: 'system',
          to: config.resend.notificationEmail || 'sales@lotustubes.com',
          subject: `[Contact Us ${reference}] ${safeSubject} from ${safeName} (${safeCompany})`,
          html: emailHtml,
          replyTo: safeEmail,
          reference,
          enquiryId: savedContact?._id,
          idempotencyKey: `internal_contact_${reference}`
        });

        // 2. Customer acknowledgement dispatched via Agent 3 (Neha Desai)
        const ackHtml = wrapEmailTemplate({
          title: `Inquiry Received - ${reference}`,
          subtitle: 'Client Inquiries & Support Desk • High Purity Sanitary Stainless Steel',
          contentHtml: `
            <p style="font-size: 15px; color: #0C225E; margin: 0 0 12px 0;">Dear <strong>${escapeHtml(safeName)}</strong>,</p>
            <p style="font-size: 14px; color: #334155; line-height: 1.6; margin: 0 0 14px 0;">
              Thank you for reaching out to <strong>Lotus Tubes</strong>. Your inquiry regarding <strong>${escapeHtml(safeSubject)}</strong> has been registered under official reference <strong style="color: #E93984; font-family: monospace;">${escapeHtml(reference)}</strong>.
            </p>
            <p style="font-size: 14px; color: #334155; line-height: 1.6; margin: 0 0 16px 0;">
              Our sales engineering desk and Managing Director Chirag Shah are reviewing your requirements. We will provide our verified technical specification and pricing response promptly.
            </p>
            <div style="background-color: #FDF2F8; padding: 16px 20px; border-left: 4px solid #E93984; border-radius: 6px; margin: 18px 0; font-size: 13px; line-height: 1.7; color: #0F172A;">
              <strong style="color: #0C225E; font-size: 13.5px; display: block; margin-bottom: 6px;">📋 Submitted Requirement Summary:</strong>
              <strong>Company / Client:</strong> ${escapeHtml(safeCompany)}<br/>
              <strong>Phone / WhatsApp:</strong> ${escapeHtml(safePhone || 'N/A')}<br/>
              <strong>Inquiry Subject:</strong> ${escapeHtml(safeSubject)}<br/>
              <strong>Tracking Reference:</strong> <span style="font-family: monospace; font-weight: 700; color: #E93984;">${escapeHtml(reference)}</span>
            </div>
            <p style="font-size: 12.5px; color: #475569; line-height: 1.6; margin: 16px 0 0 0;">
              For urgent material requirements or instant WhatsApp quotation, reach our Mumbai sales desk directly on WhatsApp at <a href="https://wa.me/919867304316?text=${encodeURIComponent(`Hello Lotus Tubes, checking status for inquiry ${reference}`)}" style="color: #E93984; font-weight: 700; text-decoration: none;">+91 9867304316</a>.
            </p>
          `,
          agentId: 'neha-desai'
        });

        await sendEmail({
          agentId: 'neha-desai',
          to: safeEmail,
          subject: `[Lotus Tubes Received: ${reference}] Thank you for contacting our sales desk`,
          html: ackHtml,
          replyTo: 'sales@lotustubes.com',
          reference,
          idempotencyKey: `customer_ack_${reference}`
        });
      } catch (err) {
        console.error('Async contact email failed', reference, err.message);
      }
    });

    return successResponse(
      res,
      {
        received: true,
        reference,
        persisted: !!savedContact
      },
      'Thank you for contacting Lotus Tubes. Our team will get back to you shortly.',
      201
    );
  } catch (error) {
    next(error);
  }
};

export const submitQualityRequest = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { company, email, product, docType, phone } = req.body;

    const safeCompany = sanitizeText(company || '', 120);
    const safeEmail = (email || '').toLowerCase().trim();
    const safeProduct = sanitizeText(product || 'General Sanitary Component', 120);
    const safeDocType = sanitizeText(docType || 'EN 10204 3.1 MTC', 100);
    const safePhone = sanitizeText(phone || '', 30);
    const reference = generateReference('LT-QC');

    if (!safeCompany || !safeEmail || !validateEmail(safeEmail)) {
      return errorResponse(res, 'Company name and a valid email address are required', 422);
    }

    // Save into customer CRM database
    let customer = await Customer.findOne({ email: safeEmail });
    if (!customer) {
      customer = await Customer.create({
        name: safeCompany,
        company: safeCompany,
        email: safeEmail,
        phone: safePhone || 'N/A',
        status: 'Lead',
        notes: [{ content: `Quality document requested (${reference}): ${safeDocType} for ${safeProduct}`, author: 'QC Portal' }]
      });
    } else {
      customer.notes.push({
        content: `Quality document requested (${reference}): ${safeDocType} for ${safeProduct}`,
        author: 'QC Portal'
      });
      await customer.save();
    }

    // Persist as enquiry in CRM
    await Enquiry.create({
      reference,
      productName: `Document Request: ${safeDocType}`,
      name: safeCompany,
      company: safeCompany,
      email: safeEmail,
      phone: safePhone || 'N/A',
      location: 'Website Quality Documentation Page',
      quantity: '1 Document Set',
      notes: `Requested Document: ${safeDocType}\nProduct/Heat No: ${safeProduct}`,
      sourceChannel: 'Website RFQ',
      priority: 'High',
      status: 'New',
      customerId: customer._id
    });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #10263D; max-width: 600px; margin: 0 auto; border: 1px solid #E3E8EF; border-radius: 8px; overflow: hidden;">
        <div style="background: #10263D; padding: 20px; text-align: center;">
          <h2 style="color: #FFFFFF; margin: 0;">Lotus Tubes</h2>
          <p style="color: #CBD5E1; margin: 4px 0 0 0; font-size: 13px;">Technical Document & MTC Request</p>
        </div>
        <div style="padding: 24px;">
          <h3>Quality Document Request (${escapeHtml(reference)})</h3>
          <p><strong>Company:</strong> ${escapeHtml(safeCompany)}</p>
          <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
          <p><strong>Phone / WhatsApp:</strong> ${escapeHtml(safePhone || 'N/A')}</p>
          <p><strong>Requested Document:</strong> ${escapeHtml(safeDocType)}</p>
          <p><strong>Product / Heat No.:</strong> ${escapeHtml(safeProduct)}</p>
        </div>
      </div>
    `;

    // Asynchronously dispatch internal notification and customer acknowledgement
    setImmediate(async () => {
      try {
        // 1. Internal business notification to sales@lotustubes.com
        await sendEmail({
          agentId: 'system',
          to: config.resend.notificationEmail || 'sales@lotustubes.com',
          subject: `[Quality Document Request ${reference}] ${safeDocType} - ${safeCompany}`,
          html: emailHtml,
          replyTo: safeEmail,
          reference,
          idempotencyKey: `internal_qc_${reference}`
        });

        // 2. Customer acknowledgement from Agent 3 (Neha Desai)
        const ackHtml = wrapEmailTemplate({
          title: `Technical Document Request - ${reference}`,
          subtitle: 'Quality Control & Documentation Desk',
          contentHtml: `
            <p>Dear <strong>${escapeHtml(safeCompany)}</strong> Team,</p>
            <p>We have received your technical document request for <strong>${escapeHtml(safeDocType)}</strong> (Ref: <strong>${escapeHtml(reference)}</strong>).</p>
            <p>Our quality control department is verifying the heat number / batch record for <em>${escapeHtml(safeProduct)}</em>. We will dispatch the verified document to this email address within 24 hours.</p>
            <div style="background:#F8FAFC;padding:12px;border-left:4px solid #0284C7;margin:12px 0;font-size:12px;">
              <strong>Requested Document:</strong> ${escapeHtml(safeDocType)}<br/>
              <strong>Product / Heat No.:</strong> ${escapeHtml(safeProduct)}<br/>
              <strong>Standard:</strong> EN 10204 3.1 / ASME BPE Inspection Certificate
            </div>
          `,
          agentId: 'neha-desai'
        });

        await sendEmail({
          agentId: 'neha-desai',
          to: safeEmail,
          subject: `[Quality Desk ${reference}] Document Request Received - ${safeDocType}`,
          html: ackHtml,
          replyTo: 'sales@lotustubes.com',
          reference,
          idempotencyKey: `customer_qc_ack_${reference}`
        });
      } catch (err) {
        console.error('Async quality email failed', reference, err.message);
      }
    });

    return successResponse(
      res,
      {
        received: true,
        reference
      },
      'Your technical document request has been received. Our QC desk will verify and dispatch within 24 hours.',
      201
    );
  } catch (error) {
    next(error);
  }
};

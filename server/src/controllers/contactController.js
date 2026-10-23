import { Contact } from '../models/Contact.js';
import { Customer } from '../models/Customer.js';
import { Enquiry } from '../models/Enquiry.js';
import { sendEmail } from '../services/emailService.js';
import { successResponse } from '../utils/responseHandler.js';
import { assertDatabaseConnected } from '../config/db.js';
import { escapeHtml, generateReference, sanitizeText } from '../utils/security.js';

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

    await sendEmail({
      subject: `[Contact Us ${reference}] ${safeSubject} from ${safeName} (${safeCompany})`,
      html: emailHtml,
      replyTo: safeEmail
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

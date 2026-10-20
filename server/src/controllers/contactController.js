import { Contact } from '../models/Contact.js';
import { sendEmail } from '../services/emailService.js';
import { successResponse } from '../utils/responseHandler.js';
import { getDBStatus } from '../config/db.js';

export const submitContact = async (req, res, next) => {
  try {
    const { name, company, email, phone, subject, message } = req.body;

    let savedContact = null;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      try {
        savedContact = await Contact.create({
          name,
          company: company || '',
          email,
          phone,
          subject: subject || 'General Contact Form',
          message,
          status: 'New'
        });
      } catch (dbErr) {
        console.warn('⚠️ Could not save contact to MongoDB:', dbErr.message);
      }
    }

    const emailHtml = `
      <h2>New Contact Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company || 'N/A'}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Subject:</strong> ${subject || 'General Enquiry'}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="background:#f4f4f4;padding:12px;border-left:4px solid #0284C7;">
        ${message.replace(/\n/g, '<br/>')}
      </blockquote>
      <hr />
      <p><small>Sent from Lotus Tubes Contact Us Page</small></p>
    `;

    await sendEmail({
      subject: `[Contact Us] ${subject || 'Website Message'} from ${name} (${company || 'Individual'})`,
      html: emailHtml,
      replyTo: email
    });

    return successResponse(
      res,
      {
        received: true,
        persisted: !!savedContact
      },
      'Thank you for contacting Lotus Tubes. Our team will get back to you shortly.',
      201
    );
  } catch (error) {
    next(error);
  }
};

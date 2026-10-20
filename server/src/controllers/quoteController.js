import { Quote } from '../models/Quote.js';
import { sendEmail } from '../services/emailService.js';
import { successResponse } from '../utils/responseHandler.js';
import { getDBStatus } from '../config/db.js';

export const submitQuote = async (req, res, next) => {
  try {
    const { name, company, email, phone, location, projectType, materialGrade, finishRequired, boqSummary, timeline } = req.body;

    const reference = `LT-BOQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let savedQuote = null;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      try {
        savedQuote = await Quote.create({
          reference,
          name,
          company,
          email,
          phone,
          location: location || '',
          projectType: projectType || 'Sanitary Piping',
          materialGrade: materialGrade || 'SS 316L',
          finishRequired: finishRequired || 'Electro Polished (EP)',
          boqSummary: boqSummary || '',
          timeline: timeline || 'Standard',
          status: 'Received'
        });
      } catch (dbErr) {
        console.warn('⚠️ Could not save quote to MongoDB:', dbErr.message);
      }
    }

    const emailHtml = `
      <h2>New Detailed RFQ / BOQ Submission</h2>
      <p><strong>Reference:</strong> ${reference}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Project Type:</strong> ${projectType || 'N/A'}</p>
      <p><strong>Material Grade:</strong> ${materialGrade || 'SS 316L'}</p>
      <p><strong>Finish Required:</strong> ${finishRequired || 'EP'}</p>
      <p><strong>Delivery Location:</strong> ${location || 'N/A'}</p>
      <p><strong>Timeline:</strong> ${timeline || 'Standard'}</p>
      <p><strong>BOQ Requirements:</strong></p>
      <blockquote style="background:#f4f4f4;padding:12px;border-left:4px solid #0284C7;">
        ${(boqSummary || 'No details entered').replace(/\n/g, '<br/>')}
      </blockquote>
      <hr />
      <p><small>Sent via Lotus Tubes BOQ Submission Service</small></p>
    `;

    await sendEmail({
      subject: `[RFQ ${reference}] ${company} - ${projectType || 'BOQ Request'}`,
      html: emailHtml,
      replyTo: email
    });

    return successResponse(
      res,
      {
        reference,
        status: 'Received',
        persisted: !!savedQuote
      },
      'Detailed quote request submitted successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

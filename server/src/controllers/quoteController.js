import { Quote } from '../models/Quote.js';
import { sendEmail } from '../services/emailService.js';
import { sendWhatsAppQuotation } from '../services/whatsappService.js';
import { successResponse } from '../utils/responseHandler.js';
import { getDBStatus } from '../config/db.js';
import { memoryQuotes } from '../utils/memoryStore.js';

export const submitQuote = async (req, res, next) => {
  try {
    const { name, company, email, phone, location, projectType, materialGrade, finishRequired, boqSummary, timeline } = req.body;

    const reference = `LT-BOQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const samplePdfUrl = '/sample-quotation.pdf';
    const userId = req.user ? req.user.id : null;

    // 1. Send customer email confirmation
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; color: #10263D; max-width: 600px; margin: 0 auto; border: 1px solid #E3E8EF; border-radius: 8px; overflow: hidden;">
        <div style="background: #10263D; padding: 20px; text-align: center;">
          <h2 style="color: #FFFFFF; margin: 0;">Lotus Tubes</h2>
          <p style="color: #CBD5E1; margin: 4px 0 0 0; font-size: 13px;">Stainless Steel Sanitary Solutions</p>
        </div>
        <div style="padding: 24px;">
          <h3 style="color: #0284C7; margin-top: 0;">Detailed BOQ / RFQ Submission Received</h3>
          <p>Dear <strong>${name}</strong>,</p>
          <p>We have received your detailed Bill of Quantities submission (Ref: <strong>${reference}</strong>).</p>
          
          <div style="background: #F8FAFC; border: 1px solid #E3E8EF; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Company:</strong> ${company}</p>
            <p style="margin: 4px 0;"><strong>Project Type:</strong> ${projectType || 'Sanitary Piping'}</p>
            <p style="margin: 4px 0;"><strong>Material Grade:</strong> ${materialGrade || 'SS 316L'}</p>
            <p style="margin: 4px 0;"><strong>Surface Finish:</strong> ${finishRequired || 'EP'}</p>
            <p style="margin: 4px 0;"><strong>Delivery Location:</strong> ${location || 'N/A'}</p>
            <p style="margin: 4px 0;"><strong>BOQ Summary:</strong> ${(boqSummary || '').replace(/\n/g, '<br/>')}</p>
          </div>

          <p><strong>Sample Quotation Document:</strong></p>
          <p>Inspect our sample format here: <a href="https://lotus-tubes-react-design.vercel.app/sample-quotation.pdf" style="color: #F00078; font-weight: bold;">Download Sample Quotation PDF</a></p>

          <div style="background: #FFF0F6; border-left: 4px solid #F00078; padding: 12px; margin: 20px 0; font-size: 13px; color: #831843;">
            <strong>Notice:</strong> This email confirms receipt of your BOQ. Our estimation engineers will prepare an official quotation with per-meter rates and dispatch terms within 2-4 business hours.
          </div>
        </div>
      </div>
    `;

    const customerEmailResult = await sendEmail({
      to: email,
      subject: `[BOQ Receipt ${reference}] Lotus Tubes - ${projectType || 'Sanitary Piping'}`,
      html: customerEmailHtml,
      replyTo: 'sales@lotustubes.com'
    });

    const emailStatus = customerEmailResult.delivered ? 'sent' : (customerEmailResult.demoMode ? 'pending' : 'failed');

    // 2. Send internal sales desk notification
    const internalEmailHtml = `
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
    `;

    await sendEmail({
      subject: `[RFQ ${reference}] ${company} - ${projectType || 'BOQ Request'}`,
      html: internalEmailHtml,
      replyTo: email
    });

    // 3. Trigger WhatsApp delivery integration
    const whatsappResult = await sendWhatsAppQuotation({
      phone,
      customerName: name,
      reference,
      productName: projectType || 'Detailed BOQ Submission',
      quantity: 'As per BOQ schedule',
      samplePdfUrl: 'https://lotus-tubes-react-design.vercel.app/sample-quotation.pdf'
    });

    const whatsappStatus = whatsappResult.status || 'not_configured';

    // 4. Persist in MongoDB
    const quoteDoc = {
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
      userId,
      samplePdfUrl,
      emailStatus,
      whatsappStatus,
      status: 'Received',
      createdAt: new Date()
    };

    memoryQuotes.unshift(quoteDoc);

    if (dbStatus.connected) {
      try {
        savedQuote = await Quote.create(quoteDoc);
      } catch (dbErr) {
        console.warn('⚠️ Could not save quote to MongoDB:', dbErr.message);
      }
    }

    return successResponse(
      res,
      {
        reference,
        status: 'Received',
        persisted: !!savedQuote || true,
        emailStatus,
        whatsappStatus,
        samplePdfUrl,
        whatsappDirectLink: whatsappResult.directLink || null
      },
      'Detailed quote request submitted successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

export const getQuotes = async (req, res, next) => {
  try {
    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      const quotes = await Quote.find().sort({ createdAt: -1 }).limit(100);
      return successResponse(res, quotes);
    }
    return successResponse(res, memoryQuotes);
  } catch (error) {
    next(error);
  }
};

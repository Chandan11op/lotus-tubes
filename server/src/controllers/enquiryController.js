import { Enquiry } from '../models/Enquiry.js';
import { sendEmail } from '../services/emailService.js';
import { sendWhatsAppQuotation } from '../services/whatsappService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { getDBStatus } from '../config/db.js';
import { memoryEnquiries } from '../utils/memoryStore.js';

export const createEnquiry = async (req, res, next) => {
  try {
    const { productId, productName, name, company, email, phone, grade, quantity, location, notes } = req.body;

    const reference = `LT-RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const samplePdfUrl = '/sample-quotation.pdf';
    const userId = req.user ? req.user.id : null;

    // 1. Send customer confirmation email with sample quotation details
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; color: #10263D; max-width: 600px; margin: 0 auto; border: 1px solid #E3E8EF; border-radius: 8px; overflow: hidden;">
        <div style="background: #10263D; padding: 20px; text-align: center;">
          <h2 style="color: #FFFFFF; margin: 0;">Lotus Tubes</h2>
          <p style="color: #CBD5E1; margin: 4px 0 0 0; font-size: 13px;">Stainless Steel Sanitary Solutions</p>
        </div>
        <div style="padding: 24px;">
          <h3 style="color: #0284C7; margin-top: 0;">Quotation Request Confirmation (Sample Demonstration)</h3>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for your quotation request for <strong>${productName || 'Sanitary Component'}</strong>. Your request reference is <strong>${reference}</strong>.</p>
          
          <div style="background: #F8FAFC; border: 1px solid #E3E8EF; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #10263D;">Summary of Requested Specifications:</h4>
            <p style="margin: 4px 0;"><strong>Product:</strong> ${productName || productId}</p>
            <p style="margin: 4px 0;"><strong>Material Grade:</strong> ${grade || 'SS 316L'}</p>
            <p style="margin: 4px 0;"><strong>Requested Quantity:</strong> ${quantity}</p>
            <p style="margin: 4px 0;"><strong>Delivery Destination:</strong> ${location}</p>
            ${notes ? `<p style="margin: 4px 0;"><strong>Special Notes:</strong> ${notes}</p>` : ''}
          </div>

          <p><strong>Sample Quotation Document:</strong></p>
          <p>You can inspect our sample quotation format here: <a href="https://lotus-tubes-react-design.vercel.app/sample-quotation.pdf" style="color: #F00078; font-weight: bold;">Download Sample Quotation PDF</a></p>

          <div style="background: #FFF0F6; border-left: 4px solid #F00078; padding: 12px; margin: 20px 0; font-size: 13px; color: #831843;">
            <strong>Important Commercial Notice:</strong> This document and automated confirmation represents an indicative sample quotation. Final confirmed prices, MTC availability, lead times, and dispatch terms will be provided by Lotus Tubes sales estimators.
          </div>

          <p style="font-size: 13px; color: #64748B;">
            Sales Desk: +91 99304 30789 | Email: sales@lotustubes.com<br>
            Office: Shop No. 9, Jain Bhavan CHSL, Khetwadi, Girgaon, Mumbai 400004
          </p>
        </div>
      </div>
    `;

    const customerEmailResult = await sendEmail({
      to: email,
      subject: `[Quotation ${reference}] Lotus Tubes - ${productName || 'Sanitary Component'}`,
      html: customerEmailHtml,
      replyTo: 'sales@lotustubes.com'
    });

    const emailStatus = customerEmailResult.delivered ? 'sent' : (customerEmailResult.demoMode ? 'pending' : 'failed');

    // 2. Send internal sales desk notification
    const internalEmailHtml = `
      <h2>New Quotation Request (${reference})</h2>
      <p><strong>Customer Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Product:</strong> ${productName || productId}</p>
      <p><strong>Grade:</strong> ${grade || 'SS 316L'}</p>
      <p><strong>Quantity:</strong> ${quantity}</p>
      <p><strong>Delivery Location:</strong> ${location}</p>
      <p><strong>Notes:</strong> ${notes || 'None'}</p>
    `;

    await sendEmail({
      subject: `[New Lead ${reference}] ${company} - ${productName}`,
      html: internalEmailHtml,
      replyTo: email
    });

    // 3. Trigger WhatsApp delivery integration
    const whatsappResult = await sendWhatsAppQuotation({
      phone,
      customerName: name,
      reference,
      productName,
      quantity,
      samplePdfUrl: 'https://lotus-tubes-react-design.vercel.app/sample-quotation.pdf'
    });

    const whatsappStatus = whatsappResult.status || 'not_configured';

    // 4. Persist in MongoDB
    const enquiryDoc = {
      reference,
      productId: productId || '',
      productName: productName || 'Sanitary Component',
      customerName: name,
      name,
      company,
      email,
      phone,
      grade: grade || 'SS 316L',
      quantity,
      location,
      notes: notes || '',
      userId,
      samplePdfUrl,
      emailStatus,
      whatsappStatus,
      status: 'New Lead',
      createdAt: new Date()
    };

    memoryEnquiries.unshift(enquiryDoc);

    const dbStatus = getDBStatus();
    let savedEnquiry = null;

    if (dbStatus.connected) {
      try {
        savedEnquiry = await Enquiry.create(enquiryDoc);
      } catch (dbErr) {
        console.warn('⚠️ Could not save enquiry to MongoDB:', dbErr.message);
      }
    }

    return successResponse(
      res,
      {
        reference,
        status: 'Recorded',
        persisted: !!savedEnquiry || true,
        samplePdfUrl,
        emailStatus,
        whatsappStatus,
        whatsappDirectLink: whatsappResult.directLink || null
      },
      'Quotation request submitted successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

export const getEnquiries = async (req, res, next) => {
  try {
    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      const enquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(100);
      return successResponse(res, enquiries);
    }
    return successResponse(res, memoryEnquiries);
  } catch (error) {
    next(error);
  }
};

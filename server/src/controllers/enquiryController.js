import { Enquiry } from '../models/Enquiry.js';
import { sendEmail } from '../services/emailService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { getDBStatus } from '../config/db.js';

export const createEnquiry = async (req, res, next) => {
  try {
    const { productId, productName, name, company, email, phone, grade, quantity, location, notes } = req.body;

    const reference = `LT-RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let savedEnquiry = null;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      try {
        savedEnquiry = await Enquiry.create({
          reference,
          productId: productId || '',
          productName: productName || 'Sanitary Component',
          name,
          company,
          email,
          phone,
          grade: grade || 'SS 316L',
          quantity,
          location,
          notes: notes || '',
          status: 'New Lead'
        });
      } catch (dbErr) {
        console.warn('⚠️ Could not save enquiry to MongoDB:', dbErr.message);
      }
    }

    // Send email notification to sales desk
    const emailHtml = `
      <h2>New Product Enquiry Received</h2>
      <p><strong>Reference:</strong> ${reference}</p>
      <p><strong>Product:</strong> ${productName || productId || 'General Product'}</p>
      <p><strong>Customer Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone / WhatsApp:</strong> ${phone}</p>
      <p><strong>Material Grade:</strong> ${grade || 'SS 316L'}</p>
      <p><strong>Estimated Quantity:</strong> ${quantity}</p>
      <p><strong>Delivery Location:</strong> ${location}</p>
      <p><strong>Notes / Specs:</strong> ${notes || 'None specified'}</p>
      <hr />
      <p><small>Sent via Lotus Tubes B2B Enquiry Service</small></p>
    `;

    await sendEmail({
      subject: `[Enquiry ${reference}] ${company} - ${productName || 'Sanitary Component'}`,
      html: emailHtml,
      replyTo: email
    });

    return successResponse(
      res,
      {
        reference,
        status: 'Recorded',
        persisted: !!savedEnquiry
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
    if (!dbStatus.connected) {
      return successResponse(res, [], 'Database in offline mode; returning empty list');
    }
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(50);
    return successResponse(res, enquiries);
  } catch (error) {
    next(error);
  }
};

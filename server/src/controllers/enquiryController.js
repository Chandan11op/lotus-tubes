import { Enquiry } from '../models/Enquiry.js';
import { Customer } from '../models/Customer.js';
import { sendEmail } from '../services/emailService.js';
import { sendWhatsAppQuotation } from '../services/whatsappService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { assertDatabaseConnected } from '../config/db.js';
import { escapeHtml, generateReference, sanitizeText } from '../utils/security.js';
import { recordAuditEvent } from '../utils/auditLogger.js';

export const createEnquiry = async (req, res, next) => {
  try {
    assertDatabaseConnected();

    const {
      productId,
      productName,
      grade,
      materialGrade,
      productType,
      nominalSize,
      outsideDiameter,
      wallThickness,
      standard,
      unit,
      quantity,
      location,
      notes,
      finish,
      sizes,
      country,
      sourceChannel
    } = req.body;

    const reference = generateReference('LT-RFQ');
    const samplePdfUrl = '/sample-quotation.pdf';
    const userId = req.user ? (req.user.id || req.user._id) : null;

    // Anti-spoofing: if customer is authenticated, use trusted session details
    const name = sanitizeText(req.user?.name || req.body.name || '', 100);
    const company = sanitizeText(req.user?.company || req.body.company || '', 120);
    const email = (req.user?.email || req.body.email || '').toLowerCase().trim();
    const phone = sanitizeText(req.user?.phone || req.body.phone || '', 30);
    const safeCountry = sanitizeText(country || 'India', 50);
    const safeLocation = sanitizeText(location || 'Mumbai, Maharashtra', 120);
    const safeNotes = sanitizeText(notes || '', 1000);
    const safeGrade = sanitizeText(materialGrade || grade || 'SS 316L', 50);
    const safeFinish = sanitizeText(finish || 'Electro Polished (EP)', 50);
    const safeNominalSize = sanitizeText(nominalSize || '', 50);
    const safeOD = sanitizeText(outsideDiameter || '', 50);
    const safeThickness = sanitizeText(wallThickness || '', 50);
    const safeStandard = sanitizeText(standard || '', 80);
    const safeProductType = sanitizeText(productType || '', 80);
    const safeUnit = sanitizeText(unit || 'Meter', 20);
    const safeSizes = sanitizeText(sizes || (safeNominalSize ? `${safeNominalSize} (${safeOD}) x ${safeThickness}` : ''), 100);
    const safeQuantity = sanitizeText(String(quantity || '1'), 50);
    const safeProductName = sanitizeText(productName || 'Sanitary Component', 120);

    if (!name || !company || !email) {
      return errorResponse(res, 'Customer name, company, and valid email are required', 400);
    }

    // Link or create Customer record to prevent duplicate contacts
    let customer = await Customer.findOne({ email });
    if (!customer) {
      customer = await Customer.create({
        name,
        company,
        email,
        phone,
        country: safeCountry,
        city: safeLocation,
        status: 'Lead',
        notes: [{ content: `Enquiry submitted for ${safeProductName} (${reference})`, author: 'Website System' }]
      });
    } else {
      customer.notes.push({
        content: `New enquiry logged for ${safeProductName} (${reference})`,
        author: 'Website System'
      });
      await customer.save();
    }

    // 1. Send customer confirmation email with safely escaped HTML
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; color: #10263D; max-width: 600px; margin: 0 auto; border: 1px solid #E3E8EF; border-radius: 8px; overflow: hidden;">
        <div style="background: #10263D; padding: 20px; text-align: center;">
          <h2 style="color: #FFFFFF; margin: 0;">Lotus Tubes</h2>
          <p style="color: #CBD5E1; margin: 4px 0 0 0; font-size: 13px;">Stainless Steel Sanitary Solutions &bull; Mumbai, India</p>
        </div>
        <div style="padding: 24px;">
          <h3 style="color: #0284C7; margin-top: 0;">Quotation Request Confirmation</h3>
          <p>Dear <strong>${escapeHtml(name)}</strong>,</p>
          <p>Thank you for submitting your quotation request for <strong>${escapeHtml(safeProductName)}</strong>. Your official reference number is <strong>${escapeHtml(reference)}</strong>.</p>
          
          <div style="background: #F8FAFC; border: 1px solid #E3E8EF; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #10263D;">Summary of Requested Specifications:</h4>
            <p style="margin: 4px 0;"><strong>Product:</strong> ${escapeHtml(safeProductName)}</p>
            <p style="margin: 4px 0;"><strong>Material Grade:</strong> ${escapeHtml(safeGrade)}</p>
            <p style="margin: 4px 0;"><strong>Surface Finish:</strong> ${escapeHtml(safeFinish)}</p>
            ${safeSizes ? `<p style="margin: 4px 0;"><strong>Size / Diameter:</strong> ${escapeHtml(safeSizes)}</p>` : ''}
            <p style="margin: 4px 0;"><strong>Requested Quantity:</strong> ${escapeHtml(safeQuantity)}</p>
            <p style="margin: 4px 0;"><strong>Delivery Location:</strong> ${escapeHtml(safeLocation)}</p>
            ${safeNotes ? `<p style="margin: 4px 0;"><strong>Special Requirements:</strong> ${escapeHtml(safeNotes)}</p>` : ''}
          </div>

          <p><strong>Sample Quotation Document:</strong></p>
          <p>You can inspect our standard commercial quotation format here: <a href="https://lotustubes.com/sample-quotation.pdf" style="color: #F00078; font-weight: bold;">Download Sample Quotation PDF</a></p>

          <div style="background: #FFF0F6; border-left: 4px solid #F00078; padding: 12px; margin: 20px 0; font-size: 13px; color: #831843;">
            <strong>Commercial Notice:</strong> A Lotus Tubes sales engineer will review your specification requirements and provide a formal priced quotation including MTC availability, ready stock dispatch status, and delivery lead time.
          </div>

          <p style="font-size: 13px; color: #64748B;">
            Sales Desk: +91 99304 30789 | Email: sales@lotustubes.com<br>
            Office: Shop No. 9, Jain Bhavan CHSL, Dr Bhajekar Lane, Khetwadi, Girgaon, Mumbai 400004
          </p>
        </div>
      </div>
    `;

    const customerEmailResult = await sendEmail({
      to: email,
      subject: `[Quotation Request ${reference}] Lotus Tubes - ${safeProductName}`,
      html: customerEmailHtml,
      replyTo: 'sales@lotustubes.com'
    });

    const emailStatus = customerEmailResult.delivered ? 'sent' : customerEmailResult.demoMode ? 'pending' : 'failed';

    // 2. Send internal sales desk notification with safely escaped HTML
    const internalEmailHtml = `
      <h2>New Website Quotation Request (${escapeHtml(reference)})</h2>
      <p><strong>Customer Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Company:</strong> ${escapeHtml(company)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Product:</strong> ${escapeHtml(safeProductName)}</p>
      <p><strong>Grade:</strong> ${escapeHtml(safeGrade)}</p>
      <p><strong>Quantity:</strong> ${escapeHtml(safeQuantity)}</p>
      <p><strong>Delivery Location:</strong> ${escapeHtml(safeLocation)}</p>
      <p><strong>Notes:</strong> ${escapeHtml(safeNotes || 'None')}</p>
    `;

    await sendEmail({
      subject: `[New Lead ${reference}] ${company} - ${safeProductName}`,
      html: internalEmailHtml,
      replyTo: email
    });

    // 3. Trigger WhatsApp delivery integration
    const whatsappResult = await sendWhatsAppQuotation({
      phone,
      customerName: name,
      reference,
      productName: safeProductName,
      quantity: safeQuantity,
      samplePdfUrl: 'https://lotustubes.com/sample-quotation.pdf'
    });

    const whatsappStatus = whatsappResult.status || 'not_configured';

    // 4. Persist in MongoDB
    const savedEnquiry = await Enquiry.create({
      reference,
      productId: productId || '',
      productName: safeProductName,
      name,
      company,
      email,
      phone,
      country: safeCountry,
      location: safeLocation,
      grade: safeGrade,
      materialGrade: safeGrade,
      productType: safeProductType,
      nominalSize: safeNominalSize,
      outsideDiameter: safeOD,
      wallThickness: safeThickness,
      standard: safeStandard,
      unit: safeUnit,
      quantity: safeQuantity,
      sizes: safeSizes,
      finish: safeFinish,
      notes: safeNotes,
      sourceChannel: sourceChannel || 'Website RFQ',
      priority: 'Medium',
      status: 'New',
      userId,
      customerId: customer._id,
      samplePdfUrl,
      emailStatus,
      whatsappStatus,
      activityHistory: [
        {
          action: 'Created',
          note: `Quotation request logged from ${sourceChannel || 'Website'}`,
          performedBy: 'System'
        }
      ]
    });

    await recordAuditEvent({
      actor: req.user || { name, email, role: 'customer' },
      action: 'RFQ_CREATED',
      targetType: 'Enquiry',
      targetId: savedEnquiry._id,
      targetRef: reference,
      metadata: {
        productName: safeProductName,
        materialGrade: safeGrade,
        nominalSize: safeNominalSize,
        quantity: safeQuantity,
        customerCompany: company
      },
      ip: req.ip
    });

    return successResponse(
      res,
      {
        id: savedEnquiry._id,
        reference,
        status: savedEnquiry.status,
        persisted: true,
        samplePdfUrl,
        emailStatus,
        whatsappStatus,
        whatsappDirectLink: whatsappResult.directLink || null
      },
      'Quotation request submitted and saved successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get enquiries for staff CRM with search, filtering, status, and pagination
 */
export const getEnquiries = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { status, priority, search, page = 1, limit = 50 } = req.query;

    const query = {};
    if (status && status !== 'All') {
      query.status = status;
    }
    if (priority && priority !== 'All') {
      query.priority = priority;
    }
    if (search) {
      const q = search.trim();
      query.$or = [
        { reference: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { productName: { $regex: q, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [enquiries, total] = await Promise.all([
      Enquiry.find(query)
        .populate('assignedTo', 'name email department')
        .populate('customerId', 'name company customerTier')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Enquiry.countDocuments(query)
    ]);

    return successResponse(res, {
      enquiries,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single enquiry detail
 */
export const getEnquiryById = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const enquiry = await Enquiry.findById(id)
      .populate('assignedTo', 'name email department')
      .populate('customerId');

    if (!enquiry) {
      return errorResponse(res, 'Enquiry not found', 404);
    }

    return successResponse(res, enquiry);
  } catch (error) {
    next(error);
  }
};

/**
 * Update enquiry status, priority, assigned staff, or internal notes
 */
export const updateEnquiry = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const { status, priority, assignedTo, note } = req.body;

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return errorResponse(res, 'Enquiry not found', 404);
    }

    const changes = [];
    if (status && status !== enquiry.status) {
      changes.push(`Status changed from ${enquiry.status} to ${status}`);
      enquiry.status = status;
    }
    if (priority && priority !== enquiry.priority) {
      changes.push(`Priority changed to ${priority}`);
      enquiry.priority = priority;
    }
    if (assignedTo !== undefined) {
      enquiry.assignedTo = assignedTo || null;
      changes.push(`Lead reassigned`);
    }

    if (note || changes.length > 0) {
      enquiry.activityHistory.push({
        action: 'Updated',
        note: note ? `${note} (${changes.join(', ')})` : changes.join(', '),
        performedBy: req.user?.name || 'Staff'
      });
    }

    await enquiry.save();
    return successResponse(res, enquiry, 'Enquiry updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete enquiry (Admin restricted)
 */
export const deleteEnquiry = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const deleted = await Enquiry.findByIdAndDelete(id);
    if (!deleted) {
      return errorResponse(res, 'Enquiry not found', 404);
    }
    return successResponse(res, null, 'Enquiry removed successfully');
  } catch (error) {
    next(error);
  }
};

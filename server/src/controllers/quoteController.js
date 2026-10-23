import { Quote } from '../models/Quote.js';
import { Customer } from '../models/Customer.js';
import { Enquiry } from '../models/Enquiry.js';
import { sendEmail } from '../services/emailService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { assertDatabaseConnected } from '../config/db.js';
import { escapeHtml, generateReference, sanitizeText } from '../utils/security.js';

/**
 * Public detailed RFQ / BOQ Quote Request Submission
 */
export const submitQuote = async (req, res, next) => {
  try {
    assertDatabaseConnected();

    const {
      name,
      company,
      email,
      phone,
      location,
      projectType,
      materialGrade,
      finishRequired,
      boqSummary,
      timeline,
      lineItems
    } = req.body;

    const reference = generateReference('LT-BOQ');
    const quotationNumber = generateReference('LT-QT');
    const safeName = sanitizeText(name, 100);
    const safeCompany = sanitizeText(company, 120);
    const safeEmail = (email || '').toLowerCase().trim();
    const safePhone = sanitizeText(phone, 30);
    const safeLocation = sanitizeText(location || '', 120);
    const safeProjectType = sanitizeText(projectType || 'Sanitary Piping Project', 100);
    const safeGrade = sanitizeText(materialGrade || 'SS 316L', 50);
    const safeFinish = sanitizeText(finishRequired || 'Electro Polished (EP)', 50);
    const safeBoqSummary = sanitizeText(boqSummary || '', 3000);
    const safeTimeline = sanitizeText(timeline || 'Standard (1-2 Weeks)', 60);

    // Link or create Customer
    let customer = await Customer.findOne({ email: safeEmail });
    if (!customer) {
      customer = await Customer.create({
        name: safeName,
        company: safeCompany,
        email: safeEmail,
        phone: safePhone,
        city: safeLocation,
        status: 'Lead',
        notes: [{ content: `Detailed BOQ submitted (${reference})`, author: 'Website System' }]
      });
    }

    // Process line items if provided
    let items = [];
    let subtotal = 0;
    if (Array.isArray(lineItems) && lineItems.length > 0) {
      items = lineItems.map((item) => {
        const qty = Number(item.quantity) || 1;
        const price = Number(item.unitPrice) || 0;
        const total = qty * price;
        subtotal += total;
        return {
          productId: item.productId || '',
          description: sanitizeText(item.description || 'Sanitary Component', 150),
          grade: sanitizeText(item.grade || safeGrade, 50),
          size: sanitizeText(item.size || '', 50),
          finish: sanitizeText(item.finish || safeFinish, 50),
          quantity: qty,
          unit: sanitizeText(item.unit || 'Pcs', 20),
          unitPrice: price,
          taxPercent: 18,
          lineTotal: total
        };
      });
    } else {
      // Default line item from project summary
      items.push({
        description: `${safeProjectType} - ${safeGrade} (${safeFinish})`,
        grade: safeGrade,
        finish: safeFinish,
        quantity: 1,
        unit: 'Lot',
        unitPrice: 0,
        taxPercent: 18,
        lineTotal: 0
      });
    }

    const taxTotal = Math.round(subtotal * 0.18 * 100) / 100;
    const grandTotal = subtotal + taxTotal;

    const newQuote = await Quote.create({
      quotationNumber,
      reference,
      customerName: safeName,
      company: safeCompany,
      email: safeEmail,
      phone: safePhone,
      shippingAddress: safeLocation,
      lineItems: items,
      subtotal,
      taxTotal,
      grandTotal,
      leadTime: safeTimeline,
      status: 'Received',
      customerId: customer._id,
      createdBy: req.user?.id || null,
      internalNotes: `Public BOQ Request. Customer Requirements: ${safeBoqSummary}`,
      activityLog: [
        {
          action: 'Created',
          performedBy: safeName,
          note: `Customer submitted detailed BOQ request`
        }
      ]
    });

    // Send confirmation email to client with escaped HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #10263D; max-width: 600px; margin: 0 auto; border: 1px solid #E3E8EF; border-radius: 8px; overflow: hidden;">
        <div style="background: #10263D; padding: 20px; text-align: center;">
          <h2 style="color: #FFFFFF; margin: 0;">Lotus Tubes</h2>
          <p style="color: #CBD5E1; margin: 4px 0 0 0; font-size: 13px;">Sanitary Piping &bull; Fittings &bull; Valves</p>
        </div>
        <div style="padding: 24px;">
          <h3 style="color: #0284C7; margin-top: 0;">BOQ / RFQ Submission Received</h3>
          <p>Dear <strong>${escapeHtml(safeName)}</strong>,</p>
          <p>We have successfully received your Bill of Quantities (BOQ) for <strong>${escapeHtml(safeCompany)}</strong>.</p>
          <p>Quotation Request Reference: <strong>${escapeHtml(reference)}</strong></p>

          <div style="background: #F8FAFC; border: 1px solid #E3E8EF; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Project Type:</strong> ${escapeHtml(safeProjectType)}</p>
            <p style="margin: 4px 0;"><strong>Material Grade:</strong> ${escapeHtml(safeGrade)}</p>
            <p style="margin: 4px 0;"><strong>Surface Finish:</strong> ${escapeHtml(safeFinish)}</p>
            <p style="margin: 4px 0;"><strong>Delivery Timeline:</strong> ${escapeHtml(safeTimeline)}</p>
          </div>

          <p>Our sales engineering team in Mumbai is reviewing your bill of materials and will issue your formal priced commercial quotation shortly.</p>
          <p style="font-size: 13px; color: #64748B;">
            Sales Desk: +91 99304 30789 | Email: sales@lotustubes.com
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: safeEmail,
      subject: `[BOQ Received ${reference}] Lotus Tubes - ${safeCompany}`,
      html: emailHtml,
      replyTo: 'sales@lotustubes.com'
    });

    return successResponse(
      res,
      {
        id: newQuote._id,
        reference,
        quotationNumber,
        status: newQuote.status
      },
      'Quotation request logged successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Staff CRM: List all quotations with filtering and pagination
 */
export const getQuotes = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { status, search, page = 1, limit = 50 } = req.query;

    const query = {};
    if (status && status !== 'All') {
      query.status = status;
    }
    if (search) {
      const q = search.trim();
      query.$or = [
        { quotationNumber: { $regex: q, $options: 'i' } },
        { reference: { $regex: q, $options: 'i' } },
        { customerName: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [quotes, total] = await Promise.all([
      Quote.find(query)
        .populate('assignedTo', 'name email')
        .populate('customerId', 'name company customerTier')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Quote.countDocuments(query)
    ]);

    return successResponse(res, {
      quotes,
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
 * Staff CRM: Create a formal priced quotation
 */
export const createFormalQuote = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const {
      customerName,
      company,
      email,
      phone,
      billingAddress,
      shippingAddress,
      country,
      currency,
      lineItems,
      discountPercent = 0,
      shippingCharge = 0,
      paymentTerms,
      validityDays = 15,
      leadTime,
      deliveryTerms,
      enquiryId,
      customerId,
      internalNotes
    } = req.body;

    if (!customerName || !company || !email || !lineItems || !lineItems.length) {
      return errorResponse(res, 'Customer name, company, email, and at least one line item are required', 400);
    }

    const quotationNumber = generateReference('LT-QT');
    let subtotal = 0;

    const processedItems = lineItems.map((item) => {
      const qty = Number(item.quantity) || 1;
      const unitPrice = Number(item.unitPrice) || 0;
      const disc = Number(item.discountPercent) || 0;
      const tax = Number.isFinite(Number(item.taxPercent)) ? Number(item.taxPercent) : 18;
      const lineSubtotal = qty * unitPrice * (1 - disc / 100);
      subtotal += lineSubtotal;
      return {
        productId: item.productId || '',
        description: item.description,
        grade: item.grade || 'SS 316L',
        size: item.size || '',
        finish: item.finish || 'Electro Polished',
        quantity: qty,
        unit: item.unit || 'Pcs',
        unitPrice,
        discountPercent: disc,
        taxPercent: tax,
        lineTotal: Math.round(lineSubtotal * 100) / 100
      };
    });

    const discountTotal = Math.round(subtotal * (Number(discountPercent) / 100) * 100) / 100;
    const taxableAmount = subtotal - discountTotal;
    const taxTotal = Math.round(taxableAmount * 0.18 * 100) / 100; // 18% standard GST
    const grandTotal = Math.round((taxableAmount + taxTotal + Number(shippingCharge)) * 100) / 100;

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + Number(validityDays));

    const quote = await Quote.create({
      quotationNumber,
      customerName: customerName.trim(),
      company: company.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      billingAddress: billingAddress || '',
      shippingAddress: shippingAddress || '',
      country: country || 'India',
      currency: currency || 'INR',
      lineItems: processedItems,
      subtotal,
      discountTotal,
      taxTotal,
      shippingCharge: Number(shippingCharge) || 0,
      grandTotal,
      paymentTerms: paymentTerms || '100% advance or approved credit terms',
      validityDays: Number(validityDays),
      validUntil,
      leadTime: leadTime || 'Ex-stock 24-48h; manufactured items 7-10 days',
      deliveryTerms: deliveryTerms || 'Ex-Works Mumbai / Door Delivery at Actuals',
      status: 'Draft',
      enquiryId: enquiryId || null,
      customerId: customerId || null,
      createdBy: req.user?.id || null,
      internalNotes: internalNotes || '',
      activityLog: [
        {
          action: 'Created',
          performedBy: req.user?.name || 'Staff',
          note: `Formal quotation ${quotationNumber} drafted`
        }
      ]
    });

    return successResponse(res, quote, 'Formal quotation drafted successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Staff CRM: Update quotation (pricing, line items, status)
 */
export const updateQuote = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const quote = await Quote.findById(id);
    if (!quote) {
      return errorResponse(res, 'Quotation not found', 404);
    }

    const { status, internalNotes, lineItems, paymentTerms, leadTime, deliveryTerms } = req.body;

    if (status && status !== quote.status) {
      quote.activityLog.push({
        action: 'Status Change',
        performedBy: req.user?.name || 'Staff',
        note: `Status changed from ${quote.status} to ${status}`
      });
      quote.status = status;
    }

    if (internalNotes !== undefined) quote.internalNotes = internalNotes;
    if (paymentTerms) quote.paymentTerms = paymentTerms;
    if (leadTime) quote.leadTime = leadTime;
    if (deliveryTerms) quote.deliveryTerms = deliveryTerms;

    if (Array.isArray(lineItems) && lineItems.length > 0) {
      quote.version = (quote.version || 1) + 1;
      let subtotal = 0;
      quote.lineItems = lineItems.map((item) => {
        const qty = Number(item.quantity) || 1;
        const unitPrice = Number(item.unitPrice) || 0;
        const disc = Number(item.discountPercent) || 0;
        const lineSubtotal = qty * unitPrice * (1 - disc / 100);
        subtotal += lineSubtotal;
        return {
          productId: item.productId || '',
          description: item.description,
          grade: item.grade || 'SS 316L',
          size: item.size || '',
          finish: item.finish || 'Electro Polished',
          quantity: qty,
          unit: item.unit || 'Pcs',
          unitPrice,
          discountPercent: disc,
          taxPercent: Number.isFinite(Number(item.taxPercent)) ? Number(item.taxPercent) : 18,
          lineTotal: Math.round(lineSubtotal * 100) / 100
        };
      });
      quote.subtotal = subtotal;
      quote.taxTotal = Math.round(subtotal * 0.18 * 100) / 100;
      quote.grandTotal = Math.round((subtotal + quote.taxTotal + (quote.shippingCharge || 0)) * 100) / 100;
      quote.activityLog.push({
        action: 'Revision',
        performedBy: req.user?.name || 'Staff',
        note: `Revised to version ${quote.version}`
      });
    }

    await quote.save();
    return successResponse(res, quote, 'Quotation updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Staff CRM: Send quotation by email to customer
 */
export const sendQuoteByEmail = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const quote = await Quote.findById(id);
    if (!quote) {
      return errorResponse(res, 'Quotation not found', 404);
    }

    const itemsRows = quote.lineItems
      .map(
        (it, idx) => `
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 10px; font-size: 13px;">${idx + 1}</td>
          <td style="padding: 10px; font-size: 13px;">
            <strong>${escapeHtml(it.description)}</strong><br>
            <span style="color: #64748B; font-size: 11px;">Grade: ${escapeHtml(it.grade)} | Finish: ${escapeHtml(it.finish)} | Size: ${escapeHtml(it.size || 'Standard')}</span>
          </td>
          <td style="padding: 10px; font-size: 13px; text-align: center;">${it.quantity} ${escapeHtml(it.unit)}</td>
          <td style="padding: 10px; font-size: 13px; text-align: right;">${quote.currency} ${Number(it.unitPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td style="padding: 10px; font-size: 13px; text-align: right; font-weight: bold;">${quote.currency} ${Number(it.lineTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>
      `
      )
      .join('');

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #10263D; max-width: 650px; margin: 0 auto; border: 1px solid #E3E8EF; border-radius: 8px; overflow: hidden;">
        <div style="background: #10263D; padding: 24px; color: #FFF;">
          <table width="100%">
            <tr>
              <td>
                <h2 style="margin: 0; color: #FFF;">Lotus Tubes</h2>
                <p style="margin: 4px 0 0 0; color: #94A3B8; font-size: 12px;">Lotus Impex &bull; Mumbai, India</p>
              </td>
              <td style="text-align: right;">
                <span style="background: #0284C7; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">COMMERCIAL QUOTATION</span>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #E2E8F0;">${escapeHtml(quote.quotationNumber)} (v${quote.version || 1})</p>
              </td>
            </tr>
          </table>
        </div>

        <div style="padding: 24px;">
          <p>Dear <strong>${escapeHtml(quote.customerName)}</strong> (${escapeHtml(quote.company)}),</p>
          <p>Please find below the official commercial quotation for your stainless steel sanitary components requirement:</p>

          <table width="100%" style="border-collapse: collapse; margin: 16px 0;">
            <thead>
              <tr style="background: #F8FAFC; border-bottom: 2px solid #CBD5E1; text-align: left;">
                <th style="padding: 8px; font-size: 12px;">#</th>
                <th style="padding: 8px; font-size: 12px;">Item & Specifications</th>
                <th style="padding: 8px; font-size: 12px; text-align: center;">Qty</th>
                <th style="padding: 8px; font-size: 12px; text-align: right;">Unit Rate</th>
                <th style="padding: 8px; font-size: 12px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
            <tfoot>
              <tr style="border-top: 2px solid #E2E8F0;">
                <td colspan="4" style="padding: 8px; text-align: right; font-size: 13px;">Subtotal:</td>
                <td style="padding: 8px; text-align: right; font-size: 13px; font-weight: bold;">${quote.currency} ${Number(quote.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td colspan="4" style="padding: 8px; text-align: right; font-size: 13px;">GST (18%):</td>
                <td style="padding: 8px; text-align: right; font-size: 13px;">${quote.currency} ${Number(quote.taxTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr style="background: #F1F5F9; font-weight: bold;">
                <td colspan="4" style="padding: 10px; text-align: right; font-size: 14px;">Grand Total:</td>
                <td style="padding: 10px; text-align: right; font-size: 15px; color: #0284C7;">${quote.currency} ${Number(quote.grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>

          <div style="background: #F8FAFC; border: 1px solid #E3E8EF; border-radius: 6px; padding: 12px; font-size: 12px; line-height: 1.6; margin-top: 16px;">
            <p style="margin: 0;"><strong>Payment Terms:</strong> ${escapeHtml(quote.paymentTerms)}</p>
            <p style="margin: 0;"><strong>Delivery Lead Time:</strong> ${escapeHtml(quote.leadTime)}</p>
            <p style="margin: 0;"><strong>Delivery Terms:</strong> ${escapeHtml(quote.deliveryTerms)}</p>
            <p style="margin: 0;"><strong>Validity:</strong> Valid for ${quote.validityDays} days from quotation date</p>
          </div>

          <p style="font-size: 12px; color: #64748B; margin-top: 20px;">
            To confirm this quotation or request technical MTC documentation, please reply directly to this email or reach our sales desk on WhatsApp at +91 99304 30789.
          </p>
        </div>
      </div>
    `;

    const sendRes = await sendEmail({
      to: quote.email,
      subject: `[Quotation ${quote.quotationNumber}] Lotus Tubes Commercial Offer`,
      html: emailHtml,
      replyTo: 'sales@lotustubes.com'
    });

    quote.emailStatus = sendRes.delivered ? 'sent' : 'failed';
    quote.status = 'Sent';
    quote.activityLog.push({
      action: 'Dispatched',
      performedBy: req.user?.name || 'Staff',
      note: `Quotation sent via email to ${quote.email} (Status: ${quote.emailStatus})`
    });

    await quote.save();
    return successResponse(res, { quote, emailStatus: quote.emailStatus }, 'Quotation dispatched via email successfully');
  } catch (error) {
    next(error);
  }
};

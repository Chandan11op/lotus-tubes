import { Quote, computeQuotationApprovalHash } from '../models/Quote.js';
import { Customer } from '../models/Customer.js';
import { Enquiry } from '../models/Enquiry.js';
import { sendEmail } from '../services/emailService.js';
import { sendApprovedDocument } from '../services/notificationService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { assertDatabaseConnected } from '../config/db.js';
import { escapeHtml, generateReference, sanitizeText } from '../utils/security.js';
import { recordAuditEvent } from '../utils/auditLogger.js';
import {
  buildQuotationAcknowledgementEmail,
  buildQuotationAcknowledgementText
} from '../utils/emailTemplates.js';

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
      lineItems,
      // Rich specifications
      nominalSize,
      outsideDiameter,
      wallThickness,
      standard,
      unit,
      quantity
    } = req.body;

    const reference = generateReference('LT-BOQ');
    const quotationNumber = generateReference('LT-QT');

    // Anti-spoofing: if customer is authenticated, lock identity to verified session account
    const safeName = sanitizeText(req.user?.name || name, 100);
    const safeCompany = sanitizeText(req.user?.company || company, 120);
    const safeEmail = (req.user?.email || email || '').toLowerCase().trim();
    const safePhone = sanitizeText(req.user?.phone || phone, 30);
    const safeLocation = sanitizeText(location || '', 120);
    const safeProjectType = sanitizeText(projectType || 'Sanitary Piping Project', 100);
    const safeGrade = sanitizeText(materialGrade || 'SS 316L', 50);
    const safeFinish = sanitizeText(finishRequired || 'Electro Polished (EP)', 50);
    const safeBoqSummary = sanitizeText(boqSummary || '', 3000);
    const safeTimeline = sanitizeText(timeline || 'Standard (1-2 Weeks)', 60);

    if (!safeName || !safeCompany || !safeEmail) {
      return errorResponse(res, 'Customer name, company, and valid email address are required', 400);
    }

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
          size: sanitizeText(item.size || nominalSize || '', 50),
          nominalSize: sanitizeText(item.nominalSize || nominalSize || '', 50),
          outsideDiameter: sanitizeText(item.outsideDiameter || outsideDiameter || '', 50),
          wallThickness: sanitizeText(item.wallThickness || wallThickness || '', 50),
          standard: sanitizeText(item.standard || standard || '', 80),
          productType: sanitizeText(item.productType || safeProjectType, 80),
          finish: sanitizeText(item.finish || safeFinish, 50),
          quantity: qty,
          unit: sanitizeText(item.unit || unit || 'Pcs', 20),
          unitPrice: price,
          taxPercent: 18,
          lineTotal: total
        };
      });
    } else {
      // Default line item from project summary
      const specDesc = [
        safeProjectType,
        safeGrade,
        nominalSize ? `${nominalSize} (${outsideDiameter || ''})` : '',
        wallThickness ? `x ${wallThickness}` : '',
        standard ? `[${standard}]` : '',
        `(${safeFinish})`
      ]
        .filter(Boolean)
        .join(' ');

      items.push({
        description: specDesc,
        grade: safeGrade,
        nominalSize: sanitizeText(nominalSize || '', 50),
        outsideDiameter: sanitizeText(outsideDiameter || '', 50),
        wallThickness: sanitizeText(wallThickness || '', 50),
        standard: sanitizeText(standard || '', 80),
        productType: safeProjectType,
        finish: safeFinish,
        quantity: Number(quantity) || 1,
        unit: sanitizeText(unit || 'Lot', 20),
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
      approvalStatus: 'draft',
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

    await recordAuditEvent({
      actor: req.user || { name: safeName, email: safeEmail, role: 'customer' },
      action: 'RFQ_CREATED',
      targetType: 'Quote',
      targetId: newQuote._id,
      targetRef: reference,
      metadata: { quotationNumber, customerCompany: safeCompany, lineItemCount: items.length },
      ip: req.ip
    });

    // Send automated quotation acknowledgement email to client
    const emailHtml = buildQuotationAcknowledgementEmail({
      customerName: safeName,
      referenceNumber: reference,
      productName: safeProjectType,
      materialGrade: safeGrade,
      nominalSize,
      outsideDiameter,
      wallThickness,
      standard,
      quantity,
      unit,
      destination: safeLocation,
      notes: safeBoqSummary
    });

    const emailText = buildQuotationAcknowledgementText({
      customerName: safeName,
      referenceNumber: reference,
      productName: safeProjectType,
      materialGrade: safeGrade,
      nominalSize,
      outsideDiameter,
      wallThickness,
      standard,
      quantity,
      unit,
      destination: safeLocation,
      notes: safeBoqSummary
    });

    // Asynchronously dispatch confirmation email without blocking or timing out the HTTP response
    setImmediate(async () => {
      try {
        await sendEmail({
          agentId: 'sales',
          to: safeEmail,
          subject: 'Your Quotation Request Has Been Received — Lotus Tubes',
          html: emailHtml,
          text: emailText,
          replyTo: 'sales@lotustubes.com',
          idempotencyKey: `ack_${reference}`,
          reference,
          quoteId: newQuote._id,
          customerId: customer._id,
          metadata: {
            category: 'quotation_acknowledgement',
            reference,
            quotationNumber
          }
        });
      } catch (emailErr) {
        console.error('Async email dispatch failed for BOQ', reference, emailErr.message);
      }
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
    const { status, approvalStatus, search, page = 1, limit = 50 } = req.query;

    const query = {};
    if (status && status !== 'All') {
      query.status = status;
    }
    if (approvalStatus && approvalStatus !== 'All') {
      query.approvalStatus = approvalStatus;
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
        .populate('approvedBy', 'name email role')
        .populate('submittedBy', 'name email')
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
        grade: item.grade || item.materialGrade || 'SS 316L',
        nominalSize: item.nominalSize || '',
        outsideDiameter: item.outsideDiameter || '',
        wallThickness: item.wallThickness || '',
        standard: item.standard || '',
        productType: item.productType || '',
        size: item.size || item.nominalSize || '',
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
      reference: req.body.reference || quotationNumber,
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
      approvalStatus: 'draft',
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

    await recordAuditEvent({
      actor: req.user,
      action: 'QUOTATION_DRAFTED',
      targetType: 'Quote',
      targetId: quote._id,
      targetRef: quotationNumber,
      metadata: { grandTotal, customerName, company },
      ip: req.ip
    });

    return successResponse(res, quote, 'Formal quotation drafted successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Staff CRM: Submit quotation for Super Admin approval
 */
export const submitForApproval = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const quote = await Quote.findById(id);
    if (!quote) {
      return errorResponse(res, 'Quotation not found', 404);
    }

    if (quote.status === 'Approved' && quote.approvalStatus === 'approved') {
      return errorResponse(res, 'Quotation is already approved by the Super Admin', 400);
    }

    quote.status = 'Pending Approval';
    quote.approvalStatus = 'pending';
    quote.submittedForApprovalAt = new Date();
    quote.submittedBy = req.user?.id || null;
    quote.submittedByName = req.user?.name || 'Sales Staff';

    quote.activityLog.push({
      action: 'Submitted for Approval',
      performedBy: req.user?.name || 'Sales Staff',
      note: `Quotation submitted for Super Admin review & approval`
    });

    await quote.save();

    await recordAuditEvent({
      actor: req.user,
      action: 'QUOTATION_SUBMITTED_FOR_APPROVAL',
      targetType: 'Quote',
      targetId: quote._id,
      targetRef: quote.quotationNumber,
      metadata: { grandTotal: quote.grandTotal, submittedBy: req.user?.name },
      ip: req.ip
    });

    return successResponse(res, quote, 'Quotation successfully submitted for Super Admin approval');
  } catch (error) {
    next(error);
  }
};

/**
 * Super Admin: Approve quotation
 * Mandatory rule: Only Super Admin can approve. Generates SHA-256 approvalHash.
 */
export const approveQuote = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const quote = await Quote.findById(id);
    if (!quote) {
      return errorResponse(res, 'Quotation not found', 404);
    }

    // Compute cryptographic integrity hash
    const hash = computeQuotationApprovalHash(quote);

    quote.status = 'Approved';
    quote.approvalStatus = 'approved';
    quote.approvedBy = req.user.id;
    quote.approvedByName = req.user.name || 'Super Admin';
    quote.approvedAt = new Date();
    quote.approvalHash = hash;
    quote.rejectionReason = '';
    quote.changesRequestedNotes = '';

    quote.activityLog.push({
      action: 'Super Admin Approved',
      performedBy: req.user.name || 'Super Admin',
      note: `Quotation authorized and approved for commercial release (Hash: ${hash.slice(0, 10)}...)`
    });

    await quote.save();

    await recordAuditEvent({
      actor: req.user,
      action: 'QUOTATION_APPROVED',
      targetType: 'Quote',
      targetId: quote._id,
      targetRef: quote.quotationNumber,
      metadata: { grandTotal: quote.grandTotal, approver: req.user.name, hash: hash.slice(0, 16) },
      ip: req.ip
    });

    return successResponse(res, quote, 'Quotation explicitly approved by Super Admin');
  } catch (error) {
    next(error);
  }
};

/**
 * Super Admin: Request changes on quotation
 */
export const requestChangesQuote = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const { notes } = req.body;

    if (!notes || !notes.trim()) {
      return errorResponse(res, 'Please provide the specific changes or revisions requested', 400);
    }

    const quote = await Quote.findById(id);
    if (!quote) {
      return errorResponse(res, 'Quotation not found', 404);
    }

    quote.status = 'Changes Requested';
    quote.approvalStatus = 'changes_requested';
    quote.changesRequestedNotes = notes.trim();
    quote.approvedBy = null;
    quote.approvedByName = '';
    quote.approvedAt = null;
    quote.approvalHash = null;

    quote.activityLog.push({
      action: 'Changes Requested',
      performedBy: req.user?.name || 'Super Admin',
      note: `Revisions requested by Super Admin: "${notes.trim()}"`
    });

    await quote.save();

    await recordAuditEvent({
      actor: req.user,
      action: 'QUOTATION_CHANGES_REQUESTED',
      targetType: 'Quote',
      targetId: quote._id,
      targetRef: quote.quotationNumber,
      metadata: { reason: notes.trim(), grandTotal: quote.grandTotal },
      ip: req.ip
    });

    return successResponse(res, quote, 'Revision request recorded and sent back to sales staff');
  } catch (error) {
    next(error);
  }
};

/**
 * Super Admin: Reject quotation
 */
export const rejectQuote = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const { reason } = req.body;

    const quote = await Quote.findById(id);
    if (!quote) {
      return errorResponse(res, 'Quotation not found', 404);
    }

    quote.status = 'Rejected';
    quote.approvalStatus = 'rejected';
    quote.rejectionReason = reason ? reason.trim() : 'Rejected by Super Admin';
    quote.approvedBy = null;
    quote.approvedByName = '';
    quote.approvedAt = null;
    quote.approvalHash = null;

    quote.activityLog.push({
      action: 'Super Admin Rejected',
      performedBy: req.user?.name || 'Super Admin',
      note: `Quotation rejected: "${quote.rejectionReason}"`
    });

    await quote.save();

    await recordAuditEvent({
      actor: req.user,
      action: 'QUOTATION_REJECTED',
      targetType: 'Quote',
      targetId: quote._id,
      targetRef: quote.quotationNumber,
      metadata: { reason: quote.rejectionReason, grandTotal: quote.grandTotal },
      ip: req.ip
    });

    return successResponse(res, quote, 'Quotation rejected');
  } catch (error) {
    next(error);
  }
};

/**
 * Staff CRM: Update quotation (pricing, line items, status)
 * Enforces rule: if modified after approval, approval is invalidated!
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
    let modifiedCommercials = false;

    if (internalNotes !== undefined) quote.internalNotes = internalNotes;
    if (paymentTerms && paymentTerms !== quote.paymentTerms) {
      quote.paymentTerms = paymentTerms;
      modifiedCommercials = true;
    }
    if (leadTime && leadTime !== quote.leadTime) {
      quote.leadTime = leadTime;
      modifiedCommercials = true;
    }
    if (deliveryTerms && deliveryTerms !== quote.deliveryTerms) {
      quote.deliveryTerms = deliveryTerms;
      modifiedCommercials = true;
    }

    if (Array.isArray(lineItems) && lineItems.length > 0) {
      modifiedCommercials = true;
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
          grade: item.grade || item.materialGrade || 'SS 316L',
          size: item.size || item.nominalSize || '',
          nominalSize: item.nominalSize || '',
          outsideDiameter: item.outsideDiameter || '',
          wallThickness: item.wallThickness || '',
          standard: item.standard || '',
          productType: item.productType || '',
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

    // Invalidation check: If commercial terms change on an Approved quotation, revoke approval!
    if (modifiedCommercials && (quote.status === 'Approved' || quote.approvalStatus === 'approved')) {
      quote.status = 'Draft';
      quote.approvalStatus = 'draft';
      quote.approvedBy = null;
      quote.approvedByName = '';
      quote.approvedAt = null;
      quote.approvalHash = null;

      quote.activityLog.push({
        action: 'Approval Invalidated',
        performedBy: req.user?.name || 'Staff',
        note: 'Super Admin approval invalidated due to modification of commercial line items/terms. Re-approval required.'
      });

      await recordAuditEvent({
        actor: req.user,
        action: 'QUOTATION_APPROVAL_INVALIDATED',
        targetType: 'Quote',
        targetId: quote._id,
        targetRef: quote.quotationNumber,
        metadata: { reason: 'Line items or commercial terms edited after approval' },
        ip: req.ip
      });
    }

    if (status && status !== quote.status) {
      // Prevent non-admin from setting status to Approved
      if (status === 'Approved' && req.user?.role !== 'admin') {
        return errorResponse(res, 'FORBIDDEN: Only Super Admin can set status to Approved', 403);
      }
      quote.activityLog.push({
        action: 'Status Change',
        performedBy: req.user?.name || 'Staff',
        note: `Status changed from ${quote.status} to ${status}`
      });
      quote.status = status;
    }

    await quote.save();
    return successResponse(res, quote, 'Quotation updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Staff CRM: Send approved quotation across Email & WhatsApp
 * STRICT BUSINESS RULE: Cannot be sent until explicitly approved by Super Admin!
 */
export const sendQuoteByEmail = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const channels = req.body?.channels || ['email', 'whatsapp'];

    const dispatchResult = await sendApprovedDocument({
      documentId: id,
      documentType: 'quotation',
      channels,
      actor: req.user
    });

    const updatedQuote = await Quote.findById(id);
    return successResponse(
      res,
      {
        quote: updatedQuote,
        dispatchResult,
        emailStatus: updatedQuote.emailStatus,
        whatsappStatus: updatedQuote.whatsappStatus
      },
      'Approved quotation dispatched via email and WhatsApp successfully'
    );
  } catch (error) {
    if (error.message.includes('SECURITY') || error.message.includes('approved') || error.message.includes('revoked') || error.message.includes('FORBIDDEN')) {
      return errorResponse(res, error.message, 403);
    }
    next(error);
  }
};

import { Invoice, computeInvoiceApprovalHash } from '../models/Invoice.js';
import { Quote } from '../models/Quote.js';
import { Customer } from '../models/Customer.js';
import { AgentTask } from '../models/AgentTask.js';
import { recordAuditEvent } from '../utils/auditLogger.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { assertDatabaseConnected } from '../config/db.js';
import { generateReference } from '../utils/security.js';
import { sendEmail } from '../services/emailService.js';
import { sendWhatsAppInvoice } from '../services/whatsappService.js';

/**
 * Super Admin & Staff: Get list of invoices with filters
 */
export const getInvoices = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { status, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { invoiceNumber: regex },
        { customerName: regex },
        { company: regex },
        { email: regex }
      ];
    }

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(100, parseInt(limit, 10));
    const [invoices, total] = await Promise.all([
      Invoice.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Math.min(100, parseInt(limit, 10)))
        .lean(),
      Invoice.countDocuments(query)
    ]);

    return successResponse(res, { invoices, total }, 'Invoices retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Super Admin & Staff: Get single invoice by ID
 */
export const getInvoiceById = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const invoice = await Invoice.findById(id).populate('quoteId customerId');
    if (!invoice) {
      return errorResponse(res, 'Invoice not found', 404);
    }
    return successResponse(res, invoice, 'Invoice retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * Staff / Accounts: Create an invoice draft (optionally linked to a Quote)
 */
export const createInvoice = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const {
      quoteId,
      customerName,
      company,
      email,
      phone,
      billingAddress,
      shippingAddress,
      lineItems = [],
      paymentTerms,
      dueDate,
      notes
    } = req.body;

    if (!customerName || !company || !email || !phone) {
      return errorResponse(res, 'Customer name, company, email, and phone are required', 400);
    }

    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return errorResponse(res, 'At least one line item is required for an invoice', 400);
    }

    let calculatedSubtotal = 0;
    const validatedLineItems = lineItems.map((item) => {
      const qty = Number(item.quantity) || 1;
      const price = Number(item.unitPrice) || 0;
      const discount = Number(item.discountPercent) || 0;
      const itemSub = qty * price * (1 - discount / 100);
      calculatedSubtotal += itemSub;
      return {
        productId: item.productId || '',
        description: item.description || 'Sanitary Component',
        grade: item.grade || 'SS 316L',
        size: item.size || item.nominalSize || '',
        nominalSize: item.nominalSize || '',
        finish: item.finish || 'Electro Polished',
        quantity: qty,
        unit: item.unit || 'Pcs',
        unitPrice: price,
        discountPercent: discount,
        taxPercent: 18,
        lineTotal: Math.round(itemSub * 100) / 100
      };
    });

    const subtotal = Math.round(calculatedSubtotal * 100) / 100;
    const taxTotal = Math.round(subtotal * 0.18 * 100) / 100;
    const grandTotal = Math.round((subtotal + taxTotal) * 100) / 100;

    const invoiceNumber = generateReference('LT-INV');

    // Find or link Customer
    let customer = await Customer.findOne({ email: email.toLowerCase().trim() });
    if (!customer) {
      customer = await Customer.create({
        name: customerName,
        company,
        email: email.toLowerCase().trim(),
        phone,
        status: 'Active Customer',
        notes: [{ content: `Invoice ${invoiceNumber} created`, author: req.user.name }]
      });
    }

    const newInvoice = await Invoice.create({
      invoiceNumber,
      quotationNumber: req.body.quotationNumber || '',
      quoteId: quoteId || null,
      customerId: customer._id,
      customerName,
      company,
      email: email.toLowerCase().trim(),
      phone,
      billingAddress: billingAddress || '',
      shippingAddress: shippingAddress || '',
      lineItems: validatedLineItems,
      subtotal,
      taxRate: 18,
      taxTotal,
      grandTotal,
      paymentTerms: paymentTerms || '100% advance against Proforma or 30 days credit',
      dueDate: dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: 'Draft',
      approvalStatus: 'pending',
      createdByStaff: req.user._id || req.user.id,
      createdByStaffName: req.user.name,
      notes: notes || ''
    });

    // Create AgentTask for Riya Shah (Agent 2: Billing & Invoicing Specialist)
    const task = await AgentTask.create({
      agentId: 'riya-shah',
      agentName: 'Riya Shah',
      agentRole: 'billing_specialist',
      taskType: 'draft_invoice',
      title: `Commercial Invoice Draft ${invoiceNumber} for ${company}`,
      description: `Accounts staff ${req.user.name} prepared invoice draft. Awaiting Super Admin Chirag Shah authorization.`,
      customerId: customer._id,
      invoiceId: newInvoice._id,
      quoteId: quoteId || null,
      approvalStatus: 'pending_review',
      proposedPayload: {
        invoiceNumber,
        customerName,
        company,
        email: email.toLowerCase().trim(),
        phone,
        lineItems: validatedLineItems,
        subtotal,
        taxTotal,
        grandTotal,
        paymentTerms: newInvoice.paymentTerms,
        dueDate: newInvoice.dueDate
      }
    });

    await recordAuditEvent({
      actor: req.user,
      action: 'INVOICE_CREATED',
      targetType: 'Invoice',
      targetId: newInvoice._id,
      targetRef: invoiceNumber,
      metadata: { taskId: task._id, grandTotal },
      ip: req.ip
    });

    return successResponse(
      res,
      { invoice: newInvoice, task },
      `Invoice draft ${invoiceNumber} created. Submitted to Super Admin for authorization.`,
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Staff / Super Admin: Update invoice line items / pricing
 */
export const updateInvoice = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return errorResponse(res, 'Invoice not found', 404);
    }

    if (invoice.status === 'Paid') {
      return errorResponse(res, 'Cannot modify a settled invoice', 400);
    }

    const {
      lineItems,
      billingAddress,
      shippingAddress,
      paymentTerms,
      dueDate,
      notes,
      status
    } = req.body;

    if (lineItems && Array.isArray(lineItems)) {
      let calculatedSubtotal = 0;
      invoice.lineItems = lineItems.map((item) => {
        const qty = Number(item.quantity) || 1;
        const price = Number(item.unitPrice) || 0;
        const discount = Number(item.discountPercent) || 0;
        const itemSub = qty * price * (1 - discount / 100);
        calculatedSubtotal += itemSub;
        return {
          productId: item.productId || '',
          description: item.description,
          grade: item.grade || 'SS 316L',
          size: item.size || item.nominalSize || '',
          nominalSize: item.nominalSize || '',
          finish: item.finish || 'Electro Polished',
          quantity: qty,
          unit: item.unit || 'Pcs',
          unitPrice: price,
          discountPercent: discount,
          taxPercent: 18,
          lineTotal: Math.round(itemSub * 100) / 100
        };
      });
      invoice.subtotal = Math.round(calculatedSubtotal * 100) / 100;
      invoice.taxTotal = Math.round(invoice.subtotal * 0.18 * 100) / 100;
      invoice.grandTotal = Math.round((invoice.subtotal + invoice.taxTotal) * 100) / 100;
    }

    if (billingAddress !== undefined) invoice.billingAddress = billingAddress;
    if (shippingAddress !== undefined) invoice.shippingAddress = shippingAddress;
    if (paymentTerms !== undefined) invoice.paymentTerms = paymentTerms;
    if (dueDate !== undefined) invoice.dueDate = dueDate;
    if (notes !== undefined) invoice.notes = notes;
    if (status !== undefined && req.user.role === 'admin') invoice.status = status;

    await invoice.save();

    return successResponse(res, invoice, 'Invoice updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * SUPER ADMIN ONLY: Approve and Authorize Invoice
 * Dispatches via Riya Shah on Resend Email & WhatsApp
 */
export const approveInvoice = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const { notes } = req.body;

    if (req.user.role !== 'admin') {
      return errorResponse(res, 'FORBIDDEN: Only Super Admin Chirag Shah can approve commercial invoices.', 403);
    }

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return errorResponse(res, 'Invoice not found', 404);
    }

    invoice.status = 'Approved';
    invoice.approvalStatus = 'approved';
    invoice.approvedByAdmin = req.user._id || req.user.id;
    invoice.approvedByAdminName = req.user.name;
    invoice.approvedAt = new Date();
    invoice.approvalHash = computeInvoiceApprovalHash(invoice);
    invoice.notes = notes ? `${invoice.notes ? invoice.notes + '\n' : ''}Super Admin Note: ${notes}` : invoice.notes;

    // Update associated AgentTask if one exists
    const task = await AgentTask.findOne({ invoiceId: invoice._id });
    if (task) {
      task.approvalStatus = 'approved';
      task.approvedBy = req.user._id || req.user.id;
      task.approvalDate = new Date();
      task.reviewNotes = notes || 'Authorized by Super Admin Chirag Shah';
      task.executionStatus = 'executed';
      await task.save();
    }

    // Dispatch via Agent 2: Riya Shah
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #10263D; max-width: 600px; margin: 0 auto; border: 1px solid #E3E8EF; border-radius: 8px; overflow: hidden;">
        <div style="background: #030810; padding: 20px; text-align: center;">
          <h2 style="color: #FFFFFF; margin: 0;">Lotus Tubes</h2>
          <p style="color: #38BDF8; margin: 4px 0 0 0; font-size: 13px;">Commercial Billing &amp; Tax Invoice Desk</p>
        </div>
        <div style="padding: 24px;">
          <p>Dear ${invoice.customerName},</p>
          <p>Your commercial tax invoice <strong>${invoice.invoiceNumber}</strong> for <strong>${invoice.company}</strong> has been officially approved and authorized by <strong>Super Admin Chirag Shah</strong>.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
            <tr style="background: #F8FAFC;"><td style="padding: 8px; border: 1px solid #E2E8F0;"><strong>Invoice Number:</strong></td><td style="padding: 8px; border: 1px solid #E2E8F0;">${invoice.invoiceNumber}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #E2E8F0;"><strong>Subtotal:</strong></td><td style="padding: 8px; border: 1px solid #E2E8F0;">₹${Number(invoice.subtotal).toLocaleString('en-IN')}</td></tr>
            <tr style="background: #F8FAFC;"><td style="padding: 8px; border: 1px solid #E2E8F0;"><strong>GST (18% HSN):</strong></td><td style="padding: 8px; border: 1px solid #E2E8F0;">₹${Number(invoice.taxTotal).toLocaleString('en-IN')}</td></tr>
            <tr style="font-weight: bold; background: #EFF6FF;"><td style="padding: 8px; border: 1px solid #E2E8F0;">Grand Total:</td><td style="padding: 8px; border: 1px solid #E2E8F0; color: #0284C7;">₹${Number(invoice.grandTotal).toLocaleString('en-IN')}</td></tr>
          </table>

          <div style="background: #F1F5F9; padding: 12px; border-radius: 6px; font-size: 12px; margin: 16px 0;">
            <strong>Bank Remittance Details:</strong><br/>
            Beneficiary: ${invoice.paymentDetails.accountName}<br/>
            Bank: ${invoice.paymentDetails.bankName} (${invoice.paymentDetails.branch})<br/>
            A/C: ${invoice.paymentDetails.accountNumber} | IFSC: ${invoice.paymentDetails.ifscCode}<br/>
            UPI: ${invoice.paymentDetails.upiId}
          </div>

          <p style="font-size: 12px; color: #059669; font-weight: bold;">
            ✓ Cryptographically Verified &amp; Authorized by Chirag Shah (Owner &amp; Managing Director)
          </p>
          <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
          <p style="margin: 0; font-size: 13px; color: #475569;">
            Dispatched by:<br/>
            <strong>Riya Shah</strong> (AI Billing &amp; Invoice Coordination Agent)<br/>
            Email: <a href="mailto:riyashah@lotustubes.com">riyashah@lotustubes.com</a><br/>
            Lotus Tubes (Lotus Impex), Fort, Mumbai
          </p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: invoice.email,
        subject: `[Tax Invoice ${invoice.invoiceNumber}] Lotus Tubes Order Billing`,
        html: emailHtml,
        replyTo: 'riyashah@lotustubes.com'
      });
      invoice.deliveryRecords.emailSent = true;
      invoice.deliveryRecords.emailSentAt = new Date();
    } catch (e) {
      console.warn('Invoice email delivery exception:', e.message);
    }

    if (invoice.phone) {
      try {
        const waResult = await sendWhatsAppInvoice({
          phone: invoice.phone,
          customerName: invoice.customerName,
          invoiceNumber: invoice.invoiceNumber,
          grandTotal: invoice.grandTotal,
          pdfUrl: 'https://lotustubes.com/sample-quotation.pdf'
        });
        if (waResult.success) {
          invoice.deliveryRecords.whatsappSent = true;
          invoice.deliveryRecords.whatsappSentAt = new Date();
        }
      } catch (e) {
        console.warn('Invoice WhatsApp delivery exception:', e.message);
      }
    }

    invoice.sentAt = new Date();
    invoice.sentBy = req.user._id || req.user.id;
    await invoice.save();

    await recordAuditEvent({
      actor: req.user,
      action: 'INVOICE_APPROVED_AND_DISPATCHED',
      targetType: 'Invoice',
      targetId: invoice._id,
      targetRef: invoice.invoiceNumber,
      metadata: { approvalHash: invoice.approvalHash, grandTotal: invoice.grandTotal },
      ip: req.ip
    });

    return successResponse(
      res,
      invoice,
      `Invoice ${invoice.invoiceNumber} authorized by Super Admin. Dispatched via Riya Shah on Email & WhatsApp.`
    );
  } catch (error) {
    next(error);
  }
};

/**
 * SUPER ADMIN ONLY: Reject Invoice or Request Changes
 */
export const rejectInvoice = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const { reason, actionType } = req.body;

    if (req.user.role !== 'admin') {
      return errorResponse(res, 'FORBIDDEN: Only Super Admin can reject invoices', 403);
    }

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return errorResponse(res, 'Invoice not found', 404);
    }

    const isChangesRequested = actionType === 'changes_requested';
    invoice.status = isChangesRequested ? 'Changes Requested' : 'Cancelled';
    invoice.approvalStatus = isChangesRequested ? 'changes_requested' : 'rejected';
    if (isChangesRequested) {
      invoice.changesRequestedNotes = reason || 'Changes requested by Super Admin';
    } else {
      invoice.rejectionReason = reason || 'Invoice rejected by Super Admin';
    }

    await invoice.save();

    const task = await AgentTask.findOne({ invoiceId: invoice._id });
    if (task) {
      task.approvalStatus = isChangesRequested ? 'changes_requested' : 'rejected';
      task.reviewNotes = reason || 'Super Admin review updated';
      await task.save();
    }

    await recordAuditEvent({
      actor: req.user,
      action: isChangesRequested ? 'INVOICE_CHANGES_REQUESTED' : 'INVOICE_REJECTED',
      targetType: 'Invoice',
      targetId: invoice._id,
      targetRef: invoice.invoiceNumber,
      metadata: { reason },
      ip: req.ip
    });

    return successResponse(res, invoice, `Invoice review marked as ${invoice.status}`);
  } catch (error) {
    next(error);
  }
};

/**
 * Staff / Super Admin: Send / Resend Invoice
 * STRICT INVARIANT: Cannot send unapproved invoice!
 */
export const sendInvoice = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return errorResponse(res, 'Invoice not found', 404);
    }

    if (invoice.status !== 'Approved' && invoice.status !== 'Sent' && invoice.status !== 'Paid') {
      return errorResponse(
        res,
        'FORBIDDEN: Invoices must be officially approved by Super Admin Chirag Shah before customer dispatch.',
        403
      );
    }

    // Resend via Riya Shah
    if (invoice.phone) {
      await sendWhatsAppInvoice({
        phone: invoice.phone,
        customerName: invoice.customerName,
        invoiceNumber: invoice.invoiceNumber,
        grandTotal: invoice.grandTotal,
        pdfUrl: 'https://lotustubes.com/sample-quotation.pdf'
      });
    }

    return successResponse(res, invoice, `Invoice ${invoice.invoiceNumber} re-dispatched via Riya Shah.`);
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticated Customer: Get their own invoices
 * STRICT INVARIANT: Customer can only see invoices matching their email or customerId
 */
export const getMyInvoices = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const userEmail = (req.user.email || '').toLowerCase().trim();
    const userId = req.user.id || req.user._id;

    const invoices = await Invoice.find({
      $or: [
        { customerId: userId },
        { email: userEmail }
      ]
    })
      .sort({ createdAt: -1 })
      .lean();

    return successResponse(res, invoices, 'Customer invoices retrieved');
  } catch (error) {
    next(error);
  }
};

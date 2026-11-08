import mongoose from 'mongoose';
import crypto from 'crypto';

const invoiceLineItemSchema = new mongoose.Schema(
  {
    productId: { type: String, default: '' },
    description: { type: String, required: true },
    grade: { type: String, default: 'SS 316L' },
    size: { type: String, default: '' },
    nominalSize: { type: String, default: '' },
    finish: { type: String, default: 'Electro Polished' },
    quantity: { type: Number, required: true, min: 0.01 },
    unit: { type: String, default: 'Pcs' },
    unitPrice: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    taxPercent: { type: Number, default: 18 },
    lineTotal: { type: Number, required: true }
  },
  { _id: true }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    quotationNumber: {
      type: String,
      default: '',
      index: true
    },
    quoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quote',
      default: null
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
      index: true
    },
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    billingAddress: {
      type: String,
      default: ''
    },
    shippingAddress: {
      type: String,
      default: ''
    },
    currency: {
      type: String,
      enum: ['INR', 'USD', 'EUR', 'GBP', 'AED'],
      default: 'INR'
    },
    lineItems: [invoiceLineItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    discountTotal: {
      type: Number,
      default: 0
    },
    taxRate: {
      type: Number,
      default: 18
    },
    taxTotal: {
      type: Number,
      required: true,
      default: 0
    },
    grandTotal: {
      type: Number,
      required: true,
      default: 0
    },
    paymentTerms: {
      type: String,
      default: '100% advance against Proforma or 30 days credit for approved clients'
    },
    issuedDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date
    },
    paymentDetails: {
      bankName: { type: String, default: 'HDFC Bank Ltd' },
      accountName: { type: String, default: 'LOTUS IMPEX / LOTUS TUBES' },
      accountNumber: { type: String, default: '50200084729114' },
      ifscCode: { type: String, default: 'HDFC0000060' },
      branch: { type: String, default: 'Fort, Mumbai' },
      upiId: { type: String, default: 'lotustubes@hdfcbank' }
    },
    status: {
      type: String,
      enum: [
        'Draft',
        'Pending Approval',
        'Changes Requested',
        'Approved',
        'Sent',
        'Paid',
        'Partially Paid',
        'Overdue',
        'Cancelled'
      ],
      default: 'Draft',
      index: true
    },
    approvalStatus: {
      type: String,
      enum: ['draft', 'pending', 'changes_requested', 'approved', 'rejected'],
      default: 'draft',
      index: true
    },
    createdByStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    createdByStaffName: {
      type: String,
      default: ''
    },
    approvedByAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    approvedByAdminName: {
      type: String,
      default: ''
    },
    approvedAt: {
      type: Date,
      default: null
    },
    approvalHash: {
      type: String,
      default: null
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    changesRequestedNotes: {
      type: String,
      default: ''
    },
    sentAt: {
      type: Date,
      default: null
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    pdfUrl: {
      type: String,
      default: '/sample-quotation.pdf'
    },
    deliveryRecords: {
      emailSent: { type: Boolean, default: false },
      emailSentAt: { type: Date, default: null },
      whatsappSent: { type: Boolean, default: false },
      whatsappSentAt: { type: Date, default: null },
      error: { type: String, default: null }
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

/**
 * Generates an immutable cryptographic hash of the approved invoice state
 */
export function computeInvoiceApprovalHash(invoice) {
  const payload = [
    invoice.invoiceNumber,
    invoice.company,
    invoice.email,
    Number(invoice.grandTotal).toFixed(2),
    invoice.approvedByAdmin ? invoice.approvedByAdmin.toString() : 'NONE',
    invoice.approvedAt ? invoice.approvedAt.toISOString() : 'NO_DATE'
  ].join('|');

  return crypto.createHash('sha256').update(payload).digest('hex');
}

export const Invoice = mongoose.model('Invoice', invoiceSchema);


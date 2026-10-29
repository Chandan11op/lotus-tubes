import mongoose from 'mongoose';
import crypto from 'crypto';

const lineItemSchema = new mongoose.Schema(
  {
    productId: { type: String, default: '' },
    description: { type: String, required: true },
    grade: { type: String, default: 'SS 316L' },
    size: { type: String, default: '' },
    nominalSize: { type: String, default: '' },
    outsideDiameter: { type: String, default: '' },
    wallThickness: { type: String, default: '' },
    standard: { type: String, default: '' },
    productType: { type: String, default: '' },
    finish: { type: String, default: 'Electro Polished' },
    quantity: { type: Number, required: true, min: 0.01 },
    unit: { type: String, default: 'Pcs' }, // Pcs, Meters, Feet, Nos, Set
    unitPrice: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    taxPercent: { type: Number, default: 18 }, // Standard 18% GST on SS pipes/fittings
    lineTotal: { type: Number, required: true }
  },
  { _id: true }
);

const quoteSchema = new mongoose.Schema(
  {
    quotationNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    reference: {
      type: String,
      index: true
    },
    version: {
      type: Number,
      default: 1
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
    country: {
      type: String,
      default: 'India'
    },
    currency: {
      type: String,
      enum: ['INR', 'USD', 'EUR', 'GBP', 'AED'],
      default: 'INR'
    },
    lineItems: [lineItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    discountTotal: {
      type: Number,
      default: 0
    },
    taxTotal: {
      type: Number,
      default: 0
    },
    shippingCharge: {
      type: Number,
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
    validityDays: {
      type: Number,
      default: 15
    },
    validUntil: {
      type: Date
    },
    leadTime: {
      type: String,
      default: 'Ready stock dispatch within 24-48 hours; custom lengths 1-2 weeks'
    },
    deliveryTerms: {
      type: String,
      default: 'Ex-Works Mumbai / Door Delivery at Actuals'
    },
    status: {
      type: String,
      enum: [
        'Received',
        'Draft',
        'Pending Approval',
        'Changes Requested',
        'Approved',
        'Sent',
        'Accepted',
        'Rejected',
        'Expired',
        'Cancelled',
        'Revised'
      ],
      default: 'Draft',
      index: true
    },
    // Mandatory Super Admin Quotation Approval Workflow Fields
    approvalStatus: {
      type: String,
      enum: ['draft', 'pending', 'changes_requested', 'approved', 'rejected'],
      default: 'draft',
      index: true
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    approvedByName: {
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
    submittedForApprovalAt: {
      type: Date,
      default: null
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    submittedByName: {
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
    enquiryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enquiry',
      default: null
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    emailStatus: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed', 'not_configured'],
      default: 'pending'
    },
    pdfUrl: {
      type: String,
      default: ''
    },
    internalNotes: {
      type: String,
      default: ''
    },
    activityLog: [
      {
        action: String,
        performedBy: String,
        note: String,
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Quote = mongoose.model('Quote', quoteSchema);

/**
 * Computes a SHA-256 integrity hash of a quotation's commercial values.
 * Used to cryptographically ensure that an approved quotation cannot be modified
 * without invalidating its Super Admin approval.
 */
export function computeQuotationApprovalHash(quote) {
  const lineItemsData = (quote.lineItems || []).map((it) => ({
    description: it.description || '',
    grade: it.grade || '',
    quantity: Number(it.quantity) || 0,
    unit: it.unit || '',
    unitPrice: Number(it.unitPrice) || 0,
    discountPercent: Number(it.discountPercent) || 0,
    taxPercent: Number(it.taxPercent) || 0,
    lineTotal: Number(it.lineTotal) || 0
  }));

  const payload = JSON.stringify({
    quotationNumber: quote.quotationNumber || '',
    subtotal: Number(quote.subtotal) || 0,
    discountTotal: Number(quote.discountTotal) || 0,
    taxTotal: Number(quote.taxTotal) || 0,
    shippingCharge: Number(quote.shippingCharge) || 0,
    grandTotal: Number(quote.grandTotal) || 0,
    currency: quote.currency || 'INR',
    paymentTerms: quote.paymentTerms || '',
    deliveryTerms: quote.deliveryTerms || '',
    leadTime: quote.leadTime || '',
    validityDays: Number(quote.validityDays) || 15,
    items: lineItemsData
  });

  return crypto.createHash('sha256').update(payload).digest('hex');
}


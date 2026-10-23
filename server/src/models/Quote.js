import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema(
  {
    productId: { type: String, default: '' },
    description: { type: String, required: true },
    grade: { type: String, default: 'SS 316L' },
    size: { type: String, default: '' },
    finish: { type: String, default: 'Electro Polished' },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, default: 'Pcs' }, // Pcs, Meters, Feet
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
      enum: ['Received', 'Draft', 'Pending Approval', 'Sent', 'Accepted', 'Rejected', 'Expired', 'Revised'],
      default: 'Draft',
      index: true
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

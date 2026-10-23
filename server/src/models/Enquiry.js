import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    productId: {
      type: String,
      default: ''
    },
    productName: {
      type: String,
      default: 'Sanitary Component'
    },
    name: {
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
      trim: true,
      index: true
    },
    country: {
      type: String,
      trim: true,
      default: 'India'
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    grade: {
      type: String,
      default: 'SS 316L'
    },
    quantity: {
      type: String,
      required: true,
      trim: true
    },
    sizes: {
      type: String,
      default: ''
    },
    finish: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    sourceChannel: {
      type: String,
      enum: ['Website RFQ', 'WhatsApp Business', 'Direct Email', 'Phone Call', 'IndiaMART / Trade Portal'],
      default: 'Website RFQ'
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Normal'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Quotation Sent', 'Follow-up', 'Negotiation', 'Order Confirmed', 'Lost', 'On Hold'],
      default: 'New',
      index: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    emailStatus: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed', 'not_configured'],
      default: 'pending'
    },
    whatsappStatus: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed', 'not_configured'],
      default: 'not_configured'
    },
    activityHistory: [
      {
        action: String,
        note: String,
        performedBy: String,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Enquiry = mongoose.model('Enquiry', enquirySchema);

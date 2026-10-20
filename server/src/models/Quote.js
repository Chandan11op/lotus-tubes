import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      default: ''
    },
    projectType: {
      type: String,
      default: 'Sanitary Piping Project'
    },
    materialGrade: {
      type: String,
      default: 'SS 316L'
    },
    finishRequired: {
      type: String,
      default: 'Electro Polished (EP)'
    },
    boqSummary: {
      type: String,
      default: ''
    },
    timeline: {
      type: String,
      default: 'Standard (1-2 Weeks)'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    samplePdfUrl: {
      type: String,
      default: '/sample-quotation.pdf'
    },
    emailStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'not_configured'],
      default: 'pending'
    },
    whatsappStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'not_configured'],
      default: 'not_configured'
    },
    status: {
      type: String,
      enum: ['Received', 'Under Review', 'BOQ Prepared', 'Quote Sent', 'Accepted', 'Rejected'],
      default: 'Received'
    }
  },
  {
    timestamps: true
  }
);

export const Quote = mongoose.model('Quote', quoteSchema);

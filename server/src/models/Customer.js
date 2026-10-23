import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: 120
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: 150,
      index: true
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      lowercase: true,
      trim: true,
      index: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      index: true
    },
    country: {
      type: String,
      trim: true,
      default: 'India'
    },
    city: {
      type: String,
      trim: true,
      default: ''
    },
    gstin: {
      type: String,
      trim: true,
      default: ''
    },
    industry: {
      type: String,
      enum: ['Pharmaceutical', 'Dairy & Food', 'Chemical & Petrochemical', 'Brewery & Beverage', 'Water Treatment', 'General Engineering', 'Other'],
      default: 'Pharmaceutical'
    },
    customerTier: {
      type: String,
      enum: ['Tier 1 - High Volume OEM', 'Tier 2 - Equipment Fabricator', 'Tier 3 - Stockist / Trader', 'Standard Inquiry'],
      default: 'Standard Inquiry'
    },
    status: {
      type: String,
      enum: ['Active', 'Lead', 'Customer', 'Inactive'],
      default: 'Lead'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: [
      {
        content: String,
        author: String,
        authorId: mongoose.Schema.Types.ObjectId,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    mergedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null
    }
  },
  {
    timestamps: true
  }
);

customerSchema.index({ email: 1, phone: 1 });

export const Customer = mongoose.model('Customer', customerSchema);

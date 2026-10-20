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
      default: ''
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
    grade: {
      type: String,
      default: 'SS 316L'
    },
    quantity: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    notes: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['New Lead', 'Quoted', 'Follow-up', 'Confirmed', 'Closed'],
      default: 'New Lead'
    }
  },
  {
    timestamps: true
  }
);

export const Enquiry = mongoose.model('Enquiry', enquirySchema);

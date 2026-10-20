import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      default: '',
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
    subject: {
      type: String,
      default: 'General Website Enquiry'
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Responded', 'Archived'],
      default: 'New'
    }
  },
  {
    timestamps: true
  }
);

export const Contact = mongoose.model('Contact', contactSchema);

import mongoose from 'mongoose';

/**
 * EmailLog Schema
 * Comprehensive communication archive for all outgoing Resend emails and verified AI agent dispatches.
 * Records delivery lifecycle from provider acceptance ('accepted') to verified webhook delivery ('delivered').
 */
const emailLogSchema = new mongoose.Schema(
  {
    resendMessageId: {
      type: String,
      index: true,
      sparse: true,
      trim: true
    },
    idempotencyKey: {
      type: String,
      index: true,
      sparse: true,
      trim: true
    },
    agentId: {
      type: String,
      enum: ['ananya-mehta', 'riya-shah', 'neha-desai', 'arjun-yadav', 'system', 'support', 'sales'],
      default: 'system',
      index: true
    },
    agentName: {
      type: String,
      required: true
    },
    from: {
      type: String,
      required: true,
      trim: true
    },
    to: {
      type: [String],
      required: true,
      index: true
    },
    cc: {
      type: [String],
      default: []
    },
    bcc: {
      type: [String],
      default: []
    },
    replyTo: {
      type: String,
      default: 'sales@lotustubes.com',
      trim: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    bodyHtml: {
      type: String,
      required: true
    },
    bodyText: {
      type: String,
      default: ''
    },
    reference: {
      type: String,
      index: true,
      default: ''
    },
    category: {
      type: String,
      enum: [
        'general',
        'quotation',
        'quotation_acknowledgement',
        'invoice',
        'inquiry_reply',
        'operations_update',
        'password_reset',
        'system_notification'
      ],
      default: 'general',
      index: true
    },
    // Entity linkages
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
      index: true
    },
    enquiryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enquiry',
      default: null,
      index: true
    },
    quoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quote',
      default: null,
      index: true
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      default: null,
      index: true
    },
    agentTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AgentTask',
      default: null,
      index: true
    },
    attachments: [
      {
        filename: { type: String, required: true },
        path: { type: String, default: '' },
        contentType: { type: String, default: 'application/pdf' },
        size: { type: Number, default: 0 }
      }
    ],
    // Human-in-the-loop Super Admin Approval
    approvalStatus: {
      type: String,
      enum: ['not_required', 'pending_approval', 'approved', 'rejected'],
      default: 'not_required',
      index: true
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    approvedAt: {
      type: Date,
      default: null
    },
    approvalNotes: {
      type: String,
      default: ''
    },
    // Strict Delivery Status
    // Notice: 'accepted' = Resend accepted for delivery. 'delivered' = Webhook verified delivery.
    deliveryStatus: {
      type: String,
      enum: [
        'draft',
        'pending_approval',
        'approved',
        'dispatching',
        'accepted',
        'sent',
        'delivered',
        'delivery_delayed',
        'bounced',
        'complained',
        'failed',
        'cancelled'
      ],
      default: 'dispatching',
      index: true
    },
    statusEvents: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        details: { type: mongoose.Schema.Types.Mixed, default: {} }
      }
    ],
    sentAt: {
      type: Date,
      default: null
    },
    deliveredAt: {
      type: Date,
      default: null
    },
    bouncedAt: {
      type: Date,
      default: null
    },
    error: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for CRM filtering performance
emailLogSchema.index({ agentId: 1, createdAt: -1 });
emailLogSchema.index({ deliveryStatus: 1, createdAt: -1 });
emailLogSchema.index({ createdAt: -1 });

export const EmailLog = mongoose.model('EmailLog', emailLogSchema);

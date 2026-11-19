import mongoose from 'mongoose';

const whatsAppMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WhatsAppConversation',
      required: true,
      index: true
    },
    wamid: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      trim: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
      index: true
    },
    direction: {
      type: String,
      enum: ['inbound', 'outbound'],
      required: true,
      index: true
    },
    from: {
      type: String,
      required: true,
      trim: true
    },
    to: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['text', 'template', 'document', 'image', 'audio', 'interactive', 'location', 'contacts', 'unknown'],
      default: 'text'
    },
    text: {
      body: {
        type: String,
        default: ''
      }
    },
    template: {
      name: { type: String, default: '' },
      language: { type: String, default: 'en' },
      components: { type: [mongoose.Schema.Types.Mixed], default: [] }
    },
    document: {
      id: { type: String, default: '' },
      link: { type: String, default: '' },
      caption: { type: String, default: '' },
      filename: { type: String, default: '' },
      mimeType: { type: String, default: '' }
    },
    interactive: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    agentId: {
      type: String,
      enum: ['arjun-yadav', 'ananya-mehta', 'riya-shah', 'neha-desai', 'system', 'human'],
      default: 'arjun-yadav',
      index: true
    },
    deliveryStatus: {
      type: String,
      enum: [
        'DRAFT',
        'PENDING_APPROVAL',
        'APPROVED',
        'SEND_ATTEMPTED',
        'PROVIDER_ACCEPTED',
        'DELIVERED',
        'READ',
        'FAILED',
        'SKIPPED_NO_CONSENT',
        'NOT_CONFIGURED'
      ],
      default: 'SEND_ATTEMPTED',
      index: true
    },
    errorCode: {
      type: String,
      default: ''
    },
    errorMessage: {
      type: String,
      default: ''
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        error: { type: mongoose.Schema.Types.Mixed, default: null }
      }
    ],
    // Document Linkage & Approval Integrity
    documentType: {
      type: String,
      enum: ['quotation', 'invoice', 'catalogue', 'boq', 'none'],
      default: 'none',
      index: true
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true
    },
    documentReference: {
      type: String,
      default: ''
    },
    approvedVersionId: {
      type: String,
      default: ''
    },
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },
    retryCount: {
      type: Number,
      default: 0
    },
    retryHistory: [
      {
        attempt: Number,
        timestamp: { type: Date, default: Date.now },
        error: mongoose.Schema.Types.Mixed
      }
    ],
    error: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    rawPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  {
    timestamps: true
  }
);

whatsAppMessageSchema.index({ conversationId: 1, createdAt: 1 });
whatsAppMessageSchema.index({ deliveryStatus: 1, createdAt: -1 });

export const WhatsAppMessage = mongoose.model('WhatsAppMessage', whatsAppMessageSchema);

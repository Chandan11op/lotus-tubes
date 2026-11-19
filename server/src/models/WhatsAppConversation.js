import mongoose from 'mongoose';

const whatsAppConversationSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null,
      index: true
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    customerName: {
      type: String,
      trim: true,
      default: 'WhatsApp Visitor'
    },
    company: {
      type: String,
      trim: true,
      default: ''
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    assignedAgent: {
      type: String,
      enum: ['arjun-yadav', 'ananya-mehta', 'riya-shah', 'neha-desai', 'human'],
      default: 'arjun-yadav',
      index: true
    },
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    assignedStaffName: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'waiting_customer', 'waiting_human', 'resolved', 'archived'],
      default: 'active',
      index: true
    },
    // Human Takeover & Handover Controls
    isHumanHandover: {
      type: Boolean,
      default: false,
      index: true
    },
    humanHandoverRequestedAt: {
      type: Date,
      default: null
    },
    humanHandoverReason: {
      type: String,
      default: ''
    },
    botPaused: {
      type: Boolean,
      default: false
    },
    unreadCount: {
      type: Number,
      default: 0
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    lastMessageText: {
      type: String,
      default: ''
    },
    lastMessageDirection: {
      type: String,
      enum: ['inbound', 'outbound'],
      default: 'inbound'
    },
    // Dynamic Conversation State Machine & Context
    context: {
      flow: {
        type: String,
        enum: ['idle', 'product_query', 'quotation_request', 'boq_upload', 'status_check', 'human_request', 'catalogue_request'],
        default: 'idle'
      },
      step: {
        type: String,
        default: 'initial'
      },
      intent: {
        type: String,
        default: ''
      },
      collectedData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      },
      inquiryData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      },
      lastQuoteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quote',
        default: null
      },
      lastInvoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        default: null
      },
      lastEnquiryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enquiry',
        default: null
      }
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

whatsAppConversationSchema.index({ customerPhone: 1, status: 1 });
whatsAppConversationSchema.index({ lastMessageAt: -1 });

export const WhatsAppConversation = mongoose.model('WhatsAppConversation', whatsAppConversationSchema);

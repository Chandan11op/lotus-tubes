import mongoose from 'mongoose';

/**
 * AgentTask Schema
 * Records business workflow tasks performed by the 7 AI Business Agents.
 * Strict Security Invariant: No AI task may dispatch an external message or finalize
 * a financial document without explicit Super Admin review and approval.
 */
const agentTaskSchema = new mongoose.Schema(
  {
    agentId: {
      type: String,
      required: true,
      enum: [
        'dom-sales-1',
        'dom-sales-2',
        'dom-sales-3',
        'intl-sales-1',
        'intl-sales-2',
        'mktg-comm-1',
        'mktg-lead-2',
        'ananya-mehta',
        'riya-shah',
        'neha-desai',
        'arjun-yadav'
      ],
      index: true
    },
    agentName: {
      type: String,
      required: true
    },
    agentRole: {
      type: String,
      required: true,
      enum: [
        'domestic_sales',
        'international_sales',
        'marketing_communications',
        'marketing_outreach',
        'quotation_specialist',
        'billing_specialist',
        'support_concierge',
        'operations_manager'
      ]
    },
    taskType: {
      type: String,
      required: true,
      enum: [
        'lead_qualification',
        'draft_quotation',
        'draft_followup',
        'product_recommendation',
        'draft_outreach',
        'draft_announcement',
        'draft_invoice',
        'draft_mtc',
        'customer_inquiry_resolution',
        'chat_inquiry_update'
      ],
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    // Associated business entities
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null
    },
    enquiryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enquiry',
      default: null
    },
    quoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quote',
      default: null
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      default: null
    },
    // The structured content/draft proposed by the agent
    proposedPayload: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    // Super Admin Human-in-the-Loop Approval Workflow
    approvalStatus: {
      type: String,
      enum: ['pending_review', 'pending_super_admin_confirmation', 'approved', 'rejected', 'changes_requested'],
      default: 'pending_review',
      index: true
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    approvalDate: {
      type: Date,
      default: null
    },
    reviewNotes: {
      type: String,
      default: ''
    },
    // Staff and Super Admin reply collaboration
    staffReplyDraft: {
      type: String,
      default: ''
    },
    staffRepliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    staffRepliedAt: {
      type: Date,
      default: null
    },
    finalApprovedReply: {
      type: String,
      default: ''
    },
    superAdminApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    superAdminApprovedAt: {
      type: Date,
      default: null
    },
    // Task execution status
    executionStatus: {
      type: String,
      enum: ['draft', 'ready_for_execution', 'executed', 'cancelled'],
      default: 'draft'
    },
    executionResult: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const AgentTask = mongoose.model('AgentTask', agentTaskSchema);


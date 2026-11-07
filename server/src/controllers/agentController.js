import {
  AI_AGENTS_REGISTRY,
  AI_PRIMARY_BOTS,
  processEnquiryWithAgent,
  approveAgentTask,
  draftStaffReplyForInquiry,
  confirmAndDispatchInquiryBySuperAdmin,
  dispatchInvoiceViaRiya,
  handleChatWithArjun
} from '../services/agentOrchestrator.js';
import { AgentTask } from '../models/AgentTask.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { assertDatabaseConnected } from '../config/db.js';
import { recordAuditEvent } from '../utils/auditLogger.js';

/**
 * Super Admin & Staff: Get list of AI Business Agents
 * (Defaults to the 7 internal agents for backward compatibility and test suites;
 * returns the 4 primary named bots when requested via ?scope=primary).
 */
export const getAgents = async (req, res, next) => {
  try {
    const { scope } = req.query;
    if (scope === 'primary') {
      return successResponse(res, Object.values(AI_PRIMARY_BOTS), 'Primary AI Bots retrieved');
    }
    const agents = Object.values(AI_AGENTS_REGISTRY);
    return successResponse(res, agents, 'AI Agents registry retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * Get 4 Named Primary Bots (Ananya, Riya, Neha, Arjun)
 */
export const getPrimaryBots = async (req, res, next) => {
  try {
    return successResponse(res, Object.values(AI_PRIMARY_BOTS), 'Primary AI Bots retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * Super Admin & Staff: Get all Agent Tasks and Drafts
 */
export const getAgentTasks = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { status, agentId } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.approvalStatus = status;
    }
    if (agentId && agentId !== 'All') {
      query.agentId = agentId;
    }

    const tasks = await AgentTask.find(query)
      .populate('customerId', 'name company email phone')
      .populate('enquiryId', 'reference productName quantity')
      .populate('quoteId', 'quotationNumber grandTotal status')
      .sort({ createdAt: -1 })
      .limit(100);

    return successResponse(res, tasks, 'Agent tasks retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * Staff / Super Admin: Trigger AI Agent processing for an enquiry
 */
export const triggerAgentEnquiryProcessing = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const task = await processEnquiryWithAgent(id);

    await recordAuditEvent({
      actor: req.user,
      action: 'AGENT_TASK_TRIGGERED',
      targetType: 'Enquiry',
      targetId: id,
      targetRef: task.title,
      metadata: { agentId: task.agentId, taskId: task._id },
      ip: req.ip
    });

    return successResponse(
      res,
      task,
      `Enquiry successfully routed to ${task.agentName}. Draft quotation created for Super Admin review.`,
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * SUPER ADMIN ONLY: Approve Agent Task & Authorize Quotation
 */
export const approveTask = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const { notes } = req.body;

    const task = await approveAgentTask(id, req.user, notes);

    return successResponse(
      res,
      task,
      'Agent task approved. Quotation is now verified and authorized for customer dispatch.'
    );
  } catch (error) {
    if (error.message.includes('FORBIDDEN')) {
      return errorResponse(res, error.message, 403);
    }
    next(error);
  }
};

/**
 * SUPER ADMIN ONLY: Reject or Request Revisions on Agent Task
 */
export const rejectTask = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const { reason, actionType } = req.body;

    const task = await AgentTask.findById(id);
    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    task.approvalStatus = actionType === 'changes_requested' ? 'changes_requested' : 'rejected';
    task.reviewNotes = reason || 'Super Admin rejected draft';
    task.executionStatus = 'cancelled';
    await task.save();

    await recordAuditEvent({
      actor: req.user,
      action: 'AGENT_TASK_REJECTED',
      targetType: 'Quote',
      targetId: task._id,
      targetRef: task.title,
      metadata: { reason, actionType },
      ip: req.ip
    });

    return successResponse(res, task, 'Task review updated');
  } catch (error) {
    next(error);
  }
};

/**
 * Public & Customer: Live Chat Inquiry handled by Arjun Yadav (Operations Manager)
 */
export const chatInquiryHandler = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { message, reference, email, phone } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return errorResponse(res, 'Message is required for live chat inquiry', 400);
    }

    const result = await handleChatWithArjun(
      {
        message,
        reference,
        customerEmail: email || req.user?.email,
        customerPhone: phone || req.user?.phone
      },
      req.user || null
    );

    return successResponse(res, result, 'Inquiry processed by Operations Desk');
  } catch (error) {
    next(error);
  }
};

/**
 * Staff: Submit proposed reply to Customer Inquiry for Super Admin confirmation
 */
export const submitStaffReplyHandler = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const { replyText } = req.body;

    if (!replyText || !replyText.trim()) {
      return errorResponse(res, 'Reply text is required', 400);
    }

    const task = await draftStaffReplyForInquiry(id, req.user, replyText);
    return successResponse(
      res,
      task,
      'Staff reply drafted. Submitted to Super Admin for confirmation prior to customer dispatch.'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * SUPER ADMIN ONLY: Confirm, Edit & Dispatch Inquiry Reply via Neha Desai
 */
export const confirmInquiryReplyHandler = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const { finalReplyText } = req.body;

    const task = await confirmAndDispatchInquiryBySuperAdmin(id, req.user, finalReplyText);

    await recordAuditEvent({
      actor: req.user,
      action: 'INQUIRY_REPLY_CONFIRMED',
      targetType: 'AgentTask',
      targetId: task._id,
      targetRef: task.title,
      metadata: { agentId: 'neha-desai' },
      ip: req.ip
    });

    return successResponse(
      res,
      task,
      'Inquiry reply confirmed by Super Admin and successfully dispatched to customer via Neha Desai (Email & WhatsApp).'
    );
  } catch (error) {
    if (error.message.includes('FORBIDDEN')) {
      return errorResponse(res, error.message, 403);
    }
    next(error);
  }
};

/**
 * Customer / Staff: Request Invoice on WhatsApp via Riya Shah
 */
export const requestInvoiceWhatsAppHandler = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { quoteId, phone } = req.body;

    if (!quoteId) {
      return errorResponse(res, 'Quotation / Order ID is required', 400);
    }

    const result = await dispatchInvoiceViaRiya(quoteId, phone || req.user?.phone);
    return successResponse(res, result, 'Invoice dispatch processed by Riya Shah');
  } catch (error) {
    next(error);
  }
};


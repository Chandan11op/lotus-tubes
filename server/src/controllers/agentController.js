import {
  AI_AGENTS_REGISTRY,
  processEnquiryWithAgent,
  approveAgentTask
} from '../services/agentOrchestrator.js';
import { AgentTask } from '../models/AgentTask.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { assertDatabaseConnected } from '../config/db.js';
import { recordAuditEvent } from '../utils/auditLogger.js';

/**
 * Super Admin & Staff: Get list of all 7 AI Business Agents
 */
export const getAgents = async (req, res, next) => {
  try {
    const agents = Object.values(AI_AGENTS_REGISTRY);
    return successResponse(res, agents, 'AI Agents registry retrieved');
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


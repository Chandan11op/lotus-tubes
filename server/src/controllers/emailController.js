import { EmailLog } from '../models/EmailLog.js';
import { sendEmail, dispatchPendingEmail } from '../services/emailService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { recordAuditEvent } from '../utils/auditLogger.js';
import { assertDatabaseConnected } from '../config/db.js';

/**
 * Lists paginated and filtered email communication logs for CRM
 */
export const getEmailLogs = async (req, res, next) => {
  try {
    assertDatabaseConnected();

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const { agentId, status, search, startDate, endDate } = req.query;

    const filter = {};

    if (agentId && agentId !== 'All' && agentId !== 'all') {
      filter.agentId = agentId;
    }

    if (status && status !== 'All' && status !== 'all') {
      if (status === 'failed') {
        filter.deliveryStatus = { $in: ['failed', 'bounced', 'complained'] };
      } else {
        filter.deliveryStatus = status;
      }
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    if (search && search.trim()) {
      const safeSearch = search.trim();
      const regex = new RegExp(safeSearch, 'i');
      filter.$or = [
        { subject: regex },
        { to: regex },
        { reference: regex },
        { agentName: regex }
      ];
    }

    const [total, emails] = await Promise.all([
      EmailLog.countDocuments(filter),
      EmailLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-bodyHtml') // Exclude heavy HTML body in list view
        .lean()
    ]);

    return successResponse(res, {
      emails,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Returns aggregated email delivery statistics
 */
export const getEmailStats = async (req, res, next) => {
  try {
    assertDatabaseConnected();

    const [
      total,
      delivered,
      accepted,
      pendingApproval,
      failed,
      bounced,
      agentAggregations
    ] = await Promise.all([
      EmailLog.countDocuments(),
      EmailLog.countDocuments({ deliveryStatus: 'delivered' }),
      EmailLog.countDocuments({ deliveryStatus: 'accepted' }),
      EmailLog.countDocuments({ deliveryStatus: 'pending_approval' }),
      EmailLog.countDocuments({ deliveryStatus: 'failed' }),
      EmailLog.countDocuments({ deliveryStatus: 'bounced' }),
      EmailLog.aggregate([
        {
          $group: {
            _id: '$agentId',
            count: { $sum: 1 },
            delivered: {
              $sum: { $cond: [{ $eq: ['$deliveryStatus', 'delivered'] }, 1, 0] }
            }
          }
        }
      ])
    ]);

    const byAgent = {};
    for (const agg of agentAggregations) {
      byAgent[agg._id] = {
        total: agg.count,
        delivered: agg.delivered
      };
    }

    return successResponse(res, {
      total,
      delivered,
      accepted,
      pendingApproval,
      failed,
      bounced,
      deliveryRate: total > 0 ? Math.round(((delivered + accepted) / total) * 100) : 100,
      byAgent
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves full details for a single email record including full HTML body & event log
 */
export const getEmailLogById = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;

    const email = await EmailLog.findById(id)
      .populate('customerId', 'name company email phone')
      .populate('quoteId', 'quotationNumber grandTotal status')
      .populate('invoiceId', 'invoiceNumber grandTotal status')
      .populate('approvedBy', 'name email role');

    if (!email) {
      return errorResponse(res, 'Email record not found', 404);
    }

    return successResponse(res, email);
  } catch (error) {
    next(error);
  }
};

/**
 * Super Admin action to re-attempt dispatching a failed email
 */
export const retryEmailDispatch = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;

    if (req.user?.role !== 'admin') {
      return errorResponse(res, 'FORBIDDEN: Only a Super Admin can retry email dispatches.', 403);
    }

    const email = await EmailLog.findById(id);
    if (!email) {
      return errorResponse(res, 'Email record not found', 404);
    }

    const dispatchResult = await sendEmail({
      agentId: email.agentId,
      to: email.to,
      subject: email.subject,
      html: email.bodyHtml,
      text: email.bodyText,
      replyTo: email.replyTo,
      cc: email.cc,
      bcc: email.bcc,
      attachments: email.attachments,
      reference: email.reference,
      customerId: email.customerId,
      quoteId: email.quoteId,
      invoiceId: email.invoiceId,
      agentTaskId: email.agentTaskId,
      approvedBy: req.user,
      idempotencyKey: `retry_${email._id}_${Date.now()}`
    });

    await recordAuditEvent({
      actor: req.user,
      action: 'EMAIL_DISPATCH_RETRIED',
      targetType: 'EmailLog',
      targetId: email._id,
      targetRef: email.subject,
      metadata: { originalId: email._id, result: dispatchResult },
      ip: req.ip
    });

    return successResponse(res, dispatchResult, 'Email dispatch re-attempted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Super Admin action to approve and dispatch a pending email
 */
export const approveEmailDispatch = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;

    if (req.user?.role !== 'admin') {
      return errorResponse(res, 'FORBIDDEN: Only a Super Admin can approve queued emails.', 403);
    }

    const dispatchResult = await dispatchPendingEmail(id, req.user);

    await recordAuditEvent({
      actor: req.user,
      action: 'EMAIL_DISPATCH_APPROVED',
      targetType: 'EmailLog',
      targetId: id,
      targetRef: `Approved by Super Admin ${req.user.name}`,
      metadata: { result: dispatchResult },
      ip: req.ip
    });

    return successResponse(res, dispatchResult, 'Queued email approved and dispatched successfully');
  } catch (error) {
    next(error);
  }
};

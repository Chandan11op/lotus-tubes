import { Enquiry } from '../models/Enquiry.js';
import { Quote } from '../models/Quote.js';
import { Customer } from '../models/Customer.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { successResponse } from '../utils/responseHandler.js';
import { assertDatabaseConnected } from '../config/db.js';

export const getDashboardMetrics = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const now = new Date();

    const [
      totalEnquiries,
      newLeads,
      unassignedLeads,
      totalQuotes,
      pendingQuotes,
      confirmedOrders,
      lostEnquiries,
      totalCustomers,
      pendingTasks,
      overdueTasks,
      countryDistribution,
      categoryDistribution,
      staffPerformance
    ] = await Promise.all([
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'New' }),
      Enquiry.countDocuments({ assignedTo: null }),
      Quote.countDocuments(),
      Quote.countDocuments({ status: { $in: ['Draft', 'Pending Approval', 'Sent', 'Received', 'Under Review'] } }),
      Enquiry.countDocuments({ status: 'Order Confirmed' }),
      Enquiry.countDocuments({ status: 'Lost' }),
      Customer.countDocuments({ status: { $ne: 'Inactive' } }),
      Task.countDocuments({ completed: false }),
      Task.countDocuments({ completed: false, dueDate: { $lt: now } }),
      // Distribution by country
      Enquiry.aggregate([
        { $group: { _id: { $ifNull: ['$country', 'India'] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 }
      ]),
      // Distribution by product/category
      Enquiry.aggregate([
        { $group: { _id: { $ifNull: ['$productName', 'Sanitary Component'] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 }
      ]),
      // Staff Performance
      Enquiry.aggregate([
        { $match: { assignedTo: { $ne: null } } },
        { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'staff'
          }
        },
        { $unwind: '$staff' },
        {
          $project: {
            staffName: '$staff.name',
            department: '$staff.department',
            leadsHandled: '$count'
          }
        }
      ])
    ]);

    const conversionRate = totalEnquiries > 0 ? Math.round((confirmedOrders / totalEnquiries) * 100 * 10) / 10 : 0;

    return successResponse(res, {
      summary: {
        totalEnquiries,
        newLeads,
        unassignedLeads,
        totalQuotes,
        pendingQuotes,
        confirmedOrders,
        lostEnquiries,
        totalCustomers,
        pendingTasks,
        overdueTasks,
        conversionRate: `${conversionRate}%`
      },
      charts: {
        countryDistribution: countryDistribution.map((c) => ({ label: c._id, count: c.count })),
        productDistribution: categoryDistribution.map((p) => ({ label: p._id, count: p.count })),
        staffPerformance
      }
    });
  } catch (error) {
    next(error);
  }
};

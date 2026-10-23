import { Task } from '../models/Task.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { assertDatabaseConnected } from '../config/db.js';

export const getTasks = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { assignedTo, status, priority } = req.query;

    const query = {};
    if (assignedTo && assignedTo !== 'All') query.assignedTo = assignedTo;
    if (status && status !== 'All') query.status = status;
    if (priority && priority !== 'All') query.priority = priority;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email department')
      .populate('relatedEnquiry', 'reference productName company')
      .populate('relatedQuote', 'quotationNumber customerName company')
      .populate('relatedCustomer', 'name company phone')
      .sort({ dueDate: 1 });

    return successResponse(res, tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { title, description, assignedTo, dueDate, priority, relatedEnquiry, relatedQuote, relatedCustomer } = req.body;

    if (!title || !dueDate || !assignedTo) {
      return errorResponse(res, 'Task title, due date, and assigned staff member are required', 400);
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      assignedTo,
      createdBy: req.user?.id || null,
      dueDate: new Date(dueDate),
      priority: priority || 'Medium',
      relatedEnquiry: relatedEnquiry || null,
      relatedQuote: relatedQuote || null,
      relatedCustomer: relatedCustomer || null,
      status: 'Pending',
      completed: false
    });

    return successResponse(res, task, 'Task scheduled successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return errorResponse(res, 'Task not found', 404);
    }

    const { title, description, assignedTo, dueDate, priority, status, completed } = req.body;

    if (title) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (assignedTo) task.assignedTo = assignedTo;
    if (dueDate) task.dueDate = new Date(dueDate);
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (completed !== undefined) {
      task.completed = !!completed;
      task.completedAt = task.completed ? new Date() : null;
      if (task.completed) task.status = 'Completed';
    }

    await task.save();
    return successResponse(res, task, 'Task updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) {
      return errorResponse(res, 'Task not found', 404);
    }
    return successResponse(res, null, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};

import express from 'express';
import { getHealth } from '../controllers/healthController.js';
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry
} from '../controllers/enquiryController.js';
import { submitContact } from '../controllers/contactController.js';
import {
  submitQuote,
  getQuotes,
  createFormalQuote,
  updateQuote,
  sendQuoteByEmail,
  submitForApproval,
  approveQuote,
  requestChangesQuote,
  rejectQuote
} from '../controllers/quoteController.js';
import {
  registerCustomer,
  loginCustomer,
  loginStaff,
  getMe,
  getMyQuotations,
  getStaffUsers,
  createStaffUser,
  updateStaffUser,
  changeStaffPassword,
  forgotStaffPassword,
  resetStaffPasswordWithOtp,
  getAuditLogs
} from '../controllers/authController.js';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  mergeCustomers
} from '../controllers/customerController.js';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { getDashboardMetrics } from '../controllers/reportController.js';
import { validateEnquiry, validateContact, validateQuote } from '../middleware/validateRequest.js';
import { authenticate, requireStaff, requireSuperAdmin, optionalAuth } from '../middleware/authMiddleware.js';
import { requireTurnstileForAnonymous } from '../middleware/turnstileMiddleware.js';
import { publicFormLimiter, authLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

// Health Check
router.get('/health', getHealth);

// Public / Customer Authentication (rate limited)
router.post('/auth/customer/register', authLimiter, registerCustomer);
router.post('/auth/customer/login', authLimiter, loginCustomer);

// Staff Authentication & Password Security (rate limited)
router.post('/auth/staff/login', authLimiter, loginStaff);
router.post('/auth/staff/change-password', authenticate, requireStaff, changeStaffPassword);
router.post('/auth/staff/forgot-password', authLimiter, forgotStaffPassword);
router.post('/auth/staff/reset-password-otp', authLimiter, resetStaffPasswordWithOtp);

// Authenticated User Profile & Quotations
router.get('/auth/me', authenticate, getMe);
router.get('/auth/my-quotes', authenticate, getMyQuotations);
router.get('/auth/my-quotations', authenticate, getMyQuotations);

// Super Admin Staff Management & Security Audit
router.get('/users/staff', authenticate, requireSuperAdmin, getStaffUsers);
router.post('/users/staff', authenticate, requireSuperAdmin, createStaffUser);
router.patch('/users/staff/:id', authenticate, requireSuperAdmin, updateStaffUser);
router.get('/audit-logs', authenticate, requireSuperAdmin, getAuditLogs);

// Product Enquiries (Quick RFQ)
router.post('/enquiries', publicFormLimiter, optionalAuth, requireTurnstileForAnonymous, validateEnquiry, createEnquiry);
router.get('/enquiries', authenticate, requireStaff, getEnquiries);
router.get('/enquiries/:id', authenticate, requireStaff, getEnquiryById);
router.patch('/enquiries/:id', authenticate, requireStaff, updateEnquiry);
router.delete('/enquiries/:id', authenticate, requireSuperAdmin, deleteEnquiry);

// Detailed Quote / BOQ Submission & Management
router.post('/quotes', publicFormLimiter, optionalAuth, requireTurnstileForAnonymous, validateQuote, submitQuote);
router.get('/quotes', authenticate, requireStaff, getQuotes);
router.post('/quotes/formal', authenticate, requireStaff, createFormalQuote);
router.patch('/quotes/:id', authenticate, requireStaff, updateQuote);
router.post('/quotes/:id/submit-approval', authenticate, requireStaff, submitForApproval);
router.post('/quotes/:id/approve', authenticate, requireSuperAdmin, approveQuote);
router.post('/quotes/:id/request-changes', authenticate, requireSuperAdmin, requestChangesQuote);
router.post('/quotes/:id/reject', authenticate, requireSuperAdmin, rejectQuote);
router.post('/quotes/:id/send-email', authenticate, requireStaff, sendQuoteByEmail);

// Customer Management (Staff CRM)
router.get('/customers', authenticate, requireStaff, getCustomers);
router.get('/customers/:id', authenticate, requireStaff, getCustomerById);
router.post('/customers', authenticate, requireStaff, createCustomer);
router.patch('/customers/:id', authenticate, requireStaff, updateCustomer);
router.post('/customers/merge', authenticate, requireStaff, mergeCustomers);

// Tasks & Follow-up Actions (Staff CRM)
router.get('/tasks', authenticate, requireStaff, getTasks);
router.post('/tasks', authenticate, requireStaff, createTask);
router.patch('/tasks/:id', authenticate, requireStaff, updateTask);
router.delete('/tasks/:id', authenticate, requireStaff, deleteTask);

// Product Catalogue Management
router.get('/products', getProducts);
router.get('/products/:slug', getProductBySlug);
router.post('/products', authenticate, requireStaff, createProduct);
router.patch('/products/:id', authenticate, requireStaff, updateProduct);
router.delete('/products/:id', authenticate, requireStaff, deleteProduct);

// CRM Analytics & Reporting Metrics
router.get('/reports/metrics', authenticate, requireStaff, getDashboardMetrics);
router.get('/reports/dashboard', authenticate, requireStaff, getDashboardMetrics);

// Contact Us Form
router.post('/contact', publicFormLimiter, validateContact, submitContact);

export default router;

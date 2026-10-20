import express from 'express';
import { getHealth } from '../controllers/healthController.js';
import { createEnquiry, getEnquiries } from '../controllers/enquiryController.js';
import { submitContact } from '../controllers/contactController.js';
import { submitQuote, getQuotes } from '../controllers/quoteController.js';
import {
  registerCustomer,
  loginCustomer,
  loginStaff,
  getMe,
  getMyQuotations
} from '../controllers/authController.js';
import { validateEnquiry, validateContact, validateQuote } from '../middleware/validateRequest.js';
import { authenticate, requireStaff, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Health Check
router.get('/health', getHealth);

// Customer Authentication
router.post('/auth/customer/register', registerCustomer);
router.post('/auth/customer/login', loginCustomer);

// Staff Authentication (No public staff registration)
router.post('/auth/staff/login', loginStaff);

// Authenticated User Profile & Quotations
router.get('/auth/me', authenticate, getMe);
router.get('/auth/my-quotes', authenticate, getMyQuotations);
router.get('/auth/my-quotations', authenticate, getMyQuotations);

// Product Enquiries (Quick RFQ)
router.post('/enquiries', optionalAuth, validateEnquiry, createEnquiry);
router.get('/enquiries', authenticate, requireStaff, getEnquiries);

// Contact Us
router.post('/contact', validateContact, submitContact);

// Detailed Quote / BOQ Submission
router.post('/quotes', optionalAuth, validateQuote, submitQuote);
router.get('/quotes', authenticate, requireStaff, getQuotes);

export default router;

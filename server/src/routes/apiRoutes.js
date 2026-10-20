import express from 'express';
import { getHealth } from '../controllers/healthController.js';
import { createEnquiry, getEnquiries } from '../controllers/enquiryController.js';
import { submitContact } from '../controllers/contactController.js';
import { submitQuote } from '../controllers/quoteController.js';
import { validateEnquiry, validateContact, validateQuote } from '../middleware/validateRequest.js';

const router = express.Router();

// Health Check
router.get('/health', getHealth);

// Product Enquiries (Quick RFQ)
router.post('/enquiries', validateEnquiry, createEnquiry);
router.get('/enquiries', getEnquiries);

// Contact Us
router.post('/contact', validateContact, submitContact);

// Detailed Quote / BOQ Submission
router.post('/quotes', validateQuote, submitQuote);

export default router;

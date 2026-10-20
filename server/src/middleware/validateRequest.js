import { errorResponse } from '../utils/responseHandler.js';

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validateEnquiry = (req, res, next) => {
  const { name, company, email, phone, quantity, location } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Full name is required (min 2 characters)' });
  }

  if (!company || company.trim().length < 2) {
    errors.push({ field: 'company', message: 'Company name is required' });
  }

  if (!email || !validateEmail(email)) {
    errors.push({ field: 'email', message: 'A valid business email address is required' });
  }

  if (!phone || phone.trim().length < 7) {
    errors.push({ field: 'phone', message: 'A valid contact phone or WhatsApp number is required' });
  }

  if (!quantity || quantity.trim().length < 1) {
    errors.push({ field: 'quantity', message: 'Estimated quantity is required' });
  }

  if (!location || location.trim().length < 2) {
    errors.push({ field: 'location', message: 'Delivery location is required' });
  }

  // Basic anti-spam check (honeypot field)
  if (req.body.website_url || req.body._gotcha) {
    return errorResponse(res, 'Spam submission detected', 400);
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', 422, errors);
  }

  next();
};

export const validateContact = (req, res, next) => {
  const { name, email, phone, message } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!email || !validateEmail(email)) {
    errors.push({ field: 'email', message: 'A valid email address is required' });
  }

  if (!phone || phone.trim().length < 7) {
    errors.push({ field: 'phone', message: 'A valid phone number is required' });
  }

  if (!message || message.trim().length < 5) {
    errors.push({ field: 'message', message: 'Message must be at least 5 characters long' });
  }

  if (req.body.website_url || req.body._gotcha) {
    return errorResponse(res, 'Spam submission detected', 400);
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', 422, errors);
  }

  next();
};

export const validateQuote = (req, res, next) => {
  const { name, company, email, phone, projectType } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!company || company.trim().length < 2) {
    errors.push({ field: 'company', message: 'Company name is required' });
  }

  if (!email || !validateEmail(email)) {
    errors.push({ field: 'email', message: 'A valid email is required' });
  }

  if (!phone || phone.trim().length < 7) {
    errors.push({ field: 'phone', message: 'A valid phone number is required' });
  }

  if (req.body.website_url || req.body._gotcha) {
    return errorResponse(res, 'Spam submission detected', 400);
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', 422, errors);
  }

  next();
};

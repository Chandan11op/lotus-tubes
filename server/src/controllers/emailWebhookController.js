import { verifyWebhookSignature, processWebhookEvent } from '../services/emailWebhookService.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { config } from '../config/env.js';

/**
 * Resend Webhook Controller
 * Handles delivery, bounce, and complaint notifications from Resend.
 */
export const handleResendWebhook = async (req, res, next) => {
  try {
    const rawBody = req.rawBody || JSON.stringify(req.body);
    const webhookSecret = config.resend.webhookSecret;

    // In production or when secret is set, verify cryptographic Svix signature
    if (webhookSecret) {
      const isValid = verifyWebhookSignature(req.headers, rawBody, webhookSecret);
      if (!isValid) {
        console.warn('⚠️ Rejected Resend webhook: Invalid cryptographic signature.');
        return errorResponse(res, 'Invalid webhook signature', 401);
      }
    } else if (config.isProduction) {
      console.warn('⚠️ RESEND_WEBHOOK_SECRET is not configured in production environment.');
    }

    const payload = req.body;
    if (!payload) {
      return errorResponse(res, 'Empty payload', 400);
    }

    // Support single event or batch events array
    const events = Array.isArray(payload) ? payload : [payload];
    const results = [];

    for (const ev of events) {
      const result = await processWebhookEvent(ev);
      results.push(result);
    }

    return successResponse(res, { processed: results.length, results }, 'Webhook processed successfully', 200);
  } catch (error) {
    console.error('❌ Resend Webhook Handler Error:', error.message);
    next(error);
  }
};

import { verifyTurnstileToken } from '../services/turnstileService.js';
import { errorResponse } from '../utils/responseHandler.js';

/**
 * Middleware to enforce Cloudflare Turnstile verification on anonymous requests.
 * Authenticated requests with a validated session/token bypass Turnstile.
 */
export const requireTurnstileForAnonymous = async (req, res, next) => {
  // Authenticated sessions bypass Turnstile
  if (req.user) {
    return next();
  }

  const token = req.body.turnstileToken || req.headers['cf-turnstile-token'];
  const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  const verification = await verifyTurnstileToken(token, clientIp);

  if (!verification.success) {
    if (verification.isConfigError) {
      return errorResponse(res, verification.message, 500);
    }
    return errorResponse(res, verification.message || 'Security verification failed', 403, verification.errorCodes);
  }

  next();
};

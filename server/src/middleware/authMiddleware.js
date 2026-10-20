import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { errorResponse } from '../utils/responseHandler.js';

const JWT_SECRET = process.env.JWT_SECRET || 'lotus_tubes_jwt_secret_dev_2026_hygienic_valves';

/**
 * Enforces authenticated user
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication required. Please provide a valid Bearer token.', 401);
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      return errorResponse(res, 'Session expired or invalid token. Please log in again.', 401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Enforces staff/admin access
 */
export const requireStaff = (req, res, next) => {
  if (!req.user || req.user.role !== 'staff') {
    return errorResponse(res, 'Forbidden: Staff access only. Unauthorized account role.', 403);
  }
  next();
};

/**
 * Optional authentication: attaches req.user if a valid token exists
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (e) {
      // Ignore invalid token for optional auth
    }
  }
  next();
};

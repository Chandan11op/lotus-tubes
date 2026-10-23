import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { errorResponse } from '../utils/responseHandler.js';

/**
 * Enforces authenticated user across any active role
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
      decoded = jwt.verify(token, config.jwtSecret);
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
 * Enforces staff or super admin access
 */
export const requireStaff = (req, res, next) => {
  if (!req.user || (req.user.role !== 'staff' && req.user.role !== 'admin')) {
    return errorResponse(res, 'Forbidden: Staff or Administrator access only.', 403);
  }
  next();
};

/**
 * Enforces Super Admin access exclusively
 */
export const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return errorResponse(res, 'Forbidden: Super Administrator access required.', 403);
  }
  next();
};

/**
 * Enforces specific granular permission or Super Admin status
 */
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }
    if (req.user.role === 'admin') {
      return next();
    }
    const perms = Array.isArray(req.user.permissions) ? req.user.permissions : [];
    if (perms.includes('all') || perms.includes(permission)) {
      return next();
    }
    return errorResponse(res, `Forbidden: You do not possess the required permission [${permission}].`, 403);
  };
};

/**
 * Optional authentication: attaches req.user if a valid token exists
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded;
    } catch (e) {
      // Ignore invalid token for optional auth
    }
  }
  next();
};

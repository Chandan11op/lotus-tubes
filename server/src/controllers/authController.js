import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Enquiry } from '../models/Enquiry.js';
import { Quote } from '../models/Quote.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { config } from '../config/env.js';
import { getDBStatus, assertDatabaseConnected } from '../config/db.js';

// Helper to generate JWT token with full RBAC claims
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department || 'sales',
      permissions: user.permissions || [],
      company: user.company || '',
      phone: user.phone || ''
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

/**
 * Register a new Customer (Public registration strictly restricted to 'customer' role)
 */
export const registerCustomer = async (req, res, next) => {
  try {
    const { name, email, password, company, phone, country } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email, and password are required', 400);
    }

    if (password.length < 8) {
      return errorResponse(res, 'Password must be at least 8 characters long for security', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    assertDatabaseConnected();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return errorResponse(res, 'An account with this email address already exists. Please sign in.', 409);
    }

    // Role is strictly forced to customer; public registration cannot grant staff/admin privileges
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'customer',
      department: 'client',
      permissions: ['self:access'],
      company: (company || '').trim(),
      phone: (phone || '').trim(),
      country: (country || 'India').trim(),
      isEmailVerified: true,
      accountStatus: 'active'
    });

    const token = generateToken(user);
    return successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          permissions: user.permissions,
          company: user.company,
          phone: user.phone,
          country: user.country
        }
      },
      'Customer registered successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Customer Login
 */
export const loginCustomer = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Please provide both email and password', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    assertDatabaseConnected();

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid credentials. No account found.', 401);
    }

    if (user.role !== 'customer') {
      return errorResponse(res, 'Please use the Staff Workspace portal for administrative access.', 403);
    }

    if (user.accountStatus === 'suspended') {
      return errorResponse(res, 'This customer account has been suspended. Please contact support.', 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials. Incorrect password.', 401);
    }

    const token = generateToken(user);
    return successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          permissions: user.permissions,
          company: user.company,
          phone: user.phone,
          country: user.country
        }
      },
      'Customer logged in successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Staff Login (Enforces staff and admin accounts only)
 */
export const loginStaff = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Please provide staff email and password', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    assertDatabaseConnected();

    const user = await User.findOne({
      email: normalizedEmail,
      role: { $in: ['staff', 'admin'] }
    }).select('+password');

    if (!user) {
      return errorResponse(res, 'Invalid staff credentials or account not provisioned.', 401);
    }

    if (user.accountStatus !== 'active') {
      return errorResponse(res, 'Your staff account is currently inactive. Contact your Super Admin.', 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid staff credentials.', 401);
    }

    const token = generateToken(user);
    return successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          permissions: user.permissions,
          company: user.company,
          phone: user.phone
        }
      },
      'Staff workspace authenticated successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user profile
 */
export const getMe = async (req, res) => {
  return successResponse(res, { user: req.user });
};

/**
 * Get quotations and RFQs submitted by the current customer
 */
export const getMyQuotations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    assertDatabaseConnected();

    const [enquiries, quotes] = await Promise.all([
      Enquiry.find({ $or: [{ userId }, { email: userEmail }] }).sort({ createdAt: -1 }),
      Quote.find({ $or: [{ createdBy: userId }, { email: userEmail }] }).sort({ createdAt: -1 })
    ]);

    return successResponse(res, { enquiries, quotes });
  } catch (error) {
    next(error);
  }
};

/**
 * Super Admin: List all staff accounts
 */
export const getStaffUsers = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const staffList = await User.find({ role: { $in: ['staff', 'admin'] } })
      .select('-password')
      .sort({ createdAt: -1 });

    return successResponse(res, staffList);
  } catch (error) {
    next(error);
  }
};

/**
 * Super Admin: Create a new Staff Account with departmental role and permissions
 */
export const createStaffUser = async (req, res, next) => {
  try {
    const { name, email, password, role, department, permissions, phone, company } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email, and initial password are required', 400);
    }

    if (password.length < 8) {
      return errorResponse(res, 'Password must be at least 8 characters long', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    assertDatabaseConnected();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return errorResponse(res, 'A user account with this email already exists', 409);
    }

    const newStaff = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: role === 'admin' ? 'admin' : 'staff',
      department: department || 'sales',
      permissions: Array.isArray(permissions) && permissions.length ? permissions : undefined,
      company: company || 'Lotus Tubes',
      phone: phone || '',
      isEmailVerified: true,
      accountStatus: 'active'
    });

    return successResponse(
      res,
      {
        id: newStaff._id,
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role,
        department: newStaff.department,
        permissions: newStaff.permissions
      },
      'Staff member provisioned successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Super Admin: Update Staff permissions, department, or active status
 */
export const updateStaffUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, department, role, permissions, accountStatus, phone } = req.body;
    assertDatabaseConnected();

    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, 'Staff member not found', 404);
    }

    if (name) user.name = name.trim();
    if (department) user.department = department;
    if (role && (role === 'staff' || role === 'admin')) user.role = role;
    if (Array.isArray(permissions)) user.permissions = permissions;
    if (accountStatus) user.accountStatus = accountStatus;
    if (phone !== undefined) user.phone = phone.trim();

    await user.save();

    return successResponse(
      res,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        permissions: user.permissions,
        accountStatus: user.accountStatus
      },
      'Staff member updated successfully'
    );
  } catch (error) {
    next(error);
  }
};

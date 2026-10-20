import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Enquiry } from '../models/Enquiry.js';
import { Quote } from '../models/Quote.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { getDBStatus } from '../config/db.js';
import { memoryUsers, memoryEnquiries, memoryQuotes } from '../utils/memoryStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'lotus_tubes_jwt_secret_dev_2026_hygienic_valves';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      company: user.company || '',
      phone: user.phone || ''
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Bootstrap default staff account in memory if provided via env
const staffEmail = (process.env.STAFF_INIT_EMAIL || 'chirag@lotustubes.com').toLowerCase();
const staffPass = process.env.STAFF_INIT_PASSWORD || 'LotusTubesStaff2026!';
const hashedStaffPass = bcrypt.hashSync(staffPass, 10);
memoryUsers.set(staffEmail, {
  id: 'staff-001',
  _id: 'staff-001',
  name: 'Chirag Shah',
  email: staffEmail,
  password: hashedStaffPass,
  role: 'staff',
  company: 'Lotus Tubes',
  phone: '+919930430789',
  createdAt: new Date()
});

/**
 * Register a new Customer (Public)
 */
export const registerCustomer = async (req, res, next) => {
  try {
    const { name, email, password, company, phone } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email, and password are required', 400);
    }

    if (password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters long', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return errorResponse(res, 'An account with this email address already exists. Please log in.', 409);
      }

      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: 'customer',
        company: (company || '').trim(),
        phone: (phone || '').trim()
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
            company: user.company,
            phone: user.phone
          }
        },
        'Customer registered successfully',
        201
      );
    }

    // Graceful offline memory fallback
    if (memoryUsers.has(normalizedEmail)) {
      return errorResponse(res, 'An account with this email address already exists. Please log in.', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = 'cust-' + Date.now();
    const newUser = {
      id: userId,
      _id: userId,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'customer',
      company: (company || '').trim(),
      phone: (phone || '').trim(),
      createdAt: new Date()
    };
    memoryUsers.set(normalizedEmail, newUser);

    const token = generateToken(newUser);
    return successResponse(
      res,
      {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          company: newUser.company,
          phone: newUser.phone
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
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const user = await User.findOne({ email: normalizedEmail }).select('+password');
      if (!user) {
        return errorResponse(res, 'Invalid credentials. No customer account found.', 401);
      }

      if (user.role !== 'customer') {
        return errorResponse(res, 'Access denied: Please use the Staff login portal for administrative access.', 403);
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return errorResponse(res, 'Invalid credentials. Incorrect password.', 401);
      }

      const token = generateToken(user);
      return successResponse(res, {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company,
          phone: user.phone
        }
      }, 'Logged in successfully');
    }

    // Offline memory fallback
    const memUser = memoryUsers.get(normalizedEmail);
    if (!memUser || memUser.role !== 'customer') {
      return errorResponse(res, 'Invalid credentials. No customer account found.', 401);
    }

    const isMatch = await bcrypt.compare(password, memUser.password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials. Incorrect password.', 401);
    }

    const token = generateToken(memUser);
    return successResponse(res, {
      token,
      user: {
        id: memUser.id,
        name: memUser.name,
        email: memUser.email,
        role: memUser.role,
        company: memUser.company,
        phone: memUser.phone
      }
    }, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Staff Login (Strictly restricted, no public registration)
 */
export const loginStaff = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Please provide staff email and password', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const user = await User.findOne({ email: normalizedEmail, role: 'staff' }).select('+password');
      if (!user) {
        return errorResponse(res, 'Invalid staff credentials or account not provisioned.', 401);
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return errorResponse(res, 'Invalid staff credentials.', 401);
      }

      const token = generateToken(user);
      return successResponse(res, {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company,
          phone: user.phone
        }
      }, 'Staff workspace authenticated successfully');
    }

    // Offline memory fallback for configured staff
    const memUser = memoryUsers.get(normalizedEmail);
    if (!memUser || memUser.role !== 'staff') {
      return errorResponse(res, 'Invalid staff credentials or account not provisioned.', 401);
    }

    const isMatch = await bcrypt.compare(password, memUser.password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid staff credentials.', 401);
    }

    const token = generateToken(memUser);
    return successResponse(res, {
      token,
      user: {
        id: memUser.id,
        name: memUser.name,
        email: memUser.email,
        role: memUser.role,
        company: memUser.company,
        phone: memUser.phone
      }
    }, 'Staff workspace authenticated successfully');
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
 * Get quotations submitted by the current authenticated customer
 */
export const getMyQuotations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      // Find quotations matching either verified userId or user's normalized email
      const [enquiries, quotes] = await Promise.all([
        Enquiry.find({ $or: [{ userId }, { email: userEmail }] }).sort({ createdAt: -1 }),
        Quote.find({ $or: [{ userId }, { email: userEmail }] }).sort({ createdAt: -1 })
      ]);

      return successResponse(res, {
        enquiries,
        quotes
      });
    }

    // Graceful offline fallback
    const matchedEnquiries = memoryEnquiries.filter(
      (e) => e.userId === userId || e.email?.toLowerCase() === userEmail?.toLowerCase()
    );
    const matchedQuotes = memoryQuotes.filter(
      (q) => q.userId === userId || q.email?.toLowerCase() === userEmail?.toLowerCase()
    );

    return successResponse(res, {
      enquiries: matchedEnquiries,
      quotes: matchedQuotes
    });
  } catch (error) {
    next(error);
  }
};

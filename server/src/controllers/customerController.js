import { Customer } from '../models/Customer.js';
import { Enquiry } from '../models/Enquiry.js';
import { Quote } from '../models/Quote.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { assertDatabaseConnected } from '../config/db.js';

export const getCustomers = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { search, tier, status, page = 1, limit = 50 } = req.query;

    const query = {};
    if (tier && tier !== 'All') query.customerTier = tier;
    if (status && status !== 'All') query.status = status;
    if (search) {
      const q = search.trim();
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { gstin: { $regex: q, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [customers, total] = await Promise.all([
      Customer.find(query)
        .populate('assignedTo', 'name email department')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Customer.countDocuments(query)
    ]);

    return successResponse(res, {
      customers,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const customer = await Customer.findById(id).populate('assignedTo', 'name email department');
    if (!customer) {
      return errorResponse(res, 'Customer not found', 404);
    }

    // Retrieve linked enquiries and quotes
    const [enquiries, quotes] = await Promise.all([
      Enquiry.find({ $or: [{ customerId: customer._id }, { email: customer.email }] }).sort({ createdAt: -1 }),
      Quote.find({ $or: [{ customerId: customer._id }, { email: customer.email }] }).sort({ createdAt: -1 })
    ]);

    return successResponse(res, { customer, enquiries, quotes });
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { name, company, email, phone, country, city, gstin, industry, customerTier, assignedTo } = req.body;

    if (!name || !company || !email || !phone) {
      return errorResponse(res, 'Name, company, email, and phone are required', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await Customer.findOne({ email: normalizedEmail });
    if (existing) {
      return errorResponse(res, `A customer record with email ${normalizedEmail} already exists.`, 409);
    }

    const customer = await Customer.create({
      name: name.trim(),
      company: company.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      country: country || 'India',
      city: city || '',
      gstin: gstin || '',
      industry: industry || 'Pharmaceutical',
      customerTier: customerTier || 'Standard Inquiry',
      assignedTo: assignedTo || null,
      status: 'Active',
      notes: [{ content: 'Customer account created manually by staff', author: req.user?.name || 'Staff' }]
    });

    return successResponse(res, customer, 'Customer record created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      return errorResponse(res, 'Customer not found', 404);
    }

    const { name, company, phone, country, city, gstin, industry, customerTier, status, assignedTo, note } = req.body;

    if (name) customer.name = name.trim();
    if (company) customer.company = company.trim();
    if (phone) customer.phone = phone.trim();
    if (country) customer.country = country;
    if (city !== undefined) customer.city = city;
    if (gstin !== undefined) customer.gstin = gstin;
    if (industry) customer.industry = industry;
    if (customerTier) customer.customerTier = customerTier;
    if (status) customer.status = status;
    if (assignedTo !== undefined) customer.assignedTo = assignedTo || null;

    if (note) {
      customer.notes.push({
        content: note,
        author: req.user?.name || 'Staff'
      });
    }

    await customer.save();
    return successResponse(res, customer, 'Customer record updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Merge two customer records
 */
export const mergeCustomers = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { primaryId, duplicateId } = req.body;

    if (!primaryId || !duplicateId || primaryId === duplicateId) {
      return errorResponse(res, 'Please provide valid primary and duplicate customer IDs', 400);
    }

    const [primary, duplicate] = await Promise.all([
      Customer.findById(primaryId),
      Customer.findById(duplicateId)
    ]);

    if (!primary || !duplicate) {
      return errorResponse(res, 'One or both customer records were not found', 404);
    }

    // Re-link enquiries and quotes from duplicate to primary
    await Promise.all([
      Enquiry.updateMany({ customerId: duplicate._id }, { $set: { customerId: primary._id } }),
      Quote.updateMany({ customerId: duplicate._id }, { $set: { customerId: primary._id } })
    ]);

    // Append notes
    duplicate.notes.forEach((n) => {
      primary.notes.push({
        content: `[Merged from ${duplicate.email}] ${n.content}`,
        author: n.author,
        createdAt: n.createdAt
      });
    });

    primary.notes.push({
      content: `Merged record from ${duplicate.name} (${duplicate.email}) on ${new Date().toLocaleDateString()}`,
      author: req.user?.name || 'Staff'
    });

    duplicate.status = 'Inactive';
    duplicate.mergedWith = primary._id;

    await Promise.all([primary.save(), duplicate.save()]);

    return successResponse(res, primary, 'Customer records merged successfully');
  } catch (error) {
    next(error);
  }
};

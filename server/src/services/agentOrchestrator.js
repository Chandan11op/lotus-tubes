import { AgentTask } from '../models/AgentTask.js';
import { Enquiry } from '../models/Enquiry.js';
import { Quote, computeQuotationApprovalHash } from '../models/Quote.js';
import { Customer } from '../models/Customer.js';
import { MASTER_PRODUCTS as CATALOG } from '../data/catalogData.js';
import { recordAuditEvent } from '../utils/auditLogger.js';
import { generateReference } from '../utils/security.js';

/**
 * 7 AI BUSINESS AGENTS DEFINITIONS
 */
export const AI_AGENTS_REGISTRY = {
  'dom-sales-1': {
    id: 'dom-sales-1',
    name: 'Domestic Sales Agent 1 (Western & Northern India)',
    role: 'domestic_sales',
    territory: 'Maharashtra, Gujarat, Delhi NCR, Punjab, Haryana, Rajasthan',
    specialty: 'Pharmaceutical & Biotechnology High Purity Tubing (ASTM A270, ASME BPE)',
    description: 'Handles domestic RFQs for Western and Northern Indian pharma hubs, technical spec matching, and BOQ draft preparation.'
  },
  'dom-sales-2': {
    id: 'dom-sales-2',
    name: 'Domestic Sales Agent 2 (Southern & Central India)',
    role: 'domestic_sales',
    territory: 'Karnataka, Telangana, Tamil Nadu, Andhra Pradesh, Kerala, MP',
    specialty: 'Dairy, Food & Beverage Process Lines (Tri-Clamp Fittings, Bends, Tees, Ferrule Systems)',
    description: 'Handles high-volume dairy and beverage processing piping, hygienic clamp components, and domestic distributor accounts.'
  },
  'dom-sales-3': {
    id: 'dom-sales-3',
    name: 'Domestic Sales Agent 3 (Eastern & Industrial OEM)',
    role: 'domestic_sales',
    territory: 'West Bengal, Odisha, Jharkhand, Chhattisgarh, North East',
    specialty: 'Industrial Sanitary Valves, Custom Spools, Manifolds & Skid Modules',
    description: 'Focuses on heavy industrial hygienic projects, skid fabricators, EPC contractors, and customized valve automation packages.'
  },
  'intl-sales-1': {
    id: 'intl-sales-1',
    name: 'International Sales Agent 1 (Americas & Europe)',
    role: 'international_sales',
    territory: 'USA, Canada, Germany, UK, Netherlands, Switzerland, Italy, France',
    specialty: 'ASME BPE, 3-A Sanitary Standards, EN 10204 3.1 MTR Compliance, Export Packaging',
    description: 'Handles export enquiries for Western regulated markets with rigorous surface finish Ra ≤ 0.38µm (EP) documentation.'
  },
  'intl-sales-2': {
    id: 'intl-sales-2',
    name: 'International Sales Agent 2 (Middle East, SE Asia & Oceania)',
    role: 'international_sales',
    territory: 'UAE, Saudi Arabia, Singapore, Malaysia, Australia, New Zealand',
    specialty: 'DIN 11851 / SMS 1145 Unions, ISO 2852 Clamps, Hygienic Butterfly & Diaphragm Valves',
    description: 'Manages export trade across GCC and Asia-Pacific regional distributors and international food/biotech facilities.'
  },
  'mktg-comm-1': {
    id: 'mktg-comm-1',
    name: 'Marketing Agent 1 (Customer Communications)',
    role: 'marketing_communications',
    territory: 'Existing Customer Base (Domestic & International)',
    specialty: 'Product Launches, Festival Greetings, Technical Specification Bulletins, Re-order Reminders',
    description: 'Prepares professional customer email campaigns, WhatsApp announcements, and material availability notices for Super Admin review.'
  },
  'mktg-lead-2': {
    id: 'mktg-lead-2',
    name: 'Marketing Agent 2 (Lead Research & Outreach)',
    role: 'marketing_outreach',
    territory: 'Targeted B2B Industry Sectors',
    specialty: 'Pharma, Biotech, Dairy & Food OEM Buyer Qualification, Personalized B2B Introductions',
    description: 'Identifies legitimate industrial manufacturing plants, qualifies procurement requirements, and drafts compliant introductory outreach for Super Admin approval.'
  }
};

/**
 * Assigns an incoming enquiry to the optimal sales agent based on geography and industry
 */
export function routeEnquiryToAgent(enquiry) {
  const country = (enquiry.country || '').toLowerCase().trim();
  const location = (enquiry.location || '').toLowerCase().trim();
  const isDomestic = !country || country === 'india' || country.includes('in');

  if (isDomestic) {
    if (location.includes('south') || location.includes('bangalore') || location.includes('chennai') || location.includes('hyderabad') || location.includes('kerala')) {
      return AI_AGENTS_REGISTRY['dom-sales-2'];
    }
    if (location.includes('east') || location.includes('kolkata') || location.includes('odisha') || location.includes('bengal') || location.includes('valve')) {
      return AI_AGENTS_REGISTRY['dom-sales-3'];
    }
    return AI_AGENTS_REGISTRY['dom-sales-1'];
  } else {
    if (country.includes('us') || country.includes('united states') || country.includes('canada') || country.includes('germany') || country.includes('uk') || country.includes('europe')) {
      return AI_AGENTS_REGISTRY['intl-sales-1'];
    }
    return AI_AGENTS_REGISTRY['intl-sales-2'];
  }
}

/**
 * Automates lead qualification and generates a draft quotation for Super Admin review
 */
export async function processEnquiryWithAgent(enquiryId) {
  const enquiry = await Enquiry.findById(enquiryId).populate('customerId');
  if (!enquiry) {
    throw new Error('Enquiry not found');
  }

  const agent = routeEnquiryToAgent(enquiry);

  // Match requested product against verified catalogue
  const requestedText = `${enquiry.productName || ''} ${enquiry.productType || ''} ${enquiry.grade || ''}`.toLowerCase();
  const matchedProduct = CATALOG.find((p) =>
    requestedText.includes(p.name.toLowerCase()) ||
    (p.category && requestedText.includes(p.category.toLowerCase()))
  ) || CATALOG[0];

  // Base estimate calculation
  const qty = Number(enquiry.quantity) || 1;
  const estimatedUnitPrice = matchedProduct.category?.includes('Pipe') ? 480 : matchedProduct.category?.includes('Valve') ? 2200 : 350;
  const subtotal = qty * estimatedUnitPrice;
  const taxTotal = Math.round(subtotal * 0.18 * 100) / 100;
  const grandTotal = subtotal + taxTotal;

  const draftLineItems = [
    {
      productId: matchedProduct.id,
      description: `${matchedProduct.name} - ${enquiry.sizes || enquiry.nominalSize || 'Standard Size'}`,
      grade: enquiry.grade || matchedProduct.material || 'SS 316L',
      nominalSize: enquiry.nominalSize || '1" (25.4mm OD)',
      outsideDiameter: enquiry.outsideDiameter || '25.4 mm',
      wallThickness: enquiry.wallThickness || '1.65 mm',
      standard: enquiry.standard || matchedProduct.standard || 'ASTM A270',
      finish: enquiry.finish || matchedProduct.finish || 'Electro-Polished (EP Ra ≤ 0.38µm)',
      quantity: qty,
      unit: enquiry.unit || 'Meter',
      unitPrice: estimatedUnitPrice,
      taxPercent: 18,
      lineTotal: subtotal
    }
  ];

  const quotationNumber = generateReference('LT-DRAFT');

  // Create AgentTask strictly in 'pending_review' status
  const task = await AgentTask.create({
    agentId: agent.id,
    agentName: agent.name,
    agentRole: agent.role,
    taskType: 'draft_quotation',
    title: `Draft Quotation for ${enquiry.company || enquiry.name}: ${matchedProduct.name}`,
    description: `Automated requirement qualification and pricing proposal drafted by ${agent.name}.`,
    customerId: enquiry.customerId?._id || enquiry.customerId || null,
    enquiryId: enquiry._id,
    approvalStatus: 'pending_review',
    proposedPayload: {
      quotationNumber,
      customerName: enquiry.name,
      company: enquiry.company,
      email: enquiry.email,
      phone: enquiry.phone,
      shippingAddress: enquiry.location,
      lineItems: draftLineItems,
      subtotal,
      taxTotal,
      grandTotal,
      leadTime: '3-5 Working Days ex-stock Mumbai',
      commercialNotes: `Quotation prepared by ${agent.name}. Verified standard: ${enquiry.standard || 'ASTM A270'}. Surface finish guaranteed Ra ≤ 0.38 µm with EN 10204 3.1 MTR inspection certification.`
    }
  });

  return task;
}

/**
 * Super Admin Approval: converts approved draft task into a verified Quotation
 */
export async function approveAgentTask(taskId, superAdminUser, notes = '') {
  const task = await AgentTask.findById(taskId);
  if (!task) {
    throw new Error('Agent task not found');
  }

  if (superAdminUser.role !== 'admin') {
    throw new Error('FORBIDDEN: Only a Super Admin can approve AI agent tasks and quotations.');
  }

  task.approvalStatus = 'approved';
  task.approvedBy = superAdminUser.id || superAdminUser._id;
  task.approvalDate = new Date();
  task.reviewNotes = notes || 'Approved by Super Admin';
  task.executionStatus = 'ready_for_execution';

  if (task.taskType === 'draft_quotation') {
    const payload = task.proposedPayload;
    const finalQuotationNumber = generateReference('LT-QT');
    const finalReference = generateReference('LT-BOQ');

    const createdQuote = await Quote.create({
      quotationNumber: finalQuotationNumber,
      reference: finalReference,
      customerName: payload.customerName,
      company: payload.company,
      email: payload.email,
      phone: payload.phone,
      shippingAddress: payload.shippingAddress,
      lineItems: payload.lineItems,
      subtotal: payload.subtotal,
      taxTotal: payload.taxTotal,
      grandTotal: payload.grandTotal,
      leadTime: payload.leadTime,
      status: 'Approved',
      approvalStatus: 'approved',
      approvedBy: superAdminUser.id || superAdminUser._id,
      approvalDate: new Date(),
      approvalNotes: `Approved from AI Agent Task [${task._id}]`,
      customerId: task.customerId,
      internalNotes: payload.commercialNotes,
      activityLog: [
        {
          action: 'Approved',
          performedBy: superAdminUser.name,
          note: `Quotation approved and authorized for customer dispatch`
        }
      ]
    });

    createdQuote.approvalHash = computeQuotationApprovalHash(createdQuote);
    await createdQuote.save();

    task.quoteId = createdQuote._id;
    task.executionStatus = 'executed';
    task.executionResult = {
      quoteId: createdQuote._id,
      quotationNumber: finalQuotationNumber,
      reference: finalReference,
      approvedAt: createdQuote.approvalDate
    };
  }

  await task.save();

  await recordAuditEvent({
    actor: superAdminUser,
    action: 'AGENT_TASK_APPROVED',
    targetType: 'Quote',
    targetId: task.quoteId || task._id,
    targetRef: task.title,
    metadata: { agentId: task.agentId, taskType: task.taskType },
    ip: '127.0.0.1'
  });

  return task;
}

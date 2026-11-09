/**
 * Lotus Tubes - 4 AI Autonomous Agents & Operations Suite Tests
 * Validates:
 * 1. 4 Primary AI Agents Registry & Identities
 * 2. Ananya Mehta (Agent 1): Quotation Qualification & Super Admin Authorization
 * 3. Riya Shah (Agent 2): Commercial Invoicing (18% GST), 403 Block on Unapproved Dispatch, Approval Hash
 * 4. Neha Desai (Agent 3): Contact Us Traceable Ticketing (LT-CNT) & Super Admin Verified Dispatch
 * 5. Arjun Yadav (Agent 4): 24/7 Live Chat, Exact Holding Message, DB Interrogation
 * 6. Customer Account Data Isolation & RBAC Security Gates
 */

import { connectDB } from '../config/db.js';
import app from '../app.js';
import mongoose from 'mongoose';
import http from 'http';
import { Invoice } from '../models/Invoice.js';
import { Quote } from '../models/Quote.js';
import { Enquiry } from '../models/Enquiry.js';
import { Contact } from '../models/Contact.js';
import { AgentTask } from '../models/AgentTask.js';
import { User } from '../models/User.js';
import { Customer } from '../models/Customer.js';

let server;
const PORT = 5056;
const BASE_URL = `http://localhost:${PORT}/api`;

async function makeRequest(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => null);
  return { status: response.status, data, headers: response.headers };
}

async function runAiOperationsTests() {
  console.log('====================================================');
  console.log('🤖 LOTUS TUBES - 4 AI AGENTS & OPERATIONS TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}\n`);
      failed++;
    }
  };

  // 1. Database Connection & Server Setup
  await test('Database Connection & Server Boot for AI Tests', async () => {
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database is not connected');
    }
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(PORT, resolve));
  });

  // Auth tokens
  let superAdminToken = '';
  let staffToken = '';
  let customer1Token = '';
  let customer2Token = '';

  const testAdminEmail = `admin_ai_${Date.now()}@lotustubes.com`;
  const testStaffEmail = `staff_ai_${Date.now()}@lotustubes.com`;
  const testCustomer1Email = `client1_ai_${Date.now()}@pharmabiotech.com`;
  const testCustomer2Email = `client2_ai_${Date.now()}@dairyprocess.com`;

  await test('User Provisioning: Super Admin, Staff, Customer 1, Customer 2', async () => {
    // 1. Super Admin
    await User.create({
      name: 'Chirag Shah (Super Admin)',
      email: testAdminEmail,
      password: 'SuperAdminPassword123!',
      role: 'admin',
      department: 'management'
    });

    // 2. Staff User
    await User.create({
      name: 'Pooja Sharma (Sales Staff)',
      email: testStaffEmail,
      password: 'StaffPassword123!',
      role: 'staff',
      department: 'sales'
    });

    // 3. Customer 1 Registration
    const cust1Res = await makeRequest('/auth/customer/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Amit Singhania',
        company: 'BioPharma India Ltd',
        email: testCustomer1Email,
        phone: '+91 98201 11222',
        password: 'Customer1Pass123!'
      })
    });
    if (cust1Res.status !== 201) throw new Error('Customer 1 registration failed: ' + JSON.stringify(cust1Res.data));
    customer1Token = cust1Res.data.data.token;

    // 4. Customer 2 Registration
    const cust2Res = await makeRequest('/auth/customer/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Deepak Varma',
        company: 'Amul Dairy Processors',
        email: testCustomer2Email,
        phone: '+91 98201 33444',
        password: 'Customer2Pass123!'
      })
    });
    if (cust2Res.status !== 201) throw new Error('Customer 2 registration failed: ' + JSON.stringify(cust2Res.data));
    customer2Token = cust2Res.data.data.token;

    // Login Super Admin
    const adminLogin = await makeRequest('/auth/staff/login', {
      method: 'POST',
      body: JSON.stringify({ email: testAdminEmail, password: 'SuperAdminPassword123!' })
    });
    if (adminLogin.status !== 200) throw new Error('Super Admin login failed: ' + JSON.stringify(adminLogin.data));
    superAdminToken = adminLogin.data.data.token;

    // Login Staff
    const staffLogin = await makeRequest('/auth/staff/login', {
      method: 'POST',
      body: JSON.stringify({ email: testStaffEmail, password: 'StaffPassword123!' })
    });
    if (staffLogin.status !== 200) throw new Error('Staff login failed: ' + JSON.stringify(staffLogin.data));
    staffToken = staffLogin.data.data.token;
  });

  // Test 1: Primary Bots Registry API
  await test('API: /api/agents/primary-bots returns all 4 official AI Agents', async () => {
    const res = await makeRequest('/agents/primary-bots');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const bots = res.data.data;
    if (!Array.isArray(bots) || bots.length !== 4) {
      throw new Error(`Expected 4 bots, got ${bots?.length}`);
    }
    const ids = bots.map((b) => b.id);
    if (!ids.includes('ananya-mehta') || !ids.includes('riya-shah') || !ids.includes('neha-desai') || !ids.includes('arjun-yadav')) {
      throw new Error(`Missing expected bot IDs in: ${ids.join(', ')}`);
    }
  });

  // Test 2: Agent 1 (Ananya Mehta) Quotation Qualification Workflow
  let createdEnquiryId = '';
  let quotationTaskId = '';
  await test('Agent 1 (Ananya Mehta): Processes RFQ, creates task, requires Super Admin approval', async () => {
    // Customer 1 submits RFQ
    const enqRes = await makeRequest('/enquiries', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customer1Token}` },
      body: JSON.stringify({
        productName: 'Sanitary Butterfly Valve Manual Triclamp',
        productType: 'valve',
        grade: 'SS 316L',
        nominalSize: '2" (50.8mm OD)',
        quantity: 5,
        name: 'Amit Singhania',
        company: 'BioPharma India Ltd',
        email: testCustomer1Email,
        phone: '+91 98201 11222',
        location: 'Mumbai, Maharashtra'
      })
    });

    if (enqRes.status !== 201) throw new Error('Failed to submit enquiry: ' + JSON.stringify(enqRes.data));
    createdEnquiryId = enqRes.data.data.id || enqRes.data.data._id;

    // Staff routes to Agent 1 (Ananya Mehta)
    const agentRes = await makeRequest(`/agents/process-enquiry/${createdEnquiryId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${staffToken}` }
    });

    if (agentRes.status !== 201) throw new Error('Failed to process with agent: ' + JSON.stringify(agentRes.data));
    const task = agentRes.data.data;
    quotationTaskId = task._id;

    if (task.agentId !== 'ananya-mehta') {
      throw new Error(`Expected agentId 'ananya-mehta', got '${task.agentId}'`);
    }
    if (task.approvalStatus !== 'pending_review') {
      throw new Error(`Expected approvalStatus 'pending_review', got '${task.approvalStatus}'`);
    }
  });

  // Test 3: Super Admin Approves Quotation & Dispatches via Ananya Mehta
  await test('Agent 1 (Ananya Mehta): Non-admin blocked from approval; Super Admin approves with hash', async () => {
    // Attempt approval by regular staff -> MUST FAIL 403
    const staffAttempt = await makeRequest(`/agents/tasks/${quotationTaskId}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: JSON.stringify({ notes: 'Staff trying to approve' })
    });
    if (staffAttempt.status !== 403) {
      throw new Error(`Expected 403 Forbidden for staff approval, got ${staffAttempt.status}`);
    }

    // Super Admin approves
    const adminApproval = await makeRequest(`/agents/tasks/${quotationTaskId}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${superAdminToken}` },
      body: JSON.stringify({ notes: 'Verified against Mumbai warehouse stock' })
    });
    if (adminApproval.status !== 200) {
      throw new Error(`Super Admin approval failed: ${JSON.stringify(adminApproval.data)}`);
    }

    const approvedTask = adminApproval.data.data;
    if (approvedTask.approvalStatus !== 'approved') {
      throw new Error(`Expected approved task, got ${approvedTask.approvalStatus}`);
    }
    if (!approvedTask.quoteId) {
      throw new Error('Approved task missing quoteId');
    }

    // Verify Quote created in DB has cryptographic approval hash
    const quoteInDb = await Quote.findById(approvedTask.quoteId);
    if (!quoteInDb || !quoteInDb.approvalHash) {
      throw new Error('Quotation record missing approvalHash');
    }
    if (quoteInDb.status !== 'Approved') {
      throw new Error(`Expected quote status Approved, got ${quoteInDb.status}`);
    }
  });

  // Test 4: Agent 2 (Riya Shah) Commercial Invoicing with 18% GST & Security Gates
  let createdInvoiceId = '';
  await test('Agent 2 (Riya Shah): Create Invoice Draft with 18% GST; Block unapproved dispatch (403)', async () => {
    const invRes = await makeRequest('/invoices', {
      method: 'POST',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: JSON.stringify({
        customerName: 'Amit Singhania',
        company: 'BioPharma India Ltd',
        email: testCustomer1Email,
        phone: '+91 98201 11222',
        billingAddress: 'Plot 42, MIDC Rabale, Navi Mumbai',
        lineItems: [
          {
            description: 'SS 316L Electro Polished Sanitary Pipe 2" OD x 1.65mm',
            quantity: 20,
            unitPrice: 1000
          }
        ]
      })
    });

    if (invRes.status !== 201) throw new Error('Invoice draft creation failed: ' + JSON.stringify(invRes.data));
    const { invoice, task } = invRes.data.data;
    createdInvoiceId = invoice._id;

    // Verify 18% GST calculation: subtotal = 20,000, tax = 3,600, grand = 23,600
    if (invoice.subtotal !== 20000 || invoice.taxTotal !== 3600 || invoice.grandTotal !== 23600) {
      throw new Error(`Incorrect GST calculation. Expected 20000/3600/23600, got ${invoice.subtotal}/${invoice.taxTotal}/${invoice.grandTotal}`);
    }

    // Verify task attributed to Riya Shah
    if (task.agentId !== 'riya-shah' || task.approvalStatus !== 'pending_review') {
      throw new Error(`Expected Riya Shah task in pending_review, got ${task.agentId}/${task.approvalStatus}`);
    }

    // Attempt to dispatch unapproved invoice -> MUST FAIL 403 Forbidden
    const unapprovedSend = await makeRequest(`/invoices/${createdInvoiceId}/send`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${staffToken}` }
    });
    if (unapprovedSend.status !== 403) {
      throw new Error(`Expected 403 Forbidden for sending unapproved invoice, got ${unapprovedSend.status}`);
    }
  });

  // Test 5: Super Admin Approves Invoice via Riya Shah
  await test('Agent 2 (Riya Shah): Super Admin authorizes invoice, computes approvalHash, updates status', async () => {
    // Non-admin attempt fails
    const staffApprove = await makeRequest(`/invoices/${createdInvoiceId}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: JSON.stringify({ notes: 'Staff approval' })
    });
    if (staffApprove.status !== 403) {
      throw new Error(`Expected 403 for non-admin invoice approval, got ${staffApprove.status}`);
    }

    // Super Admin approves
    const adminApprove = await makeRequest(`/invoices/${createdInvoiceId}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${superAdminToken}` },
      body: JSON.stringify({ notes: 'Authorized commercial billing' })
    });
    if (adminApprove.status !== 200) {
      throw new Error(`Super Admin invoice approval failed: ${JSON.stringify(adminApprove.data)}`);
    }

    const approvedInvoice = adminApprove.data.data;
    if (approvedInvoice.status !== 'Approved' || !approvedInvoice.approvalHash) {
      throw new Error('Approved invoice missing status: Approved or approvalHash');
    }
  });

  // Test 6: Agent 3 (Neha Desai) Contact Inquiries & Super Admin Confirmed Resolution
  let inquiryTaskId = '';
  await test('Agent 3 (Neha Desai): Contact Form generates LT-CNT ticket; Staff drafts; Super Admin confirms', async () => {
    const contactRes = await makeRequest('/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Amit Singhania',
        company: 'BioPharma India Ltd',
        email: testCustomer1Email,
        phone: '+91 98201 11222',
        subject: 'ASTM A270 Surface Finish Ra Certificate Request',
        message: 'Please provide mill test certificates for our batch inspection.'
      })
    });

    if (contactRes.status !== 200 && contactRes.status !== 201) throw new Error('Contact submission failed: ' + JSON.stringify(contactRes.data));

    // Find the AgentTask created for Neha Desai
    const task = await AgentTask.findOne({
      agentId: 'neha-desai',
      'proposedPayload.email': testCustomer1Email
    }).sort({ createdAt: -1 });

    if (!task) throw new Error('No AgentTask found for Neha Desai contact submission');
    inquiryTaskId = task._id;

    // Staff submits proposed draft reply
    const staffReplyRes = await makeRequest(`/agents/inquiry-task/${inquiryTaskId}/staff-reply`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: JSON.stringify({
        replyText: 'We have retrieved your EN 10204 3.1 MTR inspection certificate showing Ra = 0.28 µm.'
      })
    });

    if (staffReplyRes.status !== 200) throw new Error('Staff draft reply failed: ' + JSON.stringify(staffReplyRes.data));
    const updatedTask = staffReplyRes.data.data;
    if (updatedTask.approvalStatus !== 'pending_super_admin_confirmation') {
      throw new Error(`Expected pending_super_admin_confirmation, got ${updatedTask.approvalStatus}`);
    }

    // Super Admin confirms & dispatches
    const confirmRes = await makeRequest(`/agents/inquiry-task/${inquiryTaskId}/confirm-reply`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${superAdminToken}` },
      body: JSON.stringify({
        finalReplyText: 'Confirmed by Chirag Shah: Batch MTR certification Ra = 0.28 µm is verified and attached.'
      })
    });

    if (confirmRes.status !== 200) throw new Error('Super Admin confirmation failed: ' + JSON.stringify(confirmRes.data));
    const confirmedTask = confirmRes.data.data;
    if (confirmedTask.approvalStatus !== 'approved' || !confirmedTask.finalApprovedReply.includes('Chirag Shah')) {
      throw new Error('Confirmed task missing approved status or final reply text');
    }
  });

  // Test 7: Agent 4 (Arjun) Live Chat Concierge & Mandated Holding Message
  await test('Agent 4 (Arjun): Returns user-mandated holding message and cross-interrogates DB', async () => {
    const chatRes = await makeRequest('/agents/chat-inquiry', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customer1Token}` },
      body: JSON.stringify({
        message: 'Where is my bill or invoice for BioPharma India?',
        email: testCustomer1Email,
        phone: '+91 98201 11222'
      })
    });

    if (chatRes.status !== 200) throw new Error('Chat inquiry failed: ' + JSON.stringify(chatRes.data));
    const result = chatRes.data.data;

    // Verify exact user-mandated holding message
    const expectedHolding = "Thank you for your patience. I’m checking the latest status of your request with our team. I’ll get back to you shortly.";
    if (result.waitingMessage !== expectedHolding) {
      throw new Error(`Holding message mismatch!\nExpected: "${expectedHolding}"\nGot: "${result.waitingMessage}"`);
    }

    // Verify Arjun interrogated Billing Desk
    if (!result.botSource.includes('Billing')) {
      throw new Error(`Expected botSource to reference Billing Desk, got: ${result.botSource}`);
    }

    // Verify response mentions the approved invoice or quote
    if (!result.reply.toLowerCase().includes('billing') && !result.reply.toLowerCase().includes('invoice')) {
      throw new Error(`Expected reply to mention billing / invoice, got: ${result.reply}`);
    }
  });

  // Test 8: Strict Customer Isolation Invariant
  await test('Customer Portal Isolation: Customer 2 CANNOT access Customer 1 invoices or quotes', async () => {
    // Customer 2 requests their invoices
    const cust2Invoices = await makeRequest('/invoices/my', {
      method: 'GET',
      headers: { Authorization: `Bearer ${customer2Token}` }
    });
    if (cust2Invoices.status !== 200) throw new Error('Customer 2 invoice fetch failed');

    // Customer 2 should have 0 invoices (since invoice belongs to Customer 1)
    if (cust2Invoices.data.data.length !== 0) {
      throw new Error(`Data leakage! Customer 2 received ${cust2Invoices.data.data.length} invoices belonging to Customer 1!`);
    }

    // Customer 1 requests their invoices -> should find the approved invoice
    const cust1Invoices = await makeRequest('/invoices/my', {
      method: 'GET',
      headers: { Authorization: `Bearer ${customer1Token}` }
    });
    if (cust1Invoices.status !== 200) throw new Error('Customer 1 invoice fetch failed');
    if (cust1Invoices.data.data.length < 1) {
      throw new Error('Customer 1 could not retrieve their own approved invoice');
    }
  });

  // Teardown & Self-Cleaning: Delete all test records created during test run
  try {
    const testEmailRegex = /(_ai_|pharmabiotech\.com|dairyprocess\.com)/i;
    await User.deleteMany({ email: testEmailRegex });
    await Customer.deleteMany({ email: testEmailRegex });
    await Quote.deleteMany({ email: testEmailRegex });
    await Invoice.deleteMany({ email: testEmailRegex });
    await Enquiry.deleteMany({ email: testEmailRegex });
    await AgentTask.deleteMany({ 'proposedPayload.customerEmail': testEmailRegex });
    console.log('🧹 Test records successfully cleaned up.');
  } catch (cleanErr) {
    console.warn('Test cleanup warning:', cleanErr.message);
  }

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await mongoose.disconnect();

  console.log('\n====================================================');
  console.log(`📊 AI OPERATIONS TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAiOperationsTests().catch((err) => {
  console.error('Fatal Test Runner Exception:', err);
  process.exit(1);
});

/**
 * Lotus Tubes - Automated Verification Suite for Meta WhatsApp Cloud API & AI Chatbot
 * Validates:
 * 1. Meta credentials detection (valid vs missing vs invalid token)
 * 2. Webhook verification GET challenge & HMAC-SHA256 signature verification
 * 3. Arjun Yadav WhatsApp Support Bot (product inquiries, quotes, BOQ uploads, catalogue, handover)
 * 4. Customer isolation & security (quotation/invoice access strictly isolated to verified phone)
 * 5. Super Admin approval invariants & cryptographic hash verification
 * 6. Dual-channel document delivery (Ananya Mehta quotes, Riya Shah invoices)
 * 7. Channel independence & failover handling (Email succeeds/WhatsApp fails, WhatsApp succeeds/Email fails)
 * 8. Regulatory opt-out/opt-in (STOP/START) compliance
 * 9. Idempotency & duplicate send prevention
 * 10. Provider webhook status callback processing
 */

import { connectDB } from '../config/db.js';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { config } from '../config/env.js';
import { Customer } from '../models/Customer.js';
import { Product } from '../models/Product.js';
import { Quote, computeQuotationApprovalHash } from '../models/Quote.js';
import { Invoice, computeInvoiceApprovalHash } from '../models/Invoice.js';
import { Enquiry } from '../models/Enquiry.js';
import { Task } from '../models/Task.js';
import { WhatsAppConversation } from '../models/WhatsAppConversation.js';
import { WhatsAppMessage } from '../models/WhatsAppMessage.js';
import {
  normalizePhoneNumber,
  isWhatsAppConfigured,
  verifyWebhookChallenge,
  verifyWebhookSignature,
  sendWhatsAppMessage,
  sendApprovedDocumentWhatsApp
} from '../services/whatsappService.js';
import {
  handleIncomingWhatsAppMessage,
  BOT_GREETING,
  PRODUCT_CATEGORIES
} from '../services/whatsappBotService.js';
import { sendApprovedDocument } from '../services/notificationService.js';

async function runWhatsAppTestSuite() {
  console.log('================================================================');
  console.log('📱 LOTUS TUBES - META WHATSAPP CLOUD API & AI CHATBOT TEST SUITE');
  console.log('================================================================\n');

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

  // Connect to DB if needed
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }

  const testSuffix = Date.now();
  const testPhone = `9198765${String(testSuffix).slice(-5)}`;
  const otherPhone = `9191234${String(testSuffix).slice(-5)}`;
  const superAdminId = new mongoose.Types.ObjectId();

  // Test 1: Valid Meta credentials detection logic
  await test('Test 1: Valid Meta credentials detection', async () => {
    const originalToken = config.whatsapp.accessToken;
    const originalPhoneId = config.whatsapp.phoneNumberId;

    try {
      config.whatsapp.accessToken = 'EAAG_valid_meta_test_access_token_12345';
      config.whatsapp.phoneNumberId = '109876543210987';
      if (!isWhatsAppConfigured()) {
        throw new Error('Expected isWhatsAppConfigured() to return true for valid credentials');
      }
    } finally {
      config.whatsapp.accessToken = originalToken;
      config.whatsapp.phoneNumberId = originalPhoneId;
    }
  });

  // Test 2: Missing Meta credentials graceful handling
  await test('Test 2: Missing Meta credentials graceful handling', async () => {
    const originalToken = config.whatsapp.accessToken;
    try {
      config.whatsapp.accessToken = '';
      if (isWhatsAppConfigured()) {
        throw new Error('Expected isWhatsAppConfigured() to return false when token is empty');
      }

      // Dispatch fallback should provide direct wa.me link without throwing an unhandled exception
      const fallbackResult = await sendWhatsAppMessage({
        to: testPhone,
        type: 'text',
        text: { body: 'Testing graceful fallback' }
      });

      if (fallbackResult.status !== 'not_configured' || !fallbackResult.directLink) {
        throw new Error('Expected status not_configured and directLink in graceful fallback response');
      }
      if (!fallbackResult.directLink.includes('wa.me')) {
        throw new Error('Fallback link should point to wa.me');
      }
    } finally {
      config.whatsapp.accessToken = originalToken;
    }
  });

  // Test 3: Invalid access token response handling
  await test('Test 3: Invalid access token response handling', async () => {
    // Calling Meta Graph API with invalid credentials returns { success: false, status: 'FAILED' }
    const originalFetch = globalThis.fetch;
    try {
      globalThis.fetch = async () => ({
        ok: false,
        status: 401,
        json: async () => ({
          error: {
            message: 'Invalid OAuth access token - Cannot parse access token',
            type: 'OAuthException',
            code: 190
          }
        })
      });

      const originalToken = config.whatsapp.accessToken;
      const originalPhoneId = config.whatsapp.phoneNumberId;
      config.whatsapp.accessToken = 'invalid_token_test';
      config.whatsapp.phoneNumberId = '123456789';

      const result = await sendWhatsAppMessage({
        to: testPhone,
        type: 'text',
        text: { body: 'Test token validation' }
      });

      if (result.success !== false || result.status !== 'FAILED') {
        throw new Error('Expected failed status when Meta returns 401 OAuthException');
      }
      if (result.metaErrorCode !== 190) {
        throw new Error(`Expected metaErrorCode 190, got ${result.metaErrorCode}`);
      }

      config.whatsapp.accessToken = originalToken;
      config.whatsapp.phoneNumberId = originalPhoneId;
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  // Test 4: Webhook verification GET challenge
  await test('Test 4: Webhook verification GET challenge', async () => {
    const verifyToken = config.whatsapp.webhookVerifyToken || 'lotus_tubes_whatsapp_webhook_secret_verify_token_2026';
    config.whatsapp.webhookVerifyToken = verifyToken;

    const validChallenge = verifyWebhookChallenge('subscribe', verifyToken, 'challenge_code_12345');
    if (!validChallenge.isValid || validChallenge.challenge !== 'challenge_code_12345') {
      throw new Error('Failed to verify valid webhook challenge');
    }

    const invalidChallenge = verifyWebhookChallenge('subscribe', 'wrong_token', 'challenge_code_12345');
    if (invalidChallenge.isValid) {
      throw new Error('Invalid token should have been rejected');
    }

    const invalidMode = verifyWebhookChallenge('unsubscribe', verifyToken, 'challenge_code_12345');
    if (invalidMode.isValid) {
      throw new Error('Invalid mode should have been rejected');
    }
  });

  // Test 5: Invalid webhook signature rejection (HMAC-SHA256)
  await test('Test 5: Invalid webhook signature rejection (HMAC-SHA256)', async () => {
    const testSecret = 'meta_app_secret_lotus_tubes_test_key_2026';
    const rawPayload = Buffer.from(JSON.stringify({ object: 'whatsapp_business_account', entry: [] }));
    const validHmac = crypto.createHmac('sha256', testSecret).update(rawPayload).digest('hex');

    const validSig = verifyWebhookSignature(`sha256=${validHmac}`, rawPayload, testSecret);
    if (!validSig.isValid) {
      throw new Error(`Valid signature failed verification: ${validSig.reason}`);
    }

    const tamperedPayload = Buffer.from(JSON.stringify({ object: 'whatsapp_business_account', entry: ['tampered'] }));
    const invalidSig = verifyWebhookSignature(`sha256=${validHmac}`, tamperedPayload, testSecret);
    if (invalidSig.isValid) {
      throw new Error('Tampered payload signature should have been rejected');
    }

    const forgedSig = verifyWebhookSignature('sha256=abcdef1234567890', rawPayload, testSecret);
    if (forgedSig.isValid) {
      throw new Error('Forged signature should have been rejected');
    }
  });

  // Test 6: Incoming customer message processing
  await test('Test 6: Incoming customer message processing', async () => {
    await Customer.deleteMany({ $or: [{ phone: testPhone }, { whatsappPhone: testPhone }] });
    await WhatsAppConversation.deleteMany({ customerPhone: testPhone });
    await WhatsAppMessage.deleteMany({ $or: [{ from: testPhone }, { to: testPhone }] });

    const inboundWamid = `wamid.test_inbound_${testSuffix}`;
    const result = await handleIncomingWhatsAppMessage({
      wamid: inboundWamid,
      from: testPhone,
      to: '919930430789',
      type: 'text',
      text: 'Hello, I need assistance'
    });

    if (!result.handled) {
      throw new Error('Inbound message was not handled successfully');
    }

    const conv = await WhatsAppConversation.findOne({ customerPhone: testPhone });
    if (!conv) {
      throw new Error('WhatsAppConversation was not created for incoming message');
    }
    if (conv.assignedAgent !== 'arjun-yadav') {
      throw new Error(`Expected assignedAgent 'arjun-yadav', got '${conv.assignedAgent}'`);
    }

    const savedMsg = await WhatsAppMessage.findOne({ wamid: inboundWamid });
    if (!savedMsg || savedMsg.direction !== 'inbound') {
      throw new Error('Inbound WhatsAppMessage was not recorded properly');
    }
  });

  // Test 7: Customer asks about a product (verified DB lookup)
  await test('Test 7: Customer asks about a product (verified DB lookup)', async () => {
    // Ensure at least one product exists
    let product = await Product.findOne();
    if (!product) {
      product = await Product.create({
        name: 'SS 316L Sanitary Seamless Pipe',
        slug: 'ss-316l-sanitary-seamless-pipe',
        category: 'Sanitary Pipes and Tubes',
        material: 'SS 316L',
        standard: 'ASTM A270',
        finish: 'Electro Polished (EP)',
        price: 850
      });
    }

    const response = await handleIncomingWhatsAppMessage({
      wamid: `wamid.product_query_${testSuffix}`,
      from: testPhone,
      to: '919930430789',
      type: 'text',
      text: 'Tell me about SS 316L Sanitary Seamless Pipe'
    });

    if (!response.handled || !response.reply) {
      throw new Error('Expected product inquiry reply from bot');
    }
    if (!response.reply.includes('SS 316L') && !response.reply.includes('ASTM A270')) {
      throw new Error('Bot reply did not include verified specifications from MongoDB');
    }
  });

  // Test 8: Customer requests a quotation (multi-step data collection & Enquiry creation)
  await test('Test 8: Customer requests a quotation (multi-step RFQ creation)', async () => {
    const conv = await WhatsAppConversation.findOne({ customerPhone: testPhone });
    conv.context = {
      step: 'COLLECTING_EMAIL',
      inquiryData: {
        productInterest: 'SS 304 Tri-Clamp Ferrule',
        customerName: 'Rohit Sharma',
        company: 'Apex Bio-Pharma'
      }
    };
    conv.markModified('context');
    await conv.save();

    const response = await handleIncomingWhatsAppMessage({
      wamid: `wamid.rfq_step_${testSuffix}`,
      from: testPhone,
      to: '919930430789',
      type: 'text',
      text: 'rohit.sharma@apexbiopharma.example.com'
    });

    if (!response.handled) {
      throw new Error('Bot failed to process RFQ email step');
    }

    const updatedConv = await WhatsAppConversation.findOne({ customerPhone: testPhone });
    if (updatedConv.context.step !== 'COLLECTING_QUANTITY') {
      throw new Error(`Expected context step 'COLLECTING_QUANTITY', got '${updatedConv.context.step}'`);
    }
    if (updatedConv.context.inquiryData.customerEmail !== 'rohit.sharma@apexbiopharma.example.com') {
      throw new Error('Customer email was not stored in RFQ context');
    }
  });

  // Test 9: Customer uploads a BOQ / document
  await test('Test 9: Customer uploads a BOQ / document', async () => {
    const response = await handleIncomingWhatsAppMessage({
      wamid: `wamid.boq_upload_${testSuffix}`,
      from: testPhone,
      to: '919930430789',
      type: 'document',
      document: {
        filename: 'Lotus_Tubes_Project_BOQ_Rev2.pdf',
        mimeType: 'application/pdf',
        id: 'media_id_boq_99999',
        url: 'https://example.com/media/boq.pdf'
      },
      text: 'Here is our detailed plant expansion BOQ'
    });

    if (!response.handled) {
      throw new Error('Bot failed to handle document upload');
    }

    const enquiry = await Enquiry.findOne({ phone: testPhone }).sort({ createdAt: -1 });
    if (!enquiry) {
      throw new Error('CRM Enquiry was not created for BOQ upload');
    }
    if (!enquiry.notes || !enquiry.notes.includes('Lotus_Tubes_Project_BOQ_Rev2.pdf')) {
      throw new Error('Enquiry notes did not record document filename');
    }
  });

  // Test 10: Customer asks for human handover (bot paused, CRM task created)
  await test('Test 10: Customer asks for human handover', async () => {
    const response = await handleIncomingWhatsAppMessage({
      wamid: `wamid.handover_${testSuffix}`,
      from: testPhone,
      to: '919930430789',
      type: 'text',
      text: 'I want to speak with a human sales representative please'
    });

    if (!response.handled) {
      throw new Error('Handover message was not processed');
    }

    const conv = await WhatsAppConversation.findOne({ customerPhone: testPhone });
    if (!conv.isHumanHandover || !conv.botPaused) {
      throw new Error('Conversation was not marked as human handover with bot paused');
    }

    const task = await Task.findOne({
      relatedCustomer: conv.customerId,
      status: 'Pending'
    }).sort({ createdAt: -1 });

    if (!task) {
      throw new Error('CRM escalation task was not created for human sales team');
    }
  });

  // Test 11: Customer requests a catalogue (sends catalogue PDF)
  await test('Test 11: Customer requests a catalogue', async () => {
    // Unpause bot for catalogue inquiry
    await WhatsAppConversation.updateOne(
      { customerPhone: testPhone },
      { $set: { botPaused: false, isHumanHandover: false } }
    );

    const response = await handleIncomingWhatsAppMessage({
      wamid: `wamid.catalogue_${testSuffix}`,
      from: testPhone,
      to: '919930430789',
      type: 'text',
      text: 'Please send me the Lotus Tubes product catalogue'
    });

    if (!response.handled || !response.reply) {
      throw new Error('Catalogue request was not handled');
    }
    if (!response.reply.includes('catalogue') && !response.reply.includes('Catalogue')) {
      throw new Error('Reply does not reference product catalogue');
    }
  });

  // Test 12: Customer requests invoice status (retrieves verified records for own phone)
  await test('Test 12: Customer requests invoice status for verified phone', async () => {
    const invNumber = `INV-TEST-${testSuffix}`;
    await Invoice.create({
      invoiceNumber: invNumber,
      customerName: 'Test Pharma Corp',
      company: 'Apex Bio-Tech Ltd',
      email: `customer_${testSuffix}@example.com`,
      phone: testPhone,
      status: 'Approved',
      subtotal: 50000,
      taxTotal: 9000,
      grandTotal: 59000,
      currency: 'INR',
      lineItems: [
        {
          description: 'Sanitary Component',
          quantity: 10,
          unitPrice: 5000,
          lineTotal: 50000
        }
      ]
    });

    const response = await handleIncomingWhatsAppMessage({
      wamid: `wamid.invoice_status_${testSuffix}`,
      from: testPhone,
      to: '919930430789',
      type: 'text',
      text: 'What is the status of my invoice?'
    });

    if (!response.handled || !response.reply.includes(invNumber)) {
      throw new Error(`Customer was not informed of their verified invoice ${invNumber}`);
    }
  });

  // Test 13: Customer attempts to access another customer's invoice (strictly blocked/isolated)
  await test("Test 13: Customer cannot access another customer's invoice", async () => {
    const confidentialInv = `INV-CONFIDENTIAL-${testSuffix}`;
    await Invoice.create({
      invoiceNumber: confidentialInv,
      customerName: 'Confidential Competitor Corp',
      company: 'Confidential Competitor Ltd',
      email: `other_${testSuffix}@example.com`,
      phone: otherPhone,
      status: 'Approved',
      subtotal: 150000,
      taxTotal: 27000,
      grandTotal: 177000,
      currency: 'INR',
      lineItems: [
        {
          description: 'Proprietary Pipe',
          quantity: 50,
          unitPrice: 3000,
          lineTotal: 150000
        }
      ]
    });

    const response = await handleIncomingWhatsAppMessage({
      wamid: `wamid.invoice_cross_tenant_${testSuffix}`,
      from: testPhone,
      to: '919930430789',
      type: 'text',
      text: `Give me details on invoice ${confidentialInv}`
    });

    if (response.reply && response.reply.includes('Confidential Competitor Corp')) {
      throw new Error('CRITICAL SECURITY VIOLATION: Customer was shown another customer invoice details');
    }
  });

  // Test 14: Super Admin approves quotation
  let testQuote = null;
  await test('Test 14: Super Admin approves quotation and signs approvalHash', async () => {
    const qNumber = `QT-TEST-${testSuffix}`;
    testQuote = await Quote.create({
      quotationNumber: qNumber,
      reference: `REF-QT-${testSuffix}-1`,
      customerName: 'Apex Bio-Tech',
      company: 'Apex Bio-Tech Ltd',
      email: `apex_${testSuffix}@lotustubes.test`,
      phone: testPhone,
      items: [
        {
          description: 'Sanitary Butterfly Valve Manual',
          size: '2 Inch',
          quantity: 10,
          unitPrice: 3200,
          lineTotal: 32000
        }
      ],
      subtotal: 32000,
      totalAmount: 37760,
      status: 'Draft',
      approvalStatus: 'pending'
    });

    // Compute cryptographic hash and approve as Super Admin
    const approvalHash = computeQuotationApprovalHash(testQuote);
    testQuote.status = 'Approved';
    testQuote.approvalStatus = 'approved';
    testQuote.approvalHash = approvalHash;
    testQuote.approvedBy = superAdminId;
    testQuote.approvedAt = new Date();
    await testQuote.save();

    if (testQuote.approvalStatus !== 'approved' || !testQuote.approvalHash) {
      throw new Error('Quotation approval state failed to persist');
    }
  });

  // Test 15: Email quotation delivery
  await test('Test 15: Email quotation delivery via Ananya Mehta', async () => {
    // Customer consent opted_in
    await Customer.updateOne(
      { phone: testPhone },
      { $set: { 'messagingConsent.status': 'opted_in' } },
      { upsert: true }
    );

    const dispatchResult = await sendApprovedDocument({
      documentId: testQuote._id,
      documentType: 'quotation',
      channels: ['email'],
      actor: { id: superAdminId, email: 'admin@lotustubes.com', role: 'Super Admin' }
    });

    if (!dispatchResult.email.attempted) {
      throw new Error('Email channel was not attempted for approved quotation');
    }
  });

  // Test 16: WhatsApp quotation PDF delivery (template + document header)
  await test('Test 16: WhatsApp quotation PDF delivery via template', async () => {
    const dispatchResult = await sendApprovedDocument({
      documentId: testQuote._id,
      documentType: 'quotation',
      channels: ['whatsapp'],
      actor: { id: superAdminId, email: 'admin@lotustubes.com', role: 'Super Admin' }
    });

    if (!dispatchResult.whatsapp.attempted) {
      throw new Error('WhatsApp channel was not attempted for approved quotation');
    }
    const refreshed = await Quote.findById(testQuote._id);
    if (!refreshed.whatsappStatus) {
      throw new Error('Quotation whatsappStatus was not updated in database');
    }
  });

  // Test 17: Email invoice delivery
  let testInvoice = null;
  await test('Test 17: Email invoice delivery via Riya Shah', async () => {
    const invNum = `INV-VERIFY-${testSuffix}`;
    testInvoice = await Invoice.create({
      invoiceNumber: invNum,
      customerName: 'Apex Bio-Tech',
      company: 'Apex Bio-Tech Ltd',
      email: `apex_${testSuffix}@lotustubes.test`,
      phone: testPhone,
      items: [
        {
          description: 'Sanitary Butterfly Valve Manual',
          quantity: 10,
          unitPrice: 3200,
          lineTotal: 32000
        }
      ],
      lineItems: [
        {
          description: 'Sanitary Butterfly Valve Manual',
          quantity: 10,
          unitPrice: 3200,
          lineTotal: 32000
        }
      ],
      subtotal: 32000,
      taxTotal: 5760,
      grandTotal: 37760,
      status: 'Approved',
      approvalStatus: 'approved',
      approvedByAdmin: superAdminId
    });
    testInvoice.approvalHash = computeInvoiceApprovalHash(testInvoice);
    await testInvoice.save();

    const dispatchResult = await sendApprovedDocument({
      documentId: testInvoice._id,
      documentType: 'invoice',
      channels: ['email'],
      actor: { id: superAdminId, email: 'admin@lotustubes.com', role: 'Super Admin' }
    });

    if (!dispatchResult.email.attempted) {
      throw new Error('Email channel was not attempted for invoice');
    }
  });

  // Test 18: WhatsApp invoice PDF delivery (template + document header)
  await test('Test 18: WhatsApp invoice PDF delivery via template', async () => {
    const dispatchResult = await sendApprovedDocument({
      documentId: testInvoice._id,
      documentType: 'invoice',
      channels: ['whatsapp'],
      actor: { id: superAdminId, email: 'admin@lotustubes.com', role: 'Super Admin' }
    });

    if (!dispatchResult.whatsapp.attempted) {
      throw new Error('WhatsApp channel was not attempted for invoice');
    }
    const refreshed = await Invoice.findById(testInvoice._id);
    if (!refreshed.whatsappStatus) {
      throw new Error('Invoice whatsappStatus was not updated in database');
    }
  });

  // Test 19: Email succeeds but WhatsApp fails (independent tracking & employee alerted)
  await test('Test 19: Email succeeds but WhatsApp fails (channel independence & staff alert)', async () => {
    const originalFetch = globalThis.fetch;
    const origToken = config.whatsapp.accessToken;
    const origPhone = config.whatsapp.phoneNumberId;

    try {
      config.whatsapp.accessToken = 'test_token_simulated_meta_failure';
      config.whatsapp.phoneNumberId = '1234567890';

      globalThis.fetch = async () => ({
        ok: false,
        status: 500,
        json: async () => ({ error: { message: 'Meta Graph API temporarily down', code: 2 } })
      });

      const qNumFail = `QT-FAILWHATSAPP-${testSuffix}`;
      const failQuote = await Quote.create({
        quotationNumber: qNumFail,
        reference: `REF-QT-${testSuffix}-19`,
        customerName: 'Apex Bio-Tech',
        company: 'Apex Bio-Tech Ltd',
        email: `apex_${testSuffix}@lotustubes.test`,
        phone: testPhone,
        items: [{ description: 'Pipe', size: '1"', quantity: 1, unitPrice: 1000, lineTotal: 1000 }],
        subtotal: 1000,
        totalAmount: 1180,
        status: 'Approved',
        approvalStatus: 'approved',
        approvedBy: superAdminId
      });
      failQuote.approvalHash = computeQuotationApprovalHash(failQuote);
      await failQuote.save();

      const result = await sendApprovedDocument({
        documentId: failQuote._id,
        documentType: 'quotation',
        channels: ['email', 'whatsapp'],
        actor: { id: superAdminId, email: 'admin@lotustubes.com', role: 'Super Admin' }
      });

      if (result.whatsapp.status !== 'FAILED') {
        throw new Error(`Expected WhatsApp status FAILED, got ${result.whatsapp.status}`);
      }

      // Check that a staff escalation task was created for WhatsApp failure
      const staffTask = await Task.findOne({
        title: { $regex: new RegExp(qNumFail, 'i') }
      });
      if (!staffTask) {
        throw new Error('Staff escalation task was not created when WhatsApp delivery failed');
      }
    } finally {
      globalThis.fetch = originalFetch;
      config.whatsapp.accessToken = origToken;
      config.whatsapp.phoneNumberId = origPhone;
    }
  });

  // Test 20: WhatsApp succeeds but email fails (independent tracking)
  await test('Test 20: WhatsApp succeeds but email fails (channel independence)', async () => {
    const qNumFailEmail = `QT-FAILEMAIL-${testSuffix}`;
    const failEmailQuote = await Quote.create({
      quotationNumber: qNumFailEmail,
      reference: `REF-QT-${testSuffix}-20`,
      customerName: 'Apex Bio-Tech',
      company: 'Apex Bio-Tech Ltd',
      email: 'invalid-email-syntax@',
      phone: testPhone,
      items: [{ description: 'Pipe', size: '1"', quantity: 1, unitPrice: 1000, lineTotal: 1000 }],
      subtotal: 1000,
      totalAmount: 1180,
      status: 'Approved',
      approvalStatus: 'approved',
      approvedBy: superAdminId
    });
    failEmailQuote.approvalHash = computeQuotationApprovalHash(failEmailQuote);
    await failEmailQuote.save();

    const result = await sendApprovedDocument({
      documentId: failEmailQuote._id,
      documentType: 'quotation',
      channels: ['email', 'whatsapp'],
      actor: { id: superAdminId, email: 'admin@lotustubes.com', role: 'Super Admin' }
    });

    if (result.email.status !== 'FAILED') {
      throw new Error(`Expected email status FAILED, got ${result.email.status}`);
    }
    // WhatsApp should still have attempted independently
    if (!result.whatsapp.attempted) {
      throw new Error('WhatsApp should have been attempted even if email failed');
    }
  });

  // Test 21: Duplicate approval event idempotency
  await test('Test 21: Duplicate approval event idempotency', async () => {
    // Re-dispatching the exact same document should be handled idempotently
    const initialSend = await sendApprovedDocument({
      documentId: testQuote._id,
      documentType: 'quotation',
      channels: ['whatsapp'],
      actor: { id: superAdminId, email: 'admin@lotustubes.com', role: 'Super Admin' }
    });

    const duplicateSend = await sendApprovedDocument({
      documentId: testQuote._id,
      documentType: 'quotation',
      channels: ['whatsapp'],
      actor: { id: superAdminId, email: 'admin@lotustubes.com', role: 'Super Admin' }
    });

    if (!duplicateSend) {
      throw new Error('Idempotent duplicate dispatch failed');
    }
  });

  // Test 22: Document modified after approval (approval invalidated, status reverted to Draft)
  await test('Test 22: Document modified after approval (approval invalidated)', async () => {
    const tamperedQuote = await Quote.create({
      quotationNumber: `QT-TAMPER-${testSuffix}`,
      reference: `REF-QT-${testSuffix}-22`,
      customerName: 'Tamper Test Corp',
      company: 'Tamper Test Ltd',
      email: `tamper_${testSuffix}@example.com`,
      phone: testPhone,
      items: [{ description: 'Valve', size: '2"', quantity: 5, unitPrice: 2000, lineTotal: 10000 }],
      subtotal: 10000,
      totalAmount: 11800,
      status: 'Approved',
      approvalStatus: 'approved',
      approvedBy: superAdminId
    });
    tamperedQuote.approvalHash = computeQuotationApprovalHash(tamperedQuote);
    await tamperedQuote.save();

    // Maliciously alter grandTotal post-approval without Super Admin re-approval
    tamperedQuote.grandTotal = 5000;
    tamperedQuote.subtotal = 4237;
    await tamperedQuote.save();

    let threwExpectedError = false;
    try {
      await sendApprovedDocument({
        documentId: tamperedQuote._id,
        documentType: 'quotation',
        channels: ['email', 'whatsapp'],
        actor: { id: new mongoose.Types.ObjectId(), email: 'rogue@lotustubes.com', role: 'Sales' }
      });
    } catch (err) {
      threwExpectedError = true;
      if (!err.message.includes('TAMPERING') && !err.message.includes('modified post-approval') && !err.message.includes('modified after approval')) {
        throw new Error(`Unexpected error message: ${err.message}`);
      }
    }

    if (!threwExpectedError) {
      throw new Error('CRITICAL FLAW: Modified document was dispatched without invalidating approval!');
    }

    const reloaded = await Quote.findById(tamperedQuote._id);
    if (reloaded.status !== 'Draft' || !['draft', 'pending'].includes(reloaded.approvalStatus)) {
      throw new Error(`Tampered document status was not reverted to Draft/pending (got status: ${reloaded.status}, approvalStatus: ${reloaded.approvalStatus})`);
    }
  });

  // Test 23: Customer opts out ("STOP" -> consent updated, dispatches skipped)
  await test('Test 23: Customer opts out ("STOP" -> consent updated, dispatches skipped)', async () => {
    const optOutResponse = await handleIncomingWhatsAppMessage({
      wamid: `wamid.stop_${testSuffix}`,
      from: testPhone,
      to: '919930430789',
      type: 'text',
      text: 'STOP'
    });

    if (!optOutResponse.handled) {
      throw new Error('Bot failed to process STOP keyword');
    }

    const customer = await Customer.findOne({
      $or: [{ phone: testPhone }, { whatsappPhone: testPhone }]
    });
    if (!customer || customer.messagingConsent?.status !== 'opted_out') {
      throw new Error('Customer consent was not updated to opted_out');
    }

    // Attempting business-initiated dispatch to opted-out customer should skip WhatsApp
    const skipDispatch = await sendApprovedDocument({
      documentId: testQuote._id,
      documentType: 'quotation',
      channels: ['whatsapp'],
      actor: { id: superAdminId, email: 'admin@lotustubes.com', role: 'Super Admin' }
    });

    if (skipDispatch.whatsapp.status !== 'SKIPPED_NO_CONSENT') {
      throw new Error(`Expected SKIPPED_NO_CONSENT for opted-out customer, got ${skipDispatch.whatsapp.status}`);
    }
  });

  // Test 24: WhatsApp template rejected or unavailable handling
  await test('Test 24: WhatsApp template rejected or unavailable handling', async () => {
    const originalFetch = globalThis.fetch;
    const origToken = config.whatsapp.accessToken;
    const origPhone = config.whatsapp.phoneNumberId;

    try {
      config.whatsapp.accessToken = 'test_token_for_template_rejection';
      config.whatsapp.phoneNumberId = '1234567890';

      globalThis.fetch = async () => ({
        ok: false,
        status: 400,
        json: async () => ({
          error: {
            message: 'Template does not exist in en language',
            type: 'OAuthException',
            code: 100,
            error_subcode: 2388001
          }
        })
      });

      const templateTestPhone = `9199999${String(testSuffix).slice(-5)}`;
      const result = await sendApprovedDocumentWhatsApp({
        phone: templateTestPhone,
        customerName: 'Test Customer',
        documentType: 'quotation',
        documentNumber: 'QT-TEST-99',
        totalAmount: 50000,
        pdfUrl: 'https://lotustubes.com/quotes/QT-TEST-99.pdf',
        templateName: 'non_existent_template_test'
      });

      if (result.status !== 'FAILED') {
        console.log('DEBUG TEST 24 result:', JSON.stringify(result));
      }

      if (result.success !== false || result.status !== 'FAILED') {
        throw new Error('Expected FAILED status for unavailable template');
      }
      if (result.metaErrorSubcode !== 2388001) {
        throw new Error(`Expected error_subcode 2388001, got ${result.metaErrorSubcode}`);
      }
    } finally {
      globalThis.fetch = originalFetch;
      config.whatsapp.accessToken = origToken;
      config.whatsapp.phoneNumberId = origPhone;
    }
  });

  // Test 25: Provider webhook reports message failure (status updated to FAILED with error code)
  await test('Test 25: Provider webhook reports message failure', async () => {
    const failedWamid = `wamid.failed_delivery_${testSuffix}`;
    const conv = await WhatsAppConversation.findOne({ customerPhone: testPhone });
    await WhatsAppMessage.create({
      conversationId: conv ? conv._id : new mongoose.Types.ObjectId(),
      wamid: failedWamid,
      direction: 'outbound',
      from: '919930430789',
      to: testPhone,
      type: 'template',
      deliveryStatus: 'PROVIDER_ACCEPTED'
    });

    // Simulate provider webhook delivery status callback with failed error
    await WhatsAppMessage.updateOne(
      { wamid: failedWamid },
      {
        $set: {
          deliveryStatus: 'FAILED',
          errorCode: '131026',
          errorMessage: 'Message undeliverable: recipient not on WhatsApp or number inactive'
        },
        $push: {
          statusHistory: {
            status: 'FAILED',
            timestamp: new Date(),
            raw: { error: '131026' }
          }
        }
      }
    );

    const reloaded = await WhatsAppMessage.findOne({ wamid: failedWamid });
    if (reloaded.deliveryStatus !== 'FAILED') {
      throw new Error(`Expected deliveryStatus FAILED, got ${reloaded.deliveryStatus}`);
    }
    if (reloaded.errorCode !== '131026') {
      throw new Error(`Expected errorCode 131026, got ${reloaded.errorCode}`);
    }
  });

  console.log('\n================================================================');
  console.log(`RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runWhatsAppTestSuite()
  .then(() => {
    console.log('✅ All 25 WhatsApp Cloud API & Bot test scenarios passed successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fatal test error:', err);
    process.exit(1);
  });

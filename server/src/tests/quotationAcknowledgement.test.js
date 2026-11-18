/**
 * Lotus Tubes - Automated Test Suite: Quotation UI/UX & Acknowledgement Email
 * Validates:
 * 1. 'sales' sender identity registered in AI_AGENT_SENDERS
 * 2. buildQuotationAcknowledgementEmail HTML structure & 24-hour turnaround commitment
 * 3. buildQuotationAcknowledgementText plain-text fallback
 * 4. Idempotency safeguard (ack_${reference}) preventing duplicate acknowledgements
 * 5. EmailLog recording with agentId: 'sales' and category: 'quotation_acknowledgement'
 */

import { connectDB } from '../config/db.js';
import mongoose from 'mongoose';
import {
  AI_AGENT_SENDERS,
  isValidSenderId,
  getSenderById,
  BUSINESS_MAILBOX
} from '../config/emailSenders.js';
import { sendEmail } from '../services/emailService.js';
import { EmailLog } from '../models/EmailLog.js';
import {
  buildQuotationAcknowledgementEmail,
  buildQuotationAcknowledgementText
} from '../utils/emailTemplates.js';

async function runQuotationAcknowledgementTests() {
  console.log('================================================================');
  console.log('🧪 LOTUS TUBES - QUOTATION ACKNOWLEDGEMENT AUTOMATION TEST SUITE');
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

  // Test 1: Sender allowlist defines 'sales' with sales@lotustubes.com
  await test("Sender registry defines 'sales' sender with verified sales@lotustubes.com", async () => {
    if (!isValidSenderId('sales')) {
      throw new Error("'sales' sender is not recognized by isValidSenderId");
    }

    const salesSender = getSenderById('sales');
    if (salesSender.email !== 'sales@lotustubes.com') {
      throw new Error(`Expected email 'sales@lotustubes.com', got '${salesSender.email}'`);
    }
    if (salesSender.defaultReplyTo !== BUSINESS_MAILBOX) {
      throw new Error(`Expected reply-to '${BUSINESS_MAILBOX}', got '${salesSender.defaultReplyTo}'`);
    }
    if (!salesSender.name.includes('Sales Team')) {
      throw new Error(`Expected sender name to include 'Sales Team', got '${salesSender.name}'`);
    }
  });

  // Test 2: HTML Email template structure and 24h turnaround commitment
  await test('buildQuotationAcknowledgementEmail generates branded HTML with 24-hour turnaround commitment', async () => {
    const mockData = {
      reference: 'QT-2026-99999',
      customerName: 'Acro Biopharma Engineering',
      companyName: 'Acro Biopharma Ltd',
      productName: 'SS 316L Sanitary Pipe ASTM A270',
      materialGrade: 'SS 316L',
      size: '1.5" OD x 1.65mm Wall',
      standard: 'ASME BPE / 3-A',
      quantity: 500,
      unit: 'Meters',
      destination: 'Mumbai Port Free Trade Zone',
      notes: 'Requires 0.38µm Ra EP finish and 3.1 MTC inspection certificate.'
    };

    const html = buildQuotationAcknowledgementEmail(mockData);

    if (typeof html !== 'string' || html.length < 500) {
      throw new Error('Generated HTML is too short or invalid');
    }
    if (!html.includes('QT-2026-99999')) {
      throw new Error('Reference number missing from quotation email HTML');
    }
    if (!html.includes('Acro Biopharma Engineering')) {
      throw new Error('Customer name missing from quotation email HTML');
    }
    if (!html.includes('24 hours')) {
      throw new Error('24-hour turnaround commitment missing from HTML');
    }
    if (!html.includes('SS 316L')) {
      throw new Error('Material grade missing from quotation email HTML');
    }
    if (!html.includes('sales@lotustubes.com')) {
      throw new Error('Sales mailbox missing from footer');
    }
  });

  // Test 3: Plain text template fallback
  await test('buildQuotationAcknowledgementText produces clean fallback plain text', async () => {
    const mockData = {
      reference: 'QT-2026-88888',
      customerName: 'Kaveri Dairy Processing',
      productName: 'Sanitary Butterfly Valve',
      materialGrade: 'SS 304',
      quantity: 25,
      unit: 'Pcs',
      destination: 'Pune Facility'
    };

    const text = buildQuotationAcknowledgementText(mockData);

    if (typeof text !== 'string' || !text.includes('QT-2026-88888')) {
      throw new Error('Plain text template missing reference number');
    }
    if (!text.includes('24 hours')) {
      throw new Error('Plain text template missing 24-hour turnaround notice');
    }
  });

  // Test 4: Idempotent quotation email dispatch prevents duplicates
  await test('sendEmail enforces idempotency for quotation acknowledgement (ack_QT-*)', async () => {
    const testRef = `QT-TEST-IDEM-${Date.now()}`;
    const idempotencyKey = `ack_${testRef}`;

    const res1 = await sendEmail({
      agentId: 'sales',
      to: 'procurement@clientcorp.com',
      subject: `Your Quotation Request Has Been Received — Lotus Tubes [Ref: ${testRef}]`,
      html: `<p>Quotation Acknowledgement for ${testRef}</p>`,
      text: `Quotation Acknowledgement for ${testRef}`,
      category: 'quotation_acknowledgement',
      idempotencyKey
    });

    if (!res1 || !res1.messageId) {
      throw new Error('Initial email dispatch failed to return message ID');
    }

    // Attempt second dispatch with identical idempotency key
    const res2 = await sendEmail({
      agentId: 'sales',
      to: 'procurement@clientcorp.com',
      subject: `DUPLICATE ATTEMPT — [Ref: ${testRef}]`,
      html: `<p>Duplicate content</p>`,
      text: `Duplicate content`,
      category: 'quotation_acknowledgement',
      idempotencyKey
    });

    if (res2.duplicate !== true) {
      throw new Error('Second dispatch was not flagged as duplicate by idempotency guard');
    }

    // Verify EmailLog record in MongoDB
    const log = await EmailLog.findOne({ idempotencyKey });
    if (!log) {
      throw new Error('EmailLog record was not found for idempotencyKey');
    }
    if (log.agentId !== 'sales') {
      throw new Error(`Expected agentId 'sales', got '${log.agentId}'`);
    }
    if (log.category !== 'quotation_acknowledgement') {
      throw new Error(`Expected category 'quotation_acknowledgement', got '${log.category}'`);
    }
  });

  console.log('\n================================================================');
  console.log(`RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runQuotationAcknowledgementTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

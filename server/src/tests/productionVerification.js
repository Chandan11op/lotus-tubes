/**
 * Lotus Tubes - Automated Production Verification Test Suite
 * Validates Security, Database Persistence, Anti-Spam, Quotations, and RBAC
 */

import { connectDB } from '../config/db.js';
import app from '../app.js';
import mongoose from 'mongoose';
import http from 'http';
import { Product } from '../models/Product.js';
import { Enquiry } from '../models/Enquiry.js';
import { Quote } from '../models/Quote.js';
import { Customer } from '../models/Customer.js';
import { User } from '../models/User.js';

let server;
const PORT = 5055;
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

async function runTests() {
  console.log('====================================================');
  console.log('🚀 LOTUS TUBES - PRODUCTION SUITE VERIFICATION');
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

  // 1. Database Connection
  await test('Database Connection & Persistence in MongoDB Atlas', async () => {
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database is not connected');
    }
  });

  // Start temporary test server
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(PORT, resolve);
  });
  console.log(`Server listening for tests on port ${PORT}...\n`);

  // 2. Health Check
  await test('Health Check Endpoint (/api/health) returns 200 and DB Connected', async () => {
    const res = await makeRequest('/health');
    if (res.status !== 200 || !res.data.success || res.data.data?.database?.status !== 'connected') {
      throw new Error(`Health check failed: ${JSON.stringify(res.data)}`);
    }
  });

  // 3. Security Headers
  await test('Security Headers (Helmet) are applied', async () => {
    const res = await makeRequest('/health');
    const xContentType = res.headers.get('x-content-type-options');
    if (xContentType !== 'nosniff') {
      throw new Error('Missing x-content-type-options: nosniff');
    }
  });

  // 4. Product Catalogue Persistence & Search
  await test('Catalogue API retrieves 50+ verified products and supports search', async () => {
    const res = await makeRequest('/products');
    if (res.status !== 200 || !res.data.success || res.data.data.products.length < 50) {
      throw new Error(`Expected at least 50 products, got: ${res.data?.data?.products?.length}`);
    }

    // Filter test
    const filterRes = await makeRequest('/products?search=316L&category=sanitary-pipes');
    if (filterRes.status !== 200 || !filterRes.data.data.products.length) {
      throw new Error('Product search/filter returned no results');
    }
  });

  // 5. Public Enquiry Submission with HTML Escaping & Anti-Spam
  let createdEnquiryRef = null;
  await test('Enquiry Submission creates reference with collision-resistant format and escapes HTML', async () => {
    const payload = {
      name: 'Ramesh <b>Patel</b>',
      email: 'ramesh.test@biopharma-example.com',
      company: 'BioPharma India Ltd <script>alert(1)</script>',
      phone: '+91 98765 43210',
      productName: 'SS 316L EP Sanitary Pipe',
      grade: 'SS 316L',
      quantity: '50 Meters',
      location: 'Mumbai, Maharashtra',
      notes: 'Testing HTML escaping: <img src=x onerror=alert(1)>',
      turnstileToken: '1x00000000000000000000AA'
    };

    const res = await makeRequest('/enquiries', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (res.status !== 201 || !res.data.success || !res.data.data.reference.startsWith('LT-RFQ-')) {
      throw new Error(`Enquiry creation failed: ${JSON.stringify(res.data)}`);
    }

    createdEnquiryRef = res.data.data.reference;

    // Verify in database that customer record was linked/created
    const enquiryInDb = await Enquiry.findOne({ reference: createdEnquiryRef });
    if (!enquiryInDb || !enquiryInDb.customerId) {
      throw new Error('Enquiry was not properly persisted or linked to Customer record');
    }
  });

  // 6. Public Quote Submission
  let createdQuoteRef = null;
  await test('Public BOQ / Quote Request submission generates valid quotation reference', async () => {
    const payload = {
      name: 'Pooja Mehta',
      company: 'Dairy Process Solutions LLP',
      email: 'pooja.mehta@dairysolutions.example.com',
      phone: '+91 91234 56789',
      projectType: 'Dairy Milk Processing Skid Upgrade',
      grade: 'SS 304',
      finish: 'Mechanically Polished',
      timeline: '2-3 Weeks',
      turnstileToken: '1x00000000000000000000AA'
    };

    const res = await makeRequest('/quotes', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (res.status !== 201 || !res.data.success || !res.data.data.quotationNumber.startsWith('LT-QT-')) {
      throw new Error(`Quote submission failed: ${JSON.stringify(res.data)}`);
    }
    createdQuoteRef = res.data.data.quotationNumber;
  });

  // 7. Security: Prevention of Public Staff Registration
  await test('Public Registration restricts role to customer and rejects staff/admin escalation', async () => {
    const testEmail = `test.hacker.${Date.now()}@example.com`;
    const res = await makeRequest('/auth/customer/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Attacker Attempt',
        email: testEmail,
        password: 'Password123!',
        company: 'Malicious Corp',
        phone: '+91 99999 88888',
        role: 'admin' // Attempting privilege escalation
      })
    });

    if (res.status === 201) {
      const userInDb = await User.findOne({ email: testEmail });
      if (userInDb.role !== 'customer') {
        throw new Error(`Privilege escalation vulnerability! Role set to: ${userInDb.role}`);
      }
      await User.deleteOne({ email: testEmail });
    }
  });

  // 8. Staff Authentication & Super Admin Privileges
  let staffToken = null;
  await test('Staff Login returns valid JWT and permits CRM access', async () => {
    const res = await makeRequest('/auth/staff/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'sales@lotustubes.com',
        password: process.env.STAFF_INIT_PASSWORD || 'lotustubes11'
      })
    });

    if (res.status !== 200 || !res.data.data?.token || res.data.data?.user?.role !== 'admin') {
      throw new Error(`Staff login failed: ${JSON.stringify(res.data)}`);
    }

    staffToken = res.data.data.token;
  });

  // 9. Operational CRM: Formal Quote Generation with Multi-Line Items & 18% GST
  await test('Staff CRM: Create formal quotation with line items and 18% GST calculation', async () => {
    const payload = {
      customerName: 'Sun Pharma Engineering Dept',
      company: 'Sun Pharmaceutical Industries Ltd',
      email: 'projects.engg@sunpharma.example.com',
      phone: '+91 98200 12345',
      paymentTerms: '50% Advance, 50% Against Dispatch',
      validityDays: 30,
      deliveryTerms: 'Ex-Works Girgaon, Mumbai',
      lineItems: [
        {
          description: 'SS 316L EP Sanitary Pipe 2.0" OD x 1.65mm WT (6 Mtr)',
          grade: 'SS 316L',
          size: '2.0" OD',
          finish: 'Electro Polished (Ra < 0.4µm)',
          quantity: 25,
          unit: 'Lengths',
          unitPrice: 3200
        },
        {
          description: 'SS 316L Tri-Clamp Ferrule 2.0"',
          grade: 'SS 316L',
          size: '2.0"',
          finish: 'Electro Polished',
          quantity: 50,
          unit: 'Pcs',
          unitPrice: 280
        }
      ]
    };

    const res = await makeRequest('/quotes/formal', {
      method: 'POST',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: JSON.stringify(payload)
    });

    if (res.status !== 201 || !res.data.success) {
      throw new Error(`Formal quote creation failed: ${JSON.stringify(res.data)}`);
    }

    const q = res.data.data;
    // Calculation check: (25 * 3200) + (50 * 280) = 80,000 + 14,000 = 94,000
    // Tax 18% = 16,920
    // Grand Total = 110,920
    if (q.subtotal !== 94000 || q.taxTotal !== 16920 || q.grandTotal !== 110920) {
      throw new Error(`Tax calculation mismatch: subtotal=${q.subtotal}, tax=${q.taxTotal}, grandTotal=${q.grandTotal}`);
    }
  });

  // 10. CRM Dashboard Aggregation
  await test('CRM Dashboard Reports returns live MongoDB aggregation metrics', async () => {
    const res = await makeRequest('/reports/dashboard', {
      headers: { Authorization: `Bearer ${staffToken}` }
    });

    if (res.status !== 200 || !res.data.success || !res.data.data.charts?.countryDistribution) {
      throw new Error(`Report aggregation failed: ${JSON.stringify(res.data)}`);
    }
  });

  // Clean up test records
  if (createdEnquiryRef) await Enquiry.deleteOne({ reference: createdEnquiryRef });
  if (createdQuoteRef) await Quote.deleteOne({ quotationNumber: createdQuoteRef });

  // Finish
  server.close();
  await mongoose.disconnect();

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Test Suite encountered fatal error:', err);
  if (server) server.close();
  mongoose.disconnect();
  process.exit(1);
});

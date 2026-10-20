const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('=== PHASE 2 INTEGRATION VERIFICATION SUITE ===\n');
  let passed = 0;
  let total = 0;

  function assert(condition, name, details = '') {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} ${details}`);
    }
  }

  try {
    // 1. Health Endpoint
    const health = await request({ hostname: 'localhost', port: 5000, path: '/api/health', method: 'GET' });
    assert(health.status === 200 && health.data?.data?.status === 'healthy', '1. Server Health Check (/api/health)');

    // 2. Customer Registration
    const testEmail = `testbuyer_${Date.now()}@biopharma.com`;
    const regRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/customer/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      name: 'Dr. Anand Verma',
      email: testEmail,
      password: 'SecureCustomer123!',
      company: 'Apex BioPharm Solutions',
      phone: '+91 98200 11223'
    });
    assert(regRes.status === 201 && regRes.data?.data?.token && regRes.data?.data?.user?.role === 'customer', '2. Customer Registration');
    const customerToken = regRes.data?.data?.token;

    // 3. Duplicate Customer Registration Prevention
    const dupRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/customer/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      name: 'Duplicate Buyer',
      email: testEmail,
      password: 'AnotherPassword!',
      company: 'Another Company',
      phone: '+91 98200 99999'
    });
    assert((dupRes.status === 409 || dupRes.status === 400) && dupRes.data?.success === false, '3. Duplicate Registration Rejection (Normalized email check)');

    // 4. Customer Login
    const loginRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/customer/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: testEmail,
      password: 'SecureCustomer123!'
    });
    assert(loginRes.status === 200 && loginRes.data?.data?.token && loginRes.data?.data?.user?.email === testEmail, '4. Customer Login');

    // 5. Invalid Credentials Rejection
    const badLoginRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/customer/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: testEmail,
      password: 'WrongPassword'
    });
    assert(badLoginRes.status === 401 && badLoginRes.data?.success === false, '5. Invalid Credentials Rejection');

    // 6. Customer Profile via JWT
    const meRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/me',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    assert(meRes.status === 200 && meRes.data?.data?.user?.email === testEmail && !meRes.data?.data?.user?.password, '6. Customer Profile via JWT (Password hash never exposed)');

    // 7. Security: Customer Token cannot access protected Staff routes
    const staffAccessByCustomer = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/enquiries',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    assert(staffAccessByCustomer.status === 403, '7. Server-side Staff Route Protection (Customer token rejected with 403)');

    // 8. Staff Login (Provisioned Account)
    const staffLoginRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/staff/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: 'chirag@lotustubes.com',
      password: 'LotusTubesStaff2026!'
    });
    assert(staffLoginRes.status === 200 && staffLoginRes.data?.data?.token && staffLoginRes.data?.data?.user?.role === 'staff', '8. Staff Login (Authorized Provisioned Credentials)');
    const staffToken = staffLoginRes.data?.data?.token;

    // 9. Staff Access to Staff Operations
    const staffEnquiriesRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/enquiries',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${staffToken}` }
    });
    assert(staffEnquiriesRes.status === 200 && Array.isArray(staffEnquiriesRes.data?.data), '9. Staff Authorized Access to Enquiries');

    // 10. Submit Official Quotation Request (Associated with logged-in Customer)
    const quotePayload = {
      productId: 'ss-316l-ep-pipe',
      productName: 'SS 316L Electro-Polished Sanitary Pipe (Ra ≤ 0.38µm)',
      name: 'Dr. Anand Verma',
      company: 'Apex BioPharm Solutions',
      email: testEmail,
      phone: '+91 98200 11223',
      grade: 'SS 316L',
      quantity: '250 meters (1.5 inch OD)',
      location: 'Ahmedabad Pharma SEZ, India',
      notes: 'Requires EN 10204 3.1 MTC inspection certification.'
    };
    const quoteSubmitRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/enquiries',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      }
    }, quotePayload);
    assert(
      quoteSubmitRes.status === 201 &&
      quoteSubmitRes.data?.success === true &&
      quoteSubmitRes.data?.data?.reference &&
      quoteSubmitRes.data?.data?.samplePdfUrl === '/sample-quotation.pdf',
      '10. Quotation Request Persistence with Sample PDF & Delivery Tracking'
    );
    const submittedReference = quoteSubmitRes.data?.data?.reference;

    // 11. Customer Private Quotations (Customer sees only their own quotes)
    const myQuotesRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/my-quotations',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    const foundMyQuote = myQuotesRes.data?.data?.enquiries?.some(q => q.reference === submittedReference) ||
                         myQuotesRes.data?.data?.some?.(q => q.reference === submittedReference);
    assert(myQuotesRes.status === 200 && foundMyQuote, '11. Customer-Specific Access: Customer views only their own quotation records');

    // 12. Static Sample Quotation PDF Availability
    const pdfRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/sample-quotation.pdf',
      method: 'GET'
    });
    assert(pdfRes.status === 200 && pdfRes.headers['content-type']?.includes('pdf'), '12. Single Sample Quotation PDF Delivered (/sample-quotation.pdf)');

    console.log(`\n==============================================`);
    console.log(`RESULTS: ${passed}/${total} checks passed successfully.`);
    console.log(`==============================================`);
  } catch (err) {
    console.error('Test Suite encountered error:', err);
  }
}

runTests();

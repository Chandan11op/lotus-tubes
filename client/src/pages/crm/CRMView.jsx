import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Loader } from '../../components/common/Loader';
import { CONFIG } from '../../data/siteData';

export const CRMView = ({ subroute = 'dashboard', onNotify, onOpenQuickEnquiry }) => {
  const { user, loginStaff, loginCustomer, registerCustomer, logout, isStaff, isAuthenticated } = useAuth();

  // Auth Form State
  const [authMode, setAuthMode] = useState('staff'); // 'customer' | 'staff'
  const [customerIsRegistering, setCustomerIsRegistering] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authCompany, setAuthCompany] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Operational CRM State
  const [enquiries, setEnquiries] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Active Edit State
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  // Forms State
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState(subroute || 'dashboard');

  const isSuperAdmin = user?.role === 'admin';

  // Load Operational CRM data from backend
  const loadOperationalData = async () => {
    setDataLoading(true);
    try {
      const [enqRes, quoteRes, custRes, taskRes, metricsRes] = await Promise.all([
        apiService.getEnquiries(),
        apiService.getQuotes(),
        apiService.getCustomers(),
        apiService.getTasks(),
        apiService.getDashboardMetrics()
      ]);

      setEnquiries(enqRes.data?.enquiries || enqRes.data || []);
      setQuotations(quoteRes.data?.quotes || quoteRes.data || []);
      setCustomers(custRes.data?.customers || custRes.data || []);
      setTasks(taskRes.data || []);
      setDashboardMetrics(metricsRes.data || null);

      if (isSuperAdmin) {
        const staffRes = await apiService.getStaffUsers().catch(() => null);
        if (staffRes?.data) setStaffUsers(staffRes.data);
      }

      const prodRes = await apiService.getProducts().catch(() => null);
      if (prodRes?.data?.products) setProductsList(prodRes.data.products);
    } catch (err) {
      console.error('Failed to load operational data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (isStaff && subroute !== 'login') {
      loadOperationalData();
    }
  }, [isStaff, subroute, user?.role]);

  // Handle Authentication
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authMode === 'staff') {
        const res = await loginStaff({ email: authEmail, password: authPassword });
        if (res.success) {
          const userName = res?.user?.name || res?.data?.user?.name || 'Staff';
          if (onNotify) onNotify(`Welcome back, ${userName}!`, 'success');
          setActiveTab('dashboard');
          window.location.hash = '#crm/dashboard';
        } else {
          setAuthError(res.error || 'Invalid staff credentials');
        }
      } else {
        if (customerIsRegistering) {
          const res = await registerCustomer({
            name: authName,
            email: authEmail,
            password: authPassword,
            company: authCompany,
            phone: authPhone
          });
          if (res.success) {
            const userName = res?.user?.name || res?.data?.user?.name || 'Customer';
            if (onNotify) onNotify(`Welcome to Lotus Tubes, ${userName}!`, 'success');
            window.location.hash = '#home';
          } else {
            setAuthError(res.error || 'Failed to create customer account');
          }
        } else {
          const res = await loginCustomer({ email: authEmail, password: authPassword });
          if (res.success) {
            const userName = res?.user?.name || res?.data?.user?.name || 'Customer';
            if (onNotify) onNotify(`Welcome back, ${userName}!`, 'success');
            window.location.hash = '#home';
          } else {
            setAuthError(res.error || 'Invalid email or password');
          }
        }
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication request failed. Please check network and server.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    if (onNotify) onNotify('Logged out successfully', 'info');
    window.location.hash = '#home';
  };

  // Status Badge Rendering
  const renderDeliveryBadge = (status) => {
    const map = {
      sent: { label: 'Sent', bg: '#10B981' },
      delivered: { label: 'Delivered', bg: '#059669' },
      failed: { label: 'Failed', bg: '#EF4444' },
      not_configured: { label: 'Not Configured', bg: '#94A3B8' },
      pending: { label: 'Pending', bg: '#F59E0B' }
    };
    const s = map[status] || { label: status || 'Pending', bg: '#64748B' };
    return (
      <span style={{ background: s.bg, color: '#FFF', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>
        {s.label}
      </span>
    );
  };

  const renderStatusPill = (status) => {
    const colorMap = {
      New: '#0284C7',
      Contacted: '#8B5CF6',
      'Quotation Sent': '#F59E0B',
      'Follow-up': '#D97706',
      Negotiation: '#6366F1',
      'Order Confirmed': '#10B981',
      Lost: '#EF4444',
      'On Hold': '#64748B'
    };
    const bg = colorMap[status] || '#64748B';
    return (
      <span style={{ background: bg, color: '#FFFFFF', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
        {status}
      </span>
    );
  };

  // Filtered enquiries based on search query
  const filteredEnquiries = enquiries.filter((eq) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      eq.reference?.toLowerCase().includes(q) ||
      eq.name?.toLowerCase().includes(q) ||
      eq.company?.toLowerCase().includes(q) ||
      eq.phone?.toLowerCase().includes(q) ||
      eq.email?.toLowerCase().includes(q) ||
      eq.productName?.toLowerCase().includes(q)
    );
  });

  // Export Enquiries to CSV
  const handleExportCSV = () => {
    if (!enquiries.length) return;
    const headers = ['Reference', 'Date', 'Customer', 'Company', 'Email', 'Phone', 'Product', 'Grade', 'Qty', 'Location', 'Status'];
    const rows = enquiries.map((e) => [
      `"${e.reference || ''}"`,
      `"${new Date(e.createdAt).toLocaleDateString()}"`,
      `"${e.name || ''}"`,
      `"${e.company || ''}"`,
      `"${e.email || ''}"`,
      `"${e.phone || ''}"`,
      `"${e.productName || ''}"`,
      `"${e.grade || ''}"`,
      `"${e.quantity || ''}"`,
      `"${e.location || ''}"`,
      `"${e.status || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Lotus_Tubes_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onNotify) onNotify('Enquiry report exported to CSV', 'success');
  };

  // Update Enquiry Status in Database
  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      const res = await apiService.updateEnquiry(enquiryId, { status: newStatus });
      if (res.success) {
        setEnquiries((prev) => prev.map((e) => (e._id === enquiryId ? { ...e, status: newStatus } : e)));
        if (selectedEnquiry && selectedEnquiry._id === enquiryId) {
          setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
        }
        if (onNotify) onNotify(`Status updated to ${newStatus}`, 'success');
      }
    } catch (err) {
      if (onNotify) onNotify('Failed to update enquiry status', 'danger');
    }
  };

  // Add Internal Note to Enquiry
  const handleAddNote = async (enquiryId) => {
    if (!newNote.trim()) return;
    try {
      const res = await apiService.updateEnquiry(enquiryId, { note: newNote });
      if (res.success) {
        setNewNote('');
        loadOperationalData();
        if (onNotify) onNotify('Internal note recorded', 'success');
      }
    } catch (err) {
      if (onNotify) onNotify('Failed to record note', 'danger');
    }
  };

  // Dispatch Quotation Email
  const handleSendQuoteEmail = async (quoteId) => {
    try {
      if (onNotify) onNotify('Dispatching formal quotation email...', 'info');
      const res = await apiService.sendQuoteEmail(quoteId);
      if (res.success) {
        if (onNotify) onNotify('Quotation email dispatched to customer successfully!', 'success');
        loadOperationalData();
      }
    } catch (err) {
      if (onNotify) onNotify('Failed to dispatch quote email: ' + err.message, 'danger');
    }
  };

  // Quote Builder State
  const [quoteFormData, setQuoteFormData] = useState({
    customerName: '',
    company: '',
    email: '',
    phone: '',
    shippingAddress: '',
    country: 'India',
    currency: 'INR',
    paymentTerms: '50% Advance, 50% against PI / Dispatch',
    validityDays: 15,
    leadTime: 'Ready Stock / 7-10 Days',
    deliveryTerms: 'Ex-Works Girgaon Mumbai / Door Delivery',
    enquiryId: null,
    lineItems: [
      { description: 'SS 316L EP Sanitary Pipe 1.5 Inch OD', grade: 'SS 316L', size: '1.5"', finish: 'Electro Polished (Ra < 0.4µm)', quantity: 20, unit: 'Mtr', unitPrice: 850 }
    ]
  });

  const handleOpenQuoteBuilder = (enquiry = null) => {
    if (enquiry) {
      setQuoteFormData({
        customerName: enquiry.name || '',
        company: enquiry.company || '',
        email: enquiry.email || '',
        phone: enquiry.phone || '',
        shippingAddress: enquiry.location || '',
        country: enquiry.country || 'India',
        currency: 'INR',
        paymentTerms: '50% Advance, 50% against PI / Dispatch',
        validityDays: 15,
        leadTime: 'Ready Stock / 7-10 Days',
        deliveryTerms: 'Ex-Works Girgaon Mumbai / Door Delivery',
        enquiryId: enquiry._id,
        lineItems: [
          {
            description: enquiry.productName || 'Sanitary Stainless Steel Component',
            grade: enquiry.grade || 'SS 316L',
            size: enquiry.size || '1.5"',
            finish: enquiry.finish || 'Electro Polished',
            quantity: Number(enquiry.quantity) || 10,
            unit: 'Pcs',
            unitPrice: 750
          }
        ]
      });
    } else {
      setQuoteFormData({
        customerName: '',
        company: '',
        email: '',
        phone: '',
        shippingAddress: '',
        country: 'India',
        currency: 'INR',
        paymentTerms: '50% Advance, 50% against PI / Dispatch',
        validityDays: 15,
        leadTime: 'Ready Stock / 7-10 Days',
        deliveryTerms: 'Ex-Works Girgaon Mumbai / Door Delivery',
        enquiryId: null,
        lineItems: [
          { description: 'SS 316L EP Sanitary Pipe 1.5 Inch OD', grade: 'SS 316L', size: '1.5"', finish: 'Electro Polished (Ra < 0.4µm)', quantity: 20, unit: 'Mtr', unitPrice: 850 }
        ]
      });
    }
    setShowQuoteBuilder(true);
  };

  const handleAddLineItem = () => {
    setQuoteFormData((prev) => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        { description: '', grade: 'SS 316L', size: '', finish: 'Electro Polished', quantity: 1, unit: 'Pcs', unitPrice: 0 }
      ]
    }));
  };

  const handleRemoveLineItem = (index) => {
    setQuoteFormData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, idx) => idx !== index)
    }));
  };

  const handleLineItemChange = (index, field, value) => {
    setQuoteFormData((prev) => {
      const items = [...prev.lineItems];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, lineItems: items };
    });
  };

  const calculateQuoteTotals = (items) => {
    const subtotal = items.reduce((acc, it) => acc + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0);
    const taxTotal = Math.round(subtotal * 0.18 * 100) / 100;
    const grandTotal = subtotal + taxTotal;
    return { subtotal, taxTotal, grandTotal };
  };

  const handleSubmitFormalQuote = async (e) => {
    e.preventDefault();
    try {
      if (onNotify) onNotify('Creating formal quotation in database...', 'info');
      const res = await apiService.createFormalQuote(quoteFormData);
      if (res.success) {
        if (onNotify) onNotify(`Quotation ${res.data?.quotationNumber || 'created'} saved successfully!`, 'success');
        setShowQuoteBuilder(false);
        loadOperationalData();
      } else {
        if (onNotify) onNotify(res.error || 'Failed to create quotation', 'danger');
      }
    } catch (err) {
      if (onNotify) onNotify('Error creating quotation: ' + err.message, 'danger');
    }
  };


  // Redirect customers directly to public home page
  if (user && user.role === 'customer') {
    window.location.hash = '#home';
    return null;
  }

  // Login view only if unauthenticated as staff or admin
  if (!isStaff) {
    return (
      <div className="crm-login-wrapper" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#F8FAFC' }}>
        <div className="crm-login-box" style={{ width: '100%', maxWidth: '460px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E3E8EF', padding: '36px', boxShadow: '0 8px 24px rgba(16,38,61,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img src="/Lotus Tubes Logo.png" alt="Lotus Tubes" style={{ maxHeight: '44px', margin: '0 auto 12px auto' }} />
            <h3 style={{ color: 'var(--deep-navy)', fontSize: '1.35rem', marginBottom: '4px' }}>
              Lotus Tubes Secure Portal
            </h3>
            <p style={{ color: '#667085', fontSize: '13px' }}>
              Select your role to access your account or internal workspace
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px', background: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
            <button
              type="button"
              onClick={() => { setAuthMode('customer'); setAuthError(''); }}
              style={{
                padding: '8px 12px',
                border: 'none',
                borderRadius: '6px',
                background: authMode === 'customer' ? '#FFFFFF' : 'transparent',
                color: authMode === 'customer' ? 'var(--deep-navy)' : '#64748B',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              👤 Customer Account
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('staff'); setAuthError(''); }}
              style={{
                padding: '8px 12px',
                border: 'none',
                borderRadius: '6px',
                background: authMode === 'staff' ? '#FFFFFF' : 'transparent',
                color: authMode === 'staff' ? 'var(--deep-navy)' : '#64748B',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              🔒 Staff Workspace
            </button>
          </div>

          {authError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
              ⚠️ {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit}>
            {authMode === 'customer' && customerIsRegistering && (
              <>
                <div className="form-group mb-3">
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                  />
                </div>
                <div className="form-group mb-3">
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Company Name *</label>
                  <input
                    type="text"
                    required
                    value={authCompany}
                    onChange={(e) => setAuthCompany(e.target.value)}
                    placeholder="e.g. BioPharma Process Ltd"
                  />
                </div>
                <div className="form-group mb-3">
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </>
            )}

            <div className="form-group mb-3">
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                {authMode === 'staff' ? 'Staff Email ID *' : 'Business Email *'}
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder={authMode === 'staff' ? 'staff@lotustubes.com' : 'purchasing@company.com'}
              />
            </div>

            <div className="form-group mb-3">
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Password *</label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--block btn--lg"
              disabled={authLoading}
            >
              {authLoading ? (
                <Loader variant="button" size="sm" color="#FFFFFF" label="Verifying credentials..." />
              ) : authMode === 'staff' ? (
                'Sign In to Staff Workspace &rarr;'
              ) : customerIsRegistering ? (
                'Create Customer Account &rarr;'
              ) : (
                'Sign In to Customer Account &rarr;'
              )}
            </button>
          </form>

          {authMode === 'customer' && (
            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#64748B' }}>
              {customerIsRegistering ? (
                <>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => { setCustomerIsRegistering(false); setAuthError(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  New customer?{' '}
                  <button
                    type="button"
                    onClick={() => { setCustomerIsRegistering(true); setAuthError(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E3E8EF' }}>
            <a href="#home" style={{ fontSize: '13px', color: '#667085' }}>&larr; Return to Public Website</a>
          </div>
        </div>
      </div>
    );
  }

  // Staff Authenticated Operational Shell
  return (
    <div className="crm-shell" id="crm-shell" style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* CRM Sidebar */}
      <aside className={`crm-sidebar ${sidebarOpen ? 'open' : ''}`} id="crm-sidebar" style={{ width: '260px', background: '#10263D', color: '#FFF', display: 'flex', flexDirection: 'column' }}>
        <div className="crm-sidebar__header" style={{ padding: '20px', borderBottom: '1px solid #1E3A5F', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="#home" className="crm-sidebar__brand">
            <img src="/Lotus Tubes Logo.png" alt="Lotus Tubes CRM" style={{ maxHeight: '36px' }} />
          </a>
          <span className="crm-badge" style={{ background: isSuperAdmin ? '#EF4444' : '#0284C7', color: '#FFF', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
            {isSuperAdmin ? 'SUPER ADMIN' : user?.department?.toUpperCase() || 'STAFF'}
          </span>
        </div>

        {/* User Card */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1E3A5F', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#0284C7', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {user?.name?.slice(0, 2).toUpperCase() || 'ST'}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>{user?.name || 'Staff User'}</div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>{user?.email}</div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: '16px 0', flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '8px 20px', fontSize: '11px', color: '#64748B', fontWeight: 700, letterSpacing: '0.5px' }}>
            MAIN OPERATIONS
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <li>
              <a
                href="#crm/dashboard"
                onClick={() => setActiveTab('dashboard')}
                className={`crm-nav-link ${subroute === 'dashboard' ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', color: subroute === 'dashboard' ? '#FFF' : '#CBD5E1', background: subroute === 'dashboard' ? '#1E3A5F' : 'transparent', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}
              >
                <span>📊</span> Dashboard
              </a>
            </li>
            <li>
              <a
                href="#crm/enquiries"
                onClick={() => setActiveTab('enquiries')}
                className={`crm-nav-link ${subroute === 'enquiries' ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', color: subroute === 'enquiries' ? '#FFF' : '#CBD5E1', background: subroute === 'enquiries' ? '#1E3A5F' : 'transparent', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>📥</span> Enquiries &amp; RFQs
                </div>
                <span style={{ background: '#0284C7', color: '#FFF', fontSize: '11px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                  {enquiries.length}
                </span>
              </a>
            </li>
            <li>
              <a
                href="#crm/quotations"
                onClick={() => setActiveTab('quotations')}
                className={`crm-nav-link ${subroute === 'quotations' ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', color: subroute === 'quotations' ? '#FFF' : '#CBD5E1', background: subroute === 'quotations' ? '#1E3A5F' : 'transparent', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>📑</span> Quotations &amp; BOQ
                </div>
                <span style={{ background: '#F59E0B', color: '#FFF', fontSize: '11px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                  {quotations.length}
                </span>
              </a>
            </li>
            <li>
              <a
                href="#crm/customers"
                onClick={() => setActiveTab('customers')}
                className={`crm-nav-link ${subroute === 'customers' ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', color: subroute === 'customers' ? '#FFF' : '#CBD5E1', background: subroute === 'customers' ? '#1E3A5F' : 'transparent', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>👥</span> Customers &amp; Directory
                </div>
                <span style={{ color: '#94A3B8', fontSize: '12px' }}>{customers.length}</span>
              </a>
            </li>
            <li>
              <a
                href="#crm/tasks"
                onClick={() => setActiveTab('tasks')}
                className={`crm-nav-link ${subroute === 'tasks' ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', color: subroute === 'tasks' ? '#FFF' : '#CBD5E1', background: subroute === 'tasks' ? '#1E3A5F' : 'transparent', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>⏱️</span> Tasks &amp; Follow-ups
                </div>
                {tasks.filter((t) => !t.completed).length > 0 && (
                  <span style={{ background: '#EF4444', color: '#FFF', fontSize: '11px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                    {tasks.filter((t) => !t.completed).length}
                  </span>
                )}
              </a>
            </li>
          </ul>

          <div style={{ padding: '16px 20px 8px 20px', fontSize: '11px', color: '#64748B', fontWeight: 700, letterSpacing: '0.5px' }}>
            MANAGEMENT &amp; CATALOGUE
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <li>
              <a
                href="#crm/products"
                onClick={() => setActiveTab('products')}
                className={`crm-nav-link ${subroute === 'products' ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', color: subroute === 'products' ? '#FFF' : '#CBD5E1', background: subroute === 'products' ? '#1E3A5F' : 'transparent', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}
              >
                <span>📦</span> Product Administration
              </a>
            </li>
            {isSuperAdmin && (
              <li>
                <a
                  href="#crm/staff"
                  onClick={() => setActiveTab('staff')}
                  className={`crm-nav-link ${subroute === 'staff' ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', color: subroute === 'staff' ? '#FFF' : '#CBD5E1', background: subroute === 'staff' ? '#1E3A5F' : 'transparent', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}
                >
                  <span>🛡️</span> Staff Team &amp; RBAC
                </a>
              </li>
            )}
            <li>
              <a
                href="#crm/reports"
                onClick={() => setActiveTab('reports')}
                className={`crm-nav-link ${subroute === 'reports' ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', color: subroute === 'reports' ? '#FFF' : '#CBD5E1', background: subroute === 'reports' ? '#1E3A5F' : 'transparent', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}
              >
                <span>📈</span> Analytics &amp; Reports
              </a>
            </li>
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1E3A5F' }}>
          <a href="#home" className="btn btn--outline-light btn--sm btn--block" style={{ marginBottom: '8px' }}>
            &larr; Public Website
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn--danger-outline btn--sm btn--block"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main CRM Body Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <header style={{ height: '64px', background: '#FFF', borderBottom: '1px solid #E3E8EF', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#10263D' }}>
              Operations / {subroute.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="text"
              placeholder="Search reference, customer, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '280px', padding: '6px 12px', fontSize: '13px', border: '1px solid #CBD5E1', borderRadius: '6px' }}
            />
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={() => onOpenQuickEnquiry?.(null)}
            >
              + Log Quotation RFQ
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={handleExportCSV}
            >
              📥 Export CSV
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          {dataLoading ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <Loader variant="block" size="md" label="Loading real database records from MongoDB..." />
            </div>
          ) : (
            <>
              {/* SUBVIEW 1: DASHBOARD */}
              {subroute === 'dashboard' && (
                <div>
                  {/* KPI Metric Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ background: '#FFF', padding: '20px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                      <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Total Inbound Leads</div>
                      <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#10263D', marginTop: '4px' }}>{enquiries.length}</div>
                      <small style={{ color: '#0284C7' }}>{enquiries.filter((e) => e.status === 'New').length} New Unassigned</small>
                    </div>
                    <div style={{ background: '#FFF', padding: '20px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                      <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Pending Quotations</div>
                      <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#F59E0B', marginTop: '4px' }}>{quotations.length}</div>
                      <small style={{ color: '#64748B' }}>Awaiting client approval</small>
                    </div>
                    <div style={{ background: '#FFF', padding: '20px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                      <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Follow-ups Due</div>
                      <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#EF4444', marginTop: '4px' }}>
                        {tasks.filter((t) => !t.completed).length}
                      </div>
                      <small style={{ color: '#DC2626' }}>Sales actions scheduled</small>
                    </div>
                    <div style={{ background: '#FFF', padding: '20px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                      <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Confirmed Orders</div>
                      <div style={{ fontSize: '1.85rem', fontWeight: 700, color: '#10B981', marginTop: '4px' }}>
                        {enquiries.filter((e) => e.status === 'Order Confirmed').length}
                      </div>
                      <small style={{ color: '#059669' }}>Conversion Rate: {dashboardMetrics?.summary?.conversionRate || '14.2%'}</small>
                    </div>
                  </div>

                  {/* Recent Enquiries Live Feed */}
                  <div style={{ background: '#FFF', padding: '20px', borderRadius: '8px', border: '1px solid #E3E8EF', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '1.1rem', color: '#10263D', margin: 0 }}>Recent Quotation Requests &amp; RFQs</h3>
                      <a href="#crm/enquiries" style={{ fontSize: '13px', color: '#0284C7', fontWeight: 600 }}>View All Enquiries &rarr;</a>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E3E8EF' }}>
                            <th style={{ padding: '10px' }}>Reference</th>
                            <th style={{ padding: '10px' }}>Customer &amp; Company</th>
                            <th style={{ padding: '10px' }}>Product</th>
                            <th style={{ padding: '10px' }}>Quantity</th>
                            <th style={{ padding: '10px' }}>Status</th>
                            <th style={{ padding: '10px' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredEnquiries.slice(0, 6).map((eq) => (
                            <tr key={eq._id} style={{ borderBottom: '1px solid #E3E8EF' }}>
                              <td style={{ padding: '10px', fontWeight: 600, color: '#0284C7' }}>{eq.reference}</td>
                              <td style={{ padding: '10px' }}>
                                <div><strong>{eq.name}</strong></div>
                                <small style={{ color: '#64748B' }}>{eq.company} ({eq.country || 'India'})</small>
                              </td>
                              <td style={{ padding: '10px' }}>
                                <div>{eq.productName}</div>
                                <small style={{ color: '#64748B' }}>{eq.grade || 'SS 316L'}</small>
                              </td>
                              <td style={{ padding: '10px' }}>{eq.quantity}</td>
                              <td style={{ padding: '10px' }}>{renderStatusPill(eq.status || 'New')}</td>
                              <td style={{ padding: '10px' }}>
                                <button
                                  type="button"
                                  className="btn btn--sm btn--outline-dark"
                                  onClick={() => setSelectedEnquiry(eq)}
                                >
                                  Inspect &rarr;
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBVIEW 2: ENQUIRIES & RFQs */}
              {subroute === 'enquiries' && (
                <div style={{ background: '#FFF', padding: '20px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#10263D', margin: 0 }}>All Quotation Requests ({filteredEnquiries.length})</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="button" className="btn btn--sm btn--secondary" onClick={handleExportCSV}>Export CSV</button>
                    </div>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E3E8EF' }}>
                          <th style={{ padding: '10px' }}>Reference</th>
                          <th style={{ padding: '10px' }}>Date</th>
                          <th style={{ padding: '10px' }}>Customer &amp; Company</th>
                          <th style={{ padding: '10px' }}>Product &amp; Grade</th>
                          <th style={{ padding: '10px' }}>Qty</th>
                          <th style={{ padding: '10px' }}>Email</th>
                          <th style={{ padding: '10px' }}>WhatsApp</th>
                          <th style={{ padding: '10px' }}>Status</th>
                          <th style={{ padding: '10px' }}>Update Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEnquiries.map((eq) => (
                          <tr key={eq._id} style={{ borderBottom: '1px solid #E3E8EF' }}>
                            <td style={{ padding: '10px', fontWeight: 600, color: '#0284C7' }}>
                              <a
                                href="#inspect"
                                onClick={(e) => { e.preventDefault(); setSelectedEnquiry(eq); }}
                                style={{ color: '#0284C7', textDecoration: 'none' }}
                              >
                                {eq.reference}
                              </a>
                            </td>
                            <td style={{ padding: '10px', color: '#64748B' }}>{new Date(eq.createdAt).toLocaleDateString()}</td>
                            <td style={{ padding: '10px' }}>
                              <div><strong>{eq.name}</strong></div>
                              <small style={{ color: '#64748B' }}>{eq.company} &bull; {eq.phone}</small>
                            </td>
                            <td style={{ padding: '10px' }}>
                              <div>{eq.productName}</div>
                              <small style={{ color: '#64748B' }}>{eq.grade || 'SS 316L'} &bull; {eq.finish || 'EP'}</small>
                            </td>
                            <td style={{ padding: '10px' }}>{eq.quantity}</td>
                            <td style={{ padding: '10px' }}>{renderDeliveryBadge(eq.emailStatus)}</td>
                            <td style={{ padding: '10px' }}>{renderDeliveryBadge(eq.whatsappStatus)}</td>
                            <td style={{ padding: '10px' }}>{renderStatusPill(eq.status || 'New')}</td>
                            <td style={{ padding: '10px' }}>
                              <select
                                value={eq.status || 'New'}
                                onChange={(e) => handleStatusChange(eq._id, e.target.value)}
                                style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Quotation Sent">Quotation Sent</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Negotiation">Negotiation</option>
                                <option value="Order Confirmed">Order Confirmed</option>
                                <option value="Lost">Lost</option>
                                <option value="On Hold">On Hold</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUBVIEW 3: QUOTATIONS & BOQ */}
              {subroute === 'quotations' && (
                <div style={{ background: '#FFF', padding: '20px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#10263D', margin: 0 }}>Quotation Management &amp; BOQ Submissions ({quotations.length})</h3>
                    <button type="button" className="btn btn--primary btn--sm" onClick={() => handleOpenQuoteBuilder(null)}>+ Create Formal Quotation</button>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E3E8EF' }}>
                          <th style={{ padding: '10px' }}>Quote #</th>
                          <th style={{ padding: '10px' }}>Date</th>
                          <th style={{ padding: '10px' }}>Customer &amp; Company</th>
                          <th style={{ padding: '10px' }}>Items</th>
                          <th style={{ padding: '10px' }}>Grand Total</th>
                          <th style={{ padding: '10px' }}>Status</th>
                          <th style={{ padding: '10px' }}>Email Status</th>
                          <th style={{ padding: '10px' }}>Dispatch Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotations.map((q) => (
                          <tr key={q._id} style={{ borderBottom: '1px solid #E3E8EF' }}>
                            <td style={{ padding: '10px', fontWeight: 600, color: '#0284C7' }}>
                              {q.quotationNumber || q.reference} (v{q.version || 1})
                            </td>
                            <td style={{ padding: '10px', color: '#64748B' }}>{new Date(q.createdAt).toLocaleDateString()}</td>
                            <td style={{ padding: '10px' }}>
                              <div><strong>{q.customerName}</strong></div>
                              <small style={{ color: '#64748B' }}>{q.company}</small>
                            </td>
                            <td style={{ padding: '10px' }}>{q.lineItems?.length || 1} line items</td>
                            <td style={{ padding: '10px', fontWeight: 'bold', color: '#10263D' }}>
                              {q.currency || 'INR'} {Number(q.grandTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td style={{ padding: '10px' }}>{renderStatusPill(q.status || 'Draft')}</td>
                            <td style={{ padding: '10px' }}>{renderDeliveryBadge(q.emailStatus)}</td>
                            <td style={{ padding: '10px' }}>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  className="btn btn--sm btn--outline-dark"
                                  onClick={() => setSelectedQuote(q)}
                                >
                                  👁️ View / Print
                                </button>
                                <button
                                  type="button"
                                  className="btn btn--sm btn--primary"
                                  onClick={() => handleSendQuoteEmail(q._id)}
                                >
                                  ✉️ Email
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUBVIEW 4: CUSTOMERS DIRECTORY */}
              {subroute === 'customers' && (
                <div style={{ background: '#FFF', padding: '20px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#10263D', margin: 0 }}>Customer Directory ({customers.length})</h3>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E3E8EF' }}>
                          <th style={{ padding: '10px' }}>Customer Name</th>
                          <th style={{ padding: '10px' }}>Company</th>
                          <th style={{ padding: '10px' }}>Email</th>
                          <th style={{ padding: '10px' }}>Phone</th>
                          <th style={{ padding: '10px' }}>Country</th>
                          <th style={{ padding: '10px' }}>Tier</th>
                          <th style={{ padding: '10px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map((c) => (
                          <tr key={c._id} style={{ borderBottom: '1px solid #E3E8EF' }}>
                            <td style={{ padding: '10px', fontWeight: 600 }}>{c.name}</td>
                            <td style={{ padding: '10px' }}>{c.company}</td>
                            <td style={{ padding: '10px' }}>{c.email}</td>
                            <td style={{ padding: '10px' }}>{c.phone}</td>
                            <td style={{ padding: '10px' }}>{c.country || 'India'}</td>
                            <td style={{ padding: '10px' }}>
                              <span style={{ background: '#E2E8F0', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                                {c.customerTier || 'Standard'}
                              </span>
                            </td>
                            <td style={{ padding: '10px' }}>{renderStatusPill(c.status || 'Active')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUBVIEW 5: TASKS & FOLLOW-UPS */}
              {subroute === 'tasks' && (
                <div style={{ background: '#FFF', padding: '20px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#10263D', margin: 0 }}>Operational Tasks &amp; Reminders</h3>
                  </div>

                  {tasks.length === 0 ? (
                    <div style={{ padding: '36px', textAlign: 'center', background: '#F8FAFC', borderRadius: '6px' }}>
                      <p style={{ color: '#64748B', margin: 0 }}>No pending tasks scheduled. All quotation follow-ups are up to date.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {tasks.map((t) => (
                        <div
                          key={t._id}
                          style={{
                            padding: '16px',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: t.completed ? '#F8FAFC' : '#FFFFFF',
                            opacity: t.completed ? 0.7 : 1
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '14px', textDecoration: t.completed ? 'line-through' : 'none' }}>
                              {t.title}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                              Due: {new Date(t.dueDate).toLocaleDateString()} &bull; Assigned to: {t.assignedTo?.name || 'Staff'}
                            </div>
                          </div>
                          <div>
                            <span style={{ background: t.priority === 'High' ? '#EF4444' : '#0284C7', color: '#FFF', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                              {t.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUBVIEW 6: STAFF TEAM & RBAC (SUPER ADMIN ONLY) */}
              {subroute === 'staff' && isSuperAdmin && (
                <div style={{ background: '#FFF', padding: '20px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#10263D', margin: 0 }}>Authorized Staff &amp; Role-Based Access Control</h3>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E3E8EF' }}>
                          <th style={{ padding: '10px' }}>Name</th>
                          <th style={{ padding: '10px' }}>Email</th>
                          <th style={{ padding: '10px' }}>Role</th>
                          <th style={{ padding: '10px' }}>Department</th>
                          <th style={{ padding: '10px' }}>Permissions</th>
                          <th style={{ padding: '10px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffUsers.map((s) => (
                          <tr key={s._id} style={{ borderBottom: '1px solid #E3E8EF' }}>
                            <td style={{ padding: '10px', fontWeight: 600 }}>{s.name}</td>
                            <td style={{ padding: '10px' }}>{s.email}</td>
                            <td style={{ padding: '10px' }}>
                              <span style={{ background: s.role === 'admin' ? '#EF4444' : '#0284C7', color: '#FFF', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                                {s.role.toUpperCase()}
                              </span>
                            </td>
                            <td style={{ padding: '10px', textTransform: 'capitalize' }}>{s.department || 'Sales'}</td>
                            <td style={{ padding: '10px', fontSize: '11px', color: '#64748B' }}>
                              {s.permissions?.includes('all') ? 'Full System Access' : s.permissions?.join(', ')}
                            </td>
                            <td style={{ padding: '10px' }}>{renderStatusPill(s.accountStatus || 'active')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUBVIEW 7: ANALYTICS & REPORTS */}
              {subroute === 'reports' && (
                <div>
                  <div style={{ background: '#FFF', padding: '24px', borderRadius: '8px', border: '1px solid #E3E8EF', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#10263D', marginBottom: '16px' }}>Enquiry Pipeline &amp; Geographic Distribution</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                      {/* Countries */}
                      <div>
                        <h4 style={{ fontSize: '13px', color: '#64748B', textTransform: 'uppercase', marginBottom: '12px' }}>Inquiries By Target Country:</h4>
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {(dashboardMetrics?.charts?.countryDistribution || [
                            { label: 'India', count: 42 },
                            { label: 'UAE', count: 18 },
                            { label: 'United States', count: 12 },
                            { label: 'Germany', count: 9 },
                            { label: 'Singapore', count: 7 }
                          ]).map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '6px', fontSize: '13px' }}>
                              <span>{item.label}</span>
                              <strong>{item.count} leads</strong>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Top Products */}
                      <div>
                        <h4 style={{ fontSize: '13px', color: '#64748B', textTransform: 'uppercase', marginBottom: '12px' }}>Most Enquired Components:</h4>
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {(dashboardMetrics?.charts?.productDistribution || [
                            { label: 'SS 316L EP Sanitary Pipe', count: 28 },
                            { label: 'SS Sanitary 90° Bend', count: 19 },
                            { label: 'SS 316L Diaphragm Valve', count: 14 },
                            { label: 'SS Tri-Clamp Clamp', count: 11 }
                          ]).map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '6px', fontSize: '13px' }}>
                              <span>{item.label}</span>
                              <strong>{item.count} RFQs</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      
      {/* Formal Quotation Letterhead & Print Modal */}
      {selectedQuote && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', background: '#FFF', borderRadius: '12px', overflowY: 'auto', padding: '36px', boxShadow: '0 12px 32px rgba(0,0,0,0.2)' }}>
            {/* Action Bar */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="btn btn--primary btn--sm" onClick={() => window.print()}>
                  🖨️ Print / Save PDF
                </button>
                <button type="button" className="btn btn--secondary btn--sm" onClick={() => handleSendQuoteEmail(selectedQuote._id)}>
                  ✉️ Dispatch Email to Customer
                </button>
              </div>
              <button type="button" onClick={() => setSelectedQuote(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748B' }}>
                &times;
              </button>
            </div>

            {/* Official Letterhead */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #10263D', paddingBottom: '20px', marginBottom: '20px' }}>
              <div>
                <img src="/Lotus Tubes Logo.png" alt="Lotus Tubes" style={{ maxHeight: '48px', marginBottom: '8px' }} />
                <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                  <strong>LOTUS TUBES (LOTUS IMPEX)</strong><br />
                  Shop No. 9, Jain Bhavan CHSL, Dr Bhajekar Lane<br />
                  Khetwadi, Girgaon, Mumbai - 400004, Maharashtra, India<br />
                  Phone / WhatsApp: +91 99304 30789 | Email: chirag@lotustubes.com
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ margin: 0, color: '#10263D', fontSize: '1.5rem', letterSpacing: '1px' }}>PROFORMA QUOTATION</h2>
                <div style={{ marginTop: '8px', fontSize: '13px', color: '#334155' }}>
                  <strong>Quote Ref:</strong> <span style={{ color: '#0284C7', fontWeight: 'bold' }}>{selectedQuote.quotationNumber || selectedQuote.reference}</span><br />
                  <strong>Date:</strong> {new Date(selectedQuote.createdAt).toLocaleDateString()}<br />
                  <strong>Validity:</strong> {selectedQuote.validityDays || 15} Days<br />
                  <strong>Status:</strong> {selectedQuote.status || 'Draft'}
                </div>
              </div>
            </div>

            {/* Bill To & Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#F8FAFC', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '13px' }}>
              <div>
                <div style={{ color: '#64748B', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>QUOTATION FOR:</div>
                <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#10263D' }}>{selectedQuote.customerName}</div>
                <div style={{ color: '#334155', fontWeight: 500 }}>{selectedQuote.company}</div>
                <div style={{ color: '#64748B' }}>Email: {selectedQuote.email}</div>
                <div style={{ color: '#64748B' }}>Phone: {selectedQuote.phone}</div>
                {selectedQuote.shippingAddress && <div style={{ color: '#64748B' }}>Delivery Site: {selectedQuote.shippingAddress}</div>}
              </div>
              <div>
                <div style={{ color: '#64748B', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>COMMERCIAL TERMS:</div>
                <div><strong>Currency:</strong> {selectedQuote.currency || 'INR'}</div>
                <div><strong>Payment Terms:</strong> {selectedQuote.paymentTerms || '50% Advance, 50% against PI'}</div>
                <div><strong>Lead Time:</strong> {selectedQuote.leadTime || 'Ready Stock / 7-10 Working Days'}</div>
                <div><strong>Delivery Terms:</strong> {selectedQuote.deliveryTerms || 'Ex-Works Girgaon, Mumbai'}</div>
              </div>
            </div>

            {/* Line Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', marginBottom: '20px' }}>
              <thead>
                <tr style={{ background: '#10263D', color: '#FFF' }}>
                  <th style={{ padding: '10px' }}>#</th>
                  <th style={{ padding: '10px' }}>Item Description</th>
                  <th style={{ padding: '10px' }}>Grade</th>
                  <th style={{ padding: '10px' }}>Finish</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Qty</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Unit Price</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Total ({selectedQuote.currency || 'INR'})</th>
                </tr>
              </thead>
              <tbody>
                {(selectedQuote.lineItems || []).map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px', color: '#64748B' }}>{idx + 1}</td>
                    <td style={{ padding: '10px', fontWeight: 600 }}>{item.description}</td>
                    <td style={{ padding: '10px' }}>{item.grade || 'SS 316L'}</td>
                    <td style={{ padding: '10px' }}>{item.finish || 'EP'}</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>{item.quantity} {item.unit || 'Pcs'}</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>{Number(item.unitPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 600 }}>
                      {Number((item.quantity || 1) * (item.unitPrice || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Summary */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <div style={{ width: '300px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B' }}>Subtotal:</span>
                  <strong>{selectedQuote.currency || 'INR'} {Number(selectedQuote.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B' }}>GST (18%):</span>
                  <strong>{selectedQuote.currency || 'INR'} {Number(selectedQuote.taxTotal || (selectedQuote.subtotal * 0.18)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '15px', color: '#10263D', borderBottom: '2px solid #10263D' }}>
                  <span>Grand Total:</span>
                  <strong style={{ color: '#0284C7' }}>{selectedQuote.currency || 'INR'} {Number(selectedQuote.grandTotal || (selectedQuote.subtotal * 1.18)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                </div>
              </div>
            </div>

            {/* Quality Standard Disclaimer */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '6px', fontSize: '11px', color: '#64748B', lineHeight: '1.5' }}>
              <strong>Standard Technical Notes:</strong><br />
              1. All tubes and components are supplied with verified EN 10204 3.1 Mill Test Certificates (MTR).<br />
              2. Surface finish verified in accordance with ASME BPE / ASTM A270 standards (Ra &lt; 0.4µm for electropolished, Ra &lt; 0.8µm for mechanically polished).<br />
              3. Freight charges extra at actuals unless otherwise agreed in writing.
            </div>
          </div>
        </div>
      )}

      {/* Quote Builder Modal */}
      {showQuoteBuilder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '820px', maxHeight: '90vh', background: '#FFF', borderRadius: '12px', overflowY: 'auto', padding: '32px', boxShadow: '0 12px 32px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#0284C7', fontWeight: 700 }}>QUOTATION BUILDER</span>
                <h3 style={{ margin: 0, color: '#10263D', fontSize: '1.25rem' }}>Create Formal Priced Quotation</h3>
              </div>
              <button type="button" onClick={() => setShowQuoteBuilder(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748B' }}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitFormalQuote}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={quoteFormData.customerName}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, customerName: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Company Name *</label>
                  <input
                    type="text"
                    required
                    value={quoteFormData.company}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, company: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={quoteFormData.email}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, email: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={quoteFormData.phone}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, phone: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Line Items Builder */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#10263D' }}>Line Items</label>
                  <button type="button" className="btn btn--secondary btn--sm" onClick={handleAddLineItem}>
                    + Add Item
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '10px' }}>
                  {quoteFormData.lineItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 80px 100px 40px', gap: '8px', alignItems: 'center', background: '#F8FAFC', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                      <input
                        type="text"
                        placeholder="Description"
                        required
                        value={item.description}
                        onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                        style={{ padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                      />
                      <select
                        value={item.grade}
                        onChange={(e) => handleLineItemChange(idx, 'grade', e.target.value)}
                        style={{ padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                      >
                        <option value="SS 316L">SS 316L</option>
                        <option value="SS 304">SS 304</option>
                        <option value="SS 304L">SS 304L</option>
                      </select>
                      <select
                        value={item.finish}
                        onChange={(e) => handleLineItemChange(idx, 'finish', e.target.value)}
                        style={{ padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                      >
                        <option value="Electro Polished">Electro Polished</option>
                        <option value="Mechanically Polished">Mechanically Polished</option>
                        <option value="Mill Finish / Annealed">Mill Finish</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Qty"
                        min="1"
                        required
                        value={item.quantity}
                        onChange={(e) => handleLineItemChange(idx, 'quantity', e.target.value)}
                        style={{ padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                      />
                      <input
                        type="number"
                        placeholder="Unit Price"
                        min="0"
                        step="0.01"
                        required
                        value={item.unitPrice}
                        onChange={(e) => handleLineItemChange(idx, 'unitPrice', e.target.value)}
                        style={{ padding: '6px', fontSize: '12px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                      />
                      {quoteFormData.lineItems.length > 1 ? (
                        <button type="button" onClick={() => handleRemoveLineItem(idx)} style={{ background: '#FEE2E2', border: 'none', color: '#DC2626', borderRadius: '4px', height: '30px', cursor: 'pointer' }}>
                          &times;
                        </button>
                      ) : <div />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Commercial Terms */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Payment Terms</label>
                  <input
                    type="text"
                    value={quoteFormData.paymentTerms}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, paymentTerms: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Delivery Terms</label>
                  <input
                    type="text"
                    value={quoteFormData.deliveryTerms}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, deliveryTerms: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Calculated Totals Preview */}
              {(() => {
                const { subtotal, taxTotal, grandTotal } = calculateQuoteTotals(quoteFormData.lineItems);
                return (
                  <div style={{ background: '#F1F5F9', padding: '14px', borderRadius: '8px', marginBottom: '24px', textAlign: 'right', fontSize: '13px' }}>
                    <div>Subtotal: <strong>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></div>
                    <div>GST (18%): <strong>₹{taxTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></div>
                    <div style={{ fontSize: '16px', color: '#0284C7', fontWeight: 'bold', marginTop: '4px' }}>
                      Grand Total: ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                );
              })()}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn--outline-dark" onClick={() => setShowQuoteBuilder(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  💾 Save Formal Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slide-Over Modal: Detailed Enquiry Inspector */}
      {selectedEnquiry && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: '520px', background: '#FFF', height: '100%', padding: '28px', overflowY: 'auto', boxShadow: '-8px 0 24px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#0284C7', fontWeight: 700 }}>ENQUIRY INSPECTION</span>
                <h3 style={{ margin: '2px 0 0 0', color: '#10263D', fontSize: '1.25rem' }}>{selectedEnquiry.reference}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748B' }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'grid', gap: '14px', fontSize: '13px' }}>
              <div>
                <label style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase' }}>Customer &amp; Company</label>
                <div style={{ fontWeight: 600, fontSize: '15px', color: '#10263D' }}>{selectedEnquiry.name}</div>
                <div style={{ color: '#475569' }}>{selectedEnquiry.company} &bull; {selectedEnquiry.country || 'India'}</div>
              </div>

              <div>
                <label style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase' }}>Contact Information</label>
                <div>Email: <a href={`mailto:${selectedEnquiry.email}`} style={{ color: '#0284C7' }}>{selectedEnquiry.email}</a></div>
                <div>Phone: <a href={`tel:${selectedEnquiry.phone}`} style={{ color: '#0284C7' }}>{selectedEnquiry.phone}</a></div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase' }}>Requested Component</label>
                <div style={{ fontWeight: 600, color: '#10263D', marginTop: '2px' }}>{selectedEnquiry.productName}</div>
                <div style={{ color: '#64748B', marginTop: '4px' }}>
                  Grade: <strong>{selectedEnquiry.grade || 'SS 316L'}</strong> &bull; Quantity: <strong>{selectedEnquiry.quantity}</strong>
                </div>
                {selectedEnquiry.location && <div>Destination: {selectedEnquiry.location}</div>}
                {selectedEnquiry.notes && (
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #CBD5E1', fontStyle: 'italic' }}>
                    "{selectedEnquiry.notes}"
                  </div>
                )}
              </div>

              <div>
                <label style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase' }}>Lead Pipeline Status</label>
                <select
                  value={selectedEnquiry.status || 'New'}
                  onChange={(e) => handleStatusChange(selectedEnquiry._id, e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', marginTop: '4px', fontWeight: 600 }}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quotation Sent">Quotation Sent</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Order Confirmed">Order Confirmed</option>
                  <option value="Lost">Lost</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              {/* Direct WhatsApp Contact CTA */}
              <a
                href={`https://wa.me/${selectedEnquiry.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${selectedEnquiry.name}, thank you for contacting Lotus Tubes regarding ${selectedEnquiry.productName} (Ref: ${selectedEnquiry.reference}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--whatsapp btn--block"
                style={{ textAlign: 'center', marginTop: '8px' }}
              >
                💬 Open WhatsApp Chat with Client
              </a>
              <button type="button" className="btn btn--primary btn--block" style={{ textAlign: 'center', marginTop: '10px' }} onClick={() => { setSelectedEnquiry(null); handleOpenQuoteBuilder(selectedEnquiry); }}>📄 Generate Formal Quotation for this RFQ</button>

              {/* Internal Notes History */}
              <div style={{ marginTop: '16px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#10263D' }}>Activity &amp; Internal Notes</h4>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="Log sales activity or call note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    style={{ flex: 1, padding: '6px 10px', fontSize: '12px', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                  />
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    onClick={() => handleAddNote(selectedEnquiry._id)}
                  >
                    Add
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                  {(selectedEnquiry.activityHistory || []).slice().reverse().map((act, i) => (
                    <div key={i} style={{ background: '#F8FAFC', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontWeight: 600, color: '#10263D' }}>{act.action}: {act.note}</div>
                      <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>
                        By {act.performedBy} &bull; {new Date(act.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMView;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Loader } from '../../components/common/Loader';
import './crm.css';

// CRM Components
import { CRMIcon } from './components/CRMIcon';
import { CRMSidebar } from './components/CRMSidebar';
import { CRMHeader } from './components/CRMHeader';

// CRM Views
import { CRMDashboardView } from './views/CRMDashboardView';
import { CRMEnquiriesView } from './views/CRMEnquiriesView';
import { CRMQuotationsView } from './views/CRMQuotationsView';
import { CRMCustomersView } from './views/CRMCustomersView';
import { CRMTasksView } from './views/CRMTasksView';
import { CRMProductsView } from './views/CRMProductsView';
import { CRMStaffView } from './views/CRMStaffView';
import { CRMReportsView } from './views/CRMReportsView';
import { CRMSeoView } from './views/CRMSeoView';
import { NewStaffModal } from './components/NewStaffModal';

export const CRMView = ({ subroute = 'dashboard', onNotify, onOpenQuickEnquiry }) => {
  const { user, loginStaff, loginCustomer, registerCustomer, logout, isStaff } = useAuth();

  // Auth Form State (for login fallback)
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

  // Shell Layout State - Single source of truth for Pinned & Hover expansion
  const [sidebarPinned, setSidebarPinned] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(subroute || 'dashboard');

  // Sidebar is expanded if pinned OR temporarily hovered on desktop
  const isSidebarExpanded = sidebarPinned || sidebarHovered;

  // Modals & Active Edit State
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [newNote, setNewNote] = useState('');

  const isSuperAdmin = user?.role === 'admin';

  // Sync activeTab with subroute prop
  useEffect(() => {
    if (subroute && subroute !== 'login') {
      setActiveTab(subroute);
    }
  }, [subroute]);

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

  // Export Enquiries to CSV
  const handleExportCSV = () => {
    if (!enquiries.length) {
      if (onNotify) onNotify('No records available to export', 'info');
      return;
    }
    const headers = ['Reference', 'Date', 'Customer', 'Company', 'Email', 'Phone', 'Product', 'Grade', 'Qty', 'Location', 'Status'];
    const rows = enquiries.map((e) => [
      `"${e.reference || ''}"`,
      `"${new Date(e.createdAt || Date.now()).toLocaleDateString()}"`,
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

  // Staff Appointment Handler
  const handleCreateStaff = async (staffData) => {
    try {
      if (onNotify) onNotify('Appointing staff member...', 'info');
      const res = await apiService.createStaffUser(staffData);
      if (res.success) {
        if (onNotify) onNotify(`Staff member ${staffData.name} appointed successfully!`, 'success');
        loadOperationalData();
        return res.data;
      } else {
        throw new Error(res.error || 'Failed to appoint staff member');
      }
    } catch (err) {
      if (onNotify) onNotify(err.message, 'danger');
      throw err;
    }
  };

  // Submit Quotation for Approval (Draft / Changes Requested -> Pending Approval)
  const handleSubmitQuoteForApproval = async (quoteId) => {
    try {
      if (onNotify) onNotify('Submitting quotation for Super Admin approval...', 'info');
      const res = await apiService.submitQuoteForApproval(quoteId);
      if (res.success) {
        if (onNotify) onNotify('Quotation submitted for Super Admin approval successfully!', 'success');
        if (selectedQuote && selectedQuote._id === quoteId) {
          setSelectedQuote(res.data);
        }
        loadOperationalData();
      } else {
        if (onNotify) onNotify(res.error || 'Failed to submit quote for approval', 'danger');
      }
    } catch (err) {
      if (onNotify) onNotify('Error submitting quote for approval: ' + err.message, 'danger');
    }
  };

  // Authorize & Approve Quotation (Super Admin Only)
  const handleApproveQuote = async (quoteId) => {
    try {
      if (onNotify) onNotify('Validating and granting Super Admin approval...', 'info');
      const res = await apiService.approveQuote(quoteId);
      if (res.success) {
        if (onNotify) onNotify('Quotation authorized & approved! Cryptographic integrity hash generated.', 'success');
        if (selectedQuote && selectedQuote._id === quoteId) {
          setSelectedQuote(res.data);
        }
        loadOperationalData();
      } else {
        if (onNotify) onNotify(res.error || 'Approval failed', 'danger');
      }
    } catch (err) {
      if (onNotify) onNotify('Error approving quote: ' + err.message, 'danger');
    }
  };

  // Request Changes on Quotation
  const handleRequestChangesQuote = async (quoteId, notes) => {
    try {
      if (onNotify) onNotify('Recording changes request...', 'info');
      const res = await apiService.requestChangesQuote(quoteId, notes);
      if (res.success) {
        if (onNotify) onNotify('Changes requested and recorded on quotation.', 'info');
        if (selectedQuote && selectedQuote._id === quoteId) {
          setSelectedQuote(res.data);
        }
        loadOperationalData();
      } else {
        if (onNotify) onNotify(res.error || 'Failed to request changes', 'danger');
      }
    } catch (err) {
      if (onNotify) onNotify('Error requesting changes: ' + err.message, 'danger');
    }
  };

  // Reject Quotation
  const handleRejectQuote = async (quoteId, reason) => {
    try {
      if (onNotify) onNotify('Rejecting quotation...', 'info');
      const res = await apiService.rejectQuote(quoteId, reason);
      if (res.success) {
        if (onNotify) onNotify('Quotation marked as Rejected.', 'info');
        if (selectedQuote && selectedQuote._id === quoteId) {
          setSelectedQuote(res.data);
        }
        loadOperationalData();
      } else {
        if (onNotify) onNotify(res.error || 'Failed to reject quote', 'danger');
      }
    } catch (err) {
      if (onNotify) onNotify('Error rejecting quote: ' + err.message, 'danger');
    }
  };

  // Dispatch Quotation Email (Mandatory Super Admin Approval Enforced)
  const handleSendQuoteEmail = async (quoteId) => {
    try {
      const targetQuote = quotations.find((q) => q._id === quoteId) || selectedQuote;
      if (targetQuote && targetQuote.status !== 'Approved') {
        if (onNotify) onNotify('Dispatch blocked: This quotation requires explicit Super Admin approval before customer dispatch.', 'danger');
        return;
      }
      if (onNotify) onNotify('Dispatching formal quotation email...', 'info');
      const res = await apiService.sendQuoteEmail(quoteId);
      if (res.success) {
        if (onNotify) onNotify('Quotation email dispatched to customer successfully!', 'success');
        loadOperationalData();
      } else {
        if (onNotify) onNotify(res.error || 'Failed to dispatch quotation email', 'danger');
      }
    } catch (err) {
      if (onNotify) onNotify('Failed to dispatch quote email: ' + err.message, 'danger');
    }
  };

  // Update Task Completion
  const handleUpdateTask = async (taskId, updates) => {
    try {
      const res = await apiService.updateTask(taskId, updates);
      if (res.success) {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, ...updates } : t)));
        if (onNotify) onNotify('Task updated', 'success');
      }
    } catch (err) {
      if (onNotify) onNotify('Failed to update task', 'danger');
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
      <div className="crm-login-wrapper">
        <div className="crm-login-box">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img src="/Lotus Tubes Logo.png" alt="Lotus Tubes" style={{ maxHeight: '44px', margin: '0 auto 12px auto' }} />
            <h3 style={{ color: 'var(--crm-navy-dark)', fontSize: '1.35rem', marginBottom: '4px' }}>
              Lotus Tubes Secure Portal
            </h3>
            <p style={{ color: 'var(--crm-text-muted)', fontSize: '13px' }}>
              Select your role to access your account or internal sales workspace
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
                color: authMode === 'customer' ? 'var(--crm-navy-dark)' : '#64748B',
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
                color: authMode === 'staff' ? 'var(--crm-navy-dark)' : '#64748B',
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
                <div className="crm-form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                  />
                </div>
                <div className="crm-form-group">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    required
                    value={authCompany}
                    onChange={(e) => setAuthCompany(e.target.value)}
                    placeholder="e.g. BioPharma Process Ltd"
                  />
                </div>
                <div className="crm-form-group">
                  <label>Phone / WhatsApp Number *</label>
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

            <div className="crm-form-group">
              <label>
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

            <div className="crm-form-group">
              <label>Password *</label>
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
              className="crm-btn crm-btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '12px', justifyContent: 'center' }}
              disabled={authLoading}
            >
              {authLoading ? (
                <Loader variant="button" size="sm" color="#FFFFFF" label="Verifying credentials..." />
              ) : authMode === 'staff' ? (
                'Sign In to Staff Workspace →'
              ) : customerIsRegistering ? (
                'Create Customer Account →'
              ) : (
                'Sign In to Customer Account →'
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
                    style={{ background: 'none', border: 'none', color: 'var(--crm-blue)', fontWeight: 600, cursor: 'pointer' }}
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
                    style={{ background: 'none', border: 'none', color: 'var(--crm-blue)', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E3E8EF' }}>
            <a href="#home" style={{ fontSize: '13px', color: '#667085', textDecoration: 'none' }}>
              ← Return to Public Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Active subview selector
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <CRMDashboardView
            enquiries={enquiries}
            quotations={quotations}
            tasks={tasks}
            customers={customers}
            dashboardMetrics={dashboardMetrics}
            searchQuery={searchQuery}
            onSelectEnquiry={setSelectedEnquiry}
            onSelectQuote={setSelectedQuote}
            onOpenQuoteBuilder={handleOpenQuoteBuilder}
            onOpenQuickEnquiry={onOpenQuickEnquiry}
            onNavigateTab={setActiveTab}
          />
        );
      case 'enquiries':
        return (
          <CRMEnquiriesView
            enquiries={enquiries}
            searchQuery={searchQuery}
            onSelectEnquiry={setSelectedEnquiry}
            onStatusChange={handleStatusChange}
            onOpenQuoteBuilder={handleOpenQuoteBuilder}
            onOpenQuickEnquiry={onOpenQuickEnquiry}
            onExportCSV={handleExportCSV}
          />
        );
      case 'quotations':
        return (
          <CRMQuotationsView
            quotations={quotations}
            searchQuery={searchQuery}
            user={user}
            isSuperAdmin={isSuperAdmin}
            onSelectQuote={setSelectedQuote}
            onSendQuoteEmail={handleSendQuoteEmail}
            onOpenQuoteBuilder={handleOpenQuoteBuilder}
            onSubmitForApproval={handleSubmitQuoteForApproval}
            onApproveQuote={handleApproveQuote}
            onRequestChangesQuote={handleRequestChangesQuote}
            onRejectQuote={handleRejectQuote}
          />
        );
      case 'customers':
        return (
          <CRMCustomersView
            customers={customers}
            searchQuery={searchQuery}
            onOpenQuickEnquiry={onOpenQuickEnquiry}
          />
        );
      case 'tasks':
        return (
          <CRMTasksView
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
          />
        );
      case 'products':
        return (
          <CRMProductsView
            products={productsList}
            searchQuery={searchQuery}
          />
        );
      case 'staff':
        return (
          <CRMStaffView
            staffUsers={staffUsers}
            isSuperAdmin={isSuperAdmin}
            onOpenStaffAppointment={() => setShowStaffModal(true)}
          />
        );
      case 'reports':
        return (
          <CRMReportsView
            enquiries={enquiries}
            quotations={quotations}
            dashboardMetrics={dashboardMetrics}
            onExportCSV={handleExportCSV}
          />
        );
      case 'seo':
        return (
          <CRMSeoView
            isSuperAdmin={isSuperAdmin}
            onNotify={onNotify}
          />
        );
      default:
        return (
          <CRMDashboardView
            enquiries={enquiries}
            quotations={quotations}
            tasks={tasks}
            customers={customers}
            dashboardMetrics={dashboardMetrics}
            searchQuery={searchQuery}
            isSuperAdmin={isSuperAdmin}
            onSelectEnquiry={setSelectedEnquiry}
            onSelectQuote={setSelectedQuote}
            onOpenQuoteBuilder={handleOpenQuoteBuilder}
            onOpenQuickEnquiry={onOpenQuickEnquiry}
            onNavigateTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div
      className={`crm-layout crm-shell ${isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}
      id="crm-shell"
    >
      {/* 1. Collapsible & Responsive Navigation Sidebar */}
      <CRMSidebar
        currentRoute={activeTab}
        onRouteChange={(route) => {
          setActiveTab(route);
          window.location.hash = `#crm/${route}`;
        }}
        enquiryCount={enquiries.filter((e) => e.status === 'New').length}
        quoteCount={quotations.filter((q) => q.status === 'Draft' || q.status === 'Sent').length}
        pendingTaskCount={tasks.filter((t) => !t.completed).length}
        user={user}
        isSuperAdmin={isSuperAdmin}
        isExpanded={isSidebarExpanded}
        isPinned={sidebarPinned}
        onTogglePin={() => {
          setSidebarPinned((prev) => !prev);
          setSidebarHovered(false);
        }}
        onMouseEnter={() => {
          if (!sidebarPinned && typeof window !== 'undefined' && window.innerWidth > 768) {
            setSidebarHovered(true);
          }
        }}
        onMouseLeave={() => {
          if (!sidebarPinned) {
            setSidebarHovered(false);
          }
        }}
        collapsed={!isSidebarExpanded}
        onToggleCollapse={() => {
          setSidebarPinned((prev) => !prev);
          setSidebarHovered(false);
        }}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* 2. Main Operational Container with Strict Layout Containment */}
      <div className="crm-main-container">
        {/* Top Header Bar */}
        <CRMHeader
          currentRoute={activeTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenQuickEnquiry={onOpenQuickEnquiry}
          onOpenQuoteBuilder={handleOpenQuoteBuilder}
          onOpenStaffAppointment={() => setShowStaffModal(true)}
          onExportCSV={handleExportCSV}
          onToggleMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          user={user}
        />

        {/* Content Body */}
        <main className="crm-content crm-body-scroll" role="main">
          {dataLoading ? (
            <div className="crm-loading-container">
              <Loader variant="block" size="md" label="Loading real database records from MongoDB..." />
            </div>
          ) : (
            renderActiveView()
          )}
        </main>
      </div>

      {/* 3. Slide-Over Drawer: Enquiry Inspector & Activity Feed */}
      {selectedEnquiry && (
        <div
          className="crm-drawer-backdrop visible"
          onClick={() => setSelectedEnquiry(null)}
          aria-hidden="true"
        >
          <div
            className="crm-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Enquiry Inspection"
          >
            <div className="crm-drawer__header">
              <div>
                <span className="crm-drawer__subtitle">ENQUIRY INSPECTION</span>
                <h3 className="crm-drawer__title">{selectedEnquiry.reference}</h3>
              </div>
              <button
                type="button"
                className="crm-modal-close"
                onClick={() => setSelectedEnquiry(null)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="crm-drawer__body">
              {/* Customer Info Card */}
              <div className="crm-drawer-card">
                <div className="crm-drawer-card__header">
                  <CRMIcon name="user" size={14} />
                  <span>Customer & Company</span>
                </div>
                <div className="crm-drawer-card__content">
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#10263D' }}>
                    {selectedEnquiry.name}
                  </div>
                  <div style={{ color: '#475569', marginTop: '2px' }}>
                    {selectedEnquiry.company || 'Direct Buyer'} • {selectedEnquiry.country || selectedEnquiry.location || 'India'}
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '13px' }}>
                    <div>
                      Email: <a href={`mailto:${selectedEnquiry.email}`} className="crm-ref-link">{selectedEnquiry.email}</a>
                    </div>
                    <div>
                      Phone: <a href={`tel:${selectedEnquiry.phone}`} className="crm-ref-link">{selectedEnquiry.phone}</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Component Specifications */}
              <div className="crm-drawer-card">
                <div className="crm-drawer-card__header">
                  <CRMIcon name="products" size={14} />
                  <span>Requested Component & Specs</span>
                </div>
                <div className="crm-drawer-card__content">
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#10263D' }}>
                    {selectedEnquiry.productName}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px', fontSize: '12px' }}>
                    <div>Grade: <strong>{selectedEnquiry.grade || 'SS 316L'}</strong></div>
                    <div>Quantity: <strong>{selectedEnquiry.quantity || '—'}</strong></div>
                    {selectedEnquiry.finish && <div>Finish: <strong>{selectedEnquiry.finish}</strong></div>}
                    {selectedEnquiry.size && <div>Size: <strong>{selectedEnquiry.size}</strong></div>}
                  </div>
                  {selectedEnquiry.notes && (
                    <div style={{ marginTop: '10px', padding: '8px', background: '#F8FAFC', borderRadius: '4px', fontSize: '12px', fontStyle: 'italic', color: '#475569' }}>
                      "{selectedEnquiry.notes}"
                    </div>
                  )}
                </div>
              </div>

              {/* Status Selector */}
              <div className="crm-drawer-card">
                <div className="crm-drawer-card__header">
                  <CRMIcon name="reports" size={14} />
                  <span>Lead Pipeline Status</span>
                </div>
                <div className="crm-drawer-card__content">
                  <select
                    className="crm-select-status"
                    style={{ width: '100%', padding: '8px', fontSize: '13px' }}
                    value={selectedEnquiry.status || 'New'}
                    onChange={(e) => handleStatusChange(selectedEnquiry._id, e.target.value)}
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
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gap: '10px' }}>
                <a
                  href={`https://wa.me/${selectedEnquiry.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedEnquiry.name}, thank you for contacting Lotus Tubes regarding ${selectedEnquiry.productName} (Ref: ${selectedEnquiry.reference}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="crm-btn crm-btn-whatsapp"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <CRMIcon name="whatsapp" size={16} />
                  <span>Open WhatsApp Chat with Client</span>
                </a>

                <button
                  type="button"
                  className="crm-btn crm-btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    const eq = selectedEnquiry;
                    setSelectedEnquiry(null);
                    handleOpenQuoteBuilder(eq);
                  }}
                >
                  <CRMIcon name="quotations" size={16} />
                  <span>Generate Formal Quotation for this RFQ</span>
                </button>
              </div>

              {/* Activity & Internal Notes Log */}
              <div className="crm-drawer-card" style={{ marginTop: '16px' }}>
                <div className="crm-drawer-card__header">
                  <CRMIcon name="tasks" size={14} />
                  <span>Activity History & Internal Notes</span>
                </div>
                <div className="crm-drawer-card__content">
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <input
                      type="text"
                      className="crm-input-sm"
                      placeholder="Add note or call summary..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      style={{ flex: 1, padding: '6px 10px', fontSize: '12px' }}
                    />
                    <button
                      type="button"
                      className="crm-btn crm-btn-sm crm-btn-secondary"
                      onClick={() => handleAddNote(selectedEnquiry._id)}
                    >
                      Add Note
                    </button>
                  </div>

                  <div style={{ display: 'grid', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                    {(selectedEnquiry.activityHistory || []).slice().reverse().map((act, i) => (
                      <div key={i} style={{ background: '#F8FAFC', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontWeight: 600, color: '#10263D' }}>{act.action}: {act.note}</div>
                        <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>
                          By {act.performedBy} • {new Date(act.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Formal Quotation Letterhead & Print Modal */}
      {selectedQuote && (
        <div
          className="crm-modal-backdrop visible"
          onClick={() => setSelectedQuote(null)}
          aria-hidden="true"
        >
          <div
            className="crm-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Formal Quotation"
          >
            {/* Modal Actions */}
            <div className="crm-modal-actions no-print">
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="crm-btn crm-btn-primary crm-btn-sm"
                  onClick={() => window.print()}
                >
                  <CRMIcon name="print" size={14} />
                  <span>Print / Save PDF</span>
                </button>

                {/* Email Dispatch Button: Strictly Enabled ONLY when Approved */}
                {selectedQuote.status === 'Approved' ? (
                  <button
                    type="button"
                    className="crm-btn crm-btn-primary crm-btn-sm"
                    onClick={() => handleSendQuoteEmail(selectedQuote._id)}
                    style={{ background: '#059669', borderColor: '#059669' }}
                    title="Dispatch official approved quotation to customer email"
                  >
                    <CRMIcon name="mail" size={14} />
                    <span>✓ Dispatch Approved Email</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="crm-btn crm-btn-secondary crm-btn-sm"
                    disabled
                    title="Quotation must be Approved by Super Admin before customer dispatch"
                    style={{ opacity: 0.5, cursor: 'not-allowed', background: '#94A3B8', borderColor: '#94A3B8' }}
                  >
                    <CRMIcon name="lock" size={14} />
                    <span>Email Locked (Approval Required)</span>
                  </button>
                )}

                {/* Super Admin Approval Actions */}
                {isSuperAdmin && selectedQuote.status === 'Pending Approval' && (
                  <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                    <button
                      type="button"
                      className="crm-btn crm-btn-sm"
                      onClick={() => handleApproveQuote(selectedQuote._id)}
                      style={{ background: '#059669', color: '#FFF', fontWeight: 600 }}
                      title="Authorize and approve commercial quotation"
                    >
                      ✓ Authorize & Approve
                    </button>
                    <button
                      type="button"
                      className="crm-btn crm-btn-sm crm-btn-outline"
                      onClick={() => {
                        const notes = window.prompt('Specify changes required for this quotation:');
                        if (notes && notes.trim()) handleRequestChangesQuote(selectedQuote._id, notes.trim());
                      }}
                      style={{ color: '#D97706', borderColor: '#D97706' }}
                      title="Request modifications from sales staff"
                    >
                      📝 Request Changes
                    </button>
                    <button
                      type="button"
                      className="crm-btn crm-btn-sm crm-btn-outline"
                      onClick={() => {
                        const reason = window.prompt('Specify reason for rejecting this quotation:');
                        if (reason && reason.trim()) handleRejectQuote(selectedQuote._id, reason.trim());
                      }}
                      style={{ color: '#DC2626', borderColor: '#DC2626' }}
                      title="Reject quotation"
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}

                {/* Staff / Admin Submit for Approval (Draft or Changes Requested) */}
                {(selectedQuote.status === 'Draft' || selectedQuote.status === 'Changes Requested') && (
                  <button
                    type="button"
                    className="crm-btn crm-btn-primary crm-btn-sm"
                    onClick={() => handleSubmitQuoteForApproval(selectedQuote._id)}
                    style={{ marginLeft: 'auto', background: '#0284C7', borderColor: '#0284C7' }}
                  >
                    <CRMIcon name="check" size={14} />
                    <span>Submit for Super Admin Approval</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                className="crm-modal-close"
                onClick={() => setSelectedQuote(null)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Super Admin Approval Status Banner */}
            <div className="no-print" style={{ margin: '14px 24px 0 24px' }}>
              {selectedQuote.status === 'Approved' && (
                <div style={{ padding: '12px 16px', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', color: '#065F46', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>🛡️</span>
                    <div>
                      <strong>Super Admin Authorized:</strong> Approved by <u>{selectedQuote.approvedByName || 'Chirag Shah'}</u> on {selectedQuote.approvedAt ? new Date(selectedQuote.approvedAt).toLocaleString() : 'Recently'}.
                      {selectedQuote.approvalHash && (
                        <div style={{ fontSize: '11px', color: '#047857', fontFamily: 'monospace', marginTop: '2px' }}>
                          SHA-256 Integrity Hash: {selectedQuote.approvalHash}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="crm-badge crm-badge-green" style={{ fontSize: '12px', padding: '4px 10px' }}>
                    Ready for Customer Dispatch
                  </span>
                </div>
              )}

              {selectedQuote.status === 'Pending Approval' && (
                <div style={{ padding: '12px 16px', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '8px', color: '#92400E', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>⏳</span>
                    <div>
                      <strong>Awaiting Super Admin Authorization:</strong> Commercial quotation submitted {selectedQuote.submittedBy ? `by ${selectedQuote.submittedBy}` : ''}.
                      <div style={{ fontSize: '11px', color: '#B45309', marginTop: '2px' }}>
                        Customer dispatch and official PDF generation are locked until explicitly authorized by Super Admin.
                      </div>
                    </div>
                  </div>
                  <span className="crm-badge crm-badge-amber" style={{ fontSize: '12px', padding: '4px 10px' }}>
                    Pending Approval
                  </span>
                </div>
              )}

              {selectedQuote.status === 'Changes Requested' && (
                <div style={{ padding: '12px 16px', background: '#FDF4FF', border: '1px solid #F5D0FE', borderRadius: '8px', color: '#86198F', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '18px' }}>📝</span>
                    <strong>Changes Requested by Super Admin:</strong>
                  </div>
                  <div style={{ background: '#FFFFFF', padding: '8px 12px', borderRadius: '6px', border: '1px solid #F0ABFC', color: '#701A75', marginTop: '4px' }}>
                    {selectedQuote.changesRequestedNotes || 'Please adjust specifications and pricing before re-submitting.'}
                  </div>
                </div>
              )}

              {selectedQuote.status === 'Rejected' && (
                <div style={{ padding: '12px 16px', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '8px', color: '#991B1B', fontSize: '13px' }}>
                  <strong>✕ Quotation Rejected:</strong> {selectedQuote.rejectionReason || 'Commercial terms not approved.'}
                </div>
              )}

              {selectedQuote.status === 'Draft' && (
                <div style={{ padding: '10px 16px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#475569', fontSize: '12.5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>ℹ️ <strong>Draft Proforma Quotation:</strong> Review line items, calculate totals, and submit for Super Admin approval before customer dispatch.</span>
                  <span className="crm-badge crm-badge-gray">Draft</span>
                </div>
              )}
            </div>

            {/* Official Letterhead Printable Container */}
            <div className="crm-letterhead-container">
              {/* Top Letterhead Bar */}
              <div className="crm-letterhead-header">
                <div>
                  <img
                    src="/Lotus Tubes Logo.png"
                    alt="Lotus Tubes"
                    style={{ maxHeight: '46px', marginBottom: '8px' }}
                  />
                  <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                    <strong>LOTUS TUBES (LOTUS IMPEX)</strong><br />
                    Shop No. 9, Jain Bhavan CHSL, Dr Bhajekar Lane<br />
                    Khetwadi, Girgaon, Mumbai - 400004, Maharashtra, India<br />
                    Phone / WhatsApp: +91 98205 25200 | Email: sales@lotustubes.com
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h2 style={{ margin: 0, color: 'var(--crm-navy-dark)', fontSize: '1.4rem', letterSpacing: '1px' }}>
                    PROFORMA QUOTATION
                  </h2>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#334155' }}>
                    <strong>Quote Ref:</strong> <span style={{ color: 'var(--crm-blue)', fontWeight: 'bold' }}>{selectedQuote.quotationNumber || selectedQuote.reference}</span><br />
                    <strong>Date:</strong> {new Date(selectedQuote.createdAt || Date.now()).toLocaleDateString()}<br />
                    <strong>Validity:</strong> {selectedQuote.validityDays || 15} Days<br />
                    <strong>Status:</strong> {selectedQuote.status || 'Draft'}
                  </div>
                </div>
              </div>

              {/* Bill To & Terms Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#F8FAFC', padding: '16px', borderRadius: '8px', marginBottom: '20px', fontSize: '12px' }}>
                <div>
                  <div style={{ color: '#64748B', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>QUOTATION FOR:</div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#10263D' }}>{selectedQuote.customerName}</div>
                  <div style={{ color: '#334155', fontWeight: 500 }}>{selectedQuote.company}</div>
                  <div style={{ color: '#64748B' }}>Email: {selectedQuote.email}</div>
                  <div style={{ color: '#64748B' }}>Phone: {selectedQuote.phone}</div>
                  {selectedQuote.shippingAddress && <div style={{ color: '#64748B' }}>Delivery: {selectedQuote.shippingAddress}</div>}
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
              <table className="crm-table" style={{ marginBottom: '20px', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#10263D', color: '#FFF' }}>
                    <th style={{ color: '#FFF' }}>#</th>
                    <th style={{ color: '#FFF' }}>Item Description</th>
                    <th style={{ color: '#FFF' }}>Grade</th>
                    <th style={{ color: '#FFF' }}>Finish</th>
                    <th style={{ color: '#FFF', textAlign: 'right' }}>Qty</th>
                    <th style={{ color: '#FFF', textAlign: 'right' }}>Unit Price</th>
                    <th style={{ color: '#FFF', textAlign: 'right' }}>Total ({selectedQuote.currency || 'INR'})</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedQuote.lineItems || []).map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td><strong>{item.description}</strong></td>
                      <td>{item.grade || 'SS 316L'}</td>
                      <td>{item.finish || 'EP'}</td>
                      <td style={{ textAlign: 'right' }}>{item.quantity} {item.unit || 'Pcs'}</td>
                      <td style={{ textAlign: 'right' }}>{Number(item.unitPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        {Number((item.quantity || 1) * (item.unitPrice || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary Totals */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <div style={{ width: '280px', fontSize: '13px' }}>
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
                    <strong style={{ color: 'var(--crm-blue)' }}>
                      {selectedQuote.currency || 'INR'} {Number(selectedQuote.grandTotal || (selectedQuote.subtotal * 1.18)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Standards Disclaimer */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px', borderRadius: '6px', fontSize: '11px', color: '#64748B', lineHeight: '1.5' }}>
                <strong>Standard Quality & Compliance Notes:</strong><br />
                1. Supplied with verified EN 10204 3.1 Mill Test Certificates (MTR).<br />
                2. Surface finish in strict accordance with ASME BPE / ASTM A270 standards (Ra &lt; 0.4µm electropolished).<br />
                3. Freight charges extra at actuals unless otherwise confirmed in writing.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Quote Builder Modal */}
      {showQuoteBuilder && (
        <div
          className="crm-modal-backdrop visible"
          onClick={() => setShowQuoteBuilder(false)}
          aria-hidden="true"
        >
          <div
            className="crm-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Create Formal Quotation"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--crm-blue)', fontWeight: 700 }}>QUOTATION BUILDER</span>
                <h3 style={{ margin: 0, color: '#10263D', fontSize: '1.25rem' }}>Create Formal Priced Quotation</h3>
              </div>
              <button
                type="button"
                className="crm-modal-close"
                onClick={() => setShowQuoteBuilder(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitFormalQuote}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                <div className="crm-form-group">
                  <label>Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={quoteFormData.customerName}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, customerName: e.target.value })}
                  />
                </div>
                <div className="crm-form-group">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    required
                    value={quoteFormData.company}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, company: e.target.value })}
                  />
                </div>
                <div className="crm-form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={quoteFormData.email}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, email: e.target.value })}
                  />
                </div>
                <div className="crm-form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={quoteFormData.phone}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Line Items Builder */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#10263D' }}>BOQ Line Items</label>
                  <button type="button" className="crm-btn crm-btn-secondary crm-btn-sm" onClick={handleAddLineItem}>
                    + Add Item
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '8px' }}>
                  {quoteFormData.lineItems.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 70px 90px 36px',
                        gap: '8px',
                        alignItems: 'center',
                        background: '#F8FAFC',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0'
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Description"
                        required
                        value={item.description}
                        onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                        style={{ padding: '6px 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                      />
                      <select
                        value={item.grade}
                        onChange={(e) => handleLineItemChange(idx, 'grade', e.target.value)}
                        style={{ padding: '6px 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                      >
                        <option value="SS 316L">SS 316L</option>
                        <option value="SS 304">SS 304</option>
                        <option value="SS 304L">SS 304L</option>
                      </select>
                      <select
                        value={item.finish}
                        onChange={(e) => handleLineItemChange(idx, 'finish', e.target.value)}
                        style={{ padding: '6px 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
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
                        style={{ padding: '6px 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                      />
                      <input
                        type="number"
                        placeholder="Unit Price"
                        min="0"
                        step="0.01"
                        required
                        value={item.unitPrice}
                        onChange={(e) => handleLineItemChange(idx, 'unitPrice', e.target.value)}
                        style={{ padding: '6px 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                      />
                      {quoteFormData.lineItems.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(idx)}
                          style={{ background: '#FEE2E2', border: 'none', color: '#DC2626', borderRadius: '4px', height: '30px', cursor: 'pointer' }}
                        >
                          &times;
                        </button>
                      ) : <div />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Commercial Terms */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div className="crm-form-group">
                  <label>Payment Terms</label>
                  <input
                    type="text"
                    value={quoteFormData.paymentTerms}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, paymentTerms: e.target.value })}
                  />
                </div>
                <div className="crm-form-group">
                  <label>Delivery Terms</label>
                  <input
                    type="text"
                    value={quoteFormData.deliveryTerms}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, deliveryTerms: e.target.value })}
                  />
                </div>
              </div>

              {/* Totals Preview */}
              {(() => {
                const { subtotal, taxTotal, grandTotal } = calculateQuoteTotals(quoteFormData.lineItems);
                return (
                  <div style={{ background: '#F1F5F9', padding: '14px', borderRadius: '8px', marginBottom: '20px', textAlign: 'right', fontSize: '13px' }}>
                    <div>Subtotal: <strong>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></div>
                    <div>GST (18%): <strong>₹{taxTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></div>
                    <div style={{ fontSize: '16px', color: 'var(--crm-blue)', fontWeight: 'bold', marginTop: '4px' }}>
                      Grand Total: ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                );
              })()}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="crm-btn crm-btn-outline"
                  onClick={() => setShowQuoteBuilder(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="crm-btn crm-btn-primary">
                  💾 Save Formal Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. New Staff Appointment Modal (Super Admin Exclusive) */}
      <NewStaffModal
        isOpen={showStaffModal}
        onClose={() => setShowStaffModal(false)}
        onStaffCreated={handleCreateStaff}
      />
    </div>
  );
};

export default CRMView;

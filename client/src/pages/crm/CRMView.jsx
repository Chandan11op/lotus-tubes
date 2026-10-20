import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Loader } from '../../components/common/Loader';

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

  // CRM Operational Data State (Real Database Records)
  const [enquiries, setEnquiries] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch real records when staff is authenticated
  const loadOperationalData = async () => {
    setDataLoading(true);
    try {
      const [enqRes, quoteRes] = await Promise.all([
        apiService.getEnquiries(),
        apiService.getQuotes()
      ]);
      setEnquiries(enqRes.data || []);
      setQuotations(quoteRes.data || []);
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
  }, [isStaff, subroute]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authMode === 'staff') {
        const res = await loginStaff({ email: authEmail, password: authPassword });
        if (res.success) {
          if (onNotify) onNotify(`Welcome back, ${res.user.name}!`, 'success');
          window.location.hash = '#crm/dashboard';
        } else {
          setAuthError(res.error || 'Invalid staff credentials');
        }
      } else {
        // Customer Auth
        if (customerIsRegistering) {
          const res = await registerCustomer({
            name: authName,
            email: authEmail,
            password: authPassword,
            company: authCompany,
            phone: authPhone
          });
          if (res.success) {
            if (onNotify) onNotify(`Customer account created! Welcome, ${res.user.name}`, 'success');
            window.location.hash = '#account';
          } else {
            setAuthError(res.error || 'Failed to create customer account');
          }
        } else {
          const res = await loginCustomer({ email: authEmail, password: authPassword });
          if (res.success) {
            if (onNotify) onNotify(`Signed in as ${res.user.name}`, 'success');
            window.location.hash = '#account';
          } else {
            setAuthError(res.error || 'Invalid email or password');
          }
        }
      }
    } catch (err) {
      setAuthError('Authentication request failed. Please check network and server.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    if (onNotify) onNotify('Logged out successfully', 'info');
    window.location.hash = '#home';
  };

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
      Quoted: '#F59E0B',
      'Follow-up': '#D97706',
      Negotiation: '#6366F1',
      Confirmed: '#10B981',
      Lost: '#EF4444'
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
      eq.customerName?.toLowerCase().includes(q) ||
      eq.company?.toLowerCase().includes(q) ||
      eq.phone?.toLowerCase().includes(q) ||
      eq.email?.toLowerCase().includes(q) ||
      eq.productName?.toLowerCase().includes(q)
    );
  });

  // If subroute is 'login' OR user is trying to access protected staff CRM without staff authorization
  if (subroute === 'login' || !isStaff) {
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

          {/* Role Choice Tabs: Customer vs Staff */}
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
                cursor: 'pointer',
                boxShadow: authMode === 'customer' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
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
                cursor: 'pointer',
                boxShadow: authMode === 'staff' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              🔒 Staff Workspace
            </button>
          </div>

          {/* Error Message */}
          {authError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
              ⚠️ {authError}
            </div>
          )}

          {/* Form */}
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

            {authMode === 'staff' && (
              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '16px', lineHeight: 1.5, background: '#F8FAFC', padding: '8px 10px', borderRadius: '4px' }}>
                🛡️ Staff accounts are authorized and provisioned internally. Public registration for staff roles is restricted.
              </div>
            )}

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

          {/* Customer Register / Login Toggle */}
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

  // Staff Workspace Authenticated Shell
  return (
    <div className="crm-shell" id="crm-shell" style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* CRM Sidebar */}
      <aside className={`crm-sidebar ${sidebarOpen ? 'open' : ''}`} id="crm-sidebar">
        <div className="crm-sidebar__header">
          <a href="#home" className="crm-sidebar__brand" title="Exit to Public Website">
            <img src="/Lotus Tubes Logo.png" alt="Lotus Tubes CRM" className="crm-sidebar__logo" />
          </a>
          <span className="crm-badge" style={{ background: 'var(--primary-blue)', color: '#FFF' }}>
            OPERATIONS
          </span>
        </div>

        {/* Current Verified Staff User Profile */}
        <div className="crm-user-card">
          <div className="crm-avatar" style={{ background: 'var(--deep-navy)', color: '#FFF', fontWeight: 700 }}>
            {user?.name?.slice(0, 2).toUpperCase() || 'ST'}
          </div>
          <div className="crm-user-info">
            <span className="crm-user-name">{user?.name || 'Authorized Staff'}</span>
            <span className="crm-user-role" style={{ textTransform: 'capitalize' }}>
              {user?.role || 'Staff Engineer'}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="crm-nav">
          <div className="crm-nav-section-title">MAIN OPERATIONS</div>
          <ul className="crm-nav-list">
            <li>
              <a href="#crm/dashboard" className={`crm-nav-link ${subroute === 'dashboard' ? 'active' : ''}`}>
                <span className="crm-icon">📊</span> Dashboard
              </a>
            </li>
            <li>
              <a href="#crm/enquiries" className={`crm-nav-link ${subroute === 'enquiries' ? 'active' : ''}`}>
                <span className="crm-icon">📥</span> Enquiries &amp; RFQs
                <span className="crm-counter" id="crm-badge-enquiries">{enquiries.length}</span>
              </a>
            </li>
            <li>
              <a href="#crm/quotations" className={`crm-nav-link ${subroute === 'quotations' ? 'active' : ''}`}>
                <span className="crm-icon">📑</span> Quotations &amp; BOQ
                <span className="crm-counter" id="crm-badge-quotes">{quotations.length}</span>
              </a>
            </li>
          </ul>

          <div className="crm-nav-section-title">COMMUNICATION INTEGRATIONS</div>
          <ul className="crm-nav-list">
            <li>
              <a href="#crm/settings" className={`crm-nav-link ${subroute === 'settings' ? 'active' : ''}`}>
                <span className="crm-icon">⚙️</span> Resend &amp; WhatsApp Status
              </a>
            </li>
          </ul>
        </nav>

        <div className="crm-sidebar__footer">
          <a href="#home" className="btn btn--outline-light btn--sm btn--block">
            &larr; Public Website
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn--danger-outline btn--sm btn--block mt-2"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* CRM Content Workspace */}
      <div className="crm-workspace" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top App Bar */}
        <header className="crm-topbar">
          <div className="crm-topbar__left">
            <button
              type="button"
              className="crm-sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle CRM Sidebar"
            >
              ☰
            </button>
            <div className="crm-breadcrumb" id="crm-breadcrumb">
              Operations / {subroute.charAt(0).toUpperCase() + subroute.slice(1)}
            </div>
          </div>

          <div className="crm-topbar__right">
            <div className="crm-search-box">
              <input
                type="text"
                placeholder="Search RFQ reference, customer, product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={() => onOpenQuickEnquiry?.(null)}
            >
              + New Quotation Request
            </button>

            <a href="#home" className="btn btn--secondary btn--sm">
              Public Site
            </a>
          </div>
        </header>

        {/* CRM Main Body */}
        <div id="crm-main-content" className="crm-body" style={{ padding: '24px', flex: 1 }}>
          {dataLoading ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <Loader variant="block" size="md" label="Loading real application data from database..." />
            </div>
          ) : (
            <>
              {/* Subview: Dashboard */}
              {subroute === 'dashboard' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                      <span style={{ fontSize: '13px', color: '#667085', fontWeight: 600 }}>Inbound RFQs &amp; Enquiries</span>
                      <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--deep-navy)', marginTop: '4px' }}>
                        {enquiries.length}
                      </div>
                      <small style={{ color: '#64748B' }}>Real database records</small>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                      <span style={{ fontSize: '13px', color: '#667085', fontWeight: 600 }}>Quotation Dispatches</span>
                      <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--deep-navy)', marginTop: '4px' }}>
                        {enquiries.filter(e => e.emailStatus === 'sent' || e.whatsappStatus === 'sent').length}
                      </div>
                      <small style={{ color: '#10B981' }}>Delivered via configured channels</small>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                      <span style={{ fontSize: '13px', color: '#667085', fontWeight: 600 }}>Comprehensive Quotes / BOQs</span>
                      <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--deep-navy)', marginTop: '4px' }}>
                        {quotations.length}
                      </div>
                      <small style={{ color: '#64748B' }}>Technical submissions</small>
                    </div>
                  </div>

                  {/* Recent Enquiries Table */}
                  <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '1.1rem', color: '#10263D', margin: 0 }}>Recent Inbound Quotation Requests</h3>
                      <a href="#crm/enquiries" style={{ fontSize: '13px', color: 'var(--primary-blue)', fontWeight: 600 }}>
                        View All ({enquiries.length}) &rarr;
                      </a>
                    </div>

                    {filteredEnquiries.length === 0 ? (
                      <div style={{ padding: '36px', textAlign: 'center', background: '#F8FAFC', borderRadius: '6px', border: '1px dashed #CBD5E1' }}>
                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>📥</div>
                        <h4 style={{ color: '#334155', margin: '0 0 4px 0' }}>No Inbound Enquiries Yet</h4>
                        <p style={{ color: '#64748B', fontSize: '13px', margin: 0 }}>
                          Official quotation requests submitted by customers through the product catalogue will appear here with live email and WhatsApp delivery logs.
                        </p>
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E3E8EF' }}>
                              <th style={{ padding: '10px' }}>Reference</th>
                              <th style={{ padding: '10px' }}>Customer &amp; Company</th>
                              <th style={{ padding: '10px' }}>Product</th>
                              <th style={{ padding: '10px' }}>Quantity</th>
                              <th style={{ padding: '10px' }}>Email</th>
                              <th style={{ padding: '10px' }}>WhatsApp</th>
                              <th style={{ padding: '10px' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredEnquiries.slice(0, 8).map((eq) => (
                              <tr key={eq._id || eq.id} style={{ borderBottom: '1px solid #E3E8EF' }}>
                                <td style={{ padding: '10px', fontWeight: 600 }}>{eq.reference}</td>
                                <td style={{ padding: '10px' }}>
                                  <div><strong>{eq.customerName}</strong></div>
                                  <small style={{ color: '#667085' }}>{eq.company}</small>
                                </td>
                                <td style={{ padding: '10px' }}>
                                  <div>{eq.productName}</div>
                                  <small style={{ color: '#667085' }}>{eq.grade || 'SS 316L'}</small>
                                </td>
                                <td style={{ padding: '10px' }}>{eq.quantity}</td>
                                <td style={{ padding: '10px' }}>{renderDeliveryBadge(eq.emailStatus)}</td>
                                <td style={{ padding: '10px' }}>{renderDeliveryBadge(eq.whatsappStatus)}</td>
                                <td style={{ padding: '10px' }}>{renderStatusPill(eq.status || 'New')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Subview: Enquiries */}
              {subroute === 'enquiries' && (
                <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#10263D', margin: 0 }}>All Inbound RFQs &amp; Enquiries</h3>
                    <span style={{ fontSize: '13px', color: '#667085' }}>Total: {filteredEnquiries.length}</span>
                  </div>

                  {filteredEnquiries.length === 0 ? (
                    <div style={{ padding: '48px', textAlign: 'center', background: '#F8FAFC', borderRadius: '6px', border: '1px dashed #CBD5E1' }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>📥</div>
                      <h4 style={{ color: '#334155', margin: '0 0 6px 0' }}>No Inbound Enquiries Yet</h4>
                      <p style={{ color: '#64748B', fontSize: '13px', margin: 0 }}>
                        No quotation requests have been submitted yet. When customers submit requests from product cards or detail pages, they will appear here.
                      </p>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E3E8EF' }}>
                            <th style={{ padding: '10px' }}>Reference</th>
                            <th style={{ padding: '10px' }}>Customer</th>
                            <th style={{ padding: '10px' }}>Phone / Email</th>
                            <th style={{ padding: '10px' }}>Product</th>
                            <th style={{ padding: '10px' }}>Quantity</th>
                            <th style={{ padding: '10px' }}>Destination</th>
                            <th style={{ padding: '10px' }}>Email</th>
                            <th style={{ padding: '10px' }}>WhatsApp</th>
                            <th style={{ padding: '10px' }}>Document</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredEnquiries.map((eq) => (
                            <tr key={eq._id || eq.id} style={{ borderBottom: '1px solid #E3E8EF' }}>
                              <td style={{ padding: '10px', fontWeight: 600 }}>{eq.reference}</td>
                              <td style={{ padding: '10px' }}>
                                <div><strong>{eq.customerName}</strong></div>
                                <small style={{ color: '#667085' }}>{eq.company}</small>
                              </td>
                              <td style={{ padding: '10px' }}>
                                <div>{eq.phone}</div>
                                <small style={{ color: '#667085' }}>{eq.email}</small>
                              </td>
                              <td style={{ padding: '10px' }}>
                                <div>{eq.productName}</div>
                                <small style={{ color: '#667085' }}>{eq.grade}</small>
                              </td>
                              <td style={{ padding: '10px' }}>{eq.quantity}</td>
                              <td style={{ padding: '10px' }}>{eq.location}</td>
                              <td style={{ padding: '10px' }}>{renderDeliveryBadge(eq.emailStatus)}</td>
                              <td style={{ padding: '10px' }}>{renderDeliveryBadge(eq.whatsappStatus)}</td>
                              <td style={{ padding: '10px' }}>
                                <a
                                  href="/sample-quotation.pdf"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: 'var(--primary-blue)', fontSize: '12px', fontWeight: 600 }}
                                >
                                  PDF &rarr;
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Subview: Quotations */}
              {subroute === 'quotations' && (
                <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#10263D', margin: 0 }}>Comprehensive Quotations &amp; BOQ Submissions</h3>
                    <span style={{ fontSize: '13px', color: '#667085' }}>Total: {quotations.length}</span>
                  </div>

                  {quotations.length === 0 ? (
                    <div style={{ padding: '48px', textAlign: 'center', background: '#F8FAFC', borderRadius: '6px', border: '1px dashed #CBD5E1' }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>📑</div>
                      <h4 style={{ color: '#334155', margin: '0 0 6px 0' }}>No Quotation Records Yet</h4>
                      <p style={{ color: '#64748B', fontSize: '13px', margin: 0 }}>
                        Quotations created through the quotation portal or uploaded BOQs will be organized here.
                      </p>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E3E8EF' }}>
                            <th style={{ padding: '10px' }}>Ref</th>
                            <th style={{ padding: '10px' }}>Customer</th>
                            <th style={{ padding: '10px' }}>Category</th>
                            <th style={{ padding: '10px' }}>Grade</th>
                            <th style={{ padding: '10px' }}>Email Status</th>
                            <th style={{ padding: '10px' }}>Document</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quotations.map((q) => (
                            <tr key={q._id || q.id} style={{ borderBottom: '1px solid #E3E8EF' }}>
                              <td style={{ padding: '10px', fontWeight: 600 }}>{q.reference}</td>
                              <td style={{ padding: '10px' }}>
                                <div><strong>{q.name}</strong></div>
                                <small style={{ color: '#667085' }}>{q.company}</small>
                              </td>
                              <td style={{ padding: '10px' }}>{q.projectType}</td>
                              <td style={{ padding: '10px' }}>{q.materialGrade}</td>
                              <td style={{ padding: '10px' }}>{renderDeliveryBadge(q.emailStatus)}</td>
                              <td style={{ padding: '10px' }}>
                                <a href="/sample-quotation.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-blue)', fontSize: '12px' }}>
                                  Sample PDF
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Subview: Settings / Integrations */}
              {subroute === 'settings' && (
                <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#10263D', marginBottom: '8px' }}>
                    Communication Integrations Status
                  </h3>
                  <p style={{ color: '#667085', fontSize: '14px', marginBottom: '20px' }}>
                    Actual delivery statuses are tracked per quotation request based on provider configuration.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '20px' }}>✉️</span>
                        <div>
                          <strong>Resend Email Service</strong>
                          <div style={{ fontSize: '12px', color: '#667085' }}>Dispatches quotation confirmation &amp; sample PDF</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                        Configured through server environment variables (<code>RESEND_API_KEY</code>, <code>RESEND_FROM_EMAIL</code>).
                      </div>
                    </div>

                    <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '20px' }}>🟢</span>
                        <div>
                          <strong>WhatsApp Cloud API Service</strong>
                          <div style={{ fontSize: '12px', color: '#667085' }}>Dispatches quotation alerts via Meta Cloud API</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                        Configured through server environment variables (<code>WHATSAPP_ACCESS_TOKEN</code>, <code>WHATSAPP_PHONE_NUMBER_ID</code>). If credentials are missing, system records <code>not_configured</code> without falsely reporting delivery.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CRMView;

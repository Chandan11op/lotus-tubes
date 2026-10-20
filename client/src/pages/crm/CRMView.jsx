import React, { useState, useEffect } from 'react';
import { loadCRMData, saveCRMData, PRODUCTS } from '../../data/siteData';

export const CRMView = ({ subroute = 'dashboard', onNotify, onOpenQuickEnquiry }) => {
  const [data, setData] = useState(() => loadCRMData());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setData(loadCRMData());
  }, [subroute]);

  const handleStatusChange = (enquiryId, newStatus) => {
    const updated = {
      ...data,
      enquiries: data.enquiries.map((e) =>
        e.id === enquiryId ? { ...e, status: newStatus } : e
      )
    };
    setData(updated);
    saveCRMData(updated);
    if (onNotify) {
      onNotify(`Enquiry ${enquiryId} status updated to "${newStatus}"`, 'success');
    }
  };

  const handleTaskToggle = (taskId) => {
    const updated = {
      ...data,
      tasks: data.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    };
    setData(updated);
    saveCRMData(updated);
    if (onNotify) {
      onNotify('Task status updated', 'info');
    }
  };

  const handleTaskDelete = (taskId) => {
    const updated = {
      ...data,
      tasks: data.tasks.filter((t) => t.id !== taskId)
    };
    setData(updated);
    saveCRMData(updated);
    if (onNotify) {
      onNotify('Task removed from schedule', 'info');
    }
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
      <span
        style={{
          background: bg,
          color: '#FFFFFF',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 600
        }}
      >
        {status}
      </span>
    );
  };

  // If subroute is login
  if (subroute === 'login') {
    return (
      <div className="crm-login-wrapper" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="crm-login-box" style={{ width: '100%', maxWidth: '420px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E3E8EF', padding: '36px', boxShadow: '0 8px 24px rgba(16,38,61,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img src="/Lotus Tubes Logo.png" alt="Lotus Tubes" style={{ maxHeight: '48px', margin: '0 auto 12px auto' }} />
            <h3 style={{ color: 'var(--deep-navy)', fontSize: '1.4rem' }}>Internal Sales &amp; CRM Portal</h3>
            <p style={{ color: '#667085', fontSize: '13px' }}>Lotus Tubes Staff &amp; Operational Workspace Demo</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); window.location.hash = '#crm/dashboard'; }}>
            <div className="form-group mb-3">
              <label>Staff Email ID</label>
              <input type="email" defaultValue="chirag@lotustubes.com" readOnly style={{ background: '#F8FAFC' }} />
            </div>
            <div className="form-group mb-3">
              <label>Demo Access Key</label>
              <input type="password" defaultValue="••••••••••••" readOnly style={{ background: '#F8FAFC' }} />
            </div>
            <button type="submit" className="btn btn--primary btn--block">
              Enter Staff CRM &rarr;
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <a href="#home" style={{ fontSize: '13px', color: '#667085' }}>&larr; Return to Public Website</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crm-shell" id="crm-shell" style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* CRM Sidebar */}
      <aside className={`crm-sidebar ${sidebarOpen ? 'open' : ''}`} id="crm-sidebar">
        <div className="crm-sidebar__header">
          <a href="#home" className="crm-sidebar__brand" title="Exit to Public Website">
            <img src="/Lotus Tubes Logo.png" alt="Lotus Tubes CRM" className="crm-sidebar__logo" />
          </a>
          <span className="crm-badge">STAFF CRM DEMO</span>
        </div>

        {/* Current User Profile Pill */}
        <div className="crm-user-card">
          <div className="crm-avatar">CS</div>
          <div className="crm-user-info">
            <span className="crm-user-name">Chirag Shah</span>
            <span className="crm-user-role">Super Admin &bull; Owner</span>
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
                <span className="crm-icon">📥</span> Enquiries
                <span className="crm-counter" id="crm-badge-enquiries">{data.enquiries?.length || 0}</span>
              </a>
            </li>
            <li>
              <a href="#crm/customers" className={`crm-nav-link ${subroute === 'customers' ? 'active' : ''}`}>
                <span className="crm-icon">🏢</span> Customers &amp; Accounts
              </a>
            </li>
            <li>
              <a href="#crm/quotations" className={`crm-nav-link ${subroute === 'quotations' ? 'active' : ''}`}>
                <span className="crm-icon">📑</span> Quotations &amp; BOQ
                <span className="crm-counter" id="crm-badge-quotes">{data.quotations?.length || 0}</span>
              </a>
            </li>
            <li>
              <a href="#crm/tasks" className={`crm-nav-link ${subroute === 'tasks' ? 'active' : ''}`}>
                <span className="crm-icon">⏱️</span> Tasks &amp; Follow-ups
                <span className="crm-counter crm-counter--alert" id="crm-badge-tasks">{data.tasks?.filter(t => !t.completed).length || 0}</span>
              </a>
            </li>
          </ul>

          <div className="crm-nav-section-title">INVENTORY &amp; PRODUCTS</div>
          <ul className="crm-nav-list">
            <li>
              <a href="#crm/products" className={`crm-nav-link ${subroute === 'products' ? 'active' : ''}`}>
                <span className="crm-icon">📦</span> Catalogue &amp; Specs
              </a>
            </li>
            <li>
              <a href="#crm/reports" className={`crm-nav-link ${subroute === 'reports' ? 'active' : ''}`}>
                <span className="crm-icon">📈</span> Analytics &amp; Reports
              </a>
            </li>
          </ul>

          <div className="crm-nav-section-title">ADMINISTRATION</div>
          <ul className="crm-nav-list">
            <li>
              <a href="#crm/employees" className={`crm-nav-link ${subroute === 'employees' ? 'active' : ''}`}>
                <span className="crm-icon">👥</span> Employees (Sales &amp; Accounts)
              </a>
            </li>
            <li>
              <a href="#crm/settings" className={`crm-nav-link ${subroute === 'settings' ? 'active' : ''}`}>
                <span className="crm-icon">⚙️</span> WhatsApp &amp; Email Integrations
              </a>
            </li>
          </ul>
        </nav>

        <div className="crm-sidebar__footer">
          <a href="#home" className="btn btn--outline-light btn--sm btn--block">
            &larr; Return to Public Website
          </a>
          <a href="#crm/login" className="btn btn--danger-outline btn--sm btn--block mt-2">
            Lock Session / Demo Out
          </a>
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
              Dashboard / {subroute.charAt(0).toUpperCase() + subroute.slice(1)}
            </div>
          </div>

          <div className="crm-topbar__right">
            <div className="crm-search-box">
              <input
                type="text"
                placeholder="Search RFQ, customer, company, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={() => onOpenQuickEnquiry?.(null)}
            >
              + New Enquiry
            </button>

            <a href="#home" className="btn btn--secondary btn--sm">
              Public Site
            </a>
          </div>
        </header>

        {/* CRM Main Body */}
        <div id="crm-main-content" className="crm-body" style={{ padding: '24px', flex: 1 }}>
          {/* Subview: Dashboard */}
          {subroute === 'dashboard' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                  <span style={{ fontSize: '13px', color: '#667085' }}>Active Enquiries</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--deep-navy)' }}>{data.enquiries?.length || 0}</div>
                  <small style={{ color: '#10B981' }}>+4 today from website</small>
                </div>
                <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                  <span style={{ fontSize: '13px', color: '#667085' }}>Open Quotations</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--deep-navy)' }}>{data.quotations?.length || 0}</div>
                  <small style={{ color: '#F59E0B' }}>Total: ₹48.5L</small>
                </div>
                <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                  <span style={{ fontSize: '13px', color: '#667085' }}>Customer Accounts</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--deep-navy)' }}>{data.customers?.length || 0}</div>
                  <small style={{ color: '#667085' }}>Pharma &amp; Dairy</small>
                </div>
                <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                  <span style={{ fontSize: '13px', color: '#667085' }}>Pending Tasks</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#EF4444' }}>{data.tasks?.filter(t => !t.completed).length || 0}</div>
                  <small style={{ color: '#EF4444' }}>Action required today</small>
                </div>
              </div>

              {/* Recent Enquiries Table */}
              <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#10263D', margin: 0 }}>Recent Quotation Requests (Live Pipeline)</h3>
                  <a href="#crm/enquiries" style={{ fontSize: '13px', color: 'var(--primary-blue)', fontWeight: 600 }}>View All Enquiries &rarr;</a>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E3E8EF' }}>
                        <th style={{ padding: '10px' }}>Ref ID</th>
                        <th style={{ padding: '10px' }}>Customer &amp; Company</th>
                        <th style={{ padding: '10px' }}>Product &amp; Grade</th>
                        <th style={{ padding: '10px' }}>Quantity</th>
                        <th style={{ padding: '10px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.enquiries?.slice(0, 5).map((eq) => (
                        <tr key={eq.id} style={{ borderBottom: '1px solid #E3E8EF' }}>
                          <td style={{ padding: '10px', fontWeight: 600 }}>{eq.id}</td>
                          <td style={{ padding: '10px' }}>
                            <div><strong>{eq.customerName}</strong></div>
                            <small style={{ color: '#667085' }}>{eq.company}</small>
                          </td>
                          <td style={{ padding: '10px' }}>
                            <div>{eq.product}</div>
                            <small style={{ color: '#667085' }}>{eq.grade}</small>
                          </td>
                          <td style={{ padding: '10px' }}>{eq.quantity}</td>
                          <td style={{ padding: '10px' }}>{renderStatusPill(eq.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Subview: Enquiries with Status Changer */}
          {subroute === 'enquiries' && (
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#10263D', margin: 0 }}>All Inbound RFQs &amp; Enquiries</h3>
                <span style={{ fontSize: '13px', color: '#667085' }}>Total: {data.enquiries?.length || 0}</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E3E8EF' }}>
                      <th style={{ padding: '10px' }}>Ref ID</th>
                      <th style={{ padding: '10px' }}>Customer</th>
                      <th style={{ padding: '10px' }}>Phone / Email</th>
                      <th style={{ padding: '10px' }}>Product</th>
                      <th style={{ padding: '10px' }}>Quantity</th>
                      <th style={{ padding: '10px' }}>Location</th>
                      <th style={{ padding: '10px' }}>Status</th>
                      <th style={{ padding: '10px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.enquiries?.map((eq) => (
                      <tr key={eq.id} style={{ borderBottom: '1px solid #E3E8EF' }}>
                        <td style={{ padding: '10px', fontWeight: 600 }}>{eq.id}</td>
                        <td style={{ padding: '10px' }}>
                          <div><strong>{eq.customerName}</strong></div>
                          <small style={{ color: '#667085' }}>{eq.company}</small>
                        </td>
                        <td style={{ padding: '10px' }}>
                          <div>{eq.phone}</div>
                          <small style={{ color: '#667085' }}>{eq.email}</small>
                        </td>
                        <td style={{ padding: '10px' }}>
                          <div>{eq.product}</div>
                          <small style={{ color: '#667085' }}>{eq.grade}</small>
                        </td>
                        <td style={{ padding: '10px' }}>{eq.quantity}</td>
                        <td style={{ padding: '10px' }}>{eq.location}</td>
                        <td style={{ padding: '10px' }}>
                          <select
                            value={eq.status}
                            onChange={(e) => handleStatusChange(eq.id, e.target.value)}
                            style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Quoted">Quoted</option>
                            <option value="Follow-up">Follow-up</option>
                            <option value="Negotiation">Negotiation</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </td>
                        <td style={{ padding: '10px' }}>
                          <button
                            type="button"
                            className="btn btn--outline-dark btn--sm"
                            style={{ padding: '2px 8px', fontSize: '11px' }}
                            onClick={() => alert(`Enquiry: ${eq.id}\nCustomer: ${eq.customerName} (${eq.company})\nPhone: ${eq.phone}\nNotes: ${eq.notes || 'None'}`)}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Subview: Tasks */}
          {subroute === 'tasks' && (
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#10263D', marginBottom: '16px' }}>Staff Follow-up Schedule</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {data.tasks?.map((t) => (
                  <li
                    key={t.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      borderBottom: '1px solid #E3E8EF',
                      background: t.completed ? '#F8FAFC' : '#FFFFFF'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => handleTaskToggle(t.id)}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                      <div>
                        <span style={{ textDecoration: t.completed ? 'line-through' : 'none', color: t.completed ? '#98A2B3' : '#10263D', fontWeight: 600 }}>
                          {t.title}
                        </span>
                        <div style={{ fontSize: '12px', color: '#667085' }}>
                          Due: {t.dueDate} &bull; Assigned: {t.assignedTo}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTaskDelete(t.id)}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '13px' }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Other subroutes: settings, customers, quotations, products, reports, employees */}
          {['customers', 'quotations', 'products', 'reports', 'employees', 'settings'].includes(subroute) && (
            <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#10263D', marginBottom: '12px' }}>
                {subroute.charAt(0).toUpperCase() + subroute.slice(1)} Module
              </h3>
              <p style={{ color: '#667085', fontSize: '14px' }}>
                CRM demonstration module for {subroute}. Data is synchronized with local demo memory.
              </p>
              {subroute === 'settings' && (
                <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn--whatsapp btn--sm"
                    onClick={() => onNotify?.('Simulated WhatsApp notification ping sent', 'success')}
                  >
                    Test WhatsApp Notification
                  </button>
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    onClick={() => onNotify?.('Test quotation PDF template dispatched', 'success')}
                  >
                    Test Email Dispatch
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CRMView;

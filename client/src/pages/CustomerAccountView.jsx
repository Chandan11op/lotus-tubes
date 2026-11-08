import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { Loader } from '../components/common/Loader';
import { AI_TEAM_MEMBERS } from '../data/siteData';

export const CustomerAccountView = ({ onNotify }) => {
  const { user, logout } = useAuth();
  const [quotesData, setQuotesData] = useState({ enquiries: [], quotes: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('quotes'); // 'quotes' | 'billing' | 'support'
  const [sendingInvoiceId, setSendingInvoiceId] = useState(null);

  useEffect(() => {
    let mounted = true;
    apiService.getMyQuotes()
      .then((res) => {
        if (mounted && res?.data) {
          setQuotesData(res.data);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch customer quotes:', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const openLiveChat = (contextMsg = '') => {
    window.dispatchEvent(
      new CustomEvent('open-lotus-chat', {
        detail: { message: contextMsg }
      })
    );
  };

  const handleRequestInvoiceWhatsApp = async (quoteId, invRef) => {
    setSendingInvoiceId(quoteId);
    try {
      const res = await apiService.requestInvoiceWhatsApp(quoteId, user?.phone);
      if (onNotify) {
        onNotify(`Riya Shah: Invoice ${invRef} dispatched to your WhatsApp!`, 'success');
      }
      if (res?.data?.directLink) {
        window.open(res.data.directLink, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      if (onNotify) {
        onNotify(`Could not dispatch invoice via WhatsApp: ${err.message}`, 'error');
      }
    } finally {
      setSendingInvoiceId(null);
    }
  };

  const quotationItems = [
    ...(quotesData.enquiries || []).map((e) => ({
      rawId: e._id,
      id: e.reference || e._id,
      type: 'Product Quotation',
      product: e.productName || 'Sanitary Component',
      quantity: e.quantity,
      grade: e.grade || 'SS 316L',
      date: new Date(e.createdAt || Date.now()).toLocaleDateString(),
      status: e.status || 'New Lead',
      assignedAgent: 'Ananya Mehta',
      samplePdfUrl: e.samplePdfUrl || '/sample-quotation.pdf'
    })),
    ...(quotesData.quotes || []).map((q) => ({
      rawId: q._id,
      id: q.quotationNumber || q.reference || q._id,
      type: 'Detailed BOQ',
      product: q.projectType || 'Sanitary Piping System',
      quantity: `${q.lineItems?.length || 1} Line Items`,
      grade: q.materialGrade || 'SS 316L',
      date: new Date(q.createdAt || Date.now()).toLocaleDateString(),
      status: q.status || 'Received',
      assignedAgent: 'Ananya Mehta',
      samplePdfUrl: q.samplePdfUrl || '/sample-quotation.pdf'
    }))
  ];

  const billingItems = (quotesData.invoices && quotesData.invoices.length > 0)
    ? quotesData.invoices.map((inv) => ({
        rawId: inv._id,
        invoiceNumber: inv.invoiceNumber,
        quoteRef: inv.quotationNumber || 'Direct Order',
        date: new Date(inv.createdAt || inv.issuedDate || Date.now()).toLocaleDateString(),
        subtotal: inv.subtotal || 0,
        taxTotal: inv.taxTotal || 0,
        grandTotal: inv.grandTotal || 0,
        status: inv.status === 'Approved' ? 'Authorized by Super Admin' : (inv.status || 'Draft'),
        assignedAgent: 'Riya Shah',
        pdfUrl: inv.pdfUrl || '/sample-quotation.pdf'
      }))
    : (quotesData.quotes || []).map((q) => {
        const invNum = (q.quotationNumber || q.reference || 'LT-QT-1001').replace('LT-QT', 'LT-INV');
        const subtotal = q.subtotal || 0;
        const taxTotal = q.taxTotal || Math.round(subtotal * 0.18);
        const grandTotal = q.grandTotal || subtotal + taxTotal;
        return {
          rawId: q._id,
          invoiceNumber: invNum,
          quoteRef: q.quotationNumber || q.reference,
          date: new Date(q.createdAt || Date.now()).toLocaleDateString(),
          subtotal,
          taxTotal,
          grandTotal,
          status: q.status === 'Approved' ? 'Authorized by Super Admin' : 'Proforma Draft',
          assignedAgent: 'Riya Shah',
          pdfUrl: '/sample-quotation.pdf'
        };
      });

  return (
    <>
      <section className="page-hero">
        <div className="site-container">
          <span className="badge badge--pink mb-2">Verified Client Portal</span>
          <h1 className="page-hero-title">Customer Operations &amp; Account</h1>
          <p className="page-hero-subtitle">
            Welcome back, <strong>{user?.name || 'Customer'}</strong>. Your dedicated 4 AI workflow agents are active and synchronized with Mumbai executive dispatch.
          </p>
        </div>
      </section>

      <div className="site-container section" style={{ maxWidth: '1100px' }}>
        {/* Profile Card & Executive Quick Actions */}
        <div
          className="card mb-4"
          style={{
            background: '#FFFFFF',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 8px 24px rgba(3, 8, 16, 0.04)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, color: '#0F172A', fontSize: '1.25rem' }}>{user?.name}</h3>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#0284C7',
                  background: '#EFF6FF',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}
              >
                Verified Account
              </span>
            </div>
            <p style={{ margin: '6px 0 0 0', color: '#64748B', fontSize: '14px' }}>
              <strong>Company:</strong> {user?.company || 'Direct Engineering Client'} • <strong>Email:</strong> {user?.email} {user?.phone ? `• Phone: ${user?.phone}` : ''}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={() => openLiveChat('Hello Arjun, I would like an update on my account.')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              💬 Live Chat (Arjun Yadav)
            </button>
            <a href="/products" className="btn btn--outline btn--sm">
              Browse Catalogue
            </a>
            <button
              type="button"
              className="btn btn--outline-dark btn--sm"
              onClick={() => {
                logout();
                window.location.hash = '#home';
                if (onNotify) onNotify('Signed out of customer account.', 'info');
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Dedicated 4 AI Agents Operational Grid */}
        <div
          className="card mb-4"
          style={{
            background: 'linear-gradient(135deg, #030810 0%, #0F172A 100%)',
            color: '#FFFFFF',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid rgba(56, 189, 248, 0.2)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#38BDF8', letterSpacing: '0.1em' }}>
                Assigned Business Portfolio Team
              </span>
              <h3 style={{ margin: '4px 0 0 0', color: '#FFFFFF', fontSize: '1.2rem' }}>
                Your Dedicated Account Management Team
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              Supervised by Chirag Shah (Owner &amp; Managing Director)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {AI_TEAM_MEMBERS.map((bot) => (
              <div
                key={bot.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}
              >
                <img
                  src={bot.photo}
                  alt={bot.name}
                  style={{ width: '46px', height: '46px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #38BDF8' }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F1F5F9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {bot.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#38BDF8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {bot.role}
                  </div>
                  <a
                    href={`mailto:${bot.email}`}
                    style={{ fontSize: '0.68rem', color: '#94A3B8', textDecoration: 'none', display: 'block', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    ✉️ {bot.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #E2E8F0', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('quotes')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'quotes' ? '#0284C7' : '#64748B',
              borderBottom: activeTab === 'quotes' ? '3px solid #0284C7' : '3px solid transparent',
              marginBottom: '-2px'
            }}
          >
            📊 Quotations &amp; RFQs (Ananya Mehta)
            <span style={{ marginLeft: '6px', fontSize: '0.72rem', background: '#EFF6FF', color: '#0284C7', padding: '2px 6px', borderRadius: '10px' }}>
              {quotationItems.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('billing')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'billing' ? '#0284C7' : '#64748B',
              borderBottom: activeTab === 'billing' ? '3px solid #0284C7' : '3px solid transparent',
              marginBottom: '-2px'
            }}
          >
            🧾 Billing &amp; Invoices (Riya Shah)
            <span style={{ marginLeft: '6px', fontSize: '0.72rem', background: '#F0FDF4', color: '#16A34A', padding: '2px 6px', borderRadius: '10px' }}>
              {billingItems.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('support')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'transparent',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'support' ? '#0284C7' : '#64748B',
              borderBottom: activeTab === 'support' ? '3px solid #0284C7' : '3px solid transparent',
              marginBottom: '-2px'
            }}
          >
            📝 Inquiries &amp; Support (Neha Desai)
          </button>
        </div>

        {/* Tab 1: Quotations & RFQs */}
        {activeTab === 'quotes' && (
          <div className="card" style={{ background: '#FFFFFF', padding: '24px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0F172A', fontSize: '1.15rem' }}>Submitted Quotation Requests</h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '13px' }}>
                  Handled by <strong>Ananya Mehta</strong>. Quotations are dispatched via email and WhatsApp upon Super Admin confirmation.
                </p>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: '20px' }}>
                <Loader variant="skeleton-table" rows={4} label="Retrieving quotations..." />
              </div>
            ) : quotationItems.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                      <th style={{ padding: '12px' }}>Reference</th>
                      <th style={{ padding: '12px' }}>Product / Project</th>
                      <th style={{ padding: '12px' }}>Grade &amp; Qty</th>
                      <th style={{ padding: '12px' }}>Date</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotationItems.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#0F172A' }}>{item.id}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 600 }}>{item.product}</div>
                          <small style={{ color: '#64748B' }}>{item.type}</small>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div>{item.grade}</div>
                          <small style={{ color: '#64748B' }}>Qty: {item.quantity}</small>
                        </td>
                        <td style={{ padding: '12px', color: '#64748B' }}>{item.date}</td>
                        <td style={{ padding: '12px' }}>
                          <span
                            style={{
                              background: '#E0F2FE',
                              color: '#0369A1',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 700
                            }}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <a
                              href={`https://wa.me/919930430789?text=${encodeURIComponent(
                                `Hello Ananya Mehta, I would like an update on my quotation request ${item.id} for ${item.product}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn--sm"
                              style={{ padding: '4px 8px', fontSize: '11px', background: '#25D366', color: '#FFFFFF', border: 'none' }}
                              title="Chat with Ananya Mehta on WhatsApp"
                            >
                              💬 WhatsApp
                            </a>
                            <button
                              type="button"
                              className="btn btn--outline btn--sm"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                              onClick={() => openLiveChat(`Hello Arjun, what is the status of my quotation ${item.id}?`)}
                              title="Check status via Live Operations Manager"
                            >
                              ⚡ Live Check
                            </button>
                            <a
                              href={item.samplePdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn--outline-dark btn--sm"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                            >
                              📄 PDF
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📑</div>
                <h4 style={{ margin: '0 0 6px 0', color: '#0F172A' }}>No Quotation Requests Yet</h4>
                <p style={{ color: '#64748B', maxWidth: '400px', margin: '0 auto 16px auto', fontSize: '13px' }}>
                  Explore our sanitary pipes, fittings, and valves catalogue and click "Request Official Quotation".
                </p>
                <a href="/products" className="btn btn--primary btn--sm">
                  Explore Catalogue &rarr;
                </a>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Billing & Invoices */}
        {activeTab === 'billing' && (
          <div className="card" style={{ background: '#FFFFFF', padding: '24px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0F172A', fontSize: '1.15rem' }}>Commercial Billing &amp; Tax Invoices</h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '13px' }}>
                  Managed by <strong>Riya Shah</strong>. Invoices include verified 18% GST calculation and export clearance schedules.
                </p>
              </div>
            </div>

            {billingItems.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                      <th style={{ padding: '12px' }}>Invoice #</th>
                      <th style={{ padding: '12px' }}>Quotation Ref</th>
                      <th style={{ padding: '12px' }}>Date</th>
                      <th style={{ padding: '12px' }}>Subtotal</th>
                      <th style={{ padding: '12px' }}>GST (18%)</th>
                      <th style={{ padding: '12px' }}>Grand Total</th>
                      <th style={{ padding: '12px' }}>Authorization</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingItems.map((inv, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#0F172A' }}>{inv.invoiceNumber}</td>
                        <td style={{ padding: '12px', color: '#0369A1' }}>{inv.quoteRef}</td>
                        <td style={{ padding: '12px', color: '#64748B' }}>{inv.date}</td>
                        <td style={{ padding: '12px' }}>₹{Number(inv.subtotal).toLocaleString('en-IN')}</td>
                        <td style={{ padding: '12px', color: '#64748B' }}>₹{Number(inv.taxTotal).toLocaleString('en-IN')}</td>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#0F172A' }}>₹{Number(inv.grandTotal).toLocaleString('en-IN')}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ background: '#F0FDF4', color: '#16A34A', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                            ✓ {inv.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              type="button"
                              className="btn btn--sm"
                              style={{ padding: '4px 8px', fontSize: '11px', background: '#25D366', color: '#FFFFFF', border: 'none' }}
                              onClick={() => handleRequestInvoiceWhatsApp(inv.rawId, inv.invoiceNumber)}
                              disabled={sendingInvoiceId === inv.rawId}
                              title="Receive Invoice on WhatsApp from Riya Shah"
                            >
                              {sendingInvoiceId === inv.rawId ? 'Sending...' : '💬 Send WhatsApp'}
                            </button>
                            <a
                              href={`mailto:riyashah@lotustubes.com?subject=Billing inquiry for Invoice ${inv.invoiceNumber}`}
                              className="btn btn--outline-dark btn--sm"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                            >
                              ✉️ Email Riya
                            </a>
                            <a
                              href={inv.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn--outline btn--sm"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                            >
                              📄 PDF
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🧾</div>
                <h4 style={{ margin: '0 0 6px 0', color: '#0F172A' }}>No Active Invoices</h4>
                <p style={{ color: '#64748B', maxWidth: '400px', margin: '0 auto 16px auto', fontSize: '13px' }}>
                  Commercial invoices are generated automatically once an RFQ or quotation is approved by Super Admin Chirag Shah.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Inquiries & Support */}
        {activeTab === 'support' && (
          <div className="card" style={{ background: '#FFFFFF', padding: '24px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0F172A', fontSize: '1.15rem' }}>Customer Inquiries &amp; Technical Helpdesk</h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '13px' }}>
                  Managed by <strong>Neha Desai</strong>. Inquiries are reviewed by engineering staff and require mandatory Super Admin confirmation prior to dispatch.
                </p>
              </div>
            </div>

            <div style={{ background: '#F8FAFC', borderLeft: '4px solid #0284C7', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 6px 0', color: '#0284C7', fontSize: '0.95rem' }}>
                🛡️ Human-in-the-Loop Verification Protocol
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                Every inquiry submitted through the Contact Us form is received by <strong>Neha Desai</strong> and routed to our engineering staff. Before any reply is sent to you on WhatsApp or email, it must be verified and approved by <strong>Super Admin Chirag Shah</strong>. This ensures 100% metallurgical and commercial accuracy.
              </p>
            </div>

            {(quotesData.enquiries || []).length > 0 ? (
              <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                      <th style={{ padding: '12px' }}>Ticket Ref</th>
                      <th style={{ padding: '12px' }}>Subject / Component</th>
                      <th style={{ padding: '12px' }}>Submitted Date</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(quotesData.enquiries || []).map((enq, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#0F172A' }}>{enq.reference || 'LT-CNT'}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 600 }}>{enq.productName || 'General Sourcing Inquiry'}</div>
                          <small style={{ color: '#64748B' }}>Assigned Agent: Neha Desai</small>
                        </td>
                        <td style={{ padding: '12px', color: '#64748B' }}>{new Date(enq.createdAt || Date.now()).toLocaleDateString()}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ background: '#E0F2FE', color: '#0369A1', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                            {enq.status || 'Under Staff Review'}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              type="button"
                              className="btn btn--outline btn--sm"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                              onClick={() => openLiveChat(`Hello Arjun, what is the status of my ticket ${enq.reference}?`)}
                            >
                              ⚡ Check via Arjun
                            </button>
                            <a
                              href={`mailto:nehadesai@lotustubes.com?subject=Regarding Ticket ${enq.reference}`}
                              className="btn btn--outline-dark btn--sm"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                            >
                              ✉️ Email Neha
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="/contact" className="btn btn--primary btn--sm">
                Submit New Inquiry to Neha Desai &rarr;
              </a>
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={() => openLiveChat('Hello Arjun, I would like to check on my Contact Us inquiry.')}
              >
                Track Inquiry via Arjun Yadav
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerAccountView;

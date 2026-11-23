import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { Loader } from '../components/common/Loader';
import { AI_TEAM_MEMBERS } from '../data/siteData';
import { PasswordResetModal } from '../components/modals/PasswordResetModal';

export const CustomerAccountView = ({ onNotify }) => {
  const { user, logout } = useAuth();
  const [quotesData, setQuotesData] = useState({ enquiries: [], quotes: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('quotes'); // 'quotes' | 'billing' | 'support'
  const [sendingInvoiceId, setSendingInvoiceId] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);

  // Synchronize document.title dynamically with active customer portal tab
  useEffect(() => {
    const tabTitles = {
      quotes: 'My Quotations & RFQs | Customer Portal | Lotus Tubes',
      billing: 'Tax Invoices & Billing | Customer Portal | Lotus Tubes',
      support: 'Support Enquiries & Live Help | Customer Portal | Lotus Tubes'
    };
    document.title = tabTitles[activeTab] || 'Customer Account & Orders Portal | Lotus Tubes';
  }, [activeTab]);

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
      assignedAgent: 'Anjali Pandey',
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
      assignedAgent: 'Anjali Pandey',
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

  if (!user) {
    return (
      <div className="site-container section" style={{ maxWidth: '540px', padding: '60px 20px', textAlign: 'center' }}>
        <div className="card" style={{ background: '#FFFFFF', padding: '36px 28px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔒</div>
          <h2 style={{ margin: '0 0 8px 0', color: '#0F172A', fontSize: '1.4rem' }}>Customer Authentication Required</h2>
          <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
            Please sign in to access your verified quotations, formal BOQs, tax invoices, and dedicated AI team portfolio.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#login" className="btn btn--primary" style={{ padding: '10px 20px' }}>
              Sign In to Account →
            </a>
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="btn btn--outline"
              style={{ padding: '10px 20px' }}
            >
              Reset Password
            </button>
          </div>
        </div>
        <PasswordResetModal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
          portalMode="customer"
          onNotify={onNotify}
        />
      </div>
    );
  }

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
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => setShowResetModal(true)}
            >
              🔑 Change Password
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

        {/* Dedicated 4 AI Staff Profiles - Premium Corporate Portfolio Grid */}
        <section
          aria-labelledby="assigned-team-heading"
          className="card mb-8"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#0284C7', letterSpacing: '0.08em', background: '#F0F9FF', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #BAE6FD' }}>
                <span>🛡️</span> Supervised Client Operations Desk
              </div>
              <h3 id="assigned-team-heading" style={{ margin: '8px 0 4px 0', color: '#0F172A', fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                Your Dedicated Account Management Team
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748B', maxWidth: '680px', lineHeight: 1.5 }}>
                Our specialized AI representatives manage quotation evaluations, commercial billing, technical documentation, and order dispatches with guaranteed 24-hour turnaround under Super Admin oversight.
              </p>
            </div>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '8px 14px', textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Executive Direction</div>
              <div style={{ fontSize: '12px', color: '#0F172A', fontWeight: 700 }}>Chirag Shah • Managing Director</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
            {AI_TEAM_MEMBERS.map((bot) => (
              <article
                key={bot.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
                }}
              >
                {/* Portrait Frame with Generous Headroom and Calibrated Focal Point */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '240px',
                    background: 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={bot.photo}
                    alt={bot.name + ' - ' + bot.role + ' (AI Representative)'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: bot.focalPoint || 'center 7%',
                      display: 'block'
                    }}
                    loading="lazy"
                  />
                  {/* Department Pill */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(6px)',
                      color: '#0369A1',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: '1px solid #BAE6FD',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    {bot.department || 'Operations'}
                  </div>

                  {/* Status Pill */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(240, 253, 244, 0.95)',
                      color: '#15803D',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      border: '1px solid #BBF7D0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }} />
                    {bot.status?.split('•')[0]?.trim() || 'Available'}
                  </div>
                </div>

                {/* Card Information Body */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.25, marginBottom: '4px' }}>
                    {bot.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#0284C7', fontWeight: 700, lineHeight: 1.35, marginBottom: '8px' }}>
                    {bot.role}
                  </div>

                  {/* AI Representative Disclosure */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: '#64748B', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '2px 8px', borderRadius: '4px', alignSelf: 'flex-start', marginBottom: '10px' }}>
                    <span>🤖</span> AI Representative • Supervised
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5, margin: '0 0 12px 0', flex: 1 }}>
                    {bot.summary}
                  </p>

                  {/* Key Channels */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                    {(bot.channels || []).slice(0, 2).map((ch, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '10px',
                          color: '#1E40AF',
                          background: '#EFF6FF',
                          border: '1px solid #DBEAFE',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 600
                        }}
                      >
                        {ch}
                      </span>
                    ))}
                  </div>

                  {/* Direct Contact Button */}
                  <a
                    href={'mailto:' + bot.email}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontSize: '0.74rem',
                      fontFamily: 'ui-monospace, monospace',
                      color: '#0369A1',
                      background: '#F0F9FF',
                      border: '1px solid #BAE6FD',
                      borderRadius: '8px',
                      padding: '7px 10px',
                      textDecoration: 'none',
                      fontWeight: 700,
                      transition: 'background 0.15s ease'
                    }}
                    title={'Direct Email to ' + bot.name}
                  >
                    ✉️ {bot.email}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

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
            📊 Quotations &amp; RFQs (Anjali Pandey)
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
                  Handled by <strong>Anjali Pandey</strong>. Quotations are dispatched via email and WhatsApp upon Super Admin confirmation.
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
                                `Hello Anjali Pandey, I would like an update on my quotation request ${item.id} for ${item.product}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn--sm"
                              style={{ padding: '4px 8px', fontSize: '11px', background: '#25D366', color: '#FFFFFF', border: 'none' }}
                              title="Chat with Anjali Pandey on WhatsApp"
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

      <PasswordResetModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        portalMode="customer"
        initialEmail={user?.email || ''}
        onNotify={onNotify}
      />
    </>
  );
};

export default CustomerAccountView;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

export const CustomerAccountView = ({ onNotify }) => {
  const { user, logout } = useAuth();
  const [quotesData, setQuotesData] = useState({ enquiries: [], quotes: [] });
  const [loading, setLoading] = useState(true);

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

  const allItems = [
    ...(quotesData.enquiries || []).map((e) => ({
      id: e.reference || e._id,
      type: 'Product Quotation',
      product: e.productName || 'Sanitary Component',
      quantity: e.quantity,
      grade: e.grade,
      date: new Date(e.createdAt || Date.now()).toLocaleDateString(),
      status: e.status || 'New Lead',
      emailStatus: e.emailStatus || 'pending',
      samplePdfUrl: e.samplePdfUrl || '/sample-quotation.pdf'
    })),
    ...(quotesData.quotes || []).map((q) => ({
      id: q.reference || q._id,
      type: 'Detailed BOQ',
      product: q.projectType || 'Sanitary Piping',
      quantity: 'BOQ Schedule',
      grade: q.materialGrade,
      date: new Date(q.createdAt || Date.now()).toLocaleDateString(),
      status: q.status || 'Received',
      emailStatus: q.emailStatus || 'pending',
      samplePdfUrl: q.samplePdfUrl || '/sample-quotation.pdf'
    }))
  ];

  return (
    <>
      <section className="page-hero">
        <div className="site-container">
          <span className="badge badge--pink mb-2">Customer Account</span>
          <h1 className="page-hero-title">My Quotation Requests</h1>
          <p className="page-hero-subtitle">
            Welcome back, <strong>{user?.name || 'Customer'}</strong>. Track your submitted quotations and sample documents.
          </p>
        </div>
      </section>

      <div className="site-container section" style={{ maxWidth: '1000px' }}>
        {/* Profile Card */}
        <div className="card mb-3" style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E3E8EF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--deep-navy)', fontSize: '1.2rem' }}>{user?.name}</h3>
            <p style={{ margin: '4px 0', color: '#667085', fontSize: '14px' }}>
              <strong>Company:</strong> {user?.company || 'Individual / Contractor'} • <strong>Email:</strong> {user?.email} {user?.phone ? `• Phone: ${user?.phone}` : ''}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="/products" className="btn btn--primary btn--sm">
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

        {/* Quotation Requests List */}
        <div className="card" style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E3E8EF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#10263D', fontSize: '1.2rem' }}>Submitted RFQs & Status</h3>
            <span style={{ fontSize: '13px', color: '#667085' }}>Total: {allItems.length} requests</span>
          </div>

          {loading ? (
            <div style={{ padding: '36px', textAlign: 'center', color: '#667085' }}>
              Loading your quotation records...
            </div>
          ) : allItems.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E3E8EF' }}>
                    <th style={{ padding: '12px' }}>Reference</th>
                    <th style={{ padding: '12px' }}>Product / Project</th>
                    <th style={{ padding: '12px' }}>Grade & Qty</th>
                    <th style={{ padding: '12px' }}>Date</th>
                    <th style={{ padding: '12px' }}>Request Status</th>
                    <th style={{ padding: '12px' }}>Sample PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {allItems.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #E3E8EF' }}>
                      <td style={{ padding: '12px', fontWeight: 600, color: 'var(--deep-navy)' }}>
                        {item.id}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div><strong>{item.product}</strong></div>
                        <small style={{ color: '#667085' }}>{item.type}</small>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div>{item.grade}</div>
                        <small style={{ color: '#667085' }}>Qty: {item.quantity}</small>
                      </td>
                      <td style={{ padding: '12px', color: '#667085' }}>{item.date}</td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            background: '#E0F2FE',
                            color: '#0369A1',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <a
                          href={item.samplePdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn--outline-dark btn--sm"
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                        >
                          📄 Sample PDF
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📑</div>
              <h4 style={{ color: '#10263D', marginBottom: '8px' }}>No Quotation Requests Yet</h4>
              <p style={{ color: '#667085', maxWidth: '440px', margin: '0 auto 20px auto' }}>
                You have not submitted any quotation requests under this account. Explore our product catalogue and click "Request Official Quotation".
              </p>
              <a href="/products" className="btn btn--primary">
                Explore Sanitary Catalogue &rarr;
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerAccountView;

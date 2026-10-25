import React, { useState, useMemo } from 'react';
import { CRMIcon } from '../components/CRMIcon';

export const CRMQuotationsView = ({
  quotations = [],
  searchQuery = '',
  onSelectQuote,
  onSendQuoteEmail,
  onOpenQuoteBuilder
}) => {
  const [statusFilter, setStatusFilter] = useState('All');

  const quoteStatuses = ['All', 'Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'];

  // Summary calculation
  const totalValue = quotations.reduce(
    (acc, q) => acc + (Number(q.grandTotal) || 0),
    0
  );
  const sentCount = quotations.filter((q) => q.status === 'Sent').length;
  const acceptedCount = quotations.filter((q) => q.status === 'Accepted').length;

  const filteredQuotes = useMemo(() => {
    return quotations.filter((q) => {
      if (statusFilter !== 'All' && (q.status || 'Draft') !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches =
          q.quotationNumber?.toLowerCase().includes(query) ||
          q.reference?.toLowerCase().includes(query) ||
          q.customerName?.toLowerCase().includes(query) ||
          q.company?.toLowerCase().includes(query) ||
          q.email?.toLowerCase().includes(query) ||
          q.phone?.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    });
  }, [quotations, statusFilter, searchQuery]);

  const renderStatusBadge = (status) => {
    const s = status || 'Draft';
    const cls = s.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return <span className={`crm-status-pill crm-status-${cls}`}>{s}</span>;
  };

  const renderDeliveryBadge = (status) => {
    const map = {
      sent: { label: 'Sent', cls: 'crm-badge-green' },
      delivered: { label: 'Delivered', cls: 'crm-badge-green' },
      failed: { label: 'Failed', cls: 'crm-badge-red' },
      not_configured: { label: 'Manual', cls: 'crm-badge-gray' },
      pending: { label: 'Pending', cls: 'crm-badge-amber' }
    };
    const s = map[status] || { label: status || '—', cls: 'crm-badge-gray' };
    return <span className={`crm-badge ${s.cls}`}>{s.label}</span>;
  };

  return (
    <div className="crm-workspace-view">
      {/* Quotation Pipeline Metrics Bar */}
      <div className="crm-kpi-grid" style={{ marginBottom: '16px' }}>
        <div className="crm-kpi-card">
          <div className="crm-kpi-card__top">
            <span className="crm-kpi-card__label">Total Quotations Issued</span>
            <div className="crm-kpi-card__icon icon-amber">
              <CRMIcon name="quotations" size={20} />
            </div>
          </div>
          <div className="crm-kpi-card__val">{quotations.length}</div>
          <div className="crm-kpi-card__sub">
            <span className="crm-trend-chip neutral">{sentCount} awaiting approval</span>
          </div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-card__top">
            <span className="crm-kpi-card__label">Total Pipeline Quoted</span>
            <div className="crm-kpi-card__icon icon-blue">
              <CRMIcon name="download" size={20} />
            </div>
          </div>
          <div className="crm-kpi-card__val">
            ₹{totalValue > 0 ? (totalValue >= 100000 ? `${(totalValue / 100000).toFixed(2)} Lakhs` : totalValue.toLocaleString('en-IN')) : '0'}
          </div>
          <div className="crm-kpi-card__sub">
            <span className="crm-trend-chip positive">Commercial value stored in DB</span>
          </div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-card__top">
            <span className="crm-kpi-card__label">Accepted Orders</span>
            <div className="crm-kpi-card__icon icon-green">
              <CRMIcon name="check" size={20} />
            </div>
          </div>
          <div className="crm-kpi-card__val">{acceptedCount}</div>
          <div className="crm-kpi-card__sub">
            <span className="crm-trend-chip positive">
              Win Rate: {quotations.length > 0 ? `${((acceptedCount / quotations.length) * 100).toFixed(1)}%` : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar Card */}
      <div className="crm-card crm-toolbar-card">
        <div className="crm-toolbar-row">
          <div className="crm-filter-chips" role="tablist">
            {quoteStatuses.map((st) => {
              const count = st === 'All'
                ? quotations.length
                : quotations.filter((q) => (q.status || 'Draft') === st).length;

              return (
                <button
                  key={st}
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === st}
                  className={`crm-filter-chip ${statusFilter === st ? 'active' : ''}`}
                  onClick={() => setStatusFilter(st)}
                >
                  <span>{st}</span>
                  <span className="chip-count">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="crm-toolbar-actions">
            <button
              type="button"
              className="crm-btn crm-btn-primary crm-btn-sm"
              onClick={() => onOpenQuoteBuilder(null)}
              title="Create new formal proforma quotation"
            >
              <CRMIcon name="plus" size={14} />
              <span>+ Create Formal Quotation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="crm-card" style={{ marginTop: '16px' }}>
        <div className="crm-card__header">
          <div className="crm-card__header-title">
            <CRMIcon name="quotations" size={18} />
            <h3>Formal Quotations &amp; BOQ Submissions</h3>
            <span className="crm-badge crm-badge-amber">
              {filteredQuotes.length} quotes
            </span>
          </div>
        </div>

        <div className="crm-card__body" style={{ padding: 0 }}>
          {filteredQuotes.length === 0 ? (
            <div className="crm-empty-state" style={{ padding: '48px 24px' }}>
              <CRMIcon name="quotations" size={40} className="empty-icon" />
              <h4>No quotations found</h4>
              <p>Create a formal quotation directly from an inbound enquiry or build a custom BOQ.</p>
              <button
                type="button"
                className="crm-btn crm-btn-primary crm-btn-sm"
                onClick={() => onOpenQuoteBuilder(null)}
              >
                + Create First Quotation
              </button>
            </div>
          ) : (
            <div className="crm-table-container">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Quote Ref #</th>
                    <th>Date</th>
                    <th>Customer &amp; Company</th>
                    <th>BOQ Line Items</th>
                    <th>Grand Total</th>
                    <th>Validity</th>
                    <th>Status</th>
                    <th>Email Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((q) => (
                    <tr key={q._id}>
                      <td className="crm-td-ref">
                        <button
                          type="button"
                          className="crm-ref-link"
                          onClick={() => onSelectQuote(q)}
                          title="View formal letterhead quotation"
                        >
                          {q.quotationNumber || q.reference}
                        </button>
                        <span className="crm-version-tag">v{q.version || 1}</span>
                      </td>
                      <td className="crm-td-date">
                        {new Date(q.createdAt || Date.now()).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td>
                        <div className="crm-cell-title">{q.customerName}</div>
                        <div className="crm-cell-sub">{q.company || 'Direct Buyer'}</div>
                      </td>
                      <td>
                        <span className="crm-badge crm-badge-gray">
                          {q.lineItems?.length || 1} items
                        </span>
                      </td>
                      <td className="crm-td-amount">
                        <strong>
                          {q.currency || 'INR'} {Number(q.grandTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </strong>
                      </td>
                      <td>
                        <span className="crm-cell-sub">
                          {q.validityDays || 15} Days
                        </span>
                      </td>
                      <td>{renderStatusBadge(q.status)}</td>
                      <td>{renderDeliveryBadge(q.emailStatus)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="crm-table-actions">
                          <button
                            type="button"
                            className="crm-btn crm-btn-xs crm-btn-outline"
                            onClick={() => onSelectQuote(q)}
                            title="View letterhead & print PDF"
                          >
                            <CRMIcon name="eye" size={13} />
                            <span>Letterhead</span>
                          </button>
                          <button
                            type="button"
                            className="crm-btn crm-btn-xs crm-btn-secondary"
                            onClick={() => onSendQuoteEmail(q._id)}
                            title="Dispatch formal email to customer"
                          >
                            <CRMIcon name="mail" size={13} />
                            <span>Email</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CRMQuotationsView;

import React, { useState, useMemo } from 'react';
import { CRMIcon } from '../components/CRMIcon';
import { Loader } from '../../../components/common/Loader';

export const CRMQuotationsView = ({
  quotations = [],
  searchQuery = '',
  loading = false,
  user,
  isSuperAdmin = false,
  onSelectQuote,
  onSendQuoteEmail,
  onOpenQuoteBuilder,
  onSubmitForApproval,
  onApproveQuote,
  onRequestChangesQuote,
  onRejectQuote
}) => {
  const [statusFilter, setStatusFilter] = useState('All');

  const quoteStatuses = [
    'All',
    'Draft',
    'Pending Approval',
    'Approved',
    'Changes Requested',
    'Sent',
    'Accepted',
    'Rejected'
  ];

  // Summary calculation
  const totalValue = quotations.reduce(
    (acc, q) => acc + (Number(q.grandTotal) || 0),
    0
  );
  const pendingCount = quotations.filter((q) => q.status === 'Pending Approval').length;
  const approvedCount = quotations.filter((q) => q.status === 'Approved').length;
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

  const renderDeliveryBadge = (status, quoteStatus) => {
    if (quoteStatus !== 'Approved' && quoteStatus !== 'Sent' && quoteStatus !== 'Accepted') {
      return (
        <span
          className="crm-badge crm-badge-amber"
          title="Mandatory Super Admin approval required prior to customer email dispatch"
        >
          🔒 Approval Required
        </span>
      );
    }

    const map = {
      sent: { label: 'Dispatched', cls: 'crm-badge-green' },
      delivered: { label: 'Delivered', cls: 'crm-badge-green' },
      failed: { label: 'Failed', cls: 'crm-badge-red' },
      not_configured: { label: 'Manual/Ready', cls: 'crm-badge-gray' },
      pending: { label: 'Pending', cls: 'crm-badge-amber' }
    };
    const s = map[status] || { label: status || 'Ready to Send', cls: 'crm-badge-green' };
    return <span className={`crm-badge ${s.cls}`}>{s.label}</span>;
  };

  return (
    <div className="crm-workspace-view">
      {/* Quotation Pipeline Metrics Bar */}
      <div className="crm-kpi-grid" style={{ marginBottom: '16px' }}>
        <div className="crm-kpi-card">
          <div className="crm-kpi-card__top">
            <span className="crm-kpi-card__label">Total Quotations</span>
            <div className="crm-kpi-card__icon icon-blue">
              <CRMIcon name="quotations" size={20} />
            </div>
          </div>
          <div className="crm-kpi-card__val">{quotations.length}</div>
          <div className="crm-kpi-card__sub">
            <span className="crm-trend-chip neutral">{approvedCount} approved • {sentCount} sent</span>
          </div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-card__top">
            <span className="crm-kpi-card__label">Awaiting Super Admin Approval</span>
            <div className="crm-kpi-card__icon icon-amber">
              <CRMIcon name="alert" size={20} />
            </div>
          </div>
          <div className="crm-kpi-card__val" style={{ color: pendingCount > 0 ? '#D97706' : '#10263D' }}>
            {pendingCount}
          </div>
          <div className="crm-kpi-card__sub">
            <span className={`crm-trend-chip ${pendingCount > 0 ? 'negative' : 'positive'}`}>
              {pendingCount > 0 ? 'Mandatory review required' : 'All quotes cleared'}
            </span>
          </div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-card__top">
            <span className="crm-kpi-card__label">Total Pipeline Value</span>
            <div className="crm-kpi-card__icon icon-green">
              <CRMIcon name="download" size={20} />
            </div>
          </div>
          <div className="crm-kpi-card__val">
            ₹{totalValue > 0 ? (totalValue >= 100000 ? `${(totalValue / 100000).toFixed(2)} Lakhs` : totalValue.toLocaleString('en-IN')) : '0'}
          </div>
          <div className="crm-kpi-card__sub">
            <span className="crm-trend-chip positive">{acceptedCount} Orders Confirmed</span>
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
            <h3>Formal Quotations & Commercial BOQ Pipeline</h3>
            <span className="crm-badge crm-badge-amber">
              {filteredQuotes.length} quotes
            </span>
          </div>
        </div>

        <div className="crm-card__body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '16px' }}>
              <Loader
                variant="skeleton-table"
                rows={6}
                label="Retrieving formal quotations and commercial BOQ records..."
              />
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="crm-empty-state" style={{ padding: '48px 24px' }}>
              <CRMIcon name="quotations" size={40} className="empty-icon" />
              <h4>No quotations found in this view</h4>
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
                    <th>Customer & Company</th>
                    <th>BOQ Line Items</th>
                    <th>Grand Total</th>
                    <th>Approval State</th>
                    <th>Customer Dispatch</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((q) => {
                    const isApproved = q.status === 'Approved';
                    const isPending = q.status === 'Pending Approval';
                    const isDraftOrChanges = q.status === 'Draft' || q.status === 'Changes Requested';

                    return (
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
                          <div>
                            {renderStatusBadge(q.status)}
                            {q.approvedByName && isApproved && (
                              <div style={{ fontSize: '10.5px', color: '#059669', marginTop: '2px', fontWeight: 500 }}>
                                ✓ Approved by {q.approvedByName}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>{renderDeliveryBadge(q.emailStatus, q.status)}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="crm-table-actions">
                            {/* Letterhead Modal */}
                            <button
                              type="button"
                              className="crm-btn crm-btn-xs crm-btn-outline"
                              onClick={() => onSelectQuote(q)}
                              title="View letterhead & print PDF"
                            >
                              <CRMIcon name="eye" size={13} />
                              <span>Letterhead</span>
                            </button>

                            {/* Submit for Approval (Draft / Changes Requested) */}
                            {isDraftOrChanges && onSubmitForApproval && (
                              <button
                                type="button"
                                className="crm-btn crm-btn-xs crm-btn-secondary"
                                onClick={() => onSubmitForApproval(q._id)}
                                title="Submit quotation for Super Admin approval"
                                style={{ background: '#0284C7', borderColor: '#0284C7', color: '#FFF' }}
                              >
                                <CRMIcon name="check" size={13} />
                                <span>Submit for Approval</span>
                              </button>
                            )}

                            {/* Review & Approve / Quick Actions for Super Admin on Pending */}
                            {isPending && isSuperAdmin && (
                              <button
                                type="button"
                                className="crm-btn crm-btn-xs crm-btn-primary"
                                onClick={() => onSelectQuote(q)}
                                title="Review quotation and grant Super Admin approval"
                                style={{ background: '#D97706', borderColor: '#D97706', color: '#FFF' }}
                              >
                                <CRMIcon name="alert" size={13} />
                                <span>Review & Approve</span>
                              </button>
                            )}

                            {/* Dispatch Email — ONLY enabled when status === 'Approved' */}
                            {isApproved ? (
                              <button
                                type="button"
                                className="crm-btn crm-btn-xs crm-btn-primary"
                                onClick={() => onSendQuoteEmail(q._id)}
                                title="Dispatch formal approved quotation to customer email"
                                style={{ background: '#059669', borderColor: '#059669' }}
                              >
                                <CRMIcon name="mail" size={13} />
                                <span>Dispatch Email</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="crm-btn crm-btn-xs crm-btn-outline"
                                disabled
                                title="Quotation must be Approved by Super Admin before customer dispatch"
                                style={{ opacity: 0.5, cursor: 'not-allowed', color: '#94A3B8' }}
                              >
                                <CRMIcon name="mail" size={13} />
                                <span>Email Locked</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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

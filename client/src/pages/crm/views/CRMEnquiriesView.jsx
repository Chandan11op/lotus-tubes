import React, { useState, useMemo } from 'react';
import { CRMIcon } from '../components/CRMIcon';

export const CRMEnquiriesView = ({
  enquiries = [],
  searchQuery = '',
  onSelectEnquiry,
  onStatusChange,
  onOpenQuoteBuilder,
  onOpenQuickEnquiry,
  onExportCSV
}) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'qty'

  const statuses = [
    'All',
    'New',
    'Contacted',
    'Quotation Sent',
    'Follow-up',
    'Negotiation',
    'Order Confirmed',
    'Lost',
    'On Hold'
  ];

  // Filtering and sorting logic
  const filteredEnquiries = useMemo(() => {
    return enquiries
      .filter((eq) => {
        // Status filter
        if (statusFilter !== 'All' && (eq.status || 'New') !== statusFilter) {
          return false;
        }
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            eq.reference?.toLowerCase().includes(q) ||
            eq.name?.toLowerCase().includes(q) ||
            eq.company?.toLowerCase().includes(q) ||
            eq.phone?.toLowerCase().includes(q) ||
            eq.email?.toLowerCase().includes(q) ||
            eq.productName?.toLowerCase().includes(q) ||
            eq.grade?.toLowerCase().includes(q) ||
            eq.location?.toLowerCase().includes(q);
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        }
        if (sortBy === 'qty') {
          return (Number(b.quantity) || 0) - (Number(a.quantity) || 0);
        }
        return 0;
      });
  }, [enquiries, statusFilter, searchQuery, sortBy]);

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

  const renderStatusBadge = (status) => {
    const s = status || 'New';
    const cls = s.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return <span className={`crm-status-pill crm-status-${cls}`}>{s}</span>;
  };

  return (
    <div className="crm-workspace-view">
      {/* Workspace Header Toolbar */}
      <div className="crm-card crm-toolbar-card">
        <div className="crm-toolbar-row">
          {/* Status Filter Chips */}
          <div className="crm-filter-chips" role="tablist">
            {statuses.map((st) => {
              const count = st === 'All'
                ? enquiries.length
                : enquiries.filter((e) => (e.status || 'New') === st).length;

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

          {/* Right Toolbar Actions */}
          <div className="crm-toolbar-actions">
            <select
              className="crm-select-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort enquiries"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="qty">Sort: Highest Quantity</option>
            </select>

            <button
              type="button"
              className="crm-btn crm-btn-secondary crm-btn-sm"
              onClick={onExportCSV}
              title="Export filtered records as CSV"
            >
              <CRMIcon name="download" size={14} />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              className="crm-btn crm-btn-primary crm-btn-sm"
              onClick={() => onOpenQuickEnquiry?.(null)}
              title="Log incoming enquiry"
            >
              <CRMIcon name="plus" size={14} />
              <span>Log RFQ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="crm-card" style={{ marginTop: '16px' }}>
        <div className="crm-card__header">
          <div className="crm-card__header-title">
            <CRMIcon name="enquiries" size={18} />
            <h3>
              {statusFilter === 'All' ? 'All Inbound Quotation RFQs' : `${statusFilter} RFQs`}
            </h3>
            <span className="crm-badge crm-badge-blue">
              {filteredEnquiries.length} records
            </span>
          </div>
        </div>

        <div className="crm-card__body" style={{ padding: 0 }}>
          {filteredEnquiries.length === 0 ? (
            <div className="crm-empty-state" style={{ padding: '48px 24px' }}>
              <CRMIcon name="enquiries" size={40} className="empty-icon" />
              <h4>No enquiries matching current filters</h4>
              <p>Try selecting a different status pill or clearing the search query.</p>
              {statusFilter !== 'All' && (
                <button
                  type="button"
                  className="crm-btn crm-btn-secondary crm-btn-sm"
                  onClick={() => setStatusFilter('All')}
                >
                  View All Enquiries
                </button>
              )}
            </div>
          ) : (
            <div className="crm-table-container">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Date</th>
                    <th>Customer & Company</th>
                    <th>Product & Specification</th>
                    <th>Qty</th>
                    <th>Email Status</th>
                    <th>WhatsApp Status</th>
                    <th>Lead Status</th>
                    <th>Update Status</th>
                    <th style={{ textAlign: 'right' }}>Quick Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnquiries.map((eq) => (
                    <tr key={eq._id}>
                      <td className="crm-td-ref">
                        <button
                          type="button"
                          className="crm-ref-link"
                          onClick={() => onSelectEnquiry(eq)}
                          title="Inspect details and notes"
                        >
                          {eq.reference}
                        </button>
                      </td>
                      <td className="crm-td-date">
                        {new Date(eq.createdAt || Date.now()).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td>
                        <div className="crm-cell-title">{eq.name}</div>
                        <div className="crm-cell-sub">
                          {eq.company || 'Direct Buyer'} • {eq.phone}
                        </div>
                      </td>
                      <td>
                        <div className="crm-cell-title">{eq.productName}</div>
                        <div className="crm-cell-sub">
                          Grade: <strong>{eq.grade || 'SS 316L'}</strong>
                          {eq.finish ? ` • Finish: ${eq.finish}` : ''}
                        </div>
                      </td>
                      <td className="crm-td-number">
                        <strong>{eq.quantity || '—'}</strong>
                      </td>
                      <td>{renderDeliveryBadge(eq.emailStatus)}</td>
                      <td>{renderDeliveryBadge(eq.whatsappStatus)}</td>
                      <td>{renderStatusBadge(eq.status)}</td>
                      <td>
                        <select
                          className="crm-select-status"
                          value={eq.status || 'New'}
                          onChange={(e) => onStatusChange(eq._id, e.target.value)}
                          aria-label={`Change status for ${eq.reference}`}
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
                      <td style={{ textAlign: 'right' }}>
                        <div className="crm-table-actions">
                          <button
                            type="button"
                            className="crm-btn crm-btn-xs crm-btn-outline"
                            onClick={() => onSelectEnquiry(eq)}
                            title="Inspect enquiry notes and details"
                          >
                            Inspect
                          </button>
                          <button
                            type="button"
                            className="crm-btn crm-btn-xs crm-btn-primary"
                            onClick={() => onOpenQuoteBuilder(eq)}
                            title="Create formal quotation for this enquiry"
                          >
                            Quote
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

export default CRMEnquiriesView;

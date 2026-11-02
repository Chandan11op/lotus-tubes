import React, { useState, useMemo } from 'react';
import { CRMIcon } from '../components/CRMIcon';
import { Loader } from '../../../components/common/Loader';

export const CRMCustomersView = ({
  customers = [],
  searchQuery = '',
  loading = false,
  isSyncing = false,
  error = null,
  onRetry = null,
  onRefresh = null,
  onAddCustomer = null,
  onOpenQuickEnquiry
}) => {
  const [selectedTier, setSelectedTier] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    location: '',
    customerTier: 'Platinum',
    status: 'Active'
  });

  const tiers = ['All', 'Platinum', 'Gold', 'Silver'];

  const filteredCustomers = useMemo(() => {
    let list = customers;

    if (selectedTier !== 'All') {
      list = list.filter(
        (c) => (c.customerTier || '').toLowerCase() === selectedTier.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.company?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q) ||
          c.country?.toLowerCase().includes(q) ||
          c.location?.toLowerCase().includes(q) ||
          c.customerTier?.toLowerCase().includes(q) ||
          c.gstin?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [customers, selectedTier, searchQuery]);

  const handleCreateCustomerSubmit = async (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email) return;

    setIsSubmitting(true);
    try {
      if (onAddCustomer) {
        await onAddCustomer(newCustomer);
      }
      setShowAddModal(false);
      setNewCustomer({
        name: '',
        company: '',
        email: '',
        phone: '',
        location: '',
        customerTier: 'Platinum',
        status: 'Active'
      });
    } catch (err) {
      console.error('Failed to create customer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="crm-workspace-view">
      {/* Customer Directory Main Card */}
      <div className="crm-card">
        {/* Card Header with Tier Filters & Actions */}
        <div
          className="crm-card__header"
          style={{
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div className="crm-card__header-title" style={{ gap: '10px' }}>
            <CRMIcon name="customers" size={18} />
            <h3 style={{ margin: 0 }}>Customer Directory & Enterprise Accounts</h3>
            <span className="crm-badge crm-badge-blue">
              {filteredCustomers.length} accounts
            </span>
            {isSyncing && (
              <span
                className="crm-badge crm-badge-gray"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                title="Syncing records in background"
              >
                <Loader variant="inline" size="sm" color="#0284C7" />
                <span>Syncing</span>
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Tier Filter Chips */}
            <div className="crm-filter-chips" role="tablist" style={{ margin: 0 }}>
              {tiers.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={selectedTier === t}
                  className={`crm-filter-chip ${selectedTier === t ? 'active' : ''}`}
                  onClick={() => setSelectedTier(t)}
                >
                  <span>{t}</span>
                </button>
              ))}
            </div>

            {/* Refresh / Sync Button */}
            {onRefresh && (
              <button
                type="button"
                className="crm-btn crm-btn-secondary crm-btn-sm"
                onClick={onRefresh}
                disabled={isSyncing || loading}
                title="Sync directory with database"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <CRMIcon name="reports" size={13} className={isSyncing ? 'crm-spin-icon' : ''} />
                <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
              </button>
            )}

            {/* Add Customer Button */}
            <button
              type="button"
              className="crm-btn crm-btn-primary crm-btn-sm"
              onClick={() => setShowAddModal(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <CRMIcon name="plus" size={13} />
              <span>+ Add Customer</span>
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="crm-card__body" style={{ padding: 0 }}>
          {/* Error Banner with Retry */}
          {error && !loading && (
            <div
              style={{
                margin: '16px',
                padding: '12px 16px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#991B1B',
                fontSize: '13px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CRMIcon name="alert" size={16} />
                <span>{error}</span>
              </div>
              {onRetry && (
                <button
                  type="button"
                  className="crm-btn crm-btn-xs crm-btn-primary"
                  onClick={onRetry}
                >
                  Retry Connection
                </button>
              )}
            </div>
          )}

          {/* 1. Loading State: Shimmer Table Skeleton */}
          {loading ? (
            <div style={{ padding: '16px' }}>
              <Loader
                variant="skeleton-table"
                rows={6}
                label="Retrieving customer directory records..."
              />
            </div>
          ) : filteredCustomers.length === 0 ? (
            /* 2. Empty State */
            <div className="crm-empty-state" style={{ padding: '56px 24px', textAlign: 'center' }}>
              <CRMIcon name="customers" size={44} className="empty-icon" />
              <h4 style={{ margin: '12px 0 6px 0', color: '#10263D' }}>No customer records found</h4>
              <p style={{ margin: '0 0 16px 0', color: '#64748B', fontSize: '13.5px' }}>
                {searchQuery || selectedTier !== 'All'
                  ? 'No records match your active search filter.'
                  : 'Customers are automatically registered when enquiries or portal accounts are logged.'}
              </p>
              {(searchQuery || selectedTier !== 'All') && (
                <button
                  type="button"
                  className="crm-btn crm-btn-sm crm-btn-secondary"
                  onClick={() => setSelectedTier('All')}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            /* 3. Populated Customer Table */
            <div className="crm-table-container">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Company / Organization</th>
                    <th>Email Address</th>
                    <th>Phone / WhatsApp</th>
                    <th>Location</th>
                    <th>Account Tier</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((c) => (
                    <tr key={c._id || c.email}>
                      <td style={{ fontWeight: 600 }}>
                        <div className="crm-cell-title">{c.name}</div>
                        {c.designation && (
                          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 400 }}>
                            {c.designation}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="crm-cell-title">{c.company || '—'}</div>
                        {c.industry && (
                          <div style={{ fontSize: '11px', color: '#64748B' }}>
                            {c.industry}
                          </div>
                        )}
                      </td>
                      <td>
                        <a href={`mailto:${c.email}`} className="crm-ref-link">
                          {c.email}
                        </a>
                      </td>
                      <td>
                        <a href={`tel:${c.phone}`} className="crm-ref-link">
                          {c.phone || '—'}
                        </a>
                      </td>
                      <td>
                        <span className="crm-location-chip">
                          {c.location || c.country || 'India'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`crm-badge ${
                            c.customerTier === 'Platinum'
                              ? 'crm-badge-purple'
                              : c.customerTier === 'Gold'
                              ? 'crm-badge-amber'
                              : 'crm-badge-blue'
                          }`}
                        >
                          {c.customerTier || 'Standard'}
                        </span>
                      </td>
                      <td>
                        <span className="crm-status-pill crm-status-order-confirmed">
                          {c.status || 'Active'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="crm-table-actions">
                          {c.phone && (
                            <a
                              href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="crm-btn crm-btn-xs crm-btn-whatsapp"
                              title="Chat on WhatsApp"
                            >
                              <CRMIcon name="whatsapp" size={13} />
                              <span>WhatsApp</span>
                            </a>
                          )}
                          <button
                            type="button"
                            className="crm-btn crm-btn-xs crm-btn-primary"
                            onClick={() =>
                              onOpenQuickEnquiry?.({
                                name: c.name,
                                company: c.company,
                                email: c.email,
                                phone: c.phone
                              })
                            }
                            title="Log RFQ for this customer"
                          >
                            + RFQ
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

      {/* Add New Customer Modal */}
      {showAddModal && (
        <div
          className="crm-modal-backdrop visible"
          onClick={() => setShowAddModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="crm-modal"
            style={{ maxWidth: '520px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="crm-modal__header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CRMIcon name="customers" size={18} />
                <h3 style={{ margin: 0 }}>Register Customer Account</h3>
              </div>
              <button
                type="button"
                className="crm-modal-close"
                onClick={() => setShowAddModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateCustomerSubmit}>
              <div className="crm-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="crm-form-group">
                  <label>Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    placeholder="e.g. Rajesh Kulkarni"
                    className="crm-input"
                  />
                </div>

                <div className="crm-form-group">
                  <label>Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={newCustomer.company}
                    onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
                    placeholder="e.g. Cipla Limited"
                    className="crm-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="crm-form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      placeholder="procurement@company.com"
                      className="crm-input"
                    />
                  </div>
                  <div className="crm-form-group">
                    <label>Phone / WhatsApp</label>
                    <input
                      type="tel"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      placeholder="+91 98205 12345"
                      className="crm-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="crm-form-group">
                    <label>Location / City</label>
                    <input
                      type="text"
                      value={newCustomer.location}
                      onChange={(e) => setNewCustomer({ ...newCustomer, location: e.target.value })}
                      placeholder="e.g. Mumbai, Maharashtra"
                      className="crm-input"
                    />
                  </div>
                  <div className="crm-form-group">
                    <label>Account Tier</label>
                    <select
                      value={newCustomer.customerTier}
                      onChange={(e) => setNewCustomer({ ...newCustomer, customerTier: e.target.value })}
                      className="crm-select"
                    >
                      <option value="Platinum">Platinum</option>
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="crm-modal__footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="crm-btn crm-btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="crm-btn crm-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader variant="button" size="sm" color="#FFFFFF" label="Saving Customer..." />
                  ) : (
                    'Save Customer Record'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMCustomersView;

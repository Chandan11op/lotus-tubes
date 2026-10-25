import React, { useMemo } from 'react';
import { CRMIcon } from '../components/CRMIcon';

export const CRMCustomersView = ({
  customers = [],
  searchQuery = '',
  onOpenQuickEnquiry
}) => {
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.country?.toLowerCase().includes(q) ||
        c.customerTier?.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  return (
    <div className="crm-workspace-view">
      <div className="crm-card">
        <div className="crm-card__header">
          <div className="crm-card__header-title">
            <CRMIcon name="customers" size={18} />
            <h3>Customer Directory &amp; Enterprise Accounts</h3>
            <span className="crm-badge crm-badge-blue">
              {filteredCustomers.length} accounts
            </span>
          </div>
        </div>

        <div className="crm-card__body" style={{ padding: 0 }}>
          {filteredCustomers.length === 0 ? (
            <div className="crm-empty-state" style={{ padding: '48px 24px' }}>
              <CRMIcon name="customers" size={40} className="empty-icon" />
              <h4>No customer records found</h4>
              <p>Customers are automatically registered when enquiries or portal accounts are logged.</p>
            </div>
          ) : (
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
                    <tr key={c._id}>
                      <td style={{ fontWeight: 600 }}>
                        <div className="crm-cell-title">{c.name}</div>
                      </td>
                      <td>
                        <div className="crm-cell-title">{c.company || '—'}</div>
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
                          {c.country || 'India'}
                        </span>
                      </td>
                      <td>
                        <span className="crm-badge crm-badge-purple">
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
                            onClick={() => onOpenQuickEnquiry?.({ name: c.name, company: c.company, email: c.email, phone: c.phone })}
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
    </div>
  );
};

export default CRMCustomersView;

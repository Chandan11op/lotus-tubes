import React from 'react';
import { CRMIcon } from '../components/CRMIcon';

export const DEPARTMENT_LABELS = {
  sales: 'Sales & Commercial Operations',
  accounts: 'Commercial Accounts & Billing',
  inventory: 'Sourcing, Inventory & Dispatch',
  operations: 'Quality & Field Operations',
  management: 'Executive Management',
  client: 'Client Portal'
};

export const CRMStaffView = ({
  staffUsers = [],
  isSuperAdmin = false,
  onOpenStaffAppointment
}) => {
  if (!isSuperAdmin) {
    return (
      <div className="crm-card" style={{ padding: '36px', textAlign: 'center' }}>
        <CRMIcon name="alert" size={32} style={{ color: '#EF4444', marginBottom: '12px' }} />
        <h3>Access Restricted</h3>
        <p style={{ color: '#64748B' }}>
          Staff team management and RBAC configuration is restricted to Super Administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="crm-workspace-view">
      <div className="crm-card">
        <div className="crm-card__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="crm-card__header-title">
            <CRMIcon name="staff" size={18} />
            <h3>Authorized Staff Members & RBAC Permissions</h3>
            <span className="crm-badge crm-badge-red">
              {staffUsers.length} staff accounts
            </span>
          </div>

          {onOpenStaffAppointment && (
            <button
              type="button"
              className="crm-btn crm-btn-primary crm-btn-sm"
              onClick={onOpenStaffAppointment}
              title="Appoint a new staff member"
            >
              <CRMIcon name="plus" size={14} />
              <span>+ New Staff Appointment</span>
            </button>
          )}
        </div>

        <div className="crm-card__body" style={{ padding: 0 }}>
          <div className="crm-table-container">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Staff Member & Designation</th>
                  <th>Contact & Email</th>
                  <th>System Role</th>
                  <th>Department</th>
                  <th>Security Permissions</th>
                  <th>Date of Birth</th>
                  <th>Last Login</th>
                  <th>Account Status</th>
                </tr>
              </thead>
              <tbody>
                {staffUsers.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="crm-cell-title">{s.name}</div>
                      <div className="crm-cell-sub" style={{ color: '#0284C7', fontWeight: 500 }}>
                        {s.designation || 'Staff Executive'}
                      </div>
                    </td>
                    <td>
                      <div className="crm-ref-link">{s.email}</div>
                      {s.contactNumber && (
                        <div className="crm-cell-sub" style={{ color: '#475569' }}>
                          📞 {s.contactNumber}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`crm-role-badge ${s.role === 'admin' ? 'admin' : 'staff'}`}>
                        {s.role === 'admin' ? 'SUPER ADMIN' : 'STAFF'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                        {DEPARTMENT_LABELS[s.department?.toLowerCase()] || s.department || 'Sales & Commercial Operations'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {(s.permissions || ['read_enquiries', 'create_quotes']).map((p, idx) => (
                          <span key={idx} className="crm-badge crm-badge-gray">
                            {p === 'all' ? 'Full System Authority' : p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="crm-cell-sub">
                        {s.dateOfBirth
                          ? new Date(s.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                          : '—'}
                      </span>
                    </td>
                    <td>
                      <span className="crm-cell-sub">
                        {s.lastLoginAt
                          ? new Date(s.lastLoginAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                          : 'Never'}
                      </span>
                    </td>
                    <td>
                      <span className="crm-status-pill crm-status-order-confirmed">
                        {s.accountStatus || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMStaffView;

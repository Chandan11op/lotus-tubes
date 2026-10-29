import React from 'react';
import { CRMIcon } from '../components/CRMIcon';

export const CRMStaffView = ({
  staffUsers = [],
  isSuperAdmin = false
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
        <div className="crm-card__header">
          <div className="crm-card__header-title">
            <CRMIcon name="staff" size={18} />
            <h3>Authorized Staff Members & RBAC Permissions</h3>
            <span className="crm-badge crm-badge-red">
              {staffUsers.length} staff accounts
            </span>
          </div>
        </div>

        <div className="crm-card__body" style={{ padding: 0 }}>
          <div className="crm-table-container">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Email ID</th>
                  <th>System Role</th>
                  <th>Department</th>
                  <th>Security Permissions</th>
                  <th>Account Status</th>
                </tr>
              </thead>
              <tbody>
                {staffUsers.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="crm-cell-title">{s.name}</div>
                    </td>
                    <td>
                      <span className="crm-ref-link">{s.email}</span>
                    </td>
                    <td>
                      <span className={`crm-role-badge ${s.role === 'admin' ? 'admin' : 'staff'}`}>
                        {s.role === 'admin' ? 'SUPER ADMIN' : 'STAFF'}
                      </span>
                    </td>
                    <td>
                      <span style={{ textTransform: 'capitalize' }}>
                        {s.department || 'Sales Operations'}
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

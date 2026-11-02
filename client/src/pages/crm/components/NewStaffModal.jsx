import React, { useState } from 'react';
import { CRMIcon } from './CRMIcon';
import { Loader } from '../../../components/common/Loader';

export const NewStaffModal = ({ isOpen, onClose, onStaffCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    password: '',
    dateOfBirth: '',
    department: 'Sales Operations',
    designation: 'Technical Sales Executive',
    role: 'staff',
    permissions: ['read_enquiries', 'create_quotes']
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const ALL_PERMISSIONS = [
    { key: 'read_enquiries', label: 'View Enquiries & RFQs' },
    { key: 'create_quotes', label: 'Create & Edit Quotations' },
    { key: 'approve_quotes', label: 'Authorize & Approve Quotations' },
    { key: 'manage_staff', label: 'Staff Appointments & RBAC' },
    { key: 'export_data', label: 'Export System Datasets (CSV)' },
    { key: 'read_reports', label: 'Access Executive Analytics' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionToggle = (permKey) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permKey);
      const updated = exists
        ? prev.permissions.filter((p) => p !== permKey)
        : [...prev.permissions, permKey];
      return { ...prev, permissions: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.contactNumber.trim() || !formData.password) {
      setError('Please complete all mandatory appointment fields: Full Name, Email, Contact Number, and Initial Password.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Initial password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await onStaffCreated(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to appoint staff member.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="crm-modal-backdrop visible"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className="crm-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="New Staff Appointment"
        style={{ maxWidth: '640px' }}
      >
        <div className="crm-modal-dialog__header" style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7', padding: '8px', borderRadius: '8px', display: 'flex' }}>
              <CRMIcon name="staff" size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#10263D', fontWeight: 700 }}>
                Appoint New Staff Member
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
                Create official staff credentials, assign department role, and configure granular RBAC permissions.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="crm-modal-close"
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748B' }}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {error && (
            <div style={{ padding: '10px 14px', background: '#FEE2E2', border: '1px solid #F87171', borderRadius: '6px', color: '#B91C1C', fontSize: '13px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNumber"
                required
                placeholder="+91 98765 43210"
                value={formData.contactNumber}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Official Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="rahul@lotustubes.com"
                value={formData.email}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Initial Password *
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="Temporary secure password"
                value={formData.password}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box', background: '#FFF' }}
              >
                <option value="Sales Operations">Sales & Commercial Operations</option>
                <option value="Sourcing & Procurement">Sourcing & Mill Procurement</option>
                <option value="Quality & Inspection">Quality & MTC Inspection</option>
                <option value="Logistics & Dispatch">Logistics & Warehouse Dispatch</option>
                <option value="Executive Management">Executive Management</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Designation *
              </label>
              <input
                type="text"
                name="designation"
                placeholder="e.g. Senior Technical Sales Engineer"
                value={formData.designation}
                onChange={handleChange}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                System Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={(e) => {
                  const newRole = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    role: newRole,
                    permissions: newRole === 'admin'
                      ? ALL_PERMISSIONS.map((p) => p.key)
                      : prev.permissions
                  }));
                }}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box', background: '#FFF' }}
              >
                <option value="staff">Staff (Standard Authorized Role)</option>
                <option value="admin">Super Admin (Full Administrative Authority)</option>
              </select>
            </div>
          </div>

          {/* Granular RBAC Permissions */}
          <div style={{ marginBottom: '24px', background: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
              Granular Security & Operational Permissions
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {ALL_PERMISSIONS.map((p) => {
                const checked = formData.permissions.includes(p.key);
                return (
                  <label
                    key={p.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      color: '#475569',
                      cursor: 'pointer',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      background: checked ? '#F0F9FF' : 'transparent'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handlePermissionToggle(p.key)}
                      disabled={formData.role === 'admin'}
                      style={{ accentColor: '#0284C7' }}
                    />
                    <span>{p.label}</span>
                  </label>
                );
              })}
            </div>
            {formData.role === 'admin' && (
              <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#0284C7', fontWeight: 500 }}>
                Super Admin automatically receives full unrestricted system authority across all modules.
              </p>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              className="crm-btn crm-btn-outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="crm-btn crm-btn-primary"
              disabled={loading}
              style={{ minWidth: '160px' }}
            >
              {loading ? (
                <Loader variant="button" size="sm" color="#FFFFFF" label="Appointing Staff..." />
              ) : (
                '+ Confirm Appointment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewStaffModal;


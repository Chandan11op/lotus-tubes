import React from 'react';
import { CRMIcon } from './CRMIcon';

export const CRMSidebar = ({
  currentRoute = 'dashboard',
  onRouteChange,
  enquiryCount = 0,
  quoteCount = 0,
  pendingTaskCount = 0,
  user = null,
  isSuperAdmin = false,
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
  onLogout
}) => {
  const navSections = [
    {
      title: 'SALES & OPERATIONS',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', badge: null },
        { id: 'enquiries', label: 'Enquiries & RFQs', icon: 'enquiries', badge: enquiryCount > 0 ? { count: enquiryCount, color: 'blue' } : null },
        { id: 'quotations', label: 'Quotations & BOQ', icon: 'quotations', badge: quoteCount > 0 ? { count: quoteCount, color: 'amber' } : null },
        { id: 'customers', label: 'Customers & Directory', icon: 'customers', badge: null },
        { id: 'tasks', label: 'Tasks & Follow-ups', icon: 'tasks', badge: pendingTaskCount > 0 ? { count: pendingTaskCount, color: 'red' } : null }
      ]
    },
    {
      title: 'CATALOGUE & SPECS',
      items: [
        { id: 'products', label: 'Product Administration', icon: 'products', badge: null }
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        ...(isSuperAdmin ? [{ id: 'staff', label: 'Staff Team & RBAC', icon: 'staff', badge: null }] : []),
        { id: 'reports', label: 'Analytics & Reports', icon: 'reports', badge: null }
      ]
    }
  ];

  const handleNavClick = (id) => {
    if (onRouteChange) onRouteChange(id);
    window.location.hash = `#crm/${id}`;
    if (onCloseMobile) onCloseMobile();
  };

  const userInitials = (user?.name || 'Staff')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="crm-sidebar-backdrop visible"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        id="crm-sidebar"
        className={`crm-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
        aria-label="CRM Navigation"
      >
        {/* Brand Header */}
        <div className="crm-sidebar__header">
          <a href="#home" className="crm-sidebar__brand" title="Lotus Tubes - Return to Website">
            <div className="crm-sidebar__brand-logo">
              <img
                src="/Lotus Tubes Logo.png"
                alt="Lotus Tubes"
              />
            </div>
            {!collapsed && (
              <div className="crm-sidebar__brand-info">
                <span className="crm-sidebar__brand-title">LOTUS TUBES</span>
                <span className="crm-sidebar__brand-sub">Sanitary B2B Portal</span>
              </div>
            )}
          </a>
        </div>

        {/* User Card */}
        <div className="crm-sidebar__user">
          <div className="crm-sidebar__user-avatar" title={user?.name || 'User'}>
            {userInitials}
          </div>
          {!collapsed && (
            <div className="crm-sidebar__user-info">
              <div className="crm-sidebar__user-name" title={user?.name}>
                {user?.name || 'Authorized Staff'}
              </div>
              <div className="crm-sidebar__user-role">
                <span className={`crm-role-badge ${isSuperAdmin ? 'admin' : 'staff'}`}>
                  {isSuperAdmin ? 'SUPER ADMIN' : user?.department?.toUpperCase() || 'SALES STAFF'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="crm-sidebar__nav">
          {navSections.map((sec, secIdx) => (
            <div key={secIdx} className="crm-sidebar__section">
              {!collapsed && <div className="crm-sidebar__section-title">{sec.title}</div>}
              {sec.items.map((item) => {
                const isActive = currentRoute === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`crm-nav-item ${isActive ? 'active' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="crm-nav-item__icon">
                      <CRMIcon name={item.icon} size={18} />
                    </span>
                    {!collapsed && (
                      <span className="crm-nav-item__label">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className={`crm-nav-item__badge ${item.badge.color}`}>
                        {item.badge.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="crm-sidebar__footer">
          <a
            href="#home"
            className="crm-footer-link"
            title="Return to Public Website"
          >
            <span className="crm-nav-item__icon">
              <CRMIcon name="website" size={17} />
            </span>
            {!collapsed && <span>Public Website</span>}
          </a>

          <button
            type="button"
            onClick={onLogout}
            className="crm-footer-link logout"
            title="Sign out of CRM"
          >
            <span className="crm-nav-item__icon">
              <CRMIcon name="logout" size={17} />
            </span>
            {!collapsed && <span>Sign Out</span>}
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="crm-collapse-toggle"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <CRMIcon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={14} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default CRMSidebar;

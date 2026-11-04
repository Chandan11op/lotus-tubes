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
  isExpanded = true,
  isPinned = true,
  onTogglePin,
  onMouseEnter,
  onMouseLeave,
  collapsed,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
  onLogout
}) => {
  // Single source of truth for collapsed state:
  const isCurrentlyCollapsed = collapsed !== undefined ? collapsed : !isExpanded;

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
        { id: 'products', label: 'Product Administration', icon: 'products', badge: null },
        { id: 'videos', label: '360° Studio & Videos', icon: 'reports', badge: { count: '360°', color: 'blue' } }
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        ...(isSuperAdmin
          ? [
              { id: 'staff', label: 'Staff Team & RBAC', icon: 'staff', badge: null },
              { id: 'seo', label: 'SEO Audit & Meter', icon: 'seo', badge: { count: '94%', color: 'emerald' } }
            ]
          : []),
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

  const handleToggle = () => {
    if (onTogglePin) {
      onTogglePin();
    } else if (onToggleCollapse) {
      onToggleCollapse();
    }
  };

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
        className={`crm-sidebar ${isCurrentlyCollapsed ? 'collapsed' : 'expanded'} ${mobileOpen ? 'mobile-open' : ''}`}
        aria-label="CRM Navigation"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Brand Header */}
        <div className="crm-sidebar__header">
          <a href="#home" className="crm-sidebar__brand" title="Lotus Tubes - Return to Website">
            <div className="crm-sidebar__brand-logo">
              <img
                src="/new-logo-lotus-tubes-opt.png"
                alt="Lotus Tubes"
              />
            </div>
            {!isCurrentlyCollapsed && (
              <div className="crm-sidebar__brand-info">
                <span className="crm-sidebar__brand-title">LOTUS TUBES</span>
                <span className="crm-sidebar__brand-sub">Sanitary B2B Portal</span>
              </div>
            )}
          </a>
        </div>

        {/* User Card */}
        <div className="crm-sidebar__user">
          <div className="crm-sidebar__user-avatar" title={user?.name || 'Authorized Staff'}>
            {userInitials}
          </div>
          {!isCurrentlyCollapsed && (
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
        <div className="crm-sidebar__nav" role="navigation">
          {navSections.map((sec, secIdx) => (
            <div key={secIdx} className="crm-sidebar__section">
              {!isCurrentlyCollapsed && <div className="crm-sidebar__section-title">{sec.title}</div>}
              {sec.items.map((item) => {
                const isActive = currentRoute === item.id;
                const tooltipText = isCurrentlyCollapsed
                  ? `${item.label}${item.badge ? ` (${item.badge.count} pending)` : ''}`
                  : undefined;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`crm-nav-item ${isActive ? 'active' : ''}`}
                    title={tooltipText}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="crm-nav-item__icon">
                      <CRMIcon name={item.icon} size={18} />
                    </span>
                    {!isCurrentlyCollapsed && (
                      <span className="crm-nav-item__label">{item.label}</span>
                    )}
                    {!isCurrentlyCollapsed && item.badge && (
                      <span className={`crm-nav-item__badge ${item.badge.color}`}>
                        {item.badge.count}
                      </span>
                    )}
                    {isCurrentlyCollapsed && item.badge && (
                      <span
                        className={`crm-nav-item__badge-dot ${item.badge.color}`}
                        title={`${item.badge.count} items require attention`}
                      />
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
            {!isCurrentlyCollapsed && <span>Public Website</span>}
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
            {!isCurrentlyCollapsed && <span>Sign Out</span>}
          </button>

          {/* Desktop Collapse & Pin Toggle */}
          <button
            type="button"
            onClick={handleToggle}
            className={`crm-collapse-toggle ${isPinned ? 'pinned' : 'unpinned'}`}
            title={isCurrentlyCollapsed ? 'Expand sidebar (click to pin)' : isPinned ? 'Unpin & collapse navigation' : 'Pin navigation open'}
            aria-label={isCurrentlyCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-pressed={isPinned}
          >
            <CRMIcon name={isCurrentlyCollapsed ? 'chevronRight' : 'chevronLeft'} size={14} />
            {!isCurrentlyCollapsed && (
              <span className="crm-collapse-toggle__hint">
                {isPinned ? 'Pinned Open' : 'Hover Mode'}
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default CRMSidebar;

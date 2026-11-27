import React, { useEffect, useRef } from 'react';
import { CRMIcon } from './CRMIcon';

export const CRMHeader = ({
  currentRoute = 'dashboard',
  searchQuery = '',
  onSearchChange,
  onOpenQuickEnquiry,
  onOpenQuoteBuilder,
  onOpenStaffAppointment,
  onExportCSV,
  onToggleMobile,
  onRefresh,
  onLogout,
  user
}) => {
  const searchInputRef = useRef(null);

  const routeTitles = {
    dashboard: 'Executive Dashboard & Overview',
    enquiries: 'Enquiries & Quotation RFQs',
    quotations: 'Formal Quotations & BOQ Pipeline',
    customers: 'Customer Directory & Accounts',
    tasks: 'Sales Tasks & Action Reminders',
    products: 'Sanitary Product Catalogue',
    videos: 'Product Videos & Interactive 360° Studio',
    staff: 'Authorized Staff & RBAC',
    reports: 'Sales Analytics & Market Reports',
    emails: 'Email Communications Archive',
    whatsapp: 'WhatsApp Communications & AI Inbox',
    'news-social': 'Corporate News & LinkedIn Updates',
    'ai-operations': 'AI Operations Control Center',
    'agent-anjali': 'Anjali Pandey | Quotations & Sizing Desk',
    'agent-riya': 'Riya Shah | Commercial Billing & GST Desk',
    'agent-neha': 'Neha Desai | Inquiry Resolution Desk',
    'agent-arjun': 'Arjun Yadav | Operations & Live Concierge'
  };

  const title = routeTitles[currentRoute] || 'Operations';

  // Global Keyboard Shortcut: Ctrl+K or / focuses the search bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const userInitials = (user?.name || 'Staff')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const isSuperAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <header className="crm-header" role="banner">
      <div className="crm-header__left">
        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={onToggleMobile}
          className="crm-header__mobile-toggle"
          aria-label="Toggle navigation menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Breadcrumb & Title */}
        <div className="crm-header__breadcrumbs">
          <nav className="crm-header__crumb-path" aria-label="Breadcrumb">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CRMIcon name="building" size={13} color="#64748B" />
              <span>Lotus CRM</span>
            </span>
            <span className="crumb-sep" aria-hidden="true">/</span>
            <span className="crumb-active">
              {currentRoute === 'dashboard'
                ? 'Dashboard'
                : currentRoute.startsWith('agent-')
                ? 'AI Agent'
                : currentRoute.charAt(0).toUpperCase() + currentRoute.slice(1)}
            </span>
          </nav>
          <h1 className="crm-header__title" title={title}>{title}</h1>
        </div>
      </div>

      <div className="crm-header__right">
        {/* Global Search Bar with Keyboard Hint */}
        <div className="crm-search-box" role="search">
          <CRMIcon name="search" size={15} className="crm-search-icon" aria-hidden="true" />
          <input
            ref={searchInputRef}
            type="text"
            className="crm-search-input"
            placeholder="Search reference, customer, phone, grade... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search reference, customer, phone, grade"
          />
          {searchQuery ? (
            <button
              type="button"
              className="crm-search-clear"
              onClick={() => onSearchChange('')}
              title="Clear search"
              aria-label="Clear search query"
            >
              &times;
            </button>
          ) : (
            <kbd className="crm-search-kbd" title="Press Ctrl+K or / to search">Ctrl K</kbd>
          )}
        </div>

        {/* Action Controls - Ordered by Priority */}
        <div className="crm-header__actions">
          {/* Secondary Action: Export CSV */}
          <button
            type="button"
            className="crm-btn crm-btn-outline crm-action-secondary"
            onClick={onExportCSV}
            title="Download CSV spreadsheet of current records"
            aria-label="Export CSV spreadsheet"
          >
            <CRMIcon name="download" size={15} />
            <span className="btn-text">Export CSV</span>
          </button>

          {/* Primary Action 2: New Quote */}
          <button
            type="button"
            className="crm-btn crm-btn-secondary crm-action-primary"
            onClick={() => onOpenQuoteBuilder?.(null)}
            title="Create formal proforma quotation"
            aria-label="Create new proforma quote"
          >
            <CRMIcon name="quotes" size={15} />
            <span className="btn-text">+ New Quote</span>
          </button>

          {/* Primary Action 1: New Staff Appointment OR Log RFQ */}
          {currentRoute === 'staff' && isSuperAdmin ? (
            <button
              type="button"
              className="crm-btn crm-btn-primary crm-action-primary"
              onClick={() => onOpenStaffAppointment?.()}
              title="Appoint new staff member and configure permissions"
              aria-label="Appoint new staff member"
            >
              <CRMIcon name="staff" size={15} />
              <span className="btn-text">+ New Staff Appointment</span>
            </button>
          ) : (
            <button
              type="button"
              className="crm-btn crm-btn-primary crm-action-primary"
              onClick={() => onOpenQuickEnquiry?.(null)}
              title="Log new customer enquiry or RFQ"
              aria-label="Log new customer enquiry or RFQ"
            >
              <CRMIcon name="plus" size={15} />
              <span className="btn-text">+ Log RFQ</span>
            </button>
          )}
        </div>

        {/* Live Sync Status with optional manual refresh */}
        <div
          className="crm-header__live-status crm-action-secondary"
          title="MongoDB Atlas Connected & Synced (Click to Refresh)"
          onClick={onRefresh}
          style={{ cursor: onRefresh ? 'pointer' : 'default' }}
        >
          <span className="crm-status-dot online" aria-hidden="true" />
          <span className="crm-status-text">Live Sync</span>
          {onRefresh && (
            <CRMIcon name="refresh" size={12} color="#0284C7" className="crm-ml-1" />
          )}
        </div>

        {/* User Profile Pill in Header */}
        {user && (
          <div className="crm-header__user-pill" title={`${user.name || 'Staff'} (${isSuperAdmin ? 'Super Admin' : user.role || 'Staff'})`}>
            <div className="crm-header__user-avatar">{userInitials}</div>
            <div className="crm-header__user-meta">
              <span className="crm-header__user-name">{user.name || 'Staff User'}</span>
              <span className={`crm-header__user-role ${isSuperAdmin ? 'admin' : 'staff'}`}>
                {isSuperAdmin ? 'SUPER ADMIN' : (user.role || 'STAFF').toUpperCase()}
              </span>
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="crm-header__logout-btn"
                title="Sign out of CRM"
                aria-label="Sign out"
              >
                <CRMIcon name="logout" size={14} color="#64748B" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default CRMHeader;

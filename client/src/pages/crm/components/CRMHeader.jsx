import React from 'react';
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
  user
}) => {
  const routeTitles = {
    dashboard: 'Executive Dashboard & Overview',
    enquiries: 'Enquiries & Quotation RFQs',
    quotations: 'Formal Quotations & BOQ Pipeline',
    customers: 'Customer Directory & Accounts',
    tasks: 'Sales Tasks & Action Reminders',
    products: 'Sanitary Product Catalogue',
    staff: 'Authorized Staff & RBAC',
    reports: 'Sales Analytics & Market Reports'
  };

  const title = routeTitles[currentRoute] || 'Operations';

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
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Breadcrumb & Title */}
        <div className="crm-header__breadcrumbs">
          <nav className="crm-header__crumb-path" aria-label="Breadcrumb">
            <span>Lotus CRM</span>
            <span className="crumb-sep" aria-hidden="true">/</span>
            <span className="crumb-active">{currentRoute === 'dashboard' ? 'Dashboard' : currentRoute.charAt(0).toUpperCase() + currentRoute.slice(1)}</span>
          </nav>
          <h1 className="crm-header__title" title={title}>{title}</h1>
        </div>
      </div>

      <div className="crm-header__right">
        {/* Global Search Bar */}
        <div className="crm-search-box" role="search">
          <CRMIcon name="search" size={15} className="crm-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="crm-search-input"
            placeholder="Search reference, customer, phone, grade..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search reference, customer, phone, grade"
          />
          {searchQuery && (
            <button
              type="button"
              className="crm-search-clear"
              onClick={() => onSearchChange('')}
              title="Clear search"
              aria-label="Clear search query"
            >
              &times;
            </button>
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
            <CRMIcon name="quotations" size={15} />
            <span className="btn-text">+ New Quote</span>
          </button>

          {/* Primary Action 1: New Staff Appointment (in staff route for Super Admin) OR Log RFQ */}
          {currentRoute === 'staff' && (user?.role === 'admin' || user?.role === 'superadmin') ? (
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

        {/* Secondary System Indicator: Live Sync */}
        <div className="crm-header__live-status crm-action-secondary" title="MongoDB Atlas Connected & Synced">
          <span className="crm-status-dot online" aria-hidden="true" />
          <span className="crm-status-text">Live Sync</span>
        </div>
      </div>
    </header>
  );
};

export default CRMHeader;

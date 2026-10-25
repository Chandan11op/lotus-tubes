import React from 'react';
import { CRMIcon } from './CRMIcon';

export const CRMHeader = ({
  currentRoute = 'dashboard',
  searchQuery = '',
  onSearchChange,
  onOpenQuickEnquiry,
  onOpenQuoteBuilder,
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
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Breadcrumb & Title */}
        <div className="crm-header__breadcrumbs">
          <div className="crm-header__crumb-path">
            <span>Lotus CRM</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-active">{currentRoute}</span>
          </div>
          <h1 className="crm-header__title">{title}</h1>
        </div>
      </div>

      <div className="crm-header__right">
        {/* Global Search Bar */}
        <div className="crm-search-box">
          <CRMIcon name="search" size={15} className="crm-search-icon" />
          <input
            type="text"
            className="crm-search-input"
            placeholder="Search reference, customer, phone, grade..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search records"
          />
          {searchQuery && (
            <button
              type="button"
              className="crm-search-clear"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="crm-header__actions">
          <button
            type="button"
            className="crm-btn crm-btn-outline"
            onClick={onExportCSV}
            title="Download CSV spreadsheet of current records"
          >
            <CRMIcon name="download" size={15} />
            <span className="btn-text">Export CSV</span>
          </button>

          <button
            type="button"
            className="crm-btn crm-btn-secondary"
            onClick={() => onOpenQuoteBuilder?.(null)}
            title="Create formal proforma quotation"
          >
            <CRMIcon name="quotations" size={15} />
            <span className="btn-text">+ New Quote</span>
          </button>

          <button
            type="button"
            className="crm-btn crm-btn-primary"
            onClick={() => onOpenQuickEnquiry?.(null)}
            title="Log new customer enquiry or RFQ"
          >
            <CRMIcon name="plus" size={15} />
            <span className="btn-text">+ Log RFQ</span>
          </button>
        </div>

        {/* Live System Indicator */}
        <div className="crm-header__live-status" title="MongoDB Atlas Connected & Synced">
          <span className="crm-status-dot online" />
          <span className="crm-status-text">Live Sync</span>
        </div>
      </div>
    </header>
  );
};

export default CRMHeader;

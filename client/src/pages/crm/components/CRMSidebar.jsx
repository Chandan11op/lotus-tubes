import React, { useState, useEffect, useRef } from 'react';
import { CRMIcon } from './CRMIcon';

const DEPARTMENT_LABELS = {
  sales: 'Sales Operations',
  accounts: 'Commercial Accounts',
  inventory: 'Sourcing & Inventory',
  operations: 'Field Operations',
  management: 'Executive Management',
  client: 'Client Portal'
};

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
  onLogout,
  sidebarWidth = 260,
  onSidebarResize
}) => {
  // Single source of truth for collapsed state:
  const isCurrentlyCollapsed = collapsed !== undefined ? collapsed : !isExpanded;

  // Track dragging state for resize handle
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(sidebarWidth);

  // AI Workflows & Operations accordion state
  const isAiRoute = currentRoute === 'ai-operations' || currentRoute.startsWith('agent-');
  const [aiExpanded, setAiExpanded] = useState(true);

  // Automatically expand AI section when an agent dashboard is opened
  useEffect(() => {
    if (isAiRoute) {
      setAiExpanded(true);
    }
  }, [isAiRoute, currentRoute]);

  // Mouse Drag Resizing Handler
  const handleMouseDown = (e) => {
    if (isCurrentlyCollapsed || (typeof window !== 'undefined' && window.innerWidth <= 768)) return;
    e.preventDefault();
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.clientX;
    startWidthRef.current = sidebarWidth;

    document.body.classList.add('crm-resizing-active');

    const handleMouseMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      const delta = moveEvent.clientX - startXRef.current;
      const targetWidth = Math.max(220, Math.min(480, startWidthRef.current + delta));
      if (onSidebarResize) {
        onSidebarResize(targetWidth);
      }
    };

    const handleMouseUp = (upEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);
      document.body.classList.remove('crm-resizing-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      const delta = upEvent.clientX - startXRef.current;
      const finalWidth = Math.max(220, Math.min(480, startWidthRef.current + delta));
      if (typeof window !== 'undefined') {
        localStorage.setItem('lotus_crm_sidebar_width', String(finalWidth));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Keyboard Resizing Handler for Accessibility
  const handleResizerKeyDown = (e) => {
    if (isCurrentlyCollapsed) return;
    let nextWidth = sidebarWidth;
    if (e.key === 'ArrowRight') {
      nextWidth = Math.min(480, sidebarWidth + 12);
    } else if (e.key === 'ArrowLeft') {
      nextWidth = Math.max(220, sidebarWidth - 12);
    } else if (e.key === 'Home') {
      nextWidth = 260; // reset to default
    } else if (e.key === 'End') {
      nextWidth = 420;
    } else {
      return;
    }
    e.preventDefault();
    if (onSidebarResize) onSidebarResize(nextWidth);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lotus_crm_sidebar_width', String(nextWidth));
    }
  };

  // Double Click Resizer to Reset
  const handleResizerDoubleClick = () => {
    if (onSidebarResize) onSidebarResize(260);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lotus_crm_sidebar_width', '260');
    }
  };

  const AI_AGENTS_NAV = [
    {
      id: 'ai-operations',
      label: 'Control Center & Queue',
      sub: 'All 4 Agents Overview',
      icon: 'dashboard',
      badge: { count: 'All', color: 'slate' }
    },
    {
      id: 'agent-ananya',
      agentId: 'ananya-mehta',
      label: 'Ananya Mehta',
      sub: 'Quotations & Sizing',
      photo: '/assets/images/team/agent-1.jpeg',
      badge: { count: 'Agent 1', color: 'blue' }
    },
    {
      id: 'agent-riya',
      agentId: 'riya-shah',
      label: 'Riya Shah',
      sub: 'Commercial Billing & GST',
      photo: '/assets/images/team/agent-2.jpeg',
      badge: { count: 'Agent 2', color: 'amber' }
    },
    {
      id: 'agent-neha',
      agentId: 'neha-desai',
      label: 'Neha Desai',
      sub: 'Inquiry Resolution Desk',
      photo: '/assets/images/team/agent-3.jpeg',
      badge: { count: 'Agent 3', color: 'purple' }
    },
    {
      id: 'agent-arjun',
      agentId: 'arjun-yadav',
      label: 'Arjun Yadav',
      sub: 'Operations & Live Concierge',
      photo: '/assets/images/team/agent-4.jpeg',
      badge: { count: 'Agent 4', color: 'emerald' }
    }
  ];

  const standardNavSections = [
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
        // Task 3: 360° Studio & Videos removed from sidebar
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        ...(isSuperAdmin
          ? [
              { id: 'staff', label: 'Staff Team & RBAC', icon: 'staff', badge: null }
              // Task 4: SEO Audit & Meter removed from sidebar
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

  const userDeptLabel = user?.department
    ? DEPARTMENT_LABELS[user.department.toLowerCase()] || user.department.toUpperCase()
    : 'SALES OPERATIONS';

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
                src="/banner-image-opt.png"
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
                  {isSuperAdmin ? 'SUPER ADMIN' : userDeptLabel}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="crm-sidebar__nav" role="navigation">
          {/* TASK 2: AI Workflows & Operations Section with Expandable Agent Children */}
          <div className="crm-sidebar__section crm-sidebar__section--ai">
            {!isCurrentlyCollapsed ? (
              <button
                type="button"
                className="crm-sidebar__section-toggle"
                onClick={() => setAiExpanded((prev) => !prev)}
                title={aiExpanded ? 'Collapse AI Agents menu' : 'Expand AI Agents menu'}
                aria-expanded={aiExpanded}
              >
                <span className="crm-sidebar__section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>AI WORKFLOWS &amp; OPERATIONS</span>
                  <span className="crm-badge crm-badge-emerald" style={{ fontSize: '9px', padding: '1px 5px' }}>4 Bots</span>
                </span>
                <span className="crm-section-chevron" style={{ transform: aiExpanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s ease', display: 'flex' }}>
                  <CRMIcon name="chevronDown" size={12} />
                </span>
              </button>
            ) : null}

            {/* Individual AI Agents List */}
            {(aiExpanded || isCurrentlyCollapsed) && (
              <div className="crm-sidebar__ai-group" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {AI_AGENTS_NAV.map((agent) => {
                  const isActive = currentRoute === agent.id;
                  const tooltipText = isCurrentlyCollapsed
                    ? `${agent.label} (${agent.sub})`
                    : undefined;

                  return (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => handleNavClick(agent.id)}
                      className={`crm-nav-item crm-nav-item--agent ${isActive ? 'active' : ''}`}
                      title={tooltipText}
                      aria-label={`${agent.label} - ${agent.sub}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span className="crm-nav-item__icon">
                        {agent.photo ? (
                          <img
                            src={agent.photo}
                            alt={agent.label}
                            style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover', border: isActive ? '1px solid #38BDF8' : '1px solid rgba(255,255,255,0.2)' }}
                          />
                        ) : (
                          <CRMIcon name={agent.icon} size={18} />
                        )}
                      </span>
                      {!isCurrentlyCollapsed && (
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1, textAlign: 'left' }}>
                          <span className="crm-nav-item__label" style={{ fontWeight: isActive ? 700 : 500, lineHeight: 1.2 }}>
                            {agent.label}
                          </span>
                          <span style={{ fontSize: '10px', color: isActive ? '#BAE6FD' : '#64748B', lineHeight: 1.1, marginTop: '2px' }}>
                            {agent.sub}
                          </span>
                        </div>
                      )}
                      {!isCurrentlyCollapsed && agent.badge && (
                        <span className={`crm-nav-item__badge ${agent.badge.color}`}>
                          {agent.badge.count}
                        </span>
                      )}
                      {isCurrentlyCollapsed && (
                        <span
                          className={`crm-nav-item__badge-dot ${agent.badge?.color || 'emerald'}`}
                          title={agent.label}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Standard CRM Navigation Sections */}
          {standardNavSections.map((sec, secIdx) => (
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

        {/* TASK 1: Draggable Resize Handle */}
        {!isCurrentlyCollapsed && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize CRM sidebar navigation"
            aria-valuenow={sidebarWidth}
            aria-valuemin={220}
            aria-valuemax={480}
            tabIndex={0}
            className={`crm-sidebar-resizer ${isDragging ? 'is-dragging' : ''}`}
            onMouseDown={handleMouseDown}
            onKeyDown={handleResizerKeyDown}
            onDoubleClick={handleResizerDoubleClick}
            title="Drag to resize sidebar (Double click to reset to 260px)"
          />
        )}
      </aside>
    </>
  );
};

export default CRMSidebar;

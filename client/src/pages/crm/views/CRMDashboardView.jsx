import React, { useState } from 'react';
import { CRMIcon } from '../components/CRMIcon';

export const CRMDashboardView = ({
  enquiries = [],
  quotations = [],
  tasks = [],
  customers = [],
  dashboardMetrics = null,
  onSelectEnquiry,
  onSelectQuote,
  onOpenQuoteBuilder,
  onOpenQuickEnquiry,
  onNavigateTab
}) => {
  const [periodFilter, setPeriodFilter] = useState('30days'); // 'today' | '7days' | '30days' | 'month' | 'all'

  // Filter calculations based on period
  const now = new Date();
  const getFilterDate = () => {
    const d = new Date();
    if (periodFilter === 'today') {
      d.setHours(0, 0, 0, 0);
      return d;
    }
    if (periodFilter === '7days') {
      d.setDate(d.getDate() - 7);
      return d;
    }
    if (periodFilter === '30days') {
      d.setDate(d.getDate() - 30);
      return d;
    }
    if (periodFilter === 'month') {
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    return new Date(0); // all
  };

  const filterCutoff = getFilterDate();

  const periodEnquiries = enquiries.filter(
    (e) => new Date(e.createdAt || 0) >= filterCutoff
  );
  const periodQuotations = quotations.filter(
    (q) => new Date(q.createdAt || 0) >= filterCutoff
  );

  // Metric counts
  const totalLeads = periodEnquiries.length || enquiries.length;
  const newUncontacted = enquiries.filter((e) => e.status === 'New').length;
  const openQuotes = quotations.filter((q) => q.status !== 'Rejected' && q.status !== 'Expired');
  const totalQuoteValue = openQuotes.reduce(
    (acc, q) => acc + (Number(q.grandTotal) || 0),
    0
  );
  const pendingTasks = tasks.filter((t) => !t.completed);
  const overdueTasks = pendingTasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < now
  );
  const confirmedOrders = enquiries.filter((e) => e.status === 'Order Confirmed');
  const conversionRate = enquiries.length > 0
    ? ((confirmedOrders.length / enquiries.length) * 100).toFixed(1)
    : '0.0';

  // Pipeline funnel stages
  const pipelineStages = [
    { key: 'New', label: 'New RFQs', color: '#0284C7' },
    { key: 'Contacted', label: 'Contacted', color: '#8B5CF6' },
    { key: 'Quotation Sent', label: 'Quote Sent', color: '#F59E0B' },
    { key: 'Follow-up', label: 'In Follow-up', color: '#D97706' },
    { key: 'Negotiation', label: 'Negotiation', color: '#6366F1' },
    { key: 'Order Confirmed', label: 'Confirmed', color: '#10B981' },
    { key: 'On Hold', label: 'On Hold', color: '#64748B' },
    { key: 'Lost', label: 'Closed Lost', color: '#EF4444' }
  ];

  const stageCounts = pipelineStages.map((s) => ({
    ...s,
    count: enquiries.filter((e) => (e.status || 'New') === s.key).length
  }));

  // Urgent triage items (Needs Attention Today)
  const urgentItems = [];

  // 1. Uncontacted new leads
  enquiries
    .filter((e) => e.status === 'New')
    .slice(0, 3)
    .forEach((e) => {
      urgentItems.push({
        id: `lead-${e._id}`,
        type: 'new_lead',
        title: `New RFQ: ${e.name} (${e.company || 'Direct Buyer'})`,
        detail: `Requested: ${e.productName || 'Sanitary Component'} • Ref: ${e.reference}`,
        badge: 'New Lead',
        badgeColor: 'blue',
        actionLabel: 'Inspect RFQ',
        action: () => onSelectEnquiry(e)
      });
    });

  // 2. Overdue tasks
  overdueTasks.slice(0, 3).forEach((t) => {
    urgentItems.push({
      id: `task-${t._id}`,
      type: 'overdue_task',
      title: t.title,
      detail: `Due: ${new Date(t.dueDate).toLocaleDateString()} • Assigned: ${t.assignedTo?.name || 'Staff'}`,
      badge: 'Overdue Follow-up',
      badgeColor: 'red',
      actionLabel: 'View Tasks',
      action: () => onNavigateTab('tasks')
    });
  });

  // 3. Quotes awaiting response
  quotations
    .filter((q) => q.status === 'Sent' || q.status === 'Draft')
    .slice(0, 2)
    .forEach((q) => {
      urgentItems.push({
        id: `quote-${q._id}`,
        type: 'open_quote',
        title: `Quotation ${q.quotationNumber || q.reference} - ${q.customerName}`,
        detail: `Total: ₹${Number(q.grandTotal || 0).toLocaleString('en-IN')} • Status: ${q.status}`,
        badge: 'Pending Quote',
        badgeColor: 'amber',
        actionLabel: 'Review Quote',
        action: () => onSelectQuote(q)
      });
    });

  const renderStatusBadge = (status) => {
    const s = status || 'New';
    const cls = s.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return <span className={`crm-status-pill crm-status-${cls}`}>{s}</span>;
  };

  return (
    <div className="crm-dashboard">
      {/* Workspace Banner */}
      <div className="crm-dashboard__hero">
        <div className="crm-dashboard__hero-text">
          <h2>Sales Operations Command Center</h2>
          <p>
            Real-time pipeline monitoring, quotation tracking, and urgent client follow-ups for Lotus Tubes.
          </p>
        </div>

        {/* Period Filter Selector */}
        <div className="crm-period-selector" role="group" aria-label="Reporting Period">
          {[
            { id: 'today', label: 'Today' },
            { id: '7days', label: 'Last 7 Days' },
            { id: '30days', label: 'Last 30 Days' },
            { id: 'month', label: 'This Month' },
            { id: 'all', label: 'All Time' }
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              className={`crm-period-btn ${periodFilter === p.id ? 'active' : ''}`}
              onClick={() => setPeriodFilter(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Actionable KPI Grid */}
      <div className="crm-kpi-grid">
        {/* KPI 1: Inbound Leads */}
        <div
          className="crm-kpi-card"
          onClick={() => onNavigateTab('enquiries')}
          title="Click to view all enquiries"
        >
          <div className="crm-kpi-card__top">
            <span className="crm-kpi-card__label">Total Inbound RFQs</span>
            <div className="crm-kpi-card__icon icon-blue">
              <CRMIcon name="enquiries" size={20} />
            </div>
          </div>
          <div className="crm-kpi-card__val">{totalLeads}</div>
          <div className="crm-kpi-card__sub">
            <span className="crm-trend-chip positive">
              ● {newUncontacted} New Awaiting Contact
            </span>
          </div>
        </div>

        {/* KPI 2: Active Quotation Value */}
        <div
          className="crm-kpi-card"
          onClick={() => onNavigateTab('quotations')}
          title="Click to view all quotations"
        >
          <div className="crm-kpi-card__top">
            <span className="crm-kpi-card__label">Open Quotations Value</span>
            <div className="crm-kpi-card__icon icon-amber">
              <CRMIcon name="quotations" size={20} />
            </div>
          </div>
          <div className="crm-kpi-card__val">
            ₹{totalQuoteValue > 0 ? (totalQuoteValue >= 100000 ? `${(totalQuoteValue / 100000).toFixed(2)}L` : totalQuoteValue.toLocaleString('en-IN')) : '0'}
          </div>
          <div className="crm-kpi-card__sub">
            <span className="crm-trend-chip neutral">
              {openQuotes.length} quotations active
            </span>
          </div>
        </div>

        {/* KPI 3: Follow-ups Due */}
        <div
          className="crm-kpi-card"
          onClick={() => onNavigateTab('tasks')}
          title="Click to view tasks and reminders"
        >
          <div className="crm-kpi-card__top">
            <span className="crm-kpi-card__label">Follow-ups Scheduled</span>
            <div className="crm-kpi-card__icon icon-red">
              <CRMIcon name="tasks" size={20} />
            </div>
          </div>
          <div className="crm-kpi-card__val">{pendingTasks.length}</div>
          <div className="crm-kpi-card__sub">
            {overdueTasks.length > 0 ? (
              <span className="crm-trend-chip negative">
                ⚠ {overdueTasks.length} Overdue Attention Required
              </span>
            ) : (
              <span className="crm-trend-chip positive">
                ✓ All follow-ups on schedule
              </span>
            )}
          </div>
        </div>

        {/* KPI 4: Confirmed Orders */}
        <div className="crm-kpi-card">
          <div className="crm-kpi-card__top">
            <span className="crm-kpi-card__label">Confirmed Orders</span>
            <div className="crm-kpi-card__icon icon-green">
              <CRMIcon name="check" size={20} />
            </div>
          </div>
          <div className="crm-kpi-card__val">{confirmedOrders.length}</div>
          <div className="crm-kpi-card__sub">
            <span className="crm-trend-chip positive">
              Conversion Rate: {conversionRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Needs Attention & Sales Pipeline */}
      <div className="crm-dashboard-split">
        {/* Left: Urgent Attention Needed */}
        <div className="crm-card crm-attention-card">
          <div className="crm-card__header">
            <div className="crm-card__header-title">
              <CRMIcon name="alert" size={18} className="attention-alert-icon" />
              <h3>Action Items Requiring Attention Today</h3>
            </div>
            <span className="crm-badge crm-badge-amber">
              {urgentItems.length} Pending
            </span>
          </div>

          <div className="crm-card__body">
            {urgentItems.length === 0 ? (
              <div className="crm-empty-state">
                <CRMIcon name="check" size={32} className="empty-check-icon" />
                <p>Everything is up to date! No overdue tasks or unattended new RFQs.</p>
              </div>
            ) : (
              <div className="crm-attention-list">
                {urgentItems.map((item) => (
                  <div key={item.id} className="crm-attention-item">
                    <div className="crm-attention-item__main">
                      <div className="crm-attention-item__badge-row">
                        <span className={`crm-pill crm-pill-${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="crm-attention-item__title">{item.title}</h4>
                      <p className="crm-attention-item__detail">{item.detail}</p>
                    </div>
                    <button
                      type="button"
                      className="crm-btn crm-btn-sm crm-btn-secondary"
                      onClick={item.action}
                    >
                      {item.actionLabel} &rarr;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Enquiry Pipeline Funnel */}
        <div className="crm-card crm-pipeline-card">
          <div className="crm-card__header">
            <div className="crm-card__header-title">
              <CRMIcon name="reports" size={18} />
              <h3>Sales Pipeline Progression</h3>
            </div>
            <button
              type="button"
              className="crm-link-btn"
              onClick={() => onNavigateTab('enquiries')}
            >
              View Pipeline Table &rarr;
            </button>
          </div>

          <div className="crm-card__body">
            <div className="crm-pipeline-bars">
              {stageCounts.map((s) => {
                const maxCount = Math.max(...stageCounts.map((x) => x.count), 1);
                const pct = Math.round((s.count / maxCount) * 100);

                return (
                  <div
                    key={s.key}
                    className="crm-pipeline-row"
                    onClick={() => onNavigateTab('enquiries')}
                    title={`Filter by ${s.label}`}
                  >
                    <div className="crm-pipeline-row__label">
                      <span>{s.label}</span>
                      <strong>{s.count}</strong>
                    </div>
                    <div className="crm-pipeline-row__track">
                      <div
                        className="crm-pipeline-row__fill"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: s.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Live Table: Recent Quotation Requests & Inbound RFQs */}
      <div className="crm-card" style={{ marginTop: '24px' }}>
        <div className="crm-card__header">
          <div className="crm-card__header-title">
            <CRMIcon name="enquiries" size={18} />
            <h3>Recent Quotation Requests &amp; RFQs</h3>
          </div>
          <button
            type="button"
            className="crm-link-btn"
            onClick={() => onNavigateTab('enquiries')}
          >
            View All ({enquiries.length}) &rarr;
          </button>
        </div>

        <div className="crm-card__body" style={{ padding: 0 }}>
          {enquiries.length === 0 ? (
            <div className="crm-empty-state" style={{ padding: '36px' }}>
              <p>No customer enquiries recorded in database yet.</p>
              <button
                type="button"
                className="crm-btn crm-btn-primary crm-btn-sm"
                onClick={() => onOpenQuickEnquiry?.(null)}
              >
                + Log First RFQ
              </button>
            </div>
          ) : (
            <div className="crm-table-container">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Customer &amp; Company</th>
                    <th>Requested Component</th>
                    <th>Qty</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.slice(0, 6).map((eq) => (
                    <tr key={eq._id}>
                      <td className="crm-td-ref">
                        <button
                          type="button"
                          className="crm-ref-link"
                          onClick={() => onSelectEnquiry(eq)}
                        >
                          {eq.reference}
                        </button>
                      </td>
                      <td>
                        <div className="crm-cell-title">{eq.name}</div>
                        <div className="crm-cell-sub">{eq.company || 'Direct Buyer'}</div>
                      </td>
                      <td>
                        <div className="crm-cell-title">{eq.productName}</div>
                        <div className="crm-cell-sub">
                          {eq.grade || 'SS 316L'} {eq.finish ? `• ${eq.finish}` : ''}
                        </div>
                      </td>
                      <td className="crm-td-number">{eq.quantity || '—'}</td>
                      <td>
                        <span className="crm-location-chip">
                          {eq.country || eq.location || 'India'}
                        </span>
                      </td>
                      <td>{renderStatusBadge(eq.status)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="crm-btn crm-btn-sm crm-btn-outline"
                          onClick={() => onSelectEnquiry(eq)}
                        >
                          Inspect &rarr;
                        </button>
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

export default CRMDashboardView;

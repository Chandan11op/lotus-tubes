import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { apiService } from '../../../services/api';
import { Loader } from '../../../components/common/Loader';
import { CRMIcon } from '../components/CRMIcon';

const AGENT_META = {
  'anjali-pandey': {
    name: 'Anjali Pandey',
    role: 'Quotations & Sizing',
    botNumber: 1,
    photo: '/assets/images/team/anjali-pandey.png',
    color: '#0284C7',
    badgeClass: 'crm-badge-blue'
  },
  'ananya-mehta': {
    name: 'Anjali Pandey',
    role: 'Quotations & Sizing',
    botNumber: 1,
    photo: '/assets/images/team/anjali-pandey.png',
    color: '#0284C7',
    badgeClass: 'crm-badge-blue'
  },
  'riya-shah': {
    name: 'Riya Shah',
    role: 'Billing & Tax Invoices',
    botNumber: 2,
    photo: '/assets/images/team/agent-2.jpeg',
    color: '#D97706',
    badgeClass: 'crm-badge-amber'
  },
  'neha-desai': {
    name: 'Neha Desai',
    role: 'Inquiry Resolution Desk',
    botNumber: 3,
    photo: '/assets/images/team/agent-3.jpeg',
    color: '#9333EA',
    badgeClass: 'crm-badge-purple'
  },
  'arjun-yadav': {
    name: 'Arjun Yadav',
    role: 'Live Operations Concierge',
    botNumber: 4,
    photo: '/assets/images/team/agent-4.jpeg',
    color: '#059669',
    badgeClass: 'crm-badge-emerald'
  },
  'system': {
    name: 'Lotus Tubes System',
    role: 'System Notifications',
    botNumber: 0,
    photo: '/banner-image-opt.png',
    color: '#475569',
    badgeClass: 'crm-badge-slate'
  }
};

export const CRMEmailCommunicationsView = ({
  user,
  isSuperAdmin = false,
  onNotify
}) => {
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  // Filters
  const [agentFilter, setAgentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Email for Detail Drawer / Modal
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [previewTab, setPreviewTab] = useState('html'); // 'html' | 'text' | 'events'
  const [actionProcessing, setActionProcessing] = useState(false);

  // Load Statistics
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await apiService.getEmailStats();
      if (res?.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn('Failed to load email stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Load Emails List
  const loadEmails = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 15,
        agentId: agentFilter !== 'All' ? agentFilter : undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        search: searchQuery.trim() || undefined
      };

      const res = await apiService.getEmailLogs(params);
      if (res?.data) {
        setEmails(res.data.emails || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load emails:', err);
      if (onNotify) onNotify('Failed to load email archive.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, agentFilter, statusFilter, searchQuery, onNotify]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadEmails();
  }, [loadEmails]);

  // Load single email detail
  const handleOpenDetail = async (emailId) => {
    setSelectedEmailId(emailId);
    setDetailLoading(true);
    try {
      const res = await apiService.getEmailLogById(emailId);
      if (res?.data) {
        setSelectedEmail(res.data);
      }
    } catch (err) {
      console.error('Failed to load email details:', err);
      if (onNotify) onNotify('Failed to load email details', 'error');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedEmailId(null);
    setSelectedEmail(null);
  };

  // Super Admin: Retry Failed Email
  const handleRetryDispatch = async (emailId) => {
    if (!isSuperAdmin) return;
    setActionProcessing(true);
    try {
      const res = await apiService.retryEmailDispatch(emailId);
      if (res?.success) {
        if (onNotify) onNotify('Email dispatch re-attempted via Resend.', 'success');
        loadEmails();
        loadStats();
        if (selectedEmailId === emailId) {
          handleOpenDetail(emailId);
        }
      }
    } catch (err) {
      if (onNotify) onNotify(err.message || 'Retry failed', 'error');
    } finally {
      setActionProcessing(false);
    }
  };

  // Super Admin: Approve Queued Email
  const handleApproveDispatch = async (emailId) => {
    if (!isSuperAdmin) return;
    setActionProcessing(true);
    try {
      const res = await apiService.approveEmailDispatch(emailId);
      if (res?.success) {
        if (onNotify) onNotify('Queued email approved and dispatched to customer.', 'success');
        loadEmails();
        loadStats();
        if (selectedEmailId === emailId) {
          handleOpenDetail(emailId);
        }
      }
    } catch (err) {
      if (onNotify) onNotify(err.message || 'Approval failed', 'error');
    } finally {
      setActionProcessing(false);
    }
  };

  // Render Status Badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="crm-badge crm-badge-emerald" title="Verified delivered via Resend webhook" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span>✓</span> Delivered
          </span>
        );
      case 'accepted':
        return (
          <span className="crm-badge crm-badge-blue" title="Provider accepted by Resend API" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span>•</span> Accepted
          </span>
        );
      case 'sent':
        return (
          <span className="crm-badge crm-badge-cyan" title="Sent by mail provider">
            Sent
          </span>
        );
      case 'pending_approval':
        return (
          <span className="crm-badge crm-badge-amber" title="Awaiting Super Admin approval">
            Pending Review
          </span>
        );
      case 'bounced':
        return (
          <span className="crm-badge crm-badge-red" title="Bounced by recipient mailserver">
            Bounced
          </span>
        );
      case 'failed':
        return (
          <span className="crm-badge crm-badge-red" title="Delivery failed">
            Failed
          </span>
        );
      default:
        return <span className="crm-badge crm-badge-slate">{status}</span>;
    }
  };

  return (
    <div className="crm-view crm-email-communications-view">
      {/* View Header */}
      <div className="crm-view__header" style={{ marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="crm-view__title" style={{ margin: 0 }}>Email Communications &amp; Dispatch Archive</h1>
            <span className="crm-badge crm-badge-emerald" style={{ fontSize: '11px', fontWeight: 600 }}>Resend SDK v4</span>
          </div>
          <p className="crm-view__subtitle" style={{ margin: '4px 0 0 0' }}>
            Centralized monitoring of all 4 AI Agent sender identities with cryptographic webhook delivery tracking and Super Admin oversight.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="crm-btn crm-btn-secondary"
            onClick={() => {
              loadStats();
              loadEmails();
            }}
            title="Refresh communications data"
          >
            <CRMIcon name="refresh" size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="crm-metrics-grid" style={{ marginBottom: '24px' }}>
        <div className="crm-metric-card">
          <div className="crm-metric-card__header">
            <span className="crm-metric-card__title">Total Emails Sent</span>
            <CRMIcon name="mail" size={18} color="#0284C7" />
          </div>
          <div className="crm-metric-card__value">
            {statsLoading ? '...' : Number(stats?.total || 0).toLocaleString()}
          </div>
          <div className="crm-metric-card__footer">
            Across 4 dedicated agent sender identities
          </div>
        </div>

        <div className="crm-metric-card">
          <div className="crm-metric-card__header">
            <span className="crm-metric-card__title">Webhook Verified Delivery</span>
            <span className="crm-badge crm-badge-emerald" style={{ fontSize: '10px' }}>
              {stats?.deliveryRate || 100}% Rate
            </span>
          </div>
          <div className="crm-metric-card__value" style={{ color: '#059669' }}>
            {statsLoading ? '...' : Number(stats?.delivered || 0).toLocaleString()}
          </div>
          <div className="crm-metric-card__footer">
            Cryptographically verified via Resend webhooks
          </div>
        </div>

        <div className="crm-metric-card">
          <div className="crm-metric-card__header">
            <span className="crm-metric-card__title">Provider Accepted</span>
            <span className="crm-badge crm-badge-blue" style={{ fontSize: '10px' }}>In Transit</span>
          </div>
          <div className="crm-metric-card__value" style={{ color: '#0284C7' }}>
            {statsLoading ? '...' : Number(stats?.accepted || 0).toLocaleString()}
          </div>
          <div className="crm-metric-card__footer">
            Accepted by Resend for outbound routing
          </div>
        </div>

        <div className="crm-metric-card">
          <div className="crm-metric-card__header">
            <span className="crm-metric-card__title">Pending Super Admin Review</span>
            {stats?.pendingApproval > 0 && (
              <span className="crm-badge crm-badge-amber" style={{ fontSize: '10px' }}>Action Required</span>
            )}
          </div>
          <div className="crm-metric-card__value" style={{ color: stats?.pendingApproval > 0 ? '#D97706' : '#64748B' }}>
            {statsLoading ? '...' : Number(stats?.pendingApproval || 0).toLocaleString()}
          </div>
          <div className="crm-metric-card__footer">
            Drafts held until Chirag Shah review
          </div>
        </div>

        <div className="crm-metric-card">
          <div className="crm-metric-card__header">
            <span className="crm-metric-card__title">Bounced / Failed</span>
            {stats?.failed > 0 && <span className="crm-badge crm-badge-red" style={{ fontSize: '10px' }}>Alert</span>}
          </div>
          <div className="crm-metric-card__value" style={{ color: stats?.failed > 0 ? '#DC2626' : '#64748B' }}>
            {statsLoading ? '...' : Number((stats?.failed || 0) + (stats?.bounced || 0)).toLocaleString()}
          </div>
          <div className="crm-metric-card__footer">
            Eligible for Super Admin one-click retry
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="crm-card" style={{ marginBottom: '20px', padding: '14px 18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Agent Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Sender Identity:</span>
            <select
              className="crm-select"
              value={agentFilter}
              onChange={(e) => {
                setAgentFilter(e.target.value);
                setPage(1);
              }}
              style={{ fontSize: '13px', padding: '6px 12px' }}
            >
              <option value="All">All 4 Agents &amp; System</option>
              <option value="anjali-pandey">Agent 1: Anjali Pandey (Quotations)</option>
              <option value="ananya-mehta">Agent 1: Anjali Pandey (Quotations - Legacy)</option>
              <option value="riya-shah">Agent 2: Riya Shah (Invoices)</option>
              <option value="neha-desai">Agent 3: Neha Desai (Inquiries)</option>
              <option value="arjun-yadav">Agent 4: Arjun Yadav (Operations)</option>
              <option value="system">Lotus Tubes System Notifications</option>
            </select>
          </div>

          {/* Delivery Status Filter Buttons */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['All', 'delivered', 'accepted', 'pending_approval', 'failed'].map((st) => (
              <button
                key={st}
                type="button"
                className={`crm-btn ${statusFilter === st ? 'crm-btn-primary' : 'crm-btn-secondary'}`}
                style={{ fontSize: '12px', padding: '4px 10px', textTransform: 'capitalize' }}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
              >
                {st === 'pending_approval' ? 'Pending Review' : st === 'failed' ? 'Failed / Bounced' : st}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ minWidth: '220px', flex: 1, maxWidth: '320px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="crm-input"
                placeholder="Search recipient, ref, or subject..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                style={{ fontSize: '13px', paddingLeft: '32px' }}
              />
              <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                <CRMIcon name="search" size={14} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Communications Table */}
      <div className="crm-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Loader message="Loading communication logs..." />
          </div>
        ) : emails.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748B' }}>
            <CRMIcon name="mail" size={36} color="#94A3B8" />
            <h3 style={{ margin: '12px 0 4px 0', color: '#1E293B' }}>No email records found</h3>
            <p style={{ margin: 0, fontSize: '13px' }}>
              Try adjusting your agent filter or search query. Outbound emails via Resend are logged here automatically.
            </p>
          </div>
        ) : (
          <div className="crm-table-container">
            <table className="crm-table">
              <thead>
                <tr>
                  <th style={{ width: '150px' }}>Timestamp</th>
                  <th style={{ width: '180px' }}>Sender Identity</th>
                  <th style={{ width: '220px' }}>Recipient &amp; Entity</th>
                  <th>Subject</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Delivery Status</th>
                  <th style={{ width: '140px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((email) => {
                  const agent = AGENT_META[email.agentId] || AGENT_META.system;
                  const formattedDate = new Date(email.createdAt).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={email._id} style={{ cursor: 'pointer' }} onClick={() => handleOpenDetail(email._id)}>
                      <td style={{ fontSize: '12px', color: '#64748B' }}>
                        {formattedDate}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img
                            src={agent.photo}
                            alt={agent.name}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: `1px solid ${agent.color}`
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>
                              {agent.name}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>
                              {agent.role}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: '13px', color: '#0F172A' }}>
                          {email.to?.join(', ') || 'N/A'}
                        </div>
                        {email.reference && (
                          <span className="crm-badge crm-badge-slate" style={{ fontSize: '10px', marginTop: '3px' }}>
                            Ref: {email.reference}
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: '13px', color: '#1E293B', maxWidth: '340px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {email.subject}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                          Reply-To: {email.replyTo || 'sales@lotustubes.com'}
                          {email.attachments?.length > 0 && ` • 📎 ${email.attachments.length} PDF`}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {renderStatusBadge(email.deliveryStatus)}
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="crm-btn crm-btn-secondary"
                            style={{ fontSize: '11px', padding: '4px 8px' }}
                            onClick={() => handleOpenDetail(email._id)}
                            title="Inspect email details and HTML preview"
                          >
                            View
                          </button>

                          {isSuperAdmin && email.deliveryStatus === 'pending_approval' && (
                            <button
                              type="button"
                              className="crm-btn crm-btn-primary"
                              style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#059669' }}
                              onClick={() => handleApproveDispatch(email._id)}
                              disabled={actionProcessing}
                              title="Approve and dispatch via Resend"
                            >
                              Approve
                            </button>
                          )}

                          {isSuperAdmin && (email.deliveryStatus === 'failed' || email.deliveryStatus === 'bounced') && (
                            <button
                              type="button"
                              className="crm-btn crm-btn-secondary"
                              style={{ fontSize: '11px', padding: '4px 8px', color: '#DC2626', borderColor: '#FECACA' }}
                              onClick={() => handleRetryDispatch(email._id)}
                              disabled={actionProcessing}
                              title="Retry delivery dispatch"
                            >
                              Retry
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination.pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC' }}>
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              Showing Page {pagination.page} of {pagination.pages} ({pagination.total} records)
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                className="crm-btn crm-btn-secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{ fontSize: '12px', padding: '4px 10px' }}
              >
                Previous
              </button>
              <button
                type="button"
                className="crm-btn crm-btn-secondary"
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                style={{ fontSize: '12px', padding: '4px 10px' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Email Detail & HTML Preview Modal / Drawer */}
      {selectedEmailId && (
        <div className="crm-modal-overlay" onClick={handleCloseDetail}>
          <div
            className="crm-modal"
            style={{ maxWidth: '850px', width: '92%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="crm-modal__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', color: '#0F172A' }}>
                  Email Dispatch Inspection
                </h3>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  Resend Message ID: {selectedEmail?.resendMessageId || 'Pending Provider Acceptance'}
                </span>
              </div>
              <button
                type="button"
                className="crm-modal__close"
                onClick={handleCloseDetail}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748B' }}
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="crm-modal__body" style={{ overflowY: 'auto', flex: 1, padding: '18px 24px' }}>
              {detailLoading || !selectedEmail ? (
                <div style={{ padding: '60px 0', textAlign: 'center' }}>
                  <Loader message="Loading full message payload..." />
                </div>
              ) : (
                <>
                  {/* Metadata Header Cards */}
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px 16px', marginBottom: '18px', fontSize: '13px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                      <div>
                        <strong style={{ color: '#475569' }}>From Identity:</strong>
                        <div style={{ color: '#0F172A', fontWeight: 600 }}>{selectedEmail.from}</div>
                      </div>
                      <div>
                        <strong style={{ color: '#475569' }}>To Recipient(s):</strong>
                        <div style={{ color: '#0F172A' }}>{selectedEmail.to?.join(', ')}</div>
                      </div>
                      <div>
                        <strong style={{ color: '#475569' }}>Reply-To Address:</strong>
                        <div style={{ color: '#0284C7' }}>{selectedEmail.replyTo || 'sales@lotustubes.com'}</div>
                      </div>
                      <div>
                        <strong style={{ color: '#475569' }}>Delivery Status:</strong>
                        <div style={{ marginTop: '2px' }}>{renderStatusBadge(selectedEmail.deliveryStatus)}</div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #E2E8F0', marginTop: '10px', paddingTop: '10px' }}>
                      <strong style={{ color: '#475569' }}>Subject:</strong>
                      <span style={{ marginLeft: '8px', fontWeight: 600, color: '#1E293B' }}>{selectedEmail.subject}</span>
                    </div>
                  </div>

                  {/* Tabs: HTML Preview vs Delivery Events vs Plain Text */}
                  <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', marginBottom: '14px' }}>
                    <button
                      type="button"
                      className={`crm-tab ${previewTab === 'html' ? 'active' : ''}`}
                      onClick={() => setPreviewTab('html')}
                      style={{
                        padding: '8px 14px',
                        border: 'none',
                        borderBottom: previewTab === 'html' ? '2px solid #0284C7' : '2px solid transparent',
                        background: 'none',
                        fontWeight: previewTab === 'html' ? 600 : 400,
                        color: previewTab === 'html' ? '#0284C7' : '#64748B',
                        cursor: 'pointer'
                      }}
                    >
                      Branded HTML Preview
                    </button>
                    <button
                      type="button"
                      className={`crm-tab ${previewTab === 'events' ? 'active' : ''}`}
                      onClick={() => setPreviewTab('events')}
                      style={{
                        padding: '8px 14px',
                        border: 'none',
                        borderBottom: previewTab === 'events' ? '2px solid #0284C7' : '2px solid transparent',
                        background: 'none',
                        fontWeight: previewTab === 'events' ? 600 : 400,
                        color: previewTab === 'events' ? '#0284C7' : '#64748B',
                        cursor: 'pointer'
                      }}
                    >
                      Delivery Timeline &amp; Webhook Events ({selectedEmail.statusEvents?.length || 0})
                    </button>
                    <button
                      type="button"
                      className={`crm-tab ${previewTab === 'text' ? 'active' : ''}`}
                      onClick={() => setPreviewTab('text')}
                      style={{
                        padding: '8px 14px',
                        border: 'none',
                        borderBottom: previewTab === 'text' ? '2px solid #0284C7' : '2px solid transparent',
                        background: 'none',
                        fontWeight: previewTab === 'text' ? 600 : 400,
                        color: previewTab === 'text' ? '#0284C7' : '#64748B',
                        cursor: 'pointer'
                      }}
                    >
                      Plain Text Body
                    </button>
                  </div>

                  {/* Tab 1: Branded HTML Preview inside Safe Iframe Sandbox */}
                  {previewTab === 'html' && (
                    <div style={{ border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden', height: '450px', background: '#F1F5F9' }}>
                      <iframe
                        title="Email HTML Preview"
                        srcDoc={selectedEmail.bodyHtml}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        sandbox="allow-same-origin"
                      />
                    </div>
                  )}

                  {/* Tab 2: Delivery Timeline */}
                  {previewTab === 'events' && (
                    <div style={{ padding: '10px 0' }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#0F172A' }}>
                        Cryptographic Lifecycle Events (Resend Webhook Traces)
                      </h4>
                      {selectedEmail.statusEvents?.length === 0 ? (
                        <p style={{ color: '#64748B', fontSize: '13px' }}>No webhook events recorded yet.</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {selectedEmail.statusEvents?.map((ev, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                padding: '10px 14px',
                                background: '#F8FAFC',
                                border: '1px solid #E2E8F0',
                                borderRadius: '6px'
                              }}
                            >
                              <div style={{ minWidth: '100px', fontSize: '11px', color: '#64748B' }}>
                                {new Date(ev.timestamp).toLocaleTimeString('en-IN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit'
                                })}
                              </div>
                              <div style={{ flex: 1 }}>
                                <span className="crm-badge crm-badge-blue" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                                  {ev.status}
                                </span>
                                {ev.details && Object.keys(ev.details).length > 0 && (
                                  <pre style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#475569', background: '#FFFFFF', padding: '6px 10px', borderRadius: '4px', border: '1px solid #E2E8F0', overflowX: 'auto' }}>
                                    {JSON.stringify(ev.details, null, 2)}
                                  </pre>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 3: Plain Text Body */}
                  {previewTab === 'text' && (
                    <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '13px', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                      {selectedEmail.bodyText || 'No plain text version provided.'}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="crm-modal__footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                Recipient replies route directly to <strong>sales@lotustubes.com</strong>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="crm-btn crm-btn-secondary"
                  onClick={handleCloseDetail}
                >
                  Close
                </button>

                {isSuperAdmin && selectedEmail?.deliveryStatus === 'pending_approval' && (
                  <button
                    type="button"
                    className="crm-btn crm-btn-primary"
                    style={{ backgroundColor: '#059669' }}
                    onClick={() => handleApproveDispatch(selectedEmail._id)}
                    disabled={actionProcessing}
                  >
                    {actionProcessing ? 'Authorizing...' : 'Approve & Dispatch via Resend'}
                  </button>
                )}

                {isSuperAdmin && (selectedEmail?.deliveryStatus === 'failed' || selectedEmail?.deliveryStatus === 'bounced') && (
                  <button
                    type="button"
                    className="crm-btn crm-btn-secondary"
                    style={{ color: '#DC2626', borderColor: '#FECACA' }}
                    onClick={() => handleRetryDispatch(selectedEmail._id)}
                    disabled={actionProcessing}
                  >
                    {actionProcessing ? 'Retrying...' : 'Retry Dispatch'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMEmailCommunicationsView;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { apiService } from '../../../services/api';
import { Loader } from '../../../components/common/Loader';
import { CRMIcon } from '../components/CRMIcon';

const AGENT_META = {
  'arjun-yadav': {
    name: 'Arjun Yadav',
    role: 'Live Concierge & Support Bot',
    badgeClass: 'crm-badge-emerald',
    color: '#059669'
  },
  'anjali-pandey': {
    name: 'Anjali Pandey',
    role: 'Quotations & Specifications',
    badgeClass: 'crm-badge-blue',
    color: '#0284C7'
  },
  'ananya-mehta': {
    name: 'Anjali Pandey',
    role: 'Quotations & Specifications',
    badgeClass: 'crm-badge-blue',
    color: '#0284C7'
  },
  'riya-shah': {
    name: 'Riya Shah',
    role: 'Commercial Invoicing & GST',
    badgeClass: 'crm-badge-amber',
    color: '#D97706'
  },
  'neha-desai': {
    name: 'Neha Desai',
    role: 'Quality & MTC Desk',
    badgeClass: 'crm-badge-purple',
    color: '#9333EA'
  },
  'human': {
    name: 'Human Staff Representative',
    role: 'Direct Staff Takeover',
    badgeClass: 'crm-badge-red',
    color: '#DC2626'
  }
};

export const CRMWhatsAppView = ({ user, isSuperAdmin = false, onNotify }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [activeConversationData, setActiveConversationData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [relatedQuotes, setRelatedQuotes] = useState([]);
  const [relatedInvoices, setRelatedInvoices] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'waiting_human' | 'active' | 'resolved'
  const [searchQuery, setSearchQuery] = useState('');

  // Outbound Reply State
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Load Conversations
  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiService.getWhatsAppConversations({
        status: statusFilter,
        search: searchQuery
      });
      if (res?.data?.conversations) {
        setConversations(res.data.conversations);
        if (!activeConversationId && res.data.conversations.length > 0) {
          setActiveConversationId(res.data.conversations[0]._id);
        }
      }
    } catch (err) {
      if (onNotify) onNotify('error', err.message || 'Failed to load WhatsApp conversations');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery, activeConversationId, onNotify]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load Thread when activeConversationId changes
  const loadThread = useCallback(async (convId) => {
    if (!convId) return;
    try {
      setThreadLoading(true);
      const res = await apiService.getWhatsAppConversationById(convId);
      if (res?.data) {
        setActiveConversationData(res.data.conversation);
        setMessages(res.data.messages || []);
        setRelatedQuotes(res.data.relatedQuotes || []);
        setRelatedInvoices(res.data.relatedInvoices || []);
      }
    } catch (err) {
      if (onNotify) onNotify('error', 'Failed to load conversation thread');
    } finally {
      setThreadLoading(false);
    }
  }, [onNotify]);

  useEffect(() => {
    if (activeConversationId) {
      loadThread(activeConversationId);
    }
  }, [activeConversationId, loadThread]);

  // Send Manual Staff Message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!replyText.trim() || !activeConversationId || sending) return;

    try {
      setSending(true);
      const res = await apiService.sendStaffWhatsAppMessage(activeConversationId, replyText.trim());
      if (res?.success) {
        setReplyText('');
        if (onNotify) onNotify('success', 'WhatsApp message dispatched to customer');
        loadThread(activeConversationId);
        loadConversations();
      } else {
        if (onNotify) onNotify('error', res?.message || 'Failed to dispatch message');
      }
    } catch (err) {
      if (onNotify) onNotify('error', err.message || 'Send error');
    } finally {
      setSending(false);
    }
  };

  // Toggle Human Handover / Bot Pausing
  const handleToggleHandover = async () => {
    if (!activeConversationData || actionLoading) return;
    const currentIsHandover = activeConversationData.isHumanHandover;
    const nextIsHandover = !currentIsHandover;

    try {
      setActionLoading(true);
      const res = await apiService.toggleWhatsAppHandover(activeConversationData._id, {
        isHandover: nextIsHandover,
        pauseBot: nextIsHandover,
        reason: nextIsHandover ? 'Staff manual takeover from CRM' : 'Staff returned control to AI bot'
      });
      if (res?.success) {
        if (onNotify) {
          onNotify(
            'success',
            nextIsHandover
              ? 'Human takeover activated: AI assistant paused for this customer'
              : 'AI Assistant resumed: Bot will handle standard inquiries'
          );
        }
        loadThread(activeConversationData._id);
        loadConversations();
      }
    } catch (err) {
      if (onNotify) onNotify('error', err.message || 'Handover update failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Calculate Metrics
  const metrics = useMemo(() => {
    const total = conversations.length;
    const waitingHuman = conversations.filter((c) => c.isHumanHandover || c.status === 'waiting_human').length;
    const active = conversations.filter((c) => c.status === 'active' && !c.botPaused).length;
    const unread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
    return { total, waitingHuman, active, unread };
  }, [conversations]);

  const renderDeliveryStatus = (status) => {
    switch (status) {
      case 'READ':
        return <span style={{ color: '#0284C7', fontSize: '11px', fontWeight: 700 }} title="Read by recipient">✓✓</span>;
      case 'DELIVERED':
        return <span style={{ color: '#64748B', fontSize: '11px', fontWeight: 700 }} title="Delivered to handset">✓✓</span>;
      case 'PROVIDER_ACCEPTED':
      case 'SEND_ATTEMPTED':
        return <span style={{ color: '#94A3B8', fontSize: '11px' }} title="Sent to WhatsApp Cloud API">✓</span>;
      case 'FAILED':
        return <span style={{ color: '#EF4444', fontSize: '11px', fontWeight: 700 }} title="Delivery Failed">⚠️ Failed</span>;
      case 'SKIPPED_NO_CONSENT':
        return <span style={{ color: '#D97706', fontSize: '11px' }}>Opted Out</span>;
      default:
        return null;
    }
  };

  return (
    <div className="crm-workspace-view" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      {/* Top Metrics Cards */}
      <div className="crm-kpi-grid" style={{ marginBottom: '16px' }}>
        <div className="crm-kpi-card">
          <div className="crm-kpi-card__top">
            <span className="crm-kpi-card__label">Active WhatsApp Chats</span>
            <div className="crm-kpi-card__icon icon-green">
              <CRMIcon name="whatsapp" size={20} />
            </div>
          </div>
          <div className="crm-kpi-card__val">{metrics.total}</div>
          <div className="crm-kpi-card__sub">
            <span className="crm-trend-chip positive">{metrics.active} AI Bot Managed</span>
          </div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-card__top">
            <span className="crm-kpi-card__label">Awaiting Human Handover</span>
            <div className="crm-kpi-card__icon icon-amber">
              <CRMIcon name="alert" size={20} />
            </div>
          </div>
          <div className="crm-kpi-card__val" style={{ color: metrics.waitingHuman > 0 ? '#DC2626' : '#10263D' }}>
            {metrics.waitingHuman}
          </div>
          <div className="crm-kpi-card__sub">
            <span className={`crm-trend-chip ${metrics.waitingHuman > 0 ? 'negative' : 'positive'}`}>
              {metrics.waitingHuman > 0 ? 'Immediate staff action required' : 'No pending takeovers'}
            </span>
          </div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-card__top">
            <span className="crm-kpi-card__label">Unread Customer Messages</span>
            <div className="crm-kpi-card__icon icon-blue">
              <CRMIcon name="enquiries" size={20} />
            </div>
          </div>
          <div className="crm-kpi-card__val">{metrics.unread}</div>
          <div className="crm-kpi-card__sub">
            <span className="crm-trend-chip neutral">Meta Cloud API Connected</span>
          </div>
        </div>
      </div>

      {/* Main Split-Screen Inbox */}
      <div className="crm-card" style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: 0 }}>
        {/* Left Pane: Conversation List */}
        <div
          style={{
            width: '340px',
            borderRight: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            background: '#F8FAFC'
          }}
        >
          {/* Search & Filter Header */}
          <div style={{ padding: '14px', borderBottom: '1px solid #E2E8F0', background: '#FFF' }}>
            <div className="crm-search-box" style={{ marginBottom: '10px' }}>
              <CRMIcon name="search" size={14} />
              <input
                type="text"
                placeholder="Search phone, name, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', fontSize: '12px' }}
              />
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'waiting_human', label: 'Human Req' },
                { id: 'active', label: 'Bot Active' },
                { id: 'resolved', label: 'Resolved' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: statusFilter === tab.id ? '#0284C7' : '#E2E8F0',
                    background: statusFilter === tab.id ? '#EFF6FF' : '#FFF',
                    color: statusFilter === tab.id ? '#0284C7' : '#64748B',
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '24px', textAlign: 'center' }}>
                <Loader size="small" />
              </div>
            ) : conversations.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                No WhatsApp conversations found.
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = conv._id === activeConversationId;
                const isHandover = conv.isHumanHandover || conv.status === 'waiting_human';
                const agentInfo = AGENT_META[conv.assignedAgent] || AGENT_META['arjun-yadav'];

                return (
                  <div
                    key={conv._id}
                    onClick={() => setActiveConversationId(conv._id)}
                    style={{
                      padding: '12px 14px',
                      borderBottom: '1px solid #F1F5F9',
                      background: isActive ? '#EFF6FF' : '#FFF',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                      borderLeft: isActive ? '3px solid #0284C7' : '3px solid transparent'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px', color: '#0F172A' }}>
                        {conv.customerName || 'Inquirer'}
                      </span>
                      <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>
                        {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>

                    <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '6px' }}>
                      {conv.company ? `${conv.company} • ` : ''}+{conv.customerPhone}
                    </div>

                    <div style={{ fontSize: '12px', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '8px' }}>
                      {conv.lastMessageText || 'No messages yet'}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`crm-badge ${agentInfo.badgeClass}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                        {agentInfo.name.split(' ')[0]}
                      </span>

                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {isHandover && (
                          <span style={{ background: '#FEE2E2', color: '#DC2626', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                            Human Req
                          </span>
                        )}
                        {conv.unreadCount > 0 && (
                          <span style={{ background: '#059669', color: '#FFF', fontSize: '10px', fontWeight: 700, borderRadius: '9999px', padding: '2px 6px' }}>
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Conversation Thread */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#FFF' }}>
          {threadLoading && !activeConversationData ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader />
            </div>
          ) : !activeConversationData ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
              <CRMIcon name="whatsapp" size={48} color="#CBD5E1" />
              <p style={{ marginTop: '12px', fontSize: '14px' }}>Select a conversation from the left inbox to view messages</p>
            </div>
          ) : (
            <>
              {/* Thread Header */}
              <div
                style={{
                  padding: '12px 18px',
                  borderBottom: '1px solid #E2E8F0',
                  background: '#FFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                      {activeConversationData.customerName || 'Inquirer'}
                    </h3>
                    {activeConversationData.isHumanHandover && (
                      <span style={{ background: '#FEE2E2', color: '#DC2626', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px' }}>
                        Human Takeover Active
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    {activeConversationData.company && <span>{activeConversationData.company} • </span>}
                    <span>+{activeConversationData.customerPhone}</span>
                    <a
                      href={`https://wa.me/${activeConversationData.customerPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: '8px', color: '#059669', textDecoration: 'none', fontWeight: 600 }}
                    >
                      Open in WhatsApp ↗
                    </a>
                  </div>
                </div>

                {/* Handover & Quick Actions */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={handleToggleHandover}
                    disabled={actionLoading}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      borderRadius: '6px',
                      border: '1px solid',
                      cursor: 'pointer',
                      background: activeConversationData.isHumanHandover ? '#10B981' : '#F59E0B',
                      borderColor: activeConversationData.isHumanHandover ? '#10B981' : '#F59E0B',
                      color: '#FFF'
                    }}
                  >
                    {activeConversationData.isHumanHandover ? 'Resume AI Assistant' : 'Take Over Chat'}
                  </button>
                </div>
              </div>

              {/* Linked Documents Banner (Quotes & Invoices) */}
              {(relatedQuotes.length > 0 || relatedInvoices.length > 0) && (
                <div style={{ background: '#F8FAFC', padding: '6px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    Linked Records:
                  </span>
                  {relatedQuotes.map((q) => (
                    <span
                      key={q._id}
                      style={{ fontSize: '11px', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '2px 6px', borderRadius: '4px', color: '#1E40AF' }}
                      title={`Quote ${q.quotationNumber} (${q.status})`}
                    >
                      QT: {q.quotationNumber} ({q.status})
                    </span>
                  ))}
                  {relatedInvoices.map((inv) => (
                    <span
                      key={inv._id}
                      style={{ fontSize: '11px', background: '#FEF3C7', border: '1px solid #FDE68A', padding: '2px 6px', borderRadius: '4px', color: '#92400E' }}
                      title={`Invoice ${inv.invoiceNumber} (${inv.status})`}
                    >
                      INV: {inv.invoiceNumber} ({inv.status})
                    </span>
                  ))}
                </div>
              )}

              {/* Message History Stream */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px',
                  background: '#F1F5F9',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94A3B8', padding: '32px', fontSize: '13px' }}>
                    No messages recorded in this conversation yet.
                  </div>
                ) : (
                  messages.map((m) => {
                    const isInbound = m.direction === 'inbound';
                    const agent = AGENT_META[m.agentId] || AGENT_META['arjun-yadav'];

                    return (
                      <div
                        key={m._id}
                        style={{
                          alignSelf: isInbound ? 'flex-start' : 'flex-end',
                          maxWidth: '75%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        {/* Message Bubble */}
                        <div
                          style={{
                            background: isInbound ? '#FFFFFF' : '#047857',
                            color: isInbound ? '#0F172A' : '#FFFFFF',
                            padding: '10px 14px',
                            borderRadius: isInbound ? '12px 12px 12px 2px' : '12px 12px 2px 12px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                            fontSize: '13px',
                            lineHeight: 1.5
                          }}
                        >
                          {!isInbound && (
                            <div style={{ fontSize: '10.5px', color: '#A7F3D0', fontWeight: 700, marginBottom: '4px' }}>
                              {agent.name}
                            </div>
                          )}

                          {/* Text Body */}
                          <div style={{ whiteSpace: 'pre-wrap' }}>{m.text?.body}</div>

                          {/* Document Attachment Preview */}
                          {m.document?.link && (
                            <div
                              style={{
                                marginTop: '8px',
                                padding: '8px 10px',
                                background: isInbound ? '#F8FAFC' : 'rgba(255,255,255,0.15)',
                                borderRadius: '6px',
                                border: '1px solid',
                                borderColor: isInbound ? '#E2E8F0' : 'rgba(255,255,255,0.25)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px'
                              }}
                            >
                              <span style={{ fontSize: '11.5px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                📄 {m.document.filename || 'Document.pdf'}
                              </span>
                              <a
                                href={m.document.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  color: isInbound ? '#0284C7' : '#FFFFFF',
                                  textDecoration: 'underline'
                                }}
                              >
                                View
                              </a>
                            </div>
                          )}

                          {/* Footer Timestamp & Delivery Status */}
                          <div
                            style={{
                              marginTop: '4px',
                              display: 'flex',
                              justifyContent: 'flex-end',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '10px',
                              color: isInbound ? '#94A3B8' : '#D1FAE5'
                            }}
                          >
                            <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {!isInbound && renderDeliveryStatus(m.deliveryStatus)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom Outbound Reply Composer */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: '12px 16px',
                  borderTop: '1px solid #E2E8F0',
                  background: '#FFF',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center'
                }}
              >
                <input
                  type="text"
                  placeholder="Type a verified response to send via WhatsApp..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={sending}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    fontSize: '13px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={sending || !replyText.trim()}
                  className="crm-btn crm-btn-primary"
                  style={{
                    padding: '10px 18px',
                    background: '#059669',
                    borderColor: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CRMIcon name="check" size={14} />
                  <span>{sending ? 'Sending...' : 'Send WhatsApp'}</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

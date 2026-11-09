import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../../../services/api';
import { Loader } from '../../../components/common/Loader';
import { AI_TEAM_MEMBERS } from '../../../data/siteData';

export const CRMAiOperationsView = ({
  user,
  isSuperAdmin = false,
  onNotify,
  onRefresh,
  initialAgentId = null,
  onNavigateTab
}) => {
  const [tasks, setTasks] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgentFilter, setSelectedAgentFilter] = useState(initialAgentId || 'All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync selectedAgentFilter if initialAgentId changes via navigation
  useEffect(() => {
    if (initialAgentId) {
      setSelectedAgentFilter(initialAgentId);
    } else {
      setSelectedAgentFilter('All');
    }
  }, [initialAgentId]);

  const activeAgent = useMemo(() => {
    const targetId = initialAgentId || (selectedAgentFilter !== 'All' ? selectedAgentFilter : null);
    if (!targetId) return null;
    return AI_TEAM_MEMBERS.find((b) => b.id === targetId) || null;
  }, [initialAgentId, selectedAgentFilter]);

  // Active Task for Super Admin Review Modal
  const [activeTask, setActiveTask] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [editedReplyText, setEditedReplyText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // New Invoice Modal State (Riya Shah)
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [newInvoiceData, setNewInvoiceData] = useState({
    customerName: '',
    company: '',
    email: '',
    phone: '',
    billingAddress: '',
    shippingAddress: '',
    paymentTerms: '100% advance against Proforma or 30 days credit for approved clients',
    lineItems: [
      {
        description: 'SS 316L Electro Polished Sanitary Pipe 1.5" OD x 1.65mm',
        grade: 'SS 316L',
        size: '1.5" (38.1mm OD)',
        nominalSize: '1.5"',
        finish: 'Electro Polished (Ra ≤ 0.38µm)',
        quantity: 10,
        unit: 'Meters',
        unitPrice: 850
      }
    ]
  });

  // Load Agent Tasks and Invoices
  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksRes, invoicesRes] = await Promise.allSettled([
        apiService.getAgentTasks ? apiService.getAgentTasks() : fetch('/api/agents/tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then((r) => r.json()),
        apiService.getInvoices ? apiService.getInvoices() : fetch('/api/invoices', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then((r) => r.json())
      ]);

      if (tasksRes.status === 'fulfilled' && tasksRes.value?.data) {
        setTasks(tasksRes.value.data);
      }
      if (invoicesRes.status === 'fulfilled' && invoicesRes.value?.data?.invoices) {
        setInvoices(invoicesRes.value.data.invoices);
      }
    } catch (err) {
      console.warn('Failed to load AI operations data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (selectedAgentFilter !== 'All' && t.agentId !== selectedAgentFilter) {
        return false;
      }
      if (statusFilter !== 'All' && t.approvalStatus !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          t.title?.toLowerCase().includes(q) ||
          t.agentName?.toLowerCase().includes(q) ||
          t.proposedPayload?.customerName?.toLowerCase().includes(q) ||
          t.proposedPayload?.company?.toLowerCase().includes(q) ||
          t.proposedPayload?.quotationNumber?.toLowerCase().includes(q) ||
          t.proposedPayload?.invoiceNumber?.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [tasks, selectedAgentFilter, statusFilter, searchQuery]);

  // Real-time Metrics
  const metrics = useMemo(() => {
    const pendingCount = tasks.filter(
      (t) => t.approvalStatus === 'pending_review' || t.approvalStatus === 'pending_super_admin_confirmation'
    ).length;
    const ananyaCount = tasks.filter((t) => t.agentId === 'ananya-mehta').length;
    const riyaCount = invoices.length + tasks.filter((t) => t.agentId === 'riya-shah').length;
    const nehaCount = tasks.filter((t) => t.agentId === 'neha-desai').length;
    const arjunCount = tasks.filter((t) => t.agentId === 'arjun-yadav').length;
    const approvedCount = tasks.filter((t) => t.approvalStatus === 'approved').length;

    return {
      pendingCount,
      ananyaCount,
      riyaCount,
      nehaCount,
      arjunCount,
      approvedCount
    };
  }, [tasks, invoices]);

  // Open Review Drawer
  const handleOpenReview = (task) => {
    setActiveTask(task);
    setReviewNotes('');
    setEditedReplyText(
      task.staffReplyDraft ||
      task.proposedPayload?.proposedResponse ||
      task.proposedPayload?.customerMessage ||
      ''
    );
  };

  // Super Admin: Approve & Send
  const handleApproveTask = async () => {
    if (!activeTask) return;
    if (!isSuperAdmin) {
      if (onNotify) onNotify('Only Super Admin Chirag Shah can authorize customer dispatches.', 'danger');
      return;
    }

    setIsProcessing(true);
    try {
      if (activeTask.taskType === 'customer_inquiry_resolution') {
        await apiService.confirmInquiryReply(activeTask._id, editedReplyText || reviewNotes);
        if (onNotify) {
          onNotify(
            `Inquiry resolution authorized by Super Admin! Dispatched to customer via Neha Desai (Email & WhatsApp).`,
            'success'
          );
        }
      } else if (activeTask.invoiceId) {
        await apiService.approveInvoice(activeTask.invoiceId, reviewNotes);
        if (onNotify) {
          onNotify(
            `Invoice authorized by Super Admin! Dispatched to customer via Riya Shah (Email & WhatsApp).`,
            'success'
          );
        }
      } else {
        await apiService.approveAgentTask(activeTask._id, reviewNotes);
        if (onNotify) {
          onNotify(
            `Task authorized by Super Admin! Quotation dispatched via Ananya Mehta (Email & WhatsApp).`,
            'success'
          );
        }
      }
      setActiveTask(null);
      loadData();
      if (onRefresh) onRefresh();
    } catch (err) {
      if (onNotify) onNotify(`Approval failed: ${err.message}`, 'danger');
    } finally {
      setIsProcessing(false);
    }
  };

  // Super Admin: Request Changes
  const handleRequestChanges = async () => {
    if (!activeTask) return;
    if (!isSuperAdmin) {
      if (onNotify) onNotify('Only Super Admin Chirag Shah can request revisions.', 'danger');
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.rejectAgentTask(activeTask._id, reviewNotes || 'Please revise specifications or pricing', 'changes_requested');
      if (onNotify) onNotify('Revisions requested. Task returned to staff.', 'info');
      setActiveTask(null);
      loadData();
    } catch (err) {
      if (onNotify) onNotify(`Failed to request changes: ${err.message}`, 'danger');
    } finally {
      setIsProcessing(false);
    }
  };

  // Super Admin: Reject
  const handleRejectTask = async () => {
    if (!activeTask) return;
    if (!isSuperAdmin) {
      if (onNotify) onNotify('Only Super Admin Chirag Shah can reject tasks.', 'danger');
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.rejectAgentTask(activeTask._id, reviewNotes || 'Rejected by Super Admin', 'reject');
      if (onNotify) onNotify('Task marked as rejected.', 'warning');
      setActiveTask(null);
      loadData();
    } catch (err) {
      if (onNotify) onNotify(`Failed to reject task: ${err.message}`, 'danger');
    } finally {
      setIsProcessing(false);
    }
  };

  // Create Invoice Handler (Riya Shah)
  const handleCreateInvoiceSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await apiService.createInvoice(newInvoiceData);
      if (onNotify) onNotify('Invoice draft created! Submitted for Super Admin approval.', 'success');
      setShowCreateInvoiceModal(false);
      loadData();
    } catch (err) {
      if (onNotify) onNotify(`Failed to create invoice: ${err.message}`, 'danger');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="crm-view-container" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* TASK 2: If an Individual Agent is Selected: Dedicated Agent Dashboard */}
      {activeAgent ? (
        <div style={{ marginBottom: '28px' }}>
          {/* Breadcrumb / Back Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748B' }}>
              <button
                type="button"
                onClick={() => {
                  if (onNavigateTab) onNavigateTab('ai-operations');
                  else setSelectedAgentFilter('All');
                }}
                style={{ background: 'none', border: 'none', color: '#0284C7', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                ← All AI Agents
              </button>
              <span>/</span>
              <strong style={{ color: '#0F172A' }}>{activeAgent.name}</strong>
              <span style={{ fontSize: '11px', background: '#E0F2FE', color: '#0369A1', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                {activeAgent.department}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {activeAgent.id === 'riya-shah' && (
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => setShowCreateInvoiceModal(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  🧾 New Commercial Invoice (18% GST)
                </button>
              )}
              <button
                type="button"
                className="btn btn--outline-dark btn--sm"
                onClick={loadData}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                🔄 Refresh Agent Queue
              </button>
            </div>
          </div>

          {/* Dedicated Agent Profile Card */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <img
                src={activeAgent.photo}
                alt={activeAgent.name}
                style={{ width: '84px', height: '84px', borderRadius: '16px', objectFit: 'cover', border: '2px solid #0284C7', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)' }}
              />
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h2 style={{ margin: 0, fontSize: '1.35rem', color: '#0F172A', fontWeight: 800 }}>{activeAgent.name}</h2>
                  <span style={{ fontSize: '12px', background: '#ECFDF5', color: '#059669', padding: '2px 10px', borderRadius: '12px', fontWeight: 700, border: '1px solid #A7F3D0' }}>
                    {activeAgent.status || '● Active • Operational'}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#0284C7', fontWeight: 700, marginTop: '4px' }}>
                  {activeAgent.role} • {activeAgent.department}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                  ✉️ {activeAgent.email}
                </div>

                <p style={{ margin: '12px 0 8px 0', fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>
                  {activeAgent.summary}
                </p>

                {activeAgent.value && (
                  <div style={{ fontSize: '12px', background: '#F8FAFC', padding: '8px 12px', borderRadius: '8px', borderLeft: '3px solid #0284C7', color: '#475569', marginTop: '8px' }}>
                    <strong>Client Value:</strong> {activeAgent.value}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                  {activeAgent.channels?.map((ch, idx) => (
                    <span key={idx} style={{ fontSize: '11px', background: '#F1F5F9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                      ✓ {ch}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dedicated Agent KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Assigned Tasks</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284C7', marginTop: '4px' }}>
                {tasks.filter((t) => t.agentId === activeAgent.id).length + (activeAgent.id === 'riya-shah' ? invoices.length : 0)}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Total Workflow Execution</div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #FBCFE8', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '11px', color: '#9D174D', fontWeight: 700, textTransform: 'uppercase' }}>Awaiting Super Admin</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#BE185D', marginTop: '4px' }}>
                {tasks.filter((t) => t.agentId === activeAgent.id && (t.approvalStatus === 'pending_review' || t.approvalStatus === 'pending_super_admin_confirmation')).length}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Requires Confirmation</div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>Approved &amp; Dispatched</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                {tasks.filter((t) => t.agentId === activeAgent.id && t.approvalStatus === 'approved').length + (activeAgent.id === 'riya-shah' ? invoices.filter((i) => i.status === 'Approved').length : 0)}
              </div>
              <div style={{ fontSize: '11px', color: '#059669', marginTop: '2px' }}>Completed Workflows</div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>System Status</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669', marginTop: '10px' }}>
                ● 100% Active
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Autonomous Engine Ready</div>
            </div>
          </div>
        </div>
      ) : (
        /* Overview Mode: Full Metrics Bar + 4 Directory Cards */
        <>
          {/* Header & Title */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>🤖</span>
                <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#0F172A', fontWeight: 800 }}>
                  AI Operations &amp; Autonomous Bots Control Center
                </h1>
              </div>
              <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '14px' }}>
                Executive Human-in-the-Loop oversight for Lotus Tubes’ 4 autonomous customer specialists. Every commercial dispatch requires Super Admin Chirag Shah confirmation.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn--outline-dark btn--sm"
                onClick={loadData}
                title="Refresh All AI Tasks"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                🔄 Refresh Inbox
              </button>
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={() => setShowCreateInvoiceModal(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                🧾 New Commercial Invoice (Riya Shah)
              </button>
            </div>
          </div>

          {/* Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Active Bots</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284C7', marginTop: '4px' }}>4</div>
              <div style={{ fontSize: '11px', color: '#10B981', marginTop: '2px' }}>● 100% Operational</div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #FBCFE8', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '12px', color: '#9D174D', fontWeight: 700, textTransform: 'uppercase' }}>Awaiting Super Admin</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#BE185D', marginTop: '4px' }}>{metrics.pendingCount}</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Requires Chirag Shah Review</div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Quotations (Ananya)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>{metrics.ananyaCount}</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Email &amp; WhatsApp Quotes</div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Billing (Riya)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>{metrics.riyaCount}</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Tax Invoices &amp; 18% GST</div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Inquiries (Neha)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>{metrics.nehaCount}</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Traceable Support Desk</div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Chat Concierge (Arjun)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>{metrics.arjunCount}</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>24/7 Operations Desk</div>
            </div>
          </div>

          {/* Interactive 4 Agent Directory Cards */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '14px', fontWeight: 700 }}>
              Assigned Autonomous Workflow Team
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {AI_TEAM_MEMBERS.map((bot) => {
                const isSelected = selectedAgentFilter === bot.id;
                return (
                  <div
                    key={bot.id}
                    onClick={() => {
                      if (onNavigateTab) {
                        const tabKeyMap = {
                          'ananya-mehta': 'agent-ananya',
                          'riya-shah': 'agent-riya',
                          'neha-desai': 'agent-neha',
                          'arjun-yadav': 'agent-arjun'
                        };
                        onNavigateTab(tabKeyMap[bot.id] || 'ai-operations');
                      } else {
                        setSelectedAgentFilter(isSelected ? 'All' : bot.id);
                      }
                    }}
                    style={{
                      background: isSelected ? '#EFF6FF' : '#FFFFFF',
                      border: isSelected ? '2px solid #0284C7' : '1px solid #E2E8F0',
                      borderRadius: '14px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 14px rgba(2, 132, 199, 0.15)' : '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <img
                        src={bot.photo}
                        alt={bot.name}
                        style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #E2E8F0' }}
                      />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0F172A', fontWeight: 700 }}>{bot.name}</h4>
                          <span style={{ fontSize: '10px', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, color: '#475569' }}>
                            {bot.agentNumber}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#0284C7', fontWeight: 600, marginTop: '2px' }}>
                          {bot.role}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                          ✉️ {bot.email}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                      <span style={{ color: '#059669', fontWeight: 700 }}>● Active Bot</span>
                      <span style={{ color: '#0284C7', fontWeight: 700 }}>
                        Open Dedicated Dashboard &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Central Super Admin Approval Inbox */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0F172A', fontWeight: 800 }}>
              {activeAgent ? `${activeAgent.name}'s Tasks & Workflow Execution Log` : 'Central Approval Inbox & Review Queue'}
            </h3>
            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '13px' }}>
              {activeAgent
                ? `Dedicated operational queue, dispatches, and verification history for ${activeAgent.name} (${activeAgent.department}).`
                : 'Pending drafts from Ananya Mehta, Riya Shah, Neha Desai, and Arjun Yadav awaiting Super Admin verification.'}
            </p>
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search reference, customer, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                width: '260px'
              }}
            />

            <select
              value={selectedAgentFilter}
              onChange={(e) => setSelectedAgentFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', background: '#FFFFFF' }}
            >
              <option value="All">All 4 Agents</option>
              <option value="ananya-mehta">Ananya Mehta (Quotations)</option>
              <option value="riya-shah">Riya Shah (Invoicing)</option>
              <option value="neha-desai">Neha Desai (Support Desk)</option>
              <option value="arjun-yadav">Arjun Yadav (Operations)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', background: '#FFFFFF' }}
            >
              <option value="All">All Statuses</option>
              <option value="pending_review">Pending Super Admin Review</option>
              <option value="pending_super_admin_confirmation">Pending Confirmation</option>
              <option value="approved">Approved &amp; Executed</option>
              <option value="changes_requested">Changes Requested</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Task Table */}
        {loading ? (
          <div style={{ padding: '40px 20px' }}>
            <Loader variant="skeleton-table" rows={6} label="Loading AI tasks &amp; approval queue..." />
          </div>
        ) : filteredTasks.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '12px' }}>Timestamp</th>
                  <th style={{ padding: '12px' }}>Specialist Agent</th>
                  <th style={{ padding: '12px' }}>Task &amp; Reference</th>
                  <th style={{ padding: '12px' }}>Customer / Client</th>
                  <th style={{ padding: '12px' }}>Approval Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((t) => {
                  const isPending = t.approvalStatus === 'pending_review' || t.approvalStatus === 'pending_super_admin_confirmation';
                  return (
                    <tr key={t._id} style={{ borderBottom: '1px solid #F1F5F9', background: isPending ? '#FFFBEB' : '#FFFFFF' }}>
                      <td style={{ padding: '12px', color: '#64748B', whiteSpace: 'nowrap' }}>
                        {new Date(t.createdAt).toLocaleDateString()}<br/>
                        <small>{new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1rem' }}>
                            {t.agentId === 'ananya-mehta' ? '📊' : t.agentId === 'riya-shah' ? '🧾' : t.agentId === 'neha-desai' ? '📝' : '💬'}
                          </span>
                          <div>
                            <strong style={{ color: '#0F172A' }}>{t.agentName}</strong>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>{t.agentRole}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 600, color: '#0F172A' }}>{t.title}</div>
                        <small style={{ color: '#0284C7' }}>
                          {t.proposedPayload?.quotationNumber || t.proposedPayload?.invoiceNumber || t.proposedPayload?.targetRef || t.taskType}
                        </small>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div><strong>{t.proposedPayload?.customerName || t.customerId?.name || 'Direct Client'}</strong></div>
                        <small style={{ color: '#64748B' }}>{t.proposedPayload?.company || t.customerId?.company || t.proposedPayload?.email}</small>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            background:
                              t.approvalStatus === 'approved' ? '#DCFCE7' :
                              t.approvalStatus === 'rejected' ? '#FEE2E2' :
                              t.approvalStatus === 'changes_requested' ? '#FEF3C7' : '#FEF3C7',
                            color:
                              t.approvalStatus === 'approved' ? '#15803D' :
                              t.approvalStatus === 'rejected' ? '#B91C1C' :
                              t.approvalStatus === 'changes_requested' ? '#B45309' : '#B45309'
                          }}
                        >
                          {t.approvalStatus === 'pending_super_admin_confirmation'
                            ? '⏳ Awaiting Super Admin'
                            : t.approvalStatus.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn--sm"
                          style={{
                            background: isPending ? '#0284C7' : '#F1F5F9',
                            color: isPending ? '#FFFFFF' : '#334155',
                            border: 'none',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: 700
                          }}
                          onClick={() => handleOpenReview(t)}
                        >
                          {isPending ? '🔍 Review & Authorize' : '👁️ View Draft'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '50px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🛡️</div>
            <h4 style={{ margin: '0 0 6px 0', color: '#0F172A' }}>Queue is Clear</h4>
            <p style={{ color: '#64748B', maxWidth: '400px', margin: '0 auto', fontSize: '13px' }}>
              No AI tasks currently match your filter criteria. All active quotation, billing, and inquiry dispatches are verified.
            </p>
          </div>
        )}
      </div>

      {/* =========================================================================
          SUPER ADMIN REVIEW DRAWER / MODAL
          ========================================================================= */}
      {activeTask && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}
          onClick={() => setActiveTask(null)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '850px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid #E2E8F0'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#0284C7', letterSpacing: '0.05em' }}>
                  Super Admin Dispatch Authorization Review
                </span>
                <h3 style={{ margin: '4px 0 0 0', color: '#0F172A', fontSize: '1.25rem' }}>
                  {activeTask.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTask(null)}
                style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              {/* Agent Attribution Banner */}
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#1E3A8A' }}>Drafted by Agent: {activeTask.agentName}</strong>
                  <div style={{ fontSize: '12px', color: '#1E40AF' }}>Role: {activeTask.agentRole} • Task Type: {activeTask.taskType}</div>
                </div>
                <span style={{ fontSize: '11px', background: '#DBEAFE', color: '#1E40AF', padding: '4px 8px', borderRadius: '6px', fontWeight: 700 }}>
                  Chirag Shah Review Mandatory
                </span>
              </div>

              {/* Customer Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', fontSize: '13px', background: '#F8FAFC', padding: '14px', borderRadius: '8px' }}>
                <div><strong>Customer:</strong> {activeTask.proposedPayload?.customerName || 'N/A'}</div>
                <div><strong>Company:</strong> {activeTask.proposedPayload?.company || 'N/A'}</div>
                <div><strong>Email:</strong> {activeTask.proposedPayload?.email || 'N/A'}</div>
                <div><strong>Phone / WhatsApp:</strong> {activeTask.proposedPayload?.phone || 'N/A'}</div>
              </div>

              {/* Payload Section 1: Line Items (for Quotations & Invoices) */}
              {activeTask.proposedPayload?.lineItems && activeTask.proposedPayload.lineItems.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#0F172A' }}>Proposed Line Items &amp; Verified Specifications:</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', border: '1px solid #E2E8F0' }}>
                    <thead>
                      <tr style={{ background: '#F1F5F9' }}>
                        <th style={{ padding: '8px', border: '1px solid #E2E8F0' }}>Item Description</th>
                        <th style={{ padding: '8px', border: '1px solid #E2E8F0' }}>Grade &amp; Finish</th>
                        <th style={{ padding: '8px', border: '1px solid #E2E8F0' }}>Qty</th>
                        <th style={{ padding: '8px', border: '1px solid #E2E8F0' }}>Unit Price (₹)</th>
                        <th style={{ padding: '8px', border: '1px solid #E2E8F0' }}>Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTask.proposedPayload.lineItems.map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: '8px', border: '1px solid #E2E8F0' }}>{item.description}</td>
                          <td style={{ padding: '8px', border: '1px solid #E2E8F0' }}>{item.grade} • {item.finish}</td>
                          <td style={{ padding: '8px', border: '1px solid #E2E8F0' }}>{item.quantity} {item.unit}</td>
                          <td style={{ padding: '8px', border: '1px solid #E2E8F0' }}>₹{Number(item.unitPrice).toLocaleString('en-IN')}</td>
                          <td style={{ padding: '8px', border: '1px solid #E2E8F0', fontWeight: 700 }}>₹{Number(item.lineTotal || item.quantity * item.unitPrice).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                    <div style={{ width: '280px', fontSize: '13px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                        <span>Subtotal:</span>
                        <strong>₹{Number(activeTask.proposedPayload?.subtotal || 0).toLocaleString('en-IN')}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                        <span>GST (18% HSN):</span>
                        <strong>₹{Number(activeTask.proposedPayload?.taxTotal || 0).toLocaleString('en-IN')}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '2px solid #0F172A', color: '#0284C7', fontSize: '15px' }}>
                        <span>Grand Total:</span>
                        <strong>₹{Number(activeTask.proposedPayload?.grandTotal || 0).toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payload Section 2: Contact Inquiry or Live Chat Response */}
              {(activeTask.taskType === 'customer_inquiry_resolution' || activeTask.taskType === 'chat_inquiry_update') && (
                <div style={{ marginBottom: '20px' }}>
                  {activeTask.proposedPayload?.customerMessage && (
                    <div style={{ background: '#F8FAFC', borderLeft: '4px solid #CBD5E1', padding: '12px', marginBottom: '14px', borderRadius: '4px' }}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>ORIGINAL CUSTOMER INQUIRY:</div>
                      <div style={{ fontSize: '13px', color: '#1E293B', marginTop: '4px', whiteSpace: 'pre-line' }}>
                        {activeTask.proposedPayload.customerMessage}
                      </div>
                    </div>
                  )}

                  {activeTask.staffReplyDraft && (
                    <div style={{ background: '#EFF6FF', borderLeft: '4px solid #3B82F6', padding: '12px', marginBottom: '14px', borderRadius: '4px' }}>
                      <div style={{ fontSize: '11px', color: '#1D4ED8', fontWeight: 700 }}>PROPOSED STAFF DRAFT:</div>
                      <div style={{ fontSize: '13px', color: '#1E293B', marginTop: '4px', whiteSpace: 'pre-line' }}>
                        {activeTask.staffReplyDraft}
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: '12px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                      Super Admin Response Editor (Dispatched via {activeTask.agentName}):
                    </label>
                    <textarea
                      rows={5}
                      value={editedReplyText}
                      onChange={(e) => setEditedReplyText(e.target.value)}
                      placeholder="Review or edit the response text before customer dispatch..."
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                    />
                  </div>
                </div>
              )}

              {/* Super Admin Review Notes */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Super Admin Executive Review Notes (Internal Audit Log):
                </label>
                <input
                  type="text"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="e.g. Confirmed against ready mill inventory and EN 10204 3.1 MTR specifications."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn--outline-dark btn--sm"
                    onClick={handleRequestChanges}
                    disabled={isProcessing || !isSuperAdmin}
                  >
                    ✏️ Request Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn--outline btn--sm"
                    style={{ borderColor: '#EF4444', color: '#DC2626' }}
                    onClick={handleRejectTask}
                    disabled={isProcessing || !isSuperAdmin}
                  >
                    ✕ Reject Draft
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    style={{ background: '#059669', borderColor: '#059669' }}
                    onClick={handleApproveTask}
                    disabled={isProcessing || !isSuperAdmin}
                  >
                    {isProcessing ? 'Authorizing & Dispatching...' : '✓ Approve & Dispatch (Email & WhatsApp)'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          NEW INVOICE MODAL (RIYA SHAH)
          ========================================================================= */}
      {showCreateInvoiceModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}
          onClick={() => setShowCreateInvoiceModal(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid #E2E8F0',
              padding: '24px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284C7', textTransform: 'uppercase' }}>Riya Shah • Billing Desk</span>
                <h3 style={{ margin: '4px 0 0 0', color: '#0F172A', fontSize: '1.25rem' }}>Create Commercial Tax Invoice (18% GST)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateInvoiceModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newInvoiceData.customerName}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, customerName: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newInvoiceData.company}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, company: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Billing Email *</label>
                  <input
                    type="email"
                    required
                    value={newInvoiceData.email}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, email: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={newInvoiceData.phone}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, phone: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Billing &amp; Delivery Address</label>
                <input
                  type="text"
                  value={newInvoiceData.billingAddress}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, billingAddress: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  placeholder="e.g. Unit 4, Phase II, MIDC Rabale, Navi Mumbai"
                />
              </div>

              {/* Line Items */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700 }}>Line Items (Standard 18% GST Applied)</label>
                  <button
                    type="button"
                    onClick={() => {
                      setNewInvoiceData({
                        ...newInvoiceData,
                        lineItems: [
                          ...newInvoiceData.lineItems,
                          {
                            description: 'SS 316L Sanitary Fitting',
                            grade: 'SS 316L',
                            size: '1.5"',
                            nominalSize: '1.5"',
                            finish: 'Electro Polished',
                            quantity: 1,
                            unit: 'Pcs',
                            unitPrice: 500
                          }
                        ]
                      });
                    }}
                    style={{ fontSize: '11px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#0284C7', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    + Add Line Item
                  </button>
                </div>

                {newInvoiceData.lineItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr auto', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => {
                        const items = [...newInvoiceData.lineItems];
                        items[idx].description = e.target.value;
                        setNewInvoiceData({ ...newInvoiceData, lineItems: items });
                      }}
                      style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => {
                        const items = [...newInvoiceData.lineItems];
                        items[idx].quantity = Number(e.target.value);
                        setNewInvoiceData({ ...newInvoiceData, lineItems: items });
                      }}
                      style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                    />
                    <input
                      type="text"
                      placeholder="Unit"
                      value={item.unit}
                      onChange={(e) => {
                        const items = [...newInvoiceData.lineItems];
                        items[idx].unit = e.target.value;
                        setNewInvoiceData({ ...newInvoiceData, lineItems: items });
                      }}
                      style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                    />
                    <input
                      type="number"
                      placeholder="Unit Price"
                      value={item.unitPrice}
                      min="0"
                      onChange={(e) => {
                        const items = [...newInvoiceData.lineItems];
                        items[idx].unitPrice = Number(e.target.value);
                        setNewInvoiceData({ ...newInvoiceData, lineItems: items });
                      }}
                      style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                    />
                    {newInvoiceData.lineItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setNewInvoiceData({
                            ...newInvoiceData,
                            lineItems: newInvoiceData.lineItems.filter((_, i) => i !== idx)
                          });
                        }}
                        style={{ border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer', fontSize: '16px' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                <button
                  type="button"
                  className="btn btn--outline-dark btn--sm"
                  onClick={() => setShowCreateInvoiceModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn--primary btn--sm"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Generating...' : 'Create Invoice Draft & Submit to Super Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMAiOperationsView;

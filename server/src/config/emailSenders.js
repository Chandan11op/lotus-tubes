/**
 * Lotus Tubes - Centralized Email Senders Registry & Allowlist
 * Defines the 4 dedicated AI Agent sender identities and system business address.
 * 
 * IMPORTANT ARCHITECTURAL RULE:
 * The 4 agent addresses are verified-domain sender identities configured in Resend.
 * They are NOT separate Hostinger mailboxes. Customer replies route to sales@lotustubes.com.
 */

export const BUSINESS_MAILBOX = 'sales@lotustubes.com';
export const BUSINESS_NAME = 'Lotus Tubes';

export const AI_AGENT_SENDERS = {
  'ananya-mehta': {
    id: 'ananya-mehta',
    botNumber: 1,
    name: 'Ananya Mehta',
    email: 'ananyamehta@lotustubes.com',
    role: 'quotation_specialist',
    title: 'AI Quotation & Commercial RFQ Specialist',
    department: 'Sales & Commercial Proposals',
    defaultReplyTo: BUSINESS_MAILBOX,
    photoUrl: '/assets/images/team/agent-1.jpeg'
  },
  'riya-shah': {
    id: 'riya-shah',
    botNumber: 2,
    name: 'Riya Shah',
    email: 'riyashah@lotustubes.com',
    role: 'billing_specialist',
    title: 'AI Commercial Billing & Invoicing Specialist',
    department: 'Accounts & Tax Compliance',
    defaultReplyTo: BUSINESS_MAILBOX,
    photoUrl: '/assets/images/team/agent-2.jpeg'
  },
  'neha-desai': {
    id: 'neha-desai',
    botNumber: 3,
    name: 'Neha Desai',
    email: 'nehadesai@lotustubes.com',
    role: 'support_concierge',
    title: 'AI Customer Inquiries & Support Concierge',
    department: 'Client Services & Quality Docs',
    defaultReplyTo: BUSINESS_MAILBOX,
    photoUrl: '/assets/images/team/agent-3.jpeg'
  },
  'arjun-yadav': {
    id: 'arjun-yadav',
    botNumber: 4,
    name: 'Arjun Yadav',
    email: 'arjunyadav@lotustubes.com',
    role: 'operations_manager',
    title: 'AI Operations Manager & Live Concierge',
    department: 'Executive Operations Desk',
    defaultReplyTo: BUSINESS_MAILBOX,
    photoUrl: '/assets/images/team/agent-4.jpeg'
  },
  'system': {
    id: 'system',
    botNumber: 0,
    name: 'Lotus Tubes',
    email: BUSINESS_MAILBOX,
    role: 'system_notification',
    title: 'Lotus Tubes Automated Notifications',
    department: 'System & Security',
    defaultReplyTo: BUSINESS_MAILBOX,
    photoUrl: '/banner-image-opt.png'
  }
};

/**
 * Validates whether an agent ID is in the approved sender allowlist
 * @param {string} agentId 
 * @returns {boolean}
 */
export const isValidSenderId = (agentId) => {
  if (!agentId || typeof agentId !== 'string') return false;
  return Object.prototype.hasOwnProperty.call(AI_AGENT_SENDERS, agentId);
};

/**
 * Retrieves the sender definition by agent ID, falling back to system
 * @param {string} [agentId] 
 * @returns {typeof AI_AGENT_SENDERS['system']}
 */
export const getSenderById = (agentId) => {
  if (agentId && isValidSenderId(agentId)) {
    return AI_AGENT_SENDERS[agentId];
  }
  return AI_AGENT_SENDERS.system;
};

/**
 * Formats a valid RFC 5322 From header: "Display Name <email@domain.com>"
 * @param {string|Object} senderOrId 
 * @returns {string}
 */
export const formatFromHeader = (senderOrId) => {
  const sender = typeof senderOrId === 'string' ? getSenderById(senderOrId) : senderOrId;
  const name = sender?.name || BUSINESS_NAME;
  const email = sender?.email || BUSINESS_MAILBOX;
  return `${name} <${email}>`;
};

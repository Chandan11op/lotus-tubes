import mongoose from 'mongoose';

/**
 * Centralized AuditLog Schema
 * Strictly records business-critical and security-sensitive events.
 * Never stores plaintext passwords, OTPs, session tokens, or API secrets.
 */
const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      id: { type: String, default: 'system' },
      name: { type: String, default: 'System' },
      email: { type: String, default: 'system@lotustubes.com' },
      role: { type: String, default: 'system' }
    },
    action: {
      type: String,
      required: true,
      index: true
    },
    targetType: {
      type: String,
      enum: ['User', 'Quote', 'Enquiry', 'Customer', 'Product', 'System'],
      default: 'Quote',
      index: true
    },
    targetId: {
      type: String,
      default: ''
    },
    targetRef: {
      type: String,
      default: '',
      index: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ip: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);


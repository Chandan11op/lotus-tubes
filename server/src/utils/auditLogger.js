import { AuditLog } from '../models/AuditLog.js';
import mongoose from 'mongoose';

/**
 * Log a secure audit event
 * @param {Object} params
 * @param {Object} [params.actor] - Current authenticated user ({ id, name, email, role })
 * @param {string} params.action - Audit action key (e.g. 'QUOTATION_APPROVED')
 * @param {string} params.targetType - Target entity type ('User', 'Quote', 'Enquiry', etc.)
 * @param {string} [params.targetId] - Target ID
 * @param {string} [params.targetRef] - Target Reference / Code
 * @param {Object} [params.metadata] - Non-sensitive metadata
 * @param {string} [params.ip] - Client IP
 */
export async function recordAuditEvent({
  actor = null,
  action,
  targetType = 'Quote',
  targetId = '',
  targetRef = '',
  metadata = {},
  ip = ''
}) {
  try {
    const actorData = actor
      ? {
          id: String(actor.id || actor._id || 'anonymous'),
          name: actor.name || 'Anonymous',
          email: actor.email || 'anonymous@lotustubes.com',
          role: actor.role || 'guest'
        }
      : {
          id: 'system',
          name: 'System Worker',
          email: 'system@lotustubes.com',
          role: 'system'
        };

    // Sanitize metadata to never include password or otp fields
    const safeMetadata = { ...metadata };
    delete safeMetadata.password;
    delete safeMetadata.token;
    delete safeMetadata.otp;
    delete safeMetadata.resetPasswordOtpHash;

    if (mongoose.connection.readyState === 1) {
      await AuditLog.create({
        actor: actorData,
        action,
        targetType,
        targetId: String(targetId || ''),
        targetRef: String(targetRef || ''),
        metadata: safeMetadata,
        ip: ip || ''
      });
    } else {
      // In-memory fallback during DB disconnect
      console.log(`[AUDIT EVENT] ${action} by ${actorData.email} on ${targetType} (${targetRef || targetId})`);
    }
  } catch (err) {
    console.error('Failed to record audit event:', err.message);
  }
}


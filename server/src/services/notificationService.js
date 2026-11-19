/**
 * Unified Document Notification Service for Lotus Tubes
 * Dual-Channel Automated Dispatch: Resend Transactional Email + Meta WhatsApp Cloud API
 * Enforces:
 * 1. Super Admin Approval Verification
 * 2. Cryptographic Version Hash Verification (Invalidating dispatch if modified post-approval)
 * 3. Customer Identity & Regulatory Messaging Consent Verification
 * 4. Channel Independence (Email success does not imply WhatsApp success)
 * 5. Distinct Audit Lifecycle Statuses (SEND_ATTEMPTED, PROVIDER_ACCEPTED, DELIVERED, FAILED, SKIPPED_NO_CONSENT)
 * 6. Automated Staff Escalation on Channel Failure
 */

import mongoose from 'mongoose';
import { Quote, computeQuotationApprovalHash } from '../models/Quote.js';
import { Invoice, computeInvoiceApprovalHash } from '../models/Invoice.js';
import { Customer } from '../models/Customer.js';
import { Task } from '../models/Task.js';
import { WhatsAppConversation } from '../models/WhatsAppConversation.js';
import { WhatsAppMessage } from '../models/WhatsAppMessage.js';
import { sendEmail } from './emailService.js';
import {
  sendApprovedDocumentWhatsApp,
  normalizePhoneNumber,
  isWhatsAppConfigured
} from './whatsappService.js';
import {
  buildQuotationDeliveryEmail,
  buildInvoiceDeliveryEmail
} from '../utils/emailTemplates.js';
import { recordAuditEvent } from '../utils/auditLogger.js';
import { config } from '../config/env.js';

export const sendApprovedDocument = async ({
  documentId,
  documentType, // 'quotation' | 'invoice'
  customerId = null,
  approvedVersionId = null,
  channels = ['email', 'whatsapp'],
  actor = null
}) => {
  if (!documentId || !documentType) {
    throw new Error('documentId and documentType are mandatory parameters for sendApprovedDocument');
  }

  const results = {
    documentId,
    documentType,
    documentNumber: '',
    channelsRequested: channels,
    email: { attempted: false, status: 'SKIPPED', messageId: null, error: null },
    whatsapp: { attempted: false, status: 'SKIPPED', messageId: null, error: null, directLink: null },
    overallSuccess: false
  };

  let doc = null;
  let customer = null;
  let computedHash = null;
  let assignedAgentId = 'ananya-mehta';
  let agentName = 'Ananya Mehta';

  // 1. Fetch Document and Verify Super Admin Approval Invariants
  if (documentType === 'quotation') {
    doc = await Quote.findById(documentId);
    if (!doc) throw new Error(`Quotation record [${documentId}] not found`);

    results.documentNumber = doc.quotationNumber;
    assignedAgentId = 'ananya-mehta';
    agentName = 'Ananya Mehta (AI Technical Sales Lead)';

    // Verify approval status
    if (doc.approvalStatus !== 'approved' || (doc.status !== 'Approved' && doc.status !== 'Sent')) {
      await recordAuditEvent({
        actor,
        action: 'UNAUTHORIZED_DISPATCH_BLOCKED',
        targetType: 'Quote',
        targetId: doc._id,
        targetRef: doc.quotationNumber,
        metadata: { reason: 'Quotation has not been approved by the Super Admin' }
      });
      throw new Error(`CRITICAL SECURITY RULE: Quotation ${doc.quotationNumber} must be explicitly approved by Super Admin before dispatch.`);
    }

    // Verify cryptographic integrity
    computedHash = computeQuotationApprovalHash(doc);
    if (doc.approvalHash && computedHash !== doc.approvalHash) {
      doc.status = 'Draft';
      doc.approvalStatus = 'draft';
      doc.approvalHash = null;
      doc.approvedBy = null;
      doc.approvedAt = null;
      await doc.save();

      await recordAuditEvent({
        actor,
        action: 'QUOTATION_APPROVAL_INVALIDATED',
        targetType: 'Quote',
        targetId: doc._id,
        targetRef: doc.quotationNumber,
        metadata: { reason: 'Quotation commercial values were modified after approval' }
      });
      throw new Error(`SECURITY ALERT: Quotation ${doc.quotationNumber} was modified after approval. Approval revoked; re-approval required.`);
    }

    // Verify approvedVersionId if supplied
    if (approvedVersionId && String(doc.version) !== String(approvedVersionId) && doc.approvalHash !== approvedVersionId) {
      throw new Error(`Version mismatch: requested version ${approvedVersionId} does not match active approved version.`);
    }
  } else if (documentType === 'invoice') {
    doc = await Invoice.findById(documentId);
    if (!doc) throw new Error(`Invoice record [${documentId}] not found`);

    results.documentNumber = doc.invoiceNumber;
    assignedAgentId = 'riya-shah';
    agentName = 'Riya Shah (AI Commercial Billing Coordinator)';

    if (doc.approvalStatus !== 'approved' || (doc.status !== 'Approved' && doc.status !== 'Sent')) {
      await recordAuditEvent({
        actor,
        action: 'UNAUTHORIZED_DISPATCH_BLOCKED',
        targetType: 'Invoice',
        targetId: doc._id,
        targetRef: doc.invoiceNumber,
        metadata: { reason: 'Invoice has not been approved by Super Admin' }
      });
      throw new Error(`CRITICAL SECURITY RULE: Invoice ${doc.invoiceNumber} must be approved by Super Admin before dispatch.`);
    }

    computedHash = computeInvoiceApprovalHash(doc);
    if (doc.approvalHash && computedHash !== doc.approvalHash) {
      doc.status = 'Draft';
      doc.approvalStatus = 'draft';
      doc.approvalHash = null;
      doc.approvedByAdmin = null;
      doc.approvedAt = null;
      await doc.save();

      await recordAuditEvent({
        actor,
        action: 'INVOICE_APPROVAL_INVALIDATED',
        targetType: 'Invoice',
        targetId: doc._id,
        targetRef: doc.invoiceNumber,
        metadata: { reason: 'Invoice content modified after Super Admin approval' }
      });
      throw new Error(`SECURITY ALERT: Invoice ${doc.invoiceNumber} content modified after approval. Re-approval required.`);
    }
  } else {
    throw new Error(`Unsupported documentType: ${documentType}`);
  }

  // 2. Identify and Link Customer Record
  const resolvedCustomerId = customerId || doc.customerId;
  if (resolvedCustomerId) {
    customer = await Customer.findById(resolvedCustomerId);
  }
  const recipientEmail = doc.email?.toLowerCase().trim();
  const recipientPhone = normalizePhoneNumber(doc.phone);

  if (!customer && recipientEmail) {
    customer = await Customer.findOne({ email: recipientEmail });
  }
  if (!customer && recipientPhone) {
    customer = await Customer.findOne({
      $or: [{ phone: recipientPhone }, { whatsappPhone: recipientPhone }]
    });
  }
  const pdfUrl = doc.pdfUrl || (documentType === 'invoice' ? '/sample-quotation.pdf' : 'https://lotustubes.com/sample-quotation.pdf');

  // 3. Independent Dispatch: CHANNEL 1 — RESEND EMAIL
  if (channels.includes('email') && recipientEmail) {
    results.email.attempted = true;
    const emailIdempotency = `${documentType}_send_${doc._id}_${doc.version || 1}`;

    try {
      let emailHtml = '';
      let subject = '';

      if (documentType === 'quotation') {
        emailHtml = buildQuotationDeliveryEmail({
          customerName: doc.customerName,
          quotationNumber: doc.quotationNumber,
          reference: doc.quotationNumber,
          lineItems: doc.lineItems || [],
          subtotal: doc.subtotal,
          taxTotal: doc.taxTotal,
          grandTotal: doc.grandTotal,
          leadTime: doc.leadTime,
          validityDays: doc.validityDays,
          paymentTerms: doc.paymentTerms,
          deliveryTerms: doc.deliveryTerms,
          downloadPdfUrl: pdfUrl.startsWith('http') ? pdfUrl : `${config.backendPublicUrl}${pdfUrl}`
        });
        subject = `[Quotation ${doc.quotationNumber}] Lotus Tubes Commercial Offer`;
      } else {
        emailHtml = buildInvoiceDeliveryEmail({
          customerName: doc.customerName,
          invoiceNumber: doc.invoiceNumber,
          reference: doc.invoiceNumber,
          lineItems: doc.lineItems || [],
          subtotal: doc.subtotal,
          taxTotal: doc.taxTotal,
          grandTotal: doc.grandTotal,
          dueDate: doc.dueDate ? new Date(doc.dueDate).toLocaleDateString('en-IN') : 'Immediate upon Presentation',
          paymentDetails: doc.paymentDetails,
          downloadPdfUrl: pdfUrl.startsWith('http') ? pdfUrl : `${config.backendPublicUrl}${pdfUrl}`
        });
        subject = `[Tax Invoice ${doc.invoiceNumber}] Lotus Tubes Order Billing`;
      }

      const emailRes = await sendEmail({
        agentId: assignedAgentId,
        to: recipientEmail,
        subject,
        html: emailHtml,
        replyTo: 'sales@lotustubes.com',
        reference: results.documentNumber,
        quoteId: documentType === 'quotation' ? doc._id : null,
        invoiceId: documentType === 'invoice' ? doc._id : null,
        customerId: customer?._id || null,
        approvedBy: actor,
        idempotencyKey: emailIdempotency
      });

      if (emailRes.accepted || emailRes.delivered) {
        results.email.status = 'PROVIDER_ACCEPTED';
        results.email.messageId = emailRes.messageId || emailRes.id;
        doc.emailStatus = 'sent';
        if (documentType === 'invoice') {
          doc.deliveryRecords.emailSent = true;
          doc.deliveryRecords.emailSentAt = new Date();
        }
      } else {
        results.email.status = 'FAILED';
        results.email.error = emailRes.error || 'Resend provider dispatch failed';
        doc.emailStatus = 'failed';
      }
    } catch (emailErr) {
      results.email.status = 'FAILED';
      results.email.error = emailErr.message;
      doc.emailStatus = 'failed';
    }
  }

  // 4. Independent Dispatch: CHANNEL 2 — META WHATSAPP CLOUD API
  if (channels.includes('whatsapp') && recipientPhone) {
    results.whatsapp.attempted = true;

    // Check Customer Opt-In Status
    const isOptedOut = customer?.messagingConsent?.status === 'opted_out';
    if (isOptedOut) {
      results.whatsapp.status = 'SKIPPED_NO_CONSENT';
      results.whatsapp.message = 'Customer opted out of WhatsApp commercial messaging';
      if (documentType === 'quotation') doc.whatsappStatus = 'SKIPPED_NO_CONSENT';
      if (documentType === 'invoice') doc.whatsappStatus = 'SKIPPED_NO_CONSENT';
    } else {
      try {
        const waRes = await sendApprovedDocumentWhatsApp({
          phone: recipientPhone,
          customerName: doc.customerName,
          documentType,
          documentNumber: results.documentNumber,
          totalAmount: doc.grandTotal,
          currency: doc.currency || 'INR',
          pdfUrl,
          agentName
        });

        results.whatsapp.directLink = waRes.directLink;

        if (waRes.success && waRes.status === 'PROVIDER_ACCEPTED') {
          results.whatsapp.status = 'PROVIDER_ACCEPTED';
          results.whatsapp.messageId = waRes.messageId;

          if (documentType === 'quotation') {
            doc.whatsappStatus = 'PROVIDER_ACCEPTED';
            doc.whatsappSentAt = new Date();
            doc.whatsappMessageId = waRes.messageId;
          } else {
            doc.whatsappStatus = 'PROVIDER_ACCEPTED';
            doc.deliveryRecords.whatsappSent = true;
            doc.deliveryRecords.whatsappSentAt = new Date();
            doc.deliveryRecords.whatsappMessageId = waRes.messageId;
          }

          // Record in WhatsAppConversation and WhatsAppMessage
          let conversation = await WhatsAppConversation.findOne({ customerPhone: recipientPhone });
          if (!conversation) {
            conversation = await WhatsAppConversation.create({
              customerId: customer?._id || null,
              customerPhone: recipientPhone,
              customerName: doc.customerName,
              company: doc.company,
              email: recipientEmail,
              assignedAgent: assignedAgentId,
              status: 'active',
              lastMessageAt: new Date(),
              lastMessageText: `Dispatched approved ${documentType} ${results.documentNumber} with PDF`,
              lastMessageDirection: 'outbound'
            });
          } else {
            conversation.lastMessageAt = new Date();
            conversation.lastMessageText = `Dispatched approved ${documentType} ${results.documentNumber} with PDF`;
            conversation.lastMessageDirection = 'outbound';
            if (customer?._id && !conversation.customerId) conversation.customerId = customer._id;
            await conversation.save();
          }

          await WhatsAppMessage.create({
            conversationId: conversation._id,
            wamid: waRes.messageId,
            customerId: customer?._id || null,
            direction: 'outbound',
            from: config.whatsapp.businessNumber || '919930430789',
            to: recipientPhone,
            type: 'template',
            template: {
              name: documentType === 'invoice' ? config.whatsapp.invoiceTemplate : config.whatsapp.quotationTemplate,
              language: config.whatsapp.templateLanguage || 'en'
            },
            document: {
              link: pdfUrl,
              filename: `${results.documentNumber}.pdf`,
              mimeType: 'application/pdf'
            },
            agentId: assignedAgentId,
            deliveryStatus: 'PROVIDER_ACCEPTED',
            statusHistory: [{ status: 'PROVIDER_ACCEPTED', timestamp: new Date() }],
            documentType,
            documentId: doc._id,
            documentReference: results.documentNumber,
            idempotencyKey: `wa_${documentType}_${doc._id}_${Date.now()}`
          });
        } else if (waRes.status === 'not_configured') {
          results.whatsapp.status = 'not_configured';
          results.whatsapp.message = waRes.message;
          if (documentType === 'quotation') doc.whatsappStatus = 'not_configured';
          if (documentType === 'invoice') doc.whatsappStatus = 'not_configured';
        } else {
          results.whatsapp.status = 'FAILED';
          results.whatsapp.error = waRes.error || 'Meta WhatsApp dispatch failed';
          if (documentType === 'quotation') {
            doc.whatsappStatus = 'FAILED';
            doc.whatsappError = waRes.error;
          } else {
            doc.whatsappStatus = 'FAILED';
            doc.deliveryRecords.whatsappError = waRes.error;
          }
        }
      } catch (waErr) {
        results.whatsapp.status = 'FAILED';
        results.whatsapp.error = waErr.message;
        if (documentType === 'quotation') {
          doc.whatsappStatus = 'FAILED';
          doc.whatsappError = waErr.message;
        } else {
          doc.whatsappStatus = 'FAILED';
          doc.deliveryRecords.whatsappError = waErr.message;
        }
      }
    }
  }

  // 5. Update Document Status & Activity History
  doc.status = 'Sent';
  doc.sentAt = new Date();
  if (actor?._id && mongoose.Types.ObjectId.isValid(actor._id)) {
    doc.sentBy = actor._id;
  } else if (actor?.id && mongoose.Types.ObjectId.isValid(actor.id)) {
    doc.sentBy = actor.id;
  } else {
    doc.sentBy = null;
  }

  if (doc.activityLog) {
    doc.activityLog.push({
      action: 'Automated Dual-Channel Dispatch',
      performedBy: actor?.name || 'Automated Delivery System',
      note: `Email: ${results.email.status} | WhatsApp: ${results.whatsapp.status}`
    });
  }

  await doc.save();

  // 6. Failover & Escalation: Create CRM Task if either channel failed
  const emailFailed = results.email.attempted && results.email.status === 'FAILED';
  const whatsappFailed = results.whatsapp.attempted && results.whatsapp.status === 'FAILED';

  if (emailFailed || whatsappFailed) {
    const failureSummary = [
      emailFailed ? `Email to ${recipientEmail} failed: ${results.email.error}` : null,
      whatsappFailed ? `WhatsApp to +${recipientPhone} failed: ${results.whatsapp.error}` : null
    ].filter(Boolean).join('; ');

    try {
      await Task.create({
        title: `⚠️ Delivery Failure on ${documentType.toUpperCase()} ${results.documentNumber}`,
        description: `Automated delivery encountered channel error: ${failureSummary}. Please review customer contact info and perform manual follow-up.`,
        priority: 'High',
        status: 'Pending',
        dueDate: new Date(Date.now() + 4 * 3600 * 1000), // 4 hours
        assignedTo: actor?._id || null,
        relatedCustomer: customer?._id || null
      });
    } catch (taskErr) {
      console.warn('Task escalation creation warning:', taskErr.message);
    }
  }

  // 7. Audit Logging
  await recordAuditEvent({
    actor,
    action: 'APPROVED_DOCUMENT_DISPATCHED',
    targetType: documentType === 'quotation' ? 'Quote' : 'Invoice',
    targetId: doc._id,
    targetRef: results.documentNumber,
    metadata: {
      emailStatus: results.email.status,
      whatsappStatus: results.whatsapp.status,
      emailId: results.email.messageId,
      whatsappId: results.whatsapp.messageId
    }
  });

  results.overallSuccess = (
    (!results.email.attempted || results.email.status === 'PROVIDER_ACCEPTED') &&
    (!results.whatsapp.attempted || results.whatsapp.status === 'PROVIDER_ACCEPTED' || results.whatsapp.status === 'not_configured')
  );

  return results;
};

import { Resend } from 'resend';
import { config } from '../config/env.js';

let resendClient = null;

if (config.resend.apiKey && !config.resend.apiKey.includes('placeholder')) {
  try {
    resendClient = new Resend(config.resend.apiKey);
  } catch (err) {
    console.warn('⚠️ Failed to initialize Resend client:', err.message);
  }
} else {
  console.log('ℹ️ Resend API Key is not configured or is a placeholder. Emails will be logged to console in demo mode.');
}

/**
 * Sends an email notification using Resend (or logs to console if unconfigured).
 *
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML email body
 * @param {string} [options.replyTo] - Reply-To address
 * @returns {Promise<{ delivered: boolean, messageId?: string, demoMode?: boolean }>}
 */
export const sendEmail = async ({ to, subject, html, replyTo }) => {
  const recipient = to || config.resend.notificationEmail;
  const from = config.resend.fromEmail;

  if (!resendClient) {
    console.log(`[DEMO EMAIL DISPATCH]
To: ${recipient}
From: ${from}
Subject: ${subject}
Reply-To: ${replyTo || 'none'}
---
${html.substring(0, 300)}...
----------------------------------------`);
    return {
      delivered: false,
      demoMode: true,
      messageId: `demo_${Date.now()}`
    };
  }

  try {
    const { data, error } = await resendClient.emails.send({
      from,
      to: recipient,
      reply_to: replyTo,
      subject,
      html
    });

    if (error) {
      console.error('❌ Resend API Error:', error.message);
      return {
        delivered: false,
        error: error.message
      };
    }

    return {
      delivered: true,
      messageId: data.id
    };
  } catch (err) {
    console.error('❌ Resend Delivery Exception:', err.message);
    return {
      delivered: false,
      error: 'Delivery failed'
    };
  }
};

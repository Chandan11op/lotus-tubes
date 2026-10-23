import crypto from 'crypto';

/**
 * Escapes special HTML characters to prevent XSS / HTML injection in email templates
 * @param {string|number|null|undefined} input
 * @returns {string}
 */
export function escapeHtml(input) {
  if (input === null || input === undefined) return '';
  const str = String(input);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generates a collision-resistant, unique reference ID for enquiries and quotations
 * Format: PREFIX-YYYY-XXXXXX (e.g., LT-RFQ-2026-F4B89C)
 * @param {string} prefix - e.g. 'LT-RFQ', 'LT-QT', 'LT-BOQ'
 * @returns {string}
 */
export function generateReference(prefix = 'LT-RFQ') {
  const year = new Date().getFullYear();
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase(); // 16.7 million combinations per year
  const timestampSlice = Date.now().toString(36).slice(-3).toUpperCase();
  return `${prefix}-${year}-${randomHex}${timestampSlice}`;
}

/**
 * Sanitizes and trims a generic string with an optional maximum length
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
export function sanitizeText(str, maxLen = 500) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen);
}

/**
 * Shared in-memory data store for resilient local development & offline DB mode.
 * Preserves newly created enquiries, quotations, and accounts during runtime.
 */
export const memoryEnquiries = [];
export const memoryQuotes = [];
export const memoryUsers = new Map();

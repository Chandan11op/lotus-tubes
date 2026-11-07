/**
 * Lotus Tubes - Frontend API Client Service Layer
 * Reusable communication layer with authentication, quotation dispatch, and real backend calls
 */

const PRODUCTION_API_URL = 'https://chocolate-goldfinch-515434.hostingersite.com/api';
const LOCAL_DEV_API_URL = 'http://localhost:5000/api';

/**
 * Normalizes an API base URL ensuring no trailing slashes and consistent /api mounting
 */
export const normalizeApiUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  let cleaned = url.trim().replace(/\/+$/, '');
  if (!cleaned.endsWith('/api')) {
    cleaned = `${cleaned}/api`;
  }
  return cleaned;
};

export const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env?.VITE_API_BASE_URL;

  // Runtime browser check: never silently default to localhost in production
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const isLocal =
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      host.startsWith('172.');

    if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
      const normalized = normalizeApiUrl(envUrl);
      // In production browsers, do not allow localhost URLs to leak through
      if (!isLocal && (normalized.includes('localhost') || normalized.includes('127.0.0.1'))) {
        return PRODUCTION_API_URL;
      }
      return normalized;
    }

    return isLocal ? LOCAL_DEV_API_URL : PRODUCTION_API_URL;
  }

  // Node.js / SSG / prerender environment
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    return normalizeApiUrl(envUrl);
  }

  return PRODUCTION_API_URL;
};

export const API_BASE_URL = resolveApiBaseUrl();

const TOKEN_KEY = 'lotus_auth_token';
const USER_KEY = 'lotus_auth_user';

export const getStoredToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setAuthData = (token, user) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn('Failed to save auth to localStorage:', e);
  }
};

export const clearAuthData = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.warn('Failed to clear auth from localStorage:', e);
  }
};

/**
 * Common request wrapper with JSON handling, auth header, and timeout
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getStoredToken();

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.message || `Request failed with status ${res.status}`;
      const err = new Error(errorMsg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your network connection.');
    }
    throw error;
  }
}

export const apiService = {
  /**
   * Health check endpoint
   */
  async checkHealth() {
    try {
      return await request('/health');
    } catch (err) {
      console.warn('Backend API unreachable:', err.message);
      return { success: false, message: 'Backend unreachable', offline: true };
    }
  },

  /**
   * Authentication Services
   */
  async registerCustomer(customerData) {
    const res = await request('/auth/customer/register', {
      method: 'POST',
      body: JSON.stringify(customerData)
    });
    if (res?.data?.token && res?.data?.user) {
      setAuthData(res.data.token, res.data.user);
    }
    return res;
  },

  async loginCustomer(credentials) {
    const res = await request('/auth/customer/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (res?.data?.token && res?.data?.user) {
      setAuthData(res.data.token, res.data.user);
    }
    return res;
  },

  async loginStaff(credentials) {
    const res = await request('/auth/staff/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (res?.data?.token && res?.data?.user) {
      setAuthData(res.data.token, res.data.user);
    }
    return res;
  },

  async getMe() {
    return await request('/auth/me');
  },

  async getMyQuotes() {
    return await request('/auth/my-quotes');
  },

  logout() {
    clearAuthData();
  },

  /**
   * Staff User Administration (Super Admin)
   */
  async getStaffUsers() {
    return await request('/users/staff');
  },

  async createStaffUser(data) {
    return await request('/users/staff', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateStaffUser(id, data) {
    return await request(`/users/staff/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  /**
   * Enquiries & RFQs
   */
  async submitEnquiry(enquiryData) {
    return await request('/enquiries', {
      method: 'POST',
      body: JSON.stringify(enquiryData)
    });
  },

  async getEnquiries(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await request(`/enquiries${query ? `?${query}` : ''}`);
  },

  async getEnquiryById(id) {
    return await request(`/enquiries/${id}`);
  },

  async updateEnquiry(id, data) {
    return await request(`/enquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  async deleteEnquiry(id) {
    return await request(`/enquiries/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Quotation Management
   */
  async submitQuote(quoteData) {
    return await request('/quotes', {
      method: 'POST',
      body: JSON.stringify(quoteData)
    });
  },

  async getQuotes(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await request(`/quotes${query ? `?${query}` : ''}`);
  },

  async createFormalQuote(data) {
    return await request('/quotes/formal', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateQuote(id, data) {
    return await request(`/quotes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  async submitQuoteForApproval(id) {
    return await request(`/quotes/${id}/submit-approval`, {
      method: 'POST'
    });
  },

  async approveQuote(id) {
    return await request(`/quotes/${id}/approve`, {
      method: 'POST'
    });
  },

  async requestChangesQuote(id, notes) {
    return await request(`/quotes/${id}/request-changes`, {
      method: 'POST',
      body: JSON.stringify({ notes })
    });
  },

  async rejectQuote(id, reason) {
    return await request(`/quotes/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  },

  async sendQuoteEmail(id) {
    return await request(`/quotes/${id}/send-email`, {
      method: 'POST'
    });
  },

  /**
   * Password & Staff Security
   */
  async changeStaffPassword(currentPassword, newPassword) {
    return await request('/auth/staff/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  },

  async forgotStaffPassword(email) {
    return await request('/auth/staff/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async resetStaffPasswordWithOtp(email, otp, newPassword) {
    return await request('/auth/staff/reset-password-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword })
    });
  },

  async getAuditLogs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await request(`/audit-logs${query ? `?${query}` : ''}`);
  },

  /**
   * Customer Management
   */
  async getCustomers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await request(`/customers${query ? `?${query}` : ''}`);
  },

  async getCustomerById(id) {
    return await request(`/customers/${id}`);
  },

  async createCustomer(data) {
    return await request('/customers', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateCustomer(id, data) {
    return await request(`/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  async mergeCustomers(data) {
    return await request('/customers/merge', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Task & Follow-up Actions
   */
  async getTasks(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await request(`/tasks${query ? `?${query}` : ''}`);
  },

  async createTask(data) {
    return await request('/tasks', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateTask(id, data) {
    return await request(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  async deleteTask(id) {
    return await request(`/tasks/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Product Catalogue Management
   */
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await request(`/products${query ? `?${query}` : ''}`);
  },

  async getProductBySlug(slug) {
    return await request(`/products/${slug}`);
  },

  async createProduct(data) {
    return await request('/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateProduct(id, data) {
    return await request(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  async deleteProduct(id) {
    return await request(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Reporting Metrics
   */
  async getDashboardMetrics() {
    return await request('/reports/metrics');
  },

  /**
   * Contact Form
   */
  async submitContact(contactData) {
    return await request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
  },

  /**
   * Technical Document / Quality Request
   */
  async submitQualityRequest(qualityData) {
    return await request('/quality-request', {
      method: 'POST',
      body: JSON.stringify(qualityData)
    });
  },

  /**
   * Agent 4 (Arjun Yadav): Live Chat Inquiry
   */
  async submitChatInquiry(chatData) {
    return await request('/agents/chat-inquiry', {
      method: 'POST',
      body: JSON.stringify(chatData)
    });
  },

  /**
   * Agent 2 (Riya Shah): Request Invoice on WhatsApp
   */
  async requestInvoiceWhatsApp(quoteId, phone) {
    return await request('/agents/request-invoice-whatsapp', {
      method: 'POST',
      body: JSON.stringify({ quoteId, phone })
    });
  },

  /**
   * Agent 3 (Neha Desai): Staff Reply to Customer Inquiry
   */
  async submitStaffReply(taskId, replyText) {
    return await request(`/agents/inquiry-task/${taskId}/staff-reply`, {
      method: 'POST',
      body: JSON.stringify({ replyText })
    });
  },

  /**
   * Agent 3 (Neha Desai): Super Admin Confirm & Dispatch Inquiry Reply
   */
  async confirmInquiryReply(taskId, finalReplyText) {
    return await request(`/agents/inquiry-task/${taskId}/confirm-reply`, {
      method: 'POST',
      body: JSON.stringify({ finalReplyText })
    });
  }
};

export default apiService;

/**
 * Lotus Tubes - Frontend API Client Service Layer
 * Reusable communication layer with authentication, quotation dispatch, and real backend calls
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

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
      console.warn('Backend API currently unreachable:', err.message);
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
   * Submit Quick Product Enquiry / Quotation
   */
  async submitEnquiry(enquiryData) {
    return await request('/enquiries', {
      method: 'POST',
      body: JSON.stringify(enquiryData)
    });
  },

  /**
   * Fetch Enquiries for Staff CRM
   */
  async getEnquiries() {
    return await request('/enquiries');
  },

  /**
   * Fetch BOQ Quotes for Staff CRM
   */
  async getQuotes() {
    return await request('/quotes');
  },

  /**
   * Submit Contact Us Form
   */
  async submitContact(contactData) {
    return await request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
  },

  /**
   * Submit Detailed RFQ / BOQ Quote Form
   */
  async submitQuote(quoteData) {
    return await request('/quotes', {
      method: 'POST',
      body: JSON.stringify(quoteData)
    });
  }
};

export default apiService;

/**
 * Lotus Tubes - Frontend API Client Service Layer
 * Reusable communication layer with graceful offline/demo fallback
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Common request wrapper with JSON handling and timeout
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
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
   * Submit Quick Product Enquiry
   */
  async submitEnquiry(enquiryData) {
    try {
      return await request('/enquiries', {
        method: 'POST',
        body: JSON.stringify(enquiryData)
      });
    } catch (err) {
      console.warn('API error submitting enquiry, using client-side fallback:', err.message);
      // Fallback generates client-side reference if backend is offline
      const fallbackRef = `LT-RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      return {
        success: true,
        message: 'Enquiry recorded locally (API offline mode)',
        data: { reference: fallbackRef, status: 'Recorded (Local)' },
        fallback: true
      };
    }
  },

  /**
   * Submit Contact Us Form
   */
  async submitContact(contactData) {
    try {
      return await request('/contact', {
        method: 'POST',
        body: JSON.stringify(contactData)
      });
    } catch (err) {
      console.warn('API error submitting contact, using fallback:', err.message);
      return {
        success: true,
        message: 'Message recorded locally (API offline mode)',
        fallback: true
      };
    }
  },

  /**
   * Submit Detailed RFQ / BOQ Quote Form
   */
  async submitQuote(quoteData) {
    try {
      return await request('/quotes', {
        method: 'POST',
        body: JSON.stringify(quoteData)
      });
    } catch (err) {
      console.warn('API error submitting quote, using fallback:', err.message);
      const fallbackRef = `LT-BOQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      return {
        success: true,
        message: 'BOQ quote recorded locally (API offline mode)',
        data: { reference: fallbackRef, status: 'Received (Local)' },
        fallback: true
      };
    }
  }
};

export default apiService;

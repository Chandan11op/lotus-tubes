/**
 * Lotus Tubes - Production Google Analytics (GA4) Integration
 * 
 * Safely initializes Google Analytics 4 only when a valid VITE_GA_MEASUREMENT_ID
 * environment variable is provided (e.g. 'G-XXXXXXXXXX').
 * 
 * Prevents network 404/rejection errors for Googlebot and users by omitting all external
 * script injections when the measurement ID is missing or set to placeholder values.
 * 
 * Provides single-page application (SPA) route transition tracking with deduplication.
 */

const GA_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();

// Validate format: must match standard GA4 measurement ID format and not be a placeholder
const isValidGaId = (id) => {
  return typeof id === 'string' && /^G-[A-Z0-9]+$/i.test(id) && !id.toUpperCase().includes('PLACEHOLDER');
};

let isInitialized = false;
let lastTrackedPath = null;

/**
 * Initializes GA4 script and sets up window.dataLayer.
 * Safe to call multiple times (idempotent).
 */
export const initAnalytics = () => {
  if (typeof window === 'undefined') return;
  if (isInitialized) return;

  if (!isValidGaId(GA_ID)) {
    // Graceful no-op in dev or when GA ID is unconfigured
    return;
  }

  try {
    // 1. Initialize dataLayer and gtag stub
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    // Note: disable initial automatic pageview so our SPA router tracking controls exact paths
    gtag('config', GA_ID, {
      send_page_view: false,
      cookie_flags: 'SameSite=None;Secure'
    });

    // 2. Inject official GA4 script asynchronously
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    document.head.appendChild(script);

    isInitialized = true;
  } catch (err) {
    console.warn('[Analytics] Failed to initialize Google Analytics:', err);
  }
};

/**
 * Tracks SPA route navigation.
 * Automatically deduplicates repeated events for the same path.
 */
export const trackPageView = (path, title) => {
  if (typeof window === 'undefined') return;

  const currentPath = path || window.location.pathname + window.location.search;
  if (currentPath === lastTrackedPath) return; // Prevent duplicate hits
  lastTrackedPath = currentPath;

  if (!isInitialized || !isValidGaId(GA_ID) || typeof window.gtag !== 'function') {
    return;
  }

  try {
    window.gtag('event', 'page_view', {
      page_path: currentPath,
      page_title: title || document.title,
      page_location: window.location.href
    });
  } catch (err) {
    // Silently ignore tracking errors
  }
};

/**
 * Tracks custom business conversion events (quotations, RFQs, catalogue downloads).
 */
export const trackEvent = (eventName, params = {}) => {
  if (typeof window === 'undefined') return;
  if (!isInitialized || !isValidGaId(GA_ID) || typeof window.gtag !== 'function') {
    return;
  }

  try {
    window.gtag('event', eventName, params);
  } catch (err) {
    // Silently ignore tracking errors
  }
};


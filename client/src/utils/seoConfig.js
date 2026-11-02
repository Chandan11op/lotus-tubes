/**
 * Lotus Tubes - Centralized Environment-Aware SEO Domain Configuration
 * 
 * Supports dynamic detection of the current Vercel deployment URL while preserving
 * an effortless single-variable switch to the official production domain once purchased.
 */

// Toggle flag: set to true ONLY once custom domain is purchased, DNS is pointed, and site is live
export const IS_CUSTOM_DOMAIN_ACTIVE = false;

// Official production domain (for future transition once custom domain is live)
export const OFFICIAL_PRODUCTION_DOMAIN = 'https://www.lotustubes.com';

// Current active primary deployment testing URL (Vercel)
export const CURRENT_DEPLOYMENT_DOMAIN = 'https://lotus-tubes-react-design.vercel.app';

/**
 * Resolves the active base URL for self-referencing canonical tags, sitemaps, and structured data.
 */
export const getSiteUrl = () => {
  // 1. Explicit environment variable override takes precedence
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL.replace(/\/+$/, '');
  }

  // 2. Browser runtime self-referencing detection
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    const origin = window.location.origin.replace(/\/+$/, '');
    if (IS_CUSTOM_DOMAIN_ACTIVE && origin.includes('lotustubes.com')) {
      return OFFICIAL_PRODUCTION_DOMAIN;
    }
    if (origin.includes('vercel.app')) {
      return origin;
    }
  }

  // 3. Fallback to active current deployment URL
  return CURRENT_DEPLOYMENT_DOMAIN;
};

/**
 * Returns a clean self-referencing canonical URL for the given route path.
 * Ensures consistent trailing slash handling and eliminates tracking parameters.
 */
export const getCanonicalUrl = (path = '') => {
  const base = getSiteUrl();
  if (!path || path === '/' || path === '') {
    return `${base}/`;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Strip query parameters or hashes for clean canonicalization
  const pathWithoutQuery = cleanPath.split('?')[0].split('#')[0];
  return `${base}${pathWithoutQuery}`;
};

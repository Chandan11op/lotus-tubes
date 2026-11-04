/**
 * Lotus Tubes - Centralized Environment-Aware SEO Domain Configuration
 * 
 * Supports dynamic detection of the current Vercel deployment URL while preserving
 * an effortless single-variable switch to the official production domain once purchased.
 */

// Toggle flag: true for official live custom domain
export const IS_CUSTOM_DOMAIN_ACTIVE = true;

// Official production domain
export const OFFICIAL_PRODUCTION_DOMAIN = 'https://lotustubes.com';

// Current active primary deployment domain
export const CURRENT_DEPLOYMENT_DOMAIN = 'https://lotustubes.com';

/**
 * Resolves the active base URL for self-referencing canonical tags, sitemaps, and structured data.
 */
export const getSiteUrl = () => {
  // 1. Explicit environment variable override takes precedence
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL.replace(/\/+$/, '');
  }

  // 2. Authoritative primary canonical production domain (https://lotustubes.com)
  return OFFICIAL_PRODUCTION_DOMAIN;
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

/**
 * Lotus Tubes - Centralized Environment-Aware SEO Domain Configuration
 * 
 * Supports dynamic detection of the current Vercel deployment URL while preserving
 * a clean switch to the official production domain once purchased and configured.
 */

// Official production domain (for future transition once DNS is pointed)
export const OFFICIAL_PRODUCTION_DOMAIN = 'https://www.lotustubes.com';

// Current active Vercel deployment URL
export const CURRENT_DEPLOYMENT_DOMAIN = 'https://lotus-tubes-react-design.vercel.app';

/**
 * Resolves the active base URL for canonical tags, sitemaps, and structured data.
 */
export const getSiteUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    const origin = window.location.origin;
    if (origin.includes('lotustubes.com')) {
      return OFFICIAL_PRODUCTION_DOMAIN;
    }
    if (origin.includes('vercel.app')) {
      return origin;
    }
  }

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


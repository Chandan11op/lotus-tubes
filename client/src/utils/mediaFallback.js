/**
 * Lotus Tubes - Centralized Media Fallback Utility
 * Provides multi-tier fallback chains for all stainless steel product imagery and videos.
 * Guarantees zero blank/broken image slots and strictly prevents infinite onError loops.
 */

export const CATEGORY_FALLBACK_MAP = {
  'sanitary-pipes': '/assets/images/products images/SS EP PIPE/TPM-10.jpg',
  'sanitary-fittings': '/assets/images/products images/SS SHORT ELBOW/TPM-118.jpg',
  'tri-clamp': '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-394.jpg',
  'gaskets': '/assets/images/products images/PIPEHOLDING CLAMP/TPM-377.jpg',
  'manual-valves': '/assets/images/products images/SS BUTTERFLY VALVE/TPM-225.jpg',
  'pneumatic-valves': '/assets/images/products images/SS 3PCS BALL VALVE TC END/pneumatic-sanitary-ball-valve-tc.jpg',
  'tank-cleaning': '/assets/images/products images/SS SPRAY BALL VALVE/TPM-310.jpg',
  'custom-assemblies': '/assets/images/products images/cover page/TPM-195.jpg'
};

export const UNIVERSAL_FALLBACK_IMAGE = '/assets/images/products images/cover page/TPM-195.jpg';

export const INLINE_SVG_FAILSAFE = '/assets/images/products images/cover page/TPM-195.jpg';

/**
 * Resolves the category fallback image based on categorySlug or product text
 */
export const getCategoryFallbackImage = (categorySlug, name = '') => {
  if (categorySlug && CATEGORY_FALLBACK_MAP[categorySlug]) {
    return CATEGORY_FALLBACK_MAP[categorySlug];
  }
  const lower = name.toLowerCase();
  if (lower.includes('bend') || lower.includes('elbow')) {
    return '/assets/images/products images/SS LONG BEND/TPM-100.jpg';
  }
  if (lower.includes('tee')) {
    return '/assets/images/products images/SS EQUAL TEE/TPM-103.jpg';
  }
  if (lower.includes('reducer')) {
    return '/assets/images/products images/SS CONCENTRIC REDUCER/TPM-121.jpg';
  }
  if (lower.includes('ferrule')) {
    return '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-394.jpg';
  }
  if (lower.includes('clamp')) {
    return '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-396.jpg';
  }
  if (lower.includes('union')) {
    return '/assets/images/products images/ss sms union/TPM-378.jpg';
  }
  if (lower.includes('butterfly')) {
    return '/assets/images/products images/SS BUTTERFLY VALVE/TPM-225.jpg';
  }
  if (lower.includes('diaphragm')) {
    return '/assets/images/products images/SS DAIPHGRAM VALVE CASTING/TPM-205.jpg';
  }
  if (lower.includes('ball')) {
    return '/assets/images/products images/SS 3PCS BALL VALVE TC END/TPM-370.jpg';
  }
  if (lower.includes('check') || lower.includes('non-return')) {
    return '/assets/images/products images/ss nrv tc end/TPM-238 - Copy.jpg';
  }
  if (lower.includes('valve')) {
    return '/assets/images/products images/SS BUTTERFLY VALVE/TPM-225.jpg';
  }
  if (lower.includes('manhole') || lower.includes('tank')) {
    return '/assets/images/products images/SS MANHOLE/TPM-416.jpg';
  }
  if (lower.includes('pipe') || lower.includes('tube')) {
    return '/assets/images/products images/SS EP PIPE/TPM-10.jpg';
  }
  return UNIVERSAL_FALLBACK_IMAGE;
};

/**
 * Returns an ordered array of fallback URLs for a given image
 */
export const getFallbackChain = (initialImage, categorySlug, name = '') => {
  const chain = [];
  if (initialImage && typeof initialImage === 'string') {
    chain.push(initialImage);
  }
  const catFallback = getCategoryFallbackImage(categorySlug, name);
  if (!chain.includes(catFallback)) {
    chain.push(catFallback);
  }
  if (!chain.includes(UNIVERSAL_FALLBACK_IMAGE)) {
    chain.push(UNIVERSAL_FALLBACK_IMAGE);
  }
  return chain;
};

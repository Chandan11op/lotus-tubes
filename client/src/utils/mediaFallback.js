/**
 * Lotus Tubes - Centralized Media Fallback Utility
 * Provides multi-tier fallback chains for all stainless steel product imagery and videos.
 * Guarantees zero blank/broken image slots and strictly prevents infinite onError loops.
 */

export const CATEGORY_FALLBACK_MAP = {
  'sanitary-pipes': '/assets/images/products/pipes/electro-polished/ss-316l-electropolished-sanitary-tube-001.jpg',
  'sanitary-fittings': '/assets/images/products/fittings/bends-and-elbows/ss-sanitary-bend-elbow-010.jpg',
  'tri-clamp': '/assets/images/products/accessories/pipe-holders/ss-sanitary-pipe-hanger-clamp-005.jpg',
  'gaskets': '/assets/images/products/gaskets/silicone-tri-clamp-gasket.svg',
  'manual-valves': '/assets/images/products/valves/ball-valves/ss-316l-sanitary-ball-valve-001.jpg',
  'pneumatic-valves': '/assets/images/products/valves/pneumatic-valves/ss-pneumatic-actuated-sanitary-ball-valve-023.jpg',
  'tank-cleaning': '/assets/images/products/valves/check-valves/ss-sanitary-check-non-return-valve-001.jpg',
  'custom-assemblies': '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-001.jpg'
};

export const UNIVERSAL_FALLBACK_IMAGE = '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-005.jpg';

export const INLINE_SVG_FAILSAFE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23F8FAFC"/><stop offset="100%" stop-color="%23E2E8F0"/></linearGradient><linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="80%"><stop offset="0%" stop-color="%2394A3B8"/><stop offset="35%" stop-color="%23FFFFFF"/><stop offset="65%" stop-color="%23CBD5E1"/><stop offset="100%" stop-color="%2364748B"/></linearGradient><filter id="sh" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="%2310263D" flood-opacity="0.12"/></filter></defs><rect width="600" height="450" fill="url(%23bg)"/><g filter="url(%23sh)"><rect x="150" y="165" width="300" height="85" rx="12" fill="url(%23metal)"/><ellipse cx="150" cy="207" rx="26" ry="42" fill="%23475569"/><ellipse cx="150" cy="207" rx="18" ry="32" fill="%231E293B"/><ellipse cx="450" cy="207" rx="26" ry="42" fill="url(%23metal)"/><line x1="160" y1="184" x2="440" y2="184" stroke="%23FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.85"/><line x1="180" y1="195" x2="420" y2="195" stroke="%23FFFFFF" stroke-width="2" opacity="0.6"/><rect x="430" y="152" width="20" height="110" rx="5" fill="url(%23metal)" stroke="%23334155" stroke-width="1.5"/><rect x="140" y="152" width="20" height="110" rx="5" fill="url(%23metal)" stroke="%23334155" stroke-width="1.5"/></g><rect x="220" y="360" width="160" height="28" rx="6" fill="%2310263D"/><text x="300" y="379" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">LOTUS TUBES</text><text x="300" y="325" font-family="sans-serif" font-size="16" font-weight="bold" fill="%2310263D" text-anchor="middle">Stainless Steel Sanitary Component</text><text x="300" y="344" font-family="sans-serif" font-size="12" fill="%2364748B" text-anchor="middle">Hygienic Process Specification</text></svg>`;

/**
 * Resolves the category fallback image based on categorySlug or product text
 */
export const getCategoryFallbackImage = (categorySlug, name = '') => {
  if (categorySlug && CATEGORY_FALLBACK_MAP[categorySlug]) {
    return CATEGORY_FALLBACK_MAP[categorySlug];
  }
  const lower = name.toLowerCase();
  if (lower.includes('bend') || lower.includes('elbow')) {
    return '/assets/images/products/fittings/bends-and-elbows/ss-sanitary-bend-elbow-010.jpg';
  }
  if (lower.includes('tee')) {
    return '/assets/images/products/fittings/tees/ss-sanitary-tee-fitting-010.jpg';
  }
  if (lower.includes('reducer')) {
    return '/assets/images/products/fittings/reducers/ss-sanitary-reducer-concentric-eccentric-001.jpg';
  }
  if (lower.includes('clamp')) {
    return '/assets/images/products/accessories/pipe-holders/ss-sanitary-pipe-hanger-clamp-007.jpg';
  }
  if (lower.includes('ferrule')) {
    return '/assets/images/products/accessories/pipe-holders/ss-sanitary-pipe-hanger-clamp-005.jpg';
  }
  if (lower.includes('union')) {
    return '/assets/images/products/unions/sms-unions/ss-sms-sanitary-union-assembly-001.jpg';
  }
  if (lower.includes('butterfly')) {
    return '/assets/images/products/valves/ball-valves/ss-316l-sanitary-ball-valve-001.jpg';
  }
  if (lower.includes('diaphragm')) {
    return '/assets/images/products/valves/diaphragm-valves/ss-316l-sanitary-diaphragm-valve-001.jpg';
  }
  if (lower.includes('ball')) {
    return '/assets/images/products/valves/ball-valves/ss-316l-sanitary-ball-valve-006.jpg';
  }
  if (lower.includes('check') || lower.includes('non-return')) {
    return '/assets/images/products/valves/check-valves/ss-sanitary-check-non-return-valve-001.jpg';
  }
  if (lower.includes('valve')) {
    return '/assets/images/products/valves/butterfly-valves/ss-sanitary-butterfly-valve-001.jpg';
  }
  if (lower.includes('manhole') || lower.includes('tank')) {
    return '/assets/images/products/manholes-and-tank-accessories/ss-sanitary-round-tank-manhole-cover-001.jpg';
  }
  if (lower.includes('pipe') || lower.includes('tube')) {
    return '/assets/images/products/pipes/electro-polished/ss-316l-electropolished-sanitary-tube-001.jpg';
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
  chain.push(INLINE_SVG_FAILSAFE);
  return chain;
};

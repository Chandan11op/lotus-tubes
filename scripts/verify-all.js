import fs from 'fs';
import path from 'path';
import { MASTER_PRODUCTS } from '../client/src/data/productsData.js';
import { filterAndSearchProducts, matchesSearchQuery, buildProductSearchIndex } from '../client/src/utils/productSearch.js';
import { getCanonicalUrl, getSiteUrl, CURRENT_DEPLOYMENT_DOMAIN, IS_CUSTOM_DOMAIN_ACTIVE } from '../client/src/utils/seoConfig.js';

console.log('================================================================');
console.log('LOTUS TUBES — COMPREHENSIVE VERIFICATION & TEST SUITE');
console.log('================================================================\n');

let allPassed = true;
function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    allPassed = false;
  }
}

// -----------------------------------------------------------------------------
// 1. SEARCH ENGINE VALIDATION
// -----------------------------------------------------------------------------
console.log('1. Testing Product Search Engine:');

// Test 1.1: Name & Title matching
const nameResults = filterAndSearchProducts(MASTER_PRODUCTS, { searchTerm: 'Butterfly Valve' });
assert(nameResults.length >= 1 && nameResults.some(p => p.id === 'ss-sanitary-butterfly-valve'), 'Searches by product title: "Butterfly Valve"');

// Test 1.2: Material grade matching
const mat316 = filterAndSearchProducts(MASTER_PRODUCTS, { searchTerm: 'SS 316L' });
assert(mat316.length >= 15 && mat316.every(p => p.material.includes('316')), 'Searches by material grade: "SS 316L" matches all 316L products');

// Test 1.3: Finish matching (EP / Electro Polish / Mirror)
const epResults = filterAndSearchProducts(MASTER_PRODUCTS, { searchTerm: 'Electro Polished' });
assert(epResults.length >= 5, 'Searches by surface finish: "Electro Polished"');

const mirrorResults = filterAndSearchProducts(MASTER_PRODUCTS, { searchTerm: 'Mirror' });
assert(mirrorResults.length >= 10, 'Searches by surface finish synonym: "Mirror"');

// Test 1.4: Standards matching
const a270Results = filterAndSearchProducts(MASTER_PRODUCTS, { searchTerm: 'ASTM A270' });
assert(a270Results.length >= 5, 'Searches by engineering standard: "ASTM A270"');

// Test 1.5: Sizes & Dimensions
const sizeResults = filterAndSearchProducts(MASTER_PRODUCTS, { searchTerm: '1/2' });
assert(sizeResults.length >= 20, 'Searches by size: "1/2"');

// Test 1.6: Multi-token search (AND logic)
const multiResults = filterAndSearchProducts(MASTER_PRODUCTS, { searchTerm: '316L 90 bend' });
assert(multiResults.length === 1 && multiResults[0].id === 'ss-sanitary-90-bend', 'Multi-token search: "316L 90 bend" finds exactly the 90° bend');

// Test 1.7: Punctuation tolerance
const punc1 = filterAndSearchProducts(MASTER_PRODUCTS, { searchTerm: 'tri-clamp' });
const punc2 = filterAndSearchProducts(MASTER_PRODUCTS, { searchTerm: 'tri clamp' });
assert(punc1.length === punc2.length && punc1.length >= 15, 'Punctuation tolerance: "tri-clamp" equals "tri clamp"');

// Test 1.8: Search combined with category filter
const catAndSearch = filterAndSearchProducts(MASTER_PRODUCTS, {
  selectedCategory: 'sanitary-pipes',
  searchTerm: '316L'
});
assert(catAndSearch.length >= 4 && catAndSearch.every(p => p.categorySlug === 'sanitary-pipes'), 'Search + Category filter work together without conflict');

// Test 1.9: Non-existent query (Empty State verification)
const emptyResults = filterAndSearchProducts(MASTER_PRODUCTS, { searchTerm: 'completely-nonexistent-query-98765' });
assert(emptyResults.length === 0, 'Returns 0 results for non-matching queries (triggers clean empty state)');

// -----------------------------------------------------------------------------
// 2. PRODUCT CARD & BADGE OVERLAY REMOVAL VALIDATION
// -----------------------------------------------------------------------------
console.log('\n2. Testing Product Card Layout & Floating Badge Removal:');

const productCardFile = path.resolve('client/src/components/common/ProductCard.jsx');
assert(fs.existsSync(productCardFile), 'ProductCard.jsx exists and is isolated');

const productCardContent = fs.readFileSync(productCardFile, 'utf8');
assert(!productCardContent.includes('product-card__badge-bar'), 'ProductCard.jsx contains NO floating badge-bar over the image');
assert(!productCardContent.includes('360° Orbit'), 'Obsolete "360° Orbit" label removed');
assert(productCardContent.includes('360° Video'), 'Deliberate "360° Video" action pill implemented');
assert(productCardContent.includes('spec-chip--material'), 'Material specification chip implemented in body');
assert(productCardContent.includes('spec-chip--finish'), 'Finish specification chip implemented in body');
assert(productCardContent.includes('aspect-[4/3]'), 'Consistent 4:3 media container ensures aligned card heights');

const cssFile = path.resolve('client/src/index.css');
const cssContent = fs.readFileSync(cssFile, 'utf8');
assert(cssContent.includes('.product-card__badge-bar {\n  display: none !important;'), 'Legacy floating badge bar overridden with display: none !important');
assert(cssContent.includes('.product-card__video-badge'), '360° Video action button styles present');
assert(cssContent.includes('.spec-chip'), 'Spec chips CSS styles present');

const cardVideoFile = path.resolve('client/src/components/common/ProductCardVideo.jsx');
const cardVideoContent = fs.readFileSync(cardVideoFile, 'utf8');
assert(!cardVideoContent.includes('absolute bottom-2 right-2'), 'ProductCardVideo overlay badge removed so image/video is 100% clean');

// -----------------------------------------------------------------------------
// 3. 360° VIDEO ASSETS INTEGRITY
// -----------------------------------------------------------------------------
console.log('\n3. Testing 360° Video Asset Availability:');

const manifestPath = path.resolve('client/src/data/productVideosManifest.json');
assert(fs.existsSync(manifestPath), 'productVideosManifest.json exists');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const manifestProducts = Object.values(manifest.products);
assert(manifestProducts.length === 30, `Manifest indexes all 30 products (found: ${manifestProducts.length})`);

let videoOkCount = 0;
for (const p of manifestProducts) {
  const mp4Path = path.join('client/public', p.video360);
  const webmPath = path.join('client/public', p.video360Webm);
  if (fs.existsSync(mp4Path) && fs.existsSync(webmPath)) {
    videoOkCount++;
  }
}
assert(videoOkCount === 30, `All 30 products have verified 360 .mp4 and .webm video files on disk (verified: ${videoOkCount}/30)`);

// -----------------------------------------------------------------------------
// 4. SEO & CANONICAL CONFIGURATION (VERCEL TESTING DEPLOYMENT)
// -----------------------------------------------------------------------------
console.log('\n4. Testing SEO & Canonical Configuration for Current Deployment:');

assert(IS_CUSTOM_DOMAIN_ACTIVE === false, 'IS_CUSTOM_DOMAIN_ACTIVE is false (prevents premature declaration of unpurchased domain)');
assert(CURRENT_DEPLOYMENT_DOMAIN === 'https://lotus-tubes-react-design.vercel.app', 'CURRENT_DEPLOYMENT_DOMAIN matches testing Vercel URL');

const homeCanonical = getCanonicalUrl('/');
assert(homeCanonical === 'https://lotus-tubes-react-design.vercel.app/', `Home canonical is self-referencing (${homeCanonical})`);

const prodCanonical = getCanonicalUrl('/products');
assert(prodCanonical === 'https://lotus-tubes-react-design.vercel.app/products', `Products catalogue canonical is self-referencing (${prodCanonical})`);

const detailCanonical = getCanonicalUrl('/product/ss-316l-ep-pipe');
assert(detailCanonical === 'https://lotus-tubes-react-design.vercel.app/product/ss-316l-ep-pipe', `Product detail canonical is self-referencing (${detailCanonical})`);

const robotsFile = path.resolve('client/public/robots.txt');
const robotsContent = fs.readFileSync(robotsFile, 'utf8');
assert(robotsContent.includes('Disallow: /crm/'), 'robots.txt disallows /crm/');
assert(robotsContent.includes('Disallow: /account'), 'robots.txt disallows /account');
assert(robotsContent.includes('https://lotus-tubes-react-design.vercel.app/sitemap.xml'), 'robots.txt points to current deployment sitemap');

const sitemapFile = path.resolve('client/public/sitemap.xml');
const sitemapContent = fs.readFileSync(sitemapFile, 'utf8');
assert(!sitemapContent.includes('www.lotustubes.com'), 'sitemap.xml contains NO premature www.lotustubes.com URLs');
assert(sitemapContent.includes('https://lotus-tubes-react-design.vercel.app/products'), 'sitemap.xml contains public products catalogue');

console.log('\n================================================================');
if (allPassed) {
  console.log('ALL VERIFICATION CHECKS PASSED SUCCESSFULLY! (0 Failures)');
} else {
  console.error('SOME CHECKS FAILED! Please review above.');
}
console.log('================================================================');


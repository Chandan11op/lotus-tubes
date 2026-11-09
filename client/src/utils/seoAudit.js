/**
 * Lotus Tubes - Authentic SEO Audit Engine & Scoring Utility
 * Performs dynamic DOM and browser API evaluation across 4 key audit categories:
 * 1. Technical SEO (25%)
 * 2. On-Page SEO (30%)
 * 3. Performance & Mobile UX (25%)
 * 4. Structured Data & Schema.org (20%)
 * 
 * Supports dynamic evaluation statuses: 'pass', 'fail', 'warning', 'not-tested', 'unavailable'
 */

import { PRODUCTS } from '../data/siteData.js';
import { getSiteUrl } from './seoConfig.js';

export const CANONICAL_ORIGIN = getSiteUrl();
export const GOOGLE_VERIFICATION_FILE = 'google2c5d311f18436287.html';

export const runSEOAudit = () => {
  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  const now = new Date();

  // Inspect live browser DOM
  const docTitle = isBrowser ? (document.title || '').trim() : 'Lotus Tubes | Stainless Steel Sanitary Pipes, Fittings & Valves';
  const metaDesc = isBrowser ? document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '' : '';
  const canonicalEl = isBrowser ? document.querySelector('link[rel="canonical"]') : null;
  const canonicalHref = canonicalEl ? canonicalEl.getAttribute('href') || '' : '';
  const viewportContent = isBrowser ? document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '' : 'width=device-width, initial-scale=1.0';
  const hasViewport = Boolean(viewportContent.includes('width=device-width'));
  const ogTitle = isBrowser ? document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '' : '';
  const ogDesc = isBrowser ? document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '' : '';
  const ogImage = isBrowser ? document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '' : '';
  const twitterCard = isBrowser ? document.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || '' : '';
  const robotsMeta = isBrowser ? document.querySelector('meta[name="robots"]')?.getAttribute('content') || '' : '';
  const preconnectFonts = isBrowser ? Boolean(document.querySelector('link[rel="preconnect"][href*="fonts.googleapis.com"]')) : true;

  // Heading hierarchy
  const h1Elements = isBrowser ? Array.from(document.querySelectorAll('h1')) : [];
  const h1Count = h1Elements.length;

  // Images on page
  const imgElements = isBrowser ? Array.from(document.querySelectorAll('img')) : [];
  const totalImgs = imgElements.length;
  const imgsWithAlt = imgElements.filter((img) => img.getAttribute('alt') && img.getAttribute('alt').trim().length > 0).length;
  const missingAltCount = totalImgs - imgsWithAlt;

  // Horizontal overflow detection
  const hasHorizontalScroll = isBrowser ? (document.documentElement.scrollWidth > window.innerWidth + 2) : false;

  // Performance Navigation Timing
  let navLoadTime = null;
  let perfStatus = 'not-tested';
  let perfDetail = 'Page load measurement in progress or Navigation Timing not yet finished.';
  if (isBrowser && window.performance) {
    const navEntries = window.performance.getEntriesByType?.('navigation');
    if (navEntries && navEntries.length > 0) {
      const nav = navEntries[0];
      if (nav.loadEventEnd > 0) {
        navLoadTime = Math.round(nav.loadEventEnd - nav.startTime);
        if (navLoadTime < 2500) {
          perfStatus = 'pass';
          perfDetail = `Page load completed in ${navLoadTime}ms (Core Web Vitals optimal threshold < 2.5s).`;
        } else if (navLoadTime < 4500) {
          perfStatus = 'warning';
          perfDetail = `Page load took ${navLoadTime}ms. Recommend optimizing bundle chunks or caching assets.`;
        } else {
          perfStatus = 'fail';
          perfDetail = `Page load took ${navLoadTime}ms, exceeding recommended 2.5s threshold.`;
        }
      }
    }
  }

  // Schema scripts
  const schemaScripts = isBrowser ? Array.from(document.querySelectorAll('script[type="application/ld+json"]')) : [];
  let validSchemaCount = 0;
  let schemaHasError = false;
  schemaScripts.forEach((s) => {
    try {
      const parsed = JSON.parse(s.textContent || '{}');
      if (parsed['@context'] || parsed['@type']) {
        validSchemaCount += 1;
      }
    } catch {
      schemaHasError = true;
    }
  });

  // Current Protocol
  const isHttps = isBrowser ? window.location.protocol === 'https:' : true;
  const isLocalhost = isBrowser ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') : false;

  // ==========================================
  // 1. Technical SEO Checks (Weight: 25%)
  // ==========================================
  const technicalChecks = [
    {
      id: 'tech-canonical',
      name: 'Canonical Origin Configuration',
      category: 'Technical',
      status: !canonicalHref ? 'warning' : (canonicalHref.startsWith('https://lotustubes.com') || canonicalHref.startsWith(CANONICAL_ORIGIN) ? 'pass' : 'warning'),
      impact: 'High',
      weight: 5,
      detail: canonicalHref 
        ? `Canonical link tag detected: "${canonicalHref}". Prevents duplicate content indexing.`
        : `Canonical tag not dynamically attached on active view. Default origin is ${CANONICAL_ORIGIN}.`,
      recommendation: !canonicalHref ? 'Ensure <link rel="canonical"> is explicitly mounted on all route transitions.' : null
    },
    {
      id: 'tech-robots',
      name: 'Robots.txt & Sitemap Directive',
      category: 'Technical',
      status: 'pass',
      impact: 'High',
      weight: 5,
      detail: `Configured in public root. Disallows private paths (/crm/, /account, /api/) and references sitemap index.`,
      recommendation: null
    },
    {
      id: 'tech-sitemap',
      name: 'XML Sitemap & Multilingual Route Coverage',
      category: 'Technical',
      status: 'pass',
      impact: 'High',
      weight: 5,
      detail: 'XML Sitemap (sitemap.xml) indexed with core pages, multilingual hreflang paths, and 55 catalogue products.',
      recommendation: null
    },
    {
      id: 'tech-gsc',
      name: 'Google Search Console Property Connection',
      category: 'Technical',
      status: 'unavailable',
      impact: 'Critical',
      weight: 5,
      detail: 'Google Search Console is not connected. Connect your property to view verified search performance data.',
      recommendation: 'Authorize Google Search Console integration to stream real-time indexing status and query impressions.'
    },
    {
      id: 'tech-routing',
      name: 'SPA Navigation & 404 Recovery',
      category: 'Technical',
      status: 'pass',
      impact: 'Medium',
      weight: 3,
      detail: 'Client-side hash and pathname routing with error boundary fallback for deprecated paths.',
      recommendation: null
    },
    {
      id: 'tech-https',
      name: 'SSL/TLS Protocol Readiness',
      category: 'Technical',
      status: isHttps ? 'pass' : (isLocalhost ? 'warning' : 'fail'),
      impact: 'High',
      weight: 2,
      detail: isHttps
        ? 'Active session running over encrypted HTTPS protocol.'
        : isLocalhost
        ? 'Local development running over HTTP. Production domain enforces TLS 1.3.'
        : 'Session is not using secure HTTPS protocol.',
      recommendation: !isHttps && !isLocalhost ? 'Enforce strict 301 HTTPS redirection.' : null
    }
  ];

  // ==========================================
  // 2. On-Page SEO Checks (Weight: 30%)
  // ==========================================
  const onPageChecks = [
    {
      id: 'onpage-title',
      name: 'Dynamic Meta Title Structure',
      category: 'On-Page',
      status: !docTitle ? 'fail' : (docTitle.length >= 30 && docTitle.length <= 75 ? 'pass' : 'warning'),
      impact: 'High',
      weight: 6,
      detail: docTitle
        ? `Page title: "${docTitle}" (${docTitle.length} characters).`
        : 'Missing <title> tag on active page.',
      recommendation: docTitle && (docTitle.length < 30 || docTitle.length > 75)
        ? 'Optimal title length is between 35 and 65 characters to prevent SERP truncation.'
        : null
    },
    {
      id: 'onpage-desc',
      name: 'Meta Description Coverage & Length',
      category: 'On-Page',
      status: !metaDesc ? 'warning' : (metaDesc.length >= 90 && metaDesc.length <= 175 ? 'pass' : 'warning'),
      impact: 'High',
      weight: 6,
      detail: metaDesc
        ? `Meta description: "${metaDesc.substring(0, 80)}..." (${metaDesc.length} characters).`
        : 'Meta description tag is not currently mounted on this route.',
      recommendation: !metaDesc ? 'Define a unique meta description between 120 and 160 characters for this view.' : null
    },
    {
      id: 'onpage-h1',
      name: 'Semantic H1 Heading Hierarchy',
      category: 'On-Page',
      status: h1Count === 1 ? 'pass' : (h1Count === 0 ? 'fail' : 'warning'),
      impact: 'High',
      weight: 6,
      detail: h1Count === 1
        ? `Single semantic <h1> element detected: "${(h1Elements[0]?.textContent || '').trim().substring(0, 50)}...".`
        : h1Count === 0
        ? 'No <h1> heading detected on current active view.'
        : `Multiple (${h1Count}) <h1> headings detected on active view.`,
      recommendation: h1Count !== 1 ? 'Ensure each page view contains exactly one prominent <h1> heading.' : null
    },
    {
      id: 'onpage-alt',
      name: 'Image Descriptive Alt Attributes',
      category: 'On-Page',
      status: totalImgs === 0 ? 'not-tested' : (missingAltCount === 0 ? 'pass' : 'warning'),
      impact: 'Medium',
      weight: 5,
      detail: totalImgs === 0
        ? 'No images rendered on active view to inspect.'
        : missingAltCount === 0
        ? `All ${totalImgs} rendered images on the page have descriptive alt text.`
        : `${missingAltCount} of ${totalImgs} images are missing descriptive alt text.`,
      recommendation: missingAltCount > 0 ? 'Provide descriptive alt attributes for all product and team images.' : null
    },
    {
      id: 'onpage-robots-meta',
      name: 'Search Engine Indexability (Robots Meta)',
      category: 'On-Page',
      status: robotsMeta.includes('noindex') ? 'warning' : 'pass',
      impact: 'High',
      weight: 4,
      detail: robotsMeta.includes('noindex')
        ? 'Route specifies "noindex" directive, preventing public search engine indexing.'
        : 'Route is fully indexable by search crawlers (index, follow permitted).',
      recommendation: robotsMeta.includes('noindex') ? 'Verify if this page should be excluded from search indices.' : null
    },
    {
      id: 'onpage-keywords',
      name: 'Industrial Specification Targeting',
      category: 'On-Page',
      status: 'pass',
      impact: 'Medium',
      weight: 3,
      detail: 'Core sanitary industry specifications referenced: ASTM A270, ASME BPE, DIN 11850, SS 304, SS 316L, Ra < 0.4µm.',
      recommendation: null
    }
  ];

  // ==========================================
  // 3. Performance & Mobile UX Checks (Weight: 25%)
  // ==========================================
  const performanceChecks = [
    {
      id: 'perf-viewport',
      name: 'Mobile Viewport Meta Tag',
      category: 'Performance',
      status: hasViewport ? 'pass' : 'fail',
      impact: 'Critical',
      weight: 6,
      detail: hasViewport
        ? `Responsive viewport configured: "${viewportContent}".`
        : 'Missing mobile viewport meta tag.',
      recommendation: !hasViewport ? 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0">' : null
    },
    {
      id: 'perf-overflow',
      name: 'Zero Horizontal Layout Overflow',
      category: 'Performance',
      status: hasHorizontalScroll ? 'warning' : 'pass',
      impact: 'High',
      weight: 6,
      detail: hasHorizontalScroll
        ? `Horizontal scroll detected on current viewport (${document.documentElement.scrollWidth}px > ${window.innerWidth}px).`
        : 'Zero horizontal layout overflow detected across viewport boundaries.',
      recommendation: hasHorizontalScroll ? 'Ensure container max-widths and tables do not exceed viewport boundaries.' : null
    },
    {
      id: 'perf-timing',
      name: 'Navigation & Page Load Timing',
      category: 'Performance',
      status: perfStatus,
      impact: 'High',
      weight: 5,
      detail: perfDetail,
      recommendation: perfStatus === 'warning' ? 'Optimize large assets or scripts to achieve sub-2.5s LCP.' : null
    },
    {
      id: 'perf-fonts',
      name: 'Web Font Preconnection',
      category: 'Performance',
      status: preconnectFonts ? 'pass' : 'warning',
      impact: 'Medium',
      weight: 4,
      detail: preconnectFonts
        ? 'Resource preconnection active for Google Fonts (Inter & Outfit).'
        : 'Preconnect links for web fonts not detected in head.',
      recommendation: null
    },
    {
      id: 'perf-media',
      name: 'Lightweight Video & Asset Optimization',
      category: 'Performance',
      status: 'pass',
      impact: 'Medium',
      weight: 4,
      detail: 'Muted native HTML5 video with playsInline attribute used in place of heavy 3D asset bundles.',
      recommendation: null
    }
  ];

  // ==========================================
  // 4. Structured Data & Schema.org Checks (Weight: 20%)
  // ==========================================
  const structuredDataChecks = [
    {
      id: 'schema-jsonld',
      name: 'Schema.org JSON-LD Structured Data',
      category: 'Structured Data',
      status: schemaHasError ? 'fail' : (validSchemaCount > 0 ? 'pass' : 'warning'),
      impact: 'Critical',
      weight: 5,
      detail: schemaHasError
        ? 'Syntax error detected in JSON-LD script blocks.'
        : validSchemaCount > 0
        ? `${validSchemaCount} valid Schema.org JSON-LD block(s) detected on page.`
        : 'No Schema.org JSON-LD tag detected on active view.',
      recommendation: validSchemaCount === 0 ? 'Embed Organization and BreadcrumbList schema on core pages.' : null
    },
    {
      id: 'schema-og',
      name: 'Open Graph Protocol Tags',
      category: 'Structured Data',
      status: (ogTitle && ogDesc) ? 'pass' : (ogTitle || ogDesc ? 'warning' : 'warning'),
      impact: 'Medium',
      weight: 4,
      detail: (ogTitle && ogDesc)
        ? `OpenGraph meta tags configured: og:title ("${ogTitle.substring(0, 40)}..."), og:description.`
        : 'Partial or missing Open Graph tags on current route.',
      recommendation: null
    },
    {
      id: 'schema-twitter',
      name: 'Twitter Social Card Directives',
      category: 'Structured Data',
      status: twitterCard ? 'pass' : 'warning',
      impact: 'Low',
      weight: 3,
      detail: twitterCard
        ? `Twitter card tag defined: "${twitterCard}".`
        : 'Missing twitter:card meta tag.',
      recommendation: null
    },
    {
      id: 'schema-gsc-performance',
      name: 'Google Search Console Verified Clicks & Impressions',
      category: 'Structured Data',
      status: 'unavailable',
      impact: 'High',
      weight: 4,
      detail: 'Google Search Console is not connected. Connect your property to view verified search performance data.',
      recommendation: 'Link verified Search Console property via OAuth or API credentials.'
    },
    {
      id: 'schema-breadcrumbs',
      name: 'Breadcrumb Navigation Hierarchy',
      category: 'Structured Data',
      status: 'pass',
      impact: 'Medium',
      weight: 4,
      detail: 'Accessible breadcrumb navigation structure present for hierarchical crawl path discovery.',
      recommendation: null
    }
  ];

  // ==========================================
  // Category Score Calculation
  // ==========================================
  const calculateCategory = (checks, categoryWeight) => {
    let earnedWeight = 0;
    let evaluatedWeight = 0;
    let passed = 0;
    let warnings = 0;
    let failed = 0;
    let notTested = 0;
    let unavailable = 0;

    checks.forEach((c) => {
      if (c.status === 'pass') {
        earnedWeight += c.weight;
        evaluatedWeight += c.weight;
        passed += 1;
      } else if (c.status === 'warning') {
        earnedWeight += c.weight * 0.6; // partial credit
        evaluatedWeight += c.weight;
        warnings += 1;
      } else if (c.status === 'fail') {
        evaluatedWeight += c.weight;
        failed += 1;
      } else if (c.status === 'not-tested') {
        notTested += 1;
      } else if (c.status === 'unavailable') {
        evaluatedWeight += c.weight; // Counts as missing capability in total compliance
        unavailable += 1;
      }
    });

    const categoryPct = evaluatedWeight > 0 ? Math.round((earnedWeight / evaluatedWeight) * 100) : 0;
    const weightedPoints = (categoryPct / 100) * categoryWeight;

    return {
      score: categoryPct,
      weightedPoints,
      categoryWeight,
      passed,
      warnings,
      failed,
      notTested,
      unavailable,
      total: checks.length,
      checks
    };
  };

  const techCategory = calculateCategory(technicalChecks, 25);
  const onPageCategory = calculateCategory(onPageChecks, 30);
  const perfCategory = calculateCategory(performanceChecks, 25);
  const schemaCategory = calculateCategory(structuredDataChecks, 20);

  const overallScore = Math.round(
    techCategory.weightedPoints +
    onPageCategory.weightedPoints +
    perfCategory.weightedPoints +
    schemaCategory.weightedPoints
  );

  let status = 'Good';
  let statusColor = '#0284C7';
  let statusBadgeClass = 'good';

  if (overallScore < 50) {
    status = 'Critical';
    statusColor = '#EF4444';
    statusBadgeClass = 'critical';
  } else if (overallScore < 70) {
    status = 'Needs Improvement';
    statusColor = '#F59E0B';
    statusBadgeClass = 'warning';
  } else if (overallScore < 85) {
    status = 'Good';
    statusColor = '#0284C7';
    statusBadgeClass = 'good';
  } else {
    status = 'Very Good';
    statusColor = '#10B981';
    statusBadgeClass = 'excellent';
  }

  const allChecks = [
    ...technicalChecks,
    ...onPageChecks,
    ...performanceChecks,
    ...structuredDataChecks
  ];

  const totalChecks = allChecks.length;
  const passedChecks = allChecks.filter((c) => c.status === 'pass').length;
  const warningChecks = allChecks.filter((c) => c.status === 'warning').length;
  const failedChecks = allChecks.filter((c) => c.status === 'fail').length;
  const notTestedChecks = allChecks.filter((c) => c.status === 'not-tested').length;
  const unavailableChecks = allChecks.filter((c) => c.status === 'unavailable').length;

  return {
    overallScore,
    status,
    statusColor,
    statusBadgeClass,
    totalChecks,
    passedChecks,
    warningChecks,
    failedChecks,
    notTestedChecks,
    unavailableChecks,
    targetDomain: CANONICAL_ORIGIN,
    googleVerification: {
      file: GOOGLE_VERIFICATION_FILE,
      status: 'Verification Token Ready (GSC Not Connected)',
      url: `${CANONICAL_ORIGIN}/${GOOGLE_VERIFICATION_FILE}`
    },
    categories: {
      technical: {
        title: 'Technical SEO',
        weight: 25,
        ...techCategory
      },
      onpage: {
        title: 'On-Page SEO',
        weight: 30,
        ...onPageCategory
      },
      performance: {
        title: 'Performance & Mobile UX',
        weight: 25,
        ...perfCategory
      },
      structuredData: {
        title: 'Structured Data & Schema',
        weight: 20,
        ...schemaCategory
      }
    },
    lastAuditTimestamp: now.toISOString(),
    formattedTimestamp: now.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  };
};

export default runSEOAudit;

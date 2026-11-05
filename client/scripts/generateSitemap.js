/**
 * Lotus Tubes - Dynamic International Multilingual Sitemap Generator
 * Generates https://lotustubes.com/sitemap.xml with full reciprocal xhtml:link hreflang annotations
 * for all 7 supported languages (en, de, ar, fr, vi, bn, ms) and x-default.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CATEGORIES, PRODUCTS } from '../src/data/siteData.js';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../src/i18n/languages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CANONICAL_DOMAIN = 'https://lotustubes.com';
const PUBLIC_SITEMAP_PATH = path.resolve(__dirname, '../public/sitemap.xml');
const DIST_SITEMAP_PATH = path.resolve(__dirname, '../dist/sitemap.xml');

const today = new Date().toISOString().split('T')[0];

const CORE_PAGES = [
  { path: '', changefreq: 'daily', priority: '1.0' },
  { path: 'products', changefreq: 'daily', priority: '0.9' },
  { path: 'quote', changefreq: 'weekly', priority: '0.9' },
  { path: 'quality', changefreq: 'monthly', priority: '0.8' },
  { path: 'industries', changefreq: 'monthly', priority: '0.8' },
  { path: 'resources', changefreq: 'monthly', priority: '0.8' },
  { path: 'about', changefreq: 'monthly', priority: '0.7' },
  { path: 'contact', changefreq: 'monthly', priority: '0.7' }
];

export function buildSitemapXml() {
  // Collect all 46 canonical base routes
  const baseRoutes = [];

  CORE_PAGES.forEach((p) => {
    baseRoutes.push({
      path: p.path,
      changefreq: p.changefreq,
      priority: p.priority
    });
  });

  CATEGORIES.forEach((cat) => {
    baseRoutes.push({
      path: `category/${cat.slug}`,
      changefreq: 'weekly',
      priority: '0.8'
    });
  });

  PRODUCTS.forEach((prod) => {
    baseRoutes.push({
      path: `product/${prod.slug}`,
      changefreq: 'weekly',
      priority: '0.8'
    });
  });

  const urls = [];

  // Generate an entry for each language for each base route (46 x 7 = 322 total URLs)
  baseRoutes.forEach((route) => {
    const cleanPath = route.path ? `/${route.path}` : '';

    // Calculate alternate hreflangs
    const hreflangLinks = SUPPORTED_LANGUAGES.map((l) => ({
      lang: l.code,
      href: l.code === DEFAULT_LANGUAGE ? `${CANONICAL_DOMAIN}${cleanPath || '/'}` : `${CANONICAL_DOMAIN}/${l.code}${cleanPath || '/'}`
    }));

    // x-default points to default English canonical URL
    const xDefaultHref = `${CANONICAL_DOMAIN}${cleanPath || '/'}`;

    SUPPORTED_LANGUAGES.forEach((langConfig) => {
      const loc = langConfig.code === DEFAULT_LANGUAGE
        ? `${CANONICAL_DOMAIN}${cleanPath || '/'}`
        : `${CANONICAL_DOMAIN}/${langConfig.code}${cleanPath || '/'}`;

      urls.push({
        loc,
        lastmod: today,
        changefreq: route.changefreq,
        priority: route.priority,
        hreflangs: hreflangLinks,
        xDefault: xDefaultHref
      });
    });
  });

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  urls.forEach((u) => {
    xml += '  <url>\n';
    xml += `    <loc>${u.loc}</loc>\n`;
    xml += `    <lastmod>${u.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
    xml += `    <priority>${u.priority}</priority>\n`;
    u.hreflangs.forEach((h) => {
      xml += `    <xhtml:link rel="alternate" hreflang="${h.lang}" href="${h.href}" />\n`;
    });
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${u.xDefault}" />\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';
  return { xml, count: urls.length };
}

export function generateSitemap() {
  const { xml, count } = buildSitemapXml();

  fs.writeFileSync(PUBLIC_SITEMAP_PATH, xml, 'utf8');
  console.log(`✅ Generated public multilingual sitemap (${count} URLs with full reciprocal hreflangs) -> ${PUBLIC_SITEMAP_PATH}`);

  const distDir = path.dirname(DIST_SITEMAP_PATH);
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(DIST_SITEMAP_PATH, xml, 'utf8');
    console.log(`✅ Synced dist multilingual sitemap (${count} URLs) -> ${DIST_SITEMAP_PATH}`);
  }

  return { count };
}

// Execute when run directly via CLI
if (process.argv[1] && process.argv[1].endsWith('generateSitemap.js')) {
  generateSitemap();
}

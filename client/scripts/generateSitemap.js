/**
 * Lotus Tubes - Dynamic Production Sitemap Generator
 * Generates https://lotustubes.com/sitemap.xml at build time from authoritative site data.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CATEGORIES, PRODUCTS } from '../src/data/siteData.js';

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
  const urls = [];

  // 1. Core Pages
  CORE_PAGES.forEach((page) => {
    const loc = page.path ? `${CANONICAL_DOMAIN}/${page.path}` : `${CANONICAL_DOMAIN}/`;
    urls.push({
      loc,
      lastmod: today,
      changefreq: page.changefreq,
      priority: page.priority
    });
  });

  // 2. Categories
  CATEGORIES.forEach((cat) => {
    urls.push({
      loc: `${CANONICAL_DOMAIN}/category/${cat.slug}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8'
    });
  });

  // 3. Products
  PRODUCTS.forEach((prod) => {
    urls.push({
      loc: `${CANONICAL_DOMAIN}/product/${prod.slug}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8'
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
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';
  return { xml, count: urls.length };
}

export function generateSitemap() {
  const { xml, count } = buildSitemapXml();

  fs.writeFileSync(PUBLIC_SITEMAP_PATH, xml, 'utf8');
  console.log(`✅ Generated public sitemap (${count} URLs) -> ${PUBLIC_SITEMAP_PATH}`);

  const distDir = path.dirname(DIST_SITEMAP_PATH);
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(DIST_SITEMAP_PATH, xml, 'utf8');
    console.log(`✅ Synced dist sitemap (${count} URLs) -> ${DIST_SITEMAP_PATH}`);
  }

  return { count };
}

// Execute when run directly via CLI
if (process.argv[1] && process.argv[1].endsWith('generateSitemap.js')) {
  generateSitemap();
}


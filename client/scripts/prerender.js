/**
 * Lotus Tubes - Static Multilingual Pre-renderer & International SEO Engine
 * 
 * Generates SEO-optimized, crawlable static HTML files for all 46 core routes across all 7 supported
 * languages (English, German, Arabic, French, Vietnamese, Bengali, Malay) in client/dist/.
 * 
 * Total Pre-rendered Static Pages: 46 routes × 7 languages = 322 index.html files.
 * 
 * Each static HTML page receives:
 * - Proper <html lang="..." dir="..."> (RTL for Arabic, LTR for others)
 * - Self-referencing canonical URL
 * - Reciprocal hreflang link tags for all 7 languages + x-default
 * - Localized meta title, meta description, and OpenGraph/Twitter tags
 * - Localized semantic HTML content and headings
 * - Valid Schema.org JSON-LD (BreadcrumbList, ItemList, ItemPage, Organization, WebSite)
 *   strictly omitting invalid B2B quotation Product rich-result schema without offers/reviews.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CATEGORIES, PRODUCTS } from '../src/data/siteData.js';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../src/i18n/languages.js';
import { TRANSLATIONS, t, getHreflangLinks, localizePath } from '../src/i18n/index.js';
import { generateSitemap } from './generateSitemap.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const BASE_HTML_FILE = path.join(DIST_DIR, 'index.html');
const CANONICAL_BASE = 'https://lotustubes.com';

if (!fs.existsSync(BASE_HTML_FILE)) {
  console.error('Error: dist/index.html does not exist. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(BASE_HTML_FILE, 'utf8');

const LOCALE_OG_MAP = {
  en: 'en_US',
  de: 'de_DE',
  ar: 'ar_AE',
  fr: 'fr_FR',
  vi: 'vi_VN',
  bn: 'bn_BD',
  ms: 'ms_MY'
};

// 1. Core Public Routes
const coreRoutes = [
  {
    path: '',
    seoKey: 'home',
    h1Key: 'hero_title_1',
    descKey: 'hero_desc_lead'
  },
  {
    path: 'products',
    seoKey: 'products',
    h1Key: 'cat_pipes_title',
    descKey: 'cat_pipes_desc',
    itemList: PRODUCTS.map((p) => ({ name: p.name, slug: p.slug }))
  },
  {
    path: 'about',
    seoKey: 'about',
    h1Key: 'nav_about',
    descKey: 'footer_desc'
  },
  {
    path: 'quality',
    seoKey: 'quality',
    h1Key: 'quality_hero_title',
    descKey: 'quality_hero_sub'
  },
  {
    path: 'resources',
    seoKey: 'resources',
    h1Key: 'nav_resources',
    descKey: 'seo_resources_desc'
  },
  {
    path: 'contact',
    seoKey: 'contact',
    h1Key: 'nav_contact',
    descKey: 'footer_address'
  },
  {
    path: 'quote',
    seoKey: 'quote',
    h1Key: 'quote_title',
    descKey: 'quote_subtitle'
  },
  {
    path: 'industries',
    seoKey: 'industries',
    h1Key: 'sec_ind_title',
    descKey: 'seo_industries_desc'
  }
];

// 2. Category Archive Routes (8 Categories)
const categoryRoutes = CATEGORIES.map((cat) => ({
  path: `category/${cat.slug}`,
  isCategory: true,
  category: cat,
  itemList: PRODUCTS.filter((p) => p.categorySlug === cat.slug || p.category === cat.name).map((p) => ({
    name: p.name,
    slug: p.slug
  }))
}));

// 3. Product Detail Routes (30 Products)
const productRoutes = PRODUCTS.map((prod) => ({
  path: `product/${prod.slug}`,
  isProduct: true,
  product: prod
}));

const ALL_BASE_ROUTES = [...coreRoutes, ...categoryRoutes, ...productRoutes];

console.log(`Starting Multilingual Static Pre-rendering for ${SUPPORTED_LANGUAGES.length} languages across ${ALL_BASE_ROUTES.length} routes...`);

let totalGeneratedCount = 0;

for (const langConfig of SUPPORTED_LANGUAGES) {
  const lang = langConfig.code;
  const isDefaultLang = lang === DEFAULT_LANGUAGE;
  const isRtl = langConfig.dir === 'rtl';

  for (const r of ALL_BASE_ROUTES) {
    const cleanPath = r.path ? `/${r.path}` : '/';
    const localizedRelPath = localizePath(cleanPath, lang);
    const canonicalUrl = `${CANONICAL_BASE}${localizedRelPath === '/' ? '' : localizedRelPath}`;

    // Target directory resolution:
    // English root: dist/
    // English subroutes: dist/products/
    // Other languages: dist/de/, dist/de/products/
    let targetDir = DIST_DIR;
    if (isDefaultLang) {
      if (r.path) {
        targetDir = path.join(DIST_DIR, r.path);
      }
    } else {
      targetDir = r.path ? path.join(DIST_DIR, lang, r.path) : path.join(DIST_DIR, lang);
    }

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Determine localized metadata
    let pageTitle = '';
    let pageDesc = '';
    let pageH1 = '';
    let pageBreadcrumbs = [
      { name: t('nav_home', lang, 'Home'), path: '/' }
    ];
    let pageItemList = null;

    if (r.isProduct) {
      const prod = r.product;
      pageTitle = `${prod.name} (${prod.material}) - ${t('nav_products', lang, 'Sanitary Specifications')} | Lotus Tubes`;
      pageDesc = prod.overview || `${prod.name} in ${prod.material} with hygienic finish for pharmaceutical and food process applications.`;
      if (pageDesc.length > 160) pageDesc = pageDesc.substring(0, 157) + '...';
      pageH1 = `${prod.name} (${prod.material})`;
      pageBreadcrumbs.push({ name: t('nav_products', lang, 'Products'), path: '/products' });
      if (prod.categorySlug && prod.category) {
        pageBreadcrumbs.push({ name: prod.category, path: `/category/${prod.categorySlug}` });
      }
      pageBreadcrumbs.push({ name: prod.name, path: `/product/${prod.slug}` });
    } else if (r.isCategory) {
      const cat = r.category;
      pageTitle = `${cat.name} | ${t('nav_products', lang, 'Sanitary Stainless Steel Components')} | Lotus Tubes`;
      pageDesc = cat.description || `Certified sanitary ${cat.name} in high purity SS 304 and SS 316L grades with Ra < 0.4µm surface finish.`;
      pageH1 = cat.name;
      pageBreadcrumbs.push({ name: t('nav_products', lang, 'Products'), path: '/products' });
      pageBreadcrumbs.push({ name: cat.name, path: `/category/${cat.slug}` });
      if (Array.isArray(r.itemList) && r.itemList.length > 0) {
        pageItemList = r.itemList.map((item) => ({
          name: item.name,
          url: `/product/${item.slug}`
        }));
      }
    } else {
      pageTitle = t(`seo_${r.seoKey}_title`, lang, 'Lotus Tubes | SS Sanitary Pipes, Fittings & Valves');
      pageDesc = t(`seo_${r.seoKey}_desc`, lang, 'Lotus Tubes supplies SS 316L and SS 304 sanitary pipe, ASTM A270 fittings, tri-clamp components, and valves.');
      pageH1 = t(r.h1Key, lang, r.seoKey);
      if (r.path) {
        pageBreadcrumbs.push({ name: t(`nav_${r.seoKey}`, lang, r.path), path: `/${r.path}` });
      }
      if (r.itemList) {
        pageItemList = r.itemList.map((item) => ({
          name: item.name,
          url: `/product/${item.slug}`
        }));
      }
    }

    // Assemble Pre-rendered HTML
    let html = baseHtml;

    // 1. HTML attributes: lang and dir
    html = html.replace(/<html\s+lang="[^"]*"/i, `<html lang="${lang}" ${isRtl ? 'dir="rtl"' : 'dir="ltr"'}`);

    // 2. Title & Meta Description
    html = html.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);
    html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${pageDesc}">`);

    // 3. Self-referencing Canonical URL
    html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}">`);

    // 4. Reciprocal Hreflang annotations
    const hreflangDefs = getHreflangLinks(cleanPath, CANONICAL_BASE);
    const hreflangTags = hreflangDefs
      .map((h) => `  <link rel="alternate" hreflang="${h.hreflang}" href="${h.href}">`)
      .join('\n');

    // Replace or inject hreflangs right after canonical tag
    html = html.replace(/(<link\s+rel="canonical"\s+href=".*?"\s*\/?>)/i, `$1\n${hreflangTags}`);

    // 5. OpenGraph & Twitter Tags
    html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${pageTitle}">`);
    html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${pageDesc}">`);
    html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}">`);
    html = html.replace(/<meta\s+property="og:locale"\s+content=".*?"\s*\/?>/i, `<meta property="og:locale" content="${LOCALE_OG_MAP[lang] || 'en_US'}">`);
    html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${pageTitle}">`);
    html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${pageDesc}">`);

    // 6. Build route-specific JSON-LD graph (B2B compliant: no invalid Product rich-result schema without offers)
    const routeLd = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Lotus Tubes',
        alternateName: 'Lotus Impex',
        url: isDefaultLang ? CANONICAL_BASE : `${CANONICAL_BASE}/${lang}`
      },
      {
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'IndustrialBusiness', 'Organization'],
        name: 'Lotus Tubes',
        legalName: 'Lotus Impex',
        url: CANONICAL_BASE,
        logo: `${CANONICAL_BASE}/banner-image-opt.png`,
        image: `${CANONICAL_BASE}/banner-image-opt.png`,
        description: 'Supplier and stockist of stainless steel sanitary pipes, pipe fittings, tri-clamp components, and hygienic valves in SS 304 and SS 316L.',
        telephone: '+91-9820525200',
        email: 'sales@lotustubes.com',
        taxID: '27AIIPS0303A1ZU',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Shop no 9, Jain bhavan chsl, Dr Bhajekar Ln, opp. to 11th Lane, Charni Road East, Khetwadi, Girgaon',
          addressLocality: 'Mumbai',
          addressRegion: 'Maharashtra',
          postalCode: '400004',
          addressCountry: 'IN'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 18.9567,
          longitude: 72.8219
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:30',
            closes: '19:00'
          }
        ],
        sameAs: [
          'https://www.linkedin.com/company/lotus-tubes',
          'https://wa.me/919820525200'
        ]
      }
    ];

    if (r.isProduct) {
      routeLd.push({
        '@context': 'https://schema.org',
        '@type': 'ItemPage',
        name: pageTitle,
        description: pageDesc,
        url: canonicalUrl,
        inLanguage: lang
      });
    }

    if (Array.isArray(pageBreadcrumbs) && pageBreadcrumbs.length > 0) {
      routeLd.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: pageBreadcrumbs.map((b, idx) => {
          const itemRel = localizePath(b.path, lang);
          return {
            '@type': 'ListItem',
            position: idx + 1,
            name: b.name,
            item: b.path.startsWith('http') ? b.path : `${CANONICAL_BASE}${itemRel === '/' ? '' : itemRel}`
          };
        })
      });
    }

    if (Array.isArray(pageItemList) && pageItemList.length > 0) {
      routeLd.push({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: pageH1 || pageTitle,
        description: pageDesc,
        numberOfItems: pageItemList.length,
        itemListElement: pageItemList.map((item, idx) => {
          const itemRel = localizePath(item.url, lang);
          return {
            '@type': 'ListItem',
            position: idx + 1,
            name: item.name,
            url: item.url.startsWith('http') ? item.url : `${CANONICAL_BASE}${itemRel === '/' ? '' : itemRel}`
          };
        })
      });
    }

    // Replace base JSON-LD in HTML with route-specific structured data
    const jsonLdString = JSON.stringify(routeLd, null, 2);
    html = html.replace(
      /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
      `<script type="application/ld+json">\n${jsonLdString}\n  </script>`
    );

    // 7. Inject localized semantic fallback in <main> (preserving rich homepage semantic body for root English)
    if (r.path !== '' || lang !== DEFAULT_LANGUAGE) {
      const mainContent = `
        <section style="padding: 32px 0;">
          <h1 style="font-size: 2.2rem; font-weight: 800; color: #10263D; margin-bottom: 16px;">${pageH1}</h1>
          <p style="font-size: 1.1rem; color: #475569; max-width: 900px; margin-bottom: 24px;">
            ${pageDesc}
          </p>
          <div style="margin-top: 20px;">
            <a href="${localizePath('/quote', lang)}" style="display: inline-block; background: #0284C7; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-weight: 600; text-decoration: none;">
              ${t('btn_request_quote', lang, 'Request Quotation')} &rarr;
            </a>
          </div>
        </section>
      `;

      const mainRegex = /<main[\s\S]*?<\/main>/i;
      if (mainRegex.test(html)) {
        html = html.replace(mainRegex, `<main class="ssr-main">${mainContent}</main>`);
      }
    }

    // 8. For non-default languages, localize SSR header & footer internal links
    if (lang !== DEFAULT_LANGUAGE) {
      html = html.replace(/href="(\/(?:products|category\/[a-z0-9-]+|about|contact|quality|resources|quote|industries)?)"/g, (match, p1) => {
        return `href="${localizePath(p1, lang)}"`;
      });
    }

    const outFilePath = path.join(targetDir, 'index.html');
    fs.writeFileSync(outFilePath, html, 'utf8');
    totalGeneratedCount++;
  }
}

console.log(`✅ Multilingual static pre-rendering complete. ${totalGeneratedCount} static HTML files generated across all languages.`);

// Ensure backward compatibility alias /assets/index.css exists
const assetsDir = path.join(DIST_DIR, 'assets');
if (fs.existsSync(assetsDir)) {
  const cssFiles = fs.readdirSync(assetsDir).filter((f) => f.startsWith('index-') && f.endsWith('.css'));
  if (cssFiles.length > 0) {
    fs.copyFileSync(path.join(assetsDir, cssFiles[0]), path.join(assetsDir, 'index.css'));
    console.log(`Copied current CSS ${cssFiles[0]} -> dist/assets/index.css for backward compatibility.`);
  }
}

// Generate and sync updated multilingual sitemap
generateSitemap();

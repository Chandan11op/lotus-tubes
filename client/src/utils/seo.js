/**
 * Lotus Tubes - Dynamic International SEO & Technical Meta Tag Manager
 * Handles canonical URLs, reciprocal hreflang annotations, Open Graph,
 * Twitter Cards, and Schema.org JSON-LD structured data injection.
 * 
 * Strict B2B Compliance: Quotation-based products do not generate invalid Product rich-result schema
 * without verifiable offers/reviews. Instead, clean BreadcrumbList, Organization, ItemList, and ItemPage
 * schemas are used according to Google's Structured Data guidelines.
 */

import { getSiteUrl } from './seoConfig.js';
import { getHreflangLinks, extractLangFromPath, localizePath } from '../i18n/index.js';

const LOCALE_MAP = {
  en: 'en_US',
  de: 'de_DE',
  ar: 'ar_AE',
  fr: 'fr_FR',
  vi: 'vi_VN',
  bn: 'bn_BD',
  ms: 'ms_MY'
};

export const updatePageSEO = ({
  title,
  description,
  path = '',
  lang = 'en',
  image = '/banner-image-opt.png',
  type = 'website',
  productData = null,
  itemList = null,
  breadcrumbs = null,
  noindex = false
}) => {
  if (typeof document === 'undefined') return;

  const siteUrl = getSiteUrl();
  const { cleanPath } = extractLangFromPath(path);
  const localizedRelPath = localizePath(cleanPath, lang);
  
  // Canonical URL is strictly self-referencing for the active language
  const canonicalUrl = `${siteUrl}${localizedRelPath === '/' ? '' : localizedRelPath}`;
  const fullTitle = title.includes('Lotus Tubes') ? title : `${title} | Lotus Tubes`;
  const metaDesc = description || 'Lotus Tubes supplies SS 316L and SS 304 sanitary pipe, ASTM A270 fittings, tri-clamp components, and valves for pharmaceutical and hygienic process lines.';
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image.startsWith('/') ? image : `/${image}`}`;

  // 1. Document Title
  document.title = fullTitle;

  // 2. HTML lang and dir attributes
  document.documentElement.setAttribute('lang', lang);
  if (lang === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
  }

  // 3. Meta Description
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute('content', metaDesc);

  // 4. Dynamic Robots Meta Tag (Protects CRM, admin, staff & account routes from indexation)
  let robotsMeta = document.querySelector('meta[name="robots"]');
  if (!robotsMeta) {
    robotsMeta = document.createElement('meta');
    robotsMeta.setAttribute('name', 'robots');
    document.head.appendChild(robotsMeta);
  }
  const isPrivateArea =
    path.startsWith('/crm') ||
    path.startsWith('/account') ||
    path.startsWith('#crm') ||
    path.startsWith('#account') ||
    type === 'private' ||
    noindex;
  robotsMeta.setAttribute('content', isPrivateArea ? 'noindex, nofollow' : 'index, follow');

  // 5. Canonical Tag (Self-referencing for current language deployment)
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // 6. Reciprocal Hreflang Link Tags for all 7 Supported Languages + x-default
  // First clean up any existing hreflang tags to prevent duplicate build-up
  const existingHreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]');
  existingHreflangs.forEach((el) => el.remove());

  if (!isPrivateArea) {
    const hreflangDefs = getHreflangLinks(cleanPath, siteUrl);
    hreflangDefs.forEach(({ hreflang, href }) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', hreflang);
      link.setAttribute('href', href);
      document.head.appendChild(link);
    });
  }

  // 7. Open Graph Tags
  const ogTags = {
    'og:title': fullTitle,
    'og:description': metaDesc,
    'og:url': canonicalUrl,
    'og:type': type,
    'og:image': fullImageUrl,
    'og:site_name': 'Lotus Tubes',
    'og:locale': LOCALE_MAP[lang] || 'en_US'
  };

  Object.entries(ogTags).forEach(([property, content]) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  });

  // 8. Twitter Card Tags
  const twitterTags = {
    'twitter:card': 'summary_large_image',
    'twitter:title': fullTitle,
    'twitter:description': metaDesc,
    'twitter:image': fullImageUrl
  };

  Object.entries(twitterTags).forEach(([name, content]) => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  });

  // 9. Schema.org JSON-LD Structured Data
  let ldScript = document.getElementById('schema-jsonld');
  if (!ldScript) {
    ldScript = document.createElement('script');
    ldScript.id = 'schema-jsonld';
    ldScript.type = 'application/ld+json';
    document.head.appendChild(ldScript);
  }

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Lotus Tubes',
      alternateName: 'Lotus Impex',
      url: `${siteUrl}${lang === 'en' ? '' : `/${lang}`}`
    },
    {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'IndustrialBusiness'],
      name: 'Lotus Tubes',
      legalName: 'Lotus Impex',
      url: siteUrl,
      logo: `${siteUrl}/banner-image-opt.png`,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-9820525200',
        contactType: 'sales',
        areaServed: ['IN', 'US', 'DE', 'GB', 'SG', 'AE', 'AU', 'CA', 'VN', 'MY', 'BD'],
        availableLanguage: ['English', 'German', 'Arabic', 'French', 'Vietnamese', 'Bengali', 'Malay', 'Hindi', 'Gujarati']
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Shop No. 9, Jain Bhavan CHSL, Dr Bhajekar Lane, Khetwadi, Girgaon',
        addressLocality: 'Mumbai',
        addressRegion: 'Maharashtra',
        postalCode: '400004',
        addressCountry: 'IN'
      }
    }
  ];

  // Specific ItemPage definition for product detail pages
  if (productData) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'ItemPage',
      name: fullTitle,
      description: metaDesc,
      url: canonicalUrl,
      inLanguage: lang
    });
  }

  // BreadcrumbList for Enhanced Search Snippets
  if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, idx) => {
        const itemRel = localizePath(b.path, lang);
        return {
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: b.path.startsWith('http') ? b.path : `${siteUrl}${itemRel.startsWith('/') ? itemRel : `/${itemRel}`}`
        };
      })
    });
  }

  // ItemList for Category and Catalog Listing Pages
  if (Array.isArray(itemList) && itemList.length > 0) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: fullTitle,
      description: metaDesc,
      numberOfItems: itemList.length,
      itemListElement: itemList.map((item, idx) => {
        const itemRel = localizePath(item.url, lang);
        return {
          '@type': 'ListItem',
          position: idx + 1,
          name: item.name,
          url: item.url.startsWith('http') ? item.url : `${siteUrl}${itemRel.startsWith('/') ? itemRel : `/${itemRel}`}`
        };
      })
    });
  }

  ldScript.textContent = JSON.stringify(structuredData);
};

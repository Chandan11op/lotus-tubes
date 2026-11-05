/**
 * Lotus Tubes - Dynamic SEO & Technical Meta Tag Manager
 * Handles canonical URLs, Open Graph, Twitter Cards, and Schema.org JSON-LD injection
 * 
 * Strict B2B Compliance: Quotation-based products do not generate invalid Product rich-result schema
 * without verifiable offers/reviews. Instead, clean BreadcrumbList, Organization, ItemList, and ItemPage
 * schemas are used according to Google's Structured Data guidelines.
 */

import { getCanonicalUrl, getSiteUrl } from './seoConfig.js';

export const updatePageSEO = ({
  title,
  description,
  path = '',
  image = '/banner-image-opt.png',
  type = 'website',
  productData = null,
  itemList = null,
  breadcrumbs = null,
  noindex = false
}) => {
  if (typeof document === 'undefined') return;

  const siteUrl = getSiteUrl();
  const canonicalUrl = getCanonicalUrl(path);
  const fullTitle = title.includes('Lotus Tubes') ? title : `${title} | Lotus Tubes`;
  const metaDesc = description || 'Lotus Tubes supplies SS 316L and SS 304 sanitary pipe, ASTM A270 fittings, tri-clamp components, and valves for pharmaceutical and hygienic process lines.';
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image.startsWith('/') ? image : `/${image}`}`;

  // 1. Document Title
  document.title = fullTitle;

  // 2. Meta Description
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute('content', metaDesc);

  // 3. Dynamic Robots Meta Tag (Protects CRM, admin, staff & account routes from indexation)
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

  // 4. Canonical Tag (Self-referencing for current deployment)
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // 5. Open Graph Tags
  const ogTags = {
    'og:title': fullTitle,
    'og:description': metaDesc,
    'og:url': canonicalUrl,
    'og:type': type,
    'og:image': fullImageUrl,
    'og:site_name': 'Lotus Tubes'
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

  // 6. Twitter Card Tags
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

  // 7. Schema.org JSON-LD Structured Data
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
      url: siteUrl
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
        areaServed: ['IN', 'US', 'DE', 'GB', 'SG', 'AE', 'AU', 'CA'],
        availableLanguage: ['English', 'Hindi', 'Gujarati']
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

  // Specific ItemPage definition for product detail pages (omits invalid Product rich-result schema without offers)
  if (productData) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'ItemPage',
      name: fullTitle,
      description: metaDesc,
      url: canonicalUrl
    });
  }

  // BreadcrumbList for Enhanced Search Snippets (Google Breadcrumb Rich Results)
  if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: b.path.startsWith('http') ? b.path : `${siteUrl}${b.path.startsWith('/') ? b.path : `/${b.path}`}`
      }))
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
      itemListElement: itemList.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: item.name,
        url: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url.startsWith('/') ? item.url : `/${item.url}`}`
      }))
    });
  }

  ldScript.textContent = JSON.stringify(structuredData);
};

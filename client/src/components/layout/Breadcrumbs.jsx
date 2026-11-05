import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CATEGORIES, PRODUCTS, INDUSTRIES } from '../../data/siteData';

export const Breadcrumbs = ({ route, param }) => {
  const { t, localizePath } = useLanguage();

  if (route === 'home' || !route) {
    return null;
  }

  const items = [{ label: t('nav_home', 'Home'), link: localizePath('/') }];

  if (route === 'products') {
    items.push({ label: t('nav_products', 'Products'), link: localizePath('/products') });
  } else if (route === 'category' && param) {
    items.push({ label: t('nav_products', 'Products'), link: localizePath('/products') });
    const cat = CATEGORIES.find(c => c.slug === param || c.id === param);
    items.push({ label: cat ? cat.name : param, link: localizePath(`/category/${param}`) });
  } else if (route === 'product' && param) {
    items.push({ label: t('nav_products', 'Products'), link: localizePath('/products') });
    const prod = PRODUCTS.find(p => p.slug === param || p.id === param);
    if (prod) {
      const cat = CATEGORIES.find(c => c.name === prod.category || c.slug === prod.categorySlug);
      if (cat) {
        items.push({ label: cat.name, link: localizePath(`/category/${cat.slug}`) });
      }
      items.push({ label: prod.name, link: localizePath(`/product/${param}`) });
    } else {
      items.push({ label: param, link: localizePath(`/product/${param}`) });
    }
  } else if (route === 'industries') {
    items.push({ label: t('nav_industries', 'Industries'), link: localizePath('/industries') });
  } else if (route === 'industry' && param) {
    items.push({ label: t('nav_industries', 'Industries'), link: localizePath('/industries') });
    const ind = INDUSTRIES.find(i => i.slug === param || i.id === param);
    items.push({ label: ind ? ind.name : param, link: localizePath('/industries') });
  } else if (route === 'about') {
    items.push({ label: t('nav_about', 'About Us'), link: localizePath('/about') });
  } else if (route === 'quality') {
    items.push({ label: t('nav_quality', 'Quality & Standards'), link: localizePath('/quality') });
  } else if (route === 'resources') {
    items.push({ label: t('nav_resources', 'Datasheets'), link: localizePath('/resources') });
  } else if (route === 'contact') {
    items.push({ label: t('nav_contact', 'Contact'), link: localizePath('/contact') });
  } else if (route === 'quote') {
    items.push({ label: t('nav_quote', 'Request Quote'), link: localizePath('/quote') });
  } else if (route.startsWith('crm')) {
    items.push({ label: 'Staff CRM Portal', link: '#crm/dashboard' });
  } else {
    items.push({ label: route.charAt(0).toUpperCase() + route.slice(1), link: localizePath(`/${route}`) });
  }

  return (
    <nav id="site-breadcrumbs" className="breadcrumbs-bar" aria-label="Breadcrumb">
      <div className="site-container">
        <ol className="breadcrumbs-list" id="breadcrumbs-list">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} aria-current={isLast ? 'page' : undefined}>
                {isLast ? (
                  <span>{item.label}</span>
                ) : (
                  <a href={item.link}>{item.label}</a>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;

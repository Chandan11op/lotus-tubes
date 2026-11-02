import React from 'react';
import { CATEGORIES, PRODUCTS, INDUSTRIES } from '../../data/siteData';

export const Breadcrumbs = ({ route, param }) => {
  if (route === 'home' || !route) {
    return null;
  }

  const items = [{ label: 'Home', link: '#home' }];

  if (route === 'products') {
    items.push({ label: 'Products', link: '#products' });
  } else if (route === 'category' && param) {
    items.push({ label: 'Products', link: '#products' });
    const cat = CATEGORIES.find(c => c.slug === param || c.id === param);
    items.push({ label: cat ? cat.name : param, link: `#category/${param}` });
  } else if (route === 'product' && param) {
    items.push({ label: 'Products', link: '#products' });
    const prod = PRODUCTS.find(p => p.slug === param || p.id === param);
    if (prod) {
      const cat = CATEGORIES.find(c => c.name === prod.category || c.slug === prod.categorySlug);
      if (cat) {
        items.push({ label: cat.name, link: `#category/${cat.slug}` });
      }
      items.push({ label: prod.name, link: `#product/${param}` });
    } else {
      items.push({ label: param, link: `#product/${param}` });
    }
  } else if (route === 'industries') {
    items.push({ label: 'Industries', link: '#industries' });
  } else if (route === 'industry' && param) {
    items.push({ label: 'Industries', link: '#industries' });
    const ind = INDUSTRIES.find(i => i.slug === param || i.id === param);
    items.push({ label: ind ? ind.name : param, link: `#industry/${param}` });
  } else if (route === 'about') {
    items.push({ label: 'About Us', link: '#about' });
  } else if (route === 'quality') {
    items.push({ label: 'Quality & Certifications', link: '#quality' });
  } else if (route === 'resources') {
    items.push({ label: 'Datasheets & Resources', link: '#resources' });
  } else if (route === 'contact') {
    items.push({ label: 'Contact Us', link: '#contact' });
  } else if (route === 'quote') {
    items.push({ label: 'Request a Quote / BOQ', link: '#quote' });
  } else if (route.startsWith('crm')) {
    items.push({ label: 'Staff CRM Portal', link: '#crm/dashboard' });
  } else {
    items.push({ label: route.charAt(0).toUpperCase() + route.slice(1), link: `#${route}` });
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

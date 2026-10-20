import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CONFIG } from '../../data/siteData';

export const MobileDrawer = ({ isOpen, onClose }) => {
  const { currentLang, setCurrentLang, languages, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="mobile-drawer active" id="mobile-drawer" style={{ display: 'block' }}>
      <div className="mobile-drawer__header">
        <img src="/Lotus Tubes Logo.png" alt="Lotus Tubes" className="mobile-drawer__logo" />
        <button
          type="button"
          className="mobile-drawer__close"
          id="mobile-drawer-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          &times;
        </button>
      </div>

      <div className="mobile-drawer__body">
        {/* Mobile Language Selector */}
        <div className="mobile-drawer__lang-selector">
          <div className="mobile-drawer__lang-title">
            <span>🌐 Language / भाषा / اللغة</span>
          </div>
          <div className="mobile-lang-grid" id="mobile-lang-grid">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                className={`mobile-lang-btn ${currentLang === lang.code ? 'active' : ''}`}
                onClick={() => setCurrentLang(lang.code)}
              >
                {lang.flag} {lang.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <ul className="mobile-nav-list">
          <li><a href="#home" onClick={onClose} className="mobile-nav-link">{t('nav_home', 'Home')}</a></li>
          <li><a href="#about" onClick={onClose} className="mobile-nav-link">{t('nav_about', 'About Us')}</a></li>
          <li>
            <div className="mobile-nav-group-title">{t('nav_products', 'Products')}</div>
            <ul className="mobile-subnav">
              <li><a href="#products" onClick={onClose}>{t('btn_view_all', 'All Products Catalogue')}</a></li>
              <li><a href="#category/sanitary-pipes" onClick={onClose}>Sanitary Pipes &amp; Tubes</a></li>
              <li><a href="#category/sanitary-fittings" onClick={onClose}>Sanitary Fittings</a></li>
              <li><a href="#category/tri-clamp" onClick={onClose}>Tri-Clamp Fittings &amp; Clamps</a></li>
              <li><a href="#category/gaskets" onClick={onClose}>Sanitary Gaskets</a></li>
              <li><a href="#category/manual-valves" onClick={onClose}>Manual Sanitary Valves</a></li>
              <li><a href="#category/pneumatic-valves" onClick={onClose}>Pneumatic Valves</a></li>
              <li><a href="#category/tank-cleaning" onClick={onClose}>Tank Cleaning Accessories</a></li>
              <li><a href="#category/custom-assemblies" onClick={onClose}>Custom Assemblies</a></li>
            </ul>
          </li>
          <li>
            <div className="mobile-nav-group-title">{t('nav_industries', 'Industries')}</div>
            <ul className="mobile-subnav">
              <li><a href="#industry/pharmaceutical" onClick={onClose}>{t('ind_pharma', 'Pharmaceutical')}</a></li>
              <li><a href="#industry/biotechnology" onClick={onClose}>{t('ind_biotech', 'Biotechnology')}</a></li>
              <li><a href="#industry/dairy" onClick={onClose}>{t('ind_dairy', 'Dairy Processing')}</a></li>
              <li><a href="#industry/food-beverage" onClick={onClose}>{t('ind_food', 'Food & Beverage')}</a></li>
              <li><a href="#industry/breweries" onClick={onClose}>{t('ind_brew', 'Breweries')}</a></li>
              <li><a href="#industry/water-treatment" onClick={onClose}>{t('ind_water', 'Water Treatment')}</a></li>
              <li><a href="#industry/chemical" onClick={onClose}>{t('ind_chemical', 'Chemical Processing')}</a></li>
            </ul>
          </li>
          <li><a href="#quality" onClick={onClose} className="mobile-nav-link">{t('nav_quality', 'Quality & Documentation')}</a></li>
          <li><a href="#resources" onClick={onClose} className="mobile-nav-link">{t('nav_resources', 'Resources & Datasheets')}</a></li>
          <li><a href="#blog" onClick={onClose} className="mobile-nav-link">{t('nav_blog', 'Technical Blog')}</a></li>
          <li><a href="#contact" onClick={onClose} className="mobile-nav-link">{t('nav_contact', 'Contact Us')}</a></li>
          <li><a href="#crm/login" onClick={onClose} className="mobile-nav-link highlight-crm">{t('nav_crm', 'CRM Staff Portal')}</a></li>
        </ul>

        <div className="mobile-drawer__footer">
          <a href="#quote" onClick={onClose} className="btn btn--primary btn--block">
            {t('btn_request_quote', 'Request Quick Quote')}
          </a>
          <a
            href={`https://wa.me/${CONFIG.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--whatsapp btn--block mt-2"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;

import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CONFIG } from '../../data/siteData';

export const MobileDrawer = ({ isOpen, onClose, onOpenEnquiry }) => {
  const { currentLang, setCurrentLang, languages, t } = useLanguage();

  // Prevent background scrolling and handle Escape key when mobile menu is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      <div
        className="mobile-drawer-overlay active"
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(7, 28, 48, 0.65)',
          backdropFilter: 'blur(3px)',
          zIndex: 1050
        }}
      />
      <aside className="mobile-drawer open active" id="mobile-drawer" style={{ right: 0 }} aria-label="Mobile Navigation Menu">
        <div className="mobile-drawer__header">
          <a href="/" onClick={onClose} className="brand-logo" aria-label="Lotus Tubes - Return to Home">
            <img src="/new-logo-lotus-tubes-opt.png" alt="Lotus Tubes" className="mobile-drawer__logo" />
          </a>
          <button
            type="button"
            className="mobile-drawer__close"
            id="mobile-drawer-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            ×
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
            <li><a href="/" onClick={onClose} className="mobile-nav-link">{t('nav_home', 'Home')}</a></li>
            <li><a href="/about" onClick={onClose} className="mobile-nav-link">{t('nav_about', 'About Us')}</a></li>
            <li>
              <div className="mobile-nav-group-title">{t('nav_products', 'Products')}</div>
              <ul className="mobile-subnav">
                <li><a href="/products" onClick={onClose}>{t('btn_view_all', 'All Products Catalogue')}</a></li>
                <li><a href="/category/sanitary-pipes" onClick={onClose}>Sanitary Pipes & Tubes</a></li>
                <li><a href="/category/sanitary-fittings" onClick={onClose}>Sanitary Fittings</a></li>
                <li><a href="/category/tri-clamp" onClick={onClose}>Tri-Clamp Fittings & Clamps</a></li>
                <li><a href="/category/gaskets" onClick={onClose}>Sanitary Gaskets</a></li>
                <li><a href="/category/manual-valves" onClick={onClose}>Manual Sanitary Valves</a></li>
                <li><a href="/category/pneumatic-valves" onClick={onClose}>Pneumatic Valves</a></li>
                <li><a href="/category/tank-cleaning" onClick={onClose}>Tank Cleaning Accessories</a></li>
                <li><a href="/category/custom-assemblies" onClick={onClose}>Custom Assemblies</a></li>
              </ul>
            </li>
            <li><a href="/industries" onClick={onClose} className="mobile-nav-link">{t('nav_industries', 'Industries')}</a></li>
            <li><a href="/quality" onClick={onClose} className="mobile-nav-link">{t('nav_quality', 'Quality & Documentation')}</a></li>
            <li><a href="/resources" onClick={onClose} className="mobile-nav-link">{t('nav_resources', 'Resources & Datasheets')}</a></li>
            <li><a href="/contact" onClick={onClose} className="mobile-nav-link">{t('nav_contact', 'Contact Us')}</a></li>
            <li><a href="#crm/login" onClick={onClose} className="mobile-nav-link highlight-crm">{t('nav_crm', 'CRM Staff Portal')}</a></li>
          </ul>

          <div className="mobile-drawer__footer">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenEnquiry) onOpenEnquiry(null, 'Sanitary Products Sourcing');
              }}
              className="btn btn--primary btn--block"
            >
              {t('btn_request_quote', 'Request Quick Quote')}
            </button>
            <a
              href={`https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20have%20an%20enquiry%20regarding%20stainless%20steel%20sanitary%20products.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--whatsapp btn--block mt-2"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MobileDrawer;

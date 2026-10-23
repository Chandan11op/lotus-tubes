import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CONFIG } from '../../data/siteData';

export const TopBar = () => {
  const { currentLang, setCurrentLang, activeLangConfig, languages, t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className="top-bar" aria-label="Quick contact and company information">
      <div className="site-container top-bar__inner">
        <div className="top-bar__left">
          <span className="top-bar__tagline">{t('top_tagline', 'Stainless Steel Sanitary Pipes, Fittings & Valves')}</span>
          <span className="top-bar__divider" aria-hidden="true">|</span>
          <span className="top-bar__locations">
            <i className="icon-pin" aria-hidden="true">📍</i>{' '}
            <span>{t('top_locations', 'Mumbai • Domestic & Global Supply')}</span>
          </span>
        </div>

        <div className="top-bar__right">
          <a href={`mailto:${CONFIG.primaryEmail}`} className="top-bar__link" title="Official Sales Email">
            <span className="top-bar__icon" aria-hidden="true">✉</span> {CONFIG.primaryEmail}
          </a>
          <span className="top-bar__divider" aria-hidden="true">|</span>
          <a href={`tel:${CONFIG.primaryPhone}`} className="top-bar__link" title="Call Lotus Tubes Desk">
            <span className="top-bar__icon" aria-hidden="true">📞</span> {CONFIG.primaryPhone}
          </a>
          <span className="top-bar__divider" aria-hidden="true">|</span>
          <a
            href={`https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20have%20an%20enquiry%20regarding%20stainless%20steel%20sanitary%20products.`}
            target="_blank"
            rel="noopener noreferrer"
            className="top-bar__whatsapp"
            title="Instant WhatsApp Assistance"
          >
            <span className="wa-icon" aria-hidden="true">🟢</span> <span>{t('top_whatsapp', 'WhatsApp Desk')}</span>
          </a>
          <span className="top-bar__divider" aria-hidden="true">|</span>

          {/* Enhanced Language Selector */}
          <div className="lang-selector" id="lang-selector" ref={dropdownRef}>
            <button
              type="button"
              className="lang-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              title="Select Preferred Language"
            >
              <span className="flag-icon">{activeLangConfig.flag}</span>{' '}
              <span>{activeLangConfig.short} ({activeLangConfig.nativeName})</span>{' '}
              <span className="arrow-down">▾</span>
            </button>
            {dropdownOpen && (
              <div className="lang-dropdown" role="menu" style={{ display: 'block' }}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    className={`lang-opt ${currentLang === lang.code ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentLang(lang.code);
                      setDropdownOpen(false);
                    }}
                    role="menuitem"
                  >
                    <span className="lang-opt__flag">{lang.flag}</span>
                    <span className="lang-opt__name">{lang.name}</span>
                    {currentLang === lang.code && <span className="lang-opt__check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default TopBar;

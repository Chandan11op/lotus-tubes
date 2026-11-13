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
    <aside className="w-full bg-surface-container-lowest border-b border-surface-container-high/50 text-on-surface-variant py-1.5 px-4 lg:px-8 relative z-50 font-label-code-micro text-[11px]" aria-label="Calibration and quick contact bar">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Active Calibration Telemetry */}
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-primary-container animate-pulse" aria-hidden="true"></span>
          <span className="text-on-surface uppercase tracking-wider font-semibold">
            {t('top_calibration', 'CALIBRATION ENGINE: ASTM A270 • DIN 11850 • ASME BPE ACTIVE')}
          </span>
          <span className="text-outline-variant hidden sm:inline">•</span>
          <span className="text-secondary hidden md:inline px-1.5 py-0.5 bg-surface-container-high rounded text-[10px]">
            SF4 / Ra ≤ 0.38µm
          </span>
        </div>

        {/* Right: Direct Channels, WhatsApp & Multilingual Switcher */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <a
            href={`mailto:${'sales' + '@' + 'lotustubes.com'}`}
            className="hover:text-primary transition-colors hidden md:inline-flex items-center gap-1"
            title="Official Sales Engineering Email"
          >
            <span>✉</span> <span>sales@lotustubes.com</span>
          </a>

          <a
            href={`tel:${CONFIG.primaryPhone}`}
            className="hover:text-primary transition-colors hidden lg:inline-flex items-center gap-1"
            title="Sales Desk Phone"
          >
            <span>📞</span> <span>{CONFIG.primaryPhone}</span>
          </a>

          <a
            href={`https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20have%20an%20enquiry%20regarding%20stainless%20steel%20sanitary%20products.`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-fixed hover:text-primary transition-colors inline-flex items-center gap-1 font-semibold"
            title="Instant WhatsApp Assistance"
          >
            <span className="text-[#25D366]">●</span> <span>{t('top_whatsapp', 'WhatsApp Desk')}</span>
          </a>

          <span className="text-surface-container-high hidden sm:inline">|</span>

          {/* Enhanced Language Selector */}
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer border border-outline-variant/30"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              title={t('select_preferred_lang', 'Select Preferred Language')}
            >
              <span>🌐</span>
              <span className="font-medium">{activeLangConfig.nativeName}</span>
              <span className="text-[9px] text-outline" aria-hidden="true">▼</span>
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-1 w-44 bg-surface-container-low border border-surface-container-high rounded-md shadow-2xl py-1 z-50 backdrop-blur-xl"
                role="menu"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-[11px] transition-colors ${
                      currentLang === lang.code
                        ? 'bg-primary-container text-on-primary-container font-semibold'
                        : 'text-on-surface hover:bg-surface-container-high'
                    }`}
                    onClick={() => {
                      setCurrentLang(lang.code);
                      setDropdownOpen(false);
                    }}
                    role="menuitem"
                  >
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] opacity-75">{lang.name}</span>
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
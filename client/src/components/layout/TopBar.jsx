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

  const rawPhone = (CONFIG.primaryPhone || '+91 98205 25200').replace(/\s+/g, '');

  return (
    <aside
      className="w-full bg-[#05143F] border-b border-white/10 text-slate-300 py-2 px-4 lg:px-8 relative z-50 font-sans text-xs"
      aria-label="Direct supply and quick contact bar"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Verified Technical Sourcing Scope */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 text-white font-medium text-[11px] border border-white/15">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D8CFF]" aria-hidden="true" />
            SS 304 &amp; SS 316L
          </span>
          <span className="text-slate-200 text-xs font-medium truncate">
            {t('top_tagline', 'Stainless Steel Sanitary Pipes, Fittings & Valves')}
          </span>
          <span className="text-slate-500 hidden lg:inline">•</span>
          <span className="text-slate-400 text-xs hidden lg:inline">
            {t('top_locations', 'Mumbai Sourcing Hub • Global Sourcing')}
          </span>
        </div>

        {/* Right: Direct Channels, WhatsApp Pill & Multilingual Switcher */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Sales Email */}
          <a
            href={`mailto:${CONFIG.primaryEmail || 'sales@lotustubes.com'}`}
            className="text-slate-300 hover:text-white transition-colors hidden md:inline-flex items-center gap-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#2D8CFF] rounded px-1 py-0.5"
            title="Official Sales Sourcing Email"
          >
            <svg
              className="w-3.5 h-3.5 text-[#2D8CFF] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span>{CONFIG.primaryEmail || 'sales@lotustubes.com'}</span>
          </a>

          {/* Direct Phone */}
          <a
            href={`tel:${rawPhone}`}
            className="text-slate-300 hover:text-white transition-colors hidden sm:inline-flex items-center gap-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#2D8CFF] rounded px-1 py-0.5"
            title="Sales Desk Direct Phone"
          >
            <svg
              className="w-3.5 h-3.5 text-[#2D8CFF] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>{CONFIG.primaryPhone || '+91 98205 25200'}</span>
          </a>

          {/* Professional WhatsApp Desk Action Pill */}
          <a
            href={`https://wa.me/${CONFIG.whatsappNumber || '919820525200'}?text=${encodeURIComponent(
              'Hello Lotus Tubes, I have an enquiry regarding stainless steel sanitary products.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 hover:border-[#25D366] text-white transition-all text-[11px] font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]/50"
            title="Instant WhatsApp Sourcing Desk"
          >
            <svg
              className="w-3.5 h-3.5 fill-[#25D366] shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.3C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.56 14.39C16.31 14.26 15.1 13.67 14.87 13.59C14.65 13.51 14.48 13.46 14.32 13.71C14.15 13.96 13.67 14.53 13.53 14.7C13.38 14.86 13.24 14.88 12.99 14.76C12.74 14.63 11.95 14.37 11.01 13.54C10.28 12.89 9.78 12.08 9.64 11.83C9.49 11.58 9.62 11.45 9.75 11.32C9.86 11.21 10 11.04 10.12 10.9C10.25 10.76 10.29 10.66 10.37 10.49C10.45 10.33 10.41 10.18 10.35 10.06C10.29 9.93 9.79 8.71 9.59 8.2C9.39 7.71 9.18 7.78 9.03 7.77C8.89 7.76 8.72 7.76 8.55 7.76C8.38 7.76 8.11 7.82 7.88 8.07C7.65 8.32 7 8.93 7 10.17C7 11.41 7.9 12.61 8.03 12.77C8.15 12.94 9.81 15.5 12.35 16.59C12.95 16.85 13.42 17.01 13.79 17.12C14.4 17.31 14.95 17.29 15.39 17.22C15.88 17.15 16.9 16.61 17.11 16.02C17.32 15.43 17.32 14.93 17.26 14.82C17.2 14.72 17.06 14.66 16.81 14.53L16.56 14.39Z" />
            </svg>
            <span>{t('top_whatsapp', 'WhatsApp Desk')}</span>
          </a>

          <span className="text-white/20 hidden sm:inline" aria-hidden="true">|</span>

          {/* Refined Language Selector */}
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer border border-white/15 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-[#2D8CFF]"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              title={t('select_preferred_lang', 'Select Preferred Language')}
            >
              <svg
                className="w-3.5 h-3.5 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{activeLangConfig.nativeName}</span>
              <span className="text-[8px] text-slate-400" aria-hidden="true">▼</span>
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-1.5 w-44 bg-[#071A52] border border-white/15 rounded-lg shadow-2xl py-1 z-50 backdrop-blur-xl"
                role="menu"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      currentLang === lang.code
                        ? 'bg-[#2D8CFF] text-white font-semibold'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
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

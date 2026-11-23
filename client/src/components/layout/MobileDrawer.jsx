import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CONFIG } from '../../data/siteData';
import { CATEGORIES_MANIFEST } from '../../data/categoriesManifest';

export const MobileDrawer = ({ isOpen, onClose, onOpenEnquiry }) => {
  const { currentLang, setCurrentLang, languages, t, localizePath } = useLanguage();
  const [openSection, setOpenSection] = useState('products');
  const rawPhone = (CONFIG.primaryPhone || '+91 9867304316').replace(/\s+/g, '');
  const waNumber = (CONFIG.whatsapp || '919867304316').replace(/\D/g, '');

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
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[1050] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="fixed top-0 right-0 bottom-0 w-full max-w-sm sm:max-w-md bg-white text-slate-800 z-[1060] shadow-2xl flex flex-col border-l border-slate-200 transition-transform duration-300 ease-out font-sans"
        id="mobile-drawer"
        aria-label="Mobile Navigation Menu"
      >
        {/* Drawer Header with Brand Logo */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
          <a href={localizePath('/', currentLang)} onClick={onClose} className="block" aria-label="Lotus Tubes - Return to Home">
            <img
              src="/banner-image-opt.png"
              alt="Lotus Tubes"
              className="h-9 w-auto object-contain"
              width="180"
              height="44"
            />
          </a>
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 hover:text-[#E93984] hover:bg-slate-200 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer border border-slate-200"
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* 12 Target Countries Language Switcher */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-[11px] uppercase tracking-wider text-[#0C225E] mb-2 flex items-center gap-1.5 font-bold">
              <span>🌐</span>
              <span>{t('select_preferred_country', 'Select Destination Country (12 Markets)')}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {languages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium text-left transition-all flex items-center justify-between cursor-pointer ${
                    currentLang === item.code
                      ? 'bg-[#2D8CFF] text-white shadow-sm font-semibold'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70'
                  }`}
                  onClick={() => {
                    setCurrentLang(item.code);
                    onClose();
                  }}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span>{item.flag}</span>
                    <span className="truncate">{item.name}</span>
                  </span>
                  {currentLang === item.code && <span className="text-[10px]">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Navigation Links: [Home, Products, About Us, News & Social, Contact Us] */}
          <div className="space-y-1 text-sm font-semibold text-slate-800">
            {/* 1. Home */}
            <a
              href={localizePath('/', currentLang)}
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-slate-50 hover:text-[#E93984] transition-colors"
            >
              <span>{t('nav_home', 'Home')}</span>
              <span className="text-slate-400 font-mono text-xs">›</span>
            </a>

            {/* 2. Products Accordion (11 Categories) */}
            <div>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'products' ? '' : 'products')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left hover:bg-slate-50 hover:text-[#E93984] transition-colors cursor-pointer"
              >
                <span>{t('nav_products', 'Products (11 Categories)')}</span>
                <span className="text-slate-400 text-xs font-mono">{openSection === 'products' ? '▲' : '▼'}</span>
              </button>

              {openSection === 'products' && (
                <div className="space-y-1 pl-3 pr-1 py-2 border-l-2 border-[#E93984]/30 ml-3.5 mt-1 max-h-60 overflow-y-auto">
                  <a
                    href={localizePath('/products', currentLang)}
                    onClick={onClose}
                    className="block px-3 py-1.5 rounded-lg text-xs font-bold text-[#E93984] bg-pink-50/70 hover:bg-pink-100/70 transition-colors"
                  >
                    ⚡ View Complete Catalogue →
                  </a>
                  {CATEGORIES_MANIFEST.map((cat, cIdx) => (
                    <a
                      key={cat.id}
                      href={localizePath(cat.viewAllLink, currentLang)}
                      onClick={onClose}
                      className="block px-3 py-1.5 rounded-lg text-xs text-slate-700 hover:text-[#E93984] hover:bg-slate-100 transition-colors"
                    >
                      <span className="text-slate-400 font-mono mr-1.5">{cIdx + 1}.</span>
                      {cat.title}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* 3. About Us */}
            <a
              href="#about"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-slate-50 hover:text-[#E93984] transition-colors"
            >
              <span>{t('nav_about', 'About Us')}</span>
              <span className="text-slate-400 font-mono text-xs">›</span>
            </a>

            {/* 4. News and Social Activities */}
            <a
              href="#news-social"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-slate-50 hover:text-[#E93984] transition-colors"
            >
              <span>{t('nav_news_social', 'News and Social Activities')}</span>
              <span className="text-slate-400 font-mono text-xs">›</span>
            </a>

            {/* 5. Contact Us */}
            <a
              href="#contact"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-slate-50 hover:text-[#E93984] transition-colors"
            >
              <span>{t('nav_contact', 'Contact Us')}</span>
              <span className="text-slate-400 font-mono text-xs">›</span>
            </a>
          </div>

          {/* Quick Specifications Callout */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 text-slate-600">
            <div className="font-bold text-[#0C225E]">Girgaon Mumbai Dispatch Desk</div>
            <div>GSTIN: <strong className="font-mono text-slate-800">{CONFIG.gstin}</strong></div>
            <div>IEC: <strong className="font-mono text-slate-800">{CONFIG.iec}</strong></div>
            <div className="text-emerald-700 font-medium text-[11px] pt-1">● Ready Stock Available for Immediate Dispatch</div>
          </div>
        </div>

        {/* Drawer Pinned Footer Action Bar */}
        <div className="p-4 border-t border-slate-200 bg-white space-y-2">
          <a
            href="#get-quotation"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#E93984] to-[#FC63A7] hover:from-[#D81B60] hover:to-[#E93984] text-white text-xs font-bold tracking-wide uppercase transition-all shadow-md cursor-pointer"
          >
            <span>Request Official Quotation</span>
            <span>→</span>
          </a>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${rawPhone}`}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
            >
              <span>📞 Direct Call</span>
            </a>
            <a
              href={`https://wa.me/${waNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20have%20an%20urgent%20sanitary%20product%20enquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <span>💬 WhatsApp</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MobileDrawer;

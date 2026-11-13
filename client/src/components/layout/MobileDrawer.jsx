import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CONFIG } from '../../data/siteData';

export const MobileDrawer = ({ isOpen, onClose, onOpenEnquiry }) => {
  const { currentLang, setCurrentLang, languages, t, localizePath } = useLanguage();
  const [openSection, setOpenSection] = useState('products');
  const rawPhone = (CONFIG.primaryPhone || '+91 98205 25200').replace(/\s+/g, '');

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
        className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-md z-[1050] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="fixed top-0 right-0 bottom-0 w-full max-w-sm sm:max-w-md bg-surface-container-low text-on-surface z-[1060] shadow-2xl flex flex-col border-l border-surface-container-high transition-transform duration-300 ease-out font-body-md"
        id="mobile-drawer"
        aria-label="Mobile Navigation Menu"
      >
        {/* Drawer Header with Brand Logo */}
        <div className="flex items-center justify-between p-4 border-b border-surface-container-high bg-surface-container-lowest/90">
          <a href={localizePath('/', currentLang)} onClick={onClose} className="block" aria-label="Lotus Tubes - Return to Home">
            <img
              src="/banner-image-opt.png"
              alt="Lotus Tubes"
              className="h-10 w-auto object-contain"
              width="180"
              height="44"
            />
          </a>
          <button
            type="button"
            className="w-10 h-10 rounded-lg bg-surface-container text-on-surface hover:text-primary hover:bg-surface-container-high flex items-center justify-center text-lg font-bold transition-colors cursor-pointer border border-surface-container-high/60"
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Language Selector */}
          <div className="bg-surface-container-lowest/90 p-3 rounded-xl border border-surface-container-high">
            <div className="text-[11px] font-label-code-micro uppercase tracking-wider text-primary-fixed-dim mb-2 flex items-center gap-1.5 font-bold">
              <span>🌐</span>
              <span>{t('select_preferred_lang', 'Select Language')}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  className={`py-2 px-2.5 rounded-lg text-xs font-medium text-left transition-all flex items-center justify-between cursor-pointer ${
                    currentLang === lang.code
                      ? 'bg-primary-container text-on-primary-container shadow-sm font-semibold'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                  onClick={() => {
                    setCurrentLang(lang.code);
                    onClose();
                  }}
                >
                  <span>{lang.nativeName}</span>
                  {currentLang === lang.code && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Primary Navigation */}
          <div className="space-y-1 font-label-technical text-label-technical uppercase tracking-wider">
            <a
              href={localizePath('/', currentLang)}
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors"
            >
              <span>{t('nav_home', 'Home')}</span>
              <span className="text-on-surface-variant font-mono text-xs">›</span>
            </a>
            <a
              href={localizePath('/industries', currentLang)}
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors"
            >
              <span>{t('nav_industries', 'Industries')}</span>
              <span className="text-on-surface-variant font-mono text-xs">›</span>
            </a>
            <a
              href={localizePath('/about', currentLang)}
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors"
            >
              <span>{t('nav_about', 'About Us & Leadership')}</span>
              <span className="text-on-surface-variant font-mono text-xs">›</span>
            </a>
            <a
              href={localizePath('/quality', currentLang)}
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors"
            >
              <span>{t('nav_quality', 'Quality & Standards')}</span>
              <span className="text-on-surface-variant font-mono text-xs">›</span>
            </a>
            <a
              href={localizePath('/contact', currentLang)}
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors"
            >
              <span>{t('nav_contact', 'Contact Sales Desk')}</span>
              <span className="text-on-surface-variant font-mono text-xs">›</span>
            </a>
          </div>

          {/* Collapsible Product Catalog */}
          <div className="border-t border-surface-container-high pt-4">
            <button
              type="button"
              onClick={() => setOpenSection(openSection === 'products' ? '' : 'products')}
              className="w-full flex items-center justify-between text-xs font-label-technical uppercase tracking-wider text-primary mb-2 py-1 cursor-pointer font-bold"
            >
              <span>Sanitary Products Catalog</span>
              <span className="text-on-surface-variant text-sm">{openSection === 'products' ? '▲' : '▼'}</span>
            </button>

            {openSection === 'products' && (
              <div className="space-y-1 pl-2 border-l-2 border-surface-container-high mt-2 font-body-sm text-[13px]">
                <a
                  href={localizePath('/products', currentLang)}
                  onClick={onClose}
                  className="block px-3 py-2 rounded text-xs font-semibold text-primary-container hover:bg-surface-container-high transition-colors"
                >
                  ⚡ {t('btn_view_all', 'View Complete 30+ Catalogue')}
                </a>
                <a href={localizePath('/category/sanitary-pipes', currentLang)} onClick={onClose} className="block px-3 py-1.5 rounded text-on-surface hover:bg-surface-container-high hover:text-primary">
                  Sanitary Pipes &amp; Tubes (A270 / BPE)
                </a>
                <a href={localizePath('/category/sanitary-fittings', currentLang)} onClick={onClose} className="block px-3 py-1.5 rounded text-on-surface hover:bg-surface-container-high hover:text-primary">
                  Sanitary Bends, Tees &amp; Reducers
                </a>
                <a href={localizePath('/category/tri-clamp', currentLang)} onClick={onClose} className="block px-3 py-1.5 rounded text-on-surface hover:bg-surface-container-high hover:text-primary">
                  Tri-Clamp Ferrules, Clamps &amp; Blanks
                </a>
                <a href={localizePath('/category/gaskets', currentLang)} onClick={onClose} className="block px-3 py-1.5 rounded text-on-surface hover:bg-surface-container-high hover:text-primary">
                  USP VI &amp; FDA Sanitary Gaskets
                </a>
                <a href={localizePath('/category/manual-valves', currentLang)} onClick={onClose} className="block px-3 py-1.5 rounded text-on-surface hover:bg-surface-container-high hover:text-primary">
                  Sanitary Butterfly &amp; Ball Valves
                </a>
                <a href={localizePath('/category/pneumatic-valves', currentLang)} onClick={onClose} className="block px-3 py-1.5 rounded text-on-surface hover:bg-surface-container-high hover:text-primary">
                  Pneumatic Diaphragm &amp; Control Valves
                </a>
                <a href={localizePath('/category/tank-cleaning', currentLang)} onClick={onClose} className="block px-3 py-1.5 rounded text-on-surface hover:bg-surface-container-high hover:text-primary">
                  Rotary CIP Tank Spray Balls
                </a>
              </div>
            )}
          </div>

          {/* Quick Specifications Callout */}
          <div className="p-3 rounded-xl bg-surface-container-lowest/80 border border-surface-container-high font-label-code-micro text-[11px] space-y-1">
            <div className="font-semibold text-primary">Girgaon Mumbai Dispatch Desk</div>
            <div className="text-on-surface-variant">GSTIN: {CONFIG.gstin}</div>
            <div className="text-on-surface-variant">IEC: {CONFIG.iec}</div>
            <div className="text-primary-container font-mono text-[10px] pt-1">● Ready Stock Available for Immediate Dispatch</div>
          </div>
        </div>

        {/* Drawer Pinned Footer Action Bar */}
        <div className="p-4 border-t border-surface-container-high bg-surface-container-lowest space-y-2">
          <a
            href="#boq-request"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary-container hover:bg-primary-fixed text-on-primary-container font-headline-sm text-headline-sm font-bold tracking-wide uppercase transition-colors shadow-lg"
          >
            <span>Request Official BOQ Quote</span>
            <span>→</span>
          </a>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${rawPhone}`}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors border border-surface-container-high/60"
            >
              <span>📞 Direct Call</span>
            </a>
            <a
              href={`https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20have%20an%20urgent%20sanitary%20product%20enquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#25D366] hover:bg-[#20BA5A] text-black text-xs font-bold transition-colors"
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
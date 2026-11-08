import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CONFIG } from '../../data/siteData';

export const MobileDrawer = ({ isOpen, onClose, onOpenEnquiry }) => {
  const { currentLang, setCurrentLang, languages, t } = useLanguage();
  const [openSection, setOpenSection] = useState('products');
  const rawPhone = (CONFIG.primaryPhone || '+91 98205 25200').replace(/\s+/g, '');

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
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-[1050] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="fixed top-0 right-0 bottom-0 w-full max-w-sm sm:max-w-md bg-slate-900 text-slate-100 z-[1060] shadow-2xl flex flex-col border-l border-slate-800 transition-transform duration-300 ease-out"
        id="mobile-drawer"
        aria-label="Mobile Navigation Menu"
      >
        {/* Drawer Header with Prominent Logo */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
          <a href="/" onClick={onClose} className="block" aria-label="Lotus Tubes - Return to Home">
            <img
              src="/banner-image.png"
              alt="Lotus Tubes"
              className="h-11 w-auto object-contain"
              width="180"
              height="48"
            />
          </a>
          <button
            type="button"
            className="w-10 h-10 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center text-xl font-bold transition-colors"
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Language Selector */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <span>🌐</span>
              <span>{t('select_preferred_lang', 'Select Language')}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  className={`py-2 px-2.5 rounded-lg text-xs font-medium text-left transition-all flex items-center justify-between ${
                    currentLang === lang.code
                      ? 'bg-sky-600 text-white shadow-sm font-semibold'
                      : 'bg-slate-850 hover:bg-slate-800 text-slate-300'
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

          {/* Quick Primary Links */}
          <div className="space-y-1">
            <a
              href="/"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <span>{t('nav_home', 'Home')}</span>
              <span className="text-slate-500 font-mono text-xs">›</span>
            </a>
            <a
              href="/about"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <span>{t('nav_about', 'About Us & Mumbai Hub')}</span>
              <span className="text-slate-500 font-mono text-xs">›</span>
            </a>
            <a
              href="/industries"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <span>{t('nav_industries', 'Industries')}</span>
              <span className="text-slate-500 font-mono text-xs">›</span>
            </a>
            <a
              href="/contact"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <span>{t('nav_contact', 'Contact Sales & Location')}</span>
              <span className="text-slate-500 font-mono text-xs">›</span>
            </a>
          </div>

          {/* Collapsible Product Catalog */}
          <div className="border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={() => setOpenSection(openSection === 'products' ? '' : 'products')}
              className="w-full flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-sky-400 mb-2 py-1"
            >
              <span>Sanitary Products Catalog</span>
              <span className="text-slate-400 text-sm">{openSection === 'products' ? '▲' : '▼'}</span>
            </button>

            {openSection === 'products' && (
              <div className="space-y-1 pl-2 border-l-2 border-slate-800 mt-2">
                <a
                  href="/products"
                  onClick={onClose}
                  className="block px-3 py-2 rounded text-xs font-semibold text-sky-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  ⚡ {t('btn_view_all', 'View Complete 30+ Catalogue')}
                </a>
                <a href="/category/sanitary-pipes" onClick={onClose} className="block px-3 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white">
                  Sanitary Pipes &amp; Tubes (A270 / BPE)
                </a>
                <a href="/category/sanitary-fittings" onClick={onClose} className="block px-3 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white">
                  Sanitary Bends, Tees &amp; Reducers
                </a>
                <a href="/category/tri-clamp" onClick={onClose} className="block px-3 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white">
                  Tri-Clamp Ferrules, Clamps &amp; Blanks
                </a>
                <a href="/category/gaskets" onClick={onClose} className="block px-3 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white">
                  USP VI &amp; FDA Sanitary Gaskets
                </a>
                <a href="/category/manual-valves" onClick={onClose} className="block px-3 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white">
                  Sanitary Butterfly &amp; Ball Valves
                </a>
                <a href="/category/pneumatic-valves" onClick={onClose} className="block px-3 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white">
                  Pneumatic Diaphragm &amp; Control Valves
                </a>
                <a href="/category/tank-cleaning" onClick={onClose} className="block px-3 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white">
                  Rotary CIP Tank Spray Balls
                </a>
                <a href="/category/custom-assemblies" onClick={onClose} className="block px-3 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white">
                  Custom Spools &amp; Skid Manifolds
                </a>
              </div>
            )}
          </div>

          {/* Quick Specifications Callout */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
            <div className="font-semibold text-slate-200">Girgaon Mumbai Dispatch Desk</div>
            <div className="text-slate-400">GSTIN: {CONFIG.gstin}</div>
            <div className="text-slate-400">IEC: {CONFIG.iec}</div>
            <div className="text-emerald-400 font-mono text-[11px] pt-1">● Ready Stock Available for Immediate Dispatch</div>
          </div>
        </div>

        {/* Drawer Pinned Footer Action Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 space-y-2">
          <a
            href="/quote"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm tracking-wide uppercase transition-colors shadow-lg shadow-sky-950"
          >
            <span>Request Official BOQ Quote</span>
            <span>&rarr;</span>
          </a>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${rawPhone}`}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <span>📞 Direct Call</span>
            </a>
            <a
              href={`https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20have%20an%20urgent%20sanitary%20product%20enquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
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

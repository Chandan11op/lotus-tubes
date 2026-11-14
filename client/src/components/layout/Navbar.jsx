import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ onOpenSearch, onToggleMobile }) => {
  const { t, currentLang, localizePath } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.6)] border-b border-surface-container-high/80 py-2.5'
          : 'bg-surface-container-lowest/85 backdrop-blur-md border-b border-surface-container-high/40 py-3.5'
      }`}
      id="site-header"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo & Wordmark */}
        <a
          href={localizePath('/', currentLang)}
          className="flex items-center gap-3 shrink-0 group focus:outline-none"
          aria-label="Lotus Tubes - Return to Home"
        >
          <div className="flex items-center">
            <img
              src="/banner-image-opt.png"
              srcSet="/banner-image-opt.png 1x, /banner-image.png 2x"
              alt="Lotus Tubes - Stainless Steel Sanitary Pipes, Fittings & Valves"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              width="210"
              height="50"
            />
          </div>
          <span className="sr-only">Lotus Tubes</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold tracking-wider font-sans" aria-label="Primary Navigation">
          <a
            href={localizePath('/', currentLang)}
            className="px-3 py-1.5 rounded text-on-surface hover:text-primary hover:bg-surface-container-high transition-colors uppercase tracking-wider"
          >
            {t('nav_home', 'Home')}
          </a>

          {/* Products Mega-Menu Trigger */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('products')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <a
              href={localizePath('/products', currentLang)}
              className="px-3 py-1.5 rounded text-on-surface hover:text-primary hover:bg-surface-container-high transition-colors uppercase tracking-wider inline-flex items-center gap-1.5"
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'products'}
            >
              <span>{t('nav_products', 'Products')}</span>
              <svg className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'products' ? 'rotate-180 text-primary-container' : 'text-on-surface-variant'}`} viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            {/* Glassmorphic Mega Menu */}
            {activeDropdown === 'products' && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[720px] transition-all"
                role="region"
                aria-label="Product Catalogue Categories"
              >
                <div className="bg-surface-container-low/95 backdrop-blur-2xl border border-surface-container-high rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-6">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-container-high/60 font-sans">
                    <span className="text-xs text-primary uppercase tracking-widest font-semibold">
                      ENGINEERED FOR ASEPTIC FLUID HANDLING
                    </span>
                    <a
                      href={localizePath('/products', currentLang)}
                      className="text-xs text-primary-fixed-dim hover:text-primary transition-colors flex items-center gap-1 font-medium"
                    >
                      <span>BROWSE FULL CATALOGUE</span>
                      <span>→</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    {/* Col 1 */}
                    <div className="flex flex-col gap-2">
                      <span className="font-headline-sm text-[14px] text-primary font-semibold flex items-center gap-1.5">
                        <span className="text-primary-container">■</span> Sanitary Pipes & Tubes
                      </span>
                      <div className="flex flex-col gap-1.5 font-body-sm text-[13px] text-on-surface-variant">
                        <a href={localizePath('/product/ss-316l-ep-pipe', currentLang)} className="hover:text-primary transition-colors">
                          SS 316L EP Sanitary Pipe
                        </a>
                        <a href={localizePath('/product/ss-304-ep-pipe', currentLang)} className="hover:text-primary transition-colors">
                          SS 304 EP Sanitary Pipe
                        </a>
                        <a href={localizePath('/product/ss-316l-mp-pipe', currentLang)} className="hover:text-primary transition-colors">
                          SS 316L MP Sanitary Pipe
                        </a>
                        <a href={localizePath('/category/sanitary-pipes', currentLang)} className="text-primary-fixed-dim text-[12px] pt-1 hover:underline">
                          View All Pipes & Tubes →
                        </a>
                      </div>
                    </div>

                    {/* Col 2 */}
                    <div className="flex flex-col gap-2">
                      <span className="font-headline-sm text-[14px] text-primary font-semibold flex items-center gap-1.5">
                        <span className="text-primary-container">■</span> Fittings & Tri-Clamp
                      </span>
                      <div className="flex flex-col gap-1.5 font-body-sm text-[13px] text-on-surface-variant">
                        <a href={localizePath('/product/ss-sanitary-90-bend', currentLang)} className="hover:text-primary transition-colors">
                          SS Sanitary 90° Bend
                        </a>
                        <a href={localizePath('/product/ss-sanitary-equal-tee', currentLang)} className="hover:text-primary transition-colors">
                          SS Sanitary Equal Tee
                        </a>
                        <a href={localizePath('/product/ss-tri-clamp-ferrule', currentLang)} className="hover:text-primary transition-colors">
                          Tri-Clamp Ferrules & Clamps
                        </a>
                        <a href={localizePath('/category/sanitary-fittings', currentLang)} className="text-primary-fixed-dim text-[12px] pt-1 hover:underline">
                          View All Fittings →
                        </a>
                      </div>
                    </div>

                    {/* Col 3 */}
                    <div className="flex flex-col gap-2">
                      <span className="font-headline-sm text-[14px] text-primary font-semibold flex items-center gap-1.5">
                        <span className="text-secondary">■</span> Hygienic Valves
                      </span>
                      <div className="flex flex-col gap-1.5 font-body-sm text-[13px] text-on-surface-variant">
                        <a href={localizePath('/product/ss-sanitary-butterfly-valve', currentLang)} className="hover:text-secondary transition-colors">
                          Sanitary Butterfly Valves
                        </a>
                        <a href={localizePath('/product/ss-316l-diaphragm-valve', currentLang)} className="hover:text-secondary transition-colors">
                          Aseptic Diaphragm Valves
                        </a>
                        <a href={localizePath('/product/pneumatic-sanitary-ball-valve', currentLang)} className="hover:text-secondary transition-colors">
                          Pneumatic Actuated Valves
                        </a>
                        <a href={localizePath('/category/manual-valves', currentLang)} className="text-secondary text-[12px] pt-1 hover:underline">
                          View All Valves →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <a
            href={localizePath('/industries', currentLang)}
            className="px-3 py-1.5 rounded text-on-surface hover:text-primary hover:bg-surface-container-high transition-colors uppercase tracking-wider"
          >
            {t('nav_industries', 'Industries')}
          </a>

          <a
            href={localizePath('/about', currentLang)}
            className="px-3 py-1.5 rounded text-on-surface hover:text-primary hover:bg-surface-container-high transition-colors uppercase tracking-wider"
          >
            {t('nav_about', 'About Us')}
          </a>

          <a
            href={localizePath('/quality', currentLang)}
            className="px-3 py-1.5 rounded text-on-surface hover:text-primary hover:bg-surface-container-high transition-colors uppercase tracking-wider"
          >
            {t('nav_quality', 'Quality & Specs')}
          </a>

          <a
            href={localizePath('/contact', currentLang)}
            className="px-3 py-1.5 rounded text-on-surface hover:text-primary hover:bg-surface-container-high transition-colors uppercase tracking-wider"
          >
            {t('nav_contact', 'Contact')}
          </a>
        </nav>

        {/* Action Controls: Live Search + CRM Dock Button + Mobile Hamburger */}
        <div className="flex items-center gap-2.5">
          {/* Real-time Search Trigger */}
          <button
            type="button"
            className="w-10 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface hover:text-primary border border-surface-container-high/60 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            onClick={(e) => {
              e.preventDefault();
              if (typeof onOpenSearch === 'function') onOpenSearch();
            }}
            title="Search products, sizes, ASTM standards"
            aria-label="Search product catalogue"
            id="nav-search-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* CRM / User Account Trigger */}
          <a
            href={
              isAuthenticated
                ? user?.role === 'staff' || user?.role === 'admin'
                  ? '#crm/dashboard'
                  : '#account'
                : '#login'
            }
            className="h-10 px-3.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface hover:text-primary border border-surface-container-high/60 flex items-center gap-2 transition-all font-sans text-xs uppercase tracking-wider shadow-sm"
            title={isAuthenticated ? `Signed in as ${user?.name}` : 'Staff & Client CRM Portal'}
            aria-label="CRM & Account Portal"
          >
            <div className="relative">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
              </svg>
              {isAuthenticated && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              )}
            </div>
            <span className="hidden sm:inline font-semibold">
              {isAuthenticated ? (user?.role === 'staff' || user?.role === 'admin' ? 'CRM' : 'Account') : 'Portal'}
            </span>
          </a>

          {/* Mobile Navigation Drawer Trigger */}
          <button
            type="button"
            className="xl:hidden w-10 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface border border-surface-container-high/60 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
            onClick={onToggleMobile}
            aria-label="Toggle Navigation Drawer"
          >
            <span className="w-5 h-0.5 bg-current rounded-full" />
            <span className="w-5 h-0.5 bg-current rounded-full" />
            <span className="w-5 h-0.5 bg-current rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
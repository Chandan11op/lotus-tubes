import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES_MANIFEST } from '../../data/categoriesManifest';

export const Navbar = ({ onOpenSearch, onToggleMobile }) => {
  const { t, currentLang, localizePath } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(CATEGORIES_MANIFEST[0].id);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeCategory =
    CATEGORIES_MANIFEST.find((cat) => cat.id === hoveredCategoryId) || CATEGORIES_MANIFEST[0];

  return (
    <header
      className={`sticky top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-md shadow-md border-b border-slate-200/80 py-2.5'
          : 'bg-white border-b border-slate-100 py-3.5'
      }`}
      id="site-header"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
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

        {/* Primary Desktop Navigation: [Home, Products, About Us, News & Social, Contact Us] */}
        <nav className="hidden xl:flex items-center gap-1.5 text-sm font-semibold tracking-normal text-slate-700" aria-label="Primary Navigation">
          {/* 1. Home */}
          <a
            href={localizePath('/', currentLang)}
            className="px-3.5 py-1.5 rounded-lg text-slate-800 hover:text-[#E93984] hover:bg-slate-50 transition-colors"
          >
            {t('nav_home', 'Home')}
          </a>

          {/* 2. Products (Interactive Mega-Menu with 11 Categories & Real Photos on Hover) */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('products')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <a
              href={localizePath('/products', currentLang)}
              className={`px-3.5 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                activeDropdown === 'products'
                  ? 'text-[#E93984] bg-pink-50/70'
                  : 'text-slate-800 hover:text-[#E93984] hover:bg-slate-50'
              }`}
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'products'}
            >
              <span>{t('nav_products', 'Products')}</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  activeDropdown === 'products' ? 'rotate-180 text-[#E93984]' : 'text-slate-400'
                }`}
                viewBox="0 0 10 6"
                fill="none"
              >
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            {/* Interactive Mega Menu Overlay */}
            {activeDropdown === 'products' && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[920px] transition-all z-50"
                role="region"
                aria-label="Product Catalogue Categories"
              >
                <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden divide-y divide-slate-100 font-sans">
                  {/* Top Header of Mega Menu */}
                  <div className="px-6 py-3.5 bg-gradient-to-r from-[#061A5A] to-[#0D225E] text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E93984]" />
                      <span className="text-xs uppercase font-extrabold tracking-wider">
                        11 PRODUCT CATEGORIES &amp; REAL SOURCING CATALOGUE
                      </span>
                    </div>
                    <a
                      href={localizePath('/products', currentLang)}
                      className="text-xs text-[#FC63A7] hover:text-white font-bold transition-colors flex items-center gap-1"
                    >
                      <span>BROWSE COMPLETE CATALOGUE</span>
                      <span>→</span>
                    </a>
                  </div>

                  {/* 2-Column Split: Left 11 Categories List | Right Real Products & Images */}
                  <div className="grid grid-cols-12 min-h-[440px]">
                    {/* Left: 11 Categories Sidebar */}
                    <div className="col-span-4 bg-slate-50/80 border-r border-slate-200/80 p-2.5 space-y-1 overflow-y-auto max-h-[480px]">
                      {CATEGORIES_MANIFEST.map((cat, idx) => {
                        const isSelected = cat.id === activeCategory.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onMouseEnter={() => setHoveredCategoryId(cat.id)}
                            onFocus={() => setHoveredCategoryId(cat.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer group ${
                              isSelected
                                ? 'bg-white text-[#E93984] font-bold shadow-sm border border-pink-200/80'
                                : 'text-slate-700 hover:bg-white/80 hover:text-slate-900 font-medium'
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                                  isSelected
                                    ? 'bg-[#E93984] text-white font-bold'
                                    : 'bg-slate-200 text-slate-600 group-hover:bg-slate-300'
                                }`}
                              >
                                {idx + 1}
                              </span>
                              <span className="truncate">{cat.title}</span>
                            </span>
                            <span
                              className={`text-[10px] shrink-0 font-mono transition-transform ${
                                isSelected ? 'text-[#E93984] translate-x-0.5' : 'text-slate-400 group-hover:text-slate-600'
                              }`}
                            >
                              ›
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right: Active Category Showcase with Real Photographs */}
                    <div className="col-span-8 p-5 flex flex-col justify-between max-h-[480px] overflow-y-auto">
                      <div>
                        {/* Category Heading & Meta */}
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                          <div>
                            <div className="text-[11px] font-mono uppercase tracking-wider text-[#E93984] font-bold">
                              {activeCategory.countBadge} Available
                            </div>
                            <h3 className="text-base font-extrabold text-[#0C225E] mt-0.5">
                              {activeCategory.title}
                            </h3>
                          </div>
                          <a
                            href={localizePath(activeCategory.viewAllLink, currentLang)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 hover:bg-[#E93984] hover:text-white text-slate-700 text-xs font-semibold transition-all"
                          >
                            <span>Explore Category</span>
                            <span className="text-[10px]">↗</span>
                          </a>
                        </div>

                        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                          {activeCategory.description}
                        </p>

                        {/* Real Product Cards Grid */}
                        <div className="grid grid-cols-2 gap-2.5">
                          {activeCategory.products.map((prod, pIdx) => (
                            <a
                              key={pIdx}
                              href={localizePath(prod.link, currentLang)}
                              className="group flex items-center gap-3 p-2 rounded-xl border border-slate-100 bg-white hover:border-pink-200 hover:shadow-md transition-all"
                            >
                              {/* Real Product Photo Thumbnail */}
                              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-lg bg-slate-50 border border-slate-200/70 p-1 flex items-center justify-center shrink-0 overflow-hidden group-hover:border-[#E93984]/50">
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                                  loading="lazy"
                                  width="56"
                                  height="56"
                                />
                              </div>

                              {/* Title & Spec */}
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#E93984] truncate transition-colors leading-snug">
                                  {prod.name}
                                </h4>
                                <p className="text-[11px] text-slate-500 truncate mt-0.5 font-normal">
                                  {prod.spec}
                                </p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Footer Notice */}
                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>SS 304 &amp; SS 316L • Mill Test Certified (EN 10204 3.1)</span>
                        <a
                          href="#get-quotation"
                          className="text-[#E93984] hover:underline font-bold"
                        >
                          Request Custom Quotation →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. About Us */}
          <a
            href={localizePath('/about', currentLang)}
            className="px-3.5 py-1.5 rounded-lg text-slate-800 hover:text-[#E93984] hover:bg-slate-50 transition-colors"
          >
            {t('nav_about', 'About Us')}
          </a>

          {/* 4. News & Social */}
          <a
            href={localizePath('/resources', currentLang)}
            className="px-3.5 py-1.5 rounded-lg text-slate-800 hover:text-[#E93984] hover:bg-slate-50 transition-colors"
          >
            {t('nav_news_social', 'News & Social')}
          </a>

          {/* 5. Contact Us */}
          <a
            href={localizePath('/contact', currentLang)}
            className="px-3.5 py-1.5 rounded-lg text-slate-800 hover:text-[#E93984] hover:bg-slate-50 transition-colors"
          >
            {t('nav_contact', 'Contact Us')}
          </a>
        </nav>

        {/* Action Controls: Expanded Search Bar + CRM Profile Button + Mobile Drawer Toggle */}
        <div className="flex items-center gap-3">
          {/* Expanded Search Bar */}
          <button
            type="button"
            className="w-36 sm:w-56 md:w-64 h-9 px-3 rounded-full bg-slate-100 hover:bg-slate-200/90 text-slate-500 hover:text-slate-800 flex items-center justify-between text-xs transition-all border border-slate-200/80 cursor-pointer shadow-inner group"
            onClick={(e) => {
              e.preventDefault();
              if (typeof onOpenSearch === 'function') onOpenSearch();
            }}
            title="Search products, sizes, ASTM standards..."
            aria-label="Search product catalogue"
            id="nav-search-btn"
          >
            <span className="flex items-center gap-2 truncate">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                className="text-slate-400 group-hover:text-[#E93984] shrink-0 transition-colors"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="truncate text-slate-500 text-xs hidden sm:inline">Search products, sizes...</span>
              <span className="truncate text-slate-500 text-xs sm:hidden">Search...</span>
            </span>
            <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Clean User Profile Button (Icon Only — Zero Text Like CRM or Portal) */}
          <a
            href={
              isAuthenticated
                ? user?.role === 'staff' || user?.role === 'admin'
                  ? '#crm/dashboard'
                  : '#account'
                : '#login'
            }
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#0C225E] flex items-center justify-center transition-all border border-slate-200/70 cursor-pointer shrink-0"
            title={isAuthenticated ? `User Account: ${user?.name}` : 'User Profile & Sign In'}
            aria-label="User Profile"
            id="nav-user-profile-btn"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </a>

          {/* Mobile Navigation Drawer Trigger */}
          <button
            type="button"
            className="xl:hidden w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
            onClick={onToggleMobile}
            aria-label="Toggle Navigation Drawer"
          >
            <span className="w-4 h-0.5 bg-current rounded-full" />
            <span className="w-4 h-0.5 bg-current rounded-full" />
            <span className="w-4 h-0.5 bg-current rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES_MANIFEST } from '../../data/categoriesManifest';
import { PRODUCTS } from '../../data/siteData';

export const Navbar = ({ onToggleMobile }) => {
  const { t, currentLang, localizePath } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  // Products Mega Dropdown State
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const productsTimeoutRef = useRef(null);

  // Direct Inline Search Bar State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products for inline live search
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter((p) => {
      const name = (p.name || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const std = (p.standard || '').toLowerCase();
      const mat = (p.material || '').toLowerCase();
      const desc = (p.shortDescription || '').toLowerCase();
      return name.includes(q) || cat.includes(q) || std.includes(q) || mat.includes(q) || desc.includes(q);
    }).slice(0, 5);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setIsSearchFocused(false);
    const targetUrl = localizePath(`/products?search=${encodeURIComponent(q)}`, currentLang);
    if (window.history && window.history.pushState) {
      window.history.pushState({}, '', targetUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      window.location.href = targetUrl;
    }
  };

  const handleProductHoverOpen = () => {
    if (productsTimeoutRef.current) clearTimeout(productsTimeoutRef.current);
    setIsProductsOpen(true);
  };

  const handleProductHoverClose = () => {
    productsTimeoutRef.current = setTimeout(() => {
      setIsProductsOpen(false);
      setHoveredCategoryId(null);
    }, 150);
  };

  const activeCategory = hoveredCategoryId
    ? CATEGORIES_MANIFEST.find((cat) => cat.id === hoveredCategoryId)
    : null;

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
        {/* 1. Brand Logo (Left) */}
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

        {/* 2. Desktop Navigation (Center): [Home, Products, About Us, News and Social Activities, Contact Us] */}
        <nav
          className="hidden xl:flex items-center justify-center flex-1 mx-4 gap-1 text-sm font-semibold tracking-normal text-slate-700"
          aria-label="Primary Navigation"
        >
          {/* Home */}
          <a
            href={localizePath('/', currentLang)}
            className="px-3.5 py-1.5 rounded-lg text-slate-800 hover:text-[#E93984] hover:bg-slate-50 transition-colors"
          >
            {t('nav_home', 'Home')}
          </a>

          {/* Products (Interactive Cascading Flyout Menu: Categories on Left, Products on Right) */}
          <div
            className="relative"
            onMouseEnter={handleProductHoverOpen}
            onMouseLeave={handleProductHoverClose}
          >
            <a
              href={localizePath('/products', currentLang)}
              onClick={(e) => {
                // If user clicks, toggle dropdown
                if (window.innerWidth >= 1280) {
                  e.preventDefault();
                  setIsProductsOpen((prev) => !prev);
                }
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                isProductsOpen
                  ? 'text-[#E93984] bg-pink-50/70 font-bold'
                  : 'text-slate-800 hover:text-[#E93984] hover:bg-slate-50'
              }`}
              aria-haspopup="true"
              aria-expanded={isProductsOpen}
            >
              <span>{t('nav_products', 'Products')}</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isProductsOpen ? 'rotate-180 text-[#E93984]' : 'text-slate-400'
                }`}
                viewBox="0 0 10 6"
                fill="none"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            {/* Cascading Flyout Menu — Shows ONLY categories until a category is hovered/clicked */}
            {isProductsOpen && (
              <div
                className={`absolute top-full left-0 pt-2 transition-all duration-200 z-50 animate-fadeIn ${
                  hoveredCategoryId ? 'w-[680px]' : 'w-[300px]'
                } max-w-[95vw]`}
                role="region"
                aria-label="Product Catalogue Categories"
              >
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden font-sans border-t-2 border-t-[#E93984]">
                  {/* Subtle Sub-header */}
                  <div className="px-4 py-2.5 bg-slate-900 text-white flex items-center justify-between text-xs">
                    <span className="font-bold tracking-wider uppercase text-[11px] text-slate-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E93984]" />
                      11 Product Categories
                    </span>
                    <a
                      href={localizePath('/products', currentLang)}
                      onClick={() => setIsProductsOpen(false)}
                      className="text-[#FC63A7] hover:text-white font-semibold text-[11px] flex items-center gap-1 transition-colors"
                    >
                      <span>Catalogue</span>
                      <span>→</span>
                    </a>
                  </div>

                  {/* Layout: Single Column (Categories Only) OR Two Columns (Categories + Products when category hovered) */}
                  <div className="flex min-h-[380px] max-h-[460px]">
                    {/* Categories Column */}
                    <div
                      className={`${
                        hoveredCategoryId ? 'w-[280px] border-r border-slate-200/80' : 'w-full'
                      } bg-slate-50/90 p-2 space-y-0.5 overflow-y-auto shrink-0 transition-all`}
                    >
                      {CATEGORIES_MANIFEST.map((cat, idx) => {
                        const isSelected = cat.id === hoveredCategoryId;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onMouseEnter={() => setHoveredCategoryId(cat.id)}
                            onClick={() => {
                              setHoveredCategoryId(cat.id);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer group ${
                              isSelected
                                ? 'bg-white text-[#E93984] font-bold shadow-sm border border-pink-200/80'
                                : 'text-slate-700 hover:bg-white/80 hover:text-slate-900 font-medium'
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <span
                                className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono shrink-0 ${
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
                              className={`text-[11px] font-mono transition-transform ${
                                isSelected
                                  ? 'text-[#E93984] translate-x-0.5 font-bold'
                                  : 'text-slate-400 group-hover:text-slate-600'
                              }`}
                            >
                              ›
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right: Products of the Currently Hovered Category ONLY when a category is hovered */}
                    {hoveredCategoryId && activeCategory && (
                      <div className="flex-1 p-4 bg-white flex flex-col justify-between overflow-y-auto animate-fadeIn">
                        <div>
                          {/* Category Title & Quick Link */}
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                            <div>
                              <span className="text-[10px] uppercase font-mono font-bold text-[#E93984]">
                                {activeCategory.countBadge}
                              </span>
                              <h3 className="text-sm font-extrabold text-[#0C225E] leading-tight">
                                {activeCategory.title}
                              </h3>
                            </div>
                            <a
                              href={localizePath(activeCategory.viewAllLink, currentLang)}
                              onClick={() => setIsProductsOpen(false)}
                              className="text-[11px] font-semibold text-[#0C225E] hover:text-[#E93984] transition-colors"
                            >
                              View All →
                            </a>
                          </div>

                          {/* Category Products List */}
                          <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
                            {activeCategory.products.map((prod, pIdx) => (
                              <a
                                key={pIdx}
                                href={localizePath(prod.link, currentLang)}
                                onClick={() => setIsProductsOpen(false)}
                                className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                              >
                                {/* Real Product Thumbnail Image */}
                                <div className="w-10 h-10 rounded-md bg-slate-50 border border-slate-200 p-0.5 flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                                  <img
                                    src={prod.image}
                                    alt={prod.name}
                                    className="w-full h-full object-contain"
                                    loading="lazy"
                                    width="40"
                                    height="40"
                                  />
                                </div>

                                {/* Product Info */}
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-xs font-semibold text-slate-800 group-hover:text-[#E93984] truncate transition-colors leading-tight">
                                    {prod.name}
                                  </h4>
                                  <p className="text-[10px] text-slate-400 truncate mt-0.5 font-normal">
                                    {prod.spec}
                                  </p>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Footer Note */}
                        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                          <span>SS 304 &amp; SS 316L • EN 10204 3.1</span>
                          <a
                            href={localizePath('/products', currentLang)}
                            onClick={() => setIsProductsOpen(false)}
                            className="text-[#E93984] font-bold hover:underline"
                          >
                            All Categories →
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* About Us */}
          <a
            href="#about"
            className="px-3.5 py-1.5 rounded-lg text-slate-800 hover:text-[#E93984] hover:bg-slate-50 transition-colors"
          >
            {t('nav_about', 'About Us')}
          </a>

          {/* News and Social Activities */}
          <a
            href="#news-social"
            className="px-3.5 py-1.5 rounded-lg text-slate-800 hover:text-[#E93984] hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            {t('nav_news_social', 'News and Social Activities')}
          </a>

          {/* Contact Us */}
          <a
            href="#contact"
            className="px-3.5 py-1.5 rounded-lg text-slate-800 hover:text-[#E93984] hover:bg-slate-50 transition-colors"
          >
            {t('nav_contact', 'Contact Us')}
          </a>
        </nav>

        {/* 3. Action Controls (Right): Direct Input Search Bar + Profile Icon + Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Direct Search Bar in Navbar (NO ⌘K, NO Search Icon, Real Typing Input) */}
          <div className="relative w-44 sm:w-60 md:w-72" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim()) setIsSearchFocused(true);
                }}
                placeholder={t('search_placeholder_short', 'Search products, sizes...')}
                className="w-full h-9 px-4 rounded-full bg-slate-100 hover:bg-slate-200/80 focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 border border-slate-200 focus:border-[#E93984] focus:ring-2 focus:ring-[#E93984]/20 outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchFocused(false);
                  }}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs cursor-pointer p-0.5"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </form>

            {/* Live Search Results Dropdown Anchored Directly Under Navbar Search Bar */}
            {isSearchFocused && searchQuery.trim() && (
              <div
                className="absolute right-0 mt-2 w-72 sm:w-88 md:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden divide-y divide-slate-100"
                role="listbox"
              >
                <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Matching Products ({searchResults.length})</span>
                  <span className="text-[9px] text-slate-400">Press Enter to view all</span>
                </div>

                {searchResults.length > 0 ? (
                  <div className="py-1 max-h-72 overflow-y-auto">
                    {searchResults.map((item) => (
                      <a
                        key={item.id}
                        href={localizePath(`/product/${item.slug}`, currentLang)}
                        onClick={() => {
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="px-3 py-2 flex items-center gap-3 hover:bg-pink-50/50 transition-colors cursor-pointer group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                            loading="lazy"
                            width="36"
                            height="36"
                          />
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                          <div className="text-xs font-bold text-slate-800 group-hover:text-[#E93984] truncate transition-colors">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {item.category} • {item.material}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-300 group-hover:text-[#E93984] transition-colors">
                          ↗
                        </span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-4 text-center text-xs text-slate-500">
                    No products found for "{searchQuery}".
                  </div>
                )}

                <div className="p-2 bg-slate-50 text-center">
                  <a
                    href={localizePath(`/products?search=${encodeURIComponent(searchQuery.trim())}`, currentLang)}
                    onClick={() => {
                      setIsSearchFocused(false);
                      setSearchQuery('');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E93984] hover:underline"
                  >
                    <span>View all results in Catalogue</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Clean User Profile Button (Icon Only — Zero Text) */}
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

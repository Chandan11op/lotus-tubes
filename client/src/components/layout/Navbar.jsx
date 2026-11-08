import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ onOpenSearch, onToggleMobile }) => {
  const { t, currentLang, setCurrentLang, languages, activeLangConfig } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`executive-header ${isScrolled ? 'executive-header--scrolled' : ''}`} id="site-header">
      {/* Main Spacious Executive Navigation Header */}
      <div className="site-container executive-nav-container">
        {/* Prominent, Significantly Larger Lotus Tubes Logo Banner */}
        <a href="/" className="executive-brand" aria-label="Lotus Tubes - High-Purity Sanitary Stainless Steel Solutions">
          <div className="executive-brand__logo-box">
            <img
              src="/banner-image.png"
              srcSet="/banner-image-opt.png 1x, /banner-image.png 2x"
              alt="Lotus Tubes - Stainless Steel Sanitary Pipes, Fittings & Valves"
              className="executive-brand__img"
              width="240"
              height="64"
            />
          </div>
          <span className="sr-only">Lotus Tubes</span>
        </a>

        {/* Primary Desktop Navigation Bar */}
        <nav className="executive-nav" aria-label="Primary Navigation">
          <ul className="executive-nav-list">
            <li className="executive-nav-item">
              <a href="/" className="executive-nav-link">
                <span>{t('nav_home', 'Home')}</span>
              </a>
            </li>

            <li className="executive-nav-item">
              <a href="/about" className="executive-nav-link">
                <span>{t('nav_about', 'About Us')}</span>
              </a>
            </li>

            {/* Products Interactive Mega Menu */}
            <li
              className={`executive-nav-item executive-nav-item--dropdown ${activeDropdown === 'products' ? 'is-open' : ''}`}
              onMouseEnter={() => setActiveDropdown('products')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a href="/products" className="executive-nav-link executive-nav-link--has-dropdown" aria-haspopup="true">
                <span>{t('nav_products', 'Products')}</span>
                <svg className="executive-nav-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>

              <div className="executive-mega-menu" role="region" aria-label="Product Catalogue Categories">
                <div className="executive-mega-menu__container">
                  <div className="executive-mega-menu__header">
                    <span className="mega-tagline">Engineered for Aseptic Fluid Handling</span>
                    <a href="/products" className="mega-view-all">
                      Browse Full 50+ Component Catalogue &rarr;
                    </a>
                  </div>

                  <div className="executive-mega-menu__grid">
                    {/* Col 1: Tubes & Pipes */}
                    <div className="executive-mega-col">
                      <div className="mega-col-heading">
                        <span className="mega-col-icon">🔬</span>
                        <span>Sanitary Pipes &amp; Tubing</span>
                      </div>
                      <ul className="mega-links">
                        <li>
                          <a href="/product/ss-316l-ep-pipe" className="mega-link-item">
                            <span className="mega-link-title">SS 316L EP Sanitary Pipe</span>
                            <span className="mega-link-desc">EP / MP Finish Options &bull; Confirmed per product</span>
                          </a>
                        </li>
                        <li>
                          <a href="/product/ss-304-ep-pipe" className="mega-link-item">
                            <span className="mega-link-title">SS 304 EP Sanitary Pipe</span>
                            <span className="mega-link-desc">High Cleanliness Dairy &amp; Food Grade</span>
                          </a>
                        </li>
                        <li>
                          <a href="/product/ss-316l-mp-pipe" className="mega-link-item">
                            <span className="mega-link-title">SS 316L MP Sanitary Pipe</span>
                            <span className="mega-link-desc">Mechanically Polished 320 Grit</span>
                          </a>
                        </li>
                        <li>
                          <a href="/category/sanitary-pipes" className="mega-link-all">
                            View All Sanitary Pipes &rarr;
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* Col 2: Fittings & Tri-Clamp */}
                    <div className="executive-mega-col">
                      <div className="mega-col-heading">
                        <span className="mega-col-icon">⚙️</span>
                        <span>Fittings &amp; Tri-Clamp</span>
                      </div>
                      <ul className="mega-links">
                        <li>
                          <a href="/category/sanitary-fittings" className="mega-link-item">
                            <span className="mega-link-title">Sanitary Bends, Tees &amp; Reducers</span>
                            <span className="mega-link-desc">Butt-Weld &bull; Short &amp; Long Radius</span>
                          </a>
                        </li>
                        <li>
                          <a href="/category/tri-clamp" className="mega-link-item">
                            <span className="mega-link-title">Tri-Clamp Ferrules &amp; Clamps</span>
                            <span className="mega-link-desc">Heavy-Duty 13MHH &bull; Weld Ferrule</span>
                          </a>
                        </li>
                        <li>
                          <a href="/category/gaskets" className="mega-link-item">
                            <span className="mega-link-title">Hygienic Gaskets &amp; Seals</span>
                            <span className="mega-link-desc">USP Class VI Silicone, EPDM &amp; PTFE</span>
                          </a>
                        </li>
                        <li>
                          <a href="/category/sanitary-fittings" className="mega-link-all">
                            View All Pipe Fittings &rarr;
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* Col 3: Hygienic Valves */}
                    <div className="executive-mega-col">
                      <div className="mega-col-heading">
                        <span className="mega-col-icon">🎛️</span>
                        <span>Process Valves</span>
                      </div>
                      <ul className="mega-links">
                        <li>
                          <a href="/category/manual-valves" className="mega-link-item">
                            <span className="mega-link-title">Sanitary Butterfly Valves</span>
                            <span className="mega-link-desc">Multi-Position Handle &bull; Tri-Clamp Ends</span>
                          </a>
                        </li>
                        <li>
                          <a href="/category/manual-valves" className="mega-link-item">
                            <span className="mega-link-title">Aseptic Diaphragm Valves</span>
                            <span className="mega-link-desc">Manual / Pneumatic Options &bull; Check Availability</span>
                          </a>
                        </li>
                        <li>
                          <a href="/category/pneumatic-valves" className="mega-link-item">
                            <span className="mega-link-title">Pneumatic Actuated Valves</span>
                            <span className="mega-link-desc">Automated Clean-in-Place (CIP) Lines</span>
                          </a>
                        </li>
                        <li>
                          <a href="/category/manual-valves" className="mega-link-all">
                            View All Process Valves &rarr;
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* Col 4: Featured Metallurgy Callout */}
                    <div className="executive-mega-feature">
                      <div className="mega-feature-badge">Product Documentation</div>
                      <h4 className="mega-feature-title">SS 316L &amp; SS 304 Product Options</h4>
                      <p className="mega-feature-text">
                        Applicable standards and material test documentation can be confirmed for the selected product and supply.
                      </p>
                      <a href="/quote" className="mega-feature-btn">
                        <span>Get Instant BOQ Quote</span>
                        <span>&rarr;</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <li className="executive-nav-item">
              <a href="/industries" className="executive-nav-link">
                <span>{t('nav_industries', 'Industries')}</span>
              </a>
            </li>

            <li className="executive-nav-item">
              <a href="/contact" className="executive-nav-link">
                <span>{t('nav_contact', 'Contact')}</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Action Controls */}
        <div className="executive-actions">
          {/* Search Trigger */}
          <button
            type="button"
            className="executive-action-btn"
            onClick={(e) => {
              e.preventDefault();
              if (typeof onOpenSearch === 'function') onOpenSearch();
            }}
            title="Search products, sizes, ASTM standards"
            aria-label="Search product catalogue"
            id="nav-search-btn"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Account Profile Trigger */}
          <a
            href={isAuthenticated ? (user?.role === 'staff' || user?.role === 'admin' ? '#crm/dashboard' : '#account') : '#login'}
            className="executive-action-btn executive-profile-btn"
            title={isAuthenticated ? `Signed in as ${user?.name}` : 'Sign in to Customer Portal'}
            aria-label="User Account Profile"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
            </svg>
            {isAuthenticated && <span className="profile-active-dot" />}
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="executive-mobile-toggle"
            onClick={onToggleMobile}
            aria-label="Toggle Navigation Drawer"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

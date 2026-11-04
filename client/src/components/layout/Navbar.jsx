import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ onOpenSearch, onToggleMobile }) => {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="site-header" id="site-header">
      <div className="site-container site-header__inner">

        {/* Brand Logo */}
        <a href="/" className="brand-logo" aria-label="Lotus Tubes - Return to Home">
          <img
            src="/new-logo-lotus-tubes-opt.png"
            alt="Lotus Tubes - Stainless Steel Sanitary Solutions"
            className="brand-logo__img"
            width="200"
            height="48"
          />
        </a>

        {/* Main Navigation Links */}
        <nav className="main-nav" id="main-nav" aria-label="Main Navigation">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/" className="nav-link">{t('nav_home', 'Home')}</a>
            </li>
            <li className="nav-item">
              <a href="/about" className="nav-link">{t('nav_about', 'About Us')}</a>
            </li>

            {/* Products Dropdown */}
            <li className="nav-item nav-item--dropdown" id="nav-products-dropdown">
              <a href="/products" className="nav-link dropdown-toggle" aria-haspopup="true" aria-expanded="false">
                <span>{t('nav_products', 'Products')}</span> <span className="nav-arrow">▾</span>
              </a>
              <div className="mega-menu" aria-label="Product Categories">
                <div className="mega-menu__grid">
                  <div className="mega-menu__col">
                    <div className="mega-menu__title font-bold text-sky-400 mb-2">{t('mega_pipes', 'Pipes & Tubing')}</div>
                    <ul className="mega-menu__links">
                      <li><a href="/category/sanitary-pipes">Sanitary Pipes & Tubes</a></li>
                      <li><a href="/product/ss-316l-ep-pipe">SS 316L EP Sanitary Pipe</a></li>
                      <li><a href="/product/ss-304-ep-pipe">SS 304 EP Sanitary Pipe</a></li>
                      <li><a href="/product/ss-316l-mp-pipe">SS 316L MP Sanitary Pipe</a></li>
                      <li><a href="/product/ss-304-seamless-tube">SS 304 Seamless Tube</a></li>
                    </ul>
                  </div>
                  <div className="mega-menu__col">
                    <div className="mega-menu__title font-bold text-sky-400 mb-2">{t('mega_fittings', 'Fittings & Components')}</div>
                    <ul className="mega-menu__links">
                      <li><a href="/category/sanitary-fittings">Sanitary Pipe Fittings (Bends, Tees)</a></li>
                      <li><a href="/category/tri-clamp">Tri-Clamp Fittings & Clamps</a></li>
                      <li><a href="/category/gaskets">Sanitary Gaskets (Silicone, EPDM, PTFE)</a></li>
                      <li><a href="/product/ss-sms-union">SS SMS & DIN Unions</a></li>
                    </ul>
                  </div>
                  <div className="mega-menu__col">
                    <div className="mega-menu__title font-bold text-sky-400 mb-2">{t('mega_valves', 'Valves & Assemblies')}</div>
                    <ul className="mega-menu__links">
                      <li><a href="/category/manual-valves">Manual Sanitary Valves</a></li>
                      <li><a href="/category/pneumatic-valves">Pneumatic & Automated Valves</a></li>
                      <li><a href="/category/tank-cleaning">Tank Cleaning & Spray Balls</a></li>
                      <li><a href="/category/custom-assemblies">Custom Fabricated Spools & Manifolds</a></li>
                    </ul>
                  </div>
                  <div className="mega-menu__highlight">
                    <div className="mega-menu__highlight-box">
                      <span className="badge badge--pink">{t('mega_focus', 'Monopoly Focus')}</span>
                      <div className="font-bold text-white text-sm mb-1">{t('mega_certified', 'Hygienic Process Certified')}</div>
                      <p>{t('mega_desc', 'Available in SS 304 & SS 316L with EP/MP finishes. Fast quotations & MTC documentation.')}</p>
                      <a href="/products" className="btn btn--sm btn--primary">{t('btn_view_all', 'View All Products →')}</a>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            {/* Industries Direct Link */}
            <li className="nav-item">
              <a href="/industries" className="nav-link">{t('nav_industries', 'Industries')}</a>
            </li>

            <li className="nav-item">
              <a href="/quality" className="nav-link">{t('nav_quality', 'Quality & Docs')}</a>
            </li>
            <li className="nav-item">
              <a href="/resources" className="nav-link">{t('nav_resources', 'Resources')}</a>
            </li>
            <li className="nav-item">
              <a href="/contact" className="nav-link">{t('nav_contact', 'Contact Us')}</a>
            </li>
          </ul>
        </nav>

        {/* Header Actions */}
        <div className="site-header__actions">
          {/* Search Button */}
          <button
            type="button"
            className="action-btn action-btn--search"
            id="header-search-btn"
            onClick={onOpenSearch}
            title="Search catalogue, sizes, fittings"
            aria-label="Open search dialog"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          {/* Profile / Account Icon */}
          <a
            href={
              !isAuthenticated
                ? '#login'
                : user?.role === 'staff' || user?.role === 'admin'
                ? '#crm/dashboard'
                : '#account'
            }
            className="nav-profile-btn"
            title={
              !isAuthenticated
                ? 'Sign In / Register'
                : user?.role === 'staff' || user?.role === 'admin'
                ? `Staff Workspace (${user.name})`
                : `Customer Account (${user.name})`
            }
            aria-label="Profile"
            style={{ position: 'relative' }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4.2" />
              <path d="M4.5 20.2c0-4 3.3-7.2 7.5-7.2s7.5 3.2 7.5 7.2" />
            </svg>
            {isAuthenticated && (
              <span
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#10B981',
                  border: '1.5px solid #FFFFFF'
                }}
                title="Active Session"
              />
            )}
          </a>

          {/* Note: "Request a Quote" navbar item removed as authorized */}

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-toggle"
            id="mobile-toggle"
            onClick={onToggleMobile}
            aria-label="Toggle mobile menu"
            aria-expanded="false"
          >
            <span className="mobile-toggle__bar"></span>
            <span className="mobile-toggle__bar"></span>
            <span className="mobile-toggle__bar"></span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;

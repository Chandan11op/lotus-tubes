import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PRODUCTS } from '../../data/siteData';
import './ProductTicker.css';

/**
 * Clean & format material grade tag for consistent compact badges
 */
const getMaterialTag = (mat) => {
  if (!mat) return null;
  const m = mat.toUpperCase();
  if (m.includes('316L')) return 'SS 316L';
  if (m.includes('304')) return 'SS 304';
  if (m.includes('SILICONE')) return 'Silicone';
  if (m.includes('PTFE') || m.includes('TEFLON')) return 'PTFE';
  if (m.includes('EPDM')) return 'EPDM';
  if (m.includes('VITON') || m.includes('FKM')) return 'Viton';
  if (m.includes('FORGED')) return 'Forged';
  return mat.split('/')[0].trim().slice(0, 12);
};

/**
 * ProductTicker — Premium continuously scrolling hot-selling products ticker
 * Engineered for Lotus Tubes B2B Stainless Steel Sanitary Showcase
 *
 * Features:
 * - Continuous right-to-left linear CSS marquee animation
 * - Seamless infinite loop using dual identical cloned groups (zero gap / zero jump)
 * - All configured products rendered from master catalogue
 * - Stationary label badge with subtle flame icon
 * - Clipped scrolling viewport with smooth gradient edge masks
 * - Direct deep-links to product specification pages (#product/:slug)
 * - Pause on hover and keyboard focus-within
 * - Accessible alternative for prefers-reduced-motion
 * - Strict zero horizontal overflow
 */
export const ProductTicker = ({ products: customProducts }) => {
  const { t } = useLanguage();

  // Guarantee all configured products appear in the ticker
  const tickerProducts =
    customProducts && customProducts.length > 0 ? customProducts : PRODUCTS;

  return (
    <aside
      className="product-ticker"
      role="region"
      aria-label={t('ticker_aria', 'Hot-Selling Products Ticker')}
    >
      {/* 1. Stationary Brand Badge */}
      <div className="product-ticker__badge">
        <span className="product-ticker__badge-icon" aria-hidden="true">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C9.5 6 7 8.5 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.5 15.5 7 12 2Z"
              fill="url(#tickerFlameGrad)"
            />
            <path
              d="M12 9C10.5 11 9.5 12.5 9.5 14C9.5 15.38 10.62 16.5 12 16.5C13.38 16.5 14.5 15.38 14.5 14C14.5 12.5 13.5 11 12 9Z"
              fill="#FFFFFF"
              opacity="0.9"
            />
            <defs>
              <linearGradient
                id="tickerFlameGrad"
                x1="12"
                y1="2"
                x2="12"
                y2="17"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#F00078" />
                <stop offset="1" stopColor="#FF439D" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span className="product-ticker__badge-text">
          <span className="product-ticker__badge-text-full">
            {t('ticker_title', 'HOT-SELLING PRODUCTS')}
          </span>
          <span className="product-ticker__badge-text-short">
            {t('ticker_title_short', 'HOT-SELLING')}
          </span>
        </span>
        <span className="product-ticker__badge-tag" aria-hidden="true" />
      </div>

      {/* 2. Clipped Scrolling Viewport */}
      <div className="product-ticker__viewport">
        {/* Soft gradient edge masks */}
        <div className="product-ticker__fade-left" aria-hidden="true" />
        <div className="product-ticker__fade-right" aria-hidden="true" />

        {/* 3. Scrolling Track with Duplicated Groups for Seamless Looping */}
        <div className="product-ticker__track">
          {/* Primary Group */}
          <div className="product-ticker__group" aria-hidden="false">
            {tickerProducts.map((prod, idx) => {
              const tag = getMaterialTag(prod.material);
              return (
                <a
                  key={`pt-1-${prod.id || prod.slug || idx}`}
                  href={`#product/${prod.slug || prod.id}`}
                  className="product-ticker__item"
                  title={`Explore ${prod.name} specifications & quotation`}
                >
                  <span className="product-ticker__item-dot" aria-hidden="true">
                    ✦
                  </span>
                  <span className="product-ticker__item-name">{prod.name}</span>
                  {tag && (
                    <span className="product-ticker__item-tag">{tag}</span>
                  )}
                </a>
              );
            })}
          </div>

          {/* Secondary Group (Cloned identically for seamless infinite loop) */}
          <div className="product-ticker__group" aria-hidden="true">
            {tickerProducts.map((prod, idx) => {
              const tag = getMaterialTag(prod.material);
              return (
                <a
                  key={`pt-2-${prod.id || prod.slug || idx}`}
                  href={`#product/${prod.slug || prod.id}`}
                  tabIndex="-1"
                  className="product-ticker__item"
                  title={`Explore ${prod.name} specifications & quotation`}
                >
                  <span className="product-ticker__item-dot" aria-hidden="true">
                    ✦
                  </span>
                  <span className="product-ticker__item-name">{prod.name}</span>
                  {tag && (
                    <span className="product-ticker__item-tag">{tag}</span>
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProductTicker;

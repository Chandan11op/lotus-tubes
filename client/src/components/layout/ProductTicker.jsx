import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PRODUCTS } from '../../data/siteData';
import './ProductTicker.css';

/**
 * ProductTicker — Premium continuously scrolling hot-selling products ticker
 * Engineered for Lotus Tubes B2B Stainless Steel Sanitary Showcase
 *
 * Features:
 * - Continuous right-to-left linear CSS marquee animation
 * - Seamless looping using dual cloned groups (zero gap / zero jump)
 * - Stationary label badge with subtle flame icon
 * - Clipped scrolling viewport with smooth gradient edge masks
 * - Real product data sourced from master catalogue
 * - Direct deep-links to product specification pages (#product/:slug)
 * - Pause on hover and focus-within
 * - Full prefers-reduced-motion accessibility support
 */
export const ProductTicker = ({ products: customProducts }) => {
  const { t } = useLanguage();

  // Use passed products or prioritize the verified catalogue products
  const tickerProducts = customProducts || PRODUCTS.slice(0, 20);

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
            {tickerProducts.map((prod) => (
              <a
                key={`track-1-${prod.id || prod.slug}`}
                href={`#product/${prod.slug || prod.id}`}
                className="product-ticker__item"
                title={`Explore ${prod.name} specifications & quotation`}
              >
                <span className="product-ticker__item-dot" aria-hidden="true">
                  ✦
                </span>
                <span className="product-ticker__item-name">{prod.name}</span>
                {prod.material && (
                  <span className="product-ticker__item-tag">
                    {prod.material.split('/')[0].trim()}
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Secondary Group (Cloned for seamless infinite loop) */}
          <div className="product-ticker__group" aria-hidden="true">
            {tickerProducts.map((prod) => (
              <a
                key={`track-2-${prod.id || prod.slug}`}
                href={`#product/${prod.slug || prod.id}`}
                tabIndex="-1"
                className="product-ticker__item"
                title={`Explore ${prod.name} specifications & quotation`}
              >
                <span className="product-ticker__item-dot" aria-hidden="true">
                  ✦
                </span>
                <span className="product-ticker__item-name">{prod.name}</span>
                {prod.material && (
                  <span className="product-ticker__item-tag">
                    {prod.material.split('/')[0].trim()}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProductTicker;

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CONFIG, CATEGORIES, PRODUCTS, INDUSTRIES, createProductSVG } from '../data/siteData';
import ProductCard from '../components/common/ProductCard';
import ProductTicker from '../components/layout/ProductTicker';
import HomeCinematicHero from '../components/common/HomeCinematicHero';
import ManufacturingProcess from '../components/common/ManufacturingProcess';
import ProductImage from '../components/common/ProductImage';

export const HomeView = ({ onOpenEnquiry, onOpenVideo }) => {
  const { t } = useLanguage();

  return (
    <>
      {/* Hot-Selling Products Ticker (Positioned immediately after Navbar and before Hero) */}
      <ProductTicker />

      {/* A. Cinematic Hex-Inspired Hero Section with Coordinated Product Visuals */}
      <HomeCinematicHero onOpenEnquiry={onOpenEnquiry} onOpenVideo={onOpenVideo} />

      {/* B. Product Range (Image-Led Cards) */}
      <section className="section section--white" id="section-range" aria-label="Our Product Range">
        <div className="site-container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">{t('sec_range_eyebrow', 'Our Product Range')}</span>
              <h2 className="section-title">{t('sec_range_title', 'Premium Stainless Steel Solutions')}</h2>
            </div>
            <a href="/products" className="btn btn--outline-dark">
              {t('btn_view_all', 'View All Products')} &rarr;
            </a>
          </div>

          <div className="product-range-grid">
            {CATEGORIES.map((cat, idx) => (
              <article
                className="range-card group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl rounded-xl overflow-hidden border border-slate-200 bg-white"
                key={cat.slug}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="range-card__img-wrap">
                  <ProductImage
                    src={cat.image}
                    alt={cat.name}
                    objectFit="cover"
                    objectPosition="center"
                    className="w-full h-full"
                    imgClassName="range-card__img"
                  />
                </div>
                <div className="range-card__body p-5">
                  <h3 className="range-card__title text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="range-card__desc text-sm text-slate-600 mt-2 line-clamp-3">
                    {cat.desc}
                  </p>
                  <div className="range-card__footer mt-4 pt-3 border-t border-slate-100">
                    <a href={`/category/${cat.slug}`} className="range-card__link text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1">
                      {t('link_view_products', 'View Products')} <span>&rarr;</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* C. Featured Products (Top Priority B2B Products) */}
      <section className="section" id="section-featured" aria-label="Featured Priority Products">
        <div className="site-container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">{t('sec_featured_eyebrow', 'Monopoly & Priority Range')}</span>
              <h2 className="section-title">{t('sec_featured_title', 'Priority Stainless Steel Sanitary Products')}</h2>
              <p className="section-subtitle">
                {t('sec_featured_desc', 'Precision components across SS 304 & SS 316L for high-cleanliness applications.')}
              </p>
            </div>
            <a href="/products" className="btn btn--primary">
              {t('btn_browse_catalogue', 'Browse Complete 20+ Catalogue')} &rarr;
            </a>
          </div>

          <div className="featured-products-grid">
            {PRODUCTS.slice(0, 12).map((prod) => (
              <ProductCard
                key={prod.slug || prod.id}
                product={prod}
                onOpenEnquiry={onOpenEnquiry}
              />
            ))}
          </div>

          <div className="load-more-container mt-3">
            <a href="/products" className="btn btn--outline-dark btn--lg">
              {t('btn_view_all_catalogue', 'View All 20+ Industrial Products in Catalogue')} &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Precision Manufacturing Process & Engineering Showcase */}
      <ManufacturingProcess />

      {/* D. Industries Served (Image-led Cards with Circular Icons) */}
      <section className="section section--white" id="section-industries" aria-label="Industries We Serve">
        <div className="site-container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">{t('sec_industries_eyebrow', 'Industries We Serve')}</span>
              <h2 className="section-title">{t('sec_industries_title', 'Trusted Across Multiple Process Industries')}</h2>
            </div>
            <a href="/industries" className="btn btn--outline-dark">
              {t('btn_view_all_industries', 'View All Industries')} &rarr;
            </a>
          </div>

          <div className="industries-scroll-grid">
            {INDUSTRIES.map((ind) => (
              <a href="/industries" className="industry-chip-card" key={ind.slug}>
                <div className="industry-chip-card__img-wrap">
                  <ProductImage
                    src={`/assets/images/industries/${ind.slug}.jpg`}
                    fallbackSrc={ind.image || `/assets/images/industries/${ind.slug}.svg`}
                    alt={ind.name}
                    className="w-full h-full"
                    imgClassName="industry-chip-card__img"
                    objectFit="cover"
                  />
                  <div className="industry-chip-card__icon-bubble">{ind.icon}</div>
                </div>
                <div className="industry-chip-card__body">
                  <h4 className="industry-chip-card__title">{ind.name}</h4>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* E. Why Lotus Tubes (Dark Navy Industrial Section with Line Icons) */}
      <section className="why-section section--dark" id="section-why" aria-label="Why Lotus Tubes">
        <div className="site-container">
          <div className="section-header section-header--center">
            <span className="section-eyebrow text-sky-400 font-bold uppercase tracking-wider">{t('sec_why_eyebrow', 'Why Choose Lotus Tubes')}</span>
            <h2 className="section-title text-white font-extrabold text-3xl sm:text-4xl tracking-tight !text-white">
              {t('sec_why_title', 'Quality. Stock. Service. Always.')}
            </h2>
            <p className="section-subtitle text-slate-300 max-w-2xl mx-auto">
              {t('sec_why_desc', 'Dedicated supplier of hygienic stainless steel components, engineered for integrity and traceability.')}
            </p>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-card__icon">🔬</div>
              <h3 className="why-card__title">{t('why_1_title', 'Material Integrity')}</h3>
              <p className="why-card__desc">
                {t('why_1_desc', 'Complete stock across SS 304 and molybdenum-rich SS 316L, conforming to strict chemical composition thresholds.')}
              </p>
            </div>
            <div className="why-card">
              <div className="why-card__icon">⚡</div>
              <h3 className="why-card__title">{t('why_2_title', 'Finish & Precision')}</h3>
              <p className="why-card__desc">
                {t('why_2_desc', 'Available Electro-Polished (EP) with Ra ≤ 0.38 µm and Mechanical Polished (MP) finishes tailored for CIP cleanliness.')}
              </p>
            </div>
            <div className="why-card">
              <div className="why-card__icon">📑</div>
              <h3 className="why-card__title">{t('why_3_title', 'Traceability & MTC')}</h3>
              <p className="why-card__desc">
                {t('why_3_desc', 'Complete EN 10204 3.1 Material Test Certificates confirming mechanical, chemical, and roughness properties upon request.')}
              </p>
            </div>
            <div className="why-card">
              <div className="why-card__icon">📦</div>
              <h3 className="why-card__title">{t('why_4_title', 'Ready Stock Availability')}</h3>
              <p className="why-card__desc">
                {t('why_4_desc', 'Broad domestic stockholding of sanitary bends, tees, clamps, gaskets, and pipes ready for immediate dispatch.')}
              </p>
            </div>
            <div className="why-card">
              <div className="why-card__icon">🤝</div>
              <h3 className="why-card__title">{t('why_5_title', 'Quotation Assistance')}</h3>
              <p className="why-card__desc">
                {t('why_5_desc', 'Fast technical response via mail and dedicated WhatsApp Business desk with full BOQ item breakdown.')}
              </p>
            </div>
            <div className="why-card">
              <div className="why-card__icon">🌍</div>
              <h3 className="why-card__title">{t('why_6_title', 'Global Sourcing Support')}</h3>
              <p className="why-card__desc">
                {t('why_6_desc', 'Supplying process plants, distributors, and skid fabricators across India, Europe, UAE, USA, and Southeast Asia.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* F. About Section (2-Column Preview) */}
      <section className="section section--white" id="section-about-preview" aria-label="About Lotus Tubes">
        <div className="site-container">
          <div className="about-preview-grid">
            
            <div className="about-preview-media">
              <img
                src="/assets/images/company/lotus-tubes-facility.jpg"
                alt="Lotus Tubes Office and Warehousing Facility"
                className="about-preview-img"
                loading="lazy"
              />
              <div className="about-building-overlay" style={{ top: 'auto', bottom: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/new-logo-lotus-tubes-opt.png" alt="Lotus Tubes" className="about-building-logo" style={{ height: '32px' }} />
                <span style={{ color: '#FFFFFF', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Mumbai Distribution Hub
                </span>
              </div>
            </div>

            <div className="about-preview-content">
              <span className="section-eyebrow">{t('sec_about_eyebrow', 'About Lotus Tubes')}</span>
              <h2 className="section-title">{t('sec_about_title', 'Your Trusted Partner in Stainless Steel Solutions')}</h2>
              <p>
                {t('sec_about_desc', 'Lotus Tubes (a venture of Lotus Impex, Mumbai) is a dedicated supplier and stockist of high-quality stainless steel sanitary pipes, pipe fittings, and valves. Catering to pharmaceutical, dairy, food & beverage, breweries, water treatment, and chemical industries across India and worldwide.')}
              </p>
              
              {/* Factual Capabilities & Metrics */}
              <div className="stats-counter-grid">
                <div className="stat-box">
                  <div className="stat-box__number">SS 316L</div>
                  <div className="stat-box__label">{t('stat_pharma', 'High-Purity Pharma Grade')}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-box__number">EP / MP</div>
                  <div className="stat-box__label">{t('stat_finishes', 'Precision Surface Finishes')}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-box__number">ASTM</div>
                  <div className="stat-box__label">{t('stat_compliance', 'A270 / A269 Compliance')}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-box__number">100%</div>
                  <div className="stat-box__label">{t('stat_traceability', 'MTC Traceability Support')}</div>
                </div>
              </div>

              <a href="/about" className="btn btn--primary btn--lg">
                <span>{t('btn_know_more', 'Know More About Us')}</span> &rarr;
              </a>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default HomeView;

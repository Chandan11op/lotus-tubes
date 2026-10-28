import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CONFIG, CATEGORIES, PRODUCTS, INDUSTRIES, createProductSVG } from '../data/siteData';
import ProductCardVideo from '../components/common/ProductCardVideo';
import ProductTicker from '../components/layout/ProductTicker';

export const HomeView = ({ onOpenEnquiry, onOpenVideo }) => {
  const { t } = useLanguage();

  return (
    <>
      {/* Hot-Selling Products Ticker (Positioned immediately after Navbar and before Hero) */}
      <ProductTicker />

      {/* A. Hero Section (Matching UI-UX Reference Structure) */}
      <section className="hero-section" aria-label="Hero Showcase">
        <div className="site-container">
          <div className="hero-grid">
            
            <div className="hero-content">
              <span className="hero-eyebrow">{t('hero_eyebrow', 'The Quality Maker')}</span>
              <h1 className="hero-title">
                {t('hero_title', 'Stainless Steel Sanitary Pipes, Fittings & Valves')}
              </h1>
              <h2 className="hero-subtitle">
                {t('hero_subtitle', 'Engineered for Hygienic Process Applications')}
              </h2>
              <p className="hero-description">
                {t('hero_desc', 'Explore stainless steel sanitary products in SS 304 and SS 316L, with available surface finishes and configurations suited to pharmaceutical, dairy, food & beverage, and high-purity process industries.')}
              </p>

              {/* 4 Feature Badges (Matching Reference Layout) */}
              <div className="hero-badges-grid">
                <div className="hero-badge-item">
                  <span className="hero-badge-icon">💎</span>
                  <div
                    className="hero-badge-label"
                    dangerouslySetInnerHTML={{ __html: t('badge_premium', 'Premium<br>SS 304 / 316L') }}
                  />
                </div>
                <div className="hero-badge-item">
                  <span className="hero-badge-icon">📦</span>
                  <div
                    className="hero-badge-label"
                    dangerouslySetInnerHTML={{ __html: t('badge_stock', 'Ready<br>Stock Range') }}
                  />
                </div>
                <div className="hero-badge-item">
                  <span className="hero-badge-icon">🌐</span>
                  <div
                    className="hero-badge-label"
                    dangerouslySetInnerHTML={{ __html: t('badge_supply', 'Global & Pan<br>India Supply') }}
                  />
                </div>
                <div className="hero-badge-item">
                  <span className="hero-badge-icon">📋</span>
                  <div
                    className="hero-badge-label"
                    dangerouslySetInnerHTML={{ __html: t('badge_mtc', 'MTC & Technical<br>Assistance') }}
                  />
                </div>
              </div>

              {/* Primary CTAs */}
              <div className="hero-actions">
                <a href="#products" className="btn btn--primary btn--lg">
                  <span>{t('btn_explore', 'Explore Products')}</span> &rarr;
                </a>
                <button
                  type="button"
                  onClick={() => onOpenEnquiry && onOpenEnquiry(null, 'Stainless Steel Sanitary Piping')}
                  className="btn btn--outline-dark btn--lg"
                >
                  {t('btn_quote', 'Request a Quote')} &rarr;
                </button>
                <a
                  href={`https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20would%20like%20to%20enquire%20about%20your%20sanitary%20stainless%20steel%20products.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--whatsapp btn--lg"
                >
                  <span>🟢 {t('top_whatsapp', 'WhatsApp Enquiry')}</span>
                </a>
              </div>
            </div>

            {/* Hero Visual Media & Tagline */}
            <div className="hero-media">
              <div className="hero-tagline-float">
                <h3>
                  {t('hero_tagline_1', 'Hygienic.')}<br />
                  {t('hero_tagline_2', 'Reliable.')}<br />
                  {t('hero_tagline_3', 'Global.')}
                </h3>
                <div className="underline-pink"></div>
              </div>
              <div className="hero-visual-card">
                <img
                  src="/assets/images/hero/sanitary-hero-pipes.svg"
                  alt="Polished Stainless Steel Sanitary Pipes and Tri-Clamp Fittings"
                  className="hero-img"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    if (PRODUCTS[0]?.image) e.currentTarget.src = PRODUCTS[0].image;
                  }}
                />
                <div className="hero-spec-pill">
                  <strong>SS 316L EP</strong> &bull; Ra &le; 0.38 &mu;m &bull; ASTM A270 Certified
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* B. Product Range (Image-Led Cards) */}
      <section className="section section--white" id="section-range" aria-label="Our Product Range">
        <div className="site-container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">{t('sec_range_eyebrow', 'Our Product Range')}</span>
              <h2 className="section-title">{t('sec_range_title', 'Premium Stainless Steel Solutions')}</h2>
            </div>
            <a href="#products" className="btn btn--outline-dark">
              {t('btn_view_all', 'View All Products')} &rarr;
            </a>
          </div>

          <div className="product-range-grid">
            {CATEGORIES.map((cat) => (
              <article className="range-card" key={cat.slug}>
                <div className="range-card__img-wrap">
                  <img src={cat.image} alt={cat.name} className="range-card__img" loading="lazy" />
                </div>
                <div className="range-card__body">
                  <h3 className="range-card__title">{cat.name}</h3>
                  <p className="range-card__desc">{cat.desc}</p>
                  <div className="range-card__footer">
                    <a href={`#category/${cat.slug}`} className="range-card__link">
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
            <a href="#products" className="btn btn--primary">
              {t('btn_browse_catalogue', 'Browse Complete 20+ Catalogue')} &rarr;
            </a>
          </div>

          <div className="featured-products-grid">
            {PRODUCTS.slice(0, 12).map((prod) => (
              <article className="product-card" key={prod.slug}>
                <div className="product-card__badge-bar">
                  <span className="badge badge--navy">{prod.material}</span>
                  <span className="badge badge--pink">{prod.finish?.split(' ')[0]}</span>
                </div>
                <div className="product-card__img-wrap">
                  <ProductCardVideo video={prod.video} poster={prod.image} alt={prod.name} categorySlug={prod.categorySlug} />
                </div>
                <div className="product-card__body">
                  <span className="product-card__category">{prod.category}</span>
                  <h3 className="product-card__title">
                    <a href={`#product/${prod.slug}`}>{prod.name}</a>
                  </h3>
                  <p className="product-card__specs">
                    <strong>{t('label_roughness', 'Roughness:')}</strong> {prod.roughness || 'Hygienic standard'}<br />
                    <strong>{t('label_standard', 'Standard:')}</strong> {prod.standard}
                  </p>
                  <div className="product-card__actions">
                    <a href={`#product/${prod.slug}`} className="btn btn--outline-dark btn--sm">
                      {t('btn_view_details', 'View Details')}
                    </a>
                    <button
                      type="button"
                      className="btn btn--primary btn--sm quick-rfq-btn"
                      onClick={() => onOpenEnquiry && onOpenEnquiry(prod.id, prod.name)}
                    >
                      {t('btn_request_quotation', 'Request Official Quotation')}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="load-more-container mt-3">
            <a href="#products" className="btn btn--outline-dark btn--lg">
              {t('btn_view_all_catalogue', 'View All 20+ Industrial Products in Catalogue')} &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* D. Industries Served (Image-led Cards with Circular Icons) */}
      <section className="section section--white" id="section-industries" aria-label="Industries We Serve">
        <div className="site-container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">{t('sec_industries_eyebrow', 'Industries We Serve')}</span>
              <h2 className="section-title">{t('sec_industries_title', 'Trusted Across Multiple Process Industries')}</h2>
            </div>
            <a href="#industries" className="btn btn--outline-dark">
              {t('btn_view_all_industries', 'View All Industries')} &rarr;
            </a>
          </div>

          <div className="industries-scroll-grid">
            {INDUSTRIES.map((ind) => (
              <a href={`#industry/${ind.slug}`} className="industry-chip-card" key={ind.slug}>
                <div className="industry-chip-card__img-wrap">
                  <img
                    src={createProductSVG(ind.name, 'Industry Application', '#10263D')}
                    alt={ind.name}
                    className="industry-chip-card__img"
                    loading="lazy"
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

      {/* E. Why Lotus Tubes (Dark Navy Industrial Section with Line Icons & Video Modal) */}
      <section className="why-section" id="section-why" aria-label="Why Lotus Tubes">
        <div className="site-container">
          <div className="section-header section-header--center">
            <span className="section-eyebrow">{t('sec_why_eyebrow', 'Why Choose Lotus Tubes')}</span>
            <h2 className="section-title">{t('sec_why_title', 'Quality. Stock. Service. Always.')}</h2>
            <p className="section-subtitle">
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

          {/* Video Tour Bar (Matching UI Reference) */}
          <div className="why-video-bar">
            <div className="why-video-bar__left">
              <button
                type="button"
                className="play-btn-circle"
                id="open-process-video"
                aria-label="Play Process Demonstration"
                onClick={onOpenVideo}
              >
                ▶
              </button>
              <div className="why-video-bar__text">
                <h4>{t('why_video_title', 'Watch Sourcing & Quality Inspection Overview')}</h4>
                <p>{t('why_video_desc', 'See our multi-stage electro-polishing verification, surface Ra testing, and packaging protocol.')}</p>
              </div>
            </div>
            <button
              type="button"
              className="btn btn--outline-light"
              id="open-process-video-btn"
              onClick={onOpenVideo}
            >
              {t('btn_video_demo', 'Explore Quality Demo')} &rarr;
            </button>
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
                <img src="/Lotus Tubes Logo.png" alt="Lotus Tubes" className="about-building-logo" style={{ height: '32px' }} />
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

              <a href="#about" className="btn btn--primary btn--lg">
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

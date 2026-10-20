import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORIES, PRODUCTS, INDUSTRIES } from '../data/siteData';

export const HomeView = ({ onOpenEnquiry, onOpenVideo }) => {
  const { t } = useLanguage();

  const monopolyProduct = PRODUCTS.find((p) => p.slug === 'ss-316l-ep-pipe') || PRODUCTS[0];

  return (
    <div>
      {/* A. Hero Section */}
      <section className="hero-section" aria-label="Hero Showcase">
        <div className="site-container">
          <div className="hero-grid">
            <div className="hero-content">
              <span className="hero-eyebrow">{t('hero_eyebrow', 'The Quality Maker')}</span>
              <h1 className="hero-title">
                {t('hero_title', 'Stainless Steel Sanitary Pipes, Fittings & Valves')}
              </h1>
              <p className="hero-subtitle">
                {t(
                  'hero_subtitle',
                  'Engineered for critical high-purity processes in pharmaceuticals, biotech, food, dairy, and beverage industries. Premium SS 304 & SS 316L with Electro-Polished (EP) & Mechanical Polished (MP) finishes conforming to ASTM A270.'
                )}
              </p>

              <div className="hero-actions">
                <a href="#products" className="btn btn--primary btn--lg">
                  <span>{t('btn_explore_catalogue', 'Explore Sanitary Catalogue')}</span> &rarr;
                </a>
                <a href="#quote" className="btn btn--secondary btn--lg">
                  {t('btn_get_quote', 'Request a Quote')}
                </a>
                <button
                  type="button"
                  className="btn btn--outline-dark btn--lg"
                  onClick={onOpenVideo}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>▶</span> <span>Watch Process Tour</span>
                </button>
              </div>

              {/* Statistical Trust Strip */}
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">25+</span>
                  <span className="stat-label">Years of Industry Trust</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">450+</span>
                  <span className="stat-label">Metric Tons Ready Inventory</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">12,000+</span>
                  <span className="stat-label">MTC Certified Batches</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">18+</span>
                  <span className="stat-label">Export Destinations</span>
                </div>
              </div>
            </div>

            <div className="hero-media">
              <div className="hero-visual-card">
                <div className="hero-badge-overlay">
                  <span className="hero-badge hero-badge--primary">SS 316L &bull; ASTM A270</span>
                  <span className="hero-badge hero-badge--accent">Ra &le; 0.38 &mu;m (EP Finish)</span>
                </div>
                <img
                  src="/assets/images/hero/sanitary-hero-pipes.svg"
                  alt="Stainless Steel Sanitary Pipes, Bends and Valves Showcase"
                  className="hero-image"
                />
                <div className="hero-floating-card">
                  <div className="floating-card-icon">⚡</div>
                  <div className="floating-card-text">
                    <strong>Rapid Dispatch Guarantee</strong>
                    <span>Same-day dispatch for standard OD pipe sizes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B. Product Category Showcase Grid */}
      <section className="section bg-light" id="categories-section" aria-label="Product Categories">
        <div className="site-container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">{t('sec_eyebrow_cat', 'Core Sanitary Products')}</span>
              <h2 className="section-title">{t('sec_title_cat', 'Engineered for Fluid Purity & Compliance')}</h2>
              <p className="section-subtitle">
                {t(
                  'sec_sub_cat',
                  'Explore our certified range of sanitary stainless steel tubes, tri-clamp components, manual and automated hygienic valves.'
                )}
              </p>
            </div>
            <a href="#products" className="btn btn--outline-dark btn--sm">
              {t('btn_view_all', 'View All Products &rarr;')}
            </a>
          </div>

          <div className="category-grid">
            {CATEGORIES.map((cat) => (
              <article key={cat.id} className="category-card">
                <div className="category-card__header">
                  <span className="category-card__icon" aria-hidden="true">{cat.icon}</span>
                  <span className="category-card__count">{cat.subcategories?.length || 4} Series</span>
                </div>
                <div className="category-card__img-wrap">
                  <img
                    src={cat.image?.startsWith('assets/') ? `/${cat.image}` : cat.image}
                    alt={cat.name}
                    className="category-card__img"
                    loading="lazy"
                  />
                </div>
                <div className="category-card__body">
                  <h3 className="category-card__title">
                    <a href={`#category/${cat.slug}`}>{cat.name}</a>
                  </h3>
                  <p className="category-card__desc">{cat.desc}</p>
                  <div className="category-card__subtags">
                    {cat.subcategories?.slice(0, 3).map((sub, i) => (
                      <span key={i} className="subtag">{sub}</span>
                    ))}
                  </div>
                  <a href={`#category/${cat.slug}`} className="category-card__link">
                    Explore Category &rarr;
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* C. Monopoly Highlight Product */}
      <section className="section monopoly-section" aria-label="Signature High-Purity Line">
        <div className="site-container">
          <div className="monopoly-card">
            <div className="monopoly-grid">
              <div className="monopoly-info">
                <div className="monopoly-badge-row">
                  <span className="badge badge--pink">Monopoly Focus Product</span>
                  <span className="badge badge--navy">Pharma &amp; Biotech Grade</span>
                </div>
                <h2 className="monopoly-title">{monopolyProduct.name}</h2>
                <p className="monopoly-desc">{monopolyProduct.overview}</p>

                <div className="monopoly-spec-grid">
                  <div className="spec-box">
                    <span className="spec-label">Material Grade</span>
                    <span className="spec-value">{monopolyProduct.material}</span>
                  </div>
                  <div className="spec-box">
                    <span className="spec-label">Surface Finish</span>
                    <span className="spec-value">{monopolyProduct.finish}</span>
                  </div>
                  <div className="spec-box">
                    <span className="spec-label">Internal Roughness</span>
                    <span className="spec-value">{monopolyProduct.roughness}</span>
                  </div>
                  <div className="spec-box">
                    <span className="spec-label">Compliance</span>
                    <span className="spec-value">{monopolyProduct.standard}</span>
                  </div>
                </div>

                <div className="monopoly-actions">
                  <button
                    type="button"
                    className="btn btn--primary btn--lg"
                    onClick={() => onOpenEnquiry(monopolyProduct)}
                  >
                    <span>Instant Price &amp; Stock Inquiry</span> &rarr;
                  </button>
                  <a href={`#product/${monopolyProduct.slug}`} className="btn btn--outline-dark btn--lg">
                    Full Technical Datasheet
                  </a>
                </div>
              </div>

              <div className="monopoly-visual">
                <img
                  src={monopolyProduct.image?.startsWith('assets/') ? `/${monopolyProduct.image}` : monopolyProduct.image}
                  alt={monopolyProduct.name}
                  className="monopoly-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* D. Industries We Serve */}
      <section className="section bg-light" id="industries-section" aria-label="Industries Served">
        <div className="site-container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Sector Expertise</span>
              <h2 className="section-title">Certified Hygienic Piping Across Global Industries</h2>
              <p className="section-subtitle">
                Tailored surface micro-roughness, high corrosion resistance, and complete traceability documentation for sterile processing environments.
              </p>
            </div>
          </div>

          <div className="industries-grid">
            {INDUSTRIES.map((ind) => (
              <article key={ind.id} className="industry-card">
                <div className="industry-card__header">
                  <span className="industry-card__icon">{ind.icon}</span>
                  <h3 className="industry-card__title">
                    <a href={`#industry/${ind.slug}`}>{ind.name}</a>
                  </h3>
                </div>
                <p className="industry-card__desc">{ind.desc}</p>
                <div className="industry-card__spec">
                  <strong>Recommended Grade:</strong> {ind.recommendedGrade}
                </div>
                <div className="industry-card__footer">
                  <a href={`#industry/${ind.slug}`} className="industry-card__link">
                    Explore Solutions &rarr;
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* E. Quality Assurance & Certification Section */}
      <section className="section" id="quality-preview-section" aria-label="Quality and Standards">
        <div className="site-container">
          <div className="about-preview-grid">
            <div className="about-preview-text">
              <span className="section-eyebrow">Zero Defect Manufacturing</span>
              <h2 className="section-title">Uncompromising Quality &amp; Certified Metallurgical Integrity</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '16px' }}>
                Every tube, bend, and valve supplied by Lotus Tubes undergoes rigorous surface roughness testing, hydrostatic pressure checking, and spectro-chemical verification. Supplied with authentic EN 10204 3.1 Mill Test Certificates.
              </p>

              <div className="quality-feature-list" style={{ marginTop: '24px' }}>
                <div className="quality-feature-item">
                  <span className="feat-check">✓</span>
                  <div>
                    <strong>ASTM A270 &amp; ASTM A269 Strict Compliance:</strong>
                    <p style={{ margin: 0, fontSize: '13px', color: '#667085' }}>Precision tolerances for roundness, OD, and uniform wall thickness.</p>
                  </div>
                </div>
                <div className="quality-feature-item">
                  <span className="feat-check">✓</span>
                  <div>
                    <strong>Mitutoyo Surface Roughness Verification:</strong>
                    <p style={{ margin: 0, fontSize: '13px', color: '#667085' }}>Certified Ra &le; 0.38 &mu;m inside finish eliminating bacterial adhesion.</p>
                  </div>
                </div>
                <div className="quality-feature-item">
                  <span className="feat-check">✓</span>
                  <div>
                    <strong>100% Eddy Current &amp; Hydrostatic Testing:</strong>
                    <p style={{ margin: 0, fontSize: '13px', color: '#667085' }}>Zero porosity and leak-proof guarantees under severe hygienic process pressures.</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '30px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href="#quality" className="btn btn--primary">
                  Review Quality Standards &rarr;
                </a>
                <button type="button" className="btn btn--outline-dark" onClick={onOpenVideo}>
                  Watch QC Video Demonstration
                </button>
              </div>
            </div>

            <div className="about-preview-media">
              <div className="facility-card">
                <img
                  src="/assets/images/company/lotus-tubes-facility.svg"
                  alt="Lotus Tubes Inspection and Stock Facility"
                  className="facility-img"
                  style={{ width: '100%', borderRadius: '12px', boxShadow: '0 8px 24px rgba(16,38,61,0.12)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* F. Testimonials Strip */}
      <section className="section bg-light" aria-label="Customer Testimonials">
        <div className="site-container">
          <div className="section-header" style={{ textAlign: 'center', margin: '0 auto 40px auto' }}>
            <span className="section-eyebrow">Client Validation</span>
            <h2 className="section-title">Trusted by Process Engineers &amp; OEM Fabricators</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="card" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E3E8EF' }}>
              <div style={{ color: '#F59E0B', marginBottom: '12px' }}>★★★★★</div>
              <p style={{ color: '#202B38', fontStyle: 'italic', marginBottom: '16px' }}>
                "Lotus Tubes supplied our entire WFI pipe installation in SS 316L EP with Ra ≤ 0.38 µm. The MTC documentation passed the US FDA audit without a single observation."
              </p>
              <strong style={{ display: 'block', color: '#10263D' }}>Project Engineering Head</strong>
              <small style={{ color: '#667085' }}>Major Sterile Injectables Plant, Gujarat</small>
            </div>

            <div className="card" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E3E8EF' }}>
              <div style={{ color: '#F59E0B', marginBottom: '12px' }}>★★★★★</div>
              <p style={{ color: '#202B38', fontStyle: 'italic', marginBottom: '16px' }}>
                "Outstanding consistency in sanitary bends and tri-clamp ferrules. Smooth welds and flawless surface finish. Fast dispatch when we have urgent project deadlines."
              </p>
              <strong style={{ display: 'block', color: '#10263D' }}>Purchase Director</strong>
              <small style={{ color: '#667085' }}>Dairy Process Equipment Fabricator, Maharashtra</small>
            </div>

            <div className="card" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E3E8EF' }}>
              <div style={{ color: '#F59E0B', marginBottom: '12px' }}>★★★★★</div>
              <p style={{ color: '#202B38', fontStyle: 'italic', marginBottom: '16px' }}>
                "We export hygienic skids globally. Lotus Tubes is our go-to supplier for ASTM A270 sanitary tubes and pneumatic diaphragm valves. Always reliable."
              </p>
              <strong style={{ display: 'block', color: '#10263D' }}>Managing Director</strong>
              <small style={{ color: '#667085' }}>Biotech Skid Manufacturer, Mumbai</small>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;

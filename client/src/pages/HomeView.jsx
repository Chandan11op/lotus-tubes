import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORIES, PRODUCTS, INDUSTRIES } from '../data/siteData';
import ProductImage from '../components/common/ProductImage';

export const HomeView = ({ onOpenEnquiry, onOpenVideo }) => {
  const { t } = useLanguage();

  // Interactive Quick Spec Finder State
  const [selectedGrade, setSelectedGrade] = useState('SS 316L');
  const [selectedCategory, setSelectedCategory] = useState('Sanitary Pipes');
  const [selectedSize, setSelectedSize] = useState("");

  const handleQuickQuoteClick = (e) => {
    e.preventDefault();
    if (onOpenEnquiry) {
      onOpenEnquiry({
        name: `${selectedGrade} ${selectedCategory}`,
        material: selectedGrade,
        category: selectedCategory,
        sizes: selectedSize || 'To be confirmed',
        finish: 'EP / MP, subject to product availability'
      });
    } else {
      window.location.href = '/quote';
    }
  };

  return (
    <div className="modern-home-wrapper">
      {/* =========================================================================
          1. ASYMMETRIC EDITORIAL ENGINEERING HERO SECTION
          ========================================================================= */}
      <section className="editorial-hero" aria-label="Lotus Tubes Executive Overview">
        <div className="site-container editorial-hero__grid">
          
          {/* Left Column: Bold Editorial Typography & Direct Value Proposition */}
          <div className="editorial-hero__content">
            <div className="editorial-hero__eyebrow">
              <span className="eyebrow-pulse" />
              <span>SS 304 &bull; SS 316L &bull; EP / MP Finish Options</span>
            </div>

            <h1 className="editorial-hero__headline">
              Stainless Steel <br />
              <span className="text-gradient-blue">Sanitary Flow Systems.</span>
            </h1>

            <p className="editorial-hero__lead">
              Lotus Tubes supplies <strong>SS 304 and SS 316L</strong> sanitary pipes and tubes, pipe fittings, tri-clamp components and hygienic valves for pharmaceutical, dairy, food and beverage, brewery, chemical and water-treatment applications.
            </p>

            {/* Action Buttons */}
            <div className="editorial-hero__actions">
              <a href="/quote" className="btn-hero-primary" id="hero-quote-btn">
                <span>Request Formal BOQ Quotation</span>
                <span className="btn-arrow">&rarr;</span>
              </a>
              <a href="/products" className="btn-hero-secondary">
                <span>Explore Product Catalogue</span>
              </a>
            </div>

            {/* Quick Interactive Technical Spec Configurator */}
            <div className="hero-spec-calculator">
              <div className="calc-header">
                <span className="calc-icon">⚡</span>
                <span className="calc-title">Instant Technical Specification Configurator</span>
              </div>

              <div className="calc-grid">
                <div className="calc-group">
                  <label>Material Chemistry</label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="calc-select"
                  >
                    <option value="SS 316L">SS 316L</option>
                    <option value="SS 304">SS 304</option>
                  </select>
                </div>

                <div className="calc-group">
                  <label>Component Family</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="calc-select"
                  >
                    <option value="Sanitary Pipes">Sanitary Pipes &amp; Tubes</option>
                    <option value="Tri-Clamp Ferrules">Tri-Clamp Ferrules & Clamps</option>
                    <option value="Pipe Fittings">Sanitary Bends & Equal Tees</option>
                    <option value="Process Valves">Diaphragm & Butterfly Valves</option>
                  </select>
                </div>

                <div className="calc-group">
                  <label>Required Outside Diameter / Size</label>
                  <input
                    type="text"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    placeholder="Enter your required size"
                    className="calc-select"
                  />
                </div>
              </div>

              <div className="calc-result-bar">
                <div className="calc-metrics">
                  <span>Surface Finish: <strong>EP / MP, as available</strong></span>
                  <span>Standard: <strong>Confirmed per product</strong></span>
                  <span>MTC: <strong>Availability confirmed</strong></span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickQuoteClick}
                  className="calc-submit-btn"
                  id="calc-fast-quote-btn"
                >
                  Get Quote for this Spec &rarr;
                </button>
              </div>
            </div>

            {/* Quick Metrics Ticker */}
            <div className="editorial-hero__metrics">
              <div className="metric-item">
                <span className="metric-val">{t('metric_od_val', 'SS 304 / SS 316L')}</span>
                <span className="metric-lbl">{t('metric_od_lbl', 'Material grades')}</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-item">
                <span className="metric-val">{t('metric_ra_val', 'EP / MP')}</span>
                <span className="metric-lbl">{t('metric_ra_lbl', 'Surface finish options')}</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-item">
                <span className="metric-val">{t('metric_mtc_val', 'Product-specific')}</span>
                <span className="metric-lbl">{t('metric_mtc_lbl', 'Documentation availability')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-End Industrial Stainless Steel Cutaway Display */}
          <div className="editorial-hero__visual">
            <div className="metallic-card-container">
              {/* Central Metallic Tube / Component Showcase */}
              <div className="metallic-card">
                <div className="metallic-card__header">
                  <span className="badge-metallic">{t('badge_asme', 'SS 304 / SS 316L')}</span>
                  <span className="badge-heat-code">{t('badge_heat_code', 'PRODUCT DETAILS ON REQUEST')}</span>
                </div>

                <div className="metallic-card__media">
                  <img
                    src="/assets/images/products/ss-316l-ep-pipe.jpg"
                    alt="SS 316L Electro Polished Sanitary Tube Cutaway Inspection"
                    width="600"
                    height="400"
                    loading="lazy"
                    decoding="async"
                    className="metallic-card__img"
                  />
                  
                  {/* Interactive Hotspot Overlay Pins */}
                  <div className="hotspot-pin hotspot-pin--1" title={t('hotspot_finish_title', 'Internal Electropolished Finish')}>
                    <span className="hotspot-ping" />
                    <span className="hotspot-dot">1</span>
                    <div className="hotspot-tooltip">
                      <strong>{t('hotspot_finish_title', 'Ultra-Smooth Finish')}</strong>
                      <span>{t('hotspot_finish_desc', 'Electropolished or mechanically polished finish, subject to product availability.')}</span>
                    </div>
                  </div>

                  <div className="hotspot-pin hotspot-pin--2" title={t('hotspot_chem_title', 'Material Grade Options')}>
                    <span className="hotspot-ping" />
                    <span className="hotspot-dot">2</span>
                    <div className="hotspot-tooltip">
                      <strong>{t('hotspot_chem_title', 'Material Grade Options')}</strong>
                      <span>{t('hotspot_chem_desc', 'SS 316L grade option for applications requiring added corrosion resistance.')}</span>
                    </div>
                  </div>

                  <div className="hotspot-pin hotspot-pin--3" title={t('hotspot_dim_title', 'Dimensional Inspection')}>
                    <span className="hotspot-ping" />
                    <span className="hotspot-dot">3</span>
                    <div className="hotspot-tooltip">
                      <strong>{t('hotspot_dim_title', 'Product Specifications')}</strong>
                      <span>{t('hotspot_dim_desc', 'Dimensions and applicable specifications confirmed against the supplied product.')}</span>
                    </div>
                  </div>
                </div>

                <div className="metallic-card__footer">
                  <div className="footer-spec-row">
                    <div>
                      <span className="footer-spec-key">Product Line:</span>
                      <strong className="footer-spec-val">SS 316L EP Sanitary Pipe</strong>
                    </div>
                    <div>
                      <span className="footer-spec-key">Standard:</span>
                      <strong className="footer-spec-val">Confirmed per product</strong>
                    </div>
                  </div>
                  <div className="footer-badges-row">
                    <span className="pill-tag">Pharma Sterile WFI</span>
                    <span className="pill-tag">Clean-In-Place (CIP)</span>
                    <span className="pill-tag">Tri-Clamp Ends</span>
                  </div>
                </div>
              </div>

              {/* Subsidiary Floating Assurance Badge */}
              <div className="floating-cert-badge">
                <div className="cert-badge-icon">🛡️</div>
                <div className="cert-badge-text">
                  <strong>Material Test Documentation</strong>
                  <span>Mill Test Certificate availability can be confirmed for the supplied material.</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. INTERNATIONAL STANDARDS & ACCREDITATION BANNER
          ========================================================================= */}
{/* Standards strip removed from homepage layout as requested */}



      {/* =========================================================================
          3. ASEPTIC FLOW ARCHITECTURE (INTERACTIVE 5-STAGE PIPELINE)
          ========================================================================= */}
      <section className="section-aseptic-flow section--white" aria-label="Hygienic Flow System Overview">
        <div className="site-container">
          <div className="section-header-editorial">
            <span className="editorial-kicker">End-to-End Fluid Handling</span>
            <h2 className="editorial-title">The Complete Hygienic Flow Architecture</h2>
            <p className="editorial-subtitle">
              From sanitary tubing to fittings and flow-control components, Lotus Tubes brings the product families used to build, connect and control hygienic process lines into one sourcing conversation.
            </p>
          </div>

          <div className="flow-pipeline-grid">
            {/* Step 1 */}
            <div className="flow-step-card">
              <div className="flow-step-number">01</div>
              <div className="flow-step-icon">💧</div>
              <h3 className="flow-step-title">High-Purity Generation</h3>
              <p className="flow-step-desc">WFI, purified water, and clean steam lines demanding electrochemically polished internal contact surfaces.</p>
              <div className="flow-step-pill">SS 316L sanitary tube options</div>
            </div>

            {/* Step 2 */}
            <div className="flow-step-card">
              <div className="flow-step-number">02</div>
              <div className="flow-step-icon">🔄</div>
              <h3 className="flow-step-title">Process Distribution</h3>
              <p className="flow-step-desc">Seamless and welded tubes carrying media without microscopic micro-crevices or rough weld roots.</p>
              <div className="flow-step-pill">EP / MP finishes</div>
            </div>

            {/* Step 3 */}
            <div className="flow-step-card">
              <div className="flow-step-number">03</div>
              <div className="flow-step-icon">🔀</div>
              <h3 className="flow-step-title">Directional Manifolds</h3>
              <p className="flow-step-desc">Short and long-radius 90° bends, equal tees, and concentric reducers with matched wall thickness.</p>
              <div className="flow-step-pill">Butt-Weld &amp; Clamp Ends</div>
            </div>

            {/* Step 4 */}
            <div className="flow-step-card">
              <div className="flow-step-number">04</div>
              <div className="flow-step-icon">🛡️</div>
              <h3 className="flow-step-title">Aseptic Isolation</h3>
              <p className="flow-step-desc">Manual and pneumatic valve options for hygienic process applications, subject to model and availability.</p>
              <div className="flow-step-pill">Gasket materials confirmed per product</div>
            </div>

            {/* Step 5 */}
            <div className="flow-step-card">
              <div className="flow-step-number">05</div>
              <div className="flow-step-icon">🔗</div>
              <h3 className="flow-step-title">Quick-Release Coupling</h3>
              <p className="flow-step-desc">Tri-clamp ferrules, clamps and compatible gasket options for sanitary connections.</p>
              <div className="flow-step-pill">Connection options confirmed per product</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CORE PRODUCT LINES: THREE ARCHITECTURAL COMPONENT SUITES
          ========================================================================= */}
      <section className="section-component-suites section--light" aria-label="Core Component Ranges">
        <div className="site-container">
          <div className="section-header-editorial">
            <span className="editorial-kicker">Core Product Lines</span>
            <h2 className="editorial-title">Engineered for Aseptic Integrity</h2>
            <p className="editorial-subtitle">
              Explore the principal product groups available through Lotus Tubes. Sizes, finishes, material documents and dispatch timelines are confirmed for each enquiry.
            </p>
          </div>

          <div className="suites-grid">
            {/* Suite 1: Sanitary Tubes */}
            <div className="suite-card">
              <div className="suite-card__media">
                <img
                  src="/assets/images/categories/sanitary-pipes.jpg"
                  alt="Sanitary Stainless Steel Pipes & Tubes"
                  width="600"
                  height="400"
                  loading="lazy"
                  decoding="async"
                  className="suite-card__img"
                />
                <span className="suite-badge">Priority Line</span>
              </div>
              <div className="suite-card__body">
                <span className="suite-cat-label">Product options</span>
                <h3 className="suite-title">Sanitary Pipes &amp; Tubes</h3>
                <p className="suite-desc">
                  SS 304 and SS 316L sanitary pipes and tubes in welded or seamless options, with EP and MP finishes as available.
                </p>
                <div className="suite-specs-list">
                  <div><strong>Grades:</strong> SS 316L / SS 304</div>
                  <div><strong>Sizes:</strong> 1/2&quot; to 4.0&quot; OD (12.7 to 101.6 mm)</div>
                  <div><strong>Finish:</strong> EP / MP, as available</div>
                </div>
                <div className="suite-actions">
                  <a href="/category/sanitary-pipes" className="suite-link">
                    <span>Inspect Sanitary Tubing Catalogue</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Suite 2: Sanitary Pipe Fittings & Tri-Clamp */}
            <div className="suite-card">
              <div className="suite-card__media">
                <img
                  src="/assets/images/categories/sanitary-fittings.jpg"
                  alt="Sanitary Pipe Fittings, Bends & Tri-Clamps"
                  width="600"
                  height="400"
                  loading="lazy"
                  decoding="async"
                  className="suite-card__img"
                />
                <span className="suite-badge">Check Availability</span>
              </div>
              <div className="suite-card__body">
                <span className="suite-cat-label">Hygienic Flow Components</span>
                <h3 className="suite-title">Pipe Fittings &amp; Tri-Clamp Systems</h3>
                <p className="suite-desc">
                  90° and 45° bends, equal tees, reducing tees, concentric &amp; eccentric reducers, precision heavy-duty 13MHH clamps, and medical-grade silicone gaskets.
                </p>
                <div className="suite-specs-list">
                  <div><strong>Standards:</strong> 3-A, SMS, DIN, ISO</div>
                  <div><strong>Ends:</strong> Butt-Weld, Tri-Clamp, SMS/DIN Union</div>
                  <div><strong>Gaskets:</strong> Silicone, EPDM, Viton, PTFE</div>
                </div>
                <div className="suite-actions">
                  <a href="/category/sanitary-fittings" className="suite-link">
                    <span>Inspect Fittings &amp; Ferrules Range</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Suite 3: Sanitary Valves & Actuation */}
            <div className="suite-card">
              <div className="suite-card__media">
                <img
                  src="/assets/images/categories/manual-valves.jpg"
                  alt="Sanitary Butterfly & Diaphragm Process Valves"
                  width="600"
                  height="400"
                  loading="lazy"
                  decoding="async"
                  className="suite-card__img"
                />
                <span className="suite-badge">Aseptic Control</span>
              </div>
              <div className="suite-card__body">
                <span className="suite-cat-label">Sterile Flow Regulation</span>
                <h3 className="suite-title">Hygienic Process Valves</h3>
                <p className="suite-desc">
                  Product options include manual and pneumatic butterfly valves, diaphragm valves, ball valves, non-return valves and sampling valves, subject to availability.
                </p>
                <div className="suite-specs-list">
                  <div><strong>Body:</strong> Forged / Investment Cast SS 316L</div>
                  <div><strong>Operation:</strong> Manual Multi-Position / Pneumatic</div>
                  <div><strong>Pressure:</strong> Up to 10 Bar (145 PSI) WOG</div>
                </div>
                <div className="suite-actions">
                  <a href="/category/manual-valves" className="suite-link">
                    <span>Inspect Process Valves Catalogue</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. INTERACTIVE METALLURGY & FINISH COMPARATOR (SS 316L vs SS 304)
          ========================================================================= */}
{/* Material Engineering comparator removed from homepage layout as requested */}



      {/* =========================================================================
          6. IMMEDIATE AVAILABILITY & ENQUIRY COORDINATION
          ========================================================================= */}
      {/* ABOUT LOTUS TUBES — LEADERSHIP & TEAM */}
      <section className="lt-about-section" id="about-lotus-tubes" aria-labelledby="lt-about-title">
        <div className="site-container">
          <div className="lt-about-intro">
            <span className="editorial-kicker">About Lotus Tubes</span>
            <h2 className="editorial-title" id="lt-about-title">A focused team for dependable sanitary flow sourcing.</h2>
            <p>Lotus Tubes supplies stainless steel sanitary pipes, tubes, fittings and valves in SS 304 and SS 316L. Based in Mumbai, we support hygienic process requirements across pharmaceutical, dairy, food and beverage, brewery, chemical and water-treatment applications.</p>
            <p>Our approach is straightforward: understand the application, confirm material and dimensions, and provide a clear quotation based on actual availability. Specifications, finishes, sizes, applicable standards and documentation are confirmed for each supply.</p>
          </div>
          <div className="lt-founder-panel">
            <div className="lt-founder-mark" aria-hidden="true">LT</div>
            <div className="lt-founder-copy">
              <span className="lt-person-label">Chief Executive Officer</span>
              <h3>Chirag Shah</h3>
              <p>Guiding the business through customer relationships, commercial coordination and stainless steel sanitary product sourcing.</p>
              <span className="lt-person-note">A fuller personal introduction can be added after the founder approves the final biography.</span>
            </div>
            <div className="lt-founder-side">
              <span className="lt-side-overline">Business base</span>
              <strong>Mumbai, Maharashtra</strong>
              <span>India</span>
            </div>
          </div>
          <div className="lt-team-heading">
            <div>
              <span className="editorial-kicker">Our AI Team</span>
              <h3>People behind every enquiry.</h3>
            </div>
            <p>These AI team profiles are being configured. Individual role descriptions will be added once responsibilities are assigned.</p>
          </div>
          <div className="lt-team-grid">
            {[
              { name: 'Ananya Mehta', email: 'ananyamehta@lotustubes.com', initial: 'AM' },
              { name: 'Riya Shah', email: 'riyashah@lotustubes.com', initial: 'RS' },
              { name: 'Neha Desai', email: 'nehadesai@lotustubes.com', initial: 'ND' },
              { name: 'Arjun Yada', email: 'arjunyadav@lotustubes.com', initial: 'AY' }
            ].map((member) => (
              <article className="lt-team-card" key={member.email}>
                <div className="lt-team-avatar" aria-hidden="true">{member.initial}</div>
                <div className="lt-team-info">
                  <h4>{member.name}</h4>
                  <span className="lt-team-role">Role to be assigned</span>
                  <a href={`mailto:${member.email}`}>{member.email}</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-facility section--light" aria-label="Immediate product availability">
        <div className="site-container facility-grid">
          <div className="facility-media">
            <img
              src="/assets/images/categories/sanitary-pipes.jpg"
              alt="Stainless steel sanitary pipes available through Lotus Tubes"
              className="facility-img"
            />
            <div className="facility-badge-overlay">
              <div className="facility-badge-inner">
                <strong>Product Sourcing from Mumbai</strong>
                <span>Availability and delivery schedules are confirmed against each enquiry</span>
              </div>
            </div>
          </div>

          <div className="facility-content">
            <span className="editorial-kicker">Immediate Availability</span>
            <h2 className="editorial-title">Availability Confirmed Before You Order.</h2>
            <p className="editorial-lead">
              Based in Mumbai, Lotus Tubes coordinates enquiries for sanitary stainless steel products. Stock or procurement availability, specifications and delivery timelines are confirmed before an order is placed.
            </p>

            <div className="facility-features-list">
              <div className="facility-feat">
                <span className="feat-check">✓</span>
                <div>
                  <strong>Material &amp; Product Confirmation:</strong>
                  <p>Confirm the required product family and SS 304 or SS 316L grade against your application.</p>
                </div>
              </div>
              <div className="facility-feat">
                <span className="feat-check">✓</span>
                <div>
                  <strong>Size &amp; Finish Verification:</strong>
                  <p>Outside diameter, wall thickness, length, connection type and EP or MP finish are checked against the requested supply.</p>
                </div>
              </div>
              <div className="facility-feat">
                <span className="feat-check">✓</span>
                <div>
                  <strong>Documents &amp; Delivery:</strong>
                  <p>Applicable standards, MTC availability, quantity and estimated delivery schedule are confirmed for the specific order.</p>
                </div>
              </div>
            </div>

            <div className="facility-actions">
              <a href="/contact" className="btn-hero-primary">
                <span>Connect with Mumbai Sales Desk</span>
                <span>&rarr;</span>
              </a>
              <a href="/quality" className="btn-hero-secondary">
                <span>Inspect Quality Verification Protocol</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. PROCESS INDUSTRIES WE SERVE
          ========================================================================= */}
      <section className="section-industries section--white" aria-label="Industries Served">
        <div className="site-container">
          <div className="section-header-editorial">
            <span className="editorial-kicker">Industrial Applications</span>
            <h2 className="editorial-title">Product options for hygienic process industries</h2>
            <p className="editorial-subtitle">
              Product categories support hygienic process requirements across pharmaceutical, biotechnology, dairy, food and beverage, brewery, chemical and water-treatment applications.
            </p>
          </div>

          <div className="industries-editorial-grid">
            {INDUSTRIES.map((ind) => (
              <a href="/industries" key={ind.slug} className="ind-editorial-card">
                <div className="ind-card-img-wrap">
                  <ProductImage
                    src={`/assets/images/industries/${ind.slug}.jpg`}
                    fallbackSrc={ind.image || `/assets/images/industries/${ind.slug}.svg`}
                    alt={`${ind.name} Hygienic Stainless Steel Piping Applications`}
                    className="w-full h-full"
                    imgClassName="ind-card-img"
                    objectFit="cover"
                  />
                  <div className="ind-card-icon">{ind.icon}</div>
                </div>
                <div className="ind-card-body">
                  <h3 className="ind-card-title">{ind.name}</h3>
                  <p className="ind-card-desc">{ind.desc || 'Sanitary fluid handling product options for hygienic process applications.'}</p>
                  <span className="ind-card-link">View Application Standards &rarr;</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;

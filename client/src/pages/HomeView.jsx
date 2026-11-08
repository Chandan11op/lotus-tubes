import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CONFIG, PRODUCTS, INDUSTRIES, LEADERSHIP, AI_TEAM_MEMBERS } from '../data/siteData';
import ProductImage from '../components/common/ProductImage';

export const HomeView = ({ onOpenEnquiry }) => {
  const { t, currentLang, localizePath } = useLanguage();

  // Interactive Quick Spec Finder State
  const [selectedGrade, setSelectedGrade] = useState('SS 316L');
  const [selectedCategory, setSelectedCategory] = useState('Sanitary Pipes');
  const [selectedSize, setSelectedSize] = useState('');

  // Core Product Lines Filter Tab State
  const [activeProductTab, setActiveProductTab] = useState('all');

  const handleQuickQuoteClick = (e) => {
    e.preventDefault();
    if (onOpenEnquiry) {
      onOpenEnquiry({
        name: `${selectedGrade} ${selectedCategory}`,
        material: selectedGrade,
        category: selectedCategory,
        sizes: selectedSize || 'Customer specified dimensions',
        finish: 'EP / MP, subject to product availability'
      });
    } else {
      window.location.href = localizePath('/quote', currentLang);
    }
  };

  const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'Hello Lotus Tubes, I would like to enquire about stainless steel sanitary pipes, fittings and valves.'
  )}`;

  // Prioritized product selections per section requirements
  const prioritizedProducts = useMemo(() => {
    const pipeIds = [
      'ss-316l-ep-pipe',
      'ss-304-ep-pipe',
      'ss-316l-mp-pipe',
      'ss-304-mp-pipe',
      'ss-316l-sanitary-pipe',
      'ss-304-sanitary-pipe',
      'ss-316l-seamless-sanitary-tube',
      'ss-304-seamless-sanitary-tube'
    ];
    const fittingIds = [
      'ss-sanitary-90-bend',
      'ss-sanitary-equal-tee',
      'ss-sanitary-reducing-tee',
      'ss-sanitary-concentric-reducer',
      'ss-sanitary-eccentric-reducer',
      'ss-316l-fittings-range'
    ];
    const triclampIds = [
      'ss-tri-clamp-ferrule',
      'ss-tri-clamp-clamp',
      'silicone-tri-clamp-gasket',
      'epdm-tri-clamp-gasket',
      'ptfe-tri-clamp-gasket',
      'ss-sms-union'
    ];
    const valveIds = [
      'ss-sanitary-butterfly-valve',
      'ss-316l-diaphragm-valve',
      'ss-3-piece-ball-valve-tc',
      'pneumatic-sanitary-ball-valve',
      'ss-sanitary-non-return-valve',
      'ss-sanitary-sampling-valve'
    ];

    if (activeProductTab === 'pipes') {
      return PRODUCTS.filter((p) => pipeIds.includes(p.id));
    }
    if (activeProductTab === 'fittings') {
      return PRODUCTS.filter((p) => fittingIds.includes(p.id));
    }
    if (activeProductTab === 'triclamp') {
      return PRODUCTS.filter((p) => triclampIds.includes(p.id));
    }
    if (activeProductTab === 'valves') {
      return PRODUCTS.filter((p) => valveIds.includes(p.id));
    }

    // Default 'all' tab: balanced showcase of flagship items across all 4 categories
    const allPriorityIds = [
      'ss-316l-ep-pipe',
      'ss-304-ep-pipe',
      'ss-sanitary-90-bend',
      'ss-sanitary-equal-tee',
      'ss-tri-clamp-ferrule',
      'ss-tri-clamp-clamp',
      'ss-sanitary-butterfly-valve',
      'ss-316l-diaphragm-valve',
      'pneumatic-sanitary-ball-valve',
      'silicone-tri-clamp-gasket',
      'ss-sanitary-concentric-reducer',
      'ss-316l-seamless-sanitary-tube'
    ];
    return PRODUCTS.filter((p) => allPriorityIds.includes(p.id));
  }, [activeProductTab]);

  return (
    <div className="modern-home-wrapper">
      {/* =========================================================================
          SECTION 1 — HERO SECTION
          ========================================================================= */}
      <section className="editorial-hero" aria-label="Lotus Tubes Executive Overview">
        <div className="site-container editorial-hero__grid">
          
          {/* Left Column: Bold Editorial Typography & Direct Value Proposition */}
          <div className="editorial-hero__content">
            <div className="editorial-hero__eyebrow">
              <span className="eyebrow-pulse" />
              <span>SS 304 &bull; SS 316L &bull; High-Purity Sanitary Flow Systems</span>
            </div>

            <h1 className="editorial-hero__headline">
              Stainless Steel <br />
              <span className="text-gradient-blue">Sanitary Pipes, Fittings &amp; Valves</span>
            </h1>

            <p className="editorial-hero__lead">
              Lotus Tubes supplies SS 304 and SS 316L sanitary pipes and tubes, pipe fittings, tri-clamp components and hygienic valves for pharmaceutical, dairy, food and beverage, brewery, chemical and water-treatment applications.
            </p>

            {/* 3 Primary Action Buttons */}
            <div className="editorial-hero__actions">
              <a href={localizePath('/products', currentLang)} className="btn-hero-primary" id="hero-explore-btn">
                <span>Explore Products</span>
                <span className="btn-arrow">&rarr;</span>
              </a>
              <a href={localizePath('/quote', currentLang)} className="btn-hero-secondary" id="hero-quote-btn">
                <span>Request a Quote</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hero-whatsapp"
                id="hero-whatsapp-btn"
              >
                <span>🟢 Enquire on WhatsApp</span>
              </a>
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
              {/* Central Metallic Component Showcase */}
              <div className="metallic-card">
                <div className="metallic-card__header">
                  <span className="badge-metallic">SS 304 / SS 316L</span>
                  <span className="badge-heat-code">SPECIFICATIONS CONFIRMED ON ENQUIRY</span>
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
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — END-TO-END FLUID HANDLING (3 LOGICAL STAGES: CARRY, CONNECT, CONTROL)
          ========================================================================= */}
      <section className="section-aseptic-flow section--white" aria-label="End-to-End Fluid Handling">
        <div className="site-container">
          <div className="section-header-editorial">
            <span className="editorial-kicker">End-to-End Fluid Handling</span>
            <h2 className="editorial-title">The Complete Hygienic Flow Ecosystem</h2>
            <p className="editorial-subtitle">
              From sanitary tubing to fittings and flow-control components, Lotus Tubes organizes your fluid handling requirements into three logical stages: Carry, Connect, and Control.
            </p>
          </div>

          <div className="flow-pipeline-grid flow-pipeline-grid--3cols">
            {/* Stage 01: Carry */}
            <div className="flow-step-card">
              <div className="flow-step-top">
                <span className="flow-step-number">01</span>
                <span className="flow-step-icon">🚚</span>
              </div>
              <h3 className="flow-step-title">Carry</h3>
              <p className="flow-step-lead">Sanitary stainless steel pipes and tubes.</p>
              <p className="flow-step-desc">
                High-purity seamless and welded tubes in SS 304 and SS 316L with EP (electropolished) and MP (mechanically polished) mirror finishes engineered for sterile fluid conveyance without microscopic bacterial crevices.
              </p>
              <div className="flow-step-pill">SS 304 &bull; SS 316L &bull; Welded &amp; Seamless</div>
              <div className="flow-step-action">
                <a href={localizePath('/category/sanitary-pipes', currentLang)} className="flow-step-link">
                  <span>Explore Sanitary Tubes</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>

            {/* Stage 02: Connect */}
            <div className="flow-step-card">
              <div className="flow-step-top">
                <span className="flow-step-number">02</span>
                <span className="flow-step-icon">🔗</span>
              </div>
              <h3 className="flow-step-title">Connect</h3>
              <p className="flow-step-lead">Sanitary bends, tees, reducers, ferrules, clamps, unions and gaskets.</p>
              <p className="flow-step-desc">
                Precision hygienic fittings ensuring smooth flow transitions and leak-free sterile connections: orbital 90° &amp; 45° bends, equal tees, concentric/eccentric reducers, heavy-duty 13MHH clamps, and medical-grade USP Class VI gaskets.
              </p>
              <div className="flow-step-pill">Bends &amp; Tees &bull; Tri-Clamp Ferrules &bull; Gaskets</div>
              <div className="flow-step-action">
                <a href={localizePath('/category/sanitary-fittings', currentLang)} className="flow-step-link">
                  <span>Explore Fittings &amp; Tri-Clamp</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>

            {/* Stage 03: Control */}
            <div className="flow-step-card">
              <div className="flow-step-top">
                <span className="flow-step-number">03</span>
                <span className="flow-step-icon">🎛️</span>
              </div>
              <h3 className="flow-step-title">Control</h3>
              <p className="flow-step-lead">Manual and pneumatic valves for hygienic process applications.</p>
              <p className="flow-step-desc">
                Aseptic process regulation with forged SS 316L manual butterfly valves, aseptic diaphragm valves, sanitary ball valves, non-return check valves, and automated pneumatic actuators for sterile CIP/SIP environments.
              </p>
              <div className="flow-step-pill">Butterfly &bull; Diaphragm &bull; Pneumatic Actuators</div>
              <div className="flow-step-action">
                <a href={localizePath('/category/manual-valves', currentLang)} className="flow-step-link">
                  <span>Explore Process Valves</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — CORE PRODUCT LINES
          ========================================================================= */}
      <section className="section-component-suites section--light" aria-label="Core Product Lines">
        <div className="site-container">
          <div className="section-header-editorial">
            <span className="editorial-kicker">Core Product Lines</span>
            <h2 className="editorial-title">Engineered for Aseptic Integrity</h2>
            <p className="editorial-subtitle">
              Explore the principal product lines available through Lotus Tubes. Specifications, finishes, material test documents, and dispatch timelines are confirmed for each specific enquiry.
            </p>
          </div>

          {/* Interactive Category Navigation Tabs */}
          <div className="core-tabs-bar" role="tablist" aria-label="Product Categories">
            <button
              type="button"
              role="tab"
              aria-selected={activeProductTab === 'all'}
              className={`core-tab-btn ${activeProductTab === 'all' ? 'is-active' : ''}`}
              onClick={() => setActiveProductTab('all')}
            >
              All Core Products
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeProductTab === 'pipes'}
              className={`core-tab-btn ${activeProductTab === 'pipes' ? 'is-active' : ''}`}
              onClick={() => setActiveProductTab('pipes')}
            >
              Sanitary Pipes &amp; Tubes
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeProductTab === 'fittings'}
              className={`core-tab-btn ${activeProductTab === 'fittings' ? 'is-active' : ''}`}
              onClick={() => setActiveProductTab('fittings')}
            >
              Sanitary Pipe Fittings
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeProductTab === 'triclamp'}
              className={`core-tab-btn ${activeProductTab === 'triclamp' ? 'is-active' : ''}`}
              onClick={() => setActiveProductTab('triclamp')}
            >
              Tri-Clamp Components &amp; Gaskets
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeProductTab === 'valves'}
              className={`core-tab-btn ${activeProductTab === 'valves' ? 'is-active' : ''}`}
              onClick={() => setActiveProductTab('valves')}
            >
              Hygienic Process Valves
            </button>
          </div>

          {/* Responsive Core Products Grid */}
          <div className="core-products-grid">
            {prioritizedProducts.map((p) => {
              const productUrl = localizePath(`/product/${p.slug || p.id}`, currentLang);
              return (
                <article key={p.id} className="core-product-card">
                  <div className="core-product-card__media">
                    <a href={productUrl} tabIndex="-1" aria-hidden="true">
                      <img
                        src={p.image}
                        alt={p.name}
                        width="300"
                        height="225"
                        loading="lazy"
                        decoding="async"
                      />
                    </a>
                  </div>

                  <div className="core-product-card__body">
                    <div className="core-product-card__tags">
                      <span className="core-tag core-tag--grade">{p.material || 'SS 316L / 304'}</span>
                      {p.finish && (
                        <span className="core-tag core-tag--finish">{p.finish.split(' ')[0]}</span>
                      )}
                    </div>

                    <h3 className="core-product-card__title">
                      <a href={productUrl}>{p.name}</a>
                    </h3>

                    <p className="core-product-card__specs">
                      {p.standard ? `Standard: ${p.standard}` : 'Specification confirmed on enquiry'}
                    </p>

                    <div className="core-product-card__actions">
                      <a href={productUrl} className="core-btn-explore">
                        <span>Explore</span>
                        <span>&rarr;</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => onOpenEnquiry && onOpenEnquiry(p, p.name)}
                        className="core-btn-rfq"
                      >
                        Request Quote
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Section Footer Callout */}
          <div className="text-center mt-10">
            <a href={localizePath('/products', currentLang)} className="btn-hero-primary inline-flex">
              <span>View Full 30+ Sanitary Component Catalogue</span>
              <span className="btn-arrow">&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — ABOUT US & OUR AI TEAM
          ========================================================================= */}
      <section className="lt-about-section" id="about-lotus-tubes" aria-labelledby="lt-about-title">
        <div className="site-container">
          {/* Company Introduction */}
          <div className="lt-about-intro">
            <span className="editorial-kicker">About Lotus Tubes</span>
            <h2 className="editorial-title" id="lt-about-title">
              A focused team for dependable sanitary flow sourcing.
            </h2>
            <p>
              Lotus Tubes supplies stainless steel sanitary pipes and tubes, fittings and valves in SS 304 and SS 316L. Based in Mumbai, India, the company supports hygienic process requirements across pharmaceutical, dairy, food and beverage, brewery, chemical and water-treatment industries.
            </p>
            <p>
              Our approach is focused on understanding customer requirements, confirming product specifications and providing suitable sourcing and quotation options based on actual availability.
            </p>
          </div>

          {/* Owner Profile Card */}
          <div className="lt-owner-card-panel">
            <div className="lt-owner-media">
              <img
                src={LEADERSHIP.photo || '/assets/images/team/owner.jpeg'}
                alt={`${LEADERSHIP.name} - ${LEADERSHIP.title || LEADERSHIP.designation}`}
                className="lt-owner-img"
                width="140"
                height="140"
                loading="lazy"
              />
              <span className="lt-owner-status-badge">
                <span className="lt-status-dot"></span> Executive Leadership
              </span>
            </div>
            <div className="lt-owner-copy">
              <div className="lt-owner-header-row">
                <div>
                  <span className="lt-person-label">{LEADERSHIP.title || 'Owner & Managing Director'}</span>
                  <h3 className="lt-owner-name">{LEADERSHIP.name}</h3>
                </div>
                <div className="lt-owner-location-pill">
                  <span className="lt-loc-icon">📍</span>
                  <span>{LEADERSHIP.location}</span>
                </div>
              </div>
              <p className="lt-owner-summary">{LEADERSHIP.summary}</p>
              <div className="lt-owner-pillars">
                <span className="lt-pill-tag">✓ 20+ Years Metallurgical Sourcing</span>
                <span className="lt-pill-tag">✓ ASTM A270 &amp; ASME BPE Quality Oversight</span>
                <span className="lt-pill-tag">✓ Mandatory Super Admin Dispatch Review</span>
              </div>
            </div>
          </div>

          {/* Our Team Subsection */}
          <div className="lt-team-heading">
            <div>
              <span className="editorial-kicker">Our Team</span>
              <h3>Dedicated Operations Specialists Supporting Every Client Account</h3>
            </div>
            <p>
              Our experienced team of procurement, billing, engineering, and client operations professionals works in close coordination with Managing Director Chirag Shah to guarantee rapid technical quotations, exact ASME/ASTM compliance, and seamless customer service.
            </p>
          </div>

          {/* Team Members in Responsive Grid */}
          <div className="lt-team-2x2-grid">
            {AI_TEAM_MEMBERS.map((member) => (
              <article className="lt-team-card" key={member.id}>
                <div className="lt-team-card__image-container">
                  <img
                    src={member.photo}
                    alt={`${member.name} - ${member.role}`}
                    className="lt-team-card__img"
                    width="400"
                    height="400"
                    loading="lazy"
                  />
                  <div className="lt-team-card__dept-pill">
                    {member.department || 'Operations'}
                  </div>
                </div>

                <div className="lt-team-card__sheet">
                  <div className="lt-team-card__top">
                    <div className="lt-team-card__name-row">
                      <h4 className="lt-team-card__name">{member.name}</h4>
                      <span className="lt-team-card__status">
                        <span className="lt-pulse-dot" /> {member.status || 'Available'}
                      </span>
                    </div>
                    <span className="lt-team-card__role">{member.role}</span>
                    <a href={`mailto:${member.email}`} className="lt-team-card__email" title={`Email ${member.name}`}>
                      ✉️ {member.email}
                    </a>
                  </div>

                  <div className="lt-team-card__body">
                    <p className="lt-team-card__summary">{member.summary}</p>
                    {member.value && (
                      <div className="lt-team-card__value">
                        <strong>Client Value:</strong> {member.value}
                      </div>
                    )}
                  </div>

                  <div className="lt-team-card__footer">
                    <div className="lt-team-card__channels">
                      {member.channels?.map((ch, idx) => (
                        <span key={idx} className="lt-team-card__tag">{ch}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — IMMEDIATE AVAILABILITY
          ========================================================================= */}
      <section className="section-facility section--light" aria-label="Immediate product availability">
        <div className="site-container facility-grid">
          <div className="facility-media">
            <img
              src="/assets/images/categories/sanitary-pipes.jpg"
              alt="Stainless steel sanitary pipes available through Lotus Tubes"
              className="facility-img"
              width="600"
              height="450"
              loading="lazy"
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
                  <strong>Product Availability Confirmation:</strong>
                  <p>Confirm the required product family and SS 304 or SS 316L grade against your application.</p>
                </div>
              </div>
              <div className="facility-feat">
                <span className="feat-check">✓</span>
                <div>
                  <strong>Size &amp; Specification Verification:</strong>
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

            {/* 3 Call-To-Action Options */}
            <div className="facility-actions">
              <button
                type="button"
                onClick={() => onOpenEnquiry && onOpenEnquiry(null, 'Immediate Availability & Stock Verification')}
                className="btn-hero-primary"
              >
                <span>Check Availability</span>
                <span>&rarr;</span>
              </button>
              <a href={localizePath('/quote', currentLang)} className="btn-hero-secondary">
                <span>Request a Quote</span>
              </a>
              <a href={localizePath('/contact', currentLang)} className="btn-hero-secondary">
                <span>Contact Sales</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6 — INDUSTRIAL APPLICATIONS (8 HYGIENIC PROCESS SECTORS)
          ========================================================================= */}
      <section className="section-industries section--white" aria-label="Industrial Applications">
        <div className="site-container">
          <div className="section-header-editorial">
            <span className="editorial-kicker">Industrial Applications</span>
            <h2 className="editorial-title">Product options for hygienic process industries</h2>
            <p className="editorial-subtitle">
              Product categories support hygienic process requirements across pharmaceutical, biotechnology, dairy processing, food processing, food &amp; beverage, breweries, chemical processing and water treatment applications.
            </p>
          </div>

          <div className="industries-editorial-grid">
            {INDUSTRIES.map((ind) => (
              <a href={localizePath('/industries', currentLang)} key={ind.slug} className="ind-editorial-card">
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
                  <p className="ind-card-desc">
                    {ind.summary || ind.desc || 'Sanitary fluid handling product options for hygienic process applications.'}
                  </p>
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

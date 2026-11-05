import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORIES, PRODUCTS, INDUSTRIES } from '../data/siteData';
import ProductImage from '../components/common/ProductImage';

export const HomeView = ({ onOpenEnquiry, onOpenVideo }) => {
  const { t } = useLanguage();

  // Interactive Quick Spec Finder State
  const [selectedGrade, setSelectedGrade] = useState('SS 316L');
  const [selectedCategory, setSelectedCategory] = useState('Sanitary Pipes');
  const [selectedSize, setSelectedSize] = useState('2.0" (50.8 mm OD)');

  // Metallurgy Tab State
  const [activeMetalTab, setActiveMetalTab] = useState('316L');

  const handleQuickQuoteClick = (e) => {
    e.preventDefault();
    if (onOpenEnquiry) {
      onOpenEnquiry({
        name: `${selectedGrade} ${selectedCategory}`,
        material: selectedGrade,
        category: selectedCategory,
        sizes: selectedSize,
        finish: selectedGrade === 'SS 316L' ? 'Electro-Polished (EP Ra ≤ 0.38µm)' : 'Mechanical Mirror Polish (MP Ra ≤ 0.8µm)'
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
              <span>ASTM A270 &bull; ASME BPE &bull; EN 10204 3.1 CERTIFIED</span>
            </div>

            <h1 className="editorial-hero__headline">
              Aseptic Stainless Steel <br />
              <span className="text-gradient-blue">Sanitary Flow Systems.</span>
            </h1>

            <p className="editorial-hero__lead">
              Precision manufacturer, stockist, and global exporter of electropolished <strong>SS 316L &amp; SS 304</strong> sanitary pipes, tri-clamp ferrules, hygienic fittings, and sterile process valves engineered for critical pharmaceutical, biotechnology, dairy, and beverage infrastructure.
            </p>

            {/* Action Buttons */}
            <div className="editorial-hero__actions">
              <a href="/quote" className="btn-hero-primary" id="hero-quote-btn">
                <span>Request Formal BOQ Quotation</span>
                <span className="btn-arrow">&rarr;</span>
              </a>
              <a href="/products" className="btn-hero-secondary">
                <span>Explore 50+ Component Catalogue</span>
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
                    <option value="SS 316L">SS 316L (Molybdenum Pharma Grade)</option>
                    <option value="SS 304">SS 304 (Hygienic Dairy & Food Grade)</option>
                  </select>
                </div>

                <div className="calc-group">
                  <label>Component Family</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="calc-select"
                  >
                    <option value="Sanitary Pipes">ASTM A270 Sanitary Tubes</option>
                    <option value="Tri-Clamp Ferrules">Tri-Clamp Ferrules & Clamps</option>
                    <option value="Pipe Fittings">Sanitary Bends & Equal Tees</option>
                    <option value="Process Valves">Diaphragm & Butterfly Valves</option>
                  </select>
                </div>

                <div className="calc-group">
                  <label>Nominal Outside Diameter</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="calc-select"
                  >
                    <option value="0.5&quot; (12.7 mm OD)">0.5&quot; (12.7 mm OD)</option>
                    <option value="1.0&quot; (25.4 mm OD)">1.0&quot; (25.4 mm OD)</option>
                    <option value="1.5&quot; (38.1 mm OD)">1.5&quot; (38.1 mm OD)</option>
                    <option value="2.0&quot; (50.8 mm OD)">2.0&quot; (50.8 mm OD)</option>
                    <option value="2.5&quot; (63.5 mm OD)">2.5&quot; (63.5 mm OD)</option>
                    <option value="3.0&quot; (76.2 mm OD)">3.0&quot; (76.2 mm OD)</option>
                    <option value="4.0&quot; (101.6 mm OD)">4.0&quot; (101.6 mm OD)</option>
                  </select>
                </div>
              </div>

              <div className="calc-result-bar">
                <div className="calc-metrics">
                  <span>Surface Finish: <strong>Ra ≤ 0.38 µm (EP)</strong></span>
                  <span>Tolerance: <strong>ASTM A270 / A269</strong></span>
                  <span>MTC: <strong>EN 10204 3.1 Supplied</strong></span>
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
                <span className="metric-val">{t('metric_od_val', '1/2" to 4.0"')}</span>
                <span className="metric-lbl">{t('metric_od_lbl', 'Ready Stock Sanitary OD')}</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-item">
                <span className="metric-val">{t('metric_ra_val', 'Ra ≤ 0.38 µm')}</span>
                <span className="metric-lbl">{t('metric_ra_lbl', 'Electro-Polished Internal Bore')}</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-item">
                <span className="metric-val">{t('metric_mtc_val', '100% Traceable')}</span>
                <span className="metric-lbl">{t('metric_mtc_lbl', 'EN 10204 3.1 Test Certificates')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-End Industrial Stainless Steel Cutaway Display */}
          <div className="editorial-hero__visual">
            <div className="metallic-card-container">
              {/* Central Metallic Tube / Component Showcase */}
              <div className="metallic-card">
                <div className="metallic-card__header">
                  <span className="badge-metallic">{t('badge_asme', 'ASME BPE COMPLIANT')}</span>
                  <span className="badge-heat-code">{t('badge_heat_code', 'HEAT TRACEABLE: LT-316L-9402')}</span>
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
                      <span>{t('hotspot_finish_desc', 'Ra ≤ 0.38 µm Mirror Polish prevents bacterial biofilm growth')}</span>
                    </div>
                  </div>

                  <div className="hotspot-pin hotspot-pin--2" title={t('hotspot_chem_title', 'Material Chemistry Integrity')}>
                    <span className="hotspot-ping" />
                    <span className="hotspot-dot">2</span>
                    <div className="hotspot-tooltip">
                      <strong>{t('hotspot_chem_title', 'Molybdenum Chemistry')}</strong>
                      <span>{t('hotspot_chem_desc', '2.5% Mo + 17% Cr for maximum pitting and chloride corrosion resistance')}</span>
                    </div>
                  </div>

                  <div className="hotspot-pin hotspot-pin--3" title={t('hotspot_dim_title', 'Dimensional Inspection')}>
                    <span className="hotspot-ping" />
                    <span className="hotspot-dot">3</span>
                    <div className="hotspot-tooltip">
                      <strong>{t('hotspot_dim_title', 'Precision Calibration')}</strong>
                      <span>{t('hotspot_dim_desc', 'Eddy-Current tested with strict ASTM A270 wall thickness consistency')}</span>
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
                      <strong className="footer-spec-val">ASTM A270 / ASME BPE</strong>
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
                  <strong>EN 10204 3.1 Mill Test Reports</strong>
                  <span>Chemical &amp; mechanical validation certificates shipped with every order</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. INTERNATIONAL STANDARDS & ACCREDITATION BANNER
          ========================================================================= */}
      <section className="standards-strip" aria-label="Certified Engineering Standards">
        <div className="site-container standards-strip__inner">
          <span className="standards-strip__title">Certified Engineering Standards:</span>
          <div className="standards-strip__logos">
            <a href="https://www.astm.org/" target="_blank" rel="noopener noreferrer" className="standard-item" title="ASTM International Official Standards">
              <span className="standard-code">ASTM A270</span>
              <span className="standard-desc">Sanitary Tubing Specification</span>
            </a>
            <a href="https://www.asme.org/" target="_blank" rel="noopener noreferrer" className="standard-item" title="ASME Bioprocessing Equipment Standards">
              <span className="standard-code">ASME BPE</span>
              <span className="standard-desc">Bioprocessing Equipment</span>
            </a>
            <a href="https://www.3-a.org/" target="_blank" rel="noopener noreferrer" className="standard-item" title="3-A Sanitary Standards for Dairy & Food">
              <span className="standard-code">3-A SANITARY</span>
              <span className="standard-desc">Hygienic Food &amp; Dairy</span>
            </a>
            <div className="standard-item">
              <span className="standard-code">EN 10204 3.1</span>
              <span className="standard-desc">Mill Test Certification</span>
            </div>
            <div className="standard-item">
              <span className="standard-code">ISO 2852 / 11851</span>
              <span className="standard-desc">Tri-Clamp &amp; DIN Unions</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. ASEPTIC FLOW ARCHITECTURE (INTERACTIVE 5-STAGE PIPELINE)
          ========================================================================= */}
      <section className="section-aseptic-flow section--white" aria-label="Hygienic Flow System Overview">
        <div className="site-container">
          <div className="section-header-editorial">
            <span className="editorial-kicker">End-to-End Fluid Handling</span>
            <h2 className="editorial-title">The Complete Hygienic Flow Architecture</h2>
            <p className="editorial-subtitle">
              From water-for-injection (WFI) generation to final sterile filling, Lotus Tubes delivers mathematically coordinated piping components guaranteed for aseptic cleanability and zero deadleg flow.
            </p>
          </div>

          <div className="flow-pipeline-grid">
            {/* Step 1 */}
            <div className="flow-step-card">
              <div className="flow-step-number">01</div>
              <div className="flow-step-icon">💧</div>
              <h3 className="flow-step-title">High-Purity Generation</h3>
              <p className="flow-step-desc">WFI, purified water, and clean steam lines demanding electrochemically polished internal contact surfaces.</p>
              <div className="flow-step-pill">ASTM A270 SS 316L EP</div>
            </div>

            {/* Step 2 */}
            <div className="flow-step-card">
              <div className="flow-step-number">02</div>
              <div className="flow-step-icon">🔄</div>
              <h3 className="flow-step-title">Process Distribution</h3>
              <p className="flow-step-desc">Seamless and welded tubes carrying media without microscopic micro-crevices or rough weld roots.</p>
              <div className="flow-step-pill">Ra ≤ 0.38 µm Uniformity</div>
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
              <p className="flow-step-desc">Sanitary diaphragm, butterfly, and check valves designed for CIP/SIP sterilization cycles up to 150°C.</p>
              <div className="flow-step-pill">USP Class VI Diaphragms</div>
            </div>

            {/* Step 5 */}
            <div className="flow-step-card">
              <div className="flow-step-number">05</div>
              <div className="flow-step-icon">🔗</div>
              <h3 className="flow-step-title">Quick-Release Coupling</h3>
              <p className="flow-step-desc">Precision machined 13MHH Tri-Clamp ferrules and food-grade silicone/PTFE elastomeric gaskets.</p>
              <div className="flow-step-pill">Zero Puddle Drainage</div>
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
              Sourced in verified chemical heats, calibrated for exact dimensional tolerance, and backed by immediate warehouse dispatch from Mumbai.
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
                <span className="suite-cat-label">ASTM A270 / ASME BPE</span>
                <h3 className="suite-title">Sanitary Pipes &amp; Tubes</h3>
                <p className="suite-desc">
                  Seamless and welded tubing in SS 304 and SS 316L with electropolished (EP) and mechanical (MP) mirror finishes. Fully tested with eddy-current and hydrostatic verification.
                </p>
                <div className="suite-specs-list">
                  <div><strong>Grades:</strong> SS 316L / SS 304</div>
                  <div><strong>Sizes:</strong> 1/2&quot; to 4.0&quot; OD (12.7 to 101.6 mm)</div>
                  <div><strong>Finish:</strong> Ra ≤ 0.38 µm (15 µin) Internal</div>
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
                <span className="suite-badge">Stocked Ready</span>
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
                  Manual and pneumatic butterfly valves, aseptic diaphragm valves, non-return check valves, and sampling cocks built with zero deadleg geometry for CIP systems.
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
      <section className="section-comparator section--white" aria-label="Metallurgical Specification Comparison">
        <div className="site-container">
          <div className="section-header-editorial">
            <span className="editorial-kicker">Material Engineering</span>
            <h2 className="editorial-title">Select the Correct Chemistry for Your Process</h2>
            <p className="editorial-subtitle">
              Understanding the critical differences between pharmaceutical-grade SS 316L and food-grade SS 304 to prevent pitting, crevice corrosion, and contamination.
            </p>
          </div>

          <div className="comparator-container">
            {/* Tab Controller */}
            <div className="comparator-tabs">
              <button
                type="button"
                className={`comparator-tab ${activeMetalTab === '316L' ? 'active' : ''}`}
                onClick={() => setActiveMetalTab('316L')}
              >
                <span>SS 316L (Pharma &amp; Biotech High-Purity)</span>
              </button>
              <button
                type="button"
                className={`comparator-tab ${activeMetalTab === '304' ? 'active' : ''}`}
                onClick={() => setActiveMetalTab('304')}
              >
                <span>SS 304 / 304L (Food, Dairy &amp; Beverage)</span>
              </button>
            </div>

            {/* Tab 1: SS 316L */}
            {activeMetalTab === '316L' && (
              <div className="comparator-body">
                <div className="comparator-col-info">
                  <div className="comparator-badge">High Molybdenum Content</div>
                  <h3 className="comparator-heading">SS 316L (UNS S31603 / 1.4404)</h3>
                  <p className="comparator-desc">
                    Contains 2.0% to 3.0% Molybdenum, providing exceptional resistance to pitting corrosion in chloride-containing media, clean steam, and saline formulations. The ultra-low carbon content (≤ 0.03%) eliminates carbide precipitation during orbital butt-welding.
                  </p>
                  <ul className="comparator-bullets">
                    <li>Recommended for: WFI (Water-For-Injection), Injectables, Vaccines, Bio-Fermenters</li>
                    <li>Surface Roughness: Internal Electropolish Ra ≤ 0.38 µm (15 µin) standard</li>
                    <li>Certification: EN 10204 3.1 MTR with full chemical heat breakdown</li>
                  </ul>
                  <a href="/quote" className="btn-comparator-rfq">
                    Request SS 316L Project Quote &rarr;
                  </a>
                </div>

                <div className="comparator-col-table">
                  <h4 className="table-heading">Certified Chemical Composition (ASTM A270 / A269)</h4>
                  <table className="metallurgy-table">
                    <thead>
                      <tr>
                        <th>Element</th>
                        <th>Standard %</th>
                        <th>Lotus Tubes Certified</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Carbon (C)</td>
                        <td>≤ 0.030% max</td>
                        <td className="highlight-pass">0.021% (Ultra-Low)</td>
                      </tr>
                      <tr>
                        <td>Molybdenum (Mo)</td>
                        <td>2.00 - 3.00%</td>
                        <td className="highlight-pass">2.18% (Pitting Defense)</td>
                      </tr>
                      <tr>
                        <td>Chromium (Cr)</td>
                        <td>16.00 - 18.00%</td>
                        <td className="highlight-pass">17.20% (Passive Film)</td>
                      </tr>
                      <tr>
                        <td>Nickel (Ni)</td>
                        <td>10.00 - 14.00%</td>
                        <td className="highlight-pass">11.45% (Austenitic)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: SS 304 */}
            {activeMetalTab === '304' && (
              <div className="comparator-body">
                <div className="comparator-col-info">
                  <div className="comparator-badge comparator-badge--blue">Cost-Effective Sanitary</div>
                  <h3 className="comparator-heading">SS 304 / 304L (UNS S30403 / 1.4307)</h3>
                  <p className="comparator-desc">
                    The international benchmark for dairy, milk processing, breweries, fruit juice transfer, and food processing lines. Excellent formability, mechanical strength, and hygienic cleanability under standard CIP washing conditions.
                  </p>
                  <ul className="comparator-bullets">
                    <li>Recommended for: Raw Milk Pipelines, Beer &amp; Wine Transfer, Pure Water, Syrup Lines</li>
                    <li>Surface Roughness: Mechanical mirror polish Ra ≤ 0.8 µm (320 Grit) or Ra ≤ 0.5 µm</li>
                    <li>Economical Advantage: Approximately 25-30% lower cost than molybdenum 316L</li>
                  </ul>
                  <a href="/quote" className="btn-comparator-rfq">
                    Request SS 304 Project Quote &rarr;
                  </a>
                </div>

                <div className="comparator-col-table">
                  <h4 className="table-heading">Certified Chemical Composition (ASTM A270 / A269)</h4>
                  <table className="metallurgy-table">
                    <thead>
                      <tr>
                        <th>Element</th>
                        <th>Standard %</th>
                        <th>Lotus Tubes Certified</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Carbon (C)</td>
                        <td>≤ 0.035% max</td>
                        <td className="highlight-pass">0.026% (Low Carbon)</td>
                      </tr>
                      <tr>
                        <td>Molybdenum (Mo)</td>
                        <td>None / Residual</td>
                        <td>N/A (Standard Food Use)</td>
                      </tr>
                      <tr>
                        <td>Chromium (Cr)</td>
                        <td>18.00 - 20.00%</td>
                        <td className="highlight-pass">18.40% (Corrosion Film)</td>
                      </tr>
                      <tr>
                        <td>Nickel (Ni)</td>
                        <td>8.00 - 12.00%</td>
                        <td className="highlight-pass">8.60% (Austenitic)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. WAREHOUSE & STOCKHUB STATEMENT (GIRGAON, MUMBAI FACILITY)
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
              <span className="lt-person-label">Founder / Business Lead</span>
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
              <span className="editorial-kicker">Our Team</span>
              <h3>People behind every enquiry.</h3>
            </div>
            <p>Team responsibilities are being finalised. Individual role descriptions will be published once assigned.</p>
          </div>
          <div className="lt-team-grid">
            {[
              { name: 'Ananya Mehta', email: 'ananyamehta@lotustubes.com', initial: 'AM' },
              { name: 'Riya Shah', email: 'riyashah@lotustubes.com', initial: 'RS' },
              { name: 'Neha Desai', email: 'nehadesai@lotustubes.com', initial: 'ND' },
              { name: 'Arjun Yadav', email: 'arjunyadav@lotustubes.com', initial: 'AY' }
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

      <section className="section-facility section--light" aria-label="Lotus Tubes Stockhub Mumbai">
        <div className="site-container facility-grid">
          <div className="facility-media">
            <img
              src="/assets/images/company/lotus-tubes-facility.jpg"
              alt="Lotus Tubes Central Warehousing & Quality Inspection Hub, Girgaon Mumbai"
              className="facility-img"
            />
            <div className="facility-badge-overlay">
              <div className="facility-badge-inner">
                <strong>Mumbai Central Stockhub</strong>
                <span>Over 50,000 meters of ready sanitary tubes ready for same-day dispatch</span>
              </div>
            </div>
          </div>

          <div className="facility-content">
            <span className="editorial-kicker">Immediate Availability</span>
            <h2 className="editorial-title">Direct Stockholding. Zero Intermediary Markups.</h2>
            <p className="editorial-lead">
              Operating from our dedicated central distribution facility at <strong>Jain Bhavan CHSL, Khetwadi, Girgaon, Mumbai</strong>, Lotus Tubes maintains comprehensive stock levels of certified sanitary stainless steel components.
            </p>

            <div className="facility-features-list">
              <div className="facility-feat">
                <span className="feat-check">✓</span>
                <div>
                  <strong>Same-Day Dispatch for Standard Diameters:</strong>
                  <p>1.0&quot;, 1.5&quot;, 2.0&quot;, and 3.0&quot; OD sanitary pipes in 6.0 meter standard lengths available off-the-shelf.</p>
                </div>
              </div>
              <div className="facility-feat">
                <span className="feat-check">✓</span>
                <div>
                  <strong>In-House Precision Cutting &amp; Deburring:</strong>
                  <p>Clean orbital cutting with square facing ready for immediate automatic TIG welding on site.</p>
                </div>
              </div>
              <div className="facility-feat">
                <span className="feat-check">✓</span>
                <div>
                  <strong>Export Packaging Standards:</strong>
                  <p>Every length of tubing is capped at both ends, sleeved in protective heat-shrink polythene, and boxed in sturdy wooden cases for zero transit surface scratching.</p>
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
            <h2 className="editorial-title">Trusted in Critical Sterile Process Plants</h2>
            <p className="editorial-subtitle">
              Engineered to meet the stringent contamination control, clean-in-place (CIP), and steam-in-place (SIP) protocols of leading industrial operators worldwide.
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
                  <p className="ind-card-desc">{ind.desc || 'Certified sanitary fluid transfer lines meeting international hygiene codes.'}</p>
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

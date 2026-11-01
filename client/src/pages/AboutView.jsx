import React from 'react';
import { createProductSVG } from '../data/siteData';
import PageHero from '../components/common/PageHero';

export const AboutView = ({ onOpenEnquiry }) => {
  return (
    <>
      <PageHero
        badge="The Quality Maker • Established in Mumbai"
        title="Engineered for Purity. Built for Trust."
        subtitle="Dedicated Stockist & Global Exporter of Stainless Steel Sanitary Solutions"
        description="Operating from our central Mumbai distribution hub, Lotus Tubes specializes in high-purity SS 304 and SS 316L tubes, fittings, and valves tailored to mission-critical biopharma, dairy, and hygienic process lines."
        slides={[
          {
            image: '/assets/images/company/lotus-tubes-facility.jpg',
            badge: 'The Quality Maker • Established in Mumbai',
            title: 'Engineered for Purity. Built for Trust.',
            subtitle: 'Dedicated Stockist & Global Exporter of Stainless Steel Sanitary Solutions',
            description: 'Operating from our central Mumbai distribution hub, Lotus Tubes specializes in high-purity SS 304 and SS 316L tubes, fittings, and valves tailored to mission-critical biopharma, dairy, and hygienic process lines.'
          },
          {
            image: '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-006.jpg',
            badge: 'Zero-Compromise Hygienic Metallurgy',
            title: 'Certified Surface Smoothness & Traceability',
            subtitle: 'Ra ≤ 0.38 µm EP Finishes • EN 10204 3.1 Mill Certificates',
            description: 'Every product batch is tracked by heat number and inspected for smooth, crevice-free internal geometry to eliminate bacterial harborage and ensure effortless CIP/SIP cleanability.'
          }
        ]}
        stats={[
          { value: 'Mumbai', label: 'Distribution Facility' },
          { value: 'SS 316L / 304', label: 'Certified Metallurgy' },
          { value: 'EN 10204 3.1', label: 'Full Heat Traceability' },
          { value: 'Pan-India & Global', label: 'Export Logistics' }
        ]}
        actions={[
          <button
            key="rfq"
            type="button"
            onClick={() => onOpenEnquiry && onOpenEnquiry(null, 'Lotus Tubes Company Introduction & RFQ')}
            className="btn btn--primary"
          >
            Request Sourcing Consultation &rarr;
          </button>,
          <a key="cat" href="#products" className="btn btn--outline">
            Browse Product Range
          </a>
        ]}
      />

      <div className="site-container section">
        <div className="about-preview-grid">
          <div>
            <span className="section-eyebrow">Company Profile</span>
            <h2 className="section-title">Commitment to Hygienic Engineering & Global Sourcing</h2>
            <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginTop: '16px' }}>
              Established as a key trading and supply venture under <strong>Lotus Impex</strong> (registered in Mumbai, 2019), <strong>Lotus Tubes</strong> was formed to solve the specialized supply needs of hygienic process equipment makers, skid fabricators, and manufacturing plants across pharmaceutical, dairy, food & beverage, and biotechnology sectors.
            </p>
            <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginTop: '14px' }}>
              Understanding that standard industrial pipe fittings fail to meet sterile Clean-In-Place (CIP) and Steam-In-Place (SIP) conditions, we focus exclusively on sanitary stainless steel components with certified internal smoothness (Ra ≤ 0.38 µm), true-roundness tolerances, and verifiable metallurgical test certificates.
            </p>

            <div className="stats-counter-grid mt-3">
              <div className="stat-box">
                <div className="stat-box__number">GSTIN</div>
                <div className="stat-box__label">27AIIPS0303A1ZU</div>
              </div>
              <div className="stat-box">
                <div className="stat-box__number">IEC</div>
                <div className="stat-box__label">0316902471</div>
              </div>
              <div className="stat-box">
                <div className="stat-box__number">Mumbai</div>
                <div className="stat-box__label">Girgaon Sourcing Desk</div>
              </div>
              <div className="stat-box">
                <div className="stat-box__number">Global</div>
                <div className="stat-box__label">Export Shipping Support</div>
              </div>
            </div>

            <div className="hero-actions mt-3">
              <button
                type="button"
                onClick={() => onOpenEnquiry && onOpenEnquiry(null, 'Lotus Tubes Sanitary Solutions')}
                className="btn btn--primary btn--lg"
              >
                Request Quotation &rarr;
              </button>
              <a href="#contact" className="btn btn--outline-dark btn--lg">
                Visit Office / Contact Us
              </a>
            </div>
          </div>

          <div>
            <img
              src="/assets/images/company/lotus-tubes-facility.jpg"
              alt="Lotus Tubes Office and Warehousing Facility"
              style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', width: '100%', height: '440px', objectFit: 'cover' }}
              loading="lazy"
            />
          </div>
        </div>

        {/* Verified Sourcing Approach Notice */}
        <div
          className="why-card mt-3"
          style={{ backgroundColor: 'var(--pure-white)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
        >
          <h3 style={{ color: 'var(--deep-navy)', marginBottom: '8px' }}>Our Authentic Business Philosophy</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            We operate with complete commercial honesty. Lotus Tubes partners with leading precision drawing mills and certified CNC machining foundries, delivering rigorous batch inspection, full MTC EN 10204 3.1 documentation, and fast responsive order execution through our dedicated sales and accounting teams.
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutView;

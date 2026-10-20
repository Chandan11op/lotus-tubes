import React from 'react';
import { CONFIG } from '../data/siteData';

export const AboutView = () => {
  return (
    <div>
      <section className="page-hero">
        <div className="site-container">
          <h1 className="page-hero-title">About Lotus Tubes</h1>
          <p className="page-hero-subtitle">
            Trusted supplier and global distributor of precision stainless steel sanitary pipes, fittings, and valves for over 25 years.
          </p>
        </div>
      </section>

      <div className="site-container section">
        <div className="about-preview-grid">
          <div>
            <span className="section-eyebrow">Company Profile</span>
            <h2 className="section-title">The Quality Maker in Sanitary Fluid Handling</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginTop: '16px' }}>
              Headquartered in Mumbai, India, Lotus Tubes (operating under legal entity Lotus Impex) is a premier supplier specializing exclusively in hygienic and high-purity stainless steel flow components.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginTop: '12px' }}>
              We cater to leading pharmaceutical bulk drug manufacturers, sterile vaccine labs, biotech pilot plants, multi-national dairy processing conglomerates, breweries, and food ingredient processors across India, the Middle East, Southeast Asia, and Europe.
            </p>

            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                <strong style={{ color: '#10263D', display: 'block', fontSize: '1.2rem' }}>25+ Years</strong>
                <span style={{ fontSize: '13px', color: '#667085' }}>Industry Domain Experience</span>
              </div>
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                <strong style={{ color: '#10263D', display: 'block', fontSize: '1.2rem' }}>100% Traceability</strong>
                <span style={{ fontSize: '13px', color: '#667085' }}>EN 10204 3.1 MTC with every heat</span>
              </div>
            </div>

            <div style={{ marginTop: '28px' }}>
              <a href="#quote" className="btn btn--primary">
                Partner With Us / Request Quotation &rarr;
              </a>
            </div>
          </div>

          <div>
            <img
              src="/assets/images/company/lotus-tubes-facility.svg"
              alt="Lotus Tubes Mumbai Distribution Facility"
              style={{ width: '100%', borderRadius: '12px', border: '1px solid #E3E8EF', boxShadow: '0 8px 24px rgba(16,38,61,0.08)' }}
            />
            <div style={{ marginTop: '16px', padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
              <strong style={{ color: '#10263D' }}>Corporate Identifiers</strong>
              <div style={{ fontSize: '13px', color: '#667085', marginTop: '6px' }}>
                <strong>Legal Name:</strong> {CONFIG.companyLegalName}<br />
                <strong>GSTIN:</strong> {CONFIG.gstin} &bull; <strong>IEC:</strong> {CONFIG.iec}<br />
                <strong>Registered Office:</strong> {CONFIG.officeAddress}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutView;

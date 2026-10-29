import React, { useState } from 'react';
import { FAQS } from '../data/siteData';

export const ResourcesView = ({ onNotify }) => {
  const [openFaq, setOpenFaq] = useState(null);

  const handleDownload = (docName) => {
    if (onNotify) {
      onNotify(`Downloading ${docName} (Demo Mode)...`, 'success');
    } else {
      alert(`Downloading ${docName} (Demo Mode)...`);
    }
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <>
      <section className="page-hero">
        <div className="site-container">
          <h1 className="page-hero-title">Engineering Resources & Downloads</h1>
          <p className="page-hero-subtitle">
            Download technical catalogues, standard pipe dimensional charts, and review sanitary engineering guides.
          </p>
        </div>
      </section>

      <div className="site-container section">
        <div className="resource-grid mb-3">
          <div className="resource-card">
            <div className="resource-card__icon">📘</div>
            <h3 className="resource-card__title">Complete Product Catalogue</h3>
            <p className="resource-card__desc">
              Complete specification guide covering SS 304/316L tubes, bends, tees, clamps, ferrules, and valves.
            </p>
            <button
              type="button"
              className="btn btn--outline-dark btn--sm download-mock-btn"
              onClick={() => handleDownload('Lotus-Tubes-Full-Catalogue-2026.pdf')}
            >
              📥 Download PDF (Demo)
            </button>
          </div>

          <div className="resource-card">
            <div className="resource-card__icon">📐</div>
            <h3 className="resource-card__title">Sanitary Tube Dimensions Chart</h3>
            <p className="resource-card__desc">
              Outside diameter (OD), wall thickness gauge comparison, and internal cross-sectional area reference table.
            </p>
            <button
              type="button"
              className="btn btn--outline-dark btn--sm download-mock-btn"
              onClick={() => handleDownload('Sanitary-Tube-OD-Wall-Chart.pdf')}
            >
              📥 Download Chart (Demo)
            </button>
          </div>

          <div className="resource-card">
            <div className="resource-card__icon">🔬</div>
            <h3 className="resource-card__title">Surface Roughness (Ra) Guide</h3>
            <p className="resource-card__desc">
              Microscopic roughness conversion chart comparing Grit numbers, Ra microns, and micro-inches (µin).
            </p>
            <button
              type="button"
              className="btn btn--outline-dark btn--sm download-mock-btn"
              onClick={() => handleDownload('Surface-Roughness-Conversion-Guide.pdf')}
            >
              📥 Download Guide (Demo)
            </button>
          </div>
        </div>

        {/* Interactive FAQ Accordion */}
        <div className="mt-3">
          <div className="section-header section-header--center">
            <span className="section-eyebrow">Frequently Asked Questions</span>
            <h2 className="section-title">Technical & Commercial FAQs</h2>
          </div>

          <div className="faq-accordion">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div className={`faq-item ${isOpen ? 'active' : ''}`} key={idx}>
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer" style={{ display: 'block' }}>
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResourcesView;

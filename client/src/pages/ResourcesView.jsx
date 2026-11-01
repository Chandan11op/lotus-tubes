import React, { useState } from 'react';
import { FAQS } from '../data/siteData';
import PageHero from '../components/common/PageHero';

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
      <PageHero
        badge="Engineering Datasheets & Technical Library"
        title="Engineering Resources & Downloads"
        subtitle="Hygienic Process Specifications, Dimensional Charts & FAQs"
        description="Access downloadable technical catalogues, ASTM/ASME dimensional correlation charts, surface finish roughness guides, and engineering documentation."
        slides={[
          {
            image: '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-009.jpg',
            badge: 'Engineering Datasheets & Technical Library',
            title: 'Engineering Resources & Downloads',
            subtitle: 'Hygienic Process Specifications & Dimensional Charts',
            description: 'Access downloadable technical catalogues, ASTM/ASME dimensional correlation charts, surface finish roughness guides, and engineering documentation.'
          },
          {
            image: '/assets/images/company/lotus-tubes-facility.jpg',
            badge: 'Direct Mumbai Technical Support',
            title: 'Material Guidance & CAD Assistance',
            subtitle: 'Technical Consulting for Hygienic Process Skids',
            description: 'Speak directly with our technical sourcing specialists to verify sanitary standards, weld tangents, and elastomer chemical compatibility.'
          }
        ]}
        stats={[
          { value: 'PDF Catalogues', label: 'Ready to Download' },
          { value: 'ASTM / ASME', label: 'Dimensional Charts' },
          { value: 'Ra Roughness', label: 'Finishing Standards' },
          { value: '24h Response', label: 'Technical Sourcing' }
        ]}
        actions={[
          <a key="cat" href="#products" className="btn btn--primary">
            Explore Product Range &rarr;
          </a>
        ]}
      />

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

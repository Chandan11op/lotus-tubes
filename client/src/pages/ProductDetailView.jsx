import React, { useState } from 'react';
import { PRODUCTS, CONFIG, createProductSVG } from '../data/siteData';

export const ProductDetailView = ({ slug, onOpenEnquiry }) => {
  const prod = PRODUCTS.find((p) => p.slug === slug || p.id === slug) || PRODUCTS[0];
  const related = PRODUCTS.filter((p) => p.categorySlug === prod.categorySlug && p.id !== prod.id).slice(0, 4);

  const [activeImg, setActiveImg] = useState(prod.image);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [activeTab, setActiveTab] = useState('tab-apps');

  const thumbs = [
    { src: prod.image, alt: `${prod.name} View 1` },
    {
      src: createProductSVG(prod.name + ' - Bore Detail', 'Internal EP Bore Ra ≤ 0.38µm', '#10263D'),
      alt: `${prod.name} Internal Finish`
    },
    {
      src: createProductSVG(prod.name + ' - Cleanroom Packaging', 'Capped & Bagged', '#0284C7'),
      alt: `${prod.name} Packing`
    }
  ];

  return (
    <div className="site-container product-detail-view">
      <div className="product-detail-grid">
        {/* Left: Gallery & Interactive 360 Concept */}
        <div className="product-gallery-box">
          <div className="product-main-image-wrap">
            <img
              src={activeImg}
              alt={prod.name}
              className="product-main-img"
              id="detail-main-img"
              style={{
                transform: `rotate(${rotationAngle}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
            />
            <div className="viewer-360-badge">
              <span>🔄 Interactive 360° View</span>
            </div>
          </div>

          {/* Conceptual 360 Rotation Slider */}
          <div className="simulated-360-bar">
            <label htmlFor="slider-360">Rotate View:</label>
            <input
              type="range"
              id="slider-360"
              min="0"
              max="360"
              value={rotationAngle}
              onChange={(e) => setRotationAngle(Number(e.target.value))}
              aria-label="Simulate 360 degree rotation"
            />
            <span id="angle-display">{rotationAngle}°</span>
          </div>

          <div className="gallery-thumbs">
            {thumbs.map((thumb, idx) => (
              <div
                key={idx}
                className={`gallery-thumb ${activeImg === thumb.src ? 'active' : ''}`}
                onClick={() => setActiveImg(thumb.src)}
              >
                <img src={thumb.src} alt={thumb.alt} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Technical Details & Specifications */}
        <div className="product-info-box">
          <span className="product-detail-eyebrow">{prod.category}</span>
          <h1 className="product-detail-title">{prod.name}</h1>

          <div className="product-badges-row">
            <span className="badge badge--navy">{prod.material}</span>
            <span className="badge badge--pink">{prod.finish}</span>
            <span className="badge badge--steel">{prod.standard}</span>
            <span className="badge badge--outline">MTC EN 10204 3.1 Available</span>
          </div>

          <p className="product-overview-text">{prod.overview}</p>

          {/* Specification Table */}
          <div className="spec-table-box">
            <table className="spec-table">
              <tbody>
                <tr>
                  <th>Material Grade</th>
                  <td>
                    <strong>{prod.material}</strong>
                  </td>
                </tr>
                <tr>
                  <th>Surface Finish</th>
                  <td>
                    {prod.finish} ({prod.roughness || 'Hygienic standard'})
                  </td>
                </tr>
                <tr>
                  <th>Manufacturing Type</th>
                  <td>{prod.manufacturingType}</td>
                </tr>
                <tr>
                  <th>Outside Diameter (OD)</th>
                  <td>{prod.sizes}</td>
                </tr>
                <tr>
                  <th>Wall Thickness</th>
                  <td>{prod.wallThickness}</td>
                </tr>
                <tr>
                  <th>Standard Compliance</th>
                  <td>{prod.standard} (Confirmed against actual supply)</td>
                </tr>
                <tr>
                  <th>Connection Type</th>
                  <td>{prod.connection}</td>
                </tr>
                <tr>
                  <th>Standard Length</th>
                  <td>{prod.length}</td>
                </tr>
                <tr>
                  <th>Quality Documentation</th>
                  <td>{prod.mtc}</td>
                </tr>
                <tr>
                  <th>Stock &amp; Availability</th>
                  <td>Ready stock in Mumbai / Lead time confirmed upon quotation</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Direct Action Cluster */}
          <div className="product-cta-cluster">
            <button
              type="button"
              className="btn btn--primary btn--lg quick-rfq-btn"
              onClick={() => onOpenEnquiry && onOpenEnquiry(prod.id, prod.name)}
            >
              <span>Request Official Quotation</span> &rarr;
            </button>
            <a
              href={`https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20need%20a%20price%20quote%20for%3A%20${encodeURIComponent(prod.name)}%20(Grade%3A%20${encodeURIComponent(prod.material)}%2C%20Finish%3A%20${encodeURIComponent(prod.finish)}).`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--whatsapp btn--lg"
            >
              <span>🟢 Get Price on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Technical Deep-Dive Tabs */}
      <div className="tech-tabs-section">
        <div className="tab-headers">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'tab-apps' ? 'active' : ''}`}
            onClick={() => setActiveTab('tab-apps')}
          >
            Hygienic Applications
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'tab-standards' ? 'active' : ''}`}
            onClick={() => setActiveTab('tab-standards')}
          >
            Standards &amp; Quality Compliance
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'tab-inquiry' ? 'active' : ''}`}
            onClick={() => setActiveTab('tab-inquiry')}
          >
            Submit Direct RFQ for this Product
          </button>
        </div>

        {activeTab === 'tab-apps' && (
          <div className="tab-content-panel active" id="tab-apps">
            <h4>Recommended Process Applications:</h4>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', lineHeight: 1.8, marginTop: '10px' }}>
              {prod.applications && prod.applications.map((app, idx) => <li key={idx}>{app}</li>)}
            </ul>
          </div>
        )}

        {activeTab === 'tab-standards' && (
          <div className="tab-content-panel active" id="tab-standards">
            <h4>Material Traceability &amp; Standards Integrity:</h4>
            <p>
              Lotus Tubes adheres to strict sourcing controls. All supplied batches are accompanied by comprehensive chemical composition and mechanical test verification. We do not claim compliance with a particular standard unless the supplied material strictly matches its dimensions, wall tolerances, and surface roughness requirements.
            </p>
          </div>
        )}

        {activeTab === 'tab-inquiry' && (
          <div className="tab-content-panel active" id="tab-inquiry">
            <h4>Quick Specification Enquiry:</h4>
            <p>
              Need custom sizes, special orbital weld end preps, or specific boroscopy checks? Contact our technical engineering desk at{' '}
              <a href={`mailto:${CONFIG.primaryEmail}`} className="text-pink">
                <strong>{CONFIG.primaryEmail}</strong>
              </a>{' '}
              or call <strong>{CONFIG.primaryPhone}</strong>.
            </p>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <div className="section mt-3">
          <h3 className="section-title mb-2">Related Sanitary Components</h3>
          <div className="featured-products-grid">
            {related.map((rel) => (
              <article className="product-card" key={rel.slug}>
                <div className="product-card__badge-bar">
                  <span className="badge badge--navy">{rel.material}</span>
                </div>
                <div className="product-card__img-wrap">
                  <img src={rel.image} alt={rel.name} className="product-card__img" loading="lazy" />
                </div>
                <div className="product-card__body">
                  <h4 className="product-card__title">
                    <a href={`#product/${rel.slug}`}>{rel.name}</a>
                  </h4>
                  <p className="product-card__specs">{rel.sizes}</p>
                  <div className="product-card__actions">
                    <a href={`#product/${rel.slug}`} className="btn btn--outline-dark btn--sm">
                      Details
                    </a>
                    <button
                      type="button"
                      className="btn btn--primary btn--sm quick-rfq-btn"
                      onClick={() => onOpenEnquiry && onOpenEnquiry(rel.id, rel.name)}
                    >
                      Quote
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailView;

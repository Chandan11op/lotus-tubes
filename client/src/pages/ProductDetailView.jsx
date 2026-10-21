import React, { useState, useEffect } from 'react';
import { PRODUCTS, CONFIG } from '../data/siteData';
import { getCategoryFallbackImage, UNIVERSAL_FALLBACK_IMAGE, INLINE_SVG_FAILSAFE } from '../utils/mediaFallback';
import ProductCardVideo from '../components/common/ProductCardVideo';

export const ProductDetailView = ({ slug, onOpenEnquiry }) => {
  const prod = PRODUCTS.find((p) => p.slug === slug || p.id === slug) || PRODUCTS[0];
  const related = PRODUCTS.filter((p) => p.categorySlug === prod.categorySlug && p.id !== prod.id).slice(0, 4);

  const [activeMedia, setActiveMedia] = useState('video'); // 'video' | 0 | 1 | 2
  const [activeTab, setActiveTab] = useState('tab-apps');
  const [videoError, setVideoError] = useState(!prod.video);
  const [imgFallbacks, setImgFallbacks] = useState({});

  useEffect(() => {
    setActiveMedia('video');
    setVideoError(!prod.video);
    setImgFallbacks({});
  }, [slug, prod.id, prod.video]);

  const productImages = prod.images && prod.images.length >= 3
    ? prod.images
    : [
        prod.image || getCategoryFallbackImage(prod.categorySlug, prod.name),
        `/assets/images/products/details/${prod.id}-bore.svg`,
        `/assets/images/products/details/${prod.id}-pack.svg`
      ];

  const handleImageError = (key) => {
    setImgFallbacks((prev) => {
      const currentLevel = prev[key] || 0;
      return { ...prev, [key]: currentLevel + 1 };
    });
  };

  const resolveImage = (imgSrc, key) => {
    const level = imgFallbacks[key] || 0;
    if (level === 0) return imgSrc || getCategoryFallbackImage(prod.categorySlug, prod.name);
    if (level === 1) return getCategoryFallbackImage(prod.categorySlug, prod.name);
    if (level === 2) return UNIVERSAL_FALLBACK_IMAGE;
    return INLINE_SVG_FAILSAFE;
  };

  const showVideo = activeMedia === 'video' && prod.video && !videoError;

  return (
    <div className="site-container product-detail-view">
      <div className="product-detail-grid">
        {/* Left: Gallery & Primary Media Area */}
        <div className="product-gallery-box">
          <div className="product-main-image-wrap" style={{ position: 'relative', overflow: 'hidden', background: '#F8FAFC', borderRadius: '8px' }}>
            {showVideo ? (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <video
                  key={prod.video}
                  poster={resolveImage(productImages[0], 'main-poster')}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={() => setVideoError(true)}
                  aria-label={`${prod.name} - 360 degree product video`}
                >
                  <source
                    src={prod.video}
                    type={prod.video.endsWith('.webm') ? 'video/webm' : 'video/mp4'}
                    onError={() => setVideoError(true)}
                  />
                </video>
                <div className="viewer-360-badge">
                  <span>🔄 Looping 360° Product Video (Muted)</span>
                </div>
              </div>
            ) : (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <img
                  src={resolveImage(
                    activeMedia === 'video' ? productImages[0] : productImages[activeMedia],
                    `main-${activeMedia}`
                  )}
                  alt={`${prod.name} - Specification Detail`}
                  className="product-main-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={() => handleImageError(`main-${activeMedia}`)}
                />
                <div className="viewer-360-badge" style={{ background: 'rgba(16,38,61,0.85)' }}>
                  <span>
                    {activeMedia === 'video'
                      ? '📷 High-Res Specification Photo (Primary)'
                      : `📷 High-Res Specification Photo ${Number(activeMedia) + 1} of 3`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Media Switcher Bar: Primary 360° Video + 3 Product Images */}
          <div className="gallery-thumbs" style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: prod.video && !videoError ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)', gap: '10px' }}>
            {/* Video Thumbnail Button (rendered when video is available) */}
            {prod.video && !videoError && (
              <div
                className={`gallery-thumb ${activeMedia === 'video' ? 'active' : ''}`}
                onClick={() => setActiveMedia('video')}
                style={{ cursor: 'pointer', position: 'relative', border: activeMedia === 'video' ? '2px solid var(--primary-pink)' : '1px solid #E3E8EF', borderRadius: '6px', overflow: 'hidden' }}
                title="View 360° Rotating Video"
              >
                <img
                  src={resolveImage(productImages[0], 'thumb-video')}
                  alt={`${prod.name} 360 Video Preview`}
                  style={{ width: '100%', height: '60px', objectFit: 'cover' }}
                  onError={() => handleImageError('thumb-video')}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(16,38,61,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '11px', fontWeight: 700 }}>
                  ▶ 360°
                </div>
              </div>
            )}

            {/* 3 Product Images corresponding to this selected product */}
            {productImages.slice(0, 3).map((imgSrc, idx) => (
              <div
                key={idx}
                className={`gallery-thumb ${activeMedia === idx || (activeMedia === 'video' && (videoError || !prod.video) && idx === 0) ? 'active' : ''}`}
                onClick={() => setActiveMedia(idx)}
                style={{
                  cursor: 'pointer',
                  position: 'relative',
                  border: (activeMedia === idx || (activeMedia === 'video' && (videoError || !prod.video) && idx === 0)) ? '2px solid var(--primary-pink)' : '1px solid #E3E8EF',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}
                title={`View Product Image ${idx + 1}`}
              >
                <img
                  src={resolveImage(imgSrc, `thumb-${idx}`)}
                  alt={`${prod.name} View ${idx + 1}`}
                  style={{ width: '100%', height: '60px', objectFit: 'cover' }}
                  onError={() => handleImageError(`thumb-${idx}`)}
                />
                <div style={{ position: 'absolute', bottom: 2, right: 4, background: 'rgba(16,38,61,0.7)', color: '#FFF', fontSize: '9px', padding: '1px 4px', borderRadius: '3px' }}>
                  #{idx + 1}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '11px', color: '#667085', marginTop: '6px', textAlign: 'center' }}>
            {prod.video && !videoError
              ? 'Primary media: Looping 360° turntable video • Click thumbnails to inspect dimensional details'
              : 'Primary media: High-resolution sanitary specification view • Click thumbnails to inspect dimensional details'}
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
            <span className="badge badge--outline">MTC EN 10204 3.1 Certified</span>
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
          <div className="product-cta-cluster" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn--primary btn--lg quick-rfq-btn"
              onClick={() => onOpenEnquiry && onOpenEnquiry(prod, prod.name)}
              style={{ flex: 1, minWidth: '240px' }}
            >
              <span>Request Official Quotation</span> &rarr;
            </button>
            <a
              href={`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(
                `Hello Lotus Tubes, I would like to request an official quotation for ${prod.name} (Ref: ${prod.id}). Please share the available specifications and pricing.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--whatsapp btn--lg"
              title={`Enquire on WhatsApp for ${prod.name}`}
            >
              <span>🟢 WhatsApp Product Enquiry</span>
            </a>
            <a
              href="#contact"
              className="btn btn--outline-dark btn--lg"
            >
              <span>Technical Desk Consultation</span>
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
            <h4>Direct Technical Quotation:</h4>
            <p>
              Receive a formal quotation document for <strong>{prod.name}</strong> with customized quantity breaks, mill test certification, and packaging confirmation.
            </p>
            <button
              type="button"
              className="btn btn--primary mt-2"
              onClick={() => onOpenEnquiry && onOpenEnquiry(prod, prod.name)}
            >
              Request Official Quotation &rarr;
            </button>
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
                  <ProductCardVideo video={rel.video} poster={rel.image} alt={rel.name} categorySlug={rel.categorySlug} />
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
                      onClick={() => onOpenEnquiry && onOpenEnquiry(rel, rel.name)}
                    >
                      Request Official Quotation
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

import React, { useState, useEffect } from 'react';
import { PRODUCTS, CONFIG } from '../data/siteData';
import { getCategoryFallbackImage, UNIVERSAL_FALLBACK_IMAGE, INLINE_SVG_FAILSAFE } from '../utils/mediaFallback';
import { Product360Viewer } from '../components/common/Product360Viewer';
import { ProductVideoPlayer } from '../components/common/ProductVideoPlayer';
import { hasVerified3DModel } from '../data/modelRegistry.js';
import { updatePageSEO } from '../utils/seo';

export const ProductDetailView = ({ slug, onOpenEnquiry }) => {
  const prod = PRODUCTS.find((p) => p.slug === slug || p.id === slug) || PRODUCTS[0];
  const related = PRODUCTS.filter((p) => p.categorySlug === prod.categorySlug && p.id !== prod.id).slice(0, 4);

  const is3DVerified = hasVerified3DModel(prod);
  const [activeMedia, setActiveMedia] = useState(0); // 0 | 1 | 2 | '3d' | 'video'
  const [activeTab, setActiveTab] = useState('tab-apps');
  const [imgFallbacks, setImgFallbacks] = useState({});

  useEffect(() => {
    setActiveMedia(0);
    setImgFallbacks({});

    // Update dynamic technical SEO & Structured Data
    updatePageSEO({
      title: prod.seo?.title || `${prod.name} | Lotus Tubes`,
      description: prod.seo?.metaDescription || prod.overview,
      path: `/product/${prod.slug || prod.id}`,
      image: prod.image,
      productData: prod,
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: prod.category, path: `/category/${prod.categorySlug}` },
        { name: prod.name, path: `/product/${prod.slug || prod.id}` }
      ]
    });
  }, [slug, prod.id]);

  const productImages = prod.images && prod.images.length > 0
    ? prod.images
    : [prod.image || getCategoryFallbackImage(prod.categorySlug, prod.name)];

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

  return (
    <div className="site-container product-detail-view" style={{ paddingTop: '20px', paddingBottom: '60px' }}>
      <div className="product-detail-grid">
        {/* Left: Gallery & Primary Interactive Media */}
        <div className="product-gallery-box">
          <div className="product-main-image-wrap" style={{ position: 'relative', overflow: 'hidden', background: '#F8FAFC', borderRadius: '12px', minHeight: '420px' }}>
            {activeMedia === '3d' && is3DVerified ? (
              <Product360Viewer product={prod} fallbackImage={productImages[0]} initialMode="3d" />
            ) : activeMedia === 'video' && prod.video ? (
              <ProductVideoPlayer
                src={prod.video}
                poster={productImages[0]}
                title={`${prod.name} - Technical Video`}
                isIllustrative={false}
              />
            ) : (
              <div style={{ position: 'relative', width: '100%', height: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
                <img
                  src={resolveImage(productImages[typeof activeMedia === 'number' ? activeMedia : 0] || productImages[0], `main-${activeMedia}`)}
                  alt={`${prod.name} - Specification Detail`}
                  className="product-main-img"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  onError={() => handleImageError(`main-${activeMedia}`)}
                />
                <div className="viewer-360-badge" style={{ background: 'rgba(16,38,61,0.85)' }}>
                  <span>📷 High-Resolution Specification Photo {typeof activeMedia === 'number' ? Number(activeMedia) + 1 : 1} of {productImages.length}</span>
                </div>
              </div>
            )}
          </div>

          {/* Media Switcher Bar: 3D Model + Video + Photo Thumbnails */}
          <div className="gallery-thumbs" style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '8px' }}>
            {/* 3D Model Mode Button (Only when verified CAD model exists) */}
            {is3DVerified && (
              <button
                type="button"
                onClick={() => setActiveMedia('3d')}
                className={`gallery-thumb-btn ${activeMedia === '3d' ? 'active' : ''}`}
                style={{
                  position: 'relative',
                  height: '64px',
                  borderRadius: '8px',
                  border: activeMedia === '3d' ? '2px solid #0284C7' : '1px solid #CBD5E1',
                  background: '#0F172A',
                  color: '#FFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                title="3D Interactive Digital Twin"
              >
                <span style={{ fontSize: '18px' }}>🔄</span>
                <span style={{ fontSize: '10px', fontWeight: 700, marginTop: '2px' }}>3D DIGITAL TWIN</span>
              </button>
            )}

            {/* Video Inspection Mode Button */}
            {prod.video && (
              <button
                type="button"
                onClick={() => setActiveMedia('video')}
                className={`gallery-thumb-btn ${activeMedia === 'video' ? 'active' : ''}`}
                style={{
                  position: 'relative',
                  height: '64px',
                  borderRadius: '8px',
                  border: activeMedia === 'video' ? '2px solid #0284C7' : '1px solid #CBD5E1',
                  background: '#1E293B',
                  color: '#FFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                title="Product Video Inspection"
              >
                <span style={{ fontSize: '18px' }}>📹</span>
                <span style={{ fontSize: '10px', fontWeight: 700, marginTop: '2px' }}>VIDEO</span>
              </button>
            )}

            {/* Standard Photography Thumbnails */}
            {productImages.map((imgSrc, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setActiveMedia(idx)}
                className={`gallery-thumb-btn ${activeMedia === idx ? 'active' : ''}`}
                style={{
                  position: 'relative',
                  height: '64px',
                  borderRadius: '8px',
                  border: activeMedia === idx ? '2px solid #0284C7' : '1px solid #CBD5E1',
                  background: '#FFF',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  padding: '2px'
                }}
                title={`View Photo ${idx + 1}`}
              >
                <img
                  src={resolveImage(imgSrc, `thumb-${idx}`)}
                  alt={`${prod.name} Photo ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={() => handleImageError(`thumb-${idx}`)}
                />
              </button>
            ))}
          </div>

          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '8px', textAlign: 'center' }}>
            {activeMedia === '3d'
              ? '3D Interactive Digital Twin: Drag horizontally or vertically to inspect component geometry.'
              : activeMedia === 'video'
              ? 'Technical Video: Factory inspection and component overview.'
              : 'Genuine Studio Product Photography • EN 10204 3.1 Certified Range'}
          </div>
        </div>

        {/* Right: Technical Details & Specifications */}
        <div className="product-info-box">
          <span className="product-detail-eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '0.8px', color: '#0284C7', fontWeight: 700, fontSize: '12px' }}>
            {prod.category}
          </span>
          <h1 className="product-detail-title" style={{ fontSize: '1.85rem', color: 'var(--deep-navy)', marginTop: '4px', marginBottom: '12px' }}>
            {prod.name}
          </h1>

          <div className="product-badges-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span className="badge badge--navy" style={{ background: '#10263D', color: '#FFF', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>{prod.material}</span>
            <span className="badge badge--pink" style={{ background: '#F00078', color: '#FFF', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>{prod.finish}</span>
            <span className="badge badge--steel" style={{ background: '#E2E8F0', color: '#334155', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>{prod.standard}</span>
            {is3DVerified && (
              <span className="badge badge--sky" style={{ background: '#0284C7', color: '#FFF', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>3D Interactive Model</span>
            )}
            <span className="badge badge--outline" style={{ border: '1px solid #CBD5E1', color: '#475569', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>EN 10204 3.1 Traceable</span>
          </div>

          <p className="product-overview-text" style={{ fontSize: '14px', lineHeight: 1.6, color: '#334155', marginBottom: '20px' }}>
            {prod.overview}
          </p>

          {/* Specification Table */}
          <div className="spec-table-box" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', marginBottom: '24px', overflowX: 'auto' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', textTransform: 'uppercase', color: '#10263D', letterSpacing: '0.5px' }}>
              Technical Parameters & Supply Scope:
            </h4>
            <table className="spec-table" style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', minWidth: '280px' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '8px 0', textAlign: 'left', color: '#64748B', width: '38%' }}>Material Grade</th>
                  <td style={{ padding: '8px 0', color: '#10263D' }}><strong>{prod.material}</strong></td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '8px 0', textAlign: 'left', color: '#64748B' }}>Surface Finish</th>
                  <td style={{ padding: '8px 0', color: '#10263D' }}>{prod.finish} ({prod.roughness || 'Ra ≤ 0.4 µm'})</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '8px 0', textAlign: 'left', color: '#64748B' }}>Manufacturing Type</th>
                  <td style={{ padding: '8px 0', color: '#10263D' }}>{prod.manufacturingType}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '8px 0', textAlign: 'left', color: '#64748B' }}>Size / Outside Diameter</th>
                  <td style={{ padding: '8px 0', color: '#10263D' }}>{prod.sizes}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '8px 0', textAlign: 'left', color: '#64748B' }}>Wall Thickness</th>
                  <td style={{ padding: '8px 0', color: '#10263D' }}>{prod.wallThickness}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '8px 0', textAlign: 'left', color: '#64748B' }}>Verified Standard</th>
                  <td style={{ padding: '8px 0', color: '#10263D' }}>{prod.standard} (Confirmed per heat batch)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '8px 0', textAlign: 'left', color: '#64748B' }}>Connection / Ends</th>
                  <td style={{ padding: '8px 0', color: '#10263D' }}>{prod.connection}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '8px 0', textAlign: 'left', color: '#64748B' }}>Quality Documentation</th>
                  <td style={{ padding: '8px 0', color: '#10263D' }}>{prod.mtc}</td>
                </tr>
                <tr>
                  <th style={{ padding: '8px 0', textAlign: 'left', color: '#64748B' }}>Stock & Availability</th>
                  <td style={{ padding: '8px 0', color: '#059669', fontWeight: 600 }}>{prod.availability || 'Ready Stock in Mumbai'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Direct Action Cluster */}
          <div className="product-cta-cluster" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn--primary btn--lg"
              onClick={() => onOpenEnquiry && onOpenEnquiry(prod, prod.name)}
              style={{ flex: 1, minWidth: '220px' }}
            >
              <span>Request Formal Price Quote</span> &rarr;
            </button>
            <a
              href={`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(
                `Hello Lotus Tubes, I would like to request an official quotation for ${prod.name} (Ref: ${prod.slug || prod.id}). Please share available sizes and pricing.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--whatsapp btn--lg"
              title={`WhatsApp inquiry for ${prod.name}`}
            >
              <span>🟢 Get Price on WhatsApp</span>
            </a>
            <a
              href="#quote"
              className="btn btn--secondary btn--lg"
            >
              <span>Submit BOQ Document</span>
            </a>
          </div>
        </div>
      </div>

      {/* Product Applications & Verified Industry Uses */}
      {prod.applications && prod.applications.length > 0 && (
        <div style={{ marginTop: '48px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '28px' }}>
          <h3 style={{ color: 'var(--deep-navy)', fontSize: '1.25rem', marginBottom: '16px' }}>
            Recommended Hygienic Process Applications
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {prod.applications.map((app, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <span style={{ color: '#0284C7', fontWeight: 'bold' }}>✓</span>
                <span style={{ fontSize: '13px', color: '#1E293B', fontWeight: 500 }}>{app}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Hygienic Products */}
      {related.length > 0 && (
        <div style={{ marginTop: '48px' }}>
          <h3 style={{ color: 'var(--deep-navy)', fontSize: '1.35rem', marginBottom: '20px' }}>
            Complementary Products in {prod.category}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {related.map((rel) => (
              <div
                key={rel.id}
                className="related-product-card"
                style={{
                  background: '#FFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '170px', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
                  <img
                    src={rel.image || productImages[0]}
                    alt={rel.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                      transition: 'transform 0.4s ease'
                    }}
                  />
                </div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 6px 0', color: '#10263D', lineHeight: 1.35 }}>{rel.name}</h4>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 14px 0' }}>Grade: {rel.material} • {rel.finish}</p>
                  <div style={{ marginTop: 'auto' }}>
                    <a href={`#product/${rel.slug || rel.id}`} className="btn btn--outline-dark btn--sm btn--block">
                      View Specifications &rarr;
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailView;

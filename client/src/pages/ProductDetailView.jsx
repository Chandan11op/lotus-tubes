import React, { useState } from 'react';
import { PRODUCTS, CONFIG } from '../data/siteData';

export const ProductDetailView = ({ slug, onOpenEnquiry }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [rotationAngle, setRotationAngle] = useState(0);

  const product = PRODUCTS.find((p) => p.slug === slug || p.id === slug) || PRODUCTS[0];
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const imageSrc = product.image?.startsWith('assets/') ? `/${product.image}` : product.image;

  return (
    <div>
      <section className="page-hero">
        <div className="site-container">
          <div style={{ marginBottom: '8px' }}>
            <span className="badge badge--navy" style={{ marginRight: '8px' }}>{product.material}</span>
            <span className="badge badge--pink">{product.finish}</span>
          </div>
          <h1 className="page-hero-title">{product.name}</h1>
          <p className="page-hero-subtitle">
            Hygienic process specification: {product.standard} &bull; Internal Roughness {product.roughness}
          </p>
        </div>
      </section>

      <div className="site-container section">
        <div className="product-detail-layout">
          {/* Left Media Column */}
          <div className="product-detail-media">
            <div className="detail-main-img-box" style={{ overflow: 'hidden', textAlign: 'center', background: '#F8FAFC', borderRadius: '12px', padding: '24px', border: '1px solid #E3E8EF' }}>
              <img
                id="detail-main-img"
                src={imageSrc}
                alt={product.name}
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  transform: `perspective(600px) rotateY(${rotationAngle * 0.4}deg)`,
                  transition: 'transform 0.08s ease'
                }}
              />
            </div>

            {/* 360 Degree View Interactive Simulation */}
            <div className="range-slider-box" style={{ marginTop: '16px', background: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>
                <span>🔄 Interactive 360° Inspection</span>
                <span id="angle-display" style={{ color: 'var(--primary-blue)' }}>{rotationAngle}°</span>
              </div>
              <input
                type="range"
                id="slider-360"
                min="-45"
                max="45"
                value={rotationAngle}
                onChange={(e) => setRotationAngle(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Right Product Info Column */}
          <div className="product-detail-info">
            <div className="detail-tags" style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <span className="badge badge--navy">{product.category}</span>
              <span className="badge badge--pink">{product.standard}</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--deep-navy)', fontSize: '1.9rem', marginBottom: '16px' }}>
              {product.name}
            </h2>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
              {product.overview}
            </p>

            {/* Key Specs Matrix */}
            <div className="spec-matrix" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '28px' }}>
              <div className="spec-item" style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E3E8EF' }}>
                <strong style={{ display: 'block', fontSize: '12px', color: '#667085' }}>Material Grade</strong>
                <span style={{ fontSize: '14px', color: '#10263D', fontWeight: 600 }}>{product.material}</span>
              </div>
              <div className="spec-item" style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E3E8EF' }}>
                <strong style={{ display: 'block', fontSize: '12px', color: '#667085' }}>Surface Finish</strong>
                <span style={{ fontSize: '14px', color: '#10263D', fontWeight: 600 }}>{product.finish}</span>
              </div>
              <div className="spec-item" style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E3E8EF' }}>
                <strong style={{ display: 'block', fontSize: '12px', color: '#667085' }}>Roughness Parameter</strong>
                <span style={{ fontSize: '14px', color: '#10263D', fontWeight: 600 }}>{product.roughness}</span>
              </div>
              <div className="spec-item" style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E3E8EF' }}>
                <strong style={{ display: 'block', fontSize: '12px', color: '#667085' }}>Standard Sizes</strong>
                <span style={{ fontSize: '14px', color: '#10263D', fontWeight: 600 }}>{product.sizes}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn--primary btn--lg"
                onClick={() => onOpenEnquiry(product)}
              >
                <span>Request Price Quotation</span> &rarr;
              </button>
              <a
                href={`https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20am%20enquiring%20about%20${encodeURIComponent(product.name)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--whatsapp btn--lg"
              >
                <span>🟢 WhatsApp Enquiry</span>
              </a>
            </div>
          </div>
        </div>

        {/* Detailed Tabs */}
        <div className="product-detail-tabs" style={{ marginTop: '48px' }}>
          <div className="tab-nav" style={{ display: 'flex', borderBottom: '2px solid #E3E8EF', gap: '20px' }}>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
              style={{
                background: 'none',
                border: 'none',
                padding: '12px 18px',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                borderBottom: activeTab === 'overview' ? '3px solid var(--primary-blue)' : '3px solid transparent',
                color: activeTab === 'overview' ? 'var(--primary-blue)' : '#667085'
              }}
            >
              Hygienic Applications
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
              style={{
                background: 'none',
                border: 'none',
                padding: '12px 18px',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                borderBottom: activeTab === 'specs' ? '3px solid var(--primary-blue)' : '3px solid transparent',
                color: activeTab === 'specs' ? 'var(--primary-blue)' : '#667085'
              }}
            >
              Technical Specification Table
            </button>
          </div>

          <div style={{ paddingTop: '24px' }}>
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ color: 'var(--deep-navy)', marginBottom: '14px' }}>Recommended Process Applications</h3>
                <ul style={{ paddingLeft: '20px', lineHeight: 1.8, color: '#334155' }}>
                  {product.applications?.map((app, i) => (
                    <li key={i}>{app}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'specs' && (
              <div style={{ overflowX: 'auto' }}>
                <table className="spec-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #E3E8EF' }}>
                      <th style={{ padding: '12px', background: '#F8FAFC', width: '30%' }}>Standard Specification</th>
                      <td style={{ padding: '12px' }}>{product.standard}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E3E8EF' }}>
                      <th style={{ padding: '12px', background: '#F8FAFC' }}>Material Alloy</th>
                      <td style={{ padding: '12px' }}>{product.material}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E3E8EF' }}>
                      <th style={{ padding: '12px', background: '#F8FAFC' }}>Manufacturing Type</th>
                      <td style={{ padding: '12px' }}>{product.manufacturingType || 'Seamless / Welded'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E3E8EF' }}>
                      <th style={{ padding: '12px', background: '#F8FAFC' }}>Wall Thickness</th>
                      <td style={{ padding: '12px' }}>{product.wallThickness || '1.2 mm - 2.0 mm (16G standard)'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E3E8EF' }}>
                      <th style={{ padding: '12px', background: '#F8FAFC' }}>Standard Length</th>
                      <td style={{ padding: '12px' }}>{product.length || '6.0 Meters (Custom cutting available)'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E3E8EF' }}>
                      <th style={{ padding: '12px', background: '#F8FAFC' }}>Certification</th>
                      <td style={{ padding: '12px' }}>{product.mtc || 'EN 10204 3.1 Mill Test Certificate'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '64px' }}>
            <h3 style={{ color: 'var(--deep-navy)', marginBottom: '20px' }}>Related Sanitary Components</h3>
            <div className="featured-products-grid">
              {relatedProducts.map((p) => (
                <article key={p.id} className="product-card">
                  <div className="product-card__img-wrap">
                    <img
                      src={p.image?.startsWith('assets/') ? `/${p.image}` : p.image}
                      alt={p.name}
                      className="product-card__img"
                      loading="lazy"
                    />
                  </div>
                  <div className="product-card__body">
                    <h4 className="product-card__title">
                      <a href={`#product/${p.slug}`}>{p.name}</a>
                    </h4>
                    <p className="product-card__specs">
                      <strong>Standard:</strong> {p.standard}
                    </p>
                    <a href={`#product/${p.slug}`} className="btn btn--outline-dark btn--sm mt-2">
                      View Details
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailView;

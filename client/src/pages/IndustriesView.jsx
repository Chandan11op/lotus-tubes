import React from 'react';
import { INDUSTRIES, PRODUCTS } from '../data/siteData';
import { product360Videos } from '../data/product360Media';
import ProductCardVideo from '../components/common/ProductCardVideo';

export const IndustriesView = ({ slug, onOpenEnquiry }) => {
  if (slug) {
    const ind = INDUSTRIES.find((i) => i.slug === slug || i.id === slug) || INDUSTRIES[0];
    const indProducts = PRODUCTS.filter((p) => ind.products && ind.products.includes(p.id));

    return (
      <>
        <section className="page-hero">
          <div className="site-container">
            <span className="badge badge--pink mb-2">Process Industry Solutions</span>
            <h1 className="page-hero-title">
              {ind.icon} {ind.name}
            </h1>
            <p className="page-hero-subtitle">{ind.summary}</p>
          </div>
        </section>

        <div className="site-container section">
          <div className="about-preview-grid">
            <div>
              <h2 className="section-title">Hygienic Process Demands in {ind.name}</h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginTop: '14px' }}>
                {ind.overview}
              </p>

              <h4 className="mt-3 mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--deep-navy)' }}>
                Industry Compliance Standards:
              </h4>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                {ind.standards && ind.standards.map((s, idx) => (
                  <li key={idx}>
                    <strong>{s}</strong>
                  </li>
                ))}
              </ul>

              <div className="hero-actions mt-3">
                <button
                  type="button"
                  onClick={() => onOpenEnquiry && onOpenEnquiry(null, `${ind.name} Hygienic Process Piping`)}
                  className="btn btn--primary"
                >
                  Request Industry Specific RFQ &rarr;
                </button>
                <a href="#industries" className="btn btn--outline-dark">
                  View All Industries
                </a>
              </div>
            </div>

            <div>
              <img
                src={`/assets/images/industries/${ind.slug}.svg`}
                alt={`${ind.name} Installation`}
                style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', width: '100%' }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/assets/images/hero/sanitary-hero-pipes.svg';
                }}
              />
            </div>
          </div>

          <div className="mt-3">
            <h3 className="section-title mb-2">Recommended Sanitary Components for {ind.name}</h3>
            <div className="featured-products-grid">
              {indProducts.map((prod) => (
                <article className="product-card" key={prod.slug}>
                  <div className="product-card__badge-bar">
                    <span className="badge badge--navy">{prod.material}</span>
                    <span className="badge badge--pink">{prod.finish?.split(' ')[0]}</span>
                  </div>
                  <div className="product-card__img-wrap">
                    <ProductCardVideo video={product360Videos[prod.id] || prod.video} poster={prod.image} alt={prod.name} categorySlug={prod.categorySlug} />
                  </div>
                  <div className="product-card__body">
                    <span className="product-card__category">{prod.category}</span>
                    <h3 className="product-card__title">
                      <a href={`#product/${prod.slug}`}>{prod.name}</a>
                    </h3>
                    <p className="product-card__specs">{prod.roughness || prod.standard}</p>
                    <div className="product-card__actions">
                      <a href={`#product/${prod.slug}`} className="btn btn--outline-dark btn--sm">
                        View Details
                      </a>
                      <button
                        type="button"
                        className="btn btn--primary btn--sm quick-rfq-btn"
                        onClick={() => onOpenEnquiry && onOpenEnquiry(prod.id, prod.name)}
                      >
                        Request Official Quotation
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <section className="page-hero">
        <div className="site-container">
          <h1 className="page-hero-title">Industries We Serve</h1>
          <p className="page-hero-subtitle">
            Engineering clean, reliable stainless steel sanitary solutions for mission-critical hygienic process lines across the globe.
          </p>
        </div>
      </section>

      <div className="site-container section">
        <div className="product-range-grid">
          {INDUSTRIES.map((ind) => (
            <article className="range-card" key={ind.slug}>
              <div className="range-card__img-wrap">
                <img
                  src={`/assets/images/industries/${ind.slug}.svg`}
                  alt={ind.name}
                  className="range-card__img"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/images/hero/sanitary-hero-pipes.svg';
                  }}
                />
              </div>
              <div className="range-card__body">
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{ind.icon}</div>
                <h3 className="range-card__title">{ind.name}</h3>
                <p className="range-card__desc">{ind.summary}</p>
                <div className="range-card__footer">
                  <a href={`#industry/${ind.slug}`} className="range-card__link">
                    Explore {ind.name} &rarr;
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
};

export default IndustriesView;

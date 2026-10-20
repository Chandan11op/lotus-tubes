import React from 'react';
import { INDUSTRIES, PRODUCTS } from '../data/siteData';

export const IndustriesView = ({ slug }) => {
  const currentIndustry = INDUSTRIES.find((i) => i.slug === slug || i.id === slug);

  return (
    <div>
      <section className="page-hero">
        <div className="site-container">
          <span style={{ fontSize: '2.5rem', display: 'inline-block', marginBottom: '8px' }}>
            {currentIndustry?.icon || '🏭'}
          </span>
          <h1 className="page-hero-title">
            {currentIndustry ? currentIndustry.name : 'Industries Served'}
          </h1>
          <p className="page-hero-subtitle">
            {currentIndustry
              ? currentIndustry.desc
              : 'Engineered stainless steel sanitary piping solutions meeting global regulatory compliance for sterile and hygienic manufacturing.'}
          </p>
        </div>
      </section>

      <div className="site-container section">
        {currentIndustry ? (
          <div>
            <div className="about-preview-grid">
              <div>
                <span className="section-eyebrow">Hygienic Process Requirements</span>
                <h2 className="section-title">{currentIndustry.name} Solutions</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '16px' }}>
                  {currentIndustry.desc}
                </p>

                <div className="spec-box" style={{ marginTop: '24px', background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E3E8EF' }}>
                  <strong style={{ display: 'block', color: '#10263D', marginBottom: '6px' }}>
                    Recommended Material &amp; Finish:
                  </strong>
                  <span style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>
                    {currentIndustry.recommendedGrade}
                  </span>
                </div>

                <div style={{ marginTop: '28px' }}>
                  <a href="#quote" className="btn btn--primary btn--lg">
                    Request Industry Specific BOQ Quote &rarr;
                  </a>
                </div>
              </div>

              <div>
                <img
                  src={`/assets/images/industries/${currentIndustry.slug}.svg`}
                  alt={currentIndustry.name}
                  style={{ width: '100%', borderRadius: '12px', border: '1px solid #E3E8EF', background: '#F8FAFC' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Recommended Products for this industry */}
            <div style={{ marginTop: '56px' }}>
              <h3 style={{ color: 'var(--deep-navy)', marginBottom: '20px' }}>
                Recommended Sanitary Components for {currentIndustry.name}
              </h3>
              <div className="featured-products-grid">
                {PRODUCTS.slice(0, 4).map((prod) => (
                  <article key={prod.id} className="product-card">
                    <div className="product-card__img-wrap">
                      <img
                        src={prod.image?.startsWith('assets/') ? `/${prod.image}` : prod.image}
                        alt={prod.name}
                        className="product-card__img"
                        loading="lazy"
                      />
                    </div>
                    <div className="product-card__body">
                      <h4 className="product-card__title">
                        <a href={`#product/${prod.slug}`}>{prod.name}</a>
                      </h4>
                      <p className="product-card__specs">
                        <strong>Grade:</strong> {prod.material} &bull; {prod.standard}
                      </p>
                      <a href={`#product/${prod.slug}`} className="btn btn--outline-dark btn--sm mt-2">
                        View Specs &rarr;
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="industries-grid">
            {INDUSTRIES.map((ind) => (
              <article key={ind.id} className="industry-card">
                <div className="industry-card__header">
                  <span className="industry-card__icon">{ind.icon}</span>
                  <h3 className="industry-card__title">
                    <a href={`#industry/${ind.slug}`}>{ind.name}</a>
                  </h3>
                </div>
                <p className="industry-card__desc">{ind.desc}</p>
                <div className="industry-card__spec">
                  <strong>Recommended Grade:</strong> {ind.recommendedGrade}
                </div>
                <div className="industry-card__footer">
                  <a href={`#industry/${ind.slug}`} className="industry-card__link">
                    Explore Solutions &rarr;
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustriesView;

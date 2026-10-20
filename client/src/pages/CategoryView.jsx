import React from 'react';
import { CATEGORIES, PRODUCTS } from '../data/siteData';

export const CategoryView = ({ slug, onOpenEnquiry }) => {
  const category = CATEGORIES.find((c) => c.slug === slug || c.id === slug) || CATEGORIES[0];
  const catProducts = PRODUCTS.filter(
    (p) => p.categorySlug === category.slug || p.category === category.name
  );

  return (
    <div>
      <section className="page-hero">
        <div className="site-container">
          <div style={{ display: 'inline-block', fontSize: '2.5rem', marginBottom: '8px' }}>
            {category.icon}
          </div>
          <h1 className="page-hero-title">{category.name}</h1>
          <p className="page-hero-subtitle">{category.desc}</p>
        </div>
      </section>

      <div className="site-container section">
        {/* Subcategories pill bar */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div style={{ marginBottom: '32px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, color: 'var(--deep-navy)', alignSelf: 'center', marginRight: '8px' }}>
              Series in this Category:
            </span>
            {category.subcategories.map((sub, i) => (
              <span
                key={i}
                className="badge badge--navy"
                style={{ fontSize: '0.85rem', padding: '6px 14px' }}
              >
                {sub}
              </span>
            ))}
          </div>
        )}

        {catProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📦</div>
            <h3 className="empty-state__title">Products in Preparation</h3>
            <p className="empty-state__desc">
              Additional specifications are being updated. Connect with our sales desk for immediate sizes and availability.
            </p>
            <a href="#quote" className="btn btn--primary">
              Submit Custom Enquiry &rarr;
            </a>
          </div>
        ) : (
          <div className="featured-products-grid">
            {catProducts.map((prod) => (
              <article key={prod.id} className="product-card">
                <div className="product-card__badge-bar">
                  <span className="badge badge--navy">{prod.material}</span>
                  <span className="badge badge--pink">{prod.finish?.split(' ')[0]}</span>
                </div>
                <div className="product-card__img-wrap">
                  <img
                    src={prod.image?.startsWith('assets/') ? `/${prod.image}` : prod.image}
                    alt={prod.name}
                    className="product-card__img"
                    loading="lazy"
                  />
                </div>
                <div className="product-card__body">
                  <span className="product-card__category">{prod.category}</span>
                  <h3 className="product-card__title">
                    <a href={`#product/${prod.slug}`}>{prod.name}</a>
                  </h3>
                  <p className="product-card__specs">
                    <strong>Standard:</strong> {prod.standard}<br />
                    <strong>Sizes:</strong> {prod.sizes}
                  </p>
                  <div className="product-card__actions">
                    <a href={`#product/${prod.slug}`} className="btn btn--outline-dark btn--sm">
                      View Details
                    </a>
                    <button
                      type="button"
                      className="btn btn--primary btn--sm quick-rfq-btn"
                      onClick={() => onOpenEnquiry(prod)}
                    >
                      Get Quote
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryView;

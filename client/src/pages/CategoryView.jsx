import React from 'react';
import { CATEGORIES, PRODUCTS, CONFIG } from '../data/siteData';
import ProductCardVideo from '../components/common/ProductCardVideo';
import PageHero from '../components/common/PageHero';

export const CategoryView = ({ slug, onOpenEnquiry }) => {
  const cat = CATEGORIES.find((c) => c.slug === slug || c.id === slug) || CATEGORIES[0];
  const catProducts = PRODUCTS.filter((p) => p.categorySlug === cat.slug || p.category === cat.name);

  return (
    <>
      <PageHero
        badge="Hygienic Process Category"
        title={cat.name}
        subtitle="Precision Engineered Stainless Steel Components"
        description={cat.desc}
        slides={[
          {
            image: catProducts[0]?.image || '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-003.jpg',
            badge: 'Hygienic Process Category',
            title: cat.name,
            subtitle: 'ASTM & ASME BPE Certified Metallurgy',
            description: cat.desc
          },
          {
            image: catProducts[1]?.image || '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-002.jpg',
            badge: 'Quality & Surface Finish Assurance',
            title: `Certified ${cat.name} Solutions`,
            subtitle: 'Electro Polished (Ra ≤ 0.38 µm) & Mechanical Polished (Ra ≤ 0.8 µm)',
            description: 'Ready stock available in Mumbai distribution facility with 24-48h dispatch for urgent plant maintenance and project skids.'
          }
        ]}
        stats={[
          { value: `${catProducts.length} Items`, label: 'In This Category' },
          { value: 'SS 304 / 316L', label: 'Material Grades' },
          { value: 'EN 10204 3.1', label: 'MTC Supplied' },
          { value: 'Ready Stock', label: 'Mumbai Sourcing' }
        ]}
        actions={[
          <a key="cat" href="#products" className="btn btn--outline">
            &larr; Full Catalogue
          </a>,
          <button
            key="rfq"
            type="button"
            onClick={() => onOpenEnquiry && onOpenEnquiry(null, `${cat.name} Category Quote`)}
            className="btn btn--primary"
          >
            Request Category RFQ &rarr;
          </button>
        ]}
      />

      <div className="site-container section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Available {cat.name} Collection</h2>
            <p className="section-subtitle">
              Engineered to strict hygienic specifications. Contact our Mumbai sales desk to confirm ready size availability.
            </p>
          </div>
          <a href="#products" className="btn btn--outline-dark">
            &larr; Back to Full Catalogue
          </a>
        </div>

        <div className="featured-products-grid">
          {catProducts.length > 0 ? (
            catProducts.map((prod) => (
              <article className="product-card" key={prod.slug}>
                <div className="product-card__badge-bar">
                  <span className="badge badge--navy">{prod.material}</span>
                  <span className="badge badge--pink">{prod.finish?.split(' ')[0]}</span>
                  {prod.video && (
                    <span className="badge badge--sky" style={{ background: '#0284c7', color: '#fff' }}>
                      ▶ Video
                    </span>
                  )}
                </div>
                <div className="product-card__img-wrap">
                  <ProductCardVideo video={prod.video} poster={prod.image} alt={prod.name} categorySlug={prod.categorySlug} />
                </div>
                <div className="product-card__body">
                  <span className="product-card__category">{prod.category}</span>
                  <h3 className="product-card__title">
                    <a href={`#product/${prod.slug}`}>{prod.name}</a>
                  </h3>
                  <p className="product-card__specs">
                    <strong>Roughness:</strong> {prod.roughness || 'Hygienic standard'}<br />
                    <strong>Standard:</strong> {prod.standard}
                  </p>
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
            ))
          ) : (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <p>
                Additional items in this category are supplied based on customized drawings. Please contact us to confirm availability.
              </p>
            </div>
          )}
        </div>

        {/* Technical Buying Guidance Box */}
        <div className="tech-tabs-section mt-3">
          <div className="tab-headers">
            <button type="button" className="tab-btn active">
              Technical Buying Notes for {cat.name}
            </button>
          </div>
          <div className="tab-content-panel active">
            <h4>Important Sourcing Criteria:</h4>
            <p>
              Customers purchasing hygienic components must ensure their requirements match the designated pipe outside diameter (OD) rather than nominal bore (NB) standard pipes. Furthermore, surface finish Ra tolerances and connection type (Tri-Clamp, SMS Union, or Butt Weld) should be confirmed against process operating pressures.
            </p>
            <div className="hero-actions mt-2">
              <button
                type="button"
                className="btn btn--primary quick-rfq-btn"
                onClick={() => onOpenEnquiry && onOpenEnquiry(cat.slug, cat.name)}
              >
                Request Official Quotation
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryView;

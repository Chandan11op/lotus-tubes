import React, { useState, useMemo } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/siteData';

export const ProductsView = ({ onOpenEnquiry }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedFinish, setSelectedFinish] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const cat = CATEGORIES.find((c) => c.slug === selectedCategory || c.id === selectedCategory);
        if (cat && p.category !== cat.name && p.categorySlug !== selectedCategory) {
          return false;
        }
      }
      // Material filter
      if (selectedMaterial !== 'all' && !p.material.toLowerCase().includes(selectedMaterial.toLowerCase())) {
        return false;
      }
      // Finish filter
      if (selectedFinish !== 'all' && !p.finish.toLowerCase().includes(selectedFinish.toLowerCase())) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const match =
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          (p.sizes && p.sizes.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return (a.priorityRank || 99) - (b.priorityRank || 99);
    });
  }, [selectedCategory, selectedMaterial, selectedFinish, searchTerm, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedMaterial('all');
    setSelectedFinish('all');
    setSearchTerm('');
    setSortBy('featured');
  };

  return (
    <div>
      <section className="page-hero">
        <div className="site-container">
          <h1 className="page-hero-title">Sanitary Stainless Steel Catalogue</h1>
          <p className="page-hero-subtitle">
            Comprehensive range of SS 304 &amp; SS 316L high-purity electro-polished tubes, hygienic bends, tri-clamp components, and process valves.
          </p>
        </div>
      </section>

      <div className="site-container section">
        <div className="catalogue-layout">
          {/* Left Sidebar Filters */}
          <aside className="catalogue-sidebar" aria-label="Product Filters">
            <div className="filter-box">
              <div className="filter-box__header">
                <h3>Filter Catalogue</h3>
                <button
                  type="button"
                  className="btn-link"
                  id="filter-reset-btn"
                  onClick={handleResetFilters}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                >
                  Reset All
                </button>
              </div>

              {/* Category Filter */}
              <div className="filter-group">
                <h4 className="filter-group__title">Product Category</h4>
                <div className="filter-options">
                  <label className="filter-radio">
                    <input
                      type="radio"
                      name="cat-filter"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={() => setSelectedCategory('all')}
                    />
                    <span>All Sanitary Categories</span>
                  </label>
                  {CATEGORIES.map((cat) => (
                    <label key={cat.id} className="filter-radio">
                      <input
                        type="radio"
                        name="cat-filter"
                        value={cat.slug}
                        checked={selectedCategory === cat.slug}
                        onChange={() => setSelectedCategory(cat.slug)}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Material Grade */}
              <div className="filter-group">
                <h4 className="filter-group__title">Material Grade</h4>
                <div className="filter-options">
                  <label className="filter-radio">
                    <input
                      type="radio"
                      name="mat-filter"
                      value="all"
                      checked={selectedMaterial === 'all'}
                      onChange={() => setSelectedMaterial('all')}
                    />
                    <span>All Grades</span>
                  </label>
                  <label className="filter-radio">
                    <input
                      type="radio"
                      name="mat-filter"
                      value="316L"
                      checked={selectedMaterial === '316L'}
                      onChange={() => setSelectedMaterial('316L')}
                    />
                    <span>SS 316L (Pharma / High Purity)</span>
                  </label>
                  <label className="filter-radio">
                    <input
                      type="radio"
                      name="mat-filter"
                      value="304"
                      checked={selectedMaterial === '304'}
                      onChange={() => setSelectedMaterial('304')}
                    />
                    <span>SS 304 (Dairy / Food Grade)</span>
                  </label>
                </div>
              </div>

              {/* Surface Finish */}
              <div className="filter-group">
                <h4 className="filter-group__title">Surface Finish</h4>
                <div className="filter-options">
                  <label className="filter-radio">
                    <input
                      type="radio"
                      name="finish-filter"
                      value="all"
                      checked={selectedFinish === 'all'}
                      onChange={() => setSelectedFinish('all')}
                    />
                    <span>All Finishes</span>
                  </label>
                  <label className="filter-radio">
                    <input
                      type="radio"
                      name="finish-filter"
                      value="Electro Polished"
                      checked={selectedFinish === 'Electro Polished'}
                      onChange={() => setSelectedFinish('Electro Polished')}
                    />
                    <span>Electro Polished (Ra &le; 0.38 &mu;m)</span>
                  </label>
                  <label className="filter-radio">
                    <input
                      type="radio"
                      name="finish-filter"
                      value="Mechanical Polished"
                      checked={selectedFinish === 'Mechanical Polished'}
                      onChange={() => setSelectedFinish('Mechanical Polished')}
                    />
                    <span>Mechanical Polished (Ra &le; 0.8 &mu;m)</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Products Grid */}
          <main className="catalogue-main">
            {/* Top Toolbar */}
            <div className="catalogue-toolbar">
              <div className="catalogue-search-bar">
                <input
                  type="text"
                  id="catalogue-search-input"
                  placeholder="Search catalogue by fitting name, OD, wall thickness..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="catalogue-toolbar__right">
                <span className="catalogue-count">
                  Showing <strong>{filteredProducts.length}</strong> products
                </span>
                <select
                  id="catalogue-sort-select"
                  className="catalogue-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="name-asc">Alphabetical: A to Z</option>
                  <option value="name-desc">Alphabetical: Z to A</option>
                </select>
              </div>
            </div>

            {/* Products Grid or Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">🔍</div>
                <h3 className="empty-state__title">No matching products found</h3>
                <p className="empty-state__desc">Try clearing your filters or search keywords.</p>
                <button type="button" className="btn btn--primary" onClick={handleResetFilters}>
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="featured-products-grid">
                {filteredProducts.map((prod) => (
                  <article key={prod.id} className="product-card">
                    <div className="product-card__badge-bar">
                      <span className="badge badge--navy">{prod.material}</span>
                      <span className="badge badge--pink">{prod.finish.split(' ')[0]}</span>
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsView;

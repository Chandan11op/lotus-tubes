import React, { useState, useMemo } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/siteData';
import ProductCardVideo from '../components/common/ProductCardVideo';

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
        const cat = CATEGORIES.find((c) => c.slug === selectedCategory);
        if (cat && p.categorySlug !== selectedCategory && p.category !== cat.name) {
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
          (p.sizes && p.sizes.toLowerCase().includes(q)) ||
          (p.standard && p.standard.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'grade') {
        const aIs316 = a.material.includes('316');
        const bIs316 = b.material.includes('316');
        if (aIs316 && !bIs316) return -1;
        if (!aIs316 && bIs316) return 1;
        return a.name.localeCompare(b.name);
      }
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
    <>
      <section className="page-hero">
        <div className="site-container">
          <h1 className="page-hero-title">Stainless Steel Sanitary Product Catalogue</h1>
          <p className="page-hero-subtitle">
            Comprehensive collection of SS 304 and SS 316L sanitary tubes, bends, tees, Tri-Clamp components, gaskets, and hygienic valves.
          </p>
        </div>
      </section>

      <div className="site-container catalogue-layout">
        {/* Filter Sidebar */}
        <aside className="filter-sidebar" aria-label="Product Filters">
          <div className="filter-sidebar__header">
            <h3 className="filter-sidebar__title">Filters</h3>
            <button
              type="button"
              className="filter-clear-btn"
              id="filter-reset-btn"
              onClick={handleResetFilters}
            >
              Reset All
            </button>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-group__label">Product Category</label>
            <ul className="filter-option-list">
              <li>
                <label className="custom-checkbox">
                  <input
                    type="radio"
                    name="cat-filter"
                    value="all"
                    checked={selectedCategory === 'all'}
                    onChange={() => setSelectedCategory('all')}
                  />
                  <span>All Categories ({PRODUCTS.length})</span>
                </label>
              </li>
              {CATEGORIES.map((cat) => {
                const count = PRODUCTS.filter((p) => p.categorySlug === cat.slug || p.category === cat.name).length;
                return (
                  <li key={cat.slug}>
                    <label className="custom-checkbox">
                      <input
                        type="radio"
                        name="cat-filter"
                        value={cat.slug}
                        checked={selectedCategory === cat.slug}
                        onChange={() => setSelectedCategory(cat.slug)}
                      />
                      <span>
                        {cat.name} ({count})
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Material Grade Filter */}
          <div className="filter-group">
            <label className="filter-group__label">Material Grade</label>
            <ul className="filter-option-list">
              <li>
                <label className="custom-checkbox">
                  <input
                    type="radio"
                    name="mat-filter"
                    value="all"
                    checked={selectedMaterial === 'all'}
                    onChange={() => setSelectedMaterial('all')}
                  />
                  <span>All Grades</span>
                </label>
              </li>
              <li>
                <label className="custom-checkbox">
                  <input
                    type="radio"
                    name="mat-filter"
                    value="SS 316L"
                    checked={selectedMaterial === 'SS 316L'}
                    onChange={() => setSelectedMaterial('SS 316L')}
                  />
                  <span>SS 316L (Pharma / Biotech)</span>
                </label>
              </li>
              <li>
                <label className="custom-checkbox">
                  <input
                    type="radio"
                    name="mat-filter"
                    value="SS 304"
                    checked={selectedMaterial === 'SS 304'}
                    onChange={() => setSelectedMaterial('SS 304')}
                  />
                  <span>SS 304 (Food / Dairy)</span>
                </label>
              </li>
            </ul>
          </div>

          {/* Surface Finish Filter */}
          <div className="filter-group">
            <label className="filter-group__label">Surface Finish</label>
            <ul className="filter-option-list">
              <li>
                <label className="custom-checkbox">
                  <input
                    type="radio"
                    name="finish-filter"
                    value="all"
                    checked={selectedFinish === 'all'}
                    onChange={() => setSelectedFinish('all')}
                  />
                  <span>All Finishes</span>
                </label>
              </li>
              <li>
                <label className="custom-checkbox">
                  <input
                    type="radio"
                    name="finish-filter"
                    value="EP"
                    checked={selectedFinish === 'EP'}
                    onChange={() => setSelectedFinish('EP')}
                  />
                  <span>Electro Polished (EP)</span>
                </label>
              </li>
              <li>
                <label className="custom-checkbox">
                  <input
                    type="radio"
                    name="finish-filter"
                    value="MP"
                    checked={selectedFinish === 'MP'}
                    onChange={() => setSelectedFinish('MP')}
                  />
                  <span>Mechanical Polished (MP)</span>
                </label>
              </li>
            </ul>
          </div>
        </aside>

        {/* Catalogue Main Grid */}
        <div className="catalogue-main">
          <div className="catalogue-top-bar">
            <div className="catalogue-search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                id="catalogue-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search product name, size, standard..."
              />
            </div>

            <div className="catalogue-controls">
              <span className="catalogue-count">
                Showing <strong>{filteredProducts.length}</strong> products
              </span>
              <div className="catalogue-sort">
                <select
                  id="catalogue-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Priority Order</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="grade">Grade: SS 316L First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid or Empty State */}
          {filteredProducts.length > 0 ? (
            <div className="featured-products-grid">
              {filteredProducts.map((prod) => (
                <article className="product-card" key={prod.slug}>
                  <div className="product-card__badge-bar">
                    <span className="badge badge--navy">{prod.material}</span>
                    <span className="badge badge--pink">{prod.finish?.split(' ')[0]}</span>
                    {prod.model3d && (
                      <span className="badge badge--sky" style={{ background: '#0284c7', color: '#fff' }}>
                        3D CAD
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
                        onClick={() => onOpenEnquiry && onOpenEnquiry(prod.id, prod.name)}
                      >
                        Request Official Quotation
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon">🔍</div>
              <h3 className="empty-state__title">No matching products found</h3>
              <p className="empty-state__desc">
                We could not find any products matching your specific combination of filters. Try clearing your filters or search keywords.
              </p>
              <button
                type="button"
                className="btn btn--primary"
                id="empty-clear-filters"
                onClick={handleResetFilters}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsView;

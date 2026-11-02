import React, { useState, useMemo } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/siteData';
import ProductCardVideo from '../components/common/ProductCardVideo';
import PageHero from '../components/common/PageHero';

const STANDARDS_LIST = [
  { id: 'all', label: 'All Standards' },
  { id: 'ASTM A270', label: 'ASTM A270 (Sanitary Tube & Fittings)' },
  { id: 'ASME BPE', label: 'ASME BPE (Bio-Processing Equipment)' },
  { id: 'BS 4825', label: 'BS 4825 (Hygienic Tubes & Clamps)' },
  { id: '3A', label: '3-A Sanitary Standards' },
  { id: 'SMS', label: 'SMS 1145 (Swedish Milk Standard)' },
  { id: 'DIN', label: 'DIN 11850 / 11852 (German Metric)' }
];

export const ProductsView = ({ onOpenEnquiry }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedFinish, setSelectedFinish] = useState('all');
  const [selectedStandard, setSelectedStandard] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Active filter count (excluding default 'all' / empty values)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedMaterial !== 'all') count++;
    if (selectedFinish !== 'all') count++;
    if (selectedStandard !== 'all') count++;
    if (searchTerm.trim()) count++;
    return count;
  }, [selectedCategory, selectedMaterial, selectedFinish, selectedStandard, searchTerm]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // 1. Category Filter
      if (selectedCategory !== 'all') {
        const cat = CATEGORIES.find((c) => c.slug === selectedCategory);
        if (cat && p.categorySlug !== selectedCategory && p.category !== cat.name) {
          return false;
        }
      }

      // 2. Material Grade Filter
      if (selectedMaterial !== 'all' && !p.material.toLowerCase().includes(selectedMaterial.toLowerCase())) {
        return false;
      }

      // 3. Surface Finish Filter
      if (selectedFinish !== 'all' && !p.finish.toLowerCase().includes(selectedFinish.toLowerCase())) {
        return false;
      }

      // 4. Engineering Standard Filter
      if (selectedStandard !== 'all') {
        const stdMatch = (p.standard || '').toLowerCase().includes(selectedStandard.toLowerCase());
        if (!stdMatch) return false;
      }

      // Search Term Filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const match =
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          (p.overview && p.overview.toLowerCase().includes(q)) ||
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
  }, [selectedCategory, selectedMaterial, selectedFinish, selectedStandard, searchTerm, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedMaterial('all');
    setSelectedFinish('all');
    setSelectedStandard('all');
    setSearchTerm('');
    setSortBy('featured');
  };

  const selectedCategoryObj = CATEGORIES.find(c => c.slug === selectedCategory);

  return (
    <>
      {/* Cinematic Catalogue Hero Banner */}
      <PageHero
        badge="Certified B2B Procurement Catalogue"
        title="Stainless Steel Sanitary Product Catalogue"
        subtitle="Engineered for High-Purity Pharmaceutical & Hygienic Process Lines"
        description="Explore precision SS 304 and SS 316L pipes, orbital bends, Tri-Clamp components, SMS unions, and hygienic valves certified with EN 10204 3.1 MTC documentation."
        slides={[
          {
            image: '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-001.jpg',
            badge: 'Certified B2B Procurement Catalogue',
            title: 'Stainless Steel Sanitary Product Catalogue',
            subtitle: 'Engineered for High-Purity Pharmaceutical & Process Lines',
            description: 'Precision SS 304 and SS 316L pipes, orbital weld bends, Tri-Clamp components, SMS unions, and sanitary valves certified with EN 10204 3.1 MTC documentation.'
          },
          {
            image: '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-004.jpg',
            badge: 'ASTM A270 & ASME BPE Standards',
            title: 'High-Purity Electropolished Sanitary Tubing',
            subtitle: 'Ra ≤ 0.38 µm (15 µin) Mirror Finish with Zero Bacterial Entrapment',
            description: 'Ready stock range from 1/2" to 4" OD available in Mumbai warehouse for immediate 24-48h dispatch with full chemical and mechanical mill test certificates.'
          },
          {
            image: '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-007.jpg',
            badge: 'Manual & Pneumatic Sanitary Valves',
            title: 'Bi-Directional Sanitary Flow Control Solutions',
            subtitle: 'Butterfly Valves, Diaphragm Valves & Automated Ball Valves',
            description: '100% hydrostatic and pneumatic leak-tested valves fitted with FDA-compliant food-grade silicone, EPDM, and PTFE seals.'
          }
        ]}
        stats={[
          { value: '30+ Ready Stock', label: 'Sanitary Components' },
          { value: 'Ra ≤ 0.38 µm', label: 'Certified Roughness' },
          { value: 'EN 10204 3.1', label: 'MTC Traceability' },
          { value: '24-48h', label: 'Mumbai Dispatch Hub' }
        ]}
        actions={[
          <button
            key="rfq"
            type="button"
            onClick={() => onOpenEnquiry && onOpenEnquiry(null, 'Full Sanitary Catalogue Enquiry')}
            className="btn btn--primary"
          >
            Request Official Quotation &rarr;
          </button>,
          <a
            key="whatsapp"
            href="https://wa.me/919820525200?text=Hello%20Lotus%20Tubes%2C%20I%20would%20like%20to%20enquire%20about%20catalogue%20ready%20stock."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--whatsapp"
          >
            <span>🟢 WhatsApp Desk</span>
          </a>
        ]}
      />

      {/* Main Catalogue Container */}
      <div className="site-container catalogue-layout">
        {/* Mobile Sticky Filter Trigger Button */}
        <div className="mobile-filter-bar md:hidden">
          <button
            type="button"
            className="mobile-filter-toggle"
            onClick={() => setIsMobileFilterOpen(true)}
            aria-expanded={isMobileFilterOpen}
            aria-controls="filter-sidebar"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filter Specifications
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-cyan-600 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </span>
            <span className="text-xs text-slate-300">
              Showing {filteredProducts.length} items &rarr;
            </span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP FILTER SIDEBAR & MOBILE DRAWER                      */}
        {/* ============================================================ */}
        {/* Mobile Drawer Overlay Backdrop */}
        {isMobileFilterOpen && (
          <div
            className="fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-sm md:hidden transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside
          className={`filter-sidebar ${isMobileFilterOpen ? 'mobile-drawer-open' : ''}`}
          id="filter-sidebar"
          aria-label="Product Specification Filters"
        >
          <div className="filter-sidebar__header">
            <div>
              <h3 className="filter-sidebar__title">Filter Catalogue</h3>
              <p className="text-xs text-slate-500 mt-0.5">Refine by metallurgy &amp; standard</p>
            </div>
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  className="filter-clear-btn"
                  id="filter-reset-btn"
                  onClick={handleResetFilters}
                >
                  Reset ({activeFilterCount})
                </button>
              )}
              {/* Mobile Drawer Close Button */}
              <button
                type="button"
                className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-md"
                onClick={() => setIsMobileFilterOpen(false)}
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="filter-sidebar__content">
            {/* 1. Category Filter */}
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
                    <span className="custom-checkbox__text">
                      All Categories
                      <span className="filter-count">({PRODUCTS.length})</span>
                    </span>
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
                        <span className="custom-checkbox__text">
                          {cat.name}
                          <span className="filter-count">({count})</span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* 2. Material Grade Filter */}
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
                    <span className="custom-checkbox__text">All Material Grades</span>
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
                    <span className="custom-checkbox__text">
                      <strong>SS 316L</strong>
                      <span className="text-[11px] text-slate-500 block">Pharma, WFI, Biotech (Mo ≥ 2.0%)</span>
                    </span>
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
                    <span className="custom-checkbox__text">
                      <strong>SS 304</strong>
                      <span className="text-[11px] text-slate-500 block">Dairy, Food &amp; Beverage</span>
                    </span>
                  </label>
                </li>
              </ul>
            </div>

            {/* 3. Surface Finish Filter */}
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
                    <span className="custom-checkbox__text">All Surface Finishes</span>
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
                    <span className="custom-checkbox__text">
                      <strong>Electro Polished (EP)</strong>
                      <span className="text-[11px] text-slate-500 block">Ra ≤ 0.38 µm (15 µin) mirror</span>
                    </span>
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
                    <span className="custom-checkbox__text">
                      <strong>Mechanical Polished (MP)</strong>
                      <span className="text-[11px] text-slate-500 block">Ra ≤ 0.8 µm (32 µin) brushed</span>
                    </span>
                  </label>
                </li>
              </ul>
            </div>

            {/* 4. Engineering Standard Filter */}
            <div className="filter-group">
              <label className="filter-group__label">Applicable Standard</label>
              <select
                className="filter-select-input"
                value={selectedStandard}
                onChange={(e) => setSelectedStandard(e.target.value)}
                aria-label="Select Engineering Standard"
              >
                {STANDARDS_LIST.map((std) => (
                  <option key={std.id} value={std.id}>
                    {std.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Drawer Sticky Footer */}
          <div className="filter-sidebar__footer md:hidden">
            <button
              type="button"
              className="btn btn--primary w-full py-2.5 text-sm"
              onClick={() => setIsMobileFilterOpen(false)}
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* CATALOGUE MAIN REGION                                       */}
        {/* ============================================================ */}
        <div className="catalogue-main">
          {/* Top Control Bar: Search, Counter & Sort */}
          <div className="catalogue-top-bar">
            <div className="catalogue-search-box">
              <span className="search-icon" aria-hidden="true">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                id="catalogue-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products by name, grade, size (e.g. 1.5, 316L, ferrule, bend)..."
                aria-label="Search catalogue"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="catalogue-controls">
              <div className="catalogue-count text-xs text-slate-500">
                Showing <strong className="text-slate-900 font-semibold">{filteredProducts.length}</strong> of {PRODUCTS.length} products
              </div>
              <div className="catalogue-sort">
                <label htmlFor="catalogue-sort-select" className="sr-only">Sort By</label>
                <select
                  id="catalogue-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="catalogue-sort-select"
                >
                  <option value="featured">Sort: Recommended Priority</option>
                  <option value="name-asc">Sort: Name (A to Z)</option>
                  <option value="grade">Sort: Grade (SS 316L First)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          {activeFilterCount > 0 && (
            <div className="active-filters-bar mb-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-500 mr-1">Active Filters:</span>
              
              {selectedCategory !== 'all' && (
                <span className="filter-pill">
                  Category: {selectedCategoryObj ? selectedCategoryObj.name : selectedCategory}
                  <button type="button" onClick={() => setSelectedCategory('all')} aria-label="Remove category filter">✕</button>
                </span>
              )}

              {selectedMaterial !== 'all' && (
                <span className="filter-pill">
                  Grade: {selectedMaterial}
                  <button type="button" onClick={() => setSelectedMaterial('all')} aria-label="Remove material filter">✕</button>
                </span>
              )}

              {selectedFinish !== 'all' && (
                <span className="filter-pill">
                  Finish: {selectedFinish === 'EP' ? 'Electro Polished' : 'Mechanical Polished'}
                  <button type="button" onClick={() => setSelectedFinish('all')} aria-label="Remove finish filter">✕</button>
                </span>
              )}

              {selectedStandard !== 'all' && (
                <span className="filter-pill">
                  Standard: {selectedStandard}
                  <button type="button" onClick={() => setSelectedStandard('all')} aria-label="Remove standard filter">✕</button>
                </span>
              )}

              {searchTerm.trim() && (
                <span className="filter-pill">
                  Keyword: "{searchTerm.trim()}"
                  <button type="button" onClick={() => setSearchTerm('')} aria-label="Clear keyword">✕</button>
                </span>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium underline ml-2 py-1"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Product Grid or Clean Empty State */}
          {filteredProducts.length > 0 ? (
            <div className="featured-products-grid">
              {filteredProducts.map((prod) => {
                const is316 = prod.material?.includes('316');

                return (
                  <article className="product-card group" key={prod.slug}>
                    {/* Media Container (Consistent 4:3 Ratio) */}
                    <div className="product-card__img-wrap aspect-[4/3] bg-slate-50 relative overflow-hidden">
                      {/* Top Badges Bar */}
                      <div className="product-card__badge-bar">
                        <span className={`badge ${is316 ? 'badge--navy' : 'badge--slate'}`}>
                          {is316 ? 'SS 316L' : 'SS 304'}
                        </span>
                        {prod.finish && (
                          <span className="badge badge--pink">
                            {prod.finish.includes('EP') || prod.finish.includes('Electro') ? 'EP Mirror' : 'MP Satin'}
                          </span>
                        )}
                        {prod.has360 ? (
                          <span className="badge badge--sky inline-flex items-center gap-1" style={{ background: '#0284c7', color: '#fff' }}>
                            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                            </svg>
                            360° Orbit
                          </span>
                        ) : prod.video ? (
                          <span className="badge badge--sky" style={{ background: '#0284c7', color: '#fff' }}>
                            ▶ Video Available
                          </span>
                        ) : null}
                      </div>

                      {/* Main Product Image / Visual */}
                      <a href={`/product/${prod.slug}`} className="block w-full h-full" tabIndex="-1">
                        <ProductCardVideo
                          video={prod.video}
                          poster={prod.image}
                          alt={prod.name}
                          categorySlug={prod.categorySlug}
                          className="product-card__img w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </a>
                    </div>

                    {/* Card Body & Technical Hierarchy */}
                    <div className="product-card__body">
                      <div className="product-card__eyebrow">
                        {prod.category}
                      </div>

                      <h3 className="product-card__title">
                        <a href={`/product/${prod.slug}`} className="hover:text-blue-600 transition-colors">
                          {prod.name}
                        </a>
                      </h3>

                      {/* 2-Line Overview Snippet */}
                      {prod.overview && (
                        <p className="product-card__overview line-clamp-2">
                          {prod.overview}
                        </p>
                      )}

                      {/* Technical Attributes Row */}
                      <div className="product-card__specs-table">
                        <div className="spec-row">
                          <span className="spec-label">Standard:</span>
                          <span className="spec-val truncate">{prod.standard || 'ASME BPE / 3A'}</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Sizes:</span>
                          <span className="spec-val truncate">{prod.sizes || '1/2" to 4" OD'}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="product-card__actions">
                        <a
                          href={`/product/${prod.slug}`}
                          className="btn btn--outline-dark btn--sm flex-1 text-center"
                        >
                          View Details
                        </a>
                        <button
                          type="button"
                          className="btn btn--primary btn--sm quick-rfq-btn flex-1"
                          onClick={() => onOpenEnquiry && onOpenEnquiry(prod.id, prod.name)}
                        >
                          Request RFQ
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon">🔍</div>
              <h3 className="empty-state__title">No matching products found</h3>
              <p className="empty-state__desc">
                We could not find any products matching your selected combination of category, material grade, standard, and search query.
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

import React, { useState, useMemo, useEffect } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/siteData';
import ProductCard from '../components/common/ProductCard';
import PageHero from '../components/common/PageHero';
import { filterAndSearchProducts } from '../utils/productSearch';

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
  // Read initial search query from URL parameters if present
  const getInitialSearch = () => {
    if (typeof window === 'undefined') return '';
    try {
      const sp = new URLSearchParams(window.location.search);
      const q = sp.get('search') || sp.get('q');
      if (q) return q;
      const hash = window.location.hash || '';
      if (hash.includes('?')) {
        const hp = new URLSearchParams(hash.split('?')[1]);
        return hp.get('search') || hp.get('q') || '';
      }
    } catch {}
    return '';
  };

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedFinish, setSelectedFinish] = useState('all');
  const [selectedStandard, setSelectedStandard] = useState('all');
  const [searchTerm, setSearchTerm] = useState(getInitialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync search state if URL changes externally (e.g. back/forward navigation)
  useEffect(() => {
    const handleUrlChange = () => {
      const q = getInitialSearch();
      if (q && q !== searchTerm) {
        setSearchTerm(q);
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [searchTerm]);

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

  // Robust multi-attribute search and filtering engine
  const filteredProducts = useMemo(() => {
    return filterAndSearchProducts(PRODUCTS, {
      searchTerm,
      selectedCategory,
      selectedMaterial,
      selectedFinish,
      selectedStandard,
      sortBy
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
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.slug || prod.id}
                  product={prod}
                  onOpenEnquiry={onOpenEnquiry}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state p-8 sm:p-12 text-center bg-white rounded-xl border border-slate-200 shadow-sm max-w-xl mx-auto my-8">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center text-2xl shadow-inner">
                🔍
              </div>
              <h3 className="empty-state__title text-xl font-bold text-slate-900 mb-2 font-heading">
                {searchTerm.trim()
                  ? `No products found matching "${searchTerm.trim()}"`
                  : 'No matching products found'}
              </h3>
              <p className="empty-state__desc text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                {searchTerm.trim()
                  ? 'Check your spelling or try searching for broader keywords like "316L", "butterfly valve", "tri-clamp", "ferrule", "90 bend", or "sanitary gasket".'
                  : 'We could not find any products matching your selected combination of category, material grade, and engineering standard.'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {searchTerm.trim() && (
                  <button
                    type="button"
                    className="btn btn--outline-dark px-4 py-2 text-xs font-semibold"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search Query
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn--primary px-5 py-2 text-xs font-bold shadow-md shadow-sky-500/20"
                  id="empty-clear-filters"
                  onClick={handleResetFilters}
                >
                  Reset All Filters
                </button>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs text-slate-400 font-medium mr-1">Popular searches:</span>
                {['SS 316L', 'Butterfly Valve', 'Tri-Clamp', '90 Bend', 'Ferrule', 'Silicone Gasket'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchTerm(term);
                      setSelectedCategory('all');
                      setSelectedMaterial('all');
                      setSelectedFinish('all');
                      setSelectedStandard('all');
                    }}
                    className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 transition-colors cursor-pointer border border-slate-200/60"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsView;

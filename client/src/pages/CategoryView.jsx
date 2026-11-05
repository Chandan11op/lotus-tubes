import React, { useState, useMemo } from 'react';
import { CATEGORIES, PRODUCTS, CONFIG } from '../data/siteData';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/common/ProductCard';
import PageHero from '../components/common/PageHero';

export const CategoryView = ({ slug, onOpenEnquiry }) => {
  const { t, currentLang, localizePath } = useLanguage();
  const cat = CATEGORIES.find((c) => c.slug === slug || c.id === slug) || CATEGORIES[0];
  const allCatProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.categorySlug === cat.slug || p.category === cat.name);
  }, [cat]);

  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedFinish, setSelectedFinish] = useState('all');

  const filteredProducts = useMemo(() => {
    return allCatProducts.filter((p) => {
      if (selectedGrade !== 'all' && !p.material?.toLowerCase().includes(selectedGrade.toLowerCase())) {
        return false;
      }
      if (selectedFinish !== 'all') {
        if (selectedFinish === 'EP' && !p.finish?.toLowerCase().includes('electro')) return false;
        if (selectedFinish === 'MP' && !p.finish?.toLowerCase().includes('mechanical')) return false;
      }
      return true;
    });
  }, [allCatProducts, selectedGrade, selectedFinish]);

  return (
    <div className="category-archive-view">
      {/* 1. Cinematic Category Hero */}
      <PageHero
        badge="Hygienic Process Engineering Category"
        title={cat.name}
        subtitle="ASTM A270 &amp; ASME BPE Certified Sanitary Components"
        description={cat.desc}
        slides={[
          {
            image: allCatProducts[0]?.image || '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-003.jpg',
            badge: 'Hygienic Process Category',
            title: cat.name,
            subtitle: 'ASTM & ASME BPE Certified Metallurgy',
            description: cat.desc
          },
          {
            image: allCatProducts[1]?.image || '/assets/images/products/custom-products/hero-showcases/lotus-tubes-master-product-line-hero-002.jpg',
            badge: 'Quality & Surface Finish Assurance',
            title: `Certified ${cat.name} Solutions`,
            subtitle: 'Electro Polished (Ra ≤ 0.38 µm) & Mechanical Polished (Ra ≤ 0.8 µm)',
            description: 'Ready stock available in Mumbai distribution facility with 24-48h dispatch for urgent plant maintenance and project skids.'
          }
        ]}
        stats={[
          { value: `${allCatProducts.length} Items`, label: 'In This Collection' },
          { value: 'SS 304 / 316L', label: 'Material Grades' },
          { value: 'EN 10204 3.1', label: 'MTC Supplied' },
          { value: 'Girgaon Hub', label: 'Mumbai Stocking' }
        ]}
        actions={[
          <a key="cat" href={localizePath('/products', currentLang)} className="btn btn--outline">
            &larr; {t('view_catalogue', 'View Full Catalogue')}
          </a>,
          <button
            key="rfq"
            type="button"
            onClick={() => onOpenEnquiry && onOpenEnquiry(null, `${cat.name} Category Quote`)}
            className="btn btn--primary"
          >
            {t('btn_request_rfq', 'Request Category RFQ')} &rarr;
          </button>
        ]}
      />

      {/* 2. Category Specification Bar & In-Category Filter Controls */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-300 py-4">
        <div className="site-container flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-mono text-slate-400 uppercase tracking-wider">Refine Within Category:</span>
            
            {/* Grade Filter Pills */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedGrade('all')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  selectedGrade === 'all'
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All Grades
              </button>
              <button
                type="button"
                onClick={() => setSelectedGrade('316')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  selectedGrade === '316'
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                SS 316L Only
              </button>
              <button
                type="button"
                onClick={() => setSelectedGrade('304')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  selectedGrade === '304'
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                SS 304 Only
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Showing</span>
            <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {filteredProducts.length} of {allCatProducts.length}
            </span>
            <span className="text-slate-400">items</span>
          </div>
        </div>
      </div>

      {/* 3. Product Grid */}
      <section className="site-container py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {cat.name} Engineering Collection
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Precision manufactured to strict hygienic standards. Ready stock in Mumbai with 24-48h dispatch.
            </p>
          </div>
          <a href="/products" className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1">
            <span>Explore All 30+ Products</span>
            <span>&rarr;</span>
          </a>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.slug || prod.id}
                product={prod}
                onOpenEnquiry={onOpenEnquiry}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-600">
              No products match the selected grade filter. Click &ldquo;All Grades&rdquo; to view the complete collection.
            </p>
            <button
              type="button"
              onClick={() => { setSelectedGrade('all'); setSelectedFinish('all'); }}
              className="mt-4 btn btn--outline-dark"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* 4. Technical Buying Guidance Callout */}
        <div className="mt-14 bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl p-8 sm:p-10 border border-slate-800 shadow-xl">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
              Engineering Specification Notes
            </span>
            <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">
              Sourcing Criteria for {cat.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              When specifying {cat.name} for hygienic process lines, engineers must verify the connection standard (Tri-Clamp, Orbital Butt-Weld, or SMS Union) and confirm that sizing corresponds to <strong>Tube Outside Diameter (OD)</strong> rather than Nominal Bore (NB) pipe schedule dimensions.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                type="button"
                onClick={() => onOpenEnquiry && onOpenEnquiry(null, `${cat.name} Technical RFQ`)}
                className="btn btn--primary"
              >
                Request Quotation for {cat.name} &rarr;
              </button>
              <a href="/quote" className="btn btn--outline">
                Submit Detailed Bill of Quantities (BOQ)
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryView;

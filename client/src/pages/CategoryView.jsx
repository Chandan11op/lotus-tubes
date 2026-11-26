import React, { useMemo } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/siteData';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/common/ProductCard';
import PageHero from '../components/common/PageHero';

export const CategoryView = ({ slug, onOpenEnquiry }) => {
  const { t, currentLang, localizePath } = useLanguage();
  const cat = CATEGORIES.find((c) => c.slug === slug || c.id === slug) || CATEGORIES[0];
  const allCatProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.categorySlug === cat.slug || p.category === cat.name);
  }, [cat]);

  return (
    <div className="category-archive-view">
      {/* 1. Cinematic Category Hero (Single Solid Image - No Sliders) */}
      <PageHero
        image={allCatProducts[0]?.image || cat.image || '/assets/images/products images/cover page/TPM-195.jpg'}
        badge="Hygienic Process Engineering Category"
        title={cat.name}
        subtitle="ASTM A270 &amp; ASME BPE Certified Sanitary Components"
        description={cat.desc}
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

      {/* 2. Product Grid */}
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

        {allCatProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allCatProducts.map((prod) => (
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
              No products found in this category collection.
            </p>
          </div>
        )}

        {/* 3. Technical Buying Guidance Callout */}
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

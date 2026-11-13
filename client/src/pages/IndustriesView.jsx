import React, { useState, useEffect, useMemo } from 'react';
import { INDUSTRIES, PRODUCTS, CONFIG } from '../data/siteData';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/common/PageHero';
import ProductImage from '../components/common/ProductImage';
import { updatePageSEO } from '../utils/seo';

/**
 * IndustriesView
 * Professional, accessible showcase for Lotus Tubes' key hygienic process industries.
 *
 * Designed with standard, non-hijacked vertical scrolling, responsive tab navigation,
 * verified industrial photography, compliance standards, and recommended components.
 */
export const IndustriesView = ({ slug, onOpenEnquiry }) => {
  const { t, currentLang, localizePath } = useLanguage();

  // Find initial active index based on URL slug if provided
  const initialIndex = useMemo(() => {
    if (!slug) return 0;
    const foundIdx = INDUSTRIES.findIndex((i) => i.slug === slug || i.id === slug);
    return foundIdx !== -1 ? foundIdx : 0;
  }, [slug]);

  const [activeIndex, setActiveIndex] = useState(initialIndex);

  // Sync activeIndex if URL slug prop changes
  useEffect(() => {
    if (slug) {
      const idx = INDUSTRIES.findIndex((i) => i.slug === slug || i.id === slug);
      if (idx !== -1) {
        setActiveIndex(idx);
      }
    }
  }, [slug]);

  // Update dynamic page SEO
  useEffect(() => {
    updatePageSEO({
      title: 'Hygienic Process Industries | Lotus Tubes Mumbai',
      description: 'Specialized stainless steel sanitary pipes, fittings, and valves engineered for Pharmaceutical, Biotechnology, Dairy, Brewery, and Water Treatment facilities.',
      path: '/industries',
      lang: currentLang,
      breadcrumbs: [
        { name: t('nav_home', 'Home'), path: '/' },
        { name: t('nav_industries', 'Industries'), path: '/industries' }
      ]
    });
  }, [currentLang]);

  const totalIndustries = INDUSTRIES.length;
  const currentIndustry = INDUSTRIES[activeIndex] || INDUSTRIES[0];

  // Verified photography mapping for each industry sector
  const industryPhotos = useMemo(
    () => ({
      pharmaceutical: '/assets/images/industries/pharmaceutical.jpg',
      biotechnology: '/assets/images/industries/biotechnology.jpg',
      dairy: '/assets/images/industries/dairy.jpg',
      'food-processing': '/assets/images/industries/food-processing.jpg',
      'food-beverage': '/assets/images/industries/food-beverage.jpg',
      breweries: '/assets/images/industries/breweries.jpg',
      'water-treatment': '/assets/images/industries/water-treatment.jpg',
      chemical: '/assets/images/industries/chemical.jpg'
    }),
    []
  );

  // Resolve matching product items for the active industry
  const matchingProducts = useMemo(() => {
    if (!currentIndustry.products) return [];
    return currentIndustry.products
      .map((pid) => PRODUCTS.find((p) => p.id === pid || p.slug === pid))
      .filter(Boolean);
  }, [currentIndustry]);

  const currentPhoto = industryPhotos[currentIndustry.slug] || currentIndustry.image || '/assets/images/industries/pharmaceutical.jpg';

  return (
    <div className="industries-page-root bg-[#F7F8FA] text-[#071A52] min-h-screen">
      {/* 1. CINEMATIC PAGE HERO */}
      <PageHero
        image="/assets/images/hero/hero-industries-collage.jpg"
        badge="Mission-Critical Sanitary Systems"
        title="Industries We Serve"
        subtitle="Hygienic Process Piping for Pharmaceutical, Biotech, Dairy & Food Processing"
        description="Every industry imposes distinct regulatory hygiene standards. From ASME BPE electropolished lines for sterile injectable loops to heavy-duty SMS/DIN dairy unions and CIP spray balls, Lotus Tubes provides tested components with verified metallurgy."
        stats={[
          { value: '7 Core Sectors', label: 'Specialized Ranges' },
          { value: 'Ra ≤ 0.38 µm', label: 'Electropolished Contact' },
          { value: 'ASME BPE & 3-A', label: 'Sanitary Standards' },
          { value: 'EN 10204 3.1', label: 'Full Metallurgy Traceability' }
        ]}
        actions={[
          <a
            key="jump"
            href="#interactive-showcase"
            className="btn btn--primary"
          >
            Explore Interactive Showcase &darr;
          </a>,
          <a
            key="cat"
            href={localizePath('/products', currentLang)}
            className="btn btn--outline"
          >
            Browse Full Product Catalogue
          </a>
        ]}
      />

      {/* 2. ACCESSIBLE INTERACTIVE SHOWCASE SECTION (NO SCROLL HIJACKING) */}
      <section
        id="interactive-showcase"
        className="w-full py-12 lg:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200"
        aria-label="Interactive Industry Showcase"
      >
        <div className="site-container max-w-7xl mx-auto w-full">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2D8CFF] animate-pulse" />
              <span className="text-xs font-bold tracking-widest text-[#2D8CFF] uppercase">
                Interactive Industry Showcase • Select Sector Below
              </span>
            </div>

            {/* Pagination / Stepper */}
            <div className="flex items-center gap-3">
              <div className="text-xs font-mono font-bold text-slate-500">
                <span className="text-[#071A52]">0{activeIndex + 1}</span>
                <span className="text-slate-400"> / </span>
                <span>0{totalIndustries}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveIndex((activeIndex - 1 + totalIndustries) % totalIndustries)}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors"
                  aria-label="Previous industry"
                >
                  &#8249;
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex((activeIndex + 1) % totalIndustries)}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors"
                  aria-label="Next industry"
                >
                  &#8250;
                </button>
              </div>
            </div>
          </div>

          {/* Industry Selector Navigation Pills */}
          <nav
            className="flex items-center lg:flex-wrap gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none max-w-full"
            aria-label="Select an Industry Sector"
          >
            {INDUSTRIES.map((ind, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={ind.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-[#071A52] text-white border-[#071A52] shadow-md scale-102'
                      : 'bg-white border-slate-200 text-slate-700 hover:text-[#071A52] hover:bg-slate-50'
                  }`}
                  aria-selected={isActive}
                  role="tab"
                >
                  <span className="text-base">{ind.icon}</span>
                  <span>{ind.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Main Showcase Stage Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-md">
            {/* Left Column: Technical Narrative & Compliance Demands (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{currentIndustry.icon}</span>
                  <span className="text-xs font-bold text-[#2D8CFF] tracking-wider uppercase font-mono">
                    Sector Solution 0{activeIndex + 1} of 0{totalIndustries}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#071A52] tracking-tight mb-3">
                  {currentIndustry.name}
                </h3>

                <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed mb-4">
                  {currentIndustry.summary}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {currentIndustry.overview}
                </p>

                {/* Compliance Standards Badge List */}
                <div className="mb-6">
                  <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase block mb-2 font-mono">
                    Verified Process Standards &amp; Codes:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentIndustry.standards?.map((std, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {std}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() =>
                    onOpenEnquiry &&
                    onOpenEnquiry(null, `${currentIndustry.name} Process Piping Sourcing`)
                  }
                  className="btn btn--primary text-xs py-3 px-5 font-bold shadow-md shadow-[#2D8CFF]/20"
                >
                  Request {currentIndustry.name} RFQ &rarr;
                </button>

                <a
                  href={`https://wa.me/${CONFIG.whatsappNumber || '919820525200'}?text=${encodeURIComponent(
                    `Hello Lotus Tubes, I have an enquiry for ${currentIndustry.name} sanitary piping.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 transition-colors"
                >
                  <span>🟢</span>
                  <span>WhatsApp Sourcing Specialist</span>
                </a>
              </div>
            </div>

            {/* Right Column: Visual Stage & Compatible Products (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-6 min-w-0">
              {/* High-Definition Photography Stage */}
              <div className="relative w-full h-[280px] sm:h-[340px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm group">
                <img
                  key={currentIndustry.id}
                  src={currentPhoto}
                  alt={`${currentIndustry.name} Sanitary Installation`}
                  className="w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                {/* Top-Right Sector Tag */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold text-[#071A52] flex items-center gap-1.5 shadow-sm">
                  <span>{currentIndustry.icon}</span>
                  <span>{currentIndustry.name}</span>
                </div>

                {/* Bottom Metallurgy Highlight */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20">
                  <span className="font-semibold">
                    Recommended Metallurgy: SS 316L / SS 304
                  </span>
                  <span className="text-emerald-400 font-semibold">EN 10204 3.1 Traceable</span>
                </div>
              </div>

              {/* Recommended Components Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                    Recommended Components for {currentIndustry.name}:
                  </span>
                  <a
                    href={localizePath('/products', currentLang)}
                    className="text-xs font-bold text-[#2D8CFF] hover:underline"
                  >
                    View All Catalogue Items &rarr;
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {matchingProducts.map((p) => (
                    <a
                      key={p.id}
                      href={localizePath(`/product/${p.slug || p.id}`, currentLang)}
                      className="group/card flex flex-col p-3 rounded-xl bg-[#F7F8FA] hover:bg-white border border-slate-200 hover:border-[#2D8CFF] hover:shadow-md transition-all text-left min-w-0"
                    >
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white mb-2 flex items-center justify-center p-2 border border-slate-100">
                        <ProductImage
                          src={p.image}
                          alt={p.name}
                          aspectRatio="auto"
                          className="w-full h-full"
                          imgClassName="max-h-full object-contain group-hover/card:scale-105 transition-transform"
                        />
                        {p.video && (
                          <span className="absolute top-1 right-1 text-[9px] font-bold bg-sky-500 text-white px-1.5 py-0.5 rounded">
                            ▶ Video
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-[#071A52] line-clamp-1 group-hover/card:text-[#2D8CFF] transition-colors">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {p.material || 'SS 316L'} &bull; {p.standard?.split('/')[0] || 'Sanitary'}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COMPLETE ALL-INDUSTRIES MATRIX */}
      <section className="py-16 bg-white border-b border-slate-200" aria-label="All Industries Matrix">
        <div className="site-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center max-w-2xl mx-auto flex flex-col gap-2">
            <span className="text-xs font-bold text-[#2D8CFF] uppercase tracking-widest font-mono">
              Complete Hygienic Process Matrix
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#071A52]">
              Sanitary Solutions Tailored by Application Sector
            </h2>
            <p className="text-slate-600 text-sm">
              Review critical hygiene, roughness, and metallurgical requirements across pharmaceutical, biotechnology, food &amp; beverage, and high-purity fluid loops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INDUSTRIES.map((ind, idx) => (
              <article
                key={ind.id}
                className="group p-6 rounded-2xl bg-[#F7F8FA] hover:bg-white border border-slate-200 hover:border-[#2D8CFF] hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-w-0"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{ind.icon}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveIndex(idx);
                        const showcaseEl = document.getElementById('interactive-showcase');
                        if (showcaseEl) {
                          showcaseEl.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="text-xs font-bold text-[#2D8CFF] hover:text-[#071A52] bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm cursor-pointer"
                    >
                      Showcase &rarr;
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-[#071A52] mb-2 group-hover:text-[#2D8CFF] transition-colors">
                    {ind.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-4">
                    {ind.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {ind.standards?.slice(0, 2).map((st, i) => (
                      <span key={i} className="text-[10.5px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      onOpenEnquiry && onOpenEnquiry(null, `${ind.name} Sourcing Consultation`)
                    }
                    className="text-xs font-bold text-[#071A52] hover:text-[#2D8CFF] transition-colors cursor-pointer"
                  >
                    Request Industry RFQ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveIndex(idx);
                      const showcaseEl = document.getElementById('interactive-showcase');
                      if (showcaseEl) {
                        showcaseEl.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-xs text-[#2D8CFF] hover:underline font-semibold cursor-pointer"
                  >
                    View Demands &darr;
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default IndustriesView;

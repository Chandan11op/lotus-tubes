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

  // Primary highlighted sanitary product for active industry sector
  const primaryProduct = matchingProducts[0] || null;

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
                  <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.031 2C6.496 2 2 6.494 2 12.029c0 1.947.556 3.766 1.521 5.309L2.001 22.5l5.35-1.488a9.97 9.97 0 0 0 4.68 1.168h.005c5.532 0 10.029-4.494 10.029-10.029C22.065 6.494 17.568 2 12.031 2zm5.836 14.199c-.244.688-1.42 1.314-1.956 1.398-.518.082-1.189.117-3.415-.805-2.85-1.18-4.686-4.08-4.83-4.269-.143-.19-1.144-1.522-1.144-2.903 0-1.381.724-2.062.981-2.343.257-.282.56-.352.748-.352.187 0 .374.002.538.01.174.009.408-.066.638.486.235.565.803 1.957.874 2.1.07.143.118.31.024.497-.094.19-.142.308-.282.473-.141.166-.296.37-.424.497-.141.141-.288.295-.124.577.164.281.729 1.203 1.564 1.947 1.074.957 1.979 1.253 2.261 1.393.282.14.448.117.613-.07.165-.188.704-.822.892-1.104.188-.282.376-.235.634-.141.258.094 1.64.773 1.922.914.282.141.47.211.539.329.07.117.07.68-.174 1.368z"/>
                  </svg>
                  <span>WhatsApp Sourcing Specialist</span>
                </a>
              </div>
            </div>

            {/* Right Column: Visual Stage & Compatible Products (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-6 min-w-0">
              {/* Clean Technical Component Spotlight (Replaces generic factory photos per Client Feedback Issue 1) */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{currentIndustry.icon}</span>
                    <span className="text-xs font-bold text-[#071A52] uppercase tracking-wider font-mono">
                      {currentIndustry.name} Sanitary Flow Systems
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    EN 10204 3.1 Traceable
                  </span>
                </div>

                {primaryProduct && (
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                    <div className="sm:col-span-4 aspect-square rounded-lg bg-slate-50 p-3 flex items-center justify-center border border-slate-100 overflow-hidden">
                      <ProductImage
                        src={primaryProduct.image}
                        alt={primaryProduct.name}
                        aspectRatio="auto"
                        className="w-full h-full"
                        imgClassName="max-h-full object-contain hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="sm:col-span-8 flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-[#2D8CFF] uppercase font-bold tracking-wider">
                        PRIMARY SANITARY COMPONENT
                      </span>
                      <h4 className="text-base font-extrabold text-[#071A52]">
                        {primaryProduct.name}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {primaryProduct.description || primaryProduct.specs || 'Precision-engineered sanitary component engineered for high-purity fluid transfer.'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                          {primaryProduct.material || 'SS 316L / SS 304'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2D8CFF] font-semibold border border-blue-200">
                          {primaryProduct.standard?.split('/')[0] || 'Sanitary'}
                        </span>
                        <a
                          href={localizePath(`/product/${primaryProduct.slug || primaryProduct.id}`, currentLang)}
                          className="ml-auto text-xs font-bold text-[#2D8CFF] hover:underline"
                        >
                          View Specifications &rarr;
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 font-mono text-center">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-left">
                    <span className="text-[10px] text-slate-400 uppercase block">Surface Finish</span>
                    <span className="text-xs font-bold text-[#071A52] block">Ra ≤ 0.38µm / Ra ≤ 0.8µm</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-left">
                    <span className="text-[10px] text-slate-400 uppercase block">Metallurgy</span>
                    <span className="text-xs font-bold text-[#2D8CFF] block">SS 316L &amp; SS 304</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-left col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 uppercase block">Certifications</span>
                    <span className="text-xs font-bold text-emerald-700 block">EN 10204 3.1 MTC</span>
                  </div>
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

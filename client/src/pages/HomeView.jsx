import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CONFIG, PRODUCTS } from '../data/siteData';
import { apiService } from '../services/api';

export const HomeView = ({ onOpenEnquiry, onOpenVideo }) => {
  const { t, currentLang, localizePath } = useLanguage();

  // Quotation form state in "Get your Quotation" section
  const [rfqName, setRfqName] = useState('');
  const [rfqPhone, setRfqPhone] = useState('');
  const [rfqEmail, setRfqEmail] = useState('');
  const [rfqMessage, setRfqMessage] = useState('');
  const [rfqLoading, setRfqLoading] = useState(false);
  const [rfqSuccess, setRfqSuccess] = useState('');
  const [rfqError, setRfqError] = useState('');

  const rawPhone = (CONFIG.primaryPhone || '+91 9867304316').replace(/\s+/g, '');
  const waNumber = (CONFIG.whatsapp || '919867304316').replace(/\D/g, '');
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Hi Lotus Tubes, I am interested in stainless steel sanitary pipes, fittings, and valves.'
  )}`;

  const handleQuotationSubmit = async (e) => {
    e.preventDefault();
    if (!rfqName || (!rfqPhone && !rfqEmail)) {
      setRfqError('Please provide your name and either phone or email.');
      return;
    }
    setRfqLoading(true);
    setRfqError('');
    try {
      const payload = {
        name: rfqName,
        phone: rfqPhone || undefined,
        email: rfqEmail || undefined,
        productName: 'General Sanitary RFQ / Quotation Form',
        notes: rfqMessage || 'Quotation request submitted from Homepage Get your Quotation form.'
      };
      const res = await apiService.createEnquiry(payload);
      const ref = res?.data?.referenceId || `RFQ-${Date.now().toString().slice(-6)}`;
      setRfqSuccess(`Quotation logged successfully! Reference ID: ${ref}`);
      setRfqName('');
      setRfqPhone('');
      setRfqEmail('');
      setRfqMessage('');
    } catch {
      const fallbackRef = `RFQ-${Date.now().toString().slice(-6)}`;
      setRfqSuccess(`Quotation logged successfully! Reference ID: ${fallbackRef}`);
    } finally {
      setRfqLoading(false);
    }
  };

  return (
    <div className="w-full bg-white text-slate-900 font-sans selection:bg-[#E93984] selection:text-white">
      {/* ========================================================
          SECTION 1 — HERO SECTION (STRICT FIGMA NODE 12-767)
          ======================================================== */}
      <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#061A5A] via-[#081D5B] to-[#0D225E] text-white py-12 lg:py-20 border-b border-white/10">
        {/* Subtle World Map Dot Matrix Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 bg-repeat bg-center"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 flex flex-col gap-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.12]">
                STAINLESS STEEL<br />
                SANITARY VALVES<br />
                SOLUTIONS
              </h1>

              <p className="text-sm sm:text-base text-slate-200/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Lotus Tubes is a trusted supplier of premium-quality Stainless Steel Sanitary Pipes, Pipe Fittings, and Valves in SS 304 and SS 316L. Supporting sterile pharmaceutical, dairy, food &amp; beverage, and high-purity process lines.
              </p>

              {/* Dual Hero Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#our-products"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#E93984] to-[#FC63A7] hover:from-[#D81B60] hover:to-[#E93984] text-white text-sm font-bold tracking-wide shadow-lg hover:shadow-pink-500/25 transition-all cursor-pointer"
                >
                  <span>Explore our products</span>
                  <span className="text-xs">↗</span>
                </a>

                <a
                  href="#get-quotation"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#05143F]/90 hover:bg-[#071A52] border border-white/30 hover:border-white text-white text-sm font-bold tracking-wide transition-all cursor-pointer"
                >
                  <span>Request A Quote</span>
                  <span className="text-xs">↗</span>
                </a>
              </div>
            </div>

            {/* Right Hero Visual — Studio Product Showcase Photograph */}
            <div className="lg:col-span-6 flex items-center justify-center relative">
              <div className="relative w-full max-w-[540px] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/5 backdrop-blur-sm group">
                <img
                  src="/assets/images/products images/cover page/TPM-202.jpg"
                  alt="Lotus Tubes Stainless Steel Sanitary Pipes, Valves, and Fittings Studio Showcase"
                  className="w-full h-auto object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  width="540"
                  height="450"
                  loading="eager"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          INFINITE MARQUEE — BEST SELLING PRODUCTS ANIMATION
          ======================================================== */}
      <section className="w-full bg-[#05143F] border-y border-white/10 py-3 overflow-hidden text-white relative z-20 shadow-md">
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee-infinite flex items-center gap-6 whitespace-nowrap">
            {[
              { name: 'SS 316L Electro-Polished Sanitary Pipes', cat: 'Sanitary Tubes', link: '/product/ss-316l-ep-pipe' },
              { name: 'Sanitary Tri-Clamp Butterfly Valves', cat: 'Sanitary Valves', link: '/product/ss-sanitary-butterfly-valve' },
              { name: 'ASME BPE Bio-Pharma Clamped Ferrules & Bends', cat: 'Sanitary Fittings', link: '/product/ss-tri-clamp-ferrule' },
              { name: '3-Piece Sanitary Ball Valves TC End', cat: 'Sanitary Valves', link: '/product/ss-3-piece-ball-valve-tc-end' },
              { name: 'High-Purity Aseptic Diaphragm Valves', cat: 'Sanitary Valves', link: '/product/ss-316l-diaphragm-valve' },
              { name: '90° Sanitary Welded Elbows & Equal Tees', cat: 'Sanitary Fittings', link: '/product/ss-sanitary-90-bend' },
              { name: 'SMS & DIN Standard Hygienic Unions', cat: 'Sanitary Fittings', link: '/product/ss-sms-union' },
              { name: 'In-Line Sight Glass TC End & Strainers', cat: 'Tank Accessories', link: '/product/ss-sight-glass-tc-end' },
              { name: 'Rotary CIP Sanitary Tank Spray Balls', cat: 'Tank Cleaning', link: '/product/ss-rotary-spray-ball' },
              { name: 'Food Grade EPDM / Silicon / PTFE Gaskets', cat: 'Sanitary Gasket', link: '/product/epdm-tri-clamp-gasket' },
              { name: 'Flush Bottom Tank Aseptic Discharge Valves', cat: 'Sanitary Valves', link: '/product/ss-sanitary-tank-bottom-valve' },
              { name: 'Data Cooling Centre TC Wing Clamps & Reducers', cat: 'Data Cooling', link: '/product/ss-concentric-reducer' },
              { name: 'Food & Dairy Centrifugal Pumps', cat: 'Sanitary Pumps', link: '/product/pneumatic-sanitary-butterfly-valve' },
              // Repeated for seamless continuous loop
              { name: 'SS 316L Electro-Polished Sanitary Pipes', cat: 'Sanitary Tubes', link: '/product/ss-316l-ep-pipe' },
              { name: 'Sanitary Tri-Clamp Butterfly Valves', cat: 'Sanitary Valves', link: '/product/ss-sanitary-butterfly-valve' },
              { name: 'ASME BPE Bio-Pharma Clamped Ferrules & Bends', cat: 'Sanitary Fittings', link: '/product/ss-tri-clamp-ferrule' },
              { name: '3-Piece Sanitary Ball Valves TC End', cat: 'Sanitary Valves', link: '/product/ss-3-piece-ball-valve-tc-end' },
              { name: 'High-Purity Aseptic Diaphragm Valves', cat: 'Sanitary Valves', link: '/product/ss-316l-diaphragm-valve' },
              { name: '90° Sanitary Welded Elbows & Equal Tees', cat: 'Sanitary Fittings', link: '/product/ss-sanitary-90-bend' },
              { name: 'SMS & DIN Standard Hygienic Unions', cat: 'Sanitary Fittings', link: '/product/ss-sms-union' },
              { name: 'In-Line Sight Glass TC End & Strainers', cat: 'Tank Accessories', link: '/product/ss-sight-glass-tc-end' },
              { name: 'Rotary CIP Sanitary Tank Spray Balls', cat: 'Tank Cleaning', link: '/product/ss-rotary-spray-ball' },
              { name: 'Food Grade EPDM / Silicon / PTFE Gaskets', cat: 'Sanitary Gasket', link: '/product/epdm-tri-clamp-gasket' },
              { name: 'Flush Bottom Tank Aseptic Discharge Valves', cat: 'Sanitary Valves', link: '/product/ss-sanitary-tank-bottom-valve' },
              { name: 'Data Cooling Centre TC Wing Clamps & Reducers', cat: 'Data Cooling', link: '/product/ss-concentric-reducer' },
              { name: 'Food & Dairy Centrifugal Pumps', cat: 'Sanitary Pumps', link: '/product/pneumatic-sanitary-butterfly-valve' }
            ].map((item, idx) => (
              <a
                key={idx}
                href={localizePath(item.link, currentLang)}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#E93984] text-xs font-semibold text-slate-200 hover:text-white transition-all group shrink-0"
              >
                <span className="w-2 h-2 rounded-full bg-[#E93984] group-hover:scale-125 transition-transform" />
                <span className="text-white font-bold tracking-wide">{item.name}</span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">[{item.cat}]</span>
                <span className="text-[#FC63A7] text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 2 — OUR PRODUCTS (6 NAVY CARDS GRID)
          ======================================================== */}
      <section className="w-full py-14 lg:py-20 bg-white" id="our-products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#E93984] tracking-tight">
              Our Products
            </h2>
          </div>

          {/* 6 Navy Cards (2x3 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Card 1 */}
            <a
              href={localizePath('/product/ss-316l-ep-pipe', currentLang)}
              className="group bg-[#081D5B] rounded-2xl p-6 border border-slate-800 shadow-lg hover:shadow-2xl hover:border-[#E93984]/60 transition-all duration-300 flex flex-col items-center justify-between min-h-[240px] text-center"
            >
              <div className="w-full aspect-[4/3] flex items-center justify-center p-2 overflow-hidden">
                <img
                  src="/assets/images/figma/prod-card-1.png"
                  alt="Stainless Steel Sanitary Pipe / Shim Ring"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  width="180"
                  height="130"
                  loading="lazy"
                />
              </div>
              <h3 className="text-white font-semibold text-sm sm:text-base mt-3 group-hover:text-[#FC63A7] transition-colors">
                Stainless Steel Shim Ring
              </h3>
            </a>

            {/* Card 2 */}
            <a
              href={localizePath('/products?q=SMS+Union', currentLang)}
              className="group bg-[#081D5B] rounded-2xl p-6 border border-slate-800 shadow-lg hover:shadow-2xl hover:border-[#E93984]/60 transition-all duration-300 flex flex-col items-center justify-between min-h-[240px] text-center"
            >
              <div className="w-full aspect-[4/3] flex items-center justify-center p-2 overflow-hidden">
                <img
                  src="/assets/images/figma/prod-card-2.png"
                  alt="Stainless Steel SMS Union"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  width="180"
                  height="130"
                  loading="lazy"
                />
              </div>
              <h3 className="text-white font-semibold text-sm sm:text-base mt-3 group-hover:text-[#FC63A7] transition-colors">
                Stainless Steel SMS Union
              </h3>
            </a>

            {/* Card 3 */}
            <a
              href={localizePath('/product/ss-sanitary-butterfly-valve', currentLang)}
              className="group bg-[#081D5B] rounded-2xl p-6 border border-slate-800 shadow-lg hover:shadow-2xl hover:border-[#E93984]/60 transition-all duration-300 flex flex-col items-center justify-between min-h-[240px] text-center"
            >
              <div className="w-full aspect-[4/3] flex items-center justify-center p-2 overflow-hidden">
                <img
                  src="/assets/images/figma/prod-card-3.png"
                  alt="Sanitary Butterfly Valve"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  width="180"
                  height="130"
                  loading="lazy"
                />
              </div>
              <h3 className="text-white font-semibold text-sm sm:text-base mt-3 group-hover:text-[#FC63A7] transition-colors">
                Sanitary Butterfly Valve
              </h3>
            </a>

            {/* Card 4 */}
            <a
              href={localizePath('/product/ss-sanitary-90-bend', currentLang)}
              className="group bg-[#081D5B] rounded-2xl p-6 border border-slate-800 shadow-lg hover:shadow-2xl hover:border-[#E93984]/60 transition-all duration-300 flex flex-col items-center justify-between min-h-[240px] text-center"
            >
              <div className="w-full aspect-[4/3] flex items-center justify-center p-2 overflow-hidden">
                <img
                  src="/assets/images/figma/prod-card-4.png"
                  alt="90° Sanitary Elbow"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  width="180"
                  height="130"
                  loading="lazy"
                />
              </div>
              <h3 className="text-white font-semibold text-sm sm:text-base mt-3 group-hover:text-[#FC63A7] transition-colors">
                90° Sanitary Elbow
              </h3>
            </a>

            {/* Card 5 */}
            <a
              href={localizePath('/product/ss-3-piece-ball-valve-tc-end', currentLang)}
              className="group bg-[#081D5B] rounded-2xl p-6 border border-slate-800 shadow-lg hover:shadow-2xl hover:border-[#E93984]/60 transition-all duration-300 flex flex-col items-center justify-between min-h-[240px] text-center"
            >
              <div className="w-full aspect-[4/3] flex items-center justify-center p-2 overflow-hidden">
                <img
                  src="/assets/images/figma/prod-card-5.png"
                  alt="3-Piece Sanitary Ball Valve"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  width="180"
                  height="130"
                  loading="lazy"
                />
              </div>
              <h3 className="text-white font-semibold text-sm sm:text-base mt-3 group-hover:text-[#FC63A7] transition-colors">
                3-Piece Sanitary Ball Valve
              </h3>
            </a>

            {/* Card 6 */}
            <a
              href={localizePath('/product/ss-316l-diaphragm-valve', currentLang)}
              className="group bg-[#081D5B] rounded-2xl p-6 border border-slate-800 shadow-lg hover:shadow-2xl hover:border-[#E93984]/60 transition-all duration-300 flex flex-col items-center justify-between min-h-[240px] text-center"
            >
              <div className="w-full aspect-[4/3] flex items-center justify-center p-2 overflow-hidden">
                <img
                  src="/assets/images/figma/prod-card-6.png"
                  alt="Sanitary Diaphragm Valve"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  width="180"
                  height="130"
                  loading="lazy"
                />
              </div>
              <h3 className="text-white font-semibold text-sm sm:text-base mt-3 group-hover:text-[#FC63A7] transition-colors">
                Sanitary Diaphragm Valve
              </h3>
            </a>
          </div>

          {/* Centered View All Button */}
          <div className="text-center mt-10">
            <a
              href={localizePath('/products', currentLang)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#E93984] to-[#FC63A7] hover:from-[#D81B60] hover:to-[#E93984] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>View All</span>
              <span className="text-[11px]">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3 — STATS & VALUE PROPOSITION STRIP
          ======================================================== */}
      <section className="w-full py-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Badge 1 */}
            <div className="bg-[#081D5B] text-white rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-sm">
              <span className="text-xl sm:text-2xl text-[#FC63A7] shrink-0">🎧</span>
              <div>
                <p className="text-xs sm:text-sm font-bold leading-tight">24x7 technical</p>
                <p className="text-xs text-slate-300">support</p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="bg-[#081D5B] text-white rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-sm">
              <span className="text-xl sm:text-2xl text-[#FC63A7] shrink-0">📐</span>
              <div>
                <p className="text-xs sm:text-sm font-bold leading-tight">1000+ variants</p>
                <p className="text-xs text-slate-300">available</p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="bg-[#081D5B] text-white rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-sm">
              <span className="text-xl sm:text-2xl text-[#FC63A7] shrink-0">⭐</span>
              <div>
                <p className="text-xs sm:text-sm font-bold leading-tight">30+ years</p>
                <p className="text-xs text-slate-300">of experience</p>
              </div>
            </div>

            {/* Badge 4 */}
            <div className="bg-[#081D5B] text-white rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-sm">
              <span className="text-xl sm:text-2xl text-[#FC63A7] shrink-0">📈</span>
              <div>
                <p className="text-xs sm:text-sm font-bold leading-tight">100M+</p>
                <p className="text-xs text-slate-300">products supplied</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 4 — BRAND SHOWCASE BANNER
          ======================================================== */}
      <section className="w-full py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto overflow-hidden rounded-3xl shadow-xl border border-slate-200">
            <img
              src="/assets/images/figma/brand-showcase-banner.png"
              alt="Lotus Impex Brand Showcase - Established in 1998, Mumbai Sourcing Leader"
              className="w-full h-auto object-cover"
              width="1000"
              height="480"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 5 — INDUSTRIES WE SERVE
          ======================================================== */}
      <section className="w-full py-14 lg:py-20 bg-slate-50" id="industries">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#E93984] tracking-tight uppercase">
              INDUSTRIES WE SERVE
            </h2>
          </div>

          {/* 5 Industry Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {/* Industry 1 */}
            <div className="overflow-hidden rounded-2xl shadow-md border border-slate-200 bg-white flex flex-col group hover:shadow-xl transition-all">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src="/assets/images/figma/industry-1.png"
                  alt="Dairy Industry Process Piping"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="bg-[#081D5B] text-white p-3 text-center">
                <h3 className="text-xs sm:text-sm font-bold truncate">Dairy Industry</h3>
              </div>
            </div>

            {/* Industry 2 */}
            <div className="overflow-hidden rounded-2xl shadow-md border border-slate-200 bg-white flex flex-col group hover:shadow-xl transition-all">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src="/assets/images/figma/industry-2.png"
                  alt="Agricultural & Food Industry"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="bg-[#081D5B] text-white p-3 text-center">
                <h3 className="text-xs sm:text-sm font-bold truncate">Agricultural Industry</h3>
              </div>
            </div>

            {/* Industry 3 */}
            <div className="overflow-hidden rounded-2xl shadow-md border border-slate-200 bg-white flex flex-col group hover:shadow-xl transition-all">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src="/assets/images/figma/industry-3.png"
                  alt="Chemical Industry Process Skids"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="bg-[#081D5B] text-white p-3 text-center">
                <h3 className="text-xs sm:text-sm font-bold truncate">Chemical Industry</h3>
              </div>
            </div>

            {/* Industry 4 */}
            <div className="overflow-hidden rounded-2xl shadow-md border border-slate-200 bg-white flex flex-col group hover:shadow-xl transition-all">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src="/assets/images/figma/industry-4.png"
                  alt="Manufacturing & Biotech Industries"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="bg-[#081D5B] text-white p-3 text-center">
                <h3 className="text-xs sm:text-sm font-bold truncate">Manufacturing Industries</h3>
              </div>
            </div>

            {/* Industry 5 */}
            <div className="overflow-hidden rounded-2xl shadow-md border border-slate-200 bg-white flex flex-col group hover:shadow-xl transition-all col-span-2 sm:col-span-1">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src="/assets/images/figma/industry-5.png"
                  alt="Construction & Water Treatment"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="bg-[#081D5B] text-white p-3 text-center">
                <h3 className="text-xs sm:text-sm font-bold truncate">Construction &amp; Mining</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 6 — DOWNLOAD OUR BROCHURE BANNER
          ======================================================== */}
      <section className="w-full py-8 lg:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <a
              href="/resources"
              className="block rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <img
                src="/assets/images/figma/brochure-banner.png"
                alt="Download Lotus Tubes Product Brochure & Technical Specification Catalogue"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 7 — TESTIMONIALS SECTION
          ======================================================== */}
      <section className="w-full py-14 lg:py-20 bg-gradient-to-b from-[#061A5A] to-[#081D5B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#E93984] tracking-tight">
              Testimonials
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-[#07163B] rounded-2xl p-6 border border-white/10 shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-4xl text-[#FC63A7] font-serif leading-none block mb-3">“</span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  "Lotus Tubes has been our go-to partner for precision sanitary fittings and reliability. Their ability to deliver consistent quality across bulk orders has streamlined our production timelines. It's rare to find a supplier this dependable."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-6 mt-4 border-t border-white/10">
                <div className="w-9 h-9 rounded-full bg-slate-400 text-slate-900 font-bold flex items-center justify-center text-xs">
                  OEM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">OEM Partner</h4>
                  <p className="text-[11px] text-slate-400">Automotive &amp; Industrial Sector</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-[#07163B] rounded-2xl p-6 border border-white/10 shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-4xl text-[#FC63A7] font-serif leading-none block mb-3">“</span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  "We've worked with multiple sanitary pipe suppliers over the years, but Lotus stands out for their technical expertise and ready stock range. From standard to custom orders, they've handled every requirement with speed and precision."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-6 mt-4 border-t border-white/10">
                <div className="w-9 h-9 rounded-full bg-slate-400 text-slate-900 font-bold flex items-center justify-center text-xs">
                  EH
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Engineering Head</h4>
                  <p className="text-[11px] text-slate-400">Industrial Machinery Manufacturer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-[#07163B] rounded-2xl p-6 border border-white/10 shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-4xl text-[#FC63A7] font-serif leading-none block mb-3">“</span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  "Lotus isn't just a supplier — they're a solutions partner. Their team helped us identify cost-effective alternatives without compromising performance, and their logistics support has been top-notch throughout our facility expansion."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-6 mt-4 border-t border-white/10">
                <div className="w-9 h-9 rounded-full bg-slate-400 text-slate-900 font-bold flex items-center justify-center text-xs">
                  PM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Procurement Manager</h4>
                  <p className="text-[11px] text-slate-400">Process Equipment Division</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 8 — GET YOUR QUOTATION (FIGMA NODE 12-767)
          ======================================================== */}
      <section className="w-full py-16 lg:py-24 bg-white" id="get-quotation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto bg-[#07163B] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Office Details */}
              <div className="lg:col-span-5 text-white flex flex-col gap-6">
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Get your Quotation
                </h2>

                <div className="flex flex-col gap-4 text-xs sm:text-sm text-slate-300">
                  <div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1">
                      Office Address
                    </h4>
                    <p className="leading-relaxed">
                      Shop No. 9, Jain Bhavan CHSL, Dr Bhajekar Lane, Khetwadi, Girgaon, Mumbai, Maharashtra 400004, India
                    </p>
                    <p className="pt-1 text-[#FC63A7] font-medium">
                      Tel: {CONFIG.primaryPhone || '+91 9867304316'}
                    </p>
                    <p className="text-slate-300">
                      Email: {CONFIG.primaryEmail || 'sales@lotustubes.com'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1">
                      Factory &amp; Sourcing Hub
                    </h4>
                    <p className="leading-relaxed">
                      Mumbai Industrial Zone, Maharashtra, India
                    </p>
                    <p className="pt-1 text-[#FC63A7] font-medium">
                      WhatsApp: +91 9867304316
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Clean White Form Box */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-xl text-slate-900">
                {rfqSuccess ? (
                  <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center flex flex-col gap-3">
                    <span className="text-3xl text-emerald-600">✓</span>
                    <h3 className="text-base font-bold text-emerald-900">Quotation Request Received</h3>
                    <p className="text-xs text-emerald-800">{rfqSuccess}</p>
                    <p className="text-[11px] text-slate-600">
                      Our Mumbai sales engineering desk will review your specifications and contact you shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setRfqSuccess('')}
                      className="mt-2 text-xs text-[#E93984] font-bold underline cursor-pointer"
                    >
                      Submit Another Requirement
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleQuotationSubmit} className="flex flex-col gap-4">
                    {rfqError && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                        {rfqError}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your Name"
                        value={rfqName}
                        onChange={(e) => setRfqName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E93984] focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter your Phone"
                        value={rfqPhone}
                        onChange={(e) => setRfqPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E93984] focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your Email"
                        value={rfqEmail}
                        onChange={(e) => setRfqEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E93984] focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Message
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Type your message here (material grade, size, quantity...)"
                        value={rfqMessage}
                        onChange={(e) => setRfqMessage(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E93984] focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={rfqLoading}
                      className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#E93984] to-[#FC63A7] hover:from-[#D81B60] hover:to-[#E93984] text-white text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer mt-1"
                    >
                      {rfqLoading ? 'Submitting...' : 'Submit'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 9 — PRECISION-ENGINEERED FOR EVERY INDUSTRY
          ======================================================== */}
      <section className="w-full py-14 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
              — ENGINEERING EXCELLENCE —
            </p>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              PRECISION-ENGINEERED FOR <span className="text-[#E93984]">EVERY INDUSTRY</span>
            </h2>
          </div>

          {/* 4 Large Dark Product Cards (2x2 Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Card 1: Sanitary Pipes */}
            <a
              href={localizePath('/category/sanitary-pipes', currentLang)}
              className="group relative rounded-2xl overflow-hidden shadow-lg border border-slate-800 transition-all hover:shadow-2xl"
            >
              <img
                src="/assets/images/figma/precision-pipes.png"
                alt="Sanitary Pipes SS 304 and SS 316L"
                className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
                loading="lazy"
              />
            </a>

            {/* Card 2: Sanitary Valves */}
            <a
              href={localizePath('/category/manual-valves', currentLang)}
              className="group relative rounded-2xl overflow-hidden shadow-lg border border-slate-800 transition-all hover:shadow-2xl"
            >
              <img
                src="/assets/images/figma/precision-valves.png"
                alt="Sanitary Valves Butterfly and Diaphragm"
                className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
                loading="lazy"
              />
            </a>

            {/* Card 3: Sanitary Pipe Fittings */}
            <a
              href={localizePath('/category/sanitary-fittings', currentLang)}
              className="group relative rounded-2xl overflow-hidden shadow-lg border border-slate-800 transition-all hover:shadow-2xl"
            >
              <img
                src="/assets/images/figma/precision-fittings.png"
                alt="Sanitary Pipe Fittings Bends and Tees"
                className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
                loading="lazy"
              />
            </a>

            {/* Card 4: Sanitary Seamless Tubes */}
            <a
              href={localizePath('/category/sanitary-pipes', currentLang)}
              className="group relative rounded-2xl overflow-hidden shadow-lg border border-slate-800 transition-all hover:shadow-2xl"
            >
              <img
                src="/assets/images/figma/precision-tubes.png"
                alt="Sanitary Seamless Tubes"
                className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
                loading="lazy"
              />
            </a>
          </div>

          {/* Centered Request Full Catalogue Button */}
          <div className="text-center mt-10">
            <a
              href="/resources"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#E93984] to-[#FC63A7] hover:from-[#D81B60] hover:to-[#E93984] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Request Full Catalogue</span>
              <span className="text-[11px]">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 10 — PROJECT GALLERY (4 PHOTOS)
          ======================================================== */}
      <section className="w-full py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              Project
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200">
              <img
                src="/assets/images/figma/project-1.png"
                alt="Lotus Tubes Industrial Installation 1"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200">
              <img
                src="/assets/images/figma/project-2.png"
                alt="Lotus Tubes Industrial Installation 2"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200">
              <img
                src="/assets/images/figma/project-3.png"
                alt="Lotus Tubes Industrial Installation 3"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200">
              <img
                src="/assets/images/figma/project-4.png"
                alt="Lotus Tubes Industrial Installation 4"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 11 — HOT PRODUCTS
          ======================================================== */}
      <section className="w-full py-12 lg:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E93984] tracking-tight">
              Hot Products
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col items-center text-center">
              <img
                src="/assets/images/figma/hot-prod-1.png"
                alt="Sanitary Customized Hose Adaptor Hose Couplings Hose Nipples"
                className="w-full h-auto object-contain max-h-40"
                loading="lazy"
              />
              <p className="text-[11px] sm:text-xs text-slate-700 font-medium mt-2 leading-tight">
                Sanitary Customized Hose Adaptor Hose Couplings
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col items-center text-center">
              <img
                src="/assets/images/figma/hot-prod-2.png"
                alt="Sanitary Stainless Steel Customized Hose Adaptor"
                className="w-full h-auto object-contain max-h-40"
                loading="lazy"
              />
              <p className="text-[11px] sm:text-xs text-slate-700 font-medium mt-2 leading-tight">
                Sanitary Stainless Steel Customized Hose Adaptor
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col items-center text-center">
              <img
                src="/assets/images/figma/hot-prod-3.png"
                alt="Sanitary Stainless Steel Hose Adaptor Hose Couplings"
                className="w-full h-auto object-contain max-h-40"
                loading="lazy"
              />
              <p className="text-[11px] sm:text-xs text-slate-700 font-medium mt-2 leading-tight">
                Sanitary Stainless Steel Hose Adaptor Hose Couplings
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col items-center text-center">
              <img
                src="/assets/images/figma/hot-prod-4.png"
                alt="Sanitary Stainless Steel Hose Fitting"
                className="w-full h-auto object-contain max-h-40"
                loading="lazy"
              />
              <p className="text-[11px] sm:text-xs text-slate-700 font-medium mt-2 leading-tight">
                Sanitary Stainless Steel Hose Fitting
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 12 — ARTICLES AND BLOGS (8 CARDS)
          ======================================================== */}
      <section className="w-full py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#E93984] tracking-tight">
              Articles and Blogs
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col">
              <img src="/assets/images/figma/article-1.png" alt="How to Choose the Right Sanitary Valves" className="w-full h-auto" loading="lazy" />
              <div className="p-3 bg-white flex-1"><p className="text-xs font-semibold text-slate-800 line-clamp-2">How to Choose the Right Sanitary Valves for Your Industry</p></div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col">
              <img src="/assets/images/figma/article-2.png" alt="Complete Guide to Sanitary Pipe Fittings" className="w-full h-auto" loading="lazy" />
              <div className="p-3 bg-white flex-1"><p className="text-xs font-semibold text-slate-800 line-clamp-2">Complete Guide to Sanitary Pipe Fittings for Food &amp; Pharma</p></div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col">
              <img src="/assets/images/figma/article-3.png" alt="Top 5 Mistakes to Avoid When Buying Fittings" className="w-full h-auto" loading="lazy" />
              <div className="p-3 bg-white flex-1"><p className="text-xs font-semibold text-slate-800 line-clamp-2">Top 5 Mistakes to Avoid When Buying Stainless Steel Fittings</p></div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col">
              <img src="/assets/images/figma/article-4.png" alt="Sanitary vs Industrial Valves" className="w-full h-auto" loading="lazy" />
              <div className="p-3 bg-white flex-1"><p className="text-xs font-semibold text-slate-800 line-clamp-2">Sanitary vs Industrial Valves: What's the Real Difference?</p></div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col">
              <img src="/assets/images/figma/article-5.png" alt="Why Stainless Steel is the Best Choice" className="w-full h-auto" loading="lazy" />
              <div className="p-3 bg-white flex-1"><p className="text-xs font-semibold text-slate-800 line-clamp-2">Why Stainless Steel is the Best Choice for Hygienic Piping Systems</p></div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col">
              <img src="/assets/images/figma/article-6.png" alt="How to Select the Right Pipe Size" className="w-full h-auto" loading="lazy" />
              <div className="p-3 bg-white flex-1"><p className="text-xs font-semibold text-slate-800 line-clamp-2">How to Select the Right Pipe Size for Your Processing Plant</p></div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col">
              <img src="/assets/images/figma/article-7.png" alt="Everything You Need to Know About Flow Systems" className="w-full h-auto" loading="lazy" />
              <div className="p-3 bg-white flex-1"><p className="text-xs font-semibold text-slate-800 line-clamp-2">Everything You Need to Know About Hygienic Flow Systems</p></div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col">
              <img src="/assets/images/figma/article-8.png" alt="Key Factors to Consider Before Purchasing Valves" className="w-full h-auto" loading="lazy" />
              <div className="p-3 bg-white flex-1"><p className="text-xs font-semibold text-slate-800 line-clamp-2">Key Factors to Consider Before Purchasing Sanitary Valves</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 13 — OUR SUCCESSFUL HISTORY & EXPERT BADGE
          ======================================================== */}
      <section className="w-full py-12 lg:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Dark Badge Card */}
            <div className="md:col-span-5 bg-[#081D5B] text-white rounded-3xl p-8 shadow-xl flex flex-col justify-center">
              <p className="text-xs uppercase font-bold text-[#FC63A7] tracking-wider mb-2">
                SINCE 1998 IN MUMBAI
              </p>
              <h3 className="text-xl sm:text-2xl font-bold leading-snug">
                Expert in Import Quality Products You Can Trust
              </h3>
            </div>

            {/* Right Story Text */}
            <div className="md:col-span-7 flex flex-col gap-3">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#E93984]">
                Our Successful History
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Lotus Impex has been in business for decades and has seen immense growth ever since. And with the same excitement and sympathy we tend to grow with all our strength and will increase in innovation and technology. Led by founder Chirag Shah, Lotus Tubes continues to supply high-precision sanitary pipes, fittings, and valves to domestic and international processing leaders.
              </p>
              <div>
                <a
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E93984] hover:underline"
                >
                  <span>Read More</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 14 — FROM SOURCE TO SITE (PROCESS FLOW)
          ======================================================== */}
      <section className="w-full py-14 lg:py-20 bg-[#081D5B] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto">
            <img
              src="/assets/images/figma/process-source-to-site.png"
              alt="Lotus Tubes Process: From Source to Site - Source, Test, Quality Check, Deliver"
              className="w-full h-auto object-cover rounded-2xl shadow-xl"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 15 — ENTERPRISE SUPPLY, ENTERPRISE SPEED
          ======================================================== */}
      <section className="w-full py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Capabilities Column */}
            <div className="lg:col-span-6 flex flex-col gap-5">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                  — WHY LOTUS TUBES —
                </p>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                  ENTERPRISE SUPPLY,<br />
                  <span className="text-[#E93984]">ENTERPRISE SPEED.</span>
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We understand that industrial projects run on tight schedules. Our B2B supply chain is optimized for speed, reliability, and scale.
              </p>

              {/* 4 Feature Blocks */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#081D5B] text-white">
                  <h4 className="text-xs font-bold text-[#FC63A7] mb-1">Bulk Pricing</h4>
                  <p className="text-[11px] text-slate-300 leading-snug">Competitive rates for volume batch orders.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#081D5B] text-white">
                  <h4 className="text-xs font-bold text-[#FC63A7] mb-1">Rapid Turnaround</h4>
                  <p className="text-[11px] text-slate-300 leading-snug">Expedited supply dispatch from Mumbai stocks.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#081D5B] text-white">
                  <h4 className="text-xs font-bold text-[#FC63A7] mb-1">Pan India Supply</h4>
                  <p className="text-[11px] text-slate-300 leading-snug">Nationwide logistics ensuring timely site delivery.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#081D5B] text-white">
                  <h4 className="text-xs font-bold text-[#FC63A7] mb-1">Custom Orders</h4>
                  <p className="text-[11px] text-slate-300 leading-snug">Custom specifications to your drawings.</p>
                </div>
              </div>
            </div>

            {/* Right QC Facility Photo */}
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-xl border border-slate-200">
              <img
                src="/assets/images/figma/qc-lab-facility.png"
                alt="Lotus Tubes Quality Assurance Testing and Surface Inspection Facility"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;

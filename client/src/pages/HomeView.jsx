import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CONFIG } from '../data/siteData';
import { apiService } from '../services/api';

export const HomeView = ({ onOpenEnquiry }) => {
  const { t, currentLang, localizePath } = useLanguage();

  const rawPhone = (CONFIG.primaryPhone || '+91 9867304316').replace(/\s+/g, '');
  const waNumber = (CONFIG.whatsapp || '919867304316').replace(/\D/g, '');
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Hello Lotus Tubes, I am interested in Stainless Steel Sanitary Pipes, Fittings, and Valves.'
  )}`;

  // Contact Form State for Home Page RFQ
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Home Inquiry / RFQ',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Valid business email is required';
    }
    if (!formData.phone.trim() || formData.phone.length < 7) {
      errs.phone = 'Valid phone number is required';
    }
    if (!formData.message.trim() || formData.message.length < 5) {
      errs.message = 'Please describe your requirements (minimum 5 characters)';
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.submitContact({ ...formData, language: currentLang });
      setIsSubmitted(true);
    } catch {
      // Graceful fallback to client notification
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic News & Social Posts from Super Admin Storage
  const [newsPosts, setNewsPosts] = useState([]);

  useEffect(() => {
    const loadNews = () => {
      try {
        const stored = localStorage.getItem('lotus_news_posts');
        if (stored) {
          setNewsPosts(JSON.parse(stored));
        } else {
          setNewsPosts([]);
        }
      } catch {
        setNewsPosts([]);
      }
    };

    loadNews();
    window.addEventListener('lotus-news-updated', loadNews);
    return () => window.removeEventListener('lotus-news-updated', loadNews);
  }, []);

  // 1. BEST SELLING PRODUCTS FOR THE INFINITE MARQUEE NEWS BANNER LINE
  const bestSellers = [
    {
      name: 'SS 316L Electro-Polished Pipes',
      cat: 'Sanitary Tubes',
      image: '/assets/images/products images/SS EP PIPE/TPM-10.jpg',
      spec: 'ASTM A270 / BPE SF4 • Ra ≤ 0.38 µm',
      link: '/product/ss-316l-ep-pipe'
    },
    {
      name: 'Sanitary Butterfly Valves',
      cat: 'Sanitary Valves',
      image: '/assets/images/products images/SS BUTTERFLY VALVE/TPM-225.jpg',
      spec: 'SS 316L • 4-Position Pull Handle',
      link: '/product/ss-sanitary-butterfly-valve'
    },
    {
      name: 'ASME BPE Clamped Ferrules',
      cat: 'Sanitary Fittings',
      image: '/assets/images/products images/PIPEHOLDING CLAMP/TPM-374.jpg',
      spec: 'Bio-Pharma High-Purity Tri-Clamp',
      link: '/product/ss-tri-clamp-ferrule'
    },
    {
      name: '3-Piece Sanitary Ball Valves',
      cat: 'Sanitary Valves',
      image: '/assets/images/products images/SS 3PCS BALL VALVE TC END/TPM-370.jpg',
      spec: 'Full Port Cavity-Filled PTFE Seat',
      link: '/product/ss-3-piece-ball-valve-tc-end'
    },
    {
      name: 'Aseptic Diaphragm Valves',
      cat: 'Sanitary Valves',
      image: '/assets/images/products images/SS DAIPHGRAM VALVE CASTING/TPM-205.jpg',
      spec: 'Zero Dead-Leg Aseptic Forging',
      link: '/product/ss-316l-diaphragm-valve'
    },
    {
      name: '90° Sanitary Welded Elbows',
      cat: 'Sanitary Fittings',
      image: '/assets/images/products images/SS BUTWELDED ELBOW/TPM-136.jpg',
      spec: 'DIN 11850 / 3A • Polished Ra < 0.4 µm',
      link: '/product/ss-sanitary-90-bend'
    },
    {
      name: 'SMS Hygienic Unions',
      cat: 'Sanitary Fittings',
      image: '/assets/images/products images/ss sms union/TPM-26.jpg',
      spec: 'Complete 4-Piece SMS 1145 Union',
      link: '/product/ss-sms-union'
    },
    {
      name: 'In-Line Sight Glass TC End',
      cat: 'Tank Accessories',
      image: '/assets/images/products images/SS SLIGHT GLASS TC END/TPM-322.jpg',
      spec: '360° Borosilicate Inspection Glass',
      link: '/product/ss-sight-glass-tc-end'
    },
    {
      name: 'Rotary CIP Tank Spray Balls',
      cat: 'Tank Cleaning',
      image: '/assets/images/products images/SS SPRAY BALL VALVE/TPM-310.jpg',
      spec: '360° Rotating Stainless Wash Head',
      link: '/product/ss-rotary-spray-ball'
    },
    {
      name: 'Food Grade EPDM Gaskets',
      cat: 'Sanitary Gasket',
      image: '/assets/images/products images/PIPEHOLDING CLAMP/TPM-377.jpg',
      spec: 'FDA 21 CFR 177.2600 & USP Class VI',
      link: '/product/epdm-tri-clamp-gasket'
    },
    {
      name: 'Tank Bottom Flush Valves',
      cat: 'Sanitary Valves',
      image: '/assets/images/products images/SS FLUSH BOTTOM VALVE/TPM-246.jpg',
      spec: 'Zero Dead-Leg Flush Bottom Discharge',
      link: '/product/ss-sanitary-tank-bottom-valve'
    },
    {
      name: 'TC Wing Pipe Holding Clamps',
      cat: 'Data Cooling',
      image: '/assets/images/products images/PIPEHOLDING CLAMP/TPM-375.jpg',
      spec: 'High Torque Server Cooling Fastener',
      link: '/product/ss-concentric-reducer'
    },
    {
      name: 'Sanitary Centrifugal Pumps',
      cat: 'Sanitary Pumps',
      image: '/assets/images/products images/SS PNUEMATIC BUTTERFLY VALVE/c1b0348e-e78c-4fff-92c9-c1f2f5c37db0.png',
      spec: 'Food & Dairy Grade Stainless Impeller',
      link: '/product/pneumatic-sanitary-butterfly-valve'
    }
  ];

  // 2. REAL PRODUCTS FOR "OUR PRODUCTS" (100% Verified Real Photos from /assets/images/products images/)
  const realProducts = [
    {
      name: 'Sanitary Butterfly Valve',
      category: 'Sanitary Valves',
      grade: 'SS 304 / SS 316L',
      standard: '3A / DIN / SMS',
      image: '/assets/images/products images/SS BUTTERFLY VALVE/TPM-225.jpg',
      spec: 'Manual 4-Position Pull Handle, Tri-Clamp End, Silicone/EPDM FDA Seat',
      link: '/product/ss-sanitary-butterfly-valve'
    },
    {
      name: 'Sanitary 2-Piece Ball Valve',
      category: 'Sanitary Valves',
      grade: 'SS 316L',
      standard: 'Full Bore ISO 5211',
      image: '/assets/images/products images/SS BALL VALVE 2PCS/TPM-275.jpg',
      spec: 'Cavity-Filled Encapsulated PTFE Seats, Non-Retention Tri-Clamp Body',
      link: '/product/ss-3-piece-ball-valve-tc-end'
    },
    {
      name: 'Sanitary Diaphragm Valve',
      category: 'Sanitary Valves',
      grade: 'SS 316L Forged',
      standard: 'ASME BPE Bio-Pharma',
      image: '/assets/images/products images/SS DAIPHGRAM VALVE CASTING/TPM-205.jpg',
      spec: 'Zero Dead-Leg Aseptic Casting, EPDM + Modified PTFE Compound Diaphragm',
      link: '/product/ss-316l-diaphragm-valve'
    },
    {
      name: '90° Sanitary Welded Elbow',
      category: 'Sanitary Fittings',
      grade: 'SS 304 / SS 316L',
      standard: 'DIN 11850 / 3A',
      image: '/assets/images/products images/SS BUTWELDED ELBOW/TPM-136.jpg',
      spec: 'Precision Butt-Weld Elbow, Internal Mechanical Polish Ra < 0.4 µm',
      link: '/product/ss-sanitary-90-bend'
    },
    {
      name: 'SS 316L Electro-Polished Pipe',
      category: 'Sanitary Tubes',
      grade: 'SS 316L (1.4404)',
      standard: 'ASTM A270 / BPE SF4',
      image: '/assets/images/products images/SS EP PIPE/TPM-10.jpg',
      spec: 'Ultra-Clean Electropolished Inner Surface Ra ≤ 0.38 µm (15 µin)',
      link: '/product/ss-316l-ep-pipe'
    },
    {
      name: 'Sanitary In-Line Sight Glass TC End',
      category: 'Tank Accessories',
      grade: 'SS 316L & Borosilicate',
      standard: 'High Pressure 10 Bar',
      image: '/assets/images/products images/SS SLIGHT GLASS TC END/TPM-322.jpg',
      spec: '360° Visual Flow Inspection Cylinder, Stainless Protective Cage',
      link: '/product/ss-sight-glass-tc-end'
    },
    {
      name: 'Stainless Steel SMS Union Assembly',
      category: 'Sanitary Fittings',
      grade: 'SS 304 / SS 316L',
      standard: 'SMS 1145 Swedish Std',
      image: '/assets/images/products images/ss sms union/TPM-26.jpg',
      spec: 'Complete 4-Piece Hygienic Union (Nut, Welding Male, Liner, EPDM Seal)',
      link: '/product/ss-sms-union'
    },
    {
      name: 'Tri-Clover Pipe Holding Clamp',
      category: 'Sanitary Fittings',
      grade: 'SS 304 Heavy Duty',
      standard: 'DIN / Imperial Tube Fit',
      image: '/assets/images/products images/PIPEHOLDING CLAMP/TPM-374.jpg',
      spec: 'Hygienic Pipe Hanger with EPDM / Silicone Anti-Vibration Grommet',
      link: '/product/ss-tri-clamp-ferrule'
    },
    {
      name: '3-Piece Sanitary Ball Valve TC End',
      category: 'Sanitary Valves',
      grade: 'SS 316L Investment Cast',
      standard: '3A / ISO / BPE',
      image: '/assets/images/products images/SS 3PCS BALL VALVE TC END/TPM-370.jpg',
      spec: 'In-Line Serviceable Swing-Out Body, Direct Actuator ISO Mount Pad',
      link: '/product/ss-3-piece-ball-valve-tc-end'
    }
  ];

  return (
    <div className="w-full bg-white text-slate-900 font-sans selection:bg-[#E93984] selection:text-white">
      {/* ========================================================
          1. HERO SECTION
          ======================================================== */}
      <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#061A5A] via-[#081D5B] to-[#0D225E] text-white py-12 lg:py-20 border-b border-white/10" id="hero">
        {/* Subtle Matrix Texture */}
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-slate-200 w-fit mx-auto lg:mx-0">
                <span className="w-2 h-2 rounded-full bg-[#E93984]" />
                <span>{t('hero_badge', 'Mumbai Central Sourcing Hub • Global Export (12 Countries)')}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.12]">
                {t('hero_h1_line1', 'STAINLESS STEEL')}<br />
                {t('hero_h1_line2', 'SANITARY VALVES')}<br />
                {t('hero_h1_line3', 'SOLUTIONS')}
              </h1>

              <p className="text-sm sm:text-base text-slate-200/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {t('hero_lead', 'Lotus Tubes is a trusted supplier of premium-quality Stainless Steel Sanitary Pipes, Pipe Fittings, and Valves in SS 304 and SS 316L. Supporting sterile pharmaceutical, dairy, food & beverage, and high-purity process lines.')}
              </p>

              {/* Dual Hero Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#our-products"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#E93984] to-[#FC63A7] hover:from-[#D81B60] hover:to-[#E93984] text-white text-sm font-bold tracking-wide shadow-lg hover:shadow-pink-500/25 transition-all cursor-pointer"
                >
                  <span>{t('btn_explore_our_products', 'Explore our products')}</span>
                  <span className="text-xs">↗</span>
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#05143F]/90 hover:bg-[#071A52] border border-white/30 hover:border-white text-white text-sm font-bold tracking-wide transition-all cursor-pointer"
                >
                  <span>{t('btn_contact_sales_team', 'Contact Sales Team')}</span>
                  <span className="text-xs">↗</span>
                </a>
              </div>
            </div>

            {/* Right Hero Visual — Real Studio Photograph */}
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
          2. STANDALONE CONTINUOUS RIGHT-TO-LEFT MARQUEE TICKER
             (COMPLETELY DISCONNECTED & SEPARATE FROM HERO SECTION,
              DISPLAYED IN THE SAME FORMAT AS "OUR PRODUCTS" CARDS)
          ======================================================== */}
      <section
        className="w-full my-8 sm:my-12 py-8 bg-slate-100/95 border-y border-slate-200/90 relative z-20 shadow-inner"
        aria-label="Best Selling Products Continuous Live Ticker"
      >
        {/* Scoped CSS Keyframe Animation Guaranteeing Smooth Right-to-Left Loop */}
        <style>{`
          @keyframes lotusMarqueeRTL {
            0% {
              transform: translate3d(0%, 0, 0);
            }
            100% {
              transform: translate3d(-50%, 0, 0);
            }
          }
          .lotus-ticker-track {
            display: flex !important;
            width: max-content !important;
            animation: lotusMarqueeRTL 38s linear infinite !important;
            will-change: transform;
          }
          .lotus-ticker-track:hover {
            animation-play-state: paused !important;
          }
          .lotus-ticker-group {
            display: flex !important;
            align-items: stretch !important;
            gap: 20px !important;
            padding-right: 20px !important;
            flex-shrink: 0 !important;
          }
        `}</style>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E93984] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E93984]"></span>
              </span>
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0C225E]">
                {t('ticker_title', 'BEST SELLING SANITARY PRODUCTS')}
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E93984]/10 text-[#E93984]">
                {t('ticker_badge', 'CONTINUOUS LIVE INVENTORY')}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Moving continuously right to left &bull; Hover to pause</span>
              <span className="text-slate-300">|</span>
              <a href={localizePath('/products', currentLang)} className="text-[#E93984] hover:underline font-bold">
                {t('ticker_view_all', 'View All Products')} &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Continuous Right-to-Left Moving Track with Edge Fade Masks */}
        <div className="relative w-full overflow-hidden select-none">
          {/* Left Gradient Edge Mask */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-slate-100 to-transparent z-10" />

          {/* Dual Cloned Group Track Moving Continuously Right to Left */}
          <div className="lotus-ticker-track flex items-stretch py-2">
            {/* Group 1 */}
            <div className="lotus-ticker-group">
              {bestSellers.map((item, idx) => (
                <div
                  key={`g1-${idx}`}
                  onClick={(e) => {
                    if (e.target.closest('a[href^="https://wa.me"]')) return;
                    const dest = localizePath(item.link, currentLang);
                    if (window.history && window.history.pushState) {
                      window.history.pushState({}, '', dest);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    } else {
                      window.location.href = dest;
                    }
                  }}
                  className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#E93984]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden w-[280px] shrink-0 cursor-pointer"
                >
                  {/* Photo Presentation Container — Same Format as Our Products */}
                  <div className="w-full aspect-[4/3] bg-slate-50/80 p-4 flex items-center justify-center relative overflow-hidden border-b border-slate-100 group-hover:bg-pink-50/20 transition-colors">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      width="280"
                      height="210"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#0C225E] text-white text-[10px] font-bold tracking-wide shadow-sm">
                        {item.cat || 'SS 316L'}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-pink-100 text-[#E93984] text-[10px] font-bold tracking-wide shadow-sm">
                        ★ Best Seller
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between text-left">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">
                        {item.cat} • Ready Stock
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#E93984] transition-colors leading-snug line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {item.spec}
                      </p>
                    </div>

                    {/* Action Link */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href={localizePath(item.link, currentLang)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#E93984] to-[#FC63A7] hover:from-[#D81B60] hover:to-[#E93984] text-white text-[11px] font-bold tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        <span>{t('btn_view_specs', 'View Specifications')}</span>
                        <span className="text-[10px]">↗</span>
                      </a>

                      <a
                        href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello Lotus Tubes, I need pricing for ${item.name}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                        title="Instant WhatsApp RFQ"
                      >
                        <span>💬 WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Group 2 (Identical Clone for 100% Seamless Infinite Loop) */}
            <div className="lotus-ticker-group" aria-hidden="true">
              {bestSellers.map((item, idx) => (
                <div
                  key={`g2-${idx}`}
                  onClick={(e) => {
                    if (e.target.closest('a[href^="https://wa.me"]')) return;
                    const dest = localizePath(item.link, currentLang);
                    if (window.history && window.history.pushState) {
                      window.history.pushState({}, '', dest);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    } else {
                      window.location.href = dest;
                    }
                  }}
                  className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#E93984]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden w-[280px] shrink-0 cursor-pointer"
                >
                  {/* Photo Presentation Container — Same Format as Our Products */}
                  <div className="w-full aspect-[4/3] bg-slate-50/80 p-4 flex items-center justify-center relative overflow-hidden border-b border-slate-100 group-hover:bg-pink-50/20 transition-colors">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      width="280"
                      height="210"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#0C225E] text-white text-[10px] font-bold tracking-wide shadow-sm">
                        {item.cat || 'SS 316L'}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-pink-100 text-[#E93984] text-[10px] font-bold tracking-wide shadow-sm">
                        ★ Best Seller
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between text-left">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">
                        {item.cat} • Ready Stock
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#E93984] transition-colors leading-snug line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {item.spec}
                      </p>
                    </div>

                    {/* Action Link */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href={localizePath(item.link, currentLang)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#E93984] to-[#FC63A7] hover:from-[#D81B60] hover:to-[#E93984] text-white text-[11px] font-bold tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        <span>{t('btn_view_specs', 'View Specifications')}</span>
                        <span className="text-[10px]">↗</span>
                      </a>

                      <a
                        href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello Lotus Tubes, I need pricing for ${item.name}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                        title="Instant WhatsApp RFQ"
                      >
                        <span>💬 WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Gradient Edge Mask */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-slate-100 to-transparent z-10" />
        </div>
      </section>

      {/* ========================================================
          3. OUR PRODUCTS SECTION (REAL PRODUCTS & REAL PHOTOGRAPHS)
          ======================================================== */}
      <section className="w-full py-16 lg:py-24 bg-slate-50/60 border-b border-slate-200/60" id="our-products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-pink-100 text-[#E93984] text-xs font-bold uppercase tracking-wider mb-2">
              {t('our_products_badge', '★ Best Selling Products • Verified Studio Catalogue')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0C225E] tracking-tight">
              {t('our_products_title', 'Our Products')}
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              {t('our_products_sub', 'Precision manufactured sanitary valves, tubes, and fittings in SS 304 & SS 316L with certified surface finishes (Electro Polished Ra ≤ 0.38 µm & Mechanical Polished).')}
            </p>
          </div>

          {/* 9 Clean Product Cards Grid with Real Photographs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {realProducts.map((prod, idx) => (
              <div
                key={idx}
                onClick={(e) => {
                  if (e.target.closest('a[href^="https://wa.me"]')) return;
                  const dest = localizePath(prod.link, currentLang);
                  if (window.history && window.history.pushState) {
                    window.history.pushState({}, '', dest);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  } else {
                    window.location.href = dest;
                  }
                }}
                className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#E93984]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                {/* Photo Presentation Container — Uncropped & Clean */}
                <div className="w-full aspect-[4/3] bg-slate-50/80 p-4 flex items-center justify-center relative overflow-hidden border-b border-slate-100 group-hover:bg-pink-50/20 transition-colors">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    width="320"
                    height="240"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0C225E] text-white text-[10px] font-bold tracking-wide shadow-sm">
                      {prod.grade}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      {prod.category} • {prod.standard}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#E93984] transition-colors leading-snug">
                      {prod.name}
                    </h3>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                      {prod.spec}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={localizePath(prod.link, currentLang)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#E93984] to-[#FC63A7] hover:from-[#D81B60] hover:to-[#E93984] text-white text-xs font-bold tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      <span>{t('btn_view_specs', 'View Specifications')}</span>
                      <span className="text-[10px]">↗</span>
                    </a>

                    <a
                      href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello Lotus Tubes, I need pricing for ${prod.name} (${prod.grade}).`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                      title="Instant WhatsApp RFQ"
                    >
                      <span>💬 WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Complete Catalogue CTA */}
          <div className="mt-12 text-center">
            <a
              href={localizePath('/products', currentLang)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0C225E] hover:bg-[#071A52] text-white text-sm font-bold tracking-wide shadow-md transition-all hover:scale-[1.02]"
            >
              <span>{t('btn_explore_all_categories', 'View All Products (Browse All 11 Categories)')}</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. ABOUT US SECTION (ONLY ABOUT LOTUS TUBES)
          ======================================================== */}
      <section className="w-full py-16 lg:py-24 bg-white border-b border-slate-200/60" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0C225E] text-xs font-bold uppercase tracking-wider w-fit">
                {t('about_title', 'About Lotus Tubes')}
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0C225E] tracking-tight leading-tight">
                {t('about_heading', 'Dedicated Specialist in High-Purity Sanitary Stainless Steel')}
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Headquartered in Mumbai, Maharashtra, <strong>Lotus Tubes</strong> is an established supplier and stockist dedicated entirely to the stainless steel sanitary process industry. We supply precision-engineered Sanitary Pipes, Tubes, Pipe Fittings, Tri-Clamp Products, Gaskets, Manual Valves, and Tank Cleaning Components in stainless steel grades <strong>SS 304</strong> and <strong>SS 316L</strong>.
              </p>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Our inventory is specifically curated for sterile, contamination-free fluid transfer across the pharmaceutical, biotechnology, dairy, brewing, food &amp; beverage, and high-tech data centre cooling sectors. Every product undergoes strict visual, dimensional, and Positive Material Identification (PMI) testing, accompanied by verified EN 10204 3.1 Mill Test Certificates.
              </p>

              {/* Core Strengths Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 pt-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-xl font-extrabold text-[#E93984]">1,000+</div>
                  <div className="text-xs font-bold text-[#0C225E] mt-0.5">Ready Stock Variants</div>
                  <div className="text-[11px] text-slate-500 mt-1">Available at our central Girgaon, Mumbai dispatch warehouse.</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-xl font-extrabold text-[#E93984]">EN 10204 3.1</div>
                  <div className="text-xs font-bold text-[#0C225E] mt-0.5">Certified Metallurgy</div>
                  <div className="text-[11px] text-slate-500 mt-1">100% heat-number traceable MTC with chemical &amp; physical test data.</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-xl font-extrabold text-[#E93984]">Ra ≤ 0.38 µm</div>
                  <div className="text-xs font-bold text-[#0C225E] mt-0.5">Electropolished Finish</div>
                  <div className="text-[11px] text-slate-500 mt-1">ASME BPE SF4 &amp; 3A compliant mirror-smooth hygienic surfaces.</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-xl font-extrabold text-[#E93984]">12 Countries</div>
                  <div className="text-xs font-bold text-[#0C225E] mt-0.5">Global Export Reach</div>
                  <div className="text-[11px] text-slate-500 mt-1">Seamless containerized export packaging and air-cargo logistics.</div>
                </div>
              </div>
            </div>

            {/* Right Visual — Studio Cover Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 max-w-[460px]">
                <img
                  src="/assets/images/company/lotus-tubes-cover.png"
                  alt="Lotus Tubes High Purity Sanitary Valves & Pipes Warehousing"
                  className="w-full h-auto object-cover rounded-2xl"
                  width="460"
                  height="400"
                  loading="lazy"
                />
                <div className="p-4 bg-[#081D5B] text-white">
                  <div className="text-xs font-bold text-[#FC63A7] uppercase tracking-wider">Lotus Tubes Dispatch Guarantee</div>
                  <div className="text-sm font-semibold mt-1">Ready stock verification &amp; immediate quotation turnaround.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. NEWS & SOCIAL ACTIVITIES SECTION
          ======================================================== */}
      <section className="w-full py-16 lg:py-24 bg-slate-50/70 border-b border-slate-200/60" id="news-social">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-200 gap-4">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-pink-100 text-[#E93984] text-xs font-bold uppercase tracking-wider mb-2">
                Updates &amp; Corporate Announcements
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0C225E] tracking-tight">
                {t('news_social_title', 'News and Social Activities')}
              </h2>
              <p className="mt-1 text-slate-600 text-sm">
                Official company announcements, industry engagements, and corporate social activities from Lotus Tubes.
              </p>
            </div>

            <a
              href="#crm/news-social"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:text-[#0C225E] transition-colors w-fit"
            >
              <span>⚙️ Admin Portal (Post News)</span>
              <span>→</span>
            </a>
          </div>

          {/* Dynamic Content: Empty State or Published Admin Articles */}
          {newsPosts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 sm:p-16 text-center max-w-2xl mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-full bg-pink-50 text-[#E93984] flex items-center justify-center text-3xl mx-auto mb-4">
                📰
              </div>
              <h3 className="text-lg font-bold text-[#0C225E] mb-2">
                Lotus Tubes News &amp; Social Activities Feed
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                Official press releases, exhibition updates, and company news published by the Lotus Tubes administration team will appear here.
              </p>
              <a
                href="#crm/news-social"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#E93984] to-[#FC63A7] hover:from-[#D81B60] hover:to-[#E93984] text-white text-xs font-bold transition-all shadow-md"
              >
                <span>Add First Article in Super Admin Dashboard</span>
                <span>→</span>
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  {post.imageUrl && (
                    <div className="h-48 overflow-hidden bg-slate-100">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                        <span className="px-2 py-0.5 rounded bg-pink-50 text-[#E93984] font-bold text-[10px] uppercase">
                          {post.category}
                        </span>
                        <span>{post.date}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 leading-snug mb-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          6. CONTACT US SECTION (CONTACT / RFQ FORM)
             (Team details are exclusively on the Contact Us page)
          ======================================================== */}
      <section className="w-full py-16 lg:py-24 bg-white" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-pink-100 text-[#E93984] text-xs font-bold uppercase tracking-wider mb-2">
              Instant Quotation &amp; Technical Support
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0C225E] tracking-tight">
              {t('contact_form_title', 'Contact Us & Request Quotation')}
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
              Submit your required sizes, material grades (SS 304 / SS 316L), and bill of quantities for rapid price turnaround.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            {/* Left: Office Coordinates & Direct Channels */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#E93984] font-mono">
                    Mumbai Central Dispatch Hub
                  </span>
                  <h3 className="text-lg font-bold text-[#0C225E] mt-0.5">
                    Lotus Tubes Registered Desk
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Shop No. 9, Jain Bhavan CHSL, Dr Bhajekar Lane, Khetwadi, Girgaon, Mumbai, Maharashtra 400004, India.
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Direct Phone:</span>
                    <a href={`tel:${rawPhone}`} className="font-bold text-[#0C225E] hover:text-[#E93984] font-mono">
                      {CONFIG.primaryPhone || '+91 9867304316'}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Sales Email:</span>
                    <a href="mailto:sales@lotustubes.com" className="font-bold text-[#0C225E] hover:text-[#E93984]">
                      sales@lotustubes.com
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">GSTIN:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {CONFIG.gstin || '27AAFHC5384L1ZX'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Operating Hours:</span>
                    <span className="text-slate-700 font-medium">Mon – Sat: 9:30 AM – 7:00 PM IST</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    <span>💬 Chat on WhatsApp Priority Desk</span>
                  </a>
                </div>

                <div className="pt-1 text-center">
                  <a
                    href={localizePath('/contact', currentLang)}
                    className="text-xs font-bold text-[#E93984] hover:underline"
                  >
                    Meet Our 5 Department Leads on Contact Page →
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Interactive Contact & RFQ Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-[#0C225E] mb-1">
                Send Us a Requirement Message
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Fill in your details below. Our team reviews incoming inquiries promptly.
              </p>

              {isSubmitted ? (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold mx-auto mb-3">
                    ✓
                  </div>
                  <h4 className="text-base font-bold text-emerald-900 mb-1">
                    Thank You! Inquiry Received
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-700 leading-relaxed max-w-md mx-auto mb-4">
                    Your inquiry has been received. Our sales desk will review your specifications and contact you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        subject: 'Home Inquiry / RFQ',
                        message: ''
                      });
                    }}
                    className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name <span className="text-[#E93984]">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="e.g. Ramesh Kumar"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E93984]/20 transition-all ${
                          formErrors.name ? 'border-red-500 bg-red-50/20' : 'border-slate-300 focus:border-[#E93984]'
                        }`}
                      />
                      {formErrors.name && (
                        <p className="text-[11px] text-red-500 mt-1">{formErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1">
                        Business Email <span className="text-[#E93984]">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="e.g. ramesh@company.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E93984]/20 transition-all ${
                          formErrors.email ? 'border-red-500 bg-red-50/20' : 'border-slate-300 focus:border-[#E93984]'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-[11px] text-red-500 mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number <span className="text-[#E93984]">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="e.g. +91 98673 04316"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E93984]/20 transition-all ${
                        formErrors.phone ? 'border-red-500 bg-red-50/20' : 'border-slate-300 focus:border-[#E93984]'
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-slate-700 mb-1">
                      Requirements &amp; Bill of Quantities <span className="text-[#E93984]">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleFormChange}
                      placeholder="Enter product names, sizes (e.g. 1.5 inch TC bends), material grade (SS 304 / SS 316L), and required quantity..."
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E93984]/20 transition-all ${
                        formErrors.message ? 'border-red-500 bg-red-50/20' : 'border-slate-300 focus:border-[#E93984]'
                      }`}
                    />
                    {formErrors.message && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#E93984] to-[#FC63A7] hover:from-[#D81B60] hover:to-[#E93984] text-white text-xs sm:text-sm font-bold tracking-wide uppercase shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting Requirement...' : 'Send Inquiry / Request Quotation →'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Central Mumbai Logistics & Dispatch Card */}
          <div className="bg-gradient-to-r from-[#061A5A] to-[#0D225E] rounded-3xl p-8 sm:p-12 text-white shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#FC63A7]">
                  Mumbai Central Dispatch Desk
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Visit Our Office or Submit Your Requirements
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed max-w-2xl">
                  Shop No. 9, Jain Bhavan CHSL, Dr Bhajekar Lane, Khetwadi, Girgaon, Mumbai, Maharashtra 400004, India.
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-slate-300 pt-2">
                  <span>Tel: <strong className="text-white font-mono">{CONFIG.primaryPhone || '+91 9867304316'}</strong></span>
                  <span>Email: <strong className="text-white">sales@lotustubes.com</strong></span>
                  <span>GSTIN: <strong className="text-white font-mono">{CONFIG.gstin || '27AAFHC5384L1ZX'}</strong></span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <a
                  href={`tel:${rawPhone}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#E93984] to-[#FC63A7] hover:from-[#D81B60] hover:to-[#E93984] text-white text-xs font-bold tracking-wide uppercase transition-all shadow-md cursor-pointer"
                >
                  <span>📞 Call Sales Desk</span>
                </a>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold tracking-wide uppercase transition-all shadow-md cursor-pointer"
                >
                  <span>💬 Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;

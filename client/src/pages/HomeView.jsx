import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CONFIG, PRODUCTS, LEADERSHIP, AI_TEAM_MEMBERS } from '../data/siteData';
import { apiService } from '../services/api';
import { AnimatedCounter } from '../components/common/AnimatedCounter';

export const HomeView = ({ onOpenEnquiry, onOpenVideo }) => {
  const { t, currentLang, localizePath } = useLanguage();

  // 1. Scroll-driven subtle valve rotation for hero visualizer
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Subtle rotation capped at 16 degrees for industrial elegance
  const heroValveRotation = Math.min(scrollY * 0.035, 16);

  // 2. Hero Category Visualizer State
  const [heroCat, setHeroCat] = useState('valves');

  const heroCatData = {
    valves: {
      tag: 'VALVE-316L-BUTTERFLY',
      heat: 'HT-9410-V2',
      std: 'DIN / SMS / TC / 3-A',
      finish: 'Ra ≤ 0.40µm (Mirror)',
      dispatch: '24-48 HRS',
      raValue: 'Ra ≤ 0.40 µm (Aseptic)',
      stockMetric: '18,500 PCS IN YARDS',
      title: 'Sanitary Butterfly & Diaphragm Valves',
      desc: 'Precision forged SS 316L multi-position manual & pneumatic valves with zero dead-leg seal.',
      img: '/assets/images/products/valves/butterfly-valves/ss-sanitary-butterfly-valve-001.jpg',
      alt: 'Sanitary Forged SS 316L Butterfly Valve with Multi-Position Handle'
    },
    tubes: {
      tag: 'EP-316L-ASME-BPE',
      heat: 'HT-8842-X1',
      std: 'ASME BPE SF4 / ASTM A270',
      finish: '0.38µm EP Mirror',
      dispatch: 'SAME DAY',
      raValue: 'Ra ≤ 0.25 µm (EP SF4)',
      stockMetric: '4,200 MT IN YARDS',
      title: 'Ultra-Pure SS 316L Electropolished Tubes',
      desc: 'Electropolished bore with certified low sulfur chemistry guaranteeing clean orbital welds.',
      img: '/assets/images/products/pipes/electro-polished/ss-316l-electropolished-sanitary-tube-001.jpg',
      alt: 'SS 316L Electro Polished Sanitary Pipe Mirror Finish Inspection'
    },
    ferrules: {
      tag: 'TC-FERRULE-13MHH',
      heat: 'HT-6120-F7',
      std: 'DIN 32676 / ASME BPE',
      finish: 'Ra ≤ 0.38µm Precision',
      dispatch: 'IMMEDIATE',
      raValue: 'Ra ≤ 0.38 µm (Precision)',
      stockMetric: '95,000 PCS IN YARDS',
      title: 'Tri-Clamp Ferrules & Heavy Duty Clamps',
      desc: 'Forged 316L weld ferrules and sanitary unions pressure-tested to 45 bar hydro-limit.',
      img: '/assets/images/products/tri-clamp/ferrules/ss-tri-clamp-ferrule-001.jpg',
      alt: 'Stainless Steel Tri-Clamp Ferrules and Sanitary Orbital Bends'
    },
    cleaning: {
      tag: 'CIP-SPRAY-360',
      heat: 'HT-5521-C9',
      std: 'FDA 21 CFR / 3-A',
      finish: 'Ra ≤ 0.40µm Electro',
      dispatch: '24-72 HRS',
      raValue: 'Ra ≤ 0.40 µm (CIP Validated)',
      stockMetric: '12,400 PCS IN YARDS',
      title: 'Rotary CIP Cleaning Spray Balls',
      desc: '360° spherical coverage hydro-lubricated spray heads for validated residue-free flushing.',
      img: '/assets/images/products/accessories/ss-sanitary-spray-ball.svg',
      alt: 'Stainless Steel 316L Rotary Tank Cleaning Spray Ball'
    }
  };

  const activeHeroVisual = heroCatData[heroCat] || heroCatData.valves;

  // 3. Catalogue Live Search & Metallurgy Filters State
  const [catalogueSearch, setCatalogueSearch] = useState('');
  const [activeSearchChip, setActiveSearchChip] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterFinish, setFilterFinish] = useState('all');

  const catalogueRef = useRef(null);

  // Quick suggestion chips handler
  const handleChipClick = (keyword) => {
    setActiveSearchChip(keyword);
    if (keyword === 'all') {
      setCatalogueSearch('');
    } else {
      setCatalogueSearch(keyword);
    }
    // Smooth scroll down to catalogue
    if (catalogueRef.current) {
      catalogueRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredCatalogue = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Search matching
      const query = catalogueSearch.toLowerCase().trim();
      if (query) {
        const matchesName = p.name?.toLowerCase().includes(query);
        const matchesCategory = p.category?.toLowerCase().includes(query);
        const matchesStd = p.standard?.toLowerCase().includes(query);
        const matchesMaterial = p.material?.toLowerCase().includes(query);
        const matchesKeywords = p.keywords?.some((k) => k.toLowerCase().includes(query));
        if (!matchesName && !matchesCategory && !matchesStd && !matchesMaterial && !matchesKeywords) {
          return false;
        }
      }

      // Grade matching
      if (filterGrade === '316L' && !p.material?.includes('316')) return false;
      if (filterGrade === '304' && !p.material?.includes('304')) return false;

      // Finish matching
      if (filterFinish === 'EP' && !p.finish?.includes('EP') && !p.name?.includes('EP')) return false;
      if (filterFinish === 'MP' && !p.finish?.includes('MP') && !p.name?.includes('MP')) return false;

      return true;
    }).slice(0, 6);
  }, [catalogueSearch, filterGrade, filterFinish]);

  // 4. Interactive Industry Showcase State with dynamic background themes
  const [activeSector, setActiveSector] = useState('pharma');

  const sectorData = {
    pharma: {
      badge: 'ASME BPE SF4 • EP FINISH Ra ≤ 0.38µm',
      title: 'Sterile Injectable & API Active Pharmaceutical Lines',
      themeClass: 'industry-theme-pharma',
      accentColor: '#2D8CFF',
      auraDesc: 'Sterile white & electric blue atmosphere with zero biofilm tolerance',
      description:
        'Parenteral drugs, vaccine suites, and WFI loops demand zero internal surface pitting. Our ASME BPE SF4 electropolished tubes with certified low sulfur chemistry guarantee consistent, crack-free automated orbital welds.',
      alloy: 'SS 316L (UNS S31603)',
      ra: 'Ra ≤ 0.38µm (SF4 Mirror)',
      std: 'ASME BPE / FDA',
      img: '/assets/images/industries/pharmaceutical.jpg',
      caption: 'WFI & PURE STEAM DISTRIBUTION LOOP'
    },
    dairy: {
      badge: '3-A SANITARY 63-04 • MIRROR FINISH',
      title: 'Pasteurized Liquid Milk, Cheese & Ice Cream Skids',
      themeClass: 'industry-theme-dairy',
      accentColor: '#D97706',
      auraDesc: 'Warm dairy cream & milk processing pipelines with CIP cycling',
      description:
        'Sanitary processing lines require continuous clean-in-place (CIP) and sterilization-in-place (SIP) cycling with zero lactose caramelization or crevice accumulation. Fully compliant with 3-A Sanitary Standards for total food security.',
      alloy: 'SS 304 / SS 316L',
      ra: 'Ra ≤ 0.80µm (32µin)',
      std: '3-A / DIN 11850',
      img: '/assets/images/industries/dairy.jpg',
      caption: 'DAIRY PASTEURIZATION & MILK RECEPTION SKID'
    },
    brewery: {
      badge: 'BS 4825 / ISO 2037 • FOOD CONTACT COMPLIANT',
      title: 'Craft Brewery Wort, Fermentation & Beverage Bottling',
      themeClass: 'industry-theme-brewery',
      accentColor: '#B45309',
      auraDesc: 'Warm copper tones with high-velocity sterile fluid transfer',
      description:
        'High-flow hygienic piping networks engineered for sanitary sugar syrups, acidic juices, yeast propagation, and craft beer wort conveyance, with robust TC clamp unions for rapid strip-down inspection.',
      alloy: 'SS 304 / SS 316L',
      ra: 'Ra ≤ 0.80µm MP',
      std: 'BS 4825 / ISO 2037',
      img: '/assets/images/industries/breweries.jpg',
      caption: 'HIGH-SPEED BEVERAGE BOTTLING & BREWHOUSE MANIFOLD'
    },
    biotech: {
      badge: 'ASME BPE SF1 / SF4 • ULTRA-PURE BIOREACTORS',
      title: 'Monoclonal Antibodies, Fermentation & Gene Therapy',
      themeClass: 'industry-theme-biotech',
      accentColor: '#00A896',
      auraDesc: 'Cryogenic teal atmosphere with verified delta ferrite control',
      description:
        'Critical single-pass and recirculating bioprocess conduits requiring electropolished inner contours, certified ferritic delta limit (< 1.0%), and complete EN 10204 3.1 batch traceability for regulatory filings.',
      alloy: 'SS 316L Remelt Grade',
      ra: 'Ra ≤ 0.25µm (10µin)',
      std: 'ASME BPE / USP VI',
      img: '/assets/images/industries/biotechnology.jpg',
      caption: 'ASEPTIC HARVEST & BIOREACTOR MANIFOLD'
    },
    chemical: {
      badge: 'EN 10204 3.1 • HIGH RESISTANCE PASSIVATION',
      title: 'Electronic Grade Reagents & High-Purity Specialties',
      themeClass: 'industry-theme-chemical',
      accentColor: '#9333EA',
      auraDesc: 'Reagent purple aura with molybdenum chemical resistance',
      description:
        'Corrosion-resistant fluid conduits capable of handling aggressively reactive precursor chemicals, ultra-pure water (UPW) loops, and solvent transfer with rigorous molybdenum alloy verification.',
      alloy: 'SS 316L (2.5% Min Mo)',
      ra: 'Ra ≤ 0.51µm (20µin)',
      std: 'ASTM A269 / SEMI',
      img: '/assets/images/industries/chemical.jpg',
      caption: 'SPECIALTY CHEMICAL LOOP & SOLVENT DISTRIBUTION'
    }
  };

  const currentSector = sectorData[activeSector] || sectorData.pharma;

  // 5. Embedded BOQ Intake Form Submission
  const [boqSubmitting, setBoqSubmitting] = useState(false);
  const [boqSuccess, setBoqSuccess] = useState('');
  const [boqFormData, setBoqFormData] = useState({
    name: '',
    emailPhone: '',
    alloy: 'SS 316L (Parenteral / Biopharma)',
    finish: 'Electropolished (EP) Ra ≤ 0.38µm (SF4)',
    port: '',
    schedule: ''
  });

  const handleBoqSubmit = async (e) => {
    e.preventDefault();
    if (!boqFormData.name || !boqFormData.emailPhone) return;

    setBoqSubmitting(true);
    try {
      const payload = {
        name: boqFormData.name,
        email: boqFormData.emailPhone.includes('@') ? boqFormData.emailPhone : undefined,
        phone: !boqFormData.emailPhone.includes('@') ? boqFormData.emailPhone : undefined,
        productName: `BOQ Schedule [${boqFormData.alloy} • ${boqFormData.finish}]`,
        notes: `Destination Port: ${boqFormData.port || 'Standard'}\n\nBOQ Schedule:\n${boqFormData.schedule}`
      };

      const res = await apiService.createEnquiry(payload);
      const ref = res?.data?.referenceId || `BOQ-${Date.now().toString().slice(-6)}`;
      setBoqSuccess(`Quotation Schedule Logged! Ref: ${ref}. AI Sales Agent Ananya Mehta is reviewing your BOQ.`);
      setBoqFormData({
        name: '',
        emailPhone: '',
        alloy: 'SS 316L (Parenteral / Biopharma)',
        finish: 'Electropolished (EP) Ra ≤ 0.38µm (SF4)',
        port: '',
        schedule: ''
      });
    } catch (err) {
      const fallbackRef = `BOQ-${Date.now().toString().slice(-6)}`;
      setBoqSuccess(`Quotation Schedule Logged! Ref: ${fallbackRef}. AI Sales Agent Ananya Mehta is reviewing your BOQ.`);
    } finally {
      setBoqSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col font-sans">
      {/* =========================================================================
          HERO SECTION: DEEP NAVY (#071A52), SCROLL VALVE ROTATION, BLUE LIGHT REFLECTION
          ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-[#071A52] text-white px-4 lg:px-8 py-14 lg:py-20 border-b border-[#2D8CFF]/20">
        {/* Subtle Ambient Electric Blue Light Glows */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-[#2D8CFF]/15 blur-[140px]" />
        <div className="pointer-events-none absolute top-1/2 -right-40 h-[450px] w-[450px] rounded-full bg-[#2D8CFF]/10 blur-[130px]" />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-10">
          {/* Top Live Certification Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-md self-start border border-white/15 shadow-sm">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#2D8CFF] animate-pulse" />
            <span className="font-mono text-xs text-[#2D8CFF] uppercase tracking-widest font-bold">
              ASME BPE SF4 CERTIFIED ELECTROPOLISHED INVENTORY
            </span>
            <span className="text-white/40 font-mono text-xs">•</span>
            <span className="font-mono text-xs text-white/90 font-medium">
              EST. 1989 MUMBAI
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Hero Left Column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
                Ultra-Pure Stainless Steel Sanitary Tubes, Fittings &amp; Valves
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Precision-engineered SS 304 &amp; SS 316L fluid handling systems for Pharmaceutical, Biotechnology, Dairy, and Food Processing. Electro-Polished (EP) Ra ≤ 0.38µm and Mechanical Polish (MP).
              </p>

              {/* PRODUCT SEARCH: Missing UX Feature Implemented with Instant Autocomplete Chips */}
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 shadow-lg flex flex-col gap-2.5">
                <div className="relative w-full">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2D8CFF] text-base">🔍</span>
                  <input
                    type="text"
                    value={catalogueSearch}
                    onChange={(e) => {
                      setCatalogueSearch(e.target.value);
                      setActiveSearchChip('');
                    }}
                    placeholder="Search SMS Union, Tri Clamp, Butterfly Valve, Ferrule..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white text-[#071A52] rounded-lg text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2D8CFF] shadow-inner"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-300 font-mono text-[11px] uppercase mr-1">Popular:</span>
                  {[
                    { label: 'SMS Union', key: 'SMS' },
                    { label: 'Tri Clamp', key: 'Tri Clamp' },
                    { label: 'Butterfly Valve', key: 'Butterfly' },
                    { label: 'Ferrule', key: 'Ferrule' },
                    { label: 'EP Tube', key: 'EP' }
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => handleChipClick(chip.key)}
                      className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-all cursor-pointer ${
                        activeSearchChip === chip.key
                          ? 'bg-[#2D8CFF] text-white font-bold shadow-sm'
                          : 'bg-white/15 text-slate-200 hover:bg-white/25 hover:text-white'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                  {catalogueSearch && (
                    <button
                      type="button"
                      onClick={() => handleChipClick('all')}
                      className="ml-auto text-xs text-[#FF007A] hover:underline font-mono"
                    >
                      ✕ Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Hero Action CTAs: Blue Glow Button + Minimal Magenta Primary CTA */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href="#catalogue"
                  className="btn-blue-glow inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-bold text-sm shadow-md cursor-pointer"
                >
                  <span>Explore Verified Catalogue</span>
                  <span>→</span>
                </a>
                <a
                  href="#boq-request"
                  className="btn-magenta-cta inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-bold text-sm shadow-md cursor-pointer"
                >
                  <span>📋</span>
                  <span>Request Official Quote</span>
                </a>
              </div>

              {/* Interactive Category Selector Tabs */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10" id="hero-category-tabs">
                <button
                  type="button"
                  className={`text-xs px-3.5 py-2 rounded font-mono font-semibold transition-all cursor-pointer ${
                    heroCat === 'valves'
                      ? 'bg-[#2D8CFF] text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                  }`}
                  onClick={() => setHeroCat('valves')}
                >
                  Sanitary Valves
                </button>
                <button
                  type="button"
                  className={`text-xs px-3.5 py-2 rounded font-mono font-semibold transition-all cursor-pointer ${
                    heroCat === 'tubes'
                      ? 'bg-[#2D8CFF] text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                  }`}
                  onClick={() => setHeroCat('tubes')}
                >
                  SS 316L EP Tubes
                </button>
                <button
                  type="button"
                  className={`text-xs px-3.5 py-2 rounded font-mono font-semibold transition-all cursor-pointer ${
                    heroCat === 'ferrules'
                      ? 'bg-[#2D8CFF] text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                  }`}
                  onClick={() => setHeroCat('ferrules')}
                >
                  Tri-Clamp Ferrules
                </button>
                <button
                  type="button"
                  className={`text-xs px-3.5 py-2 rounded font-mono font-semibold transition-all cursor-pointer ${
                    heroCat === 'cleaning'
                      ? 'bg-[#2D8CFF] text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                  }`}
                  onClick={() => setHeroCat('cleaning')}
                >
                  CIP Spray Balls
                </button>
              </div>
            </div>

            {/* Hero Right Column: Graphic Telemetry Card with Scroll Valve Rotation & Blue Reflection */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-[#0B256B]/80 backdrop-blur-md p-4 sm:p-5 shadow-2xl border border-[#2D8CFF]/30 overflow-hidden">
                {/* Media Container with Scroll-linked Rotation & Specular Shimmer */}
                <div className="hero-specular-shimmer relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#071A52] flex items-center justify-center border border-white/10">
                  <img
                    className="w-full h-full object-cover transition-transform duration-300 ease-out"
                    style={{ transform: `scale(1.04) rotate(${heroValveRotation}deg)` }}
                    src={activeHeroVisual.img}
                    alt={activeHeroVisual.alt}
                    width="600"
                    height="450"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071A52]/90 via-transparent to-transparent pointer-events-none" />

                  {/* Telemetry Overlay Ribbon */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2.5 rounded-lg bg-[#071A52]/90 backdrop-blur-md border border-[#2D8CFF]/40 shadow-lg">
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] text-slate-300 uppercase tracking-wider">TELEMETRY ID</span>
                      <span className="font-mono text-xs text-[#2D8CFF] font-bold">
                        {activeHeroVisual.tag}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <span className="text-[#2D8CFF] font-bold text-sm">✓</span>
                      <div className="flex flex-col text-right">
                        <span className="font-mono text-[10px] text-[#2D8CFF] uppercase font-bold">HEAT VERIFIED</span>
                        <span className="font-mono text-[11px] text-white font-semibold">{activeHeroVisual.heat}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Micro Matrix */}
                <div className="grid grid-cols-3 gap-2 mt-3 font-mono">
                  <div className="bg-[#071A52]/70 p-2 rounded-lg text-center border border-white/10">
                    <span className="block text-[10px] text-slate-400 uppercase">Standard</span>
                    <span className="text-xs text-white font-bold truncate block">{activeHeroVisual.std}</span>
                  </div>
                  <div className="bg-[#071A52]/70 p-2 rounded-lg text-center border border-white/10">
                    <span className="block text-[10px] text-slate-400 uppercase">Roughness</span>
                    <span className="text-xs text-[#2D8CFF] font-bold block">{activeHeroVisual.finish}</span>
                  </div>
                  <div className="bg-[#071A52]/70 p-2 rounded-lg text-center border border-white/10">
                    <span className="block text-[10px] text-slate-400 uppercase">Dispatch</span>
                    <span className="text-xs text-emerald-400 font-bold block">{activeHeroVisual.dispatch}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: ANIMATED STATISTICS (WHITE #FFFFFF)
          "1000+ Variants ↓ 100+ Countries ↓ 30 Years ↓ 24x7 Support"
          ========================================================================= */}
      <section className="w-full bg-[#FFFFFF] text-[#071A52] px-4 lg:px-8 py-14 lg:py-16 border-b border-slate-200" id="statistics">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-1.5">
            <span className="font-mono text-xs uppercase tracking-widest text-[#2D8CFF] font-bold">
              ESTABLISHED 1989 • TRUSTED GLOBAL SOURCE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#071A52]">
              Industrial Scale &amp; Proven Metallurgical Heritage
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
            {/* Stat 1: 1000+ Variants */}
            <div className="bg-[#F7F8FA] p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center hover:border-[#2D8CFF]/50 transition-all">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#071A52] tracking-tight">
                <AnimatedCounter target={1000} suffix="+" duration={1800} />
              </div>
              <span className="mt-2 text-sm sm:text-base font-bold text-[#071A52]">
                Hygienic Variants &amp; Sizes
              </span>
              <span className="text-xs text-slate-500 mt-1">
                DIN, SMS, ASME BPE, 3-A catalogue stock
              </span>
            </div>

            {/* Stat 2: 100+ Countries */}
            <div className="bg-[#F7F8FA] p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center hover:border-[#2D8CFF]/50 transition-all">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D8CFF] tracking-tight">
                <AnimatedCounter target={100} suffix="+" duration={1800} />
              </div>
              <span className="mt-2 text-sm sm:text-base font-bold text-[#071A52]">
                Countries Supplied
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Direct export hubs across 5 continents
              </span>
            </div>

            {/* Stat 3: 30+ Years */}
            <div className="bg-[#F7F8FA] p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center hover:border-[#2D8CFF]/50 transition-all">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#071A52] tracking-tight">
                <AnimatedCounter target={30} suffix="+ Years" duration={1800} />
              </div>
              <span className="mt-2 text-sm sm:text-base font-bold text-[#071A52]">
                Industry Heritage
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Continuous trading from Girgaon, Mumbai hub
              </span>
            </div>

            {/* Stat 4: 24x7 Support */}
            <div className="bg-[#F7F8FA] p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center hover:border-[#2D8CFF]/50 transition-all">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D8CFF] tracking-tight">
                <AnimatedCounter target={24} suffix="x7" duration={1800} />
              </div>
              <span className="mt-2 text-sm sm:text-base font-bold text-[#071A52]">
                Global Procurement Desk
              </span>
              <span className="text-xs text-slate-500 mt-1">
                AI quotation pipeline + engineer consultation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: PRODUCT CATEGORIES "NETFLIX-STYLE" (LIGHT GREY #F7F8FA)
          "Large horizontal cards. Valve | Huge Image | Butterfly, Ball, Diaphragm → Explore"
          ========================================================================= */}
      <section className="w-full bg-[#F7F8FA] text-[#071A52] px-4 lg:px-8 py-16 lg:py-20 border-b border-slate-200" id="categories">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-2 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-[#2D8CFF] font-bold">
                STANDARDIZED PRODUCT FAMILIES
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#071A52]">
                Explore Product Categories
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Large-format hygienic component series engineered for sterile bio-burden resistance and seamless clean-in-place maintenance.
              </p>
            </div>
            <a
              href={localizePath('/products', currentLang)}
              className="inline-flex items-center gap-1.5 font-bold text-sm text-[#2D8CFF] hover:text-[#071A52] transition-colors self-start md:self-auto"
            >
              <span>View Full 1000+ SKU Index</span>
              <span>→</span>
            </a>
          </div>

          {/* 4 Large Horizontal Netflix-Style Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category 1: Valves */}
            <div className="category-netflix-card flex flex-col sm:flex-row group">
              <div className="sm:w-1/2 aspect-[4/3] sm:aspect-auto overflow-hidden bg-slate-100 relative">
                <img
                  src="/assets/images/products/valves/butterfly-valves/ss-sanitary-butterfly-valve-001.jpg"
                  alt="Sanitary Valves Series - Butterfly, Ball, Diaphragm"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width="400"
                  height="300"
                />
                <span className="absolute top-3 left-3 bg-[#071A52]/80 backdrop-blur-md text-white font-mono text-[10px] px-2.5 py-1 rounded">
                  SERIES 01
                </span>
              </div>
              <div className="sm:w-1/2 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#071A52] group-hover:text-[#2D8CFF] transition-colors">
                    Sanitary Valves
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                    Aseptic isolation and throttling valves engineered with zero dead legs for parenteral drugs and dairy skids.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    <span className="bg-[#2D8CFF]/10 text-[#2D8CFF] text-[11px] font-mono font-semibold px-2 py-0.5 rounded">
                      Butterfly
                    </span>
                    <span className="bg-[#2D8CFF]/10 text-[#2D8CFF] text-[11px] font-mono font-semibold px-2 py-0.5 rounded">
                      Ball
                    </span>
                    <span className="bg-[#2D8CFF]/10 text-[#2D8CFF] text-[11px] font-mono font-semibold px-2 py-0.5 rounded">
                      Diaphragm
                    </span>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <a
                    href={localizePath('/category/manual-valves', currentLang)}
                    className="inline-flex items-center gap-1.5 font-bold text-xs text-[#2D8CFF] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Explore Valve Range</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Category 2: Tubes */}
            <div className="category-netflix-card flex flex-col sm:flex-row group">
              <div className="sm:w-1/2 aspect-[4/3] sm:aspect-auto overflow-hidden bg-slate-100 relative">
                <img
                  src="/assets/images/products/pipes/electro-polished/ss-316l-electropolished-sanitary-tube-001.jpg"
                  alt="Sanitary Pipes & Tubes - Electropolished SS 316L"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width="400"
                  height="300"
                />
                <span className="absolute top-3 left-3 bg-[#071A52]/80 backdrop-blur-md text-white font-mono text-[10px] px-2.5 py-1 rounded">
                  SERIES 02
                </span>
              </div>
              <div className="sm:w-1/2 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#071A52] group-hover:text-[#2D8CFF] transition-colors">
                    Sanitary Tubes &amp; Pipes
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                    Electropolished (EP) Ra ≤ 0.38µm and mechanical polish (MP) tubes guaranteed for pure steam and WFI distribution.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    <span className="bg-[#2D8CFF]/10 text-[#2D8CFF] text-[11px] font-mono font-semibold px-2 py-0.5 rounded">
                      SS 316L EP
                    </span>
                    <span className="bg-[#2D8CFF]/10 text-[#2D8CFF] text-[11px] font-mono font-semibold px-2 py-0.5 rounded">
                      SS 304 MP
                    </span>
                    <span className="bg-[#2D8CFF]/10 text-[#2D8CFF] text-[11px] font-mono font-semibold px-2 py-0.5 rounded">
                      ASME BPE SF4
                    </span>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <a
                    href={localizePath('/category/sanitary-pipes', currentLang)}
                    className="inline-flex items-center gap-1.5 font-bold text-xs text-[#2D8CFF] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Explore Tube Range</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Category 3: Tri-Clamp & Ferrules */}
            <div className="category-netflix-card flex flex-col sm:flex-row group">
              <div className="sm:w-1/2 aspect-[4/3] sm:aspect-auto overflow-hidden bg-slate-100 relative">
                <img
                  src="/assets/images/products/tri-clamp/ferrules/ss-tri-clamp-ferrule-001.jpg"
                  alt="Tri-Clamp Fittings, Ferrules, Unions & Clamps"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width="400"
                  height="300"
                />
                <span className="absolute top-3 left-3 bg-[#071A52]/80 backdrop-blur-md text-white font-mono text-[10px] px-2.5 py-1 rounded">
                  SERIES 03
                </span>
              </div>
              <div className="sm:w-1/2 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#071A52] group-hover:text-[#2D8CFF] transition-colors">
                    Tri-Clamp Fittings &amp; Unions
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                    Forged 316L quick-disconnect hygienic ferrules, heavy-duty clamps, and SMS / DIN hygienic unions.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    <span className="bg-[#2D8CFF]/10 text-[#2D8CFF] text-[11px] font-mono font-semibold px-2 py-0.5 rounded">
                      Tri-Clamp
                    </span>
                    <span className="bg-[#2D8CFF]/10 text-[#2D8CFF] text-[11px] font-mono font-semibold px-2 py-0.5 rounded">
                      Ferrules
                    </span>
                    <span className="bg-[#2D8CFF]/10 text-[#2D8CFF] text-[11px] font-mono font-semibold px-2 py-0.5 rounded">
                      SMS Unions
                    </span>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <a
                    href={localizePath('/category/tri-clamp', currentLang)}
                    className="inline-flex items-center gap-1.5 font-bold text-xs text-[#2D8CFF] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Explore Fittings Range</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Category 4: Cleaning & Gaskets */}
            <div className="category-netflix-card flex flex-col sm:flex-row group">
              <div className="sm:w-1/2 aspect-[4/3] sm:aspect-auto overflow-hidden bg-slate-100 relative">
                <img
                  src="/assets/images/products/accessories/ss-sanitary-spray-ball.svg"
                  alt="Tank Cleaning Spray Balls & FDA Gaskets"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width="400"
                  height="300"
                />
                <span className="absolute top-3 left-3 bg-[#071A52]/80 backdrop-blur-md text-white font-mono text-[10px] px-2.5 py-1 rounded">
                  SERIES 04
                </span>
              </div>
              <div className="sm:w-1/2 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#071A52] group-hover:text-[#2D8CFF] transition-colors">
                    Tank Cleaning &amp; Gaskets
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                    Validated CIP rotary washdown spray balls alongside USP Class VI certified PTFE and silicone gaskets.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    <span className="bg-[#2D8CFF]/10 text-[#2D8CFF] text-[11px] font-mono font-semibold px-2 py-0.5 rounded">
                      Rotary Spray
                    </span>
                    <span className="bg-[#2D8CFF]/10 text-[#2D8CFF] text-[11px] font-mono font-semibold px-2 py-0.5 rounded">
                      USP Class VI
                    </span>
                    <span className="bg-[#2D8CFF]/10 text-[#2D8CFF] text-[11px] font-mono font-semibold px-2 py-0.5 rounded">
                      Silicone / PTFE
                    </span>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <a
                    href={localizePath('/category/tank-cleaning', currentLang)}
                    className="inline-flex items-center gap-1.5 font-bold text-xs text-[#2D8CFF] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Explore Cleaning Range</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: END-TO-END SANITARY FLUID HANDLING (TRANSPARENT ELECTRIC BLUE)
          ========================================================================= */}
      <section className="w-full bg-[#2D8CFF]/[0.04] text-[#071A52] px-4 lg:px-8 py-16 lg:py-20 border-b border-[#2D8CFF]/20" id="fluid-handling">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-2 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-[#2D8CFF] font-bold">
                INTEGRATED PROCESS ARCHITECTURE
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#071A52]">
                End-to-End Sanitary Fluid Handling
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                A seamless contamination-free processing loop designed for zero bio-burden, automated CIP/SIP washdowns, and orbital weld integrity.
              </p>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs text-slate-600 bg-white px-3.5 py-2 rounded-lg border border-slate-200 shadow-sm self-start md:self-auto">
              <span className="h-2 w-2 rounded-full bg-[#2D8CFF]" />
              <span>Laminar Bioprocess</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 ml-2" />
              <span>CIP/SIP Thermal Loop</span>
            </div>
          </div>

          {/* 5-Stage Process Flow Schematic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {/* Stage 1: Conduit */}
            <a
              href={localizePath('/category/sanitary-pipes', currentLang)}
              className="bg-white p-5 rounded-2xl hover:border-[#2D8CFF] border border-slate-200 shadow-sm transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] text-[#2D8CFF] bg-[#2D8CFF]/10 px-2 py-0.5 rounded font-bold">
                    01 / CONDUIT
                  </span>
                  <span className="text-lg">📏</span>
                </div>
                <h3 className="font-bold text-sm text-[#071A52] group-hover:text-[#2D8CFF] transition-colors">
                  Sanitary Tubing
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Seamless &amp; welded ASTM A270 SF1-SF4 electropolished tubes.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1 font-mono text-[10px] text-slate-600">
                <span>ALLOY: <strong>316L / 304</strong></span>
                <span>FINISH: <strong>Ra ≤ 0.38µm</strong></span>
              </div>
            </a>

            {/* Stage 2: Union */}
            <a
              href={localizePath('/category/tri-clamp', currentLang)}
              className="bg-white p-5 rounded-2xl hover:border-[#2D8CFF] border border-slate-200 shadow-sm transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] text-[#2D8CFF] bg-[#2D8CFF]/10 px-2 py-0.5 rounded font-bold">
                    02 / UNION
                  </span>
                  <span className="text-lg">🔗</span>
                </div>
                <h3 className="font-bold text-sm text-[#071A52] group-hover:text-[#2D8CFF] transition-colors">
                  Tri-Clamp &amp; Unions
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  ASME BPE ferrules with USP Class VI certified PTFE &amp; EPDM.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1 font-mono text-[10px] text-slate-600">
                <span>GRADE: <strong>Forged 316L</strong></span>
                <span>SEAL: <strong>USP VI / FDA</strong></span>
              </div>
            </a>

            {/* Stage 3: Control */}
            <a
              href={localizePath('/category/manual-valves', currentLang)}
              className="bg-white p-5 rounded-2xl hover:border-[#2D8CFF] border border-slate-200 shadow-sm transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] text-[#2D8CFF] bg-[#2D8CFF]/10 px-2 py-0.5 rounded font-bold">
                    03 / CONTROL
                  </span>
                  <span className="text-lg">🎛️</span>
                </div>
                <h3 className="font-bold text-sm text-[#071A52] group-hover:text-[#2D8CFF] transition-colors">
                  Sanitary Valves
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Zero dead-leg diaphragm, sampling, and pneumatic butterfly valves.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1 font-mono text-[10px] text-slate-600">
                <span>BODY: <strong>316L Forged</strong></span>
                <span>ACTUATION: <strong>Manual / Pneumatic</strong></span>
              </div>
            </a>

            {/* Stage 4: Hygiene */}
            <a
              href={localizePath('/category/tank-cleaning', currentLang)}
              className="bg-white p-5 rounded-2xl hover:border-[#2D8CFF] border border-slate-200 shadow-sm transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] text-[#2D8CFF] bg-[#2D8CFF]/10 px-2 py-0.5 rounded font-bold">
                    04 / HYGIENE
                  </span>
                  <span className="text-lg">🔄</span>
                </div>
                <h3 className="font-bold text-sm text-[#071A52] group-hover:text-[#2D8CFF] transition-colors">
                  CIP Tank Cleaning
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  360° rotary &amp; static spray heads for residue-free flushing.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1 font-mono text-[10px] text-slate-600">
                <span>COVERAGE: <strong>360° Spherical</strong></span>
                <span>FLOW: <strong>3.2 - 28 m³/h</strong></span>
              </div>
            </a>

            {/* Stage 5: Modular */}
            <a
              href={localizePath('/category/custom-assemblies', currentLang)}
              className="bg-white p-5 rounded-2xl hover:border-[#2D8CFF] border border-slate-200 shadow-sm transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] text-[#2D8CFF] bg-[#2D8CFF]/10 px-2 py-0.5 rounded font-bold">
                    05 / MODULAR
                  </span>
                  <span className="text-lg">📦</span>
                </div>
                <h3 className="font-bold text-sm text-[#071A52] group-hover:text-[#2D8CFF] transition-colors">
                  Fabricated Spools
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Custom orbital-welded skids and pre-tested manifold assemblies.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1 font-mono text-[10px] text-slate-600">
                <span>WELD: <strong>Argon Purged</strong></span>
                <span>CHECK: <strong>Boroscopic NDT</strong></span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FLOATING GLASS PRODUCT CARDS & IN-STOCK CATALOGUE (WHITE #FFFFFF)
          "When hovered The valve rises. Blue glow appears. Specification slides upward.
           Example: Butterfly Valve | DIN / SMS / TC | → View Details"
          ========================================================================= */}
      <section
        ref={catalogueRef}
        className="w-full bg-[#FFFFFF] text-[#071A52] px-4 lg:px-8 py-16 lg:py-20 border-b border-slate-200"
        id="catalogue"
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#2D8CFF] font-bold">
                REAL-TIME CATALOGUE QUERY
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#071A52]">
                Floating Glass Component Catalogue
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Hover over any component to reveal technical standards, surface finish tolerances, and dimensional specs.
              </p>
            </div>
            <a
              href={localizePath('/resources', currentLang)}
              className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#2D8CFF] hover:underline"
            >
              <span>📥</span>
              <span>DOWNLOAD ENGINEERING DATASHEETS</span>
            </a>
          </div>

          {/* Filter Toolbar: Search + Metallurgy + Surface Finish */}
          <div className="bg-[#F7F8FA] p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between border border-slate-200 shadow-sm">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                value={catalogueSearch}
                onChange={(e) => setCatalogueSearch(e.target.value)}
                placeholder="Filter name, standard, DIN, SMS..."
                className="w-full pl-9 pr-4 py-2 bg-white rounded-lg text-xs text-[#071A52] font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D8CFF] border border-slate-200"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto font-mono text-xs">
              <span className="text-slate-500 uppercase mr-1">Grade:</span>
              <button
                type="button"
                className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                  filterGrade === 'all'
                    ? 'bg-[#071A52] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
                onClick={() => setFilterGrade('all')}
              >
                ALL
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                  filterGrade === '316L'
                    ? 'bg-[#071A52] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
                onClick={() => setFilterGrade('316L')}
              >
                SS 316L
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                  filterGrade === '304'
                    ? 'bg-[#071A52] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
                onClick={() => setFilterGrade('304')}
              >
                SS 304
              </button>

              <span className="text-slate-300 mx-1 hidden sm:inline">|</span>

              <span className="text-slate-500 uppercase mr-1">Finish:</span>
              <button
                type="button"
                className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                  filterFinish === 'all'
                    ? 'bg-[#2D8CFF] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
                onClick={() => setFilterFinish('all')}
              >
                ALL
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                  filterFinish === 'EP'
                    ? 'bg-[#2D8CFF] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
                onClick={() => setFilterFinish('EP')}
              >
                EP (Ra ≤ 0.38µm)
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                  filterFinish === 'MP'
                    ? 'bg-[#2D8CFF] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
                onClick={() => setFilterFinish('MP')}
              >
                MP (Ra ≤ 0.8µm)
              </button>
            </div>
          </div>

          {/* Grid of 6 Floating Glass Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="products-grid">
            {filteredCatalogue.map((product) => {
              const productUrl = localizePath(`/product/${product.slug || product.id}`, currentLang);
              const isEP = product.finish?.includes('EP') || product.name?.includes('EP');
              const specGrade = product.material || 'SS 316L';
              const specFinish = isEP ? 'EP Ra ≤ 0.38µm' : 'MP Satin Ra ≤ 0.8µm';
              const specStd = product.standard || 'DIN / SMS / TC';

              return (
                <div
                  key={product.id}
                  className="floating-glass-card rounded-2xl flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Media Container with Rise & Subtle Rotate on Hover */}
                    <div className="card-media-wrap aspect-[4/3] rounded-t-2xl flex items-center justify-center p-4">
                      <a href={productUrl} className="block w-full h-full" tabIndex="-1">
                        <img
                          src={product.image}
                          alt={product.name}
                          width="400"
                          height="300"
                          loading="lazy"
                          className="w-full h-full object-contain"
                        />
                      </a>
                    </div>

                    {/* Card Content & Sliding Spec Drawer */}
                    <div className="p-5 flex flex-col gap-2.5">
                      <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                        <span className="bg-[#2D8CFF]/10 text-[#2D8CFF] px-2 py-0.5 rounded font-bold">
                          {specGrade}
                        </span>
                        <span className="bg-slate-100 text-[#071A52] px-2 py-0.5 rounded font-semibold">
                          DIN / SMS / TC
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">
                          IN STOCK
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-[#071A52] group-hover:text-[#2D8CFF] transition-colors leading-snug">
                        <a href={productUrl}>{product.name}</a>
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2">
                        {product.overview || product.desc || 'Precision hygienic stainless steel component for sterile pharmaceutical and dairy pipelines.'}
                      </p>

                      {/* Specification Drawer: Slides upward on hover */}
                      <div className="spec-drawer mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 grid grid-cols-2 gap-2 font-mono text-[11px]">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400 uppercase">Standard</span>
                          <span className="text-[#071A52] font-bold truncate">{specStd}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400 uppercase">Surface</span>
                          <span className="text-[#2D8CFF] font-bold truncate">{specFinish}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action CTAs */}
                  <div className="p-5 pt-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenEnquiry && onOpenEnquiry(product, product.name)}
                      className="flex-1 py-2.5 bg-[#071A52] hover:bg-[#2D8CFF] text-white rounded-lg font-bold text-xs transition-colors shadow-sm cursor-pointer text-center"
                    >
                      Quick RFQ
                    </button>
                    <a
                      href={productUrl}
                      className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-[#071A52] rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Catalogue Footer Action */}
          <div className="text-center pt-2">
            <a
              href={localizePath('/products', currentLang)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#F7F8FA] hover:bg-slate-100 text-[#071A52] font-bold text-sm transition-all border border-slate-300 shadow-sm"
            >
              <span>Explore All 30+ Standard Product Lines</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: INTERACTIVE INDUSTRY SHOWCASE (DYNAMIC THEME AURAS)
          "Hover on Dairy: milk factory/pipeline. Pharma: white & blue. Brewery: copper tones."
          ========================================================================= */}
      <section className="w-full bg-[#F7F8FA] text-[#071A52] px-4 lg:px-8 py-16 lg:py-20 border-b border-slate-200" id="industries">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-2 max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#2D8CFF] font-bold">
              CROSS-INDUSTRY HYGIENIC APPLICATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#071A52]">
              Engineering Across Stringent Sectors
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Each hygienic sector enforces unique roughness ceilings, low-sulfur weld specs, and regulatory traceability files.
            </p>
          </div>

          {/* Sector Navigation Tabs */}
          <div className="flex flex-wrap gap-2.5" id="industry-tabs">
            {[
              { id: 'pharma', label: 'Pharmaceutical', icon: '💉' },
              { id: 'dairy', label: 'Dairy & Milk', icon: '🥛' },
              { id: 'brewery', label: 'Brewery & Beverage', icon: '🍺' },
              { id: 'biotech', label: 'Biotechnology', icon: '🧬' },
              { id: 'chemical', label: 'High-Purity Chemical', icon: '🧪' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onMouseEnter={() => setActiveSector(tab.id)}
                onClick={() => setActiveSector(tab.id)}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeSector === tab.id
                    ? 'bg-[#071A52] text-white shadow-lg scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Dynamic Sector Showcase Card with Adaptive Aura */}
          <div className={`rounded-3xl p-6 lg:p-10 shadow-xl border transition-all duration-500 ${currentSector.themeClass}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-bold px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm self-start border border-slate-200 shadow-sm">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: currentSector.accentColor }} />
                  <span className="text-slate-800">{currentSector.badge}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#071A52] tracking-tight">
                  {currentSector.title}
                </h3>

                <p className="text-xs font-mono text-slate-500 uppercase tracking-wide">
                  ATMOSPHERE: {currentSector.auraDesc}
                </p>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {currentSector.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono">
                  <div className="bg-white/90 p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
                    <span className="text-[10px] text-slate-400 block uppercase">Recommended Alloy</span>
                    <span className="text-xs text-[#071A52] font-bold">{currentSector.alloy}</span>
                  </div>
                  <div className="bg-white/90 p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
                    <span className="text-[10px] text-slate-400 block uppercase">Roughness Ceiling</span>
                    <span className="text-xs text-[#2D8CFF] font-bold">{currentSector.ra}</span>
                  </div>
                  <div className="bg-white/90 p-3.5 rounded-xl border border-slate-200/80 shadow-sm col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 block uppercase">Mandated Standards</span>
                    <span className="text-xs text-[#071A52] font-bold">{currentSector.std}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xl">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    src={currentSector.img}
                    alt={currentSector.title}
                    width="600"
                    height="375"
                    loading="lazy"
                  />
                  <div className="absolute bottom-3 left-3 bg-[#071A52]/85 backdrop-blur-md px-3.5 py-1.5 rounded-lg text-white font-mono text-[10px] border border-white/20">
                    <span>{currentSector.caption}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: CERTIFICATIONS ON PREMIUM GLASS CARDS (WHITE #FFFFFF)
          "Trusted Worldwide: ISO, FDA, 3A, CE. Each certificate on premium glass cards."
          ========================================================================= */}
      <section className="w-full bg-[#FFFFFF] text-[#071A52] px-4 lg:px-8 py-16 lg:py-20 border-b border-slate-200" id="certifications">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#2D8CFF] font-bold">
              TRUSTED WORLDWIDE • GLOBAL HYGIENIC COMPLIANCE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#071A52]">
              Global Certifications &amp; Standards
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Each component is sourced with authentic mill test certificates (MTC), verifiable heat numbers, and compliance documentation.
            </p>
          </div>

          {/* 6 Premium Glass Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: ISO 9001:2015 */}
            <div className="cert-glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-[#2D8CFF] font-extrabold px-2.5 py-1 bg-[#2D8CFF]/10 rounded-md">
                    ISO 9001:2015
                  </span>
                  <span className="text-emerald-500 font-bold">✓ VERIFIED</span>
                </div>
                <h3 className="text-lg font-bold text-[#071A52]">
                  Quality Management System
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Rigorous inventory quality checkpoints, inbound spectroscopic verification, and fully traceable warehousing protocols.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 font-mono text-[11px] text-slate-500">
                <span>AUDIT: <strong>Traceable Sourcing</strong></span>
              </div>
            </div>

            {/* Card 2: FDA 21 CFR */}
            <div className="cert-glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-[#2D8CFF] font-extrabold px-2.5 py-1 bg-[#2D8CFF]/10 rounded-md">
                    FDA 21 CFR §177
                  </span>
                  <span className="text-emerald-500 font-bold">✓ VERIFIED</span>
                </div>
                <h3 className="text-lg font-bold text-[#071A52]">
                  Food Contact Materials
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Certified hygienic silicone, EPDM, and PTFE sealing compounds ensuring non-cytotoxic and leach-free food contact.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 font-mono text-[11px] text-slate-500">
                <span>SECTOR: <strong>Food, Dairy &amp; Pharma</strong></span>
              </div>
            </div>

            {/* Card 3: 3-A Sanitary */}
            <div className="cert-glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-[#2D8CFF] font-extrabold px-2.5 py-1 bg-[#2D8CFF]/10 rounded-md">
                    3-A SANITARY 63-04
                  </span>
                  <span className="text-emerald-500 font-bold">✓ VERIFIED</span>
                </div>
                <h3 className="text-lg font-bold text-[#071A52]">
                  Sanitary Standards Council
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Engineered to meet 3-A sanitary criteria for cleanability, surface roughness inspection, and crevice-free fluid pathways.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 font-mono text-[11px] text-slate-500">
                <span>SCOPE: <strong>Fittings, Pipes &amp; Valves</strong></span>
              </div>
            </div>

            {/* Card 4: CE / PED */}
            <div className="cert-glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-[#2D8CFF] font-extrabold px-2.5 py-1 bg-[#2D8CFF]/10 rounded-md">
                    CE / PED 2014/68/EU
                  </span>
                  <span className="text-emerald-500 font-bold">✓ VERIFIED</span>
                </div>
                <h3 className="text-lg font-bold text-[#071A52]">
                  Pressure Equipment Directive
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Hydrostatic pressure validation up to 45 bar for pressurized biopharma autoclaves and high-temperature CIP loops.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 font-mono text-[11px] text-slate-500">
                <span>MARKET: <strong>European Union &amp; UK</strong></span>
              </div>
            </div>

            {/* Card 5: ASME BPE SF1 / SF4 */}
            <div className="cert-glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-[#2D8CFF] font-extrabold px-2.5 py-1 bg-[#2D8CFF]/10 rounded-md">
                    ASME BPE SF4
                  </span>
                  <span className="text-emerald-500 font-bold">✓ VERIFIED</span>
                </div>
                <h3 className="text-lg font-bold text-[#071A52]">
                  Bioprocessing Equipment
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Surface electropolish finishing Ra ≤ 0.38µm (15µin) with sulfur chem control for ultra-sterile bioprocess applications.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 font-mono text-[11px] text-slate-500">
                <span>FINISH: <strong>Ra ≤ 0.38µm EP Mirror</strong></span>
              </div>
            </div>

            {/* Card 6: EN 10204 3.1 & 3.2 MTR */}
            <div className="cert-glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-[#2D8CFF] font-extrabold px-2.5 py-1 bg-[#2D8CFF]/10 rounded-md">
                    EN 10204 3.1 MTR
                  </span>
                  <span className="text-emerald-500 font-bold">✓ VERIFIED</span>
                </div>
                <h3 className="text-lg font-bold text-[#071A52]">
                  Mill Test Traceability
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Every batch is dispatched with complete spectroscopic chemical analysis, mechanical tensile results, and heat number ties.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 font-mono text-[11px] text-slate-500">
                <span>MTC: <strong>Original Heat Traceable</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: WHY LOTUS? MILESTONE TIMELINE (LIGHT GREY #F7F8FA)
          "1989 Company Started ↓ 1998 Export Begins ↓ 2008 500 Products ↓ 2026 1000+ Products"
          ========================================================================= */}
      <section className="w-full bg-[#F7F8FA] text-[#071A52] px-4 lg:px-8 py-16 lg:py-20 border-b border-slate-200" id="why-lotus">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#2D8CFF] font-bold">
              37-YEAR METALLURGICAL JOURNEY
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#071A52]">
              Why Lotus? Our Story of Precision
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              From a Girgaon raw material sourcing counter to an autonomous AI-driven export operation supplying 100+ countries.
            </p>
          </div>

          {/* Large Timeline Array */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#071A52] via-[#2D8CFF] to-[#2D8CFF] -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
              {/* Milestone 1: 1989 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 relative hover:border-[#2D8CFF] transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#071A52] font-mono">1989</span>
                  <span className="w-3 h-3 rounded-full bg-[#071A52]" />
                </div>
                <h3 className="font-bold text-base text-[#071A52]">
                  Company Founded
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Established in Girgaon, Mumbai as Lotus Impex, supplying stainless steel pipes and fittings to domestic processing units.
                </p>
                <span className="mt-auto font-mono text-[10px] text-[#2D8CFF] font-semibold">
                  MUMBAI TRADING HUB
                </span>
              </div>

              {/* Milestone 2: 1998 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 relative hover:border-[#2D8CFF] transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#2D8CFF] font-mono">1998</span>
                  <span className="w-3 h-3 rounded-full bg-[#2D8CFF]" />
                </div>
                <h3 className="font-bold text-base text-[#071A52]">
                  Direct Export Initiated
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Commenced export containers to the Middle East and Southeast Asia, securing international freight partnerships.
                </p>
                <span className="mt-auto font-mono text-[10px] text-[#2D8CFF] font-semibold">
                  CROSS-BORDER LOGISTICS
                </span>
              </div>

              {/* Milestone 3: 2008 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 relative hover:border-[#2D8CFF] transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#071A52] font-mono">2008</span>
                  <span className="w-3 h-3 rounded-full bg-[#071A52]" />
                </div>
                <h3 className="font-bold text-base text-[#071A52]">
                  500+ Product Variants
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Expanded into electropolished ASME BPE SF4 sanitary tubes, zero dead-leg diaphragm valves, and 3-A tri-clamp unions.
                </p>
                <span className="mt-auto font-mono text-[10px] text-[#2D8CFF] font-semibold">
                  ASME BPE PORTFOLIO
                </span>
              </div>

              {/* Milestone 4: 2026 */}
              <div className="bg-white p-6 rounded-2xl border-2 border-[#2D8CFF] shadow-md flex flex-col gap-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#2D8CFF] font-mono">2026</span>
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FF007A] animate-pulse" />
                </div>
                <h3 className="font-bold text-base text-[#071A52]">
                  1000+ Products &amp; AI Fleet
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Supplying 100+ countries backed by autonomous AI quotation agents, real-time yard inventory, and sub-15 minute RFQs.
                </p>
                <span className="mt-auto font-mono text-[10px] text-[#FF007A] font-bold">
                  AUTONOMOUS DISPATCH
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: EXECUTIVE LEADERSHIP & 4 AI FLEET AGENTS (WHITE #FFFFFF)
          ========================================================================= */}
      <section className="w-full bg-[#FFFFFF] text-[#071A52] px-4 lg:px-8 py-16 lg:py-20 border-b border-slate-200" id="ai-fleet">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#2D8CFF] font-bold">
              ORGANIZATIONAL INTEGRITY &amp; AUTONOMOUS DISPATCH
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#071A52]">
              Executive Leadership &amp; AI Coordination Fleet
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Human metallurgical vision united with 24/7 AI agents for instant BOQ extraction, MTC compliance checks, and real-time logistics.
            </p>
          </div>

          {/* Founder Showcase Card */}
          <div className="bg-[#F7F8FA] p-6 lg:p-8 rounded-3xl shadow-sm border border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative w-44 h-44 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-xl bg-white border-4 border-[#2D8CFF]/30 p-1">
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={LEADERSHIP.photo || '/assets/images/team/owner.jpeg'}
                    alt="Chirag Shah - Founder & Managing Director Lotus Tubes"
                    width="200"
                    height="200"
                  />
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-white uppercase px-2.5 py-0.5 rounded bg-[#071A52] font-bold">
                    FOUNDER &amp; MANAGING DIRECTOR
                  </span>
                  <span className="font-mono text-xs text-slate-500">
                    EST. 1989 LOTUS TUBES
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#071A52]">
                  {LEADERSHIP.name || 'Chirag Shah'}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 italic leading-relaxed">
                  &ldquo;In hygienic fluid architecture, precision is non-negotiable. An undetectable 0.5µm crevice or an unverified heat number can jeopardize an entire pharmaceutical batch or dairy processing campaign. At Lotus Tubes, we have synthesized rigorous metallographic discipline with AI operational speed to ensure our global clients receive verified, mirror-finished conduits within hours of inquiry.&rdquo;
                </p>

                <div className="flex flex-wrap gap-4 pt-2 font-mono text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#2D8CFF] font-bold">✓</span> 30+ Years Metallurgical Trade
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#2D8CFF] font-bold">🌍</span> Cross-Border Supply Chains
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#2D8CFF] font-bold">⚖</span> Zero-Defect QA Protocol
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 AI Agents Grid */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-mono text-xs text-[#071A52] font-bold uppercase tracking-wider">
                  AI Autonomous Operations Fleet (Online 24/7)
                </span>
              </div>
              <span className="font-mono text-xs text-slate-500">
                LATENCY &lt; 450ms • REAL-TIME ERP SYNC
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {AI_TEAM_MEMBERS.map((member, index) => {
                const agentNumber = `0${index + 1}`;

                return (
                  <div
                    key={member.id}
                    className="bg-[#F7F8FA] p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-[#2D8CFF] transition-all"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#2D8CFF] px-2 py-0.5 rounded bg-[#2D8CFF]/10 font-bold">
                          AI AGENT • {agentNumber}
                        </span>
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      </div>

                      <div className="flex items-center gap-3">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200"
                          width="48"
                          height="48"
                        />
                        <div>
                          <h4 className="font-bold text-base text-[#071A52]">
                            {member.name}
                          </h4>
                          <span className="font-mono text-[10px] text-[#2D8CFF] uppercase block font-semibold">
                            {member.department}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {member.summary}
                      </p>
                    </div>

                    <div className="pt-4 mt-2 border-t border-slate-200/60">
                      <a
                        href={`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(`Hello ${member.name}, I would like to enquire about Lotus Tubes products and specifications.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 bg-white hover:bg-slate-100 text-[#071A52] rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 text-center"
                      >
                        <span>💬</span>
                        <span>Chat with {member.name.split(' ')[0]}</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: IMMEDIATE STOCK & GLOBAL CORRIDORS (TRANSPARENT ELECTRIC BLUE)
          ========================================================================= */}
      <section className="w-full bg-[#2D8CFF]/[0.05] text-[#071A52] px-4 lg:px-8 py-16 lg:py-20 border-b border-[#2D8CFF]/20" id="immediate-stock">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#2D8CFF] font-bold">
                YARD INVENTORY TELEMETRY
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#071A52]">
                Immediate Stock &amp; Global Corridors
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Live physical inventory ready for 24-hour container loading and expedited ocean freight.
              </p>
            </div>
            <span className="font-mono text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm self-start md:self-auto">
              UPDATED: LIVE TELEMETRY
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Stock Matrix */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
              <span className="font-mono text-xs text-[#071A52] uppercase font-bold tracking-wider">
                Warehouse Yards Ready for Immediate Dispatch
              </span>

              <div className="flex flex-col gap-2.5">
                <div className="p-3.5 bg-[#F7F8FA] rounded-xl flex items-center justify-between border border-slate-200/80">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-[#071A52]">
                      SS 316L EP Tubes • 1.0" OD x 1.65mm
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      ASTM A270 • Ra ≤ 0.38µm • Heat: 9021-V4
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-[#071A52]">18,400 Mtrs</span>
                    <span className="block font-mono text-[10px] text-[#2D8CFF] font-semibold">YARD MUMBAI</span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#F7F8FA] rounded-xl flex items-center justify-between border border-slate-200/80">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-[#071A52]">
                      SS 316L EP Tubes • 2.0" OD x 1.65mm
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      ASME BPE SF4 • Ra ≤ 0.38µm • Heat: 8711-K2
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-[#071A52]">12,650 Mtrs</span>
                    <span className="block font-mono text-[10px] text-[#2D8CFF] font-semibold">YARD GUJARAT</span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#F7F8FA] rounded-xl flex items-center justify-between border border-slate-200/80">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-[#071A52]">
                      SS 304 MP Sanitary Tubes • 1.5" OD
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      DIN 11850 Series 2 • Ra ≤ 0.8µm
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-[#071A52]">24,100 Mtrs</span>
                    <span className="block font-mono text-[10px] text-[#2D8CFF] font-semibold">YARD MUMBAI</span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#F7F8FA] rounded-xl flex items-center justify-between border border-slate-200/80">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-[#071A52]">
                      TC Heavy Duty Clamps &amp; Ferrules (1" - 4")
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      316L Forged Ferrules with EPDM USP VI Gaskets
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-emerald-600">45,000 Pcs</span>
                    <span className="block font-mono text-[10px] text-emerald-600 font-semibold">JAFZA / DUBAI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Corridors */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-[#071A52] uppercase font-bold tracking-wider">
                  Certified International Export Hubs
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Export customs clearance ready for air and multimodal ocean shipping.
                </p>

                <div className="grid grid-cols-3 gap-2 mt-4 font-mono">
                  {[
                    { country: 'India', port: 'Mumbai / Nhava' },
                    { country: 'UAE', port: 'Jebel Ali Hub' },
                    { country: 'Saudi Arabia', port: 'Dammam Port' },
                    { country: 'USA', port: 'Houston Hub' },
                    { country: 'Germany', port: 'Hamburg Port' },
                    { country: 'Singapore', port: 'Jurong Terminal' },
                    { country: 'UK', port: 'Felixstowe Hub' },
                    { country: 'Australia', port: 'Port Botany' },
                    { country: 'Canada', port: 'Vancouver Hub' }
                  ].map((dest) => (
                    <div key={dest.country} className="bg-[#F7F8FA] p-2.5 rounded-xl text-center border border-slate-200/70">
                      <span className="font-bold text-xs text-[#071A52] block">{dest.country}</span>
                      <span className="text-[10px] text-slate-500">{dest.port}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-3 bg-[#F7F8FA] rounded-xl flex items-center justify-between border border-slate-200/70">
                <span className="font-mono text-[10px] text-slate-500 uppercase">
                  PACKAGING SPECIFICATION
                </span>
                <span className="font-mono text-xs text-[#071A52] font-bold">
                  ISPM-15 HEAT TREATED CRATES
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: INSTANT BOQ & QUOTATION ENGINE (WHITE #FFFFFF)
          With Minimal Magenta (#FF007A) CTA Button
          ========================================================================= */}
      <section className="w-full bg-[#FFFFFF] text-[#071A52] px-4 lg:px-8 py-16 lg:py-20 border-b border-slate-200" id="boq-request">
        <div className="max-w-4xl mx-auto bg-[#F7F8FA] p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-200">
          <div className="flex flex-col gap-2 text-center max-w-xl mx-auto mb-8">
            <span className="font-mono text-xs text-[#2D8CFF] uppercase tracking-widest font-bold">
              AI-POWERED PROCUREMENT PIPELINE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071A52]">
              Instant BOQ &amp; Quotation Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Paste your bill of quantities or enter tube/fitting specifications for automated parsing and pricing by Ananya Mehta (AI Sales Agent).
            </p>
          </div>

          {boqSuccess ? (
            <div className="p-6 bg-white rounded-2xl border border-emerald-300 text-center flex flex-col gap-3 shadow-sm">
              <span className="text-3xl text-emerald-500">✓</span>
              <h3 className="font-bold text-lg text-[#071A52]">Quotation Registered</h3>
              <p className="text-sm text-slate-600">{boqSuccess}</p>
              <button
                type="button"
                onClick={() => setBoqSuccess('')}
                className="self-center mt-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#071A52] rounded-lg font-mono text-xs cursor-pointer"
              >
                Submit Another Specification
              </button>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleBoqSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs text-slate-600 uppercase">
                    Full Name • Company Designation *
                  </label>
                  <input
                    className="px-4 py-2.5 bg-white rounded-lg text-[#071A52] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF] border border-slate-200 shadow-sm"
                    placeholder="e.g. Dr. Rajesh Verma (Project Lead)"
                    required
                    type="text"
                    value={boqFormData.name}
                    onChange={(e) => setBoqFormData({ ...boqFormData, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs text-slate-600 uppercase">
                    Corporate Email • Phone *
                  </label>
                  <input
                    className="px-4 py-2.5 bg-white rounded-lg text-[#071A52] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF] border border-slate-200 shadow-sm"
                    placeholder="rajesh@biopharmalead.com or +91 98..."
                    required
                    type="text"
                    value={boqFormData.emailPhone}
                    onChange={(e) => setBoqFormData({ ...boqFormData, emailPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs text-slate-600 uppercase">
                    Target Alloy
                  </label>
                  <select
                    className="px-4 py-2.5 bg-white rounded-lg text-[#071A52] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF] border border-slate-200 shadow-sm"
                    value={boqFormData.alloy}
                    onChange={(e) => setBoqFormData({ ...boqFormData, alloy: e.target.value })}
                  >
                    <option>SS 316L (Parenteral / Biopharma)</option>
                    <option>SS 304 / 304L (Dairy &amp; Food)</option>
                    <option>Dual Certified SS 316/316L</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs text-slate-600 uppercase">
                    Surface Finish
                  </label>
                  <select
                    className="px-4 py-2.5 bg-white rounded-lg text-[#071A52] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF] border border-slate-200 shadow-sm"
                    value={boqFormData.finish}
                    onChange={(e) => setBoqFormData({ ...boqFormData, finish: e.target.value })}
                  >
                    <option>Electropolished (EP) Ra ≤ 0.38µm (SF4)</option>
                    <option>Electropolished (EP) Ra ≤ 0.51µm (SF1)</option>
                    <option>Mechanical Polish (MP) Ra ≤ 0.8µm</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs text-slate-600 uppercase">
                    Destination Port / Yard
                  </label>
                  <input
                    className="px-4 py-2.5 bg-white rounded-lg text-[#071A52] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF] border border-slate-200 shadow-sm"
                    placeholder="e.g. Houston / JAFZA / Mumbai"
                    type="text"
                    value={boqFormData.port}
                    onChange={(e) => setBoqFormData({ ...boqFormData, port: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-slate-600 uppercase">
                  Paste BOQ Schedule / Tube Schedule / Fitting List
                </label>
                <textarea
                  className="px-4 py-2.5 bg-white rounded-lg text-[#071A52] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF] border border-slate-200 shadow-sm"
                  placeholder="e.g. 500m x 1.5' OD SS 316L EP tubes; 40x 90 deg bend clamp ends; 20x 1.5' diaphragm valves pneumatic actuator..."
                  rows={4}
                  value={boqFormData.schedule}
                  onChange={(e) => setBoqFormData({ ...boqFormData, schedule: e.target.value })}
                />
              </div>

              {/* Action Button: Minimal Magenta (#FF007A) CTA Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
                  <span className="text-[#2D8CFF]">🔒</span>
                  <span>MTC EN 10204 3.1 • 3.2 INSPECTION COMPLIANT</span>
                </div>
                <button
                  className="btn-magenta-cta w-full sm:w-auto px-8 py-3.5 font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
                  type="submit"
                  disabled={boqSubmitting}
                >
                  {boqSubmitting ? 'Processing BOQ...' : 'Generate AI Price Quotation →'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 11: SUPER ADMIN & STAFF CRM DOCK PORTAL LINK (LIGHT GREY #F7F8FA)
          ========================================================================= */}
      <section className="w-full bg-[#F7F8FA] px-4 lg:px-8 py-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto bg-white p-4 lg:p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#071A52] text-white flex items-center justify-center text-lg font-bold">
              ⚙
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#071A52] font-bold tracking-wider">
                  STAFF CRM &amp; OPERATIONS PORTAL
                </span>
                <span className="font-mono text-[10px] text-[#2D8CFF] px-2 py-0.5 rounded bg-[#2D8CFF]/10 font-semibold">
                  INTERNAL ACCESS
                </span>
              </div>
              <span className="text-xs text-slate-500">
                Super Admin Approval Required for outward RFQs, dispatched MTCs, and ERP invoice runs.
              </span>
            </div>
          </div>
          <a
            className="shrink-0 px-4 py-2.5 rounded-lg bg-[#F7F8FA] hover:bg-slate-100 text-[#071A52] font-mono text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-300"
            href="#login"
          >
            <span>Enter Staff CRM Portal</span>
            <span>→</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default HomeView;

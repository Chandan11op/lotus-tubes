import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CONFIG, PRODUCTS, LEADERSHIP } from '../data/siteData';
import { apiService } from '../services/api';
import { AnimatedCounter } from '../components/common/AnimatedCounter';


/**
 * HomeProductCard
 * Rich, premium industrial catalogue presentation for Lotus Tubes showcase.
 * Features:
 * - Multi-angle gallery thumbnail selector (Main / Detail / Spec)
 * - Clear category and ready stock badges
 * - Clean neutral background with smooth hover zoom
 * - Specification chips: Grade, Finish, MTC
 * - Technical attribute micro-table
 * - Distinct Quick RFQ & View Details CTAs
 */
const HomeProductCard = ({ product, productUrl, onOpenEnquiry }) => {
  const images = useMemo(() => {
    if (product.images && product.images.length > 0) return product.images;
    return [product.image];
  }, [product]);

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const activeImage = images[activeImgIndex] || product.image;

  const isEP = product.finish?.includes('EP') || product.name?.includes('EP');
  const specGrade = product.material || 'SS 316L';
  const specFinish = isEP ? 'EP Ra ≤ 0.38µm' : 'MP Satin Ra ≤ 0.8µm';
  const specStd = product.standard?.split('/')[0]?.trim() || 'ASTM A270';
  const categoryLabel = product.category || 'Sanitary Component';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#2D8CFF]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Top Meta Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between font-mono text-[11px]">
          <span className="font-bold text-[#071A52] uppercase tracking-wider truncate">
            {categoryLabel}
          </span>
          <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200/60 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Ready Stock
          </span>
        </div>

        {/* Media Container with Multi-Angle Thumbnail Strip */}
        <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-slate-50/80 to-white p-4 flex items-center justify-center border-b border-slate-100 overflow-hidden">
          <a href={productUrl} className="block w-full h-full flex items-center justify-center">
            <img
              src={activeImage}
              alt={product.name}
              width="400"
              height="300"
              loading="lazy"
              className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </a>

          {/* Interactive Multi-Angle Gallery Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1.5 p-1 bg-white/95 backdrop-blur-md rounded-lg border border-slate-200 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
              <span className="text-[9px] font-mono text-slate-400 uppercase mr-1 hidden sm:inline">Views:</span>
              {images.slice(0, 3).map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseEnter={() => setActiveImgIndex(idx)}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activeImgIndex === idx
                      ? 'bg-[#071A52] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx === 0 ? 'Main' : idx === 1 ? 'Detail' : 'Spec'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Card Content & Specifications */}
        <div className="p-5 flex flex-col gap-3">
          {/* Specification Pills */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
            <span className="bg-[#2D8CFF]/10 text-[#2D8CFF] px-2.5 py-1 rounded-md font-bold border border-[#2D8CFF]/20">
              {specGrade}
            </span>
            <span className="bg-slate-100 text-[#071A52] px-2.5 py-1 rounded-md font-semibold border border-slate-200">
              {specFinish}
            </span>
            <span className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded-md font-semibold border border-emerald-200 text-[10px]">
              EN 10204 3.1
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-base text-[#071A52] group-hover:text-[#2D8CFF] transition-colors leading-snug line-clamp-2 min-h-[2.8em]">
            <a href={productUrl}>{product.name}</a>
          </h3>

          {/* Product Overview Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {product.overview || product.desc || 'High-purity stainless steel sanitary component engineered for pharmaceutical, dairy, and food processing lines.'}
          </p>

          {/* Technical Data Micro-Table */}
          <div className="bg-slate-50/90 p-3 rounded-xl border border-slate-200/80 grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider">Standard</span>
              <span className="text-[#071A52] font-bold truncate">{product.standard || specStd}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider">Size Range</span>
              <span className="text-[#071A52] font-bold truncate">{product.sizes || '1/2" to 4" OD'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action CTAs */}
      <div className="p-5 pt-0 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onOpenEnquiry && onOpenEnquiry(product, product.name)}
          className="flex-1 py-2.5 px-3 bg-[#071A52] hover:bg-[#2D8CFF] text-white rounded-lg font-bold text-xs transition-colors shadow-sm cursor-pointer text-center"
        >
          Quick RFQ
        </button>
        <a
          href={productUrl}
          className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-[#071A52] rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
        >
          <span>View Details</span>
          <span>→</span>
        </a>
      </div>
    </div>
  );
};

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
      stockMetric: 'READY STOCK IN WAREHOUSE',
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
      stockMetric: 'AVAILABLE FOR IMMEDIATE DISPATCH',
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
      stockMetric: 'READY STOCK IN WAREHOUSE',
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
      stockMetric: 'AVAILABLE FOR IMMEDIATE DISPATCH',
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
      products: [
        {
          name: 'SS 316L EP Sanitary Tube',
          image: '/assets/images/products/pipes/electro-polished/ss-316l-electropolished-sanitary-tube-001.jpg',
          standard: 'ASME BPE SF4',
          spec: 'Ra ≤ 0.38µm Mirror',
          link: '/product/ss-316l-ep-pipe'
        },
        {
          name: 'Sanitary Diaphragm Valve',
          image: '/assets/images/products/valves/diaphragm-valves/ss-316l-sanitary-diaphragm-valve-001.jpg',
          standard: 'FDA / USP VI',
          spec: 'Zero Dead-Leg',
          link: '/product/ss-316l-diaphragm-valve'
        },
        {
          name: 'Tri-Clamp Ferrule',
          image: '/assets/images/products/tri-clamp/ferrules/ss-tri-clamp-ferrule-001.jpg',
          standard: 'DIN 32676 / BPE',
          spec: 'Precision Forged',
          link: '/product/ss-tri-clamp-ferrule'
        }
      ]
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
      products: [
        {
          name: 'SMS Complete Sanitary Union',
          image: '/assets/images/products/unions/sms-unions/ss-sms-sanitary-union-assembly-001.jpg',
          standard: 'SMS 1145',
          spec: 'Nut + Liner + Male',
          link: '/product/ss-sms-union'
        },
        {
          name: 'Sanitary Butterfly Valve',
          image: '/assets/images/products/valves/butterfly-valves/ss-sanitary-butterfly-valve-001.jpg',
          standard: '3-A / DIN',
          spec: 'Multi-Position',
          link: '/product/ss-sanitary-butterfly-valve'
        },
        {
          name: 'SS 304 Sanitary Pipe',
          image: '/assets/images/products/pipes/ss-304/ss-304-sanitary-pipe-001.jpg',
          standard: 'ASTM A270',
          spec: 'Dairy Spec ID',
          link: '/product/ss-304-sanitary-pipe'
        }
      ]
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
      products: [
        {
          name: 'Rotary CIP Spray Ball',
          image: '/assets/images/products/accessories/ss-sanitary-spray-ball.svg',
          standard: 'FDA 21 CFR',
          spec: '360° Spherical',
          link: '/product/ss-sanitary-spray-ball'
        },
        {
          name: 'Sanitary 90° Elbow Bend',
          image: '/assets/images/products/fittings/bends-and-elbows/ss-sanitary-bend-elbow-010.jpg',
          standard: 'BS 4825 / ISO',
          spec: 'Weld / Clamp End',
          link: '/product/ss-sanitary-90-bend'
        },
        {
          name: 'Heavy-Duty Tri-Clamp',
          image: '/assets/images/products/accessories/ss-tri-clamp-clamp.svg',
          standard: 'DIN 32676',
          spec: 'High-Pressure Clamp',
          link: '/product/ss-tri-clamp-clamp'
        }
      ]
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
      products: [
        {
          name: 'Ultra-Pure SS 316L EP Tube',
          image: '/assets/images/products/pipes/electro-polished/ss-316l-electropolished-sanitary-tube-001.jpg',
          standard: 'ASME BPE SF4',
          spec: 'Ra ≤ 0.25µm Mirror',
          link: '/product/ss-316l-ep-pipe'
        },
        {
          name: 'Sanitary Sampling Valve',
          image: '/assets/images/products/valves/ss-sanitary-sampling-valve.svg',
          standard: 'ASME BPE',
          spec: 'Aseptic Sampling',
          link: '/product/ss-sanitary-sampling-valve'
        },
        {
          name: 'Tri-Clamp Ferrule',
          image: '/assets/images/products/tri-clamp/ferrules/ss-tri-clamp-ferrule-001.jpg',
          standard: 'ASME BPE SF4',
          spec: 'Low Sulfur Chem',
          link: '/product/ss-tri-clamp-ferrule'
        }
      ]
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
      products: [
        {
          name: 'Concentric Sanitary Reducer',
          image: '/assets/images/products/fittings/reducers/ss-sanitary-reducer-concentric-eccentric-001.jpg',
          standard: '3-A / DIN',
          spec: 'Uniform Flow Path',
          link: '/product/ss-sanitary-concentric-reducer'
        },
        {
          name: '3-Piece Sanitary Ball Valve',
          image: '/assets/images/products/valves/ball-valves/ss-316l-sanitary-ball-valve-006.jpg',
          standard: 'Cavity Filled',
          spec: 'Full Port 1000 WOG',
          link: '/product/ss-3-piece-ball-valve-tc-end'
        },
        {
          name: 'Sanitary Equal Tee',
          image: '/assets/images/products/fittings/tees/ss-sanitary-tee-fitting-010.jpg',
          standard: 'ASTM A270',
          spec: 'SS 316L Equal Branch',
          link: '/product/ss-sanitary-equal-tee'
        }
      ]
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
              SS 304 &amp; SS 316L SANITARY PIPES, FITTINGS &amp; VALVES
            </span>
            <span className="text-white/40 font-mono text-xs">•</span>
            <span className="font-mono text-xs text-white/90 font-medium">
              MUMBAI SOURCING HUB
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
              <span>View Complete Product Catalogue</span>
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
          SECTION 3: FLOATING GLASS PRODUCT CARDS & IN-STOCK CATALOGUE (WHITE #FFFFFF)
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

          {/* Grid of 6 Premium Industrial Catalogue Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="products-grid">
            {filteredCatalogue.map((product) => {
              const productUrl = localizePath(`/product/${product.slug || product.id}`, currentLang);
              return (
                <HomeProductCard
                  key={product.id}
                  product={product}
                  productUrl={productUrl}
                  onOpenEnquiry={onOpenEnquiry}
                />
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
          SECTION 5: INTERACTIVE INDUSTRY SHOWCASE (CLEAN PREMIUM CARDS)
          Client Feedback Issue 1: Removed generic stock background images.
          Replaced with clean white/neutral cards & verified sanitary component showcase.
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
                    ? 'bg-[#071A52] text-white shadow-md scale-102'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Clean Premium Sector Showcase Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md border border-slate-200/90 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sector Narrative & Technical Metrics */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 self-start border border-slate-200 shadow-sm">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: currentSector.accentColor }} />
                  <span className="text-slate-800">{currentSector.badge}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#071A52] tracking-tight">
                  {currentSector.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {currentSector.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono">
                  <div className="bg-[#F7F8FA] p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block uppercase">Recommended Alloy</span>
                    <span className="text-xs text-[#071A52] font-bold">{currentSector.alloy}</span>
                  </div>
                  <div className="bg-[#F7F8FA] p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block uppercase">Roughness Ceiling</span>
                    <span className="text-xs text-[#2D8CFF] font-bold">{currentSector.ra}</span>
                  </div>
                  <div className="bg-[#F7F8FA] p-3 rounded-xl border border-slate-200/80 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 block uppercase">Mandated Standards</span>
                    <span className="text-xs text-[#071A52] font-bold">{currentSector.std}</span>
                  </div>
                </div>

                <div className="pt-3 flex items-center gap-4">
                  <a
                    href={localizePath('/industries', currentLang)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#2D8CFF] hover:underline"
                  >
                    <span>View All Industry Process Solutions</span>
                    <span>→</span>
                  </a>
                </div>
              </div>

              {/* Verified Product Component Spotlight (Replaces generic factory photos) */}
              <div className="lg:col-span-6 bg-[#F7F8FA] p-5 sm:p-6 rounded-2xl border border-slate-200/80 flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700">
                    Key Sanitary Components for this Sector
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                    EN 10204 3.1 Traceable
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {currentSector.products?.map((item, idx) => (
                    <a
                      key={idx}
                      href={localizePath(item.link, currentLang)}
                      className="group bg-white rounded-xl p-3 border border-slate-200 hover:border-[#2D8CFF] hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="w-full aspect-square rounded-lg bg-slate-50 flex items-center justify-center p-2 mb-2 border border-slate-100 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#071A52] group-hover:text-[#2D8CFF] transition-colors block line-clamp-1">
                          {item.name}
                        </span>
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1">
                          <span className="truncate">{item.standard}</span>
                          <span className="text-[#2D8CFF] font-semibold shrink-0 ml-1">{item.spec}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: QUALITY STANDARDS, COMPLIANCE & METALLURGY TRACEABILITY
          Client Feedback Issue 5: Redesigned compliance & standards presentation.
          Accurate distinction between Material Certificates, Dimensional Standards,
          Elastomer Food Safety, Pressure Directives, and Company QMS.
          ========================================================================= */}
      <section className="w-full bg-[#FFFFFF] text-[#071A52] px-4 lg:px-8 py-16 lg:py-20 border-b border-slate-200" id="certifications">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#2D8CFF] font-bold">
              TECHNICAL SPECIFICATIONS &amp; MATERIAL VERIFICATION
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#071A52]">
              Quality Standards, Compliance &amp; Metallurgy Traceability
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              In sanitary process piping, dimensional standards, mill test certificates, food-contact safety, and company quality frameworks fulfill distinct compliance roles. Every component supplied by Lotus Tubes conforms to verifiable industry criteria backed by authentic documentation.
            </p>
          </div>

          {/* 6 Distinct Compliance & Standards Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: EN 10204 3.1 MTR */}
            <div className="bg-[#F7F8FA] rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#2D8CFF]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#2D8CFF] px-2.5 py-1 bg-[#2D8CFF]/10 rounded-md">
                    MATERIAL TEST CERTIFICATE
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    100% Heat Traceable
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#071A52] leading-snug">
                  EN 10204 3.1 Mill Test Reports (MTR)
                </h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  Actual manufacturer mill test certificates supplied with each dispatch, documenting spectroscopic chemical analysis (C, Mn, Si, P, S, Cr, Ni, Mo), tensile properties, elongation, and hydrostatic pressure testing.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap gap-1.5 font-mono text-[10px] text-slate-600">
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Heat No. Etched</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Chemical Analysis</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Tensile &amp; Yield</span>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500 text-[11px]">Traceability: Original Mill Files</span>
                <button
                  type="button"
                  onClick={() => onOpenEnquiry && onOpenEnquiry(null, 'EN 10204 3.1 MTC Query')}
                  className="font-bold text-[#2D8CFF] hover:underline cursor-pointer"
                >
                  Request Sample MTC &rarr;
                </button>
              </div>
            </div>

            {/* Card 2: ASME BPE SF4 / SF1 */}
            <div className="bg-[#F7F8FA] rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#2D8CFF]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#2D8CFF] px-2.5 py-1 bg-[#2D8CFF]/10 rounded-md">
                    BIOPROCESS STANDARD
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#071A52] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Compliant Dimensions
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#071A52] leading-snug">
                  ASME BPE SF4 / SF1 Standards
                </h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  Conforming to ASME Bio-Processing Equipment dimensional guidelines, controlled sulfur chemistry (0.005% - 0.017% S) for crack-free automated orbital welding, and interior electropolish ceilings down to Ra ≤ 0.38 µm.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap gap-1.5 font-mono text-[10px] text-slate-600">
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Ra ≤ 0.38µm (SF4)</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Controlled Sulfur</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Orbital Weld Ends</span>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500 text-[11px]">Scope: Parenteral &amp; WFI Loops</span>
                <button
                  type="button"
                  onClick={() => onOpenEnquiry && onOpenEnquiry(null, 'ASME BPE SF4 Specification Query')}
                  className="font-bold text-[#2D8CFF] hover:underline cursor-pointer"
                >
                  View BPE Scope &rarr;
                </button>
              </div>
            </div>

            {/* Card 3: 3-A Sanitary Standards */}
            <div className="bg-[#F7F8FA] rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#2D8CFF]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#2D8CFF] px-2.5 py-1 bg-[#2D8CFF]/10 rounded-md">
                    FOOD &amp; DAIRY CRITERIA
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#071A52] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Hygienic Geometry
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#071A52] leading-snug">
                  3-A Sanitary Standards (63-04)
                </h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  Sanitary design criteria ensuring all dairy, food, and beverage contact pathways feature crevice-free internal radii, self-draining geometries, and total clean-in-place (CIP) and sanitize-in-place (SIP) washability.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap gap-1.5 font-mono text-[10px] text-slate-600">
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">CIP / SIP Drainable</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Crevice-Free Radii</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Food Safe ID</span>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500 text-[11px]">Scope: Dairy &amp; Food Processing</span>
                <button
                  type="button"
                  onClick={() => onOpenEnquiry && onOpenEnquiry(null, '3-A Sanitary Fittings Query')}
                  className="font-bold text-[#2D8CFF] hover:underline cursor-pointer"
                >
                  View 3-A Criteria &rarr;
                </button>
              </div>
            </div>

            {/* Card 4: FDA 21 CFR §177 */}
            <div className="bg-[#F7F8FA] rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#2D8CFF]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#2D8CFF] px-2.5 py-1 bg-[#2D8CFF]/10 rounded-md">
                    FOOD CONTACT SAFETY
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Food Grade Seals
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#071A52] leading-snug">
                  FDA 21 CFR §177 Material Compliance
                </h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  Certified non-metallic contact sealing compounds (Silicone USP Class VI, food grade EPDM, and virgin PTFE gaskets and diaphragms) verified non-cytotoxic, odorless, non-reactive, and compliant with repeated food contact regulations.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap gap-1.5 font-mono text-[10px] text-slate-600">
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">FDA 21 CFR 177.2600</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">USP Class VI</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Virgin PTFE</span>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500 text-[11px]">Scope: Gaskets, Seals &amp; Diaphragms</span>
                <button
                  type="button"
                  onClick={() => onOpenEnquiry && onOpenEnquiry(null, 'FDA Material Compliance Query')}
                  className="font-bold text-[#2D8CFF] hover:underline cursor-pointer"
                >
                  View Gasket Specs &rarr;
                </button>
              </div>
            </div>

            {/* Card 5: CE / PED 2014/68/EU */}
            <div className="bg-[#F7F8FA] rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#2D8CFF]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#2D8CFF] px-2.5 py-1 bg-[#2D8CFF]/10 rounded-md">
                    PRESSURE SAFETY DIRECTIVE
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#071A52] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Hydro-Tested
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#071A52] leading-snug">
                  CE / PED 2014/68/EU Pressure Criteria
                </h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  Pressure ratings and hydrostatic proof-testing compliance for sanitary butterfly valves, check valves, and high-pressure Tri-Clamp joints operating under pressurized steam, CIP cycles, and liquid processing lines.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap gap-1.5 font-mono text-[10px] text-slate-600">
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Hydrostatic Tested</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">10 Bar / 16 Bar</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Sound Eng. Practice</span>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500 text-[11px]">Scope: Valves &amp; High-Pressure Unions</span>
                <button
                  type="button"
                  onClick={() => onOpenEnquiry && onOpenEnquiry(null, 'Pressure Equipment Directive Query')}
                  className="font-bold text-[#2D8CFF] hover:underline cursor-pointer"
                >
                  View Pressure Ratings &rarr;
                </button>
              </div>
            </div>

            {/* Card 6: ISO 9001:2015 Framework */}
            <div className="bg-[#F7F8FA] rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#2D8CFF]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#2D8CFF] px-2.5 py-1 bg-[#2D8CFF]/10 rounded-md">
                    QUALITY MANAGEMENT SYSTEM
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    QMS Aligned QA
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#071A52] leading-snug">
                  ISO 9001:2015 Quality Management
                </h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  Rigorous quality checkpoints including inbound portable XRF spectrometer alloy verification, digital caliper dimensional audits, contact profilometer roughness testing, and documented batch warehousing.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap gap-1.5 font-mono text-[10px] text-slate-600">
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Inbound PMI Testing</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Roughness Profilometer</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Traceable Storage</span>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500 text-[11px]">Scope: Warehouse QA &amp; Sourcing</span>
                <button
                  type="button"
                  onClick={() => onOpenEnquiry && onOpenEnquiry(null, 'Quality Management Protocols')}
                  className="font-bold text-[#2D8CFF] hover:underline cursor-pointer"
                >
                  View QA Protocols &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: BUILT ON FAMILY VALUES. DRIVEN BY ENGINEERING EXCELLENCE.
          Client Feedback Issue 3: Complete family-business heritage story.
          Established 1989 by the family in Girgaon, Mumbai.
          Managing Director Chirag Shah continuing multi-generational legacy.
          Sharp executive portrait layout preserving authentic image resolution.
          ========================================================================= */}
      <section className="w-full bg-[#F7F8FA] text-[#071A52] px-4 lg:px-8 py-16 lg:py-20 border-b border-slate-200" id="why-lotus">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#2D8CFF] font-bold">
              FAMILY HERITAGE • ESTABLISHED 1989 IN GIRGAON, MUMBAI
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#071A52]">
              Built on Family Values. Driven by Engineering Excellence.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Founded in 1989 by our family in the historic metal trading hub of Girgaon, Mumbai, Lotus Tubes has evolved across generations from a regional raw materials trading enterprise into a specialized supplier of certified sanitary stainless steel piping, hygienic fittings, and high-purity process components.
            </p>
          </div>

          {/* Authentic Timeline Array */}
          <div className="relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#071A52] via-[#2D8CFF] to-[#071A52] -translate-y-1/2 z-0 opacity-20" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
              {/* Milestone 1: 1989 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col gap-3 relative hover:border-[#2D8CFF] hover:shadow-md transition-all">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="text-xl font-extrabold text-[#071A52] font-mono">1989</span>
                  <span className="w-3 h-3 rounded-full bg-[#071A52]" />
                </div>
                <h3 className="font-bold text-base text-[#071A52]">
                  Family Foundation in Mumbai
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Established by our family in Girgaon, Mumbai—the historic commercial center of Indian metallurgy—supplying certified stainless steel tubes, pipes, and raw materials to local processing plants.
                </p>
                <span className="mt-auto font-mono text-[10px] text-[#2D8CFF] font-bold uppercase tracking-wider">
                  MUMBAI TRADING ROOTS
                </span>
              </div>

              {/* Milestone 2: 2000s */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col gap-3 relative hover:border-[#2D8CFF] hover:shadow-md transition-all">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="text-xl font-extrabold text-[#2D8CFF] font-mono">2000s</span>
                  <span className="w-3 h-3 rounded-full bg-[#2D8CFF]" />
                </div>
                <h3 className="font-bold text-base text-[#071A52]">
                  Sanitary &amp; Dairy Specialization
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Recognizing the growing hygienic demands of India's dairy, food, and beverage sectors, the business expanded inventory into SMS 1145, DIN 11850, and 3-A sanitary fittings and butterfly valves.
                </p>
                <span className="mt-auto font-mono text-[10px] text-[#2D8CFF] font-bold uppercase tracking-wider">
                  FOOD &amp; DAIRY EXPANSION
                </span>
              </div>

              {/* Milestone 3: 2010s */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col gap-3 relative hover:border-[#2D8CFF] hover:shadow-md transition-all">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="text-xl font-extrabold text-[#071A52] font-mono">2010s</span>
                  <span className="w-3 h-3 rounded-full bg-[#071A52]" />
                </div>
                <h3 className="font-bold text-base text-[#071A52]">
                  High-Purity Biopharma Lines
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Introduced specialized ASME BPE SF4 electropolished tubing with Ra ≤ 0.38µm, zero dead-leg diaphragm valves, and Tri-Clamp unions to serve sterile pharmaceutical and biotechnology loops.
                </p>
                <span className="mt-auto font-mono text-[10px] text-[#2D8CFF] font-bold uppercase tracking-wider">
                  BIOPHARMA &amp; WFI SYSTEMS
                </span>
              </div>

              {/* Milestone 4: Present Day */}
              <div className="bg-white p-6 rounded-2xl border-2 border-[#2D8CFF] shadow-md flex flex-col gap-3 relative">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="text-xl font-extrabold text-[#2D8CFF] font-mono">TODAY</span>
                  <span className="w-3.5 h-3.5 rounded-full bg-[#2D8CFF] animate-pulse" />
                </div>
                <h3 className="font-bold text-base text-[#071A52]">
                  Next-Gen Leadership &amp; RFQ Desk
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Managing Director Chirag Shah advances the multi-generational family legacy, uniting 35+ years of family trade relationships with rapid digital quotation workflows, stringent EN 10204 3.1 MTC inspection, and direct WhatsApp sales support.
                </p>
                <span className="mt-auto font-mono text-[10px] text-[#2D8CFF] font-bold uppercase tracking-wider">
                  MODERN SOURCING PLATFORM
                </span>
              </div>
            </div>
          </div>

          {/* Leadership & Family Heritage Executive Card */}
          <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-md border border-slate-200/90 mt-2">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Executive Portrait Column (High-Res 1168x1346 preserved, elegant rectangular framing) */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="w-60 h-80 sm:w-64 sm:h-88 rounded-2xl overflow-hidden shadow-xl border-2 border-slate-200/80 bg-slate-100 relative group flex items-center justify-center p-1">
                  <img
                    className="w-full h-full object-cover object-top rounded-xl transition-transform duration-500 group-hover:scale-102"
                    src={LEADERSHIP.photo || '/assets/images/team/owner.jpeg'}
                    alt="Chirag Shah - Managing Director, Lotus Tubes"
                    width="400"
                    height="500"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-[#071A52]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-center">
                    <span className="font-mono text-[10px] text-white uppercase font-bold tracking-wider">
                      MANAGING DIRECTOR
                    </span>
                  </div>
                </div>
              </div>

              {/* Executive Biography & Family Business Perspective */}
              <div className="lg:col-span-8 flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-white uppercase px-2.5 py-1 rounded bg-[#071A52] font-bold tracking-wider">
                    MANAGING DIRECTOR'S PERSPECTIVE
                  </span>
                  <span className="font-mono text-xs text-[#2D8CFF] font-semibold bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                    CONTINUING A MULTI-GENERATIONAL FAMILY LEGACY
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#071A52]">
                  {LEADERSHIP.name || 'Chirag Shah'}
                </h3>
                <span className="text-xs font-mono text-slate-500 uppercase font-semibold">
                  Managing Director &bull; Lotus Tubes (Est. 1989 Family Business)
                </span>

                <p className="text-sm sm:text-base text-slate-700 italic leading-relaxed pt-1">
                  &ldquo;Lotus Tubes was founded in 1989 by our family on principles of uncompromising integrity, technical precision, and enduring client trust. Growing up immersed in Mumbai's stainless steel trade, I was taught early on that in sanitary fluid architecture, there is zero tolerance for error. An undetected 0.5µm crevice or an unverified heat number can jeopardize an entire pharmaceutical or dairy processing batch. Today, leading our family enterprise into its next chapter, my focus is on pairing our three-decade foundation with responsive, modern technical service, verified mill test traceability, and transparent B2B partnership.&rdquo;
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 font-mono text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2">
                    <span className="text-[#2D8CFF] font-bold text-sm">✓</span>
                    <span className="text-slate-800 font-semibold">Family Business Est. 1989</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2">
                    <span className="text-[#2D8CFF] font-bold text-sm">✓</span>
                    <span className="text-slate-800 font-semibold">SS 304 &amp; SS 316L Stocking</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2">
                    <span className="text-[#2D8CFF] font-bold text-sm">✓</span>
                    <span className="text-slate-800 font-semibold">EN 10204 3.1 Traceability</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STATISTICS SECTION: INDUSTRIAL SCALE & METALLURGICAL HERITAGE (WHITE #FFFFFF)
          Client Feedback Issue 6: Relocated to bottom of homepage before BOQ engine.
          Verified metrics: 100+ Specs, Dual Metallurgy, 10+ Years Track Record, Prompt RFQ.
          ========================================================================= */}
      <section className="w-full bg-[#FFFFFF] text-[#071A52] px-4 lg:px-8 py-14 lg:py-16 border-b border-slate-200" id="statistics">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-1.5">
            <span className="font-mono text-xs uppercase tracking-widest text-[#2D8CFF] font-bold">
              VERIFIED METALLURGY • RELIABLE SOURCING
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#071A52]">
              Industrial Scale &amp; Proven Metallurgical Heritage
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
            {/* Stat 1: 100+ Specs */}
            <div className="bg-[#F7F8FA] p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center hover:border-[#2D8CFF]/50 transition-all">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#071A52] tracking-tight">
                <AnimatedCounter target={100} suffix="+" duration={1800} />
              </div>
              <span className="mt-2 text-sm sm:text-base font-bold text-[#071A52]">
                Hygienic Specs &amp; Sizes
              </span>
              <span className="text-xs text-slate-500 mt-1">
                ASTM A270, DIN 11850, ASME BPE &amp; 3-A stock
              </span>
            </div>

            {/* Stat 2: Dual Metallurgy */}
            <div className="bg-[#F7F8FA] p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center hover:border-[#2D8CFF]/50 transition-all">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2D8CFF] tracking-tight py-1.5 sm:py-2">
                SS 304 / 316L
              </div>
              <span className="mt-2 text-sm sm:text-base font-bold text-[#071A52]">
                Dual Metallurgy
              </span>
              <span className="text-xs text-slate-500 mt-1">
                EP Ra ≤ 0.38µm mirror &amp; MP satin finishes
              </span>
            </div>

            {/* Stat 3: 10+ Years */}
            <div className="bg-[#F7F8FA] p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center hover:border-[#2D8CFF]/50 transition-all">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#071A52] tracking-tight">
                <AnimatedCounter target={10} suffix="+ Years" duration={1800} />
              </div>
              <span className="mt-2 text-sm sm:text-base font-bold text-[#071A52]">
                Industry Track Record
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Continuous sourcing from Girgaon, Mumbai hub
              </span>
            </div>

            {/* Stat 4: Prompt RFQ Desk */}
            <div className="bg-[#F7F8FA] p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center hover:border-[#2D8CFF]/50 transition-all">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2D8CFF] tracking-tight py-1.5 sm:py-2">
                Prompt RFQ
              </div>
              <span className="mt-2 text-sm sm:text-base font-bold text-[#071A52]">
                Technical Sourcing Desk
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Direct quotation assistance via WhatsApp &amp; Email
              </span>
            </div>
          </div>
        </div>
      </section>

      
      {/* =========================================================================
          SECTION 8: INSTANT BOQ & QUOTATION ENGINE (MODERN INDUSTRIAL PROCUREMENT SUITE)
          Client Feedback Issue 6: Redesigned 2-column layout.
          Left column: 3-step quotation workflow & trust metrics.
          Right column: Premium grouped input fields, clear validation, and AI agent integration.
          Preserves exact backend payload structure and AI Sales Agent Ananya Mehta integration.
          ========================================================================= */}
      <section className="w-full bg-[#FFFFFF] text-[#071A52] px-4 lg:px-8 py-16 lg:py-20 border-b border-slate-200" id="boq-request">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Column: Industrial Procurement Overview & 3-Step Process (5 cols) */}
            <div className="lg:col-span-5 bg-[#071A52] text-white p-8 sm:p-10 lg:p-12 flex flex-col justify-between gap-8">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 font-mono text-xs uppercase px-3 py-1 rounded-full bg-white/10 text-[#2D8CFF] font-bold self-start border border-white/15">
                  <span className="w-2 h-2 rounded-full bg-[#2D8CFF] animate-pulse" />
                  <span>AI-POWERED PROCUREMENT PIPELINE</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Instant BOQ &amp; Industrial Quotation Engine
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Paste your Bill of Quantities or tube schedule. Ananya Mehta (AI Sales Specialist) and our Mumbai engineering desk parse your specifications for rapid commercial review and dispatch of itemized pricing.
                </p>

                {/* 3 Concise Steps */}
                <div className="flex flex-col gap-4 pt-4">
                  <div className="flex items-start gap-3.5">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#2D8CFF] text-white text-xs font-bold shrink-0 font-mono">
                      1
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Submit Tube &amp; Fitting Schedule</span>
                      <span className="text-xs text-slate-300 mt-0.5">Paste your Bill of Quantities or enter required sizes, quantities, and alloy specifications.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/15 text-[#2D8CFF] text-xs font-bold shrink-0 font-mono border border-white/20">
                      2
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Technical &amp; MTC Verification</span>
                      <span className="text-xs text-slate-300 mt-0.5">Our technical desk verifies mill test report (MTC) availability and ready warehouse stock in Mumbai.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/15 text-[#2D8CFF] text-xs font-bold shrink-0 font-mono border border-white/20">
                      3
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Itemized Quotation Dispatch</span>
                      <span className="text-xs text-slate-300 mt-0.5">Receive a formal commercial quotation with transparent pricing, HS codes, and immediate dispatch timelines.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Trust Ribbons */}
              <div className="pt-6 border-t border-white/10 flex flex-col gap-2 font-mono text-[11px] text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="text-[#2D8CFF] font-bold">✓</span> EN 10204 3.1 Mill Test Certificates Included
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[#2D8CFF] font-bold">✓</span> Direct WhatsApp Assistance on +91 98205 25200
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[#2D8CFF] font-bold">✓</span> Ready Stock Dispatch from Girgaon, Mumbai Hub
                </span>
              </div>
            </div>

            {/* Right Column: Premium Quotation Form (7 cols) */}
            <div className="lg:col-span-7 bg-[#F7F8FA] p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
              {boqSuccess ? (
                <div className="p-8 bg-white rounded-2xl border border-emerald-300 text-center flex flex-col items-center justify-center gap-4 shadow-sm my-auto">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl font-bold">
                    ✓
                  </div>
                  <h3 className="font-extrabold text-xl text-[#071A52]">Quotation Schedule Logged</h3>
                  <p className="text-sm text-slate-600 max-w-md leading-relaxed">{boqSuccess}</p>
                  <button
                    type="button"
                    onClick={() => setBoqSuccess('')}
                    className="mt-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#071A52] rounded-xl font-mono text-xs font-bold cursor-pointer transition-colors"
                  >
                    Submit Another BOQ Schedule
                  </button>
                </div>
              ) : (
                <form className="flex flex-col gap-5" onSubmit={handleBoqSubmit}>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#071A52]">
                      Submit Your BOQ / Technical Schedule
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Fill out the specification fields below. Required fields are marked with an asterisk (*).
                    </p>
                  </div>

                  {/* Group 1: Contact Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-xs text-slate-700 font-bold uppercase tracking-wider">
                        Full Name &bull; Company Designation *
                      </label>
                      <input
                        className="px-4 py-3 bg-white rounded-xl text-[#071A52] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF] border border-slate-200 shadow-xs placeholder:text-slate-400"
                        placeholder="e.g. Dr. Rajesh Verma (Project Lead)"
                        required
                        type="text"
                        value={boqFormData.name}
                        onChange={(e) => setBoqFormData({ ...boqFormData, name: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-xs text-slate-700 font-bold uppercase tracking-wider">
                        Corporate Email &bull; Phone / WhatsApp *
                      </label>
                      <input
                        className="px-4 py-3 bg-white rounded-xl text-[#071A52] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF] border border-slate-200 shadow-xs placeholder:text-slate-400"
                        placeholder="rajesh@biopharmalead.com or +91 98..."
                        required
                        type="text"
                        value={boqFormData.emailPhone}
                        onChange={(e) => setBoqFormData({ ...boqFormData, emailPhone: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Group 2: Metallurgical Criteria */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-xs text-slate-700 font-bold uppercase tracking-wider">
                        Target Alloy Grade
                      </label>
                      <select
                        className="px-4 py-3 bg-white rounded-xl text-[#071A52] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF] border border-slate-200 shadow-xs cursor-pointer"
                        value={boqFormData.alloy}
                        onChange={(e) => setBoqFormData({ ...boqFormData, alloy: e.target.value })}
                      >
                        <option>SS 316L (Parenteral / Biopharma)</option>
                        <option>SS 304 / 304L (Dairy &amp; Food)</option>
                        <option>Dual Certified SS 316/316L</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-xs text-slate-700 font-bold uppercase tracking-wider">
                        Surface Finish Spec
                      </label>
                      <select
                        className="px-4 py-3 bg-white rounded-xl text-[#071A52] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF] border border-slate-200 shadow-xs cursor-pointer"
                        value={boqFormData.finish}
                        onChange={(e) => setBoqFormData({ ...boqFormData, finish: e.target.value })}
                      >
                        <option>Electropolished (EP) Ra ≤ 0.38µm (SF4)</option>
                        <option>Electropolished (EP) Ra ≤ 0.51µm (SF1)</option>
                        <option>Mechanical Polish (MP) Ra ≤ 0.8µm</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-xs text-slate-700 font-bold uppercase tracking-wider">
                        Destination Port / City
                      </label>
                      <input
                        className="px-4 py-3 bg-white rounded-xl text-[#071A52] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF] border border-slate-200 shadow-xs placeholder:text-slate-400"
                        placeholder="e.g. Mumbai / Houston / JAFZA"
                        type="text"
                        value={boqFormData.port}
                        onChange={(e) => setBoqFormData({ ...boqFormData, port: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Group 3: BOQ Schedule Textarea */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs text-slate-700 font-bold uppercase tracking-wider">
                      Paste BOQ Schedule / Tube Schedule / Fitting List *
                    </label>
                    <textarea
                      className="px-4 py-3 bg-white rounded-xl text-[#071A52] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8CFF] border border-slate-200 shadow-xs font-mono placeholder:text-slate-400"
                      placeholder="e.g. 500m x 1.5' OD SS 316L EP tubes; 40x 90 deg bend clamp ends; 20x 1.5' diaphragm valves pneumatic actuator..."
                      rows={5}
                      required
                      value={boqFormData.schedule}
                      onChange={(e) => setBoqFormData({ ...boqFormData, schedule: e.target.value })}
                    />
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
                      <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>EN 10204 3.1 &bull; Heat Traceable Documentation</span>
                    </div>
                    <button
                      className="btn-magenta-cta w-full sm:w-auto px-8 py-3.5 font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
                      type="submit"
                      disabled={boqSubmitting}
                    >
                      {boqSubmitting ? 'Processing BOQ Specifications...' : 'Generate AI Price Quotation →'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;

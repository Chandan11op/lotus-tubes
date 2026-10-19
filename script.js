/**
 * ============================================================================
 * LOTUS TUBES — INDUSTRIAL B2B STAINLESS STEEL SANITARY SPA
 * Master Application Script: Router, Catalogue Dataset, Views & CRM Prototype
 * ============================================================================
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. CONSTANTS & SYSTEM CONFIGURATION
     -------------------------------------------------------------------------- */
  const CONFIG = {
    brandName: 'Lotus Tubes',
    companyLegalName: 'Lotus Impex',
    gstin: '27AIIPS0303A1ZU',
    iec: '0316902471',
    primaryPhone: '+919930430789',
    primaryEmail: 'sales@lotustubes.com',
    whatsappNumber: '919930430789',
    officeAddress: 'Shop No. 9, Jain Bhavan CHSL, Dr Bhajekar Lane, opp. to 11th Lane, Charni Road East, Khetwadi, Girgaon, Mumbai, Maharashtra 400004, India'
  };

  /* Helper to generate reliable inline SVG product images as fallback/crisp imagery */
  function createProductSVG(title, category, colorHex) {
    const safeTitle = (title || 'Sanitary Component').replace(/"/g, '&quot;');
    const accent = colorHex || '#F00078';
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="%23F8FAFC"/>
          <stop offset="100%" stop-color="%23E2E8F0"/>
        </linearGradient>
        <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stop-color="%2394A3B8"/>
          <stop offset="35%" stop-color="%23FFFFFF"/>
          <stop offset="65%" stop-color="%23CBD5E1"/>
          <stop offset="100%" stop-color="%2364748B"/>
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="%2310263D" flood-opacity="0.15"/>
        </filter>
      </defs>
      <rect width="600" height="450" fill="url(%23bg)"/>
      <circle cx="520" cy="80" r="140" fill="${accent}" opacity="0.04"/>
      <g filter="url(%23shadow)">
        <!-- Stylized Sanitary Fitting / Pipe Geometry -->
        <rect x="150" y="160" width="300" height="90" rx="14" fill="url(%23metal)"/>
        <ellipse cx="150" cy="205" rx="28" ry="45" fill="%23475569"/>
        <ellipse cx="150" cy="205" rx="20" ry="35" fill="%231E293B"/>
        <ellipse cx="450" cy="205" rx="28" ry="45" fill="url(%23metal)"/>
        <!-- Polish Highlight Sheen -->
        <line x1="160" y1="180" x2="440" y2="180" stroke="%23FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.85"/>
        <line x1="180" y1="192" x2="420" y2="192" stroke="%23FFFFFF" stroke-width="2" opacity="0.6"/>
        <!-- Sanitary Ferrule Ring -->
        <rect x="430" y="145" width="22" height="120" rx="6" fill="url(%23metal)" stroke="%23334155" stroke-width="1.5"/>
        <rect x="138" y="145" width="22" height="120" rx="6" fill="url(%23metal)" stroke="%23334155" stroke-width="1.5"/>
      </g>
      <!-- Lotus Tubes Brand Tag -->
      <rect x="230" y="360" width="140" height="28" rx="6" fill="%2310263D"/>
      <text x="300" y="379" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23FFFFFF" text-anchor="middle">LOTUS TUBES</text>
      <text x="300" y="325" font-family="sans-serif" font-size="18" font-weight="bold" fill="%2310263D" text-anchor="middle">${safeTitle}</text>
      <text x="300" y="344" font-family="sans-serif" font-size="12" fill="%2364748B" text-anchor="middle">${category}</text>
    </svg>`;
  }

  /* --------------------------------------------------------------------------
     2. PRODUCT CATALOGUE DATASET (AS SPECIFIED IN CLIENT REQUIREMENTS)
     -------------------------------------------------------------------------- */
  const CATEGORIES = [
    {
      id: 'sanitary-pipes',
      slug: 'sanitary-pipes',
      name: 'Sanitary Pipes & Tubes',
      desc: 'SS 304 and SS 316L high-purity sanitary tubing with Electro Polished (EP) and Mechanical Polished (MP) finishes conforming to ASTM A270 & A269.',
      icon: '📏',
      image: 'assets/images/products/pipes/ss-316l-ep-pipe.svg',
      subcategories: ['EP Sanitary Pipe', 'MP Sanitary Pipe', 'Seamless Tube', 'Welded Tube']
    },
    {
      id: 'sanitary-fittings',
      slug: 'sanitary-fittings',
      name: 'Sanitary Pipe Fittings',
      desc: 'Hygienic 90° and 45° bends, equal tees, reducing tees, concentric & eccentric reducers engineered with smooth internal radiuses for fluid cleanliness.',
      icon: '🔀',
      image: 'assets/images/products/fittings/ss-sanitary-90-bend.svg',
      subcategories: ['Sanitary Bends', 'Equal Tees', 'Reducing Tees', 'Concentric Reducers', 'Eccentric Reducers']
    },
    {
      id: 'tri-clamp',
      slug: 'tri-clamp',
      name: 'Tri-Clamp Fittings & Components',
      desc: 'Sanitary Tri-Clamp ferrules, heavy-duty single/double pin clamps, SMS unions, DIN unions, and blind end caps for rapid hygienic disassembly.',
      icon: '🔗',
      image: 'assets/images/products/accessories/ss-tri-clamp-clamp.svg',
      subcategories: ['TC Ferrules', 'TC Clamps', 'SMS Unions', 'DIN Unions', 'TC End Caps']
    },
    {
      id: 'gaskets',
      slug: 'gaskets',
      name: 'Sanitary Gaskets',
      desc: 'FDA & USP Class VI compliant sealing gaskets in Silicone, EPDM, PTFE, Viton (FKM), and NBR for leak-free hygienic pipe joints.',
      icon: '⭕',
      image: 'assets/images/products/gaskets/silicone-tri-clamp-gasket.svg',
      subcategories: ['Silicone Gaskets', 'EPDM Gaskets', 'PTFE Gaskets', 'Viton Gaskets', 'Manhole Gaskets']
    },
    {
      id: 'manual-valves',
      slug: 'manual-valves',
      name: 'Manual Sanitary Valves',
      desc: 'Hygienic sanitary butterfly valves, multi-position pull/gripper handles, 3-piece ball valves with TC ends, non-return valves, and diaphragm valves.',
      icon: '🚰',
      image: 'assets/images/products/valves/ss-sanitary-butterfly-valve.svg',
      subcategories: ['Butterfly Valves', 'Diaphragm Valves', '3-Piece Ball Valves', 'Sampling Valves', 'Check Valves']
    },
    {
      id: 'pneumatic-valves',
      slug: 'pneumatic-valves',
      name: 'Pneumatic & Automated Valves',
      desc: 'Pneumatically actuated sanitary ball valves, automated diaphragm valves with control heads, safety switches, and process automation accessories.',
      icon: '⚡',
      image: 'assets/images/products/valves/pneumatic-sanitary-ball-valve.svg',
      subcategories: ['Pneumatic Diaphragm', 'Pneumatic Ball Valve', 'Control Tops', 'Actuator Accessories']
    },
    {
      id: 'tank-cleaning',
      slug: 'tank-cleaning',
      name: 'Tank Cleaning Accessories',
      desc: 'Fixed and 360° rotary spray balls, sanitary manhole covers (round/oval/pressure), CIP tank vent filter housings, and vessel sight glasses.',
      icon: '🚿',
      image: 'assets/images/products/accessories/ss-sanitary-spray-ball.svg',
      subcategories: ['Rotary Spray Balls', 'Static Spray Balls', 'Pressure Manholes', 'Tank Sight Glass']
    },
    {
      id: 'custom-assemblies',
      slug: 'custom-assemblies',
      name: 'Custom Hygienic Assemblies',
      desc: 'Drawing-based sanitary pipe spools, fabricated manifolds, instrument tees, and specialized stainless steel transfer panels.',
      icon: '⚙️',
      image: 'assets/images/products/accessories/custom-assemblies.svg',
      subcategories: ['Sanitary Spools', 'Custom Manifolds', 'Instrument Connections', 'Transition Fittings']
    }
  ];

  /* Detailed Master Products (Prioritizing the 20 Essential Products) */
  const PRODUCTS = [
    {
      id: 'ss-316l-ep-pipe',
      name: 'SS 316L Electro Polished (EP) Sanitary Pipe',
      slug: 'ss-316l-ep-pipe',
      category: 'Sanitary Pipes & Tubes',
      categorySlug: 'sanitary-pipes',
      priorityRank: 1,
      featured: true,
      material: 'SS 316L',
      finish: 'Electro Polished (EP)',
      roughness: 'Ra ≤ 0.38 µm (15 µin) Inside, Ra ≤ 0.8 µm Outside',
      manufacturingType: 'Seamless or Welded',
      standard: 'ASTM A270 / ASTM A269',
      connection: 'Plain End / TC Ferrules on request',
      sizes: '1/2" to 4" OD (12.7 mm to 101.6 mm)',
      wallThickness: '1.2 mm, 1.5 mm, 1.65 mm (16G), 2.0 mm',
      length: '6.0 Meters Standard (Custom cut lengths available)',
      mtc: 'EN 10204 3.1 Material Test Certificate supplied',
      image: 'assets/images/products/pipes/ss-316l-ep-pipe.svg',
      overview: 'SS 316L Electro Polished Sanitary Pipe is the gold standard for high-purity pharmaceutical, biotechnology, and sterile process applications. The electrochemical polishing process removes surface microscopic peaks and crevices, delivering ultra-smooth hygienic contact surfaces that eliminate bacterial harborage, minimize biofilm formation, and resist corrosive cleaning agents.',
      applications: ['Water For Injection (WFI) loops', 'Bio-pharmaceutical bulk manufacturing', 'High-purity sterile liquid transfer', 'Critical cleanroom piping', 'Biotech fermenter piping']
    },
    {
      id: 'ss-304-ep-pipe',
      name: 'SS 304 Electro Polished (EP) Sanitary Pipe',
      slug: 'ss-304-ep-pipe',
      category: 'Sanitary Pipes & Tubes',
      categorySlug: 'sanitary-pipes',
      priorityRank: 2,
      featured: true,
      material: 'SS 304',
      finish: 'Electro Polished (EP)',
      roughness: 'Ra ≤ 0.4 µm Inside',
      manufacturingType: 'Welded or Seamless',
      standard: 'ASTM A270',
      connection: 'Plain End / Butt Weld',
      sizes: '1/2" to 4" OD',
      wallThickness: '1.2 mm to 2.0 mm',
      length: '6.0 Meters standard',
      mtc: 'Available upon dispatch',
      image: 'assets/images/products/pipes/ss-304-ep-pipe.svg',
      overview: 'SS 304 EP Sanitary Pipes provide exceptional surface cleanliness and cleanability for food, dairy, and beverage processing systems requiring hygienic standards at cost-efficient operating economics.',
      applications: ['Dairy milk handling lines', 'Brewery cellar piping', 'Beverage and juice blending', 'Pure food ingredient pipelines']
    },
    {
      id: 'ss-316l-mp-pipe',
      name: 'SS 316L Mechanical Polished (MP) Sanitary Pipe',
      slug: 'ss-316l-mp-pipe',
      category: 'Sanitary Pipes & Tubes',
      categorySlug: 'sanitary-pipes',
      priorityRank: 3,
      featured: true,
      material: 'SS 316L',
      finish: 'Mechanical Polished (MP)',
      roughness: 'Ra ≤ 0.8 µm (320 Grit / 400 Grit)',
      manufacturingType: 'Welded',
      standard: 'ASTM A270',
      connection: 'Butt Weld / Plain End',
      sizes: '3/4" to 4" OD',
      wallThickness: '1.5 mm, 1.65 mm, 2.0 mm',
      length: '6.0 Meters',
      mtc: 'Available with chemical & mechanical analysis',
      image: 'assets/images/products/pipes/ss-316l-mp-pipe.svg',
      overview: 'Precision mechanically polished SS 316L tube designed for sanitary process piping where electro-polishing is not mandatorily specified, delivering superior molybdenum-assisted corrosion resistance.',
      applications: ['Personal care formulations', 'Nutraceuticals transfer', 'Purified water distribution', 'Food sauce and condiment lines']
    },
    {
      id: 'ss-304-mp-pipe',
      name: 'SS 304 Mechanical Polished (MP) Sanitary Pipe',
      slug: 'ss-304-mp-pipe',
      category: 'Sanitary Pipes & Tubes',
      categorySlug: 'sanitary-pipes',
      priorityRank: 4,
      featured: true,
      material: 'SS 304',
      finish: 'Mechanical Polished (MP)',
      roughness: 'Ra ≤ 0.8 µm Inside/Outside',
      manufacturingType: 'Welded',
      standard: 'ASTM A270',
      connection: 'Plain End / Butt Weld',
      sizes: '1/2" to 4" OD',
      wallThickness: '1.2 mm to 1.65 mm',
      length: '6.0 Meters',
      mtc: 'Supplied with test report',
      image: 'assets/images/products/pipes/ss-304-mp-pipe.svg',
      overview: 'Standard hygienic stainless steel tube with mirror/satin mechanical polish, widely utilized in food processing facilities and commercial dairy setups across India and international markets.',
      applications: ['Milk pasteurization units', 'Beverage filling lines', 'CIP recovery piping', 'Industrial kitchen process plants']
    },
    {
      id: 'ss-304-seamless-tube',
      name: 'SS 304 Seamless Sanitary Tube',
      slug: 'ss-304-seamless-tube',
      category: 'Sanitary Pipes & Tubes',
      categorySlug: 'sanitary-pipes',
      priorityRank: 5,
      featured: true,
      material: 'SS 304',
      finish: 'Electro Polished (EP)',
      roughness: 'Ra ≤ 0.4 µm Inside',
      manufacturingType: 'Seamless Cold Drawn',
      standard: 'ASTM A270 / ASTM A269',
      connection: 'Plain End / Butt Weld',
      sizes: '1/2" to 4" OD',
      wallThickness: '1.2 mm to 2.0 mm',
      length: '6.0 Meters Standard',
      mtc: 'EN 10204 3.1 Material Test Certificate supplied',
      image: 'assets/images/products/pipes/ss-304-seamless-tube.svg',
      overview: 'SS 304 Seamless Sanitary Tube offers seamless cold-drawn construction for critical hygienic utility and processing lines requiring uniform grain structure, pressure integrity, and zero weld seam.',
      applications: ['Clean utilities and pure steam distribution', 'High pressure hygienic food lines', 'Dairy processing lines', 'Specialty chemical and sanitary processing']
    },
    {
      id: 'ss-316l-sanitary-fittings',
      name: 'SS 316L Sanitary Pipe Fittings (Set / Assorted)',
      slug: 'ss-316l-sanitary-fittings',
      category: 'Sanitary Pipe Fittings',
      categorySlug: 'sanitary-fittings',
      priorityRank: 5,
      featured: true,
      material: 'SS 316L',
      finish: 'EP / MP (Internal Ra ≤ 0.4 µm)',
      manufacturingType: 'Forged & Machined / Formed',
      standard: 'BS 4825 / 3-A / DIN 11850',
      connection: 'Butt Weld / Tri-Clamp',
      sizes: '1/2" to 4"',
      wallThickness: '1.6 mm / 1.65 mm',
      length: 'Standard dimension',
      mtc: 'Complete batch traceability',
      image: createProductSVG('SS 316L Sanitary Fittings', 'Fittings', '#0284C7'),
      overview: 'Comprehensive range of SS 316L hygienic pipe fittings designed with gentle radius curvature and controlled tolerances to avoid product entrapment or pressure drops in sterile fluid transfer.',
      applications: ['Pharma clean utilities', 'Sterile fermentation', 'API manufacturing plants']
    },
    {
      id: 'ss-sanitary-90-bend',
      name: 'SS Sanitary 90° Bend (Long & Short Radius)',
      slug: 'ss-sanitary-90-bend',
      category: 'Sanitary Pipe Fittings',
      categorySlug: 'sanitary-fittings',
      priorityRank: 6,
      featured: true,
      material: 'SS 304 / SS 316L',
      finish: 'Electro Polished / Mirror MP',
      roughness: 'Ra ≤ 0.4 µm internal',
      manufacturingType: 'Cold Drawn Seamless / Welded',
      standard: 'ASTM A270 / BS 4825 Part 2',
      connection: 'Weld End / Tri-Clamp End',
      sizes: '1/2" to 4" OD',
      wallThickness: '1.5 mm / 1.65 mm',
      length: '1.5D or 2.0D radius',
      mtc: 'Available with dispatch',
      image: createProductSVG('SS Sanitary 90° Bend', 'Fittings', '#F00078'),
      overview: 'Hygienic 90-degree pipe bends manufactured with true-circular cross sections and uniform wall thickness to ensure unhindered laminar flow and thorough Clean-In-Place (CIP) drainage.',
      applications: ['Process piping direction change', 'Dairy reception lines', 'Liquid vaccine manufacturing']
    },
    {
      id: 'ss-sanitary-equal-tee',
      name: 'SS Sanitary Equal Tee',
      slug: 'ss-sanitary-equal-tee',
      category: 'Sanitary Pipe Fittings',
      categorySlug: 'sanitary-fittings',
      priorityRank: 7,
      featured: true,
      material: 'SS 304 / SS 316L',
      finish: 'Mirror Polished / EP',
      roughness: 'Ra ≤ 0.4 µm',
      manufacturingType: 'Pulled / Welded Hygienic Tee',
      standard: 'BS 4825 / 3-A Sanitary',
      connection: 'Butt Weld or Tri-Clamp',
      sizes: '1/2" to 4" equal ports',
      wallThickness: '1.6 mm',
      length: 'Standard',
      mtc: 'Verified test certificate',
      image: createProductSVG('SS Sanitary Equal Tee', 'Fittings', '#10263D'),
      overview: 'Precision-formed three-way equal connection fitting engineered without interior dead-legs to allow smooth splitting or combining of hygienic fluid flows.',
      applications: ['Flow distribution loops', 'Sampling branch connections', 'CIP return lines']
    },
    {
      id: 'ss-sanitary-reducing-tee',
      name: 'SS Sanitary Reducing Tee',
      slug: 'ss-sanitary-reducing-tee',
      category: 'Sanitary Pipe Fittings',
      categorySlug: 'sanitary-fittings',
      priorityRank: 8,
      featured: true,
      material: 'SS 304 / SS 316L',
      finish: 'EP / MP',
      roughness: 'Ra ≤ 0.4 µm',
      manufacturingType: 'Formed Sanitary Fitting',
      standard: 'BS 4825',
      connection: 'Butt Weld / TC End',
      sizes: '1" x 1/2", 1.5" x 1", 2" x 1", 3" x 2" (Custom reductions)',
      wallThickness: '1.65 mm',
      length: 'Standard',
      mtc: 'Supplied with material traceability',
      image: createProductSVG('SS Sanitary Reducing Tee', 'Fittings', '#10B981'),
      overview: 'Sanitary reducing tee designed to feed smaller process equipment branches or instrument sensors from main hygienic headers without turbulence.',
      applications: ['Utility sub-headers', 'Instrument takeoffs', 'Sanitary dosing loops']
    },
    {
      id: 'ss-sanitary-concentric-reducer',
      name: 'SS Sanitary Concentric Reducer',
      slug: 'ss-sanitary-concentric-reducer',
      category: 'Sanitary Pipe Fittings',
      categorySlug: 'sanitary-fittings',
      priorityRank: 9,
      featured: true,
      material: 'SS 304 / SS 316L',
      finish: 'High Purity EP / Mirror Finish',
      roughness: 'Ra ≤ 0.4 µm Inside',
      manufacturingType: 'Press Formed & Sized',
      standard: 'ASTM A270 / BS 4825',
      connection: 'Butt Weld / TC Clamp End',
      sizes: '1" x 1/2" up to 4" x 3"',
      wallThickness: '1.6 mm',
      length: 'Standard',
      mtc: 'Available upon order',
      image: createProductSVG('SS Concentric Reducer', 'Fittings', '#F00078'),
      overview: 'Concentric reducers provide linear, symmetrical fluid velocity transitions between differing pipe diameters along the vertical or center line.',
      applications: ['Vertical pipe size reductions', 'Pump inlet and discharge sizing', 'Filtration skid connections']
    },
    {
      id: 'ss-sanitary-eccentric-reducer',
      name: 'SS Sanitary Eccentric Reducer (Flat-Side Bottom)',
      slug: 'ss-sanitary-eccentric-reducer',
      category: 'Sanitary Pipe Fittings',
      categorySlug: 'sanitary-fittings',
      priorityRank: 10,
      featured: true,
      material: 'SS 304 / SS 316L',
      finish: 'EP / MP',
      roughness: 'Ra ≤ 0.4 µm',
      manufacturingType: 'Sanitary Formed',
      standard: 'BS 4825 / 3-A',
      connection: 'Butt Weld / TC Clamp End',
      sizes: '1" to 4" combinations',
      wallThickness: '1.65 mm',
      length: 'Standard',
      mtc: 'Supplied with product',
      image: createProductSVG('SS Eccentric Reducer', 'Fittings', '#0284C7'),
      overview: 'Crucial for horizontal sanitary pipelines. The eccentric reducer features a flat bottom to prevent liquid pooling and air entrapment, guaranteeing 100% self-draining capability for CIP operations.',
      applications: ['Horizontal sanitary pipelines', 'Zero-pool gravity drainage lines', 'Pump suction piping']
    },
    {
      id: 'ss-tri-clamp-ferrule',
      name: 'SS Tri-Clamp Ferrule (Long / Short Weld / Expand)',
      slug: 'ss-tri-clamp-ferrule',
      category: 'Tri-Clamp Fittings & Components',
      categorySlug: 'tri-clamp',
      priorityRank: 11,
      featured: true,
      material: 'SS 304 / SS 316L',
      finish: 'CNC Machined & Electro Polished',
      roughness: 'Ra ≤ 0.4 µm internal',
      manufacturingType: 'Precision CNC Machined from Bar / Forging',
      standard: 'BS 4825 Part 3 / DIN 32676',
      connection: 'Butt Weld to Tube / Tri-Clamp Face',
      sizes: '1/2" to 4" (12.7 mm to 101.6 mm)',
      wallThickness: '1.6 mm standard',
      length: '12.7 mm, 21.5 mm, 28.6 mm length options',
      mtc: 'Available with heat number marking',
      image: 'assets/images/products/accessories/ss-tri-clamp-ferrule.svg',
      overview: 'Precision-machined sanitary Tri-Clamp ferrules provide quick-disconnect, leak-tight joints when paired with sanitary gaskets and heavy-duty clamps, conforming to international hygienic standards.',
      applications: ['Tank nozzle connections', 'Modular skid interconnection', 'Frequent washdown equipment connections']
    },
    {
      id: 'ss-tri-clamp-clamp',
      name: 'SS Tri-Clamp Clamp (Heavy Duty Single & Double Pin)',
      slug: 'ss-tri-clamp-clamp',
      category: 'Tri-Clamp Fittings & Components',
      categorySlug: 'tri-clamp',
      priorityRank: 12,
      featured: true,
      material: 'SS 304 (Forged Body & Wingnut)',
      finish: 'Polished Silver',
      roughness: 'Standard mechanical polish',
      manufacturingType: 'Precision Casting / Forging',
      standard: '3-A / ISO 2852',
      connection: 'Tri-Clamp Flange Clamping',
      sizes: '1/2" to 4" Flange diameters',
      wallThickness: 'Heavy duty forged cross section',
      length: 'Wingnut tightening',
      mtc: 'Batch inspection certificate',
      image: createProductSVG('SS Tri-Clamp Clamp', 'Tri-Clamp', '#10263D'),
      overview: 'Heavy-duty stainless steel 304 sanitary clamps engineered with ergonomic solid wingnuts and reinforced hinge pins to deliver uniform circumferential compression on Tri-Clamp gaskets.',
      applications: ['Secure pipeline union clamping', 'Pressure vessel port locking', 'Mobile transfer hoses']
    },
    {
      id: 'silicone-tri-clamp-gasket',
      name: 'Silicone Tri-Clamp Gasket (FDA Compliant)',
      slug: 'silicone-tri-clamp-gasket',
      category: 'Sanitary Gaskets',
      categorySlug: 'gaskets',
      priorityRank: 13,
      featured: true,
      material: 'Medical & Food Grade Platinum-Cured Silicone',
      finish: 'Translucent / White Smooth Finish',
      roughness: 'Smooth elastomer profile',
      manufacturingType: 'Injection Molded Elastomer',
      standard: 'FDA 21 CFR 177.2600 / USP Class VI',
      connection: 'Fits standard TC ferrules',
      sizes: '1/2" to 4"',
      wallThickness: 'Flanged and Unflanged profiles',
      length: 'Temperature rating: -50°C to +200°C',
      mtc: 'FDA compliance declaration',
      image: createProductSVG('Silicone TC Gasket', 'Gaskets', '#8B5CF6'),
      overview: 'Platinum-cured translucent silicone sanitary gaskets deliver outstanding thermal resilience, low compression set, and zero taste/odor transmission in food and pharma pipelines.',
      applications: ['High temperature beverage processing', 'Pharma sterile transfer', 'Steam-In-Place (SIP) sealing']
    },
    {
      id: 'ss-sms-union',
      name: 'SS SMS Union Complete Set (Nut, Liner, Male & Gasket)',
      slug: 'ss-sms-union',
      category: 'Tri-Clamp Fittings & Components',
      categorySlug: 'tri-clamp',
      priorityRank: 14,
      featured: true,
      material: 'SS 304 / SS 316L',
      finish: 'Polished',
      roughness: 'Ra ≤ 0.8 µm',
      manufacturingType: 'Machined & Forged',
      standard: 'SMS 1145 (Swedish Dairy Standard)',
      connection: 'Weld End / Threaded Nut',
      sizes: '1" to 4" (25 mm to 104 mm)',
      wallThickness: 'To standard',
      length: 'Compact dairy profile',
      mtc: 'Available on request',
      image: createProductSVG('SS SMS Union', 'Fittings', '#10B981'),
      overview: 'Traditional European dairy standard union offering secure threaded union connection for dairy, milk, and beverage processing lines where frequent sanitation and mechanical strength are paramount.',
      applications: ['Milk tankers and silos', 'Pasteurization equipment', 'Dairy plant process manifolds']
    },
    {
      id: 'ss-sanitary-butterfly-valve',
      name: 'SS Sanitary Butterfly Valve (Manual Pull / Multi-Position)',
      slug: 'ss-sanitary-butterfly-valve',
      category: 'Manual Sanitary Valves',
      categorySlug: 'manual-valves',
      priorityRank: 15,
      featured: true,
      material: 'SS 304 / SS 316L Disc & Body',
      finish: 'Mirror Polished (Ra ≤ 0.4 µm Disc)',
      roughness: 'Hygienic mirror disc finish',
      manufacturingType: 'Forged Body, CNC Machined',
      standard: 'DIN / SMS / 3-A Standards',
      connection: 'Tri-Clamp Ends / Weld Ends',
      sizes: '1" to 4" (DN25 - DN100)',
      wallThickness: 'Pressure rating: PN10 (10 Bar)',
      length: 'Compact wafer or clamp body',
      mtc: 'Pressure test & MTC supplied',
      image: createProductSVG('SS Sanitary Butterfly Valve', 'Valves', '#F00078'),
      overview: 'Reliable, compact sanitary butterfly valve featuring a polished stainless steel disc, food-grade EPDM/Silicone seat, and multi-position stainless handle for precise manual on/off flow throttling.',
      applications: ['Fermenter outlet isolation', 'Water treatment distribution', 'Bulk liquid storage tanks']
    },
    {
      id: 'ss-316l-diaphragm-valve',
      name: 'SS 316L Sanitary Diaphragm Valve (Manual Wheel)',
      slug: 'ss-316l-diaphragm-valve',
      category: 'Manual Sanitary Valves',
      categorySlug: 'manual-valves',
      priorityRank: 16,
      featured: true,
      material: 'Forged SS 316L Body',
      finish: 'Electro Polished (Ra ≤ 0.25 - 0.4 µm)',
      roughness: 'Zero dead-leg weir design',
      manufacturingType: 'Precision Forged & CNC Machined',
      standard: 'ASME BPE / DIN',
      connection: 'Tri-Clamp End / Orbitally Weldable End',
      sizes: '1/2" to 3"',
      wallThickness: 'PN10 rated',
      length: 'Standard',
      mtc: 'Full 3.1 MTC & Diaphragm FDA Certificate',
      image: createProductSVG('SS 316L Diaphragm Valve', 'Valves', '#10263D'),
      overview: 'The definitive valve for pharmaceutical and sterile bioprocess applications. Features a hermetic weir design with PTFE/EPDM dual diaphragm isolating process fluid completely from moving valve mechanics.',
      applications: ['Water For Injection (WFI) loop point-of-use', 'Pure steam isolation', 'Aseptic sampling and dosing']
    },
    {
      id: 'ss-3-piece-ball-valve-tc-end',
      name: 'SS 3-Piece Sanitary Ball Valve with TC End',
      slug: 'ss-3-piece-ball-valve-tc-end',
      category: 'Manual Sanitary Valves',
      categorySlug: 'manual-valves',
      priorityRank: 17,
      featured: true,
      material: 'SS 316 / SS 316L',
      finish: 'Hygienic Polished / Cavity Filled Seats',
      roughness: 'Ra ≤ 0.4 µm ball & port',
      manufacturingType: 'Investment Cast & CNC Machined',
      standard: 'ISO 5211 Pad / 3-A',
      connection: 'Tri-Clamp End Connections',
      sizes: '1/2" to 4" Full Bore',
      wallThickness: '1000 WOG rating',
      length: 'Direct mount actuator pad',
      mtc: 'Hydrostatic and air test certified',
      image: createProductSVG('SS 3-Piece Ball Valve', 'Valves', '#F00078'),
      overview: 'Full-bore sanitary ball valve featuring cavity-filled PTFE seats to eliminate stagnant fluid entrapment around the ball sphere. Swing-out three-piece body facilitates quick inline maintenance.',
      applications: ['Viscous food processing', 'Sauce & puree pipelines', 'Brewery brewhouse piping']
    },
    {
      id: 'pneumatic-sanitary-ball-valve',
      name: 'Pneumatic Actuated Sanitary Ball Valve with Limit Switch',
      slug: 'pneumatic-sanitary-ball-valve',
      category: 'Pneumatic & Automated Valves',
      categorySlug: 'pneumatic-valves',
      priorityRank: 18,
      featured: true,
      material: 'SS 316L Valve Body + Anodized Aluminum / SS Actuator',
      finish: 'Hygienic Polish Internal',
      roughness: 'Ra ≤ 0.4 µm',
      manufacturingType: 'Automated Assembly',
      standard: 'NAMUR standard accessory mount',
      connection: 'Tri-Clamp Ends',
      sizes: '1" to 3"',
      wallThickness: 'Air supply: 4 - 8 bar',
      length: 'Spring Return / Double Acting',
      mtc: 'Actuator torque & pressure test report',
      image: createProductSVG('Pneumatic Ball Valve', 'Pneumatic Valves', '#8B5CF6'),
      overview: 'High-speed automated sanitary valve package combining a hygienic full-bore ball valve with a pneumatic rack-and-pinion actuator and visual position feedback for PLC-controlled process plants.',
      applications: ['Automated batching skids', 'PLC controlled CIP systems', 'High-volume beverage bottling']
    },
    {
      id: 'ss-sanitary-sampling-valve',
      name: 'SS Sanitary Aseptic Sampling Valve',
      slug: 'ss-sanitary-sampling-valve',
      category: 'Manual Sanitary Valves',
      categorySlug: 'manual-valves',
      priorityRank: 19,
      featured: true,
      material: 'SS 316L Body & Stem',
      finish: 'Mirror EP Finish',
      roughness: 'Ra ≤ 0.3 µm',
      manufacturingType: 'Micro CNC Machined',
      standard: 'Hygienic Process Sampling Standards',
      connection: '1/2" or 1.5" Tri-Clamp Tank Connection',
      sizes: 'Mini-clamp with barbed outlet',
      wallThickness: 'High pressure rating',
      length: 'Compact',
      mtc: 'Supplied with certification',
      image: 'assets/images/products/valves/ss-sanitary-sampling-valve.svg',
      overview: 'Specially engineered for aseptic extraction of representative liquid samples from sterile bioreactors, fermenters, or piping lines without exposing the system to contamination.',
      applications: ['Microbiological quality sampling', 'Fermenter cell count sampling', 'Dairy product QA lab verification']
    },
    {
      id: 'ss-sanitary-spray-ball',
      name: 'SS Sanitary Rotary & Static Spray Ball',
      slug: 'ss-sanitary-spray-ball',
      category: 'Tank Cleaning Accessories',
      categorySlug: 'tank-cleaning',
      priorityRank: 20,
      featured: true,
      material: 'SS 316L (Cleaning Head & Bearings)',
      finish: 'Mirror Polished',
      roughness: 'Ra ≤ 0.4 µm',
      manufacturingType: 'Precision Machined & Perforated',
      standard: 'CIP Clean-In-Place 360° Coverage',
      connection: 'Tri-Clamp / Pin Clip / Female Thread',
      sizes: '28 mm, 45 mm, 63 mm, 75 mm ball diameter',
      wallThickness: 'Flow rate: 2 to 25 m³/h at 2-3 bar',
      length: 'Compact vessel entry',
      mtc: 'Material test certificate',
      image: 'assets/images/products/accessories/ss-sanitary-spray-ball.svg',
      overview: 'Self-lubricating, fluid-driven 360-degree rotating spray balls delivering high-impact cleaning jet coverage across tank interior walls for automated Clean-In-Place (CIP) cycles.',
      applications: ['Milk storage tanks', 'Pharmaceutical compounding vessels', 'Yeast tanks and brewery fermenters']
    }
  ];

  /* Detailed Industry Profiles */
  const INDUSTRIES = [
    {
      id: 'pharmaceutical',
      slug: 'pharmaceutical',
      name: 'Pharmaceutical Processing',
      icon: '💊',
      summary: 'Ultra-pure SS 316L electro-polished tubing and diaphragm valves for sterile APIs, injectables, and vaccine manufacturing.',
      overview: 'In pharmaceutical manufacturing, contamination control is uncompromising. Lotus Tubes provides SS 316L pipes and fittings with certified interior roughness down to Ra ≤ 0.38 µm, complete with EN 10204 3.1 Material Test Certificates ensuring full metallurgy traceability.',
      products: ['ss-316l-ep-pipe', 'ss-316l-diaphragm-valve', 'ss-sanitary-sampling-valve', 'ss-tri-clamp-ferrule'],
      standards: ['ASME BPE Compliant Finishes', 'FDA 21 CFR 177.2600 Sealing', 'ASTM A270-S2 Standards']
    },
    {
      id: 'biotechnology',
      slug: 'biotechnology',
      name: 'Biotechnology & Sterile Process',
      icon: '🧬',
      summary: 'High-purity hygienic transfer lines for cell culture, fermentation, monoclonal antibodies, and sterile buffer preparation.',
      overview: 'Bioprocessing requires zero-deadleg components to prevent cellular shearing and contamination. Our electro-polished components minimize protein binding and withstand rigorous Clean-In-Place (CIP) and Steam-In-Place (SIP) thermal cycling.',
      products: ['ss-316l-ep-pipe', 'ss-316l-diaphragm-valve', 'silicone-tri-clamp-gasket', 'ss-sanitary-concentric-reducer'],
      standards: ['USP Class VI Elastomers', 'Ra ≤ 0.25 to 0.4 µm Internal', '100% Boroscopic Inspection']
    },
    {
      id: 'dairy',
      slug: 'dairy',
      name: 'Dairy Processing',
      icon: '🥛',
      summary: 'SS 304 and SS 316L pipes, SMS/DIN unions, butterfly valves, and 90° bends engineered for milk, butter, cheese, and yogurt processing.',
      overview: 'Dairy pipelines demand smooth hygienic surfaces that prevent milk stone buildup and bacterial growth. Lotus Tubes supplies extensive stocks of SS 304/316L dairy pipes, SMS unions, and butterfly valves matching Indian and international dairy machinery requirements.',
      products: ['ss-304-ep-pipe', 'ss-sms-union', 'ss-sanitary-butterfly-valve', 'ss-sanitary-90-bend'],
      standards: ['3-A Sanitary Standards', 'SMS 1145 Compatibility', 'BS 4825 Dimensional Accuracy']
    },
    {
      id: 'food-beverage',
      slug: 'food-beverage',
      name: 'Food & Beverage Manufacturing',
      icon: '🥫',
      summary: 'Hygienic piping solutions for sauces, syrups, confectioneries, edible oils, and packaged beverages.',
      overview: 'Food processors require robust corrosion resistance and high-cleanability materials. Our precision stainless fittings and cavity-filled ball valves handle sticky, viscous foods and high-temperature cleaning agents with utmost reliability.',
      products: ['ss-304-mp-pipe', 'ss-3-piece-ball-valve-tc-end', 'ss-sanitary-equal-tee', 'silicone-tri-clamp-gasket'],
      standards: ['FDA Food Contact Compliant', 'Non-toxic, odor-free seals', 'Self-draining geometry']
    },
    {
      id: 'breweries',
      slug: 'breweries',
      name: 'Breweries & Distilleries',
      icon: '🍺',
      summary: 'Complete hygienic piping, Tri-Clamp connections, spray balls, and valves for brewhouses, fermentation cellars, and bottling skids.',
      overview: 'Brewing processes involve live yeast strains and rigorous sanitation. Lotus Tubes supplies full stainless pipelines and rotating CIP spray balls that guarantee complete tank washdown and consistent flavor integrity.',
      products: ['ss-sanitary-spray-ball', 'ss-sanitary-butterfly-valve', 'ss-tri-clamp-clamp', 'ss-sanitary-90-bend'],
      standards: ['CIP pressure rated', 'Heavy-duty 304/316L alloys', 'Hermetic clamp joints']
    },
    {
      id: 'water-treatment',
      slug: 'water-treatment',
      name: 'Ultra-Pure Water & WFI Treatment',
      icon: '💧',
      summary: 'Orbital weldable tubes and fittings for Reverse Osmosis (RO), Water for Injection (WFI), and High-Purity Water loops.',
      overview: 'High-purity water is aggressively hungry for ions. SS 316L electro-polished tubing passivates chromium-rich oxide layers that withstand ultra-pure deionized water without leaching or rouging.',
      products: ['ss-316l-ep-pipe', 'ss-sanitary-concentric-reducer', 'ss-sanitary-eccentric-reducer', 'ss-316l-diaphragm-valve'],
      standards: ['ASTM A269 / A270 Standards', 'Zero rouge formation finish', 'Orbital weld ready tolerances']
    },
    {
      id: 'chemical',
      slug: 'chemical',
      name: 'Specialty Chemical & Cosmetics',
      icon: '⚗️',
      summary: 'Corrosion-resistant SS 316L fittings and valves for cosmetics, fine chemicals, fragrances, and personal care products.',
      overview: 'Handles aggressive surfactants, alcohol solvents, and aromatic compounds. SS 316L with precision elastomer gaskets ensures zero cross-contamination between product production campaigns.',
      products: ['ss-316l-mp-pipe', 'ss-3-piece-ball-valve-tc-end', 'pneumatic-sanitary-ball-valve', 'ss-tri-clamp-ferrule'],
      standards: ['Corrosion resistance standards', 'High-pressure seal integrity', 'Ex-proof automation compatibility']
    }
  ];

  /* Resources & FAQ Data */
  const FAQS = [
    {
      q: 'What is the key difference between Electro Polished (EP) and Mechanical Polished (MP) sanitary pipe?',
      a: 'Mechanical Polishing (MP) uses abrasive belts or compounds to smooth the metal surface down to a mirror or satin finish (typically Ra ≤ 0.8 µm). Electro Polishing (EP) is an electrochemical process that microscopically dissolves peaks, removes embedded iron, enriches chromium on the surface, and achieves Ra ≤ 0.38 µm. EP is widely mandated for sterile pharma and biotech WFI systems, while MP is common in food and dairy processing.'
    },
    {
      q: 'Do you supply EN 10204 3.1 Material Test Certificates (MTC)?',
      a: 'Yes, Lotus Tubes provides EN 10204 3.1 MTCs with heat numbers, chemical composition, tensile/hardness mechanical properties, hydro testing, and surface roughness verification, subject to confirmed order requirements.'
    },
    {
      q: 'What standards do your sanitary pipes and fittings comply with?',
      a: 'Depending on customer requirement, products are supplied adhering to ASTM A270, ASTM A269, BS 4825, DIN 11850, and 3-A sanitary guidelines. We clearly state and confirm compliance based on the specific material grade and order specification.'
    },
    {
      q: 'How fast can I receive an official technical quotation?',
      a: 'Enquiries submitted via our website quotation form or directly through our WhatsApp desk (+91 99304 30789) receive prompt same-day quotation assistance and stock availability confirmation during business hours.'
    },
    {
      q: 'Can you supply custom fabricated spools or drawing-based fittings?',
      a: 'Yes. In addition to our standardized stocks of sanitary pipes, bends, tees, and valves, we accommodate custom length spools, fabricated manifolds, and special end connection adapters based on technical client drawings.'
    }
  ];

  const BLOG_POSTS = [
    {
      slug: 'demystifying-surface-roughness-ra-sanitary-piping',
      title: 'Demystifying Surface Roughness (Ra) in Sanitary Stainless Steel Piping',
      category: 'Technical Standards',
      date: 'October 12, 2026',
      readTime: '5 min read',
      excerpt: 'Why microscopic surface roughness measured in microns (Ra) is the decisive factor preventing bacterial colonization in pharmaceutical water and dairy loops.',
      content: `
        <p>In high-purity process applications across the pharmaceutical, biotechnology, and dairy industries, the physical smoothness of stainless steel tubing is not merely an aesthetic choice—it is a critical biological barrier.</p>
        <h4>What is Ra?</h4>
        <p>Roughness Average (Ra) is the arithmetic average value of surface profile deviations from the center line. In standard industrial piping, roughness values of 1.6 to 3.2 µm are common. However, in hygienic applications, bacteria measuring 0.5 to 2.0 µm can lodge themselves into surface micro-crevices, forming resistant biofilms that survive ordinary sanitization.</p>
        <h4>Why Electro-Polishing (EP) is Superior</h4>
        <p>Electro-polishing chemically removes surface ferrite while smoothing micro-imperfections. This elevates the chromium-to-iron ratio at the contact surface, significantly increasing corrosion resistance and bringing Ra values down to ≤ 0.38 µm (15 µin). For sterile Water For Injection (WFI) lines, ASTM A270-S2 specifications strongly recommend EP tubing.</p>
      `
    },
    {
      slug: 'ss-304-vs-ss-316l-sanitary-selection-guide',
      title: 'SS 304 vs SS 316L: Selecting the Correct Grade for Your Hygienic Process',
      category: 'Material Science',
      date: 'September 28, 2026',
      readTime: '6 min read',
      excerpt: 'A comprehensive chemical composition and cost-performance breakdown between austenitic AISI 304 and molybdenum-bearing 316L.',
      content: `
        <p>Choosing between SS 304 and SS 316L is one of the most critical procurement decisions in process plant engineering. While both are austenitic stainless steels exhibiting excellent corrosion resistance and weldability, their performance in aggressive environments diverges significantly.</p>
        <h4>The Role of Molybdenum</h4>
        <p>SS 316L contains 2.0% to 3.0% Molybdenum and has a reduced carbon threshold (≤ 0.03%), which dramatically improves resistance to pitting and crevice corrosion caused by chloride ions, acids, and sanitizing chemicals like sodium hypochlorite.</p>
        <h4>Application Recommendations</h4>
        <ul>
          <li><strong>Choose SS 304:</strong> For milk, cheese, general food ingredients, beverage water lines, and brewery fermentation where chloride concentrations are low.</li>
          <li><strong>Choose SS 316L:</strong> For active pharmaceutical ingredients (APIs), saline solutions, CIP acid-wash circuits, and marine or humid industrial environments.</li>
        </ul>
      `
    },
    {
      slug: 'tri-clamp-gasket-selection-silicone-epdm-ptfe-viton',
      title: 'Tri-Clamp Gasket Selection: Silicone, EPDM, PTFE or Viton?',
      category: 'Hygienic Sealing',
      date: 'September 15, 2026',
      readTime: '4 min read',
      excerpt: 'How to select the right sanitary gasket elastomer based on temperature, steam cycles, chemical compatibility, and FDA standards.',
      content: `
        <p>The sanitary gasket is the primary elastomeric seal in every Tri-Clamp union. Choosing the incorrect elastomer can lead to joint leaks, gasket degradation, and fluid contamination.</p>
        <h4>Material Comparison:</h4>
        <p><strong>Silicone:</strong> Offers outstanding temperature flexibility (-50°C to 200°C) and minimal taste transfer, but has limited resistance to repeated steam cycles and caustic washes.</p>
        <p><strong>EPDM:</strong> Excellent resistance to hot water, steam, and alkaline CIP washes; ideal for breweries and dairy process plants.</p>
        <p><strong>PTFE (Teflon):</strong> Almost universal chemical inertness and zero absorption; requires precise clamp torque due to its rigid non-elastic nature.</p>
        <p><strong>Viton (FKM):</strong> Superior tolerance against fats, oils, and harsh organic solvents at elevated temperatures.</p>
      `
    }
  ];

  /* --------------------------------------------------------------------------
     3. INTERNAL CRM DEMO SEED DATA (PERSISTED IN LOCALSTORAGE)
     -------------------------------------------------------------------------- */
  const CRM_STORAGE_KEY = 'lotus_tubes_crm_data_v1';

  function getInitialCRMData() {
    return {
      enquiries: [
        {
          id: 'LT-RFQ-2026-001',
          date: '2026-10-18',
          customerName: 'Ramesh Patel',
          company: 'Biocare Pharma Pvt Ltd',
          email: 'purchase@biocarepharma.in',
          phone: '+91 98221 44550',
          location: 'Vapi, Gujarat, India',
          product: 'SS 316L EP Sanitary Pipe',
          grade: 'SS 316L',
          quantity: '300 meters (2" OD x 1.65 mm)',
          source: 'Website Form',
          assignedTo: 'Suresh Mehta (Sales)',
          status: 'Quotation Sent',
          priority: 'High',
          notes: 'Customer requires EN 10204 3.1 MTC and boroscopy report. Urgent requirement for new sterile block.'
        },
        {
          id: 'LT-RFQ-2026-002',
          date: '2026-10-18',
          customerName: 'Heinrich Becker',
          company: 'Bavaria Process Engineering GmbH',
          email: 'becker@bavaria-process.de',
          phone: '+49 89 4512 890',
          location: 'Munich, Germany',
          product: 'SS Sanitary Butterfly Valves & Bends',
          grade: 'SS 316L',
          quantity: '80 pcs 2" Butterfly Valves + 150 Bends',
          source: 'WhatsApp Desk',
          assignedTo: 'Vikram Joshi (Sales)',
          status: 'Negotiation',
          priority: 'High',
          notes: 'Requested CIF Hamburg port pricing. Drawing approved.'
        },
        {
          id: 'LT-RFQ-2026-003',
          date: '2026-10-17',
          customerName: 'Anand Shinde',
          company: 'Sahyadri Milk Cooperative',
          email: 'stores@sahyadridairy.com',
          phone: '+91 98205 11223',
          location: 'Kolhapur, Maharashtra, India',
          product: 'SS SMS Unions & Dairy Pipes',
          grade: 'SS 304',
          quantity: '500 pcs SMS Unions 38 mm + 1200 m pipe',
          source: 'Website Form',
          assignedTo: 'Amit Verma (Sales)',
          status: 'Order Confirmed',
          priority: 'Medium',
          notes: 'PO received. Inventory packing scheduled for Tuesday dispatch.'
        },
        {
          id: 'LT-RFQ-2026-004',
          date: '2026-10-17',
          customerName: 'Tariq Al-Mansoor',
          company: 'Gulf Beverage Bottling Co.',
          email: 'tariq@gulfbev.ae',
          phone: '+971 4 332 9801',
          location: 'Dubai, UAE',
          product: 'SS Tri-Clamp Ferrules & Clamps',
          grade: 'SS 304 / SS 316L',
          quantity: '2500 pcs Assorted TC components',
          source: 'Direct Email',
          assignedTo: 'Suresh Mehta (Sales)',
          status: 'Contacted',
          priority: 'Medium',
          notes: 'Awaiting client response on requested wall thickness (1.6 mm vs 2.0 mm).'
        },
        {
          id: 'LT-RFQ-2026-005',
          date: '2026-10-16',
          customerName: 'Deepak Roy',
          company: 'Kolkata Life Sciences Ltd',
          email: 'droy@kolkatalife.com',
          phone: '+91 94330 67890',
          location: 'Kolkata, West Bengal, India',
          product: 'SS 316L Diaphragm Valves',
          grade: 'SS 316L',
          quantity: '35 pcs 1.5" Diaphragm Valves with TC End',
          source: 'Website Form',
          assignedTo: 'Vikram Joshi (Sales)',
          status: 'New',
          priority: 'High',
          notes: 'Fresh website enquiry. Need to send price quotation with technical datasheet.'
        },
        {
          id: 'LT-RFQ-2026-006',
          date: '2026-10-15',
          customerName: 'Sarah Jenkins',
          company: 'PureFlow Bio Skids Inc.',
          email: 'sjenkins@pureflowbio.com',
          phone: '+1 617 890 2341',
          location: 'Boston, MA, USA',
          product: 'Custom Hygienic Spools & Manifolds',
          grade: 'SS 316L EP',
          quantity: '12 custom fabricated spools',
          source: 'Website Form',
          assignedTo: 'Chirag Shah (Super Admin)',
          status: 'Quotation Sent',
          priority: 'High',
          notes: 'CAD drawing reviewed. Quotation sent with air freight delivery timeline.'
        }
      ],
      customers: [
        {
          id: 'CUST-001',
          name: 'Biocare Pharma Pvt Ltd',
          contactPerson: 'Ramesh Patel',
          email: 'purchase@biocarepharma.in',
          phone: '+91 98221 44550',
          location: 'Vapi, Gujarat',
          industry: 'Pharmaceutical',
          enquiriesCount: 4,
          totalBusiness: '₹ 8,40,000'
        },
        {
          id: 'CUST-002',
          name: 'Bavaria Process Engineering GmbH',
          contactPerson: 'Heinrich Becker',
          email: 'becker@bavaria-process.de',
          phone: '+49 89 4512 890',
          location: 'Munich, Germany',
          industry: 'Industrial Equipment',
          enquiriesCount: 2,
          totalBusiness: '€ 14,200'
        },
        {
          id: 'CUST-003',
          name: 'Sahyadri Milk Cooperative',
          contactPerson: 'Anand Shinde',
          email: 'stores@sahyadridairy.com',
          phone: '+91 98205 11223',
          location: 'Kolhapur, Maharashtra',
          industry: 'Dairy Processing',
          enquiriesCount: 5,
          totalBusiness: '₹ 12,90,000'
        },
        {
          id: 'CUST-004',
          name: 'Gulf Beverage Bottling Co.',
          contactPerson: 'Tariq Al-Mansoor',
          email: 'tariq@gulfbev.ae',
          phone: '+971 4 332 9801',
          location: 'Dubai, UAE',
          industry: 'Beverage & Juice',
          enquiriesCount: 3,
          totalBusiness: 'AED 38,500'
        }
      ],
      quotations: [
        {
          id: 'LT-QT-2026-101',
          date: '2026-10-18',
          customer: 'Biocare Pharma Pvt Ltd',
          items: '300 m SS 316L EP Pipe 2" + 50 Tri-Clamp Ferrules',
          totalEstimate: '₹ 4,32,000',
          validUntil: '2026-11-02',
          status: 'Sent',
          preparedBy: 'Suresh Mehta'
        },
        {
          id: 'LT-QT-2026-102',
          date: '2026-10-18',
          customer: 'Bavaria Process Engineering GmbH',
          items: '80 pcs 2" SS Butterfly Valves + 150 Bends',
          totalEstimate: '€ 11,800',
          validUntil: '2026-11-15',
          status: 'Under Negotiation',
          preparedBy: 'Vikram Joshi'
        },
        {
          id: 'LT-QT-2026-103',
          date: '2026-10-17',
          customer: 'Sahyadri Milk Cooperative',
          items: '500 pcs SMS Unions 38 mm + 1200 m 304 Pipe',
          totalEstimate: '₹ 6,10,000',
          validUntil: '2026-10-31',
          status: 'Approved & Converted',
          preparedBy: 'Amit Verma'
        }
      ],
      tasks: [
        {
          id: 'TSK-001',
          title: 'Send boroscopy certificate & test report to Biocare Pharma',
          assignedTo: 'Ramesh K. (Quality/Inventory)',
          dueDate: '2026-10-19',
          priority: 'High',
          completed: false
        },
        {
          id: 'TSK-002',
          title: 'Follow up on CIF Hamburg pricing with Bavaria Process',
          assignedTo: 'Vikram Joshi (Sales)',
          dueDate: '2026-10-20',
          priority: 'High',
          completed: false
        },
        {
          id: 'TSK-003',
          title: 'Confirm ready stock of 1.5" Diaphragm valves in warehouse',
          assignedTo: 'Kailash (Inventory)',
          dueDate: '2026-10-19',
          priority: 'Medium',
          completed: true
        },
        {
          id: 'TSK-004',
          title: 'Issue proforma invoice for Sahyadri Dairy order dispatch',
          assignedTo: 'Pradeep Shah (Accountant)',
          dueDate: '2026-10-21',
          priority: 'High',
          completed: false
        }
      ],
      employees: [
        /* 3 in Sales, 4 in Accounts, 3 in Inventory as mentioned in client notes */
        { id: 'EMP-01', name: 'Suresh Mehta', role: 'Sales Lead', dept: 'Sales', email: 'suresh@lotustubes.com', phone: '+91 98200 44101', active: true },
        { id: 'EMP-02', name: 'Vikram Joshi', role: 'Export Sales Specialist', dept: 'Sales', email: 'vikram@lotustubes.com', phone: '+91 98200 44102', active: true },
        { id: 'EMP-03', name: 'Amit Verma', role: 'Domestic Sales Executive', dept: 'Sales', email: 'amit@lotustubes.com', phone: '+91 98200 44103', active: true },
        { id: 'EMP-04', name: 'Pradeep Shah', role: 'Senior Accountant', dept: 'Accounts', email: 'accounts@lotustubes.com', phone: '+91 98200 44104', active: true },
        { id: 'EMP-05', name: 'Manish R.', role: 'Billing & GST Compliance', dept: 'Accounts', email: 'gst@lotustubes.com', phone: '+91 98200 44105', active: true },
        { id: 'EMP-06', name: 'Neha Gupta', role: 'Receivables & Ledgers', dept: 'Accounts', email: 'billing@lotustubes.com', phone: '+91 98200 44106', active: true },
        { id: 'EMP-07', name: 'Kavita Dave', role: 'Purchase Accounts', dept: 'Accounts', email: 'purchase.acc@lotustubes.com', phone: '+91 98200 44107', active: true },
        { id: 'EMP-08', name: 'Kailash Patel', role: 'Warehouse & Yard Manager', dept: 'Inventory', email: 'warehouse@lotustubes.com', phone: '+91 98200 44108', active: true },
        { id: 'EMP-09', name: 'Ramesh K.', role: 'Inspection & Dispatch Officer', dept: 'Inventory', email: 'qc@lotustubes.com', phone: '+91 98200 44109', active: true },
        { id: 'EMP-10', name: 'Devendra S.', role: 'Stock Keeper & Logistics', dept: 'Inventory', email: 'stock@lotustubes.com', phone: '+91 98200 44110', active: true }
      ],
      integrations: {
        whatsappStatus: 'Demo Mode (Simulated Active)',
        whatsappPhone: '+91 99304 30789',
        emailSMTP: 'Configured (sales@lotustubes.com)',
        autoEnquiryCapture: true
      }
    };
  }

  function loadCRMData() {
    try {
      const stored = localStorage.getItem(CRM_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('LocalStorage access restricted, utilizing memory seed.', e);
    }
    const initial = getInitialCRMData();
    saveCRMData(initial);
    return initial;
  }

  function saveCRMData(data) {
    try {
      localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }

  let crmData = loadCRMData();

  /* --------------------------------------------------------------------------
     4. APPLICATION STATE & ROUTER
     -------------------------------------------------------------------------- */
  const AppState = {
    currentRoute: 'home',
    routeParam: null,
    catalogueFilter: {
      category: 'all',
      material: 'all',
      finish: 'all',
      search: '',
      sort: 'featured'
    },
    crmSearch: '',
    selectedLanguage: 'en',
    modalOpen: false
  };

  /* Router parser */
  function parseHash(hash) {
    const clean = hash.replace(/^#\/?/, '') || 'home';
    const parts = clean.split('/');
    return {
      section: parts[0] || 'home',
      param: parts[1] || null
    };
  }

  function navigateTo(hash) {
    window.location.hash = hash;
  }

  /* --------------------------------------------------------------------------
     5. VIEW RENDERERS (PUBLIC PAGES)
     -------------------------------------------------------------------------- */

  /* View: Homepage */
  function renderHomeView() {
    return `
      <!-- A. Hero Section (Matching UI-UX Reference Structure) -->
      <section class="hero-section" aria-label="Hero Showcase">
        <div class="site-container">
          <div class="hero-grid">
            
            <div class="hero-content">
              <span class="hero-eyebrow">The Quality Maker</span>
              <h1 class="hero-title">
                Stainless Steel Sanitary Pipes, Fittings &amp; Valves
              </h1>
              <h2 class="hero-subtitle">
                Engineered for Hygienic Process Applications
              </h2>
              <p class="hero-description">
                Explore stainless steel sanitary products in SS 304 and SS 316L, with available surface finishes and configurations suited to pharmaceutical, dairy, food &amp; beverage, and high-purity process industries.
              </p>

              <!-- 4 Feature Badges (Matching Reference Layout) -->
              <div class="hero-badges-grid">
                <div class="hero-badge-item">
                  <span class="hero-badge-icon">💎</span>
                  <div class="hero-badge-label">Premium<br>SS 304 / 316L</div>
                </div>
                <div class="hero-badge-item">
                  <span class="hero-badge-icon">📦</span>
                  <div class="hero-badge-label">Ready<br>Stock Range</div>
                </div>
                <div class="hero-badge-item">
                  <span class="hero-badge-icon">🌐</span>
                  <div class="hero-badge-label">Global &amp; Pan<br>India Supply</div>
                </div>
                <div class="hero-badge-item">
                  <span class="hero-badge-icon">📋</span>
                  <div class="hero-badge-label">MTC &amp; Technical<br>Assistance</div>
                </div>
              </div>

              <!-- Primary CTAs -->
              <div class="hero-actions">
                <a href="#products" class="btn btn--primary btn--lg">
                  <span>Explore Products</span> &rarr;
                </a>
                <a href="#quote" class="btn btn--outline-dark btn--lg">
                  Request a Quote &rarr;
                </a>
                <a href="https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20would%20like%20to%20enquire%20about%20your%20sanitary%20stainless%20steel%20products." target="_blank" rel="noopener noreferrer" class="btn btn--whatsapp btn--lg">
                  <span>🟢 WhatsApp Enquiry</span>
                </a>
              </div>
            </div>

            <!-- Hero Visual Media & Tagline -->
            <div class="hero-media">
              <div class="hero-tagline-float">
                <h3>Hygienic.<br>Reliable.<br>Global.</h3>
                <div class="underline-pink"></div>
              </div>
              <div class="hero-visual-card">
                <img src="assets/images/hero/sanitary-hero-pipes.svg" alt="Polished Stainless Steel Sanitary Pipes and Tri-Clamp Fittings" class="hero-img" onerror="this.onerror=null;this.src=${PRODUCTS[0].image};">
                <div class="hero-spec-pill">
                  <strong>SS 316L EP</strong> &bull; Ra &le; 0.38 &mu;m &bull; ASTM A270 Certified
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- B. Product Range (Image-Led Cards) -->
      <section class="section section--white" id="section-range" aria-label="Our Product Range">
        <div class="site-container">
          <div class="section-header">
            <div>
              <span class="section-eyebrow">Our Product Range</span>
              <h2 class="section-title">Premium Stainless Steel Solutions</h2>
            </div>
            <a href="#products" class="btn btn--outline-dark">View All Products &rarr;</a>
          </div>

          <div class="product-range-grid">
            ${CATEGORIES.map(cat => `
              <article class="range-card">
                <div class="range-card__img-wrap">
                  <img src="${cat.image}" alt="${cat.name}" class="range-card__img" loading="lazy">
                </div>
                <div class="range-card__body">
                  <h3 class="range-card__title">${cat.name}</h3>
                  <p class="range-card__desc">${cat.desc}</p>
                  <div class="range-card__footer">
                    <a href="#category/${cat.slug}" class="range-card__link">
                      View Products <span>&rarr;</span>
                    </a>
                  </div>
                </div>
              </article>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- C. Featured Products (Top Priority B2B Products) -->
      <section class="section" id="section-featured" aria-label="Featured Priority Products">
        <div class="site-container">
          <div class="section-header">
            <div>
              <span class="section-eyebrow">Monopoly &amp; Priority Range</span>
              <h2 class="section-title">Priority Stainless Steel Sanitary Products</h2>
              <p class="section-subtitle">Precision components across SS 304 &amp; SS 316L for high-cleanliness applications.</p>
            </div>
            <a href="#products" class="btn btn--primary">Browse Complete 20+ Catalogue &rarr;</a>
          </div>

          <div class="featured-products-grid">
            ${PRODUCTS.slice(0, 12).map(prod => `
              <article class="product-card">
                <div class="product-card__badge-bar">
                  <span class="badge badge--navy">${prod.material}</span>
                  <span class="badge badge--pink">${prod.finish.split(' ')[0]}</span>
                </div>
                <div class="product-card__img-wrap">
                  <img src="${prod.image}" alt="${prod.name}" class="product-card__img" loading="lazy">
                </div>
                <div class="product-card__body">
                  <span class="product-card__category">${prod.category}</span>
                  <h3 class="product-card__title">
                    <a href="#product/${prod.slug}">${prod.name}</a>
                  </h3>
                  <p class="product-card__specs">
                    <strong>Roughness:</strong> ${prod.roughness || 'Hygienic standard'}<br>
                    <strong>Standard:</strong> ${prod.standard}
                  </p>
                  <div class="product-card__actions">
                    <a href="#product/${prod.slug}" class="btn btn--outline-dark btn--sm">View Details</a>
                    <button type="button" class="btn btn--primary btn--sm quick-rfq-btn" data-product-id="${prod.id}" data-product-name="${prod.name}">Get a Quote</button>
                  </div>
                </div>
              </article>
            `).join('')}
          </div>

          <div class="load-more-container mt-3">
            <a href="#products" class="btn btn--outline-dark btn--lg">
              View All 20+ Industrial Products in Catalogue &rarr;
            </a>
          </div>
        </div>
      </section>

      <!-- D. Industries Served (Image-led Cards with Circular Icons) -->
      <section class="section section--white" id="section-industries" aria-label="Industries We Serve">
        <div class="site-container">
          <div class="section-header">
            <div>
              <span class="section-eyebrow">Industries We Serve</span>
              <h2 class="section-title">Trusted Across Multiple Process Industries</h2>
            </div>
            <a href="#industries" class="btn btn--outline-dark">View All Industries &rarr;</a>
          </div>

          <div class="industries-scroll-grid">
            ${INDUSTRIES.map(ind => `
              <a href="#industry/${ind.slug}" class="industry-chip-card">
                <div class="industry-chip-card__img-wrap">
                  <img src="${createProductSVG(ind.name, 'Industry Application', '#10263D')}" alt="${ind.name}" class="industry-chip-card__img" loading="lazy">
                  <div class="industry-chip-card__icon-bubble">${ind.icon}</div>
                </div>
                <div class="industry-chip-card__body">
                  <h4 class="industry-chip-card__title">${ind.name}</h4>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- E. Why Lotus Tubes (Dark Navy Industrial Section with Line Icons & Video Modal) -->
      <section class="why-section" id="section-why" aria-label="Why Lotus Tubes">
        <div class="site-container">
          <div class="section-header section-header--center">
            <span class="section-eyebrow">Why Choose Lotus Tubes</span>
            <h2 class="section-title">Quality. Stock. Service. Always.</h2>
            <p class="section-subtitle">Dedicated supplier of hygienic stainless steel components, engineered for integrity and traceability.</p>
          </div>

          <div class="why-grid">
            <div class="why-card">
              <div class="why-card__icon">🔬</div>
              <h3 class="why-card__title">Material Integrity</h3>
              <p class="why-card__desc">Complete stock across SS 304 and molybdenum-rich SS 316L, conforming to strict chemical composition thresholds.</p>
            </div>
            <div class="why-card">
              <div class="why-card__icon">⚡</div>
              <h3 class="why-card__title">Finish &amp; Precision</h3>
              <p class="why-card__desc">Available Electro-Polished (EP) with Ra &le; 0.38 &mu;m and Mechanical Polished (MP) finishes tailored for CIP cleanliness.</p>
            </div>
            <div class="why-card">
              <div class="why-card__icon">📑</div>
              <h3 class="why-card__title">Traceability &amp; MTC</h3>
              <p class="why-card__desc">Complete EN 10204 3.1 Material Test Certificates confirming mechanical, chemical, and roughness properties upon request.</p>
            </div>
            <div class="why-card">
              <div class="why-card__icon">📦</div>
              <h3 class="why-card__title">Ready Stock Availability</h3>
              <p class="why-card__desc">Broad domestic stockholding of sanitary bends, tees, clamps, gaskets, and pipes ready for immediate dispatch.</p>
            </div>
            <div class="why-card">
              <div class="why-card__icon">🤝</div>
              <h3 class="why-card__title">Quotation Assistance</h3>
              <p class="why-card__desc">Fast technical response via mail and dedicated WhatsApp Business desk with full BOQ item breakdown.</p>
            </div>
            <div class="why-card">
              <div class="why-card__icon">🌍</div>
              <h3 class="why-card__title">Global Sourcing Support</h3>
              <p class="why-card__desc">Supplying process plants, distributors, and skid fabricators across India, Europe, UAE, USA, and Southeast Asia.</p>
            </div>
          </div>

          <!-- Video Tour Bar (Matching UI Reference) -->
          <div class="why-video-bar">
            <div class="why-video-bar__left">
              <button type="button" class="play-btn-circle" id="open-process-video" aria-label="Play Process Demonstration">
                ▶
              </button>
              <div class="why-video-bar__text">
                <h4>Watch Sourcing &amp; Quality Inspection Overview</h4>
                <p>See our multi-stage electro-polishing verification, surface Ra testing, and packaging protocol.</p>
              </div>
            </div>
            <button type="button" class="btn btn--outline-light" id="open-process-video-btn">
              Explore Quality Demo &rarr;
            </button>
          </div>

        </div>
      </section>

      <!-- F. About Section (2-Column Preview) -->
      <section class="section section--white" id="section-about-preview" aria-label="About Lotus Tubes">
        <div class="site-container">
          <div class="about-preview-grid">
            
            <div class="about-preview-media">
              <img src="assets/images/company/lotus-tubes-facility.svg" alt="Lotus Tubes Office and Warehousing Facility" class="about-preview-img">
              <div class="about-building-overlay">
                <img src="Lotus Tubes Logo.png" alt="Lotus Tubes" class="about-building-logo">
              </div>
            </div>

            <div class="about-preview-content">
              <span class="section-eyebrow">About Lotus Tubes</span>
              <h2 class="section-title">Your Trusted Partner in Stainless Steel Solutions</h2>
              <p>
                Lotus Tubes (a venture of Lotus Impex, Mumbai) is a dedicated supplier and stockist of high-quality stainless steel sanitary pipes, pipe fittings, and valves. Catering to pharmaceutical, dairy, food &amp; beverage, breweries, water treatment, and chemical industries across India and worldwide.
              </p>
              
              <!-- Factual Capabilities & Metrics -->
              <div class="stats-counter-grid">
                <div class="stat-box">
                  <div class="stat-box__number">SS 316L</div>
                  <div class="stat-box__label">High-Purity Pharma Grade</div>
                </div>
                <div class="stat-box">
                  <div class="stat-box__number">EP / MP</div>
                  <div class="stat-box__label">Precision Surface Finishes</div>
                </div>
                <div class="stat-box">
                  <div class="stat-box__number">ASTM</div>
                  <div class="stat-box__label">A270 / A269 Compliance</div>
                </div>
                <div class="stat-box">
                  <div class="stat-box__number">100%</div>
                  <div class="stat-box__label">MTC Traceability Support</div>
                </div>
              </div>

              <a href="#about" class="btn btn--primary btn--lg">
                <span>Know More About Us</span> &rarr;
              </a>
            </div>

          </div>
        </div>
      </section>
    `;
  }

  /* View: Complete Catalogue with Filters */
  function renderProductsView() {
    const filtered = filterProducts();
    return `
      <section class="page-hero">
        <div class="site-container">
          <h1 class="page-hero-title">Stainless Steel Sanitary Product Catalogue</h1>
          <p class="page-hero-subtitle">Comprehensive collection of SS 304 and SS 316L sanitary tubes, bends, tees, Tri-Clamp components, gaskets, and hygienic valves.</p>
        </div>
      </section>

      <div class="site-container catalogue-layout">
        
        <!-- Filter Sidebar -->
        <aside class="filter-sidebar" aria-label="Product Filters">
          <div class="filter-sidebar__header">
            <h3 class="filter-sidebar__title">Filters</h3>
            <button type="button" class="filter-clear-btn" id="filter-reset-btn">Reset All</button>
          </div>

          <!-- Category Filter -->
          <div class="filter-group">
            <label class="filter-group__label">Product Category</label>
            <ul class="filter-option-list">
              <li>
                <label class="custom-checkbox">
                  <input type="radio" name="cat-filter" value="all" ${AppState.catalogueFilter.category === 'all' ? 'checked' : ''}>
                  <span>All Categories (${PRODUCTS.length})</span>
                </label>
              </li>
              ${CATEGORIES.map(cat => {
                const count = PRODUCTS.filter(p => p.categorySlug === cat.slug).length;
                return `
                  <li>
                    <label class="custom-checkbox">
                      <input type="radio" name="cat-filter" value="${cat.slug}" ${AppState.catalogueFilter.category === cat.slug ? 'checked' : ''}>
                      <span>${cat.name} (${count})</span>
                    </label>
                  </li>
                `;
              }).join('')}
            </ul>
          </div>

          <!-- Material Grade Filter -->
          <div class="filter-group">
            <label class="filter-group__label">Material Grade</label>
            <ul class="filter-option-list">
              <li>
                <label class="custom-checkbox">
                  <input type="radio" name="mat-filter" value="all" ${AppState.catalogueFilter.material === 'all' ? 'checked' : ''}>
                  <span>All Grades</span>
                </label>
              </li>
              <li>
                <label class="custom-checkbox">
                  <input type="radio" name="mat-filter" value="SS 316L" ${AppState.catalogueFilter.material === 'SS 316L' ? 'checked' : ''}>
                  <span>SS 316L (Pharma / Biotech)</span>
                </label>
              </li>
              <li>
                <label class="custom-checkbox">
                  <input type="radio" name="mat-filter" value="SS 304" ${AppState.catalogueFilter.material === 'SS 304' ? 'checked' : ''}>
                  <span>SS 304 (Food / Dairy)</span>
                </label>
              </li>
            </ul>
          </div>

          <!-- Surface Finish Filter -->
          <div class="filter-group">
            <label class="filter-group__label">Surface Finish</label>
            <ul class="filter-option-list">
              <li>
                <label class="custom-checkbox">
                  <input type="radio" name="finish-filter" value="all" ${AppState.catalogueFilter.finish === 'all' ? 'checked' : ''}>
                  <span>All Finishes</span>
                </label>
              </li>
              <li>
                <label class="custom-checkbox">
                  <input type="radio" name="finish-filter" value="EP" ${AppState.catalogueFilter.finish === 'EP' ? 'checked' : ''}>
                  <span>Electro Polished (EP)</span>
                </label>
              </li>
              <li>
                <label class="custom-checkbox">
                  <input type="radio" name="finish-filter" value="MP" ${AppState.catalogueFilter.finish === 'MP' ? 'checked' : ''}>
                  <span>Mechanical Polished (MP)</span>
                </label>
              </li>
            </ul>
          </div>

        </aside>

        <!-- Catalogue Main Grid -->
        <div class="catalogue-main">
          
          <div class="catalogue-top-bar">
            <div class="catalogue-search-box">
              <span class="search-icon">🔍</span>
              <input type="text" id="catalogue-search-input" value="${AppState.catalogueFilter.search}" placeholder="Search product name, size, standard...">
            </div>
            
            <div class="catalogue-controls">
              <span class="catalogue-count">Showing <strong>${filtered.length}</strong> products</span>
              <div class="catalogue-sort">
                <select id="catalogue-sort-select">
                  <option value="featured" ${AppState.catalogueFilter.sort === 'featured' ? 'selected' : ''}>Priority Order</option>
                  <option value="name-asc" ${AppState.catalogueFilter.sort === 'name-asc' ? 'selected' : ''}>Name: A to Z</option>
                  <option value="grade" ${AppState.catalogueFilter.sort === 'grade' ? 'selected' : ''}>Grade: SS 316L First</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Product Grid or Empty State -->
          ${filtered.length > 0 ? `
            <div class="featured-products-grid">
              ${filtered.map(prod => `
                <article class="product-card">
                  <div class="product-card__badge-bar">
                    <span class="badge badge--navy">${prod.material}</span>
                    <span class="badge badge--pink">${prod.finish.split(' ')[0]}</span>
                  </div>
                  <div class="product-card__img-wrap">
                    <img src="${prod.image}" alt="${prod.name}" class="product-card__img" loading="lazy">
                  </div>
                  <div class="product-card__body">
                    <span class="product-card__category">${prod.category}</span>
                    <h3 class="product-card__title">
                      <a href="#product/${prod.slug}">${prod.name}</a>
                    </h3>
                    <p class="product-card__specs">
                      <strong>Standard:</strong> ${prod.standard}<br>
                      <strong>Sizes:</strong> ${prod.sizes}
                    </p>
                    <div class="product-card__actions">
                      <a href="#product/${prod.slug}" class="btn btn--outline-dark btn--sm">View Details</a>
                      <button type="button" class="btn btn--primary btn--sm quick-rfq-btn" data-product-id="${prod.id}" data-product-name="${prod.name}">Get Quote</button>
                    </div>
                  </div>
                </article>
              `).join('')}
            </div>
          ` : `
            <div class="empty-state">
              <div class="empty-state__icon">🔍</div>
              <h3 class="empty-state__title">No matching products found</h3>
              <p class="empty-state__desc">We could not find any products matching your specific combination of filters. Try clearing your filters or search keywords.</p>
              <button type="button" class="btn btn--primary" id="empty-clear-filters">Reset All Filters</button>
            </div>
          `}

        </div>

      </div>
    `;
  }

  /* View: Category Details */
  function renderCategoryView(slug) {
    const cat = CATEGORIES.find(c => c.slug === slug) || CATEGORIES[0];
    const catProducts = PRODUCTS.filter(p => p.categorySlug === cat.slug);

    return `
      <section class="page-hero">
        <div class="site-container">
          <span class="badge badge--pink mb-2">Sanitary Category</span>
          <h1 class="page-hero-title">${cat.name}</h1>
          <p class="page-hero-subtitle">${cat.desc}</p>
        </div>
      </section>

      <div class="site-container section">
        
        <div class="section-header">
          <div>
            <h2 class="section-title">Available ${cat.name} Collection</h2>
            <p class="section-subtitle">Engineered to strict hygienic specifications. Contact our Mumbai sales desk to confirm ready size availability.</p>
          </div>
          <a href="#products" class="btn btn--outline-dark">&larr; Back to Full Catalogue</a>
        </div>

        <div class="featured-products-grid">
          ${catProducts.length > 0 ? catProducts.map(prod => `
            <article class="product-card">
              <div class="product-card__badge-bar">
                <span class="badge badge--navy">${prod.material}</span>
                <span class="badge badge--pink">${prod.finish.split(' ')[0]}</span>
              </div>
              <div class="product-card__img-wrap">
                <img src="${prod.image}" alt="${prod.name}" class="product-card__img">
              </div>
              <div class="product-card__body">
                <span class="product-card__category">${prod.category}</span>
                <h3 class="product-card__title">
                  <a href="#product/${prod.slug}">${prod.name}</a>
                </h3>
                <p class="product-card__specs">
                  <strong>Roughness:</strong> ${prod.roughness || 'Hygienic standard'}<br>
                  <strong>Standard:</strong> ${prod.standard}
                </p>
                <div class="product-card__actions">
                  <a href="#product/${prod.slug}" class="btn btn--outline-dark btn--sm">View Details</a>
                  <button type="button" class="btn btn--primary btn--sm quick-rfq-btn" data-product-id="${prod.id}" data-product-name="${prod.name}">Get Quote</button>
                </div>
              </div>
            </article>
          `).join('') : `
            <div class="empty-state" style="grid-column: 1 / -1;">
              <p>Additional items in this category are supplied based on customized drawings. Please contact us to confirm availability.</p>
            </div>
          `}
        </div>

        <!-- Technical Buying Guidance Box -->
        <div class="tech-tabs-section mt-3">
          <div class="tab-headers">
            <button class="tab-btn active">Technical Buying Notes for ${cat.name}</button>
          </div>
          <div class="tab-content-panel active">
            <h4>Important Sourcing Criteria:</h4>
            <p>Customers purchasing hygienic components must ensure their requirements match the designated pipe outside diameter (OD) rather than nominal bore (NB) standard pipes. Furthermore, surface finish Ra tolerances and connection type (Tri-Clamp, SMS Union, or Butt Weld) should be confirmed against process operating pressures.</p>
            <div class="hero-actions mt-2">
              <button type="button" class="btn btn--primary quick-rfq-btn" data-product-id="${cat.slug}" data-product-name="${cat.name}">Enquire for Size &amp; Price</button>
              <a href="https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20have%20an%20enquiry%20regarding%20${encodeURIComponent(cat.name)}" target="_blank" rel="noopener noreferrer" class="btn btn--whatsapp">WhatsApp Direct Enquiry</a>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  /* View: Individual Product Detail */
  function renderProductDetailView(slug) {
    const prod = PRODUCTS.find(p => p.slug === slug) || PRODUCTS[0];
    const related = PRODUCTS.filter(p => p.categorySlug === prod.categorySlug && p.id !== prod.id).slice(0, 4);

    return `
      <div class="site-container product-detail-view">
        <div class="product-detail-grid">
          
          <!-- Left: Gallery & Interactive 360 Concept -->
          <div class="product-gallery-box">
            <div class="product-main-image-wrap">
              <img src="${prod.image}" alt="${prod.name}" class="product-main-img" id="detail-main-img">
              <div class="viewer-360-badge">
                <span>🔄 Interactive 360° View</span>
              </div>
            </div>

            <!-- Conceptual 360 Rotation Slider -->
            <div class="simulated-360-bar">
              <label for="slider-360">Rotate View:</label>
              <input type="range" id="slider-360" min="0" max="360" value="0" aria-label="Simulate 360 degree rotation">
              <span id="angle-display">0°</span>
            </div>

            <div class="gallery-thumbs">
              <div class="gallery-thumb active" data-img-src="${prod.image}">
                <img src="${prod.image}" alt="${prod.name} View 1">
              </div>
              <div class="gallery-thumb" data-img-src="${createProductSVG(prod.name + ' - Bore Detail', 'Internal EP Bore Ra ≤ 0.38µm', '#10263D')}">
                <img src="${createProductSVG(prod.name + ' - Bore Detail', 'Internal EP Bore', '#10263D')}" alt="${prod.name} Internal Finish">
              </div>
              <div class="gallery-thumb" data-img-src="${createProductSVG(prod.name + ' - Cleanroom Packaging', 'Capped & Bagged', '#0284C7')}">
                <img src="${createProductSVG(prod.name + ' - Cleanroom Packaging', 'Capped & Bagged', '#0284C7')}" alt="${prod.name} Packing">
              </div>
            </div>
          </div>

          <!-- Right: Technical Details & Specifications -->
          <div class="product-info-box">
            <span class="product-detail-eyebrow">${prod.category}</span>
            <h1 class="product-detail-title">${prod.name}</h1>
            
            <div class="product-badges-row">
              <span class="badge badge--navy">${prod.material}</span>
              <span class="badge badge--pink">${prod.finish}</span>
              <span class="badge badge--steel">${prod.standard}</span>
              <span class="badge badge--outline">MTC EN 10204 3.1 Available</span>
            </div>

            <p class="product-overview-text">${prod.overview}</p>

            <!-- Specification Table -->
            <div class="spec-table-box">
              <table class="spec-table">
                <tbody>
                  <tr>
                    <th>Material Grade</th>
                    <td><strong>${prod.material}</strong></td>
                  </tr>
                  <tr>
                    <th>Surface Finish</th>
                    <td>${prod.finish} (${prod.roughness || 'Hygienic standard'})</td>
                  </tr>
                  <tr>
                    <th>Manufacturing Type</th>
                    <td>${prod.manufacturingType}</td>
                  </tr>
                  <tr>
                    <th>Outside Diameter (OD)</th>
                    <td>${prod.sizes}</td>
                  </tr>
                  <tr>
                    <th>Wall Thickness</th>
                    <td>${prod.wallThickness}</td>
                  </tr>
                  <tr>
                    <th>Standard Compliance</th>
                    <td>${prod.standard} (Confirmed against actual supply)</td>
                  </tr>
                  <tr>
                    <th>Connection Type</th>
                    <td>${prod.connection}</td>
                  </tr>
                  <tr>
                    <th>Standard Length</th>
                    <td>${prod.length}</td>
                  </tr>
                  <tr>
                    <th>Quality Documentation</th>
                    <td>${prod.mtc}</td>
                  </tr>
                  <tr>
                    <th>Stock &amp; Availability</th>
                    <td>Ready stock in Mumbai / Lead time confirmed upon quotation</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Direct Action Cluster -->
            <div class="product-cta-cluster">
              <button type="button" class="btn btn--primary btn--lg quick-rfq-btn" data-product-id="${prod.id}" data-product-name="${prod.name}">
                <span>Request Official Quotation</span> &rarr;
              </button>
              <a href="https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20need%20a%20price%20quote%20for%3A%20${encodeURIComponent(prod.name)}%20(Grade%3A%20${encodeURIComponent(prod.material)}%2C%20Finish%3A%20${encodeURIComponent(prod.finish)})." target="_blank" rel="noopener noreferrer" class="btn btn--whatsapp btn--lg">
                <span>🟢 Get Price on WhatsApp</span>
              </a>
            </div>

          </div>

        </div>

        <!-- Technical Deep-Dive Tabs -->
        <div class="tech-tabs-section">
          <div class="tab-headers">
            <button class="tab-btn active" data-tab-target="tab-apps">Hygienic Applications</button>
            <button class="tab-btn" data-tab-target="tab-standards">Standards &amp; Quality Compliance</button>
            <button class="tab-btn" data-tab-target="tab-inquiry">Submit Direct RFQ for this Product</button>
          </div>
          
          <div class="tab-content-panel active" id="tab-apps">
            <h4>Recommended Process Applications:</h4>
            <ul style="list-style: disc; padding-left: 20px; line-height: 1.8; margin-top: 10px;">
              ${prod.applications.map(app => `<li>${app}</li>`).join('')}
            </ul>
          </div>

          <div class="tab-content-panel" id="tab-standards">
            <h4>Material Traceability &amp; Standards Integrity:</h4>
            <p>Lotus Tubes adheres to strict sourcing controls. All supplied batches are accompanied by comprehensive chemical composition and mechanical test verification. We do not claim compliance with a particular standard unless the supplied material strictly matches its dimensions, wall tolerances, and surface roughness requirements.</p>
          </div>

          <div class="tab-content-panel" id="tab-inquiry">
            <h4>Quick Specification Enquiry:</h4>
            <p>Need custom sizes, special orbital weld end preps, or specific boroscopy checks? Contact our technical engineering desk at <a href="mailto:${CONFIG.primaryEmail}" class="text-pink"><strong>${CONFIG.primaryEmail}</strong></a> or call <strong>${CONFIG.primaryPhone}</strong>.</p>
          </div>
        </div>

        <!-- Related Products Section -->
        ${related.length > 0 ? `
          <div class="section mt-3">
            <h3 class="section-title mb-2">Related Sanitary Components</h3>
            <div class="featured-products-grid">
              ${related.map(rel => `
                <article class="product-card">
                  <div class="product-card__badge-bar">
                    <span class="badge badge--navy">${rel.material}</span>
                  </div>
                  <div class="product-card__img-wrap">
                    <img src="${rel.image}" alt="${rel.name}" class="product-card__img">
                  </div>
                  <div class="product-card__body">
                    <h4 class="product-card__title">
                      <a href="#product/${rel.slug}">${rel.name}</a>
                    </h4>
                    <p class="product-card__specs">${rel.sizes}</p>
                    <div class="product-card__actions">
                      <a href="#product/${rel.slug}" class="btn btn--outline-dark btn--sm">Details</a>
                      <button type="button" class="btn btn--primary btn--sm quick-rfq-btn" data-product-id="${rel.id}" data-product-name="${rel.name}">Quote</button>
                    </div>
                  </div>
                </article>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    `;
  }

  /* View: Industries List & Detail */
  function renderIndustriesView(slug) {
    if (slug) {
      const ind = INDUSTRIES.find(i => i.slug === slug) || INDUSTRIES[0];
      const indProducts = PRODUCTS.filter(p => ind.products.includes(p.id));

      return `
        <section class="page-hero">
          <div class="site-container">
            <span class="badge badge--pink mb-2">Process Industry Solutions</span>
            <h1 class="page-hero-title">${ind.icon} ${ind.name}</h1>
            <p class="page-hero-subtitle">${ind.summary}</p>
          </div>
        </section>

        <div class="site-container section">
          <div class="about-preview-grid">
            <div>
              <h2 class="section-title">Hygienic Process Demands in ${ind.name}</h2>
              <p style="font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary); margin-top: 14px;">
                ${ind.overview}
              </p>
              
              <h4 class="mt-3 mb-2" style="font-family: var(--font-heading); color: var(--deep-navy);">Industry Compliance Standards:</h4>
              <ul style="list-style: disc; padding-left: 20px; line-height: 1.8; color: var(--text-secondary);">
                ${ind.standards.map(s => `<li><strong>${s}</strong></li>`).join('')}
              </ul>

              <div class="hero-actions mt-3">
                <a href="#quote" class="btn btn--primary">Request Industry Specific RFQ &rarr;</a>
                <a href="#industries" class="btn btn--outline-dark">View All Industries</a>
              </div>
            </div>

            <div>
              <img src="assets/images/industries/${ind.slug}.svg" alt="${ind.name} Installation" style="border-radius: var(--radius-xl); box-shadow: var(--shadow-lg);" onerror="this.onerror=null;this.src='assets/images/hero/sanitary-hero-pipes.svg';">
            </div>
          </div>

          <div class="mt-3">
            <h3 class="section-title mb-2">Recommended Sanitary Components for ${ind.name}</h3>
            <div class="featured-products-grid">
              ${indProducts.map(prod => `
                <article class="product-card">
                  <div class="product-card__badge-bar">
                    <span class="badge badge--navy">${prod.material}</span>
                    <span class="badge badge--pink">${prod.finish.split(' ')[0]}</span>
                  </div>
                  <div class="product-card__img-wrap">
                    <img src="${prod.image}" alt="${prod.name}" class="product-card__img">
                  </div>
                  <div class="product-card__body">
                    <span class="product-card__category">${prod.category}</span>
                    <h3 class="product-card__title">
                      <a href="#product/${prod.slug}">${prod.name}</a>
                    </h3>
                    <p class="product-card__specs">${prod.roughness || prod.standard}</p>
                    <div class="product-card__actions">
                      <a href="#product/${prod.slug}" class="btn btn--outline-dark btn--sm">View Details</a>
                      <button type="button" class="btn btn--primary btn--sm quick-rfq-btn" data-product-id="${prod.id}" data-product-name="${prod.name}">Get Quote</button>
                    </div>
                  </div>
                </article>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    return `
      <section class="page-hero">
        <div class="site-container">
          <h1 class="page-hero-title">Industries We Serve</h1>
          <p class="page-hero-subtitle">Engineering clean, reliable stainless steel sanitary solutions for mission-critical hygienic process lines across the globe.</p>
        </div>
      </section>

      <div class="site-container section">
        <div class="product-range-grid">
          ${INDUSTRIES.map(ind => `
            <article class="range-card">
              <div class="range-card__img-wrap">
                <img src="assets/images/industries/${ind.slug}.svg" alt="${ind.name}" class="range-card__img" loading="lazy" onerror="this.onerror=null;this.src='assets/images/hero/sanitary-hero-pipes.svg';">
              </div>
              <div class="range-card__body">
                <div style="font-size: 2rem; margin-bottom: 8px;">${ind.icon}</div>
                <h3 class="range-card__title">${ind.name}</h3>
                <p class="range-card__desc">${ind.summary}</p>
                <div class="range-card__footer">
                  <a href="#industry/${ind.slug}" class="range-card__link">
                    Explore ${ind.name} &rarr;
                  </a>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* View: About Us */
  function renderAboutView() {
    return `
      <section class="page-hero">
        <div class="site-container">
          <h1 class="page-hero-title">About Lotus Tubes</h1>
          <p class="page-hero-subtitle">Dedicated supplier and distributor of high-purity stainless steel sanitary pipes, fittings, and hygienic valves based in Mumbai, India.</p>
        </div>
      </section>

      <div class="site-container section">
        <div class="about-preview-grid">
          <div>
            <span class="section-eyebrow">Company Profile</span>
            <h2 class="section-title">Commitment to Hygienic Engineering &amp; Global Sourcing</h2>
            <p style="line-height: 1.8; color: var(--text-secondary); margin-top: 16px;">
              Established as a key trading and supply venture under <strong>Lotus Impex</strong> (registered in Mumbai, 2019), <strong>Lotus Tubes</strong> was formed to solve the specialized supply needs of hygienic process equipment makers, skid fabricators, and manufacturing plants across pharmaceutical, dairy, food &amp; beverage, and biotechnology sectors.
            </p>
            <p style="line-height: 1.8; color: var(--text-secondary); margin-top: 14px;">
              Understanding that standard industrial pipe fittings fail to meet sterile Clean-In-Place (CIP) and Steam-In-Place (SIP) conditions, we focus exclusively on sanitary stainless steel components with certified internal smoothness (Ra &le; 0.38 &mu;m), true-roundness tolerances, and verifiable metallurgical test certificates.
            </p>
            
            <div class="stats-counter-grid mt-3">
              <div class="stat-box">
                <div class="stat-box__number">GSTIN</div>
                <div class="stat-box__label">27AIIPS0303A1ZU</div>
              </div>
              <div class="stat-box">
                <div class="stat-box__number">IEC</div>
                <div class="stat-box__label">0316902471</div>
              </div>
              <div class="stat-box">
                <div class="stat-box__number">Mumbai</div>
                <div class="stat-box__label">Girgaon Sourcing Desk</div>
              </div>
              <div class="stat-box">
                <div class="stat-box__number">Global</div>
                <div class="stat-box__label">Export Shipping Support</div>
              </div>
            </div>

            <div class="hero-actions mt-3">
              <a href="#quote" class="btn btn--primary btn--lg">Request Quotation &rarr;</a>
              <a href="#contact" class="btn btn--outline-dark btn--lg">Visit Office / Contact Us</a>
            </div>
          </div>

          <div>
            <img src="${createProductSVG('Lotus Tubes Distribution Headquarters', 'Registered Trade Facility - Mumbai', '#10263D')}" alt="Lotus Tubes Headquarters" style="border-radius: var(--radius-xl); box-shadow: var(--shadow-xl);">
          </div>
        </div>

        <!-- Verified Sourcing Approach Notice -->
        <div class="why-card mt-3" style="background-color: var(--pure-white); border-color: var(--border-color); color: var(--text-main);">
          <h3 style="color: var(--deep-navy); margin-bottom: 8px;">Our Authentic Business Philosophy</h3>
          <p style="color: var(--text-secondary); line-height: 1.6;">
            We operate with complete commercial honesty. Lotus Tubes partners with leading precision drawing mills and certified CNC machining foundries, delivering rigorous batch inspection, full MTC EN 10204 3.1 documentation, and fast responsive order execution through our dedicated sales and accounting teams.
          </p>
        </div>
      </div>
    `;
  }

  /* View: Quality & Documentation */
  function renderQualityView() {
    return `
      <section class="page-hero">
        <div class="site-container">
          <h1 class="page-hero-title">Quality Standards &amp; Documentation</h1>
          <p class="page-hero-subtitle">Surface finish precision, metallurgical compliance, and batch test certification for pharmaceutical and sanitary installations.</p>
        </div>
      </section>

      <div class="site-container section">
        
        <div class="about-preview-grid mb-3">
          <div>
            <span class="section-eyebrow">Quality Philosophy</span>
            <h2 class="section-title">Strict Adherence to Hygienic Standards</h2>
            <p style="line-height: 1.7; color: var(--text-secondary); margin-top: 14px;">
              Sanitary piping systems must prevent microbiological entrapment and withstand intensive CIP/SIP sterilization routines. At Lotus Tubes, all high-purity components are tracked by heat number and verified against recognized international benchmarks.
            </p>
            <div class="why-card mt-2" style="background: var(--pink-subtle); border-color: var(--pink-light); color: var(--deep-navy);">
              <h4 style="margin-bottom: 6px;">Important Compliance Notice:</h4>
              <p style="font-size: 0.9rem; line-height: 1.5;">
                We supply Material Test Certificates (EN 10204 3.1) confirming chemical analysis and mechanical properties. We do not claim compliance with a particular standard unless the supplied product verifiedly meets its requirements.
              </p>
            </div>
          </div>
          <div>
            <div class="spec-table-box">
              <table class="spec-table">
                <thead>
                  <tr>
                    <th>Finish Code</th>
                    <th>Process</th>
                    <th>Typical Ra Roughness</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>EP (Electro Polished)</strong></td>
                    <td>Electrochemical dissolution</td>
                    <td>Ra ≤ 0.38 µm (15 µin) Inside</td>
                  </tr>
                  <tr>
                    <td><strong>MP (Mechanical Polish)</strong></td>
                    <td>Abrasive belt &amp; compound</td>
                    <td>Ra ≤ 0.8 µm (32 µin) Inside</td>
                  </tr>
                  <tr>
                    <td><strong>ASTM A270</strong></td>
                    <td>Sanitary austenitic tube standard</td>
                    <td>Controlled OD &amp; Wall Tolerance</td>
                  </tr>
                  <tr>
                    <td><strong>ASTM A269</strong></td>
                    <td>Seamless &amp; welded SS tube</td>
                    <td>Corrosion resistant process lines</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Technical Document Enquiry Form -->
        <div class="form-card mt-3">
          <div class="section-header" style="margin-bottom: 24px;">
            <div>
              <span class="section-eyebrow">Technical Support</span>
              <h3 class="section-title" style="font-size: 1.6rem;">Request Material Test Certificates or Technical Datasheets</h3>
            </div>
          </div>
          <form id="quality-request-form" novalidate>
            <div class="form-row">
              <div class="form-group">
                <label>Company / Organization <span class="required">*</span></label>
                <input type="text" id="qc-company" required placeholder="e.g. Cipla / Dr. Reddy's Contractor">
              </div>
              <div class="form-group">
                <label>Your Email Address <span class="required">*</span></label>
                <input type="email" id="qc-email" required placeholder="engineer@plant.com">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Product of Interest / Heat No.</label>
                <input type="text" id="qc-product" placeholder="e.g. SS 316L EP Tube 1.5 inch">
              </div>
              <div class="form-group">
                <label>Required Document Type</label>
                <select id="qc-doc-type">
                  <option value="EN 10204 3.1 MTC">EN 10204 3.1 Material Test Certificate</option>
                  <option value="Product Specification Sheet">Product Specification Sheet</option>
                  <option value="Surface Roughness Certificate">Surface Roughness Verification</option>
                  <option value="Complete Product Catalogue PDF">Complete Product Catalogue PDF</option>
                </select>
              </div>
            </div>
            <button type="submit" class="btn btn--primary btn--lg">Submit Technical Request &rarr;</button>
          </form>
        </div>

      </div>
    `;
  }

  /* View: Resources & Datasheets */
  function renderResourcesView() {
    return `
      <section class="page-hero">
        <div class="site-container">
          <h1 class="page-hero-title">Engineering Resources &amp; Downloads</h1>
          <p class="page-hero-subtitle">Download technical catalogues, standard pipe dimensional charts, and review sanitary engineering guides.</p>
        </div>
      </section>

      <div class="site-container section">
        
        <div class="resource-grid mb-3">
          <div class="resource-card">
            <div class="resource-card__icon">📘</div>
            <h3 class="resource-card__title">Complete Product Catalogue</h3>
            <p class="resource-card__desc">Complete specification guide covering SS 304/316L tubes, bends, tees, clamps, ferrules, and valves.</p>
            <a href="javascript:void(0)" class="btn btn--outline-dark btn--sm download-mock-btn" data-doc-name="Lotus-Tubes-Full-Catalogue-2026.pdf">
              📥 Download PDF (Demo)
            </a>
          </div>

          <div class="resource-card">
            <div class="resource-card__icon">📐</div>
            <h3 class="resource-card__title">Sanitary Tube Dimensions Chart</h3>
            <p class="resource-card__desc">Outside diameter (OD), wall thickness gauge comparison, and internal cross-sectional area reference table.</p>
            <a href="javascript:void(0)" class="btn btn--outline-dark btn--sm download-mock-btn" data-doc-name="Sanitary-Tube-OD-Wall-Chart.pdf">
              📥 Download Chart (Demo)
            </a>
          </div>

          <div class="resource-card">
            <div class="resource-card__icon">🔬</div>
            <h3 class="resource-card__title">Surface Roughness (Ra) Guide</h3>
            <p class="resource-card__desc">Microscopic roughness conversion chart comparing Grit numbers, Ra microns, and micro-inches (µin).</p>
            <a href="javascript:void(0)" class="btn btn--outline-dark btn--sm download-mock-btn" data-doc-name="Surface-Roughness-Conversion-Guide.pdf">
              📥 Download Guide (Demo)
            </a>
          </div>
        </div>

        <!-- Interactive FAQ Accordion -->
        <div class="mt-3">
          <div class="section-header section-header--center">
            <span class="section-eyebrow">Frequently Asked Questions</span>
            <h2 class="section-title">Technical &amp; Commercial FAQs</h2>
          </div>

          <div class="faq-accordion">
            ${FAQS.map(faq => `
              <div class="faq-item">
                <button type="button" class="faq-question">
                  <span>${faq.q}</span>
                  <span class="faq-toggle-icon">+</span>
                </button>
                <div class="faq-answer">
                  <p>${faq.a}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  }

  /* View: Technical Blog */
  function renderBlogView(slug) {
    if (slug) {
      const post = BLOG_POSTS.find(p => p.slug === slug) || BLOG_POSTS[0];
      return `
        <section class="page-hero">
          <div class="site-container">
            <span class="badge badge--pink mb-2">${post.category} &bull; ${post.readTime}</span>
            <h1 class="page-hero-title">${post.title}</h1>
            <p class="page-hero-subtitle">Published on ${post.date} by Lotus Tubes Technical Desk</p>
          </div>
        </section>

        <div class="site-container section" style="max-width: 860px;">
          <article class="form-card" style="font-size: 1.05rem; line-height: 1.8; color: var(--text-main);">
            ${post.content}
            <div class="mt-3 pt-3" style="border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
              <a href="#blog" class="btn btn--outline-dark">&larr; Back to All Articles</a>
              <a href="#quote" class="btn btn--primary">Discuss Your Piping Project &rarr;</a>
            </div>
          </article>
        </div>
      `;
    }

    return `
      <section class="page-hero">
        <div class="site-container">
          <h1 class="page-hero-title">Technical Engineering Blog</h1>
          <p class="page-hero-subtitle">Insights into stainless steel metallurgy, sanitary standards, roughness guidelines, and hygienic process engineering.</p>
        </div>
      </section>

      <div class="site-container section">
        <div class="resource-grid">
          ${BLOG_POSTS.map(post => `
            <article class="range-card">
              <div class="range-card__img-wrap">
                <img src="${createProductSVG(post.title, post.category, '#10263D')}" alt="${post.title}" class="range-card__img">
              </div>
              <div class="range-card__body">
                <div style="font-size: 0.75rem; font-weight: 700; color: var(--primary-pink); text-transform: uppercase; margin-bottom: 6px;">
                  ${post.category} &bull; ${post.readTime}
                </div>
                <h3 class="range-card__title">
                  <a href="#blog/${post.slug}">${post.title}</a>
                </h3>
                <p class="range-card__desc">${post.excerpt}</p>
                <div class="range-card__footer">
                  <a href="#blog/${post.slug}" class="range-card__link">
                    Read Article <span>&rarr;</span>
                  </a>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* View: Contact Us */
  function renderContactView() {
    return `
      <section class="page-hero">
        <div class="site-container">
          <h1 class="page-hero-title">Contact Lotus Tubes</h1>
          <p class="page-hero-subtitle">Connect with our Mumbai sales and technical sourcing desk for product availability, quotations, and export inquiries.</p>
        </div>
      </section>

      <div class="site-container section">
        <div class="about-preview-grid">
          
          <!-- Contact Info -->
          <div>
            <span class="section-eyebrow">Direct Touchpoints</span>
            <h2 class="section-title">Reach Our Supply Desk</h2>
            <p style="color: var(--text-secondary); line-height: 1.7; margin-top: 14px;">
              Whether you require 10 meters of specialized electro-polished tubing or full container-load shipments of sanitary valves and fittings, our team provides quick quotations and technical clarity.
            </p>

            <div class="mt-3">
              <div class="contact-line" style="font-size: 1rem; margin-bottom: 18px;">
                <strong>📍 Registered Office &amp; Trade Address:</strong><br>
                ${CONFIG.officeAddress}
              </div>
              <div class="contact-line" style="font-size: 1rem; margin-bottom: 18px;">
                <strong>📞 Direct Phone:</strong> <a href="tel:${CONFIG.primaryPhone}" class="text-pink"><strong>${CONFIG.primaryPhone}</strong></a><br>
                <small style="color: var(--text-muted);">80% Call Response Rate during operating hours</small>
              </div>
              <div class="contact-line" style="font-size: 1rem; margin-bottom: 18px;">
                <strong>✉️ Sales Email:</strong> <a href="mailto:${CONFIG.primaryEmail}" class="text-pink"><strong>${CONFIG.primaryEmail}</strong></a>
              </div>
              <div class="contact-line" style="font-size: 1rem; margin-bottom: 18px;">
                <strong>🏢 Tax Identifiers:</strong><br>
                GSTIN: <strong>${CONFIG.gstin}</strong> &bull; IEC: <strong>${CONFIG.iec}</strong>
              </div>
            </div>

            <div class="mt-3">
              <a href="https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20am%20contacting%20you%20from%20your%20website%20contact%20page." target="_blank" rel="noopener noreferrer" class="btn btn--whatsapp btn--lg">
                <span>🟢 Direct WhatsApp Desk</span>
              </a>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="form-card">
            <h3 style="font-family: var(--font-heading); color: var(--deep-navy); margin-bottom: 16px;">Send Us a Message</h3>
            <form id="public-contact-form" novalidate>
              <div class="form-group">
                <label for="contact-name">Full Name <span class="required">*</span></label>
                <input type="text" id="contact-name" required placeholder="Your full name">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="contact-email">Email Address <span class="required">*</span></label>
                  <input type="email" id="contact-email" required placeholder="name@company.com">
                </div>
                <div class="form-group">
                  <label for="contact-phone">Phone Number <span class="required">*</span></label>
                  <input type="tel" id="contact-phone" required placeholder="+91 99999 99999">
                </div>
              </div>
              <div class="form-group">
                <label for="contact-subject">Inquiry Subject</label>
                <select id="contact-subject">
                  <option value="Quotation Request">Product Quotation Request</option>
                  <option value="Technical Documentation">Technical Specification / MTC Query</option>
                  <option value="Export Inquiry">Export Sourcing Inquiry</option>
                  <option value="Vendor Registration">Vendor Registration / Supply Partner</option>
                </select>
              </div>
              <div class="form-group">
                <label for="contact-message">Requirements &amp; Quantities <span class="required">*</span></label>
                <textarea id="contact-message" rows="4" required placeholder="Specify sizes, quantities, delivery destination..."></textarea>
              </div>
              <button type="submit" class="btn btn--primary btn--block btn--lg">Send Message &rarr;</button>
            </form>
          </div>

        </div>
      </div>
    `;
  }

  /* View: Full Quotation Request Page */
  function renderQuoteView() {
    return `
      <section class="page-hero">
        <div class="site-container">
          <h1 class="page-hero-title">Request a Comprehensive Quotation</h1>
          <p class="page-hero-subtitle">Submit your exact product requirements, quantities, material grades, or attach your Bill of Quantities (BOQ).</p>
        </div>
      </section>

      <div class="site-container section" style="max-width: 960px;">
        <div class="form-card">
          <div class="section-header" style="margin-bottom: 24px;">
            <div>
              <span class="section-eyebrow">Quick RFQ System</span>
              <h2 class="section-title" style="font-size: 1.8rem;">Bill of Quantities (BOQ) &amp; RFQ Submission</h2>
              <p class="section-subtitle">Our sales estimators respond within 2 to 4 business hours.</p>
            </div>
          </div>

          <form id="full-rfq-form" novalidate>
            <h4 style="font-family: var(--font-heading); color: var(--deep-navy); margin-bottom: 12px; border-bottom: 1.5px solid var(--border-color); padding-bottom: 6px;">
              1. Customer &amp; Business Information
            </h4>
            <div class="form-row">
              <div class="form-group">
                <label for="rfq-name">Your Full Name <span class="required">*</span></label>
                <input type="text" id="rfq-name" required placeholder="e.g. Chirag Shah">
              </div>
              <div class="form-group">
                <label for="rfq-company">Company / Factory Name <span class="required">*</span></label>
                <input type="text" id="rfq-company" required placeholder="e.g. BioPharma Projects Pvt Ltd">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="rfq-email">Business Email <span class="required">*</span></label>
                <input type="email" id="rfq-email" required placeholder="procurement@company.com">
              </div>
              <div class="form-group">
                <label for="rfq-phone">Phone / WhatsApp <span class="required">*</span></label>
                <input type="tel" id="rfq-phone" required placeholder="+91 98200 12345">
              </div>
            </div>

            <h4 style="font-family: var(--font-heading); color: var(--deep-navy); margin-top: 24px; margin-bottom: 12px; border-bottom: 1.5px solid var(--border-color); padding-bottom: 6px;">
              2. Technical &amp; Order Requirements
            </h4>
            
            <div class="form-row">
              <div class="form-group">
                <label for="rfq-category">Primary Product Interest</label>
                <select id="rfq-category">
                  <option value="Sanitary Pipes & Tubes">Sanitary Pipes &amp; Tubes (EP / MP)</option>
                  <option value="Sanitary Pipe Fittings">Sanitary Pipe Fittings (Bends, Tees, Reducers)</option>
                  <option value="Tri-Clamp Components">Tri-Clamp Ferrules, Clamps &amp; Unions</option>
                  <option value="Sanitary Valves">Manual &amp; Pneumatic Sanitary Valves</option>
                  <option value="Complete Process Line / BOQ">Complete Process Package / Mixed BOQ</option>
                </select>
              </div>
              <div class="form-group">
                <label for="rfq-material">Material Grade</label>
                <select id="rfq-material">
                  <option value="SS 316L">SS 316L (Pharma / High Purity)</option>
                  <option value="SS 304">SS 304 (Dairy / Food Grade)</option>
                  <option value="Both / Need Recommendation">Both / Need Engineering Recommendation</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="rfq-quantity">Estimated Quantities / Sizes <span class="required">*</span></label>
                <input type="text" id="rfq-quantity" required placeholder="e.g. 200m 1.5 inch tube + 40 Bends">
              </div>
              <div class="form-group">
                <label for="rfq-destination">Delivery City &amp; Country <span class="required">*</span></label>
                <input type="text" id="rfq-destination" required placeholder="e.g. Vapi, Gujarat or Dubai, UAE">
              </div>
            </div>

            <div class="form-group">
              <label for="rfq-specs">Detailed Specifications, Finish (EP/MP), Standards, or Remarks</label>
              <textarea id="rfq-specs" rows="4" placeholder="Detail any specific outside diameter, wall gauge, standard (ASTM A270), or delivery deadline..."></textarea>
            </div>

            <div class="form-group file-upload-group">
              <label for="rfq-file">Upload BOQ, Excel Sheet or Drawing (Optional Prototype)</label>
              <div class="file-drop-zone">
                <input type="file" id="rfq-file" accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.jpg,.png">
                <div class="file-drop-message">
                  <span class="upload-icon">📄</span>
                  <span>Click or drag and drop your procurement list (PDF, Excel, DWG)</span>
                </div>
              </div>
              <span class="file-name-preview" id="rfq-file-name"></span>
            </div>

            <div class="form-actions mt-3">
              <button type="submit" class="btn btn--primary btn--block btn--lg">
                <span>Submit Quotation Request</span> &rarr;
              </button>
            </div>
          </form>

          <div id="full-rfq-success" class="form-success-box mt-3" style="display: none;">
            <div class="success-icon">✓</div>
            <h3>Quotation Request Successfully Logged!</h3>
            <p>Your reference code: <strong id="rfq-success-code">LT-RFQ-2026-0000</strong></p>
            <p>A copy has been recorded in our local CRM demonstration workflow. Our estimators will contact you via WhatsApp and email with pricing details.</p>
            <div class="success-actions mt-2">
              <a href="#crm/enquiries" class="btn btn--outline-dark">Inspect In Internal CRM Demo &rarr;</a>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     6. VIEW RENDERERS (INTERNAL CRM PROTOTYPE)
     -------------------------------------------------------------------------- */

  /* View: CRM Login Screen */
  function renderCRMLoginView() {
    return `
      <div style="min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 40px 20px;">
        <div class="form-card" style="max-width: 460px; width: 100%;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="Lotus Tubes Logo.png" alt="Lotus Tubes" style="height: 48px; margin: 0 auto 12px; filter: drop-shadow(0 1px 2px rgba(16, 38, 61, 0.4));">
            <h2 style="font-family: var(--font-heading); color: var(--deep-navy); font-size: 1.5rem;">Internal Sales &amp; CRM Portal</h2>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">Super Admin &amp; Staff Demonstration Access</p>
          </div>

          <div class="why-card mb-3" style="padding: 12px; background: #DCFCE7; border-color: #86EFAC; color: #166534; font-size: 0.82rem;">
            <strong>Demo Credentials Pre-Filled:</strong><br>
            Super Admin: <code>admin@lotustubes.com</code> / <code>lotus2026</code>
          </div>

          <form id="crm-login-form" novalidate>
            <div class="form-group">
              <label for="crm-email">Staff Email Address</label>
              <input type="email" id="crm-email" value="admin@lotustubes.com" required>
            </div>
            <div class="form-group">
              <label for="crm-password">Password</label>
              <input type="password" id="crm-password" value="lotus2026" required>
            </div>
            
            <button type="submit" class="btn btn--primary btn--block btn--lg">
              Enter Super Admin Dashboard &rarr;
            </button>
            <a href="#home" class="btn btn--outline-dark btn--block mt-2">
              &larr; Return to Public Website
            </a>
          </form>

          <p style="text-align: center; font-size: 0.75rem; color: var(--text-muted); margin-top: 20px;">
            Frontend prototype only. Demonstrates operational workflow, enquiry tracking, and quotations without live server authentication.
          </p>
        </div>
      </div>
    `;
  }

  /* View: CRM Dashboard */
  function renderCRMDashboardView() {
    const totalEnquiries = crmData.enquiries.length;
    const newEnquiries = crmData.enquiries.filter(e => e.status === 'New').length;
    const quoted = crmData.enquiries.filter(e => e.status === 'Quotation Sent').length;
    const confirmed = crmData.enquiries.filter(e => e.status === 'Order Confirmed').length;
    const negotiation = crmData.enquiries.filter(e => e.status === 'Negotiation').length;
    const tasksDue = crmData.tasks.filter(t => !t.completed).length;

    return `
      <!-- KPI Cards Grid -->
      <div class="crm-kpi-grid">
        <div class="crm-kpi-card">
          <div class="crm-kpi-header">
            <span class="crm-kpi-label">Total Enquiries</span>
            <span class="crm-kpi-icon">📥</span>
          </div>
          <div class="crm-kpi-value">${totalEnquiries}</div>
          <div class="crm-kpi-sub up">↑ +18% this month</div>
        </div>

        <div class="crm-kpi-card">
          <div class="crm-kpi-header">
            <span class="crm-kpi-label">New &amp; Unassigned</span>
            <span class="crm-kpi-icon">⚡</span>
          </div>
          <div class="crm-kpi-value" style="color: var(--primary-pink);">${newEnquiries}</div>
          <div class="crm-kpi-sub">Requires same-day RFQ</div>
        </div>

        <div class="crm-kpi-card">
          <div class="crm-kpi-header">
            <span class="crm-kpi-label">Quotations Active</span>
            <span class="crm-kpi-icon">📑</span>
          </div>
          <div class="crm-kpi-value">${quoted}</div>
          <div class="crm-kpi-sub">₹ 14.8 Lakh pipeline</div>
        </div>

        <div class="crm-kpi-card">
          <div class="crm-kpi-header">
            <span class="crm-kpi-label">In Negotiation</span>
            <span class="crm-kpi-icon">🤝</span>
          </div>
          <div class="crm-kpi-value">${negotiation}</div>
          <div class="crm-kpi-sub">High conversion probability</div>
        </div>

        <div class="crm-kpi-card">
          <div class="crm-kpi-header">
            <span class="crm-kpi-label">Orders Confirmed</span>
            <span class="crm-kpi-icon">✅</span>
          </div>
          <div class="crm-kpi-value" style="color: #10B981;">${confirmed}</div>
          <div class="crm-kpi-sub up">Dispatches scheduled</div>
        </div>

        <div class="crm-kpi-card">
          <div class="crm-kpi-header">
            <span class="crm-kpi-label">Pending Tasks</span>
            <span class="crm-kpi-icon">⏱️</span>
          </div>
          <div class="crm-kpi-value" style="color: #EF4444;">${tasksDue}</div>
          <div class="crm-kpi-sub">Follow-ups due today</div>
        </div>
      </div>

      <!-- Two Column Layout: Enquiry Trends & Lead Status -->
      <div class="crm-dashboard-split">
        
        <!-- Enquiry Trend Chart (Clean Pure SVG Bar Visualization) -->
        <div class="crm-panel">
          <div class="crm-panel__header">
            <h3 class="crm-panel__title">Enquiry Volume &amp; RFQ Trends (2026)</h3>
            <span class="badge badge--pink">Domestic &amp; Export</span>
          </div>
          <div style="padding: 24px;">
            <svg viewBox="0 0 540 180" style="width: 100%; height: auto;">
              <!-- Grid lines -->
              <line x1="40" y1="30" x2="520" y2="30" stroke="#E2E8F0" stroke-dasharray="3,3"/>
              <line x1="40" y1="70" x2="520" y2="70" stroke="#E2E8F0" stroke-dasharray="3,3"/>
              <line x1="40" y1="110" x2="520" y2="110" stroke="#E2E8F0" stroke-dasharray="3,3"/>
              <line x1="40" y1="150" x2="520" y2="150" stroke="#CBD5E1"/>

              <!-- Month Bars -->
              <!-- May -->
              <rect x="70" y="85" width="30" height="65" rx="4" fill="#10263D"/>
              <text x="85" y="168" font-size="11" fill="#64748B" text-anchor="middle">May</text>
              <text x="85" y="78" font-size="10" font-weight="bold" fill="#10263D" text-anchor="middle">24</text>

              <!-- Jun -->
              <rect x="145" y="70" width="30" height="80" rx="4" fill="#10263D"/>
              <text x="160" y="168" font-size="11" fill="#64748B" text-anchor="middle">Jun</text>
              <text x="160" y="63" font-size="10" font-weight="bold" fill="#10263D" text-anchor="middle">32</text>

              <!-- Jul -->
              <rect x="220" y="55" width="30" height="95" rx="4" fill="#10263D"/>
              <text x="235" y="168" font-size="11" fill="#64748B" text-anchor="middle">Jul</text>
              <text x="235" y="48" font-size="10" font-weight="bold" fill="#10263D" text-anchor="middle">38</text>

              <!-- Aug -->
              <rect x="295" y="45" width="30" height="105" rx="4" fill="#10263D"/>
              <text x="310" y="168" font-size="11" fill="#64748B" text-anchor="middle">Aug</text>
              <text x="310" y="38" font-size="10" font-weight="bold" fill="#10263D" text-anchor="middle">44</text>

              <!-- Sep -->
              <rect x="370" y="35" width="30" height="115" rx="4" fill="#10263D"/>
              <text x="385" y="168" font-size="11" fill="#64748B" text-anchor="middle">Sep</text>
              <text x="385" y="28" font-size="10" font-weight="bold" fill="#10263D" text-anchor="middle">51</text>

              <!-- Oct (Current) -->
              <rect x="445" y="20" width="30" height="130" rx="4" fill="#F00078"/>
              <text x="460" y="168" font-size="11" font-weight="bold" fill="#F00078" text-anchor="middle">Oct</text>
              <text x="460" y="14" font-size="11" font-weight="bold" fill="#F00078" text-anchor="middle">58</text>
            </svg>
            <div style="font-size: 0.8rem; color: var(--text-secondary); text-align: right; margin-top: 8px;">
              * Showing RFQs captured through Website, WhatsApp &amp; Direct Sourcing
            </div>
          </div>
        </div>

        <!-- Lead Status Distribution Panel -->
        <div class="crm-panel">
          <div class="crm-panel__header">
            <h3 class="crm-panel__title">Pipeline Breakdown</h3>
          </div>
          <div style="padding: 20px;">
            <ul style="display: flex; flex-direction: column; gap: 10px;">
              <li style="display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem;">
                <span class="status-pill status-pill--new">New Inquiries</span>
                <strong>${newEnquiries}</strong>
              </li>
              <li style="display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem;">
                <span class="status-pill status-pill--contacted">Contacted</span>
                <strong>${crmData.enquiries.filter(e => e.status === 'Contacted').length}</strong>
              </li>
              <li style="display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem;">
                <span class="status-pill status-pill--quoted">Quotation Sent</span>
                <strong>${quoted}</strong>
              </li>
              <li style="display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem;">
                <span class="status-pill status-pill--negotiation">Negotiation</span>
                <strong>${negotiation}</strong>
              </li>
              <li style="display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem;">
                <span class="status-pill status-pill--confirmed">Order Confirmed</span>
                <strong>${confirmed}</strong>
              </li>
            </ul>
            <div class="mt-3">
              <a href="#crm/enquiries" class="btn btn--outline-dark btn--sm btn--block">Manage Full Enquiries &rarr;</a>
            </div>
          </div>
        </div>

      </div>

      <!-- Recent Enquiries Table -->
      <div class="crm-panel">
        <div class="crm-panel__header">
          <h3 class="crm-panel__title">Recent Incoming Enquiries</h3>
          <a href="#crm/enquiries" class="btn btn--outline-dark btn--sm">View All &rarr;</a>
        </div>
        <div class="crm-table-wrap">
          <table class="crm-table">
            <thead>
              <tr>
                <th>Enquiry ID</th>
                <th>Date</th>
                <th>Customer / Company</th>
                <th>Product / Specifications</th>
                <th>Assigned Staff</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${crmData.enquiries.slice(0, 5).map(e => `
                <tr>
                  <td><strong>${e.id}</strong></td>
                  <td>${e.date}</td>
                  <td>
                    <strong>${e.customerName}</strong><br>
                    <small style="color: var(--text-secondary);">${e.company} (${e.location})</small>
                  </td>
                  <td>
                    <span>${e.product}</span><br>
                    <small style="color: var(--primary-pink);">${e.quantity}</small>
                  </td>
                  <td>${e.assignedTo}</td>
                  <td><span class="priority-badge priority--${e.priority.toLowerCase()}">${e.priority}</span></td>
                  <td>${renderStatusPill(e.status)}</td>
                  <td>
                    <button type="button" class="btn btn--outline-dark btn--sm view-enquiry-btn" data-enquiry-id="${e.id}">View</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /* Helper for Status Pill markup */
  function renderStatusPill(status) {
    const slugMap = {
      'New': 'new',
      'Contacted': 'contacted',
      'Quotation Sent': 'quoted',
      'Follow-up': 'followup',
      'Negotiation': 'negotiation',
      'Order Confirmed': 'confirmed',
      'Lost': 'lost',
      'On Hold': 'onhold'
    };
    const slug = slugMap[status] || 'new';
    return `<span class="status-pill status-pill--${slug}">${status}</span>`;
  }

  /* View: CRM Enquiries Manager */
  function renderCRMEnquiriesView() {
    const filterTerm = AppState.crmSearch.toLowerCase();
    const list = crmData.enquiries.filter(e => 
      e.id.toLowerCase().includes(filterTerm) ||
      e.customerName.toLowerCase().includes(filterTerm) ||
      e.company.toLowerCase().includes(filterTerm) ||
      e.product.toLowerCase().includes(filterTerm)
    );

    return `
      <div class="crm-panel">
        <div class="crm-panel__header">
          <div>
            <h3 class="crm-panel__title">Enquiry &amp; RFQ Management</h3>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 2px;">
              Track all website form submissions, WhatsApp enquiries, and quotations.
            </p>
          </div>
          <div class="crm-panel__controls">
            <button type="button" class="btn btn--primary btn--sm" id="crm-add-enquiry-modal-btn">
              + Add Manual RFQ
            </button>
          </div>
        </div>

        <div class="crm-table-wrap">
          <table class="crm-table">
            <thead>
              <tr>
                <th>Enquiry ID</th>
                <th>Date</th>
                <th>Customer &amp; Contact</th>
                <th>Product &amp; Qty</th>
                <th>Assigned Staff</th>
                <th>Status (Click to Change)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${list.length > 0 ? list.map(e => `
                <tr>
                  <td><strong>${e.id}</strong></td>
                  <td>${e.date}</td>
                  <td>
                    <strong>${e.customerName}</strong> &bull; ${e.company}<br>
                    <small style="color: var(--text-secondary);">${e.phone} &bull; ${e.email}</small>
                  </td>
                  <td>
                    <strong>${e.product}</strong><br>
                    <small style="color: var(--primary-pink);">${e.quantity} (${e.grade})</small>
                  </td>
                  <td>${e.assignedTo}</td>
                  <td>
                    <select class="crm-status-changer" data-enquiry-id="${e.id}" style="padding: 4px 8px; border-radius: 4px; font-size: 0.78rem; font-weight: 700; background: var(--bg-light); border: 1px solid var(--border-color); cursor: pointer;">
                      <option value="New" ${e.status === 'New' ? 'selected' : ''}>New</option>
                      <option value="Contacted" ${e.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                      <option value="Quotation Sent" ${e.status === 'Quotation Sent' ? 'selected' : ''}>Quotation Sent</option>
                      <option value="Follow-up" ${e.status === 'Follow-up' ? 'selected' : ''}>Follow-up</option>
                      <option value="Negotiation" ${e.status === 'Negotiation' ? 'selected' : ''}>Negotiation</option>
                      <option value="Order Confirmed" ${e.status === 'Order Confirmed' ? 'selected' : ''}>Order Confirmed</option>
                      <option value="Lost" ${e.status === 'Lost' ? 'selected' : ''}>Lost</option>
                      <option value="On Hold" ${e.status === 'On Hold' ? 'selected' : ''}>On Hold</option>
                    </select>
                  </td>
                  <td>
                    <div style="display: flex; gap: 6px;">
                      <button type="button" class="btn btn--outline-dark btn--sm view-enquiry-btn" data-enquiry-id="${e.id}">Details</button>
                      <button type="button" class="btn btn--outline-dark btn--sm crm-create-quote-btn" data-enquiry-id="${e.id}">+ Quote</button>
                    </div>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    No enquiries match the current filter criteria.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /* View: CRM Customers */
  function renderCRMCustomersView() {
    return `
      <div class="crm-panel">
        <div class="crm-panel__header">
          <h3 class="crm-panel__title">Customer Accounts &amp; Industrial Clients</h3>
          <span class="badge badge--navy">${crmData.customers.length} Accounts Active</span>
        </div>
        <div class="crm-table-wrap">
          <table class="crm-table">
            <thead>
              <tr>
                <th>Account ID</th>
                <th>Company Name</th>
                <th>Contact Person</th>
                <th>Location</th>
                <th>Industry Sector</th>
                <th>Enquiries Count</th>
                <th>Total Business</th>
              </tr>
            </thead>
            <tbody>
              ${crmData.customers.map(c => `
                <tr>
                  <td><strong>${c.id}</strong></td>
                  <td><strong>${c.name}</strong></td>
                  <td>
                    ${c.contactPerson}<br>
                    <small style="color: var(--text-secondary);">${c.phone}</small>
                  </td>
                  <td>${c.location}</td>
                  <td><span class="badge badge--steel">${c.industry}</span></td>
                  <td>${c.enquiriesCount} RFQs</td>
                  <td><strong style="color: var(--primary-pink);">${c.totalBusiness}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /* View: CRM Quotations */
  function renderCRMQuotationsView() {
    return `
      <div class="crm-panel">
        <div class="crm-panel__header">
          <h3 class="crm-panel__title">Quotation Management (Demonstration Pricing)</h3>
          <span class="badge badge--pink">Active RFQ Pipeline</span>
        </div>
        <div class="crm-table-wrap">
          <table class="crm-table">
            <thead>
              <tr>
                <th>Quote Number</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items &amp; Scope</th>
                <th>Demonstration Amount</th>
                <th>Validity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${crmData.quotations.map(q => `
                <tr>
                  <td><strong>${q.id}</strong></td>
                  <td>${q.date}</td>
                  <td><strong>${q.customer}</strong></td>
                  <td>${q.items}</td>
                  <td><strong style="color: var(--deep-navy);">${q.totalEstimate}</strong></td>
                  <td>${q.validUntil}</td>
                  <td><span class="badge badge--navy">${q.status}</span></td>
                  <td>
                    <button type="button" class="btn btn--outline-dark btn--sm preview-quote-btn" data-quote-id="${q.id}">Preview / Print</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /* View: CRM Tasks */
  function renderCRMTasksView() {
    return `
      <div class="crm-panel">
        <div class="crm-panel__header">
          <h3 class="crm-panel__title">Tasks &amp; Follow-up Schedule</h3>
          <span class="badge badge--navy">Staff Responsibilities</span>
        </div>
        <div class="crm-table-wrap">
          <table class="crm-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Task Description</th>
                <th>Assigned Employee</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${crmData.tasks.map(t => `
                <tr>
                  <td>
                    <input type="checkbox" class="crm-task-toggle" data-task-id="${t.id}" ${t.completed ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--primary-pink);">
                  </td>
                  <td style="${t.completed ? 'text-decoration: line-through; color: var(--text-muted);' : 'font-weight: 600;'}">
                    ${t.title}
                  </td>
                  <td>${t.assignedTo}</td>
                  <td>${t.dueDate}</td>
                  <td><span class="priority-badge priority--${t.priority.toLowerCase()}">${t.priority}</span></td>
                  <td>
                    <button type="button" class="btn btn--sm btn--danger-outline delete-task-btn" data-task-id="${t.id}">✕</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /* View: CRM Products */
  function renderCRMProductsView() {
    return `
      <div class="crm-panel">
        <div class="crm-panel__header">
          <h3 class="crm-panel__title">Sanitary Product Catalogue Management</h3>
          <span class="badge badge--navy">${PRODUCTS.length} Products Active</span>
        </div>
        <div class="crm-table-wrap">
          <table class="crm-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Material Grade</th>
                <th>Surface Finish</th>
                <th>Standard</th>
                <th>Publication State</th>
              </tr>
            </thead>
            <tbody>
              ${PRODUCTS.map(p => `
                <tr>
                  <td><strong>${p.name}</strong></td>
                  <td>${p.category}</td>
                  <td><span class="badge badge--navy">${p.material}</span></td>
                  <td>${p.finish}</td>
                  <td>${p.standard}</td>
                  <td><span class="badge badge--pink">Active on Web</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /* View: CRM Reports */
  function renderCRMReportsView() {
    return `
      <div class="crm-kpi-grid">
        <div class="crm-kpi-card">
          <div class="crm-kpi-header"><span class="crm-kpi-label">Domestic Demand (India)</span><span>🇮🇳</span></div>
          <div class="crm-kpi-value">62%</div>
          <div class="crm-kpi-sub">Pharma (Gujarat/MH), Dairy</div>
        </div>
        <div class="crm-kpi-card">
          <div class="crm-kpi-header"><span class="crm-kpi-label">Europe &amp; Germany</span><span>🇩🇪</span></div>
          <div class="crm-kpi-value">15%</div>
          <div class="crm-kpi-sub">Process Equipment Skids</div>
        </div>
        <div class="crm-kpi-card">
          <div class="crm-kpi-header"><span class="crm-kpi-label">Middle East / UAE</span><span>🇦🇪</span></div>
          <div class="crm-kpi-value">12%</div>
          <div class="crm-kpi-sub">Industrial trading &amp; water</div>
        </div>
        <div class="crm-kpi-card">
          <div class="crm-kpi-header"><span class="crm-kpi-label">USA &amp; Americas</span><span>🇺🇸</span></div>
          <div class="crm-kpi-value">11%</div>
          <div class="crm-kpi-sub">Biotech &amp; High Purity</div>
        </div>
      </div>

      <div class="crm-panel">
        <div class="crm-panel__header">
          <h3 class="crm-panel__title">Product-Wise Inquiries Distribution</h3>
        </div>
        <div style="padding: 24px;">
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 4px;">
                <span>SS 316L EP Sanitary Pipes (Priority Monopoly)</span>
                <strong>38%</strong>
              </div>
              <div style="background: var(--border-light); height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: var(--primary-pink); width: 38%; height: 100%;"></div>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 4px;">
                <span>Sanitary Pipe Fittings (90° Bends &amp; Tees)</span>
                <strong>26%</strong>
              </div>
              <div style="background: var(--border-light); height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: var(--deep-navy); width: 26%; height: 100%;"></div>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 4px;">
                <span>Tri-Clamp Clamps &amp; Ferrules</span>
                <strong>20%</strong>
              </div>
              <div style="background: var(--border-light); height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: #0284C7; width: 20%; height: 100%;"></div>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 4px;">
                <span>Hygienic Butterfly &amp; Diaphragm Valves</span>
                <strong>16%</strong>
              </div>
              <div style="background: var(--border-light); height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: #10B981; width: 16%; height: 100%;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* View: CRM Employees Directory (3 in Sales, 4 in Accounts, 3 in Inventory) */
  function renderCRMEmployeesView() {
    return `
      <div class="crm-panel">
        <div class="crm-panel__header">
          <div>
            <h3 class="crm-panel__title">Staff &amp; Department Management</h3>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 2px;">
              Configured staff roles: 3 in Sales, 4 in Accounts, 3 in Inventory (Lotus Tubes operational team).
            </p>
          </div>
        </div>
        <div class="crm-table-wrap">
          <table class="crm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Designated Role</th>
                <th>Department</th>
                <th>Contact Email</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${crmData.employees.map(emp => `
                <tr>
                  <td><strong>${emp.id}</strong></td>
                  <td><strong>${emp.name}</strong></td>
                  <td>${emp.role}</td>
                  <td><span class="badge badge--steel">${emp.dept}</span></td>
                  <td>${emp.email}</td>
                  <td>${emp.phone}</td>
                  <td>
                    <span class="badge ${emp.active ? 'badge--pink' : 'badge--outline'}">
                      ${emp.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /* View: CRM Integrations Settings */
  function renderCRMSettingsView() {
    return `
      <div class="crm-panel">
        <div class="crm-panel__header">
          <h3 class="crm-panel__title">Communication &amp; Messaging Integrations</h3>
          <span class="badge badge--pink">Prototype Settings</span>
        </div>
        <div style="padding: 24px;">
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
            <div class="form-card">
              <h4>🟢 WhatsApp Business Integration</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 8px 0 16px;">
                Direct webhook for capturing customer clicks on "Get Price on WhatsApp" and logging enquiry threads into CRM.
              </p>
              <div style="background: var(--bg-light); padding: 12px; border-radius: var(--radius-md); font-size: 0.85rem; margin-bottom: 12px;">
                <strong>Connected Business Number:</strong> ${CONFIG.whatsappNumber}<br>
                <strong>Status:</strong> <span style="color: #10B981; font-weight: 700;">Simulated Active</span>
              </div>
              <button type="button" class="btn btn--outline-dark btn--sm" id="test-wa-notify-btn">Test WhatsApp Notification Hook</button>
            </div>

            <div class="form-card">
              <h4>✉️ Email Dispatch (SMTP)</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 8px 0 16px;">
                Automated customer acknowledgement emails and sales quotation PDF delivery.
              </p>
              <div style="background: var(--bg-light); padding: 12px; border-radius: var(--radius-md); font-size: 0.85rem; margin-bottom: 12px;">
                <strong>Sender:</strong> ${CONFIG.primaryEmail}<br>
                <strong>Status:</strong> <span style="color: #10B981; font-weight: 700;">Configured</span>
              </div>
              <button type="button" class="btn btn--outline-dark btn--sm" id="test-email-notify-btn">Send Test Quotation Template</button>
            </div>
          </div>

          <div class="why-card" style="background: var(--bg-light); border-color: var(--border-color); color: var(--deep-navy);">
            <h4>Demonstration Notice</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
              Live external APIs (WhatsApp Cloud API &amp; mail server) are simulated locally in this frontend prototype without transmitting external network traffic.
            </p>
          </div>

        </div>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     7. CATALOGUE FILTER LOGIC
     -------------------------------------------------------------------------- */
  function filterProducts() {
    let list = [...PRODUCTS];

    if (AppState.catalogueFilter.category !== 'all') {
      list = list.filter(p => p.categorySlug === AppState.catalogueFilter.category);
    }
    if (AppState.catalogueFilter.material !== 'all') {
      list = list.filter(p => p.material.includes(AppState.catalogueFilter.material));
    }
    if (AppState.catalogueFilter.finish !== 'all') {
      list = list.filter(p => p.finish.includes(AppState.catalogueFilter.finish));
    }
    if (AppState.catalogueFilter.search.trim()) {
      const q = AppState.catalogueFilter.search.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.standard.toLowerCase().includes(q) ||
        p.overview.toLowerCase().includes(q)
      );
    }

    if (AppState.catalogueFilter.sort === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (AppState.catalogueFilter.sort === 'grade') {
      list.sort((a, b) => (b.material.includes('316L') ? 1 : 0) - (a.material.includes('316L') ? 1 : 0));
    } else {
      list.sort((a, b) => (a.priorityRank || 99) - (b.priorityRank || 99));
    }

    return list;
  }

  /* --------------------------------------------------------------------------
     8. ROUTING & SHELL SWITCHER
     -------------------------------------------------------------------------- */
  function updateBreadcrumbs(route, param) {
    const list = document.getElementById('breadcrumbs-list');
    if (!list) return;

    let html = `<li><a href="#home">Home</a></li>`;
    if (route === 'home') {
      document.getElementById('site-breadcrumbs').style.display = 'none';
      return;
    }
    document.getElementById('site-breadcrumbs').style.display = 'block';

    if (route === 'products') {
      html += `<li aria-current="page">Product Catalogue</li>`;
    } else if (route === 'category') {
      const cat = CATEGORIES.find(c => c.slug === param);
      html += `<li><a href="#products">Products</a></li><li aria-current="page">${cat ? cat.name : 'Category'}</li>`;
    } else if (route === 'product') {
      const prod = PRODUCTS.find(p => p.slug === param);
      html += `<li><a href="#products">Products</a></li>`;
      if (prod) {
        html += `<li><a href="#category/${prod.categorySlug}">${prod.category}</a></li><li aria-current="page">${prod.name}</li>`;
      } else {
        html += `<li aria-current="page">Product Details</li>`;
      }
    } else if (route === 'industries') {
      html += `<li aria-current="page">Industries</li>`;
    } else if (route === 'industry') {
      const ind = INDUSTRIES.find(i => i.slug === param);
      html += `<li><a href="#industries">Industries</a></li><li aria-current="page">${ind ? ind.name : 'Industry'}</li>`;
    } else if (route === 'about') {
      html += `<li aria-current="page">About Us</li>`;
    } else if (route === 'quality') {
      html += `<li aria-current="page">Quality &amp; Documentation</li>`;
    } else if (route === 'resources') {
      html += `<li aria-current="page">Resources &amp; Datasheets</li>`;
    } else if (route === 'blog') {
      html += `<li aria-current="page">Technical Blog</li>`;
    } else if (route === 'contact') {
      html += `<li aria-current="page">Contact Us</li>`;
    } else if (route === 'quote') {
      html += `<li aria-current="page">Request a Quote (BOQ)</li>`;
    }
    list.innerHTML = html;
  }

  function handleRoute() {
    const { section, param } = parseHash(window.location.hash);
    AppState.currentRoute = section;
    AppState.routeParam = param;

    const publicShell = document.getElementById('public-shell');
    const crmShell = document.getElementById('crm-shell');
    const mainContent = document.getElementById('main-content');
    const crmContent = document.getElementById('crm-main-content');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Highlight active nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      const target = link.getAttribute('data-route');
      link.classList.toggle('active', target === section);
    });

    // Check if CRM route
    if (section === 'crm') {
      if (param === 'login') {
        publicShell.style.display = 'block';
        crmShell.style.display = 'none';
        updateBreadcrumbs('crm-login');
        mainContent.innerHTML = renderCRMLoginView();
      } else {
        publicShell.style.display = 'none';
        crmShell.style.display = 'flex';
        renderCRMRoute(param || 'dashboard');
      }
      return;
    }

    // Otherwise render Public Website
    publicShell.style.display = 'block';
    crmShell.style.display = 'none';
    updateBreadcrumbs(section, param);

    switch (section) {
      case 'home':
        mainContent.innerHTML = renderHomeView();
        break;
      case 'products':
        mainContent.innerHTML = renderProductsView();
        break;
      case 'category':
        mainContent.innerHTML = renderCategoryView(param);
        break;
      case 'product':
        mainContent.innerHTML = renderProductDetailView(param);
        break;
      case 'industries':
      case 'industry':
        mainContent.innerHTML = renderIndustriesView(param);
        break;
      case 'about':
        mainContent.innerHTML = renderAboutView();
        break;
      case 'quality':
        mainContent.innerHTML = renderQualityView();
        break;
      case 'resources':
        mainContent.innerHTML = renderResourcesView();
        break;
      case 'blog':
        mainContent.innerHTML = renderBlogView(param);
        break;
      case 'contact':
        mainContent.innerHTML = renderContactView();
        break;
      case 'quote':
        mainContent.innerHTML = renderQuoteView();
        break;
      default:
        mainContent.innerHTML = renderHomeView();
        break;
    }
  }

  function renderCRMRoute(subroute) {
    const crmContent = document.getElementById('crm-main-content');
    const breadcrumb = document.getElementById('crm-breadcrumb');

    // Update active link in CRM sidebar
    document.querySelectorAll('.crm-nav-link').forEach(link => {
      const target = link.getAttribute('data-crm-route');
      link.classList.toggle('active', target === subroute);
    });

    switch (subroute) {
      case 'dashboard':
        breadcrumb.textContent = 'Dashboard / Overview';
        crmContent.innerHTML = renderCRMDashboardView();
        break;
      case 'enquiries':
        breadcrumb.textContent = 'Enquiry & RFQ Management';
        crmContent.innerHTML = renderCRMEnquiriesView();
        break;
      case 'customers':
        breadcrumb.textContent = 'Customers & Industrial Accounts';
        crmContent.innerHTML = renderCRMCustomersView();
        break;
      case 'quotations':
        breadcrumb.textContent = 'Quotations & BOQs';
        crmContent.innerHTML = renderCRMQuotationsView();
        break;
      case 'tasks':
        breadcrumb.textContent = 'Tasks & Follow-up Calendar';
        crmContent.innerHTML = renderCRMTasksView();
        break;
      case 'products':
        breadcrumb.textContent = 'Product Catalogue & Inventory Specs';
        crmContent.innerHTML = renderCRMProductsView();
        break;
      case 'reports':
        breadcrumb.textContent = 'Sales & Country-wise Reports';
        crmContent.innerHTML = renderCRMReportsView();
        break;
      case 'employees':
        breadcrumb.textContent = 'Employee Directory (Sales, Accounts, Inventory)';
        crmContent.innerHTML = renderCRMEmployeesView();
        break;
      case 'settings':
        breadcrumb.textContent = 'Communication & WhatsApp Integration';
        crmContent.innerHTML = renderCRMSettingsView();
        break;
      default:
        breadcrumb.textContent = 'Dashboard / Overview';
        crmContent.innerHTML = renderCRMDashboardView();
        break;
    }
  }

  /* --------------------------------------------------------------------------
     9. UI EVENT HANDLERS & MODAL CONTROLLERS
     -------------------------------------------------------------------------- */
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${type === 'success' ? '✓' : 'ℹ'}</span> <div>${message}</div>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function openQuickEnquiryModal(productId, productName) {
    const modal = document.getElementById('quick-enquiry-modal');
    if (!modal) return;

    const titleEl = document.getElementById('quick-enquiry-title');
    const idInput = document.getElementById('enquiry-product-id');
    const nameInput = document.getElementById('enquiry-product-name');
    const preview = document.getElementById('selected-product-preview');

    idInput.value = productId || '';
    nameInput.value = productName || 'General Sanitary Component';
    titleEl.textContent = productName ? `Get Quotation for: ${productName}` : 'Request a Product Quotation';

    preview.innerHTML = `
      <div style="background: var(--bg-light); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px; margin-bottom: 16px; font-size: 0.88rem;">
        <strong>Product:</strong> ${nameInput.value}<br>
        <small style="color: var(--text-secondary);">Direct RFQ logged into Lotus Tubes Operational CRM</small>
      </div>
    `;

    document.getElementById('quick-enquiry-form').style.display = 'block';
    document.getElementById('quick-enquiry-success').style.display = 'none';
    modal.classList.add('open');
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  }

  /* --------------------------------------------------------------------------
     10. GLOBAL APPLICATION INITIALIZATION
     -------------------------------------------------------------------------- */
  function initApp() {
    // Hash router listeners
    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('load', handleRoute);

    // Sticky Header Scroll effect & Scroll to top
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollTopBtn) {
        scrollTopBtn.classList.toggle('visible', scrollY > 400);
      }
    });
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Mobile Hamburger Navigation Drawer
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileDrawerClose = document.getElementById('mobile-drawer-close');
    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => mobileDrawer.classList.add('open'));
      mobileDrawerClose.addEventListener('click', () => mobileDrawer.classList.remove('open'));
      // Close on link click
      mobileDrawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => mobileDrawer.classList.remove('open'));
      });
    }

    // CRM Sidebar Mobile Toggle
    const crmSidebarToggle = document.getElementById('crm-sidebar-toggle');
    const crmSidebar = document.getElementById('crm-sidebar');
    if (crmSidebarToggle && crmSidebar) {
      crmSidebarToggle.addEventListener('click', () => {
        crmSidebar.classList.toggle('open');
      });
    }

    // Language Dropdown Simulation
    const langBtn = document.getElementById('lang-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    const currentLangLabel = document.getElementById('current-lang-label');
    if (langBtn && langDropdown) {
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('show');
      });
      document.addEventListener('click', () => langDropdown.classList.remove('show'));
      langDropdown.querySelectorAll('.lang-opt').forEach(opt => {
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          const lang = opt.getAttribute('data-lang');
          currentLangLabel.textContent = opt.textContent;
          langDropdown.querySelectorAll('.lang-opt').forEach(o => o.classList.remove('active'));
          opt.classList.add('active');
          langDropdown.classList.remove('show');
          showToast(`Language set to: ${opt.textContent} (Demonstration)`, 'info');
        });
      });
    }

    // Global Search Modal Toggle
    const searchModal = document.getElementById('search-modal');
    const searchOpenBtn = document.getElementById('header-search-btn');
    const searchCloseBtn = document.getElementById('search-modal-close');
    const searchInput = document.getElementById('site-search-input');
    const searchResultsList = document.getElementById('search-results-list');

    if (searchOpenBtn && searchModal) {
      searchOpenBtn.addEventListener('click', () => {
        searchModal.classList.add('open');
        searchInput.focus();
        renderQuickSearch('');
      });
      searchCloseBtn.addEventListener('click', () => searchModal.classList.remove('open'));
    }

    function renderQuickSearch(query) {
      if (!searchResultsList) return;
      const q = query.toLowerCase().trim();
      const matches = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
      ).slice(0, 6);

      if (matches.length === 0) {
        searchResultsList.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted);">No products found matching "${query}".</div>`;
        return;
      }

      searchResultsList.innerHTML = matches.map(p => `
        <a href="#product/${p.slug}" class="search-result-item" onclick="document.getElementById('search-modal').classList.remove('open');">
          <img src="${p.image}" alt="${p.name}" class="search-result-thumb">
          <div class="search-result-info">
            <div class="search-result-name">${p.name}</div>
            <div class="search-result-category">${p.category} &bull; ${p.material}</div>
          </div>
          <span style="color: var(--primary-pink); font-weight: 700; font-size: 0.85rem;">View &rarr;</span>
        </a>
      `).join('');
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => renderQuickSearch(e.target.value));
    }
    document.querySelectorAll('.quick-filter-tag').forEach(tag => {
      tag.addEventListener('click', (e) => {
        const term = e.target.getAttribute('data-search-term');
        searchInput.value = term;
        renderQuickSearch(term);
      });
    });

    // Close Modals on Backdrop Click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAllModals();
      });
    });

    // Quick RFQ Modal Close
    const quickEnquiryClose = document.getElementById('quick-enquiry-close');
    if (quickEnquiryClose) {
      quickEnquiryClose.addEventListener('click', closeAllModals);
    }
    const successModalClose = document.getElementById('success-modal-close');
    if (successModalClose) {
      successModalClose.addEventListener('click', closeAllModals);
    }

    // Process Video Modal
    const processModal = document.getElementById('process-video-modal');
    const processClose = document.getElementById('process-modal-close');
    if (processClose && processModal) {
      processClose.addEventListener('click', () => processModal.classList.remove('open'));
    }

    // Delegate dynamic clicks on document
    document.addEventListener('click', (e) => {
      // Open Quick RFQ button
      const rfqBtn = e.target.closest('.quick-rfq-btn');
      if (rfqBtn) {
        const pId = rfqBtn.getAttribute('data-product-id');
        const pName = rfqBtn.getAttribute('data-product-name');
        openQuickEnquiryModal(pId, pName);
        return;
      }

      // Open Process Demonstration Video
      if (e.target.closest('#open-process-video') || e.target.closest('#open-process-video-btn')) {
        if (processModal) processModal.classList.add('open');
        return;
      }

      // FAQ accordion toggle
      const faqBtn = e.target.closest('.faq-question');
      if (faqBtn) {
        const item = faqBtn.closest('.faq-item');
        item.classList.toggle('open');
        return;
      }

      // Product Gallery Thumbnail Click
      const thumb = e.target.closest('.gallery-thumb');
      if (thumb) {
        const newSrc = thumb.getAttribute('data-img-src');
        const mainImg = document.getElementById('detail-main-img');
        if (mainImg) mainImg.src = newSrc;
        document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        return;
      }

      // Product Tabs switcher
      const tabBtn = e.target.closest('.tab-btn');
      if (tabBtn && tabBtn.hasAttribute('data-tab-target')) {
        const targetId = tabBtn.getAttribute('data-tab-target');
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content-panel').forEach(p => p.classList.remove('active'));
        tabBtn.classList.add('active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.classList.add('active');
        return;
      }

      // Download PDF mock click
      const downloadBtn = e.target.closest('.download-mock-btn');
      if (downloadBtn) {
        const docName = downloadBtn.getAttribute('data-doc-name');
        showToast(`Document [${docName}] prepared for download. (Demonstration)`, 'success');
        return;
      }

      // Reset catalogue filters
      if (e.target.closest('#filter-reset-btn') || e.target.closest('#empty-clear-filters')) {
        AppState.catalogueFilter.category = 'all';
        AppState.catalogueFilter.material = 'all';
        AppState.catalogueFilter.finish = 'all';
        AppState.catalogueFilter.search = '';
        AppState.catalogueFilter.sort = 'featured';
        handleRoute();
        showToast('Filters reset to default.', 'info');
        return;
      }

      // CRM Status Change
      if (e.target.classList.contains('crm-status-changer')) {
        // Handled via 'change' event
        return;
      }

      // CRM Task Toggle
      const taskToggle = e.target.closest('.crm-task-toggle');
      if (taskToggle) {
        const taskId = taskToggle.getAttribute('data-task-id');
        const t = crmData.tasks.find(x => x.id === taskId);
        if (t) {
          t.completed = taskToggle.checked;
          saveCRMData(crmData);
          showToast(`Task status updated: ${t.completed ? 'Completed' : 'Pending'}`, 'info');
        }
        return;
      }

      // CRM Delete Task
      const delTaskBtn = e.target.closest('.delete-task-btn');
      if (delTaskBtn) {
        const taskId = delTaskBtn.getAttribute('data-task-id');
        crmData.tasks = crmData.tasks.filter(x => x.id !== taskId);
        saveCRMData(crmData);
        showToast('Task removed from schedule.', 'info');
        renderCRMRoute('tasks');
        return;
      }

      // CRM View Enquiry Details Modal
      const viewEnquiryBtn = e.target.closest('.view-enquiry-btn');
      if (viewEnquiryBtn) {
        const eqId = viewEnquiryBtn.getAttribute('data-enquiry-id');
        const eq = crmData.enquiries.find(x => x.id === eqId);
        if (eq) {
          alert(`ENQUIRY DETAILS: [${eq.id}]\n\nCustomer: ${eq.customerName} (${eq.company})\nPhone: ${eq.phone}\nEmail: ${eq.email}\nLocation: ${eq.location}\nProduct: ${eq.product}\nQty: ${eq.quantity}\nGrade: ${eq.grade}\nAssigned Staff: ${eq.assignedTo}\nStatus: ${eq.status}\nNotes: ${eq.notes || 'None'}`);
        }
        return;
      }

      // CRM Logout
      if (e.target.closest('#crm-logout-btn')) {
        navigateTo('#crm/login');
        showToast('Locked Super Admin Session.', 'info');
        return;
      }

      // Test Notification buttons
      if (e.target.closest('#test-wa-notify-btn')) {
        showToast('Simulated WhatsApp webhook ping dispatched to registered number.', 'success');
        return;
      }
      if (e.target.closest('#test-email-notify-btn')) {
        showToast('Official quotation PDF template sent to test recipient.', 'success');
        return;
      }

      // Direct WhatsApp from modal
      if (e.target.closest('#eq-whatsapp-direct')) {
        const pName = document.getElementById('enquiry-product-name').value || 'Sanitary Component';
        const name = document.getElementById('eq-name').value || 'Sir/Madam';
        const url = `https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20Lotus%20Tubes%2C%20I%20am%20${encodeURIComponent(name)}%2C%20inquiring%20about%20${encodeURIComponent(pName)}.`;
        window.open(url, '_blank');
        return;
      }
    });

    // Handle change on CRM status select
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('crm-status-changer')) {
        const eqId = e.target.getAttribute('data-enquiry-id');
        const newStatus = e.target.value;
        const eq = crmData.enquiries.find(x => x.id === eqId);
        if (eq) {
          eq.status = newStatus;
          saveCRMData(crmData);
          showToast(`Enquiry ${eqId} status changed to "${newStatus}"`, 'success');
        }
      }

      // Catalogue filter inputs
      if (e.target.name === 'cat-filter') {
        AppState.catalogueFilter.category = e.target.value;
        document.getElementById('main-content').innerHTML = renderProductsView();
      }
      if (e.target.name === 'mat-filter') {
        AppState.catalogueFilter.material = e.target.value;
        document.getElementById('main-content').innerHTML = renderProductsView();
      }
      if (e.target.name === 'finish-filter') {
        AppState.catalogueFilter.finish = e.target.value;
        document.getElementById('main-content').innerHTML = renderProductsView();
      }
      if (e.target.id === 'catalogue-sort-select') {
        AppState.catalogueFilter.sort = e.target.value;
        document.getElementById('main-content').innerHTML = renderProductsView();
      }
    });

    // Catalogue search input debounce
    document.addEventListener('input', (e) => {
      if (e.target.id === 'catalogue-search-input') {
        AppState.catalogueFilter.search = e.target.value;
        const grid = document.querySelector('.catalogue-main');
        if (grid) {
          // Re-render product section
          const filtered = filterProducts();
          const countEl = document.querySelector('.catalogue-count');
          if (countEl) countEl.innerHTML = `Showing <strong>${filtered.length}</strong> products`;
          const container = document.querySelector('.featured-products-grid') || document.querySelector('.empty-state');
          if (container) {
            container.outerHTML = filtered.length > 0 ? `
              <div class="featured-products-grid">
                ${filtered.map(prod => `
                  <article class="product-card">
                    <div class="product-card__badge-bar">
                      <span class="badge badge--navy">${prod.material}</span>
                      <span class="badge badge--pink">${prod.finish.split(' ')[0]}</span>
                    </div>
                    <div class="product-card__img-wrap">
                      <img src="${prod.image}" alt="${prod.name}" class="product-card__img" loading="lazy">
                    </div>
                    <div class="product-card__body">
                      <span class="product-card__category">${prod.category}</span>
                      <h3 class="product-card__title">
                        <a href="#product/${prod.slug}">${prod.name}</a>
                      </h3>
                      <p class="product-card__specs">
                        <strong>Standard:</strong> ${prod.standard}<br>
                        <strong>Sizes:</strong> ${prod.sizes}
                      </p>
                      <div class="product-card__actions">
                        <a href="#product/${prod.slug}" class="btn btn--outline-dark btn--sm">View Details</a>
                        <button type="button" class="btn btn--primary btn--sm quick-rfq-btn" data-product-id="${prod.id}" data-product-name="${prod.name}">Get Quote</button>
                      </div>
                    </div>
                  </article>
                `).join('')}
              </div>
            ` : `
              <div class="empty-state">
                <div class="empty-state__icon">🔍</div>
                <h3 class="empty-state__title">No matching products found</h3>
                <p class="empty-state__desc">Try clearing your filters or search keywords.</p>
                <button type="button" class="btn btn--primary" id="empty-clear-filters">Reset All Filters</button>
              </div>
            `;
          }
        }
      }

      // Simulated 360 Degree Range Slider
      if (e.target.id === 'slider-360') {
        const val = e.target.value;
        const display = document.getElementById('angle-display');
        const mainImg = document.getElementById('detail-main-img');
        if (display) display.textContent = `${val}°`;
        if (mainImg) {
          // Micro rotate visual effect to simulate continuous roundness
          mainImg.style.transform = `perspective(600px) rotateY(${val * 0.4}deg)`;
        }
      }

      // CRM Global Search
      if (e.target.id === 'crm-global-search') {
        AppState.crmSearch = e.target.value;
        if (AppState.currentRoute === 'crm' && (AppState.routeParam === 'enquiries' || AppState.routeParam === 'dashboard')) {
          renderCRMRoute(AppState.routeParam || 'dashboard');
        }
      }
    });

    // File Drop preview
    document.addEventListener('change', (e) => {
      if (e.target.id === 'eq-boq-file') {
        const file = e.target.files[0];
        const preview = document.getElementById('eq-file-preview');
        if (preview && file) {
          preview.textContent = `Attached: ${file.name} (${Math.round(file.size / 1024)} KB)`;
        }
      }
      if (e.target.id === 'rfq-file') {
        const file = e.target.files[0];
        const preview = document.getElementById('rfq-file-name');
        if (preview && file) {
          preview.textContent = `Attached BOQ: ${file.name} (${Math.round(file.size / 1024)} KB)`;
        }
      }
    });

    // Form Submissions
    document.addEventListener('submit', (e) => {
      // 1. Quick Enquiry Modal Form
      if (e.target.id === 'quick-enquiry-form') {
        e.preventDefault();
        const name = document.getElementById('eq-name').value.trim();
        const company = document.getElementById('eq-company').value.trim();
        const email = document.getElementById('eq-email').value.trim();
        const phone = document.getElementById('eq-phone').value.trim();
        const qty = document.getElementById('eq-quantity').value.trim();
        const location = document.getElementById('eq-location').value.trim();
        const pName = document.getElementById('enquiry-product-name').value;
        const grade = document.getElementById('eq-grade').value;
        const notes = document.getElementById('eq-notes').value.trim();

        if (!name || !company || !email || !phone || !qty || !location) {
          showToast('Please fill in all mandatory fields (*)', 'error');
          return;
        }

        const newId = `LT-RFQ-2026-${String(crmData.enquiries.length + 1).padStart(3, '0')}`;
        const newRecord = {
          id: newId,
          date: new Date().toISOString().split('T')[0],
          customerName: name,
          company: company,
          email: email,
          phone: phone,
          location: location,
          product: pName,
          grade: grade,
          quantity: qty,
          source: 'Website Modal RFQ',
          assignedTo: 'Suresh Mehta (Sales)',
          status: 'New',
          priority: 'High',
          notes: notes || 'Enquiry received via website quick RFQ modal.'
        };

        crmData.enquiries.unshift(newRecord);
        saveCRMData(crmData);

        // Show success state
        document.getElementById('quick-enquiry-form').style.display = 'none';
        const succBox = document.getElementById('quick-enquiry-success');
        document.getElementById('success-enquiry-ref').textContent = newId;
        succBox.style.display = 'block';

        showToast(`Quotation logged! Ref: ${newId}`, 'success');
        return;
      }

      // 2. Full RFQ Page Form
      if (e.target.id === 'full-rfq-form') {
        e.preventDefault();
        const name = document.getElementById('rfq-name').value.trim();
        const company = document.getElementById('rfq-company').value.trim();
        const email = document.getElementById('rfq-email').value.trim();
        const phone = document.getElementById('rfq-phone').value.trim();
        const cat = document.getElementById('rfq-category').value;
        const mat = document.getElementById('rfq-material').value;
        const qty = document.getElementById('rfq-quantity').value.trim();
        const dest = document.getElementById('rfq-destination').value.trim();
        const specs = document.getElementById('rfq-specs').value.trim();

        if (!name || !company || !email || !phone || !qty || !dest) {
          showToast('Please complete all required fields (*)', 'error');
          return;
        }

        const newId = `LT-RFQ-2026-${String(crmData.enquiries.length + 1).padStart(3, '0')}`;
        crmData.enquiries.unshift({
          id: newId,
          date: new Date().toISOString().split('T')[0],
          customerName: name,
          company: company,
          email: email,
          phone: phone,
          location: dest,
          product: cat,
          grade: mat,
          quantity: qty,
          source: 'Full RFQ BOQ Page',
          assignedTo: 'Vikram Joshi (Export/Domestic)',
          status: 'New',
          priority: 'High',
          notes: specs || 'Full BOQ submission.'
        });
        saveCRMData(crmData);

        document.getElementById('full-rfq-form').style.display = 'none';
        document.getElementById('rfq-success-code').textContent = newId;
        document.getElementById('full-rfq-success').style.display = 'block';

        showToast(`Full RFQ recorded! Reference ${newId}`, 'success');
        return;
      }

      // 3. Contact Form Submission
      if (e.target.id === 'public-contact-form') {
        e.preventDefault();
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const phone = document.getElementById('contact-phone').value.trim();
        const msg = document.getElementById('contact-message').value.trim();
        const sub = document.getElementById('contact-subject').value;

        if (!name || !email || !phone || !msg) {
          showToast('Please complete all fields.', 'error');
          return;
        }

        const newId = `LT-MSG-2026-${String(crmData.enquiries.length + 1).padStart(3, '0')}`;
        crmData.enquiries.unshift({
          id: newId,
          date: new Date().toISOString().split('T')[0],
          customerName: name,
          company: 'Direct Web Inquiry',
          email: email,
          phone: phone,
          location: 'Website Visitor',
          product: sub,
          grade: 'SS 304/316L',
          quantity: 'Consultation',
          source: 'Contact Us Page',
          assignedTo: 'Amit Verma (Sales)',
          status: 'New',
          priority: 'Medium',
          notes: msg
        });
        saveCRMData(crmData);

        showToast('Thank you! Your message has been logged into our sales desk queue.', 'success');
        e.target.reset();
        return;
      }

      // 4. Quality Document Request
      if (e.target.id === 'quality-request-form') {
        e.preventDefault();
        const company = document.getElementById('qc-company').value.trim();
        const email = document.getElementById('qc-email').value.trim();
        const docType = document.getElementById('qc-doc-type').value;

        if (!company || !email) {
          showToast('Please enter your company and email.', 'error');
          return;
        }

        showToast(`Quality request for "${docType}" logged. Technical dispatch will email your file.`, 'success');
        e.target.reset();
        return;
      }

      // 5. CRM Login Form
      if (e.target.id === 'crm-login-form') {
        e.preventDefault();
        navigateTo('#crm/dashboard');
        showToast('Authenticated as Super Admin (Chirag Shah). Welcome to Lotus Tubes CRM.', 'success');
        return;
      }
    });
  }

  // Kickstart on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();

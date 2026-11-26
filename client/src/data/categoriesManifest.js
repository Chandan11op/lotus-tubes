/**
 * Lotus Tubes - 11 Core Product Categories & Mega-Menu Manifest
 * 
 * Maps the 11 verified B2B sanitary product categories to real product photographs
 * stored in /assets/images/products images/.
 */

export const CATEGORIES_MANIFEST = [
  {
    id: 'sanitary-valves',
    title: 'Sanitary Valves',
    countBadge: '10 Products',
    description: 'High-purity hygienic valves for flow regulation, aseptic shutoff, and CIP/SIP sterilization.',
    viewAllLink: '/product/ss-sanitary-butterfly-valve',
    primaryProductLink: '/product/ss-sanitary-butterfly-valve',
    heroImage: '/assets/images/products images/SS BUTTERFLY VALVE/TPM-225.jpg',
    products: [
      {
        name: 'Sanitary Butterfly Valve',
        spec: 'SS 304 / 316L • Manual / Multi-position Handle',
        image: '/assets/images/products images/SS BUTTERFLY VALVE/TPM-225.jpg',
        link: '/product/ss-sanitary-butterfly-valve'
      },
      {
        name: 'Sanitary Ball Valve',
        spec: '2-Piece / 3-Piece Encapsulated PTFE Seats',
        image: '/assets/images/products images/SS BALL VALVE 2PCS/TPM-275.jpg',
        link: '/product/ss-3-piece-ball-valve-tc'
      },
      {
        name: 'Sanitary Check Valve or NRV (Non Returnable Valve)',
        spec: 'Spring Check • Tri-Clamp / Welded Ends',
        image: '/assets/images/products images/ss nrv tc end/TPM-238 - Copy.jpg',
        link: '/product/ss-sanitary-non-return-valve'
      },
      {
        name: 'Sanitary Diaphragm Valve',
        spec: 'Bio-Pharma Aseptic Casting / Forged Body',
        image: '/assets/images/products images/SS DAIPHGRAM VALVE CASTING/TPM-205.jpg',
        link: '/product/ss-316l-diaphragm-valve'
      },
      {
        name: 'Sanitary Pneumatic Valve',
        spec: 'Air-Actuated Butterfly Valve with C-Top Controller',
        image: '/assets/images/products images/SS PNUEMATIC BUTTERFLY VALVE/pneumatic-sanitary-butterfly-valve.jpg',
        link: '/product/pneumatic-sanitary-ball-valve'
      },
      {
        name: 'Sanitary Pneumatic Actuated Valve',
        spec: 'Stainless Steel Actuated Diaphragm Valve',
        image: '/assets/images/products images/SS PNUEMATIC DIAPHGRAM VALVE/pneumatic-sanitary-diaphragm-valve.jpg',
        link: '/product/pneumatic-sanitary-ball-valve'
      },
      {
        name: 'Angle Seat Valve',
        spec: 'Y-Type High-Flow Steam & Liquid Control Valve',
        image: '/assets/images/products images/SS BLOCK VALVE TC END/sanitary-3-way-block-valve.jpg',
        link: '/product/ss-316l-diaphragm-valve'
      },
      {
        name: 'Tank Bottom Valve',
        spec: 'Zero Dead-Leg Flush Bottom Discharge Valve',
        image: '/assets/images/products images/SS FLUSH BOTTOM DIAPHGRAM VALVE/sanitary-flush-bottom-diaphragm-valve.jpg',
        link: '/product/ss-316l-diaphragm-valve'
      },
      {
        name: 'Flow Diverter Valve',
        spec: 'Multi-Port Diverting Block Valve for Hygienic Manifolds',
        image: '/assets/images/products images/SS SML CROSS TEE/TPM-153.jpg',
        link: '/product/ss-sanitary-equal-tee'
      },
      {
        name: 'Pressure Relief Standard',
        spec: 'Calibrated Sanitary Safety & Pressure Relief Valve',
        image: '/assets/images/products images/mini hex ball valve/TPM-318.jpg',
        link: '/product/ss-3-piece-ball-valve-tc'
      }
    ]
  },
  {
    id: 'sanitary-fittings',
    title: 'Sanitary Fittings',
    countBadge: '7 Products',
    description: 'Precision dimensioned hygienic fittings complying with 3A, DIN, SMS, and ASME BPE standards.',
    viewAllLink: '/product/ss-sanitary-90-bend',
    primaryProductLink: '/product/ss-sanitary-90-bend',
    heroImage: '/assets/images/products images/SS SHORT ELBOW/TPM-118.jpg',
    products: [
      {
        name: 'European Standard Fittings',
        spec: 'DIN 11850 / 11852 Polish Sanitary Bends & Tees',
        image: '/assets/images/products images/SS SHORT ELBOW/TPM-118.jpg',
        link: '/product/ss-sanitary-90-bend'
      },
      {
        name: 'Sanitary Clamped Fittings',
        spec: 'Tri-Clamp 90° & 45° Elbows, Crosses, Concentric Reducers',
        image: '/assets/images/products images/SS TC BEND/TPM-177.jpg',
        link: '/product/ss-sanitary-90-bend'
      },
      {
        name: 'Sanitary Welded Fittings',
        spec: 'Orbital Butt-Weld Bends, Equal Tees & Long Tangents',
        image: '/assets/images/products images/SS BUTWELDED ELBOW/TPM-136.jpg',
        link: '/product/ss-sanitary-equal-tee'
      },
      {
        name: 'Bio Pharma (BPE) Fittings',
        spec: 'ASME BPE Certified SF1 (MP) & SF4 (EP Ra < 0.375 µm)',
        image: '/assets/images/products images/SS BUTWELDED TEE/TPM-132.jpg',
        link: '/product/ss-tri-clamp-ferrule'
      },
      {
        name: 'Tri Clovers Clamps (Clamps Clover Tubes holder)',
        spec: 'Single Pin, 2-Segment & Heavy Duty 3-Segment Clamps',
        image: '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-396.jpg',
        link: '/product/ss-tri-clamp-clamp'
      },
      {
        name: 'Vacuum Components',
        spec: 'KF/ISO Sanitary Reducers, Flanges & High Vacuum Clamps',
        image: '/assets/images/products images/SS CONCENTRIC REDUCER/TPM-121.jpg',
        link: '/product/ss-sanitary-concentric-reducer'
      },
      {
        name: 'Pipe Adapter',
        spec: 'SMS, DIN & Male/Female Threaded Process Adapters',
        image: '/assets/images/products images/ss sms union/TPM-378.jpg',
        link: '/product/ss-sms-union'
      }
    ]
  },
  {
    id: 'sanitary-hose-fittings',
    title: 'Sanitary Hose Fittings',
    countBadge: '5 Products',
    description: 'Hygienic hose barb adaptors, crimp collars, and flexible transfer assemblies.',
    viewAllLink: '/product/ss-tri-clamp-ferrule',
    primaryProductLink: '/product/ss-tri-clamp-ferrule',
    heroImage: '/assets/images/products images/SS HOSE NIPPLE/TPM-403.jpg',
    products: [
      {
        name: 'TRI Clover Hose - 3A',
        spec: '3A Certified Tri-Clamp Sanitary Hose Barb Adapter',
        image: '/assets/images/products images/SS HOSE NIPPLE/TPM-403.jpg',
        link: '/product/ss-sanitary-pipe-spool'
      },
      {
        name: 'Sanitary Stainless Steel Long Hose',
        spec: 'Flexible SS 316 Braided & Corrugated Transfer Hoses',
        image: '/assets/images/products images/SS LONG BEND/TPM-100.jpg',
        link: '/product/ss-sanitary-pipe-spool'
      },
      {
        name: 'Sanitary Hose Adapter',
        spec: 'Machined Hose Menders & Quick-Connect Couplers',
        image: '/assets/images/products images/SS HOSE NIPPLE/TPM-404.jpg',
        link: '/product/ss-sanitary-pipe-spool'
      },
      {
        name: 'SMS Sanitary Hose Nipple',
        spec: 'SMS 1145 Standard Hygienic Threaded Hose Tailpiece',
        image: '/assets/images/products images/SS HOSE NIPPLE/TPM-405.jpg',
        link: '/product/ss-sanitary-pipe-spool'
      },
      {
        name: 'Flexible Hose Pipe (TC / Flange / SMS / Food Grade)',
        spec: 'TC Hose Pipe, Flange Hose Pipe, SMS Union, Food Hose & Crimp Collars',
        image: '/assets/images/products images/SS HOSE NIPPLE/TPM-403.jpg',
        link: '/product/ss-sanitary-pipe-spool'
      }
    ]
  },
  {
    id: 'sanitary-tank-accessories',
    title: 'Sanitary Tank Accessories',
    countBadge: '5 Products',
    description: 'Aseptic vessel hardware including sight glasses, spray balls, strainers, and pressure manways.',
    viewAllLink: '/product/ss-sanitary-spray-ball',
    primaryProductLink: '/product/ss-sanitary-spray-ball',
    heroImage: '/assets/images/products images/SS SLIGHT GLASS TC END/TPM-322.jpg',
    products: [
      {
        name: 'Sanitary Sight Glass',
        spec: 'Borosilicate Glass 360° In-Line & Union Sight Glasses',
        image: '/assets/images/products images/SS SLIGHT GLASS TC END/TPM-322.jpg',
        link: '/product/ss-sanitary-pipe-spool'
      },
      {
        name: 'Sanitary Spray Ball',
        spec: 'Rotary 360° CIP Tank Cleaning Spray Balls (SS 316L)',
        image: '/assets/images/products images/SS SPRAY BALL VALVE/TPM-310.jpg',
        link: '/product/ss-sanitary-spray-ball'
      },
      {
        name: 'Sanitary Filters & Strainers',
        spec: 'In-Line Y-Filter & Angle Strainers (20–200 Mesh)',
        image: '/assets/images/products images/SS SLIGHT GLASS TC END/TPM-323.jpg',
        link: '/product/ss-sanitary-spray-ball'
      },
      {
        name: 'Stainless Steel Manway / Manholes',
        spec: 'Round Pressure, Oval Inward & Non-Pressure Atmospheric Manways',
        image: '/assets/images/products images/SS MANHOLE/TPM-416.jpg',
        link: '/product/ss-sanitary-pipe-spool'
      },
      {
        name: 'Tank Bottom Flush Valves',
        spec: 'Diaphragm & Piston Bottom Drainage Valves for Bio-Reactors',
        image: '/assets/images/products images/SS FLUSH BOTTOM VALVE/TPM-247.jpg',
        link: '/product/ss-316l-diaphragm-valve'
      }
    ]
  },
  {
    id: 'sanitary-tubes',
    title: 'Sanitary Tubes',
    countBadge: '7 Products',
    description: 'Precision sanitary tubing manufactured to ASTM A270, DIN 11866, ASME BPE, and ISO standards.',
    viewAllLink: '/product/ss-316l-ep-pipe',
    primaryProductLink: '/product/ss-316l-ep-pipe',
    heroImage: '/assets/images/products images/SS EP PIPE/TPM-10.jpg',
    products: [
      {
        name: '3A Stainless Steel Sanitary Tubes',
        spec: 'ASTM A270 / 3A Certified SS 304 & SS 316L (Ra < 0.8 µm)',
        image: '/assets/images/products images/SS EP PIPE/TPM-10.jpg',
        link: '/product/ss-316l-ep-pipe'
      },
      {
        name: 'ASME BPE Stainless Steel Sanitary Tubes',
        spec: 'High-Purity Bio-Pharma Welded & Seamless Tubes (SF1 / SF4)',
        image: '/assets/images/products images/SS EP PIPE/TPM-11.jpg',
        link: '/product/ss-304-ep-pipe'
      },
      {
        name: 'ISO/SMS Stainless Steel Sanitary Tubes',
        spec: 'Metric ISO 2037 & SMS 3008 Food & Dairy Grade Tubing',
        image: '/assets/images/products images/SS MP PIPE/TPM-1.jpg',
        link: '/product/ss-316l-mp-pipe'
      },
      {
        name: 'BS4825 Stainless Steel Sanitary Tubes',
        spec: 'British Standard Hygienic Dairy & Brewing Processing Tubes',
        image: '/assets/images/products images/SS ROUND POLISH PIPE/TPM-57.jpg',
        link: '/product/ss-304-mp-pipe'
      },
      {
        name: 'DIN EN 10357 Stainless Steel Tubes',
        spec: 'European Metric Series A, B, C & D Welded Stainless Tubes',
        image: '/assets/images/products images/SS MP PIPE/TPM-14.jpg',
        link: '/product/ss-316l-ep-pipe'
      },
      {
        name: 'High Quality Sanitary Welded Tubes',
        spec: '100% Eddy Current Tested Longitudinal TIG/Laser Welded',
        image: '/assets/images/products images/SS ROUND POLISH PIPE/TPM-58.jpg',
        link: '/product/ss-304-ep-pipe'
      },
      {
        name: 'Stainless Steel - Square | Rectangle | Round Pipes',
        spec: 'Ornamental & Process Sanitary Hollow Sections (Mirror / Satin)',
        image: '/assets/images/products images/SS EP PIPE/TPM-12.jpg',
        link: '/product/ss-316l-mp-pipe'
      }
    ]
  },
  {
    id: 'sanitary-pumps',
    title: 'Sanitary Pumps',
    countBadge: '4 Products',
    description: 'Hygienic centrifugal and positive displacement fluid transfer pumps for food, beverage, and dairy.',
    viewAllLink: '/product/pneumatic-sanitary-ball-valve',
    primaryProductLink: '/product/pneumatic-sanitary-ball-valve',
    heroImage: '/assets/images/products images/SS PNUEMATIC BUTTERFLY VALVE/sanitary-centrifugal-pump.jpg',
    products: [
      {
        name: 'Food Grade Centrifugal Pumps',
        spec: 'Open Impeller CIP Cleanable Design (SS 316L Contact Parts)',
        image: '/assets/images/products images/SS PNUEMATIC BUTTERFLY VALVE/sanitary-centrifugal-pump.jpg',
        link: '/product/pneumatic-sanitary-ball-valve'
      },
      {
        name: 'Dairy Grade Centrifugal Pumps',
        spec: 'Gentle Product Handling with Mechanical Silicon Carbide Seals',
        image: '/assets/images/products images/SS PNUEMATIC BUTTERFLY VALVE/sanitary-centrifugal-pump.jpg',
        link: '/product/pneumatic-sanitary-ball-valve'
      },
      {
        name: 'Water/ Fluid Grade Centrifugal Pumps',
        spec: 'WFI & Purified Water Circulation Sanitary Booster Pumps',
        image: '/assets/images/products images/SS PNUEMATIC BUTTERFLY VALVE/sanitary-centrifugal-pump.jpg',
        link: '/product/pneumatic-sanitary-ball-valve'
      },
      {
        name: 'Food & Beverage, Wine Vertical Centrifugal Pumps',
        spec: 'Multi-Stage Vertical High Pressure Sanitary Delivery Pumps',
        image: '/assets/images/products images/SS PNUEMATIC BUTTERFLY VALVE/sanitary-centrifugal-pump.jpg',
        link: '/product/pneumatic-sanitary-ball-valve'
      }
    ]
  },
  {
    id: 'sanitary-gasket',
    title: 'Sanitary Gasket',
    countBadge: '2 Products',
    description: 'FDA 21 CFR 177.2600 and USP Class VI certified high-temperature elastomer seals.',
    viewAllLink: '/product/silicone-tri-clamp-gasket',
    primaryProductLink: '/product/silicone-tri-clamp-gasket',
    heroImage: '/assets/images/products images/PIPEHOLDING CLAMP/TPM-377.jpg',
    products: [
      {
        name: 'TC Clamp Gasket - EPDM / SILICON / PTFE / TEFLON',
        spec: 'Color Coded Flanged & Unflanged Tri-Clamp Gaskets (1/2" to 12")',
        image: '/assets/images/products images/PIPEHOLDING CLAMP/TPM-377.jpg',
        link: '/product/epdm-tri-clamp-gasket'
      },
      {
        name: 'Flange Gasket & Envelope Seals',
        spec: 'PTFE Envelope Gaskets for SMS, DIN & ANSI Flanged Pipe Lines',
        image: '/assets/images/products images/PIPEHOLDING CLAMP/TPM-376.jpg',
        link: '/product/ptfe-tri-clamp-gasket'
      }
    ]
  },
  {
    id: 'customized-product',
    title: 'Customized Product',
    countBadge: '1 Product',
    description: 'Tailored sanitary fabrications engineered to client drawings and bespoke vessel requirements.',
    viewAllLink: '/product/ss-sanitary-pipe-spool',
    primaryProductLink: '/product/ss-sanitary-pipe-spool',
    heroImage: '/assets/images/products images/SS SLIGHT GLASS TC END/TPM-324.jpg',
    products: [
      {
        name: 'Large & Customized Size Sight Glass',
        spec: 'Custom Borosilicate & Toughened Sight Ports up to 16" Diameter',
        image: '/assets/images/products images/SS SLIGHT GLASS TC END/TPM-324.jpg',
        link: '/product/ss-sanitary-pipe-spool'
      }
    ]
  },
  {
    id: 'data-cooling-centre',
    title: 'Data Cooling Centre',
    countBadge: '7 Products',
    description: 'Ultra-reliable stainless sanitary components engineered for server immersion & liquid cooling loops.',
    viewAllLink: '/product/ss-sanitary-equal-tee',
    primaryProductLink: '/product/ss-sanitary-equal-tee',
    heroImage: '/assets/images/products images/SS 3PCS BALL VALVE TC END/TPM-370.jpg',
    products: [
      {
        name: 'TC Wing Clamp',
        spec: 'High-Torque Stainless Steel Quick-Release Clamps for Data Racks',
        image: '/assets/images/products images/SS MP PIPE/TC CLAMP/TPM-396.jpg',
        link: '/product/ss-tri-clamp-clamp'
      },
      {
        name: 'Equal Tee',
        spec: 'Equal Flow Distribution Manifold Tees for Coolant Distribution',
        image: '/assets/images/products images/SS EQUAL TEE/TPM-103.jpg',
        link: '/product/ss-sanitary-equal-tee'
      },
      {
        name: 'Elbow (ELBW)',
        spec: 'Short & Long Radius Low-Loss 90° Coolant Transfer Bends',
        image: '/assets/images/products images/SS SHORT ELBOW/TPM-119.jpg',
        link: '/product/ss-sanitary-90-bend'
      },
      {
        name: 'Butterfly Valve TC',
        spec: 'Quarter-Turn Tight Shutoff Valves for Data Loop Isolation',
        image: '/assets/images/products images/SS BUTTERFLY VALVE/TPM-226.jpg',
        link: '/product/ss-sanitary-butterfly-valve'
      },
      {
        name: 'TC Reducers',
        spec: 'Concentric & Eccentric Diameter Step-Down Coolant Reducers',
        image: '/assets/images/products images/SS CONCENTRIC REDUCER/TPM-122.jpg',
        link: '/product/ss-sanitary-concentric-reducer'
      },
      {
        name: 'Check Valve TC',
        spec: 'Zero Reverse Flow Non-Return Check Valves for Pump Loops',
        image: '/assets/images/products images/ss nrv tc end/TPM-238 - Copy.jpg',
        link: '/product/ss-sanitary-non-return-valve'
      },
      {
        name: '3 PCS Ball Valve TC',
        spec: 'In-Line Maintainable Full-Port Ball Valves for Server Immersion',
        image: '/assets/images/products images/SS 3PCS BALL VALVE TC END/TPM-370.jpg',
        link: '/product/ss-3-piece-ball-valve-tc'
      }
    ]
  },
  {
    id: 'semiconductor',
    title: 'Semi Conductor',
    countBadge: '1 Product',
    description: 'Ultra-high purity (UHP) fluid handling components for cleanroom and microelectronics fabrication.',
    viewAllLink: '/product/ss-316l-seamless-sanitary-tube',
    primaryProductLink: '/product/ss-316l-seamless-sanitary-tube',
    heroImage: '/assets/images/products images/SS CONCENTRIC REDUCER/TPM-123.jpg',
    products: [
      {
        name: 'Semi Conductor - Product Adapt',
        spec: 'High-Purity Electropolished Micro-Fitting Adapters (Ra < 0.25 µm)',
        image: '/assets/images/products images/SS CONCENTRIC REDUCER/TPM-123.jpg',
        link: '/product/ss-316l-seamless-sanitary-tube'
      }
    ]
  },
  {
    id: 'ba-ep-tubes-fittings',
    title: 'BA/EP Tubes & Fittings',
    countBadge: '4 Products',
    description: 'Bright Annealed (BA) & Electro Polished (EP) ultra-clean sanitary tubing and fittings.',
    viewAllLink: '/product/ss-316l-ep-pipe',
    primaryProductLink: '/product/ss-316l-ep-pipe',
    heroImage: '/assets/images/products images/SS EP PIPE/TPM-10.jpg',
    products: [
      {
        name: 'Bright Annealed (BA) Sanitary Tubes',
        spec: 'Hydrogen Atmosphere Annealed Mirror-Smooth Inner Bore',
        image: '/assets/images/products images/SS MP PIPE/TPM-15.jpg',
        link: '/product/ss-316l-mp-pipe'
      },
      {
        name: 'Electro Polished (EP) Sanitary Tubes',
        spec: 'ASTM A270-S2 Ultra-Clean EP Tubes (Ra ≤ 0.38 µm / 15 µin)',
        image: '/assets/images/products images/SS EP PIPE/TPM-10.jpg',
        link: '/product/ss-316l-ep-pipe'
      },
      {
        name: 'High Purity EP Sanitary Fittings',
        spec: 'Electropolished Bends, Tees and Ferrules with Sealed End Caps',
        image: '/assets/images/products images/SS TC BEND/TPM-178.jpg',
        link: '/product/ss-sanitary-90-bend'
      },
      {
        name: 'Ultra-Clean Tri-Clamp Valve Assemblies',
        spec: 'Electropolished 3-Piece Ball & Diaphragm Control Assemblies',
        image: '/assets/images/products images/SS 3PCS BALL VALVE TC END/TPM-371.jpg',
        link: '/product/ss-3-piece-ball-valve-tc'
      }
    ]
  }
];

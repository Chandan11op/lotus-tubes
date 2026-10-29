/**
 * Lotus Tubes - 3D Product Model Registry
 * Central authority governing 3D model availability, status, and verification.
 * 
 * Status types:
 * - 'verified': Procedural CAD-accurate 3D model matching physical dimensions and standards.
 * - 'illustrative': Visual conceptual 3D model showing general assembly or mechanism.
 * - 'unavailable': No genuine 3D model exists. Media viewers must fallback directly to authentic photographs.
 */

export const MODEL_REGISTRY = {
  // ============================================================
  // 1. STRAIGHT PIPES & TUBING
  // ============================================================
  'ss-316l-ep-pipe': {
    status: 'verified',
    component: 'SanitaryTube',
    title: 'SS 316L Electro Polished Sanitary Pipe',
    standard: 'ASTM A270-S2 / ASME BPE (Ra ≤ 0.38 µm EP)',
    verifiedFeatures: ['Hollow bore with wall thickness', 'Square cut orbital weld face']
  },
  'ss-304-ep-pipe': {
    status: 'verified',
    component: 'SanitaryTube',
    title: 'SS 304 Electro Polished Sanitary Pipe',
    standard: 'ASTM A270 (Ra ≤ 0.4 µm EP)',
    verifiedFeatures: ['Hollow bore with wall thickness', 'Square cut weld face']
  },
  'ss-316l-mp-pipe': {
    status: 'verified',
    component: 'SanitaryTube',
    title: 'SS 316L Mechanical Polished Sanitary Pipe',
    standard: 'ASTM A270 (Ra ≤ 0.8 µm MP)',
    verifiedFeatures: ['Mechanical brushed finish', 'Hollow tube geometry']
  },
  'ss-304-mp-pipe': {
    status: 'verified',
    component: 'SanitaryTube',
    title: 'SS 304 Mechanical Polished Sanitary Pipe',
    standard: 'ASTM A270 / BS 4825 (Ra ≤ 0.8 µm MP)',
    verifiedFeatures: ['Mechanical finish', 'Hollow tube geometry']
  },
  'ss-304-sanitary-pipe': {
    status: 'verified',
    component: 'SanitaryTube',
    title: 'SS 304 Sanitary Pipe',
    standard: 'ASTM A270 / DIN 11850',
    verifiedFeatures: ['Hollow cylinder body', 'Standard wall thickness']
  },
  'ss-316l-sanitary-pipe': {
    status: 'verified',
    component: 'SanitaryTube',
    title: 'SS 316L Sanitary Pipe',
    standard: 'ASTM A270 / ISO 2037',
    verifiedFeatures: ['Hollow cylinder body', 'Standard wall thickness']
  },
  'ss-304-seamless-sanitary-tube': {
    status: 'verified',
    component: 'SanitaryTube',
    title: 'SS 304 Seamless Sanitary Tube',
    standard: 'ASTM A269 / ASTM A270 Seamless',
    verifiedFeatures: ['Seamless cold drawn profile', 'Annealed & pickled/polished finish']
  },
  'ss-316l-seamless-sanitary-tube': {
    status: 'verified',
    component: 'SanitaryTube',
    title: 'SS 316L Seamless Sanitary Tube',
    standard: 'ASTM A269 / ASTM A270 Seamless Cold Drawn',
    verifiedFeatures: ['Seamless cold drawn profile', 'Bright annealed finish']
  },
  'ss-304-dairy-tube': {
    status: 'verified',
    component: 'SanitaryTube',
    title: 'SS 304 Dairy Tube',
    standard: 'DIN 11850 / BS 4825 Part 1',
    verifiedFeatures: ['Dairy hygienic finish', 'Hollow tube geometry']
  },

  // ============================================================
  // 2. BENDS & ELBOWS
  // ============================================================
  'ss-sanitary-90-bend': {
    status: 'verified',
    component: 'SanitaryBend90',
    title: 'SS 304 / SS 316L Sanitary 90° Bend',
    standard: 'ASTM A270 / ASME BPE 1.5D Centerline Radius',
    verifiedFeatures: [
      'Mandrel-bent 90-degree hollow torus arc',
      'Straight orbital weld tangents at both ports',
      'True inner bore with wall thickness',
      'Chamfered weld prep ends'
    ]
  },
  'ss-sanitary-45-bend': {
    status: 'verified',
    component: 'SanitaryBend45',
    title: 'SS 304 / SS 316L Sanitary 45° Bend',
    standard: 'ASTM A270 / ASME BPE 45-degree Weld Elbow',
    verifiedFeatures: [
      'Precision 45-degree hollow arc',
      'Straight inlet and outlet tangents',
      'Chamfered weld prep ends'
    ]
  },

  // ============================================================
  // 3. TEES & BRANCHES
  // ============================================================
  'ss-sanitary-equal-tee': {
    status: 'verified',
    component: 'SanitaryEqualTee',
    title: 'SS Sanitary Equal Tee (SS 304 & SS 316L)',
    standard: 'ASME BPE / 3A / BS 4825-2',
    verifiedFeatures: [
      'Continuous main run cylinder with open bore',
      'Perpendicular 90-degree branch',
      'Smooth weld reinforcement radius'
    ]
  },
  'ss-sanitary-reducing-tee': {
    status: 'verified',
    component: 'SanitaryReducingTee',
    title: 'SS Sanitary Reducing Tee',
    standard: 'ASME BPE / 3A Sanitary Standard',
    verifiedFeatures: [
      'Full diameter run with reduced branch port',
      'Hollow hygienic flow intersection'
    ]
  },

  // ============================================================
  // 4. REDUCERS
  // ============================================================
  'ss-sanitary-concentric-reducer': {
    status: 'verified',
    component: 'ConcentricReducer',
    title: 'SS Sanitary Concentric Reducer',
    standard: 'ASTM A270 / DIN 11852 Concentric',
    verifiedFeatures: [
      'Symmetric conical transition taper',
      'Straight cylindrical tangents at large and small ports',
      'Smooth bore without step-joints'
    ]
  },
  'ss-sanitary-eccentric-reducer': {
    status: 'verified',
    component: 'EccentricReducer',
    title: 'SS Sanitary Eccentric Reducer',
    standard: 'ASME BPE Flat-Bottom Self-Draining Reducer',
    verifiedFeatures: [
      'Self-draining flat bottom surface',
      'Asymmetric top sloping transition',
      'Straight cylindrical end tangents'
    ]
  },

  // ============================================================
  // 5. TRI-CLAMP COMPONENTS & UNIONS
  // ============================================================
  'ss-tri-clamp-ferrule': {
    status: 'verified',
    component: 'TriClampFerrule',
    title: 'SS Tri-Clamp Sanitary Weld Ferrule',
    standard: 'ASME BPE / BS 4825-3 Ferrule Profile',
    verifiedFeatures: [
      'Precision CNC-machined 14-degree clamp face',
      'Standard gasket alignment recess groove',
      'Straight cylindrical butt-weld tangent',
      'Interactive Short 14WMP vs Long L14AM toggle'
    ]
  },
  'ss-tri-clamp-clamp': {
    status: 'verified',
    component: 'TriClampClamp',
    title: 'Heavy Duty Sanitary Tri-Clamp & Wing Nut',
    standard: '3A Sanitary / ISO 2852 Compatible',
    verifiedFeatures: [
      'Hinged two-segment forged clamp band',
      'Internal 14-degree V-groove channel',
      'Swinging eyebolt and dual-wing nut',
      'Interactive Single-Pin vs Double-Pin toggle'
    ]
  },
  'ss-sms-union': {
    status: 'verified',
    component: 'SanitarySMSUnion',
    title: 'SS 304 / SS 316L Sanitary SMS Union Complete Assembly',
    standard: 'SMS 1145 Dairy Pipe Fittings Standard',
    verifiedFeatures: [
      'Four constituent parts: Male Weld Part, EPDM/PTFE Gasket, Weld Liner, SMS Slotted Nut',
      'Continuous hygienic flow bore',
      'SMS round nut with 6 spanner tightening slots',
      'Interactive Assembled vs 4-Part Exploded view toggle'
    ]
  },

  // ============================================================
  // 6. SANITARY GASKETS (ELASTOMER & FLUOROPOLYMER)
  // ============================================================
  'silicone-tri-clamp-gasket': {
    status: 'verified',
    component: 'TriClampGasket',
    title: 'Silicone Tri-Clamp Gasket (Platinum Cured)',
    standard: 'FDA 21 CFR 177.2600 & USP Class VI',
    verifiedFeatures: [
      'Molded flanged profile with dual locating beads',
      'Medical-grade translucent silicone finish',
      'Interactive 4-grade material selector'
    ]
  },
  'epdm-tri-clamp-gasket': {
    status: 'verified',
    component: 'TriClampGasket',
    title: 'EPDM Tri-Clamp Gasket (Food Grade)',
    standard: 'FDA 21 CFR 177.2600 Compliant',
    verifiedFeatures: [
      'Molded flanged profile with dual locating beads',
      'High-density carbon black EPDM elastomer finish',
      'Interactive 4-grade material selector'
    ]
  },
  'ptfe-tri-clamp-gasket': {
    status: 'verified',
    component: 'TriClampGasket',
    title: 'PTFE (Teflon) Tri-Clamp Gasket',
    standard: 'FDA 21 CFR 177.1550 & USP Class VI',
    verifiedFeatures: [
      'Solid virgin white machined fluoropolymer profile',
      'Dual locating beads for ferrule sealing face',
      'Interactive 4-grade material selector'
    ]
  },
  'viton-tri-clamp-gasket': {
    status: 'verified',
    component: 'TriClampGasket',
    title: 'Viton (FKM) Tri-Clamp Gasket',
    standard: 'FDA 21 CFR 177.2600',
    verifiedFeatures: [
      'High-temperature acid-resistant FKM fluoroelastomer',
      'Precision molded sealing beads',
      'Interactive 4-grade material selector'
    ]
  },

  // ============================================================
  // 7. VALVES (MANUAL & AUTOMATED)
  // ============================================================
  'ss-sanitary-butterfly-valve': {
    status: 'verified',
    component: 'SanitaryButterflyValve',
    title: 'SS 316L Sanitary Butterfly Valve',
    standard: '3A Sanitary / SMS / DIN Valve Dimensions',
    verifiedFeatures: [
      'Cylindrical sanitary valve body with Tri-Clamp ends',
      'Internal disc seat assembly',
      'Multi-position stainless squeeze/pull trigger handle',
      'Interactive Closed (0°) vs Open (90°) disc actuation'
    ]
  },
  'ss-3-piece-ball-valve-tc': {
    status: 'verified',
    component: 'SanitaryBallValve',
    title: 'SS 3-Piece Sanitary Ball Valve with TC End',
    standard: 'ISO 5211 / ASME BPE Cavity-Filled Valve Body',
    verifiedFeatures: [
      '3-piece bolted valve body with Tri-Clamp ends',
      '4x High-tensile stainless steel tie-bolts with hex nuts',
      'Quarter-turn lever handle with blue vinyl sleeve',
      'Interactive Closed (0°) vs Open (90°) ball actuation'
    ]
  },
  'pneumatic-sanitary-ball-valve': {
    status: 'verified',
    component: 'SanitaryPneumaticValve',
    title: 'Pneumatic Actuated Sanitary Ball Valve with TC End',
    standard: 'NAMUR / ISO 5211 Direct Mount Pneumatic Actuator',
    verifiedFeatures: [
      '3-piece bolted SS 316L body with Tri-Clamp ends',
      'ISO 5211 mounting bracket and drive stem',
      'Anodized dual-piston pneumatic rack & pinion actuator',
      'NAMUR solenoid interface pad with G 1/4" air ports',
      'Top position visual indicator dome (Yellow/Red)',
      'Interactive Closed (0°) vs Open (90°) pneumatic actuation'
    ]
  },
  'ss-316l-diaphragm-valve': {
    status: 'verified',
    component: 'SanitaryDiaphragmValve',
    title: 'SS 316L Sanitary Diaphragm Valve',
    standard: 'ASME BPE Weir-Type Zero-Deadleg Valve Body',
    verifiedFeatures: [
      'Precision investment cast weir body with TC ends',
      'Manual multi-turn stainless handwheel bonnet',
      'EPDM / PTFE diaphragm clamp assembly'
    ]
  },
  'ss-sanitary-non-return-valve': {
    status: 'verified',
    component: 'SanitaryCheckValve',
    title: 'SS Sanitary Non-Return / Check Valve',
    standard: '3A Sanitary Spring-Assisted Check Valve',
    verifiedFeatures: [
      'Two-piece clamp-body spring check valve',
      'Sanitary Tri-Clamp ends',
      'Full flow internal conical spring chamber'
    ]
  },
  'ss-sanitary-sampling-valve': {
    status: 'verified',
    component: 'SanitarySamplingValve',
    title: 'SS Sanitary Aseptic Sampling Valve',
    standard: 'Aseptic Sampling Standards / 3A',
    verifiedFeatures: [
      'Mini Tri-Clamp sanitary process connection',
      'Forged SS 316L valve chamber block',
      'Rotary screw actuator knob',
      'Bent downward sample discharge spout with hose barb',
      'Interactive Aseptic Sealed vs Sampling Draw toggle'
    ]
  },

  // ============================================================
  // 8. TANK CLEANING & CUSTOM FABRICATED ASSEMBLIES
  // ============================================================
  'ss-sanitary-spray-ball': {
    status: 'verified',
    component: 'SanitarySprayBall',
    title: 'SS Sanitary Rotary & Static Spray Ball',
    standard: 'CIP Clean-In-Place 360° Coverage Standards',
    verifiedFeatures: [
      'Hollow inlet tube with cotter-pin hole',
      'SS 316L mirror-polished spherical spray head',
      'CNC-drilled 360° jet orifices across 5 latitude bands',
      'Interactive Static Inspection vs Rotary 360° Clean toggle'
    ]
  },
  'ss-sanitary-pipe-spool': {
    status: 'verified',
    component: 'SanitaryPipeSpool',
    title: 'SS Sanitary Pipe Spool (Fabricated & Polished)',
    standard: 'ASME BPE / Custom Isometrics',
    verifiedFeatures: [
      'Continuous ASTM A270 SS 316L tube with hollow bore',
      'Dual orbital-welded Tri-Clamp ferrules with 14° clamp faces',
      'Passivated and ground orbital weld seams',
      'Interactive Standard (500mm) vs Extended (1000mm) toggle'
    ]
  },
  'ss-316l-fittings-range': {
    status: 'verified',
    component: 'SanitaryPipeSpool',
    title: 'SS 316L Sanitary Pipe Fittings Range Showcase',
    standard: 'BS 4825 / ASME BPE / 3A Standards',
    verifiedFeatures: [
      'Comprehensive showcase of orbital welded fittings and ferrules',
      'Mirror electro-polished finish Ra ≤ 0.38 µm'
    ]
  }
};

/**
 * Helper to check if a product has a verified procedural 3D model
 */
export function getProductModelStatus(product) {
  if (!product) return { status: 'unavailable', component: null };
  const key = product.id || product.slug;
  if (MODEL_REGISTRY[key]) {
    return MODEL_REGISTRY[key];
  }
  // Check by model3d field if present
  if (product.model3d) {
    const entry = Object.values(MODEL_REGISTRY).find(
      (m) => m.component === product.model3d && m.status === 'verified'
    );
    if (entry) return entry;
  }
  return { status: 'unavailable', component: null };
}

export function hasVerified3DModel(product) {
  const status = getProductModelStatus(product);
  return status.status === 'verified';
}

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
  // 1. Straight Pipes & Tubing
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
    standard: 'ASTM A270 / DIN 11850'
  },
  'ss-316l-sanitary-pipe': {
    status: 'verified',
    component: 'SanitaryTube',
    title: 'SS 316L Sanitary Pipe',
    standard: 'ASTM A270 / ISO 2037'
  },
  'ss-304-seamless-sanitary-tube': {
    status: 'verified',
    component: 'SanitaryTube',
    title: 'SS 304 Seamless Sanitary Tube',
    standard: 'ASTM A269 / ASTM A270 Seamless'
  },
  'ss-316l-seamless-sanitary-tube': {
    status: 'verified',
    component: 'SanitaryTube',
    title: 'SS 316L Seamless Sanitary Tube',
    standard: 'ASTM A269 / ASTM A270 Seamless Cold Drawn'
  },
  'ss-304-dairy-tube': {
    status: 'verified',
    component: 'SanitaryTube',
    title: 'SS 304 Dairy Tube',
    standard: 'DIN 11850 / BS 4825 Part 1'
  },

  // 2. Bends & Elbows
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

  // 3. Tees
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

  // 4. Reducers
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

  // 5. Tri-Clamp Components
  'ss-tri-clamp-ferrule': {
    status: 'verified',
    component: 'TriClampFerrule',
    title: 'SS Tri-Clamp Sanitary Weld Ferrule',
    standard: 'ASME BPE / BS 4825-3 Ferrule Profile',
    verifiedFeatures: [
      'Precision CNC-machined 14-degree clamp face',
      'Standard gasket alignment recess groove',
      'Straight cylindrical butt-weld tangent'
    ]
  },
  'ss-tri-clamp-clamp': {
    status: 'verified',
    component: 'TriClampClamp',
    title: 'Heavy Duty Sanitary Tri-Clamp & Wing Nut',
    standard: '3A Sanitary / ISO 2852 Compatible',
    verifiedFeatures: [
      'Hinged two-segment forged clamp band',
      'Brass / stainless wing nut and pivot bolt',
      '14-degree wedge angle interior profile'
    ]
  },

  // 6. Valves
  'ss-sanitary-butterfly-valve': {
    status: 'verified',
    component: 'SanitaryButterflyValve',
    title: 'SS 316L Sanitary Butterfly Valve',
    standard: '3A Sanitary / SMS / DIN Valve Dimensions',
    verifiedFeatures: [
      'Cylindrical sanitary valve body with Tri-Clamp ends',
      'Disc seat assembly',
      'Multi-position stainless squeeze/pull trigger handle'
    ]
  },
  'ss-3-piece-ball-valve-tc': {
    status: 'verified',
    component: 'SanitaryBallValve',
    title: 'SS 3-Piece Sanitary Ball Valve with TC End',
    standard: 'ISO 5211 / ASME BPE Cavity-Filled Valve Body',
    verifiedFeatures: [
      '3-piece bolted valve body with Tri-Clamp ends',
      'Internal spherical port ball',
      'Quarter-turn lever handle'
    ]
  },
  'pneumatic-sanitary-ball-valve': {
    status: 'verified',
    component: 'SanitaryPneumaticValve',
    title: 'Pneumatic Actuated Sanitary Ball Valve with TC End',
    standard: 'NAMUR / ISO 5211 Direct Mount Pneumatic Actuator',
    verifiedFeatures: [
      'Sanitary Tri-Clamp valve body',
      'Anodized dual-piston pneumatic rack & pinion actuator',
      'Position visual indicator dome'
    ]
  },
  'ss-316l-diaphragm-valve': {
    status: 'verified',
    component: 'SanitaryDiaphragmValve',
    title: 'SS 316L Sanitary Diaphragm Valve',
    standard: 'ASME BPE Weir-Type Zero-Deadleg Valve Body',
    verifiedFeatures: [
      'Precision investment cast weir body',
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
      'Sanitary Tri-Clamp ends'
    ]
  },

  // 7. Products WITHOUT genuine 3D models (MUST BE UNAVAILABLE)
  'ss-316l-fittings-range': { status: 'unavailable', component: null },
  'silicone-tri-clamp-gasket': { status: 'unavailable', component: null },
  'epdm-tri-clamp-gasket': { status: 'unavailable', component: null },
  'ptfe-tri-clamp-gasket': { status: 'unavailable', component: null },
  'viton-tri-clamp-gasket': { status: 'unavailable', component: null },
  'ss-sanitary-spray-ball': { status: 'unavailable', component: null },
  'ss-sms-union': { status: 'unavailable', component: null },
  'ss-tri-clamp-connection': { status: 'unavailable', component: null },
  'ss-sanitary-pipe-spool': { status: 'unavailable', component: null },
  'ss-sanitary-sampling-valve': { status: 'unavailable', component: null }
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


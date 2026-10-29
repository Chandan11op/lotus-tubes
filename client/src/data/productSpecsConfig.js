/**
 * Centralized Product Specification Configuration for Lotus Tubes B2B Quotations
 * Defines nominal sizes, outside diameters, wall thicknesses, units, and category standards.
 */

export const MATERIAL_GRADES = [
  { value: 'SS 316L', label: 'SS 316 / 316L (Pharma & High-Purity)' },
  { value: 'SS 304L', label: 'SS 304 / 304L (Food & Dairy Grade)' }
];

export const PIPE_TYPES = [
  { value: 'Electro Round Polish Pipe', label: 'Electro Round Polish Pipe (EP Ra ≤ 0.38µm)' },
  { value: 'Mechanical Polish Round Pipe', label: 'Mechanical Polish Round Pipe (MP Ra ≤ 0.8µm)' }
];

export const FITTING_TYPES = [
  { value: '90 Degree Sanitary Bend', label: '90° Sanitary Long Radius Bend' },
  { value: '45 Degree Sanitary Bend', label: '45° Sanitary Bend' },
  { value: 'Equal Tee', label: 'Sanitary Equal Tee' },
  { value: 'Reducing Tee', label: 'Sanitary Reducing Tee' },
  { value: 'Concentric Reducer', label: 'Concentric Reducer' },
  { value: 'Eccentric Reducer', label: 'Eccentric Reducer' }
];

export const TRI_CLAMP_TYPES = [
  { value: 'TC Ferrule Long/Short', label: 'Tri-Clamp Ferrule (Long / Short Weld)' },
  { value: 'TC Heavy Duty Clamp', label: 'Heavy Duty Single / Double Pin Clamp' },
  { value: 'SMS Union Complete Set', label: 'SMS 1145 Complete Union Set' },
  { value: 'DIN 11851 Union Set', label: 'DIN 11851 Sanitary Union Set' },
  { value: 'TC Blind End Cap', label: 'Tri-Clamp Blind Solid End Cap' }
];

export const VALVE_TYPES = [
  { value: 'Sanitary Butterfly Valve', label: 'Sanitary Butterfly Valve (Manual Pull Handle)' },
  { value: '3-Piece Sanitary Ball Valve', label: '3-Piece Full Bore Ball Valve (TC Ends)' },
  { value: 'Sanitary Diaphragm Valve', label: 'Zero Dead-Leg Sanitary Diaphragm Valve' },
  { value: 'Sanitary Sampling Valve', label: 'Aseptic Sampling Valve' },
  { value: 'Pneumatic Actuated Valve', label: 'Pneumatic Actuated Control Valve' }
];

export const NOMINAL_SIZES = [
  { nominal: '1/2 inch', odMm: '12.7 mm', value: '1/2" (12.7mm OD)' },
  { nominal: '3/4 inch', odMm: '19.05 mm', value: '3/4" (19.05mm OD)' },
  { nominal: '1 inch', odMm: '25.4 mm', value: '1" (25.4mm OD)' },
  { nominal: '1½ inch', odMm: '38.1 mm', value: '1½" (38.1mm OD)' },
  { nominal: '2 inch', odMm: '50.8 mm', value: '2" (50.8mm OD)' },
  { nominal: '2½ inch', odMm: '63.5 mm', value: '2½" (63.5mm OD)' },
  { nominal: '3 inch', odMm: '76.3 mm', value: '3" (76.3mm OD)' },
  { nominal: '4 inch', odMm: '101.6 mm', value: '4" (101.6mm OD)' },
  { nominal: '6 inch', odMm: '152.3 mm', value: '6" (152.3mm OD)' },
  { nominal: '8 inch', odMm: '203 mm', value: '8" (203mm OD)' },
  { nominal: 'Custom', odMm: 'Custom', value: 'Custom Size' }
];

export const WALL_THICKNESSES = [
  { value: '1.65 mm', label: '1.65 mm (16 SWG / Standard ASME BPE)' },
  { value: '2.00 mm', label: '2.00 mm (14 SWG)' },
  { value: '2.50 mm', label: '2.50 mm (Heavy Duty)' },
  { value: '2.77 mm', label: '2.77 mm (Schedule 10S)' },
  { value: '3.00 mm', label: '3.00 mm (High Pressure)' },
  { value: 'Custom', label: 'Custom Thickness' }
];

export const UNITS_OF_MEASUREMENT = [
  { value: 'Meter', label: 'Meter (mtr)', symbol: 'mtr' },
  { value: 'Foot', label: 'Foot (ft)', symbol: 'ft' },
  { value: 'Number', label: 'Number (nos)', symbol: 'nos' },
  { value: 'Pieces', label: 'Pieces (pcs)', symbol: 'pcs' },
  { value: 'Set', label: 'Set', symbol: 'set' }
];

export const CATEGORY_STANDARDS = {
  pipes: [
    { value: 'ASTM A270', label: 'ASTM A270 (Sanitary Tubing Specification)' },
    { value: 'ASTM A269', label: 'ASTM A269 (General Corrosion & Pressure Tubing)' },
    { value: 'Custom', label: 'Custom Standard / Client Drawing' }
  ],
  fittings: [
    { value: 'BS 4825', label: 'BS 4825 (Stainless Steel Tubes and Fittings for Food Industry)' },
    { value: 'ISO', label: 'ISO 2037 / ISO 2852 (Stainless Steel Hygienic Fittings)' },
    { value: '3-A', label: '3-A Sanitary Standards (Dairy, Food and Beverage)' },
    { value: 'SMS', label: 'SMS 1145 (Swedish Milk Standard Couplings & Bends)' },
    { value: 'DIN', label: 'DIN 11852 / DIN 11850 (Fittings for Food & Chemical Industry)' },
    { value: 'IPF', label: 'IPF (Imperial Pipe Fittings Standard)' },
    { value: 'Custom', label: 'Custom Standard / Client Drawing' }
  ],
  valves: [
    { value: '3-A', label: '3-A Sanitary Standards (Sanitary Valves for Food & Dairy)' },
    { value: 'DIN', label: 'DIN 11851 / DIN EN 13348 (Sanitary Process Valves)' },
    { value: 'ASME BPE', label: 'ASME BPE (Bioprocessing Equipment Standard)' },
    { value: 'SMS', label: 'SMS (Hygienic Valves with SMS Connections)' },
    { value: 'IDF', label: 'IDF (International Dairy Federation Valve Standard)' },
    { value: 'Custom', label: 'Custom Standard / Client Specification' }
  ],
  general: [
    { value: 'ASME BPE', label: 'ASME BPE' },
    { value: 'ASTM A270', label: 'ASTM A270' },
    { value: 'DIN 11850', label: 'DIN 11850' },
    { value: 'SMS 1145', label: 'SMS 1145' },
    { value: 'Custom', label: 'Custom Standard' }
  ]
};

export function getSpecsForCategory(categorySlugOrName = '') {
  const norm = (categorySlugOrName || '').toLowerCase();

  if (norm.includes('pipe') || norm.includes('tube')) {
    return {
      categoryKey: 'pipes',
      hasThickness: true,
      hasFinish: true,
      itemTypes: PIPE_TYPES,
      standards: CATEGORY_STANDARDS.pipes,
      defaultUnit: 'Meter'
    };
  }

  if (norm.includes('fitting') || norm.includes('bend') || norm.includes('tee') || norm.includes('reducer')) {
    return {
      categoryKey: 'fittings',
      hasThickness: true,
      hasFinish: false,
      itemTypes: FITTING_TYPES,
      standards: CATEGORY_STANDARDS.fittings,
      defaultUnit: 'Pieces'
    };
  }

  if (norm.includes('valve')) {
    return {
      categoryKey: 'valves',
      hasThickness: false,
      hasFinish: false,
      itemTypes: VALVE_TYPES,
      standards: CATEGORY_STANDARDS.valves,
      defaultUnit: 'Pieces'
    };
  }

  if (norm.includes('tri-clamp') || norm.includes('clamp') || norm.includes('ferrule') || norm.includes('union')) {
    return {
      categoryKey: 'fittings',
      hasThickness: false,
      hasFinish: false,
      itemTypes: TRI_CLAMP_TYPES,
      standards: CATEGORY_STANDARDS.fittings,
      defaultUnit: 'Pieces'
    };
  }

  return {
    categoryKey: 'general',
    hasThickness: true,
    hasFinish: true,
    itemTypes: PIPE_TYPES,
    standards: CATEGORY_STANDARDS.general,
    defaultUnit: 'Pieces'
  };
}


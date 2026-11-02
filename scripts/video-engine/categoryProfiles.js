/**
 * Lotus Tubes - Category Video Profiles & Animation Directives
 * Defines intelligent, category-specific cinematography, camera orbits,
 * lighting sweeps, and macro focus areas for industrial stainless steel products.
 */

export const CATEGORY_PROFILES = {
  'sanitary-pipes': {
    categoryName: 'Sanitary Pipes & Tubes',
    focus: 'Axial length reveal, ultra-smooth bore finish (Ra < 0.38µm), uniform wall thickness, square ends',
    orbitSpeed: 0.8,
    elevation: 8,
    lightingStyle: 'linear-specular',
    macroFocus: 'Electropolished bore reflection & ASTM A270 heat number stamp',
    scenes: [
      { name: 'Reveal', duration: 2.0, effect: 'axial-reveal', zoomStart: 1.15, zoomEnd: 1.0 },
      { name: 'Camera Orbit', duration: 3.5, effect: '360-rotation', angleRate: 1.0 },
      { name: 'Macro Detail', duration: 2.5, effect: 'bore-macro', zoom: 1.45, panX: 0.15 },
      { name: 'Hero Shot', duration: 1.5, effect: 'lighting-gleam' },
      { name: 'Brand Outro', duration: 1.5, effect: 'title-card' }
    ]
  },
  'sanitary-fittings': {
    categoryName: 'Sanitary Pipe Fittings (Bends, Tees, Reducers)',
    focus: 'Smooth continuous radius, unwrinkled bend curvature, weld bevels, branched fluid flow intersection',
    orbitSpeed: 1.0,
    elevation: 14,
    lightingStyle: 'radial-contour',
    macroFocus: 'Precision seamless orbital weld, Ra < 0.4µm radiused bend interior',
    scenes: [
      { name: 'Reveal', duration: 2.0, effect: 'scale-up-fade', zoomStart: 0.95, zoomEnd: 1.0 },
      { name: 'Camera Orbit', duration: 3.5, effect: '360-rotation', angleRate: 1.0 },
      { name: 'Macro Detail', duration: 2.5, effect: 'bend-throat-macro', zoom: 1.4, panY: -0.1 },
      { name: 'Hero Shot', duration: 1.5, effect: 'lighting-gleam' },
      { name: 'Brand Outro', duration: 1.5, effect: 'title-card' }
    ]
  },
  'tri-clamp': {
    categoryName: 'Tri-Clamp Fittings & Components',
    focus: 'Precision machined sealing face, gasket groove containment, clamp locking bolt & wing nut',
    orbitSpeed: 1.0,
    elevation: 18,
    lightingStyle: 'metallic-rim',
    macroFocus: 'Micro-grooved ferrule face, heavy-duty hinge pin & union threads',
    scenes: [
      { name: 'Reveal', duration: 2.0, effect: 'reveal-dolly-in', zoomStart: 0.92, zoomEnd: 1.0 },
      { name: 'Camera Orbit', duration: 3.5, effect: '360-rotation', angleRate: 1.0 },
      { name: 'Macro Detail', duration: 2.5, effect: 'clamp-ferrule-macro', zoom: 1.5, panX: -0.12 },
      { name: 'Hero Shot', duration: 1.5, effect: 'lighting-gleam' },
      { name: 'Brand Outro', duration: 1.5, effect: 'title-card' }
    ]
  },
  'manual-valves': {
    categoryName: 'Hygienic Manual Valves',
    focus: 'Mechanical body rotation, seat/seal alignment, multi-position handle orientation, fluid flow path',
    orbitSpeed: 0.9,
    elevation: 12,
    lightingStyle: 'studio-high-key',
    macroFocus: 'Mirror-polished valve disc, EPDM/PTFE seat, zero dead-leg geometry',
    scenes: [
      { name: 'Reveal', duration: 2.0, effect: 'dramatic-reveal', zoomStart: 0.95, zoomEnd: 1.0 },
      { name: 'Camera Orbit', duration: 3.5, effect: '360-rotation', angleRate: 1.0 },
      { name: 'Macro Detail', duration: 2.5, effect: 'valve-seat-macro', zoom: 1.42, panY: 0.08 },
      { name: 'Hero Shot', duration: 1.5, effect: 'lighting-gleam' },
      { name: 'Brand Outro', duration: 1.5, effect: 'title-card' }
    ]
  },
  'pneumatic-valves': {
    categoryName: 'Pneumatic Actuated Valves',
    focus: 'Stainless steel actuator cylinder, visual position indicator, solenoid interface, tri-clamp body',
    orbitSpeed: 0.85,
    elevation: 15,
    lightingStyle: 'brushed-actuator-specular',
    macroFocus: 'Pneumatic port connections, feedback switch head, optical open/close indicator',
    scenes: [
      { name: 'Reveal', duration: 2.0, effect: 'actuator-pan-down', zoomStart: 1.1, zoomEnd: 1.0 },
      { name: 'Camera Orbit', duration: 3.5, effect: '360-rotation', angleRate: 1.0 },
      { name: 'Macro Detail', duration: 2.5, effect: 'actuator-stem-macro', zoom: 1.38, panY: -0.15 },
      { name: 'Hero Shot', duration: 1.5, effect: 'lighting-gleam' },
      { name: 'Brand Outro', duration: 1.5, effect: 'title-card' }
    ]
  },
  'gaskets': {
    categoryName: 'Sanitary Gaskets & Seals',
    focus: 'Elastomer formulation (Silicone, EPDM, PTFE, Viton), compression beads, FDA/USP Class VI compliance',
    orbitSpeed: 1.2,
    elevation: 25,
    lightingStyle: 'soft-studio',
    macroFocus: 'Precision molded flange lip, micro-stamped batch code, material finish',
    scenes: [
      { name: 'Reveal', duration: 2.0, effect: 'fade-in', zoomStart: 0.9, zoomEnd: 1.0 },
      { name: 'Camera Orbit', duration: 3.5, effect: '360-rotation', angleRate: 1.2 },
      { name: 'Macro Detail', duration: 2.5, effect: 'seal-bead-macro', zoom: 1.6 },
      { name: 'Hero Shot', duration: 1.5, effect: 'lighting-gleam' },
      { name: 'Brand Outro', duration: 1.5, effect: 'title-card' }
    ]
  },
  'tank-cleaning': {
    categoryName: 'Tank Cleaning & Tank Accessories',
    focus: 'Rotary spray coverage orifices, double ball-bearing race, hygienic self-cleaning drain holes',
    orbitSpeed: 1.1,
    elevation: 15,
    lightingStyle: 'high-contrast-spherical',
    macroFocus: 'Precision laser-drilled spray nozzle slots & CIP fluid lubrication ports',
    scenes: [
      { name: 'Reveal', duration: 2.0, effect: 'reveal-dolly-in', zoomStart: 0.92, zoomEnd: 1.0 },
      { name: 'Camera Orbit', duration: 3.5, effect: '360-rotation', angleRate: 1.1 },
      { name: 'Macro Detail', duration: 2.5, effect: 'spray-slot-macro', zoom: 1.5, panY: 0.1 },
      { name: 'Hero Shot', duration: 1.5, effect: 'lighting-gleam' },
      { name: 'Brand Outro', duration: 1.5, effect: 'title-card' }
    ]
  },
  'custom-assemblies': {
    categoryName: 'Custom Manifolds & Spools',
    focus: 'Custom spool geometry, TIG purge welds, multi-port branch orientation, certified pressure boundary',
    orbitSpeed: 0.8,
    elevation: 10,
    lightingStyle: 'linear-specular',
    macroFocus: 'Robotic autogenous orbital weld seam, full boroscopic video inspection quality',
    scenes: [
      { name: 'Reveal', duration: 2.0, effect: 'axial-reveal', zoomStart: 1.1, zoomEnd: 1.0 },
      { name: 'Camera Orbit', duration: 3.5, effect: '360-rotation', angleRate: 0.9 },
      { name: 'Macro Detail', duration: 2.5, effect: 'weld-seam-macro', zoom: 1.45, panX: 0.1 },
      { name: 'Hero Shot', duration: 1.5, effect: 'lighting-gleam' },
      { name: 'Brand Outro', duration: 1.5, effect: 'title-card' }
    ]
  }
};

export const getCategoryProfile = (categorySlug) => {
  return CATEGORY_PROFILES[categorySlug] || CATEGORY_PROFILES['sanitary-fittings'];
};

export default CATEGORY_PROFILES;

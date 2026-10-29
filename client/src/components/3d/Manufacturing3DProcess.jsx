import React, { useState } from 'react';
import InteractiveCanvas from './InteractiveCanvas.jsx';

/**
 * Manufacturing3DProcess
 * Interactive step-by-step 3D technical showcase of Lotus Tubes' sanitary manufacturing process:
 * 1. Raw Tube Forming & Orbital Welding
 * 2. Precision Mandrel Cold Bending
 * 3. CNC Facing & Ferrule Attachment
 * 4. Electrochemical Polishing (EP Ra ≤ 0.38 µm)
 * 5. Boroscope Inspection & Quality Certification (EN 10204 3.1)
 */
export default function Manufacturing3DProcess() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'forming',
      stepNum: '01',
      title: 'Precision Forming & Sizing',
      badge: 'ASTM A270 Spec',
      desc: 'High-grade SS 316L strip is continuously roll-formed and automatically TIG purge welded with inert shielding gas, guaranteeing 100% full-penetration weld seams without internal oxidation.',
      stat: 'Weld Factor 1.0',
      sampleProduct: {
        name: 'Formed Sanitary Tube',
        model3d: 'SanitaryTube',
        material: 'SS 316L',
        image: '/assets/images/products/pipes/welded/ss-sanitary-welded-tube-001.jpg'
      }
    },
    {
      id: 'bending',
      stepNum: '02',
      title: 'Mandrel Cold Bending',
      badge: 'Smooth 1.5D Radius',
      desc: 'Tubes undergo CNC mandrel cold bending to achieve standard 90° and 45° bends with minimal ovality and zero interior wrinkling, preserving uniform laminar flow cross-sections.',
      stat: 'Ovality < 1.5%',
      sampleProduct: {
        name: 'Cold-Bent Sanitary 90° Bend',
        model3d: 'SanitaryBend90',
        material: 'SS 316L',
        image: '/assets/images/products/fittings/bends-and-elbows/ss-sanitary-bend-elbow-010.jpg'
      }
    },
    {
      id: 'branching',
      stepNum: '03',
      title: 'Hydraulic Tee Pulling & Machining',
      badge: 'Seamless Neck Collar',
      desc: 'Tees and reducers are hydraulically pulled with polished radiuses or CNC machined from forged billets, ensuring completely smooth sanitary internal geometry free from bacterial crevices.',
      stat: 'Crevice-Free Geometry',
      sampleProduct: {
        name: 'Pulled Sanitary Equal Tee',
        model3d: 'SanitaryEqualTee',
        material: 'SS 316L',
        image: '/assets/images/products/fittings/tees/ss-sanitary-tee-fitting-010.jpg'
      }
    },
    {
      id: 'electropolish',
      stepNum: '04',
      title: 'Electrochemical Polishing (EP)',
      badge: 'Ra ≤ 0.38 µm (15 µin)',
      desc: 'Immersion in specialized temperature-controlled electrolyte baths under electrical current dissolves microscopic surface peaks, producing a passive chromium-rich oxide film with ultra-low roughness.',
      stat: 'Cr/Fe Ratio > 1.5',
      sampleProduct: {
        name: 'Electro Polished Tri-Clamp Ferrule',
        model3d: 'TriClampFerrule',
        material: 'SS 316L EP',
        image: '/assets/images/products/tri-clamp/ferrules/ss-tri-clamp-ferrule-001.jpg'
      }
    },
    {
      id: 'quality',
      stepNum: '05',
      title: '100% Quality & Boroscope QC',
      badge: 'EN 10204 3.1 Certified',
      desc: 'Every batch undergoes video boroscope internal visual inspection, Mitutoyo surface roughness profilometry, positive material identification (PMI), and hydro testing.',
      stat: 'Zero-Defect Standard',
      sampleProduct: {
        name: 'Assembled Sanitary Butterfly Valve',
        model3d: 'SanitaryButterflyValve',
        material: 'SS 316L Tested',
        image: '/assets/images/products/valves/butterfly-valves/ss-sanitary-butterfly-valve-001.jpg'
      }
    }
  ];

  const current = steps[activeStep];

  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden" aria-label="Manufacturing Process">
      <div className="site-container">
        {/* Section Heading */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-widest bg-sky-950/80 px-3 py-1 rounded-full border border-sky-800">
            Hygienic Engineering Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 text-white">
            From Raw Stainless Steel to Certified Sanitary Integrity
          </h2>
          <p className="text-slate-400 mt-2 text-base">
            Explore the 5-stage precision manufacturing sequence that guarantees biofilm resistance and regulatory compliance across pharmaceutical, dairy, and food process systems.
          </p>
        </div>

        {/* Step Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 border-b border-slate-800">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left whitespace-nowrap transition-all border ${
                activeStep === idx
                  ? 'bg-sky-500/10 border-sky-500 text-white shadow-lg shadow-sky-500/10'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${activeStep === idx ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                {s.stepNum}
              </span>
              <span className="text-sm font-semibold">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Main Stage Grid: Interactive 3D Model on Left, Technical Description on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-800/50 rounded-2xl p-6 sm:p-8 border border-slate-700/60 shadow-2xl">
          {/* Left: 3D Stage */}
          <div className="lg:col-span-7">
            <InteractiveCanvas
              product={current.sampleProduct}
              fallbackImage={current.sampleProduct.image}
              height="380px"
              enableFloat={true}
            />
          </div>

          {/* Right: Technical Details & Metrics */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                Step {current.stepNum} of 05
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-700/80 rounded text-slate-200">
                {current.badge}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white tracking-tight mb-3">
              {current.title}
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {current.desc}
            </p>

            {/* Quality Metric Highlight Box */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Quality Metric</div>
                <div className="text-lg font-bold text-emerald-400">{current.stat}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Applicable Standard</div>
                <div className="text-xs font-medium text-slate-200">ASTM A270 • ASME BPE</div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                disabled={activeStep === 0}
                onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                &larr; Previous Stage
              </button>
              <button
                type="button"
                disabled={activeStep === steps.length - 1}
                onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-sky-500 hover:bg-sky-400 text-white disabled:opacity-40 transition-colors shadow-md shadow-sky-500/20"
              >
                Next Stage &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

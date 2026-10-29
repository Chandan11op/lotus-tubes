import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Float } from '@react-three/drei';
import SanitaryTube from './SanitaryTube.jsx';
import SanitaryBend90 from './SanitaryBend90.jsx';
import SanitaryButterflyValve from './SanitaryButterflyValve.jsx';
import TriClampFerrule from './TriClampFerrule.jsx';
import TriClampClamp from './TriClampClamp.jsx';

/**
 * Hero3DFloatingFitting
 * A high-impact 3D interactive hero showcase component for the Lotus Tubes Homepage
 * Allows visitors to interactively rotate, inspect, and toggle between iconic sanitary components
 */
export default function Hero3DFloatingFitting() {
  const [activeModel, setActiveModel] = useState('bend'); // 'bend', 'tube', 'valve', 'clamp', 'ferrule'
  const [isInteractive, setIsInteractive] = useState(false);

  const modelSpecs = {
    bend: {
      title: 'SS 316L 90° Sanitary Bend',
      subtitle: 'ASTM A270 / ASME BPE 1.5D Centerline Radius',
      finish: 'EP Ra ≤ 0.38 µm Internal'
    },
    tube: {
      title: 'SS 316L Electro Polished Sanitary Tube',
      subtitle: 'ASTM A270 Welded & Seamless High-Purity Tubing',
      finish: 'Mirror EP Ra ≤ 0.38 µm'
    },
    valve: {
      title: 'SS 316L Sanitary Butterfly Valve',
      subtitle: 'Multi-Position Pull Handle with Silicone / EPDM Seal',
      finish: 'Hygienic Tri-Clamp Ends'
    },
    clamp: {
      title: 'Heavy Duty Tri-Clamp & Wing Nut',
      subtitle: 'SS 304 High-Pressure Clamp Coupling Assembly',
      finish: 'Forged 14° Taper Flange Clamp'
    },
    ferrule: {
      title: 'ASME BPE Sanitary Weld Ferrule',
      subtitle: 'Precision CNC Machined Clamp Face & Gasket Groove',
      finish: 'Orbital Weld Tangent'
    }
  };

  const currentSpec = modelSpecs[activeModel] || modelSpecs.bend;

  return (
    <div className="hero-3d-card relative w-full h-[380px] sm:h-[440px] md:h-[500px] lg:h-[580px] xl:h-[620px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-[#10263d] to-slate-950 border border-slate-700/60 shadow-2xl flex flex-col">
      {/* Top Floating Badge & Specs */}
      <div className="absolute top-3.5 left-3.5 right-3.5 sm:top-4 sm:left-4 sm:right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg border border-slate-700/70 text-left pointer-events-auto max-w-[80%] sm:max-w-none shadow-lg">
          <div className="text-[10.5px] sm:text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            3D Interactive Digital Twin
          </div>
          <div className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate">
            {currentSpec.title}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-300 truncate">
            {currentSpec.subtitle} • <span className="text-sky-300 font-medium">{currentSpec.finish}</span>
          </div>
        </div>

        <div className="hidden sm:block bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/70 text-[11px] text-slate-300 pointer-events-auto shadow-lg">
          Drag to inspect • Scroll to zoom
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="w-full flex-1 relative touch-none">
        <Canvas
          shadows
          camera={{ position: [2.5, 1.8, 3.8], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          onPointerDown={() => setIsInteractive(true)}
        >
          <ambientLight intensity={1.1} />
          <directionalLight position={[6, 9, 6]} intensity={2.0} castShadow shadow-mapSize={1024} />
          <directionalLight position={[-6, 4, -4]} intensity={1.2} color="#38bdf8" />
          <directionalLight position={[0, -4, 4]} intensity={0.8} color="#e0f2fe" />
          <pointLight position={[3, 3, 3]} intensity={0.6} color="#ffffff" />

          <Suspense fallback={null}>
            <Stage environment={null} intensity={0.8} adjustCamera={false}>
              <Float
                speed={isInteractive ? 0.5 : 1.8}
                rotationIntensity={isInteractive ? 0.2 : 0.6}
                floatIntensity={isInteractive ? 0.3 : 0.8}
              >
                {activeModel === 'bend' && <SanitaryBend90 autoRotate={!isInteractive} />}
                {activeModel === 'tube' && <SanitaryTube autoRotate={!isInteractive} />}
                {activeModel === 'valve' && <SanitaryButterflyValve autoRotate={!isInteractive} />}
                {activeModel === 'clamp' && <TriClampClamp autoRotate={!isInteractive} />}
                {activeModel === 'ferrule' && <TriClampFerrule autoRotate={!isInteractive} />}
              </Float>
            </Stage>
          </Suspense>

          <OrbitControls
            autoRotate={!isInteractive}
            autoRotateSpeed={1.4}
            enablePan={false}
            minDistance={2.0}
            maxDistance={6.5}
            enableDamping
            dampingFactor={0.06}
          />
        </Canvas>
      </div>

      {/* Bottom Component Selector Pills */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10 flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto py-1 px-1.5 sm:px-2 bg-slate-950/85 backdrop-blur-md rounded-xl border border-slate-800 shadow-xl">
        {[
          { id: 'bend', label: '90° Bend' },
          { id: 'tube', label: 'EP Sanitary Tube' },
          { id: 'valve', label: 'Butterfly Valve' },
          { id: 'ferrule', label: 'TC Ferrule' },
          { id: 'clamp', label: 'Heavy Duty Clamp' }
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveModel(item.id)}
            className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium rounded-lg transition-all whitespace-nowrap min-h-[32px] sm:min-h-[36px] ${
              activeModel === item.id
                ? 'bg-sky-500 text-white font-semibold shadow-md shadow-sky-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

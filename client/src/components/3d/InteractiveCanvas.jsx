import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Float } from '@react-three/drei';
import StudioEnvironment from './StudioEnvironment.jsx';
import ModelSelector from './ModelSelector.jsx';
import ProductImage from '../common/ProductImage.jsx';

/**
 * Interactive 3D Canvas Viewer for Lotus Tubes
 * Features:
 * - Offline HDR studio environment for physically accurate stainless steel reflections
 * - Smooth OrbitControls with damping and user-controlled inspection
 * - Respects prefers-reduced-motion
 * - Auto-pauses rotation on user interaction
 * - Graceful fallback to genuine product photograph on WebGL failure
 */
export default function InteractiveCanvas({
  product,
  fallbackImage,
  className = '',
  height = '420px',
  enableFloat = false
}) {
  const [autoRotate, setAutoRotate] = useState(false);
  const [hasWebGLError, setHasWebGLError] = useState(false);
  const controlsRef = useRef();

  useEffect(() => {
    // Check user's motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setAutoRotate(false);
    }
  }, []);

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const toggleRotate = () => {
    setAutoRotate(prev => !prev);
  };

  if (hasWebGLError) {
    return (
      <div className={`relative overflow-hidden bg-slate-50 flex items-center justify-center ${className}`} style={{ height }}>
        <ProductImage
          src={product?.image || fallbackImage}
          alt={product?.name || 'Lotus Tubes Product'}
          aspectRatio="auto"
          className="w-full h-full object-contain"
        />
        <div className="absolute bottom-3 left-3 bg-slate-900/80 text-white text-xs px-2.5 py-1 rounded backdrop-blur-sm">
          High-Resolution Studio Photograph
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 rounded-xl select-none ${className}`} style={{ height }}>
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [2.5, 2.0, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onError={() => setHasWebGLError(true)}
        onPointerDown={() => setAutoRotate(false)}
      >
        <StudioEnvironment />

        <ambientLight intensity={1.1} />
        <directionalLight position={[5, 8, 5]} intensity={2.0} castShadow shadow-mapSize={1024} />
        <directionalLight position={[-5, 3, -5]} intensity={1.2} color="#93c5fd" />
        <directionalLight position={[0, -3, 3]} intensity={0.7} color="#f8fafc" />
        <pointLight position={[2, 2, 2]} intensity={0.5} />

        <Suspense fallback={null}>
          <Stage environment={null} intensity={0.7} adjustCamera={false}>
            {enableFloat ? (
              <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
                <ModelSelector product={product} autoRotate={autoRotate} />
              </Float>
            ) : (
              <ModelSelector product={product} autoRotate={autoRotate} />
            )}
          </Stage>
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          autoRotate={autoRotate}
          autoRotateSpeed={1.2}
          rotateSpeed={0.7}
          enablePan={false}
          minDistance={1.8}
          maxDistance={7.0}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>

      {/* Floating Control Toolbar */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-10 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-200/80 shadow-md">
        <button
          type="button"
          onClick={toggleRotate}
          className="px-2 py-1 text-xs font-medium text-slate-700 hover:text-sky-600 hover:bg-slate-100 rounded transition-colors"
          title={autoRotate ? 'Pause 360° Rotation' : 'Resume 360° Rotation'}
        >
          {autoRotate ? '⏸ Pause' : '▶ Rotate'}
        </button>

        <span className="w-px h-3.5 bg-slate-200" />

        <button
          type="button"
          onClick={handleReset}
          className="px-2 py-1 text-xs font-medium text-slate-700 hover:text-sky-600 hover:bg-slate-100 rounded transition-colors"
          title="Reset Camera Angle"
        >
          ↺ Reset
        </button>

        <span className="w-px h-3.5 bg-slate-200" />

        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-1">
          3D Interactive
        </span>
      </div>

      {/* Spec Badge */}
      <div className="absolute top-3 right-3 z-10 bg-slate-900/85 text-white text-[11px] font-medium px-2.5 py-1 rounded-md backdrop-blur-sm shadow-sm">
        SS 316L / 304 Sanitary CAD
      </div>
    </div>
  );
}

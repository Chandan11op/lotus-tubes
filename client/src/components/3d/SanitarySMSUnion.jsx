import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * Procedural 3D Sanitary SMS Union Complete (SMS 1145)
 * Comprises all 4 authentic constituent components:
 * 1. Male Threaded Weld Part (Weld neck + round threaded body)
 * 2. Food-grade Elastomer Gasket Ring (EPDM / Silicone)
 * 3. Weld Liner Part (Hygienic spherical/flat mating face + weld neck)
 * 4. Slotted Round SMS Union Nut (Milled spanner cutouts)
 * 
 * Features:
 * - Real assembly relationships with continuous hollow bore
 * - Interactive Exploded View / Assembled View toggle
 */
export default function SanitarySMSUnion({
  pipeRadius = 0.62,
  wallThickness = 0.08,
  initialExploded = false,
  autoRotate = false
}) {
  const [isExploded, setIsExploded] = useState(initialExploded);
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  const innerRadius = pipeRadius - wallThickness;
  const nutOuterRadius = pipeRadius + 0.36;

  // Offsets for Exploded vs Assembled views
  const maleX = isExploded ? -1.3 : -0.32;
  const gasketX = isExploded ? -0.42 : -0.01;
  const linerX = isExploded ? 0.45 : 0.28;
  const nutX = isExploded ? 1.45 : 0.05;

  return (
    <group ref={groupRef} rotation={[0.3, 0.4, 0]}>
      {/* Central Assembly Alignment Guideline (when exploded) */}
      {isExploded && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([-2.2, 0, 0, 2.2, 0, 0])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineDashedMaterial color="#0284c7" dashSize={0.1} gapSize={0.06} />
        </line>
      )}

      {/* 1. MALE PART (Left) */}
      <group position={[maleX, 0, 0]}>
        {/* Weld Neck (Tube) */}
        <mesh position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[pipeRadius, pipeRadius, 0.6, 36, 1, true]} />
          <SanitaryMaterial finish="ep" color="#f1f5f9" />
        </mesh>
        {/* Male Threaded Head */}
        <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[pipeRadius + 0.16, pipeRadius + 0.16, 0.32, 36, 1, true]} />
          <SanitaryMaterial finish="mp" color="#e2e8f0" />
        </mesh>
        {/* External Thread Ribs */}
        {[-0.05, 0.02, 0.09, 0.16].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[pipeRadius + 0.165, 0.022, 10, 36]} />
            <SanitaryMaterial finish="mp" color="#cbd5e1" />
          </mesh>
        ))}
        {/* End Face Lip */}
        <mesh position={[-0.7, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <ringGeometry args={[innerRadius, pipeRadius, 36]} />
          <SanitaryMaterial finish="ep" color="#f1f5f9" />
        </mesh>
      </group>

      {/* 2. GASKET (Center) */}
      <group position={[gasketX, 0, 0]}>
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
          <cylinderGeometry args={[pipeRadius + 0.12, pipeRadius + 0.12, 0.08, 36, 1, true]} />
          <SanitaryMaterial finish="epdm" color="#1e293b" />
        </mesh>
        <mesh position={[0.04, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[innerRadius, pipeRadius + 0.12, 36]} />
          <SanitaryMaterial finish="epdm" color="#1e293b" />
        </mesh>
        <mesh position={[-0.04, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <ringGeometry args={[innerRadius, pipeRadius + 0.12, 36]} />
          <SanitaryMaterial finish="epdm" color="#1e293b" />
        </mesh>
      </group>

      {/* 3. LINER (Right) */}
      <group position={[linerX, 0, 0]}>
        {/* Flanged Collar Head */}
        <mesh position={[-0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[pipeRadius + 0.16, pipeRadius + 0.16, 0.18, 36, 1, true]} />
          <SanitaryMaterial finish="ep" color="#f8fafc" />
        </mesh>
        <mesh position={[-0.17, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <ringGeometry args={[innerRadius, pipeRadius + 0.16, 36]} />
          <SanitaryMaterial finish="ep" color="#f8fafc" />
        </mesh>
        {/* Weld Neck (Tube extending to right) */}
        <mesh position={[0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[pipeRadius, pipeRadius, 0.7, 36, 1, true]} />
          <SanitaryMaterial finish="ep" color="#f8fafc" />
        </mesh>
        <mesh position={[0.7, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[innerRadius, pipeRadius, 36]} />
          <SanitaryMaterial finish="ep" color="#f8fafc" />
        </mesh>
      </group>

      {/* 4. SMS SLOTTED UNION NUT (Surrounding Liner / Clamping Male Part) */}
      <group position={[nutX, 0, 0]}>
        {/* Nut Main Round Body */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[nutOuterRadius, nutOuterRadius, 0.38, 48, 1, true]} />
          <SanitaryMaterial finish="cast" color="#e2e8f0" />
        </mesh>
        {/* Rear Retaining Flange Lip (Catches Liner Collar) */}
        <mesh position={[0.19, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[pipeRadius + 0.04, nutOuterRadius, 48]} />
          <SanitaryMaterial finish="cast" color="#cbd5e1" />
        </mesh>

        {/* 6 Peripheral Milled Spanner Slots around SMS Nut */}
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const y = Math.cos(rad) * nutOuterRadius;
          const z = Math.sin(rad) * nutOuterRadius;
          return (
            <mesh key={deg} position={[0, y, z]} rotation={[rad, 0, 0]}>
              <boxGeometry args={[0.22, 0.09, 0.1]} />
              <SanitaryMaterial finish="cast" color="#94a3b8" />
            </mesh>
          );
        })}
      </group>

      {/* Floating 3D In-Scene Specification & View Mode Switcher */}
      <Html position={[0, -1.35, 0]} center distanceFactor={6} pointerEvents="auto">
        <div style={{
          display: 'flex',
          gap: '6px',
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(8px)',
          padding: '4px 6px',
          borderRadius: '8px',
          border: '1px solid rgba(51, 65, 85, 0.8)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
          whiteSpace: 'nowrap'
        }}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsExploded(false); }}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              background: !isExploded ? '#0284c7' : 'transparent',
              color: !isExploded ? '#ffffff' : '#94a3b8',
              transition: 'all 0.2s'
            }}
          >
            Assembled View
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsExploded(true); }}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              background: isExploded ? '#0284c7' : 'transparent',
              color: isExploded ? '#ffffff' : '#94a3b8',
              transition: 'all 0.2s'
            }}
          >
            Exploded 4-Part View
          </button>
        </div>
      </Html>
    </group>
  );
}


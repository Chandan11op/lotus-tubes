import React, { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * Procedural 3D Sanitary Tri-Clamp Heavy Duty Clamp (Single & Double Pin)
 * Conforms to 3A Sanitary Standard / ISO 2852 clamp couplings
 * Features:
 * - Two semi-circular investment-cast SS 304 jaws with internal 14-degree V-groove
 * - Authentic hinge assembly with precision pivot pin (single pin) or dual-link segment (double pin)
 * - Threaded swing eyebolt with cross-pin trunnion
 * - Dual-wing ergonomic wing nut
 * - Vibrated / bead-blasted cast stainless steel finish
 */
export default function TriClampClamp({
  clampRadius = 1.05,
  initialVariant = 'single', // 'single' | 'double'
  autoRotate = false
}) {
  const [variant, setVariant] = useState(initialVariant);
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  // Cross-section of clamp jaw with internal 14-degree V-groove
  const { upperJawGeom, lowerJawGeom } = useMemo(() => {
    const rInner = clampRadius;
    const rGrooveBottom = clampRadius + 0.12;
    const rOuter = clampRadius + 0.22;
    const halfWidth = 0.18;
    const grooveHalfWidth = 0.09;

    const points = [
      new THREE.Vector2(rInner, halfWidth),
      new THREE.Vector2(rOuter, halfWidth),
      new THREE.Vector2(rOuter, -halfWidth),
      new THREE.Vector2(rInner, -halfWidth),
      new THREE.Vector2(rInner + 0.04, -grooveHalfWidth),
      new THREE.Vector2(rGrooveBottom, 0),
      new THREE.Vector2(rInner + 0.04, grooveHalfWidth),
      new THREE.Vector2(rInner, halfWidth)
    ];

    // Upper jaw from 0.06 to Math.PI - 0.06 (leaves gap for hinge and latch)
    const upper = new THREE.LatheGeometry(points, 32, 0.08, Math.PI - 0.16);
    upper.computeVertexNormals();

    // Lower jaw from Math.PI + 0.08 to 2 * Math.PI - 0.08
    const lower = new THREE.LatheGeometry(points, 32, Math.PI + 0.08, Math.PI - 0.16);
    lower.computeVertexNormals();

    return { upperJawGeom: upper, lowerJawGeom: lower };
  }, [clampRadius]);

  const isDouble = variant === 'double';
  const rHinge = clampRadius + 0.14;

  return (
    <group ref={groupRef} rotation={[Math.PI / 2, 0, 0]}>
      {/* Upper Jaw Segment */}
      <mesh geometry={upperJawGeom} castShadow receiveShadow>
        <SanitaryMaterial finish="cast" color="#e2e8f0" />
      </mesh>

      {/* Lower Jaw Segment */}
      <mesh geometry={lowerJawGeom} castShadow receiveShadow>
        <SanitaryMaterial finish="cast" color="#e2e8f0" />
      </mesh>

      {/* --- HINGE MECHANISM (Right Side, +X) --- */}
      {isDouble ? (
        // Double-Pin Dual Hinge Link
        <group position={[rHinge + 0.04, 0, 0]}>
          {/* Dual Link Side Plates */}
          <mesh position={[0, 0, 0.14]} castShadow>
            <boxGeometry args={[0.22, 0.42, 0.06]} />
            <SanitaryMaterial finish="cast" color="#cbd5e1" />
          </mesh>
          <mesh position={[0, 0, -0.14]} castShadow>
            <boxGeometry args={[0.22, 0.42, 0.06]} />
            <SanitaryMaterial finish="cast" color="#cbd5e1" />
          </mesh>
          {/* Top Pivot Pin */}
          <mesh position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.38, 20]} />
            <SanitaryMaterial finish="ep" color="#f1f5f9" />
          </mesh>
          {/* Bottom Pivot Pin */}
          <mesh position={[0, -0.14, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.38, 20]} />
            <SanitaryMaterial finish="ep" color="#f1f5f9" />
          </mesh>
        </group>
      ) : (
        // Single-Pin Direct Hinge
        <group position={[rHinge, 0, 0]}>
          {/* Central Interlocking Hinge Block */}
          <mesh castShadow>
            <boxGeometry args={[0.2, 0.22, 0.24]} />
            <SanitaryMaterial finish="cast" color="#cbd5e1" />
          </mesh>
          {/* Single Precision Hinge Pin */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.38, 20]} />
            <SanitaryMaterial finish="ep" color="#f8fafc" />
          </mesh>
        </group>
      )}

      {/* --- LATCH & CLOSURE ASSEMBLY (Left Side, -X) --- */}
      <group position={[-rHinge, 0, 0]}>
        {/* Lower Jaw Lug Ears */}
        <mesh position={[0, -0.09, 0.12]} castShadow>
          <boxGeometry args={[0.16, 0.18, 0.06]} />
          <SanitaryMaterial finish="cast" color="#cbd5e1" />
        </mesh>
        <mesh position={[0, -0.09, -0.12]} castShadow>
          <boxGeometry args={[0.16, 0.18, 0.06]} />
          <SanitaryMaterial finish="cast" color="#cbd5e1" />
        </mesh>

        {/* Lower Cross Pin Trunnion */}
        <mesh position={[0, -0.09, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.32, 16]} />
          <SanitaryMaterial finish="ep" color="#cbd5e1" />
        </mesh>

        {/* Upper Jaw Slotted Fork Lugs */}
        <mesh position={[0, 0.09, 0.12]} castShadow>
          <boxGeometry args={[0.16, 0.18, 0.06]} />
          <SanitaryMaterial finish="cast" color="#cbd5e1" />
        </mesh>
        <mesh position={[0, 0.09, -0.12]} castShadow>
          <boxGeometry args={[0.16, 0.18, 0.06]} />
          <SanitaryMaterial finish="cast" color="#cbd5e1" />
        </mesh>

        {/* Threaded Eyebolt Swivel Assembly */}
        <group position={[0, -0.09, 0]} rotation={[0, 0, -0.05]}>
          {/* Eyebolt Head */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.07, 0.035, 12, 24]} />
            <SanitaryMaterial finish="ep" color="#cbd5e1" />
          </mesh>
          {/* Threaded Shaft extending upwards through upper fork */}
          <mesh position={[0, 0.42, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.72, 16]} />
            <SanitaryMaterial finish="ep" color="#cbd5e1" />
          </mesh>

          {/* Wing Nut Assembly clamped down on upper jaw */}
          <group position={[0, 0.48, 0]}>
            {/* Wing Nut Center Boss */}
            <mesh castShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.16, 20]} />
              <SanitaryMaterial finish="cast" color="#e2e8f0" />
            </mesh>
            {/* Wing Nut Wing 1 (+Z) */}
            <mesh position={[0, 0.08, 0.22]} rotation={[0.2, 0, 0]} castShadow>
              <boxGeometry args={[0.08, 0.24, 0.28]} />
              <SanitaryMaterial finish="cast" color="#e2e8f0" />
            </mesh>
            {/* Wing Nut Wing 2 (-Z) */}
            <mesh position={[0, 0.08, -0.22]} rotation={[-0.2, 0, 0]} castShadow>
              <boxGeometry args={[0.08, 0.24, 0.28]} />
              <SanitaryMaterial finish="cast" color="#e2e8f0" />
            </mesh>
          </group>
        </group>
      </group>

      {/* Floating 3D In-Scene Specification & Variant Switcher */}
      <Html position={[0, -1.4, 0]} center distanceFactor={6} pointerEvents="auto">
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
            onClick={(e) => { e.stopPropagation(); setVariant('single'); }}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              background: variant === 'single' ? '#0284c7' : 'transparent',
              color: variant === 'single' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.2s'
            }}
          >
            Single-Pin Hinge
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setVariant('double'); }}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              background: variant === 'double' ? '#0284c7' : 'transparent',
              color: variant === 'double' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.2s'
            }}
          >
            Double-Pin High Pressure
          </button>
        </div>
      </Html>
    </group>
  );
}

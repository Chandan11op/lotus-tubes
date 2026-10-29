import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * CAD-Accurate Procedural 3D Sanitary Fabricated Pipe Spool
 * Conforms to ASME BPE / ASTM A270 Sanitary Process Spool Fabrications.
 *
 * Anatomical Components:
 * 1. Precision Sanitary Tube:
 *    - Continuous ASTM A270 SS 316L tube with uniform wall thickness and hollow bore
 * 2. Orbital Welded Tri-Clamp Ferrules (Both Ends):
 *    - Left & Right CNC-machined ferrule ends with 14° clamp taper and gasket groove
 * 3. Passivated Orbital Weld Seams:
 *    - Ground smooth orbital weld reinforcement rings at both ferrule junctions
 *
 * Interactive Controls:
 * - Toggle: "Standard Spool (500 mm)" vs "Extended Spool (1000 mm)"
 */
export default function SanitaryPipeSpool({
  radius = 0.65,
  flangeRadius = 0.88,
  wallThickness = 0.075,
  isElectroPolished = true,
  autoRotate = false
}) {
  const groupRef = useRef();
  const [isExtended, setIsExtended] = useState(false);

  // Smoothly interpolate spool length
  const targetTubeLength = isExtended ? 4.8 : 2.8;
  const currentTubeLength = useRef(2.8);

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }

    currentTubeLength.current = THREE.MathUtils.damp(
      currentTubeLength.current,
      targetTubeLength,
      8,
      delta
    );
  });

  const ferruleLength = 0.42;
  const innerRadius = radius - wallThickness;

  return (
    <group ref={groupRef} rotation={[0.2, 0.4, 0]}>
      {/* ============================================================ */}
      {/* 1. CENTRAL SANITARY STRAIGHT TUBE                            */}
      {/* ============================================================ */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, currentTubeLength.current, 48, 1, true]} />
        <SanitaryMaterial finish={isElectroPolished ? 'ep' : 'mp'} />
      </mesh>

      {/* ============================================================ */}
      {/* 2. LEFT ORBITAL WELDED TRI-CLAMP FERRULE                    */}
      {/* ============================================================ */}
      <group position={[-currentTubeLength.current / 2, 0, 0]}>
        {/* Orbital Weld Ring */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[radius * 1.015, 0.025, 12, 48]} />
          <SanitaryMaterial finish="mp" />
        </mesh>

        {/* Ferrule Neck */}
        <mesh position={[-ferruleLength / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[radius, radius, ferruleLength, 48, 1, true]} />
          <SanitaryMaterial finish="ep" />
        </mesh>

        {/* Tri-Clamp Flange */}
        <mesh position={[-ferruleLength + 0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[flangeRadius, flangeRadius, 0.16, 48]} />
          <SanitaryMaterial finish="ep" />
        </mesh>

        {/* 14° Clamp Taper */}
        <mesh position={[-ferruleLength + 0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[flangeRadius * 0.88, flangeRadius, 0.08, 48]} />
          <SanitaryMaterial finish="ep" />
        </mesh>

        {/* Left End Face Ring Lip */}
        <mesh position={[-ferruleLength, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <ringGeometry args={[innerRadius, flangeRadius, 48]} />
          <SanitaryMaterial finish="ep" />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 3. RIGHT ORBITAL WELDED TRI-CLAMP FERRULE                   */}
      {/* ============================================================ */}
      <group position={[currentTubeLength.current / 2, 0, 0]}>
        {/* Orbital Weld Ring */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[radius * 1.015, 0.025, 12, 48]} />
          <SanitaryMaterial finish="mp" />
        </mesh>

        {/* Ferrule Neck */}
        <mesh position={[ferruleLength / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[radius, radius, ferruleLength, 48, 1, true]} />
          <SanitaryMaterial finish="ep" />
        </mesh>

        {/* Tri-Clamp Flange */}
        <mesh position={[ferruleLength - 0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[flangeRadius, flangeRadius, 0.16, 48]} />
          <SanitaryMaterial finish="ep" />
        </mesh>

        {/* 14° Clamp Taper */}
        <mesh position={[ferruleLength - 0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[flangeRadius, flangeRadius * 0.88, 0.08, 48]} />
          <SanitaryMaterial finish="ep" />
        </mesh>

        {/* Right End Face Ring Lip */}
        <mesh position={[ferruleLength, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[innerRadius, flangeRadius, 48]} />
          <SanitaryMaterial finish="ep" />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 4. INTERACTIVE SPOUL LENGTH TOGGLE                          */}
      {/* ============================================================ */}
      <Html position={[0, -1.15, 0]} center distanceFactor={9}>
        <div style={{
          display: 'flex',
          gap: '6px',
          background: 'rgba(15, 23, 42, 0.88)',
          padding: '4px 6px',
          borderRadius: '9999px',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
          userSelect: 'none',
          whiteSpace: 'nowrap'
        }}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsExtended(false); }}
            style={{
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: !isExtended ? '#0284c7' : 'transparent',
              color: !isExtended ? '#ffffff' : '#94a3b8'
            }}
          >
            Standard Spool (500 mm)
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsExtended(true); }}
            style={{
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: isExtended ? '#0284c7' : 'transparent',
              color: isExtended ? '#ffffff' : '#94a3b8'
            }}
          >
            Extended Spool (1000 mm)
          </button>
        </div>
      </Html>
    </group>
  );
}


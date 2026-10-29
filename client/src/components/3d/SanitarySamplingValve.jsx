import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * CAD-Accurate Procedural 3D Sanitary Aseptic Sampling Valve
 * Conforms to high-purity pharmaceutical & dairy aseptic fluid extraction standards.
 *
 * Anatomical Components:
 * 1. Process Connection (Inlet):
 *    - Mini Tri-Clamp sanitary flange with precision gasket recess
 * 2. Forged Valve Block Body:
 *    - Compact investment forged SS 316L chamber (Ra <= 0.3 µm)
 * 3. Actuator Knob:
 *    - Manual rotary screw knob with knurled grip
 *    - Stainless actuator stem shaft
 * 4. Sample Discharge Spout:
 *    - Smooth mandrel-bent stainless discharge tube with barbed hose tip
 *
 * Interactive Controls:
 * - Toggle: "Aseptic Closed (0°)" vs "Sampling Draw (Open)"
 */
export default function SanitarySamplingValve({
  isElectroPolished = true,
  autoRotate = false
}) {
  const groupRef = useRef();
  const knobRef = useRef();
  const stemRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  // Target rotation for knob when opening
  const targetKnobRot = isOpen ? Math.PI * 2 : 0;
  const currentKnobRot = useRef(0);

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }

    currentKnobRot.current = THREE.MathUtils.damp(
      currentKnobRot.current,
      targetKnobRot,
      6,
      delta
    );

    if (knobRef.current) {
      knobRef.current.rotation.x = currentKnobRot.current;
      knobRef.current.position.x = 0.95 + (currentKnobRot.current / (Math.PI * 2)) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} rotation={[0.2, 0.4, 0]}>
      {/* ============================================================ */}
      {/* 1. PROCESS CONNECTION (MINI TRI-CLAMP INLET)                */}
      {/* ============================================================ */}
      <group position={[-0.95, 0, 0]}>
        {/* Clamp Flange Ring */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.55, 0.55, 0.16, 32]} />
          <SanitaryMaterial finish="ep" />
        </mesh>
        {/* 14° Bevel Collar */}
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.42, 0.55, 0.1, 32]} />
          <SanitaryMaterial finish="ep" />
        </mesh>
        {/* Hollow Bore Opening */}
        <mesh position={[-0.081, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <circleGeometry args={[0.26, 32]} />
          <meshBasicMaterial color="#020617" />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 2. FORGED SS 316L VALVE BODY BLOCK                          */}
      {/* ============================================================ */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.85, 0.85]} />
        <SanitaryMaterial finish={isElectroPolished ? 'ep' : 'mp'} />
      </mesh>

      {/* Top Body Boss / Identification Collar */}
      <mesh position={[0, 0.46, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.32, 0.1, 24]} />
        <SanitaryMaterial finish="mp" />
      </mesh>

      {/* ============================================================ */}
      {/* 3. ROTARY ACTUATOR KNOB & STEM                              */}
      {/* ============================================================ */}
      <group ref={knobRef} position={[0.95, 0, 0]}>
        {/* Screw Stem */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.5, 20]} />
          <SanitaryMaterial finish="ep" />
        </mesh>

        {/* Ergonomic Knurled Actuator Knob */}
        <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.48, 0.48, 0.28, 24]} />
          <meshStandardMaterial color="#0284c7" metalness={0.4} roughness={0.35} />
        </mesh>
        {/* Stainless Center Retaining Washer */}
        <mesh position={[0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 20]} />
          <SanitaryMaterial finish="mp" />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 4. DOWNWARD DISCHARGE SAMPLE SPOUT                          */}
      {/* ============================================================ */}
      <group position={[0, -0.42, 0]}>
        {/* Vertical Spout Section */}
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.6, 24]} />
          <SanitaryMaterial finish="ep" />
        </mesh>

        {/* 60° Bent Discharge Spout Angle */}
        <group position={[0, -0.7, 0]} rotation={[0, 0, -Math.PI / 3]}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.11, 0.55, 24]} />
            <SanitaryMaterial finish="ep" />
          </mesh>
          {/* Barbed Hose Tip */}
          <mesh position={[0, -0.55, 0]} castShadow>
            <cylinderGeometry args={[0.13, 0.09, 0.12, 20]} />
            <SanitaryMaterial finish="ep" />
          </mesh>
          {/* Spout Hollow Bore Outlet */}
          <mesh position={[0, -0.61, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.075, 16]} />
            <meshBasicMaterial color="#020617" />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 5. INTERACTIVE VALVE TOGGLE                                 */}
      {/* ============================================================ */}
      <Html position={[0, -1.25, 0]} center distanceFactor={9}>
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
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            style={{
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: !isOpen ? '#dc2626' : 'transparent',
              color: !isOpen ? '#ffffff' : '#94a3b8'
            }}
          >
            Aseptic Sealed (Closed)
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
            style={{
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: isOpen ? '#16a34a' : 'transparent',
              color: isOpen ? '#ffffff' : '#94a3b8'
            }}
          >
            Sampling Draw (Open)
          </button>
        </div>
      </Html>
    </group>
  );
}


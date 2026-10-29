import React, { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * CAD-Accurate Procedural 3D Sanitary Rotary & Static Spray Ball
 * Engineered for CIP (Clean-In-Place) 360° Tank Washing in Pharma, Dairy & Brewery vessels.
 *
 * Anatomical Components:
 * 1. Hollow Inlet Neck:
 *    - Standard weld/clip connection tube
 *    - Cross-drilled retaining cotter-pin hole
 * 2. Rotating Bearing Bushing:
 *    - Dual stainless ball-bearing races with self-cleaning fluid lubricant channels
 * 3. 360° Perforated Spherical Head:
 *    - Forged & mirror electropolished SS 316L hollow sphere
 *    - Precision CNC-drilled jet orifices in 5 latitude bands + bottom wash pole
 *
 * Interactive Controls:
 * - Toggle: "Static Inspection" vs "Rotary Clean 360°"
 */
export default function SanitarySprayBall({
  sphereRadius = 0.85,
  neckRadius = 0.38,
  neckLength = 1.1,
  wallThickness = 0.06,
  isElectroPolished = true,
  autoRotate = false
}) {
  const groupRef = useRef();
  const rotorRef = useRef();
  const [isSpinning, setIsSpinning] = useState(false);

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }

    if (isSpinning && rotorRef.current) {
      // Rotate spray head rapidly around vertical CIP axis
      rotorRef.current.rotation.y += delta * 3.5;
    }
  });

  // Generate latitude coordinates for jet orifices
  const orifices = useMemo(() => {
    const list = [];
    const r = sphereRadius + 0.005;

    // Bottom pole jet
    list.push([0, -r, 0]);

    // 5 latitude rings
    const latitudes = [-50, -25, 0, 25, 50];
    const counts = [6, 10, 12, 10, 6];

    latitudes.forEach((latDeg, ringIdx) => {
      const latRad = (latDeg * Math.PI) / 180;
      const ringY = r * Math.sin(latRad);
      const ringR = r * Math.cos(latRad);
      const numJets = counts[ringIdx];

      for (let j = 0; j < numJets; j++) {
        const phi = (j * 2 * Math.PI) / numJets + (ringIdx % 2 ? 0.3 : 0);
        const x = ringR * Math.cos(phi);
        const z = ringR * Math.sin(phi);
        list.push([x, ringY, z]);
      }
    });

    return list;
  }, [sphereRadius]);

  const innerNeckRadius = neckRadius - wallThickness;

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* ============================================================ */}
      {/* 1. FIXED INLET CONNECTION NECK (SS 316L)                    */}
      {/* ============================================================ */}
      <group position={[0, sphereRadius + neckLength * 0.5, 0]}>
        {/* Hollow Inlet Tube */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[neckRadius, neckRadius, neckLength, 32, 1, true]} />
          <SanitaryMaterial finish={isElectroPolished ? 'ep' : 'mp'} />
        </mesh>

        {/* Top Bore Lip */}
        <mesh position={[0, neckLength * 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[innerNeckRadius, neckRadius, 32]} />
          <SanitaryMaterial finish="ep" />
        </mesh>

        {/* Cross-Drilled Cotter-Pin Hole (through both sides) */}
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, neckRadius * 2.05, 16]} />
          <meshBasicMaterial color="#020617" />
        </mesh>

        {/* Retaining Pin Collar */}
        <mesh position={[0, -neckLength * 0.35, 0]} castShadow>
          <cylinderGeometry args={[neckRadius * 1.15, neckRadius * 1.15, 0.12, 32]} />
          <SanitaryMaterial finish="mp" />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 2. ROTARY BEARING & SPHERICAL SPRAY HEAD                    */}
      {/* ============================================================ */}
      <group ref={rotorRef}>
        {/* Bearing Collar Junction */}
        <mesh position={[0, sphereRadius * 0.92, 0]} castShadow>
          <cylinderGeometry args={[neckRadius * 1.3, neckRadius * 1.45, 0.25, 32]} />
          <SanitaryMaterial finish="mp" />
        </mesh>

        {/* Main Spherical Spray Head (SS 316L Mirror Polished) */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[sphereRadius, 48, 48]} />
          <SanitaryMaterial finish="ep" />
        </mesh>

        {/* Precision Drilled Fluid Orifices (Array of dark circular ports) */}
        {orifices.map(([ox, oy, oz], idx) => (
          <group key={idx} position={[ox, oy, oz]}>
            <mesh
              rotation={[
                Math.atan2(Math.sqrt(ox * ox + oz * oz), oy) - Math.PI / 2,
                Math.atan2(ox, oz),
                0
              ]}
            >
              <circleGeometry args={[0.045, 12]} />
              <meshBasicMaterial color="#020617" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        {/* Simulated High-Velocity Fluid Jet Stream Cones (Only visible when spinning) */}
        {isSpinning && (
          <group>
            {orifices.slice(0, 16).map(([ox, oy, oz], i) => (
              <mesh
                key={`spray-${i}`}
                position={[ox * 1.4, oy * 1.4, oz * 1.4]}
                rotation={[
                  Math.atan2(Math.sqrt(ox * ox + oz * oz), oy) - Math.PI / 2,
                  Math.atan2(ox, oz),
                  0
                ]}
              >
                <coneGeometry args={[0.06, 0.6, 8]} />
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
              </mesh>
            ))}
          </group>
        )}
      </group>

      {/* ============================================================ */}
      {/* 3. INTERACTIVE ROTATION TOGGLE                               */}
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
            onClick={(e) => { e.stopPropagation(); setIsSpinning(false); }}
            style={{
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: !isSpinning ? '#0284c7' : 'transparent',
              color: !isSpinning ? '#ffffff' : '#94a3b8'
            }}
          >
            Static Inspection
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsSpinning(true); }}
            style={{
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: isSpinning ? '#16a34a' : 'transparent',
              color: isSpinning ? '#ffffff' : '#94a3b8'
            }}
          >
            🔄 Rotary 360° Clean
          </button>
        </div>
      </Html>
    </group>
  );
}


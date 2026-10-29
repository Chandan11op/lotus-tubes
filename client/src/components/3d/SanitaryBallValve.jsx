import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * CAD-Accurate Procedural 3D Sanitary 3-Piece Ball Valve with Tri-Clamp Ends
 * Conforms to ISO 5211 / ASME BPE Cavity-Filled Valve Body Standards.
 *
 * Anatomical Components:
 * 1. 3-Piece Valve Body Assembly (SS 316L):
 *    - Central forged body housing cavity-filler PTFE seats and floating stainless ball
 *    - Left & Right bolted end caps with sanitary Tri-Clamp ferrules
 *    - 4x High-tensile stainless steel tie-bolts with hex nuts clamping body together
 * 2. Manual Quarter-Turn Actuation Lever:
 *    - Ground stainless stem shaft with blowout-proof packing
 *    - Quarter-turn lever arm with safety latch
 *    - Lotus Industrial Blue vinyl grip sleeve
 *
 * Interactive Controls:
 * - Toggle: "Valve Closed (0°)" vs "Valve Open (90°)"
 */
export default function SanitaryBallValve({
  isElectroPolished = true,
  autoRotate = false
}) {
  const groupRef = useRef();
  const handleRef = useRef();
  const ballRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const targetRotation = isOpen ? Math.PI / 2 : 0;
  const currentRotation = useRef(0);

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }

    currentRotation.current = THREE.MathUtils.damp(
      currentRotation.current,
      targetRotation,
      8,
      delta
    );

    if (handleRef.current) handleRef.current.rotation.y = currentRotation.current;
    if (ballRef.current) ballRef.current.rotation.y = currentRotation.current;
  });

  // Body Dimensions
  const centerBodyWidth = 0.88;
  const centerBodyRadius = 0.58;
  const endCapLength = 0.52;
  const totalLength = centerBodyWidth + endCapLength * 2; // ~1.92
  const flangeRadius = 0.78;
  const boreRadius = 0.36;
  const boltOffset = 0.44;

  return (
    <group ref={groupRef} position={[0, -0.25, 0]}>
      {/* ============================================================ */}
      {/* 1. 3-PIECE VALVE BODY ASSEMBLY (SS 316L)                    */}
      {/* ============================================================ */}

      {/* Central Valve Body (SS 316L) */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[centerBodyRadius, centerBodyRadius, centerBodyWidth, 32]} rotation={[0, 0, Math.PI / 2]} />
        <SanitaryMaterial finish={isElectroPolished ? 'ep' : 'mp'} />
      </mesh>

      {/* Central Body Top Neck Boss */}
      <mesh position={[0, 0.52, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.3, 0.25, 24]} />
        <SanitaryMaterial finish="mp" />
      </mesh>

      {/* Internal Rotating Stainless Ball (visible through hollow bore) */}
      <group ref={ballRef}>
        <mesh>
          <sphereGeometry args={[boreRadius + 0.08, 24, 24]} />
          <SanitaryMaterial finish="ep" />
        </mesh>
        {/* Ball Bore Through-Hole */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[boreRadius - 0.02, boreRadius - 0.02, centerBodyWidth * 1.05, 24]} />
          <meshBasicMaterial color="#020617" />
        </mesh>
      </group>

      {/* Left End Cap & Tri-Clamp Ferrule */}
      <group position={[-centerBodyWidth / 2 - endCapLength / 2, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[centerBodyRadius * 0.95, centerBodyRadius * 0.95, endCapLength, 32]} />
          <SanitaryMaterial finish={isElectroPolished ? 'ep' : 'mp'} />
        </mesh>
        <mesh position={[-endCapLength / 2 + 0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[flangeRadius, flangeRadius, 0.16, 32]} />
          <SanitaryMaterial finish="ep" />
        </mesh>
        <mesh position={[-endCapLength / 2 + 0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[flangeRadius * 0.85, flangeRadius, 0.1, 32]} />
          <SanitaryMaterial finish="ep" />
        </mesh>
        <mesh position={[-endCapLength / 2 - 0.01, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[boreRadius, boreRadius, 0.05, 32]} />
          <meshBasicMaterial color="#020617" />
        </mesh>
      </group>

      {/* Right End Cap & Tri-Clamp Ferrule */}
      <group position={[centerBodyWidth / 2 + endCapLength / 2, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[centerBodyRadius * 0.95, centerBodyRadius * 0.95, endCapLength, 32]} />
          <SanitaryMaterial finish={isElectroPolished ? 'ep' : 'mp'} />
        </mesh>
        <mesh position={[endCapLength / 2 - 0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[flangeRadius, flangeRadius, 0.16, 32]} />
          <SanitaryMaterial finish="ep" />
        </mesh>
        <mesh position={[endCapLength / 2 - 0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[flangeRadius, flangeRadius * 0.85, 0.1, 32]} />
          <SanitaryMaterial finish="ep" />
        </mesh>
        <mesh position={[endCapLength / 2 + 0.01, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[boreRadius, boreRadius, 0.05, 32]} />
          <meshBasicMaterial color="#020617" />
        </mesh>
      </group>

      {/* 4x Tie Bolts with Hex Nuts */}
      {[
        [-boltOffset, -boltOffset],
        [-boltOffset, boltOffset],
        [boltOffset, -boltOffset],
        [boltOffset, boltOffset]
      ].map(([by, bz], i) => (
        <group key={i} position={[0, by, bz]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, totalLength * 0.92, 12]} />
            <SanitaryMaterial finish="mp" />
          </mesh>
          <mesh position={[-totalLength * 0.46, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 0.09, 6]} />
            <SanitaryMaterial finish="mp" />
          </mesh>
          <mesh position={[totalLength * 0.46, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 0.09, 6]} />
            <SanitaryMaterial finish="mp" />
          </mesh>
        </group>
      ))}

      {/* ============================================================ */}
      {/* 2. MANUAL QUARTER-TURN LEVER HANDLE & STEM                   */}
      {/* ============================================================ */}
      <group ref={handleRef} position={[0, 0.65, 0]}>
        {/* Stainless Valve Stem */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.35, 16]} />
          <SanitaryMaterial finish="ep" />
        </mesh>

        {/* Stem Retaining Nut & Washer */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.1, 6]} />
          <SanitaryMaterial finish="mp" />
        </mesh>

        {/* Stainless Steel Lever Arm */}
        <mesh position={[0.7, 0.35, 0]} castShadow>
          <boxGeometry args={[1.2, 0.08, 0.16]} />
          <SanitaryMaterial finish="mp" />
        </mesh>

        {/* Lotus Blue Vinyl Sleeve Grip */}
        <mesh position={[1.5, 0.35, 0]} castShadow>
          <boxGeometry args={[0.9, 0.12, 0.2]} />
          <meshStandardMaterial color="#0284c7" roughness={0.35} metalness={0.1} />
        </mesh>

        {/* Handle Safety Lock Latch */}
        <mesh position={[0.2, 0.26, 0]} castShadow>
          <boxGeometry args={[0.15, 0.18, 0.06]} />
          <SanitaryMaterial finish="mp" />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 3. INTERACTIVE VALVE ACTUATION TOGGLE OVERLAY               */}
      {/* ============================================================ */}
      <Html position={[0, -1.05, 0]} center distanceFactor={10}>
        <div style={{
          display: 'flex',
          gap: '6px',
          background: 'rgba(15, 23, 42, 0.85)',
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
            Valve Closed (0°)
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
            Valve Open (90°)
          </button>
        </div>
      </Html>
    </group>
  );
}

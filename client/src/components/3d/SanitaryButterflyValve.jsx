import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * CAD-Accurate Procedural 3D Sanitary Butterfly Valve
 * Conforms to sanitary butterfly valves (SMS / DIN / ISO) with Tri-Clamp ends.
 *
 * Anatomical Components:
 * - Cylindrical valve body with integrated Tri-Clamp end ferrules and open hollow bore
 * - Internal precision rotating valve disc and stem
 * - Multi-position notched lock plate
 * - Iconic high-visibility blue gripper/pull handle
 *
 * Interactive Controls:
 * - Toggle: "Valve Closed (0°)" vs "Valve Open (90°)"
 */
export default function SanitaryButterflyValve({
  bodyRadius = 0.72,
  bodyLength = 1.6,
  flangeRadius = 0.95,
  wallThickness = 0.08,
  isElectroPolished = true,
  autoRotate = false
}) {
  const groupRef = useRef();
  const discStemRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  // Target angle: 0 = closed (disc perpendicular to bore), PI/2 = full open (disc parallel to bore)
  const targetAngle = isOpen ? Math.PI / 2 : 0;
  const currentAngle = useRef(0);

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }

    currentAngle.current = THREE.MathUtils.damp(
      currentAngle.current,
      targetAngle,
      8,
      delta
    );

    if (discStemRef.current) {
      discStemRef.current.rotation.y = currentAngle.current;
    }
  });

  const innerRadius = bodyRadius - wallThickness;

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} rotation={[0.2, 0.4, 0]}>
      {/* Main Valve Body Tube (Horizontal, Open-Ended Hollow) */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[bodyRadius, bodyRadius, bodyLength, 48, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#eaeff4" />
      </mesh>

      {/* Inlet Tri-Clamp Flange Outer Collar (Left) */}
      <mesh position={[-bodyLength / 2 + 0.09, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[flangeRadius, flangeRadius, 0.18, 48, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#eaeff4" />
      </mesh>
      {/* Inlet Face Ring Lip */}
      <mesh position={[-bodyLength / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <ringGeometry args={[innerRadius, flangeRadius, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#eaeff4" />
      </mesh>

      {/* Outlet Tri-Clamp Flange Outer Collar (Right) */}
      <mesh position={[bodyLength / 2 - 0.09, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[flangeRadius, flangeRadius, 0.18, 48, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#eaeff4" />
      </mesh>
      {/* Outlet Face Ring Lip */}
      <mesh position={[bodyLength / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[innerRadius, flangeRadius, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#eaeff4" />
      </mesh>

      {/* Valve Neck Pillar (Upwards) */}
      <mesh position={[0, bodyRadius + 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.7, 32]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#eaeff4" />
      </mesh>

      {/* Notched Positioning Locking Plate */}
      <mesh position={[0, bodyRadius + 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.08, 32]} />
        <SanitaryMaterial isElectroPolished={false} color="#94a3b8" />
      </mesh>

      {/* Rotating Stem, Disc, and Blue Handle Group */}
      <group ref={discStemRef}>
        {/* Central Vertical Stem */}
        <mesh position={[0, bodyRadius * 0.5, 0]}>
          <cylinderGeometry args={[0.09, 0.09, bodyRadius * 2.2, 24]} />
          <SanitaryMaterial isElectroPolished={true} color="#cbd5e1" />
        </mesh>

        {/* Sanitary Butterfly Valve Disc (Inside Body) */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[innerRadius - 0.02, innerRadius - 0.02, 0.05, 40]} />
          <SanitaryMaterial isElectroPolished={true} color="#f8fafc" />
        </mesh>

        {/* Stem Cap / Handle Hub */}
        <mesh position={[0, bodyRadius + 0.82, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.18, 24]} />
          <SanitaryMaterial isElectroPolished={true} color="#334155" />
        </mesh>

        {/* Blue Sanitary Handle Arm */}
        <group position={[0, bodyRadius + 0.85, 0]}>
          {/* Main Lever Arm */}
          <mesh position={[0.9, 0, 0]} castShadow>
            <boxGeometry args={[1.6, 0.14, 0.18]} />
            <meshStandardMaterial color="#0284c7" roughness={0.35} metalness={0.1} />
          </mesh>

          {/* Ergonomic Blue Gripper Knob */}
          <mesh position={[1.8, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <capsuleGeometry args={[0.16, 0.5, 16, 24]} />
            <meshStandardMaterial color="#0369a1" roughness={0.4} metalness={0.1} />
          </mesh>

          {/* Trigger Release Pin */}
          <mesh position={[0.65, -0.15, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
            <SanitaryMaterial isElectroPolished={true} color="#cbd5e1" />
          </mesh>
        </group>
      </group>

      {/* Interactive Actuation Toggle */}
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

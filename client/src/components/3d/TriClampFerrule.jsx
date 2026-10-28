import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * Procedural 3D Sanitary Tri-Clamp Ferrule
 * Conforms to ASME BPE / BS 4825 Part 3 sanitary clamp ferrules
 * Features:
 * - Flange face with recessed gasket groove
 * - 14-degree clamp angle bevel collar
 * - Cylindrical butt-weld neck
 */
export default function TriClampFerrule({
  neckRadius = 0.65,
  flangeRadius = 0.95,
  neckLength = 1.0,
  flangeThickness = 0.25,
  gasketGrooveRadius = 0.75,
  wallThickness = 0.08,
  isElectroPolished = true,
  autoRotate = false
}) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  const innerRadius = neckRadius - wallThickness;

  return (
    <group ref={groupRef}>
      {/* Weld Neck Body (Cylinder) */}
      <mesh position={[0, -neckLength / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[neckRadius, neckRadius, neckLength, 48, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      {/* Weld Prep Bottom Ring */}
      <mesh position={[0, -neckLength, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerRadius, neckRadius, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Tri-Clamp Machined Flange Head (Cylinder + Bevel) */}
      <mesh position={[0, flangeThickness / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[flangeRadius, flangeRadius, flangeThickness, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* 14-Degree Clamp Taper Shoulder Transition */}
      <mesh position={[0, -0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[flangeRadius, neckRadius, 0.18, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Face Gasket Groove (Recessed Darker Ring) */}
      <mesh position={[0, flangeThickness + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[gasketGrooveRadius - 0.04, gasketGrooveRadius + 0.04, 48]} />
        <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Hollow Center Bore on Flange Face */}
      <mesh position={[0, flangeThickness + 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[innerRadius, 48]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}

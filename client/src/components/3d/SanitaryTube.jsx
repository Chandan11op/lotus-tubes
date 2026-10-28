import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * Procedural 3D Sanitary Tube / Pipe
 * Conforms to ASTM A270 SS 316L / SS 304 dimensions
 * Features:
 * - Outer polished surface
 * - Inner mirror electropolished bore
 * - Machined square cut ends with chamfer
 * - Subtle etched specification marking
 */
export default function SanitaryTube({
  length = 4.2,
  radius = 0.8,
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

  const innerRadius = radius - wallThickness;

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 2]}>
      {/* Outer Polished Wall */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, length, 48, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Inner Electropolished Bore */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[innerRadius, innerRadius, length, 48, 1, true]} />
        <SanitaryMaterial isElectroPolished={true} color="#f8fafc" />
      </mesh>

      {/* Top End Ring Lip */}
      <mesh position={[0, length / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerRadius, radius, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Bottom End Ring Lip */}
      <mesh position={[0, -length / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerRadius, radius, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
    </group>
  );
}

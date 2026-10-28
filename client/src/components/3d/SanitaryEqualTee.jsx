import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * Procedural 3D Sanitary Equal Tee
 * Features:
 * - Straight main run tube
 * - Perpendicular 90-degree branch of identical diameter
 * - Machined weld lips on all 3 ports
 */
export default function SanitaryEqualTee({
  runLength = 3.6,
  branchHeight = 1.8,
  radius = 0.7,
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
    <group ref={groupRef}>
      {/* Horizontal Run Cylinder */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, runLength, 48, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      {/* Run Port Left */}
      <mesh position={[-runLength / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <ringGeometry args={[innerRadius, radius, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      {/* Run Port Right */}
      <mesh position={[runLength / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[innerRadius, radius, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Vertical Branch Cylinder */}
      <mesh position={[0, branchHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, branchHeight, 48, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      {/* Branch Port Top */}
      <mesh position={[0, branchHeight, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerRadius, radius, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Smooth Weld Reinforcement Ring at Junction */}
      <mesh position={[0, radius * 0.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 1.02, 0.04, 16, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#cbd5e1" />
      </mesh>
    </group>
  );
}

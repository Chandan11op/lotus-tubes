import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * Procedural 3D Sanitary Reducing Tee
 * Features:
 * - Straight main run tube (e.g. 2" OD)
 * - Reduced perpendicular branch tube (e.g. 1" OD)
 * - Smooth transition collar
 */
export default function SanitaryReducingTee({
  runLength = 3.6,
  runRadius = 0.8,
  branchHeight = 1.6,
  branchRadius = 0.48,
  wallThickness = 0.07,
  isElectroPolished = true,
  autoRotate = false
}) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  const innerRunRadius = runRadius - wallThickness;
  const innerBranchRadius = branchRadius - wallThickness;

  return (
    <group ref={groupRef}>
      {/* Horizontal Run Cylinder */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[runRadius, runRadius, runLength, 48, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      {/* Run Port Left */}
      <mesh position={[-runLength / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <ringGeometry args={[innerRunRadius, runRadius, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      {/* Run Port Right */}
      <mesh position={[runLength / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[innerRunRadius, runRadius, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Vertical Reduced Branch Cylinder */}
      <mesh position={[0, branchHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[branchRadius, branchRadius, branchHeight, 40, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      {/* Branch Port Top */}
      <mesh position={[0, branchHeight, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerBranchRadius, branchRadius, 40]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Junction Collar */}
      <mesh position={[0, runRadius * 0.88, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[branchRadius * 1.05, 0.04, 16, 40]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#cbd5e1" />
      </mesh>
    </group>
  );
}

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * Procedural 3D Sanitary Reducing Tee
 * Features:
 * - Straight main run tube (e.g. 2" OD)
 * - Reduced perpendicular branch tube (e.g. 1" OD)
 * - Smooth transition pulled collar without bore obstruction
 */
export default function SanitaryReducingTee({
  runLength = 3.2,
  runRadius = 0.75,
  branchHeight = 1.5,
  branchRadius = 0.45,
  wallThickness = 0.07,
  isElectroPolished = true,
  autoRotate = false
}) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  const innerRunRadius = runRadius - wallThickness;
  const innerBranchRadius = branchRadius - wallThickness;
  const branchStart = runRadius * 0.88;
  const actualBranchLen = branchHeight - branchStart;
  const branchCenterY = branchStart + actualBranchLen / 2;

  return (
    <group ref={groupRef} position={[0, -0.25, 0]} rotation={[0.2, 0.4, 0]}>
      {/* Horizontal Main Run */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[runRadius, runRadius, runLength, 48, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#eaeff4" />
      </mesh>
      {/* Run Port Left */}
      <mesh position={[-runLength / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <ringGeometry args={[innerRunRadius, runRadius, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#eaeff4" />
      </mesh>
      {/* Run Port Right */}
      <mesh position={[runLength / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[innerRunRadius, runRadius, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#eaeff4" />
      </mesh>

      {/* Vertical Reduced Branch */}
      <mesh position={[0, branchCenterY, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[branchRadius, branchRadius, actualBranchLen, 40, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#eaeff4" />
      </mesh>
      {/* Branch Port Top */}
      <mesh position={[0, branchHeight, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerBranchRadius, branchRadius, 40]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#eaeff4" />
      </mesh>

      {/* Smooth Transition Collar */}
      <mesh position={[0, branchStart, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[branchRadius * 1.05, 0.04, 16, 40]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#dbe2ea" />
      </mesh>
    </group>
  );
}

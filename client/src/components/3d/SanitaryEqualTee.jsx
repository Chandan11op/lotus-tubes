import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * Procedural 3D Sanitary Equal Tee
 * Features:
 * - Straight main run tube with open hollow bore
 * - Perpendicular 90-degree branch of identical diameter
 * - Pulled sanitary neck junction without bore penetration
 * - Machined weld prep rings on all 3 ports
 */
export default function SanitaryEqualTee({
  runLength = 3.2,
  branchHeight = 1.6,
  radius = 0.65,
  wallThickness = 0.075,
  isElectroPolished = true,
  autoRotate = false
}) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  const innerRadius = radius - wallThickness;
  const branchStart = radius * 0.85;
  const actualBranchLen = branchHeight - branchStart;
  const branchCenterY = branchStart + actualBranchLen / 2;

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} rotation={[0.2, 0.4, 0]}>
      {/* Horizontal Run Cylinder (Main Body) */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, runLength, 48, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#eaeff4" />
      </mesh>
      {/* Run Port Left Face */}
      <mesh position={[-runLength / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <ringGeometry args={[innerRadius, radius, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#eaeff4" />
      </mesh>
      {/* Run Port Right Face */}
      <mesh position={[runLength / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[innerRadius, radius, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#eaeff4" />
      </mesh>

      {/* Vertical Branch Cylinder */}
      <mesh position={[0, branchCenterY, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, actualBranchLen, 48, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#eaeff4" />
      </mesh>
      {/* Branch Port Top Face */}
      <mesh position={[0, branchHeight, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerRadius, radius, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#eaeff4" />
      </mesh>

      {/* Smooth Pulled Sanitary Neck Fillet Ring at Intersection */}
      <mesh position={[0, branchStart, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 1.01, 0.045, 16, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#dbe2ea" />
      </mesh>
    </group>
  );
}

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * Procedural 3D Sanitary Concentric Reducer
 * Conforms to ASTM A270 / DIN 11852 sanitary concentric reducer
 * Features:
 * - Straight large weld tangent
 * - Smooth conical transition cone (symmetric around centerline)
 * - Straight small weld tangent
 * - Continuous hollow bore
 */
export default function ConcentricReducer({
  largeRadius = 0.9,
  smallRadius = 0.5,
  largeTangent = 0.6,
  smallTangent = 0.6,
  coneHeight = 1.4,
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

  const totalLength = largeTangent + coneHeight + smallTangent;
  const innerLargeRadius = largeRadius - wallThickness;
  const innerSmallRadius = smallRadius - wallThickness;

  const yLargeTangent = -totalLength / 2 + largeTangent / 2;
  const yCone = -totalLength / 2 + largeTangent + coneHeight / 2;
  const ySmallTangent = totalLength / 2 - smallTangent / 2;

  return (
    <group ref={groupRef}>
      {/* Large End Tangent (Cylinder) */}
      <mesh position={[0, yLargeTangent, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[largeRadius, largeRadius, largeTangent, 48, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      {/* Large End Ring Lip */}
      <mesh position={[0, -totalLength / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerLargeRadius, largeRadius, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Conical Reducer Body (Truncated Cone) */}
      <mesh position={[0, yCone, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[smallRadius, largeRadius, coneHeight, 48, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Small End Tangent (Cylinder) */}
      <mesh position={[0, ySmallTangent, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[smallRadius, smallRadius, smallTangent, 48, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      {/* Small End Ring Lip */}
      <mesh position={[0, totalLength / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerSmallRadius, smallRadius, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
    </group>
  );
}

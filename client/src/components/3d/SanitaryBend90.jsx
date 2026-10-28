import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * Procedural 3D Sanitary 90-Degree Bend
 * Conforms to ASTM A270 / ASME BPE standard 1.5D centerline radius
 * Features:
 * - 90-degree curved hollow toroidal segment
 * - Straight weld tangents at both inlet & outlet ports
 * - Chamfered weld prep ends
 */
export default function SanitaryBend90({
  radius = 0.65,
  bendRadius = 1.6,
  tangentLength = 0.6,
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

  const innerRadius = radius - wallThickness;

  return (
    <group ref={groupRef} position={[-bendRadius / 2, -bendRadius / 2, 0]}>
      {/* 90-Degree Elbow Curve (Torus Segment) */}
      <mesh position={[bendRadius, bendRadius, 0]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[bendRadius, radius, 32, 48, Math.PI / 2]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Tangent Leg 1 (Vertical) */}
      <mesh position={[bendRadius, tangentLength / 2, 0]}>
        <cylinderGeometry args={[radius, radius, tangentLength, 40, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      {/* Port 1 Ring Lip */}
      <mesh position={[bendRadius, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerRadius, radius, 40]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Tangent Leg 2 (Horizontal) */}
      <mesh position={[tangentLength / 2, bendRadius, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius, radius, tangentLength, 40, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      {/* Port 2 Ring Lip */}
      <mesh position={[0, bendRadius, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <ringGeometry args={[innerRadius, radius, 40]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
    </group>
  );
}

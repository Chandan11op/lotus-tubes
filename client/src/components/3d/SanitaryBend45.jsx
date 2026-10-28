import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * Procedural 3D Sanitary 45-Degree Bend
 * Conforms to ASTM A270 / ASME BPE 45-degree weld elbow
 */
export default function SanitaryBend45({
  radius = 0.65,
  bendRadius = 1.8,
  tangentLength = 0.5,
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
    <group ref={groupRef} position={[-bendRadius / 2, -bendRadius / 3, 0]}>
      {/* 45-Degree Curved Segment */}
      <mesh position={[bendRadius, bendRadius, 0]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[bendRadius, radius, 32, 40, Math.PI / 4]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Tangent Inlet (Vertical) */}
      <mesh position={[bendRadius, tangentLength / 2, 0]}>
        <cylinderGeometry args={[radius, radius, tangentLength, 40, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      <mesh position={[bendRadius, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerRadius, radius, 40]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Tangent Outlet (Angled at 45 deg) */}
      <group
        position={[
          bendRadius - bendRadius * (1 - Math.cos(Math.PI / 4)),
          tangentLength + bendRadius * Math.sin(Math.PI / 4),
          0
        ]}
        rotation={[0, 0, Math.PI / 4]}
      >
        <mesh position={[0, tangentLength / 2, 0]}>
          <cylinderGeometry args={[radius, radius, tangentLength, 40, 1, true]} />
          <SanitaryMaterial isElectroPolished={isElectroPolished} />
        </mesh>
        <mesh position={[0, tangentLength, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[innerRadius, radius, 40]} />
          <SanitaryMaterial isElectroPolished={isElectroPolished} />
        </mesh>
      </group>
    </group>
  );
}

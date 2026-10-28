import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * Procedural 3D Sanitary Tri-Clamp Heavy Duty Clamp
 * Features:
 * - Two semi-circular cast SS clamp segments with internal 14-degree V-groove
 * - Precision hinge pin on one side
 * - Eyebolt assembly with ergonomic brass/SS wing nut on opposite side
 */
export default function TriClampClamp({
  clampRadius = 1.05,
  grooveDepth = 0.22,
  clampWidth = 0.35,
  isElectroPolished = false,
  autoRotate = false
}) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} rotation={[Math.PI / 2, 0, 0]}>
      {/* Upper Clamp Half (Semi-Torus) */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[clampRadius, grooveDepth, 24, 48, Math.PI]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#cbd5e1" />
      </mesh>

      {/* Lower Clamp Half (Semi-Torus) */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI]} castShadow receiveShadow>
        <torusGeometry args={[clampRadius, grooveDepth, 24, 48, Math.PI]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#cbd5e1" />
      </mesh>

      {/* Hinge Pin on Left (-X) */}
      <group position={[-clampRadius, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, clampWidth * 1.4, 24]} />
          <SanitaryMaterial isElectroPolished={true} color="#94a3b8" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.22, 0.24, clampWidth * 1.1]} />
          <SanitaryMaterial isElectroPolished={isElectroPolished} color="#94a3b8" />
        </mesh>
      </group>

      {/* Eyebolt & Wing Nut on Right (+X) */}
      <group position={[clampRadius + 0.12, 0, 0]}>
        {/* Threaded Eyebolt Stem */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.7, 24]} />
          <SanitaryMaterial isElectroPolished={true} color="#94a3b8" />
        </mesh>

        {/* Wing Nut Body */}
        <mesh position={[0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.2, 24]} />
          <SanitaryMaterial isElectroPolished={true} color="#e2e8f0" />
        </mesh>

        {/* Wing Nut Wing 1 (Up) */}
        <mesh position={[0.45, 0.22, 0]} castShadow>
          <boxGeometry args={[0.12, 0.32, 0.06]} />
          <SanitaryMaterial isElectroPolished={true} color="#e2e8f0" />
        </mesh>
        {/* Wing Nut Wing 2 (Down) */}
        <mesh position={[0.45, -0.22, 0]} castShadow>
          <boxGeometry args={[0.12, 0.32, 0.06]} />
          <SanitaryMaterial isElectroPolished={true} color="#e2e8f0" />
        </mesh>
      </group>
    </group>
  );
}

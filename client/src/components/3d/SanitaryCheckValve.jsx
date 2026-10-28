import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * Procedural 3D Sanitary Non-Return / Check Valve
 * In-line spring loaded sanitary check valve with Tri-Clamp ends
 */
export default function SanitaryCheckValve({
  bodyLength = 2.2,
  bodyRadius = 0.8,
  endRadius = 0.6,
  flangeRadius = 0.85,
  isElectroPolished = true,
  autoRotate = false
}) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Cylindrical Spring Chamber Body */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[bodyRadius, bodyRadius, bodyLength * 0.55, 40]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Center Clamp Separation Ring (Body Clamp Band) */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[bodyRadius + 0.04, 0.08, 16, 40]} />
        <SanitaryMaterial isElectroPolished={false} color="#94a3b8" />
      </mesh>

      {/* Left Taper to Tri-Clamp Neck */}
      <mesh position={[-bodyLength * 0.38, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[bodyRadius, endRadius, bodyLength * 0.22, 40]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      {/* Left Tri-Clamp Flange */}
      <mesh position={[-bodyLength / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[flangeRadius, flangeRadius, 0.16, 40]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      <mesh position={[-bodyLength / 2 - 0.081, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[endRadius - 0.06, 40]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* Right Taper to Tri-Clamp Neck */}
      <mesh position={[bodyLength * 0.38, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <cylinderGeometry args={[bodyRadius, endRadius, bodyLength * 0.22, 40]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      {/* Right Tri-Clamp Flange */}
      <mesh position={[bodyLength / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[flangeRadius, flangeRadius, 0.16, 40]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      <mesh position={[bodyLength / 2 + 0.081, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[endRadius - 0.06, 40]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}

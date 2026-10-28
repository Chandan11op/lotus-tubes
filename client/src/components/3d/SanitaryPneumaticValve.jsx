import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * Procedural 3D Pneumatic Actuated Sanitary Ball Valve
 * Features:
 * - 3-piece SS 316L ball valve base with Tri-clamp ends
 * - High-grade anodized aluminum pneumatic actuator cylinder
 * - Yellow/Black open-close visual position indicator cap
 */
export default function SanitaryPneumaticValve({
  bodyLength = 1.8,
  bodyRadius = 0.65,
  flangeRadius = 0.9,
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
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* Lower Valve Body (Horizontal) */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.72, 32, 24]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Tri-Clamp Ends */}
      <mesh position={[-bodyLength / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[flangeRadius, flangeRadius, 0.22, 40]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      <mesh position={[-bodyLength / 2 - 0.111, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[bodyRadius - 0.08, 40]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      <mesh position={[bodyLength / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[flangeRadius, flangeRadius, 0.22, 40]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      <mesh position={[bodyLength / 2 + 0.111, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[bodyRadius - 0.08, 40]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* Mounting Bracket / Yoke to Actuator */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.65, 0.6, 0.65]} />
        <SanitaryMaterial isElectroPolished={false} color="#94a3b8" />
      </mesh>

      {/* Pneumatic Actuator Main Body (Silver Anodized Extrusion) */}
      <group position={[0, 1.75, 0]}>
        {/* Main Aluminum Actuator Housing */}
        <mesh castShadow>
          <boxGeometry args={[1.6, 1.2, 1.0]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* End Caps (Dark Anodized) */}
        <mesh position={[-0.82, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 1.24, 1.04]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0.82, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 1.24, 1.04]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Pneumatic Air Supply Ports (1/4" NPT) */}
        <mesh position={[0, -0.2, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <mesh position={[0.4, -0.2, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>

        {/* Top Dome Visual Position Indicator (Yellow & Black) */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.3, 24]} />
          <meshStandardMaterial color="#eab308" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

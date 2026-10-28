import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * Procedural 3D Sanitary 3-Piece Ball Valve
 * Features:
 * - 3-piece bolted valve body with Tri-clamp end caps
 * - Central spherical ball housing with through-bolts
 * - Blue vinyl coated quarter-turn handle
 */
export default function SanitaryBallValve({
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
    <group ref={groupRef}>
      {/* Central Spherical / Cylindrical Body Section */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.75, 32, 24]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Center Hex / Body Bolting Ring */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.82, 0.82, 0.8, 6]} />
        <SanitaryMaterial isElectroPolished={false} color="#94a3b8" />
      </mesh>

      {/* End Cap Left with Tri-Clamp */}
      <mesh position={[-bodyLength / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[flangeRadius, flangeRadius, 0.25, 40]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      <mesh position={[-bodyLength / 2 - 0.126, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[bodyRadius - 0.08, 40]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* End Cap Right with Tri-Clamp */}
      <mesh position={[bodyLength / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[flangeRadius, flangeRadius, 0.25, 40]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      <mesh position={[bodyLength / 2 + 0.126, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[bodyRadius - 0.08, 40]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* Neck Stem */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.5, 24]} />
        <SanitaryMaterial isElectroPolished={true} color="#cbd5e1" />
      </mesh>

      {/* Blue Vinyl Lever Handle */}
      <group position={[0, 1.15, 0]}>
        {/* Retaining Nut */}
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 6]} />
          <SanitaryMaterial isElectroPolished={true} color="#64748b" />
        </mesh>
        {/* Stainless Steel Lever Arm */}
        <mesh position={[0.7, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 0.1, 0.18]} />
          <SanitaryMaterial isElectroPolished={true} color="#cbd5e1" />
        </mesh>
        {/* Blue Vinyl Grip Sleeve */}
        <mesh position={[1.5, 0, 0]} castShadow>
          <boxGeometry args={[0.9, 0.14, 0.22]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

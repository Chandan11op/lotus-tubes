import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * Procedural 3D Sanitary Diaphragm Valve (Manual Wheel)
 * Features:
 * - Investment cast SS 316L 2-way body with Tri-clamp ends
 * - Domed bonnet chamber
 * - Multi-turn black ergonomic handwheel with position indicator
 */
export default function SanitaryDiaphragmValve({
  bodyLength = 1.8,
  bodyRadius = 0.6,
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
      {/* Lower Fluid Weir Body */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[bodyRadius, bodyRadius, bodyLength, 40, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Tri-Clamp End Flange (Left) */}
      <mesh position={[-bodyLength / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[flangeRadius, flangeRadius, 0.16, 40]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      <mesh position={[-bodyLength / 2 - 0.081, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[bodyRadius - 0.05, 40]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* Tri-Clamp End Flange (Right) */}
      <mesh position={[bodyLength / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[flangeRadius, flangeRadius, 0.16, 40]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      <mesh position={[bodyLength / 2 + 0.081, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[bodyRadius - 0.05, 40]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* Center Chamber Dome */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <sphereGeometry args={[0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* SS Bonnet Flange & Four Body Bolts */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.14, 32]} />
        <SanitaryMaterial isElectroPolished={false} color="#94a3b8" />
      </mesh>

      {/* Spindle Neck */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.55, 24]} />
        <SanitaryMaterial isElectroPolished={true} color="#cbd5e1" />
      </mesh>

      {/* Black Handwheel (Toroid Rim + Spokes + Center Hub) */}
      <group position={[0, 1.35, 0]}>
        {/* Handwheel Hub */}
        <mesh castShadow>
          <cylinderGeometry args={[0.26, 0.26, 0.22, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {/* Handwheel Outer Rim */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.85, 0.14, 20, 36]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>
        {/* Spokes */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, (i * Math.PI) / 4, 0]} castShadow>
            <boxGeometry args={[1.6, 0.1, 0.12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

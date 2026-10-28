import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * Procedural 3D Sanitary Butterfly Valve
 * Conforms to sanitary butterfly valves (SMS / DIN / ISO)
 * Features:
 * - Cylindrical valve body with integrated Tri-Clamp end ferrules
 * - Internal precision rotating valve disc and stem
 * - Multi-position notched lock plate
 * - Iconic high-visibility blue gripper/pull handle
 */
export default function SanitaryButterflyValve({
  bodyRadius = 0.75,
  bodyLength = 1.6,
  flangeRadius = 0.95,
  handleAngle = 0.3, // Slight angle to show open/throttled disc
  isElectroPolished = true,
  autoRotate = false
}) {
  const groupRef = useRef();
  const discStemRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Valve Body Tube (Horizontal) */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[bodyRadius, bodyRadius, bodyLength, 48, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Inlet Tri-Clamp Flange (Left) */}
      <mesh position={[-bodyLength / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[flangeRadius, flangeRadius, 0.18, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      {/* Inlet Face Bore */}
      <mesh position={[-bodyLength / 2 - 0.091, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[bodyRadius - 0.06, 48]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* Outlet Tri-Clamp Flange (Right) */}
      <mesh position={[bodyLength / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[flangeRadius, flangeRadius, 0.18, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      {/* Outlet Face Bore */}
      <mesh position={[bodyLength / 2 + 0.091, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[bodyRadius - 0.06, 48]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* Valve Neck Pillar (Upwards) */}
      <mesh position={[0, bodyRadius + 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.7, 32]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Notched Positioning Locking Plate */}
      <mesh position={[0, bodyRadius + 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.08, 32]} />
        <SanitaryMaterial isElectroPolished={false} color="#94a3b8" />
      </mesh>

      {/* Rotating Stem, Disc, and Blue Handle Group */}
      <group ref={discStemRef} rotation={[0, handleAngle, 0]}>
        {/* Central Vertical Stem */}
        <mesh position={[0, bodyRadius * 0.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, bodyRadius * 2.2, 24]} />
          <SanitaryMaterial isElectroPolished={true} color="#cbd5e1" />
        </mesh>

        {/* Sanitary Butterfly Valve Disc (Inside Body) */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[bodyRadius - 0.08, bodyRadius - 0.08, 0.06, 40]} />
          <SanitaryMaterial isElectroPolished={true} color="#f8fafc" />
        </mesh>

        {/* Stem Cap / Handle Hub */}
        <mesh position={[0, bodyRadius + 0.82, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.18, 24]} />
          <SanitaryMaterial isElectroPolished={true} color="#334155" />
        </mesh>

        {/* Blue Sanitary Handle Arm */}
        <group position={[0, bodyRadius + 0.85, 0]}>
          {/* Main Lever Arm */}
          <mesh position={[0.9, 0, 0]} castShadow>
            <boxGeometry args={[1.6, 0.14, 0.18]} />
            <meshStandardMaterial color="#0284c7" roughness={0.35} metalness={0.1} />
          </mesh>

          {/* Ergonomic Blue Gripper Knob */}
          <mesh position={[1.8, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <capsuleGeometry args={[0.16, 0.5, 16, 24]} />
            <meshStandardMaterial color="#0369a1" roughness={0.4} metalness={0.1} />
          </mesh>

          {/* Trigger Release Pin */}
          <mesh position={[0.65, -0.15, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
            <SanitaryMaterial isElectroPolished={true} color="#cbd5e1" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

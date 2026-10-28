import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * Procedural 3D Sanitary Eccentric Reducer
 * Essential hygienic design: one side is flat to enable full self-drainage in horizontal CIP lines
 * Features:
 * - Large diameter weld neck
 * - Flat-on-bottom offset eccentric conical transition
 * - Small diameter weld neck
 */
export default function EccentricReducer({
  largeRadius = 0.9,
  smallRadius = 0.5,
  largeTangent = 0.5,
  smallTangent = 0.5,
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
  // Offset along X axis so the bottom edge remains colinear (flat)
  const offset = largeRadius - smallRadius;

  // Build custom lofted geometry for eccentric cone
  const coneGeo = useMemo(() => {
    const segments = 48;
    const heightSegments = 16;
    const geo = new THREE.BufferGeometry();
    const positions = [];
    const indices = [];

    for (let yIndex = 0; yIndex <= heightSegments; yIndex++) {
      const v = yIndex / heightSegments;
      const currentY = -coneHeight / 2 + v * coneHeight;
      // Interpolate radius and center offset
      const currentR = largeRadius * (1 - v) + smallRadius * v;
      const currentCenterX = offset * v;

      for (let xIndex = 0; xIndex <= segments; xIndex++) {
        const u = xIndex / segments;
        const angle = u * Math.PI * 2;
        const x = currentCenterX + Math.cos(angle) * currentR;
        const z = Math.sin(angle) * currentR;
        positions.push(x, currentY, z);
      }
    }

    for (let yIndex = 0; yIndex < heightSegments; yIndex++) {
      for (let xIndex = 0; xIndex < segments; xIndex++) {
        const a = yIndex * (segments + 1) + xIndex;
        const b = (yIndex + 1) * (segments + 1) + xIndex;
        const c = (yIndex + 1) * (segments + 1) + (xIndex + 1);
        const d = yIndex * (segments + 1) + (xIndex + 1);
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [largeRadius, smallRadius, coneHeight, offset]);

  const yLargeTangent = -totalLength / 2 + largeTangent / 2;
  const yCone = -totalLength / 2 + largeTangent + coneHeight / 2;
  const ySmallTangent = totalLength / 2 - smallTangent / 2;

  return (
    <group ref={groupRef} position={[-offset / 2, 0, 0]}>
      {/* Large End Tangent (Straight at X=0) */}
      <mesh position={[0, yLargeTangent, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[largeRadius, largeRadius, largeTangent, 48, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      <mesh position={[0, -totalLength / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[largeRadius - wallThickness, largeRadius, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Eccentric Flat-Sided Cone */}
      <mesh position={[0, yCone, 0]} geometry={coneGeo} castShadow receiveShadow>
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>

      {/* Small End Tangent (Straight at X=offset) */}
      <mesh position={[offset, ySmallTangent, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[smallRadius, smallRadius, smallTangent, 48, 1, true]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
      <mesh position={[offset, totalLength / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[smallRadius - wallThickness, smallRadius, 48]} />
        <SanitaryMaterial isElectroPolished={isElectroPolished} />
      </mesh>
    </group>
  );
}

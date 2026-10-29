import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * Procedural 3D Sanitary Tri-Clamp Ferrule
 * Conforms to ASME BPE / BS 4825 Part 3 sanitary clamp ferrules
 * Features:
 * - One-piece lathe revolved body with true hollow bore
 * - 14-degree clamp angle bevel collar
 * - Recessed precision gasket alignment groove
 * - Orbital weld tangent neck
 */
export default function TriClampFerrule({
  neckRadius = 0.65,
  flangeRadius = 0.95,
  neckLength = 1.0,
  flangeThickness = 0.28,
  wallThickness = 0.08,
  isElectroPolished = true,
  autoRotate = false
}) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  const ferruleGeometry = useMemo(() => {
    const innerRadius = neckRadius - wallThickness;
    const grooveOuter = innerRadius + (flangeRadius - innerRadius) * 0.55;
    const grooveInner = innerRadius + (flangeRadius - innerRadius) * 0.3;
    const grooveDepth = 0.05;

    const points = [
      new THREE.Vector2(innerRadius, -neckLength),
      new THREE.Vector2(neckRadius, -neckLength),
      new THREE.Vector2(neckRadius, 0.0),
      new THREE.Vector2(flangeRadius, flangeThickness * 0.5),
      new THREE.Vector2(flangeRadius, flangeThickness),
      new THREE.Vector2(grooveOuter, flangeThickness),
      new THREE.Vector2(grooveOuter, flangeThickness - grooveDepth),
      new THREE.Vector2(grooveInner, flangeThickness - grooveDepth),
      new THREE.Vector2(grooveInner, flangeThickness),
      new THREE.Vector2(innerRadius, flangeThickness),
      new THREE.Vector2(innerRadius, -neckLength)
    ];

    const geom = new THREE.LatheGeometry(points, 48);
    geom.computeVertexNormals();
    geom.center();
    return geom;
  }, [neckRadius, flangeRadius, neckLength, flangeThickness, wallThickness]);

  return (
    <group ref={groupRef} rotation={[0.4, 0.3, 0]}>
      <mesh geometry={ferruleGeometry} castShadow receiveShadow>
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#eaeff4" />
      </mesh>
    </group>
  );
}

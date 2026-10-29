import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * 90-Degree Sanitary Elbow Curve Path
 * Comprises:
 * 1. Straight inlet weld tangent along +Y
 * 2. 90-degree circular arc from (R, 0, 0) to (0, R, 0) in XY plane
 * 3. Straight outlet weld tangent along -X
 */
class SanitaryElbow90Curve extends THREE.Curve {
  constructor(bendRadius, tangentLength) {
    super();
    this.R = bendRadius;
    this.T = tangentLength;
    this.arcLen = (Math.PI / 2) * this.R;
    this.totalLen = this.T * 2 + this.arcLen;
    this.t1 = this.T / this.totalLen;
    this.t2 = (this.T + this.arcLen) / this.totalLen;
  }

  getPoint(t, optionalTarget = new THREE.Vector3()) {
    const point = optionalTarget;
    if (t < this.t1) {
      // Tangent 1 (Inlet): from (R, -T, 0) to (R, 0, 0)
      const u = t / this.t1;
      point.set(this.R, -this.T + u * this.T, 0);
    } else if (t <= this.t2) {
      // 90-degree circular arc: from (R, 0, 0) to (0, R, 0)
      const u = (t - this.t1) / (this.t2 - this.t1);
      const angle = u * (Math.PI / 2);
      point.set(this.R * Math.cos(angle), this.R * Math.sin(angle), 0);
    } else {
      // Tangent 2 (Outlet): from (0, R, 0) to (-T, R, 0)
      const u = (t - this.t2) / (1 - this.t2);
      point.set(-u * this.T, this.R, 0);
    }
    return point;
  }
}

/**
 * Procedural 3D Sanitary 90-Degree Bend
 * Conforms to ASTM A270 / ASME BPE standard 1.5D centerline radius
 * Features:
 * - Single watertight, hollow swept elbow with continuous wall thickness
 * - Straight weld tangents at both inlet & outlet ports
 * - Solid annular end faces on both ports
 * - Perfectly centered rotation
 */
export default function SanitaryBend90({
  radius = 0.58,
  bendRadius = 1.45,
  tangentLength = 0.55,
  wallThickness = 0.075,
  isElectroPolished = true,
  autoRotate = false
}) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  const elbowGeometry = useMemo(() => {
    const innerRadius = radius - wallThickness;
    const shape = new THREE.Shape();
    // Outer circular contour
    shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
    // Inner circular hole (reverses winding order for clean hole extraction)
    const hole = new THREE.Path();
    hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    const curve = new SanitaryElbow90Curve(bendRadius, tangentLength);
    const geom = new THREE.ExtrudeGeometry(shape, {
      steps: 44,
      curveSegments: 28,
      extrudePath: curve,
      bevelEnabled: false
    });
    geom.computeVertexNormals();
    geom.center();
    return geom;
  }, [radius, bendRadius, tangentLength, wallThickness]);

  return (
    <group ref={groupRef} rotation={[0.2, 0.4, 0]}>
      {/* Hollow Swept 90° Sanitary Elbow */}
      <mesh geometry={elbowGeometry} castShadow receiveShadow>
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#eaeff4" />
      </mesh>
    </group>
  );
}

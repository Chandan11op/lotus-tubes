import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * 45-Degree Sanitary Elbow Curve Path
 */
class SanitaryElbow45Curve extends THREE.Curve {
  constructor(bendRadius, tangentLength) {
    super();
    this.R = bendRadius;
    this.T = tangentLength;
    this.angle = Math.PI / 4;
    this.arcLen = this.angle * this.R;
    this.totalLen = this.T * 2 + this.arcLen;
    this.t1 = this.T / this.totalLen;
    this.t2 = (this.T + this.arcLen) / this.totalLen;
    // End of arc position
    this.endX = this.R * Math.cos(this.angle);
    this.endY = this.R * Math.sin(this.angle);
    // Tangent direction at end of arc: (-sin(angle), cos(angle))
    this.dirX = -Math.sin(this.angle);
    this.dirY = Math.cos(this.angle);
  }

  getPoint(t, optionalTarget = new THREE.Vector3()) {
    const point = optionalTarget;
    if (t < this.t1) {
      // Tangent 1: from (R, -T, 0) to (R, 0, 0)
      const u = t / this.t1;
      point.set(this.R, -this.T + u * this.T, 0);
    } else if (t <= this.t2) {
      // 45-degree circular arc: from 0 to angle
      const u = (t - this.t1) / (this.t2 - this.t1);
      const theta = u * this.angle;
      point.set(this.R * Math.cos(theta), this.R * Math.sin(theta), 0);
    } else {
      // Tangent 2: along tangent direction
      const u = (t - this.t2) / (1 - this.t2);
      point.set(
        this.endX + u * this.T * this.dirX,
        this.endY + u * this.T * this.dirY,
        0
      );
    }
    return point;
  }
}

/**
 * Procedural 3D Sanitary 45-Degree Bend
 */
export default function SanitaryBend45({
  radius = 0.58,
  bendRadius = 1.6,
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
    shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    const curve = new SanitaryElbow45Curve(bendRadius, tangentLength);
    const geom = new THREE.ExtrudeGeometry(shape, {
      steps: 36,
      curveSegments: 24,
      extrudePath: curve,
      bevelEnabled: false
    });
    geom.computeVertexNormals();
    geom.center();
    return geom;
  }, [radius, bendRadius, tangentLength, wallThickness]);

  return (
    <group ref={groupRef} rotation={[0.2, 0.4, 0]}>
      <mesh geometry={elbowGeometry} castShadow receiveShadow>
        <SanitaryMaterial isElectroPolished={isElectroPolished} color="#eaeff4" />
      </mesh>
    </group>
  );
}

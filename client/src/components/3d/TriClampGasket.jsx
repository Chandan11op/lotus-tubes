import React, { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * CAD-Accurate Procedural 3D Sanitary Tri-Clamp Gasket
 * Conforms to FDA 21 CFR 177.2600 & ASME BPE / 3-A Sanitary Gasket Profiles.
 *
 * Anatomical Profile:
 * - Flanged elastomeric / fluoropolymer ring
 * - Inner flow bore matching standard hygienic pipe ID
 * - Raised annular locating beads on top and bottom faces that seat precisely into the ferrule gasket groove
 * - Molded outer alignment rim
 *
 * Supported Elastomer / Polymer Grades:
 * 1. Platinum-Cured Medical Silicone (Translucent / Frosted White)
 * 2. Food-Grade EPDM Elastomer (Black, Matte)
 * 3. 100% Virgin Solid PTFE / Teflon (Opaque Pure White)
 * 4. Viton / FKM Fluoroelastomer (Dark Charcoal / Black)
 */
export default function TriClampGasket({
  materialType = 'silicone', // 'silicone' | 'epdm' | 'ptfe' | 'viton'
  flangeRadius = 0.96,
  boreRadius = 0.65,
  thickness = 0.12,
  autoRotate = false
}) {
  const groupRef = useRef();
  const [selectedMaterial, setSelectedMaterial] = useState(materialType);

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  // Revolve cross-section profile around Y axis
  const gasketGeometry = useMemo(() => {
    // 2D Profile points in XZ plane (radius along X, height along Y)
    // Points define the flanged gasket cross-section with raised seating beads on both faces
    const points = [];
    const rIn = boreRadius;
    const rOut = flangeRadius;
    const rBead = (boreRadius + flangeRadius) * 0.52;
    const beadWidth = 0.08;
    const beadHeight = 0.035;
    const halfThick = thickness * 0.5;

    // Inner bore vertical face
    points.push(new THREE.Vector2(rIn, -halfThick));
    points.push(new THREE.Vector2(rIn, halfThick));

    // Top face with raised bead
    points.push(new THREE.Vector2(rBead - beadWidth * 0.5, halfThick));
    points.push(new THREE.Vector2(rBead, halfThick + beadHeight));
    points.push(new THREE.Vector2(rBead + beadWidth * 0.5, halfThick));
    points.push(new THREE.Vector2(rOut, halfThick));

    // Outer rim vertical face
    points.push(new THREE.Vector2(rOut, -halfThick));

    // Bottom face with raised bead
    points.push(new THREE.Vector2(rBead + beadWidth * 0.5, -halfThick));
    points.push(new THREE.Vector2(rBead, -halfThick - beadHeight));
    points.push(new THREE.Vector2(rBead - beadWidth * 0.5, -halfThick));
    points.push(new THREE.Vector2(rIn, -halfThick));

    const geo = new THREE.LatheGeometry(points, 64);
    geo.computeVertexNormals();
    return geo;
  }, [boreRadius, flangeRadius, thickness]);

  // Material settings for each grade
  const renderMaterial = () => {
    switch (selectedMaterial) {
      case 'silicone':
        return (
          <meshPhysicalMaterial
            color="#f8fafc"
            roughness={0.25}
            metalness={0.04}
            transmission={0.65}
            opacity={0.88}
            transparent={true}
            thickness={0.5}
            ior={1.42}
            side={THREE.DoubleSide}
          />
        );
      case 'epdm':
        return (
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.7}
            metalness={0.05}
            side={THREE.DoubleSide}
          />
        );
      case 'ptfe':
        return (
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.3}
            metalness={0.03}
            side={THREE.DoubleSide}
          />
        );
      case 'viton':
        return (
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.6}
            metalness={0.06}
            side={THREE.DoubleSide}
          />
        );
      default:
        return <SanitaryMaterial finish="silicone" />;
    }
  };

  return (
    <group ref={groupRef} rotation={[0.4, 0.3, 0]}>
      {/* Molded Gasket Body */}
      <mesh geometry={gasketGeometry} castShadow receiveShadow>
        {renderMaterial()}
      </mesh>

      {/* Interactive Material Grade Toggle Badge */}
      <Html position={[0, -1.15, 0]} center distanceFactor={9}>
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'rgba(15, 23, 42, 0.88)',
          padding: '4px 6px',
          borderRadius: '9999px',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
          userSelect: 'none',
          whiteSpace: 'nowrap'
        }}>
          {[
            { id: 'silicone', label: 'Silicone (White)' },
            { id: 'epdm', label: 'EPDM (Black)' },
            { id: 'ptfe', label: 'PTFE (Solid White)' },
            { id: 'viton', label: 'Viton FKM' }
          ].map(m => (
            <button
              key={m.id}
              type="button"
              onClick={(e) => { e.stopPropagation(); setSelectedMaterial(m.id); }}
              style={{
                padding: '3px 8px',
                fontSize: '10px',
                fontWeight: 600,
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: selectedMaterial === m.id ? '#0284c7' : 'transparent',
                color: selectedMaterial === m.id ? '#ffffff' : '#94a3b8'
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </Html>
    </group>
  );
}


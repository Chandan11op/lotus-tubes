import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import SanitaryMaterial from './SanitaryMaterial.jsx';

/**
 * CAD-Accurate Procedural 3D Pneumatic Actuated Sanitary 3-Piece Ball Valve
 * conformed to ASME BPE / 3-A Sanitary Standards & ISO 5211 Actuator Mounting.
 *
 * Anatomical Components:
 * 1. 3-Piece Ball Valve Body:
 *    - Central forged SS316L body housing floating ball and PTFE cavity-filler seats.
 *    - Left & Right end caps with precision Tri-Clamp ferrule ends.
 *    - 4x High-tensile stainless tie-bolts with hex nuts passing through corners.
 * 2. ISO 5211 Mounting Yoke:
 *    - Open stainless bracket for stem packing inspection.
 *    - Ground stainless valve stem / drive shaft coupling.
 * 3. Rack & Pinion Pneumatic Actuator:
 *    - Dual-piston hard-anodized extruded aluminum body (Lotus Industrial Blue).
 *    - Die-cast aluminum end caps with perimeter fasteners.
 *    - NAMUR G 1/4" solenoid air supply connection pad.
 * 4. High-Visibility Position Indicator:
 *    - Polycarbonate transparent dome with dual-color (Yellow / Red) rotating rotor.
 *
 * Interactive Controls:
 * - Toggle: "Valve Closed (0°)" vs "Valve Open (90°)"
 */
export default function SanitaryPneumaticValve({
  isElectroPolished = true,
  autoRotate = false
}) {
  const groupRef = useRef();
  const rotorRef = useRef();
  const stemRef = useRef();
  const ballRef = useRef();

  const [isOpen, setIsOpen] = useState(false);

  // Target rotation for valve position (0 rad = closed, PI/2 = open)
  const targetRotation = isOpen ? Math.PI / 2 : 0;
  const currentRotation = useRef(0);

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }

    // Smoothly animate open/close transition
    currentRotation.current = THREE.MathUtils.damp(
      currentRotation.current,
      targetRotation,
      8,
      delta
    );

    if (rotorRef.current) rotorRef.current.rotation.y = currentRotation.current;
    if (stemRef.current) stemRef.current.rotation.y = currentRotation.current;
    if (ballRef.current) ballRef.current.rotation.y = currentRotation.current;
  });

  // Body Dimensions
  const centerBodyWidth = 0.9;
  const centerBodyRadius = 0.58;
  const endCapLength = 0.55;
  const totalLength = centerBodyWidth + endCapLength * 2; // ~2.0
  const flangeRadius = 0.78;
  const boreRadius = 0.36;
  const boltOffset = 0.44;

  return (
    <group ref={groupRef} position={[0, -0.4, 0]}>
      {/* ============================================================ */}
      {/* 1. 3-PIECE VALVE BODY ASSEMBLY (SS 316L)                    */}
      {/* ============================================================ */}

      {/* Central Valve Body (SS 316L) */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[centerBodyRadius, centerBodyRadius, centerBodyWidth, 32]} rotation={[0, 0, Math.PI / 2]} />
        <SanitaryMaterial finish={isElectroPolished ? 'ep' : 'mp'} />
      </mesh>

      {/* Central Body Top Neck / ISO 5211 Mounting Pad */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.38, 0.3, 24]} />
        <SanitaryMaterial finish={isElectroPolished ? 'ep' : 'mp'} />
      </mesh>

      {/* Internal Rotating Stainless Ball (visible through hollow bore) */}
      <group ref={ballRef}>
        <mesh>
          <sphereGeometry args={[boreRadius + 0.08, 24, 24]} />
          <SanitaryMaterial finish="ep" />
        </mesh>
        {/* Ball Bore Through-Hole (visual dark cutout when closed) */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[boreRadius - 0.02, boreRadius - 0.02, centerBodyWidth * 1.05, 24]} />
          <meshBasicMaterial color="#020617" />
        </mesh>
      </group>

      {/* Left End Cap & Tri-Clamp Ferrule */}
      <group position={[-centerBodyWidth / 2 - endCapLength / 2, 0, 0]}>
        {/* End Cap Body */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[centerBodyRadius * 0.95, centerBodyRadius * 0.95, endCapLength, 32]} />
          <SanitaryMaterial finish={isElectroPolished ? 'ep' : 'mp'} />
        </mesh>
        {/* Tri-Clamp Flange */}
        <mesh position={[-endCapLength / 2 + 0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[flangeRadius, flangeRadius, 0.16, 32]} />
          <SanitaryMaterial finish="ep" />
        </mesh>
        {/* Tri-Clamp 14° Taper */}
        <mesh position={[-endCapLength / 2 + 0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[flangeRadius * 0.85, flangeRadius, 0.1, 32]} />
          <SanitaryMaterial finish="ep" />
        </mesh>
        {/* Bore Entrance Hole */}
        <mesh position={[-endCapLength / 2 - 0.01, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[boreRadius, boreRadius, 0.05, 32]} />
          <meshBasicMaterial color="#020617" />
        </mesh>
      </group>

      {/* Right End Cap & Tri-Clamp Ferrule */}
      <group position={[centerBodyWidth / 2 + endCapLength / 2, 0, 0]}>
        {/* End Cap Body */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[centerBodyRadius * 0.95, centerBodyRadius * 0.95, endCapLength, 32]} />
          <SanitaryMaterial finish={isElectroPolished ? 'ep' : 'mp'} />
        </mesh>
        {/* Tri-Clamp Flange */}
        <mesh position={[endCapLength / 2 - 0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[flangeRadius, flangeRadius, 0.16, 32]} />
          <SanitaryMaterial finish="ep" />
        </mesh>
        {/* Tri-Clamp 14° Taper */}
        <mesh position={[endCapLength / 2 - 0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[flangeRadius, flangeRadius * 0.85, 0.1, 32]} />
          <SanitaryMaterial finish="ep" />
        </mesh>
        {/* Bore Entrance Hole */}
        <mesh position={[endCapLength / 2 + 0.01, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[boreRadius, boreRadius, 0.05, 32]} />
          <meshBasicMaterial color="#020617" />
        </mesh>
      </group>

      {/* 4x Tie Bolts with Hex Nuts (Holding 3 Pieces Together) */}
      {[
        [-boltOffset, -boltOffset],
        [-boltOffset, boltOffset],
        [boltOffset, -boltOffset],
        [boltOffset, boltOffset]
      ].map(([by, bz], i) => (
        <group key={i} position={[0, by, bz]}>
          {/* Stud Bolt Shaft */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, totalLength * 0.92, 12]} />
            <SanitaryMaterial finish="mp" />
          </mesh>
          {/* Left Hex Nut */}
          <mesh position={[-totalLength * 0.46, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 0.09, 6]} />
            <SanitaryMaterial finish="mp" />
          </mesh>
          {/* Right Hex Nut */}
          <mesh position={[totalLength * 0.46, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 0.09, 6]} />
            <SanitaryMaterial finish="mp" />
          </mesh>
        </group>
      ))}

      {/* ============================================================ */}
      {/* 2. ISO 5211 MOUNTING BRACKET (YOKE) & ROTATING STEM SHAFT   */}
      {/* ============================================================ */}
      <group position={[0, 0.9, 0]}>
        {/* Left Stainless Yoke Upright */}
        <mesh position={[-0.26, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 0.55, 0.4]} />
          <SanitaryMaterial finish="cast" />
        </mesh>
        {/* Right Stainless Yoke Upright */}
        <mesh position={[0.26, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 0.55, 0.4]} />
          <SanitaryMaterial finish="cast" />
        </mesh>
        {/* Bottom Mounting Plate */}
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.58, 0.06, 0.46]} />
          <SanitaryMaterial finish="cast" />
        </mesh>
        {/* Top Mounting Plate */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.58, 0.06, 0.46]} />
          <SanitaryMaterial finish="cast" />
        </mesh>

        {/* Visible Ground Stainless Rotating Drive Stem */}
        <mesh ref={stemRef} position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.11, 0.52, 20]} />
          <SanitaryMaterial finish="ep" />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 3. PNEUMATIC ACTUATOR BODY (Rack & Pinion / Anodized Blue)  */}
      {/* ============================================================ */}
      <group position={[0, 1.82, 0]}>
        {/* Main Extruded Aluminum Barrel Body */}
        {/* Twin Cylindrical Piston Chambers */}
        <mesh position={[0, 0, -0.28]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 1.45, 32]} />
          <SanitaryMaterial finish="anodized-blue" />
        </mesh>
        <mesh position={[0, 0, 0.28]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 1.45, 32]} />
          <SanitaryMaterial finish="anodized-blue" />
        </mesh>
        {/* Center Connecting Bridge */}
        <mesh castShadow>
          <boxGeometry args={[1.45, 0.65, 0.6]} />
          <SanitaryMaterial finish="anodized-blue" />
        </mesh>

        {/* Left Die-Cast End Cap with 4 Hex Bolts */}
        <group position={[-0.75, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <boxGeometry args={[0.82, 0.1, 1.15]} />
            <meshStandardMaterial color="#0284c7" metalness={0.65} roughness={0.35} />
          </mesh>
          {/* 4 Cap Fasteners */}
          {[
            [-0.28, -0.4],
            [-0.28, 0.4],
            [0.28, -0.4],
            [0.28, 0.4]
          ].map(([cy, cz], idx) => (
            <mesh key={idx} position={[-0.06, cy, cz]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.04, 6]} />
              <SanitaryMaterial finish="mp" />
            </mesh>
          ))}
        </group>

        {/* Right Die-Cast End Cap with 4 Hex Bolts */}
        <group position={[0.75, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <boxGeometry args={[0.82, 0.1, 1.15]} />
            <meshStandardMaterial color="#0284c7" metalness={0.65} roughness={0.35} />
          </mesh>
          {/* 4 Cap Fasteners */}
          {[
            [-0.28, -0.4],
            [-0.28, 0.4],
            [0.28, -0.4],
            [0.28, 0.4]
          ].map(([cy, cz], idx) => (
            <mesh key={idx} position={[0.06, cy, cz]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.04, 6]} />
              <SanitaryMaterial finish="mp" />
            </mesh>
          ))}
        </group>

        {/* NAMUR Solenoid Interface Pad (Front Face) */}
        <group position={[0, -0.05, 0.58]}>
          {/* Interface Pad */}
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.32, 0.06]} />
            <meshStandardMaterial color="#0369a1" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* G 1/4" Air Ports (Brass / SS fittings) */}
          <mesh position={[-0.14, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.065, 0.06, 16]} />
            <SanitaryMaterial finish="brass" />
          </mesh>
          <mesh position={[0.14, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.065, 0.06, 16]} />
            <SanitaryMaterial finish="brass" />
          </mesh>
        </group>

        {/* ============================================================ */}
        {/* 4. HIGH-VISIBILITY POSITION INDICATOR DOME (TOP)             */}
        {/* ============================================================ */}
        <group position={[0, 0.48, 0]}>
          {/* Indicator Base Ring */}
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.24, 0.06, 24]} />
            <SanitaryMaterial finish="cast" />
          </mesh>

          {/* Transparent Polycarbonate Outer Dome */}
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.26, 24]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transparent
              opacity={0.35}
              roughness={0.1}
              transmission={0.9}
              thickness={0.2}
              ior={1.5}
            />
          </mesh>

          {/* Internal Rotating Two-Color Rotor (Rotates 90° with valve state) */}
          <group ref={rotorRef} position={[0, 0.16, 0]}>
            {/* Yellow Section (OPEN Indicator) */}
            <mesh position={[0, 0, 0.09]}>
              <boxGeometry args={[0.14, 0.22, 0.14]} />
              <meshStandardMaterial color="#eab308" roughness={0.3} metalness={0.1} />
            </mesh>
            {/* Red / Dark Section (CLOSED Indicator) */}
            <mesh position={[0, 0, -0.09]}>
              <boxGeometry args={[0.14, 0.22, 0.14]} />
              <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.1} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 5. INTERACTIVE VALVE ACTUATION TOGGLE OVERLAY               */}
      {/* ============================================================ */}
      <Html position={[0, -1.05, 0]} center distanceFactor={10}>
        <div style={{
          display: 'flex',
          gap: '6px',
          background: 'rgba(15, 23, 42, 0.85)',
          padding: '4px 6px',
          borderRadius: '9999px',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
          userSelect: 'none',
          whiteSpace: 'nowrap'
        }}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            style={{
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: !isOpen ? '#dc2626' : 'transparent',
              color: !isOpen ? '#ffffff' : '#94a3b8'
            }}
          >
            Valve Closed (0°)
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
            style={{
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: isOpen ? '#16a34a' : 'transparent',
              color: isOpen ? '#ffffff' : '#94a3b8'
            }}
          >
            Valve Open (90°)
          </button>
        </div>
      </Html>
    </group>
  );
}

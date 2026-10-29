import React from 'react';
import * as THREE from 'three';

/**
 * PBR Sanitary Stainless Steel & Industrial Component Material System
 * Accurately models real physical finishes of hygienic processing equipment:
 * 
 * - 'ep' / Electro-Polished: Ra <= 0.38 µm (15 µin). High specular reflectivity, crisp studio sheen.
 * - 'mp' / Mechanical Polished: Ra <= 0.8 µm (32 µin). Soft directional satin reflection.
 * - 'cast' / Vibrated: Investment cast SS 304 (clamps, bodies). Bead-blasted matte metallic texture.
 * - 'anodized-blue': Hard-anodized aluminum pneumatic actuator cylinders.
 * - 'brass': Forged brass pivot bushings and wing nuts.
 * - 'silicone': Translucent medical-grade platinum silicone seals.
 * - 'ptfe': Opaque virgin white fluoropolymer seats.
 * - 'epdm': Carbon-black food grade elastomer.
 */
export function getSanitarySteelMaterial(options = {}) {
  const {
    finish = 'ep', // 'ep' | 'mp' | 'cast' | 'anodized-blue' | 'brass' | 'silicone' | 'ptfe' | 'epdm'
    isElectroPolished = true,
    color
  } = options;

  let matColor = color;
  let metalness = 0.88;
  let roughness = 0.14;
  let clearcoat = 0.4;
  let clearcoatRoughness = 0.1;

  if (finish === 'cast' || finish === 'vibrated') {
    matColor = matColor || '#e2e8f0';
    metalness = 0.82;
    roughness = 0.36;
    clearcoat = 0.1;
  } else if (finish === 'mp' || (!isElectroPolished && finish !== 'ep')) {
    matColor = matColor || '#f1f5f9';
    metalness = 0.88;
    roughness = 0.24;
    clearcoat = 0.25;
  } else if (finish === 'anodized-blue') {
    matColor = matColor || '#0284c7';
    metalness = 0.65;
    roughness = 0.32;
    clearcoat = 0.3;
  } else if (finish === 'brass') {
    matColor = matColor || '#fde047';
    metalness = 0.85;
    roughness = 0.25;
    clearcoat = 0.2;
  } else if (finish === 'silicone') {
    matColor = matColor || '#f8fafc';
    metalness = 0.05;
    roughness = 0.45;
    clearcoat = 0.1;
  } else if (finish === 'ptfe') {
    matColor = matColor || '#ffffff';
    metalness = 0.04;
    roughness = 0.25;
    clearcoat = 0.1;
  } else if (finish === 'epdm') {
    matColor = matColor || '#1e293b';
    metalness = 0.05;
    roughness = 0.65;
    clearcoat = 0.05;
  } else {
    // Default EP
    matColor = matColor || '#f8fafc';
    metalness = 0.90;
    roughness = 0.12;
    clearcoat = 0.5;
  }

  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(matColor),
    metalness,
    roughness,
    clearcoat,
    clearcoatRoughness,
    reflectivity: 0.95,
    side: THREE.DoubleSide
  });
}

export default function SanitaryMaterial({
  finish = 'ep',
  isElectroPolished = true,
  color
}) {
  let matColor = color;
  let metalness = 0.88;
  let roughness = 0.14;
  let clearcoat = 0.4;
  let clearcoatRoughness = 0.1;

  if (finish === 'cast' || finish === 'vibrated') {
    matColor = matColor || '#e2e8f0';
    metalness = 0.82;
    roughness = 0.36;
    clearcoat = 0.1;
  } else if (finish === 'mp' || (!isElectroPolished && finish !== 'ep')) {
    matColor = matColor || '#f1f5f9';
    metalness = 0.88;
    roughness = 0.24;
    clearcoat = 0.25;
  } else if (finish === 'anodized-blue') {
    matColor = matColor || '#0284c7';
    metalness = 0.65;
    roughness = 0.32;
    clearcoat = 0.3;
  } else if (finish === 'brass') {
    matColor = matColor || '#fde047';
    metalness = 0.85;
    roughness = 0.25;
    clearcoat = 0.2;
  } else if (finish === 'silicone') {
    matColor = matColor || '#f8fafc';
    metalness = 0.05;
    roughness = 0.45;
    clearcoat = 0.1;
  } else if (finish === 'ptfe') {
    matColor = matColor || '#ffffff';
    metalness = 0.04;
    roughness = 0.25;
    clearcoat = 0.1;
  } else if (finish === 'epdm') {
    matColor = matColor || '#1e293b';
    metalness = 0.05;
    roughness = 0.65;
    clearcoat = 0.05;
  } else {
    // Default EP
    matColor = matColor || '#f8fafc';
    metalness = 0.90;
    roughness = 0.12;
    clearcoat = 0.5;
  }

  return (
    <meshPhysicalMaterial
      color={matColor}
      metalness={metalness}
      roughness={roughness}
      clearcoat={clearcoat}
      clearcoatRoughness={clearcoatRoughness}
      reflectivity={0.95}
      side={THREE.DoubleSide}
    />
  );
}

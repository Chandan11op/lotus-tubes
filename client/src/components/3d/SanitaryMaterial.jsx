import React from 'react';
import * as THREE from 'three';

/**
 * PBR Sanitary Stainless Steel Material
 * Simulates ASTM A270 SS 316L / SS 304 surface finish
 * Electro Polished (EP): Ra <= 0.38 um -> low roughness, high reflectivity
 * Mechanical Polished (MP): Ra <= 0.8 um -> medium roughness, brushed sheen
 */
export function getSanitarySteelMaterial(options = {}) {
  const {
    isElectroPolished = true,
    color = '#e8edf2',
    roughness = isElectroPolished ? 0.16 : 0.32,
    metalness = 0.96,
    clearcoat = isElectroPolished ? 0.6 : 0.2,
    clearcoatRoughness = 0.1
  } = options;

  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    metalness,
    roughness,
    clearcoat,
    clearcoatRoughness,
    reflectivity: 0.95,
    side: THREE.DoubleSide
  });
}

export default function SanitaryMaterial({ isElectroPolished = true, color = '#e8edf2' }) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={0.96}
      roughness={isElectroPolished ? 0.16 : 0.32}
      clearcoat={isElectroPolished ? 0.6 : 0.2}
      clearcoatRoughness={0.1}
      reflectivity={0.95}
      side={THREE.DoubleSide}
    />
  );
}

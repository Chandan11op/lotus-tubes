import React, { useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * StudioEnvironment
 * Generates an authentic, offline, procedural high-dynamic-range photography studio environment
 * using Three.js built-in PMREMGenerator and RoomEnvironment.
 * 
 * Benefits:
 * - 100% offline, 0 network requests, 0 CDN latency, immune to network failure.
 * - Guarantees physically accurate metallic reflections for stainless steel PBR materials.
 * - Eliminates the "black plastic" look caused by missing environment maps on metallic shaders.
 */
export default function StudioEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();

    const roomEnv = new RoomEnvironment();
    const envRenderTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRenderTarget.texture;

    return () => {
      scene.environment = null;
      envRenderTarget.dispose();
      pmremGenerator.dispose();
    };
  }, [gl, scene]);

  return null;
}


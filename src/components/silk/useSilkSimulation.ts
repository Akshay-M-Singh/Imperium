"use client";

// useSilkSimulation — the ping-pong FBO GPGPU step for the cursor/touch
// layer (design spec §2.2.1, Phase 4). Advances a small RG (height,
// velocity) state texture by one damped-wave timestep per frame and hands
// back the latest texture for SilkPlane to sample as displacement.
//
// Must be used inside a component mounted under <Canvas> (it calls
// useThree/useFrame) — and only mounted at all when
// getWebglCapability().halfFloatFbo is true (SilkCanvas.tsx decides this;
// see silk/README.md "Capability tiers").

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFBO } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { SilkSimulationMaterial } from "./SilkMaterial";
import { SILK_CONFIG } from "./silk.config";

export interface SilkPointerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
}

const FBO_SETTINGS = {
  type: THREE.HalfFloatType,
  format: THREE.RGBAFormat,
  depthBuffer: false,
  stencilBuffer: false,
  // Linear, not nearest: the 256x256 sim resolution is intentionally
  // coarse (cheap per §6 "GPU load"), and nearest-filtering it produced a
  // visible staircase edge on the displaced surface when magnified across
  // the full plane. Linear-sampling both the simulation's own neighbor
  // reads and the display read smooths that out; it softens the Laplacian
  // stencil very slightly, which is imperceptible at this scale.
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  wrapS: THREE.ClampToEdgeWrapping,
  wrapT: THREE.ClampToEdgeWrapping,
} as const;

export interface SilkTouchConfig {
  simResolution: number;
  waveSpeed: number;
  damping: number;
  brushRadius: number;
  brushElongation: number;
  brushStrength: number;
}

export function useSilkSimulation(
  pointerRef: React.RefObject<SilkPointerState>,
  touch: SilkTouchConfig = SILK_CONFIG.touch,
) {
  const { gl } = useThree();
  const resolution = touch.simResolution;

  const targetA = useFBO(resolution, resolution, FBO_SETTINGS);
  const targetB = useFBO(resolution, resolution, FBO_SETTINGS);
  const pingPong = useRef({ read: targetA, write: targetB });

  const simMaterial = useMemo(() => new SilkSimulationMaterial(), []);
  const simScene = useMemo(() => new THREE.Scene(), []);
  const simCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);
  const simMesh = useMemo(
    () => new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial),
    [simMaterial],
  );

  const outputTexture = useRef<THREE.Texture>(targetA.texture);

  useEffect(() => {
    simScene.add(simMesh);
    simMaterial.uTexel.set(1 / resolution, 1 / resolution);
    simMaterial.uWaveSpeed = touch.waveSpeed;
    simMaterial.uDamping = touch.damping;
    simMaterial.uBrushRadius = touch.brushRadius;
    simMaterial.uBrushElongation = touch.brushElongation;
    simMaterial.uBrushStrength = touch.brushStrength;
    return () => {
      simScene.remove(simMesh);
      simMesh.geometry.dispose();
      simMaterial.dispose();
    };
  }, [simScene, simMesh, simMaterial, resolution, touch]);

  useFrame((_state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const { read, write } = pingPong.current;
    const pointer = pointerRef.current;

    simMaterial.uPrevState = read.texture;
    simMaterial.uDt = dt;
    if (pointer) {
      simMaterial.uPointer.set(pointer.x, pointer.y);
      simMaterial.uPointerVelocity.set(pointer.vx, pointer.vy);
      simMaterial.uPointerActive = pointer.active ? 1 : 0;
    }

    const prevTarget = gl.getRenderTarget();
    gl.setRenderTarget(write);
    gl.render(simScene, simCamera);
    gl.setRenderTarget(prevTarget);

    pingPong.current = { read: write, write: read };
    outputTexture.current = write.texture;
  });

  return outputTexture;
}

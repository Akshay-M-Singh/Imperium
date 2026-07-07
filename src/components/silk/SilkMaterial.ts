// SilkMaterial.ts — assembles the GLSL fragments (noise, lighting, the
// silk vertex/fragment shaders) into two THREE.ShaderMaterial subclasses
// via drei's `shaderMaterial` helper, and registers them as JSX intrinsics
// with `extend` (design spec §2.2, §2.3). Nothing here should ever need
// tuning — taste dials live in silk.config.ts, not here.

import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { simplexNoise2d, simplexNoise3d, fbm2d } from "./shaders/noise";
import { lightingFunctions } from "./shaders/lighting";
import { silkVertexShader } from "./shaders/silk.vert";
import { silkFragmentShader } from "./shaders/silk.frag";
import { simulationVertexShader } from "./shaders/simulation.vert";
import { simulationFragmentShader } from "./shaders/simulation.frag";

const noiseLib = simplexNoise2d + simplexNoise3d + fbm2d;

export const SilkMaterial = shaderMaterial(
  {
    uTime: 0,
    uSimTexture: null as THREE.Texture | null,
    uSimEnabled: 0,
    uEntryProgress: 1,
    uFoldDepth: 0.22,
    uFoldDirection: (34 * Math.PI) / 180,
    uWeightBias: 0.35,
    uPlateauCenter: new THREE.Vector2(0.5, 0.62),
    uPlateauRadius: 0.28,
    uPlateauSoftness: 0.22,
    uPlateauFlatten: 0.85,
    uIdleAmplitude: 0.05,
    uIdlePeriods: new THREE.Vector3(24, 41, 58),
    uBreathEnvelope: 0,
    uBreathAmplitude: 0.08,
    uCalmZoneCenter: new THREE.Vector2(0.5, 0.62),
    uCalmZoneRadius: 0.3,
    uCalmZoneDisplacementFactor: 0.3,
    uCalmZoneSpecularFactor: 0.4,
    uDisplacementCeiling: 0.03,
    uAspect: 1,
    uSheenHighlight: new THREE.Color("#F3E9D5"),
    uLitSilk: new THREE.Color("#D9C5A5"),
    uBase: new THREE.Color("#C3A985"),
    uDeepFold: new THREE.Color("#6E5A40"),
    uDeepFoldCool: new THREE.Color("#1B2A4A"),
    uDeepFoldCoolAmount: 0.06,
    uGlintBias: new THREE.Color("#C4A76C"),
    uKeyDir: new THREE.Vector3(-0.6, 0.6, 0.7),
    uKeyColor: new THREE.Color("#FFF3DE"),
    uKeyIntensity: 1.1,
    uFillDir: new THREE.Vector3(0.6, -0.4, 0.7),
    uFillColor: new THREE.Color("#DCE6EE"),
    uFillIntensity: 0.35,
    uWrapDiffuse: 0.35,
    uAnisotropySpread: 0.28,
    uSheenWidth: 0.4,
    uCurvatureAoStrength: 0.5,
    uWeaveFrequency: 220,
    uWeaveAmplitude: 0.15,
    uWeaveMoireFadeStart: 0.6,
    uGrainAmount: 0.018,
    uDitherAmount: 1,
    uVignetteStrength: 0.18,
    uVignetteRadius: 0.85,
  },
  noiseLib + silkVertexShader,
  lightingFunctions + silkFragmentShader,
  (material) => {
    if (material) {
      material.toneMapped = false;
    }
  },
);

export const SilkSimulationMaterial = shaderMaterial(
  {
    uPrevState: null as THREE.Texture | null,
    uPointer: new THREE.Vector2(0.5, 0.5),
    uPointerVelocity: new THREE.Vector2(0, 0),
    uPointerActive: 0,
    uDt: 0,
    uWaveSpeed: 0.9,
    uDamping: 3.4,
    uBrushRadius: 0.12,
    uBrushElongation: 2.6,
    uBrushStrength: 0.9,
    uTexel: new THREE.Vector2(1 / 256, 1 / 256),
  },
  simulationVertexShader,
  simulationFragmentShader,
);

// Deliberately NOT registered via `extend()` as JSX intrinsics
// (`<silkMaterial />`). Typing per-uniform props on a custom JSX element
// is fragile across three/@react-three/fiber versions; instead
// SilkPlane/useSilkSimulation construct instances directly
// (`new SilkMaterial()`) and mount them with `<primitive attach="material" object={...} />`,
// setting uniforms as plain properties (`material.uTime = ...`). Simpler
// to read for a learner-maintained codebase — see silk/README.md.

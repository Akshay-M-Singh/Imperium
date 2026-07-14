// The texture-first material: the baked 5K still IS the look; the shaders
// add only (a) small clamped vertex displacement from the wave sim +
// idle drift and (b) a lighting-only "delta sheen" from the deformation
// normals. No blur, grain, or post of any kind (client brief hard rule).
//
// Built with drei's `shaderMaterial` (matching ../SilkMaterial.ts's
// established convention, not a raw `THREE.ShaderMaterial` subclass with
// `.uniforms.x.value` access) — it generates plain-property uniform
// setters, which is both simpler for a learner-maintained codebase and
// avoids fighting `noUncheckedIndexedAccess` on every uniform read/write.

import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

const vertexShader = /* glsl */ `
  uniform sampler2D uSimTexture;
  uniform float uSimEnabled;
  uniform float uSimTexel;
  uniform float uTime;
  uniform float uDisplacement;   // world units == viewportHeight * ceiling
  uniform float uInPlaneTug;
  uniform float uIdleAmplitude;  // world units
  uniform vec2 uIdlePeriods;
  uniform vec2 uCalmCenter;
  uniform float uCalmRadius;
  uniform float uCalmFactor;

  varying vec2 vUv;
  varying float vHeight;   // sim height, calm-attenuated, [-1, 1]-ish
  varying vec2 vGrad;      // sim height gradient, calm-attenuated

  void main() {
    vUv = uv;

    float h = 0.0;
    vec2 grad = vec2(0.0);
    if (uSimEnabled > 0.5) {
      float t = uSimTexel;
      h = texture2D(uSimTexture, uv).r;
      float hx = texture2D(uSimTexture, uv + vec2(t, 0.0)).r
               - texture2D(uSimTexture, uv - vec2(t, 0.0)).r;
      float hy = texture2D(uSimTexture, uv + vec2(0.0, t)).r
               - texture2D(uSimTexture, uv - vec2(0.0, t)).r;
      grad = vec2(hx, hy) / (2.0 * t);
    }

    // Idle drift: two slow, incommensurate waves. Amplitude is small and
    // pre-scaled to world units on the CPU.
    float idle =
      sin(uv.x * 4.7 + uv.y * 1.3 + uTime * 6.2831853 / uIdlePeriods.x) *
      sin(uv.y * 3.1 - uv.x * 0.9 + uTime * 6.2831853 / uIdlePeriods.y);

    // Calm zone: attenuate BOTH sim and idle near the wordmark.
    vec2 d = uv - uCalmCenter;
    float calm = 1.0 - uCalmFactor * exp(-dot(d, d) / (uCalmRadius * uCalmRadius));

    h *= calm;
    grad *= calm;
    float z = h * uDisplacement + idle * uIdleAmplitude * calm;

    vHeight = h;
    vGrad = grad;

    // In-plane tug: fabric pulled slightly toward the deformation, which
    // reads as tension rather than a bump. Hard-capped by uDisplacement.
    vec2 tug = -grad * uInPlaneTug * uDisplacement;
    vec3 displaced = position + vec3(tug, z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uUvScale;
  uniform vec2 uUvOffset;
  uniform float uTime;
  uniform float uSheenStrength;
  uniform float uSheenPower;
  uniform float uNormalScale;
  uniform float uHeightShade;
  uniform float uLightAzimuth;
  uniform float uSheenMigration;

  varying vec2 vUv;
  varying float vHeight;
  varying vec2 vGrad;

  void main() {
    vec2 uv = vUv * uUvScale + uUvOffset;
    vec3 base = texture2D(uMap, uv).rgb; // sRGB texture: hardware-decoded to linear

    // Deformation normal (flat surface => (0,0,1) => zero delta).
    vec3 n = normalize(vec3(-vGrad * uNormalScale, 1.0));
    float az = uLightAzimuth + uTime * uSheenMigration;
    vec3 L = normalize(vec3(cos(az) * 0.6, sin(az) * 0.6, 0.8));
    vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(n, H), 0.0), uSheenPower);
    // Flat-surface baseline, subtracted so the resting fabric shows the
    // texture EXACTLY as baked (delta is zero at rest).
    vec3 n0 = vec3(0.0, 0.0, 1.0);
    float spec0 = pow(max(dot(n0, H), 0.0), uSheenPower);

    float delta = (spec - spec0) * uSheenStrength * 8.0 - vHeight * uHeightShade * 0.2;
    delta = clamp(delta, -0.12, 0.12);

    gl_FragColor = vec4(base * (1.0 + delta), 1.0);
    #include <colorspace_fragment>
  }
`;

export const SilkFabricMaterial = shaderMaterial(
  {
    uMap: null as THREE.Texture | null,
    uSimTexture: null as THREE.Texture | null,
    uSimEnabled: 0,
    uSimTexel: 1 / 256,
    uTime: 0,
    uDisplacement: 0,
    uInPlaneTug: 0,
    uIdleAmplitude: 0,
    uIdlePeriods: new THREE.Vector2(31, 53),
    uUvScale: new THREE.Vector2(1, 1),
    uUvOffset: new THREE.Vector2(0, 0),
    uSheenStrength: 0,
    uSheenPower: 14,
    uNormalScale: 2.4,
    uHeightShade: 0.35,
    uLightAzimuth: -2.35,
    uSheenMigration: 0.003,
    uCalmCenter: new THREE.Vector2(0.5, 0.55),
    uCalmRadius: 0.3,
    uCalmFactor: 0.7,
  },
  vertexShader,
  fragmentShader,
  (material) => {
    if (material) {
      material.toneMapped = false;
    }
  },
);

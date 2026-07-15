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
  uniform float uIdleWarp;       // ambient warp contribution (sim-UV gradient units)
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
      // Sample the gradient over a wider baseline than one texel: the sim
      // is a coarse 256x256 heightfield, and a single-texel central
      // difference amplifies per-texel noise straight into the fragment
      // warp below (a photographic texture is very sensitive to sampling
      // the wrong pixel). The brush radius is ~60 texels wide, so a 4-texel
      // baseline still resolves the actual fold shape with no loss --
      // it just low-pass-filters out the noise a 1-texel diff would catch.
      float t = uSimTexel * 4.0;
      h = texture2D(uSimTexture, uv).r;
      float hx = texture2D(uSimTexture, uv + vec2(t, 0.0)).r
               - texture2D(uSimTexture, uv - vec2(t, 0.0)).r;
      float hy = texture2D(uSimTexture, uv + vec2(0.0, t)).r
               - texture2D(uSimTexture, uv - vec2(0.0, t)).r;
      grad = vec2(hx, hy) / (2.0 * t);
      // Safety cap on the raw gradient magnitude (direction-preserving):
      // the central-difference read amplifies per-texel sim noise, and once
      // enough energy has accumulated in the sim (sustained/looping cursor
      // motion) that noise can spike past any sane slope, surfacing as a
      // jagged/serrated edge in the fragment-shader warp downstream. This
      // is independent of uWarpStrength -- it bounds the SOURCE signal, not
      // just its visual scale, so no amount of accumulated sim energy can
      // produce a glitch.
      float gradLen = length(grad);
      const float GRAD_CAP = 2.0;
      if (gradLen > GRAD_CAP) grad *= GRAD_CAP / gradLen;
    }

    // Idle drift: two slow, incommensurate waves. Amplitude is small and
    // pre-scaled to world units on the CPU. We keep the two sines factored
    // out so we can also form the field's analytic gradient (below) for a
    // whisper of ambient texture warp — otherwise a motionless cursor leaves
    // the photo perfectly frozen, which reads as "still image + highlight".
    float arg1 = uv.x * 4.7 + uv.y * 1.3 + uTime * 6.2831853 / uIdlePeriods.x;
    float arg2 = uv.y * 3.1 - uv.x * 0.9 + uTime * 6.2831853 / uIdlePeriods.y;
    float sa = sin(arg1);
    float sb = sin(arg2);
    float idle = sa * sb;
    // d(idle)/d(uv): product rule over the two sines.
    vec2 idleGrad = vec2(
      cos(arg1) * 4.7 * sb + sa * cos(arg2) * (-0.9),
      cos(arg1) * 1.3 * sb + sa * cos(arg2) * 3.1
    );

    // Calm zone: attenuate BOTH sim and idle near the wordmark.
    vec2 d = uv - uCalmCenter;
    float calm = 1.0 - uCalmFactor * exp(-dot(d, d) / (uCalmRadius * uCalmRadius));

    h *= calm;
    grad *= calm;
    float z = h * uDisplacement + idle * uIdleAmplitude * calm;

    vHeight = h;
    // The fragment shader offsets its texture sampling by vGrad — the sim's
    // cursor-driven fold dominates; the tiny idle term keeps the surface
    // subtly alive at rest.
    vGrad = grad + idleGrad * uIdleWarp * calm;

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
  uniform float uWarpStrength;
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
    // Displacement mapping: shift which texture pixels land here by the
    // deformation slope. This is what makes the woven silk itself visibly
    // fold/drag under the cursor (not just a moving highlight over a frozen
    // photo). Sign matches the vertex in-plane tug — the weave is pulled
    // toward the deformation, reading as tension in the cloth. Scaled by
    // uUvScale so the warp is a consistent fraction of the visible image
    // regardless of the cover-crop aspect. Clamped to keep the sample inside
    // the texture so folds never smear the cropped edge.
    vec2 uv = vUv * uUvScale + uUvOffset;
    // Bound the offset magnitude to uWarpStrength (fraction of the visible
    // image): the raw height-gradient spikes at sharp fold edges, and an
    // unbounded offset there samples the texture too far and aliases into a
    // sandy stipple. A hard clamp() here creates a discontinuity exactly
    // where it kicks in, which reads as a jagged ring around the brush --
    // the opposite of "unmistakably silk." tanh() saturates smoothly toward
    // the same bound instead, so the fold's edge stays soft everywhere.
    vec2 warpMax = uWarpStrength * uUvScale;
    vec2 rawWarp = -vGrad * uUvScale;
    vec2 warp = warpMax * vec2(tanh(rawWarp.x / max(warpMax.x, 1e-5)), tanh(rawWarp.y / max(warpMax.y, 1e-5)));
    uv = clamp(uv + warp, vec2(0.0), vec2(1.0));
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
    uIdleWarp: 0,
    uUvScale: new THREE.Vector2(1, 1),
    uUvOffset: new THREE.Vector2(0, 0),
    uWarpStrength: 0,
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

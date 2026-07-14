# Silk Hero Interactive Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero's static, under-resolution backdrop photo with an interactive WebGL silk background that uses the client-selected 5120×2880 rendered silk still as its base texture, with subtle cursor-driven deformation — changing nothing else on the site.

**Architecture:** A new `src/components/silk/fabric/` module renders a texture-mapped, subdivided plane in an R3F canvas. The existing FBO wave simulation (`useSilkSimulation`) and pointer tracking (`useSilkPointer`) drive small vertex displacement plus a lighting-only "delta sheen"; the photographic texture always dominates. A wrapper mirrors the proven `SilkHero` gating (WebGL2 / reduced-motion / save-data / kill-switch / context-loss → static poster of the same still).

**Tech Stack:** Next.js 15 (App Router), React 19, three 0.185 + @react-three/fiber 9 + @react-three/drei 10 (all already installed), CSS Modules, Vitest 2 (unit), Playwright (verification script).

**Spec:** `docs/superpowers/specs/2026-07-14-silk-hero-interactive-background-design.md` — read it first. The client brief's hard rules are restated below.

## Global Constraints

- Branch: `feat/silk-hero-interactive-background`, created from `main` **after** `feat/silk-hero-background-assets` is merged (Task 0 verifies the assets exist).
- **Do not change:** navbar, typography, logo, buttons, hero copy, spacing, layout, positioning, the hero's `.overlay`/`.dissolve` divs, any other section, the `/ar` locale behaviour, or the old procedural silk look in `src/components/silk/*` (only the modifications listed in tasks below are allowed there).
- Silk textures are served **as-is from `/public`** — never via `next/image` or any optimizer. The poster `<img>` is a plain tag, not `next/image`.
- Renderer DPR = `min(window.devicePixelRatio, 2.5)` (R3F `dpr={[1, 2.5]}`). Never render a small buffer and stretch it.
- Vertex displacement is hard-clamped ≤ 2.5% of viewport height. Photographic detail must remain clearly visible; deformation is subtle.
- **Forbidden** (client brief): blur, bloom, noise overlays, added grain, chromatic aberration, motion blur, CSS filters, sharpening, water ripples, circular waves, cursor glow, visible distortion circles, spotlight, liquid effects, rubber stretching.
- No React state updates inside `useFrame`; no per-frame allocations (reuse vectors).
- Quality gates (Task 11/12) decide completion. If pixelation, stretching, or compression is detected — **the work is not complete**; do not claim otherwise.
- Conventional commits (`feat:`/`fix:`/`docs:`/`test:` …); commit at the end of every task; end commit messages with `Co-Authored-By: Claude <noreply@anthropic.com>`.
- All quality gates must stay green throughout: `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`.

## File Structure

```
src/components/silk/fabric/
  fabric.config.ts               taste dials for the fabric layer (NEW — old silk.config.ts untouched except where noted)
  chooseTextureTier.ts           pure tier-selection fn (unit-tested)
  coverUv.ts                     pure cover-fit UV math (unit-tested)
  SilkFabricMaterial.ts          ShaderMaterial subclass (vertex displacement + delta sheen)
  SilkFabricPlane.tsx            mesh + per-frame uniforms
  SilkFabricCanvas.tsx           R3F <Canvas>, texture load/config, diagnostics
  SilkFabricBackground.tsx       gating wrapper + poster + crossfade
  SilkFabricBackground.module.css
  diagnostics.ts                 collect/log the 9 required values (unit-tested shape)
src/lib/webgl.ts                 MODIFY: probe adds maxTextureSize + maxAnisotropy
src/components/silk/useSilkSimulation.ts  MODIFY: optional touch-config parameter
src/components/sections/Hero.tsx MODIFY: backdrop swap only
tests/unit/silk/fabric/          chooseTextureTier, coverUv, fabric.config, diagnostics tests
scripts/verify-silk-quality.mjs  Playwright verification matrix + final report (NEW)
```

---

### Task 0: Branch and baseline

**Files:** none created — environment check only.

- [ ] **Step 1: Verify assets and create the branch**

```bash
cd ~/Desktop/Builds/Imperium
git checkout main && git pull origin main
ls -la public/images/hero/silk/   # MUST list silk-5120.jpg, silk-3840.jpg, silk-2048.jpg
git checkout -b feat/silk-hero-interactive-background
```

If `public/images/hero/silk/` is missing: STOP — merge `feat/silk-hero-background-assets` first.

- [ ] **Step 2: Verify the baseline is green**

```bash
npm ci && npm run test && npm run typecheck && npm run build
```

Expected: all pass (test suite has been 61+/green since Phase 5). If not, stop and report — do not build on a red baseline.

---

### Task 1: Extend the WebGL capability probe

**Files:**

- Modify: `src/lib/webgl.ts`
- Test: `tests/unit/lib/webgl.test.ts` (create if absent)

**Interfaces:**

- Produces: `WebglCapability` gains `maxTextureSize: number` and `maxAnisotropy: number` (both `0` when WebGL2 is unavailable). `getWebglCapability()` signature unchanged.

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/lib/webgl.test.ts
import { describe, expect, it } from "vitest";
import { getWebglCapability } from "@/lib/webgl";

describe("getWebglCapability", () => {
  it("returns numeric texture limits even when WebGL2 is unavailable (jsdom)", () => {
    const cap = getWebglCapability();
    // jsdom has no WebGL: the probe must fall back, not throw.
    expect(cap.webgl2).toBe(false);
    expect(cap.maxTextureSize).toBe(0);
    expect(cap.maxAnisotropy).toBe(0);
  });
});
```

- [ ] **Step 2: Run it — expect FAIL** (`maxTextureSize` undefined)

```bash
npx vitest run tests/unit/lib/webgl.test.ts
```

- [ ] **Step 3: Implement**

In `src/lib/webgl.ts`, extend the interface and both return paths of `probe()`:

```ts
export interface WebglCapability {
  webgl2: boolean;
  halfFloatFbo: boolean;
  maxTextureSize: number;
  maxAnisotropy: number;
}
```

Failure paths return `{ webgl2: false, halfFloatFbo: false, maxTextureSize: 0, maxAnisotropy: 0 }`. Success path adds:

```ts
const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
const anisoExt =
  gl.getExtension("EXT_texture_filter_anisotropic") ||
  gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
const maxAnisotropy = anisoExt
  ? (gl.getParameter(anisoExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number)
  : 0;
return { webgl2: true, halfFloatFbo: Boolean(halfFloat), maxTextureSize, maxAnisotropy };
```

- [ ] **Step 4: Run test + typecheck — expect PASS** (`npx vitest run tests/unit/lib/webgl.test.ts && npm run typecheck`)

- [ ] **Step 5: Commit** — `feat: report texture limits from webgl capability probe`

---

### Task 2: Fabric config

**Files:**

- Create: `src/components/silk/fabric/fabric.config.ts`
- Test: `tests/unit/silk/fabric/fabric.config.test.ts`

**Interfaces:**

- Produces: `SILK_FABRIC_CONFIG` (const object below) — later tasks import `render`, `texture`, `motion`, `sheen`, `calm` sections verbatim.

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/silk/fabric/fabric.config.test.ts
import { describe, expect, it } from "vitest";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { SILK_FABRIC_CONFIG } from "@/components/silk/fabric/fabric.config";

describe("SILK_FABRIC_CONFIG", () => {
  it("caps DPR at 2.5 per the client brief", () => {
    expect(SILK_FABRIC_CONFIG.render.dprCap).toBe(2.5);
  });

  it("clamps displacement to at most 2.5% of viewport height", () => {
    expect(SILK_FABRIC_CONFIG.motion.displacementCeiling).toBeLessThanOrEqual(0.025);
  });

  it("keeps the cursor radius inside the 200-350 CSS px band at 1080p", () => {
    // brushRadius is in sim-UV space, mapped over the viewport height.
    const px = SILK_FABRIC_CONFIG.motion.brushRadius * 1080;
    expect(px).toBeGreaterThanOrEqual(200);
    expect(px).toBeLessThanOrEqual(350);
  });

  it("ships every texture tier it names", () => {
    for (const tier of SILK_FABRIC_CONFIG.texture.tiers) {
      const p = join(process.cwd(), "public", tier.src);
      expect(existsSync(p), `${tier.src} missing`).toBe(true);
      expect(statSync(p).size).toBeGreaterThan(50_000);
    }
  });
});
```

- [ ] **Step 2: Run it — expect FAIL** (module not found)

- [ ] **Step 3: Implement**

```ts
// src/components/silk/fabric/fabric.config.ts
// Taste dials for the texture-based fabric layer. The old SILK_CONFIG in
// ../silk.config.ts belongs to the retired procedural look — leave it be.

export const SILK_FABRIC_CONFIG = {
  render: {
    dprCap: 2.5, // client brief: min(devicePixelRatio, 2.5), never lower without measurement
    planeSegments: [192, 108] as const, // [x, y]; adaptive ladder may drop to [128, 72]
  },
  texture: {
    aspect: 5120 / 2880,
    tiers: [
      { src: "/images/hero/silk/silk-2048.jpg", width: 2048, height: 1152 },
      { src: "/images/hero/silk/silk-3840.jpg", width: 3840, height: 2160 },
      { src: "/images/hero/silk/silk-5120.jpg", width: 5120, height: 2880 },
    ] as const,
    posterSrc: "/images/hero/silk/silk-3840.jpg",
  },
  motion: {
    displacementCeiling: 0.022, // fraction of viewport height, hard clamp
    inPlaneTug: 0.14, // XY drag as a fraction of Z displacement (fabric tension read)
    brushRadius: 0.24, // sim-UV; ≈260 CSS px on a 1080p viewport (brief: 200-350)
    brushStrength: 0.55,
    settleSeconds: 2.2, // over-damped; no bounce, no rings
    idleAmplitude: 0.16, // fraction of displacementCeiling
    idlePeriodsSec: [31, 53] as const, // non-integer ratio — no visible loop
  },
  sheen: {
    strength: 0.09, // max luminance delta from deformation lighting (≤0.12 clamp in shader)
    power: 14,
    normalScale: 2.4,
    heightShade: 0.35, // crease darkening from sim height
    migrationRadPerSec: 0.003, // slow key-light azimuth drift while idle
    baseAzimuthRad: -2.35, // upper-left, matches the baked still's key light
  },
  calm: {
    center: [0.5, 0.55] as const, // plane-UV (viewport) centre of the wordmark zone (y up)
    radius: 0.3,
    factor: 0.7, // 70% attenuation of displacement + sheen inside the zone
  },
} as const;

export type SilkFabricConfig = typeof SILK_FABRIC_CONFIG;
```

- [ ] **Step 4: Run test — expect PASS** (`npx vitest run tests/unit/silk/fabric/fabric.config.test.ts`)

- [ ] **Step 5: Commit** — `feat: add fabric layer config for silk hero background`

---

### Task 3: Texture tier selection (pure function)

**Files:**

- Create: `src/components/silk/fabric/chooseTextureTier.ts`
- Test: `tests/unit/silk/fabric/chooseTextureTier.test.ts`

**Interfaces:**

- Consumes: `SILK_FABRIC_CONFIG.texture.tiers`
- Produces: `chooseTextureTier(cssWidth: number, devicePixelRatio: number, maxTextureSize: number): { src: string; width: number; height: number }`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/silk/fabric/chooseTextureTier.test.ts
import { describe, expect, it } from "vitest";
import { chooseTextureTier } from "@/components/silk/fabric/chooseTextureTier";

describe("chooseTextureTier", () => {
  it("picks the 2048 tier for a mobile viewport", () => {
    expect(chooseTextureTier(390, 3, 8192).width).toBe(2048);
    // 390 × min(3, 2.5) = 975 needed → smallest tier ≥ 975 is 2048
  });

  it("picks the 3840 tier for 1920 CSS px at DPR 2", () => {
    expect(chooseTextureTier(1920, 2, 16384).width).toBe(3840);
  });

  it("picks the 5120 tier when 3840 is not enough", () => {
    expect(chooseTextureTier(2560, 2, 16384).width).toBe(5120); // needs 5120
  });

  it("allows 3840 on a 4096-cap GPU but never 5120", () => {
    // needed = 2560 × 2.5 = 6400; 5120 exceeds the GPU cap, so the largest
    // allowed tier (3840) wins even though it is smaller than needed.
    expect(chooseTextureTier(2560, 2.5, 4096).width).toBe(3840);
  });

  it("caps effective DPR at 2.5", () => {
    expect(chooseTextureTier(1280, 4, 16384).width).toBe(3840); // 1280×2.5=3200 → 3840
  });

  it("falls back to the smallest tier when maxTextureSize is unknown (0)", () => {
    expect(chooseTextureTier(1920, 2, 0).width).toBe(2048);
  });
});
```

- [ ] **Step 2: Run it — expect FAIL** (module not found)

- [ ] **Step 3: Implement**

```ts
// src/components/silk/fabric/chooseTextureTier.ts
import { SILK_FABRIC_CONFIG } from "./fabric.config";

const DPR_CAP = SILK_FABRIC_CONFIG.render.dprCap;

export interface TextureTier {
  src: string;
  width: number;
  height: number;
}

/**
 * Smallest shipped tier whose width covers cssWidth × min(dpr, 2.5),
 * clamped by the GPU's MAX_TEXTURE_SIZE. maxTextureSize=0 (unknown /
 * probe failed) degrades to the smallest tier — safe, never broken.
 */
export function chooseTextureTier(
  cssWidth: number,
  devicePixelRatio: number,
  maxTextureSize: number,
): TextureTier {
  const tiers = SILK_FABRIC_CONFIG.texture.tiers;
  if (maxTextureSize <= 0) return tiers[0];

  const needed = cssWidth * Math.min(devicePixelRatio, DPR_CAP);
  const allowed = tiers.filter((t) => t.width <= maxTextureSize);
  if (allowed.length === 0) return tiers[0];

  for (const tier of allowed) {
    if (tier.width >= needed) return tier;
  }
  return allowed[allowed.length - 1];
}
```

- [ ] **Step 4: Run test — expect PASS**

- [ ] **Step 5: Commit** — `feat: add texture tier selection for silk fabric background`

---

### Task 4: Cover-fit UV math (pure function)

**Files:**

- Create: `src/components/silk/fabric/coverUv.ts`
- Test: `tests/unit/silk/fabric/coverUv.test.ts`

**Interfaces:**

- Produces: `coverUv(planeAspect: number, textureAspect: number): { scale: [number, number]; offset: [number, number] }` — `object-fit: cover` semantics; crops the overflow axis, never stretches.

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/silk/fabric/coverUv.test.ts
import { describe, expect, it } from "vitest";
import { coverUv } from "@/components/silk/fabric/coverUv";

const TEX = 5120 / 2880; // 1.777…

describe("coverUv", () => {
  it("is identity when aspects match", () => {
    const { scale, offset } = coverUv(TEX, TEX);
    expect(scale[0]).toBeCloseTo(1);
    expect(scale[1]).toBeCloseTo(1);
    expect(offset[0]).toBeCloseTo(0);
    expect(offset[1]).toBeCloseTo(0);
  });

  it("crops width (never squashes) on a portrait phone", () => {
    const { scale, offset } = coverUv(390 / 844, TEX);
    expect(scale[1]).toBeCloseTo(1); // full height used
    expect(scale[0]).toBeCloseTo(390 / 844 / TEX); // narrow horizontal window
    expect(offset[0]).toBeCloseTo((1 - scale[0]) / 2); // centred crop
  });

  it("crops height on an ultrawide viewport", () => {
    const { scale, offset } = coverUv(21 / 9, TEX);
    expect(scale[0]).toBeCloseTo(1);
    expect(scale[1]).toBeCloseTo(TEX / (21 / 9));
    expect(offset[1]).toBeCloseTo((1 - scale[1]) / 2);
  });
});
```

- [ ] **Step 2: Run it — expect FAIL**

- [ ] **Step 3: Implement**

```ts
// src/components/silk/fabric/coverUv.ts
/** object-fit: cover for texture UVs. Crop, never stretch (client brief). */
export function coverUv(
  planeAspect: number,
  textureAspect: number,
): { scale: [number, number]; offset: [number, number] } {
  if (planeAspect > textureAspect) {
    // viewport is wider than the texture: full width, crop top/bottom
    const sy = textureAspect / planeAspect;
    return { scale: [1, sy], offset: [0, (1 - sy) / 2] };
  }
  // viewport is narrower: full height, crop left/right (centred keeps the
  // calm zone behind the centred wordmark)
  const sx = planeAspect / textureAspect;
  return { scale: [sx, 1], offset: [(1 - sx) / 2, 0] };
}
```

- [ ] **Step 4: Run test — expect PASS**

- [ ] **Step 5: Commit** — `feat: add cover-fit uv mapping for silk texture`

---

### Task 5: Parametrize the wave simulation's touch config

**Files:**

- Modify: `src/components/silk/useSilkSimulation.ts`

**Interfaces:**

- Produces: `useSilkSimulation(pointerRef, touch?: TouchConfig)` where `TouchConfig = { simResolution; waveSpeed; damping; brushRadius; brushElongation; brushStrength }`. Default remains `SILK_CONFIG.touch` — existing callers unchanged.

- [ ] **Step 1: Modify the hook**

In `src/components/silk/useSilkSimulation.ts`, add the parameter (keep everything else identical):

```ts
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
  const resolution = touch.simResolution;
  ...
```

and inside the `useEffect`, replace every `SILK_CONFIG.touch.X` read with `touch.X` (five uniforms: `uWaveSpeed`, `uDamping`, `uBrushRadius`, `uBrushElongation`, `uBrushStrength`); add `touch` to the effect's dependency array.

- [ ] **Step 2: Verify nothing regressed**

```bash
npm run typecheck && npm run test
```

Expected: green — the default parameter keeps the old `SilkCanvas`/`SilkPlane` path byte-identical in behaviour.

- [ ] **Step 3: Commit** — `refactor: allow custom touch config in silk wave simulation`

---

### Task 6: SilkFabricMaterial (shaders)

**Files:**

- Create: `src/components/silk/fabric/SilkFabricMaterial.ts`

**Interfaces:**

- Produces: `class SilkFabricMaterial extends THREE.ShaderMaterial` with uniforms settable via plain properties on `.uniforms`: `uMap`, `uSimTexture`, `uSimEnabled`, `uSimTexel`, `uTime`, `uDisplacement`, `uInPlaneTug`, `uIdleAmplitude`, `uIdlePeriods`, `uUvScale`, `uUvOffset`, `uSheenStrength`, `uSheenPower`, `uNormalScale`, `uHeightShade`, `uLightAzimuth`, `uSheenMigration`, `uCalmCenter`, `uCalmRadius`, `uCalmFactor`. Consumed by Task 7.

- [ ] **Step 1: Implement**

```ts
// src/components/silk/fabric/SilkFabricMaterial.ts
// The texture-first material: the baked 5K still IS the look; the shaders
// add only (a) small clamped vertex displacement from the wave sim +
// idle drift and (b) a lighting-only "delta sheen" from the deformation
// normals. No blur, grain, or post of any kind (client brief hard rule).

import * as THREE from "three";

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

export class SilkFabricMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        uMap: { value: null },
        uSimTexture: { value: null },
        uSimEnabled: { value: 0 },
        uSimTexel: { value: 1 / 256 },
        uTime: { value: 0 },
        uDisplacement: { value: 0 },
        uInPlaneTug: { value: 0 },
        uIdleAmplitude: { value: 0 },
        uIdlePeriods: { value: new THREE.Vector2(31, 53) },
        uUvScale: { value: new THREE.Vector2(1, 1) },
        uUvOffset: { value: new THREE.Vector2(0, 0) },
        uSheenStrength: { value: 0 },
        uSheenPower: { value: 14 },
        uNormalScale: { value: 2.4 },
        uHeightShade: { value: 0.35 },
        uLightAzimuth: { value: -2.35 },
        uSheenMigration: { value: 0.003 },
        uCalmCenter: { value: new THREE.Vector2(0.5, 0.55) },
        uCalmRadius: { value: 0.3 },
        uCalmFactor: { value: 0.7 },
      },
    });
  }
}
```

- [ ] **Step 2: Typecheck** (`npm run typecheck`) — expect PASS.

- [ ] **Step 3: Commit** — `feat: add silk fabric shader material`

---

### Task 7: SilkFabricPlane

**Files:**

- Create: `src/components/silk/fabric/SilkFabricPlane.tsx`

**Interfaces:**

- Consumes: `SilkFabricMaterial` (Task 6), `coverUv` (Task 4), `SILK_FABRIC_CONFIG` (Task 2), `useSilkSimulation`/`useSilkPointer` types.
- Produces: `<SilkFabricPlane texture={THREE.Texture} simTextureRef={React.RefObject<THREE.Texture|null>} simEnabled={boolean} />`

- [ ] **Step 1: Implement**

```tsx
// src/components/silk/fabric/SilkFabricPlane.tsx
"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { SilkFabricMaterial } from "./SilkFabricMaterial";
import { coverUv } from "./coverUv";
import { SILK_FABRIC_CONFIG } from "./fabric.config";

export interface SilkFabricPlaneProps {
  texture: THREE.Texture;
  simTextureRef: React.RefObject<THREE.Texture | null>;
  simEnabled: boolean;
}

export function SilkFabricPlane({ texture, simTextureRef, simEnabled }: SilkFabricPlaneProps) {
  const { viewport } = useThree();
  const material = useMemo(() => new SilkFabricMaterial(), []);
  const [segX, segY] = SILK_FABRIC_CONFIG.render.planeSegments;

  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    const { motion, sheen, calm, texture: tex } = SILK_FABRIC_CONFIG;
    const u = material.uniforms;
    u.uMap.value = texture;
    u.uSimEnabled.value = simEnabled ? 1 : 0;
    // World units: viewport.height is the visible height at z=0.
    u.uDisplacement.value = viewport.height * motion.displacementCeiling;
    u.uInPlaneTug.value = motion.inPlaneTug;
    u.uIdleAmplitude.value = viewport.height * motion.displacementCeiling * motion.idleAmplitude;
    u.uIdlePeriods.value.set(motion.idlePeriodsSec[0], motion.idlePeriodsSec[1]);
    u.uSheenStrength.value = sheen.strength;
    u.uSheenPower.value = sheen.power;
    u.uNormalScale.value = sheen.normalScale;
    u.uHeightShade.value = sheen.heightShade;
    u.uLightAzimuth.value = sheen.baseAzimuthRad;
    u.uSheenMigration.value = sheen.migrationRadPerSec;
    u.uCalmCenter.value.set(calm.center[0], calm.center[1]);
    u.uCalmRadius.value = calm.radius;
    u.uCalmFactor.value = calm.factor;

    const { scale, offset } = coverUv(viewport.width / viewport.height, tex.aspect);
    u.uUvScale.value.set(scale[0], scale[1]);
    u.uUvOffset.value.set(offset[0], offset[1]);
  }, [material, texture, simEnabled, viewport.width, viewport.height]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uSimTexture.value = simTextureRef.current;
  });

  return (
    <mesh material={material} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, segX, segY]} />
    </mesh>
  );
}
```

- [ ] **Step 2: Typecheck** — expect PASS.

- [ ] **Step 3: Commit** — `feat: add silk fabric plane with cover-fit texture mapping`

---

### Task 8: SilkFabricCanvas + diagnostics

**Files:**

- Create: `src/components/silk/fabric/diagnostics.ts`
- Create: `src/components/silk/fabric/SilkFabricCanvas.tsx`
- Create: `src/components/silk/fabric/SilkFabricCanvas.module.css`
- Test: `tests/unit/silk/fabric/diagnostics.test.ts`

**Interfaces:**

- Produces: `collectSilkDiagnostics(args) → SilkDiagnostics` (shape below, exposed on `window.__SILK_DIAGNOSTICS__`) and `<SilkFabricCanvas isDesktop active enableSimulation onReady onContextLost onContextRestored />` (same prop contract as the old `SilkCanvas`).

- [ ] **Step 1: Write the failing diagnostics test**

```ts
// tests/unit/silk/fabric/diagnostics.test.ts
import { describe, expect, it } from "vitest";
import { collectSilkDiagnostics } from "@/components/silk/fabric/diagnostics";

describe("collectSilkDiagnostics", () => {
  it("assembles the nine client-required values", () => {
    const d = collectSilkDiagnostics({
      cssWidth: 1920,
      cssHeight: 1080,
      devicePixelRatio: 2,
      rendererPixelRatio: 2,
      drawingBufferWidth: 3840,
      drawingBufferHeight: 2160,
      textureWidth: 3840,
      textureHeight: 2160,
      maxTextureSize: 16384,
      anisotropy: 16,
    });
    expect(d.drawingBufferWidth).toBe(3840);
    expect(d.retinaExact).toBe(true); // buffer == css × renderer ratio
  });

  it("flags a stretched buffer", () => {
    const d = collectSilkDiagnostics({
      cssWidth: 1920,
      cssHeight: 1080,
      devicePixelRatio: 2,
      rendererPixelRatio: 2,
      drawingBufferWidth: 1920, // WRONG: rendered small, stretched 2x
      drawingBufferHeight: 1080,
      textureWidth: 3840,
      textureHeight: 2160,
      maxTextureSize: 16384,
      anisotropy: 16,
    });
    expect(d.retinaExact).toBe(false);
  });
});
```

- [ ] **Step 2: Run it — expect FAIL**

- [ ] **Step 3: Implement diagnostics**

```ts
// src/components/silk/fabric/diagnostics.ts
// The client brief demands these nine values be logged and verifiable
// after implementation. The verification script (scripts/
// verify-silk-quality.mjs) reads window.__SILK_DIAGNOSTICS__.

export interface SilkDiagnostics {
  cssWidth: number;
  cssHeight: number;
  devicePixelRatio: number;
  rendererPixelRatio: number;
  drawingBufferWidth: number;
  drawingBufferHeight: number;
  textureWidth: number;
  textureHeight: number;
  maxTextureSize: number;
  anisotropy: number;
  retinaExact: boolean;
}

export function collectSilkDiagnostics(
  values: Omit<SilkDiagnostics, "retinaExact">,
): SilkDiagnostics {
  const retinaExact =
    Math.abs(values.drawingBufferWidth - values.cssWidth * values.rendererPixelRatio) <= 1 &&
    Math.abs(values.drawingBufferHeight - values.cssHeight * values.rendererPixelRatio) <= 1;
  return { ...values, retinaExact };
}

declare global {
  interface Window {
    __SILK_DIAGNOSTICS__?: SilkDiagnostics;
  }
}

export function publishSilkDiagnostics(d: SilkDiagnostics): void {
  window.__SILK_DIAGNOSTICS__ = d;
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.table(d);
  }
}
```

- [ ] **Step 4: Run diagnostics test — expect PASS**

- [ ] **Step 5: Implement the canvas**

```tsx
// src/components/silk/fabric/SilkFabricCanvas.tsx
"use client";

// Owns: renderer setup (DPR ≤ 2.5, sRGB out, no tone mapping), texture
// tier load + sampling config, pointer smoothing, sim wiring, context
// loss, and the diagnostics contract. Loaded only via SilkFabricBackground's
// next/dynamic(..., { ssr: false }).

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { useSilkPointer } from "../useSilkPointer";
import { useSilkSimulation } from "../useSilkSimulation";
import { SilkFabricPlane } from "./SilkFabricPlane";
import { chooseTextureTier } from "./chooseTextureTier";
import { SILK_FABRIC_CONFIG } from "./fabric.config";
import { getWebglCapability } from "@/lib/webgl";
import { collectSilkDiagnostics, publishSilkDiagnostics } from "./diagnostics";
import styles from "./SilkFabricCanvas.module.css";

const POINTER_SPRING = { stiffness: 55, damping: 18, mass: 0.6 };

const FABRIC_TOUCH = {
  simResolution: 256,
  waveSpeed: 0.05,
  damping: 3.4, // over-damped: no bounce, no rings (brief hard rule)
  brushRadius: SILK_FABRIC_CONFIG.motion.brushRadius,
  brushElongation: 2.6,
  brushStrength: SILK_FABRIC_CONFIG.motion.brushStrength,
};

function FabricScene({
  texture,
  simEnabled,
  smoothX,
  smoothY,
}: {
  texture: THREE.Texture;
  simEnabled: boolean;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
}) {
  const pointerRef = useSilkPointer(smoothX, smoothY);
  const simTextureRef = useSilkSimulation(pointerRef, FABRIC_TOUCH);
  return (
    <SilkFabricPlane texture={texture} simTextureRef={simTextureRef} simEnabled={simEnabled} />
  );
}

const NO_SIM_REF = { current: null } as const;

function FabricSceneIdle({
  texture,
  smoothX,
  smoothY,
}: {
  texture: THREE.Texture;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
}) {
  useSilkPointer(smoothX, smoothY);
  return <SilkFabricPlane texture={texture} simTextureRef={NO_SIM_REF} simEnabled={false} />;
}

function TextureGate({
  enableSimulation,
  smoothX,
  smoothY,
  onReady,
}: {
  enableSimulation: boolean;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
  onReady: () => void;
}) {
  const { gl, size } = useThree();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const caps = gl.capabilities;
    const tier = chooseTextureTier(size.width, window.devicePixelRatio || 1, caps.maxTextureSize);
    let disposed = false;
    new THREE.TextureLoader().load(tier.src, (tex) => {
      if (disposed) {
        tex.dispose();
        return;
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = caps.getMaxAnisotropy();
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.needsUpdate = true;
      setTexture(tex);

      publishSilkDiagnostics(
        collectSilkDiagnostics({
          cssWidth: size.width,
          cssHeight: size.height,
          devicePixelRatio: window.devicePixelRatio || 1,
          rendererPixelRatio: gl.getPixelRatio(),
          drawingBufferWidth: gl.getContext().drawingBufferWidth,
          drawingBufferHeight: gl.getContext().drawingBufferHeight,
          textureWidth: tier.width,
          textureHeight: tier.height,
          maxTextureSize: caps.maxTextureSize,
          anisotropy: tex.anisotropy,
        }),
      );
      onReady();
    });
    return () => {
      disposed = true;
    };
    // Intentionally mount-only: tier re-selection on live resize would
    // re-download textures mid-session for no visual gain.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => texture?.dispose(), [texture]);

  if (!texture) return null;
  return enableSimulation ? (
    <FabricScene texture={texture} simEnabled smoothX={smoothX} smoothY={smoothY} />
  ) : (
    <FabricSceneIdle texture={texture} smoothX={smoothX} smoothY={smoothY} />
  );
}

export interface SilkFabricCanvasProps {
  isDesktop: boolean;
  enableSimulation: boolean;
  active: boolean;
  onReady: () => void;
  onContextLost: () => void;
  onContextRestored: () => void;
}

export function SilkFabricCanvas({
  isDesktop,
  enableSimulation,
  active,
  onReady,
  onContextLost,
  onContextRestored,
}: SilkFabricCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.62);
  const smoothX = useSpring(pointerX, POINTER_SPRING);
  const smoothY = useSpring(pointerY, POINTER_SPRING);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const updateFromPoint = (clientX: number, clientY: number) => {
      const rect = node.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointerX.set((clientX - rect.left) / rect.width);
      pointerY.set(1 - (clientY - rect.top) / rect.height);
    };
    const handlePointerMove = (e: PointerEvent) => updateFromPoint(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) updateFromPoint(t.clientX, t.clientY);
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [pointerX, pointerY]);

  // NOTE the DPR contract (client brief): min(devicePixelRatio, 2.5) on
  // every device class. Unlike the old SilkCanvas there is no lower iOS
  // cap by default — reduce only if Task 12's measurement demands it.
  void isDesktop;

  return (
    <div ref={containerRef} className={styles.canvasWrap} aria-hidden="true">
      <Canvas
        className={styles.canvas}
        dpr={[1, SILK_FABRIC_CONFIG.render.dprCap]}
        gl={{ antialias: false, toneMapping: THREE.NoToneMapping, alpha: false }}
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 12], fov: 20 }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            onContextLost();
          });
          gl.domElement.addEventListener("webglcontextrestored", onContextRestored);
        }}
      >
        <TextureGate
          enableSimulation={enableSimulation && getWebglCapability().halfFloatFbo}
          smoothX={smoothX}
          smoothY={smoothY}
          onReady={onReady}
        />
      </Canvas>
    </div>
  );
}

export default SilkFabricCanvas;
```

```css
/* src/components/silk/fabric/SilkFabricCanvas.module.css */
.canvasWrap {
  position: absolute;
  inset: 0;
}

.canvas {
  width: 100%;
  height: 100%;
}
```

- [ ] **Step 6: Typecheck + full test run** (`npm run typecheck && npm run test`) — expect PASS.

- [ ] **Step 7: Commit** — `feat: add silk fabric canvas with tier loading and diagnostics`

---

### Task 9: SilkFabricBackground wrapper (gating + poster)

**Files:**

- Create: `src/components/silk/fabric/SilkFabricBackground.tsx`
- Create: `src/components/silk/fabric/SilkFabricBackground.module.css`

**Interfaces:**

- Consumes: `SilkFabricCanvas` (Task 8), `SILK_FABRIC_CONFIG.texture.posterSrc`, hooks `useIntersectionObserver`, `useMediaQuery`, `useReducedMotion`, `isSlowConnection`, `getWebglCapability` (all pre-existing — same imports as `src/components/silk/SilkHero.tsx`).
- Produces: `<SilkFabricBackground />` (no props) — Hero mounts this in Task 10.

- [ ] **Step 1: Implement**

Model directly on `src/components/silk/SilkHero.tsx` (read it first — the gating states, `mounted` hydration guard, and visibility logic are copied intact). Differences only:

```tsx
// src/components/silk/fabric/SilkFabricBackground.tsx
"use client";

// Gating wrapper for the texture-based silk background. Same fallback
// contract as the retired SilkHero: no WebGL2, prefers-reduced-motion,
// save-data/slow connection, NEXT_PUBLIC_SILK_HERO=off, or context loss
// all resolve to the static poster — which is the SAME image the live
// canvas renders at rest, so the fallback is visually identical.

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { isSlowConnection } from "@/lib/connection";
import { getWebglCapability } from "@/lib/webgl";
import { SILK_FABRIC_CONFIG } from "./fabric.config";
import styles from "./SilkFabricBackground.module.css";

const SilkFabricCanvas = dynamic(
  () => import("./SilkFabricCanvas").then((m) => m.SilkFabricCanvas),
  { ssr: false },
);

export function SilkFabricBackground() {
  const { ref: visibilityRef, isVisible } = useIntersectionObserver({
    threshold: 0.05,
    once: false,
  });
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reducedMotion = useReducedMotion();
  const [slow] = useState(isSlowConnection);
  const [documentHidden, setDocumentHidden] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handler = () => setDocumentHidden(document.hidden);
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  const capability = getWebglCapability();
  const shouldAttemptLive =
    mounted &&
    capability.webgl2 &&
    !reducedMotion &&
    !slow &&
    process.env.NEXT_PUBLIC_SILK_HERO !== "off" &&
    !contextLost;
  const active = isVisible && !documentHidden;

  return (
    <div
      ref={visibilityRef as React.RefObject<HTMLDivElement>}
      className={styles.wrap}
      data-testid="silk-fabric-background"
    >
      {/* Plain img on purpose: this asset must never pass through an
          optimizer (client brief). It is also the LCP image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SILK_FABRIC_CONFIG.texture.posterSrc}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className={styles.poster}
      />
      {shouldAttemptLive && (
        <div className={canvasReady ? styles.canvasReady : styles.canvasHidden}>
          <SilkFabricCanvas
            isDesktop={isDesktop}
            enableSimulation={capability.halfFloatFbo}
            active={active}
            onReady={() => setCanvasReady(true)}
            onContextLost={() => setContextLost(true)}
            onContextRestored={() => setContextLost(false)}
          />
        </div>
      )}
    </div>
  );
}

export default SilkFabricBackground;
```

```css
/* src/components/silk/fabric/SilkFabricBackground.module.css */
.wrap {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.canvasHidden,
.canvasReady {
  position: absolute;
  inset: 0;
  transition: opacity 600ms ease;
}

.canvasHidden {
  opacity: 0;
}

.canvasReady {
  opacity: 1;
}
```

- [ ] **Step 2: Typecheck + tests** — expect PASS.

- [ ] **Step 3: Commit** — `feat: add gated silk fabric background with identical poster fallback`

---

### Task 10: Surgical Hero swap

**Files:**

- Modify: `src/components/sections/Hero.tsx` (backdrop block only, lines ~22–32)
- Test: run the existing Hero/section unit tests untouched — they must pass unchanged unless they assert on the old backdrop `<Image>`; if one does, update ONLY that assertion to the new `data-testid="silk-fabric-background"`.

**Interfaces:**

- Consumes: `SilkFabricBackground` (Task 9).

- [ ] **Step 1: Swap the backdrop**

In `src/components/sections/Hero.tsx`, replace exactly this block:

```tsx
<div className={styles.backdrop} aria-hidden="true">
  <Image
    src="/images/hero/hero.jpg"
    alt=""
    fill
    priority
    quality={90}
    sizes="100vw"
    className={styles.backdropImage}
  />
</div>
```

with:

```tsx
<div className={styles.backdrop} aria-hidden="true">
  <SilkFabricBackground />
</div>
```

Add the import `import { SilkFabricBackground } from "@/components/silk/fabric/SilkFabricBackground";`. If `Image` is now only used by the wordmark branch, KEEP the import (the `SITE.logoSrc` branch still uses it). Update the file's header comment to note the backdrop is now the interactive silk (2026 date + spec path). **Touch nothing else in the file** — eyebrow, h1, tagline, CTAs, scroll indicator, overlay, dissolve all stay byte-identical.

- [ ] **Step 2: Verify gates + both locales render**

```bash
npm run test && npm run typecheck && npm run build
```

Expected: green. If a Hero test referenced the old `<Image>` backdrop, fix that single assertion as described above.

- [ ] **Step 3: Visual smoke in the browser**

```bash
npm run dev
```

Visit `http://localhost:3000/` and `http://localhost:3000/ar`: poster appears immediately, canvas cross-fades in, cursor produces a soft broad deformation, wordmark/CTAs/nav unchanged, no console errors. Check `window.__SILK_DIAGNOSTICS__` in the console — all nine values present.

- [ ] **Step 4: Commit** — `feat: swap hero backdrop for interactive silk fabric background`

---

### Task 11: Verification script (quality gates)

**Files:**

- Create: `scripts/verify-silk-quality.mjs`

**Interfaces:**

- Consumes: `window.__SILK_DIAGNOSTICS__` (Task 8). Dev server on :3000.
- Produces: screenshot set + `FINAL REPORT` printout; non-zero exit on any gate failure.

- [ ] **Step 1: Implement**

```js
// scripts/verify-silk-quality.mjs
// Client-brief verification matrix. Prereq: `npm run dev` on :3000.
// Usage: node scripts/verify-silk-quality.mjs [baseUrl]
// Note: FPS under SwiftShader is NOT representative — measure FPS
// manually on real hardware; this script verifies resolution truth.

import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir } from "fs/promises";

const BASE = process.argv[2] ?? "http://localhost:3000";
const OUT = "verification/silk";
const MATRIX = [
  { w: 1920, h: 1080, dpr: 1 },
  { w: 1920, h: 1080, dpr: 2 },
  { w: 2560, h: 1440, dpr: 1 },
  { w: 2560, h: 1440, dpr: 2 },
  { w: 1512, h: 982, dpr: 2 }, // MacBook Retina
  { w: 3840, h: 2160, dpr: 1 }, // 4K desktop
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({
  args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"],
});

let failed = false;
const rows = [];

for (const { w, h, dpr } of MATRIX) {
  const page = await browser.newPage({
    viewport: { width: w, height: h },
    deviceScaleFactor: dpr,
  });
  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 45000 });
  await page.addStyleTag({ content: "nextjs-portal { display:none !important; }" });
  try {
    await page.waitForFunction(() => Boolean(window.__SILK_DIAGNOSTICS__), null, {
      timeout: 20000,
    });
  } catch {
    console.error(`✗ ${w}x${h}@${dpr}: diagnostics never published (canvas failed?)`);
    failed = true;
    await page.close();
    continue;
  }
  await page.waitForTimeout(1500); // crossfade settle
  const d = await page.evaluate(() => window.__SILK_DIAGNOSTICS__);

  const expectedRatio = Math.min(dpr, 2.5);
  const bufferOk =
    Math.abs(d.drawingBufferWidth - w * expectedRatio) <= 2 && d.retinaExact === true;
  const textureOk = d.textureWidth >= Math.min(w * expectedRatio, 5120) || d.textureWidth === 5120;
  if (!bufferOk) {
    console.error(
      `✗ ${w}x${h}@${dpr}: drawing buffer ${d.drawingBufferWidth} !== ${w * expectedRatio}`,
    );
    failed = true;
  }
  if (!textureOk) {
    console.error(`✗ ${w}x${h}@${dpr}: texture tier ${d.textureWidth} too small`);
    failed = true;
  }

  const shot = `${OUT}/hero-${w}x${h}@${dpr}.png`;
  await page.screenshot({ path: shot, clip: { x: 0, y: 0, width: w, height: h } });
  // 100%-zoom crop from the busiest fold region for manual inspection
  await sharp(shot)
    .extract({ left: Math.floor(w * 0.05), top: Math.floor(h * 0.6), width: 800, height: 400 })
    .toFile(`${OUT}/crop-${w}x${h}@${dpr}.png`);

  rows.push({ res: `${w}x${h}@${dpr}`, ...d, bufferOk, textureOk });
  await page.close();
}

await browser.close();
console.table(
  rows.map(
    ({
      res,
      rendererPixelRatio,
      drawingBufferWidth,
      drawingBufferHeight,
      textureWidth,
      maxTextureSize,
      anisotropy,
      bufferOk,
    }) => ({
      res,
      rendererPixelRatio,
      drawingBufferWidth,
      drawingBufferHeight,
      textureWidth,
      maxTextureSize,
      anisotropy,
      bufferOk,
    }),
  ),
);
console.log(
  failed
    ? "\n❌ GATES FAILED — do not claim completion."
    : "\n✅ Resolution gates passed. Now inspect verification/silk/crop-*.png at 100% zoom.",
);
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Run it**

```bash
npm run dev &   # if not already running
node scripts/verify-silk-quality.mjs
```

Expected: table of six rows, all `bufferOk: true`, exit 0. Then **open every `verification/silk/crop-*.png` and inspect at 100% zoom** — fibre grain visible, no pixelation, no blur, wordmark row shows crisp type.

- [ ] **Step 3: Add `verification/` to `.gitignore`** (screenshots are ephemeral artifacts):

```bash
echo "verification/" >> .gitignore
```

- [ ] **Step 4: Commit** — `test: add silk quality verification matrix script`

---

### Task 12: Performance measurement + final report

**Files:** none new — measurement and the report demanded by the client brief.

- [ ] **Step 1: FPS on real hardware**

In Chrome (not headless) on this Mac, on `http://localhost:3000/`: open DevTools → Rendering → Frame Rendering Stats. Move the cursor over the hero for 30s. Record average FPS. Repeat with DevTools Performance panel for a 10s trace; confirm no long tasks from the canvas and no React re-renders inside the loop (React DevTools profiler shows zero commits while idling over the hero).

- [ ] **Step 2: GPU memory estimate**

Texture tiers: 3840×2160×4B ≈ 33 MB (+33% mipmaps ≈ 44 MB) for the 3840 tier; 5120 tier ≈ 59→79 MB. Add FBOs (2 × 256×256×8B ≈ 1 MB) and geometry (~0.5 MB). Record which tier the test machine loaded (from diagnostics) and the corresponding figure. `chrome://gpu` + Activity Monitor GPU column corroborate.

- [ ] **Step 3: If FPS < 55 on this desktop** — apply the adaptive ladder IN ORDER, re-measuring after each rung: (1) `planeSegments` [192,108] → [128,72]; (2) `simResolution` 256 → 192; (3) simplify sheen (drop `uHeightShade` term). **Never** reduce DPR or texture tier on desktop to fix FPS — that violates the brief's resolution-first rule.

- [ ] **Step 4: Mobile check** — Playwright mobile viewport (390×844 @ DPR 3) via `node scripts/verify-silk-quality.mjs` with a temporary matrix row, or real device if available: 2048 tier loads, DPR capped at 2.5, still sharp, idle-only motion acceptable.

- [ ] **Step 5: Produce the FINAL REPORT** (client-brief format, values from diagnostics + measurements):

```
SOURCE TEXTURE   Intrinsic width / height: (tier loaded per display class)
DISPLAY          CSS canvas width / height, devicePixelRatio
WEBGL            Renderer pixel ratio, drawing buffer w/h, MAX_TEXTURE_SIZE, anisotropy
PERFORMANCE      Average desktop FPS, approx GPU memory, mobile fallback used
QUALITY CHECK    Visible pixelation Y/N · Texture stretching Y/N ·
                 Image compression detected Y/N · Retina rendering verified Y/N
```

If pixelation / stretching / compression = YES: **stop, fix, re-verify.** Do not proceed to Task 13.

- [ ] **Step 6: Commit any tuning** — `perf: tune silk fabric quality ladder after measurement`

---

### Task 13: Deployed-output verification (Vercel)

**Files:** none — production pipeline check demanded by the brief.

- [ ] **Step 1: Push the branch; let Vercel build a preview deployment**

```bash
git push -u origin feat/silk-hero-interactive-background
```

Get the preview URL from the Vercel dashboard or the GitHub PR check (user has access; ask them if the URL isn't visible to you).

- [ ] **Step 2: Verify the deployed texture bytes are untouched**

```bash
LOCAL=$(shasum -a 256 public/images/hero/silk/silk-3840.jpg | cut -d' ' -f1)
REMOTE=$(curl -sL https://<preview-url>/images/hero/silk/silk-3840.jpg | shasum -a 256 | cut -d' ' -f1)
[ "$LOCAL" = "$REMOTE" ] && echo "✅ bytes identical" || echo "❌ COMPRESSION/REWRITE DETECTED"
```

Repeat for `silk-5120.jpg` and `silk-2048.jpg`. All three must match. If they don't, find and disable whatever rewrote them (this is a completion blocker).

- [ ] **Step 3: Run the verification matrix against the deployment**

```bash
node scripts/verify-silk-quality.mjs https://<preview-url>
```

Expected: same green table as localhost. Inspect the crops again.

- [ ] **Step 4: Confirm `hero.jpg` preload is gone** — `curl -s https://<preview-url>/ | grep -c "hero.jpg"` should be `0` (the old `next/image` preload disappeared with the swap) and `grep -c "silk-3840"` should be ≥ 1.

---

### Task 14: Docs + branch finish

**Files:**

- Modify: `CLAUDE.md` (append an addendum), `progress.md` (placeholder backlog note)

- [ ] **Step 1: Append a CLAUDE.md addendum** (follow the existing "Addendum N (date):" style): the hero backdrop is now the interactive silk fabric background (spec + plan paths, branch name); the static `hero.jpg` remains in the repo as the client-approved reference but is no longer rendered; the silk textures in `public/images/hero/silk/` must never go through an optimizer; the kill switch `NEXT_PUBLIC_SILK_HERO=off` also disables this layer (poster-only).

- [ ] **Step 2: Update `progress.md`** — mark the hero-video/backdrop backlog item as superseded by the silk fabric background; note the verification script path.

- [ ] **Step 3: Full gate sweep**

```bash
npm run test && npm run typecheck && npm run lint && npm run build
```

All green, plus Task 11 exit 0, plus Task 12 report clean, plus Task 13 bytes identical.

- [ ] **Step 4: Commit docs** — `docs: record silk fabric hero background in brief and progress`

- [ ] **Step 5: Finish the branch** — invoke `superpowers:finishing-a-development-branch` (present merge/PR options to the user; deployment to production and flipping any env vars remain user decisions).

---

## Self-Review Notes

- Spec §4 (DPR ≤ 2.5, no small-buffer stretching) → Tasks 8, 11. Spec §5 (tier selection, sRGB, aniso, mipmaps, no optimizer, deployed bytes) → Tasks 3, 8, 13. Spec §6 (motion model, calm zone, no ripples) → Tasks 2, 5, 6, 7 + manual QA in 10/12. Spec §7 (pause offscreen/hidden, no state in loop, adaptive ladder) → Tasks 8, 9, 12. Spec §8 (diagnostics, matrix, report) → Tasks 8, 11, 12. Spec §9 (out of scope) → Global Constraints + Task 10's "touch nothing else".
- Type names cross-checked: `SilkPointerState` (existing), `SilkTouchConfig` (Task 5) consumed in Task 8's `FABRIC_TOUCH`; `TextureTier` (Task 3); `SilkDiagnostics` (Task 8); prop contracts between Tasks 7/8/9/10 match.
- Known judgement calls for the executor: shader taste constants in `fabric.config.ts` are first-pass values — tune visually in Task 10 Step 3 / Task 12, keeping every hard clamp (displacement ≤ 2.5%, sheen delta ≤ 0.12) intact.

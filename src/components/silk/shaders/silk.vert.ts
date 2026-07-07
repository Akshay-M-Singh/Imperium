// silk.vert.ts — the heightfield displacement + finite-difference normal
// (design spec §2.2.2 "Surface"). GLSL as a template literal (no bundler
// loader needed). Composed with noise.ts via string concatenation in
// SilkMaterial.ts, not duplicated here.

export const silkVertexShader = /* glsl */ `
  uniform float uTime;
  uniform sampler2D uSimTexture;
  uniform float uSimEnabled;
  uniform float uEntryProgress;
  uniform float uFoldDepth;
  uniform float uFoldDirection;
  uniform float uWeightBias;
  uniform vec2 uPlateauCenter;
  uniform float uPlateauRadius;
  uniform float uPlateauSoftness;
  uniform float uPlateauFlatten;
  uniform float uIdleAmplitude;
  uniform vec3 uIdlePeriods;
  uniform float uBreathEnvelope;
  uniform float uBreathAmplitude;
  uniform vec2 uCalmZoneCenter;
  uniform float uCalmZoneRadius;
  uniform float uCalmZoneDisplacementFactor;
  uniform float uDisplacementCeiling;
  uniform float uAspect;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vHeight;
  varying vec3 vThreadDir;

  // -- noise + fbm inlined by SilkMaterial.ts above this block --

  float staticDrape(vec2 uv) {
    vec2 dir = vec2(cos(uFoldDirection), sin(uFoldDirection));
    float coord = dot(uv - 0.5, dir);

    float folds = 0.0;
    for (int i = 0; i < 4; i++) {
      float freq = 1.6 + float(i) * 1.1;
      folds += sin(coord * freq * 6.28318530718 + float(i) * 1.7) / freq;
    }
    folds *= uFoldDepth;
    folds += fbm2d(uv * 3.0, 2.0, 0.5) * uFoldDepth * 0.35;

    // Crease detail (added, human-authorized deviation from "config dials
    // only" — see silk/README.md "Known gaps" / progress.md notes). The
    // 4-term sum above tops out at ~4.9 cycles across the plane: however
    // much uFoldDepth scales it, that low a frequency can only ever read
    // as broad, soft rolling hills, never a sharp-edged crease — amplitude
    // deepens a smooth curve, it doesn't add the higher-frequency content
    // a defined fold edge needs. A pure sine octave here is a function of
    // coord alone (1D along the fold direction), so pushing its
    // frequency up on its own just produces perfectly parallel repeating
    // stripes ("corduroy"), not an organic crease — tried and rejected.
    // Instead: one modest sine octave a bit above the existing range for
    // a directional crease, plus a genuinely 2D, non-periodic fbm layer
    // (reusing the same fbm2d already used for the base drape's
    // irregularity, just at a higher frequency) so the fine detail breaks
    // up into organic creasing instead of a regular repeat. fbm2d is
    // 3-octave (lacunarity^2 growth), and SilkPlane's mesh is a fixed
    // 160x160 grid (SilkPlane.tsx) — an earlier attempt at (uv*8.0, 2.4,
    // ...) put the noise's own highest internal octave at ~46 cycles
    // across the plane, well past what 160 segments can interpolate
    // smoothly, which showed up as visible per-vertex faceting rather
    // than organic texture. Keeping lacunarity at the base drape's own
    // 2.0 and the frequency multiplier modest keeps the highest octave
    // (~7.0 x 2.0^2 = 28 cycles) inside a range the mesh renders cleanly.
    float creaseFold = sin(coord * 6.5 * 6.28318530718 + 0.6) * 0.18;
    folds += creaseFold * uFoldDepth;
    folds += fbm2d(uv * 7.0, 2.0, 0.5) * uFoldDepth * 0.2;

    // Weight bias toward the lower third (uv.y == 0 is the bottom edge).
    float weight = mix(1.0, 1.0 + uWeightBias, smoothstep(1.0, 0.0, uv.y));
    folds *= weight;

    // Calm plateau behind the wordmark — the resting pose flattens here.
    float distToPlateau = length((uv - uPlateauCenter) * vec2(uAspect, 1.0));
    float plateauMask = 1.0 - smoothstep(uPlateauRadius, uPlateauRadius + uPlateauSoftness, distToPlateau);
    folds *= mix(1.0, 1.0 - uPlateauFlatten, plateauMask);

    return folds;
  }

  float idleDrift(vec2 uv, float time) {
    float idle = simplexNoise3d(vec3(uv * 1.3, time / uIdlePeriods.x));
    idle += simplexNoise3d(vec3(uv * 2.1, time / uIdlePeriods.y)) * 0.6;
    idle += simplexNoise3d(vec3(uv * 0.7, time / uIdlePeriods.z)) * 0.4;
    idle *= uIdleAmplitude * uFoldDepth;
    idle *= (1.0 + uBreathEnvelope * uBreathAmplitude);
    return idle;
  }

  // A single diagonal tension wave, once, on entry (§3.7 step 3). Travels
  // along the fold direction as uEntryProgress goes 0 -> 1, then never
  // replays (the wrapper simply stops advancing uEntryProgress past 1).
  float entryWave(vec2 uv) {
    if (uEntryProgress >= 1.0) return 0.0;
    vec2 dir = vec2(cos(uFoldDirection), sin(uFoldDirection));
    float coord = dot(uv - 0.5, dir);
    float wavePos = coord - (uEntryProgress * 3.0 - 1.2);
    float envelope = exp(-8.0 * wavePos * wavePos) * (1.0 - uEntryProgress);
    return envelope * uFoldDepth * 1.2;
  }

  float totalHeight(vec2 uv) {
    float h = staticDrape(uv) + idleDrift(uv, uTime) + entryWave(uv);

    float simH = texture2D(uSimTexture, uv).r * uSimEnabled;
    float calmDist = length((uv - uCalmZoneCenter) * vec2(uAspect, 1.0));
    float calmMask = smoothstep(uCalmZoneRadius, uCalmZoneRadius + 0.15, calmDist);
    float calmFactor = mix(uCalmZoneDisplacementFactor, 1.0, calmMask);
    simH = clamp(simH * calmFactor, -uDisplacementCeiling, uDisplacementCeiling);

    return h + simH;
  }

  void main() {
    vUv = uv;

    float eps = 1.0 / 256.0;
    float hC = totalHeight(uv);
    float hX = totalHeight(uv + vec2(eps, 0.0));
    float hY = totalHeight(uv + vec2(0.0, eps));

    // Finite-difference normal from the total heightfield (§2.2.2).
    vec3 tangentX = vec3(1.0, 0.0, (hX - hC) / eps);
    vec3 tangentY = vec3(0.0, 1.0, (hY - hC) / eps);
    vNormal = normalize(cross(tangentX, tangentY));
    vThreadDir = normalize(vec3(cos(uFoldDirection), sin(uFoldDirection), 0.0));
    vHeight = hC;

    vec3 displaced = position + vec3(0.0, 0.0, hC);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

// silk.config.ts — every tunable "taste" dial for the Silk Hero in one
// place, per the learner-maintainability contract in
// docs/superpowers/specs/2026-07-07-silk-hero-experience-design.md §2.3:
// "taste is adjusted in one readable file, never inside GLSL." If you want
// deeper folds, a slower settle, or a bigger sheen band, change a number
// here — you should never need to open a .frag.ts file to restyle the look.

export const SILK_CONFIG = {
  // --- Palette (§3.3) — hex, converted to linear-space floats at material
  // creation time. Tone mapping is off, so these hexes survive to screen.
  color: {
    sheenHighlight: "#F3E9D5",
    litSilk: "#D9C5A5",
    base: "#C3A985",
    shadow: "#97805F",
    deepFold: "#6E5A40",
    deepFoldCoolBias: "#1B2A4A", // Blu Notte, blended ~6% into the deepest creases
    deepFoldCoolAmount: 0.06,
    glintBias: "#C4A76C", // Oro Antico — highlights lean gold, never yellow
  },

  // --- Resting drape (§3.1) — the art-directed fold shape at frame one,
  // before any interaction. Large, slow diagonal folds bottom-left to
  // top-right, weight low, a flattened plateau behind the wordmark.
  drape: {
    foldCount: 4,
    // First-pass value — deliberately restrained per §8.2 ("less than you
    // think"). Needs live recalibration against reference photography at
    // the Phase 2 client checkpoint (spec §10.2); this is not a final
    // tuned number.
    foldDepth: 0.1, // in heightfield units (see SilkPlane's world scale)
    foldDirectionDeg: 34, // sweep angle, bottom-left -> top-right
    weightBias: 0.35, // 0 = even, 1 = fully weighted to the lower third
    plateauRadius: 0.28, // normalized radius around the wordmark, in UV space
    plateauSoftness: 0.22,
    plateauFlatten: 0.6, // 0 = no effect, 1 = fully flat inside the radius
  },

  // --- Idle drift (§3.6) — slow procedural life, never performing.
  idle: {
    driftAmplitude: 0.05, // fraction of drape.foldDepth
    driftPeriodsSec: [24, 41, 58] as const, // 2-3 octaves, intentionally non-integer ratios
    breathIntervalSec: 38,
    breathDurationSec: 6,
    breathAmplitude: 0.08,
    sheenMigrationSpeed: 0.004, // radians/sec drift of the key-light azimuth
  },

  // --- Entry choreography (§3.7) — plays once, matches Hero.module.css's
  // hero-enter cascade (0/80/200/320ms delays).
  entry: {
    crossfadeMs: 600,
    waveDurationMs: 2400,
    waveDirectionDeg: 34, // matches drape.foldDirectionDeg — same sweep
    waveEasing: "expoOut" as const,
  },

  // --- Cursor / touch simulation (§3.5, §2.1) — the touch phase.
  touch: {
    simResolution: 256, // FBO width/height, RGBA16F (height + velocity)
    // CFL-stable at simResolution=256 and up to a ~1/30s timestep (see the
    // note in shaders/simulation.frag.ts on the dx^2 Laplacian
    // normalization). Raising simResolution requires lowering this —
    // stability scales with 1/dx, i.e. with simResolution.
    waveSpeed: 0.05, // propagation speed through the membrane
    damping: 3.4, // over-damped: no bounce, no rings
    brushRadius: 0.12, // in UV space
    brushElongation: 2.6, // stretch factor along the velocity vector
    brushStrength: 0.9,
    displacementCeiling: 0.03, // ~3% of viewport height, hard clamp (§3.5)
    settleSeconds: 2.2, // within the 1.8-2.6s band
    calmZoneRadius: 0.3, // matches drape.plateauRadius by default
    calmZoneDisplacementFactor: 0.3, // remaining displacement inside the calm zone (70% reduction)
    calmZoneSpecularFactor: 0.4,
  },

  // --- Lighting (§3.2) ---
  lighting: {
    keyAzimuthDeg: -45, // upper-left
    keyElevationDeg: 55,
    keyColor: "#FFF3DE",
    keyIntensity: 1.1,
    fillAzimuthDeg: 135, // lower-right
    fillElevationDeg: 30,
    fillColor: "#DCE6EE",
    fillIntensity: 0.35,
    wrapDiffuse: 0.35, // light wraps past the terminator
    anisotropySpread: 0.28, // Kajiya-Kay tangent-roughness
    sheenWidth: 0.4, // Charlie-sheen grazing-angle falloff
    curvatureAoStrength: 0.5,
  },

  // --- Weave detail (§3.4) — procedural micro-detail standing in for an
  // authored tileable normal map (that asset does not exist in the repo
  // yet; see silk/README.md "Known gaps"). Visible only inside the sheen
  // band, exactly like real silk where weave only shows where light rakes.
  weave: {
    // First-pass values — the earlier "checkerboard" reading during
    // testing turned out to be a separate dither-hash bug (see
    // shaders/lighting.ts), not this term. Still needs calibration
    // against real weave reference photography.
    frequency: 60,
    amplitude: 0.07, // fraction of the lighting normal
    moireFadeStart: 0.6, // screen-space frequency where fade-out begins
  },

  // --- Finish / grade (§3.3 tone mapping note, §2.2.3) ---
  grade: {
    grainAmount: 0.018,
    ditherAmount: 1.0, // in 8-bit steps; kills banding on the pale gradient
    vignetteStrength: 0.18,
    vignetteRadius: 0.85,
  },

  // --- Scroll coupling (§3.8) ---
  scroll: {
    parallaxFactor: 0.9,
    dragStrength: 0.15,
    exitFadeFraction: 0.8, // interactive amplitude reaches zero by this much scroll-out
    dissolveFraction: 0.12, // bottom N% of the canvas dissolves into Pietra
  },

  // --- Render / device ---
  render: {
    dprCap: 2,
    dprCapIos: 1.5,
  },
} as const;

export type SilkConfig = typeof SILK_CONFIG;

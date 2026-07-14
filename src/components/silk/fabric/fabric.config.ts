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

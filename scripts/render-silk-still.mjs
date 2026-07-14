#!/usr/bin/env node
// Offline silk-still renderer — produces the hero background texture.
//
// Renders an art-directed caramel silk drape as a float-precision
// heightfield (a few large curved fold ridges + very-low-frequency
// undulation), shades it with wrap-diffuse + dual specular lobes, maps
// tone through a colour ramp sampled from the client-approved
// public/images/hero/hero.jpg, and encodes at JPEG q95 with 4:4:4
// chroma (no subsampling — smooth gradients band otherwise).
//
// Usage:
//   node scripts/render-silk-still.mjs preview   # 1280×720 drafts, fast
//   node scripts/render-silk-still.mjs final     # 5120×2880 masters
//
// Output: public/images/hero/variants/silk-v{1,2,3}[-preview].jpg

import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const REPO = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(REPO, "public/images/hero/variants");

const MODE = process.argv[2] ?? "preview";
const ONLY = process.argv[3] ? Number(process.argv[3]) : null; // optional: render one variant
const [W, H] = MODE === "final" ? [5120, 2880] : [1280, 720];

// ---------------------------------------------------------------------------
// Palette — luminance ramp sampled from the approved hero.jpg, biased a
// touch darker per client note ("less bright, more premium"). Highlights
// stay champagne-amber; nothing reaches white.
const RAMP_SRGB = [
  [0.0, "#38200a"], // crease floor — deep brown, slightly desaturated
  [0.14, "#54300d"],
  [0.32, "#754413"],
  [0.5, "#8f571c"], // base caramel — darker + less orange than the photo
  [0.68, "#a66a28"],
  [0.84, "#bd8240"],
  [0.94, "#d09d5e"],
  [1.0, "#deb37a"], // peak sheen — muted champagne, never white
];

// Subtle cool (Blu Notte-adjacent) bias blended into the deepest creases,
// mirroring the silk module's deepFoldCoolBias idea.
const COOL = hexToLin("#1b2a4a");
const COOL_AMOUNT = 0.05;

function hexToLin(hex) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return c.map((v) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
}
function linToSrgb8(v) {
  const s = v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return Math.min(255, Math.max(0, s * 255));
}
const RAMP = RAMP_SRGB.map(([t, hex]) => [t, hexToLin(hex)]);

function rampColor(t) {
  t = Math.min(1, Math.max(0, t));
  for (let i = 1; i < RAMP.length; i++) {
    if (t <= RAMP[i][0]) {
      const [t0, c0] = RAMP[i - 1];
      const [t1, c1] = RAMP[i];
      const f = (t - t0) / (t1 - t0);
      return [
        c0[0] + (c1[0] - c0[0]) * f,
        c0[1] + (c1[1] - c0[1]) * f,
        c0[2] + (c1[2] - c0[2]) * f,
      ];
    }
  }
  return RAMP[RAMP.length - 1][1];
}

// ---------------------------------------------------------------------------
// Smooth value noise (quintic interpolation) — used ONLY at very low
// frequency for broad undulation, and at high frequency (tiny amplitude,
// anisotropic) for fibre grain. No FBM chaos.
function hash2(ix, iy, seed) {
  let h = (ix * 374761393 + iy * 668265263 + seed * 2246822519) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function noise2(x, y, seed) {
  const ix = Math.floor(x),
    iy = Math.floor(y);
  const fx = x - ix,
    fy = y - iy;
  const ux = fx * fx * fx * (fx * (fx * 6 - 15) + 10);
  const uy = fy * fy * fy * (fy * (fy * 6 - 15) + 10);
  const a = hash2(ix, iy, seed),
    b = hash2(ix + 1, iy, seed);
  const c = hash2(ix, iy + 1, seed),
    d = hash2(ix + 1, iy + 1, seed);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

// ---------------------------------------------------------------------------
// Fold ridge: a Gaussian-profile ridge along a gently curved centreline.
// Coordinates are normalized: x∈[0,aspect], y∈[0,1], y down.
// Each fold: { px, py, angleDeg, amp, sigma, bendAmp, bendFreq, bendPhase, skew }
function foldHeight(f, x, y) {
  const a = (f.angleDeg * Math.PI) / 180;
  const cosA = Math.cos(a),
    sinA = Math.sin(a);
  const dx = x - f.px,
    dy = y - f.py;
  const u = dx * cosA + dy * sinA; // along the fold
  let v = -dx * sinA + dy * cosA; // across the fold
  v -= f.bendAmp * Math.sin(u * f.bendFreq + f.bendPhase);
  const sigma = v > 0 ? f.sigma * (1 + f.skew) : f.sigma * (1 - f.skew);
  return f.amp * Math.exp(-(v * v) / (2 * sigma * sigma));
}

// ---------------------------------------------------------------------------
// Variant compositions. Centre-calm is an amplitude envelope on the folds
// (they fade approaching the wordmark zone), never a post-hoc flatten —
// that's what caused the "blob" in the failed shader capture.
// calm: { cx, cy, r, strength }
const VARIANTS = [
  {
    id: 1,
    name: "diagonal-cascade",
    label: "Diagonal cascade — 3 folds sweeping bottom-left to upper-right, calm upper centre",
    calm: { cx: 0.5, cy: 0.42, r: 0.46, strength: 0.72 },
    folds: [
      {
        px: 0.18,
        py: 0.95,
        angleDeg: -28,
        amp: 1.0,
        sigma: 0.085,
        bendAmp: 0.05,
        bendFreq: 2.6,
        bendPhase: 0.7,
        skew: 0.35,
      },
      {
        px: 0.05,
        py: 0.55,
        angleDeg: -24,
        amp: 0.75,
        sigma: 0.11,
        bendAmp: 0.07,
        bendFreq: 1.9,
        bendPhase: 2.4,
        skew: -0.25,
      },
      {
        px: 0.75,
        py: 1.05,
        angleDeg: -34,
        amp: 0.8,
        sigma: 0.095,
        bendAmp: 0.05,
        bendFreq: 2.2,
        bendPhase: 4.4,
        skew: 0.3,
      },
    ],
  },
  {
    id: 2,
    name: "s-curve-embrace",
    label: "S-curve embrace — 2 broad folds echoing the approved photo, widest calm field",
    calm: { cx: 0.5, cy: 0.45, r: 0.5, strength: 0.78 },
    folds: [
      {
        px: 0.3,
        py: 0.1,
        angleDeg: -52,
        amp: 0.95,
        sigma: 0.13,
        bendAmp: 0.11,
        bendFreq: 1.6,
        bendPhase: 1.2,
        skew: 0.3,
      },
      {
        px: 0.55,
        py: 1.0,
        angleDeg: -12,
        amp: 0.85,
        sigma: 0.12,
        bendAmp: 0.08,
        bendFreq: 1.8,
        bendPhase: 4.0,
        skew: -0.3,
      },
    ],
  },
  {
    id: 3,
    name: "corner-drape",
    label: "Corner drape — 4 folds weighted to lower-left and far-right, most dramatic",
    calm: { cx: 0.5, cy: 0.4, r: 0.42, strength: 0.7 },
    folds: [
      {
        px: 0.12,
        py: 0.85,
        angleDeg: -40,
        amp: 1.0,
        sigma: 0.08,
        bendAmp: 0.045,
        bendFreq: 2.8,
        bendPhase: 0.3,
        skew: 0.35,
      },
      {
        px: 0.02,
        py: 0.35,
        angleDeg: -46,
        amp: 0.6,
        sigma: 0.09,
        bendAmp: 0.05,
        bendFreq: 2.1,
        bendPhase: 2.9,
        skew: -0.2,
      },
      {
        px: 1.55,
        py: 0.75,
        angleDeg: -64,
        amp: 0.85,
        sigma: 0.1,
        bendAmp: 0.06,
        bendFreq: 1.9,
        bendPhase: 5.1,
        skew: 0.3,
      },
      {
        px: 0.95,
        py: 1.1,
        angleDeg: -18,
        amp: 0.7,
        sigma: 0.09,
        bendAmp: 0.05,
        bendFreq: 2.4,
        bendPhase: 3.6,
        skew: -0.25,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Lighting
const KEY = normalize([-0.55, -0.65, 0.85]); // upper-left, fairly high
const FILL = normalize([0.6, 0.45, 0.7]); // lower-right, soft
const SLOPE = 4.2; // heightfield slope → normal strength
const FOLD_DEPTH = 0.06; // world amplitude of amp=1 fold
const GRAIN_ROT = (-30 * Math.PI) / 180; // fibre streaks roughly along the folds

function normalize(v) {
  const l = Math.hypot(...v);
  return v.map((c) => c / l);
}

function renderVariant(variant) {
  const aspect = W / H;
  const buf = Buffer.alloc(W * H * 3);
  const heights = new Float32Array((W + 2) * (H + 2)); // +1 border for gradients

  // calm.cx is a fraction of the frame WIDTH (0.5 = behind the centred wordmark)
  const calmEnv = (x, y) => {
    const dx = (x - variant.calm.cx * aspect) / variant.calm.r;
    const dy = (y - variant.calm.cy) / variant.calm.r;
    return 1 - variant.calm.strength * Math.exp(-(dx * dx + dy * dy));
  };

  // Pass 1: heightfield (with 1px border so central differences stay in-bounds)
  for (let j = 0; j < H + 2; j++) {
    const y = (j - 1) / H;
    for (let i = 0; i < W + 2; i++) {
      const x = (i - 1) / H; // divide by H so units are square
      let h = 0;
      for (const f of variant.folds) h += foldHeight(f, x, y);
      h *= calmEnv(x, y);
      // broad undulation: two very-low-frequency octaves, small amplitude
      h += 0.11 * (noise2(x * 1.35 + 7.3, y * 1.35 + 2.1, 11) - 0.5);
      h += 0.05 * (noise2(x * 3.1 + 1.9, y * 3.1 + 9.4, 23) - 0.5);
      heights[j * (W + 2) + i] = h * FOLD_DEPTH;
    }
  }

  // Pass 2: shade
  const texel = 1 / H;
  for (let j = 0; j < H; j++) {
    const y = j / H;
    const row = (j + 1) * (W + 2);
    const rowUp = j * (W + 2);
    const rowDn = (j + 2) * (W + 2);
    for (let i = 0; i < W; i++) {
      const x = i / H;
      const c = row + i + 1;
      const dhx = (heights[c + 1] - heights[c - 1]) / (2 * texel);
      const dhy = (heights[rowDn + i + 1] - heights[rowUp + i + 1]) / (2 * texel);

      // normal
      let nx = -dhx * SLOPE,
        ny = -dhy * SLOPE,
        nz = 1;
      const nl = Math.hypot(nx, ny, nz);
      nx /= nl;
      ny /= nl;
      nz /= nl;

      // wrap diffuse, key + fill
      const wrap = 0.4;
      const dKey = Math.max(0, (nx * KEY[0] + ny * KEY[1] + nz * KEY[2] + wrap) / (1 + wrap));
      const dFill = Math.max(0, (nx * FILL[0] + ny * FILL[1] + nz * FILL[2] + wrap) / (1 + wrap));

      // dual specular lobes toward the key (view along +z → half-vector ≈ normalize(KEY + z))
      // Broad, soft lobes — silk sheen is a wide satin band, not a wet gloss line.
      const hv = normalize([KEY[0], KEY[1], KEY[2] + 1]);
      const ndh = Math.max(0, nx * hv[0] + ny * hv[1] + nz * hv[2]);
      const sheen = Math.pow(ndh, 22) * 0.26 + Math.pow(ndh, 6) * 0.16;

      // curvature AO — darken creases
      const lap =
        heights[c + 1] +
        heights[c - 1] +
        heights[rowDn + i + 1] +
        heights[rowUp + i + 1] -
        4 * heights[c];
      const ao = Math.min(0.22, Math.max(0, -lap * 3200 * texel));

      // tone in [0,1] — sits deliberately darker than a neutral exposure
      let t = 0.06 + 0.46 * dKey + 0.12 * dFill + sheen - ao;

      // fibre grain: anisotropic streaks rotated to run along the folds,
      // whisper-quiet, slightly stronger inside the sheen band
      const gx = x * Math.cos(GRAIN_ROT) - y * Math.sin(GRAIN_ROT);
      const gy = x * Math.sin(GRAIN_ROT) + y * Math.cos(GRAIN_ROT);
      const grainAmp = 0.009 + 0.01 * Math.min(1, sheen * 3);
      const g = noise2(gx * 1400, gy * 200, 41) - 0.5;
      const g2 = noise2(gx * 2900 + 31, gy * 640 + 17, 53) - 0.5; // finer second octave
      t += g * grainAmp + g2 * grainAmp * 0.55;

      // gentle vignette, centre biased slightly up
      const vx = (x - 0.5 * aspect) / aspect,
        vy = y - 0.44;
      t -= 0.1 * (vx * vx * 1.6 + vy * vy);

      let [r, gg, b] = rampColor(t);

      // cool bias in the deepest darks
      if (t < 0.18) {
        const f = COOL_AMOUNT * (1 - t / 0.18);
        r += (COOL[0] - r) * f;
        gg += (COOL[1] - gg) * f;
        b += (COOL[2] - b) * f;
      }

      // dither (breaks 8-bit banding on the long smooth gradients)
      const dth = (hash2(i, j, 97) - 0.5) / 255;
      const o = (j * W + i) * 3;
      buf[o] = Math.round(linToSrgb8(r) + dth * 255 * 0.8);
      buf[o + 1] = Math.round(linToSrgb8(gg) + dth * 255 * 0.8);
      buf[o + 2] = Math.round(linToSrgb8(b) + dth * 255 * 0.8);
    }
  }
  return buf;
}

// ---------------------------------------------------------------------------
await sharp({ create: { width: 1, height: 1, channels: 3, background: "#000" } }); // warm up
const { mkdir } = await import("fs/promises");
await mkdir(OUT_DIR, { recursive: true });

for (const variant of VARIANTS) {
  if (ONLY && variant.id !== ONLY) continue;
  const t0 = Date.now();
  const buf = renderVariant(variant);
  const suffix = MODE === "final" ? "" : "-preview";
  const out = path.join(OUT_DIR, `silk-v${variant.id}${suffix}.jpg`);
  await sharp(buf, { raw: { width: W, height: H, channels: 3 } })
    .jpeg({ quality: 95, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toFile(out);
  console.log(
    `✓ v${variant.id} ${variant.name} — ${W}×${H} in ${((Date.now() - t0) / 1000).toFixed(1)}s → ${out}`,
  );
}

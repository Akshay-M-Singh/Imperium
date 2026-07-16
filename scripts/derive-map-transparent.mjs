// derive-map-transparent — keys the baked-in checkerboard background out of
// the client's map export and writes a real RGBA PNG that renders on any
// section colour. The client delivered an opaque PNG (hasAlpha:no) with the
// editor's transparency-grid checkerboard flattened into the pixels; this
// removes it.
//
// Source (raw, non-served): assets/map/italy-gulf-routes-raw.png
// Output (served, referenced by WhyImperium.tsx:32):
//   public/images/map/italy-gulf-routes-v2.png
//
// Technique: background-connected flood fill. The checkerboard is neutral
// (chroma <= T_LOW); the gold artwork (landmasses, routes, dots, ITALY /
// UAE·GULF labels) is warm and saturated, so it never satisfies isNeutral.
// The fill seeds from the four image corners and only clears alpha (0) on
// neutral pixels reachable from the border without crossing artwork -- so
// enclosed landmass interiors (fully surrounded by non-neutral pixels) can't
// be hollowed out even if they happen to be neutral-coloured. Every other
// pixel keeps its original alpha (255, opaque). Binary alpha, no ramp; RGB is
// preserved. Deterministic: same input -> same output.
//
// Usage: node scripts/derive-map-transparent.mjs [--verify-dir <dir>]

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "assets/map/italy-gulf-routes-raw.png";
const OUT = "public/images/map/italy-gulf-routes-v2.png";

const T_LOW = 10; // chroma <= this -> neutral (background), eligible for the flood fill

const verifyDirIdx = process.argv.indexOf("--verify-dir");
const verifyDir = verifyDirIdx !== -1 ? process.argv[verifyDirIdx + 1] : null;

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

const { width, height, channels } = info; // channels === 4 after ensureAlpha
const isNeutral = (idx) => {
  const p = idx * channels;
  const chroma =
    Math.max(data[p], data[p + 1], data[p + 2]) - Math.min(data[p], data[p + 1], data[p + 2]);
  return chroma <= T_LOW;
};
const stack = [];
const push = (x, y) => {
  if (x >= 0 && y >= 0 && x < width && y < height) stack.push(y * width + x);
};
const visited = new Uint8Array(width * height);
push(0, 0);
push(width - 1, 0);
push(0, height - 1);
push(width - 1, height - 1);
while (stack.length) {
  const idx = stack.pop();
  if (visited[idx]) continue;
  visited[idx] = 1;
  if (!isNeutral(idx)) continue;
  data[idx * channels + 3] = 0; // transparent
  const x = idx % width,
    y = (idx / width) | 0;
  push(x + 1, y);
  push(x - 1, y);
  push(x, y + 1);
  push(x, y - 1);
}
// (leave every non-background pixel at its original alpha 255)

await sharp(data, { raw: { width, height, channels } }).png().toFile(OUT);
console.log(`wrote ${OUT} (${width}x${height}, flood-filled from corners)`);

if (verifyDir) {
  await mkdir(verifyDir, { recursive: true });
  const bgs = { white: "#ffffff", dark: "#1a1a1a", magenta: "#ff00ff" };
  for (const [name, colour] of Object.entries(bgs)) {
    await sharp({
      create: { width, height, channels: 4, background: colour },
    })
      .composite([{ input: OUT }])
      .png()
      .toFile(path.join(verifyDir, `map-on-${name}.png`));
  }
  console.log(`wrote verification composites to ${verifyDir}`);
}

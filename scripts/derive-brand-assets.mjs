// Derives the web logo from the client's opaque source PNG
// (public/images/logo/Logo.png): pure-white canvas + #F7F8F7 plate behind
// a brown wordmark. White is keyed out with a min-channel alpha ramp, then
// the result is cropped to the artwork plus a small margin. Re-run when
// the client sends new artwork:  node scripts/derive-brand-assets.mjs
import sharp from "sharp";

const SRC = "public/images/logo/Logo.png";
const OUT = "public/images/logo/imperium-wordmark.png";
// Lightest channel >= WHITE → fully transparent (clears the #F7F8F7 plate);
// <= BLACK → fully opaque; linear ramp between (anti-aliased glyph edges).
const WHITE = 246;
const BLACK = 140;
const MARGIN = 12;

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

let minX = width;
let minY = height;
let maxX = -1;
let maxY = -1;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels;
    const lightest = Math.min(data[i], data[i + 1], data[i + 2]);
    const ramp = (WHITE - lightest) / (WHITE - BLACK);
    const alpha = Math.round(Math.max(0, Math.min(1, ramp)) * 255);
    data[i + 3] = alpha;
    if (alpha > 8) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

if (maxX < 0) throw new Error("No opaque pixels found — check WHITE/BLACK thresholds");

const left = Math.max(0, minX - MARGIN);
const top = Math.max(0, minY - MARGIN);
const cropWidth = Math.min(width, maxX + MARGIN + 1) - left;
const cropHeight = Math.min(height, maxY + MARGIN + 1) - top;

await sharp(data, { raw: { width, height, channels } })
  .extract({ left, top, width: cropWidth, height: cropHeight })
  .png()
  .toFile(OUT);

console.log(`${OUT}: ${cropWidth}x${cropHeight} (from ${width}x${height})`);

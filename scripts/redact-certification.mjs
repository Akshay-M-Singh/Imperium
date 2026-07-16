// redact-certification — removes the "Nata a Seriate il 06/07/2001"
// (birthplace + DOB) line from Sofia's diploma scan, per the founder's
// privacy request (spec: docs/superpowers/specs/
// 2026-07-16-map-cert-swipe-why-imperium-design.md §3).
//
// Technique: the band directly above the line is clean, smooth
// grey-gradient background ("Sofia Mazza" has no descenders). We stretch
// that band vertically over the line's bounding rect — invisible on a
// smooth gradient, and every pixel outside the rect is untouched.
// Deterministic: same input → same output. PNG in, PNG out (lossless).
//
// NOTE (2026-07-16): the unredacted source `made-in-italy-certification.png`
// has been removed from the working tree for privacy, so this script no longer
// runs as-is (SRC below is absent). Its DOB/birthplace redaction is already
// baked into the committed `made-in-italy-diploma.png`. The place-of-issue
// ("Roma") redaction was added separately in `scripts/redact-cert-location.mjs`,
// which operates on the committed diploma directly. Kept here for provenance.
//
// Usage: node scripts/redact-certification.mjs [--verify-dir <dir>]
//   --verify-dir also writes before/after zoom crops for visual review.

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "public/images/certifications/made-in-italy-certification.png";
const OUT = "public/images/certifications/made-in-italy-diploma.png";

// Pre-measured against the 2502×1770 scan (2026-07-16).
const RECT = { left: 900, top: 1278, width: 720, height: 75 };
const DONOR = { left: 900, top: 1243, width: 720, height: 42 };

const verifyDirIdx = process.argv.indexOf("--verify-dir");
const verifyDir = verifyDirIdx !== -1 ? process.argv[verifyDirIdx + 1] : null;

const meta = await sharp(SRC).metadata();
if (meta.width !== 2502 || meta.height !== 1770) {
  throw new Error(
    `Unexpected source dimensions ${meta.width}x${meta.height} — coordinates were measured against 2502x1770. Re-measure before running.`,
  );
}

const patch = await sharp(SRC)
  .extract(DONOR)
  .resize(RECT.width, RECT.height, { fit: "fill" })
  .toBuffer();

await sharp(SRC)
  .composite([{ input: patch, left: RECT.left, top: RECT.top }])
  .png()
  .toFile(OUT);

console.log(`wrote ${OUT}`);

if (verifyDir) {
  await mkdir(verifyDir, { recursive: true });
  // Zoom band around the redacted rect, before and after, plus an
  // untouched control region (the title area) to prove nothing else moved.
  const zoom = { left: 700, top: 1150, width: 1100, height: 300 };
  const control = { left: 300, top: 380, width: 1900, height: 300 };
  await sharp(SRC).extract(zoom).toFile(path.join(verifyDir, "zoom-before.png"));
  await sharp(OUT).extract(zoom).toFile(path.join(verifyDir, "zoom-after.png"));
  await sharp(SRC).extract(control).toFile(path.join(verifyDir, "control-before.png"));
  await sharp(OUT).extract(control).toFile(path.join(verifyDir, "control-after.png"));
  console.log(`wrote verification crops to ${verifyDir}`);
}

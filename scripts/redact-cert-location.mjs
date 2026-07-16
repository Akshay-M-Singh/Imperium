// redact-cert-location — removes the place of issue "Roma" from the diploma's
// bottom-left "Roma, 28 aprile 2026" line, keeping the issue date, per the
// founder's privacy request (2026-07-16). The DOB/birthplace line was already
// removed in commit 1ce359b; the unredacted original is intentionally absent
// from the working tree, so this operates on the committed diploma in place.
//
// Technique: relocate the existing "28 aprile 2026" glyph pixels to the line's
// left margin, then blank the whole original line with a clean donor band
// stretched from directly below it. No font matching. Deterministic.
// Idempotency guard: bails if "Roma" is already gone, so a re-run can't
// destroy the relocated date.
//
// Usage: node scripts/redact-cert-location.mjs [--verify-dir <dir>]

import sharp from "sharp";
import { mkdir, rename } from "node:fs/promises";
import path from "node:path";

const FILE = "public/images/certifications/made-in-italy-diploma.png";
const TMP = FILE + ".tmp.png";

// Measured against the 2502x1770 diploma (2026-07-16).
const LINE = { left: 320, top: 1488, width: 410, height: 58 }; // whole "Roma, 28 aprile 2026"
// DATE.left widened to 448 (from the brief's 470): a pixel scan found the "2"
// of "28" actually starts around x456 — the brief's 470 clipped ~14px off its
// left stroke, which showed up as a sliver/seam in the visual check. 448
// gives an 8px margin before the ink starts. Right edge (730) was confirmed
// clean: ink for the trailing "6" ends by x728.
const DATE = { left: 448, top: 1488, width: 282, height: 58 }; // "28 aprile 2026" only
// DONOR moved to abut LINE's bottom edge exactly (top=1546, i.e. LINE.top +
// LINE.height) with a matching 58px height (from the brief's {top:1552,
// height:40}): a pixel scan confirmed line ink ends by y1528 (well inside
// LINE's own box) and the background stays clean paper past y1600, so this
// band is still ink-free. Matching heights avoids the resize step's vertical
// stretch (58/40 = 1.45x), which was producing a faint but visible tone
// seam against the pristine background in a side-by-side check.
const DONOR = { left: 320, top: 1546, width: 410, height: 58 }; // clean band directly below the line
// Sample box over the tail of "aprile 2026" (x630-710). NOTE: the brief's
// original GUARD ({left:328,top:1495,...}, over the "R" of "Roma") was
// measured against the *pristine* line, but the relocated date is restamped
// starting at LINE.left (=320) too — the same x-range the original guard
// sampled. That box reads as "ink present" both before AND after a
// redaction (it's just reading the relocated date instead of "Roma" on a
// second run), so it never let a re-run bail — confirmed by an actual
// two-run test that destroyed the relocated date. This box instead sits
// inside the donor-only strip that stays blank after redaction (the
// relocated date's new right edge is at 320+282=602, so 630 gives a 28px
// margin), so it truly reads ink pre-redaction and zero ink post-redaction.
const GUARD = { left: 630, top: 1488, width: 80, height: 58 };

const verifyDirIdx = process.argv.indexOf("--verify-dir");
const verifyDir = verifyDirIdx !== -1 ? process.argv[verifyDirIdx + 1] : null;

const meta = await sharp(FILE).metadata();
if (meta.width !== 2502 || meta.height !== 1770) {
  throw new Error(
    `Unexpected dimensions ${meta.width}x${meta.height} — coordinates were measured against 2502x1770. Re-measure before running.`,
  );
}

// Idempotency guard: count dark (ink) pixels where "Roma" sits. If already
// blanked, do nothing — protects the relocated date from a second run.
const g = await sharp(FILE).extract(GUARD).raw().toBuffer({ resolveWithObject: true });
let ink = 0;
for (let i = 0; i < g.data.length; i += g.info.channels) {
  if (g.data[i] < 100 && g.data[i + 1] < 100 && g.data[i + 2] < 100) ink++;
}
if (ink < 20) {
  console.log(`"Roma" already redacted (ink=${ink}) — nothing to do.`);
  process.exit(0);
}

const zoom = { left: 250, top: 1450, width: 820, height: 150 };
if (verifyDir) {
  await mkdir(verifyDir, { recursive: true });
  await sharp(FILE).extract(zoom).toFile(path.join(verifyDir, "cert-before.png"));
}

// 1) grab the date glyphs before blanking; 2) build the erase patch.
const datePatch = await sharp(FILE).extract(DATE).toBuffer();
const donorPatch = await sharp(FILE)
  .extract(DONOR)
  .resize(LINE.width, LINE.height, { fit: "fill" })
  .toBuffer();

// 3) erase the whole line, then restamp the date at the left margin.
await sharp(FILE)
  .composite([
    { input: donorPatch, left: LINE.left, top: LINE.top },
    { input: datePatch, left: LINE.left, top: DATE.top },
  ])
  .png()
  .toFile(TMP);
await rename(TMP, FILE);
console.log(`redacted "Roma" from ${FILE} (guard ink=${ink})`);

if (verifyDir) {
  const control = { left: 300, top: 380, width: 1900, height: 300 }; // title area, must be untouched
  await sharp(FILE).extract(zoom).toFile(path.join(verifyDir, "cert-after.png"));
  await sharp(FILE).extract(control).toFile(path.join(verifyDir, "control-after.png"));
  console.log(`wrote verification crops to ${verifyDir}`);
}

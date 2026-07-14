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
    /* eslint-disable-next-line no-undef -- runs in browser context via page.waitForFunction() */
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
  /* eslint-disable-next-line no-undef -- runs in browser context via page.evaluate() */
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

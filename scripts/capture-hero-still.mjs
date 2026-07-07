// Captures the Silk Hero's resting frame as the production hero still —
// the "export the poster" step the silk design spec planned (§4). The live
// canvas is being retired from the hero mount; this still replaces it.
// Prereq: dev server running on :3000 (npm run dev).
// Usage:  npm run capture:hero
import { chromium } from "playwright";
import sharp from "sharp";

const OUT = "public/images/hero/hero-still.jpg";

const browser = await chromium.launch({
  args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 2, // 3840×2160 backing buffer
});
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
// Next.js dev mode injects a floating indicator badge into a
// <nextjs-portal> appended to <body> after hydration — later than the
// DOM-hiding pass below runs, so it needs its own suppression.
await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
await page.waitForSelector('[data-testid="silk-hero"] canvas', { timeout: 20000 });
// Let the 600ms crossfade + 2400ms entry wave fully settle before freezing.
await page.waitForTimeout(6000);

// The canvas's on-screen bounding box is the full hero viewport, and
// Playwright's element screenshot is a page screenshot cropped to that
// box — so anything visually stacked on top (fixed nav, Hero's own
// eyebrow/wordmark/tagline/CTAs/overlay/dissolve) would bake into the
// still as pixels. This capture is meant to be a background-only asset
// (Task 3 re-renders that same nav/content as live DOM on top of it), so
// hide every sibling of the silk-hero wrapper before freezing the frame.
/* eslint-disable no-undef -- runs in browser context via page.evaluate() */
await page.evaluate(() => {
  const canvas = document.querySelector('[data-testid="silk-hero"] canvas');
  const wrap = canvas?.closest('[data-testid="silk-hero"]');
  const section = wrap?.parentElement;
  if (section) {
    Array.from(section.children).forEach((el) => {
      if (el !== wrap) el.style.visibility = "hidden";
    });
  }
  Array.from(document.body.children).forEach((el) => {
    if (!section || !el.contains(section)) el.style.visibility = "hidden";
  });
});
/* eslint-enable no-undef */

// Screenshot the viewport-sized `.wrap` element (`overflow: hidden`), not
// the raw <canvas> — the canvas's own backing buffer is intentionally
// oversized by the ±10% parallax overscan (SilkHero.module.css
// `.parallaxLayer { inset: -10% 0 }`), so capturing it directly yields a
// taller-than-viewport image (3840×2592 instead of 3840×2160).
const png = await page.locator('[data-testid="silk-hero"]').screenshot({ type: "png" });
await browser.close();

await sharp(png).jpeg({ quality: 88, mozjpeg: true }).toFile(OUT);
const meta = await sharp(OUT).metadata();
console.log(`Wrote ${OUT} — ${meta.width}×${meta.height}`);

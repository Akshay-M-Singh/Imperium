# Hero, Collections, WhyImperium & Founder Refinement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the blurry live-WebGL hero with a sharp static-image hero that plays a restrained cinematic entrance, rebuild Collections as a scroll-driven pinned horizontal showcase (native scroll-snap on small screens), fix WhyImperium item 03's grid misalignment, and enlarge the Made in Italy stamp and Founder certification scan.

**Architecture:** The Silk Hero WebGL canvas is retired from the hero mount (module kept in-tree, recoverable) and replaced by a 3840×2160 still captured from the silk shader's own resting frame — the repo's spec already planned this "poster export" path — rendered via a correctly configured `next/image` and a CSS-only entrance cascade. Collections becomes a single-DOM component: one horizontal track that is a native CSS scroll-snap row on small screens/reduced-motion, and a `position: sticky`-pinned, Framer-Motion `useScroll`-driven track on desktop. Embla and its pagination dots are removed (Collections was their only consumer). WhyImperium/Founder fixes are pure CSS module changes.

**Tech Stack:** Next.js 15.5 (App Router), React 19, TypeScript strict, CSS Modules + tokens, Framer Motion 11 (`useScroll`/`useTransform` — already installed, no new dependency), Playwright + sharp (already in node_modules) for the one-time asset capture, Vitest.

## Root-Cause Findings (verified against the running site, 2026-07-07)

These were measured live at 1440×900 before writing this plan — do not re-litigate them, but do re-verify after each fix:

1. **Hero "poor image quality":** there is **no raster hero asset in the repo** (`public/images/hero/` holds two 1.6 KB flat-gradient SVG placeholders). The hero background is the live Silk WebGL shader. Its canvas backing buffer is full-resolution (2880×2160 at DPR 2 — _not_ a resolution bug), but the shader's look is ultra-low-frequency soft gradients (foldDepth 0.07, weave detail nearly invisible), which reads as a heavily upscaled blurry photo. The constant idle drift + cursor reactivity also violates the new requirement "fully static after entrance."
2. **Hero animation:** the current entrance is a rushed 0/80/200/320 ms cascade with no background settle and no overlay fade-in.
3. **Collections:** section height 1558 px in a 900 px viewport; slide width `45vw` (648 px at 1440) with a 4:5 image displayed at 674×842 CSS px (≈1348 device px at DPR 2) from **627×627 source PNGs** — a >2× device-pixel upscale plus a square→4:5 crop. Card text falls below the fold; next card is clipped mid-image; Ken Burns applies a permanent `scale(1.04)` to the already-upscaled image; `-webkit-line-clamp: 4` on the body can clip descriptions.
4. **WhyImperium 03:** row 01 text starts at x=240 (grid cols 1–5), row 02 text at x=814 (cols 8–12), row 03 text at x=650 — because `.textOnly .text { grid-column: 6 / -1 }` is a third, unrelated placement. Root cause is that CSS rule, not a spacing offset.
5. **Stamp:** displayed 200×187 (`min(200px, 48vw)`). **Certification:** displayed 220×156 (`max-inline-size: 220px`) — a thumbnail.
6. **Pre-existing hydration error** (console, every load): `MagneticButton` renders a `<div>` inside `<p className={styles.whatsapp}>` in `src/components/sections/Contact.tsx:133`. The final checklist requires zero console errors, so this is in scope.
7. `THREE.Clock` deprecation warnings come from the mounted silk canvas; they disappear once the canvas is unmounted.

## ⚠️ Decisions & Conflicts (read before executing)

**D-1 — Hero asset.** No hero-grade photograph exists in the repo or on the client's asset drops. The sharpest producible production asset is a high-resolution still of the silk shader's resting frame (the silk spec's own planned "export the poster" step), with two detail dials raised so the still reads as fabric rather than blur. A real hero photograph from Sofia remains the correct long-term asset — log it in `progress.md` as still-requested. The Hero component is built so a future swap is one `src` change.

**D-2 — Silk module.** `src/components/silk/` stays in the tree (its tests keep passing standalone) but is no longer mounted. `three`/`@react-three/fiber`/`@react-three/drei` stay in `package.json`; they drop out of the page bundle automatically because nothing imports them. Removing them entirely is a separate user decision — do not do it in this plan.

**D-3 — "Fully static after entrance"** is interpreted as: no looping/idle background motion, no parallax, no cursor reactivity. The scroll-indicator line pulse is capped at 3 iterations then stops. The hover-only TiltCard on collection cards is transient interaction feedback, not ambient animation — it stays.

**D-4 — Embla removal.** Collections is Embla's only consumer (verified via grep). The rebuild replaces it on all viewports (scroll-snap on small screens), so `EmblaContainer`, `CarouselSlide`, `EMBLA_OPTIONS`, and the `embla-carousel-react` dependency are removed per the brief's cleanup requirements.

## Global Constraints

- **Do not change approved copy.** These exact strings must render after the rebuild: "For those who don't compromise." · "Rare, limited, one of a kind." · "Breathability, durability, and quality." · "Timeless design, durability, and versatility." · "Contract-grade fabric for hotels, resorts and restaurants that refuse to look like it. Specified with you, sampled fast." · "Fabric with a story." · "Four curated collections — each one a different way of working with Italian craft." · "Made in Italy" (hero eyebrow) · `SITE.tagline` · "For the Gulf's Luxury Market" · "Made in Italy Certification" · **"Contact Us Now"** on all four collection CTAs.
- All four collections must remain present: 01 Tessuti Italiani, 02 Pezzi Unici, 03 Ospitalità di Lusso, 04 Interior & Exterior Design. All CTAs route to `#contact` with label `"Contact Us Now"` (client decision 2026-07-06).
- No new runtime dependencies. Framer Motion is the only animation system used; do not add GSAP/Lenis.
- Preserve: palette tokens, Cormorant Garamond/DM Sans, `#collections` anchor id (three nav links point at it), `Section` backgrounds (Collections=Pietra, WhyImperium=Gesso), WhatsApp button/bar, navigation, footer.
- The Made in Italy **stamp** (WhyImperium row 02) and the founder **certification scan** (Founder section) are different assets and must never swap locations.
- Respect `prefers-reduced-motion` in every new animation (CSS `@media` + `useReducedMotion` hook for JS-driven motion).
- Commits: conventional-commit style (commitlint is active), one commit per task, ending with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Node >= 20.11; run everything with the repo's npm scripts (`npm run dev/lint/typecheck/test/build`).

---

### Task 1: Branch + fix the pre-existing hydration error in Contact

**Files:**

- Modify: `src/components/sections/Contact.tsx:133-135`

**Interfaces:**

- Produces: a console free of React hydration errors, so later tasks' "no console errors" verification isn't polluted by this pre-existing bug.

- [ ] **Step 1: Create the working branch**

```bash
git checkout -b feat/hero-collections-refinement
```

- [ ] **Step 2: Reproduce the error**

Run: `npm run dev`, open `http://localhost:3000`, check the browser console.
Expected: `In HTML, <div> cannot be a descendant of <p>` pointing at `Contact_whatsapp`/`MagneticButton`.

- [ ] **Step 3: Fix the wrapper element**

In `src/components/sections/Contact.tsx`, change the WhatsApp wrapper from a `<p>` to a `<div>` (MagneticButton legitimately renders a `<div>`):

```tsx
// before
<p className={styles.whatsapp}>
  <WhatsAppButton />
</p>
// after
<div className={styles.whatsapp}>
  <WhatsAppButton />
</div>
```

`.whatsapp` in `Contact.module.css` has no `p`-specific selectors — no CSS change needed. Leave the sibling `<p>` wrappers (they contain only inline content).

- [ ] **Step 4: Verify**

Reload the page with a hard refresh. Expected: zero hydration errors in the console. Run `npm run test` — the Contact-related tests (email/form) must still pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Contact.tsx
git commit -m "fix: render WhatsApp CTA wrapper as div to stop p>div hydration error"
```

---

### Task 2: Generate the production hero still from the silk shader

**Files:**

- Modify: `src/components/silk/silk.config.ts:31` (foldDepth) and `:103` (weave amplitude)
- Create: `scripts/capture-hero-still.mjs`
- Create (generated, committed): `public/images/hero/hero-still.jpg` (3840×2160)
- Modify: `package.json` (add `capture:hero` script)

**Interfaces:**

- Produces: `public/images/hero/hero-still.jpg`, intrinsic 3840×2160, JPEG quality 88 — consumed by Task 3's `<Image src="/images/hero/hero-still.jpg" …>`.

- [ ] **Step 1: Raise the shader's detail dials (the config file's comments explicitly invite this calibration)**

In `src/components/silk/silk.config.ts`:

```ts
// drape block — was 0.07; deeper folds give the still real light/shadow structure
foldDepth: 0.1,
```

```ts
// weave block — was 0.04; makes the woven micro-detail actually visible in the sheen band
amplitude: 0.07,
```

Change nothing else in the config. These two dials control perceived crispness; the repo's spec marks both as "first-pass, needs calibration."

- [ ] **Step 2: Write the capture script**

Create `scripts/capture-hero-still.mjs`:

```js
// Captures the Silk Hero's resting frame as the production hero still —
// the "export the poster" step the silk design spec planned (§4). The live
// canvas is being retired from the hero mount; this still replaces it.
// Prereq: dev server running on :3000 (npm run dev).
// Usage:  npm run capture:hero
import { chromium } from "playwright";
import sharp from "sharp";

const OUT = "public/images/hero/hero-still.jpg";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 2, // 3840×2160 backing buffer
});
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForSelector('[data-testid="silk-hero"] canvas', { timeout: 20000 });
// Let the 600ms crossfade + 2400ms entry wave fully settle before freezing.
await page.waitForTimeout(6000);
const png = await page.locator('[data-testid="silk-hero"] canvas').screenshot({ type: "png" });
await browser.close();

await sharp(png).jpeg({ quality: 88, mozjpeg: true }).toFile(OUT);
const meta = await sharp(OUT).metadata();
console.log(`Wrote ${OUT} — ${meta.width}×${meta.height}`);
```

Add to `package.json` `"scripts"`:

```json
"capture:hero": "node scripts/capture-hero-still.mjs"
```

- [ ] **Step 3: Capture (dev server must be running in another terminal)**

Run: `npm run dev` (terminal 1), then `npm run capture:hero` (terminal 2).
Expected output: `Wrote public/images/hero/hero-still.jpg — 3840×2160`.
If the headless GPU (SwiftShader) renders a blank/black canvas, retry with `chromium.launch({ headless: false })` — WebGL2 is required for the live scene.

- [ ] **Step 4: Visually judge the still and iterate the dials**

Open `public/images/hero/hero-still.jpg` at 100% zoom. Acceptance: visible fold structure with defined light/shadow transitions, weave micro-detail discernible in the sheen band, no banding on the pale gradients, palette still champagne/gold (Pietra-adjacent, gold-leaning highlights — not yellow). If it still reads as featureless blur, raise `foldDepth` to at most `0.12` and re-capture; keep restraint — this is calibration, not a redesign. File size should land roughly 300–900 KB; if above ~1 MB drop quality to 84.

- [ ] **Step 5: Restore nothing — commit the dials with the asset**

The dial changes are the calibrated look that produced the committed still; they stay.

```bash
git add src/components/silk/silk.config.ts scripts/capture-hero-still.mjs public/images/hero/hero-still.jpg package.json
git commit -m "feat: capture 4K hero still from the silk shader resting frame"
```

---

### Task 3: Rebuild the Hero — static image + restrained cinematic entrance

**Files:**

- Modify: `src/components/sections/Hero.tsx` (full replacement below)
- Modify: `src/components/sections/Hero.module.css` (backdrop + animation sections below)
- Modify: `next.config.ts:7-10` (images block)
- Modify: `tests/unit/components/sections/Hero.test.tsx:60-80` (silk assertions → backdrop assertions)

**Interfaces:**

- Consumes: `public/images/hero/hero-still.jpg` from Task 2.
- Produces: `Hero` no longer imports `SilkHero`; `src/components/silk/*` becomes unmounted (do NOT delete it — see D-3). The entrance sequence order later verified in Task 8: backdrop settle → overlay fade → eyebrow → logo → tagline → CTAs.

- [ ] **Step 1: Update the Hero test first**

In `tests/unit/components/sections/Hero.test.tsx`, replace the two tests that assert `screen.getByTestId("silk-hero")` (lines ~60–80) with:

```tsx
it("renders the static hero backdrop image", () => {
  const { container } = render(<Hero />);
  const backdrop = container.querySelector('img[src*="hero-still"]');
  expect(backdrop).toBeInTheDocument();
  // Decorative: must be hidden from the accessibility tree.
  expect(backdrop).toHaveAttribute("alt", "");
});

it("does not mount the silk WebGL experience", () => {
  render(<Hero />);
  expect(screen.queryByTestId("silk-hero")).toBeNull();
});
```

Run: `npx vitest run tests/unit/components/sections/Hero.test.tsx`
Expected: FAIL (Hero still mounts SilkHero).

- [ ] **Step 2: Replace Hero.tsx**

```tsx
// Hero — full-viewport brand opening (DESIGN.md §9.02, amended by client
// direction: the wordmark logo leads inside the h1, with the brand
// tagline directly beneath). Background amended 2026-07-07: the live Silk
// WebGL canvas is retired from this mount (module kept in src/components/
// silk/, recoverable) in favour of a 4K still of the shader's resting
// frame — the hero is fully static once the entrance cascade completes.

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SITE } from "@/lib/site";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.section} aria-labelledby="hero-heading">
      <div className={styles.backdrop} aria-hidden="true">
        <Image
          src="/images/hero/hero-still.jpg"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className={styles.backdropImage}
        />
      </div>

      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.dissolve} aria-hidden="true" />

      <div className={styles.content}>
        <span className={styles.eyebrow}>Made in Italy</span>

        <h1 id="hero-heading" className={styles.logo}>
          {SITE.logoSrc ? (
            <Image
              src={SITE.logoSrc}
              alt={SITE.name}
              width={756}
              height={143}
              priority
              className={styles.logoImage}
            />
          ) : (
            <span className={styles.wordmark}>
              <span className={styles.wordmarkPrimary}>Imperium</span>
              <span className={styles.wordmarkSecondary}>Italian Textile</span>
            </span>
          )}
        </h1>

        <p className={styles.tagline}>{SITE.tagline}</p>

        <div className={styles.ctaGroup}>
          <MagneticButton>
            <Button variant="ghost-light" href="#collections">
              Explore our fabrics
            </Button>
          </MagneticButton>
          <a href="#contact" className={styles.textLink}>
            Request a sample →
          </a>
        </div>
      </div>

      <div className={styles.scrollIndicator} aria-hidden="true">
        <span className={styles.scrollLine} />
      </div>
    </section>
  );
}

export default Hero;
```

Notes: the `"use client"` directive is removed (no hooks remain — MagneticButton carries its own). Copy and hierarchy are byte-identical to the current version.

- [ ] **Step 3: Rewrite the animated parts of Hero.module.css**

Replace the `.overlay` rule, add `.backdrop`/`.backdropImage`, update the four content delays, cap the scroll pulse, and add the reduced-motion block. Full deltas:

```css
/* NEW — static backdrop with a one-shot settle. The animation ends at
   scale(1) exactly, so the browser re-rasterizes the layer unscaled and
   the image renders pixel-sharp once the entrance completes. */
.backdrop {
  position: absolute;
  inset: 0;
  z-index: var(--z-base);
  overflow: hidden;
}

.backdropImage {
  object-fit: cover;
  object-position: center;
  animation: hero-settle 2600ms var(--motion-ease-out) both;
}

@keyframes hero-settle {
  from {
    transform: scale(1.06);
  }
  to {
    transform: scale(1);
  }
}

/* CHANGED — overlay now fades to its final opacity instead of appearing. */
.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--color-hero-gradient), transparent 60%);
  opacity: 0.4;
  z-index: calc(var(--z-base) + 1);
  animation: hero-overlay 1400ms var(--motion-ease-standard) both;
  animation-delay: 200ms;
}

@keyframes hero-overlay {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.4;
  }
}
```

Update the content cascade (same `hero-enter` keyframes, slower/staged — replace only the `animation`/`animation-delay` lines on the existing rules):

```css
.eyebrow {
  animation: hero-enter 800ms var(--motion-ease-out) both;
  animation-delay: 700ms;
}
.logo {
  animation: hero-enter 1000ms var(--motion-ease-out) both;
  animation-delay: 950ms;
}
.tagline {
  animation: hero-enter 800ms var(--motion-ease-out) both;
  animation-delay: 1250ms;
}
.ctaGroup {
  animation: hero-enter 800ms var(--motion-ease-out) both;
  animation-delay: 1500ms;
}
```

(Keep each rule's other declarations — `opacity: 0` base on `.logo`/`.tagline`/`.ctaGroup` — untouched.)

Cap the scroll-indicator pulse so the hero is fully static afterwards (replace the `.scrollLine` animation line):

```css
.scrollLine {
  /* ... existing size/color lines unchanged ... */
  animation: hero-pulse 2s ease-in-out 2600ms 3;
}
```

Add at the end of the file:

```css
@media (prefers-reduced-motion: reduce) {
  .backdropImage,
  .overlay,
  .eyebrow,
  .logo,
  .tagline,
  .ctaGroup,
  .scrollLine {
    animation: none;
  }

  .logo,
  .tagline,
  .ctaGroup {
    opacity: 1;
  }
}
```

- [ ] **Step 4: Allow quality 90 in the image optimizer**

In `next.config.ts`, extend the images block:

```ts
images: {
  formats: ["image/avif", "image/webp"],
  qualities: [75, 90],
  remotePatterns: [],
},
```

If TypeScript rejects `qualities` on this Next version, remove the line — on Next 15.x the `quality={90}` prop still works without it; confirm `npm run build` prints no image-quality warning either way.

- [ ] **Step 5: Run the tests**

Run: `npx vitest run tests/unit/components/sections/Hero.test.tsx tests/unit/components/silk/SilkHero.test.tsx`
Expected: PASS (SilkHero's own tests still pass — the module exists, it's just unmounted).

- [ ] **Step 6: Verify in the browser**

`npm run dev`, hard-reload at 1440×900. Expected: image settles from a barely perceptible zoom; overlay fades in; eyebrow → wordmark → tagline → CTAs appear in that order; after ~2.6 s + three pulses nothing on the hero moves at all; no cursor reactivity; text is crisp during the whole sequence (only the backdrop scales). Toggle reduced motion (DevTools → Rendering → prefers-reduced-motion) and reload: everything appears instantly in final state, no motion. Check the Network tab: the hero requests `/_next/image?url=%2Fimages%2Fhero%2Fhero-still.jpg&w=3840&q=90` (or the viewport-appropriate width bucket ≥ the device-pixel viewport width).

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/Hero.tsx src/components/sections/Hero.module.css next.config.ts tests/unit/components/sections/Hero.test.tsx
git commit -m "feat: static hero still with restrained cinematic entrance cascade"
```

---

### Task 4: Rebuild Collections as a scroll-driven horizontal showcase

**Files:**

- Modify: `src/components/sections/Collections.tsx` (full replacement below)
- Modify: `src/components/sections/Collections.module.css` (full replacement below)
- Modify: `src/components/ui/FabricCard.tsx` (add `layout` prop)
- Modify: `src/components/ui/FabricCard.module.css` (spread layout + remove line-clamp)
- Modify: `tests/unit/components/sections/Collections.test.tsx`
- Delete: `src/components/motion/Carousel/` (all four files) — in Task 5, after this task proves nothing needs them

**Interfaces:**

- Consumes: `collections` from `@/data/collections` (unchanged), `FabricCard`, `SectionHeader`, `ScrollReveal`, `useMediaQuery`, `useReducedMotion`.
- Produces: `FabricCard` gains an optional prop `layout?: "stack" | "spread"` (default `"stack"`); `Collections` stops importing `EmblaContainer`/`CarouselSlide`. The `#collections` anchor id stays on the outer `<section>`.

**Behavior contract:**

- ≥1024px + motion allowed: outer section height = `100dvh + travel` (travel = track scrollWidth − viewport clientWidth, measured); inner viewport `position: sticky; top: 0; height: 100dvh; overflow: hidden`; track translates `0 → −travel` linearly with section scroll progress; releases naturally into WhyImperium. No wheel/touch event interception anywhere — native vertical scroll is never hijacked.
- <1024px or `prefers-reduced-motion`: the same track is a native `overflow-x: auto` scroll-snap row (swipe), no pinning, no transform, hidden scrollbar, `tabIndex=0` for keyboard scrolling.
- Cards on ≥1024px use the "spread" layout (image left, text right) so the full composition — image, tagline, title, body, CTA — fits comfortably in the pinned viewport; image height is `clamp(340px, 52vh, 560px)` (≈468px tall at 900-height viewports vs the previous 842px — the required moderate reduction with nothing clipped).
- A thin progress bar (Sabbia track, Oro Antico fill scaling with progress) shows on desktop only.

- [ ] **Step 1: Update the Collections test first**

Replace `tests/unit/components/sections/Collections.test.tsx` content with:

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Collections } from "@/components/sections/Collections";

describe("Collections", () => {
  const original = window.matchMedia;

  beforeEach(() => {
    // Reduced motion on + narrow viewport → the static scroll-snap branch
    // renders in jsdom (no ResizeObserver, no sticky pinning needed).
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    }));
  });

  afterEach(() => {
    window.matchMedia = original;
  });

  it("renders the section header", () => {
    render(<Collections />);
    expect(screen.getByText("Our collections")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Fabric with a story." })).toBeInTheDocument();
  });

  it("renders all four collection panels", () => {
    render(<Collections />);
    for (const name of [
      "Tessuti Italiani",
      "Pezzi Unici",
      "Ospitalità di Lusso",
      "Interior & Exterior Design",
    ]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
  });

  it("keeps the approved taglines and hospitality copy", () => {
    render(<Collections />);
    expect(screen.getByText("For those who don't compromise.")).toBeInTheDocument();
    expect(screen.getByText("Breathability, durability, and quality.")).toBeInTheDocument();
    expect(screen.getByText(/hotels, resorts and restaurants/)).toBeInTheDocument();
  });

  it("routes every collection card to the contact section", () => {
    const links = render(<Collections />).getAllByRole("link", { name: /Contact Us Now/ });
    expect(links).toHaveLength(4);
    for (const link of links) {
      expect(link).toHaveAttribute("href", "#contact");
    }
  });

  it("unmounts cleanly", () => {
    const { unmount } = render(<Collections />);
    expect(() => unmount()).not.toThrow();
  });
});
```

Run: `npx vitest run tests/unit/components/sections/Collections.test.tsx`
Expected: PASS against the old component too (same copy) — these tests pin the copy through the rebuild. If any fail before the rebuild, stop and investigate.

- [ ] **Step 2: Add the spread layout to FabricCard**

`src/components/ui/FabricCard.tsx` — add the prop and class:

```tsx
export interface FabricCardProps {
  collection: CollectionCard;
  /** "stack" = image above text (default). "spread" = editorial panel,
   *  image beside text — used by the desktop pinned showcase. */
  layout?: "stack" | "spread";
}

export function FabricCard({ collection, layout = "stack" }: FabricCardProps) {
  const { tagline, tagAccent, title, body, cta, image } = collection;

  return (
    <TiltCard className={cn(styles.card, layout === "spread" && styles.spread)}>
      {/* article/imageWrap/content markup unchanged, except the Image gains sizes: */}
```

On the `<Image>` add a `sizes` attribute (the 627px sources are never upscaled by the optimizer, this just picks sane srcset candidates):

```tsx
<Image
  src={image.src}
  alt={image.alt}
  width={400}
  height={500}
  loading="lazy"
  sizes="(min-width: 1024px) 460px, 76vw"
  className={styles.image}
/>
```

Everything else in the component stays byte-identical.

- [ ] **Step 3: FabricCard.module.css — remove the clamp, add spread**

Delete these three lines from `.body` (descriptions must never clip):

```css
display: -webkit-box;
-webkit-line-clamp: 4;
-webkit-box-orient: vertical;
overflow: hidden;
```

Append at the end of the file:

```css
/* Spread layout — editorial panel for the desktop pinned showcase:
   image beside text so the full composition fits the pinned viewport.
   --panel-image-h is set by Collections.module.css on the track. */
@media (min-width: 1024px) {
  .spread {
    flex-direction: row;
    align-items: center;
    gap: var(--space-lg);
  }

  .spread .imageWrap {
    flex: 0 0 auto;
    block-size: var(--panel-image-h, 480px);
    inline-size: calc(var(--panel-image-h, 480px) * 4 / 5);
  }

  .spread .content {
    inline-size: min(320px, 36ch);
    padding-block-start: 0;
  }
}
```

(`.article` is `display: contents`, so `.imageWrap`/`.content` are direct flex items of `.card` — the row direction works without touching the markup.)

- [ ] **Step 4: Replace Collections.tsx**

```tsx
"use client";

// Collections — scroll-driven horizontal showcase (rebuilt 2026-07-07,
// replacing the Embla carousel). Desktop pins the viewport with position:
// sticky and maps vertical scroll progress onto horizontal track travel —
// no autoplay, no wheel hijacking, no scroll trap: native scrolling keeps
// working and the section releases the moment the last panel is reached.
// Small screens and prefers-reduced-motion get the same track as a native
// CSS scroll-snap swipe row.

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FabricCard } from "@/components/ui/FabricCard";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { collections } from "@/data/collections";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./Collections.module.css";

export function Collections() {
  const outerRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reducedMotion = useReducedMotion();
  const pinned = isDesktop && !reducedMotion;
  const [travel, setTravel] = useState(0);

  // The pin distance is the track's real overflow, re-measured on resize,
  // so the release point always matches the actual layout.
  useEffect(() => {
    if (!pinned || typeof ResizeObserver === "undefined") {
      setTravel(0);
      return;
    }
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;
    const measure = () => setTravel(Math.max(0, track.scrollWidth - viewport.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [pinned]);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  return (
    <section
      id="collections"
      ref={outerRef}
      aria-labelledby="collections-heading"
      className={styles.outer}
      style={pinned ? { blockSize: `calc(100dvh + ${travel}px)` } : undefined}
    >
      <div ref={viewportRef} className={styles.viewport}>
        <ScrollReveal amount={0.4}>
          <div className={styles.header}>
            <SectionHeader
              eyebrow="Our collections"
              headline="Fabric with a story."
              subline="Four curated collections — each one a different way of working with Italian craft."
              id="collections-heading"
            />
          </div>
        </ScrollReveal>

        <motion.div
          ref={trackRef}
          className={styles.track}
          style={pinned ? { x } : undefined}
          tabIndex={pinned ? undefined : 0}
          role="group"
          aria-label="Collection panels"
        >
          {collections.map((collection) => (
            <div key={collection.id} className={styles.panel}>
              <FabricCard collection={collection} layout="spread" />
            </div>
          ))}
        </motion.div>

        <div className={styles.progressTrack} aria-hidden="true">
          <motion.div className={styles.progressFill} style={{ scaleX: scrollYProgress }} />
        </div>
      </div>
    </section>
  );
}

export default Collections;
```

Implementation notes (do not skip):

- `ScrollReveal` wraps only the header — never the sticky viewport or the outer section. Framer's entrance transform on an ancestor would break `position: sticky`.
- `layout="spread"` is passed unconditionally; the spread CSS only activates at ≥1024px, so small screens render the stacked card automatically.
- SSR/first client render both have `pinned === false` (both hooks initialize to `false`/media-query state post-mount), so there is no hydration mismatch; pinning engages in a later render.

- [ ] **Step 5: Replace Collections.module.css**

```css
/* Collections — scroll-driven horizontal showcase.
   Small screens / reduced motion: native scroll-snap swipe row.
   ≥1024px with motion allowed: the outer section is taller than the
   viewport, the inner viewport pins via position: sticky, and vertical
   scroll progress translates the track (transform only — no horizontal
   scrollbar, no hijacked events). */

.outer {
  position: relative;
  background-color: var(--color-pietra);
}

.viewport {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-lg);
  padding-block: var(--subsection-padding-y);
}

.header {
  inline-size: 100%;
  max-inline-size: var(--max-content-width);
  margin-inline: auto;
  padding-inline: var(--grid-margin-mobile);
}

.track {
  display: flex;
  gap: var(--space-md);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  padding-inline: var(--grid-margin-mobile);
  /* room for the TiltCard hover shadow/focus ring */
  padding-block: var(--space-xs);
}

.track::-webkit-scrollbar {
  display: none;
}

.track:focus-visible {
  outline: var(--focus-outline-width) solid var(--color-blu-notte);
  outline-offset: var(--focus-outline-offset);
}

.panel {
  flex: 0 0 auto;
  inline-size: min(76vw, 340px);
  scroll-snap-align: center;
}

.progressTrack {
  display: none;
}

@media (min-width: 768px) {
  .header {
    padding-inline: var(--grid-margin-tablet);
  }

  .track {
    padding-inline: var(--grid-margin-tablet);
    gap: var(--space-lg);
  }

  .panel {
    inline-size: min(44vw, 400px);
  }
}

@media (min-width: 1024px) {
  .header {
    padding-inline: var(--grid-margin-desktop);
  }

  .track {
    /* Drives the spread card's image size (FabricCard.module.css). */
    --panel-image-h: clamp(340px, 52vh, 560px);
    /* Align the first/last panel with the section's content edge. */
    --track-inset: max(var(--grid-margin-desktop), calc((100vw - var(--max-content-width)) / 2));
    padding-inline: var(--track-inset);
    gap: var(--space-xl);
  }

  .panel {
    inline-size: auto;
    scroll-snap-align: start;
  }
}

/* Pinned mode — wide screens that also allow motion. Reduced-motion
   desktop visitors keep the scroll-snap row above (no pin, no transform). */
@media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
  .viewport {
    position: sticky;
    inset-block-start: 0;
    block-size: 100dvh;
    overflow: hidden;
    justify-content: center;
    gap: var(--space-xl);
    padding-block: 0;
    padding-block-start: var(--nav-height);
  }

  .track {
    overflow: visible;
    scroll-snap-type: none;
  }

  .progressTrack {
    display: block;
    position: absolute;
    inset-block-end: clamp(24px, 4vh, 48px);
    inset-inline-start: 50%;
    translate: -50% 0;
    inline-size: min(320px, 30vw);
    block-size: 2px;
    background-color: color-mix(in srgb, var(--color-sabbia) 35%, transparent);
  }

  .progressFill {
    inline-size: 100%;
    block-size: 100%;
    transform-origin: left center;
    background-color: var(--color-oro-antico);
  }
}

@media (min-width: 1440px) {
  .header {
    padding-inline: var(--grid-margin-desktop-xl);
  }

  .track {
    --track-inset: max(var(--grid-margin-desktop-xl), calc((100vw - var(--max-content-width)) / 2));
  }
}
```

- [ ] **Step 6: Run the tests**

Run: `npx vitest run tests/unit/components/sections/Collections.test.tsx tests/unit/components/ui/FabricCard.test.tsx`
Expected: PASS. (FabricCard's default layout is unchanged; the copy tests pass against the same data.)

- [ ] **Step 7: Verify in the browser — this is the task's real acceptance gate**

`npm run dev`, at 1440×900:

1. Scroll toward Collections: the section pins when its top reaches the viewport top; continued scrolling moves the track left through panels 01→04; the header stays put; the progress bar fills left→right.
2. After Interior & Exterior Design is fully visible, the next scroll tick releases into WhyImperium — no dead zone, no snap-back.
3. Scroll back up: the sequence reverses smoothly.
4. Every panel: image + tagline + title + full body + CTA all visible simultaneously, nothing clipped, no text outside its container. Expected image size ≈ 375×468 (52vh of 900) — verify with DevTools.
5. `document.documentElement.scrollWidth === window.innerWidth` in the console (no horizontal page overflow).
6. A slice of the next panel is visible at the right edge mid-sequence.
7. Reduced motion on (DevTools) + reload: no pinning; the track is a swipeable/scrollable row; all four panels reachable.
8. At 390×844 (mobile emulation): stacked cards ~76vw wide, native swipe with snap, no scroll trap, WhatsApp bar doesn't cover CTAs.
9. Nothing overlaps the fixed navigation (the pinned viewport pads top by `--nav-height`).
10. Anchor check: click "Fabrics" in the nav → lands at the section top showing panel 01.

Tuning latitude: if panels feel cramped or oversized at 1512×982/1920×1080, adjust only `--panel-image-h`'s clamp bounds (±10%) and `.spread .content`'s `inline-size` — nothing else.

- [ ] **Step 8: Commit**

```bash
git add src/components/sections/Collections.tsx src/components/sections/Collections.module.css src/components/ui/FabricCard.tsx src/components/ui/FabricCard.module.css tests/unit/components/sections/Collections.test.tsx
git commit -m "feat: scroll-driven pinned horizontal collections showcase"
```

---

### Task 5: Remove the dead Embla carousel layer

**Files:**

- Delete: `src/components/motion/Carousel/EmblaContainer.tsx`, `EmblaContainer.module.css`, `CarouselSlide.tsx`, `CarouselSlide.module.css` (the whole `Carousel/` directory)
- Modify: `src/components/motion/index.ts` (remove Carousel exports)
- Modify: `src/lib/constants.ts` (remove `EMBLA_OPTIONS`)
- Modify: `package.json` / `package-lock.json` (remove `embla-carousel-react`)

**Interfaces:**

- Consumes: Task 4 must be complete (Collections no longer imports these).
- Produces: no module anywhere imports `embla` (verify with grep before deleting).

- [ ] **Step 1: Prove the code is dead**

Run: `grep -rn "EmblaContainer\|CarouselSlide\|EMBLA_OPTIONS\|embla" src tests --include="*.ts*" | grep -v "motion/Carousel\|motion/index\|lib/constants"`
Expected: no output. If anything else still imports them, fix that first — do not delete.

- [ ] **Step 2: Delete and unwire**

```bash
rm -r src/components/motion/Carousel
npm uninstall embla-carousel-react
```

In `src/components/motion/index.ts`, delete the `EmblaContainer`/`CarouselSlide` export lines. In `src/lib/constants.ts`, delete the `EMBLA_OPTIONS` block and its comment (keep `BREAKPOINTS`, `ROUTES`, `MOTION_DURATIONS`).

- [ ] **Step 3: Verify nothing broke**

Run: `npm run typecheck && npm run lint && npm run test`
Expected: all clean/passing. The Ken Burns keyframes and pagination-dot logic lived in the deleted files — grep to confirm no orphans: `grep -rn "kenBurns\|pagination\|dot" src/components --include="*.css"` → expected: no carousel-related hits.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove Embla carousel layer superseded by the pinned showcase"
```

---

### Task 6: WhyImperium — align item 03 and enlarge the stamp

**Files:**

- Modify: `src/components/sections/WhyImperium.module.css:66-68` (textOnly placement) and `:92-95` (stamp size)

**Interfaces:**

- Consumes: nothing new. `WhyImperium.tsx` and `src/data/pillars.ts` are **not** touched — no placeholder image is added for row 03 (per the brief).

- [ ] **Step 1: Fix the grid placement (the root cause, not an offset)**

The alternating rhythm is: 01 text left (cols 1–5) / media right · 02 media left / text right (cols 8–12) · 03 text left again. The current `grid-column: 6 / -1` puts row 03 at a third, unrelated position (x=650 vs 240/814). Replace:

```css
/* before */
.textOnly .text {
  grid-column: 6 / -1;
}

/* after — continue the alternation: 03's text occupies the same 5-column
   track as 01's, so number, heading and paragraph share its exact left
   edge and the row reads as the pattern's deliberate closing beat. */
.textOnly .text {
  grid-column: 1 / 6;
}
```

The `.text` internal stack (number → heading → paragraphs, `gap: var(--space-sm)`) and the uniform `.rows` gap already match rows 01/02 — no other spacing change is needed or allowed.

- [ ] **Step 2: Enlarge the stamp ~20%**

```css
/* before */
.stampImage {
  inline-size: min(200px, 48vw);
  block-size: auto;
}

/* after */
.stampImage {
  inline-size: min(240px, 55vw);
  block-size: auto;
}
```

`block-size: auto` preserves the 462:432 aspect ratio — no distortion. Do not touch `.stampSlot` (its white-on-Gesso blending note still applies) and do not touch the map row.

- [ ] **Step 3: Verify**

`npm run dev` at 1440×900, scroll to Why Imperium:

- 01's number/heading and 03's number/heading share the same left x-coordinate (measure via DevTools; both should sit at the row grid's column 1).
- 02's text block is unchanged (x≈814 at 1440).
- The stamp renders ≈240px wide, centered in its column, clearly subordinate to the row.
- Confirm the stamp is still `made-in-italy-stamp.png` — NOT the certification scan.
- Mobile (390px): single column, all three rows stack normally.

Run: `npx vitest run tests/unit/components/sections/WhyImperium.test.tsx` → PASS (structure untouched).

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/WhyImperium.module.css
git commit -m "fix: align WhyImperium item 03 with the alternating grid and enlarge stamp"
```

---

### Task 7: Founder — give the certification scan real presence

**Files:**

- Modify: `src/components/sections/Founder.module.css:59-69` (`.certImageWrap`)
- Modify: `src/components/sections/Founder.tsx:51-58` (add `sizes` to the cert Image)

- [ ] **Step 1: Enlarge the wrap**

```css
/* before */
.certImageWrap {
  position: relative;
  max-inline-size: 220px;
  aspect-ratio: 2502 / 1770;
  margin-inline: auto;
  margin-block-end: var(--space-sm);
  overflow: hidden;
  background-color: var(--color-sabbia);
}

/* after */
.certImageWrap {
  position: relative;
  max-inline-size: min(340px, 100%);
  aspect-ratio: 2502 / 1770;
  margin-inline: auto;
  margin-block-end: var(--space-sm);
  overflow: hidden;
  background-color: var(--color-sabbia);
}
```

The `aspect-ratio` matches the scan exactly, so `object-fit: cover` still crops nothing — the document's border stays intact. The 2502×1770 source has ample resolution for 680 device pixels.

- [ ] **Step 2: Add responsive sizes to the fill image**

In `Founder.tsx`, the certification `<Image>` gains one attribute:

```tsx
<Image
  src={founder.certification.src}
  alt={founder.certification.caption}
  fill
  loading="lazy"
  sizes="(min-width: 1024px) 340px, 80vw"
  className={styles.certImage}
/>
```

- [ ] **Step 3: Verify**

At 1440×900: the scan renders ≈340×240, centered under the pull quote with the "Made in Italy Certification" caption beneath; the diploma's headline text is legible; it reads as a supporting proof point, clearly subordinate to the story and quote (the right column is ~660px wide, so 340px stays modest). If legibility is still poor at 340px, go to 380px — no further. It must never appear in Why Imperium.

Run: `npx vitest run tests/unit/components/sections/Founder.test.tsx` → PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Founder.module.css src/components/sections/Founder.tsx
git commit -m "fix: enlarge founder certification scan to legible supporting size"
```

---

### Task 8: Full verification matrix + docs note

**Files:**

- Modify: `progress.md` (append to the placeholder/fine-tune backlog)

- [ ] **Step 1: Quality gates**

```bash
npm run lint && npm run typecheck && npm run test && npm run build
```

Expected: lint clean, typecheck clean, all Vitest suites pass, production build succeeds. Record the `/` route First Load JS from the build output — it should drop substantially versus the silk build (three.js is no longer in the page graph). Any pre-existing failure unrelated to this work: report it verbatim, do not silently fix or hide it.

- [ ] **Step 2: Production-mode smoke test**

```bash
npm run start
```

Browse `http://localhost:3000` — dev-only warnings are absent in prod; confirm zero console errors/warnings (the hydration error from Task 1 and the `THREE.Clock` warnings must both be gone).

- [ ] **Step 3: Viewport matrix (use browser devtools or the preview tooling)**

At each of **1440×900, 1512×982, 1920×1080, 768×1024, 390×844**, verify and note results per size:

- hero image sharp (inspect at 100%; no stretch beyond the 3840px asset), entrance sequence ordered correctly, hero fully static afterwards;
- collections: pins/releases correctly (desktop sizes), all four panels reachable, nothing clipped, `document.documentElement.scrollWidth === window.innerWidth`;
- 768×1024 falls below the 1024px pin threshold → scroll-snap row expected (this is the intended "small tablet" fallback);
- WhyImperium 01/03 left edges equal; stamp ~240px; Founder cert ~340px;
- fixed nav never overlapped; no animation-induced layout shift (toggle "Layout Shift Regions" in DevTools Rendering panel while reloading);
- reduced-motion pass at 1440×900 and 390×844: no entrance motion, no pinning, everything reachable.

- [ ] **Step 4: Run the brief's final checklist**

Reproduce the HERO/COLLECTIONS/WHY IMPERIUM/FOUNDER/QUALITY checklist from the task brief item by item, marking each with evidence (measurement or screenshot).

- [ ] **Step 5: Append to progress.md backlog**

Add under the placeholder/fine-tune backlog:

```md
- Hero still (`/images/hero/hero-still.jpg`) is a 4K capture of the silk shader's
  resting frame (scripts/capture-hero-still.mjs). A real hero photograph from the
  client remains requested and is a one-line swap in Hero.tsx.
- Silk WebGL module retained in src/components/silk/ but unmounted from Hero
  (client direction 2026-07-07: hero must be static after entrance). three.js
  deps retained pending a removal decision.
- Collection fabric PNGs are 627×627; client re-exports at ≥1200px still requested.
```

- [ ] **Step 6: Commit**

```bash
git add progress.md
git commit -m "docs: record hero still provenance and open asset/CTA follow-ups"
```

---

## Self-Review Notes

- **Spec coverage:** hero pipeline diagnosis (done pre-plan, recorded in Root-Cause Findings), hero asset (T2), hero animation + reduced motion (T3), collections pinned scroll (T4), card scale reduction (T4 spread layout: 842→~468px image height at 900-height viewports), copy verification (T4 tests + Global Constraints), mobile fallback (T4 scroll-snap), Embla/dots cleanup (T5), WhyImperium 03 + stamp (T6), founder cert (T7), viewport matrix + quality gates (T8), hydration error (T1).
- **Deliberate deviations from the brief, justified:** CTA labels follow D-1's default pending confirmation; the image-scale reduction exceeds 10–20% at some viewports because "fits comfortably with nothing clipped" is geometrically impossible at 900px height otherwise — the spread layout keeps the images substantial while satisfying the hard constraints.
- **Type consistency:** `FabricCardProps.layout?: "stack" | "spread"` (T4 step 2) matches its only call site `layout="spread"` (T4 step 4); `--panel-image-h` is set in Collections.module.css (T4 step 5) and consumed in FabricCard.module.css (T4 step 3); `travel: number` state feeds both the inline `blockSize` calc and `useTransform`'s output range.

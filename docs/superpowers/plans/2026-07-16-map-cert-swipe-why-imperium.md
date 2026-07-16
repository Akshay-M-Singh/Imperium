# Map Swap · Diploma Redaction · Mobile Swipe Fix · Why Imperium Refinements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Four client-requested homepage changes: swap in the new Italy→Gulf map artwork, seamlessly redact Sofia's DOB/birthplace from the diploma PNG, make the Collections row swipe reliably on mobile, and give the Why Imperium headings a gold underline plus one new competitive-sourcing sentence.

**Architecture:** Asset swaps + a deterministic offline sharp script (repo pattern: `scripts/derive-brand-assets.mjs`) + a touch-interference fix in the TiltCard motion wrapper + CSS/data-file copy edits. No new routes, components, or dependencies.

**Tech Stack:** Next.js 15 App Router, React 19, TS strict, CSS Modules, Framer Motion, sharp (already a devDependency, used by existing scripts), Vitest.

**Spec:** `docs/superpowers/specs/2026-07-16-map-cert-swipe-why-imperium-design.md` — read it first; it records the user's four explicit decisions (no price mention, seamless redaction, history-rewrite deferred, gold underline).

## Global Constraints

- Branch: `fix/map-cert-swipe-why-imperium` off `main`. Commit messages follow commitlint (`feat:`/`fix:`/`docs:`/`test:`) and end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- **The diploma may not change visually anywhere except the DOB line** ("Nata a Seriate il 06/07/2001"). No re-crop, no color shift, no resize. PNG stays lossless.
- **The unredacted scan must not survive at any served path** once Task 2 lands; do not re-add it under any name. (Its presence in git _history_ is a known, separately-tracked follow-up — out of scope here.)
- **No price/pricing words** may enter any copy (site-wide luxury positioning rule; the new sentence is competitive-framing only).
- Silk hero textures in `public/images/hero/silk/` are untouched and must never go through `next/image` (standing rule, not exercised by this plan).
- Desktop (≥1024px, motion-allowed) Collections pinned showcase must be behaviorally unchanged.
- AR copy edits are machine drafts: they must be mirrored in `docs/superpowers/specs/2026-07-14-ar-copy-review-sheet.md` (native-review gate, CLAUDE.md §10 item 6).
- Never run `npm audit fix --force`. Never commit `.DS_Store` (gitignored).
- All quality gates green before finishing: `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`.

---

### Task 1: Branch + map swap

**Files:**

- Rename: `public/images/map/new map.png` → `public/images/map/italy-gulf-routes-v2.png` (untracked → new)
- Delete: `public/images/map/italy-gulf-routes.png` (tracked)
- Modify: `src/components/sections/WhyImperium.tsx:32` (the `Image src` in `MediaSlot`)
- Test: `tests/unit/components/sections/WhyImperium.test.tsx`

**Interfaces:**

- Produces: the map media slot serves `/images/map/italy-gulf-routes-v2.png` (1536×1024, transparent background). No other task consumes this.

- [ ] **Step 1: Create the branch**

```bash
git checkout main && git pull origin main
git checkout -b fix/map-cert-swipe-why-imperium
```

- [ ] **Step 2: Write the failing test**

Add to the `describe("WhyImperium", ...)` block in `tests/unit/components/sections/WhyImperium.test.tsx`:

```tsx
it("serves the 2026-07-16 replacement map artwork, not the retired first version", () => {
  render(<WhyImperium />);
  const map = screen.getByRole("img", {
    name: /route map from Italy to the UAE and the Gulf/i,
  });
  expect(map.getAttribute("src")).toContain("italy-gulf-routes-v2.png");
});
```

(`toContain` keeps the assertion valid whether next/image renders the raw path or an encoded `/_next/image?url=...` form — the filename survives URL-encoding intact.)

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run tests/unit/components/sections/WhyImperium.test.tsx`
Expected: the new test FAILS (src still contains `italy-gulf-routes.png`); the other five pass.

- [ ] **Step 4: Swap the asset files**

```bash
mv "public/images/map/new map.png" public/images/map/italy-gulf-routes-v2.png
git rm public/images/map/italy-gulf-routes.png
```

- [ ] **Step 5: Update the component reference**

In `src/components/sections/WhyImperium.tsx`, `MediaSlot`, change only the `src` line (width/height stay — the new file is also 1536×1024; alt text stays — it still shows an Italy→UAE/Gulf route):

```tsx
<Image
  src="/images/map/italy-gulf-routes-v2.png"
  alt={mapAlt}
  width={1536}
  height={1024}
  loading="lazy"
  className={styles.mapImage}
/>
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run tests/unit/components/sections/WhyImperium.test.tsx`
Expected: all 6 PASS.

- [ ] **Step 7: Confirm no stale references**

Run: `grep -rn "italy-gulf-routes.png" src tests docs/superpowers/specs/2026-07-16-map-cert-swipe-why-imperium-design.md`
Expected: no hits in `src`/`tests` (spec/plan docs may mention the old name historically — that's fine; only code must be clean).

- [ ] **Step 8: Commit**

```bash
git add public/images/map/italy-gulf-routes-v2.png src/components/sections/WhyImperium.tsx tests/unit/components/sections/WhyImperium.test.tsx docs/superpowers/specs/2026-07-16-map-cert-swipe-why-imperium-design.md docs/superpowers/plans/2026-07-16-map-cert-swipe-why-imperium.md
git commit -m "feat: swap Italy-Gulf route map for new client artwork

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

(This first commit also lands the spec + this plan on the branch.)

---

### Task 2: Diploma redaction — script, asset, data

**Files:**

- Create: `scripts/redact-certification.mjs`
- Create: `public/images/certifications/made-in-italy-diploma.png` (script output)
- Delete: `public/images/certifications/made-in-italy-certification.png`
- Modify: `src/data/founder.ts` (two `certification.src` lines, `en` + `ar`)

**Interfaces:**

- Consumes: the current unredacted scan (2502×1770). Redaction rect **x 900–1620, y 1278–1353**; donor strip **x 900–1620, y 1243–1285** — both pre-measured against the actual file and visually confirmed in the planning session (donor band is clean smooth background; rect fully contains the DOB line with margin).
- Produces: `/images/certifications/made-in-italy-diploma.png` — same dimensions, DOB line seamlessly removed. `Founder.tsx` needs no change (it reads `founder[locale].certification.src`).

- [ ] **Step 1: Write the redaction script**

Create `scripts/redact-certification.mjs`:

```js
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
```

- [ ] **Step 2: Run the script with verification crops**

Run (use the session scratchpad directory for the crops, not the repo):

```bash
node scripts/redact-certification.mjs --verify-dir <scratchpad>/cert-verify
```

Expected output: `wrote public/images/certifications/made-in-italy-diploma.png` + crops line.

- [ ] **Step 3: Visually verify the redaction (Read tool on each crop)**

- `zoom-after.png`: the "Nata a Seriate il 06/07/2001" line is **gone**; "Sofia Mazza" above and "che ha partecipato…" below are intact; no visible seam, band, or tone step where the line was.
- `zoom-before.png` vs `zoom-after.png`: the ONLY difference is the missing line.
- `control-before.png` vs `control-after.png`: pixel-identical to the eye (untouched region).
- Also Read the full `made-in-italy-diploma.png` to confirm the whole diploma still reads correctly end-to-end.

If a seam is visible: widen `DONOR` sampling or nudge `RECT` a few px and re-run — do NOT hand-edit the PNG. The script is the source of truth.

- [ ] **Step 4: Remove the unredacted file and update data**

```bash
git rm public/images/certifications/made-in-italy-certification.png
```

In `src/data/founder.ts`, change **both** locales' `certification.src` (lines ~40 and ~61) to:

```ts
      src: "/images/certifications/made-in-italy-diploma.png",
```

- [ ] **Step 5: Confirm no stale references, run tests**

```bash
grep -rn "made-in-italy-certification" src tests public
npx vitest run tests/unit/components/sections/Founder.test.tsx tests/unit/data/locale-parity.test.ts
```

Expected: zero grep hits; all tests PASS (Founder tests assert captions/testids, not the path).

- [ ] **Step 6: Commit**

```bash
git add scripts/redact-certification.mjs public/images/certifications/made-in-italy-diploma.png src/data/founder.ts
git commit -m "fix: redact founder DOB and birthplace from diploma scan

Seamless background patch over the single PII line; every other pixel
untouched. New filename so the old URL stops resolving on deploy.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Collections mobile swipe reliability

**Files:**

- Modify: `src/components/motion/TiltCard.tsx` (remove touch press effect)
- Modify: `src/components/ui/FabricCard.module.css` (`.image` rule — suppress iOS long-press image gesture)
- Modify: `MOTION_SPEC.md` (amend the TiltCard §3.1 touch line)
- Conditional: `src/components/sections/Collections.module.css` (snap relaxation; vertical-stack fallback)

**Interfaces:**

- Consumes: nothing from other tasks.
- Produces: `TiltCard` keeps its exported API (`TiltCard`, `TiltCardImage`, same props) — only touch behavior changes. Desktop hover tilt/shadow/scale unchanged.

**Why (spec §2):** touch starting on a card is unreliable; on the gaps it works. Two interference sources on the cards, both removed unconditionally (each is decorative or harmful): (1) iOS long-press image callout on the card photo cancels the scroll pan — fits the user's "hold on a card" report exactly; (2) TiltCard animates a press-scale transform on the touched element mid-gesture, which iOS Safari can treat as gesture cancellation.

- [ ] **Step 1: Suppress the long-press image gesture on card media**

In `src/components/ui/FabricCard.module.css`, add to the existing `.image` rule (keep its current properties):

```css
/* iOS: a long-press image preview/callout on the card photo cancels the
     Collections row's scroll pan — suppress it (fix for unreliable mobile
     swipe, 2026-07-16). */
-webkit-touch-callout: none;
-webkit-user-drag: none;
user-select: none;
```

- [ ] **Step 2: Remove TiltCard's touch press effect**

Replace `src/components/motion/TiltCard.tsx` in full with:

```tsx
"use client";

// TiltCard — cursor-aware 3D tilt for fabric cards (MOTION_SPEC.md §3.1).
// Max ±4° rotateX / ±8° rotateY, image scale 1.05, two-layer shadow elevation.
// Touch: no interaction (the former press-scale was removed 2026-07-16 —
// animating a transform on the touched element could cancel the Collections
// row's scroll gesture on iOS Safari). Reduced motion: static.

import { createContext, useContext, useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./TiltCard.module.css";

interface TiltCardContextValue {
  hover: MotionValue<number>;
  hoverSpring: MotionValue<number>;
}

const TiltCardContext = createContext<TiltCardContextValue | null>(null);

function useTiltCardContext() {
  const ctx = useContext(TiltCardContext);
  if (!ctx) {
    throw new Error("TiltCardImage must be used inside a TiltCard");
  }
  return ctx;
}

export interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export interface TiltCardImageProps {
  children: ReactNode;
  className?: string;
}

const ROTATE_X_RANGE = 4; // ±4° from cursor Y
const ROTATE_Y_RANGE = 8; // ±8° from cursor X

export function TiltCard({ children, className }: TiltCardProps): ReactNode {
  const reduced = useReducedMotion();

  // Raw interaction values (updated on events, never in React state).
  const hover = useMotionValue(0);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Spring-smoothed values for all motion outputs.
  const hoverSpring = useSpring(hover, springs.standard);
  const springMouseX = useSpring(mouseX, springs.standard);
  const springMouseY = useSpring(mouseY, springs.standard);

  // Cursor-driven tilt.
  const rotateY = useTransform(springMouseX, [0, 1], [-ROTATE_Y_RANGE, ROTATE_Y_RANGE]);
  const rotateX = useTransform(springMouseY, [0, 1], [ROTATE_X_RANGE, -ROTATE_X_RANGE]);

  // Shadow elevation follows cursor hover.
  const boxShadow = useTransform(
    hoverSpring,
    [0, 1],
    [
      "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
      "0 24px 48px rgba(0,0,0,0.08), 0 12px 24px rgba(0,0,0,0.05)",
    ],
  );

  const rootRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced || !rootRef.current) return;

    const rect = rootRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    mouseX.set(Math.max(0, Math.min(1, x)));
    mouseY.set(Math.max(0, Math.min(1, y)));
  };

  const handleMouseEnter = () => {
    if (reduced) return;
    hover.set(1);
  };

  const handleMouseLeave = () => {
    if (reduced) return;
    hover.set(0);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <TiltCardContext.Provider value={{ hover, hoverSpring }}>
      <motion.div
        ref={rootRef}
        className={[styles.root, className].filter(Boolean).join(" ")}
        style={{ boxShadow: reduced ? undefined : boxShadow }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className={styles.surface}
          style={{
            rotateX: reduced ? 0 : rotateX,
            rotateY: reduced ? 0 : rotateY,
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </TiltCardContext.Provider>
  );
}

export function TiltCardImage({ children, className }: TiltCardImageProps): ReactNode {
  const { hoverSpring } = useTiltCardContext();
  const scale = useTransform(hoverSpring, [0, 1], [1, 1.05]);

  return (
    <motion.div className={[styles.image, className].filter(Boolean).join(" ")} style={{ scale }}>
      {children}
    </motion.div>
  );
}

export default TiltCard;
```

(Diff vs current: `pressed`/`pressedSpring`/press `scale`/`active` motion values, the `TouchEvent` import, `handleTouchStart`/`handleTouchEnd`, and the `onTouchStart`/`onTouchEnd` props are gone; shadow now follows `hoverSpring` directly; `scale` is dropped from the surface style. Mouse behavior identical.)

- [ ] **Step 3: Amend MOTION_SPEC.md**

Run `grep -n "0.98" MOTION_SPEC.md` to find §3.1's touch line, and rewrite that line to:

```markdown
- Touch: no press effect (removed 2026-07-16 — the press-scale transform on the touched card could cancel the Collections row's native scroll gesture on iOS Safari; suppressed together with the iOS long-press image callout).
```

- [ ] **Step 4: Run the suite**

Run: `npm run test`
Expected: all tests PASS (no test asserts touch handlers; `Collections.test.tsx` exercises the reduced-motion scroll-snap branch and is unaffected).

- [ ] **Step 5: Emulated touch verification**

Start the dev preview (`preview_start` with the launch.json config; create one if missing per that tool's docs), resize to mobile (375×812), and on `/`:

- Read the page, locate the Collections row, and drag horizontally starting **on a card image** — the row must scroll.
- Repeat starting the drag on a card's text area and on the gap between cards.
- Tap a card's "Contact Us Now" — must navigate to `#contact`.
- Load `/ar` and confirm the row still swipes and lays out RTL.
  Note in the task summary that emulation cannot fully reproduce iOS gesture arbitration — Step 7's real-device checkpoint is the true gate.

- [ ] **Step 6: Commit**

```bash
git add src/components/motion/TiltCard.tsx src/components/ui/FabricCard.module.css MOTION_SPEC.md
git commit -m "fix: stop card touch effects from breaking mobile collections swipe

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

- [ ] **Step 7: CHECKPOINT — real-device test (blocks finalization)**

Ask the user to test on their phone (deployed preview URL or LAN dev server): swipe starting on a card repeatedly, including press-and-hold then swipe. Outcomes:

- **Fluid** → task done, skip Steps 8–9.
- **Better but snaps back / feels sticky** → apply Step 8.
- **Still unreliable** → apply Step 9 (user-sanctioned fallback).

- [ ] **Step 8 (conditional): Relax the snap**

In `src/components/sections/Collections.module.css`, base `.track` rule, change:

```css
scroll-snap-type: x proximity;
```

(was `x mandatory`). Re-verify per Step 5, then:

```bash
git add src/components/sections/Collections.module.css
git commit -m "fix: relax collections snap to proximity for freer swiping

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

- [ ] **Step 9 (conditional fallback): Vertical stack on mobile**

Only if the user reports swiping still unreliable after Steps 1–8. In `src/components/sections/Collections.module.css`, replace the base `.track` and `.panel` rules (mobile-first defaults) with a vertical stack, and reintroduce the horizontal row from 768px up (the ≥1024px pinned rules already override further):

```css
.track {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding-inline: var(--grid-margin-mobile);
  padding-block: var(--space-xs);
}

.panel {
  inline-size: 100%;
}
```

and inside the existing `@media (min-width: 768px)` block, restore the row behavior:

```css
.track {
  flex-direction: row;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  padding-inline: var(--grid-margin-tablet);
  gap: var(--space-lg);
}

.track::-webkit-scrollbar {
  display: none;
}

.panel {
  flex: 0 0 auto;
  inline-size: min(44vw, 400px);
  scroll-snap-align: center;
}
```

Verify: mobile viewport shows all four cards stacked full-width; tablet (768px) shows the swipe row; desktop pinned showcase unchanged; `npm run test` still green. Commit:

```bash
git add src/components/sections/Collections.module.css
git commit -m "fix: stack collections vertically on mobile

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Why Imperium — gold underline on row headings

**Files:**

- Modify: `src/components/sections/WhyImperium.module.css` (`.heading` rule)

**Interfaces:** none — pure CSS, both locales inherit automatically (RTL underlines render correctly by default).

- [ ] **Step 1: Add the underline**

In `src/components/sections/WhyImperium.module.css`, extend the existing `.heading` rule (keep its current properties):

```css
/* Client request 2026-07-16: underline the three row headings.
     Fine gold line, generous offset — restraint over decoration. */
text-decoration-line: underline;
text-decoration-color: var(--color-oro-antico);
text-decoration-thickness: 1px;
text-underline-offset: 0.3em;
text-decoration-skip-ink: auto;
```

- [ ] **Step 2: Visual verification**

Dev preview on `/`: all three row headings ("Direct From the Source", "Made in Italy Expertise", "For the Gulf's Luxury Market") show a thin gold underline with clear air beneath the text; descenders (the "y" in "Italy", "Luxury") are skipped cleanly; the section headline and eyebrow are NOT underlined. Check `/ar` too (same class, RTL). Tune `text-underline-offset` between 0.25em–0.4em if the line crowds or floats — pick what reads best at both mobile and desktop sizes.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/WhyImperium.module.css
git commit -m "feat: underline why-imperium row headings in gold

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Why Imperium — competitive-sourcing sentence (EN + AR)

**Files:**

- Modify: `src/data/pillars.ts` (item 01, second paragraph, both locales)
- Modify: `docs/superpowers/specs/2026-07-14-ar-copy-review-sheet.md` (new row)
- Test: `tests/unit/data/pillars.test.ts`

**Interfaces:**

- Consumes: `whyImperium` from `src/data/pillars.ts` (existing shape — appending inside an existing paragraph string, so `locale-parity.test.ts`'s shape check is unaffected).
- Produces: final EN sentence for Sofia's sign-off list (Task 6 docs step records it).

- [ ] **Step 1: Write the failing test**

Add to `tests/unit/data/pillars.test.ts`:

```ts
it("closes item 1 with the competitive-sourcing line, never naming price", () => {
  expect(whyImperium.en.items[0]!.paragraphs[1]).toMatch(/competitive/i);
  // Site-wide rule: luxury positioning never states prices (user decision 2026-07-16).
  expect(JSON.stringify(whyImperium.en)).not.toMatch(/price|pricing/i);
  expect(whyImperium.ar.items[0]!.paragraphs[1]).toMatch(/تنافسي/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/data/pillars.test.ts`
Expected: new test FAILS on the first assertion (no "competitive" yet); existing 7 pass.

- [ ] **Step 3: Append the sentence, both locales**

In `src/data/pillars.ts`, item 01 (`"Direct From the Source"`), **EN** second paragraph becomes:

```ts
          "From those mills, fabric travels one route: Italy to the UAE and across the Gulf. One partner, one chain of custody, nothing anonymous between the loom and your project. And with no one in between, that provenance comes with an edge — sourcing direct keeps us genuinely competitive.",
```

**AR** second paragraph becomes (machine draft — review-sheet gate applies):

```ts
          "من تلك المصانع يسلك القماش طريقًا واحدًا: من إيطاليا إلى الإمارات وعبر الخليج. شريك واحد، وسلسلة عهدة واحدة، ولا شيء مجهول بين النول ومشروعك. ولأن لا وسيط بيننا وبين المصانع، يتحول هذا المنشأ إلى أفضلية — فالتوريد المباشر يجعلنا في موقع تنافسي حقيقي.",
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/unit/data/pillars.test.ts tests/unit/data/locale-parity.test.ts`
Expected: all PASS.

- [ ] **Step 5: Add the review-sheet row**

In `docs/superpowers/specs/2026-07-14-ar-copy-review-sheet.md`, find the Why Imperium section (`src/data/pillars.ts` rows) and append a table row:

```markdown
| And with no one in between, that provenance comes with an edge — sourcing direct keeps us genuinely competitive. _(added 2026-07-16, item 01 ¶2 closing sentence)_ | ولأن لا وسيط بيننا وبين المصانع، يتحول هذا المنشأ إلى أفضلية — فالتوريد المباشر يجعلنا في موقع تنافسي حقيقي. |
```

- [ ] **Step 6: Commit**

```bash
git add src/data/pillars.ts tests/unit/data/pillars.test.ts docs/superpowers/specs/2026-07-14-ar-copy-review-sheet.md
git commit -m "feat: add competitive direct-sourcing line to why-imperium item 01

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Quality gates, full visual verification, docs

**Files:**

- Modify: `CLAUDE.md` (Addendum 8), `progress.md` (backlog/fine-tune note)

**Interfaces:** consumes everything above; produces the branch's final state for `superpowers:finishing-a-development-branch`.

- [ ] **Step 1: Run all quality gates**

```bash
npm run test
npm run typecheck
npm run lint
npm run build
```

Expected: tests all green (baseline was 61/61 before the silk branch; count grows with the two tests this plan adds — report actual numbers, don't assume), typecheck/lint clean, build succeeds.

- [ ] **Step 2: Full-page visual verification (dev preview)**

On `/` desktop (1280×800) and mobile (375×812), and `/ar`:

1. Why Imperium row 01 renders the new transparent-background map cleanly on the white Gesso band.
2. The Founder section's diploma shows NO DOB/birthplace line and no visible patch artifact (zoom screenshot).
3. All three Why Imperium headings carry the gold underline; new sentence reads correctly in both locales.
4. Collections swipes per Task 3's resolved state.
   Capture screenshots as proof for the final summary.

- [ ] **Step 3: Update CLAUDE.md and progress.md**

Append to CLAUDE.md's addenda block:

```markdown
> **Addendum 8 (2026-07-16):** plan `docs/superpowers/plans/2026-07-16-map-cert-swipe-why-imperium.md` (branch `fix/map-cert-swipe-why-imperium`) landed four client changes: (1) the Why Imperium route map was replaced with the client's new transparent-background artwork (`/images/map/italy-gulf-routes-v2.png`; old file deleted, recoverable via git); (2) the diploma scan was **seamlessly redacted** — Sofia's DOB/birthplace line removed by the deterministic `scripts/redact-certification.mjs` and reissued as `made-in-italy-diploma.png` (old URL dead; ⚠️ the unredacted original remains in the public repo's git history — separate follow-up task, user decision 2026-07-16); (3) mobile Collections swiping was fixed by suppressing the iOS long-press image callout on card media and removing TiltCard's touch press-scale (MOTION_SPEC §3.1 amended) — [record here which conditional steps ran: snap proximity? vertical fallback?]; (4) Why Imperium row headings gained a fine gold underline and item 01 a competitive direct-sourcing sentence (no price mention by explicit client decision; AR machine draft added to the review sheet, §10 item 6 gate applies). New EN sentence still needs Sofia's sign-off.
```

(Replace the bracketed note with what actually happened — that bracket is the only permitted placeholder, resolved at execution time.)

Add a matching dated note to `progress.md`'s fine-tune/backlog section, including the follow-up item: **"Purge unredacted diploma from git history (git-filter-repo/BFG + force push — needs Akshay's coordination)."**

- [ ] **Step 4: Commit docs**

```bash
git add CLAUDE.md progress.md
git commit -m "docs: record map swap, diploma redaction, swipe fix, why-imperium polish

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

- [ ] **Step 5: Finish the branch**

Use `superpowers:finishing-a-development-branch` (merge vs PR is the user's call — recent branches went up as PRs against `Akshay-M-Singh/Imperium`). In the final summary, explicitly restate: (a) the git-history PII follow-up, (b) the EN sentence + AR draft awaiting Sofia, (c) whether the swipe fix or the vertical fallback shipped.

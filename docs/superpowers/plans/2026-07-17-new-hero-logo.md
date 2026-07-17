# New Hero Logo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adopt the client's new logo artwork as the hero wordmark, served as a clean transparent PNG over the silk backdrop.

**Architecture:** Feed the new opaque artwork through the existing `scripts/derive-brand-assets.mjs` pipeline (white-key → auto-crop → transparent PNG). The new artwork sits on a cream background (not white), so the white-key threshold must be tuned before it crops and keys correctly. Then update the hero's hardcoded image dimensions to the regenerated crop.

**Tech Stack:** Next.js 15 / React 19, `next/image`, `sharp` (image derivation, already a dependency), Node ESM script.

**Spec:** `docs/superpowers/specs/2026-07-17-new-hero-logo-design.md`

## Global Constraints

- **Scope: hero logo only.** Do NOT touch favicon, `apple-touch-icon.png`, PWA/social/OG icons, the top-nav text wordmark, or the footer text wordmark.
- **Silk textures untouched.** This plan never routes anything in `public/images/hero/silk/` through `next/image` or any optimizer (unrelated to this work, but a standing repo rule).
- The regenerated wordmark must have a **transparent** background — no cream/white halo — because it renders over the photographic silk hero backdrop.
- `SITE.logoSrc` in `src/lib/site.ts` already points at `/images/logo/imperium-wordmark.png`; keep that filename so `site.ts` needs no edit.
- Preserve the light-gold "ITALIAN TEXTILE" subtitle and its flanking rules — do not erode them when tuning the key.
- Quality gates that must stay green: `npm run test`, `npm run typecheck`, `npm run build`.

---

## File Structure

- `public/images/logo/Logo.png` — canonical opaque source for the derivation pipeline. **Replaced** with the new artwork.
- `scripts/derive-brand-assets.mjs` — the white-key + crop pipeline. **Modified** (threshold + comment).
- `public/images/logo/imperium-wordmark.png` — transparent hero wordmark. **Regenerated** output (do not hand-edit).
- `src/components/sections/Hero.tsx` — renders the wordmark. **Modified** (`next/image` `width`/`height`).

---

### Task 1: Swap in the new artwork as the canonical source

**Files:**

- Delete: `public/images/logo/New Logo.png` (after copying its bytes over `Logo.png`)
- Modify (replace bytes): `public/images/logo/Logo.png`
- Delete if present: `public/images/logo/.DS_Store`

**Interfaces:**

- Consumes: nothing.
- Produces: `public/images/logo/Logo.png` = the new 2084×2084 artwork, which `scripts/derive-brand-assets.mjs` reads via its `SRC` constant.

- [ ] **Step 1: Confirm the new artwork is present and note its dimensions**

Run:

```bash
cd /Users/rahique/Desktop/Builds/Imperium
sips -g pixelWidth -g pixelHeight "public/images/logo/New Logo.png"
```

Expected: `pixelWidth: 2084`, `pixelHeight: 2084`.

- [ ] **Step 2: Replace the canonical source with the new artwork**

The pipeline's `SRC` is `public/images/logo/Logo.png`. Overwrite it with the new file (the old `Logo.png` stays recoverable in git history), then remove the now-redundant `New Logo.png` and any stray `.DS_Store`:

```bash
cp "public/images/logo/New Logo.png" public/images/logo/Logo.png
rm -f "public/images/logo/New Logo.png" public/images/logo/.DS_Store
```

- [ ] **Step 3: Verify the source is in place**

Run:

```bash
sips -g pixelWidth -g pixelHeight public/images/logo/Logo.png
ls public/images/logo/
```

Expected: `Logo.png` is 2084×2084; `New Logo.png` and `.DS_Store` are gone; `imperium-wordmark.png` still present (regenerated in Task 2).

- [ ] **Step 4: Commit**

```bash
git add -A public/images/logo/
git commit -m "chore: replace logo source with new client artwork"
```

---

### Task 2: Tune the white-key and regenerate the transparent wordmark

**Files:**

- Modify: `scripts/derive-brand-assets.mjs` (the `WHITE` constant and header comment)
- Regenerate: `public/images/logo/imperium-wordmark.png`

**Interfaces:**

- Consumes: `public/images/logo/Logo.png` (Task 1).
- Produces: `public/images/logo/imperium-wordmark.png` — transparent, tightly cropped. Its exact pixel `width`/`height` are consumed by Task 3.

Context — current constants in `scripts/derive-brand-assets.mjs`:

```js
const SRC = "public/images/logo/Logo.png";
const OUT = "public/images/logo/imperium-wordmark.png";
const WHITE = 246; // lightest channel >= WHITE → fully transparent
const BLACK = 140; // lightest channel <= BLACK → fully opaque
const MARGIN = 12;
```

The new source's cream outer margin is `[244,239,235]` (min channel **235**) and the inner plate is `[248,248,246]` (min channel **246**). At `WHITE=246` the cream margin only reaches alpha ≈ 17, leaving a ghost and defeating the alpha>8 crop. Raising `WHITE` to just above the cream's min channel clears it.

- [ ] **Step 1: Raise the WHITE threshold**

In `scripts/derive-brand-assets.mjs`, change:

```js
const WHITE = 246;
```

to:

```js
const WHITE = 237;
```

(237 is just above the cream margin's min channel 235, so both the cream and the plate key fully to transparent, while the darker glyphs and gold detail are preserved.)

- [ ] **Step 2: Update the header comment to match the new source**

Replace the top comment block's first sentences so they describe the new cream-backed source. Change:

```js
// Derives the web logo from the client's opaque source PNG
// (public/images/logo/Logo.png): pure-white canvas + #F7F8F7 plate behind
// a brown wordmark. White is keyed out with a min-channel alpha ramp, then
// the result is cropped to the artwork plus a small margin. Re-run when
// the client sends new artwork:  node scripts/derive-brand-assets.mjs
```

to:

```js
// Derives the web logo from the client's opaque source PNG
// (public/images/logo/Logo.png): a ~#F4EFEB cream canvas + ~#F8F8F6 plate
// behind a brown wordmark with a light-gold subtitle. The light background
// is keyed out with a min-channel alpha ramp (WHITE tuned to 237 so the
// cream margin, min channel ~235, also clears), then the result is cropped
// to the artwork plus a small margin. Re-run when the client sends new
// artwork:  node scripts/derive-brand-assets.mjs
```

Also update the inline comment on `WHITE` from `#F7F8F7 plate` wording to note it clears both the cream canvas and the plate.

- [ ] **Step 3: Regenerate the wordmark**

Run:

```bash
node scripts/derive-brand-assets.mjs
```

Expected: no error (no "No opaque pixels found").

- [ ] **Step 4: Verify the crop tightened and read the new dimensions**

Run:

```bash
sips -g pixelWidth -g pixelHeight -g hasAlpha public/images/logo/imperium-wordmark.png
```

Expected: `hasAlpha: yes`; dimensions **well under 2084²** (a horizontal lockup, width ≫ height). **Record the exact `pixelWidth` and `pixelHeight`** — Task 3 needs them.

If the output is still ~2084 wide (crop did not tighten) or the corners still show cream, the key is too low: nudge `WHITE` up by 1–2 and re-run Step 3. Keep `WHITE` as low as still clears the cream (protects the gold).

- [ ] **Step 5: Visually confirm no halo and gold intact**

Open `public/images/logo/imperium-wordmark.png` (Read it as an image, or preview it composited on a dark background). Confirm: fully transparent surround (no cream box/halo), brown "IMPERIUM" crisp, gold "ITALIAN TEXTILE" and both flanking rules present and not thinned/broken.

If the gold looks eroded, lower `WHITE` by 1 and re-run Step 3 — there is a narrow band (≈236–238) that clears cream without harming gold.

- [ ] **Step 6: Commit**

```bash
git add scripts/derive-brand-assets.mjs public/images/logo/imperium-wordmark.png
git commit -m "feat: regenerate transparent hero wordmark from new artwork"
```

---

### Task 3: Update the hero image dimensions

**Files:**

- Modify: `src/components/sections/Hero.tsx` (the `<Image>` `width`/`height` props)

**Interfaces:**

- Consumes: the regenerated `imperium-wordmark.png` pixel dimensions from Task 2 Step 4.
- Produces: a hero that renders the new wordmark at its true aspect ratio (no squish).

Context — current markup in `src/components/sections/Hero.tsx`:

```tsx
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
```

- [ ] **Step 1: Set width/height to the regenerated dimensions**

Replace `width={756}` and `height={143}` with the exact `pixelWidth`/`pixelHeight` recorded in Task 2 Step 4. Example (substitute the real numbers):

```tsx
width = { NEW_WIDTH };
height = { NEW_HEIGHT };
```

These props set the intrinsic aspect ratio for `next/image`; the on-screen size is governed by `styles.logoImage` in `Hero.module.css` (leave that CSS unchanged).

- [ ] **Step 2: Typecheck**

Run:

```bash
npm run typecheck
```

Expected: clean (no errors).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "fix: match hero image dimensions to new wordmark"
```

---

### Task 4: Verify end-to-end and run quality gates

**Files:** none modified (verification only).

**Interfaces:**

- Consumes: all prior tasks.
- Produces: evidence the hero renders correctly and gates are green.

- [ ] **Step 1: Start the dev server and open the homepage**

Use the browser preview tooling (create/find `.claude/launch.json` for `npm run dev` if needed) and load `http://localhost:3000/`. Do NOT use Bash to run the dev server.

- [ ] **Step 2: Check the console for errors**

Read console messages / preview logs. Expected: no image 404 for `/images/logo/imperium-wordmark.png`, no `next/image` warnings, no runtime errors.

- [ ] **Step 3: Screenshot the hero and inspect**

Take a hero screenshot. Confirm against the spec's acceptance criteria:

- No cream box or halo around the wordmark — it sits directly on the silk backdrop.
- Brown "IMPERIUM" clean-edged; gold "ITALIAN TEXTILE" + rules intact.
- Correct aspect ratio (not stretched/squished) and sensible size.
- No layout shift on load.

If any check fails, return to Task 2 (halo/gold → threshold) or Task 3 (squish → dimensions).

- [ ] **Step 4: Run the full quality gates**

Run:

```bash
npm run test && npm run typecheck && npm run build
```

Expected: tests pass (baseline 61/61 or current count), typecheck clean, build succeeds.

- [ ] **Step 5: Final review**

Confirm `git status` shows only the intended files changed (logo assets, the derive script, `Hero.tsx`, and the plan/spec docs). `src/lib/site.ts` should be unchanged.

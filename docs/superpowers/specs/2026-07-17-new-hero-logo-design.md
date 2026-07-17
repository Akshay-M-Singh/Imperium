# Spec — New Hero Logo (2026-07-17)

## Goal

Replace the live hero wordmark with the client's newly delivered logo artwork
(`public/images/logo/New Logo.png`, 2084×2084, opaque), served as a clean
transparent PNG over the interactive silk hero backdrop — matching how the logo
is rendered today.

## Scope

**In scope:** the Hero section logo only (`src/components/sections/Hero.tsx`,
which renders `SITE.logoSrc`).

**Out of scope (unchanged):** favicon, `apple-touch-icon.png`, PWA/social/OG
icons, the top-nav text wordmark, and the footer text wordmark. Confirmed with
the user 2026-07-17.

## Current state (verified 2026-07-17)

- `scripts/derive-brand-assets.mjs` is the existing brand-asset pipeline. It
  reads an opaque source PNG (`public/images/logo/Logo.png`), keys out the
  near-white plate with a min-channel alpha ramp (`WHITE=246`, `BLACK=140`),
  auto-crops to the artwork bounding box (`MARGIN=12`, keyed on alpha > 8), and
  writes the transparent `public/images/logo/imperium-wordmark.png`.
- `src/lib/site.ts` → `SITE.logoSrc = "/images/logo/imperium-wordmark.png"`.
- `src/components/sections/Hero.tsx` renders that image inside the `<h1>` via
  `next/image` with **hardcoded `width={756} height={143}`** (the current
  derived wordmark's dimensions), `priority`, `className={styles.logoImage}`.
- Nav (`Navigation.tsx`) and Footer (`Footer.tsx`) render `SITE.name` as text —
  no logo image. Favicons are independent files under `public/`.

## Key finding — cream background, not white

The new artwork is **not** on the same background as the old source:

| Region                      | Sampled RGB       | Notes                                   |
| --------------------------- | ----------------- | --------------------------------------- |
| Outer margin (5,5)          | `[244, 239, 235]` | cream (Pietra-ish), min channel **235** |
| Inner plate behind wordmark | `[248, 248, 246]` | near-white, min channel **246**         |

With the current `WHITE=246`, the plate keys out cleanly but the **cream outer
margin does not** — its min channel 235 yields alpha ≈ 17 (`(246-235)/(246-140)`),
i.e. a faint cream ghost across the whole canvas. Because auto-crop keys on
alpha > 8, that ghost also **defeats the crop** (bounding box expands to the
full 2084² canvas). So the new artwork requires a threshold tune, not a
drop-in re-run.

## Approach

Reuse the existing derivation pipeline with a tuned threshold.

1. **Canonical source.** Rename the new artwork to replace the pipeline's
   canonical source: `public/images/logo/New Logo.png` → `public/images/logo/Logo.png`
   (space-free, matches the script's existing `SRC`). The previous `Logo.png`
   remains recoverable via git history. No script `SRC` edit needed.
   - Also remove the stray `public/images/logo/.DS_Store` if present (should not
     be tracked; `.gitignore` already covers it).

2. **Tune the white-key.** Raise `WHITE` in `derive-brand-assets.mjs` to a value
   that keys out **both** the cream outer margin (min 235) and the plate
   (min 246) fully, while preserving the light-gold "ITALIAN TEXTILE" text and
   its flanking rules. Start at `WHITE=237` and verify empirically; the gold is
   the sensitive element — confirm it is not eroded. Update the script's header
   comment to reflect the new source's cream background and the tuned value.

3. **Regenerate.** Run `node scripts/derive-brand-assets.mjs`. Confirm:
   - the output crops tightly to the artwork (dimensions well under 2084²,
     aspect ratio roughly matching the horizontal lockup), and
   - no cream/white halo remains around the artwork.

4. **Update Hero dimensions.** Read the regenerated
   `imperium-wordmark.png`'s actual pixel dimensions and update the hardcoded
   `width`/`height` in `Hero.tsx` to match, so `next/image` preserves the
   aspect ratio (no squish). If the new crop's aspect ratio differs materially
   from the old 756×143 (~5.3:1), sanity-check the rendered hero size still
   looks right against `Hero.module.css` `.logoImage` constraints.

5. **Verify** (localhost, browser tools):
   - Dev server up; hero screenshot over the silk backdrop.
   - No cream halo/box; gold "ITALIAN TEXTILE" and rules intact and crisp;
     brown "IMPERIUM" clean-edged.
   - No console errors; no layout shift.
   - `npm run test`, `npm run typecheck`, `npm run build` all green.

## Files touched

- `public/images/logo/Logo.png` (replaced with new artwork)
- `scripts/derive-brand-assets.mjs` (threshold + comment)
- `public/images/logo/imperium-wordmark.png` (regenerated output)
- `src/components/sections/Hero.tsx` (image `width`/`height`)

`src/lib/site.ts` is **unchanged** — `logoSrc` already points at the
regenerated filename.

## Risks / notes

- **Gold erosion:** raising `WHITE` too far could thin the light-gold subtitle
  and rules. This is the one tuning judgment call; verify visually before
  committing, and keep `WHITE` as low as possible while still clearing the cream.
- **New == old artwork?** The new lockup is visually near-identical to the live
  one. That is expected; the deliverable is honoring the client's new file, not
  a visual redesign. If, after derivation, the result is byte-for-byte
  indistinguishable from the current wordmark, note it but proceed — the client
  asked for the new source to be adopted.
- No external/asset gates; entirely localhost-verifiable.

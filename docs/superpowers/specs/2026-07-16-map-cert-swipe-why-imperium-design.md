# Homepage Polish Round: Map Swap · Mobile Swipe Fix · Diploma Redaction · Why Imperium Refinements — Design

**Date:** 2026-07-16
**Status:** Approved by user (brainstorming session, 2026-07-16)
**Branch (execution):** `fix/map-cert-swipe-why-imperium`
**Plan:** `docs/superpowers/plans/2026-07-16-map-cert-swipe-why-imperium.md`

Four small, independent homepage changes requested by the user on 2026-07-16, executed together on one branch (matching the repo's bundled-fixes convention, e.g. `fix/contact-channels-hero-nav`).

All four user decisions below were confirmed explicitly in the brainstorming session — none are team assumptions.

---

## 1. Map swap (Why Imperium row 01)

**Current state:** `src/components/sections/WhyImperium.tsx` renders `/images/map/italy-gulf-routes.png` (1536×1024) in the row-01 media slot. The client delivered a replacement at `public/images/map/new map.png` (untracked, 1536×1024 PNG, **transparent background**, parchment-gold Italy→UAE/Gulf route artwork with "ITALY" and "UAE / GULF" labels).

**Change:**

- Rename/copy `public/images/map/new map.png` → `public/images/map/italy-gulf-routes-v2.png` (no spaces in served filenames; the new name also guarantees no stale browser/CDN copy of the old artwork is ever served).
- Update the single `src` reference in `WhyImperium.tsx` (line ~32). `width={1536} height={1024}` props are already correct for the new file; alt text (`mapAlt`, both locales) still accurately describes an Italy→UAE/Gulf route map — unchanged.
- Delete `public/images/map/italy-gulf-routes.png` and the space-named `new map.png` original. (Old file recoverable via git history.)

**Verification:** dev preview at mobile and desktop widths — the transparent-background artwork must read well on the Gesso (`#FFFFFF`) section band. No test references the old path (verified by grep: only `WhyImperium.tsx` carries it).

---

## 2. Collections mobile swipe reliability

**Symptom (user report):** on mobile, swiping the Collections row is unreliable — starting a swipe (especially press-and-hold) **on a card** often fails; swiping on the gaps/padding outside the card works.

**Current state:** below 1024px (and under reduced motion) the Collections track is a native CSS scroll row: `overflow-x: auto; scroll-snap-type: x mandatory` (`Collections.module.css`). Each panel wraps a `FabricCard` in a `TiltCard` (`src/components/motion/TiltCard.tsx`) that attaches `onTouchStart`/`onTouchEnd` handlers driving a Framer Motion press-scale (1 → 0.98) spring on the touched element.

**Diagnosis hypotheses, in test order (execution session uses superpowers:systematic-debugging):**

1. **iOS long-press image gesture.** Holding on the card's photo triggers Safari's image callout/preview gesture, which cancels the scroll pan. Fits the "hold on a card" symptom exactly. Fix: `-webkit-touch-callout: none` + `user-select: none` (and `-webkit-user-select: none`) on card media inside the track.
2. **TiltCard press-scale transform mid-gesture.** Animating a transform on the element being touched can cancel scroll gestures in iOS Safari. The press effect is purely decorative. Fix: remove/no-op the touch handlers (keep mouse hover behavior; desktop pointer interactions unchanged).
3. **`scroll-snap-type: x mandatory` snap-back.** Short swipes snap back to the same card and feel dead. Fix if still needed after 1–2: relax to `x proximity`.

**Fallback (user-sanctioned):** if after fixes 1–3 the swipe still isn't reliably fluid on a real device, replace the sub-1024px horizontal snap row with **vertically stacked cards** (normal page flow). The ≥1024px pinned scroll-driven showcase is untouched in every scenario.

**Verification:** touch-emulated check in the dev preview, plus a **user checkpoint on a real phone** before the branch is finalized (touch emulation cannot fully reproduce iOS gesture arbitration). Tap targets (CTA `TextLink`s) must still activate; RTL `/ar` row must still swipe correctly.

---

## 3. Diploma redaction (seamless, in the asset itself)

**Current state:** `public/images/certifications/made-in-italy-certification.png` (2502×1770) is Sofia's real diploma and contains the line **"Nata a Seriate il 06/07/2001"** (birthplace + DOB) centered below her name. The file is served publicly and committed to the public GitHub repo.

**User decisions:**

- **Seamless removal** — the line disappears as if never printed; every other pixel of the diploma stays visually identical. A CSS overlay is explicitly ruled out (the PNG itself is publicly fetchable).
- **Git history exposure is out of scope** — flagged as a separate follow-up (history rewrite via `git-filter-repo`/BFG needs Akshay's coordination and a force push). This plan only fixes the served file going forward.

**Technique (measured in this session against the actual file):**

- The DOB line sits fully inside **rect x 900–1620, y 1278–1353** (text spans ~x 980–1530, y ~1290–1340; the rect adds safety margin on all sides).
- The band directly above, **x 900–1620, y 1243–1285**, is clean smooth grey-gradient background ("Sofia Mazza" has no descenders — verified visually with extracted crops).
- A new deterministic script `scripts/redact-certification.mjs` (sharp; same offline-asset pattern as `scripts/derive-brand-assets.mjs` and `scripts/render-silk-still.mjs`) extracts the clean donor strip, resizes it vertically to the rect height, and composites it over the rect. On a smooth gradient this stretch is invisible; PNG output stays lossless.
- Exact coordinates are re-confirmed in execution with before/after zoomed crops (the numbers above are the starting point, verified once already).

**Filename change:** output is written as `public/images/certifications/made-in-italy-diploma.png`, and the old file is deleted, so the old URL (with the PII) stops resolving on deploy rather than being silently replaced behind caches. Update `certification.src` in `src/data/founder.ts` (both `en` and `ar`). `Founder.test.tsx` asserts captions/testids, not the path — unaffected.

**Verification:** zoomed before/after crops of the patched region and of untouched reference regions (must be visually identical); full-diploma screenshot; grep confirms no remaining reference to the old filename.

**Standing note (CLAUDE.md Addendum 2):** the scan was integrated as-is by user decision; Sofia's explicit OK was recommended for the visible DOB. This change now removes the DOB/birthplace — the remaining visible personal data is her name and the issue date, both intentional.

---

## 4. Why Imperium refinements

### 4a. Gold underline on row headings

The three `h3` row headings ("Direct From the Source", "Made in Italy Expertise", "For the Gulf's Luxury Market") get a fine gold underline via `WhyImperium.module.css` `.heading`:

- `text-decoration-line: underline`
- `text-decoration-color: var(--color-oro-antico)`
- `text-decoration-thickness: 1px`
- `text-underline-offset:` a generous value tuned visually (~0.3em starting point)
- `text-decoration-skip-ink: auto` (default — keeps serif descenders clean)

Applies to both locales automatically (same class; AR headings render RTL with the same rule). Section headline and eyebrow unchanged — only the three row headings.

### 4b. New sentence under row 01 ("Direct From the Source")

One sentence appended to the **end of the second paragraph** of item 01 in `src/data/pillars.ts` — appending inside the existing paragraph keeps the paragraph count identical, so the `locale-parity` shape test passes without touching its expectations.

- **Constraint (user decision):** competitive framing, **no explicit mention of price/pricing** — preserves the site-wide no-prices luxury positioning.
- **EN draft (tuned in execution, flagged for Sofia's sign-off):** "And with no one in between, that provenance comes with an edge — sourcing direct keeps us genuinely competitive."
- **AR:** matching machine-draft MSA sentence appended to the same paragraph in the `ar` data, plus a new row in `docs/superpowers/specs/2026-07-14-ar-copy-review-sheet.md` §Why Imperium — the §10-item-6 native-review gate applies, consistent with all AR copy.

**Tests:** `pillars.test.ts` asserts headings, media slots, and item counts — all unchanged. `locale-parity.test.ts` asserts structural shape — unchanged (same paragraph counts). No new test strictly required; optionally extend `pillars.test.ts` to pin the competitive sentence's presence without the word "price" (cheap regression guard for the no-price constraint).

---

## Cross-cutting

- **Branch:** `fix/map-cert-swipe-why-imperium` off current `main`.
- **Quality gates:** `npm run test`, `typecheck`, `lint`, `build` — all green before finishing; browser verification per section above.
- **Docs:** CLAUDE.md addendum (number 8) + `progress.md` note recording the four changes, matching the repo's established rhythm.
- **Follow-up (out of scope, must be surfaced at completion):** git-history rewrite to purge the unredacted diploma from the public repo's history — needs Akshay's cooperation (force push, re-clones, Vercel deploy continuity).

## Out of scope

- Any other visual change to the diploma (explicit user constraint).
- Desktop Collections behavior (pinned showcase untouched).
- Copy changes beyond the single row-01 sentence.
- Git history rewrite (follow-up task).

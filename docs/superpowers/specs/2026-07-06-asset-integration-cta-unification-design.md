# Design: Real Asset Integration + CTA Unification

**Date:** 2026-07-06 · **Status:** Approved by the user (this session) · **Implementation plan:** `docs/superpowers/plans/2026-07-06-asset-integration-cta-unification.md`

## Context

The client delivered the first batch of real brand assets, dropped into `public/images/` on 2026-07-06, replacing the SVG placeholders (which were deleted). Two code edits were made by hand alongside them (`founder.ts` portrait src — correct; `WhyImperium.tsx` map img — broken, references `.svg` for a `.png` file). **The working tree is currently broken:** `collections.ts` still points at the four deleted fabric SVGs, and the map reference 404s.

### Assets as delivered (verified on disk)

| Asset         | Delivered path                                   | Dimensions        | Notes                                                                                                                                           |
| ------------- | ------------------------------------------------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Logo          | `logo/Logo.png`                                  | 1000×1000         | **Fully opaque** (pixel-probed: pure-white canvas, #F7F8F7 plate behind brown wordmark, A=255 everywhere); artwork band occupies ~16% of canvas |
| Portrait      | `about/sofia-portrait.png`                       | 1086×1448         | 3:4 ✓ matches slot; already wired by hand                                                                                                       |
| Certification | `certifications/made in italy certification.png` | 2502×1770         | Real diploma (Fondazione Italia USA). Shows Sofia's **date and place of birth** and "Roma, 28 aprile 2026"                                      |
| Map           | `map/italy-gulf-routes.png`                      | 1536×1024         | Parchment/gold Italy→Gulf route artwork, 3:2                                                                                                    |
| Stamp         | `stamp/made in italy stamp.png`                  | 462×432           | Certification-body badge; opaque background is pure #FFFFFF (probed) — blends into the Gesso band                                               |
| Fabric ×4     | `fabrics/*.png`                                  | 228×279 – 380×560 | All **below** the ~800×1000 the 4:5 retina slot wants; worst is interior-exterior at 228×279                                                    |

Two filenames contain spaces, one contains `&`; the repo's own test regex (`/^\/images\/(fabrics|collections)\/[a-z-]+\.(svg|png)$/`) rejects them.

## Decisions (user, 2026-07-06)

1. **CTA scope:** every collection CTA becomes `{ label: "Contact Us Now", href: "#contact" }` — all four homepage cards (three currently "View Collection" → `/fabrics#…`, one "Contact Us"). The hero keeps its "Explore our fabrics" + "Request a sample" pair.
2. **`/fabrics` page: removed.** With no card linking to it, the route is deleted rather than left orphaned. Recoverable via git if the V2 filterable library revives the concept.
3. **Logo: derive web versions.** Script the white-knockout + crop from the opaque source rather than waiting on a client re-export.
4. **Certification: integrate as-is.** DOB/birthplace and the "aprile 2026" date stay visible — user's recorded call, accepted with the recommendation that Sofia gives an explicit OK (it publishes her personal data; the site otherwise has a hard no-2026 rule).

## Design

### 1. Asset normalization

Kebab-case renames (URL hygiene + test regex):

- `fabrics/tessuti italiani.png` → `fabrics/tessuti-italiani.png`
- `fabrics/interior-&-exterior design.png` → `fabrics/interior-exterior.png` (matches collection id)
- `certifications/made in italy certification.png` → `certifications/made-in-italy-certification.png`
- `stamp/made in italy stamp.png` → `stamp/made-in-italy-stamp.png`
- `logo/Logo.png` stays untouched as the client source; `ospitalita-di-lusso.png`, `pezzi-unici.png`, `about/sofia-portrait.png` already correct.

New `scripts/derive-brand-assets.mjs` (sharp — already a dependency; sits beside `subset-fonts.sh`): reads `Logo.png`, applies a luminance-keyed alpha ramp (white point ≈ 246 to clear the #F7F8F7 plate, black point ≈ 140), trims to the artwork bounding box plus small padding, writes `public/images/logo/imperium-wordmark.png` (transparent, cropped, brown preserved), and prints the output dimensions. Committed for re-runs when the client sends updated artwork.

### 2. Hero logo

`SITE.logoSrc` → `"/images/logo/imperium-wordmark.png"` (the path the code comment already stages). The existing `brightness(0) invert(1)` filter in `Hero.module.css` then renders the transparent brown wordmark pure white over the dark video — correct once the background is knocked out, and only then. `Image` `width`/`height` in `Hero.tsx` and the `.logoImage` size clamp update to the real cropped ratio (~4.5:1 wide, not 500×500). Fallback if visual inspection shows edge fringing: revert `logoSrc` to `null` (typographic wordmark) and park the asset.

### 3. Collections — photos + unified CTA

In `src/data/collections.ts`, for all four entries:

- `image.src` → renamed `.png` paths (fixes the broken references).
- `cta` → `{ label: "Contact Us Now", href: "#contact" }`.
- Alt text rewritten to match the actual photos (verified by viewing each):
  - tessuti-italiani: draped rose-gold Italian jacquard with fringed selvedge and a black "Made in Italy" label
  - pezzi-unici: gold and midnight-blue floral brocade with a "Limited Edition 01/50" card
  - ospitalita-di-lusso: tailored taupe and black jackets on Imperium-branded wooden hangers
  - interior-exterior: layered neutral textiles in cream and taupe with an olive branch (the old "canvas stripe" alt is wrong)

No type changes — `CollectionCard` already fits. **Known, accepted:** all four photos are lower-resolution than ideal and will render soft on retina; client follow-up requests higher-res exports (≥ 800×1000). Not a blocker — better than broken references.

### 4. `/fabrics` removal

- Delete `src/app/fabrics/` (page + `fabrics.module.css`).
- Remove `fabrics` from `seo.ts`, from the `PageKey` union in `src/lib/metadata.ts` (which types `SeoData`), and from `ROUTES` in `src/lib/constants.ts` (defined, never consumed).
- `sitemap.ts` already lists only `/` — no change. Final grep sweep: zero `/fabrics` references remain in `src/` or `tests/`.

### 5. WhyImperium — map + stamp

- Map: finish the hand edit properly — correct `.png` path, `next/image` + CSS-module classes instead of raw `<img>` + inline style (codebase convention). Remove placeholder chrome (4:3 aspect, border, Pietra fill, caption) so the 3:2 parchment artwork sits directly on the white band.
- Stamp: replace the placeholder circle with the real stamp at ~200px, centered in the existing `stampSlot`. Its pure-white background blends invisibly into the Gesso band (pixel-verified).
- `data-testid`s rename `map-placeholder`/`stamp-placeholder` → `map-media`/`stamp-media`.
- Note recorded: the stamp is the certification body's trademark artwork; usage rides on Sofia's credential — worth her one-line confirmation.

### 6. Founder — certification

- `founder.certification.src` → `"/images/certifications/made-in-italy-certification.png"`; the existing conditional in `Founder.tsx` switches from placeholder to real image automatically.
- `.certImageWrap` aspect changes from 3:2 to the scan's real ratio (2502/1770 ≈ 1.414) so the diploma border isn't crop-chopped; `object-fit: cover` then crops nothing.

### 7. Tests, docs, verification

- Update: `collections.test.ts` (all four CTAs → Contact Us Now/#contact; drop the fabrics-page routing test), `WhyImperium.test.tsx` (assert real media by testid/alt, not placeholders), `Founder.test.tsx` (cert image renders; placeholder absent), `FabricCard.test.tsx` (fixture label). `Hero.test.tsx` + `site.test.ts` already branch on `logoSrc` — no edits expected.
- Docs: tick `progress.md` backlog items (portrait, fabric photography w/ low-res caveat, certification scan, logo); short CLAUDE.md amendment (assets landed, `/fabrics` removed, CTA unified).
- Verify: `npm run test`, `typecheck`, `build`, `lint`; script-check that every `image.src` in data files exists on disk; dev-server visual pass over hero logo, map, stamp, certification, four cards.

## Out of scope

Hero video, favicons (wide wordmark makes a bad favicon — wait for a monogram), WhatsApp number, `/about` + `/contact` stubs, image re-compression, EN/AR decision.

## Client follow-ups (recorded, not blocking)

1. Higher-res fabric photos (≥ 800×1000px each).
2. Transparent-background (or vector) logo original.
3. Sofia's explicit OK on publishing the certification scan as-is (DOB + birthplace + "aprile 2026" visible).
4. Confirmation she may display the certification body's stamp artwork.

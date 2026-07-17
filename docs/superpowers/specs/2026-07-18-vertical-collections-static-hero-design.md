# Design — Vertical Collections (mobile) + Static Hero Background

**Date:** 2026-07-18
**Status:** Approved, ready for implementation plan
**Scope:** Two independent, low-risk changes to the Imperium homepage.

---

## Change 1 — Collections: vertical scroll on mobile, desktop untouched

### Problem

The Collections ("fabrics") section scrolls **horizontally** below the desktop
breakpoint: `.track` is a horizontal `scroll-snap-type: x mandatory` swipe row.
On touch devices this does not feel smooth. The client wants natural **vertical**
scrolling on mobile. The desktop experience (the ≥1024px scroll-driven pinned
horizontal showcase) must **not** change.

### Approach — width-scoped CSS override

The change is almost entirely CSS, scoped by viewport width so it physically
cannot reach desktop.

- **Leave untouched:** every `@media (min-width: 1024px)` rule in
  `src/components/sections/Collections.module.css`, including both the
  motion-pinned horizontal showcase and the `prefers-reduced-motion` horizontal
  swipe fallback at that width.
- **Add** a `@media (max-width: 1023px)` block that overrides `.track`:
  - `flex-direction: column`.
  - Remove horizontal-scroll behaviour: `overflow-x`, `scroll-snap-type: x`,
    `-webkit-overflow-scrolling`, and the hidden-scrollbar rules no longer apply
    in this branch.
  - `.panel` becomes a stacked block: `inline-size: 100%`, drop the fixed
    `min(76vw, 340px)` / `min(44vw, 400px)` widths, `flex: 0 0 auto`, and
    `scroll-snap-align`. Add a `max-inline-size` (readable cap, e.g. ~420–480px)
    with centered `margin-inline: auto` so cards don't stretch awkwardly on
    tablet.
  - Vertical `gap` between stacked cards; the **page** scrolls naturally — the
    track is no longer an internal scroll container and there is no snap.

### Breakpoint interpretation

"Mobile" = **everything below the desktop pin breakpoint (< 1024px)** — phones
**and** tablets — because the tablet swipe row (`768–1023px`) has the same
touch-smoothness problem. Desktop (≥ 1024px) is fully preserved.

### Card internals

No card-internal changes needed. Collections passes `layout="spread"`, but the
`spread` side-by-side (image-beside-text) styling only activates at
`@media (min-width: 1024px)` in `FabricCard.module.css`. Below 1024px each card
already renders image-above-text, which is the correct vertical-stack form.

### Optional JS polish (`Collections.tsx`)

The non-pinned track currently always gets `tabIndex={0}` and
`role="group"` because it _was_ a horizontal scroll region. On mobile it is no
longer scrollable, so `tabIndex` can be dropped there while keeping it for the
desktop reduced-motion horizontal-swipe case (`isDesktop && reducedMotion`).
This is tidiness only — the CSS change alone is functionally sufficient. Treat
as a nice-to-have, not a blocker.

---

## Change 2 — Hero: static silk background, animation removed

### Problem

The hero backdrop runs an interactive WebGL silk canvas (cursor-driven vertex
displacement + lighting sheen) layered on top of a static silk still. The client
wants the animation **gone** but the background image itself **unchanged**.

### Key fact

`SilkFabricBackground.tsx` already renders the static still —
`SILK_FABRIC_CONFIG.texture.posterSrc` (`/images/hero/silk/silk-3840.jpg`) — as
a plain `<img>` (no optimizer, `fetchPriority="high"`, LCP image). The WebGL
canvas is layered _on top_ only when gating conditions pass. So "static, same
background" means: **stop mounting the canvas, keep the poster.**

### Approach — simplify `SilkFabricBackground.tsx` to poster-only

- Render only the poster `<img>` — same `posterSrc`, same plain-`<img>` (never
  through `next/image` or any optimizer, per the standing client brief hard
  rule), same `fetchPriority="high"` / `alt=""` / `aria-hidden`. The visible
  image is byte-identical to today's at-rest hero.
- Remove the WebGL gating machinery that only existed to run the animation: the
  dynamic `SilkFabricCanvas` import, `useIntersectionObserver`, `useMediaQuery`,
  `useReducedMotion`, `isSlowConnection`, `getWebglCapability`, the
  visibility/`documentHidden`/`contextLost`/`canvasReady`/`mounted` state, and
  the `shouldAttemptLive`/`active` logic.
- Keep the `data-testid="silk-fabric-background"` wrapper so `Hero.test.tsx`
  stays green.
- Trim the now-unused CSS classes (`canvasReady` / `canvasHidden`) from
  `SilkFabricBackground.module.css`.
- `Hero.tsx` is **unchanged** — it still renders `<SilkFabricBackground />`
  inside `.backdrop`.

### Orphaned files

`SilkFabricCanvas`, `SilkFabricPlane`, `SilkFabricMaterial`, `coverUv`,
`chooseTextureTier`, `diagnostics`, and the shaders become un-imported. **Leave
them in place, un-imported** (recoverable via git), matching the repo's existing
convention for the retired `SilkHero` module. Note them for an optional later
cleanup pass; do not delete in this change.

`fabric.config.ts` stays (still provides `posterSrc`).

---

## Testing & verification

Both changes are independent (separate concerns; could be separate commits).

- `Collections.test.tsx` runs in jsdom with reduced-motion + narrow viewport (the
  static branch); it asserts headers, four cards, contact links, and Arabic
  strings — none depend on scroll axis, so CSS changes keep it green.
- `Hero.test.tsx` asserts the `silk-fabric-background` testid + poster `alt=""`
  (still present) and that the retired `silk-hero` testid is **absent** (still
  absent). No test asserts the canvas mounts, so removing it is safe.
- Gates: `npm run test` / `typecheck` / `lint` / `build` all green.
- Browser check: hero shows the same silk still with **no** cursor-driven
  deformation; mobile/tablet Collections scrolls vertically and naturally;
  desktop Collections behaves exactly as before.

## Out of scope

- No change to the hero still image, its resolution, or the `posterSrc` value.
- No change to desktop Collections behaviour.
- No deletion of the retired silk WebGL files (left recoverable).
- No copy, data, or Arabic-string changes.

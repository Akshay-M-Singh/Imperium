# Vertical Collections (mobile) + Static Hero Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Collections ("fabrics") section scroll vertically and naturally on mobile/tablet (desktop unchanged), and make the Hero background a static silk still with the WebGL animation removed.

**Architecture:** Two independent changes. (1) Collections: a width-scoped `@media (max-width: 1023px)` CSS override turns the horizontal swipe row into a vertical stack, plus a one-line JSX refinement so the mobile stack is no longer marked as a focusable scroll region; every `≥1024px` rule is left untouched. (2) Hero: `SilkFabricBackground.tsx` is simplified to render only its existing static poster `<img>`, dropping the dynamic WebGL canvas and all the gating hooks that existed solely to run the animation.

**Tech Stack:** Next.js 15 (App Router, `src/`), React 19, TypeScript strict, CSS Modules, Framer Motion, Vitest + Testing Library, ESLint 9.

## Global Constraints

- The silk hero textures in `public/images/hero/silk/` must **never** pass through `next/image` or any optimizer — always a plain `<img>` (standing client brief hard rule).
- Do **not** change desktop Collections behaviour (≥ 1024px). "Mobile" = every viewport `< 1024px` (phones and tablets).
- Do **not** change the hero still image, its resolution, or the `posterSrc` value (`/images/hero/silk/silk-3840.jpg`).
- Do **not** delete the retired silk WebGL files — leave them un-imported and recoverable via git (matches the repo's existing convention for `src/components/silk/SilkHero.tsx`).
- No copy, data, or Arabic-string changes.
- Conventional Commits; commit messages end with the repo's `Co-Authored-By` trailer if one is in use — follow existing `git log` style.
- Verification gate commands: `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`.

---

### Task 1: Collections — vertical stack on mobile/tablet, desktop untouched

**Files:**

- Modify: `src/components/sections/Collections.tsx` (the `tabIndex` prop on the track `motion.div`)
- Modify: `src/components/sections/Collections.module.css` (add a `@media (max-width: 1023px)` block)
- Test: `tests/unit/components/sections/Collections.test.tsx`

**Interfaces:**

- Consumes: nothing new. Uses the existing `isDesktop` (`useMediaQuery("(min-width: 1024px)")`) and `reducedMotion` (`useReducedMotion()`) values already computed in the component.
- Produces: no new exports. Behavioural contract: below 1024px the track is a non-scrolling vertical column and is **not** a focusable region (`tabIndex` absent); the desktop reduced-motion horizontal-swipe branch keeps `tabIndex={0}`.

**Background for the implementer:** `Collections.tsx` currently sets `tabIndex={pinned ? undefined : 0}` on the track, where `pinned = isDesktop && !reducedMotion`. That made every non-pinned track a focusable horizontal scroll region. After this task the mobile branch is a normal vertical stack (the page scrolls, not the track), so only the desktop reduced-motion horizontal-swipe case should stay focusable. The `Collections.test.tsx` suite mocks `matchMedia` so that `prefers-reduced-motion: reduce` matches and `min-width: 1024px` does **not** — i.e. `isDesktop === false`, `reducedMotion === true`. That is the mobile branch, so the track must have no `tabIndex`.

- [ ] **Step 1: Write the failing test**

Add this test inside the `describe("Collections", …)` block in `tests/unit/components/sections/Collections.test.tsx` (after the existing `"routes every collection card…"` test):

```tsx
it("does not mark the mobile stack as a focusable scroll region", () => {
  render(<Collections />);
  // matchMedia mock => reduced-motion on, not desktop => the mobile
  // vertical-stack branch. The stack is not an internal scroll
  // container, so the track must not be tab-focusable.
  const track = screen.getByRole("group");
  expect(track).not.toHaveAttribute("tabindex");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- Collections`
Expected: FAIL — the new test errors because the track currently renders `tabindex="0"` in the mobile branch (`pinned` is `false`, so `tabIndex={0}`).

- [ ] **Step 3: Refine the `tabIndex` logic in `Collections.tsx`**

Find this line on the track `motion.div`:

```tsx
tabIndex={pinned ? undefined : 0}
```

Replace it with:

```tsx
tabIndex={isDesktop && reducedMotion ? 0 : undefined}
```

Leave every other prop on that element (`ref`, `className`, `style`, `role`, `aria-label`) unchanged.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- Collections`
Expected: PASS — all Collections tests green, including the new one.

- [ ] **Step 5: Add the mobile vertical-stack CSS**

In `src/components/sections/Collections.module.css`, insert this block **immediately before** the first `@media (min-width: 1024px)` block (so it comes after the base `.track`/`.panel` rules and after the `@media (min-width: 768px)` block, winning for all widths below 1024px; it is disjoint from the ≥1024px blocks, which are left untouched):

```css
/* Mobile & tablet (< desktop pin breakpoint): natural vertical stack.
   The horizontal swipe row felt unsmooth on touch — cards now stack and
   the page scrolls normally. Desktop (>= 1024px) is unaffected: those
   rules live in the min-width blocks below and never match here. */
@media (max-width: 1023px) {
  .track {
    flex-direction: column;
    overflow-x: visible;
    scroll-snap-type: none;
    gap: var(--space-xl);
  }

  .panel {
    flex: none;
    inline-size: 100%;
    max-inline-size: 460px;
    margin-inline: auto;
    scroll-snap-align: none;
  }
}
```

- [ ] **Step 6: Verify the full unit suite still passes**

Run: `npm run test`
Expected: PASS — full suite green (61+ tests). CSS changes don't affect jsdom assertions; this confirms nothing regressed.

- [ ] **Step 7: Browser verification (mobile + desktop)**

Start the dev server and check both breakpoints:

1. `preview_start` with the project's dev config (create/confirm `.claude/launch.json` runs `npm run dev`), then navigate to the homepage `#collections` section.
2. `resize_window` to `mobile` (375×812): confirm the four fabric cards are stacked **vertically**, each roughly full-width (capped ~460px, centered), and the section scrolls with the page — no sideways swipe row, no horizontal scrollbar.
3. `resize_window` to `desktop` (1280×800): confirm the Collections section still pins and scrolls **horizontally** exactly as before (the gold progress bar at the bottom still advances).
4. `read_console_messages` (onlyErrors): expect none related to this section.
5. `computer` screenshot at mobile width as proof.

- [ ] **Step 8: Commit**

```bash
git add src/components/sections/Collections.tsx \
        src/components/sections/Collections.module.css \
        tests/unit/components/sections/Collections.test.tsx
git commit -m "feat: stack collections vertically on mobile, keep desktop showcase"
```

---

### Task 2: Hero — static silk background (WebGL animation removed)

**Files:**

- Modify: `src/components/silk/fabric/SilkFabricBackground.tsx` (simplify to poster-only)
- Modify: `src/components/silk/fabric/SilkFabricBackground.module.css` (drop unused `canvasReady`/`canvasHidden` classes)
- Test: `tests/unit/components/silk/SilkFabricBackground.test.tsx` (new file)
- Untouched but relevant: `src/components/sections/Hero.tsx` (still renders `<SilkFabricBackground />`), `tests/unit/components/sections/Hero.test.tsx` (must stay green)

**Interfaces:**

- Consumes: `SILK_FABRIC_CONFIG.texture.posterSrc` from `./fabric.config` (unchanged) = `/images/hero/silk/silk-3840.jpg`.
- Produces: `SilkFabricBackground` — a React component (same name, same default + named export) that renders a `<div data-testid="silk-fabric-background">` containing exactly one plain `<img>` (the poster) and no `<canvas>` and no dynamic canvas import.

**Background for the implementer:** `SilkFabricBackground.tsx` already renders the static poster `<img>` as the base layer and mounts a WebGL `SilkFabricCanvas` on top only when a chain of gating conditions passes. Making the hero static means keeping the poster and removing the canvas + all gating. Note: in jsdom the WebGL path is already inert (no WebGL2 context), so a "renders no canvas" test is a **regression guard** documenting intent rather than a strict red→green cycle — that is expected and fine here; the real removal is enforced by `npm run lint` (no unused imports/vars) and the browser check. The retired canvas/plane/material/shader files stay on disk, un-imported and recoverable via git — do **not** delete them.

- [ ] **Step 1: Write the guard test (new file)**

Create `tests/unit/components/silk/SilkFabricBackground.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SilkFabricBackground } from "@/components/silk/fabric/SilkFabricBackground";

describe("SilkFabricBackground (static)", () => {
  it("renders only the static silk poster image", () => {
    const { getByTestId } = render(<SilkFabricBackground />);
    const wrap = getByTestId("silk-fabric-background");
    const imgs = wrap.querySelectorAll("img");
    expect(imgs).toHaveLength(1);
    expect(imgs[0]).toHaveAttribute("src", "/images/hero/silk/silk-3840.jpg");
    expect(imgs[0]).toHaveAttribute("alt", "");
  });

  it("does not mount a WebGL canvas", () => {
    const { getByTestId } = render(<SilkFabricBackground />);
    const wrap = getByTestId("silk-fabric-background");
    expect(wrap.querySelector("canvas")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test**

Run: `npm run test -- SilkFabricBackground`
Expected: PASS in jsdom even before the refactor (the canvas is gated off with no WebGL2). This is the guard baseline; keep it — Step 4 confirms it still holds after the code is simplified.

- [ ] **Step 3: Simplify `SilkFabricBackground.tsx` to poster-only**

Replace the **entire** contents of `src/components/silk/fabric/SilkFabricBackground.tsx` with:

```tsx
// Static silk hero backdrop. The interactive WebGL silk canvas was
// removed (client direction 2026-07-18) — the hero now shows only the
// baked silk still. The retired canvas/plane/material/shader files in
// this folder are left un-imported and recoverable via git, matching the
// convention for the earlier retired SilkHero module.

import { SILK_FABRIC_CONFIG } from "./fabric.config";
import styles from "./SilkFabricBackground.module.css";

export function SilkFabricBackground() {
  return (
    <div className={styles.wrap} data-testid="silk-fabric-background">
      {/* Plain img on purpose: this asset must never pass through an
          optimizer (client brief). It is also the LCP image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SILK_FABRIC_CONFIG.texture.posterSrc}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className={styles.poster}
      />
    </div>
  );
}

export default SilkFabricBackground;
```

This drops the `"use client"` directive, the dynamic `SilkFabricCanvas` import, and every hook/state that only fed the gating logic (`useState`, `useEffect`, `useIntersectionObserver`, `useMediaQuery`, `useReducedMotion`, `isSlowConnection`, `getWebglCapability`, and the `mounted`/`documentHidden`/`canvasReady`/`contextLost` state). The component is now a pure server component that emits the same poster markup.

- [ ] **Step 4: Trim the unused CSS classes**

In `src/components/silk/fabric/SilkFabricBackground.module.css`, delete the now-unused `.canvasReady` and `.canvasHidden` rules (and any rule that only styled the removed canvas wrapper). Keep `.wrap` and `.poster` exactly as they are — those still style the retained elements.

Confirm which classes to remove first:

```bash
grep -nE "canvasReady|canvasHidden|\.wrap|\.poster" src/components/silk/fabric/SilkFabricBackground.module.css
```

- [ ] **Step 5: Run the guard test + full unit suite**

Run: `npm run test`
Expected: PASS — the new `SilkFabricBackground` tests pass, and `tests/unit/components/sections/Hero.test.tsx` stays green (it asserts the `silk-fabric-background` testid and poster `alt=""` are present, and that the retired `silk-hero` testid is absent — all still true).

- [ ] **Step 6: Lint + typecheck (enforces the removal is clean)**

Run: `npm run lint && npm run typecheck`
Expected: PASS with no errors. This is the real enforcement that no dead imports or unused variables remain from the removed WebGL machinery.

- [ ] **Step 7: Production build**

Run: `npm run build`
Expected: succeeds. (The orphaned `SilkFabricCanvas`/plane/material/shader modules are no longer imported by any route, so tree-shaking drops them from the client bundle — the hero's client JS should shrink.)

- [ ] **Step 8: Browser verification**

1. With the dev server running, navigate to the homepage.
2. Confirm the hero shows the silk still (`silk-3840.jpg`) — visually identical to today's at-rest hero.
3. Move the cursor across the hero: confirm there is **no** deformation / ripple / sheen movement — the background is completely static.
4. `read_network_requests` (urlPattern `silk`): confirm `/images/hero/silk/silk-3840.jpg` is fetched directly from `/public` (status 200, not a `/_next/image` optimizer URL).
5. `read_console_messages` (onlyErrors): expect none.
6. `computer` screenshot of the hero as proof.

- [ ] **Step 9: Commit**

```bash
git add src/components/silk/fabric/SilkFabricBackground.tsx \
        src/components/silk/fabric/SilkFabricBackground.module.css \
        tests/unit/components/silk/SilkFabricBackground.test.tsx
git commit -m "feat: make hero background a static silk still, remove webgl animation"
```

---

## Notes for the executor

- Tasks 1 and 2 are fully independent — either order is fine; they touch disjoint files.
- If `.claude/launch.json` has no dev-server entry, create one running `npm run dev` on the project's dev port before the browser-verification steps (do not use Bash to run the dev server).
- Do not flip `NEXT_PUBLIC_SILK_HERO` or touch env — the animation is removed in code, not via the kill switch.
- After both tasks land, consider (separately, out of scope here) a cleanup pass to delete the orphaned `src/components/silk/fabric/` canvas/plane/material/shader files and the retired `src/components/silk/SilkHero*` module — leave that decision to the user.

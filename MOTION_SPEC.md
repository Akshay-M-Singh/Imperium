# Imperium Italian Textile — Motion Specification

**Version 1.0 · June 2026**

**Companion to:** `TECHNICAL_ARCHITECTURE.md` (Section 4 — Animation Strategy)
**Companion to:** `DESIGN.md` (Section 5 — Motion Principles)

---

## 1. Motion Principles

The motion language of this site is **restrained but alive**. The references are Apple, Vitra, Aēsop, Hermès — sites where motion is felt, not seen. Five principles govern every decision:

1. **Touch-first parity with cursor.** A visitor on an iPhone must feel the same responsiveness as a visitor with a mouse. No gesture is "desktop-only."
2. **No animation without a purpose.** Motion exists to communicate state, draw attention, or provide feedback. Decorative motion (parallax, particles, scroll-jacking) is excluded.
3. **Restraint over expressiveness.** When in doubt, do less. The site's motion budget is 130KB of JS, not 130KB of behaviours.
4. **Reduced motion is non-negotiable.** `prefers-reduced-motion: reduce` is not a degraded experience — it is a complete, considered alternative.
5. **Performance is a feature.** Every motion runs on the compositor (CSS) or through `useMotionValue` (Framer's render-bypass). React reconciliation is never the bottleneck.

---

## 2. Motion Tokens

All durations, easings, and springs are defined as CSS custom properties and Framer preset objects. Changing a token in one place updates every motion site.

### CSS Custom Properties (`globals.css`)

```css
:root {
  /* Durations */
  --motion-duration-instant: 150ms;
  --motion-duration-fast: 250ms;
  --motion-duration-base: 400ms;
  --motion-duration-slow: 800ms;
  --motion-duration-cinematic: 1200ms;

  /* Easings */
  --motion-ease-out: cubic-bezier(0.16, 1, 0.3, 1);      /* expo-out, for entries */
  --motion-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --motion-ease-standard: cubic-bezier(0.25, 0.1, 0.25, 1);

  /* Distances */
  --motion-distance-xs: 4px;
  --motion-distance-sm: 8px;
  --motion-distance-md: 16px;
  --motion-distance-lg: 24px;
  --motion-distance-xl: 48px;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-duration-instant: 0ms;
    --motion-duration-fast: 0ms;
    --motion-duration-base: 0ms;
    --motion-duration-slow: 0ms;
    --motion-duration-cinematic: 0ms;
  }
}
```

### Framer Spring Presets (`lib/motion.ts`)

```ts
export const springs = {
  soft:    { type: "spring", stiffness: 120, damping: 20 },
  standard:{ type: "spring", stiffness: 150, damping: 18 },
  firm:    { type: "spring", stiffness: 260, damping: 26 },
  snap:    { type: "spring", stiffness: 400, damping: 30 },
} as const;
```

### Variant Conventions

```ts
// Section entry
export const sectionReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.08 },
  },
};

// Child of section
export const childReveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
```

---

## 3. Component Specifications

### 3.1 TiltCard

**Purpose:** Fabric cards that respond to cursor position with a subtle 3D tilt, communicating "this is a tactile surface, not a button."

**Trigger:**
- Desktop: `onMouseMove` over the card
- Touch: `onTouchStart` / `onTouchEnd` (press state only, no tilt)

**Visual response:**

| Property | Resting | Active | Transition |
|---|---|---|---|
| Image scale | 1.0 | 1.05 | spring `standard` (stiffness 150, damping 18) |
| Card rotation (X) | 0° | max ±4° (cursor Y) | spring `standard` |
| Card rotation (Y) | 0° | max ±8° (cursor X) | spring `standard` |
| Card shadow (top) | 0 1px 3px rgba(0,0,0,0.04) | 0 24px 48px rgba(0,0,0,0.08) | spring `standard` |
| Card shadow (bottom) | 0 4px 12px rgba(0,0,0,0.03) | 0 12px 24px rgba(0,0,0,0.05) | spring `standard` |
| Eyebrow text color | Ardesia | Oro Antico | CSS transition 250ms `--motion-ease-out` |
| CTA underline | hidden | drawn left-to-right | CSS transition 400ms `--motion-ease-out` |

**Touch behavior:**
- On `touchstart`: scale 0.98, shadow elevation (no tilt — no cursor)
- On `touchend`: spring back to resting state
- `touch-action: pan-y` so vertical page scroll still works

**Reduced motion:** Tilt disabled, shadow elevation disabled, image scale disabled. Card behaves as a static element with a CSS-only hover effect (color shift only).

**Implementation notes:**
- Use `useMotionValue` for `rotateX` and `rotateY` — never store in React state
- Use `useTransform` to derive rotation from cursor position
- The component must be marked `'use client'`
- Perspective: `1200px` on the parent to give the tilt depth

---

### 3.2 MagneticButton

**Purpose:** Primary CTAs (WhatsApp, Request Samples, hero "Explore") that subtly follow the cursor, making the button feel magnetic and inviting.

**Trigger:** `onMouseMove` over a 100px radius around the button center. Disabled entirely on touch devices.

**Visual response:**

| Property | Resting | Active | Transition |
|---|---|---|---|
| Translate (X) | 0px | max ±8px (toward cursor) | spring `firm` (stiffness 260, damping 26) |
| Translate (Y) | 0px | max ±8px (toward cursor) | spring `firm` |
| On release | — | 0px | spring `firm` (slightly longer settle, 200ms effective) |

**Touch behavior:** No-op. Buttons behave as standard touch targets with no magnetic effect.

**Reduced motion:** No effect. Button is static.

**Implementation notes:**
- Detect touch via `'ontouchstart' in window || navigator.maxTouchPoints > 0` and skip the effect
- Use `useMotionValue` + `useSpring` to avoid re-renders
- The component must be marked `'use client'`

---

### 3.3 AnimatedFocusRing

**Purpose:** The bottom border of form fields morphs between fields as the user tabs through, creating the "Apple login form" effect.

**Trigger:** `onFocus` of any `FormField` containing this component.

**Visual response:**

| Property | Resting | Focused | Transition |
|---|---|---|---|
| Border color | Sabbia | Blu Notte | CSS 250ms `--motion-ease-out` |
| Border thickness | 1px | 1px (unchanged) | — |
| Border weight indicator | hidden | shared `layoutId="form-focus-ring"` morphs from previous field | spring `soft` (stiffness 200, damping 22) |
| Label position | inside input (placeholder position) | floats up 16px, font 12px (was 16px) | spring `soft` |
| Label color | Ardesia | Blu Notte | CSS 250ms |

**Layout ID pattern:**

```tsx
// Inside FormField
{isFocused && <motion.div layoutId="form-focus-ring" className={styles.ring} />}
```

When focus moves to a different field, the previous field's ring unmounts and the new field's ring mounts. Framer's `layoutId` morphs the ring from the old position to the new one in a single animation.

**Reduced motion:** No morph. Border color change happens instantly. Label still floats (no spring), but in 0ms.

**Implementation notes:**
- The ring is a `motion.div` positioned absolutely at the bottom of the field
- The label's float is a separate animation — not the same `layoutId` as the ring
- The component must be marked `'use client'`

---

### 3.4 ValidationMorph

**Purpose:** Form validation states (error, success) appear with motion that feels considered, not jarring.

**Trigger:** Form submission with validation result.

**Visual response — Error:**

| Property | Enter | Exit |
|---|---|---|
| Error message Y | 8px → 0px | 0px → -8px |
| Error message opacity | 0 → 1 | 1 → 0 |
| Field border color | Sabbia → error red (`#B83A2E`) | error red → Sabbia |
| Border pulse | 1 cycle: 0% → 100% width glow over 600ms | — |
| Timing | 200ms `--motion-ease-out` enter, 150ms exit | — |

**Visual response — Success:**

| Property | Enter | Notes |
|---|---|---|
| Checkmark draw | 0% → 100% stroke-dashoffset | 600ms, `cubic-bezier(0.65, 0, 0.35, 1)` |
| Checkmark color | Carbone | Static after draw |
| Button text | "Sending..." → "Thank you" | Crossfade 300ms |
| Micro-bounce on button | scale 1 → 1.03 → 1 | spring `snap`, 400ms total |

**Reduced motion:** All animations collapse to instant state changes. Error message appears immediately. Success checkmark is fully drawn from frame 1.

**Implementation notes:**
- Stroke-dasharray pattern: set `strokeDasharray` to the checkmark's path length, animate `strokeDashoffset` from that length to 0
- The pulse glow is a CSS animation (layer 3) — no Framer needed for the pulse itself
- Haptic feedback: `navigator.vibrate(8)` on form submit attempt (Android only, feature-detected)

---

### 3.5 EmblaContainer (Carousel)

**Purpose:** Swipeable collections section. Mobile-first; the same component drives the desktop experience with a single slide visible.

**Library:** Embla Carousel core (`embla-carousel-react`) + Framer Motion for slide entry animation.

**Configuration:**

```ts
const options: EmblaOptionsType = {
  loop: false,
  align: "start",
  dragFree: false,
  containScroll: "trimSnaps",
  slidesToScroll: 1,
};
```

**Visual response:**

| Property | Behavior | Notes |
|---|---|---|
| Slide width | 100vw (mobile), 60vw (tablet), 45vw (desktop) | Single slide per view |
| Slide spacing | 24px (mobile), 48px (desktop) | CSS gap, not margin |
| Drag momentum | Embla default | ~300ms decay |
| Snap points | One per slide | Embla default |
| Active slide | scale 1.0 + Ken Burns on image (1.0 → 1.04 over 6s) | Only the active slide animates |
| Inactive slides | scale 0.95, opacity 0.7 | Subtle, not dramatic |
| Pagination dots | shared `layoutId` background morphs to active position | spring `soft` |

**Touch behavior:**
- `touch-action: pan-y` on the carousel track so vertical page scroll still works
- Horizontal swipe hijacked by Embla's drag handler
- `event.cancelable` checks prevent hijacking native back-swipe gestures (iOS edge swipe)

**Keyboard:**
- Arrow Left / Right: previous / next slide
- Home / End: first / last slide
- Tab moves focus into the slide's CTA, not between slides

**Accessibility:**
- `role="region"` with `aria-roledescription="carousel"`
- `aria-live="polite"` on a visually hidden live region announcing slide changes
- Each slide has `aria-label="Slide N of M"`
- Pagination dots are buttons with `aria-current="true"` on the active one

**Reduced motion:** Ken Burns animation disabled, slide entry animation disabled. Slides snap into place instantly on drag release.

---

### 3.6 ScrollReveal (revised)

**Purpose:** One-shot section reveal when the section enters the viewport. Replaces the previous `data-revealed` Intersection Observer pattern.

**API:**

```tsx
<ScrollReveal amount={0.15} delay={0}>
  <SectionHeader eyebrow="..." headline="..." />
  <Body />
</ScrollReveal>
```

**Configuration:**

| Section | `amount` | Rationale |
|---|---|---|
| Hero | 0.05 | Fire as soon as any part is visible — hero is above the fold |
| OriginMap | 0.2 | Wait for clear intent |
| StatsStrip | 0.3 | Only count up when substantially visible |
| Collections | 0.2 | Standard |
| TrustPillars | 0.2 | Standard |
| Founder | 0.25 | Wait for portrait to be visible |
| Testimonials | 0.2 | Standard |
| Contact | 0.15 | Don't make the user wait to see the form |

**Stagger:** All ScrollReveal containers use `staggerChildren: 0.08` so eyebrow → headline → subline → CTA cascade in 80ms increments.

**One-shot:** `viewport.once: true` — animations never replay on scroll-up. Same behavior as the previous architecture.

**Reduced motion:** All children appear in their final state instantly. No fade, no translate.

---

### 3.7 CountUp (revised)

**Purpose:** Stats strip number counter. Animates from 0 to the target value when the parent ScrollReveal fires.

**API:**

```tsx
<CountUp end={100} suffix="+" duration={1200} />
```

**Behavior:**

| Property | Value | Notes |
|---|---|---|
| Duration | 1200ms | Default, overridable |
| Easing | Critically-damped spring approximation | `1 - Math.exp(-t * 8)` mapped to 0–1 |
| Trigger | Fires when parent ScrollReveal triggers | Intersection Observer visibility |
| Format | `Intl.NumberFormat` for locale-aware separators | `en-AE` for the site |
| Final value | Locks at `end` | Doesn't re-trigger |

**Reduced motion:** Renders the final value (`end`) on mount, no animation.

**Implementation notes:**
- Uses `requestAnimationFrame` + `useRef` for the displayed number
- The text node is mutated directly, not via React state — zero re-renders during count
- The component must be marked `'use client'`

---

### 3.8 SilkHero (added 2026-07-07)

**Amendment note:** the hero's background layer is a live WebGL silk simulation (`src/components/silk/`), specified in full in `docs/superpowers/specs/2026-07-07-silk-hero-experience-design.md`. This is the codebase's first WebGL subsystem and a scoped exception to `TECHNICAL_ARCHITECTURE.md`'s Three.js exclusion (hero only). It is documented here because it is motion, not because the general exclusion is lifted elsewhere.

- **What it is:** a fullscreen R3F canvas behind the untouched hero DOM (eyebrow, wordmark, tagline, CTAs, entry cascade unchanged). An art-directed resting drape, idle drift/breath, one cinematic entry tension-wave, and cursor/touch-reactive deformation with over-damped inertia.
- **Reduced-motion contract:** identical to every other component in this spec — `useReducedMotion` gates it, and the fallback is not "less of the same," it's a complete static frame: a rendered poster of the shader's own resting pose (same composition, same palette), so `prefers-reduced-motion` users see the exact art direction, minus motion. No idle drift, no entry wave, no cursor deformation, no time advance in the shader loop.
- **Other gates that resolve to the same static poster:** no WebGL2 support, `save-data`/slow connection (reusing the Hero's existing sniff), and the `NEXT_PUBLIC_SILK_HERO` kill switch. The site never depends on WebGL to render a complete hero.
- **Performance boundary:** rendering pauses via `useIntersectionObserver` when the hero scrolls offscreen and on `visibilitychange` (tab hidden) — this is accessibility/thermal hygiene, not a performance optimization pass (the spec explicitly deprioritizes bundle/GPU optimization elsewhere).
- **Zero re-render discipline preserved:** cursor and scroll values are smoothed through Framer `useSpring` motion values and written into shader uniforms inside `useFrame`, never into React state — consistent with §5's "Performance Boundaries."
- **Fallback table entry:** Hero silk background → live shader with cursor deformation | Static poster render of the same resting-drape composition, no motion.

---

## 4. Reduced-Motion Strategy

`prefers-reduced-motion: reduce` is a first-class concern. Every motion site in this codebase must have a defined reduced-motion behavior.

### Token-level

All `--motion-duration-*` CSS custom properties collapse to `0ms` inside `@media (prefers-reduced-motion: reduce)`. This means CSS transitions respect the setting without per-component overrides.

### Component-level

The `useReducedMotion` hook (returns `boolean`) is called at the top of every Framer-driven component. When `true`:

```tsx
const reduced = useReducedMotion();
const transition = reduced ? { duration: 0 } : springs.standard;
```

### Fallback table

| Behavior | With motion | Without motion |
|---|---|---|
| Tilt | 8° rotation + scale + shadow | Static, color shift only |
| Magnetic | 8px translate | Static |
| Section reveal | Fade + translate, 800ms | Instant — element appears in final state |
| Section stagger | 80ms cascade | No stagger, all children appear together |
| Carousel slide entry | Subtle scale + opacity | Snap into place |
| Carousel Ken Burns | 6s slow zoom | Static image |
| Form focus ring | Morph via `layoutId` | Color change only |
| Form label float | Spring, 200ms | Instant |
| Validation error | Slide-down 8px + border pulse | Instant text |
| Validation success | Checkmark draws over 600ms | Fully drawn from frame 1 |
| Submit micro-bounce | scale 1 → 1.03 → 1, 400ms | No bounce |
| CountUp | 1200ms spring count | Final value immediately |
| Hero entry cascade | 80ms stagger | All elements visible from frame 1 |

**Important:** Reduced motion is not "broken motion." It is a complete, considered experience. The site must feel as intentional with motion disabled as it does with motion enabled.

---

## 5. Implementation Notes

### Client vs Server Components

Every Framer Motion component must be marked `'use client'`. Server components (the default in Next.js 15 App Router) cannot use Framer. This is not a limitation — it's the correct boundary. Server components render the data structure; client components handle the interaction.

```tsx
'use client';
import { motion } from 'framer-motion';
// ...
```

### Performance Boundaries

- **Use `useMotionValue` + `useTransform` for 60fps tracking.** Cursor-following animations (TiltCard, MagneticButton) must never store motion values in React state. Re-rendering at 60fps is the fastest path to dropped frames.
- **Lazy-load below-fold motion components with `next/dynamic`.** The hero, navigation, and first content section ship Framer eagerly. Everything else (TiltCard, MagneticButton, AnimatedFocusRing) is dynamic-imported.
- **Use `m` (mini motion) over `motion` where the full API isn't needed.** Framer's `m` component is the same as `motion` but doesn't include layout animations — smaller footprint for simple cases.

### Touch Action

All interactive elements get `touch-action: manipulation` to:
- Prevent the 300ms double-tap-to-zoom delay
- Prevent iOS Safari's callout on long-press
- Preserve vertical page scroll (`pan-y`)

### Viewport Units

Use `dvh` (dynamic viewport units) instead of `100vh` for any element that should respect the URL bar collapse on mobile Safari:

```css
.hero {
  height: 100dvh;
  min-height: 100svh; /* fallback for browsers without dvh */
}
```

### Form Validation Haptics

On form submit, attempt `navigator.vibrate(8)` if the API is available. iOS Safari does not support the API — the call is a silent no-op. No fallback needed.

### Carousel Touch Boundary

The carousel track uses `touch-action: pan-y` so vertical page scrolling is not hijacked. Embla's drag handler must check `event.cancelable` before calling `preventDefault` to avoid breaking native iOS edge-swipe gestures.

---

## 6. Verification Checklist

Before each component ships, verify against this list:

- [ ] Component calls `useReducedMotion` and provides a reduced-motion fallback
- [ ] No React re-renders during animation (verify with React DevTools Profiler)
- [ ] All duration / easing values come from the token system, not inline magic numbers
- [ ] `touch-action: manipulation` (or `pan-y` for carousels) is set
- [ ] Test passes on iPhone Safari (real device, not emulation)
- [ ] Test passes on Android Chrome (real device)
- [ ] Test passes with `prefers-reduced-motion: reduce` enabled
- [ ] No layout shift introduced by the animation (verify with Lighthouse CLS audit)
- [ ] Animation runs on the compositor (transform, opacity) — no `top`, `left`, `width` animations
- [ ] Keyboard navigation works without motion playing (Tab through TiltCards: focus ring is visible, tilt is not required to indicate focus)

---

*Motion is a language. Every transition is a sentence. The site should speak fluently, not loudly.*

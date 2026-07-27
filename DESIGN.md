# IMPERIUM — Design System

**The single source of truth for all visual design on this site.** Read this file before creating
or modifying any UI. Every colour, type style, spacing value, and animation on the site is
specified here. If a design decision is not in this file, it does not exist in the system.

- **Audience:** engineers and agents building this site.
- **Code references:** comments throughout `src/` cite sections of this file (e.g. `DESIGN.md §3`).
  Section numbers are stable — never renumber; append new sections instead.
- **Motion:** the full motion specification lives in §7 (legacy `MOTION_SPEC.md` references resolve here).
- **Conventions:** values are cited as `token — exact value (source file)`. "Desktop/mobile" pairs
  are written `72px / 40px`. All CSS uses logical properties (`inline`, `block`) — never physical
  (`left`, `right`, `width`) in new code.
- **Tech reality:** no Tailwind, no CSS-in-JS. The system is CSS custom properties in
  `src/app/globals.css` + colocated CSS Modules (`Component.module.css`). All tokens below are
  defined in `src/app/globals.css` `:root` unless stated otherwise.

---

## §1 — Design Philosophy & Theme

**Brand:** Imperium Italian Textile — premium Italian fabrics for the Gulf's most discerning
tailors, designers, and hospitality groups.

**Theme: quiet luxury through restraint.** The design language is an editorial, gallery-like
calm. Five principles govern every decision:

1. **Warm linen canvas.** The page is warm off-white (`pietra`, "raw Italian linen") with pure
   white surfaces (`gesso`). There is exactly one dark, immersive moment: the fabric hero (a
   champagne-satin photograph under a dark scrim, §3.5). The footer is the only other dark
   band — the "full stop" that closes the page.
2. **Two-accent discipline.** Interactive moments are deep midnight navy (`blu-notte`); rare
   editorial luxury moments are antique gold (`oro-antico`). No third accent may be introduced.
3. **Whitespace over dividers.** Sections are separated by generous vertical padding and band
   colour alternation, not rules or boxes. Hairlines appear only where structure demands them
   (stat cells, form card, scrolled nav).
4. **Sharp rectangles.** Nothing is rounded except pill buttons (radius `100px`) and the 8px
   WhatsApp indicator dot (`50%`). No cards-with-rounded-corners, no soft blobs.
5. **Serif/sans dualism.** Cormorant Garamond carries brand voice (headlines, quotes, numbers);
   DM Sans carries the interface (body, labels, buttons, nav). Never mix roles.

**Motion philosophy:** motion must be justified (feedback, spatial continuity, state change) —
never decorative noise. Everything is physical (springs, ease-out), interruptible, and fully
degradable under `prefers-reduced-motion`. See §7.

**Accessibility & performance are design constraints**, not afterthoughts: 56px touch targets,
visible focus rings, body text never below 16px, self-hosted subset fonts, and a static,
motion-free hero image with no GPU cost.

---

## §2 — Typography

### §2.1 Font families

| Token | Stack | Role |
|---|---|---|
| `--font-serif` | `"Cormorant Garamond", "Georgia", "Times New Roman", serif` | Headings, display, quotes, stat numbers, wordmarks |
| `--font-sans` | `"DM Sans", "Helvetica Neue", "Arial", sans-serif` | Body, labels, buttons, nav, forms, footer |

Weights: `--font-weight-regular: 400` · `--font-weight-medium: 500` · `--font-weight-semibold: 600`
(**600 is loaded but currently unused — do not use it without updating this file**).

### §2.2 Font loading (`src/app/layout.tsx`, `src/app/globals.css`)

Self-hosted WOFF2 under `public/fonts/`, all `font-display: swap`:

| Family | Style | Weight | File | Preloaded |
|---|---|---|---|---|
| Cormorant Garamond | normal | 400 | `CormorantGaramond-Regular.woff2` | ✅ |
| Cormorant Garamond | normal | 500 | `CormorantGaramond-Medium.woff2` | — |
| Cormorant Garamond | normal | 600 | `CormorantGaramond-SemiBold.woff2` | — |
| Cormorant Garamond | italic | 400 | `CormorantGaramond-Italic.woff2` | — |
| Cormorant Garamond | italic | 500 | `CormorantGaramond-MediumItalic.woff2` | — |
| DM Sans | normal | 400 | `DMSans-Regular.woff2` | ✅ |
| DM Sans | normal | 500 | `DMSans-Medium.woff2` | — |

Only the two regular faces are preloaded (`<link rel="preload">` in `layout.tsx`). Cormorant
Regular carries CLS metric overrides: `ascent-override: 96.22%; descent-override: 29.89%;
line-gap-override: 0%; size-adjust: 96.03%`. Fonts are subset to Latin + Latin Extended
(`scripts/subset-fonts.sh`). **Never load additional families or weights without updating this
section.**

### §2.3 Modular type scale (1:1.333 — perfect fourth)

| Token | Desktop | Mobile (≤767px) | Used for |
|---|---|---|---|
| `--text-eyebrow` | 11px | 11px | Eyebrow labels, footer legal/social |
| `--text-caption` | 13px | 13px | Nav links, buttons, stat labels, captions |
| `--text-body` | 16px | 16px | Body text, form inputs (never smaller — iOS zoom guard) |
| `--text-body-large` | 18px | 18px | Hero tagline, section sublines |
| `--text-subheadline` | 21px | 21px | Item-level sub-headings |
| `--text-h4` | 24px | 24px | (token defined; currently unused) |
| `--text-h3` | 32px | 32px | h3 headlines, mobile menu links |
| `--text-h2` | 42px | **30px** | Section headlines, stat numbers |
| `--text-h1` | 56px | **36px** | (token defined; reserved for page titles) |
| `--text-display` | 72px | **40px** | Hero display wordmark |

Mobile overrides live in `@media (max-width: 767px)` at the end of `globals.css`. There are no
fluid `clamp()` font sizes anywhere — sizes step at breakpoints.

### §2.4 Line heights & tracking

| Token | Value | Token | Value |
|---|---|---|---|
| `--leading-body` | 1.7 | `--leading-h3` | 1.3 |
| `--leading-subheadline` | 1.5 | `--leading-h2` | 1.2 |
| `--leading-h4` | 1.35 | `--leading-h1` / `--leading-display` | 1.1 / 1.05 (both currently unused) |

| Token | Value | Used for |
|---|---|---|
| `--tracking-eyebrow` | 0.15em | Eyebrows, form labels (always with `text-transform: uppercase`) |
| `--tracking-caption` | 0.02em | Stat labels, footer tagline, hero tagline |
| `--tracking-nav` | 0.05em | Nav links, footer links (always uppercase) |
| `--tracking-label` | 0.05em | Button labels (always uppercase) |

### §2.5 Base element styles (`globals.css`)

- `body`: DM Sans, 16px, 1.7, `ardesia` on `pietra`; antialiased, `optimizeLegibility`.
- `h1–h4`: Cormorant, weight 400, `carbone`, line-height 1.2. Sizes come from components, not base styles.
- `input, button, textarea, select`: `font: inherit`.

### §2.6 Typography rules

1. **Uppercase is always tracked.** Any `text-transform: uppercase` must pair with its tracking
   token (0.15em eyebrows/labels, 0.05em nav/buttons). Never uppercase body copy.
2. **Italics are serif-only**, reserved for quotes and editorial card titles.
3. **Every text element on the site is exactly one of the seven text types in §10.** Do not
   invent ad-hoc combinations of size/weight/tracking.
4. Body text is never set below 16px (prevents iOS input auto-zoom).

---

## §3 — Colour

### §3.1 Primary palette

| Token | Value | Role |
|---|---|---|
| `--color-carbone` | `#1a1a1a` | Primary text, headlines; footer & dark band background |
| `--color-pietra` | `#faf8f3` | Page background — "raw Italian linen" |
| `--color-gesso` | `#ffffff` | Cards, overlays, form fields; text on dark |
| `--color-sabbia` | `#b8a99a` | Eyebrow text, secondary labels, dividers, image placeholders |
| `--color-ardesia` | `#4a4540` | Body text — softer than pure black |

### §3.2 Accent palette

| Token | Value | Role |
|---|---|---|
| `--color-blu-notte` | `#1b2a4a` | Interactive identity: buttons, links, focus rings, active states |
| `--color-oro-antico` | `#c4a76c` | Editorial luxury moments only: pull-quote attribution, card tagline hover, collections progress bar |
| `--color-terracotta` | `#c47a5a` | **Reserved** (error alternative, map origin pin) — defined, not yet used |

### §3.3 Functional palette

| Token | Value | Role |
|---|---|---|
| `--color-whatsapp` | `#25d366` | WhatsApp CTAs only — never repurpose |
| `--color-error` | `#b83a2e` | Form validation errors |
| `--color-success` | `#2e7d4f` | **Reserved** — defined, not yet used |
| `--color-hero-gradient` | `rgba(0, 0, 0, 0.4)` | Hero scrim — darkens the fabric still for text legibility (§3.5) |

### §3.4 Tints, alphas & derived colours

New colour values are never introduced; variation comes from these exact derivations:

| Derivation | Exact value | Used for |
|---|---|---|
| Sabbia 20% | `color-mix(in srgb, var(--color-sabbia) 20%, transparent)` | Hairline dividers (stat cells), form-card border |
| Sabbia 30% | `rgba(184, 169, 154, 0.3)` | Scrolled nav bottom border |
| Sabbia 35% | `color-mix(... 35%, transparent)` | Collections progress track |
| Sabbia 40% | `color-mix(... 40%, transparent)` | Dashed certification placeholder border (only dashed border in the system) |
| White 80% | `rgba(255, 255, 255, 0.8)` | Primary text on dark (hero tagline, on-dark nav links) |
| White 70% | `rgba(255, 255, 255, 0.7)` | Secondary text on dark (hero eyebrow, secondary wordmark) |
| White 55% / 50% | `rgba(255, 255, 255, 0.55 / 0.5)` | Tertiary on dark (scroll indicator, on-dark lang toggle) |
| Hover darken | `color-mix(in srgb, <colour> 90%, black)` | Hover state of every filled button (blu-notte, whatsapp) |
| Disabled | `opacity: 0.5` | Disabled buttons and inputs |
| Footer muted | `opacity: 0.7` on gesso | Footer links at rest (→ 1.0 on hover/focus) |
| Placeholder | `sabbia` at `opacity: 0.7` | Input placeholders |

On dark surfaces the text hierarchy is **white at 100 / 80 / 70 / 50–55%** — never grey tokens.

### §3.5 Hero fabric still & scrim (`src/components/sections/Hero.module.css`)

The hero background is a static photograph of champagne-beige satin
(`public/images/hero/fabric-hero.jpg`, 3024×4032), served via `next/image` (`fill`,
`priority`, quality 90, `sizes="100vw"`, `object-fit: cover`, AVIF/WebP). A scrim of
`--color-hero-gradient` (`rgba(0, 0, 0, 0.4)`) overlays the image so overlaid text keeps
using the white-alpha ramp in §3.4. A `mask-image` linear gradient on the background
container fades image and scrim together — fully opaque until 85% of hero height,
transparent at the bottom edge — dissolving into the `pietra` page background ahead of
StatsStrip. A `sabbia` placeholder colour sits behind the image while it loads (§6.2).

### §3.6 Colour rules

1. **Tokens only.** No raw hex/rgb values in component CSS. (Two sanctioned exceptions: the
   URL-encoded sabbia SVG chevron in `FormField.module.css`; `#fff` in `Hero.module.css`.)
2. Tints come from `color-mix` with the exact percentages above; hover darkening is always
   `90% + black`.
3. `oro-antico` never appears on interactive chrome (buttons, nav, links); `blu-notte` never
   appears on decorative moments.
4. Meta/manifest colours: `themeColor` `#FAF8F3` (pietra) in `layout.tsx` and
   `public/site.webmanifest`.

---

## §4 — Layout & Grid

### §4.1 Tokens

| Token | Value | Token | Value |
|---|---|---|---|
| `--max-content-width` | 1200px | `--grid-gutter-desktop-xl` | 32px |
| `--nav-height` | 72px | `--grid-gutter-desktop` | 24px |
| `--nav-height-mobile` | 56px | `--grid-gutter-tablet` | 20px |
| `--whatsapp-bar-height` | 56px | `--grid-gutter-mobile` | 16px |
| `--grid-columns` | 12 | `--bp-tablet` / `--bp-desktop` / `--bp-desktop-xl` | 768 / 1024 / 1440px |

Grid margins (container inline padding): `--grid-margin-mobile: 24px` → `tablet: 40px` →
`desktop: 80px` → `desktop-xl: 120px`.

### §4.2 The container pattern

Every content band uses the same container (implemented by `Section .inner`, and mirrored by
Navigation `.row`, Footer `.inner`, Collections `.header` —
`src/components/layout/Section.module.css`):

```
max-inline-size: 1200px;  margin-inline: auto;
padding-inline: 24px → 40px @768 → 80px @1024 → 120px @1440
```

The nav row is the one exception: `padding-inline: clamp(24px, 5vw, 120px)`.

### §4.3 Section rhythm

| Token | Value | Use |
|---|---|---|
| `--section-padding-y` | `clamp(80px, 10vw, 160px)` | Standard section |
| `--subsection-padding-y` | `clamp(48px, 6vw, 96px)` | Dense section (`dense` prop) |
| `--element-padding-y` | `clamp(24px, 3vw, 40px)` | (defined, currently unused) |

Band colours alternate for rhythm. Homepage order: **Hero (fabric still + scrim) → StatsStrip
(gesso) → Collections (pietra) → WhyImperium (gesso) → Founder (pietra) → Testimonials
(pietra) → Contact (pietra) → Footer (carbone)**.

### §4.4 Grids

- **12-column** at ≥1024px for editorial rows: WhyImperium rows `repeat(12, 1fr)` with text
  `span 5` / media `span 7` (reversed rows flip order).
- **Fractional splits:** Founder `5fr 7fr` (portrait / bio) and `7fr 5fr` (quote /
  certification); Contact `7fr 5fr` (content / form).
- **3-up:** StatsStrip `repeat(3, 1fr)` at ≥768px.
- Everything collapses to a single column below 1024px (stats below 768px), stacking with
  `--space-lg` / `--space-xl` gaps.

### §4.5 Text measure caps

Sublines & hero tagline `540px` · Testimonials column `680px` · Privacy page `720px` ·
body copy `60ch` · spread-card text `min(320px, 36ch)`.

### §4.6 Z-index scale

`--z-base: 1` · `--z-whatsapp-bar: 90` · `--z-nav: 100` · `--z-overlay: 200` (hamburger sits at
overlay + 1). Never introduce values outside this scale.

---

## §5 — Interaction States

### §5.1 Global rules

1. **Hover gating is mandatory.** Every `:hover` rule lives inside
   `@media (hover: hover) and (pointer: fine)`. Nothing hover-only may be essential on touch.
2. **Focus is always visible.** Global `:focus-visible`: `2px solid var(--color-blu-notte)`,
   offset `2px` (`--focus-outline-width` / `--focus-outline-offset`). Component focus states
   mirror their hover treatment (e.g. footer links, card taglines use `:focus-visible` /
   `:focus-within`).
3. **Press feedback:** every pressable element scales to `scale(0.97)` (WhatsApp inline
   `0.98`), transition `transform 100–160ms var(--motion-ease-out)`.
4. **Disabled:** `opacity: 0.5`, `cursor: not-allowed`, no hover/press effects.
5. Colour transitions use `--motion-duration-fast` (250ms); underline draws 250–400ms (§7.2).

### §5.2 Interaction patterns

| Pattern | Rest → Hover/Focus | Source |
|---|---|---|
| Ghost button fill | transparent + blu-notte border/text → blu-notte fill + gesso text | `Button.module.css` |
| Ghost-light button fill | transparent + gesso border/text → gesso fill + carbone text | `Button.module.css` |
| Filled button darken | blu-notte/whatsapp fill → `color-mix(90%, black)` | `Button.module.css` |
| Nav link underline | ardesia → carbone; 1px `::after` underline `scaleX(0→1)` from left, 250ms | `Navigation.module.css` |
| Text-link underline draw | `background-image: linear-gradient(currentColor, currentColor)`, `background-size: 0% 1px → 100% 1px` at `0 100%`, 250ms | `TextLink.module.css` |
| Hero text-link embolden | faux-bold via `text-shadow: 0 0 0.6px currentColor`, 250ms (DM Sans ships 400/500 only, §2.2) | `Hero.module.css` |
| Footer link fade | gesso at opacity 0.7 → 1.0; social sabbia → gesso | `Footer.module.css` |
| Card accent | tagline sabbia → oro-antico on card `:hover` / `:focus-within`; CTA underline draws | `FabricCard.module.css` |
| Input focus | 1px bottom border sabbia → blu-notte + floating label turns blu-notte | `FormField.module.css` |

The underline-draw technique (`linear-gradient(currentColor, currentColor)` as a sized
background) is the canonical link-hover mechanism — it inherits any context colour, including
white on the dark hero.

---

## §6 — Spacing, Surfaces & Elevation

### §6.1 Spacing scale

| Token | Value | | Token | Value |
|---|---|---|---|---|
| `--space-xxs` | 4px | | `--space-lg` | 40px |
| `--space-xs` | 8px | | `--space-xl` | 64px |
| `--space-sm` | 16px | | `--space-2xl` | 96px |
| `--space-md` | 24px | | `--space-3xl` | 160px |

Conventional pairings (by usage across components): header stacks `gap: --space-sm` (16px);
card content `--space-xs` (8px); form fields and footer rows `--space-md` (24px); intra-section
blocks `--space-lg` (40px); major stacks (grids, bio columns) `--space-xl` (64px). `2xl`/`3xl`
are unused — vertical rhythm belongs to the section padding tokens (§4.3).

### §6.2 Surfaces

- **Bands:** `pietra` / `gesso` / `carbone` backgrounds via the `Section` component (§9, U6).
- **Card (the only card recipe in the system):** `background: var(--color-gesso)`;
  `border: 1px solid color-mix(in srgb, var(--color-sabbia) 20%, transparent)`;
  `padding: var(--space-lg)`; **no radius, no shadow**. Exemplar: the contact form card.
- **Image placeholder:** `background-color: var(--color-sabbia)` behind every loading image.

### §6.3 Dividers (hairlines)

Exactly one recipe: **1px solid sabbia at 20–40%** (see §3.4 for exact derivations per context).
Used only for: stat-cell dividers, form-card border, scrolled-nav border, collections progress
track, certification placeholder (dashed). Sections are never divided by rules — whitespace
separates (§1.3).

### §6.4 Border radius inventory (exhaustive)

| Value | Applied to |
|---|---|
| `100px` | Pill buttons: Button (all variants), nav CTA, WhatsApp inline CTA, mobile-overlay CTA |
| `50%` | 8×8px WhatsApp indicator dot |
| `0` | Form inputs (explicit); **everything else by default — all imagery, cards, and surfaces are sharp rectangles** |

### §6.5 Elevation (the only shadows in the system)

TiltCard (`src/components/motion/TiltCard.tsx`) owns the site's only box-shadows:

| State | Shadow |
|---|---|
| Rest | `0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)` |
| Hover/press | `0 24px 48px rgba(0,0,0,0.08), 0 12px 24px rgba(0,0,0,0.05)` |

**No other shadows, no backdrop-blur, no gradient overlays** (the only gradients are the
`currentColor` underline trick and the hero bottom-edge mask fade, §3.5; the hero scrim is the
only overlay). Elevation is expressed through motion (tilt + shadow interpolation), not static
styling.

---

## §7 — Motion & Animation

*This section is the motion specification (legacy `MOTION_SPEC.md` references resolve here).*

### §7.1 Motion tokens (`globals.css`)

| Duration | Value | Use |
|---|---|---|
| `--motion-duration-instant` | 150ms | — |
| `--motion-duration-fast` | 250ms | Colour/opacity transitions, underline draws |
| `--motion-duration-base` | 400ms | Mobile overlay, card CTA underline |
| `--motion-duration-slow` | 800ms | Section reveals, hero entrances |
| `--motion-duration-cinematic` | 1200ms | CountUp duration |

| Easing | Value | Use |
|---|---|---|
| `--motion-ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) | **Entries and reveals — the default curve** |
| `--motion-ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | On-screen state morphs (validation check) |
| `--motion-ease-standard` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Hover/colour transitions |

Distances: `--motion-distance-xs/sm/md/lg/xl` = 4 / 8 / 16 / 24 / 48px. Under
`prefers-reduced-motion: reduce` **all duration tokens collapse to 0ms** — any CSS animation
authored with tokens is reduced-motion-safe automatically.

### §7.2 Canonical rules

1. **Enter with ease-out, never ease-in.** UI transitions stay ≤ 400ms; presses 100–160ms.
   Marketing surfaces (hero, section reveals) may run 800–1200ms.
2. **Animate `transform` and `opacity` only.** Never animate layout properties.
3. **Never scale from 0** — enter from `opacity: 0` + small `y` offset, or scale ≥ 0.9.
4. **Stagger children at 80ms** (within the 30–80ms band), decorative only.
5. Cursor-driven motion must be spring-interpolated, never raw position.
6. Hover rules are gated per §5.1; keyboard users get equivalent `:focus-visible` feedback.

### §7.3 Spring presets (`src/lib/motion.ts`)

| Preset | Config | Used by |
|---|---|---|
| `springs.soft` | `stiffness: 200, damping: 22` | Form-field label float, focus-ring morph |
| `springs.standard` | `stiffness: 150, damping: 18` | TiltCard (all tilt/shadow/scale springs) |
| `springs.firm` | `stiffness: 260, damping: 26` | MagneticButton cursor attraction |
| `springs.snap` | `stiffness: 400, damping: 30` | Submit-success micro-bounce |

Shared easing constant: `easeOut = [0.16, 1, 0.3, 1]`.

### §7.4 Scroll-reveal system

`sectionReveal` (in `src/lib/motion.ts`, applied via `<ScrollReveal>` —
`src/components/motion/ScrollReveal.tsx`):

```
hidden:  { opacity: 0, y: 24 }
visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16,1,0.3,1], staggerChildren: 0.08 } }
```

One-shot: `viewport={{ once: true, amount }}`. `amount` per section: StatsStrip **0.3**,
Collections header **0.4**, WhyImperium **0.15**, Founder **0.25**, Testimonials **0.2**,
Contact **0.15**. (`childReveal` — y16 / 0.6s — exists but is currently unused.)

### §7.5 Hero entrance choreography (`Hero.module.css`)

Pure CSS keyframes `hero-enter` (`opacity 0, translateY(24px)` → visible), all
`var(--motion-ease-out)`, fill mode `both`:

| Element | Duration | Delay |
|---|---|---|
| Eyebrow | 800ms | 700ms |
| Wordmark / logo | 1000ms | 950ms |
| Tagline | 800ms | 1250ms |
| CTA group | 800ms | 1500ms |
| Scroll indicator (`hero-pulse`: translateY 0→8px, opacity 0.4→0→0.4) | 2s × 3 iterations | 2600ms |

### §7.6 Component motion catalog

| Component | Behavior | Exact values |
|---|---|---|
| `TiltCard` | Cursor 3D tilt + elevation | rotateX ±4°, rotateY ±8°, `perspective: 1200px`; image scale 1→1.05 on hover; touch press scale 0.98; shadow interpolates rest→hover (§6.5); all springs `standard`; `touch-action: pan-y` |
| `MagneticButton` | Cursor attraction | max offset ±8px within a 100px hit box, tracked via window `mousemove` (no DOM hit-area — never intercepts neighbouring clicks); spring `firm`; no-op on touch |
| `CountUp` | Number count-up | RAF loop, 1200ms, ease `1 - exp(-t*8)`, `Intl.NumberFormat("en-AE")`, direct `textContent` mutation (zero re-renders); triggers `useInView({ once: true, amount: 0.3 })` |
| `AnimatedFocusRing` | Form focus indicator morphs between fields | shared `layoutId="form-focus-ring"`, 2px blu-notte bar, spring `soft` |
| `ValidationMorph` | Error/success transitions | error enter `{ y: 8 → 0, opacity 0 → 1 }` 0.2s expo-out, asymmetric exit `y → -8` 0.15s (`AnimatePresence mode="wait"`); success checkmark `pathLength 0→1` 0.6s ease `[0.65, 0, 0.35, 1]` |
| `FormField` label | Floating label | `y: -16`, `scale: 12/16` (0.75) when floated, spring `soft`; origin left center |
| Contact submit | State crossfade + success bounce | `AnimatePresence` opacity crossfade 0.3s; success `scale: [1, 1.03, 1]` spring `snap`; loading sweep `translateX(-100%→100%)` 1.2s linear infinite; `navigator.vibrate(8)` on submit |
| Collections | Pinned horizontal scroll (≥1024px, motion-safe only) | `useScroll` offset `["start start", "end end"]`; track `x` = scrollYProgress × measured overflow (ResizeObserver); sticky 100dvh viewport; progress bar `scaleX` origin left, oro-antico fill |
| Nav header | Transparent → opaque | background pietra + sabbia-30% border when `scrollY > 100`, 250ms ease-out; on-dark state while over hero (`data-on-dark`) |
| Mobile overlay | Fade + drop | `opacity 0→1`, `translateY(-8px)→0`, 400ms expo-out |
| Hamburger | Lines → X | `translateY(±3.25px) rotate(±45deg)`, 250ms ease-out |

### §7.7 Hero background (`src/components/sections/Hero.tsx` + `.module.css`)

The hero background is a static image — there is no WebGL, canvas, or shader layer anywhere in
the codebase. Fabric still + scrim with bottom-edge mask fade per §3.5; the container is
`aria-hidden`, `pointer-events: none`, absolutely positioned at z-index 0 beneath the content
(`--z-base`). Because nothing in the background moves, it is inherently reduced-motion-safe
and connection-agnostic; `next/image` (`priority`) preloads it as the LCP element.

### §7.8 Reduced-motion policy (layered — all layers required for new work)

1. Global CSS collapses all duration tokens to 0ms; universal selector forces
   `animation-duration`/`transition-duration: 0ms !important`, `animation-iteration-count: 1`;
   `scroll-behavior: auto`.
2. `ScrollReveal` renders plain static markup (final state instantly).
3. `CountUp` renders the final value on mount.
4. `TiltCard` forces rotate 0 / scale 1, no shadow animation.
5. `MagneticButton` renders children unwrapped.
6. `AnimatedFocusRing` unmounts (colour-only focus remains).
7. Framer transitions receive `{ duration: 0 }` (ValidationMorph, FormField, Contact crossfades).
8. The hero background is a static image (§7.7) — no motion layer exists to disable.
9. Collections pinned mode disables itself (CSS media query + JS flag); mobile keeps the native
   scroll-snap row.
10. Hero CSS entrance animations are disabled with content forced visible.

Reduced motion means **gentler, not absent**: opacity/colour state changes remain; movement
is removed.

---

## §8 — Responsive Behaviour & Touch Targets

### §8.1 Breakpoints

Exactly three, mirrored in `src/lib/constants.ts`: **768px** (tablet), **1024px** (desktop),
**1440px** (desktop-xl). Mobile-first `min-width` queries; `max-width: 767px` only for
mobile-only overrides (mobile type scale, WhatsApp bar).

### §8.2 Per-component responsive behaviour

| Component | Mobile (<768) | Tablet (768–1023) | Desktop (≥1024) |
|---|---|---|---|
| Type scale | display 40 / h1 36 / h2 30 | desktop values | desktop values |
| Navigation | 56px bar, hamburger + full-screen overlay, wordmark 16px | 72px bar, inline links | 72px bar |
| Section container | 24px margins | 40px | 80px (120px @1440) |
| StatsStrip | 1 column, top hairlines | 3 columns, inline-start hairlines | 3 columns |
| Collections | native scroll-snap row, cards `min(76vw, 340px)` | cards `min(44vw, 400px)` | pinned horizontal showcase, spread cards |
| WhyImperium / Founder / Contact | single column stacks | single column | 12-col / 5fr-7fr / 7fr-5fr grids |
| PullQuote | 28px | 36px | 36px |
| WhatsApp CTA | fixed bottom bar (56px, gesso, carbone text) | hidden (inline CTAs only) | hidden |
| Footer | centered column; bottom padding = 56px bar clearance | rows spread apart | rows spread apart |

### §8.3 Touch targets

- **§8.6 — Primary touch target: 56px.** All primary CTAs and form inputs/selects have
  `min-block-size: 56px` (Button, WhatsAppButton, FormField inputs); textareas are 120px min.
- Secondary targets ≥ 48px (hamburger 56×56px box, hero text link 48px, nav CTA 40px at desktop
  pointer densities).
- All interactive elements: `touch-action: manipulation` (global); horizontal scrollers:
  `touch-action: pan-y`.
- Fixed chrome: nav (56/72px), mobile WhatsApp bar (56px, `--z-whatsapp-bar`), hamburger.

---

## §9 — Component Specifications

*Each spec cites its source files. Typography is referenced by the element types defined in §10
(e.g. **T4 · Eyebrow**) — apply those specs verbatim.*

### §9.01 Navigation (`src/components/layout/Navigation.tsx` + `.module.css`)

Fixed header, `z-index: 100`. Transparent at top; after `scrollY > 100`: `pietra` background +
1px sabbia-30% bottom border (250ms ease-out). Anchored sections clear the fixed bar via
`scroll-margin-block-start: var(--nav-height)` on `section[id]` (`globals.css`). While over
the dark hero (`data-on-dark="true"`):
wordmark → gesso, links → white-80 (hover gesso), CTA → gesso ghost, lang toggle → white-50;
the scrolled state always overrides back to light tokens. **No backdrop blur.**

- **Bar:** 56px mobile / 72px ≥768px; row = container pattern (§4.2), `justify-content: space-between`.
- **Wordmark:** **U1** variant — Cormorant 500, 18px / 16px mobile, carbone.
- **Desktop links:** **U1 · Nav Item** — 13px DM Sans 400, uppercase, 0.05em, ardesia → carbone
  + underline draw (§5.2); `gap: --space-lg`.
- **Nav CTA:** **U2 · Button (mini variant)** — ghost pill, `min-block-size: 40px`,
  `padding: 10px 20px`, 13px/500 blu-notte; hover fills; press `scale(0.97)`.
- **Language toggle:** 12px DM Sans 400, sabbia; active language carbone; `·` separator.
- **Hamburger (mobile only):** fixed 56×56px box, two 22×1.5px carbone lines, morphs to X (§7.6).
- **Mobile overlay:** full-screen `pietra`, z-index 200, fades/drops in 400ms; links are
  Cormorant 500, 32px (`--text-h3`), carbone, stacked `gap: --space-md`; footer of overlay holds
  the WhatsApp CTA (56px pill, whatsapp-green, gesso text). Escape closes, body scroll locks,
  `inert` when closed.

### §9.02 Hero (`src/components/sections/Hero.tsx` + `.module.css`)

100dvh (`min-block-size: 100svh`), `overflow: hidden`, `isolation: isolate`. Background:
static fabric still + scrim with bottom-edge mask fade (§3.5, §7.7). Content: centered column,
`gap: --space-md` (`--space-sm` mobile), z-index 1.

- **Eyebrow** ("Made in Italy"): **T4 · Eyebrow**, white-70 variant.
- **Wordmark:** PNG `width: min(480px, 80vw)`, whitened via `filter: brightness(0) invert(1)`.
  Typographic fallback: **T1 · Display** primary + 11px / 0.35em uppercase white-70 secondary.
- **Tagline:** **T5 · Body Large**, white-80, measure 540px.
- **CTA group:** `<MagneticButton>` + **U2 · Button (ghost-light)** "Explore our fabrics" +
  white **U3 · Text Link** "Request a sample →" (48px touch height, §5.2 embolden hover).
  Its href is `navigation.cta.href` — the same target as the nav CTA.
- **Scroll indicator:** 1×40px `sabbia` line (it sits inside the bottom fade zone, where the
  background has dissolved to `pietra`), pulses per §7.5.
- Entrance choreography: §7.5. Reduced motion: all visible, no animation.

### §9.03 StatsStrip (`src/components/sections/StatsStrip.tsx` + `.module.css`)

`<Section background="gesso" dense>` + `<ScrollReveal amount={0.3}>`. Three stats (data:
`src/data/stats.ts`) in the 3-up grid (§4.4). Cells: centered, `padding-block: --space-md`;
adjacent cells separated by the canonical hairline (sabbia 20%, §6.3). Each stat is **U5 · Stat**:
serif 42/30px number (animated by `CountUp`, §7.6) over a 13px sabbia caption.

### §9.04 Collections (`src/components/sections/Collections.tsx` + `.module.css`)

Custom section (not `<Section>`) — pietra band. Header uses the container pattern with
`<SectionHeader>` (eyebrow "Our collections" / headline "Fabric with a story." / subline) under
`<ScrollReveal amount={0.4}>`.

- **Mobile:** native horizontal scroll-snap row (`x mandatory`, hidden scrollbar), panels
  `min(76vw, 340px)`, snap center.
- **Desktop (≥1024, motion-safe):** pinned sticky showcase (§7.6) — outer height = 100dvh +
  track overflow; viewport sticky, padded by `--nav-height`; track inset aligns first/last panel
  to the 1200px content edge; progress indicator (2px, `min(320px, 30vw)`) with oro-antico fill.
- **FabricCard** (`src/components/ui/FabricCard.tsx` + `.module.css`) — wrapped in `TiltCard`:
  - Image: **U8 · Media**, aspect **4/5**, sabbia placeholder, `object-fit: cover`, 400×500.
  - Tagline: **T4 · Eyebrow**; hover/focus-within → oro-antico. `.taglineAccent` (Pezzi Unici)
    is permanently oro-antico.
  - Title: **T3 · Sub-heading (editorial italic variant)** — Cormorant italic 500, 28px, carbone.
  - Body: **T5 · Body**. CTA: **U3 · Text Link**, 14px; underline draws on card hover.
  - Desktop **spread layout**: row, image height `clamp(340px, 52vh, 560px)` (width = height ×
    4/5), text column `min(320px, 36ch)`, `gap: --space-lg`.

### §9.05 WhyImperium (`src/components/sections/WhyImperium.tsx` + `.module.css`)

`<Section background="gesso">` + `<ScrollReveal amount={0.15}>`. SectionHeader (eyebrow "Why
Imperium" / headline "Not just fabric. A guarantee of origin."), then numbered editorial rows
(`gap: --space-xl`, first row offset `margin-block-start: --space-xl`).

- Row layout: 12-col grid ≥1024, text `span 5` / media `span 7`; `.reversed` flips sides;
  the text-only closing row continues the left rail (span 1–6).
- Number ("01"…): **T4 · Eyebrow**. Heading: **T3 · Sub-heading (standard)**. Body: **T5 · Body**,
  measure 60ch.
- Media: route map full-width; stamp image `min(240px, 55vw)` — white-background PNG, **gesso
  bands only**.

### §9.06 Founder (`src/components/sections/Founder.tsx` + `.module.css`)

`<Section dense>` (pietra — dense padding keeps the gap to Contact, an adjacent pietra
band while Testimonials is dormant, from doubling up) holding two scroll reveals: the
portrait/bio grid and the quote + certification row (each `<ScrollReveal amount={0.25}>`,
§7.4).

- Grid `5fr 7fr` ≥1024 (`gap: --space-xl` mobile, desktop gutter ≥1024): portrait + caption
  left; SectionHeader (h2) + bio paragraphs (**T5 · Body**) right (`gap: --space-lg`).
- Portrait: **U8 · Media**, aspect **3/4**, sabbia placeholder; caption 11px sabbia below.
- **Quote row** (`.quoteRow`): full-width `7fr 5fr` grid ≥1024 — quote left, certification
  right, `align-items: center`, `margin-block-start: --space-xl`; stacks quote-over-
  certificate on mobile.
- **PullQuote** (`src/components/ui/PullQuote.tsx` + `.module.css`): centered, no own padding
  (rhythm belongs to the quote row); quote **T6 · Quote (feature)** — Cormorant italic 400,
  36px / 28px mobile, 1.3, carbone, no quotation marks; attribution **T4 · Eyebrow, oro-antico
  variant**, `margin-block-start: 24px`.
- Certification: image at exact aspect **2502/1770** (never crops), max 480px; fallback
  placeholder: 200px, aspect 3/2, 1px **dashed** sabbia-40% border.

### §9.07 Testimonials (`src/components/sections/Testimonials.tsx` + `.module.css`)

Dormant — renders `null` while `src/data/testimonials.ts` is empty (never render placeholder
names). When populated: `<Section>` (pietra), visually-hidden h2, centered column max 680px,
quotes stacked `gap: --space-xl`; quote **T6 · Quote (standard)** — Cormorant italic 400, 24px,
1.35, carbone; attribution **T7 · Caption** variant, 14px sabbia. `<ScrollReveal amount={0.2}>`.

### §9.08 Contact (`src/components/sections/Contact.tsx` + `.module.css`)

`<Section>` (pietra) + `<ScrollReveal amount={0.15}>`, grid `7fr 5fr` ≥1024 (`gap: --space-xl`;
single column mobile).

- **Details column:** SectionHeader; `<address>` stack (`gap: --space-sm`) — location **T5 ·
  Body**, email **U3 · Text Link**, inline **WhatsAppButton** (U2 whatsapp variant), Instagram
  link (14px sabbia → carbone + underline).
- **Form card:** the canonical **U6 · Surface (card)** recipe (§6.2) containing the form
  (`gap: --space-md`). Fields from `src/data/contact.ts`.
- **FormField** (`src/components/ui/FormField.tsx` + `.module.css`) — **U4 · Form Field**:
  underline-only inputs (1px sabbia bottom border, transparent bg, sharp corners), floating
  label (16px/500/uppercase/0.15em sabbia → blu-notte; floats `y: -16, scale 0.75`, spring
  `soft`), 56px input/select height, 120px textarea (`resize: vertical`), select with sabbia
  SVG chevron. Focus: blu-notte border + morphing `AnimatedFocusRing`. Error: border →
  `--color-error`, one-time 2px error-pulse line (`scaleX 0→1`, 0.6s), `ValidationMorph` message
  (13px error colour, `role="alert"`).
- **Submit:** full-width **U2 · Button (filled)** "Send inquiry"; pending → loading sweep;
  success → checkmark draw + scale bounce (§7.6); honeypot field is clipped offscreen.
- **Form note:** **T7 · Caption**, sabbia, with Privacy Policy TextLink.

### §9.09 Footer (`src/components/layout/Footer.tsx` + `.module.css`)

The site's dark full-stop: `carbone` band, gesso text; `padding-block: 80px / 40px` (mobile
bottom padding = `--whatsapp-bar-height` for bar clearance). Private tokens: `--_footer-bg /
-text / -muted` (carbone/gesso/sabbia), `--_footer-link-opacity: 0.7`. Inner = container pattern,
three centered rows (`gap: --space-sm`), spreading apart ≥768px:

1. **Top:** wordmark (Cormorant 500, 18px, gesso) + tagline (**T7 · Caption**, sabbia).
2. **Middle:** nav links + Privacy Policy — **U1 · Nav Item (footer variant)**: 13px DM Sans
   400, uppercase, 0.05em, gesso at 0.7 → 1.0 on hover/focus.
3. **Bottom:** legal line + socials (Instagram · WhatsApp) — **T7 · Caption (micro)**, 11px
   sabbia; socials → gesso on hover. "© Imperium Italian Textile. All rights reserved." — no
   year, by client decision.

### §9.10 Shared primitives

| Primitive | File | Spec |
|---|---|---|
| `Section` | `src/components/layout/Section.tsx` | Band wrapper: `background: pietra \\| gesso \\| carbone`, `dense` toggle, container inner (§4.2–4.3). `as` accepts `section/aside/article`. |
| `SectionHeader` | `src/components/ui/SectionHeader.tsx` | Eyebrow → headline → subline stack, `gap: --space-sm`. Headline h2 (42/30px, default) or h3 (32px) via `as`; subline **T5 · Body Large**, measure 540px. |
| `Eyebrow` | `src/components/ui/Eyebrow.tsx` | **T4 · Eyebrow** canonical implementation. |
| `Button` | `src/components/ui/Button.tsx` | **U2 · Button**: variants `ghost` (default) / `ghost-light` / `filled` / `whatsapp`; renders `<a>` when `href` present. |
| `TextLink` | `src/components/ui/TextLink.tsx` | **U3 · Text Link**: blu-notte, 500, animated underline draw. |
| `StatBlock` | `src/components/ui/StatBlock.tsx` | **U5 · Stat**: `CountUp` number + caption label. |
| `FabricCard` / `PullQuote` / `FormField` | `src/components/ui/` | Specified in §9.04 / §9.06 / §9.08. |
| `WhatsAppButton` | `src/components/ui/WhatsAppButton.tsx` | Inline: **U2 · Button (whatsapp variant)** in `MagneticButton`, white focus ring. Fixed mobile bar: 56px gesso bar, sabbia top border, carbone text, 8px green indicator dot, `--z-whatsapp-bar`; rendered site-wide from `layout.tsx`, hidden ≥768px. |
| Motion wrappers | `src/components/motion/` | `ScrollReveal`, `TiltCard` (+`TiltCardImage`), `MagneticButton`, `CountUp`, `AnimatedFocusRing`, `ValidationMorph` — §7.6. |

---

## §10 — Element-Type Taxonomy (master reference)

**Every element on the site is exactly one of the 15 types below — 7 text types, 8 UI types.
When adding any element: find its type, apply the spec verbatim (tokens, not literals), and
match its states. If no type fits, extend the system per §11 — never improvise a one-off style.**

### Text element types

#### T1 · Display
The hero-scale brand wordmark.

| Property | Value |
|---|---|
| Family / weight / style | `--font-serif` / 400 / normal |
| Size | `--text-display` — 72px / 40px |
| Line-height / tracking | 1 / 0.04em |
| Colour | context: `#fff` on dark hero |
| Motion | hero entrance (§7.5) |
| Source | `Hero.module.css` (`.wordmarkPrimary`) |

#### T2 · Heading
Section headlines — the serif voice of each band.

| Property | Value |
|---|---|
| Family / weight / style | `--font-serif` / 400 / normal |
| Size | `--text-h2` — 42px / 30px (h3 variant: `--text-h3` 32px, leading `--leading-h3` 1.3) |
| Line-height | `--leading-h2` 1.2 |
| Colour | `carbone` (gesso on carbone bands) |
| Motion | inherits parent `ScrollReveal` |
| Source | `SectionHeader.module.css` (`.headlineH2/.headlineH3`), base `h1–h4` in `globals.css` |

#### T3 · Sub-heading
Item-level serif headings inside sections.

| Property | Standard variant | Editorial italic variant |
|---|---|---|
| Family / weight | `--font-serif` / 500 | `--font-serif` / 500, italic |
| Size | `--text-subheadline` — 21px | 28px (hardcoded, see §11.3) |
| Line-height | `--leading-subheadline` 1.5 | `--leading-h4` 1.35 |
| Colour | `carbone` | `carbone` |
| Used for | WhyImperium item headings | FabricCard titles |
| Source | `WhyImperium.module.css` | `FabricCard.module.css` |

#### T4 · Eyebrow
The small uppercase tracked label — the site's signature micro-type.

| Property | Value |
|---|---|
| Family / weight / transform | `--font-sans` / 500 / uppercase |
| Size / tracking | `--text-eyebrow` 11px / `--tracking-eyebrow` 0.15em |
| Colour variants | `sabbia` (default) · `oro-antico` (attribution/accent) · white-70 (on dark) |
| Motion | colour transition 250ms where interactive (FabricCard tagline → oro-antico) |
| Used for | Section eyebrows, stat numbers' counterparts ("01"), pull-quote attribution, card taglines, image captions, form-adjacent micro-labels |
| Source | `Eyebrow.module.css` (canonical); echoed in `Hero`, `FabricCard`, `WhyImperium`, `PullQuote`, `Founder` modules |

#### T5 · Body
All reading text.

| Property | Base | Large variant |
|---|---|---|
| Family / weight | `--font-sans` / 400 | `--font-sans` / 400 |
| Size | `--text-body` 16px (never smaller) | `--text-body-large` 18px |
| Line-height | `--leading-body` 1.7 | 1.7 |
| Colour | `ardesia` | `ardesia` (white-80 on dark) |
| Extras | measure cap 60ch where editorial | measure cap 540px; hero adds `--tracking-caption` 0.02em |
| Used for | paragraphs, bios, locations | hero tagline, section sublines |
| Source | `globals.css` body; `SectionHeader`, `WhyImperium`, `Founder`, `FabricCard`, `Contact` modules |

#### T6 · Quote
Editorial serif-italic quotations. No quotation marks — let text breathe.

| Property | Feature variant | Standard variant |
|---|---|---|
| Family / weight / style | `--font-serif` / 400 / italic | `--font-serif` / 400 / italic |
| Size | 36px / 28px mobile (hardcoded, §11.3) | 24px (hardcoded, §11.3) |
| Line-height | 1.3 | `--leading-h4` 1.35 |
| Colour | `carbone` | `carbone` |
| Attribution | **T4 · Eyebrow**, oro-antico | **T7 · Caption**, 14px sabbia |
| Source | `PullQuote.module.css` | `Testimonials.module.css` |

#### T7 · Caption
Small supporting sans text — not uppercase (that is T4's job).

| Property | Standard | Micro variant |
|---|---|---|
| Family / weight | `--font-sans` / 400 | `--font-sans` / 400 |
| Size | `--text-caption` 13px | `--text-eyebrow` 11px |
| Tracking | `--tracking-caption` 0.02em (where specified) | — |
| Colour | `sabbia` (error variant: `--color-error`) | `sabbia` (→ gesso on footer-social hover) |
| Used for | stat labels, footer tagline, form notes, error messages, testimonial attribution | footer legal, social links |
| Source | `StatBlock`, `Footer`, `Contact`, `ValidationMorph` modules | `Footer.module.css` |

### UI element types

#### U1 · Nav Item
Navigation links in header, overlay, and footer.

| Property | Desktop header | Mobile overlay | Footer |
|---|---|---|---|
| Family / weight | `--font-sans` 400 | `--font-serif` 500 | `--font-sans` 400 |
| Size | `--text-caption` 13px | `--text-h3` 32px (leading 1.3) | 13px |
| Transform / tracking | uppercase / `--tracking-nav` 0.05em | none / — | uppercase / 0.05em |
| Colour rest → hover | `ardesia` → `carbone` + underline draw (§5.2) | `carbone` | gesso 0.7 → 1.0 opacity |
| On-dark | white-80 → gesso | — | — |
| Motion | colour + `::after` scaleX 250ms ease-out | overlay entrance 400ms | opacity 250ms |
| Source | `Navigation.module.css` | `Navigation.module.css` | `Footer.module.css` |

#### U2 · Button
The pill CTA — one geometry, four colour variants, one mini variant.

| Property | Value |
|---|---|
| Geometry | `min-block-size: 56px`; `padding-inline: --space-lg` (40px); `border-radius: 100px`; inline-flex, `gap: --space-xs` |
| Type | `--font-sans` / `--text-caption` 13px / 500 / `--tracking-label` 0.05em / uppercase |
| Variants | `ghost`: blu-notte 1px border + text → fills blu-notte, gesso text · `ghost-light`: gesso border/text → fills gesso, carbone text · `filled`: blu-notte bg, gesso text → 90%-black darken · `whatsapp`: #25d366 bg, gesso text → 90%-black darken |
| Mini variant (nav CTA) | `min-block-size: 40px`, `padding: 10px 20px`, no uppercase/tracking |
| States | press `scale(0.97)` @100ms · disabled opacity 0.5 · focus: global ring |
| Motion | colours 250ms `--motion-ease-standard`; transform 160ms `--motion-ease-out`; optional `MagneticButton` wrap |
| Source | `Button.module.css`, `Navigation.module.css` (mini), `WhatsAppButton.module.css` |

#### U3 · Text Link
Inline links with the drawn underline.

| Property | Value |
|---|---|
| Colour / weight | `blu-notte` / 500 (inherits size/family from context; white on dark hero; 14px in cards) |
| Underline | `linear-gradient(currentColor, currentColor)` background, `0% 1px → 100% 1px` at bottom-left, `padding-block-end: 2px` |
| Motion | `background-size` 250ms `--motion-ease-standard` (400ms on card CTAs) |
| Touch | 48px min height where standalone (hero) |
| Source | `TextLink.module.css`, `Hero.module.css`, `FabricCard.module.css` |

#### U4 · Form Field
Underline inputs with floating labels (full behavior spec: §9.08).

| Property | Label | Input |
|---|---|---|
| Type | sans 16px / 500 / uppercase / 0.15em | sans 16px / 400 / 1.7 |
| Colour | `sabbia` → `blu-notte` (floated) | text `carbone`; placeholder sabbia 0.7 |
| Chrome | floats `y:-16, scale 0.75`, spring `soft` | 1px sabbia bottom border → `blu-notte` on focus, → `--color-error` on error; transparent bg; radius 0 |
| Heights | — | input/select 56px; textarea 120px |
| Error message | — | **T7 · Caption**, `--color-error`, morphs in (§7.6) |
| Source | `FormField.module.css` | `FormField.module.css`, `ValidationMorph.module.css` |

#### U5 · Stat
Proof numbers with labels.

| Property | Number | Label |
|---|---|---|
| Type | `--font-serif` 400, `--text-h2` 42/30px, 1.2 | **T7 · Caption** — sans 13px, 0.02em |
| Colour | `carbone` | `sabbia` |
| Motion | `CountUp` 1200ms on 30% in-view | — |
| Layout | centered stack, `gap: --space-xs`; hairline between cells (§6.3) | |
| Source | `StatBlock.module.css`, `StatsStrip.module.css` | |

#### U6 · Surface
Bands and cards.

| Variant | Spec |
|---|---|
| Band — pietra | `background: #faf8f3`; default page band |
| Band — gesso | `background: #ffffff`; alternating band |
| Band — carbone | `background: #1a1a1a; color: #fff`; footer only |
| Card | gesso bg + 1px sabbia-20% border + `padding: --space-lg`; no radius, no shadow |
| Rhythm | `padding-block: --section-padding-y` (dense: `--subsection-padding-y`) |
| Source | `Section.module.css`, `Contact.module.css` (card) |

#### U7 · Divider
The single hairline recipe: **1px, sabbia at 20–40%** (§6.3). Never heavier, never a different
colour, never between sections (whitespace separates). Sources: `StatsStrip`, `Contact`,
`Navigation`, `Collections`, `Founder` modules.

#### U8 · Media
Imagery treatment.

| Property | Value |
|---|---|
| Corners / borders | sharp rectangles, no borders (cert placeholder excepted: dashed sabbia-40%) |
| Placeholder | `sabbia` background behind every image |
| Aspect ratios | fabric cards **4/5** · founder portrait **3/4** · certification **2502/1770** (exact, uncropped) · maps/stamps natural |
| Sizing | `object-fit: cover` in fixed-ratio frames; hero wordmark `min(480px, 80vw)` |
| Interactive treatment | only on FabricCard: TiltCard tilt + image scale 1.05 + shadow lift (§7.6) |
| On-dark logos | `filter: brightness(0) invert(1)` to whiten the brown wordmark |
| Source | `FabricCard`, `Founder`, `WhyImperium`, `Hero` modules |

---

## §11 — Governance & Extension Rules

### §11.1 Adding new elements — checklist

1. **Classify first.** Pick the element type from §10. If none fits, propose a new type in this
   file (with full spec) before writing component CSS — do not ship a one-off.
2. **Tokens only.** No raw hex, px font-sizes, or ms durations in component CSS unless the value
   is registered here (§11.3 anomaly register).
3. New colour needs → derive from §3.4 patterns; new accents are forbidden (§1.2).
4. New motion needs → use §7 tokens/springs; ease-out entries; ≤400ms UI; hover-gated;
   transform/opacity only; and add a reduced-motion fallback per §7.8.
5. New surfaces → sharp corners, §6.2 card recipe, hairlines only per §6.3.
6. Respect §4 container/rhythm and §8 touch targets. Use CSS logical properties.
7. **Update this file in the same change** when any token, value, type, or component spec
   changes. Code comments citing `DESIGN.md §x` must keep resolving.

### §11.2 Reserved tokens (defined, awaiting features — do not repurpose)

`--color-terracotta` (error alt / map pin) · `--color-success` ·
`--font-weight-semibold` + Cormorant SemiBold face · `--text-h1`, `--text-h4`, `--leading-h1`,
`--leading-display` · `--element-padding-y` · `--space-2xl`, `--space-3xl` · `childReveal`.

### §11.3 Anomaly register (sanctioned hardcoded values — do not propagate)

| Value | Location | Note |
|---|---|---|
| 36px / 28px quote | `PullQuote.module.css` | off-scale; keep local |
| 28px italic title, 14px CTA | `FabricCard.module.css` | off-scale; keep local |
| 24px quote / 14px attribution | `Testimonials.module.css` | off-scale; dormant section |
| 18/16/12/14px nav & footer sizes | `Navigation.module.css`, `Footer.module.css` | chrome-specific |
| `#fff` literal | `Hero.module.css` | use `--color-gesso` in new code |
| `%23B8A99A` in data-URI SVG | `FormField.module.css` | URL-encoding requires literal |

### §11.4 Known documentation drift (as of writing)

- Comments referencing `MOTION_SPEC.md §x` resolve to §7 of this file.

---

*End of DESIGN.md — Imperium Italian Textile. Keep it accurate; the system is only as trustworthy
as this file.*

# Imperium Italian Textile — Build Progress Tracker

**Project root:** `/Users/akshaymsingh/Documents/Liberate/Imperium`  
**Last updated:** 2026-07-07  
**Completed phases:** 1, 2, 3, 4, 5  
**Next phase:** 6 — Polish + Performance + Launch (in progress: Silk Hero Experience, `docs/superpowers/specs/2026-07-07-silk-hero-experience-design.md`)

## Quality gate status (last verified)

| Check                         | Result                      |
| ----------------------------- | --------------------------- |
| `npm run typecheck`           | ✅ Pass                     |
| `npm run lint`                | ✅ Pass                     |
| `npm run test`                | ✅ 61/61 pass               |
| `npm run build`               | ✅ Success                  |
| Dev server (`localhost:3000`) | ✅ 200, all sections render |

Build output: `/` route 25.2 kB (gzipped), First Load JS 169 kB (uncompressed). Shared JS chunks total ~102 kB gzipped; combined first-load JS is ~127 kB gzipped, under the 130 kB budget.

---

## Executive summary

Phases 1–5 are complete. The site now includes the full premium touchpoint layer on localhost: cursor-aware TiltCards, MagneticButton CTAs, animated form focus ring, ValidationMorph feedback, and the Embla carousel for collections. All motion respects `prefers-reduced-motion` and touch devices.

Phase 6 is the final polish, performance audit, and launch block.

**2026-07-07 — Silk Hero Experience:** the hero's never-sourced background video is replaced by a live, cursor-reactive WebGL silk simulation (`src/components/silk/`). This is a scoped, documented exception to the Three.js/WebGL exclusion in `TECHNICAL_ARCHITECTURE.md` (hero only — see that file's amended row) and adds a new §3.8 to `MOTION_SPEC.md`. Decisions D-S1–D-S6 proceeded on the spec's stated defaults (no video ever existed to preserve; white-on-champagne kept; live sim on mobile with idle-only fallback; Lenis deferred; Akshay named shader co-owner). Sofia's three checkpoints (§10 of the spec) are still outstanding and should happen before this ships to production content review, independent of this code landing on `main`.

All five implementation phases (§4 of the spec) are built and independently re-verified against running code, not just described:

- **Phase 0 (governance):** `TECHNICAL_ARCHITECTURE.md`, `MOTION_SPEC.md`, `PRD.md` amended; this file's asset backlog updated (below).
- **Phase 1 (canvas foundation):** `SilkHero.tsx` capability-gates on WebGL2 support, `prefers-reduced-motion`, slow-connection/`save-data`, and a `NEXT_PUBLIC_SILK_HERO` kill switch — every gate resolves to the same static poster, verified via a mounted-state hydration fix (see below) and unit tests mocking the capability probe.
- **Phase 2 (the still):** custom GLSL heightfield (art-directed drape + fbm detail + a calm plateau behind the wordmark), anisotropic Kajiya-Kay sheen, Charlie sheen, wrap diffuse, curvature AO, champagne colour ramp, dither + grain, vignette. Screenshot-verified in a real Chromium session (Playwright), not just "it compiles."
- **Phase 3 (life):** idle drift/breath and a one-shot entry tension wave, both driven by `SilkPlane`'s own `useFrame` clock.
- **Phase 4 (the touch)** ⭐ hardest phase: a ping-pong half-float FBO (`useSilkSimulation.ts`) advances an over-damped spring-membrane wave equation per frame; the pointer brush elongates along drag velocity so folds form perpendicular to the stroke (the detail that separates "silk" from "water" per the spec). Verified interactively via a scripted Playwright cursor drag — a visible fold trail forms and persists with inertia.
- **Phase 5 (integration):** scroll parallax (~0.9×) + a bottom dissolve into Pietra; rendering pauses via `frameloop="never"` when scrolled offscreen or the tab is hidden; `webglcontextlost`/`restored` handlers swap to/from the poster; canvas is `aria-hidden`.

**Two real bugs caught and fixed during this verification pass** (both invisible to `npm run test`/`typecheck`/`build` — only surfaced by actually rendering the shader in a real browser, which is why that step was worth doing):

1. **Numerically unstable wave simulation.** `shaders/simulation.frag.ts`'s discrete Laplacian wasn't divided by the grid spacing squared (`dx²`) — an explicit finite-difference solver missing this is a textbook CFL-stability violation. `touch.waveSpeed` in `silk.config.ts` dropped from `0.9` to `0.05` to compensate once the physics were corrected; a velocity clamp was added as a defense-in-depth backstop.
2. **A dither/grain hash with visible structure.** Two different per-pixel noise functions were tried and rejected before landing on the current one in `shaders/lighting.ts`: interleaved-gradient-noise (meant for temporal/TAA averaging, not a static sample) and then a 2-constant hash whose near-identical magic numbers (`0.1031`/`0.1030`) aliased against integer `gl_FragCoord` pixel coordinates into a short repeat period. Both read as a visible regular grid across the whole surface on real GPU hardware — not the subtle film grain intended. The current 3-component hash (Inigo Quilez / Patricio Gonzalez Vivo construction) doesn't exhibit this.

Also worth recording: **initial testing was done against Playwright's default headless Chromium, which uses SwiftShader (software rendering), not a real GPU** — this masked/altered how the above bugs presented (the grid was scroll-position-dependent under SwiftShader, constant under real Metal/hardware rendering). Verification was redone with `--use-gl=angle --use-angle=metal` to force real GPU rendering before treating any visual result as trustworthy. Worth remembering for any future WebGL work in this repo: screenshot-based visual testing needs a real-GPU browser launch flag, or it can both hide real bugs and manufacture fake ones.

**Honest gaps, not yet closed** (tracked in `src/components/silk/README.md` "Known gaps" and the backlog below): the resting-frame poster images are still the pre-existing flat SVG placeholders, not a real export of the shader's still frame; the weave micro-detail is procedural, not an authored normal-map texture; and — most importantly — **the art direction is a first pass, not a client-calibrated final look.** The spec's own Phase 2 "money-shot gate" (checkpoint 2, §10) and Phase 4 "does it feel like silk under your hand?" (checkpoint 3) have not happened with Sofia yet. First-pass tuning already caught and corrected one real bug worth knowing about: the initial camera setup (close, wide-angle) turned the heightfield's Z displacement into visible wide-angle-lens perspective distortion (a pinched-diamond silhouette instead of a flat sheet) — fixed by moving to a distant, narrow-FOV camera, which is now the documented default in `SilkCanvas.tsx`.

**Bundle impact — measured, not estimated:** the Three.js/R3F/drei code is `next/dynamic(..., { ssr: false })`-loaded and stays out of the initial bundle entirely — `/` route First Load JS moved from 169 kB → 171 kB (2 kB, from the small always-loaded wrapper code). The lazy chunk that loads only when a capable browser mounts the live canvas measures **~187 kB gzip** (742 kB raw across two chunks, gzip-measured directly from the production build output), matching the spec's own ~180–200 kB estimate closely. This chunk never loads at all on the poster path (no WebGL2, reduced motion, save-data, or the kill switch).

---

## Phase 1 — Foundation

| #    | Task                             | Status  | Evidence                                 | Notes                                                                                      |
| ---- | -------------------------------- | ------- | ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| 1.1  | Initialise Next.js project       | ✅ Done | `package.json`                           | Next.js 15, React 19, TypeScript, App Router, `src/` directory                             |
| 1.2  | Remove boilerplate               | ✅ Done | `src/app/page.tsx`, `src/app/layout.tsx` | Default Next.js UI removed                                                                 |
| 1.3  | Set up folder structure          | ✅ Done | `src/` tree                              | Matches `TECHNICAL_ARCHITECTURE.md` §2                                                     |
| 1.4  | Install dependencies             | ✅ Done | `package.json`                           | `framer-motion`, `embla-carousel-react`, `resend`, `@types/node`                           |
| 1.5  | Configure `next.config.ts`       | ✅ Done | `next.config.ts`                         | Image formats, security headers, `poweredByHeader: false`                                  |
| 1.6  | Add fonts to `/public/fonts/`    | ✅ Done | `/public/fonts/`                         | 7 WOFF2 files, self-hosted                                                                 |
| 1.7  | Write `globals.css`              | ✅ Done | `src/app/globals.css`                    | Full token system, font-face declarations with CLS fallback metrics, reset, reduced-motion |
| 1.8  | Configure fonts in `layout.tsx`  | ✅ Done | `src/app/layout.tsx`                     | Preloads Cormorant Regular + DM Sans Regular                                               |
| 1.9  | Create `Section` wrapper         | ✅ Done | `src/components/layout/Section.tsx`      | Background variants, responsive margins                                                    |
| 1.10 | Create `Eyebrow` component       | ✅ Done | `src/components/ui/Eyebrow.tsx`          |                                                                                            |
| 1.11 | Create `SectionHeader` component | ✅ Done | `src/components/ui/SectionHeader.tsx`    | Eyebrow + headline + subline                                                               |
| 1.12 | Create `Button` component        | ✅ Done | `src/components/ui/Button.tsx`           | Ghost, filled, WhatsApp variants                                                           |
| 1.13 | Create `TextLink` component      | ✅ Done | `src/components/ui/TextLink.tsx`         | Animated underline                                                                         |

---

## Phase 2 — Navigation + Hero

| #    | Task                                        | Status     | Evidence                                 | Notes                                                                              |
| ---- | ------------------------------------------- | ---------- | ---------------------------------------- | ---------------------------------------------------------------------------------- |
| 2.1  | Build `Navigation` component                | ✅ Done    | `src/components/layout/Navigation.tsx`   | Wordmark, links, CTA, language toggle, transparent→opaque transition               |
| 2.2  | Build mobile navigation                     | ✅ Done    | `Navigation.tsx` + `.module.css`         | Full-screen overlay, two-line hamburger, WhatsApp CTA at bottom                    |
| 2.3  | Build `Hero` section                        | ✅ Done    | `src/components/sections/Hero.tsx`       | 100dvh, poster, gradient overlay, headline/subline/CTAs, scroll indicator, caption |
| 2.4  | Implement hero video loading                | ✅ Done    | `Hero.tsx`, `useIntersectionObserver.ts` | Lazy preload, connection check, `playsInline`, reduced-motion fallback             |
| 2.5  | Source/prepare hero video                   | ⏳ Pending | `/public/video/` empty                   | SVG poster placeholders only. Real MP4 + poster JPEG swapped in fine-tune          |
| 2.6  | Hero entry animation                        | ✅ Done    | `Hero.module.css`                        | CSS `@keyframes`, 80 ms cascade                                                    |
| 2.7  | Write `useReducedMotion` hook               | ✅ Done    | `src/hooks/useReducedMotion.ts`          |                                                                                    |
| 2.8  | Write `useIntersectionObserver` hook        | ✅ Done    | `src/hooks/useIntersectionObserver.ts`   |                                                                                    |
| 2.9  | Rewrite `ScrollReveal` to use Framer Motion | ✅ Done    | `src/components/motion/ScrollReveal.tsx` | `whileInView`, `viewport.once: true`, stagger                                      |
| 2.10 | Add motion token system to `globals.css`    | ✅ Done    | `globals.css`                            | All duration/ease/distance tokens, reduced-motion collapse                         |
| 2.11 | Create `lib/motion.ts`                      | ✅ Done    | `src/lib/motion.ts`                      | `springs`, `sectionReveal`, `childReveal`                                          |
| 2.12 | Confirm motion bundle impact                | ⚠️ Partial | Build succeeds                           | Final impact unverified until Phase 5 components + Embla are integrated            |

---

## Phase 3 — Content Sections

| #    | Task                                   | Status     | Evidence                                            | Notes                                                                        |
| ---- | -------------------------------------- | ---------- | --------------------------------------------------- | ---------------------------------------------------------------------------- |
| 3.1  | Build `OriginMap` section              | ✅ Done    | `src/components/sections/OriginMap.tsx`             | 7/5 grid, inline SVG map                                                     |
| 3.2  | Create origin map SVG                  | ✅ Done    | `OriginMap.tsx`                                     | Programmatic SVG placeholder; commissioned illustration swapped in fine-tune |
| 3.3  | Build `StatsStrip` section             | ✅ Done    | `src/components/sections/StatsStrip.tsx`            | Gesso band, four stat cells                                                  |
| 3.4  | Build `CountUp` component              | ✅ Done    | `src/components/motion/CountUp.tsx`                 | RAF-driven, spring-eased, direct DOM mutation, reduced-motion fallback       |
| 3.5  | Build `Collections` section            | ✅ Done    | `src/components/sections/Collections.tsx`           | `SectionHeader` + three `FabricCard`s                                        |
| 3.6  | Build `FabricCard` component           | ✅ Done    | `src/components/ui/FabricCard.tsx`                  | 4:5 image, tag strip, italic title, body, CTA, 1.03 hover scale              |
| 3.7  | Source/prepare fabric photography      | ⏳ Pending | `/public/images/fabrics/` SVGs only                 | Stock/fabric photography swapped in fine-tune                                |
| 3.8  | Populate `data/` files                 | ✅ Done    | `src/data/collections.ts`, `src/data/navigation.ts` |                                                                              |
| 3.9  | Mobile horizontal scroll for cards     | ✅ Done    | `Collections.module.css`                            | `scroll-snap-type: x mandatory`, 85vw cards                                  |
| 3.10 | Connect `ScrollReveal` to all sections | ✅ Done    | Section wrappers                                    | OriginMap, Collections, TrustPillars, Founder, Contact                       |

---

## Phase 4 — Trust + Identity + Contact

| #    | Task                             | Status     | Evidence                                                                 | Notes                                                                 |
| ---- | -------------------------------- | ---------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| 4.1  | Build `TrustPillars` section     | ✅ Done    | `src/components/sections/TrustPillars.tsx`                               | Gesso band, 4 numbered pillars, dividers                              |
| 4.2  | Build `Founder` section          | ✅ Done    | `src/components/sections/Founder.tsx`                                    | 5/7 split, portrait, bio, pull quote, certification slot              |
| 4.3  | Build `PullQuote` component      | ✅ Done    | `src/components/ui/PullQuote.tsx`                                        | Cormorant italic + Oro Antico attribution                             |
| 4.4  | Add certification image          | ✅ Done    | `Founder.tsx`                                                            | Text-only placeholder when `certification.src` is `null`              |
| 4.5  | Source Sofia's portrait          | ⏳ Pending | `/public/images/about/sofia-portrait.svg` placeholder                    | Real 3:4 portrait swapped in fine-tune                                |
| 4.6  | Build `Testimonials` section     | ✅ Done    | `src/components/sections/Testimonials.tsx`                               | Conditional render, centred column                                    |
| 4.7  | Testimonial visibility logic     | ✅ Done    | `Testimonials.tsx`                                                       | Returns `null` when array is empty                                    |
| 4.8  | Populate `data/` files           | ✅ Done    | `src/data/pillars.ts`, `src/data/founder.ts`, `src/data/testimonials.ts` |                                                                       |
| 4.9  | Build `Contact` section          | ✅ Done    | `src/components/sections/Contact.tsx`                                    | 7/5 split, details left, form right                                   |
| 4.10 | Build `FormField` component      | ✅ Done    | `src/components/ui/FormField.tsx`                                        | Underline inputs, textarea, custom select, errors                     |
| 4.11 | Build `WhatsAppButton` component | ✅ Done    | `src/components/ui/WhatsAppButton.tsx`                                   | Inline pill + fixed mobile bar                                        |
| 4.12 | Build mobile fixed WhatsApp bar  | ✅ Done    | `WhatsAppButton.tsx` + `layout.tsx`                                      | 56px, mobile-only, persistent                                         |
| 4.13 | Implement form submission        | ✅ Done    | `src/app/actions/contact.ts`                                             | Server action, validation, honeypot, rate limit, mock when no API key |
| 4.14 | Build form states                | ✅ Done    | `Contact.tsx`                                                            | Loading, success, error                                               |
| 4.15 | Set up Resend integration        | ✅ Done    | `src/lib/email.ts`                                                       | Wired; mocks + logs payload when `RESEND_API_KEY` absent              |
| 4.16 | Build `Footer`                   | ✅ Done    | `src/components/layout/Footer.tsx`                                       | Dark band, wordmark, links, socials, legal line                       |
| 4.17 | Populate `data/` files           | ✅ Done    | `src/data/contact.ts`                                                    | Contact details + form configuration                                  |
| 4.18 | Add form validation              | ✅ Done    | `Contact.tsx` + `actions/contact.ts`                                     | Client + server; no external library                                  |

### Phase 4 decisions locked in

- Contact form includes **Email (required)** and **Phone/WhatsApp (optional)** per PRD D-08.
- `/api/contact` route returns **405 Method Not Allowed**; the React Server Action is the single entry point (PRD F-1).
- A minimal `/privacy` page was added so the consent microcopy and Footer Privacy Policy links are not broken.
- Founder portrait uses an SVG placeholder until Sofia provides a real 3:4 photograph.

---

## Phase 5 — Premium Touchpoint Layer: Complete ✓

### Motion components implemented

| Component           | File                                                | Status  | Spec reference        |
| ------------------- | --------------------------------------------------- | ------- | --------------------- |
| `ScrollReveal`      | `src/components/motion/ScrollReveal.tsx`            | ✅ Done | `MOTION_SPEC.md` §3.6 |
| `CountUp`           | `src/components/motion/CountUp.tsx`                 | ✅ Done | `MOTION_SPEC.md` §3.7 |
| `TiltCard`          | `src/components/motion/TiltCard.tsx`                | ✅ Done | `MOTION_SPEC.md` §3.1 |
| `MagneticButton`    | `src/components/motion/MagneticButton.tsx`          | ✅ Done | `MOTION_SPEC.md` §3.2 |
| `AnimatedFocusRing` | `src/components/motion/AnimatedFocusRing.tsx`       | ✅ Done | `MOTION_SPEC.md` §3.3 |
| `ValidationMorph`   | `src/components/motion/ValidationMorph.tsx`         | ✅ Done | `MOTION_SPEC.md` §3.4 |
| `EmblaContainer`    | `src/components/motion/Carousel/EmblaContainer.tsx` | ✅ Done | `MOTION_SPEC.md` §3.5 |
| `CarouselSlide`     | `src/components/motion/Carousel/CarouselSlide.tsx`  | ✅ Done | `MOTION_SPEC.md` §3.5 |

### Integration tasks

| Roadmap | Task                                                        | Status  | Notes                                                                        |
| ------- | ----------------------------------------------------------- | ------- | ---------------------------------------------------------------------------- |
| 5.6     | Wrap `FabricCard` with `TiltCard`                           | ✅ Done | Static hover scale removed; image scale driven by `TiltCardImage`            |
| 5.7     | Integrate `AnimatedFocusRing` + `ValidationMorph` into form | ✅ Done | `FormField` converted to client; floating labels + focus ring + error states |
| 5.8     | Replace `Collections` grid with `EmblaContainer`            | ✅ Done | Full-bleed, viewport-relative slides; pagination dots with `layoutId`        |
| 5.9     | Apply `MagneticButton` to primary CTAs                      | ✅ Done | Hero "Explore", inline WhatsApp; form submit kept static for success morph   |
| 5.10    | Verify `CountUp` spring easing                              | ✅ Done | RAF + critically-damped spring; no React re-renders                          |
| 5.11    | Add `touch-action: manipulation` globally                   | ✅ Done | Added to globals.css; carousel track uses `pan-y` override                   |
| 5.12    | Replace `100vh` with `100dvh`                               | ✅ Done | Hero and mobile nav overlay already use `100dvh` / `100svh` fallback         |

### Phase 5 design decisions applied

1. **Carousel layout on desktop:** single-slide draggable carousel on both mobile and desktop, full-bleed viewport-relative slide widths.
2. **Form label behaviour:** floating labels with 16 px rise and 12 px final size, Blu Notte on focus.
3. **Hero "Explore" CTA:** uses shared `Button` with a new `ghost-light` variant wrapped by `MagneticButton`.
4. **Bundle strategy:** `EmblaContainer` is lazy-loaded via `next/dynamic` (SSR enabled); remaining motion components are small enough to ship in the main chunk. First-load JS stays under the 130 kB gzip budget.

### Quality notes

- All hover-only motion is gated behind `@media (hover: hover) and (pointer: fine)` to avoid false hover states on touch.
- Press feedback added to `Button` and the navigation CTAs with asymmetric 100 ms press / 160 ms release timing.
- `useReducedMotion` now initializes from `window.matchMedia` to avoid a one-frame motion flash for reduced-motion users.
- `springs.soft` updated to `{ stiffness: 200, damping: 22 }` to match `MOTION_SPEC.md` §3.3.

---

## Phase 6 — Polish + Performance + Launch: Readiness

### Next work

Phase 6.A is entirely localhost-testable:

1. Run Lighthouse audits (target > 95 across Performance, Accessibility, SEO, Best Practices).
2. Audit CLS across all sections.
3. Cross-browser testing (Chrome, Safari, Firefox; mobile Safari + Chrome).
4. Real-device mobile testing (iPhone Safari, Android Chrome).
5. Implement SEO metadata, sitemap, robots.txt, JSON-LD, canonical/OG tags.
6. Add Plausible Analytics script + custom events (form submit, WhatsApp click, Instagram click).
7. Add skip-to-content link.
8. Keyboard navigation and focus audit.
9. Image alt-text audit.
10. Final content review.
11. Security headers in `next.config.ts`.
12. Custom 404 page.

Phase 6.B is production-only:

- Deploy to Vercel, connect custom domain, configure Resend domain verification, submit sitemap to Search Console.

### Placeholder / fine-tune backlog

These must be resolved before launch:

- [x] Hero video MP4 (desktop + mobile) and poster JPEG — **superseded 2026-07-07**: replaced entirely by the silk hero WebGL experience (`docs/superpowers/specs/2026-07-07-silk-hero-experience-design.md`, D-S1); no video was ever sourced, and this line item is closed by removing the requirement, not by fulfilling it. Removes a videography line from the client's budget.
- [x] Client wordmark logo — derived transparent asset via `scripts/derive-brand-assets.mjs`, `SITE.logoSrc` set (2026-07-06)
- [x] Italy→Gulf route illustration in the Why Imperium map slot (2026-07-06)
- [x] Made in Italy stamp artwork in the Why Imperium stamp slot (2026-07-06)
- [x] Real fabric photography ×4 on collection cards — client re-export landed (2026-07-07), replacing the softer 2026-07-06 batch (`tessuti-italiani.png`, `pezzi-unici.png`, `ospitalita-di-lusso.png`, `interior-exterior.png`, all now consistent 627×627px). Still square, not the ≥800×1000 portrait crop originally requested — `FabricCard` renders at a 4:5 aspect ratio, so `object-fit: cover` trims the left/right edges of each square photo. Looks correct in review; revisit with the client only if a future re-export can supply the portrait crop.
- [x] Sofia’s 3:4 portrait (2026-07-06)
- [x] Made in Italy certification scan wired in as-is per user decision — Sofia’s explicit OK on the visible DOB/date still recommended before launch (2026-07-06)
- [ ] ≥1 real testimonial
- [ ] Real WhatsApp Business number
- [ ] `RESEND_API_KEY`, `RESEND_FROM`, `RESEND_TO` environment variables
- [ ] Final legal entity name for Footer copyright
- [ ] Custom 404 page styling (Phase 6.12)
- [ ] useReducedMotion's SSR-safe initializer needs a fix: it returns false on the server but can read true on the client's first render when prefers-reduced-motion is already active, causing a hydration mismatch (React error #418) on components it gates (e.g. MagneticButton in Hero). Reproduced at 1440x900 and 390x844 under forced reduced-motion. Pre-existing, not introduced by this branch; fix is to initialize state to false and flip it post-mount in an effect, matching useMediaQuery's SSR-safe pattern.
- [ ] Silk Hero art-direction calibration against reference photography with Sofia (spec checkpoints 2 & 3, §10) — current tuning is a first pass that compiles and runs correctly but is not client-approved
- [x] Silk Hero resting-frame poster export (hero-collections-refinement plan, Task 2) — `public/images/hero/hero-still.jpg` (3840×2160) captured via `scripts/capture-hero-still.mjs`. **Scope note for future readers of `silk.config.ts`'s "first-pass, needs calibration" comments:** the task was originally scoped as "raise two config dials only" (`drape.foldDepth`, `weave.amplitude`), but that proved insufficient — the pre-existing 4-octave fold sum in `silk.vert.ts`'s `staticDrape()` tops out at ~4.9 cycles across the plane, a hard frequency ceiling no amount of amplitude scaling can raise, so the still kept reading as soft/flat rather than as creased fabric. Human-authorized a small, additive GLSL edit (two higher-frequency octaves in `staticDrape()`, plus reducing `drape.plateauFlatten` 0.85→0.6) to actually add crease-edge definition — see `.superpowers/sdd/task-2-report.md` for the full root-cause trace and before/after evidence. The real fix for this class of "still reads as blurry" issue lives in the vertex shader's fold-frequency construction, not in `silk.config.ts`'s dials.
- [ ] Silk Hero authored tileable weave normal map (~512px) to replace the current procedural in-shader stand-in
- [ ] Silk Hero real-device thermal + Lighthouse CLS pass (MOTION_SPEC.md §6 "Silk Hero-specific" checklist)
- Hero still (`/images/hero/hero-still.jpg`) is a 4K capture of the silk shader's
  resting frame (scripts/capture-hero-still.mjs). A real hero photograph from the
  client remains requested and is a one-line swap in Hero.tsx. **Superseded
  2026-07-15**: the client hero photo landed (2026-07-14) but at 1555×1012 —
  below the ≥3840×2160 sharpness floor for a fullscreen Retina hero — so it was
  replaced by an interactive silk fabric WebGL background rendered from a
  deterministic offline still (`scripts/render-silk-still.mjs`, client-selected
  "corner drape" variant) with cursor-driven deformation
  (`src/components/silk/fabric/`, spec
  `docs/superpowers/specs/2026-07-14-silk-hero-interactive-background-design.md`).
  Quality verified via `node scripts/verify-silk-quality.mjs` (resolution/no-stretch
  matrix) plus a real, non-headless GPU measurement (60fps on this Mac).
- Silk WebGL module retained in src/components/silk/ but unmounted from Hero
  (client direction 2026-07-07: hero must be static after entrance). three.js
  deps retained pending a removal decision. The **new** texture-based silk
  fabric layer in src/components/silk/fabric/ (2026-07-15) is a separate,
  mounted module — see above — and reuses `useSilkPointer`/`useSilkSimulation`
  from this retired module but not its procedural shaders.
- Collection fabric PNGs are 627×627; client re-exports at ≥1200px still requested.

### Risks / blockers for Phase 6

| #   | Risk                                                   | Mitigation                                                               |
| --- | ------------------------------------------------------ | ------------------------------------------------------------------------ |
| 1   | Lighthouse Performance may drop after motion additions | Audit images, fonts, third-party scripts; lazy-load below-fold media     |
| 2   | Real-device touch behaviour may differ from DevTools   | Test on actual iPhone and Android devices before approving Phase 6.B     |
| 3   | Domain / Resend verification may delay launch          | Begin domain registration and DNS setup as soon as Phase 6.A is approved |
| 4   | External assets still placeholders                     | Swap in real assets during Phase 6.A fine-tune pass                      |

---

## Notes for future agents

- Read `DESIGN.md`, `MOTION_SPEC.md`, and `TECHNICAL_ARCHITECTURE.md` before touching motion code.
- Respect `prefers-reduced-motion` via the existing `useReducedMotion` hook and the CSS token collapse in `globals.css`.
- Keep all motion values in `src/lib/motion.ts` or CSS custom properties — no inline magic numbers.
- All Framer-driven components must be `'use client'`.
- The contact form server action is the single submission path; do not reopen `/api/contact` without explicit approval.

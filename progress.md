# Imperium Italian Textile — Build Progress Tracker

**Project root:** `/Users/akshaymsingh/Documents/Liberate/Imperium`  
**Last updated:** 2026-07-05  
**Completed phases:** 1, 2, 3, 4  
**Next phase:** 5 — Premium Touchpoint Layer

## Quality gate status (last verified)

| Check                         | Result                      |
| ----------------------------- | --------------------------- |
| `npm run typecheck`           | ✅ Pass                     |
| `npm run lint`                | ✅ Pass                     |
| `npm run test`                | ✅ 48/48 pass               |
| `npm run build`               | ✅ Success                  |
| Dev server (`localhost:3000`) | ✅ 200, all sections render |

Build output: `/` route 49.3 kB, First Load JS 155 kB (uncompressed). Gzipped JS contribution is currently under the 130 kB budget, but this must be re-measured after Phase 5 motion integration.

---

## Executive summary

Phases 1–4 are functionally complete. The site is feature-complete on localhost: navigation, hero, origin map, stats, collections, trust pillars, founder, testimonials (hidden until real data), contact form, WhatsApp CTAs, and footer all render and pass validation.

Phase 5 is the most complex remaining block. It is not a small polish pass: five motion components exist only as stubs, and several sections need to be refactored to integrate them. This document exists so the Phase 5 executor can start with full context.

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

## Phase 5 — Premium Touchpoint Layer: Readiness

### Already implemented

| Component      | File                                     | Status  |
| -------------- | ---------------------------------------- | ------- |
| `ScrollReveal` | `src/components/motion/ScrollReveal.tsx` | ✅ Done |
| `CountUp`      | `src/components/motion/CountUp.tsx`      | ✅ Done |

### Stubbed — must be implemented

| Component           | File                                                | Spec reference        |
| ------------------- | --------------------------------------------------- | --------------------- |
| `TiltCard`          | `src/components/motion/TiltCard.tsx`                | `MOTION_SPEC.md` §3.1 |
| `MagneticButton`    | `src/components/motion/MagneticButton.tsx`          | `MOTION_SPEC.md` §3.2 |
| `AnimatedFocusRing` | `src/components/motion/AnimatedFocusRing.tsx`       | `MOTION_SPEC.md` §3.3 |
| `ValidationMorph`   | `src/components/motion/ValidationMorph.tsx`         | `MOTION_SPEC.md` §3.4 |
| `EmblaContainer`    | `src/components/motion/Carousel/EmblaContainer.tsx` | `MOTION_SPEC.md` §3.5 |
| `CarouselSlide`     | `src/components/motion/Carousel/CarouselSlide.tsx`  | `MOTION_SPEC.md` §3.5 |

### Integration tasks

| Roadmap | Task                                                        | Notes                                                                        |
| ------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 5.6     | Wrap `FabricCard` with `TiltCard`                           | Remove current CSS-only 1.03 hover scale                                     |
| 5.7     | Integrate `AnimatedFocusRing` + `ValidationMorph` into form | Refactor `FormField` focus state; wire `ValidationMorph` to `Contact` states |
| 5.8     | Replace `Collections` grid with `EmblaContainer`            | See design decision below                                                    |
| 5.9     | Apply `MagneticButton` to primary CTAs                      | Hero "Explore", WhatsApp button, form submit                                 |
| 5.10    | Verify `CountUp` spring easing                              | Already implemented; confirm against spec                                    |
| 5.11    | Add `touch-action: manipulation` globally                   | Audit buttons, links, cards, form fields, carousel track                     |
| 5.12    | Replace `100vh` with `100dvh`                               | Already done in Hero and mobile nav                                          |

---

## Decisions already made for Phase 5

These were confirmed by the project owner on 2026-07-05:

1. **Carousel layout on desktop:** Follow `MOTION_SPEC.md` — single-slide draggable carousel on both mobile and desktop (roadmap 5.8 / `MOTION_SPEC.md` §3.5). This overrides `DESIGN.md` §9.04 which shows three cards in a row.
2. **Form label behaviour:** Follow `MOTION_SPEC.md` — labels float up from inside the input to above on focus (`MOTION_SPEC.md` §3.3). This overrides `DESIGN.md` §9.08 which says labels are positioned above inputs statically.
3. **Hero "Explore" CTA:** Refactor `Hero.tsx` to use the shared `Button` component so `MagneticButton` can wrap it cleanly (roadmap 5.9).
4. **Bundle strategy:** Apply lazy-loading from the start of Phase 5. Use `next/dynamic` for below-fold motion components (`TiltCard`, `MagneticButton`, `EmblaContainer`) and prefer Framer’s `m` over `motion` for non-layout animations to stay under the 130 kB gzip budget.

---

## Risks / blockers for Phase 5

| #   | Risk                                                                                      | Mitigation                                                                    |
| --- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1   | All Phase 5 motion components are empty stubs                                             | Treat Phase 5 as a full implementation wave, not a polish pass                |
| 2   | Bundle budget may be exceeded after Embla + Framer springs added                          | Lazy-load below-fold components; use Framer `m`; re-measure after integration |
| 3   | Hero "Explore" CTA is currently a plain `<a>`, not `Button`                               | Refactor as part of Phase 5.9 before applying `MagneticButton`                |
| 4   | `Collections` grid uses CSS scroll-snap; replacing with Embla may affect layout           | Test responsive behaviour carefully; ensure `touch-action: pan-y` on track    |
| 5   | Form focus ring requires shared `layoutId="form-focus-ring"` across `FormField` instances | Coordinate component structure so the ring morphs correctly between fields    |

---

## Placeholder / fine-tune backlog

These do not block Phase 5 but must be resolved before launch:

- [ ] Hero video MP4 (desktop + mobile) and poster JPEG
- [ ] Commissioned origin map illustration
- [ ] Real fabric photography ×3 for collection cards
- [ ] Sofia’s professional 3:4 portrait
- [ ] Made in Italy certification scan
- [ ] ≥1 real testimonial
- [ ] Real WhatsApp Business number
- [ ] `RESEND_API_KEY`, `RESEND_FROM`, `RESEND_TO` environment variables
- [ ] Final legal entity name for Footer copyright
- [ ] Custom 404 page styling (Phase 6.12)

---

## Recommended Phase 5 execution order

1. Implement `MagneticButton` and refactor Hero CTA to use `Button`.
2. Implement `TiltCard` and integrate into `FabricCard`.
3. Implement `AnimatedFocusRing` + `ValidationMorph`; refactor `FormField` and `Contact` form.
4. Implement `EmblaContainer` + `CarouselSlide`; replace `Collections` grid.
5. Add `touch-action: manipulation` globally.
6. Re-run full verification: `typecheck`, `lint`, `test`, `build`, dev-server walk, bundle audit.

---

## Notes for future agents

- Read `DESIGN.md`, `MOTION_SPEC.md`, and `TECHNICAL_ARCHITECTURE.md` before touching motion code.
- Respect `prefers-reduced-motion` via the existing `useReducedMotion` hook and the CSS token collapse in `globals.css`.
- Keep all motion values in `src/lib/motion.ts` or CSS custom properties — no inline magic numbers.
- All Framer-driven components must be `'use client'`.
- The contact form server action is the single submission path; do not reopen `/api/contact` without explicit approval.

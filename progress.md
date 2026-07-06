# Imperium Italian Textile — Build Progress Tracker

**Project root:** `/Users/akshaymsingh/Documents/Liberate/Imperium`  
**Last updated:** 2026-07-05  
**Completed phases:** 1, 2, 3, 4, 5  
**Next phase:** 6 — Polish + Performance + Launch

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

- [ ] Hero video MP4 (desktop + mobile) and poster JPEG
- [x] Client wordmark logo — derived transparent asset via `scripts/derive-brand-assets.mjs`, `SITE.logoSrc` set (2026-07-06)
- [x] Italy→Gulf route illustration in the Why Imperium map slot (2026-07-06)
- [x] Made in Italy stamp artwork in the Why Imperium stamp slot (2026-07-06)
- [x] Real fabric photography ×4 on collection cards — client re-export at ≥800×1000px still requested; current files are lower-res and render soft on retina (2026-07-06)
- [x] Sofia’s 3:4 portrait (2026-07-06)
- [x] Made in Italy certification scan wired in as-is per user decision — Sofia’s explicit OK on the visible DOB/date still recommended before launch (2026-07-06)
- [ ] ≥1 real testimonial
- [ ] Real WhatsApp Business number
- [ ] `RESEND_API_KEY`, `RESEND_FROM`, `RESEND_TO` environment variables
- [ ] Final legal entity name for Footer copyright
- [ ] Custom 404 page styling (Phase 6.12)

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

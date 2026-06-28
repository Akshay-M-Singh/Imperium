# Imperium Italian Textile

> Premium Italian fabrics — sourced from the finest mills of Italy, delivered to Dubai's most discerning tailors and hospitality groups.

**Version 1.0 · June 2026**

The marketing site for **Imperium Italian Textile**, a B2B Italian fabric
supplier serving the Dubai / Gulf luxury market. The site is an editorial
single-page experience — closer in spirit to _Loro Piana_ and _Aesop_ than
to a SaaS landing page. Every decision is governed by restraint: _"ship the
simplest thing that tells the truth about the brand."_

---

## Documentation

The root of this repository is, by design, a folder of planning documents.
Read them in this order before changing anything:

| Document                                                   | Scope                                                                                                     |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [`DESIGN.md`](./DESIGN.md)                                 | Visual design system — typography, colour, layout, motion principles, section-by-section direction.       |
| [`TECHNICAL_ARCHITECTURE.md`](./TECHNICAL_ARCHITECTURE.md) | Stack, folder structure, component hierarchy, animation strategy, asset/perf/SEO strategy, accessibility. |
| [`MOTION_SPEC.md`](./MOTION_SPEC.md)                       | Motion tokens + component specifications, reduced-motion fallback table, touch parity rules.              |
| [`DEVELOPMENT_ROADMAP.md`](./DEVELOPMENT_ROADMAP.md)       | Phased build — one phase per session, localhost verification gate, fine-tune loop.                        |

Every code change should be tested against the question from `DESIGN.md`:
_"Does this feel like a page from an Italian design magazine, or does this
feel like a tech product?"_ If the latter, reconsider.

---

## Stack

Lean by design. Every dependency must justify its presence
(`TECHNICAL_ARCHITECTURE.md` §1 — _What Is Not in the Stack_).

| Layer     | Choice                                           | Note                                                                                       |
| --------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Framework | **Next.js 15** (App Router, `src/` dir)          | SSR/SSG for SEO; server components + Server Actions.                                       |
| Language  | **TypeScript** (strict)                          | `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` off for ergonomic optional props. |
| Styling   | **Vanilla CSS + CSS Modules**                    | No Tailwind, no CSS-in-JS. Tokens via CSS custom properties in `src/app/globals.css`.      |
| Animation | **Framer Motion v11** + CSS transitions          | Three-layer motion system per `MOTION_SPEC.md`.                                            |
| Carousel  | **Embla Carousel**                               | Headless, accessible, ~3KB.                                                                |
| Forms     | **React Server Actions + Resend**                | No form library. Native HTML5 validation.                                                  |
| Analytics | **Plausible Analytics**                          | Privacy-respecting, <1KB script.                                                           |
| Hosting   | **Vercel**                                       | Edge network covers UAE, KSA, EU. No Docker.                                               |
| Fonts     | Self-hosted WOFF2 (Cormorant Garamond + DM Sans) | No Google Fonts.                                                                           |

**Explicitly excluded** — see `TECHNICAL_ARCHITECTURE.md` §1: Tailwind, GSAP,
WordPress/Webflow/Framer, Three.js/WebGL, Chakra/Radix/shadcn, a backend, a
database, and authentication (V1). Sanity CMS is a V2 consideration only.

---

## Folder Structure

```
imperium/
├── .github/workflows/        CI: lint → typecheck → test → build → e2e
├── .husky/                   pre-commit (lint-staged), commit-msg (commitlint)
├── .vscode/                  recommended extensions + workspace settings
├── public/
│   ├── fonts/                Self-hosted WOFF2 (Cormorant + DM Sans)
│   ├── images/{hero,fabrics,about,map,og}/   Photography + map SVG + OG
│   └── video/                hero-desktop.mp4, hero-mobile.mp4
├── scripts/                  Dev helpers (font subsetting). Not part of the build.
├── src/
│   ├── app/                  App Router. Root layout, page, globals.css,
│   │                         sitemap, robots, not-found, V2 route stubs,
│   │                         api/contact/route.ts (alt form handler).
│   ├── components/
│   │   ├── layout/           Navigation, Footer, Section wrapper.
│   │   ├── sections/         Hero, OriginMap, StatsStrip, Collections,
│   │   │                     TrustPillars, Founder, Testimonials, Contact.
│   │   ├── ui/               Button, TextLink, Eyebrow, SectionHeader,
│   │   │                     FabricCard, StatBlock, PullQuote, FormField,
│   │   │                     WhatsAppButton.
│   │   └── motion/           ScrollReveal, CountUp, TiltCard,
│   │                         MagneticButton, AnimatedFocusRing,
│   │                         ValidationMorph, Carousel/{Embla,Slide}. All
│   │                         "use client" per MOTION_SPEC.md §5.
│   ├── hooks/                useIntersectionObserver, useReducedMotion,
│   │                         useMediaQuery.
│   ├── lib/                  constants, motion (springs + variants), metadata,
│   │                         email (Resend), site (brand config), env, utils.
│   ├── data/                 Typed copy files. Single source of truth for
│   │                         content. Each maps 1:1 to a future Sanity schema.
│   └── types/                Shared TypeScript interfaces (navigation,
│                             collections, forms, seo).
├── tests/
│   ├── e2e/                  Playwright specs (homepage, contact form).
│   ├── unit/                 Vitest + @testing-library specs.
│   └── setup.ts              jest-dom setup.
├── DESIGN.md, MOTION_SPEC.md,
│   TECHNICAL_ARCHITECTURE.md, DEVELOPMENT_ROADMAP.md   Planning docs (root).
├── next.config.ts            Images, security headers, redirects.
├── tsconfig.json             Strict, `@/*` → `./src/*`.
├── eslint.config.mjs         Flat config: next + typescript-eslint + prettier.
├── .prettierrc.json / .prettierignore
├── .editorconfig
├── commitlint.config.mjs     Conventional Commits.
├── vitest.config.ts          jsdom, setup, `@` alias.
├── playwright.config.ts      chromium, webServer = `npm run dev`.
├── .env.example              Documented env var template.
└── README.md                 (this file)
```

Component styling lives **colocated** as CSS Modules next to each component —
there is no separate `styles/` directory. Global tokens and reset live in
`src/app/globals.css`. There is no third location.

---

## Setup

Requirements: **Node ≥ 20.11 LTS**, npm 10+.

```bash
# 1. Install dependencies
npm install            # enables the `prepare` script (Husky)

# 2. Configure environment
cp .env.example .env.local
#   Fill in NEXT_PUBLIC_WHATSAPP_NUMBER; leave RESEND_API_KEY blank to
#   mock email on localhost (see Roadmap Phase 4.13).

# 3. Run the dev server
npm run dev            # http://localhost:3000
```

Fonts (`/public/fonts/*.woff2`), the hero video (`/public/video/*.mp4`), and
all imagery are external creative dependencies — documented placeholders
exist where each will live. See _Critical External Dependencies_ in
`DEVELOPMENT_ROADMAP.md`. The `scripts/subset-fonts.sh` helper generates the
WOFF2 files from original TTFs once they are obtained.

---

## Development Commands

```bash
npm run dev            # Local dev server at localhost:3000

# Quality gates
npm run lint           # ESLint (flat config)
npm run lint:fix       # ESLint --fix
npm run format         # Prettier --write
npm run format:check   # Prettier --check (used in CI)
npm run typecheck      # tsc --noEmit

# Tests
npm run test           # Vitest — unit + component (jsdom)
npm run test:watch     # Vitest in watch mode
npm run test:e2e       # Playwright against a `next dev` webServer
npm run test:e2e:ui    # Playwright interactive UI mode

# Production
npm run build          # next build
npm run start          # next start (serves the build locally)
```

Pre-commit (`.husky/pre-commit`) runs `lint-staged`; commit messages are
validated by commitlint against Conventional Commits.

---

## Architecture Overview

### Data flow and the data/ → CMS migration path

All copy lives in typed data files under `src/data/`. Components import from
there, never hardcoding strings into JSX. Each data file is structured to map
**1:1 to a future Sanity schema** — the V2 CMS migration is a swap of the
export for a `groq` fetch, with no component changes
(`TECHNICAL_ARCHITECTURE.md` §2 rationale).

### Component tiers

- **`layout/`** — chrome shared across pages (Navigation, Footer) and the
  `Section` wrapper that enforces max-width, responsive margins, and
  vertical rhythm.
- **`sections/`** — full-width page regions that compose UI primitives.
  Each is wrapped in `ScrollReveal` for one-shot scroll entry.
- **`ui/`** — reusable atoms (Button, Eyebrow, FormField, …) used across
  one or more sections.
- **`motion/`** — isolated animation wrappers (TiltCard, MagneticButton,
  …). Isolation means a future swap of the motion library touches this
  folder alone, never the sections. All files are marked `"use client"`.

The entire site is built from **18 unique components**
(`TECHNICAL_ARCHITECTURE.md` §3). A pattern appearing fewer than two times
is inline markup — not a component.

### CSS strategy

Vanilla CSS + CSS Modules only. Custom properties in `globals.css` are the
single source of truth for colour, type scale, spacing, motion tokens, and
breakpoints. CSS **logical properties** (`padding-inline-*`, `margin-block-*`)
are used throughout so the V2 Arabic/RTL layout (`dir="rtl"`, `/ar` route
segment) requires no CSS rewrite (`TECHNICAL_ARCHITECTURE.md` §8).

### Motion

Three layers (`MOTION_SPEC.md` §2, `TECHNICAL_ARCHITECTURE.md` §4):

1. **Section reveal** — Framer `whileInView`, staggered children, one-shot.
2. **Component motion** — Framer `useMotionValue`/`useTransform` for 60fps
   cursor tracking (TiltCard, MagneticButton); `layoutId` for field-focus
   morphing. Never stored in React state.
3. **Primitive transitions** — CSS `transition` + tokens (colour, opacity).

`prefers-reduced-motion: reduce` is non-negotiable. All `--motion-duration-*`
collapse to `0ms` inside a media query in `globals.css`, so primitive CSS
transitions respect the user's preference without per-component overrides.
Framer components additionally consume `useReducedMotion()`.

### Forms

React Server Action → `lib/email.ts` → Resend. When `RESEND_API_KEY` is absent
on localhost, the action returns a mock success response and `console.log`s the
payload (Roadmap Phase 4.13). A honeypot field mitigates spam — no CAPTCHA
(it would break the editorial experience). The alternate REST handler at
`src/app/api/contact/route.ts` delegates to the same `lib/email` path.

### Performance budget (`TECHNICAL_ARCHITECTURE.md` §6)

| Metric                          | Target  |
| ------------------------------- | ------- |
| LCP                             | < 2.5s  |
| CLS                             | < 0.1   |
| JS bundle (gzip)                | < 130KB |
| Total page weight (excl. video) | < 1.5MB |

Below-fold motion components are dynamically imported via `next/dynamic` to
defend the bundle budget.

### SEO & accessibility

Server-rendered HTML with a strict heading hierarchy (one `<h1>`, no skipped
levels), semantic landmarks, JSON-LD `Organization` data, a sitemap, robots,
and descriptive image alt text. Target: WCAG 2.1 AA, visible focus states,
keyboard-navigable, `prefers-reduced-motion` respected. A skip-to-content
link is the first focusable element.

---

## Build Phases

Build is **one phase at a time**, each ending with a localhost verification
gate the human signs off before the next begins. See
[`DEVELOPMENT_ROADMAP.md`](./DEVELOPMENT_ROADMAP.md) for the full phase list.
Order:

1. **Foundation** — tokens, fonts, base components (`Button`, `Eyebrow`…).
2. **Navigation + Hero** — transparent→opaque nav, video/poster, entry cascade.
3. **Content Sections** — OriginMap, StatsStrip, Collections.
4. **Trust + Identity + Contact** — TrustPillars, Founder, Testimonials, form.
5. **Premium Touchpoint Layer** — TiltCard, MagneticButton, focus ring,
   ValidationMorph, Embla carousel.
6. **Polish + Performance + Launch** — Lighthouse, a11y, SEO audit, deploy.

---

## Conventions

- **Path alias:** `@/*` → `src/*`. Use it (no relative paths that climb
  above one directory).
- **Component files:** one component per file. Colocate its CSS Module as
  `Component.tsx` + `Component.module.css`.
- **Barrels:** each folder ships an `index.ts` for named re-exports.
- **No comments unless they explain _why_, not _what_.** Existing comments
  point future agents to the planning docs.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`,
  `refactor:`, …). Enforced by commitlint.
- **No business logic in `globals.css`** — only tokens, `@font-face`, reset,
  base element styles, and the reduced-motion media query.

---

## License

UNLICENSED. Proprietary to Imperium Italian Textile. All rights reserved.

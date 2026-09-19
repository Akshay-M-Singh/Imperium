# Imperium Italian Textile

> A bilingual digital presence for Imperium Italian Textile, an Italian fabric
> supplier serving the Dubai and Gulf luxury market.

**Freelance client project** · [Visit the live site](https://imperiumitaliantextile.com)

![Imperium Italian Textile silk hero preview](./public/images/hero/silk/silk-2048.jpg)

Imperium is an editorial, brand-led website built to present a premium textile
offering with clarity and restraint. It pairs considered typography, bilingual
English/Arabic routes, and a tactile silk hero with practical lead-generation
paths for prospective customers.

## Project highlights

- Editorial experience designed for a premium textile brand rather than a
  generic product catalogue.
- English and Arabic locale routes, including an RTL-aware foundation.
- Live, cursor-reactive WebGL silk hero with a poster-first fallback for
  reduced motion, constrained connections, and unsupported devices.
- Collection, brand, contact, and privacy pages with accessible navigation and
  a contact flow backed by server-side email delivery.

## Tech stack

| Area             | Implementation                                |
| ---------------- | --------------------------------------------- |
| Application      | Next.js 15, React 19, TypeScript              |
| Styling          | Vanilla CSS and CSS Modules                   |
| Motion           | Framer Motion and CSS transitions             |
| Interactive hero | Three.js, React Three Fiber, React Three Drei |
| Forms            | React Server Actions and Resend               |
| Testing          | Vitest, Testing Library, Playwright           |
| Tooling          | ESLint, Prettier, Husky, commitlint           |

## Deliverables

The project delivers a production-oriented marketing site and the engineering
foundation to maintain it:

- Localised page templates for the homepage, about, contact, and privacy
  content.
- Reusable layout, section, UI, motion, and silk-rendering components.
- Brand imagery, self-hosted fonts, metadata, sitemap, and robots support.
- Contact submission handling, quality checks, and documented design,
  architecture, motion, and delivery guidance.

---

## Engineering documentation

The following documents provide the design and implementation context for
contributors:

| Document                                                 | Scope                                                                                       |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [DESIGN.md](./DESIGN.md)                                 | Visual design system: typography, colour, layout, motion principles, and section direction. |
| [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) | Stack, architecture, performance, SEO, accessibility, and CMS migration strategy.           |
| [MOTION_SPEC.md](./MOTION_SPEC.md)                       | Motion tokens, component specifications, reduced-motion fallbacks, and touch parity.        |
| [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md)       | Phased delivery plan and verification gates.                                                |

Use the design system as the standard for visual decisions: the experience
should feel like an Italian design magazine, not a technology product.

## Architecture at a glance

```text
src/
├── app/                    App Router, locale routes, metadata, sitemap, robots, contact API
├── components/
│   ├── layout/             Navigation, footer, and section layout
│   ├── sections/           Homepage content regions
│   ├── ui/                 Reusable interface primitives
│   ├── motion/             Scroll and interaction wrappers
│   └── silk/               WebGL silk hero, fabric rendering, and shaders
├── data/                   Typed English and Arabic content
├── hooks/                  Media, intersection, and reduced-motion hooks
├── lib/                    Site configuration, metadata, email, i18n, and WebGL capability checks
└── types/                  Shared TypeScript types
```

`public/` contains self-hosted fonts and brand assets. Styling is colocated
with components as CSS Modules; global tokens, resets, and base styles live in
`src/app/globals.css`.

### Content and component boundaries

Content is defined in typed files under `src/data/`, rather than embedded in
JSX. This keeps presentation components focused and provides a clear path to a
future CMS integration. The component structure separates shared page chrome,
full-width sections, reusable UI primitives, and client-side motion or WebGL
layers.

### Silk hero and progressive enhancement

The hero uses Three.js through React Three Fiber for a live silk simulation.
It is dynamically loaded only when the browser can support it. A static silk
poster is used for reduced-motion preferences, save-data or slow connections,
missing WebGL2 support, and the `NEXT_PUBLIC_SILK_HERO=off` kill switch. The
page remains complete and usable without WebGL.

### Accessibility, performance, and search

The site is server-rendered with semantic landmarks, a strict heading
hierarchy, visible focus states, keyboard support, descriptive image alt text,
metadata, a sitemap, and robots directives. Motion observes
`prefers-reduced-motion`; below-the-fold client features are loaded on demand.
See the technical architecture for budgets and implementation detail.

## Setup

Requirements: **Node 20.11 LTS or later** and npm 10 or later.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The development server runs at [http://localhost:3000](http://localhost:3000).
Configure `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local`. With no
`RESEND_API_KEY`, contact email is mocked locally; see the roadmap and
environment template for the complete configuration.

## Development commands

```bash
# Local development
npm run dev

# Quality checks
npm run lint
npm run format:check
npm run typecheck

# Tests
npm run test
npm run test:e2e

# Production
npm run build
npm run start
```

`npm run lint:fix` applies ESLint fixes, `npm run format` writes Prettier
formatting, and `npm run test:watch` starts Vitest in watch mode. Pre-commit
hooks run `lint-staged`; commit messages follow Conventional Commits.

## Conventions

- Use the `@/*` path alias for imports from `src/*`.
- Keep one component per file and colocate its CSS Module.
- Keep global CSS limited to tokens, font faces, reset, base elements, and
  reduced-motion rules.
- Use comments to explain decisions, not restate code.
- Follow Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, and so
  on).

## License

UNLICENSED. Proprietary to Imperium Italian Textile. All rights reserved.

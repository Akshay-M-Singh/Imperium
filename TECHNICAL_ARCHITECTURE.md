# Imperium Italian Textile — Technical Architecture

**Implementation status · July 2026**

This document describes the repository as implemented. It deliberately distinguishes working code from configuration or launch decisions that have not yet been enabled.

---

## 1. Implemented stack

| Layer | Implementation |
|---|---|
| Framework | Next.js 15 App Router with React 19 and TypeScript. |
| Styling | Hand-authored global CSS custom properties plus colocated CSS Modules. Tailwind and CSS-in-JS are not used. |
| Motion | Framer Motion 11, CSS transitions, `IntersectionObserver`, `ResizeObserver`, and `requestAnimationFrame` where appropriate. |
| WebGL hero | Three.js, `@react-three/fiber`, and `@react-three/drei`. The canvas is client-only and dynamically imported. |
| Forms | React `useActionState`, a Next.js Server Action, and Resend. |
| Content | Typed TypeScript data modules in `src/data/`; no CMS or Markdown-content pipeline is present. |
| Images | Local assets under `public/`, mainly rendered with Next.js `<Image>`. `sharp` is installed for Next.js image optimisation. |
| Analytics | Plausible environment/configuration hooks and CSP allowances exist, but no Plausible script is currently rendered. |
| Testing | Vitest + Testing Library for unit/component coverage and Playwright for end-to-end coverage. |

`package.json` is the source of truth for dependency versions and npm scripts. Embla is not installed.

### Runtime and delivery configuration

`next.config.ts` enables React strict mode, compression, AVIF/WebP optimisation, and security headers. The production Content Security Policy allows the Plausible origin, while Resend is server-only. Hosting is not encoded in this repository, so no particular hosting provider is asserted here.

---

## 2. Repository structure

```text
imperium/
├── public/
│   ├── fonts/                         # Self-hosted Cormorant Garamond and DM Sans WOFF2 files
│   ├── images/
│   │   ├── about/sofia-portrait.png
│   │   ├── certifications/made-in-italy-certification.png
│   │   ├── fabrics/*.png              # Four collection assets
│   │   ├── hero/silk-still.jpg
│   │   ├── logo/imperium-wordmark.png
│   │   ├── map/italy-gulf-routes.png
│   │   └── stamp/made-in-italy-stamp.png
│   ├── video/                         # Present but contains no video asset
│   └── site.webmanifest
├── scripts/
│   ├── build-silk-still.mjs
│   ├── capture-hero-still.mjs
│   ├── derive-brand-assets.mjs
│   └── subset-fonts.sh
├── src/
│   ├── app/
│   │   ├── actions/contact.ts          # Contact Server Action
│   │   ├── api/contact/route.ts        # Closed placeholder REST endpoint (405)
│   │   ├── about/page.tsx              # Minimal standalone stub
│   │   ├── contact/page.tsx            # Minimal standalone stub
│   │   ├── privacy/                    # Implemented privacy page
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── layout/                     # Navigation, Footer, Section
│   │   ├── motion/                     # Reveal, count-up, tilt, magnetic/focus/validation motion
│   │   ├── sections/                   # Homepage sections
│   │   ├── silk/                       # Iridescent silk WebGL canvas, shaders and capability wrapper
│   │   └── ui/                         # Shared presentation and form primitives
│   ├── data/                           # Typed site, navigation, collection, contact and SEO data
│   ├── hooks/                          # Intersection, media-query, reduced-motion, pointer and WebGL hooks
│   ├── lib/                            # Environment, email, metadata, motion, site and WebGL helpers
│   └── types/                          # Domain-specific TypeScript types
├── tests/
│   ├── unit/
│   ├── e2e/
│   └── setup.ts
├── next.config.ts
├── playwright.config.ts
├── vitest.config.ts
└── package.json
```

Component CSS Modules are colocated with their components; `src/app/globals.css` owns tokens, font faces, reset rules, and shared accessibility utilities.

---

## 3. Page and component hierarchy

`src/app/layout.tsx` provides document metadata, font preloads, the footer, and the fixed-mobile WhatsApp control. The homepage itself renders navigation and the main narrative sequence:

```text
RootLayout
├── Page
│   ├── Navigation
│   └── main#main
│       ├── Hero
│       │   ├── IridescentSilkHero
│       │   │   ├── IridescentSilkCanvas (live WebGL, eligible browsers only)
│       │   │   └── silk-still.jpg (static fallback)
│       │   ├── h1 containing the wordmark image or text fallback
│       │   └── Explore / sample CTAs
│       ├── StatsStrip
│       │   └── StatBlock × 4 with CountUp
│       ├── Collections
│       │   └── FabricCard × 4
│       ├── WhyImperium
│       │   └── Three editorial provenance rows (map, stamp, text)
│       ├── Founder
│       │   ├── Portrait, bio, PullQuote
│       │   └── Certification image
│       ├── Testimonials (renders only when testimonial data is non-empty)
│       └── Contact
│           ├── Contact details and WhatsApp link
│           └── Client-validated form backed by submitContactForm
└── Footer
```

The standalone `/about` and `/contact` routes exist as simple V2 stubs. `/privacy` is implemented. There is no `/fabrics` route.

---

## 4. Hero and WebGL strategy

The hero uses a fullscreen WebGL iridescent silk fabric background with cursor-reactive lighting. `Hero` mounts `IridescentSilkHero`, which renders either a live WebGL canvas or a static still-image fallback.

`IridescentSilkHero` allows the live canvas only when all of the following are true:

- WebGL 2 is available (detected by `useWebGL2`);
- the visitor does not prefer reduced motion (detected by `useReducedMotion`); and
- the connection is not slow and save-data is not enabled (`isSlowConnection` from `src/lib/connection.ts`).

When any condition fails, a static still image (`public/images/hero/silk-still.jpg`, 2880×1620 JPEG) is rendered instead.

`IridescentSilkCanvas` is loaded with `next/dynamic(..., { ssr: false })`. It renders an orthographic `@react-three/fiber` Canvas with a fullscreen plane and a custom GLSL shader. The shader computes a procedural silk weave via FBM noise, pearlescent champagne iridescence via a Fresnel-based thin-film approximation, a cursor-driven light spot with smoothstep radial falloff, and a decaying caustic ripple. Device pixel ratio is capped at 1.75.

Pointer position is tracked by `usePointerPosition` and spring-eased via Framer Motion `useSpring` (`stiffness: 100, damping: 14, mass: 0.8`) for a liquid cursor-follow feel. The spring values and a `getTimeSinceLastMove` callback are passed as props to the canvas and read in `useFrame` to update shader uniforms each frame.

The Navigation component detects when the user is over the dark hero (`scrollY < window.innerHeight`) and applies `data-on-dark="true"` to switch text colors to light tokens. The `scrolled` state (background: pietra) always overrides the dark-hero styles.

---

## 5. Collections and motion

### Collections

Collections are a four-panel, scroll-driven showcase rather than an Embla carousel:

- On desktop (`min-width: 1024px`) with motion enabled, the viewport is sticky and vertical scroll progress drives the horizontal track through Framer Motion `useScroll` and `useTransform`.
- The travel distance is measured from the track's actual overflow with `ResizeObserver`.
- On smaller screens and for reduced-motion users, the same track uses native CSS scroll snap and remains keyboard focusable.

### Shared motion

- `ScrollReveal` is a one-shot Framer `whileInView` wrapper. It accepts per-call visibility amounts; its default is `0.15`.
- `StatsStrip` uses Framer `useInView` at `amount: 0.3`; `CountUp` then updates its text node using `requestAnimationFrame` for a default 1,200 ms animation.
- `TiltCard`, `MagneticButton`, `AnimatedFocusRing`, and `ValidationMorph` provide the interactive motion used by cards, CTAs, and form feedback.
- `prefers-reduced-motion` is handled by the hook and global CSS. `ScrollReveal` returns static markup, the desktop pinned collection mode is disabled, the count-up renders its final value, and the silk canvas is not attempted.

---

## 6. Contact flow

The homepage contact form performs client-side required-field, email, role, and minimum-project-length checks before calling the Server Action in `src/app/actions/contact.ts`.

The Server Action validates and sanitises the form again, applies a timestamp check, honeypot check, and in-memory IP rate limit (five submissions per ten minutes), then calls `sendContactEmail`. Resend delivery requires `RESEND_API_KEY`, `RESEND_FROM`, and `RESEND_TO`; without an API key, the local-development path reports mock success and logs the payload. `src/app/api/contact/route.ts` intentionally returns HTTP 405 and is not the active submission path.

---

## 7. Assets and fonts

Fonts are self-hosted WOFF2 files under `public/fonts/` and declared in `globals.css` with `font-display: swap`. The regular Cormorant face has metric overrides to reduce layout shift, and the root layout preloads the regular Cormorant Garamond and DM Sans files.

Most content imagery uses Next.js `<Image>` with explicit intrinsic dimensions and lazy loading below the fold. Exceptions include the silk poster, which deliberately uses a plain local `<img>` because it is a fixed SVG fallback and SVG image optimisation is not enabled. The repository has no Open Graph image asset under `public/images/og/`, and the current root metadata does not declare an Open Graph image.

---

## 8. SEO, indexing, and accessibility

### SEO and indexing

- Root metadata is defined directly in `src/app/layout.tsx`, including title, description, canonical path, Open Graph basics, Twitter card type, and a configurable `metadataBase`.
- `src/data/seo.ts` contains page metadata data, but `src/lib/metadata.ts` currently returns empty metadata and empty JSON-LD. JSON-LD is not rendered.
- `src/app/sitemap.ts` currently returns the homepage only.
- Indexing is deliberately opt-in: `robots.ts` disallows all crawlers until `NEXT_PUBLIC_ALLOW_INDEXING=true`. When enabled, it allows crawling and exposes the sitemap URL.
- The document language is currently fixed to `en`; an Arabic route, dynamic `lang` attribute, and locale-keyed content data are not implemented.

### Accessibility

- Major homepage sections use semantic `<section>` elements and `aria-labelledby` where a heading is present; collection and testimonial cards use `<article>`.
- Form fields use labels and surface client/server errors. The form moves focus to the first invalid field after client-side validation.
- Motion-sensitive paths honour `prefers-reduced-motion`.
- A visually-hidden utility exists, but the current layout/navigation does not render a skip-to-content link.

---

## 9. Performance posture

The implementation favours static local assets, responsive Next.js images, CSS Modules, self-hosted fonts, and a dynamically imported WebGL canvas. Compression and AVIF/WebP output are configured in Next.js. The hero poster is available immediately, while the heavy canvas is capability-gated and client-only.

No measured Core Web Vitals, compressed JavaScript bundle budget, page-weight budget, or deployed CDN/hosting result is committed in the repository. These should be documented only from repeatable production measurements.

---

## 10. Quality checks

Available npm commands are:

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

The suite includes unit/component tests for the app, sections, UI, motion, hooks, data, and library helpers, plus Playwright coverage for the homepage and contact form. `npm run test:e2e:ui` opens Playwright's interactive runner; `npm run capture:hero` runs the hero-still capture script.

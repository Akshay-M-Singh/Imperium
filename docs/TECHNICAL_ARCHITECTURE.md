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
| Hero | Static full-bleed fabric photograph rendered with `next/image`; no WebGL or canvas anywhere in the codebase. |
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
│   │   ├── hero/fabric-hero.jpg
│   │   ├── logo/imperium-wordmark.png
│   │   ├── map/italy-gulf-routes.png
│   │   └── stamp/made-in-italy-stamp.png
│   ├── video/                         # Present but contains no video asset
│   └── site.webmanifest
├── scripts/
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
│   │   └── ui/                         # Shared presentation and form primitives
│   ├── data/                           # Typed site, navigation, collection, contact and SEO data
│   ├── hooks/                          # Intersection, media-query and reduced-motion hooks
│   ├── lib/                            # Environment, email, metadata, motion and site helpers
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
│       │   ├── Static fabric background (next/image + scrim + bottom-edge fade)
│       │   ├── h1 containing the wordmark image or text fallback
│       │   └── Explore / sample CTAs
│       ├── StatsStrip
│       │   └── StatBlock × 3 with CountUp
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

## 4. Hero background

The hero uses a fullscreen static photograph of champagne-beige satin
(`public/images/hero/fabric-hero.jpg`, 3024×4032). `Hero` renders it through `next/image`
with `fill`, `priority`, quality 90, and `sizes="100vw"` so it is preloaded as the LCP
element and served as AVIF/WebP at responsive sizes.

A flat scrim (`--color-hero-gradient`, `rgba(0, 0, 0, 0.4)`) overlays the image to keep the
white on-dark text ramp legible, and a CSS `mask-image` linear gradient on the background
container fades image and scrim together — opaque until 85% of hero height, transparent at
the bottom edge — so the hero dissolves into the `pietra` page background before StatsStrip.
The container is `aria-hidden` and `pointer-events: none`.

There is no canvas, shader, or capability gating: the background renders identically for
every visitor, is inherently reduced-motion-safe, and carries no GPU or JavaScript cost.

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
- `prefers-reduced-motion` is handled by the hook and global CSS. `ScrollReveal` returns static markup, the desktop pinned collection mode is disabled, and the count-up renders its final value.

---

## 6. Contact flow

The homepage contact form performs client-side required-field, email, role, and minimum-project-length checks before calling the Server Action in `src/app/actions/contact.ts`.

The Server Action validates and sanitises the form again, applies a timestamp check, honeypot check, and in-memory IP rate limit (five submissions per ten minutes), then calls `sendContactEmail`. Resend delivery requires `RESEND_API_KEY`, `RESEND_FROM`, and `RESEND_TO`; without an API key, the local-development path reports mock success and logs the payload. `src/app/api/contact/route.ts` intentionally returns HTTP 405 and is not the active submission path.

---

## 7. Assets and fonts

Fonts are self-hosted WOFF2 files under `public/fonts/` and declared in `globals.css` with `font-display: swap`. The regular Cormorant face has metric overrides to reduce layout shift, and the root layout preloads the regular Cormorant Garamond and DM Sans files.

Content imagery uses Next.js `<Image>` — the hero background with `fill`/`priority` as the LCP element, everything else with explicit intrinsic dimensions and lazy loading below the fold. The repository has no Open Graph image asset under `public/images/og/`, and the current root metadata does not declare an Open Graph image.

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

The implementation favours static local assets, responsive Next.js images, CSS Modules, self-hosted fonts, and a static, preload-prioritised hero image. Compression and AVIF/WebP output are configured in Next.js.

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

The suite includes unit/component tests for the app, sections, UI, motion, hooks, data, and library helpers, plus Playwright coverage for the homepage and contact form. `npm run test:e2e:ui` opens Playwright's interactive runner.

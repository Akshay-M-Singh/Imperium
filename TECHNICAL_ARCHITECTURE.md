# Imperium Italian Textile — Technical Architecture

**Version 1.0 · June 2026**

---

## 1. Recommended Stack

### Decision Framework

The technology choices below are governed by three priorities, in order:

1. **Performance.** The site must load fast on mobile networks in the UAE and KSA, where 4G latency can be high and users expect instant results.
2. **SEO.** Imperium's organic discovery depends on ranking for specific long-tail terms ("Italian fabric Dubai," "luxury linen supplier UAE"). Server-rendered HTML is non-negotiable.
3. **Maintainability.** Sofia is a founder, not a developer. The stack must be stable enough that a single contractor can maintain it, and simple enough that content updates do not require engineering knowledge.

### Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | **Next.js 15 (App Router)** | Server-side rendering for SEO. Static generation for performance. React ecosystem for component quality. The App Router's `loading.tsx` and `metadata` APIs are purpose-built for content-heavy sites. |
| **Language** | **TypeScript** | Prevents entire categories of bugs. The type system documents component interfaces better than any README. |
| **Styling** | **Vanilla CSS with CSS Custom Properties** | No Tailwind, no CSS-in-JS. Luxury brands do not ship utility-class soup. A hand-authored CSS system with custom properties mirrors the craftsmanship of the brand itself. Custom properties enable theme consistency without runtime cost. CSS Modules for component-scoped styles. |
| **Animation** | **Framer Motion v11 (variants, springs, gestures) + CSS transitions + Intersection Observer** | Framer Motion powers component-level motion (TiltCard, MagneticButton, AnimatedFocusRing, ValidationMorph) where spring physics and layout animations are required. CSS transitions handle primitive state changes (color, opacity, simple transforms) at zero JS cost. Intersection Observer remains the trigger for one-shot section reveals. The site is now an Apple / Vitra reference for tactile responsiveness — see `MOTION_SPEC.md` for the full motion language. |
| **Carousel** | **Embla Carousel** | ~3KB gzipped. Headless, accessible, handles swipe physics, snap points, keyboard nav, and RTL. Used for the swipeable Collections section. Framer Motion layers slide-entry animations on top. |
| **Forms** | **React Server Actions + Resend** | Server Actions handle form submission without client-side form libraries. Resend delivers the notification email to Sofia. No Formspree, no Netlify Forms — those add third-party dependencies and data-processing concerns. |
| **CMS** | **Markdown files in repo (V1) → Sanity (V2)** | For V1, content is hardcoded in structured data files. The copy is finalised in the PRD and will not change weekly. A CMS adds complexity that isn't justified until the Pezzi Unici collection needs frequent updates. Sanity is the recommended V2 CMS because its real-time preview and structured content model fit editorial workflows. |
| **Hosting** | **Vercel** | Native Next.js host. Edge network covers the UAE, KSA, and European markets. Automatic image optimisation. Preview deployments for review. |
| **Analytics** | **Plausible Analytics** | Privacy-respecting, no cookie banner required. Lightweight script (< 1KB). Tracks page views, referrers, and geography without GDPR/data-processing burden — critical for a UAE-based business serving EU clients. |
| **Image Optimisation** | **Next.js `<Image>` component + sharp** | Automatic format negotiation (AVIF → WebP → JPEG), responsive `srcset` generation, lazy loading, and blur placeholder generation. No Cloudinary dependency needed. |
| **Video Hosting** | **Self-hosted MP4 on Vercel / Cloudflare R2** | The hero video is a single 8MB file. CDN-hosting it directly avoids YouTube/Vimeo embeds (which inject tracking scripts, iframes, and UI chrome that breaks the editorial aesthetic). Cloudflare R2 for storage if Vercel bandwidth becomes cost-prohibitive. |

**Bundle budget revision:** Framer Motion + Embla raise the JS bundle from < 80KB to < 130KB gzip. Mitigations: dynamic imports for below-fold motion components via `next/dynamic`; the hero remains CSS-only with one Framer primitive for the entry cascade.

### What Is Not in the Stack (and Why)

| Excluded | Reason |
|---|---|
| **Tailwind CSS** | Utility classes produce HTML that reads like configuration, not like markup. For a site with fewer than 15 distinct components, a bespoke CSS system is faster to write, easier to read, and produces smaller output. |
| **GSAP** | GSAP is justified for complex scroll-linked timelines and pinning. This site's scroll behavior is one-shot reveals (Framer's `whileInView` handles this) and carousel snap (Embla handles this). GSAP's bundle cost is not justified for the motion that remains. |
| **WordPress / Webflow / Framer** | The PRD mentions Framer and Webflow as potential hosts. These are excellent tools for rapid prototyping, but they limit performance control, produce non-semantic HTML, and make the Arabic (RTL) layout significantly harder. A custom Next.js build gives full control over every byte. |
| **Three.js / WebGL** | No 3D is needed. Any suggestion to add a "3D fabric viewer" should be resisted — it would add 200KB+ to the bundle, require fallbacks, and distract from the photography. **Amended 2026-07-07 (`docs/superpowers/specs/2026-07-07-silk-hero-experience-design.md`, D-S2): lifted for the hero only.** The hero's never-sourced video asset is replaced by a live cursor-reactive WebGL silk shader (`src/components/silk/`). This is a scoped exception, not a reversal — the exclusion still stands everywhere else in the site (no 3D fabric viewer, no WebGL elsewhere). The hero ships a poster-first fallback (static render of the shader's resting frame) for no-WebGL, reduced-motion, save-data, and a `NEXT_PUBLIC_SILK_HERO` kill switch, so the site never depends on WebGL to function. Bundle impact (~+180–200 kB gz) is accepted per that spec and tracked in `progress.md`. |
| **Chakra / Radix / shadcn** | Component libraries designed for app interfaces. This site has no modals, no data tables, no command palettes. The components are editorial — they don't need an app framework. |
| **Page-transition library (e.g. framer-motion AnimatePresence route transitions)** | V1 ships single-page scroll. Future page morphs can use the native View Transitions API (Next.js experimental flag) rather than a heavier AnimatePresence setup. |

---

## 2. Folder Structure

```
imperium/
├── public/
│   ├── fonts/
│   │   ├── CormorantGaramond-Regular.woff2
│   │   ├── CormorantGaramond-Medium.woff2
│   │   ├── CormorantGaramond-SemiBold.woff2
│   │   ├── CormorantGaramond-Italic.woff2
│   │   ├── CormorantGaramond-MediumItalic.woff2
│   │   ├── DMSans-Regular.woff2
│   │   └── DMSans-Medium.woff2
│   ├── images/
│   │   ├── hero/
│   │   │   ├── hero-poster.jpg          # Video poster frame
│   │   │   └── hero-poster-mobile.jpg   # Mobile poster
│   │   ├── fabrics/
│   │   │   ├── tessuti-italiani.jpg
│   │   │   ├── pezzi-unici.jpg
│   │   │   └── ospitalita-di-lusso.jpg
│   │   ├── about/
│   │   │   ├── sofia-portrait.jpg
│   │   │   └── made-in-italy-cert.jpg
│   │   ├── map/
│   │   │   └── origin-map.svg           # Custom illustrated map
│   │   └── og/
│   │       └── og-default.jpg           # Open Graph image
│   ├── video/
│   │   ├── hero-desktop.mp4
│   │   └── hero-mobile.mp4
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   └── site.webmanifest
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                   # Root layout: fonts, metadata, nav, footer
│   │   ├── page.tsx                     # Homepage: assembles all sections
│   │   ├── globals.css                  # Design tokens, reset, base styles
│   │   ├── fabrics/
│   │   │   └── page.tsx                 # Fabrics collection page (V2)
│   │   ├── about/
│   │   │   └── page.tsx                 # About page (V2, initially same as homepage section)
│   │   ├── contact/
│   │   │   └── page.tsx                 # Standalone contact page (V2)
│   │   └── api/
│   │       └── contact/
│   │           └── route.ts             # Form submission handler
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navigation.tsx
│   │   │   ├── Navigation.module.css
│   │   │   ├── Footer.tsx
│   │   │   ├── Footer.module.css
│   │   │   ├── Section.tsx              # Reusable section wrapper (spacing, max-width)
│   │   │   └── Section.module.css
│   │   │
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── Hero.module.css
│   │   │   ├── OriginMap.tsx
│   │   │   ├── OriginMap.module.css
│   │   │   ├── StatsStrip.tsx
│   │   │   ├── StatsStrip.module.css
│   │   │   ├── Collections.tsx
│   │   │   ├── Collections.module.css
│   │   │   ├── TrustPillars.tsx
│   │   │   ├── TrustPillars.module.css
│   │   │   ├── Founder.tsx
│   │   │   ├── Founder.module.css
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Testimonials.module.css
│   │   │   ├── Contact.tsx
│   │   │   └── Contact.module.css
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.tsx               # Ghost button, filled button variants
│   │   │   ├── Button.module.css
│   │   │   ├── TextLink.tsx             # Animated underline link
│   │   │   ├── TextLink.module.css
│   │   │   ├── Eyebrow.tsx              # Reusable eyebrow label
│   │   │   ├── Eyebrow.module.css
│   │   │   ├── SectionHeader.tsx        # Eyebrow + headline + subline combo
│   │   │   ├── SectionHeader.module.css
│   │   │   ├── FabricCard.tsx
│   │   │   ├── FabricCard.module.css
│   │   │   ├── StatBlock.tsx
│   │   │   ├── StatBlock.module.css
│   │   │   ├── PullQuote.tsx
│   │   │   ├── PullQuote.module.css
│   │   │   ├── FormField.tsx
│   │   │   ├── FormField.module.css
│   │   │   ├── WhatsAppButton.tsx
│   │   │   └── WhatsAppButton.module.css
│   │   │
│   │   └── motion/
│   │       ├── ScrollReveal.tsx          # Framer whileInView wrapper, one-shot
│   │       ├── CountUp.tsx               # Spring-eased RAF number counter
│   │       ├── TiltCard.tsx              # Cursor-aware 3D tilt for fabric cards
│   │       ├── MagneticButton.tsx        # Cursor-attracted primary CTAs
│   │       ├── AnimatedFocusRing.tsx     # Shared layoutId focus indicator
│   │       ├── ValidationMorph.tsx       # Form error/success transitions
│   │       └── Carousel/
│   │           ├── EmblaContainer.tsx    # Embla Carousel wrapper
│   │           └── CarouselSlide.tsx     # Individual slide with entry animation
│   │
│   ├── hooks/
│   │   ├── useIntersectionObserver.ts   # Core scroll detection hook
│   │   ├── useReducedMotion.ts          # Respects prefers-reduced-motion
│   │   └── useMediaQuery.ts            # Responsive breakpoint hook
│   │
│   ├── lib/
│   │   ├── constants.ts                 # Breakpoints, WhatsApp number, email
│   │   ├── metadata.ts                  # SEO metadata generator
│   │   └── email.ts                     # Resend integration
│   │
│   ├── data/
│   │   ├── navigation.ts               # Nav links and CTA config
│   │   ├── collections.ts              # Product card content
│   │   ├── pillars.ts                  # Trust pillar content
│   │   ├── founder.ts                  # Sofia bio and quote
│   │   ├── testimonials.ts             # Testimonial content (when available)
│   │   └── seo.ts                      # Per-page SEO metadata
│   │
│   └── types/
│       └── index.ts                     # Shared TypeScript interfaces
│
├── .env.local                           # Resend API key, WhatsApp number
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### Why This Structure

- **`data/` directory:** All copy lives in typed data files, not scattered across JSX. When Sofia's team wants to change a word, they edit one file — not search through components. This is the bridge to a future CMS migration: each data file maps directly to a Sanity schema.
- **`components/sections/`** vs **`components/ui/`:** Sections are full-width page regions that compose UI primitives. UI components are reusable atoms. This separation prevents 800-line God-components.
- **`components/motion/`:** Animation wrappers are isolated. If a future developer wants to swap in Framer Motion, they replace two files — not every section.
- **CSS Modules:** Each component's styles live next to it. No global class name collisions. No specificity wars. The compiled output uses hashed class names, keeping the HTML clean.
- **No `styles/` directory.** Global styles live in `globals.css` inside `app/`. Component styles live next to their components. There is no third location.

---

## 3. Component Hierarchy

```
RootLayout
├── Navigation
│   ├── Wordmark (text, not component)
│   ├── NavLinks (list)
│   ├── Button (Request Samples CTA)
│   └── LanguageToggle (text links)
│
├── Page (Homepage)
│   ├── Hero
│   │   ├── <video> / <img poster>
│   │   ├── Eyebrow
│   │   ├── Heading (h1)
│   │   ├── Body text
│   │   ├── Button (Explore)
│   │   └── TextLink (Request Sample)
│   │
│   ├── ScrollReveal → OriginMap
│   │   ├── <img> (SVG map)
│   │   ├── SectionHeader (Eyebrow + h2 + subline)
│   │   └── StatsStrip
│   │       └── StatBlock × 4
│   │
│   ├── ScrollReveal → Collections
│   │   ├── SectionHeader
│   │   └── FabricCard × 3
│   │       ├── <Image>
│   │       ├── Tag
│   │       ├── Heading (h3)
│   │       ├── Body text
│   │       └── TextLink (CTA)
│   │
│   ├── ScrollReveal → TrustPillars
│   │   ├── SectionHeader
│   │   └── Pillar × 4
│   │       ├── Number label
│   │       ├── Heading (h3)
│   │       └── Body text
│   │
│   ├── ScrollReveal → Founder
│   │   ├── <Image> (portrait)
│   │   ├── SectionHeader
│   │   ├── Body text (3 paragraphs)
│   │   ├── PullQuote
│   │   └── <Image> (certification)
│   │
│   ├── ScrollReveal → Testimonials (conditional render)
│   │   └── TestimonialBlock × n
│   │       ├── Quote text
│   │       └── Attribution
│   │
│   └── ScrollReveal → Contact
│       ├── SectionHeader
│       ├── Contact details
│       │   ├── Location
│       │   ├── Email link
│       │   ├── WhatsAppButton
│       │   └── Instagram link
│       └── Form
│           ├── FormField (name)
│           ├── FormField (company)
│           ├── FormField (role — select)
│           ├── FormField (project — textarea)
│           └── Button (submit)
│
└── Footer
    ├── Wordmark
    ├── Tagline
    ├── FooterLinks
    ├── Social links
    └── Legal line
```

### Component Count

The entire site is built from **18 unique components**. This is deliberately small. Each component earns its existence. If a pattern appears fewer than two times, it is inline markup — not a component.

---

## 4. Animation Strategy

### Layered Motion System

Motion is handled in three layers, each chosen for the specific problem it solves. The full motion language — tokens, component specs, reduced-motion behavior — is documented in `MOTION_SPEC.md`.

| Layer | Tool | Used For | Bundle Cost |
|---|---|---|---|
| **1. Section reveal** | Framer `whileInView` + `useReducedMotion` | One-shot scroll-revealed section entries, staggered children (eyebrow → headline → subline → CTAs) | Already in Framer |
| **2. Component motion** | Framer `motion` + `useMotionValue` + `useTransform` | TiltCard, MagneticButton, AnimatedFocusRing, ValidationMorph, Carousel slide entries | Already in Framer |
| **3. Primitive transitions** | CSS `transition` + custom properties | Color shifts on hover/focus, border color transitions, opacity on disabled states | 0 KB |

**Why three layers:**
- CSS transitions are the cheapest way to handle primitive state changes — they run on the compositor and require no JavaScript.
- Framer Motion's `useMotionValue` API enables 60fps cursor tracking (TiltCard, MagneticButton) without triggering React re-renders.
- Framer's `whileInView` is the modern, declarative replacement for the previous `data-revealed` Intersection Observer pattern, with built-in variants for staggered children.

### Layer 1 — Section Reveal

The `ScrollReveal` wrapper uses Framer's `whileInView` with the following configuration:

```tsx
// components/motion/ScrollReveal.tsx
<motion.section
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.15, margin: "0px 0px -60px 0px" }}
  variants={containerVariants}
>
  {children}
</motion.section>
```

**Per-section threshold:**
- Hero: `amount: 0.05` (fire as soon as any part is visible)
- Below-fold sections: `amount: 0.2` (wait for clearer intent)
- Stats strip: `amount: 0.3` (only count up when substantially visible)

**Stagger pattern:** Child variants use `staggerChildren: 0.08` to cascade eyebrow → headline → subline → CTAs in 80ms increments.

**One-shot guarantee:** `viewport.once: true` — animations never replay on scroll-up. Same behavior as the previous `data-revealed` architecture.

### Layer 2 — Component Motion

The full specs for each component are in `MOTION_SPEC.md`. Summary:

| Component | Trigger | Spring | Key Behavior |
|---|---|---|---|
| `TiltCard` | Mouse move (desktop), press (mobile) | stiffness 150, damping 18 | Cursor-aware 3D tilt, max 8°, image scale to 1.05, shadow elevation |
| `MagneticButton` | Mouse move (desktop only) | stiffness 260, damping 26 | Cursor-attracted translate, max 8px |
| `AnimatedFocusRing` | Focus / blur (any device) | stiffness 200, damping 22 | Shared `layoutId` morphs the focus indicator between form fields |
| `ValidationMorph` | Error / success events | n/a (timed) | Error slides in from top; success checkmark draws in via stroke-dasharray |
| `CarouselSlide` | Slide change | stiffness 120, damping 24 | Subtle Ken Burns scale-up on newly active slide |

**Touch parity:** TiltCard disables tilt on touch devices (no cursor) but retains the press state (scale 0.98 + shadow elevation). MagneticButton is a no-op on touch (no cursor). All other components work identically across input methods.

### Layer 3 — Primitive Transitions

For state changes that don't need spring physics:

```css
.textLink {
  color: var(--color-ardesia);
  text-decoration-color: transparent;
  transition: color 250ms var(--motion-ease-out),
              text-decoration-color 250ms var(--motion-ease-out);
}

.textLink:hover {
  color: var(--color-carbone);
  text-decoration-color: currentColor;
}
```

All primitive transitions read from motion tokens defined in `globals.css` (see `MOTION_SPEC.md` Section 2). Changing a token in one place updates every transition site.

### The CountUp Component

The stats strip requires number counting (0 → 100, 0 → 3, etc.). Uses a custom `requestAnimationFrame` loop with a spring-style easing function:

```tsx
// components/motion/CountUp.tsx
// requestAnimationFrame-driven
// Duration: 1200ms
// Easing: critically-damped spring approximation
// Triggers when parent ScrollReveal fires
// Renders final number immediately if prefers-reduced-motion
```

**Why a custom RAF loop, not Framer:** CountUp updates a number (text content) ~60 times per second. Animating it through Framer's `motion` would trigger 60 React re-renders per count. RAF + a `useRef` + direct text node mutation is the correct primitive. No library needed.

### Reduced-Motion Strategy

`prefers-reduced-motion: reduce` is consumed via the `useReducedMotion` hook and a media query in `globals.css`. The fallbacks are:

| Behavior | With motion | Without motion |
|---|---|---|
| Tilt | 8° rotation | None (flat) |
| Magnetic | 8px translate | None (static) |
| Section reveal | Fade + translate, 800ms | Instant — element appears in final state |
| Carousel | Slide entry animation | Instant — slide snaps in place |
| Form focus ring | Morph transition | Color change only |
| Validation error | Slide-down + pulse | Instant — text appears |
| CountUp | 1200ms spring count | Final value rendered immediately |

**Tokens collapse to 0:** The CSS motion tokens are defined inside a `@media (prefers-reduced-motion: no-preference)` block where appropriate, and a global override sets all `--motion-duration-*` to `0ms` when reduced motion is preferred. This means primitive CSS transitions also respect the setting.

---

## 5. Asset Management Strategy

### Fonts

- **Self-hosted.** Fonts are served from `/public/fonts/`, not from Google Fonts CDN. This eliminates a render-blocking external request, avoids a GDPR data-transfer concern (Google Fonts has been ruled non-compliant in some EU jurisdictions), and gives full control over `font-display: swap`.
- **Format:** WOFF2 only. Browser support is universal (>97%). No WOFF/TTF fallbacks needed.
- **Subsetting:** Fonts are subset to Latin + Latin Extended character ranges. This typically reduces file size by 40–60%. The Arabic version (V2) will require separate font files.
- **Loading strategy:** `font-display: swap` with a system font stack fallback. CSS:
  ```css
  --font-serif: 'Cormorant Garamond', 'Georgia', 'Times New Roman', serif;
  --font-sans: 'DM Sans', 'Helvetica Neue', 'Arial', sans-serif;
  ```

### Images

- **All images processed through Next.js `<Image>`.** This provides automatic:
  - Format negotiation (AVIF for Chrome, WebP for Safari, JPEG fallback)
  - Responsive `srcset` with breakpoint-appropriate sizes
  - Lazy loading with native `loading="lazy"`
  - Blur placeholder generation (a 10×10 blurred version embedded as base64 in the HTML)
- **Source images stored at 2× resolution.** If the displayed size is 600px wide, the source file is 1200px wide. This covers Retina/HiDPI displays.
- **Naming convention:** `[subject]-[variant].[ext]` — e.g., `tessuti-italiani-card.jpg`, `sofia-portrait-about.jpg`.
- **The origin map is SVG.** Inline SVG (not `<img>`) to allow CSS styling of paths, animation of route lines, and elimination of additional HTTP requests.

### Video

- **Two cuts of the hero video:**
  - `hero-desktop.mp4` — 1920×1080, 8MB max
  - `hero-mobile.mp4` — 720×1280 (9:16), 4MB max
- **Served with a `<source>` element** inside a `<video>` tag, with a `<picture>` fallback for the poster frame.
- **Loading:** `preload="none"` initially. JavaScript sets `preload="auto"` only when the hero section's Intersection Observer fires. On slow connections (detected via `navigator.connection.effectiveType`), skip video entirely and show the poster image.
- **The video element uses `playsinline`** — required for autoplay on iOS.

### Open Graph Image

- A single high-quality OG image at 1200×630px stored at `/public/images/og/og-default.jpg`.
- The image should be a fabric close-up with the Imperium wordmark overlaid in Cormorant — not a screenshot of the website.

---

## 6. Performance Strategy

### Budget

| Metric | Target | Rationale |
|---|---|---|
| **Largest Contentful Paint (LCP)** | < 2.5s | Google "Good" threshold. The hero video poster is the LCP element. |
| **First Input Delay (FID)** | < 100ms | Minimal JS means minimal main-thread blocking. |
| **Cumulative Layout Shift (CLS)** | < 0.1 | All images have explicit `width`/`height`. Fonts use `font-display: swap` with matched fallback metrics. |
| **Total Page Weight** | < 1.5MB | Excluding video. With video: < 9.5MB (video loads lazily). |
| **JavaScript Bundle** | < 130KB gzip | Framer Motion (~50KB) + Embla (~3KB) + Next.js + React runtime. No form library, no component library. Below-fold motion components are dynamically imported to keep the initial bundle lean. |
| **Time to Interactive (TTI)** | < 3.5s | Achieved through minimal JS and server rendering. |

### Techniques

**1. Static Generation (SSG)**
The homepage is statically generated at build time. No server-side rendering per request. The HTML is served from the CDN edge — Dubai, Riyadh, London all receive the page from the nearest PoP.

**2. Critical CSS Inlining**
Next.js automatically inlines critical CSS for the initial render. Combined with CSS Modules (which are tree-shaken per page), the first paint includes only the CSS needed for above-the-fold content.

**3. Font Optimisation**
```css
/* Fallback font metrics matched to Cormorant to minimise CLS */
@font-face {
  font-family: 'Cormorant Garamond Fallback';
  src: local('Georgia');
  ascent-override: 96.22%;
  descent-override: 29.89%;
  line-gap-override: 0%;
  size-adjust: 96.03%;
}
```
This technique (observable in the Effe Hospitality source) eliminates the layout shift when the custom font loads by matching the fallback font's metrics exactly.

**4. Image Priority**
The hero poster image uses `priority` prop on Next.js `<Image>` to preload it. All below-fold images use `loading="lazy"`.

**5. Video Loading Strategy**
```
Page load → Show poster image immediately
           → Intersection Observer detects hero in view
           → Check connection quality
           → If good: set video src, begin buffering, play when ready
           → If slow (2G/3G): keep poster, skip video entirely
```

**6. Resource Hints**
```html
<link rel="preload" href="/fonts/CormorantGaramond-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/DMSans-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="dns-prefetch" href="https://plausible.io">
```

**7. No Third-Party Scripts at Launch**
No Google Analytics, no Facebook Pixel, no HubSpot, no Intercom. Each third-party script adds 30–200KB and creates additional DNS lookups, TLS handshakes, and main-thread work. Plausible's script is < 1KB and loaded async.

---

## 7. SEO Strategy

### Technical SEO

**1. Server-Rendered HTML**
Every page is pre-rendered as complete HTML. Search engine crawlers receive the full content without executing JavaScript. This is the single most important SEO decision.

**2. Metadata Architecture**

```typescript
// src/lib/metadata.ts
import { Metadata } from 'next';

export function generatePageMetadata(page: PageKey): Metadata {
  return {
    title: seoData[page].title,
    description: seoData[page].description,
    openGraph: {
      title: seoData[page].ogTitle,
      description: seoData[page].ogDescription,
      images: [{ url: '/images/og/og-default.jpg', width: 1200, height: 630 }],
      locale: 'en_AE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData[page].title,
      description: seoData[page].description,
    },
    alternates: {
      canonical: seoData[page].canonical,
      languages: {
        'en': seoData[page].canonical,
        'ar': seoData[page].canonical.replace('.com/', '.com/ar/'), // V2
      },
    },
  };
}
```

**3. Heading Hierarchy**

Each page has exactly one `<h1>`. The homepage `<h1>` is the hero headline. Section headlines are `<h2>`. Card titles and pillar labels are `<h3>`. No heading level is skipped.

```
<h1>Where Italian craft meets the world.</h1>
  <h2>Born in Italy. Delivered to the world.</h2>
  <h2>Fabric with a story.</h2>
    <h3>Tessuti Italiani</h3>
    <h3>Pezzi Unici</h3>
    <h3>Ospitalità di Lusso</h3>
  <h2>Not just fabric. A guarantee of origin.</h2>
    <h3>Direct from the source</h3>
    <h3>Made in Italy expertise</h3>
    <h3>For the Gulf's luxury market</h3>
    <h3>Always available</h3>
  <h2>A love for Italy, built into every thread.</h2>
  <h2>Trusted by those who know the difference.</h2>
  <h2>Let's talk fabric.</h2>
```

**4. Semantic HTML**

```html
<header>   → Navigation
<main>     → Page content
<section>  → Each major content block, with aria-labelledby pointing to its h2
<article>  → Testimonial blocks, collection cards
<aside>    → Stats strip (supplementary information)
<address>  → Contact details
<footer>   → Site footer
```

**5. Structured Data (JSON-LD)**

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Imperium Italian Textile",
  "description": "Premium Italian fabrics sourced directly from Italy's finest mills.",
  "url": "https://imperiumitaliantextile.com",
  "logo": "https://imperiumitaliantextile.com/images/logo.png",
  "founder": {
    "@type": "Person",
    "name": "Sofia Mazza",
    "jobTitle": "Founder",
    "nationality": "Italian"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Dubai",
    "addressCountry": "AE"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "email": "hello@imperiumitaliantextile.com",
    "availableLanguage": ["English", "Arabic", "Italian"]
  },
  "sameAs": [
    "https://instagram.com/imperiumitaliantextile"
  ]
}
```

**6. Robots & Sitemap**

```typescript
// next.config.ts
// Generates sitemap.xml automatically via next-sitemap or App Router sitemap.ts

// src/app/robots.ts
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://imperiumitaliantextile.com/sitemap.xml',
  };
}
```

### Content SEO

**Target keywords** (from PRD):
- Italian fabric Dubai
- Italian linen supplier UAE
- Made in Italy fabric wholesale
- Luxury fabric Dubai tailor
- Hotel uniform fabric UAE
- Italian textile importer Dubai
- Premium linen hospitality Gulf

**Integration strategy:**
These terms are woven into the existing copy, not bolted on. The PRD copy already contains most of them naturally. The `<meta description>` tags use them explicitly. The heading hierarchy places them in `<h1>` and `<h2>` tags where they carry maximum weight.

**Image alt text** is critical: every fabric image gets a descriptive alt like `"Close-up of Italian linen fabric showing natural weave texture"` — not `"fabric-1"` or `"hero image"`.

### Performance SEO

Google's Core Web Vitals are ranking factors. The performance budget defined above directly serves SEO. A sub-2.5s LCP and < 0.1 CLS will place the site in the "Good" category, which is a ranking advantage over slower competitors.

---

## 8. Arabic (RTL) Strategy — V2

The PRD mentions an EN/AR toggle. Full RTL support is a V2 feature, but the architecture must not block it.

### Preparation in V1

- **CSS logical properties throughout.** Use `padding-inline-start` instead of `padding-left`, `margin-block-end` instead of `margin-bottom`. This makes the entire layout RTL-ready without rewriting CSS.
- **No hardcoded directional values.** Arrow characters (→) are wrapped in a `<span dir="ltr">` or replaced with CSS `::after` pseudo-elements that can be flipped.
- **Content data files are structured for i18n.** Each data file exports content keyed by locale:
  ```typescript
  export const heroContent = {
    en: { headline: 'Where Italian craft...', subline: '...' },
    ar: { headline: '...', subline: '...' }, // V2
  };
  ```
- **The `lang` attribute on `<html>` is dynamic.** Set by the route segment (`/ar/` prefix).

---

## 9. Accessibility

- **WCAG 2.1 AA compliance** is the target.
- All colour combinations meet 4.5:1 contrast ratio for body text and 3:1 for large text.
  - Ardesia (`#4A4540`) on Pietra (`#FAF8F3`): contrast ratio **7.3:1** ✓
  - Carbone (`#1A1A1A`) on Pietra (`#FAF8F3`): contrast ratio **15.2:1** ✓
  - Gesso (`#FFFFFF`) on Blu Notte (`#1B2A4A`): contrast ratio **12.8:1** ✓
  - Sabbia (`#B8A99A`) on Pietra (`#FAF8F3`): contrast ratio **2.5:1** — used only for decorative labels and eyebrows at ≥ 18px, which meets the large-text threshold.
- All images have descriptive `alt` text.
- All form inputs have associated `<label>` elements.
- Focus states are visible and never suppressed.
- The site is navigable by keyboard alone.
- `prefers-reduced-motion` is respected for all animations.
- Skip-to-content link is the first focusable element.
- The video has no audio, so captions are not required — but a text description of the video content is provided as visually hidden text.

---

*This architecture is designed to be the simplest system that produces a world-class result. Every dependency must justify its presence. Every abstraction must earn its complexity. The site that ships 130KB of JavaScript will always beat the site that ships 800KB — not just in load time, but in the confidence it communicates. Framer Motion and Embla are the only two libraries that earned their place through user-facing tactile quality; everything else is hand-authored.*

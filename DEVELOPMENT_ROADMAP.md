# Imperium Italian Textile — Development Roadmap

**Version 1.1 · June 2026**

> Phased, not scheduled. Each phase is sized to be completed in a single Qwen 3.7 max session, ends with a localhost verification gate, and is reviewed by the human before the next phase begins. The site is built one phase at a time. No durations, no deadlines, no cumulative day counts.

---

## Execution Model

This roadmap is organised in **phases**, not on a timeline. The model is:

1. **One phase at a time.** Phases execute strictly in order. Qwen 3.7 max completes one phase per session and hands off the working build to the human.
2. **Localhost verification gate.** Every phase ends with a `Localhost Verification` subsection in its milestone. The human runs `npm run dev`, walks the browser checklist, and makes any fine-tune adjustments before approving the next phase.
3. **Placeholders are the default.** External assets (hero video, fabric photography, origin map, founder portrait, certification image) ship as placeholders during their phase. Real assets are swapped in during the fine-tune pass on localhost. A phase never blocks on an external deliverable.
4. **Production work is deferred to Phase 6.** DNS, custom domain, Resend domain verification, Search Console, and the final deploy all live in the Phase 6 launch sub-block. Earlier phases are entirely localhost-testable.
5. **Qwen 3.7 max is the executor.** Each phase is sized so a single Qwen 3.7 max session can complete it end-to-end with the localhost verification gate satisfied.
6. **Email is mocked on localhost.** The contact form's server action returns a mock success response and logs the payload to the console when `RESEND_API_KEY` is absent. The full UI flow (validation, success, error states, ValidationMorph) is testable without real email. Production email activates in Phase 6.

---

## Build Philosophy

The hero section is the brand. Everything else supports it. If the hero loads beautifully, renders the placeholder image (or video, when ready), sets the typographic tone, and makes the navigation functional — the site is already credible. Every subsequent phase adds depth to that credibility.

The build order follows a cinematic logic: establish the opening shot, then reveal the story. At the end of any phase, the deployed preview tells a coherent (if incomplete) story. At the end of Phase 2, the site has a hero. At the end of Phase 3, it has a hero and products. At the end of Phase 4, it is feature-complete. The site is always *presentable*, never *broken*.

---

## Phase 1 — Foundation

**Depends on:** Nothing
**Delivers:** A running Next.js project with all design tokens in place, testable on `localhost:3000`

### Tasks

| # | Task | Detail |
|---|---|---|
| 1.1 | Initialise Next.js project | `npx -y create-next-app@latest ./ --typescript --app --src-dir --no-tailwind --no-eslint --import-alias "@/*"` |
| 1.2 | Remove boilerplate | Delete default page content, icons, and example CSS |
| 1.3 | Set up folder structure | Create all directories as defined in `TECHNICAL_ARCHITECTURE.md` |
| 1.4 | Install dependencies | `resend` (email), `framer-motion` (animation), `embla-carousel-react` (carousel), `@types/node`, and nothing else. The goal is minimal runtime dependencies — only what `MOTION_SPEC.md` and the architecture document justify. |
| 1.5 | Configure `next.config.ts` | Image domains, security headers, redirects |
| 1.6 | Add fonts to `/public/fonts/` | Download and subset Cormorant Garamond (Regular, Medium, SemiBold, Italic, MediumItalic) and DM Sans (Regular, Medium) to WOFF2 |
| 1.7 | Write `globals.css` | Complete design token system: CSS custom properties for colours, type scale, spacing scale, font-face declarations with fallback metrics, CSS reset, base element styles |
| 1.8 | Configure fonts in `layout.tsx` | Register fonts, apply to body |
| 1.9 | Create `Section` wrapper component | Handles max-width, padding, responsive margins |
| 1.10 | Create `Eyebrow` component | Reusable label pattern |
| 1.11 | Create `SectionHeader` component | Eyebrow + headline + subline composition |
| 1.12 | Create `Button` component | Ghost and filled variants |
| 1.13 | Create `TextLink` component | Animated underline pattern |

### Milestone: Foundation Complete ✓

**Why this comes first:** Every component built after this point will inherit the design tokens. If the tokens are wrong, every component is wrong. Establishing the visual system before any content prevents the common failure mode of "fix the design later" — which never happens.

#### Localhost Verification

Run `npm run dev` and open `http://localhost:3000`. Confirm:

- [ ] The page renders as a blank Pietra-coloured background (`#FAF8F3`)
- [ ] Cormorant Garamond and DM Sans load — no FOUT, no layout shift when fonts swap in
- [ ] Open DevTools → Elements → inspect `<html>` → all CSS custom properties are present in `:root` (colours, type scale, spacing)
- [ ] No console errors, no failed network requests in the Network tab
- [ ] `Section`, `Eyebrow`, `SectionHeader`, `Button`, and `TextLink` are exported and importable from their module paths

**Fine-tune on localhost before approving Phase 2.** Adjust token values, font weights, and base component styles until the foundation matches the intent of `DESIGN.md`. Only then proceed.

---

## Phase 2 — Navigation + Hero

**Depends on:** Phase 1
**Delivers:** The first meaningful page impression, testable on `localhost:3000`

### Tasks

| # | Task | Detail |
|---|---|---|
| 2.1 | Build `Navigation` component | Wordmark, nav links, CTA button, language toggle. Desktop layout with fixed positioning. Transparent → opaque scroll transition. |
| 2.2 | Build mobile navigation | Full-screen overlay, hamburger toggle (two-line, not three), stacked nav links in Cormorant, WhatsApp CTA at bottom |
| 2.3 | Build `Hero` section | Full-viewport layout, video element with poster frame, content overlay with gradient, headline + subline + CTAs, scroll indicator line |
| 2.4 | Implement hero video loading | Intersection Observer-based lazy loading, connection quality detection, fallback to poster image on slow connections |
| 2.5 | Source/prepare hero video | **Placeholder strategy:** use a high-resolution still photograph of Italian fabric/texture as the hero background. The real 15–20s mill footage is acquired separately and swapped in during the localhost fine-tune pass. The design accommodates a still image identically. Encode to H.264 MP4 (desktop 1920×1080, ≤8MB; mobile 720×1280, ≤4MB) and extract a poster frame as JPEG when the real video arrives. |
| 2.6 | Hero entry animation | Page load animation for headline (translate Y + opacity), subline (delayed), CTAs (further delayed). CSS-only with `@keyframes`. 80ms cascade between children (eyebrow → headline → subline → CTAs). |
| 2.7 | Write `useReducedMotion` hook | Wraps `prefers-reduced-motion` media query |
| 2.8 | Write `useIntersectionObserver` hook | Core scroll detection logic — used by hero video loading (2.4). Framer's `whileInView` handles section reveals; this hook remains for non-Framer IntersectionObserver needs. |
| 2.9 | Rewrite `ScrollReveal` to use Framer Motion | Replaces the `data-revealed` attribute pattern with Framer's `whileInView` + variants API. Stagger children at 80ms. One-shot (`viewport.once: true`). Per-section thresholds from `MOTION_SPEC.md` Section 3.6. |
| 2.10 | Add motion token system to `globals.css` | All `--motion-duration-*`, `--motion-ease-*`, and `--motion-distance-*` custom properties per `MOTION_SPEC.md` Section 2. Includes the `@media (prefers-reduced-motion: reduce)` block that collapses durations to 0ms. |
| 2.11 | Create `lib/motion.ts` with spring presets and variants | Exports `springs` (soft, standard, firm, snap) and `sectionReveal` / `childReveal` variants. Centralises all Framer config so tokens have a single source of truth. |
| 2.12 | Confirm motion bundle impact | Measure Framer Motion + Embla's contribution to the initial JS bundle. Verify it stays under the 130KB gzip budget. If over, audit imports and consider lazy-loading the carousel. |

### Milestone: First Impression ✓

**Why this comes second:** The hero is the most technically complex section (video loading, animation, responsive nav, transparent-to-opaque transition) and the most emotionally important. Building it early gives maximum time for iteration. The fine-tune pass on localhost is where the placeholder still image is replaced with the real video when the asset is ready.

#### Localhost Verification

Run `npm run dev` and open `http://localhost:3000`. Confirm:

- [ ] Navigation bar is fixed at the top, transparent on initial load
- [ ] Scroll down 100px → nav becomes opaque (Pietra background) with a subtle bottom border in Sabbia
- [ ] Resize to mobile width (< 768px) → nav collapses to full-screen overlay, hamburger toggle (two thin lines) opens/closes it
- [ ] Mobile nav links stack vertically in Cormorant; WhatsApp CTA at the bottom of the overlay
- [ ] Hero fills the viewport (100dvh) with the placeholder still image
- [ ] Headline, subline, and CTAs animate in with 80ms cascade on page load
- [ ] Resize to mobile → vertical placeholder image, stacked headline, no horizontal scroll
- [ ] Toggle OS reduced-motion preference → all entry animations collapse to instant; elements appear in final state
- [ ] `prefers-reduced-motion` is respected across all components in this phase
- [ ] No console errors, no failed requests, no layout shift on load

**Fine-tune on localhost before approving Phase 3.** Test the transparent-to-opaque nav transition. Confirm the hero typography reads correctly against the placeholder image. When the real hero video asset arrives, swap it in and re-verify 2.4 and 2.5.

### Risk: Hero Video Asset Availability

The hero video is a creative asset, not a code deliverable. The placeholder still image strategy is the explicit fallback. When professional mill footage is available:

- Encode to the spec in 2.5 and place at `/public/video/hero-desktop.mp4` and `/public/video/hero-mobile.mp4`
- The video element, poster frame, and lazy-loading logic are already in place
- The fine-tune pass is the swap point

---

## Phase 3 — Content Sections

**Depends on:** Phase 2
**Delivers:** The complete narrative arc from origin story to product offering, testable on `localhost:3000`

### Tasks

| # | Task | Detail |
|---|---|---|
| 3.1 | Build `OriginMap` section | Asymmetric layout (7/5 columns). Inline SVG map. Text content with SectionHeader. |
| 3.2 | Commission or create the origin map SVG | **Placeholder strategy:** use a simplified programmatic SVG — a minimal outline of Italy with route lines to labelled cities (Dubai, Riyadh, London, Mumbai). Italy filled in Sabbia, routes in Blu Notte, Mumbai dashed. The hand-drawn commissioned illustration is swapped in during the localhost fine-tune pass. |
| 3.3 | Build `StatsStrip` section | Horizontal strip on Gesso background. Four StatBlock components. Vertical dividers between them. |
| 3.4 | Build `CountUp` component | requestAnimationFrame-based number animation. Triggers on scroll reveal. Respects reduced motion. |
| 3.5 | Build `Collections` section | SectionHeader + three FabricCard components. |
| 3.6 | Build `FabricCard` component | Image (4:5), tag strip, title (italic Cormorant), body text, CTA link. Hover: image scale 1.03 within clipped container. |
| 3.7 | Source/prepare fabric photography | **Placeholder strategy:** use licensed stock close-up fabric textures (Unsplash, Artgrid — search "Italian textile," "linen weave," "silk macro") for the three collection cards. The originals are swapped in during the localhost fine-tune pass. |
| 3.8 | Populate `data/` files | `collections.ts`, `navigation.ts` with PRD copy |
| 3.9 | Mobile horizontal scroll for cards | CSS `scroll-snap-type: x mandatory` with 85vw card width and snap points (replaced in Phase 5 by the Embla carousel) |
| 3.10 | Connect ScrollReveal to all sections | Wrap OriginMap, StatsStrip, and Collections in ScrollReveal with appropriate delays |

### Milestone: Story Told ✓

**Why this order:** These three sections (map, stats, products) answer the visitor's first three questions: "Where does this come from?" → "What scale is this?" → "What can I buy?" Building them in narrative order ensures the scrolling experience makes emotional sense, not just structural sense. The placeholder strategy keeps the phase localhost-testable without blocking on commissioned illustration or original photography.

#### Localhost Verification

Run `npm run dev` and open `http://localhost:3000`. Confirm:

- [ ] Scroll past the hero → OriginMap section fades in (7/5 column split, programmatic SVG map with Italy and route lines to labelled cities)
- [ ] StatsStrip on Gesso background, four numbers count up from 0 when ~30% in view
- [ ] Three FabricCards render in a row on desktop, with stock fabric images, tag strips, italic Cormorant titles
- [ ] On mobile width, the cards scroll horizontally with snap points (CSS scroll-snap until Phase 5 swaps in Embla)
- [ ] Card hover → image scale to 1.03 within the clipped container
- [ ] All section scroll-reveals fire once and stay (no re-trigger on scroll-up)
- [ ] Toggle reduced-motion → CountUp renders final value immediately, no fade-in
- [ ] No CLS, no console errors

**Fine-tune on localhost before approving Phase 4.** When the commissioned map illustration and original fabric photography arrive, swap them in via the paths in `data/collections.ts` and the inline SVG import in `OriginMap.tsx`. Re-verify 3.1–3.7.

### Risk: Map Illustration & Fabric Photography

Both are design dependencies, not code ones. The placeholder strategy is explicit:

- The simplified programmatic SVG in 3.2 preserves the information architecture (Italy, four cities, dashed Mumbai)
- The licensed stock in 3.7 preserves the card composition (4:5 close-up texture)
- The fine-tune pass on localhost is the swap point for both
- The phase never blocks on these deliverables

---

## Phase 4 — Trust + Identity + Contact

**Depends on:** Phase 3
**Delivers:** The credibility and conversion layers — why Imperium, who Sofia is, what clients say, and how to start a conversation. Fully testable on `localhost:3000` with mocked email submission.

### Tasks

| # | Task | Detail |
|---|---|---|
| 4.1 | Build `TrustPillars` section | Full-width Gesso band. Four pillars with numbered labels, headings, body text. Vertical dividers on desktop, horizontal on mobile. |
| 4.2 | Build `Founder` section | Asymmetric layout (5/7 columns). Portrait image left, text content right. Three paragraphs of bio. |
| 4.3 | Build `PullQuote` component | Centred quote in Cormorant italic, attribution in DM Sans uppercase with Oro Antico colour. |
| 4.4 | Add certification image | **Placeholder strategy:** until Sofia's Made in Italy certification scan is available, render a text-only mention in the slot — "Certified Made in Italy Expert" in DM Sans 400, 11px, Sabbia, centred. The scanned image is swapped in during the localhost fine-tune pass. |
| 4.5 | Source Sofia's portrait | **Placeholder strategy:** use a fabric close-up in the same 3:4 aspect ratio with the caption "Sofia Mazza, Founder" and a small "Portrait coming soon" note. The professional portrait is swapped in during the localhost fine-tune pass. |
| 4.6 | Build `Testimonials` section | Conditional render based on data availability. Single centred column with stacked testimonial blocks. |
| 4.7 | Implement testimonial visibility logic | If `data/testimonials.ts` exports an empty array, the section does not render. No placeholder "[Name]" text ever appears live. |
| 4.8 | Populate `data/` files | `pillars.ts`, `founder.ts`, `testimonials.ts` |
| 4.9 | Build `Contact` section | Split layout (7/5 columns). Left: text + contact details. Right: form. |
| 4.10 | Build `FormField` component | Underline-style inputs. Label above. Focus state transitions. Custom select dropdown for "Your role." |
| 4.11 | Build `WhatsAppButton` component | Filled button with WhatsApp green, pill shape. Links to `wa.me/[number]`. |
| 4.12 | Build mobile fixed WhatsApp bar | 56px bottom bar, always visible on mobile. Slim, unobtrusive, persistent. |
| 4.13 | Implement form submission | React Server Action → validate → send email via Resend → return success/error state. **Localhost mock:** when `RESEND_API_KEY` is absent, the server action returns a mock success response and `console.log`s the payload. The full UI flow (validation, success, error states) is testable on localhost without real email. |
| 4.14 | Build form states | Default → Loading (button text "Sending...", line animation) → Success ("Thank you. We'll be in touch within 24 hours.") → Error ("Something went wrong. Please try WhatsApp or email directly.") |
| 4.15 | Set up Resend integration | API key in `.env.local`. Email template: clean text format (no HTML email template — matches the brand's restraint). Sends to Sofia's inbox with all form fields. The integration is wired but only fires real email when `RESEND_API_KEY` is set. |
| 4.16 | Build `Footer` | Dark background section. Wordmark, tagline, footer links, social handles, legal line. |
| 4.17 | Populate `data/` files | Contact details, form configuration |
| 4.18 | Add form validation | Client-side: required fields, email format. No external validation library — native HTML5 validation + minimal JS. |

### Milestone: Trust + Conversion Ready ✓

**Why this order:** Trust and identity come after the product because a visitor must first understand *what* Imperium does before caring *who* does it. The conversion layer (contact form) comes after trust because the form's typographic rhythm, spacing, and colour temperature must be built with the full context of every section above it. The mock email strategy keeps the phase 100% localhost-testable.

#### Localhost Verification

Run `npm run dev` and open `http://localhost:3000`. Confirm:

- [ ] TrustPillars display as a clean, numbered manifesto on a Gesso band (vertical dividers on desktop, horizontal on mobile)
- [ ] Founder section: 5/7 column split, portrait placeholder (fabric close-up) on left, three bio paragraphs on right
- [ ] PullQuote renders in Cormorant italic, centred, with Oro Antico attribution
- [ ] Certification slot shows the text-only placeholder
- [ ] Testimonials: hidden when `data/testimonials.ts` is empty; renders if real data is added during fine-tune
- [ ] Contact section: 7/5 split, form on right with name/company/role/project fields, WhatsApp button filled with `#25D366` on left
- [ ] Mobile fixed WhatsApp bar visible at the bottom on mobile width
- [ ] Submit form empty → ValidationMorph shows error states (red border, error message)
- [ ] Submit valid form → server action logs payload to console (mock), shows success state ("Thank you...")
- [ ] Footer renders at the bottom with all links functional
- [ ] No console errors, no layout shift, no broken links

**Fine-tune on localhost before approving Phase 5.** When Sofia's portrait, certification scan, and any real testimonials arrive, swap them in. Update `data/founder.ts`, replace 4.4 and 4.5 placeholders. Re-verify 4.1–4.8.

### Risk: Form Spam

Resend is reliable but the form will attract spam. The mitigation:
- Implement a honeypot field (hidden field that bots fill but humans don't)
- No CAPTCHA — CAPTCHAs destroy the editorial experience
- If spam volume grows, add Turnstile (Cloudflare's invisible CAPTCHA) in a later release

### Risk: Resend Domain Verification

The domain `imperiumitaliantextile.com` must be registered and DNS records (SPF, DKIM, DMARC) configured before real email works in production. On localhost with no `RESEND_API_KEY`, the form mocks to console — so this risk is deferred to Phase 6 (Launch). Domain registration can begin any time and does not block Phase 4.

---

## Phase 5 — Premium Touchpoint Layer

**Depends on:** Phase 4
**Delivers:** The tactile, Apple/Vitra-grade responsiveness that the architecture now targets. Testable on `localhost:3000`.

This phase implements the motion components specified in `MOTION_SPEC.md` and integrates them into the existing section components. None of these tasks change content; they elevate the feel of what's already built.

### Tasks

| # | Task | Detail |
|---|---|---|
| 5.1 | Build `TiltCard` component | Cursor-aware 3D tilt (max 8°), image scale to 1.05, two-layer shadow elevation, eyebrow color shift to Oro Antico, underline draw-in on CTA. Touch parity: scale 0.98 + shadow on press, no tilt. Per `MOTION_SPEC.md` 3.1. |
| 5.2 | Build `MagneticButton` component | Cursor-attracted translate, max 8px, spring `firm` (stiffness 260, damping 26). Touch devices: no-op. Per `MOTION_SPEC.md` 3.2. |
| 5.3 | Build `AnimatedFocusRing` component | Shared `layoutId="form-focus-ring"` morphs the focus indicator between `FormField` instances. Spring `soft` (stiffness 200, damping 22). Label float on focus. Per `MOTION_SPEC.md` 3.3. |
| 5.4 | Build `ValidationMorph` component | Error state: 8px slide-down + opacity, border pulse. Success state: checkmark draws via stroke-dasharray, button text crossfades, micro-bounce. `navigator.vibrate(8)` on submit attempt. Per `MOTION_SPEC.md` 3.4. |
| 5.5 | Build `EmblaContainer` + `CarouselSlide` | Embla Carousel wrapper with `dragFree: false`, `containScroll: "trimSnaps"`. Slide entry animation via Framer. Ken Burns on active slide image (1.0 → 1.04 over 6s). Pagination dots use shared `layoutId` for the active background. `touch-action: pan-y` on the track. Per `MOTION_SPEC.md` 3.5. |
| 5.6 | Integrate `TiltCard` into `FabricCard` | Replace the static `FabricCard` with the `TiltCard` wrapper. Remove the existing CSS-only hover scale (1.03); the TiltCard handles the visual response now. |
| 5.7 | Integrate `AnimatedFocusRing` + `ValidationMorph` into `FormField` + `Contact` form | Replace the existing CSS focus border transition with the `layoutId` ring. Wire `ValidationMorph` to the form's success / error states. Add `touch-action: manipulation` to all form inputs. |
| 5.8 | Replace `Collections` grid with `EmblaContainer` | Mobile and desktop both render the single-slide, draggable carousel. Remove the existing CSS `scroll-snap-type: x mandatory` mobile fallback (Phase 3.9). Pagination dots below the carousel. |
| 5.9 | Apply `MagneticButton` to primary CTAs | Hero "Explore" button, WhatsApp button, and the form submit button. Skip on touch devices. |
| 5.10 | Replace `CountUp` with spring-eased version | Custom RAF + critically-damped spring approximation. Zero React re-renders during count. Direct text node mutation. Per `MOTION_SPEC.md` 3.7. |
| 5.11 | Add `touch-action: manipulation` globally | Apply to all interactive elements (buttons, links, form fields, card roots). Prevents 300ms double-tap-to-zoom delay and iOS long-press callout. |
| 5.12 | Replace `100vh` with `100dvh` in full-viewport sections | Hero, mobile nav overlay, any section that should respect the mobile URL bar collapse. `min-height: 100svh` as fallback. |

### Milestone: Tactile ✓

**Why this comes after the content phases, not within them:** The content sections are about information architecture — what the visitor sees and reads. The touchpoint layer is about how it *feels* to interact with what's already there. Building them as separate phases means the content is solid and unchanging when motion work begins, so motion decisions don't accidentally rewrite copy or restructure layout.

#### Localhost Verification

Run `npm run dev` and open `http://localhost:3000`. Confirm:

- [ ] Hover over a FabricCard on desktop → cursor-aware 3D tilt (max ±8°), image scales to 1.05, two-layer shadow elevates, eyebrow shifts to Oro Antico, CTA underline draws in
- [ ] Touch/press a FabricCard on mobile (or DevTools mobile emulation) → scale 0.98 + shadow elevation, no tilt
- [ ] Hover primary CTA buttons (Hero "Explore", WhatsApp, Form Submit) → magnetic cursor attraction, max 8px translate, springs back on release
- [ ] MagneticButton is a no-op on touch devices
- [ ] Tab through form fields → AnimatedFocusRing morphs between fields as the focused `layoutId` ring slides
- [ ] Labels float up on focus with 16px → 12px size change
- [ ] Submit empty form → ValidationMorph error: 8px slide-down + opacity, border pulse, field border turns error red
- [ ] Submit valid form → checkmark draws via stroke-dasharray, button text crossfades to "Thank you," micro-bounce on button
- [ ] `navigator.vibrate(8)` fires on submit attempt (Android only, silent no-op elsewhere)
- [ ] Swipe Collections carousel on mobile → momentum, snap points, vertical page scroll NOT hijacked
- [ ] Drag carousel on desktop → drag with snap to slides
- [ ] Pagination dots below carousel use shared `layoutId` for the active background (slides smoothly between dots)
- [ ] Hero is fluid: `100dvh` (not `100vh`), respects mobile URL bar collapse
- [ ] All above still works with `prefers-reduced-motion: reduce` enabled — falls back to documented static state
- [ ] No console errors, no dropped frames during cursor tracking (verify with React DevTools Profiler)

**Fine-tune on localhost before approving Phase 6.** Adjust spring stiffness, tilt angles, and magnetic strength until the motion matches the intent of `MOTION_SPEC.md`. Test on real iPhone and Android devices if available, or at minimum via DevTools touch emulation.

### Risk: Bundle Bloat

Framer Motion + Embla add ~53KB gzipped to the JS bundle. If the 130KB budget is breached after integration, the mitigations are:

- Lazy-load `EmblaContainer` with `next/dynamic` (only loads when the user scrolls near the Collections section)
- Lazy-load `TiltCard` for the below-fold fabric cards
- Use Framer's `m` (mini motion) instead of `motion` for components that don't need layout animations
- Audit imports — `framer-motion` exports a tree-shakable surface; importing from `framer-motion` (the index) pulls in everything

---

## Phase 6 — Polish + Performance + Launch

**Depends on:** Phase 5
**Delivers:** A launch-ready website on a custom domain

This phase is split into two sub-blocks. **6.A is entirely localhost-testable.** **6.B is production deployment work that can only be verified on the live domain.**

---

### Phase 6.A — Localhost Polish

**Delivers:** A site that passes Lighthouse, a11y, SEO, and cross-browser audits on `localhost:3000`.

#### Tasks

| # | Task | Detail |
|---|---|---|
| 6.1 | Performance audit | Run Lighthouse on desktop and mobile. Target: Performance > 95, Accessibility > 95, SEO > 95, Best Practices > 95. |
| 6.2 | CLS audit | Check every section for layout shift. Common culprits: font swap, images without dimensions, late-loading content. |
| 6.3 | Cross-browser testing | Chrome, Safari, Firefox (desktop). Chrome, Safari (mobile). Edge. Focus on: video autoplay, font rendering, scroll snap, CSS custom properties. |
| 6.4 | Mobile testing on real devices | iPhone (Safari), Android (Chrome). Test on actual devices, not just DevTools emulation. Focus on: WhatsApp bar, touch targets, video behaviour, form input zoom, TiltCard press state on iOS Safari (no tilt, scale 0.98 + shadow elevation), Carousel swipe on Android Chrome (momentum, snap points, vertical scroll not hijacked), MagneticButton is a no-op (no cursor), form `ValidationMorph` renders correctly on touch, `touch-action: manipulation` prevents double-tap zoom on form fields. |
| 6.5 | Implement SEO metadata | JSON-LD structured data, sitemap, robots.txt, canonical URLs, Open Graph tags for all pages. |
| 6.6 | Add Plausible Analytics | One `<script>` tag. Configure custom events: form submission, WhatsApp click, Instagram click. |
| 6.7 | Add skip-to-content link | First focusable element, visually hidden until focused. |
| 6.8 | Keyboard navigation audit | Tab through every interactive element. Verify focus order is logical. Verify focus styles are visible. |
| 6.9 | Image alt text audit | Every `<Image>` has descriptive, non-redundant alt text. |
| 6.10 | Final content review | Every word on the site matches the PRD. Every link works. Every email address is correct. Sofia reviews and approves. |
| 6.11 | Security headers | Content-Security-Policy, X-Frame-Options, Referrer-Policy, Permissions-Policy. Configured in `next.config.ts`. |
| 6.12 | Custom 404 page | Custom 404 page in brand style. "This page doesn't exist. Let's get you back." with a link home. |

#### Milestone: Localhost Polish Complete ✓

**Localhost Verification**

Run `npm run dev` and run the full audit suite. Confirm:

- [ ] Lighthouse (desktop and mobile): Performance > 95, Accessibility > 95, SEO > 95, Best Practices > 95
- [ ] No CLS > 0.1 anywhere on the page
- [ ] No console errors in any tested browser
- [ ] `view-source:http://localhost:3000` shows complete JSON-LD, OG tags, canonical URLs in `<head>`
- [ ] `view-source:http://localhost:3000/sitemap.xml` renders the sitemap
- [ ] `view-source:http://localhost:3000/robots.txt` renders correctly
- [ ] Plausible script tag visible in the HTML
- [ ] Tab from `http://localhost:3000` — skip-to-content link is the first focusable element, visible on focus
- [ ] Navigate to a non-existent path (e.g. `/does-not-exist`) — custom 404 page renders in brand style
- [ ] All interactive elements have visible focus styles
- [ ] Image alt text is descriptive and non-redundant
- [ ] All PRD copy matches what is rendered

**Fine-tune on localhost before approving Phase 6.B.** Address every Lighthouse flag, every console error, every broken link, every content discrepancy. The site should be production-ready in code, content, and design before the launch sub-block begins.

---

### Phase 6.B — Launch

**Delivers:** The site is live on `imperiumitaliantextile.com` with real email delivery and Search Console indexing.

The production-only tasks in this sub-block are not localhost-testable. They are verified on the live domain. Domain registration, Resend account, and Search Console access can be set up any time before this sub-block begins — none of it blocks the 6.A polish work.

#### Tasks

| # | Task | Detail |
|---|---|---|
| 6.13 | Deploy to Vercel | Connect the GitHub repository, confirm production build succeeds, verify the preview URL matches the localhost behaviour. |
| 6.14 | Connect custom domain | Point `imperiumitaliantextile.com` DNS to Vercel. SSL auto-provisioned. |
| 6.15 | Verify DNS propagation | Confirm the site loads on the custom domain from multiple locations (DNS checker, friends in Dubai and Europe). |
| 6.16 | Configure email domain | Set `RESEND_API_KEY` in Vercel environment variables. Configure SPF, DKIM, DMARC for `imperiumitaliantextile.com` via Resend's domain verification flow. Test a real form submission to Sofia's inbox. |
| 6.17 | Submit to Google Search Console | Verify ownership, submit sitemap. |
| 6.18 | Final smoke test + launch | Fill out the form live. Click every link. Test WhatsApp. View on mobile. Remove any "under construction" flags. Announce. |

#### Milestone: Live ✓

**Production Verification** (on the live domain, not localhost):

- [ ] `https://imperiumitaliantextile.com` loads with HTTPS, valid certificate
- [ ] Form submission delivers a real email to Sofia's inbox
- [ ] Google Search Console shows the sitemap as submitted and processed
- [ ] No "under construction" or "coming soon" text visible anywhere on the live site
- [ ] Sofia has approved the final result

---

## Dependency Graph

```
Phase 1 (Foundation)
    │
    ├── Phase 2 (Nav + Hero)
    │       │
    │       ├── Phase 3 (Content Sections)
    │       │       │
    │       │       ├── Phase 4 (Trust + Identity + Contact)
    │       │       │       │
    │       │       │       ├── Phase 5 (Premium Touchpoint Layer)
    │       │       │       │       │
    │       │       │       │       ├── Phase 6.A (Localhost Polish)
    │       │       │       │       │       │
    │       │       │       │       │       └── Phase 6.B (Launch)
    │       │       │
    │       │       └── [Origin map SVG] ← External asset, swapped in during Phase 3 fine-tune
    │       │       └── [Fabric photography] ← External assets, swapped in during Phase 3 fine-tune
    │       │
    │       └── [Hero video asset] ← External asset, swapped in during Phase 2 fine-tune
    │
    └── [Domain registration] ← External dependency, can begin any time, needed for Phase 6.B
```

---

## Critical External Dependencies

These are the items that cannot be built by a developer and must be commissioned or acquired separately. They do not block any phase's localhost work — they are swapped in during the relevant phase's fine-tune pass, except for domain registration which is needed for Phase 6.B.

| Dependency | Owner | Needed By | Fallback |
|---|---|---|---|
| **Hero video (15–20s mill footage)** | Sofia / Videographer | Phase 2 fine-tune | High-res still photograph of Italian fabric (already shipped as placeholder) |
| **Origin map illustration** | Illustrator / Designer | Phase 3 fine-tune | Simplified programmatic SVG with city labels (already shipped as placeholder) |
| **Fabric photography ×3** | Photographer / Sofia | Phase 3 fine-tune | Licensed stock (already shipped as placeholder) |
| **Sofia portrait** | Photographer | Phase 4 fine-tune | Fabric texture placeholder in same aspect ratio (already shipped) |
| **Made in Italy certification scan** | Sofia | Phase 4 fine-tune | Text-only mention (already shipped) |
| **Real testimonial (≥1)** | Sofia | Phase 4 fine-tune or post-launch | Section hidden until available |
| **Domain registration** | Sofia / Developer | Phase 6.B | None — cannot launch without domain |
| **WhatsApp Business number** | Sofia | Phase 4 (in `data/`), real link in Phase 6.B | Personal WhatsApp number as interim |
| **Resend account + domain verification** | Developer | Phase 6.B | None for production email; localhost form works without it (mocked) |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Hero video not ready at Phase 2 fine-tune** | High | Medium | Placeholder still image already in place. The fine-tune pass on localhost is the swap point. |
| **No professional photography available** | Medium | High | Use curated stock photography as placeholder. The PRD's copy carries the brand even without original imagery — but original photography should be the top post-launch investment. |
| **Domain not registered in time for Phase 6.B** | Low | Critical | Register the domain as early as possible. Domain availability for `imperiumitaliantextile.com` should be confirmed before Phase 1 begins. |
| **Font rendering differences across browsers** | Medium | Low | Self-hosted WOFF2 with fallback metrics eliminates most issues. Safari renders Cormorant slightly differently than Chrome — this is acceptable and adds character. |
| **WhatsApp button on desktop opens web.whatsapp.com with no mobile linked** | Medium | Low | Use `https://wa.me/[number]` URL scheme, which works on both desktop (opens WhatsApp Web) and mobile (opens the app). |
| **Form spam** | Medium | Medium | Implement a honeypot field (hidden field that bots fill but humans don't). No CAPTCHA — CAPTCHAs destroy the editorial experience. If spam volume grows, add Turnstile (Cloudflare's invisible CAPTCHA) in a later release. |
| **Scope creep toward e-commerce features** | Medium | High | The PRD is clear: this is a relationship business. The website's job is to start conversations, not process transactions. Resist any feature that turns the site into a shop. |
| **Over-animation** | Low | Medium | The motion spec is deliberately minimal. If anyone suggests adding parallax, particle effects, or scroll-jacking, refer them to Section 5 of `DESIGN.md` and `MOTION_SPEC.md` Section 1 (Motion Principles). |
| **Phase overruns the ~15 task cap on localhost verification** | Medium | Low | The localhost verification gate exists precisely to catch this. If a phase produces broken or incomplete output, halt and re-run the affected tasks before approving the next phase. |

---

## What To Build First and Why — Executive Summary

**Build the design tokens and the hero. Everything else follows.**

The hero section contains every technical challenge the site will face: video loading, responsive typography, scroll-triggered animation, transparent-to-opaque navigation, and mobile adaptation. If the hero works, it proves the entire technical approach. The localhost verification gate in Phase 2 is where this is confirmed.

The design tokens (colours, type scale, spacing) are the DNA of the site. Every component inherits from them. Getting them right first means getting everything right from the start. The Phase 1 localhost verification is where this is confirmed.

The build order mirrors the visitor's journey: hero → origin → products → trust → contact → polish → launch. This is not coincidence. It ensures that at any point during development, the localhost preview tells a coherent (if incomplete) story. At the end of Phase 2, the site has a hero. At the end of Phase 3, it has a hero and products. At the end of Phase 4, it is feature-complete. At the end of Phase 5, it is tactile. At the end of Phase 6.A, it is polished. At the end of Phase 6.B, it is live. The site is always *presentable*, never *broken*.

The fine-tune loop — review on localhost, adjust, approve, next phase — is the rhythm of the build. No phase is "done" until the human has walked the verification checklist and signed off.

---

*Ship the simplest thing that tells the truth about the brand. Then make it better.*

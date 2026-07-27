# Website design system documentation

**Session ID:** ses_0615db123ffeQ0Owy76vn4GSyq
**Created:** 7/26/2026, 7:04:24 PM
**Updated:** 7/26/2026, 11:19:37 PM

---

## User

I want you to make a design language/system file that has crystal clear descriptions of the color palette, design choices, animation styles and overall theme of the website as precisely and technically accurate as possible. I want to create a design system file so all the people working on the project can have one reference file they can open to understand teh colors and designs that have been used and what they should use for any further features or elements they may add. I want all elements of the website categorised into diferrent types and for each type to have its own design rules. for example - If the nav bar items are to be categorised as sub-heading 2, what font, color and animation style it follows so all future subheading 2's can be the exact same style. the people working on this project in he future will be agents in opencode. I want all elements of the website to categorised and described as technically and accurately as feasible

---

## Assistant (Plan · Kimi K3 (2x usage) · 14.5s)

_Thinking:_

The user wants me to create a design system/design language file for their project. I'm in plan mode, so I need to:

1. Explore the codebase to understand the current design (colors, fonts, animations, components)
2. Understand the project structure
3. Create a comprehensive plan for the design system file

Let me start by exploring the project structure to understand what we're working with. I should delegate exploration to subagents to keep my context clean, per my instructions.

Let me first get a quick look at the project structure myself, then delegate deeper exploration.

I'll research the codebase thoroughly to understand the current design before planning the design system file. Let me start by getting an overview of the project structure.

**Tool: read**

**Input:**

```json
{
  "filePath": "/Users/akshaymsingh/Documents/Liberate/Imperium"
}
```

**Output:**

```
<path>/Users/akshaymsingh/Documents/Liberate/Imperium</path>
<type>directory</type>
<entries>
.agents/
.DS_Store
.editorconfig
.env.example
.git/
.github/
.gitignore
.husky/
.next/
.prettierignore
.prettierrc.json
AGENTS.md
commitlint.config.mjs
docs/
eslint.config.mjs
next-env.d.ts
next.config.ts
node_modules/
package-lock.json
package.json
playwright.config.ts
public/
README.md
scripts/
skills-lock.json
src/
test-results/
tests/
tsconfig.json
tsconfig.tsbuildinfo
vitest.config.ts

(31 entries)
</entries>
```

**Tool: glob**

**Input:**

```json
{
  "pattern": "*.{json,jsonc,md,ts,js,mjs}",
  "path": "/Users/akshaymsingh/Documents/Liberate/Imperium"
}
```

**Output:**

```
/Users/akshaymsingh/Documents/Liberate/Imperium/src/data/seo.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/data/index.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/data/testimonials.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/data/founder.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/data/collections.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/data/stats.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/data/pillars.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/data/navigation.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/data/contact.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/lib/env.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/lib/metadata.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/lib/index.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/lib/constants.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/lib/connection.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/lib/motion.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/lib/site.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/lib/utils.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/lib/email.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/lib/silkHero.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/hooks/index.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/hooks/useReducedMotion.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/hooks/usePointerPosition.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/hooks/useMediaQuery.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/hooks/useWebGL2.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/hooks/useIntersectionObserver.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/index.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/silk/index.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/silk/shaders/displacementField.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/silk/shaders/champagneSilk.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/motion/index.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/layout/index.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/sections/index.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/ui/index.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/app/api/contact/route.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/app/actions/contact.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/app/sitemap.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/app/robots.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/types/seo.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/types/index.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/types/forms.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/types/collections.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/src/types/navigation.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/next.config.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/eslint.config.mjs
/Users/akshaymsingh/Documents/Liberate/Imperium/vitest.config.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/AGENTS.md
/Users/akshaymsingh/Documents/Liberate/Imperium/playwright.config.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/tsconfig.json
/Users/akshaymsingh/Documents/Liberate/Imperium/scripts/derive-brand-assets.mjs
/Users/akshaymsingh/Documents/Liberate/Imperium/scripts/README.md
/Users/akshaymsingh/Documents/Liberate/Imperium/scripts/build-silk-still.mjs
/Users/akshaymsingh/Documents/Liberate/Imperium/scripts/capture-hero-still.mjs
/Users/akshaymsingh/Documents/Liberate/Imperium/commitlint.config.mjs
/Users/akshaymsingh/Documents/Liberate/Imperium/package.json
/Users/akshaymsingh/Documents/Liberate/Imperium/package-lock.json
/Users/akshaymsingh/Documents/Liberate/Imperium/.prettierrc.json
/Users/akshaymsingh/Documents/Liberate/Imperium/docs/TECHNICAL_ARCHITECTURE.md
/Users/akshaymsingh/Documents/Liberate/Imperium/skills-lock.json
/Users/akshaymsingh/Documents/Liberate/Imperium/README.md
/Users/akshaymsingh/Documents/Liberate/Imperium/next-env.d.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/tests/setup.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/tests/e2e/contact-form.spec.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/tests/e2e/homepage.spec.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/tests/unit/data/stats.test.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/tests/unit/data/pillars.test.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/tests/unit/data/collections.test.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/tests/unit/lib/site.test.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/tests/unit/lib/silkHero.test.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/tests/unit/lib/email.test.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/tests/unit/lib/utils.test.ts
/Users/akshaymsingh/Documents/Liberate/Imperium/tests/unit/app/robots.test.ts
```

---

## Assistant (Plan · Kimi K3 (2x usage) · 693.4s)

_Thinking:_

This is a Next.js project. I can see there's a structure with components, lib, data, etc. Let me delegate deep exploration of the design-related files to explore agents to gather all the design tokens:

1. Colors - likely in CSS files (globals.css, tailwind config)
2. Typography - fonts
3. Animations - motion.ts, components/motion
4. Components - ui, layout, sections

Let me look for CSS files and config first, then delegate detailed exploration.

This is a Next.js project. Let me delegate parallel exploration agents to extract every design detail — colors, typography, motion, and component patterns — while I check the core styling files myself.

**Tool: task**

**Input:**

```json
{
  "description": "Extract color & theme tokens",
  "prompt": "You are exploring the codebase at /Users/akshaymsingh/Documents/Liberate/Imperium (a Next.js website). Your job is RESEARCH ONLY — do not modify any files.\n\nGoal: Extract EVERY color, background, gradient, and theme token used in this project with exact values and where they're used.\n\nDo the following (thoroughness: very thorough):\n1. Find and read the global CSS file(s) (look under src/app/globals.css or similar). Read the ENTIRE file.\n2. Find any tailwind config (tailwind.config.ts/js) or CSS @theme blocks / CSS custom properties (--var definitions). Read them fully.\n3. Search the src/ directory for hardcoded hex colors (regex: #[0-9a-fA-F]{3,8}), oklch/hsl/rgb color values in .tsx/.ts/.css files. Note each unique value and the file+context it appears in.\n4. Read src/components/silk/shaders/champagneSilk.ts and displacementField.ts and extract any color uniforms/values used in the WebGL shader (the hero background).\n5. Read src/lib/silkHero.ts for hero-related color constants.\n6. Check public/ for any brand asset manifest or derived brand assets (scripts/derive-brand-assets.mjs may hint at brand colors — read that script).\n7. Check docs/TECHNICAL_ARCHITECTURE.md for any documented design decisions about color.\n\nReturn a single comprehensive report with:\n- Every CSS custom property (name + exact value + what it's used for, e.g. background, foreground, accent)\n- Every hex/oklch/hsl color found in code, with file paths and line numbers\n- Shader color values with context\n- The overall color scheme characterization (dark/light, warm/cool, luxury feel etc. based on actual values)\n- Any opacity/tint patterns (e.g. white at 60% opacity used for secondary text)\nBe exhaustively precise — exact values only, no paraphrasing of color values.",
  "subagent_type": "explore"
}
```

**Output:**

````
<task id="ses_0615d13bcffehBzsH0KSz05txb" state="completed">
<task_result>
Research complete. All files read, all color values extracted and cross-referenced. Here is the comprehensive report.

---

# Imperium — Complete Color & Theme Token Report

**Stack note:** No Tailwind config exists (confirmed — `tailwind.config.*` absent; `docs/TECHNICAL_ARCHITECTURE.md:14` states "Tailwind and CSS-in-JS are not used"). Theming is hand-authored CSS custom properties in `src/app/globals.css` + colocated CSS Modules. All values below are exact.

---

## 1. CSS Custom Properties — Color Tokens

All defined in `:root` in `/Users/akshaymsingh/Documents/Liberate/Imperium/src/app/globals.css` (lines 10–135). There are no `@theme` blocks and no dark-mode media-query overrides of these tokens.

### Primary palette (globals.css lines 14–18)

| Token | Exact value | Declared purpose (comment) | Actual usage in code |
|---|---|---|---|
| `--color-carbone` | `#1a1a1a` (L14) | "primary text, headlines" | `h1–h4` color (globals.css:297); Section "carbone" band bg (Section.module.css:21); Footer bg via `--_footer-bg` (Footer.module.css:3); nav wordmark/hamburger/mobile links (Navigation.module.css:49,107,173,208,272,337); ghost-light button hover text (Button.module.css:57); FabricCard title (FabricCard.module.css:63); form input text (FormField.module.css:42); PullQuote quote (PullQuote.module.css:15); StatBlock number (StatBlock.module.css:16); Testimonials quote (Testimonials.module.css:24); WhyImperium heading (WhyImperium.module.css:37); Contact instagram hover (Contact.module.css:107,113); WhatsApp fixed-bar text (WhatsAppButton.module.css:65); nav on-dark CTA hover text (Navigation.module.css:325) |
| `--color-pietra` | `#faf8f3` (L15) | "page background — raw Italian linen" | `body` bg (globals.css:230); Section "pietra" band (Section.module.css:13); Collections outer bg (Collections.module.css:10); scrolled nav bg + mobile overlay bg (Navigation.module.css:18,229) |
| `--color-gesso` | `#ffffff` (L16) | "cards, overlays, form fields" | Section "gesso" band (Section.module.css:17,22); Contact form card bg + loading sweep line (Contact.module.css:37,86); Footer text via `--_footer-text` (Footer.module.css:4); filled/whatsapp button text + ghost hover bg (Button.module.css:44,49,50,56,64,77); WhatsAppButton text + focus outline + fixed-bar bg (WhatsAppButton.module.css:13,32,63); nav on-dark text/borders/hover bg (Navigation.module.css:155,286,307,315,319,320,324,333) |
| `--color-sabbia` | `#b8a99a` (L17) | "eyebrow text, secondary labels, dividers" | Eyebrow text (Eyebrow.module.css:10); Footer muted text via `--_footer-muted` (Footer.module.css:5); nav lang toggle (Navigation.module.css:168); Founder image/cert placeholder bg + captions (Founder.module.css:18,31,68,81,99); FabricCard image placeholder bg + tagline (FabricCard.module.css:16,39); FormField label/border/placeholder (FormField.module.css:23,39,60); StatBlock label (StatBlock.module.css:24); Testimonials attribution (Testimonials.module.css:32); WhyImperium number (WhyImperium.module.css:29); Contact instagram/formNote (Contact.module.css:101,120); WhatsApp fixed-bar top border (WhatsAppButton.module.css:64). Also used in `color-mix` tints — see §3 |
| `--color-ardesia` | `#4a4540` (L18) | "body text — softer than pure black" | `body` text (globals.css:229); nav desktop links (Navigation.module.css:86,341); Founder bio (Founder.module.css:52); WhyImperium body (WhyImperium.module.css:44); FabricCard body (FabricCard.module.css:71); SectionHeader subline (SectionHeader.module.css:20); Contact location (Contact.module.css:29); privacy page body (privacy/page.module.css:14) |

### Accent palette (globals.css lines 21–23)

| Token | Exact value | Declared purpose | Actual usage |
|---|---|---|---|
| `--color-blu-notte` | `#1b2a4a` (L21) | "CTA borders, active state, brand moments" | Global `:focus-visible` outline (globals.css:304); Collections track focus outline (Collections.module.css:45); AnimatedFocusRing bar bg (AnimatedFocusRing.module.css:8); ghost/filled button border+bg+text (Button.module.css:36,37,43,62,63); TextLink color (TextLink.module.css:6); FormField floating label + focused underline (FormField.module.css:33,51); nav CTA border/text/hover bg (Navigation.module.css:134,139,154,345,346); privacy email link (privacy/page.module.css:18). Also darkened via `color-mix` — see §3 |
| `--color-oro-antico` | `#c4a76c` (L22) | "founder quote, hover accents" | PullQuote attribution (PullQuote.module.css:24); FabricCard tagline hover/focus + `.taglineAccent` (FabricCard.module.css:44,48,53); Collections progress-fill bar (Collections.module.css:128) |
| `--color-terracotta` | `#c47a5a` (L23) | "reserved: error states, map origin pin" | **DEAD TOKEN — defined but never referenced anywhere in `src/`** |

### Functional palette (globals.css lines 26–28)

| Token | Exact value | Usage |
|---|---|---|
| `--color-whatsapp` | `#25d366` (L26) | WhatsApp button border/bg (Button.module.css:75,76; WhatsAppButton.module.css:10,12,81 indicator dot); nav mobile WhatsApp CTA bg (Navigation.module.css:285). Hover states darkened via `color-mix` — see §3 |
| `--color-error` | `#b83a2e` (L27) | ValidationMorph error text (ValidationMorph.module.css:4); FormField error underline + error-pulse bar (FormField.module.css:95,104) |
| `--color-success` | `#2e7d4f` (L28) | **DEAD TOKEN — defined but never referenced anywhere in `src/`** |

### Transparent overlay (globals.css line 31)

| Token | Exact value | Usage |
|---|---|---|
| `--color-hero-gradient` | `rgba(0, 0, 0, 0.4)` (L31) | **DEAD TOKEN — defined but never referenced anywhere in the repo** (verified by repo-wide grep) |

### Component-scoped private tokens — Footer.module.css lines 3–6

- `--_footer-bg: var(--color-carbone)` → `#1a1a1a` — footer background
- `--_footer-text: var(--color-gesso)` → `#ffffff` — footer text/links
- `--_footer-muted: var(--color-sabbia)` → `#b8a99a` — tagline/legal/socials/divider
- `--_footer-link-opacity: 0.7` — footer link resting opacity (hover/focus → `1`)

---

## 2. Hardcoded Hex Colors (outside globals.css)

| Value | File:line | Context |
|---|---|---|
| `#fff` | `src/components/sections/Hero.module.css:51` | `.wordmark` (text-fallback logo) color |
| `#fff` | `src/components/sections/Hero.module.css:104` | `.textLink` ("Request a sample →") color |
| `#FAF8F3` | `src/app/layout.tsx:36` | `viewport.themeColor` — matches `--color-pietra` |
| `#B8A99A` | `src/components/ui/FormField.module.css:83` | URL-encoded as `%23B8A99A` — `stroke` of the inline data-URI SVG chevron in `select.input` — matches `--color-sabbia` |
| `#FAF8F3` | `public/site.webmanifest:7` | `"background_color"` |
| `#FAF8F3` | `public/site.webmanifest:8` | `"theme_color"` |
| `#000` | `scripts/build-silk-still.mjs:21–22` | `stop-color="#000"` in the SVG vignette gradient composited onto the hero still (stop-opacity `0` → `0.22`) |
| `#F7F8F7` | `scripts/derive-brand-assets.mjs:2,10` | Comment only — the near-white plate behind the client's brown wordmark in the source `Logo.png`; keyed out via alpha ramp (thresholds `WHITE = 246`, `BLACK = 140`, lines 12–13) |

No `hsl()`, `hsla()`, or `oklch()` values exist anywhere in `src/`.

---

## 3. rgba() / color-mix() / Opacity Patterns

### White-at-alpha (light-on-dark hero & nav text hierarchy)

| Exact value | File:line | Used for |
|---|---|---|
| `rgba(255, 255, 255, 0.7)` | Hero.module.css:28 | hero eyebrow "Made in Italy" |
| `rgba(255, 255, 255, 0.7)` | Hero.module.css:68 | `.wordmarkSecondary` "Italian Textile" |
| `rgba(255, 255, 255, 0.8)` | Hero.module.css:77 | hero tagline |
| `rgba(255, 255, 255, 0.55)` | Hero.module.css:136 | scroll-indicator line |
| `rgba(255, 255, 255, 0.8)` | Navigation.module.css:311 | on-dark desktop nav links |
| `rgba(255, 255, 255, 0.5)` | Navigation.module.css:329 | on-dark language toggle |

### Sabbia-at-alpha (hairlines/dividers)

| Exact value | File:line | Used for |
|---|---|---|
| `rgba(184, 169, 154, 0.3)` | Navigation.module.css:20 | scrolled nav bottom border (sabbia @ 30%) |
| `color-mix(in srgb, var(--color-sabbia) 20%, transparent)` | StatsStrip.module.css:18,28 | stat-cell dividers |
| `color-mix(in srgb, var(--color-sabbia) 20%, transparent)` | Contact.module.css:39 | form-card border |
| `color-mix(in srgb, var(--color-sabbia) 35%, transparent)` | Collections.module.css:121 | scroll progress track |
| `color-mix(in srgb, var(--color-sabbia) 40%, transparent)` | Founder.module.css:91 | cert placeholder dashed border |

### Black-at-alpha (shadows, reserved overlay)

| Exact value | File:line | Used for |
|---|---|---|
| `rgba(0, 0, 0, 0.4)` | globals.css:31 | `--color-hero-gradient` — **unused** |
| `rgba(0,0,0,0.04)` + `rgba(0,0,0,0.03)` | `src/components/motion/TiltCard.tsx:78` | resting card shadow: `"0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)"` |
| `rgba(0,0,0,0.08)` + `rgba(0,0,0,0.05)` | TiltCard.tsx:79 | hovered/pressed card shadow: `"0 24px 48px rgba(0,0,0,0.08), 0 12px 24px rgba(0,0,0,0.05)"` |

### Hover-darkening pattern — `color-mix(in srgb, <brand color> 90%, black)`

- `color-mix(in srgb, var(--color-blu-notte) 90%, black)` — Button.module.css:69,70 (filled-button hover bg + border)
- `color-mix(in srgb, var(--color-whatsapp) 90%, black)` — Button.module.css:82,83; WhatsAppButton.module.css:38,39; Navigation.module.css:302

### Other opacity patterns

- Footer links: `opacity: 0.7` resting → `1` on hover/focus (Footer.module.css:6,66,72,77)
- FormField placeholder: sabbia at `opacity: 0.7` (FormField.module.css:61)
- Disabled buttons/inputs: `opacity: 0.5` (Button.module.css:26; FormField.module.css:55)
- Hero scroll-line pulse keyframe: `opacity: 0.4 → 0 → 0.4` (Hero.module.css:151–164)
- Logo whitening filter: `filter: brightness(0) invert(1)` on the brown wordmark PNG to render it pure white over the dark hero (Hero.module.css:44)
- Underline gradients: `linear-gradient(currentColor, currentColor)` used as a 1px draw-on underline (TextLink.module.css:8; Hero.module.css:105)

---

## 4. WebGL Shader Color Values (Hero Background)

### `/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/silk/shaders/champagneSilk.ts` (lines 20–22)

```glsl
const vec3 CHAMPAGNE_BASE = vec3(0.38, 0.29, 0.17);   // deep bronze/brown — base fabric tint
const vec3 HIGHLIGHT      = vec3(0.82, 0.70, 0.48);   // pale champagne gold — Ward anisotropic specular
const vec3 SHEEN          = vec3(0.58, 0.48, 0.32);   // mid champagne — Fresnel edge sheen
````

Supporting exact values in the same fragment shader:

- Luma conversion weights (Rec.601): `vec3(0.299, 0.587, 0.114)` (line 64)
- Color grade: `color = CHAMPAGNE_BASE * (0.45 + luma * 1.4)` (line 65)
- Fold modulation: `mix(0.65, 1.20, fold + disp * 0.12)` (line 68)
- Light direction (direction, not color): `normalize(vec3(0.35, 0.55, 1.0))` (line 72)
- Specular scaling: `ward * 0.25` (line 96); added as `HIGHLIGHT * specAniso * (1.0 + disp * 0.5)` (line 105)
- Fresnel sheen: `pow(1.0 - NdV, 3.5) * 0.30 * (1.0 + disp * 0.8)` (line 99); added as `SHEEN * fresnel` (line 106)
- Ambient: `0.65 + 0.35 * NdL` (line 102)
- Vignette: `1.0 - 0.22 * pow(length(uv - 0.5) * 1.3, 2.0)` (line 109)

The base texture sampled is `/images/hero/champagne-silk.jpg` (ChampagneSilkCanvas.tsx:157), converted to grayscale via the luma dot product and re-tinted champagne.

### `/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/silk/shaders/displacementField.ts`

No color — writes scalar displacement into the red channel only: `gl_FragColor = vec4(prev + splat, 0.0, 0.0, 1.0)` (line 23) and `vec4(result, 0.0, 0.0, 1.0)` (line 45). Uniforms: `uRadius = 0.06`, `uDamping = 0.94` (ChampagneSilkCanvas.tsx:79,92).

### `/Users/akshaymsingh/Documents/Liberate/Imperium/src/lib/silkHero.ts`

Contains **no color constants** — only the `canRenderSilkHero()` capability gate (5 lines).

### Static fallback still pipeline — `scripts/build-silk-still.mjs`

- Tint applied to the grayscale silk texture: `{ r: 100, g: 78, b: 48 }` (line 13) — dark bronze, matching the shader's CHAMPAGNE_BASE family
- Composited radial vignette: `stop-color="#000"`, `stop-opacity` `0` → `0.22`, `r="72%"`, `cy="45%"` (lines 20–23), blended with `multiply`

---

## 5. Brand Asset Color Hints

- `scripts/derive-brand-assets.mjs` (lines 1–5 comments): the client source logo is "pure-white canvas + **#F7F8F7** plate behind a **brown** wordmark". The script keys out near-white (lightest channel ≥ `246` fully transparent; ≤ `140` fully opaque) and emits `public/images/logo/imperium-wordmark.png`.
- `docs/TECHNICAL_ARCHITECTURE.md` §4 (line 139) documents the only dynamic color behavior: nav applies `data-on-dark="true"` over the dark hero "to switch text colors to light tokens", and "The `scrolled` state (background: pietra) always overrides the dark-hero styles." §4 (line 135) describes the hero aesthetic as "pearlescent champagne iridescence" — note the doc mentions "FBM noise / thin-film approximation / caustic ripple" and a "1.75" DPR cap, but the implemented shader uses sinusoidal folds + Ward anisotropic specular + Fresnel sheen and the DPR cap in code is `1.5` (ChampagneSilkCanvas.tsx:10–16). Doc/code drift, no color impact.

---

## 6. Overall Color Scheme Characterization

- **Light, warm-neutral site** with a single dark immersive hero. Page background `#faf8f3` (warm off-white "raw linen"), cards pure white `#ffffff`.
- **Warm neutral text ramp:** near-black warm charcoal `#1a1a1a` (headlines) → soft warm gray-brown `#4a4540` (body) → warm tan-sand `#b8a99a` (secondary labels, eyebrows, dividers, image placeholders).
- **Two accent hues only:** deep midnight navy `#1b2a4a` (interactive/brand: buttons, links, focus rings, floating labels) and antique gold `#c4a76c` (editorial luxury moments: pull-quote attribution, card tagline hover, progress bar).
- **Hero is the dark counterpart:** procedural champagne/bronze silk (base RGB `0.38/0.29/0.17` ≈ `#614a2b` family, highlight ≈ `#d1b37a`, sheen ≈ `#947a52`) with all overlaid text in white at 100/80/70/55% alphas.
- **Luxury feel:** achieved through restraint — warm neutrals + navy + antique gold, hairline dividers at 20–40% tints, soft black shadows at 3–8%, and a strong gold-on-dark champagne hero. Reserved-but-unused tokens (`terracotta #c47a5a`, `success #2e7d4f`, `hero-gradient rgba(0,0,0,0.4)`) indicate planned error/map/overlay states not yet wired in.

### Dead tokens summary (defined, zero references)

1. `--color-terracotta: #c47a5a` (globals.css:23)
2. `--color-success: #2e7d4f` (globals.css:28)
3. `--color-hero-gradient: rgba(0, 0, 0, 0.4)` (globals.css:31)
</task_result>
</task>

````

**Tool: task**

**Input:**
```json
{
  "description": "Extract typography system",
  "prompt": "You are exploring the codebase at /Users/akshaymsingh/Documents/Liberate/Imperium (a Next.js website). Your job is RESEARCH ONLY — do not modify any files.\n\nGoal: Extract the COMPLETE typography system with exact values.\n\nDo the following (thoroughness: very thorough):\n1. Find where fonts are loaded (src/app/layout.tsx likely uses next/font — read it fully). Note exact font families, weights, subsets, CSS variable names.\n2. Read the global CSS file (src/app/globals.css or similar) fully — extract all font-family declarations, font-size scales, letter-spacing, line-height, text-transform rules, and any typography utility classes.\n3. Search src/ for text sizing classes used in components: grep for patterns like \"text-\", \"tracking-\", \"font-\", \"leading-\", \"uppercase\" in .tsx files. Catalog the recurring patterns per element type:\n   - Hero headings / page titles (h1)\n   - Section headings (h2)\n   - Sub-headings / eyebrow labels (small uppercase labels)\n   - Body text\n   - Nav items\n   - Buttons / CTAs\n   - Footer text\n   - Form labels/inputs\n   For each, note the EXACT classes used (font family var, size, weight, tracking, transform, color class) and file paths with line numbers.\n4. Read the nav/header component, footer component, button components (src/components/ui/), and section components to record their typography precisely.\n5. Check docs/TECHNICAL_ARCHITECTURE.md for documented typography decisions.\n\nReturn a single comprehensive report:\n- Font families: exact names, weights loaded, CSS variable names, fallback stacks\n- A typography catalog organized by element type with EXACT Tailwind classes/CSS values, plus file:line evidence for each\n- Note any responsive typography behavior (e.g. text-4xl md:text-6xl)\nBe exhaustively precise. Quote exact class strings.",
  "subagent_type": "explore"
}
````

**Output:**

````
<task id="ses_0615cd485ffe2vtgF48AkZmuhh" state="completed">
<task_result>
Research complete. Here is the comprehensive typography report.

---

# Imperium Italian Textile — Complete Typography System

## 0. Critical architecture facts (read first)

- **No `next/font`.** `src/app/layout.tsx` (67 lines, read fully) loads fonts via two manual `<link rel="preload">` tags only; all `@font-face` declarations live in `src/app/globals.css`.
- **No Tailwind.** A regex sweep for `text-*`, `tracking-*`, `font-*`, `leading-*` utility classes across all `src/**/*.tsx` returned **zero matches**. Styling is 100% CSS Modules consuming CSS custom-property tokens. "Exact classes" below are therefore CSS Module class names + their exact declarations.
- **`DESIGN.md` and `MOTION_SPEC.md` are cited in comments everywhere but do not exist in the repo.** The only docs are `docs/TECHNICAL_ARCHITECTURE.md`, `README.md`, `AGENTS.md`, `scripts/README.md`. Typography documentation in `TECHNICAL_ARCHITECTURE.md` is limited to §7 "Assets and fonts" (line 170–172).

---

## 1. Font loading

### Preloads — `src/app/layout.tsx:47-60`
Only the two regular faces are preloaded ("Preload only the two dominant text faces"; rest load on demand):
```html
<link rel="preload" href="/fonts/CormorantGaramond-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
<link rel="preload" href="/fonts/DMSans-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
````

### `@font-face` declarations — `src/app/globals.css:141-200`

All self-hosted WOFF2 under `public/fonts/`, all `font-display: swap`:

| Family             | Style  | Weight | File                                   | globals.css lines |
| ------------------ | ------ | ------ | -------------------------------------- | ----------------- |
| Cormorant Garamond | normal | 400    | `CormorantGaramond-Regular.woff2`      | 141–152           |
| Cormorant Garamond | normal | 500    | `CormorantGaramond-Medium.woff2`       | 154–160           |
| Cormorant Garamond | normal | 600    | `CormorantGaramond-SemiBold.woff2`     | 162–168           |
| Cormorant Garamond | italic | 400    | `CormorantGaramond-Italic.woff2`       | 170–176           |
| Cormorant Garamond | italic | 500    | `CormorantGaramond-MediumItalic.woff2` | 178–184           |
| DM Sans            | normal | 400    | `DMSans-Regular.woff2`                 | 186–192           |
| DM Sans            | normal | 500    | `DMSans-Medium.woff2`                  | 194–200           |

**CLS metric overrides** (only on Cormorant Regular, globals.css:148-151):

```css
ascent-override: 96.22%;
descent-override: 29.89%;
line-gap-override: 0%;
size-adjust: 96.03%;
```

**Subsetting** — `scripts/subset-fonts.sh:28-31`: Latin + Latin Extended (`U+0000-024F, U+1E00-1EFF, U+2000-206F, U+2070-209F, U+20A0-20CF, U+2100-214F`), layout features `kern,liga,calt`, `--no-hinting`, WOFF2 flavor. Verified files exist in `public/fonts/` (8 files, 17.9–37.7 KB each).

### CSS variable names & fallback stacks — `src/app/globals.css:35-40`

```css
--font-serif: "Cormorant Garamond", "Georgia", "Times New Roman", serif;
--font-sans: "DM Sans", "Helvetica Neue", "Arial", sans-serif;

--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
```

Note: `--font-weight-semibold` (600) and the Cormorant SemiBold face are loaded but **never referenced** by any component CSS (verified by repo-wide grep).

---

## 2. Typography design tokens — `src/app/globals.css:42-65`

### Modular scale (1:1.333 perfect fourth), desktop defaults

```css
--text-eyebrow: 11px;
--text-caption: 13px;
--text-body: 16px;
--text-body-large: 18px;
--text-subheadline: 21px;
--text-h4: 24px;
--text-h3: 32px;
--text-h2: 42px;
--text-h1: 56px;
--text-display: 72px;
```

### Line heights

```css
--leading-body: 1.7;
--leading-subheadline: 1.5;
--leading-h4: 1.35;
--leading-h3: 1.3;
--leading-h2: 1.2;
--leading-h1: 1.1;
--leading-display: 1.05;
```

### Letter spacing

```css
--tracking-eyebrow: 0.15em;
--tracking-caption: 0.02em;
--tracking-nav: 0.05em;
--tracking-label: 0.05em;
```

Unused-as-`var()` tokens (defined but never referenced in components): `--text-h1`, `--text-h4`, `--leading-h1`, `--leading-display`.

### Mobile override — `globals.css:351-358` (`@media (max-width: 767px)`)

```css
--text-display: 40px; /* 72 → 40 */
--text-h1: 36px; /* 56 → 36 */
--text-h2: 30px; /* 42 → 30 */
/* Body stays at 16px — never smaller (prevents iOS auto-zoom) */
```

---

## 3. Base element styles — `globals.css`

**`body` (221–231):** `font-family: var(--font-sans)`; `font-size: var(--text-body)` (16px); `line-height: var(--leading-body)` (1.7); `color: var(--color-ardesia)` (#4a4540); `background-color: var(--color-pietra)` (#faf8f3); plus `-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale`, `text-rendering: optimizeLegibility`.

**`h1, h2, h3, h4` (291–299):** `font-family: var(--font-serif)`; `font-weight: var(--font-weight-regular)` (400); `color: var(--color-carbone)` (#1a1a1a); `line-height: var(--leading-h2)` (1.2). No font-size here — sizes come from component modules.

**`input, button, textarea, select` (242–248):** `font: inherit; color: inherit;`

---

## 4. Typography catalog by element type

### 4.1 Hero / page title (h1)

The only live `<h1>` on the homepage is the hero wordmark — `src/components/sections/Hero.tsx:15` (`<h1 id="hero-heading" className={styles.logo}>`). When no logo image exists it renders a text wordmark (`Hero.tsx:26-29`):

- **`.wordmarkPrimary`** — `Hero.module.css:54-60`:
  `font-family: var(--font-serif)`; `font-weight: var(--font-weight-regular)` (400); `font-size: var(--text-display)` (**72px desktop / 40px mobile**); `line-height: 1`; `letter-spacing: 0.04em`.
- **`.wordmarkSecondary`** — `Hero.module.css:62-69`:
  `font-family: var(--font-sans)`; `font-size: var(--text-eyebrow)` (11px); `font-weight: var(--font-weight-medium)` (500); `letter-spacing: 0.35em`; `text-transform: uppercase`; `color: rgba(255,255,255,0.7)`.
- **Hero eyebrow "Made in Italy"** (`.eyebrow`, `Hero.module.css:22-31`, used at `Hero.tsx:13`):
  sans, `--text-eyebrow` (11px), weight 500, `letter-spacing: var(--tracking-eyebrow)` (0.15em), `text-transform: uppercase`, `color: rgba(255,255,255,0.7)`.
- **Hero tagline** (`.tagline`, `Hero.module.css:71-82`, `Hero.tsx:33`):
  sans, `--text-body-large` (18px), weight 400, `line-height: var(--leading-body)` (1.7), `letter-spacing: var(--tracking-caption)` (0.02em), `color: rgba(255,255,255,0.8)`, `max-inline-size: 540px`.

Stub pages render bare `<h1>` with no module class (inherit base styles only): `src/app/about/page.tsx:6`, `src/app/contact/page.tsx:6`.

### 4.2 Section headings (h2)

All rendered via `<SectionHeader>` — `src/components/ui/SectionHeader.tsx:28` applies `styles.headlineH2` when `as="h2"` (default). Headline itself inherits serif/400/carbone from base `h1–h4` rules; the module only sets size/leading:

- **`.headlineH2`** — `SectionHeader.module.css:8-11`: `font-size: var(--text-h2)` (**42px desktop / 30px mobile**); `line-height: var(--leading-h2)` (1.2).
- **`.headlineH3`** (when `as="h3"`) — `SectionHeader.module.css:13-16`: `font-size: var(--text-h3)` (32px); `line-height: var(--leading-h3)` (1.3).
- **`.subline`** — `SectionHeader.module.css:18-22`: `font-size: var(--text-body-large)` (18px); `color: var(--color-ardesia)`; `max-inline-size: 540px`. (Family/weight/leading inherit from body: DM Sans 400, 1.7.)

Usage sites (all default h2): `Collections.tsx:65-70` ("Fabric with a story."), `WhyImperium.tsx:54-58`, `Founder.tsx:32-36`, `Contact.tsx:122-127`, `src/app/privacy/page.tsx:16-20`.

### 4.3 Eyebrow / sub-heading labels (small uppercase)

Canonical component `<Eyebrow>` — `src/components/ui/Eyebrow.tsx:12`, comment at line 2 states the spec: _"11px DM Sans 500, tracking +0.15em, uppercase"_.

- **`.eyebrow`** — `Eyebrow.module.css:3-10` (exact full rule):
  `display: block; font-family: var(--font-sans); font-size: var(--text-eyebrow); font-weight: var(--font-weight-medium); letter-spacing: var(--tracking-eyebrow); text-transform: uppercase; color: var(--color-sabbia);`
  → DM Sans 500, 11px, +0.15em, uppercase, Sabbia #b8a99a.

Variants of the same pattern elsewhere:

- Hero eyebrow (§4.1) — same values, white-70 color — `Hero.module.css:22-31`.
- FabricCard tagline (`.tagline`) — `FabricCard.module.css:32-41`: eyebrow 11px/500/0.15em/uppercase/sabbia **plus** `line-height: var(--leading-subheadline)` (1.5); hover/focus-within flips color to `var(--color-oro-antico)` (#c4a76c) at lines 43-55. Used at `FabricCard.tsx:41`.
- WhyImperium number label (`.number`) — `WhyImperium.module.css:23-30`: identical eyebrow recipe. Used at `WhyImperium.tsx:71`.
- PullQuote attribution — `PullQuote.module.css:18-26`: sans, `--text-eyebrow` (11px), 500, 0.15em, uppercase, **`color: var(--color-oro-antico)`**.
- Founder cert placeholder label — `Founder.module.css:94-102`: sans, 11px, 0.15em, uppercase, sabbia.

### 4.4 Sub-headings within sections (h3 level)

- **WhyImperium item heading** (`.heading`) — `WhyImperium.module.css:32-38`, used at `WhyImperium.tsx:72` as `<h3>`:
  `font-family: var(--font-serif)`; `font-size: var(--text-subheadline)` (21px); `font-weight: var(--font-weight-medium)` (500); `line-height: var(--leading-subheadline)` (1.5); `color: var(--color-carbone)`.
- **FabricCard title** (`.title`) — `FabricCard.module.css:57-64`, used at `FabricCard.tsx:44` as `<h3>`:
  serif, **28px** (hardcoded, not a token), **`font-style: italic`**, weight 500, `line-height: var(--leading-h4)` (1.35), carbone.

### 4.5 Body text

- Default (inherited from `body`): DM Sans 400, 16px, 1.7, ardesia — e.g. WhyImperium `.body` (`WhyImperium.module.css:40-46`, adds `max-inline-size: 60ch`), Founder `.bioParagraph` (`Founder.module.css:47-53`, hardcodes `line-height: 1.7`), FabricCard `.body` (`FabricCard.module.css:66-72`), privacy `.body` (`src/app/privacy/page.module.css:7-15`), Contact `.location` (`Contact.module.css:27-30`).
- Large body (18px): hero tagline and SectionHeader subline (§4.1/4.2).

### 4.6 Quotes

- **PullQuote quote** (`.quote`) — `PullQuote.module.css:9-16`: serif, **36px** hardcoded, **italic**, 400, `line-height: 1.3`, carbone. Responsive: **28px** at `max-width: 767px` (lines 28-31). Used in `Founder.tsx:46`.
- **Testimonials quote** (`.quote`) — `Testimonials.module.css:18-26`, used at `Testimonials.tsx:26` as `<blockquote>`: serif, **24px** hardcoded, italic, 400, `line-height: var(--leading-h4)` (1.35), carbone.
- **Testimonials attribution** (`.attribution`) — `Testimonials.module.css:28-34`: sans, **14px** hardcoded, 400, sabbia.

### 4.7 Stats

**StatBlock** — `StatBlock.module.css` (used inside `StatsStrip` cells):

- `.number` (11-17): serif, `var(--text-h2)` (42/30px), 400, `var(--leading-h2)` (1.2), carbone.
- `.label` (19-25): sans, `var(--text-caption)` (13px), 400, `letter-spacing: var(--tracking-caption)` (0.02em), sabbia. Not uppercase.

### 4.8 Navigation

`src/components/layout/Navigation.module.css`:

- **Wordmark** (`.wordmarkName`, 44-51): serif, 500, **18px** hardcoded, `line-height: 1`, carbone. Mobile: **16px** (53-57). White on dark hero via `[data-on-dark="true"]` (306-308).
- **Desktop links** (`.desktopLink`, 81-90): sans, 400, `var(--text-caption)` (13px), ardesia, `letter-spacing: var(--tracking-nav)` (0.05em), `text-transform: uppercase`. Hover → carbone with 1px underline scaleX (92-113).
- **Desktop CTA pill** (`.cta`, 127-145): sans, 500, 13px, blu-notte (#1b2a4a), 1px blu-notte border, `border-radius: 100px`, `padding: 10px 20px`, min-height 40px. No uppercase/tracking here (unlike Button).
- **Language toggle** (`.lang`, 161-170): sans, 400, **12px** hardcoded, sabbia; active lang carbone.
- **Mobile overlay links** (`.mobileLink`, 267-274): serif, 500, `var(--text-h3)` (32px), `line-height: var(--leading-h3)` (1.3), carbone, centered.
- **Mobile WhatsApp CTA** (`.whatsappCta`, 276-294): sans, 500, **14px** hardcoded, gesso on #25d366.

### 4.9 Buttons / CTAs

**`Button`** — `src/components/ui/Button.module.css:5-23` (exact type stack):

```css
font-family: var(--font-sans);
font-size: var(--text-caption); /* 13px */
font-weight: var(--font-weight-medium); /* 500 */
letter-spacing: var(--tracking-label); /* 0.05em */
text-transform: uppercase;
```

Pill (`border-radius: 100px`), min-height 56px, `padding-inline: var(--space-lg)` (40px). Variants: `.ghost` (35-46, blu-notte border/text → fills on hover), `.ghost-light` (48-59, gesso border/text → fills white, text carbone), `.filled` (61-72, blu-notte bg/gesso text → darkens 10% via `color-mix`), `.whatsapp` (74-85). Used e.g. `Hero.tsx:37-39` (`variant="ghost-light"`).

**WhatsAppButton** — `WhatsAppButton.module.css:3-25`: identical type stack to Button (sans/13px/500/0.05em/uppercase). The fixed mobile bar variant (`.fixed`, 51-75) repeats the same stack with carbone-on-gesso colors.

**TextLink** — `TextLink.module.css:5-14`: inherits size/family from context; only sets `color: var(--color-blu-notte)`, `font-weight: var(--font-weight-medium)` (500), animated 1px underline. Context overrides: hero `.textLink` (`Hero.module.css:95-111`) = sans/13px/500/white; FabricCard `.cta` (`FabricCard.module.css:74-77`) = `font-size: 14px`.

### 4.10 Footer

`src/components/layout/Footer.module.css` (dark Carbone band; private tokens `--_footer-text: var(--color-gesso)`, `--_footer-muted: var(--color-sabbia)`, `--_footer-link-opacity: 0.7` at lines 2-6):

- **Wordmark** (`.wordmark`, 33-39): serif, 500, **18px**, `line-height: 1.2`, gesso. Used at `Footer.tsx:16`.
- **Tagline** (`.tagline`, 41-47): sans, 400, 13px, `letter-spacing: var(--tracking-caption)` (0.02em), sabbia.
- **Nav links** (`.link`, 59-69): sans, 400, 13px, **`text-transform: uppercase`**, `letter-spacing: var(--tracking-nav)` (0.05em), gesso at 0.7 opacity → 1.0 on hover/focus.
- **Legal** (`.legal`, 81-86): sans, 400, `--text-eyebrow` (11px), sabbia.
- **Social links** (`.socialLink`, 94-101): sans, 400, 11px, sabbia → gesso on hover/focus.

### 4.11 Form labels / inputs

`src/components/ui/FormField.module.css`:

- **Floating label** (`.label`, 16-30): sans, `--text-body` (**16px**, not eyebrow size), 500, sabbia, **`text-transform: uppercase`**, `letter-spacing: var(--tracking-eyebrow)` (0.15em), `line-height: var(--leading-body)` (1.7); floating state recolors to blu-notte (32-34).
- **Inputs/select/textarea** (`.input`, 36-48): sans, 16px, `line-height: 1.7`, carbone text, transparent bg, 1px sabbia bottom border only; placeholder sabbia at 0.7 opacity (59-62); 56px min-height for input/select, 120px textarea (65-87).
- **Error message** — `ValidationMorph.module.css:3-7`: `color: var(--color-error)` (#b83a2e), `font-size: var(--text-caption)` (13px).
- **Form note** — `Contact.module.css:118-122`: 13px, sabbia, 1.7.
- **Instagram link** — `Contact.module.css:99-104`: 14px hardcoded, sabbia → carbone+underline on hover.

---

## 5. Responsive typography behavior (complete list)

| Rule                                       | Where                         | Effect                                                                                                       |
| ------------------------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `@media (max-width: 767px)` token override | `globals.css:351-358`         | `--text-display` 72→40px, `--text-h1` 56→36px, `--text-h2` 42→30px; body locked at 16px (iOS zoom guard)     |
| Nav wordmark                               | `Navigation.module.css:53-57` | 18px → 16px on mobile                                                                                        |
| PullQuote quote                            | `PullQuote.module.css:28-31`  | 36px → 28px on mobile                                                                                        |
| Breakpoint tokens                          | `globals.css:102-104`         | `--bp-tablet: 768px`, `--bp-desktop: 1024px`, `--bp-desktop-xl: 1440px` (mirrored in `src/lib/constants.ts`) |

No fluid/`clamp()` font sizes anywhere; the only `clamp()` usages are spacing (`--section-padding-y` etc., globals.css:78-80).

---

## 6. Documented typography decisions in `docs/TECHNICAL_ARCHITECTURE.md`

- **§7 "Assets and fonts" (lines 170-172):** "Fonts are self-hosted WOFF2 files under `public/fonts/` and declared in `globals.css` with `font-display: swap`. The regular Cormorant face has metric overrides to reduce layout shift, and the root layout preloads the regular Cormorant Garamond and DM Sans files." — matches implementation exactly.
- Line 36: `public/fonts/` described as "Self-hosted Cormorant Garamond and DM Sans WOFF2 files"; line 51 lists `subset-fonts.sh`; line 84 states `globals.css` "owns tokens, font faces, reset rules"; line 90 credits `layout.tsx` with "font preloads".
- Comments throughout reference "DESIGN.md §2" as the typography source of truth and "Architecture §5/§6" for font loading — those files/sections are not present in the repo (the architecture doc's current §5/§6 cover data and contact flow, not fonts; the font content is §7). This appears to be stale comment drift.

---

## 7. Summary cheat-sheet (computed values, desktop)

| Element                        | Family           | Size | Weight | Leading | Tracking           | Transform | Color              |
| ------------------------------ | ---------------- | ---- | ------ | ------- | ------------------ | --------- | ------------------ |
| Hero wordmark                  | Cormorant        | 72px | 400    | 1.0     | 0.04em             | —         | #fff               |
| Hero eyebrow / all eyebrows    | DM Sans          | 11px | 500    | —       | 0.15em             | UPPER     | white-70 / #b8a99a |
| Hero tagline / section subline | DM Sans          | 18px | 400    | 1.7     | 0.02em (hero only) | —         | white-80 / #4a4540 |
| Section h2                     | Cormorant        | 42px | 400    | 1.2     | —                  | —         | #1a1a1a            |
| Section h3 (SectionHeader)     | Cormorant        | 32px | 400    | 1.3     | —                  | —         | #1a1a1a            |
| WhyImperium h3                 | Cormorant        | 21px | 500    | 1.5     | —                  | —         | #1a1a1a            |
| FabricCard h3                  | Cormorant italic | 28px | 500    | 1.35    | —                  | —         | #1a1a1a            |
| PullQuote                      | Cormorant italic | 36px | 400    | 1.3     | —                  | —         | #1a1a1a            |
| Testimonial quote              | Cormorant italic | 24px | 400    | 1.35    | —                  | —         | #1a1a1a            |
| Stat number                    | Cormorant        | 42px | 400    | 1.2     | —                  | —         | #1a1a1a            |
| Stat label                     | DM Sans          | 13px | 400    | —       | 0.02em             | —         | #b8a99a            |
| Body                           | DM Sans          | 16px | 400    | 1.7     | —                  | —         | #4a4540            |
| Nav links (desktop)            | DM Sans          | 13px | 400    | —       | 0.05em             | UPPER     | #4a4540            |
| Nav wordmark                   | Cormorant        | 18px | 500    | 1.0     | —                  | —         | #1a1a1a            |
| Mobile menu links              | Cormorant        | 32px | 500    | 1.3     | —                  | —         | #1a1a1a            |
| Buttons / CTAs                 | DM Sans          | 13px | 500    | —       | 0.05em             | UPPER     | variant            |
| Footer links                   | DM Sans          | 13px | 400    | —       | 0.05em             | UPPER     | #fff @ 0.7         |
| Footer legal/social            | DM Sans          | 11px | 400    | —       | —                  | —         | #b8a99a            |
| Form label                     | DM Sans          | 16px | 500    | 1.7     | 0.15em             | UPPER     | #b8a99a            |
| Form input                     | DM Sans          | 16px | 400    | 1.7     | —                  | —         | #1a1a1a            |

**Anomalies/notes:** hardcoded (non-token) sizes at 36px/28px (PullQuote), 28px (FabricCard title), 24px/14px (Testimonials), 18px/16px/12px/14px (Navigation), 18px (Footer wordmark), 14px (FabricCard CTA, Contact instagram). `--font-weight-semibold`, Cormorant SemiBold face, and tokens `--text-h1`, `--text-h4`, `--leading-h1`, `--leading-display` are loaded/defined but unused by any component.
</task_result>
</task>

````

**Tool: task**

**Input:**
```json
{
  "description": "Extract motion & animation system",
  "prompt": "You are exploring the codebase at /Users/akshaymsingh/Documents/Liberate/Imperium (a Next.js website). Your job is RESEARCH ONLY — do not modify any files.\n\nGoal: Extract the COMPLETE animation/motion system with exact values (durations, easings, variants, spring configs).\n\nDo the following (thoroughness: very thorough):\n1. Read src/lib/motion.ts fully — this likely holds shared motion variants. Report every exported variant/transition with exact values.\n2. Read everything in src/components/motion/ — every component, its props, default animation values.\n3. Read src/hooks/useReducedMotion.ts and usePointerPosition.ts and useIntersectionObserver.ts — note how animations respect reduced motion and how reveal-on-scroll works.\n4. Search src/ for framer-motion usage: grep for \"motion.\", \"variants\", \"transition\", \"duration\", \"ease\", \"stagger\", \"whileHover\", \"whileInView\", \"spring\" in .tsx/.ts files. Catalog recurring transition values (exact durations in seconds, easing arrays like [0.16, 1, 0.3, 1], stagger delays, y-offsets for reveals).\n5. Read global CSS for CSS keyframes, transition classes, or animation utilities (src/app/globals.css).\n6. Read the silk WebGL components (src/components/silk/) and note animation behavior of the hero (speeds, uniforms that animate, mouse interaction).\n7. Note hover effects on interactive elements: buttons, links, nav items, cards — exact hover classes (hover:..., transition-..., duration-...).\n8. Check docs/TECHNICAL_ARCHITECTURE.md and .agents/skills/emil-design-eng/SKILL.md and .agents/skills/review-animations/SKILL.md for documented animation philosophy/rules.\n\nReturn a single comprehensive report:\n- Every shared motion variant (name + exact config)\n- Standard durations/easings used across the site with file:line evidence\n- Reveal-on-scroll pattern (offsets, thresholds, staggering)\n- Hover/interaction animation patterns per element type\n- The WebGL hero animation behavior summary\n- Reduced-motion policy\n- Any documented animation philosophy (summarize the skill files' key rules)\nExact values only.",
  "subagent_type": "explore"
}
````

**Output:**

```
<task id="ses_0615c8287ffeFJKOlah0uAvmD1" state="completed">
<task_result>
Research complete. Here is the comprehensive report on the animation/motion system.

---

# Imperium — Complete Animation/Motion System Report

## 1. Shared Motion Primitives (`src/lib/motion.ts`)

The single source of truth. Every export with exact values:

### Spring presets (`springs`, src/lib/motion.ts:7-13)

| Name | Config | Used by |
|---|---|---|
| `soft` | `{ type: "spring", stiffness: 200, damping: 22 }` | AnimatedFocusRing morph (AnimatedFocusRing.tsx:22), FormField label float (FormField.tsx:110) |
| `standard` | `{ type: "spring", stiffness: 150, damping: 18 }` | All TiltCard springs (TiltCard.tsx:58-61, 73) |
| `firm` | `{ type: "spring", stiffness: 260, damping: 26 }` | MagneticButton x/y (MagneticButton.tsx:31-32) |
| `snap` | `{ type: "spring", stiffness: 400, damping: 30 }` | Contact success micro-bounce (Contact.tsx:114) |

### Easing constant (src/lib/motion.ts:16)
`easeOut = [0.16, 1, 0.3, 1]` (expo-out; matches `--motion-ease-out` in globals.css:115)

### Reveal variants

**`sectionReveal`** (src/lib/motion.ts:18-25):
- `hidden`: `{ opacity: 0, y: 24 }`
- `visible`: `{ opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16,1,0.3,1], staggerChildren: 0.08 } }`

**`childReveal`** (src/lib/motion.ts:27-34): `hidden: { opacity: 0, y: 16 }`, `visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } }` — **exported but never used anywhere in the codebase**.

Note: Comments reference `MOTION_SPEC.md` throughout the code, but that file does not exist in the repo (stale references).

## 2. Motion Components (`src/components/motion/`)

**ScrollReveal** (ScrollReveal.tsx) — one-shot `whileInView` wrapper around `sectionReveal`. Props: `amount = 0.15` (default), `delay = 0`, `as = "div" | "section" | "ul"`. `viewport={{ once: true, amount }}`. Reduced motion: renders a plain non-motion element (line 50-52).

**CountUp** (CountUp.tsx) — RAF-driven counter, no re-renders (direct `textContent` mutation). `duration = 1200`ms default; easing `1 - Math.exp(-t * 8)` (exponential approach, line 43); one-shot via `hasAnimated` ref; `Intl.NumberFormat("en-AE")`. Reduced motion: renders final value immediately (line 65).

**TiltCard** (TiltCard.tsx) — cursor 3D tilt. `ROTATE_X_RANGE = 4` (±4°), `ROTATE_Y_RANGE = 8` (±8°) (lines 45-46); touch press scale `1 → 0.98` (line 68); image scale `1 → 1.05` on hover (line 148); box-shadow interpolates `0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)` → `0 24px 48px rgba(0,0,0,0.08), 0 12px 24px rgba(0,0,0,0.05)` (lines 78-79). All springs `springs.standard`. CSS: `perspective: 1200px`, `touch-action: pan-y`, `preserve-3d` (TiltCard.module.css). Reduced motion: rotate/scale forced to 0/1, no shadow animation.

**MagneticButton** (MagneticButton.tsx) — `MAX_OFFSET = 8`px, `HIT_RADIUS = 100`px (lines 21-22); offset = `(delta / 100) * 8` clamped to ±8; springs `springs.firm`. CSS extends hit area `inset: -100px` via `::before` (MagneticButton.module.css:12-17). No-op on touch devices and reduced motion.

**AnimatedFocusRing** (AnimatedFocusRing.tsx) — shared `layoutId="form-focus-ring"` morph, `transition={springs.soft}`. 2px bar, `--color-blu-notte` (AnimatedFocusRing.module.css). Reduced motion: returns `null` (color-only focus feedback remains via CSS).

**ValidationMorph** (ValidationMorph.tsx) — `ERROR_EASE = [0.16, 1, 0.3, 1]`, `CHECK_EASE = [0.65, 0, 0.35, 1]` (lines 19-20). Error: enter `{opacity: 0, y: 8} → {opacity: 1, y: 0}` at `duration: 0.2`; exit `y: -8` at `duration: 0.15` (asymmetric); `AnimatePresence mode="wait"`. Success: SVG checkmark `pathLength 0 → 1`, `duration: 0.6`, ease `[0.65, 0, 0.35, 1]`. Reduced motion: duration 0 / pathLength 1 instantly. Also `navigator.vibrate(8)` on submit (Contact.tsx:64-68).

## 3. Hooks

**useReducedMotion** (useReducedMotion.ts) — `matchMedia("(prefers-reduced-motion: reduce)")` with SSR-safe initial state and live `change` listener.

**usePointerPosition** (usePointerPosition.ts) — window-level mouse/touch tracking, normalized coords (y inverted). Springs: `{ stiffness: 100, damping: 14, mass: 0.8 }` (lines 18-19). Velocity: exponential moving average `v*0.8 + speed*0.2` (line 34). `getIsIdle()` = time since last move `> 2.0`s (line 76). Feeds the silk hero.

**useIntersectionObserver** (useIntersectionObserver.ts) — generic IO wrapper; `once = true` default; declared for non-Framer needs (e.g., hero video lazy loading) but currently unused by any component (Framer's `whileInView`/`useInView` covers reveals).

## 4. Site-Wide Framer Motion Usage Catalog

| Location | Pattern | Exact values |
|---|---|---|
| Contact.tsx:112-115 | Submit button variants | `idle: { scale: 1 }`, `success: { scale: [1, 1.03, 1], transition: springs.snap }` |
| Contact.tsx:189-225 | Button text crossfade | `AnimatePresence mode="sync" initial={false}`, opacity 0→1, `duration: 0.3` per state (idle/pending/success) |
| Collections.tsx:48-52 | Pinned horizontal scroll | `useScroll({ offset: ["start start", "end end"] })`, `x = useTransform(scrollYProgress, [0, 1], [0, -travel])`; `travel` = real track overflow via ResizeObserver |
| Collections.tsx:90 | Progress bar | `scaleX: scrollYProgress`, origin left (Collections.module.css:127), fill `--color-oro-antico` |
| StatsStrip.tsx:16 | CountUp trigger | `useInView(ref, { once: true, amount: 0.3 })` |
| FormField.tsx:102-113 | Floating label | `y: isFloating ? -16 : 0`, `scale: isFloating ? 12/16 : 1` (0.75), `springs.soft` |

**ScrollReveal `amount` per section:** Hero (none — CSS keyframes), StatsStrip 0.3, Collections 0.4 (header only), WhyImperium 0.15, Founder 0.25, Testimonials 0.2, Contact 0.15.

## 5. CSS Motion Tokens (`src/app/globals.css:106-128`)

Durations: `--motion-duration-instant: 150ms`, `-fast: 250ms`, `-base: 400ms`, `-slow: 800ms`, `-cinematic: 1200ms`.
Easings: `--motion-ease-out: cubic-bezier(0.16, 1, 0.3, 1)`, `--motion-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)`, `--motion-ease-standard: cubic-bezier(0.25, 0.1, 0.25, 1)`.
Distances: `--motion-distance-xs/sm/md/lg/xl` = 4/8/16/24/48px.

### CSS keyframes

| Keyframe | Where | Values |
|---|---|---|
| `hero-enter` | Hero.module.css:140-149 | `opacity 0, translateY(24px)` → `opacity 1, translateY(0)` |
| `hero-pulse` | Hero.module.css:151-164 | `2s ease-in-out`, delay `2600ms`, `3` iterations; translateY 0→8px→0, opacity 0.4→0→0.4 (scroll indicator) |
| `errorPulse` | FormField.module.css:106-121 | `0.6s var(--motion-ease-out) forwards`; scaleX 0→1, opacity 0→1 (50%: opacity 1) |
| `sweep` | Contact.module.css:87-97 | `1.2s linear infinite`; translateX(-100%)→translateX(100%) (loading bar) |

**Hero entrance choreography** (Hero.module.css): eyebrow `800ms ease-out` delay `700ms`; logo `1000ms` delay `950ms`; tagline `800ms` delay `1250ms`; CTA group `800ms` delay `1500ms`; scroll line pulse starts at `2600ms`. All `both` fill mode.

## 6. Hover/Interaction Patterns per Element Type

All hover rules gated behind `@media (hover: hover) and (pointer: fine)`; focus-visible mirrors hover.

| Element | Transition | Hover effect | Press |
|---|---|---|---|
| Button (Button.module.css:18-33) | `background-color/color/border-color var(--motion-duration-fast) var(--motion-ease-standard)` + `transform 160ms var(--motion-ease-out)` | ghost: fills blu-notte; filled: 90% black color-mix | `:active scale(0.97)`, `transition-duration: 100ms` |
| Nav desktop link (Navigation.module.css:89-113) | `color fast ease-out`; `::after` underline `transform fast ease-out`, origin left | color → carbone; underline `scaleX(0) → scaleX(1)` | — |
| Nav CTA pill (Navigation.module.css:140-150) | colors `fast ease-out` + `transform 160ms ease-out` | fills blu-notte | `:active scale(0.97)`, 100ms |
| Header on scroll (Navigation.tsx:17, .module.css:12-15) | `background-color/border-color fast ease-out` | transparent → pietra at `scrollY > 100` | — |
| Hamburger (Navigation.module.css:203-219) | `transform fast ease-out` | lines morph: `translateY(±3.25px) rotate(±45deg)` | — |
| Mobile overlay (Navigation.module.css:238-256) | `opacity/transform var(--motion-duration-base) var(--motion-ease-out)` | `opacity 0→1`, `translateY(-8px)→0` | — |
| TextLink (TextLink.module.css:13) | `background-size fast var(--motion-ease-standard)` | underline `background-size: 0% 1px → 100% 1px` | — |
| FabricCard tagline (FabricCard.module.css:40-55) | `color fast ease-out` | sabbia → oro-antico | — |
| FabricCard CTA (FabricCard.module.css:81) | `background-size var(--motion-duration-base) ease-out` (400ms) | underline draws 0%→100% | — |
| Footer links (Footer.module.css:68,100) | `opacity fast ease-out` / `color fast ease-out` | opacity 0.7→1; sabbia→gesso | — |
| WhatsApp buttons (WhatsAppButton.module.css:20-29; Navigation.module.css:291-298) | colors `fast ease-standard` + `transform 100ms ease-out` | 90% black color-mix | `:active scale(0.97)` / `scale(0.98)` |
| Instagram link (Contact.module.css:103) | `color fast ease-out` | sabbia → carbone + underline | — |
| Form inputs (FormField.module.css:29,46) | `color/border-color fast ease-out` | border → blu-notte on focus | — |

## 7. WebGL Hero Behavior (`src/components/silk/`)

**Gating** (lib/silkHero.ts:3-5): live canvas only when WebGL2 available AND not reduced-motion AND connection is not slow (`effectiveType` "2g"/"slow-2g" or `saveData`, lib/connection.ts:11). Otherwise static `silk-still.jpg`. `SilkErrorBoundary` also falls back to the still on render error. Canvas is `next/dynamic({ ssr: false })`, `aria-hidden`, `pointer-events: none`.

**Rendering** (ChampagneSilkCanvas.tsx): orthographic R3F Canvas, `dpr = [1, maxDpr]` where maxDpr = 1.0 (<768px), 1.25 (<1024px), 1.5 (else) (lines 10-16); `antialias: false`, `powerPreference: "high-performance"`.

**Displacement field (mouse interaction)**: ping-pong FBOs at 128/256/512px (lines 18-24). Splat: Gaussian `exp(-dist²/r²)` with `uRadius = 0.06`, `uIntensity = idle ? 0 : min(velocity * 0.12, 0.35)` (line 119). Damping pass: 5-tap blur `(c*4 + l+r+t+b)/8` × `uDamping = 0.94` (displacementField.ts:42-43) — cursor ripples fade ~6%/frame and diffuse. Result feeds `uDisplacement` of the silk material.

**Silk shader** (shaders/champagneSilk.ts): time scaled `uTime * 0.15` (line 36); folds from 3 sine layers weighted `0.40/0.35/0.25` with time multipliers `0.04/0.03/0.02` (lines 25-28); normals from fold gradient (eps `0.003`, strength `5.0`) plus `disp * 0.2`; texture UV displaced by `N.xy * 0.06`; champagne grade: `CHAMPAGNE_BASE (0.38,0.29,0.17) * (0.45 + luma*1.4)`; Ward anisotropic specular `ax=0.15, ay=0.45`, contribution `0.25`, boosted `(1 + disp*0.5)`; Fresnel sheen `pow(1-NdV, 3.5) * 0.30 * (1 + disp*0.8)`; vignette `1 - 0.22*(len(uv-0.5)*1.3)²`. Per-frame uniforms: `uTime`, `uCursorPos` (spring-eased pointer at stiffness 100/damping 14/mass 0.8), `uTimeSinceLastMove`, `uResolution`.

Note: `docs/TECHNICAL_ARCHITECTURE.md` §4 is stale — it describes an "IridescentSilkHero" with FBM noise, thin-film iridescence, and DPR cap 1.75; the implemented component is `ChampagneSilkHero` with sine-based folds and DPR cap 1.5.

## 8. Reduced-Motion Policy

Layered, comprehensive:
1. **Global CSS** (globals.css:326-347): all `--motion-duration-*` tokens collapse to `0ms`; universal selector forces `animation-duration: 0ms !important`, `transition-duration: 0ms !important`, `animation-iteration-count: 1`; `scroll-behavior: auto`.
2. **ScrollReveal** renders plain static markup (final state instantly).
3. **CountUp** renders final value on mount.
4. **TiltCard** forces rotate 0 / scale 1, no shadow interpolation.
5. **MagneticButton** renders children unwrapped.
6. **AnimatedFocusRing** unmounted (color-only focus).
7. **ValidationMorph / FormField / Contact crossfades**: `transition: { duration: 0 }`.
8. **Silk hero**: canvas never attempted; static still.
9. **Collections**: pinned scroll mode disabled (`prefers-reduced-motion: no-preference` media query gates the sticky pin in CSS *and* JS `pinned` flag); native scroll-snap row remains.
10. **Hero CSS**: entrance animations and pulse set to `animation: none`, opacity forced 1 (Hero.module.css:172-186).

## 9. Documented Animation Philosophy (Skill Files)

`.agents/skills/emil-design-eng/SKILL.md` + `.agents/skills/review-animations/SKILL.md` + `STANDARDS.md` encode Emil Kowalski's (animations.dev) philosophy. Key rules:

- **Justified motion**: every animation needs a purpose (spatial consistency, state indication, feedback, explanation, preventing jarring change). Frequency-appropriate: 100+/day actions get no animation; rare/first-time can have delight. Never animate keyboard-initiated actions.
- **Easing**: entering/exiting → ease-out; on-screen movement → ease-in-out; hover/color → ease; constant → linear. **Never ease-in on UI.** Built-in CSS easings too weak — use strong custom curves (`cubic-bezier(0.23,1,0.32,1)`, `cubic-bezier(0.77,0,0.175,1)`, drawer `cubic-bezier(0.32,0.72,0,1)`).
- **Duration**: UI stays **under 300ms** (press 100-160ms, tooltips 125-200ms, dropdowns 150-250ms, modals 200-500ms; marketing can be longer).
- **Physicality**: never `scale(0)` — start `scale(0.9-0.97)` + opacity; popovers scale from trigger (modals exempt); button press `scale(0.97)` + `transform 160ms ease-out`.
- **Springs**: for drag/alive/interruptible/decorative mouse-tracking; Apple-style `{ duration: 0.5, bounce: 0.2 }` recommended; bounce subtle (0.1-0.3); mouse interactions must interpolate via `useSpring`, never raw position.
- **Interruptibility**: CSS transitions over keyframes for rapidly-triggered UI; `@starting-style` for entries.
- **Performance**: animate `transform`/`opacity` only; no parent-CSS-variable-driven child transforms; Framer `x`/`y`/`scale` shorthands are NOT hardware-accelerated under load — use full transform strings; CSS beats JS under load; WAAPI for programmatic motion.
- **Asymmetric timing**: deliberate phase slow, system response fast (e.g., press 2s linear / release 200ms ease-out).
- **Stagger**: 30-80ms between items; decorative, never blocks interaction.
- **Accessibility**: reduced motion = gentler, not zero (keep opacity/color, drop movement); gate hover motion behind `@media (hover: hover) and (pointer: fine)`.
- Review skill adds: block on `transition: all`, ungated `:hover`, everything-at-once entrances, layout-property animation, symmetric press/release timing.

### Codebase conformance highlights
The implementation matches the philosophy: custom expo-out curve, press feedback `scale(0.97)` at 100-160ms on every pressable element, hover gating everywhere, springs on all cursor-driven motion, transform/opacity-only animations, 80ms stagger, and thorough reduced-motion fallbacks. Notable intentional deviations: marketing-surface durations exceed 300ms (hero 800-1000ms, section reveals 0.8s) which the standards explicitly permit ("Marketing/explanatory: can be longer"); the stale `MOTION_SPEC.md` references and the stale architecture-doc hero description are documentation drift worth flagging.
</task_result>
</task>
```

**Tool: task**

**Input:**

```json
{
  "description": "Catalog components & layout patterns",
  "prompt": "You are exploring the codebase at /Users/akshaymsingh/Documents/Liberate/Imperium (a Next.js website). Your job is RESEARCH ONLY — do not modify any files.\n\nGoal: Catalog EVERY UI component and layout pattern — what elements exist, how they're styled, spacing/layout rules.\n\nDo the following (thoroughness: very thorough):\n1. List all files in src/components/ui/, src/components/layout/, src/components/sections/, src/components/motion/ (read src/components/index.ts and each subdirectory's index.ts first, then read each component file).\n2. For each component, report: purpose, exact className strings for its root and key children (layout classes like max-w-, px-, py-, gap-, rounded-, border-, bg-), variants/sizes if any.\n3. Read src/app/layout.tsx and src/app/page.tsx (and any other route pages) to understand page structure and section ordering.\n4. Read src/components/layout/ header/nav and footer fully — report exact styling of nav bar (height, padding, backdrop blur, borders, colors at scroll states), mobile menu, footer layout.\n5. Catalog spacing patterns: grep for recurring \"py-\", \"px-\", \"max-w-\", \"gap-\", \"space-y-\" values across sections — identify the standard section padding, container max-width, grid patterns.\n6. Catalog UI primitives: buttons (variants, sizes, exact classes), links, cards, dividers/lines, badges/eyebrow labels, form inputs, textarea, labels, error/success states. Report exact class strings with file:line.\n7. Catalog imagery/media treatment: border-radius, aspect ratios, hover treatments on collection cards/images.\n8. Note any borders/dividers style (color, width, opacity), shadows, blur effects.\n9. Check docs/TECHNICAL_ARCHITECTURE.md for documented component/layout decisions.\n\nReturn a single comprehensive report organized by component, with exact Tailwind class strings and file:line evidence. Also summarize the recurring layout grammar (container widths, section rhythm, grid usage). Be exhaustive — this report will be used to write a design system document.",
  "subagent_type": "explore"
}
```

**Output:**

```
<task id="ses_0615c2822ffehobxgQseXZ1O7h" state="completed">
<task_result>
I now have complete coverage. Here is the comprehensive report.

---

# Imperium Italian Textile — UI Component & Layout Catalog

## ⚠️ Critical finding first: this codebase does NOT use Tailwind

`docs/TECHNICAL_ARCHITECTURE.md:14` states explicitly: *"Styling: Hand-authored global CSS custom properties plus colocated CSS Modules. Tailwind and CSS-in-JS are not used."* Greps for `tailwind` and for utility-class patterns (`py-`, `px-`, `max-w-`, `gap-`, `space-y-`) across `src/` return zero matches.

The design system equivalent of "Tailwind classes" here is a **two-layer system**:

1. **Design tokens** — CSS custom properties in `src/app/globals.css:10-135` (colors, type scale, spacing scale, layout, motion, z-index).
2. **Colocated CSS Modules** — one `*.module.css` per component, composing tokens via `className={styles.x}`.

All "exact class strings" below are therefore **CSS-module class names + their exact declarations**, with file:line evidence. This is the authoritative equivalent of what you asked for.

---

## 0. Design tokens (the "theme config") — `src/app/globals.css`

### Colors (`globals.css:14-31`)
| Token | Value | Role |
|---|---|---|
| `--color-carbone` | `#1a1a1a` | primary text, headlines |
| `--color-pietra` | `#faf8f3` | page background ("raw Italian linen") |
| `--color-gesso` | `#ffffff` | cards, overlays, form fields |
| `--color-sabbia` | `#b8a99a` | eyebrow text, secondary labels, dividers |
| `--color-ardesia` | `#4a4540` | body text (softer than black) |
| `--color-blu-notte` | `#1b2a4a` | CTA borders, active state, brand |
| `--color-oro-antico` | `#c4a76c` | quote attribution, hover accents |
| `--color-terracotta` | `#c47a5a` | reserved (error alt, map pin) |
| `--color-whatsapp` | `#25d366` | WhatsApp CTAs |
| `--color-error` | `#b83a2e` | form errors |
| `--color-success` | `#2e7d4f` | success |
| `--color-hero-gradient` | `rgba(0,0,0,0.4)` | overlay (defined, unused in components) |

Usage frequency across CSS modules: `sabbia` ×24, `gesso` ×22, `carbone` ×20, `blu-notte` ×19, `whatsapp` ×11, `ardesia` ×9, `pietra` ×5, `oro-antico` ×5, `error` ×3.

### Typography (`globals.css:35-65`)
- Fonts: `--font-serif` = Cormorant Garamond (headings, quotes); `--font-sans` = DM Sans (body, UI). Weights 400/500/600.
- Modular scale 1:1.333 (perfect fourth): eyebrow **11px**, caption **13px**, body **16px**, body-large **18px**, subheadline **21px**, h4 **24px**, h3 **32px**, h2 **42px**, h1 **56px**, display **72px**.
- Mobile override (`globals.css:351-357`): display→40px, h1→36px, h2→30px; body never below 16px (iOS zoom guard).
- Line-heights: body 1.7, subheadline 1.5, h4 1.35, h3 1.3, h2 1.2, h1 1.1, display 1.05.
- Tracking: eyebrow `0.15em`, caption `0.02em`, nav `0.05em`, label `0.05em`.
- Self-hosted WOFF2 with `font-display: swap`; Cormorant Regular has metric overrides (`globals.css:141-152`); the two regular faces are preloaded in `layout.tsx:47-60`.

### Spacing scale (`globals.css:69-80`)
`--space-xxs:4 · --space-xs:8 · --space-sm:16 · --space-md:24 · --space-lg:40 · --space-xl:64 · --space-2xl:96 · --space-3xl:160`

Usage frequency: `sm` ×22, `lg` ×16, `xs` ×15, `md` ×11, `xl` ×10, `xxs` ×3. (`2xl`/`3xl` unused in modules — vertical rhythm is handled by section padding tokens instead.)

**Vertical rhythm tokens:**
- `--section-padding-y: clamp(80px, 10vw, 160px)` — standard section
- `--subsection-padding-y: clamp(48px, 6vw, 96px)` — dense section
- `--element-padding-y: clamp(24px, 3vw, 40px)` — (defined, unused)

### Layout tokens (`globals.css:84-104`)
- `--max-content-width: 1200px`
- `--nav-height: 72px` / `--nav-height-mobile: 56px` / `--whatsapp-bar-height: 56px`
- Grid: 12 cols; gutters xl 32 / desktop 24 / tablet 20 / mobile 16
- **Margins: xl 120 / desktop 80 / tablet 40 / mobile 24** (DESIGN.md §4 "grid margins 24/40/80/120")
- Breakpoints: 768 / 1024 / 1440

### Motion tokens (`globals.css:108-128`)
Durations: 150/250/400/800/1200ms. Easings: expo-out `cubic-bezier(0.16,1,0.3,1)`, in-out `cubic-bezier(0.65,0,0.35,1)`, standard `cubic-bezier(0.25,0.1,0.25,1)`. Distances 4/8/16/24/48px. Focus: 2px outline, 2px offset. Under `prefers-reduced-motion`, all durations collapse to 0ms (`globals.css:326-347`).

### Z-index (`globals.css:131-134`): base 1 · whatsapp-bar 90 · nav 100 · overlay 200.

### Global element/accessibility styles
- `h1-h4`: serif, 400, carbone, leading-h2 (`globals.css:291-299`).
- Global `:focus-visible`: `2px solid var(--color-blu-notte)`, offset 2px (`globals.css:303-306`).
- `.visually-hidden` utility (`globals.css:309-319`) — used by Testimonials h2 (`Testimonials.tsx:19`).
- Body: DM Sans 16px, ardesia on pietra (`globals.css:221-231`).
- All links/buttons `touch-action: manipulation` (`globals.css:250-272`).

---

## 1. App structure & page composition

### `src/app/layout.tsx` (root layout)
- `<html lang="en">`, no `<head>` wrapper needed; preloads two fonts (lines 47-60), renders `{children}`, then `<Footer />` (line 62), then `<WhatsAppButton fixedMobile />` (line 63). Viewport `themeColor: #FAF8F3` (= pietra).

### `src/app/page.tsx` (homepage — the only fully-built route)
Section ordering (lines 17-30), narrative: brand → proof → offering → trust → founder → convert:
```

<Navigation /> (rendered by page, NOT layout)
<main id="main">
  <Hero />              100dvh WebGL silk
  <StatsStrip />        gesso band, dense
  <Collections />       pinned horizontal showcase (own <section>, not Section)
  <WhyImperium />       gesso band
  <Founder />           pietra band (default)
  <Testimonials />      pietra; renders null while data empty
  <Contact />           pietra
</main>
<!-- Footer + fixed WhatsApp bar come from layout -->
```

### Other routes

- `/privacy` — implemented: `Section` (default pietra) → `.container { max-inline-size: 720px }` → SectionHeader ("Legal" eyebrow) → `.body { flex column, gap: --space-md, margin-block-start: --space-lg }` (`src/app/privacy/page.module.css:3-15`).
- `/about`, `/contact` — V2 stubs, bare `<h1>`. `not-found.tsx` — bare `<main><p>`.

---

## 2. Layout components (`src/components/layout/`)

### 2.1 `Section` — the universal section wrapper

`Section.tsx:23-40`, `Section.module.css:4-47`

**Props:** `id`, `ariaLabelledby`, `as: "section"|"aside"|"article"` (default section), `background: "pietra"|"gesso"|"carbone"` (default pietra), `dense?: boolean`.

- `.section`: `padding-block: var(--section-padding-y)` → **clamp(80px, 10vw, 160px)**
- `.dense`: `padding-block: var(--subsection-padding-y)` → **clamp(48px, 6vw, 96px)**
- `.pietra` = bg `#faf8f3`; `.gesso` = bg `#fff`; `.carbone` = bg `#1a1a1a` + `color: gesso`
- `.inner`: `max-inline-size: var(--max-content-width)` (1200px); `margin-inline: auto`; `padding-inline` steps: **24px mobile → 40px @768 → 80px @1024 → 120px @1440**

This is THE container pattern; Footer, Navigation `.row`, and Collections `.header` replicate the same max-width + margin step tokens manually.

### 2.2 `Navigation` — fixed header

`Navigation.tsx:10-122`, `Navigation.module.css:1-347`

**Structure:** fixed `<header>` (wordmark | desktop nav links | desktop actions: CTA + lang toggle) + separate fixed hamburger `<button>` + full-screen mobile overlay.

**Header bar (`.header`, lines 4-15):**

- `position: fixed; inset-block-start: 0; inset-inline: 0`
- height: `var(--nav-height-mobile)` = **56px**; ≥768px: `var(--nav-height)` = **72px** (lines 61-65)
- `z-index: var(--z-nav)` (100)
- Default: `background-color: transparent; border-block-end: 1px solid transparent`
- `.scrolled` (scrollY > 100, set at `Navigation.tsx:17`): `background-color: var(--color-pietra)`; border `rgba(184,169,154,0.3)` — **Sabbia at 30% opacity** (lines 17-21)
- Transitions on background-color + border-color, 250ms expo-out
- **No backdrop-blur anywhere in the codebase** (verified by grep)

**Row (`.row`, lines 23-34):** full-width flex, `max-inline-size: 1200px`, centered, `padding-inline: clamp(24px, 5vw, 120px)`, `justify-content: space-between; gap: var(--space-md)`.

**Wordmark (`.wordmarkName`, lines 44-57):** serif 500, 18px (16px mobile), line-height 1, carbone.

**Desktop nav (`.desktopNav`, lines 67-79):** hidden <768px; flex row, centered, `gap: var(--space-lg)` (40px). Links (`.desktopLink`, 81-113): DM Sans 400, 13px (`--text-caption`), uppercase, tracking `--tracking-nav` (0.05em), ardesia; hover → carbone + animated 1px underline via `::after` (`scaleX(0)→scaleX(1)`, origin left, 250ms).

**Nav CTA (`.cta`, lines 127-157):** mini ghost pill — `min-block-size: 40px; padding: 10px 20px; border: 1px solid blu-notte; border-radius: 100px`; DM Sans 500 13px; hover fills blu-notte + gesso text; `:active` scale(0.97).

**Language toggle (`.lang`, lines 161-175):** inline-flex, gap 6px, 12px, sabbia; active lang carbone; separator "·".

**Dark-hero state (`data-on-dark="true"`, lines 306-334):** while `scrollY < innerHeight` (`Navigation.tsx:18`) — wordmark → gesso; links → `rgba(255,255,255,0.8)` (hover gesso); CTA → gesso border/text (hover: gesso bg + carbone text); lang → `rgba(255,255,255,0.5)`. `.scrolled` rules (lines 336-347) always override back to light-theme colors.

**Hamburger (`.hamburger`, lines 179-219):** fixed top-right, 56×56px box (min 48×48 touch), z-index `overlay+1` = 201, two 22×1.5px carbone lines with 5px gap; open state morphs to X (`translateY(±3.25px) rotate(±45deg)`). Hidden ≥768px.

**Mobile overlay (`.overlay`, lines 223-256):** fixed inset 0, `100dvh`/`100svh`, bg pietra, z-index 200; flex column, `justify-content: space-between; gap: var(--space-xl)`; `padding-block: calc(nav-height-mobile + space-xl); padding-inline: var(--space-sm)`. Hidden state: `opacity: 0; transform: translateY(-8px); pointer-events: none`; open: full opacity/translateY(0). Transition 400ms expo-out. Body scroll locked (`Navigation.tsx:34-39`), Escape closes (lines 25-32), `inert` when closed (line 96).

**Mobile links (`.mobileLink`, lines 267-274):** serif 500, 32px (`--text-h3`), carbone, centered, stacked with `gap: var(--space-md)` (24px).

**Overlay WhatsApp CTA (`.whatsappCta`, lines 276-304):** pill, 56px min-height, `padding-inline: var(--space-lg)`, radius 100px, whatsapp-green bg + gesso text, 14px, hover darkens 10% via `color-mix`.

### 2.3 `Footer` — dark closing band

`Footer.tsx:11-59`, `Footer.module.css:1-165`

- `.footer` (lines 1-12): bg carbone, text gesso; `padding-block-start: 80px; padding-block-end: 40px` — **mobile: bottom padding = `var(--whatsapp-bar-height)` (56px)** so the fixed bar never covers content (lines 161-164).
- Private tokens: `--_footer-bg/text/muted/link-opacity: 0.7` (lines 3-6).
- `.inner` (14-21): same 1200px container + stepped margins as Section; flex column, `gap: var(--space-lg)` (≥768px: `--space-xl`).
- **Three rows** (23-31), all flex column centered, `gap: var(--space-sm)`:
  1. `.topRow`: wordmark (serif 500, 18px) + tagline (sans caption 13px, tracking-caption, sabbia)
  2. `.middleRow`: link list — nav links + Privacy Policy; column centered mobile → row wrap, `gap: --space-md` @768 → `gap: --space-lg` @1024 (135-150). `.link` (59-69): 13px uppercase, tracking-nav, gesso at 0.7 opacity → 1.0 on hover/focus.
  3. `.bottomRow`: legal (`© Imperium Italian Textile. All rights reserved.` — no year by client decision, `Footer.tsx:3`) in 11px sabbia + socials (Instagram handle · WhatsApp), 11px sabbia → gesso on hover, "·" divider.
- ≥768px: top/bottom rows become `flex-direction: row; justify-content: space-between; align-items: baseline` (123-129).

---

## 3. UI primitives (`src/components/ui/`)

### 3.1 `Button` — the pill button

`Button.tsx:21-51`, `Button.module.css:5-85`

**Variants:** `"ghost" | "ghost-light" | "filled" | "whatsapp"` (default ghost). Renders `<a>` when `href` given, else `<button>`. No size variants — one size.

**Base `.button` (lines 5-23):**

```
display: inline-flex; align-items: center; justify-content: center;
gap: var(--space-xs);                       /* 8px */
min-block-size: 56px;                       /* touch target, DESIGN.md §8.6 */
padding-inline: var(--space-lg);            /* 40px */
border-radius: 100px;                       /* pill */
font-family: var(--font-sans);
font-size: var(--text-caption);             /* 13px */
font-weight: var(--font-weight-medium);     /* 500 */
letter-spacing: var(--tracking-label);      /* 0.05em */
text-transform: uppercase;
```

Transitions: bg/color/border 250ms standard + `transform 160ms ease-out`. `:disabled` opacity 0.5. `:active` `scale(0.97)` (100ms).

**Variants:**

- `.ghost` (35-46): `border: 1px solid blu-notte; color: blu-notte; bg transparent` → hover fills blu-notte + gesso text.
- `.ghost-light` (48-59): same but gesso border/text → hover gesso bg + carbone text (used in Hero over dark silk).
- `.filled` (61-72): blu-notte bg + border, gesso text → hover `color-mix(in srgb, blu-notte 90%, black)`.
- `.whatsapp` (74-85): whatsapp-green bg/border, gesso text → hover darkens 10%.

Hover rules are all gated behind `@media (hover: hover) and (pointer: fine)`.

### 3.2 `TextLink` — animated underline link

`TextLink.tsx:12-18`, `TextLink.module.css:5-24`

```
.link {
  color: var(--color-blu-notte);
  font-weight: var(--font-weight-medium);
  background-image: linear-gradient(currentColor, currentColor);
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 0% 1px;
  padding-block-end: 2px;
  transition: background-size 250ms var(--motion-ease-standard);
}
```

Underline draws left-to-right 0%→100% on hover and `:focus-visible` (DESIGN.md §5, 300ms spec). Uses `currentColor` so it adapts to dark contexts. A local variant `.textLink` in Hero (`Hero.module.css:95-121`) is the same pattern in white with a 48px min-height touch target.

### 3.3 `Eyebrow` — the uppercase tracked label

`Eyebrow.tsx:11-13`, `Eyebrow.module.css:3-11`

```
.eyebrow {
  display: block;
  font-family: var(--font-sans);
  font-size: var(--text-eyebrow);      /* 11px */
  font-weight: 500;
  letter-spacing: var(--tracking-eyebrow); /* 0.15em */
  text-transform: uppercase;
  color: var(--color-sabbia);
}
```

This exact recipe (11px/500/0.15em/uppercase/sabbia) recurs inline in FabricCard `.tagline`, WhyImperium `.number`, Founder `.caption`/`.certCaption`/`.certPlaceholderLabel`, PullQuote `.attribution`, and the Hero `.eyebrow` (white 0.7 alpha variant).

### 3.4 `SectionHeader` — eyebrow + headline + subline stack

`SectionHeader.tsx:18-34`, `SectionHeader.module.css:3-22`

- `.header`: `display: grid; gap: var(--space-sm)` (16px between eyebrow/headline/subline).
- `.headlineH2`: 42px / leading 1.2; `.headlineH3`: 32px / 1.3 (prop `as`, default h2).
- `.subline`: 18px (`--text-body-large`), ardesia, `max-inline-size: 540px`.
- Optional `id` on the heading for `aria-labelledby`.

### 3.5 `FabricCard` — the collection card

`FabricCard.tsx:21-55`, `FabricCard.module.css:1-126`

Wrapped in `<TiltCard>`; inner `<article>` is `display: contents` (the TiltCard `.surface` div is the real flex parent).

- `.imageWrap` (12-17): `position: relative; aspect-ratio: 4 / 5; overflow: hidden; background-color: var(--color-sabbia)` — sabbia shows as image placeholder. **No border-radius** (images are sharp rectangles throughout the site).
- `.image`: 100% × 100%, `object-fit: cover`. Next/Image 400×500, `sizes="(min-width: 1024px) 460px, 76vw"`.
- `.content` (25-30): flex column, `gap: var(--space-xs)`; `padding-block-start: var(--space-sm)`.
- `.tagline` (32-41): the eyebrow recipe (11px/500/0.15em/uppercase/sabbia); transitions color. `.taglineAccent` = oro-antico (used by Pezzi Unici, data-driven). **Hover treatment:** on `.card:hover` / `:focus-within`, tagline turns oro-antico (47-55).
- `.title` (57-64): serif, **28px italic**, 500, carbone.
- `.body` (66-72): 16px DM Sans, 1.7, ardesia.
- `.cta` (74-92): `margin-block-start: var(--space-xs)`, 14px; the TextLink underline also draws on **card** hover/focus-within (not just link hover).
- **`.spread` layout** (104-126, ≥1024px only, used by Collections pinned showcase): row direction, `align-items: center; gap: var(--space-lg)`; image sized by `--panel-image-h` (set by Collections to `clamp(340px, 52vh, 560px)`), width = height × 4/5; text column `min(320px, 36ch)`.

### 3.6 `StatBlock` — number + label

`StatBlock.tsx:15-24`, `StatBlock.module.css:3-25`

- `.block`: flex column, centered, `gap: var(--space-xs)`.
- `.number`: serif, 42px (`--text-h2`), 400, carbone; content animated by `<CountUp>` (RAF, exponential ease `1 - exp(-t*8)`, 1200ms default, formats `en-AE`).
- `.label`: sans, 13px caption, 400, tracking-caption (0.02em), sabbia.

### 3.7 `PullQuote` — centered editorial quote

`PullQuote.tsx:12-19`, `PullQuote.module.css:3-32`

- `.pullQuote`: `text-align: center; padding-block: 80px` (hard-coded, not a token).
- `.quote`: serif, **36px italic** (28px on mobile), 400, line-height 1.3, carbone. No quotation marks (by design comment).
- `.attribution`: eyebrow recipe but **oro-antico**; `margin-block-start: 24px`.

### 3.8 `FormField` — underline inputs with floating labels

`FormField.tsx:24-121`, `FormField.module.css:1-121`

Types: `text | email | tel | textarea | select`.

- `.field`: flex column, `gap: var(--space-xs)`.
- `.controlWrapper`: relative, `padding-block-start: var(--space-sm)` (makes room for floated label).
- `.label` (16-30): absolutely positioned at top/left; DM Sans 500 16px, sabbia, **uppercase + tracking-eyebrow**; `transform-origin: left center`; floats via Framer `animate={{ y: -16, scale: 12/16 }}` with `springs.soft` (`FormField.tsx:106-110`); floating state → blu-notte.
- `.input` (36-48): `width: 100%; border: none; border-bottom: 1px solid var(--color-sabbia); border-radius: 0; background: transparent; color: carbone;` 16px DM Sans; `:focus-visible` border-bottom → blu-notte; placeholder sabbia @0.7; `:disabled` opacity 0.5.
- Heights: `input.input` and `select.input` min-height **56px**, `textarea.input` min-height **120px**, `resize: vertical` (65-75). All `padding-block: var(--space-sm)`.
- `select.input` (78-87): `appearance: none` + inline SVG chevron (stroke `#B8A99A` = sabbia), `padding-inline-end: 24px`.
- **Error state:** `.inputError` border-bottom → `--color-error` `#b83a2e` (93-96); `.errorPulse` (99-121): a 2px absolute error-colored line at the bottom that runs a one-time `scaleX(0→1)` 0.6s pulse when an error appears.
- Focus state: `<AnimatedFocusRing>` — 2px blu-notte line at the bottom, Framer `layoutId="form-focus-ring"` morphs between fields with `springs.soft` (`AnimatedFocusRing.module.css:3-11`).
- Error message: `<ValidationMorph state="error">` — 13px error-color text, 8px slide-down enter, `role="alert"` (`ValidationMorph.module.css:3-7`).
- Honeypot field in Contact (`.honeypot`, `Contact.module.css:47-58`): classic 1px clipped offscreen pattern.

### 3.9 `WhatsAppButton` — inline pill + fixed mobile bar

`WhatsAppButton.tsx:14-51`, `WhatsAppButton.module.css:1-82`

- **Inline** (`.button`, 3-41): same geometry as Button — 56px min-height, `padding-inline: --space-lg`, radius 100px, 13px/500/0.05em uppercase; solid whatsapp-green, gesso text; hover darkens 10%; `:active` scale(0.97); custom white `:focus-visible` outline. Wrapped in `<MagneticButton>`.
- **Fixed mobile** (`.fixed`, 47-75): `display: none` by default; **@max-width 767px**: fixed bottom bar, full width, `min-block-size: var(--whatsapp-bar-height)` (56px), **gesso bg + sabbia 1px top border + carbone text** (note: inverted from inline — light bar, dark text), z-index 90, `padding-inline: --space-md`.
- `.indicator` (77-82): 8×8px green dot (`border-radius: 50%` — one of only two radius values in the codebase) shown before the label in fixed mode.
- Rendered site-wide from `layout.tsx:63` with `fixedMobile`; returns null if no number configured.

---

## 4. Section components (`src/components/sections/`)

### 4.1 `Hero` — 100dvh WebGL silk

`Hero.tsx:8-52`, `Hero.module.css:1-186`; silk wrapper `silk/ChampagneSilkHero.tsx`

- `.section`: `position: relative; block-size: 100dvh; min-block-size: 100svh; overflow: hidden; isolation: isolate`. Background is `<ChampagneSilkHero />` — absolutely-positioned (`inset: 0; z-index: 0; pointer-events: none`) WebGL canvas, or static `silk-still.jpg` fallback (`object-fit: cover`) when WebGL2/reduced-motion fails or on shader error (`SilkErrorBoundary.tsx`).
- `.content` (9-20): full-height flex column centered, `gap: var(--space-md)` (24px; `--space-sm` on mobile), `padding-inline: var(--space-sm)`, `text-align: center`, z-index base.
- `.eyebrow` (22-31): eyebrow recipe in `rgba(255,255,255,0.7)`; entrance animation `hero-enter` 800ms expo-out, delay **700ms**.
- `.logo` (33-45): h1 contains the wordmark PNG (`width: min(480px, 80vw)`, `filter: brightness(0) invert(1)` to make it white) or typographic fallback; delay **950ms**, duration 1000ms.
- `.wordmarkPrimary` fallback: serif 400, 72px display, `letter-spacing: 0.04em`; `.wordmarkSecondary`: 11px, tracking **0.35em**, white 0.7.
- `.tagline` (71-82): 18px sans, white 0.8, `max-inline-size: 540px`; delay **1250ms**.
- `.ctaGroup` (84-93): flex column, `gap: var(--space-sm)`, `margin-block-start: var(--space-xs)`; delay **1500ms**. Contents: `<MagneticButton><Button variant="ghost-light">Explore our fabrics</Button>` + white `.textLink` "Request a sample →".
- `.scrollIndicator` (123-138): absolute, 32px from bottom, centered; 1×40px white-0.55 line, `hero-pulse` 2s ×3 starting at 2600ms.
- `hero-enter` keyframes: opacity 0 + translateY(24px) → visible. Reduced-motion: everything visible, no animation (172-185).

### 4.2 `StatsStrip` — hairline-divided stat band

`StatsStrip.tsx:14-36`, `StatsStrip.module.css:1-30`

- `<Section background="gesso" dense>` — white band, clamp(48px,6vw,96px) padding.
- `.grid`: 1 column mobile → **3 columns @768** (`repeat(3, 1fr)`). Data currently has exactly 3 stats (40+ Fabrics / 4 Curated collections / 100% Italian fabrics — `data/stats.ts:14-18`). Note: `TECHNICAL_ARCHITECTURE.md:104` says "StatBlock × 4" — **doc is stale**, code and data have 3.
- `.cell`: centered flex, `padding-block: var(--space-md); padding-inline: var(--space-sm)`.
- **Divider pattern:** `.cell + .cell` gets `1px solid color-mix(in srgb, var(--color-sabbia) 20%, transparent)` — top border on mobile, inline-start (left) border @768+. This "sabbia at 20% opacity hairline" is the site's canonical divider (also used on the Contact form card border).
- Wrapped in `<ScrollReveal amount={0.3}>`; CountUp triggers via `useInView(amount: 0.3)`.

### 4.3 `Collections` — scroll-driven horizontal showcase

`Collections.tsx:21-95`, `Collections.module.css:1-140`

Does NOT use `Section` — custom pinned layout. `.outer`: bg pietra, relative.

- `.viewport` (13-19): flex column, `justify-content: center; gap: var(--space-lg); padding-block: var(--subsection-padding-y)`.
- `.header` (21-26): standard 1200px container with stepped margins (same tokens as Section `.inner`).
- SectionHeader content: eyebrow "Our collections", headline "Fabric with a story.", subline 540px max (`Collections.tsx:65-70`).
- `.track` (28-47): horizontal flex, `gap: var(--space-md)` (24px) mobile → `--space-lg` @768 → **`--space-xl` (64px) @1024**; mobile = native scroll-snap row (`scroll-snap-type: x mandatory`, scrollbar hidden, `-webkit-overflow-scrolling: touch`); `padding-block: var(--space-xs)` reserves room for TiltCard hover shadow/focus ring; `:focus-visible` gets blu-notte outline (keyboard accessible).
- `.panel` (49-53): `flex: 0 0 auto; inline-size: min(76vw, 340px)` mobile → `min(44vw, 400px)` @768 → auto @1024; `scroll-snap-align: center` → `start` @1024.
- **Desktop pinned mode** (96-130, `@media (min-width:1024px) and (prefers-reduced-motion: no-preference)`): outer gets `blockSize: calc(100dvh + travel px)` inline (travel measured via ResizeObserver = track overflow, `Collections.tsx:32-46`); `.viewport` becomes `position: sticky; inset-block-start: 0; block-size: 100dvh; overflow: hidden; padding-block-start: var(--nav-height)`; track `overflow: visible`, transform-only x-translate via `useScroll`/`useTransform`.
- Track inset ≥1024 (79-86, 137-139): `--track-inset: max(grid-margin-desktop, (100vw - 1200px)/2)` — first/last panel align with the 1200px content edge. Sets `--panel-image-h: clamp(340px, 52vh, 560px)` driving FabricCard spread images.
- **Progress indicator** (113-129): hidden except pinned mode; absolute bottom `clamp(24px, 4vh, 48px)`, centered, `width: min(320px, 30vw); height: 2px`; track = sabbia 35%, fill = **oro-antico**, `scaleX` driven by scroll progress, origin left.

### 4.4 `WhyImperium` — numbered editorial rows

`WhyImperium.tsx:50-90`, `WhyImperium.module.css:1-95`

- `<Section background="gesso">` + SectionHeader (eyebrow "Why Imperium", headline "Not just fabric. A guarantee of origin."), wrapped in `<ScrollReveal amount={0.15}>`.
- `.rows`: `margin-block-start: var(--space-xl)`; grid, `gap: var(--space-xl)` (64px between rows).
- `.row`: grid, `gap: var(--space-lg)`, `align-items: center`; ≥1024: **12-column grid** (`repeat(12, 1fr)`, `gap: var(--grid-gutter-desktop)` = 24px) with **text span 5 / media span 7**; `.reversed` rows flip media to the left (`order: -1`); `.textOnly .text` spans columns 1-6 (the media-less closing row continues the left-rail rhythm).
- `.text`: grid, `gap: var(--space-sm)`.
- `.number` ("01"/"02"/"03"): eyebrow recipe, sabbia (23-30).
- `.heading`: serif 500, 21px (`--text-subheadline`), 1.5, carbone.
- `.body`: 16px/1.7 ardesia, `max-inline-size: 60ch`.
- Media slots: `.mapImage` full-width auto; `.stampSlot` centered grid, `.stampImage` `inline-size: min(240px, 55vw)` (white-background PNG — Gesso band only, per comment 84-85).

### 4.5 `Founder` — asymmetric 5/7 portrait + bio

`Founder.tsx:12-77`, `Founder.module.css:1-115`

- `<Section>` default pietra, `<ScrollReveal amount={0.25}>`.
- `.grid`: 1 col, `gap: var(--space-xl)`; ≥1024: **`grid-template-columns: 5fr 7fr`**, gap = desktop gutter 24px → 32px @1440.
- `.imageWrap` (14-19): **`aspect-ratio: 3 / 4`** portrait, `overflow: hidden`, sabbia placeholder bg; `.image` cover.
- `.caption` (27-33): 11px sabbia, `margin-block-start: var(--space-sm)`.
- `.right`: flex column, `gap: var(--space-lg)`; contains SectionHeader (h2) + `.bio` (flex column `gap: var(--space-md)`; paragraphs 16px/1.7 ardesia) + `<PullQuote>` + certification.
- `.certification`: centered. `.certImageWrap` (59-69): `max-inline-size: min(340px, 100%)`, **`aspect-ratio: 2502 / 1770`** (matches scan exactly so nothing crops), `margin-inline: auto; margin-block-end: var(--space-sm); overflow: hidden; bg sabbia`.
- `.certPlaceholder` (84-92, fallback): `max-inline-size: 200px; aspect-ratio: 3/2; border: 1px dashed color-mix(in srgb, sabbia 40%, transparent)` — the only dashed border in the system.

### 4.6 `Testimonials` — centered quote column (currently dormant)

`Testimonials.tsx:11-35`, `Testimonials.module.css:1-34`

- Returns `null` when `testimonials` is empty (current state — `data/testimonials.ts` empty, verified by its import; section never renders placeholder names).
- `<Section>` default pietra; visually-hidden h2 ("Trusted by those who know the difference." — `Testimonials.tsx:19-21`).
- `.inner`: **`max-inline-size: 680px`**, centered. `.list`: flex column, `gap: var(--space-xl)`.
- `.quote`: serif 24px italic, 1.35, carbone. `.attribution`: 14px sabbia, `margin-block-start: var(--space-sm)`.

### 4.7 `Contact` — 7/5 split with form card

`Contact.tsx:117-239`, `Contact.module.css:1-122`

- `<Section>` default pietra, `<ScrollReveal amount={0.15}>`.
- `.grid`: 1 col `gap: var(--space-lg)`; ≥1024: **`grid-template-columns: 7fr 5fr`, `gap: var(--space-xl)`** (content left, form right).
- `.content`: flex column `gap: var(--space-lg)`; `.details` (`<address>`, `font-style: normal`): grid `gap: var(--space-sm)` — location (16px ardesia), email TextLink, inline WhatsAppButton (`margin-block-start: var(--space-xs)`), Instagram link (`.instagram`, 99-116: 14px sabbia → carbone + underline on hover/focus).
- **`.formCard` (36-40) — the site's one true "card" surface:**

```
background-color: var(--color-gesso);
padding: var(--space-lg);                                  /* 40px */
border: 1px solid color-mix(in srgb, var(--color-sabbia) 20%, transparent);
```

No radius, no shadow.

- `.form`: grid, `gap: var(--space-md)` (24px between fields). Six fields from `data/contact.ts` (name, email, company, phone, role select, project textarea).
- `.submit` (60-72): flex, `margin-block-start: var(--space-xs)`; button forced `width: 100%` (filled variant, "Send inquiry"); `overflow: hidden` hosts `.loadingLine` — a 2px gesso line sweeping `translateX(-100%→100%)` infinitely during pending (81-97).
- Submit button success state: Framer scale bounce `[1, 1.03, 1]` `springs.snap` (`Contact.tsx:112-115`); content crossfades idle → "Sending…" → `<ValidationMorph state="success">` (checkmark draws via stroke-dasharray pathLength 0→1, 0.6s, `ValidationMorph.tsx:52-67`; success = 20×20 SVG + inline text).
- `.formNote` (118-122): 13px sabbia, consent microcopy + Privacy Policy TextLink. `navigator.vibrate(8)` fires on submit (`Contact.tsx:64-68`).

---

## 5. Motion components (`src/components/motion/`)

Spring presets (`src/lib/motion.ts:7-13`): `soft {200/22}`, `standard {150/18}`, `firm {260/26}`, `snap {400/30}`. Reveal variants: `sectionReveal` (opacity 0 + y 24 → visible, 0.8s expo-out, **staggerChildren 0.08s**); `childReveal` (y 16, 0.6s).

| Component                                           | Purpose                        | Key behavior                                                                                                                                                                                                                                                                                                                  |
| --------------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ScrollReveal` (`ScrollReveal.tsx:31-65`)           | One-shot `whileInView` wrapper | `viewport={{ once: true, amount }}` (default 0.15); renders plain tag under reduced motion                                                                                                                                                                                                                                    |
| `CountUp` (`CountUp.tsx:24-73`)                     | Number counter                 | RAF, `1 - exp(-t*8)` ease, 1200ms, `en-AE` format, zero re-renders (direct textContent)                                                                                                                                                                                                                                       |
| `TiltCard`/`TiltCardImage` (`TiltCard.tsx:48-155`)  | Cursor-aware 3D tilt           | ±4° rotateX / ±8° rotateY, perspective 1200px, image scale 1→1.05, touch press scale 0.98; **two-layer shadow**: rest `0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)` → active `0 24px 48px rgba(0,0,0,0.08), 0 12px 24px rgba(0,0,0,0.05)` (lines 74-81 — the only shadows in the codebase); `touch-action: pan-y` |
| `MagneticButton` (`MagneticButton.tsx:24-75`)       | Cursor-attracted CTA           | Max 8px translate, 100px hit radius (invisible `::before { inset: -100px }`), spring `firm`; no-op on touch/reduced-motion                                                                                                                                                                                                    |
| `AnimatedFocusRing` (`AnimatedFocusRing.tsx:11-26`) | Morphing form focus line       | `layoutId="form-focus-ring"`, 2px blu-notte, spring `soft`                                                                                                                                                                                                                                                                    |
| `ValidationMorph` (`ValidationMorph.tsx:22-69`)     | Error/success transitions      | error: y 8→0 (0.2s expo-out), exit y→-8; success: checkmark pathLength 0→1 (0.6s), `role="status"`                                                                                                                                                                                                                            |

---

## 6. Imagery / media treatment summary

| Image                                         | Aspect ratio                   | Radius | Placeholder bg                       | Hover                                                                                         |
| --------------------------------------------- | ------------------------------ | ------ | ------------------------------------ | --------------------------------------------------------------------------------------------- |
| FabricCard image (`FabricCard.module.css:14`) | **4/5**                        | none   | sabbia                               | card tilt ±4°/±8°, image scale 1.05, tagline→oro-antico, CTA underline draws, shadow elevates |
| Founder portrait (`Founder.module.css:16`)    | **3/4**                        | none   | sabbia                               | none                                                                                          |
| Certification scan (`Founder.module.css:64`)  | **2502/1770** (exact, no crop) | none   | sabbia                               | none                                                                                          |
| Cert placeholder (`Founder.module.css:88`)    | 3/2                            | none   | —                                    | 1px dashed sabbia-40% border                                                                  |
| Stamp (`WhyImperium.module.css:93`)           | natural, `min(240px,55vw)`     | none   | transparent (white PNG — Gesso only) | none                                                                                          |
| Route map (`WhyImperium.module.css:77`)       | natural, 100% width            | none   | —                                    | none                                                                                          |
| Hero wordmark (`Hero.module.css:40-45`)       | natural, `min(480px,80vw)`     | none   | —                                    | `filter: brightness(0) invert(1)`                                                             |
| Hero silk still                               | full-bleed cover               | none   | —                                    | —                                                                                             |

**Border-radius inventory (entire codebase):** `100px` pills (Button, WhatsAppButton inline, nav CTA, overlay WhatsApp CTA), `50%` (8px WhatsApp dot), `0` (inputs, explicit). **Nothing else — all imagery, cards, and surfaces are sharp rectangles.**

**Shadows:** only TiltCard's two elevation states (see §5). **Backdrop blur:** none. **Opacity-based color treatments:** sabbia 20% (dividers, form-card border), sabbia 30% (scrolled nav border), sabbia 35% (collections progress track), sabbia 40% (dashed placeholder), white 0.5/0.55/0.7/0.8 alphas (dark-hero text states).

---

## 7. The recurring layout grammar (for the design-system doc)

1. **Container:** `max-width: 1200px`, `margin-inline: auto`, inline padding stepping **24 → 40 (@768) → 80 (@1024) → 120 (@1440)**. Implemented by `Section .inner`, Footer `.inner`, Navigation `.row`, Collections `.header` — always the same four token values. The nav row is the one exception: `clamp(24px, 5vw, 120px)` (`Navigation.module.css:29`).
2. **Section rhythm:** `padding-block: clamp(80px, 10vw, 160px)` standard / `clamp(48px, 6vw, 96px)` dense. Backgrounds alternate by band: page pietra → StatsStrip gesso → Collections pietra → WhyImperium gesso → Founder/Testimonials/Contact pietra → Footer carbone. Whitespace over dividers is an explicit rule (`Section.module.css:2`, `WhyImperium.module.css:2`).
3. **Grids:** 12-column at ≥1024 for editorial rows (WhyImperium 5/7 split via `span 5`/`span 7`); fractional `5fr 7fr` (Founder) and `7fr 5fr` (Contact) splits; 3-up `repeat(3, 1fr)` stat grid; everything collapses to single column with `space-lg/xl` gaps below 1024. Gutter tokens: 16/20/24/32.
4. **Stack gaps (most-used tokens):** `sm`(16) ×22, `lg`(40) ×16, `xs`(8) ×15, `md`(24) ×11, `xl`(64) ×10. Conventional pairings: header stacks use `gap: sm`; card content `gap: xs`; section-internal blocks `gap: lg/xl`.
5. **Text measure caps:** sublines 540px (SectionHeader, Hero tagline), testimonials 680px, privacy 720px, body copy 60ch, spread-card text `min(320px, 36ch)`.
6. **Component recipe shortcuts for the doc:**
   - _Eyebrow_ = sans / 11px / 500 / 0.15em / uppercase / sabbia (reused 7×).
   - _Pill button_ = 56px min-h / 40px inline padding / radius 100px / 13px / 500 / 0.05em / uppercase.
   - _Hairline divider_ = 1px sabbia at 20-40% via `color-mix`.
   - _Card surface_ = gesso bg + 1px sabbia-20% border, no radius, no shadow (Contact form is the exemplar).
   - _Touch targets_ ≥ 48px (hamburger, hero text link), primary CTAs 56px; `:active` scale 0.97-0.98.
   - _Hover gating_ = all hover rules inside `@media (hover: hover) and (pointer: fine)`.
7. **Breakpoints:** exactly three — 768, 1024, 1440 (mobile-first `min-width`, plus `max-width: 767px` for mobile-only overrides like the WhatsApp bar and mobile type scale).

**Stale-doc note:** `TECHNICAL_ARCHITECTURE.md:104` says "StatBlock × 4" and §4 names the hero "IridescentSilkHero"; code has 3 stats (`data/stats.ts`) and the component is `ChampagneSilkHero`. Also `TECHNICAL_ARCHITECTURE.md:131` mentions an `isSlowConnection` connection check that is not referenced by `ChampagneSilkHero.tsx` (which gates only on reduced-motion + WebGL2).
</task_result>
</task>

````

---

## Assistant (Plan · Kimi K3 (2x usage) · 20.1s)

_Thinking:_

Excellent! I have extremely comprehensive research now. Let me check a few remaining details myself to verify key files before planning — specifically globals.css (the token source of truth) and the docs directory, plus check whether a DESIGN.md exists or is referenced. The research says DESIGN.md is referenced in comments but doesn't exist. That's actually important: the user wants to create this file, and there are stale references to "DESIGN.md" throughout the codebase comments. That's a strong hint the file should be named DESIGN.md (or referenced).

Let me verify:
1. globals.css — read it fully to confirm tokens
2. Check for existing docs/ content and DESIGN.md references
3. Check README for context

Then I'll present a plan. The plan mode requires me to present a plan and not edit. I should also ask clarifying questions:
- Where should the file live? (docs/DESIGN_SYSTEM.md vs root DESIGN.md — and since code comments reference DESIGN.md, naming it DESIGN.md would resolve those stale references)
- Format/language considerations — audience is opencode agents, so precise technical format with exact values, tokens, file references
- Should I update code comments that reference DESIGN.md to point to the new file? (That's an edit — in scope?)

Let me quickly read globals.css to verify the token layer myself, and grep for DESIGN.md references.

I have comprehensive research from all four agents. Let me verify the core token file and check one important detail — the codebase apparently references a `DESIGN.md` in comments that doesn't exist yet.

**Tool: read**

**Input:**
```json
{
  "filePath": "/Users/akshaymsingh/Documents/Liberate/Imperium/src/app/globals.css",
  "limit": 140
}
````

**Output:**

```
<path>/Users/akshaymsingh/Documents/Liberate/Imperium/src/app/globals.css</path>
<type>file</type>
<content>
1: /* ==========================================================================
2:    Imperium Italian Textile — Design Tokens & Base Styles
3:    Source of truth:  DESIGN.md §2–3 · MOTION_SPEC.md §2 · docs/TECHNICAL_ARCHITECTURE.md §5–6
4:    No global class names are exported here except reset/base element styles.
5:    Component styling lives colocated as CSS Modules.
6:    ========================================================================== */
7:
8: /* --- CSS Logical Properties throughout (RTL-ready per Architecture §8) ---- */
9:
10: :root {
11:   /* --- Colour Palette (DESIGN.md §3) ------------------------------------ */
12:
13:   /* Primary */
14:   --color-carbone: #1a1a1a; /* primary text, headlines */
15:   --color-pietra: #faf8f3; /* page background — raw Italian linen */
16:   --color-gesso: #ffffff; /* cards, overlays, form fields */
17:   --color-sabbia: #b8a99a; /* eyebrow text, secondary labels, dividers */
18:   --color-ardesia: #4a4540; /* body text — softer than pure black */
19:
20:   /* Accent */
21:   --color-blu-notte: #1b2a4a; /* CTA borders, active state, brand moments */
22:   --color-oro-antico: #c4a76c; /* founder quote, hover accents */
23:   --color-terracotta: #c47a5a; /* reserved: error states, map origin pin */
24:
25:   /* Functional */
26:   --color-whatsapp: #25d366;
27:   --color-error: #b83a2e;
28:   --color-success: #2e7d4f;
29:
30:   /* Transparent overlays */
31:   --color-hero-gradient: rgba(0, 0, 0, 0.4);
32:
33:   /* --- Typography (DESIGN.md §2) ---------------------------------------- */
34:
35:   --font-serif: "Cormorant Garamond", "Georgia", "Times New Roman", serif;
36:   --font-sans: "DM Sans", "Helvetica Neue", "Arial", sans-serif;
37:
38:   --font-weight-regular: 400;
39:   --font-weight-medium: 500;
40:   --font-weight-semibold: 600;
41:
42:   /* Modular scale (1:1.333 — perfect fourth) — desktop defaults */
43:   --text-eyebrow: 11px;
44:   --text-caption: 13px;
45:   --text-body: 16px;
46:   --text-body-large: 18px;
47:   --text-subheadline: 21px;
48:   --text-h4: 24px;
49:   --text-h3: 32px;
50:   --text-h2: 42px;
51:   --text-h1: 56px;
52:   --text-display: 72px;
53:
54:   --leading-body: 1.7;
55:   --leading-subheadline: 1.5;
56:   --leading-h4: 1.35;
57:   --leading-h3: 1.3;
58:   --leading-h2: 1.2;
59:   --leading-h1: 1.1;
60:   --leading-display: 1.05;
61:
62:   --tracking-eyebrow: 0.15em;
63:   --tracking-caption: 0.02em;
64:   --tracking-nav: 0.05em;
65:   --tracking-label: 0.05em;
66:
67:   /* --- Spacing Scale ---------------------------------------------------- */
68:
69:   --space-xxs: 4px;
70:   --space-xs: 8px;
71:   --space-sm: 16px;
72:   --space-md: 24px;
73:   --space-lg: 40px;
74:   --space-xl: 64px;
75:   --space-2xl: 96px;
76:   --space-3xl: 160px;
77:
78:   --section-padding-y: clamp(80px, 10vw, 160px);
79:   --subsection-padding-y: clamp(48px, 6vw, 96px);
80:   --element-padding-y: clamp(24px, 3vw, 40px);
81:
82:   /* --- Layout (DESIGN.md §4) -------------------------------------------- */
83:
84:   --max-content-width: 1200px;
85:   --nav-height: 72px;
86:   --nav-height-mobile: 56px;
87:   --whatsapp-bar-height: 56px;
88:
89:   /* Grid */
90:   --grid-columns: 12;
91:   --grid-gutter-desktop-xl: 32px;
92:   --grid-gutter-desktop: 24px;
93:   --grid-gutter-tablet: 20px;
94:   --grid-gutter-mobile: 16px;
95:
96:   --grid-margin-desktop-xl: 120px;
97:   --grid-margin-desktop: 80px;
98:   --grid-margin-tablet: 40px;
99:   --grid-margin-mobile: 24px;
100:
101:   /* Breakpoints (mirrored in src/lib/constants.ts) */
102:   --bp-tablet: 768px;
103:   --bp-desktop: 1024px;
104:   --bp-desktop-xl: 1440px;
105:
106:   /* --- Motion Tokens (MOTION_SPEC.md §2) -------------------------------- */
107:   /* Durations */
108:   --motion-duration-instant: 150ms;
109:   --motion-duration-fast: 250ms;
110:   --motion-duration-base: 400ms;
111:   --motion-duration-slow: 800ms;
112:   --motion-duration-cinematic: 1200ms;
113:
114:   /* Easings */
115:   --motion-ease-out: cubic-bezier(0.16, 1, 0.3, 1); /* expo-out, for entries */
116:   --motion-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
117:   --motion-ease-standard: cubic-bezier(0.25, 0.1, 0.25, 1);
118:
119:   /* Distances */
120:   --motion-distance-xs: 4px;
121:   --motion-distance-sm: 8px;
122:   --motion-distance-md: 16px;
123:   --motion-distance-lg: 24px;
124:   --motion-distance-xl: 48px;
125:
126:   /* Focus */
127:   --focus-outline-width: 2px;
128:   --focus-outline-offset: 2px;
129:
130:   /* --- Z-index scale ---------------------------------------------------- */
131:   --z-base: 1;
132:   --z-nav: 100;
133:   --z-whatsapp-bar: 90;
134:   --z-overlay: 200;
135: }
136:
137: /* --- Font-Face Declarations ---------------------------------------------- */
138: /* Self-hosted WOFF2 (Architecture §5). Fallback metric overrides eliminate
139:    cumulative layout shift when the custom font swaps in (Architecture §6). */
140:

(Showing lines 1-140 of 358. Use offset=141 to continue.)
</content>
```

**Tool: grep**

**Input:**

```json
{
  "pattern": "DESIGN\\.md",
  "path": "/Users/akshaymsingh/Documents/Liberate/Imperium/src"
}
```

**Output:**

```
Found 37 matches
/Users/akshaymsingh/Documents/Liberate/Imperium/src/data/collections.ts:
  Line 4: // PRD D-01 in favour of curated collections; DESIGN.md §9.04). `tags` stay


/Users/akshaymsingh/Documents/Liberate/Imperium/src/data/founder.ts:
  Line 1: // Founder — Sofia Mazza bio, quote, certification (DESIGN.md §9.06).


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/sections/Contact.module.css:
  Line 1: /* Contact — DESIGN.md §9.08. 7/5 split on desktop; form card on the right. */


/Users/akshaymsingh/Documents/Liberate/Imperium/src/data/pillars.ts:
  Line 3: // manifesto in DESIGN.md §9.05 and absorbs the origin-map idea from


/Users/akshaymsingh/Documents/Liberate/Imperium/src/data/navigation.ts:
  Line 3: // Navigation — nav links + CTA config (Architecture §2, DESIGN.md §9.01).


/Users/akshaymsingh/Documents/Liberate/Imperium/src/data/testimonials.ts:
  Line 3: // appears live (DESIGN.md §9.07, Roadmap Phase 4.7).


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/sections/Testimonials.module.css:
  Line 1: /* Testimonials — DESIGN.md §9.07. Single centred column of quote blocks. */


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/sections/Testimonials.tsx:
  Line 2: // (DESIGN.md §9.07, Roadmap Phase 4.6–4.7).


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/sections/StatsStrip.module.css:
  Line 1: /* StatsStrip — DESIGN.md §9.03. Single column on mobile, three columns


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/sections/WhyImperium.tsx:
  Line 2: // (client direction; replaces the DESIGN.md §9.05 four-in-a-row manifesto


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/sections/Founder.module.css:
  Line 1: /* Founder — DESIGN.md §9.06. Asymmetric 5/7 portrait + bio + pull quote + certification. */


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/sections/WhyImperium.module.css:
  Line 2:    dividers (DESIGN.md §4); numbered labels keep the manifesto DNA of


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/sections/Founder.tsx:
  Line 2: // (DESIGN.md §9.06, Roadmap Phase 4.2).


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/sections/StatsStrip.tsx:
  Line 4: // (DESIGN.md §9.03 elevation, Roadmap Phase 3.3). Reads src/data/stats.ts.


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/ui/TextLink.tsx:
  Line 1: // TextLink — animated underline link (DESIGN.md §5 hover spec,


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/ui/SectionHeader.module.css:
  Line 1: /* SectionHeader — eyebrow → headline → subline stack (DESIGN.md §9). */


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/layout/Footer.tsx:
  Line 1: // Footer — site-wide dark full-stop (DESIGN.md §9.09).


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/ui/Button.module.css:
  Line 1: /* Button — DESIGN.md §9.01, §9.02. Pill shape; ghost fills Blu Notte on

  Line 10:   min-block-size: 56px; /* touch target — DESIGN.md §8.6 */


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/ui/Button.tsx:
  Line 2: // DESIGN.md §9.01, §9.02 specify the variants.


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/ui/Eyebrow.module.css:
  Line 1: /* Eyebrow — DESIGN.md §2 typographic rules: always uppercase, tracked wide. */


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/ui/TextLink.module.css:
  Line 2:    (DESIGN.md §5: width 0% → 100%, 300ms). Uses currentColor so the link


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/ui/PullQuote.module.css:
  Line 1: /* PullQuote — DESIGN.md §9.06. Centred Cormorant italic quote + Oro Antico attribution. */


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/layout/Navigation.module.css:
  Line 1: /* Navigation — DESIGN.md §9.01 + §8. Transparent → opaque on scroll.


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/ui/FormField.module.css:
  Line 1: /* FormField — DESIGN.md §9.08. Underline-only inputs with floating labels. */


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/ui/FabricCard.tsx:
  Line 2: // (DESIGN.md §9.04, amended by client direction: a short promise line sits


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/ui/Eyebrow.tsx:
  Line 1: // Eyebrow — uppercase tracked label pattern (DESIGN.md §2, Roadmap 1.10).


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/layout/Section.module.css:
  Line 2:    (DESIGN.md §4: grid margins 24/40/80/120, whitespace over dividers). */


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/ui/PullQuote.tsx:
  Line 2: // (DESIGN.md §9.06, Roadmap Phase 4.3). No quotation marks — let text breathe.


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/ui/FabricCard.module.css:
  Line 1: /* FabricCard — DESIGN.md §9.04. 4:5 portrait image + tagline + italic title + body + CTA. */


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/ui/WhatsAppButton.module.css:
  Line 1: /* WhatsAppButton — DESIGN.md §9.08 (inline) + §8 (fixed mobile bar). */


/Users/akshaymsingh/Documents/Liberate/Imperium/src/app/globals.css:
  Line 3:    Source of truth:  DESIGN.md §2–3 · MOTION_SPEC.md §2 · docs/TECHNICAL_ARCHITECTURE.md §5–6

  Line 11:   /* --- Colour Palette (DESIGN.md §3) ------------------------------------ */

  Line 33:   /* --- Typography (DESIGN.md §2) ---------------------------------------- */

  Line 82:   /* --- Layout (DESIGN.md §4) -------------------------------------------- */

  Line 349: /* --- Mobile Type Scale (DESIGN.md §2) ----------------------------------- */


/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/ui/StatBlock.module.css:
  Line 1: /* StatBlock — DESIGN.md §9.03. */

```

---

## Assistant (Plan · Kimi K3 (2x usage) · 109.1s)

_Thinking:_

This is a critical finding. The codebase has **37 references** to a `DESIGN.md` file (with specific section numbers like §2 typography, §3 color, §4 layout, §5 hover spec, §8.6 touch targets, §9.01–9.09 per-section specs) that **does not exist**. The comments say "Source of truth: DESIGN.md §2–3 · MOTION_SPEC.md §2".

So the file the user wants me to create is literally the missing `DESIGN.md` — and the section numbering scheme is already implied by the references:

- DESIGN.md §2 = Typography
- DESIGN.md §3 = Colour Palette
- DESIGN.md §4 = Layout (grid margins, whitespace over dividers)
- DESIGN.md §5 = Hover spec (TextLink underline)
- DESIGN.md §8 = Touch targets / fixed bars (§8.6 = 56px touch target)
- DESIGN.md §9 = Section-by-section specs:
  - §9.01 = Navigation
  - §9.02 = Hero (Button variants §9.01, §9.02)
  - §9.03 = StatsStrip
  - §9.04 = Collections/FabricCard
  - §9.05 = WhyImperium (manifesto)
  - §9.06 = Founder (PullQuote)
  - §9.07 = Testimonials
  - §9.08 = Contact (FormField, WhatsApp inline)
  - §9.09 = Footer

Also MOTION_SPEC.md §2 is referenced — motion tokens. There's also a skills-lock.json and docs/TECHNICAL_ARCHITECTURE.md.

This changes my plan significantly: I should create `DESIGN.md` at the repo root (since references are "DESIGN.md §X" without a path prefix — the convention in this repo; globals.css line 3 says "Source of truth: DESIGN.md §2–3 · MOTION_SPEC.md §2 · docs/TECHNICAL_ARCHITECTURE.md §5–6", implying DESIGN.md and MOTION_SPEC.md live at root, while TECHNICAL_ARCHITECTURE.md is in docs/).

Wait — should MOTION_SPEC.md also be created? The user asked for ONE design system file covering colors, design choices, animation styles, and overall theme, with elements categorized into types with design rules per type. So the user wants a single file. But the code references suggest both DESIGN.md and MOTION_SPEC.md were planned. The user explicitly said "one reference file" — so I should put motion inside the same file. But then the MOTION_SPEC.md references in code would still point to a non-existent file. That's a question for the user, or I could include motion as a section in DESIGN.md and note the drift.

Hmm, but minimal-changes principle: the user asked for one file. I'll propose creating DESIGN.md (root) containing everything including motion (since user explicitly wants animation styles in the same file). I can mention that code comments also reference MOTION_SPEC.md, and ask whether they want a separate MOTION_SPEC.md or all-in-one DESIGN.md.

Also the categorization the user wants: "all elements of the website categorised into different types and for each type to have its own design rules. for example - If the nav bar items are to be categorised as sub-heading 2..." — so they want a semantic element-type taxonomy. The research already gives me a natural taxonomy:

Element types (text styles):

1. Display / Wordmark (hero)
2. H1, H2 (section headline), H3, H4
3. Subheadline
4. Eyebrow (sub-heading label)
5. Body / Body Large
6. Caption
7. Quote (pull quote, testimonial quote)
8. Stat number/label
9. Nav link (desktop/mobile)
10. Button/CTA label
11. Form label / input text / error text
12. Footer link/legal/social

Component types:

1. Navigation (header states, mobile overlay)
2. Buttons (4 variants)
3. TextLink
4. Cards (FabricCard, form card)
5. Form fields
6. Section bands & containers
7. Dividers/hairlines
8. Hero (WebGL)
9. Stats
10. Quotes
11. Footer
12. WhatsApp elements

Each with: font, color, size, spacing, animation, states (hover/focus/active/disabled/reduced-motion), and file references.

Structure for DESIGN.md, following the already-referenced section numbering so code comments resolve:

Proposed structure (matching existing references):

- §1 Overview / design philosophy / theme
- §2 Typography (referenced by Eyebrow, globals.css, mobile type scale)
- §3 Colour palette (referenced by globals.css)
- §4 Layout & grid (referenced by Section.module.css, WhyImperium)
- §5 Interaction & hover spec (TextLink)
- §6 Spacing
- §7 Motion & animation (durations, easings, springs, reveals, reduced motion) — note MOTION_SPEC.md is separately referenced; decide
- §8 Accessibility & touch targets (§8.6 = 56px touch target... hmm §8.6 suggests §8 has subsections; likely "responsive/accessibility" chapter)
- §9 Components & sections (§9.01 Navigation, §9.02 Hero, §9.03 StatsStrip, §9.04 Collections, §9.05 WhyImperium, §9.06 Founder, §9.07 Testimonials, §9.08 Contact, §9.09 Footer)
- §10 Element-type taxonomy quick reference (the user's core ask: a table where each element type maps to exact font/color/motion rules)

Wait — I need to be careful about mapping the implied section numbers precisely from references:

- §2 = typographic rules (Eyebrow "always uppercase, tracked wide"; globals.css typography; mobile type scale)
- §3 = colour palette (globals.css)
- §4 = grid margins 24/40/80/120, whitespace over dividers → Layout/Grid
- §5 = hover spec (TextLink: width 0%→100%, 300ms)
- §8.6 = touch target 56px min-height; §8 also referenced by Navigation ("DESIGN.md §9.01 + §8. Transparent → opaque on scroll") — §8 likely responsive behavior/breakpoints + touch targets. WhatsAppButton: "§9.08 (inline) + §8 (fixed mobile bar)" — so §8 covers the fixed mobile bar too?? Hmm, that comment says "WhatsAppButton — DESIGN.md §9.08 (inline) + §8 (fixed mobile bar)". So §8 contains the fixed mobile bar spec. That suggests §8 might be "fixed chrome / persistent elements" or "mobile-specific patterns". Actually nav height tokens, whatsapp bar height... §8 might be "Responsive & adaptive" or "App chrome". Hard to say exactly. I can define §8 as "Responsive behaviour, breakpoints & touch targets" — covering breakpoints, mobile adaptations (fixed WhatsApp bar, mobile nav overlay), touch targets (§8.6). That fits all three references reasonably.
- §9.xx = page sections as enumerated above.

I don't need to perfectly reverse-engineer; I define the file and the numbering, and I should make the numbering consistent with existing references since that's the strongest signal of intent. Where references exist, I'll match them (§2 typography, §3 color, §4 layout, §5 hover/interactions, §8 responsive+touch, §9 sections in the order given).

For the missing numbers (§1, §6, §7):

- §1 = intro/philosophy/theme
- §6 = spacing? or elevation/iconography/imagery?
- §7 = ?
- MOTION_SPEC.md §2 was referenced for motion tokens — if I fold motion into DESIGN.md, motion could be §6 or §7.

Proposed full TOC:

1. Brand & Design Philosophy (theme, mood, principles)
2. Typography (families, scale, weights, leading, tracking, element text styles)
3. Colour (tokens, tints/alpha patterns, shader palette, usage rules, do/don't)
4. Layout & Grid (container, margins, breakpoints, section rhythm, grids)
5. Interaction States (hover/focus/active/disabled specs per pattern, hover gating rule)
6. Spacing & Sizing (space scale, touch targets?) — hmm §8.6 is touch target, so §8 not §6.
7. Motion & Animation (tokens, springs, reveals, choreography, reduced motion)
8. Responsive Behaviour & Touch (breakpoints, mobile adaptations, fixed bars, touch targets — §8.6)
9. Sections & Components (§9.01–§9.09 + shared primitives)
10. Element-Type Quick Reference (the master lookup table)

- Appendix: token index, imagery rules, reserved/dead tokens, anomaly register (hardcoded values)

Hmm wait, is §5 "hover spec" only about TextLink? The reference: TextLink.tsx "animated underline link (DESIGN.md §5 hover spec)" and TextLink.module.css "(DESIGN.md §5: width 0% → 100%, 300ms)". So §5 = interaction/hover spec. Good.

Where should imagery/media treatment go? Could be §6 (Spacing → §6 could be "Spacing, sizing & imagery"). Or its own section. The user asked for colors, design choices, animation styles, overall theme, and categorization of elements. Let me not over-engineer; but completeness matters for future agents. I'll include:

1. Foundations — brand theme & principles
2. Typography
3. Colour
4. Layout & grid
5. Interaction states (hover/focus/active)
6. Spacing, elevation & surfaces (space scale, radii, shadows, dividers, borders)
7. Motion & animation
8. Responsive behaviour & touch targets
9. Section & component specs (§9.01–9.09 exactly as referenced)
10. Element-type taxonomy (master lookup tables: text styles, UI element types)
11. Governance — rules for adding new elements (how to extend, token usage rules, reserved tokens, known anomalies)

One file at root: DESIGN.md. The user said "one reference file".

Questions for the user:

1. Location/name: root `DESIGN.md` matches 37 existing code references — recommend that. Alternative: docs/DESIGN_SYSTEM.md. I'll recommend root DESIGN.md and just confirm.
2. Motion: fold into DESIGN.md §7 (user wants one file) vs separate MOTION_SPEC.md (referenced in code too). Recommend folding in, optionally noting MOTION_SPEC.md as alias. Could also create a thin MOTION_SPEC.md that points to DESIGN.md §7. Hmm — that would be a second file; ask.
3. Scope: should the doc also fix/flag doc drift? No — just document. Should I update the stale code comments referencing MOTION_SPEC.md? Minimal: no, out of scope, but mention.
4. Depth/format: technical tables with exact values, token names, file:line references? Yes — user said "technically and accurately as feasible". File:line references rot over time though; maybe reference files without line numbers for durability, or include line numbers since precision was requested. I'd include file paths and note values as of current state. Actually for an agent-facing doc, file paths + exact values + token names is right; line numbers rot fast. I'll use file paths, maybe selective line numbers. Hmm, the user wants precision. I'll include file paths (stable) rather than line numbers (fragile), and note that in the plan.

Also: the AGENTS.md instruction says update AGENTS.md if I modify things mentioned in it — the new DESIGN.md should probably be referenced in AGENTS.md? The project AGENTS.md is minimal (database schema, testing). Adding a pointer to DESIGN.md in AGENTS.md would help future agents discover it. That's a small, sensible addition — propose it in the plan as optional step.

Also there are skills (emil-design-eng, review-animations) — the animation philosophy section of DESIGN.md should align with those.

Verification: since it's a docs-only change, tests aren't strictly needed; but I can run a markdown lint if present? Probably none. I'll just verify the file renders and cross-check values against globals.css. Maybe run prettier on the md file (repo has prettier + prettierignore — check if md is covered). .prettierrc.json exists; husky + lint-staged? Let me check package.json quickly... Actually in plan mode I can read. Let me check package.json for format scripts to include in the plan's verification step.

Let me also double check whether DESIGN.md might exist somewhere (glob showed no DESIGN.md in root listing — confirmed absent; docs/ only has TECHNICAL_ARCHITECTURE.md).

Let me read package.json to know format/lint commands, and the .prettierignore to see if md files are formatted.

**Tool: read**

**Input:**

```json
{
  "filePath": "/Users/akshaymsingh/Documents/Liberate/Imperium/package.json"
}
```

**Output:**

```
<path>/Users/akshaymsingh/Documents/Liberate/Imperium/package.json</path>
<type>file</type>
<content>
1: {
2:   "name": "imperium-italian-textile",
3:   "version": "0.1.0",
4:   "private": true,
5:   "description": "Imperium Italian Textile — premium Italian fabrics delivered to the Gulf's most discerning tailors, designers and hospitality groups.",
6:   "license": "UNLICENSED",
7:   "engines": {
8:     "node": ">=20.11.0"
9:   },
10:   "packageManager": "npm@10.8.1",
11:   "scripts": {
12:     "dev": "next dev",
13:     "build": "next build",
14:     "start": "next start",
15:     "lint": "eslint .",
16:     "lint:fix": "eslint . --fix",
17:     "format": "prettier --write \"**/*.{ts,tsx,css,md,json,mjs}\" --ignore-path .prettierignore",
18:     "format:check": "prettier --check \"**/*.{ts,tsx,css,md,json,mjs}\" --ignore-path .prettierignore",
19:     "typecheck": "tsc --noEmit",
20:     "test": "vitest run",
21:     "test:watch": "vitest",
22:     "test:e2e": "playwright test",
23:     "test:e2e:ui": "playwright test --ui",
24:     "capture:hero": "node scripts/capture-hero-still.mjs",
25:     "prepare": "husky || true"
26:   },
27:   "lint-staged": {
28:     "*.{ts,tsx}": [
29:       "eslint --fix",
30:       "prettier --write"
31:     ],
32:     "*.{css,md,json,mjs}": [
33:       "prettier --write"
34:     ]
35:   },
36:   "dependencies": {
37:     "@react-three/drei": "^10.7.7",
38:     "@react-three/fiber": "^9.6.1",
39:     "framer-motion": "^11.11.0",
40:     "next": "^15.0.0",
41:     "react": "^19.0.0",
42:     "react-dom": "^19.0.0",
43:     "resend": "^4.0.0",
44:     "three": "^0.185.1"
45:   },
46:   "devDependencies": {
47:     "@commitlint/cli": "^19.5.0",
48:     "@commitlint/config-conventional": "^19.5.0",
49:     "@next/eslint-plugin-next": "^15.5.19",
50:     "@playwright/test": "^1.48.0",
51:     "@testing-library/dom": "^10.4.1",
52:     "@testing-library/jest-dom": "^6.5.0",
53:     "@testing-library/react": "^16.0.0",
54:     "@testing-library/user-event": "^14.5.0",
55:     "@types/node": "^22.7.0",
56:     "@types/react": "^19.0.0",
57:     "@types/react-dom": "^19.0.0",
58:     "@types/three": "^0.185.0",
59:     "@vitejs/plugin-react": "^4.3.0",
60:     "eslint": "^9.13.0",
61:     "eslint-config-prettier": "^9.1.0",
62:     "eslint-plugin-prettier": "^5.2.0",
63:     "globals": "^17.7.0",
64:     "husky": "^9.1.6",
65:     "jsdom": "^25.0.0",
66:     "leva": "^0.10.1",
67:     "lint-staged": "^15.2.0",
68:     "playwright": "^1.61.1",
69:     "prettier": "^3.3.0",
70:     "sharp": "^0.34.5",
71:     "typescript": "^5.6.0",
72:     "typescript-eslint": "^8.10.0",
73:     "vitest": "^2.1.0"
74:   }
75: }

(End of file - total 75 lines)
</content>
```

**Tool: read**

**Input:**

```json
{
  "filePath": "/Users/akshaymsingh/Documents/Liberate/Imperium/.prettierignore"
}
```

**Output:**

```
<path>/Users/akshaymsingh/Documents/Liberate/Imperium/.prettierignore</path>
<type>file</type>
<content>
1: .next
2: node_modules
3: public/fonts
4: public/video
5: public/images
6: playwright-report
7: test-results
8: coverage
9: pnpm-lock.yaml
10: package-lock.json
11: *.woff2
12: *.mp4
13:
14: # Planning documents — authored, not formatter-managed.
15: DESIGN.md
16: MOTION_SPEC.md
17: TECHNICAL_ARCHITECTURE.md
18: DEVELOPMENT_ROADMAP.md
19:
20: # Skill packs vendored under .agents/ — not part of this repo's formatting.
21: .agents/**

(End of file - total 21 lines)
</content>
```

---

## Assistant (Plan · Kimi K3 (2x usage) · 161.1s)

_Thinking:_

This confirms everything: `.prettierignore` lines 14-17 explicitly list `DESIGN.md`, `MOTION_SPEC.md`, `TECHNICAL_ARCHITECTURE.md`, `DEVELOPMENT_ROADMAP.md` as "Planning documents — authored, not formatter-managed." So the original project plan had DESIGN.md and MOTION_SPEC.md at the **repo root**, and they were never created (or were lost). The user is now asking me to create exactly this.

So the recommendation is clear:

- Create `/DESIGN.md` at repo root (matches 37 code references + .prettierignore entry).
- The user asked for ONE file including animation styles → fold motion into DESIGN.md. But MOTION_SPEC.md is also referenced in code comments (globals.css line 3, src/lib/motion.ts comments). Options: (a) single DESIGN.md with a motion chapter; (b) DESIGN.md + MOTION_SPEC.md. The user explicitly said "one reference file". I'll go with one DESIGN.md that includes the full motion chapter, and mention that code comments referencing MOTION_SPEC.md will still dangle unless we either create a one-line redirect file MOTION_SPEC.md pointing to DESIGN.md §7, or update those comments. I'll ask the user about that as a question, or just note it. Given the "ask before acting when ambiguous" rule, this is a real decision: single file (user's explicit ask) vs. resolving dangling references.

Actually let me reconsider: the user said "I want to create a design system file so all the people working on the project can have one reference file". Singular, explicit. So: one DESIGN.md, motion included as a chapter. For MOTION_SPEC.md references, I'll note it in the plan summary as a known dangling reference and offer the option. I could ask via the question tool — batch questions:

Q1: Location/name — recommend root DESIGN.md (matches existing references). Other option: docs/.
Q2: MOTION_SPEC.md dangling references — options: fold motion into DESIGN.md and leave references; create thin MOTION_SPEC.md redirect; update code comments.
Q3: Line-number precision vs file-path references — minor, I can decide myself (file paths, token names; no line numbers since they rot). I'll decide: file paths + exact values, no line numbers. Low-stakes, reversible.

Also Q about whether to add a pointer in AGENTS.md so future opencode agents discover DESIGN.md. The user said "the people working on this project in the future will be agents in opencode" — agents read AGENTS.md automatically. Adding one line to AGENTS.md pointing to DESIGN.md would be very effective for discoverability. That's a second file edit; low-risk but behavior-changing for agents. Worth asking or just include as plan step and let user veto. I'll include it in the plan as a recommended step and flag it.

Also update docs? No, keep minimal.

The doc structure — matching the section numbers already referenced in code:

- §1 Design philosophy & theme
- §2 Typography (referenced: Eyebrow, globals.css, mobile type scale)
- §3 Colour (referenced: globals.css)
- §4 Layout & grid (referenced: Section, WhyImperium)
- §5 Interaction states / hover spec (referenced: TextLink)
- §6 Spacing, surfaces & elevation (space scale, radii, shadows, hairlines)
- §7 Motion & animation (tokens, springs, reveals, choreography, reduced-motion) — absorbs MOTION_SPEC
- §8 Responsive behaviour & touch targets (referenced: Button §8.6 56px touch target, Navigation §8, WhatsAppButton §8 fixed mobile bar)
- §9 Component & section specifications (§9.01 Navigation, §9.02 Hero, §9.03 StatsStrip, §9.04 Collections, §9.05 WhyImperium, §9.06 Founder, §9.07 Testimonials, §9.08 Contact, §9.09 Footer — exactly as referenced in code comments) + shared primitives (Button, TextLink, Eyebrow, SectionHeader, FabricCard, StatBlock, PullQuote, FormField, WhatsAppButton, motion components)
- §10 Element-type taxonomy — the user's core ask: master lookup tables. Every element type (e.g., "Sub-heading / Eyebrow", "Nav item", "CTA label", "Body", "Card title", "Quote") mapped to: component, font family, size (desktop/mobile), weight, line-height, tracking, transform, color (rest/hover/focus/active), animation, and source file. Also non-text element types: surfaces, dividers, buttons, inputs, images, icons/indicators.
- §11 Governance — rules for future work: always use tokens, never introduce new hex values, reserved tokens (terracotta, success, hero-gradient), dead/unused tokens inventory, hardcoded-values anomaly register, doc-drift notes, checklist for adding new elements, alignment with .agents/skills animation standards.

The user's example: "If the nav bar items are to be categorised as sub-heading 2, what font, color and animation style it follows" — the taxonomy in §10 directly serves this. Note the nav items are actually "Nav link" type: DM Sans 400 13px uppercase 0.05em ardesia → hover carbone + underline draw 250ms.

Content accuracy: I have exhaustive research with exact values.

Verification plan: docs-only change; run `npx prettier --check DESIGN.md`? No — DESIGN.md is in .prettierignore ("authored, not formatter-managed"), so no formatter. Verify by: cross-checking every value in the doc against globals.css and module files (the research already did this), and optionally run `npm run lint`/`typecheck`? Not needed for md. I'll state verification = manual value cross-check against source files (already done during research) + confirm no code changes. AGENTS.md testing rule: "If the project has no testing tools or infrastructure available, ask the user whether testing should be skipped" — project has tests but they don't cover markdown; docs-only change, so tests are not relevant; I'll state that.

Now, questions to ask the user (batched):

1. **File name & location**: Root `DESIGN.md` (recommended — 37 code comments + .prettierignore already point to it) vs `docs/DESIGN_SYSTEM.md` vs other.

2. **Motion references**: code comments also cite `MOTION_SPEC.md §2`. Options: (a) include motion as DESIGN.md §7 and add a one-line `MOTION_SPEC.md` redirecting to it (recommended — resolves dangling refs, keeps one true source), (b) motion in DESIGN.md only, leave refs dangling, (c) update code comments to point at DESIGN.md.

3. **AGENTS.md pointer**: add one line to project AGENTS.md telling agents to read DESIGN.md before styling work? Recommended yes since audience is opencode agents.

That's three crisp questions. Maybe also depth of the §10 taxonomy? No — I'll just do it thoroughly; user asked for "as technically and accurately as feasible".

Let me now write the plan. Keep it comprehensive but concise. Present findings summary + plan + questions.

Research complete. I now have an exhaustive, verified picture of the design system — and two discoveries that shape the plan:

1. **The codebase already references `DESIGN.md` 37 times** (with specific section numbers: §2 typography, §3 colour, §4 layout, §5 hover spec, §8.6 touch targets, §9.01–§9.09 per-section specs) — but the file doesn't exist. `.prettierignore` also lists `DESIGN.md` and `MOTION_SPEC.md` as planned root-level docs.
2. **There is no Tailwind** — the system is CSS custom properties in `src/app/globals.css` + colocated CSS Modules, so the doc must catalog tokens + module recipes, not utility classes.

## Key facts gathered (from full codebase analysis)

- **Color**: 5 warm neutrals (`carbone #1a1a1a`, `pietra #faf8f3`, `gesso #fff`, `sabbia #b8a99a`, `ardesia #4a4540`), 2 accents (`blu-notte #1b2a4a`, `oro-antico #c4a76c`), functional colors, alpha/tint patterns (sabbia 20–40% hairlines, white 50–80% on dark), WebGL silk shader palette, 3 dead tokens
- **Typography**: Cormorant Garamond (serif, display/headings/quotes) + DM Sans (sans, UI/body), self-hosted WOFF2, 1:1.333 modular scale 11→72px, mobile overrides, full per-element catalog (eyebrow, nav link, button, form label, quote, stat…)
- **Motion**: 4 spring presets, expo-out easing, 150/250/400/800/1200ms durations, hero entrance choreography (700→2600ms), reveal/stagger patterns, hover-gating rule, layered reduced-motion policy
- **Layout/components**: 1200px container, 24/40/80/120 margins, 768/1024/1440 breakpoints, section rhythm clamps, sharp-rectangle rule (radius only on pills), single shadow spec, and exact recipes for every component incl. nav states, mobile overlay, footer, form card, TiltCard

## Proposed plan

**Create `/DESIGN.md` at repo root** — the single reference file, structured to match the section numbering the code already cites:

| Section | Content                                                                                                                                                                                                                                                                                             |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| §1      | Design philosophy & theme (quiet luxury, warm linen neutrals, champagne silk hero, restraint rules)                                                                                                                                                                                                 |
| §2      | Typography — families, loading, scale, weights, leading, tracking + per-text-style recipes                                                                                                                                                                                                          |
| §3      | Colour — every token w/ exact values & usage rules, tint/alpha patterns, shader palette, reserved tokens, do/don't                                                                                                                                                                                  |
| §4      | Layout & grid — container, margins, breakpoints, section rhythm, grid patterns, measure caps                                                                                                                                                                                                        |
| §5      | Interaction states — hover/focus/active/disabled spec per pattern, hover-gating rule                                                                                                                                                                                                                |
| §6      | Spacing, surfaces & elevation — space scale, hairline dividers, radius inventory, the one shadow spec                                                                                                                                                                                               |
| §7      | Motion & animation — tokens, springs, reveal system, hero choreography, per-component motion, reduced-motion policy                                                                                                                                                                                 |
| §8      | Responsive behaviour & touch targets (incl. §8.6 = 56px targets, fixed mobile bars)                                                                                                                                                                                                                 |
| §9      | Component & section specs — §9.01 Navigation through §9.09 Footer (matching code refs) + shared UI primitives                                                                                                                                                                                       |
| §10     | **Element-type taxonomy** — the master lookup tables: every element type (display, h2, eyebrow, nav item, CTA, body, quote, stat, form label, card title, divider, surface…) mapped to exact font/size/weight/tracking/color/states/animation + source file. This is your "sub-heading 2" use case. |
| §11     | Governance — rules for adding new elements (tokens only, no new hex values, reuse existing types), anomaly register (hardcoded values), dead-token inventory, known doc drift                                                                                                                       |

Values cited by token name + exact value + source file path (no line numbers — they rot; paths are stable).

**Verification**: docs-only change — tests/lint/typecheck aren't applicable (and `DESIGN.md` is in `.prettierignore` by design). Every value will be cross-checked against `globals.css` and the module files it was extracted from.

Three decisions before I execute:

**Tool: question**

**Input:**

```json
{
  "questions": [
    {
      "question": "Where should the design system file live?",
      "header": "File location",
      "options": [
        {
          "label": "Root DESIGN.md (Recommended)",
          "description": "37 existing code comments and .prettierignore already reference DESIGN.md at root — creating it there resolves all dangling references."
        },
        {
          "label": "docs/DESIGN_SYSTEM.md",
          "description": "Keeps docs together with TECHNICAL_ARCHITECTURE.md, but existing code references to DESIGN.md remain dangling."
        }
      ]
    },
    {
      "question": "Code comments also reference MOTION_SPEC.md (motion tokens). Since you want one reference file, motion becomes §7 of DESIGN.md. How should I handle the MOTION_SPEC.md references?",
      "header": "Motion refs",
      "options": [
        {
          "label": "Add redirect stub (Recommended)",
          "description": "Create a one-line MOTION_SPEC.md at root saying 'Motion spec lives in DESIGN.md §7'. One source of truth, no dangling references."
        },
        {
          "label": "DESIGN.md only",
          "description": "Single file, nothing else created. MOTION_SPEC.md references in code comments stay dangling."
        },
        {
          "label": "Update code comments",
          "description": "Rewrite the ~5 code comments citing MOTION_SPEC.md to cite DESIGN.md §7 instead. Slightly larger diff into source files."
        }
      ]
    },
    {
      "question": "Since future contributors are opencode agents (which auto-read AGENTS.md), should I add a one-line pointer in the project AGENTS.md telling agents to consult DESIGN.md before any styling work?",
      "header": "AGENTS.md pointer",
      "options": [
        {
          "label": "Yes, add pointer (Recommended)",
          "description": "One line in AGENTS.md: read DESIGN.md before creating/modifying UI. Maximizes discoverability for agents."
        },
        {
          "label": "No, DESIGN.md only",
          "description": "Leave AGENTS.md untouched; agents must find DESIGN.md themselves."
        }
      ]
    }
  ]
}
```

**Output:**

```
User has answered your questions: "Where should the design system file live?"="Root DESIGN.md (Recommended)", "Code comments also reference MOTION_SPEC.md (motion tokens). Since you want one reference file, motion becomes §7 of DESIGN.md. How should I handle the MOTION_SPEC.md references?"="Add redirect stub (Recommended)", "Since future contributors are opencode agents (which auto-read AGENTS.md), should I add a one-line pointer in the project AGENTS.md telling agents to consult DESIGN.md before any styling work?"="Yes, add pointer (Recommended)". You can now continue with the user's answers in mind.
```

---

## Assistant (Plan · Kimi K3 (2x usage) · 37.7s)

_Thinking:_

All three recommendations accepted. The plan is now:

1. Create `/DESIGN.md` — the full design system document with §1–§11 structure as laid out.
2. Create `/MOTION_SPEC.md` — one-line redirect stub to DESIGN.md §7.
3. Add one-line pointer in `/AGENTS.md` telling agents to read DESIGN.md before styling work.

I'm still in plan mode — I should present the final plan and exit plan mode / wait for approval. The system reminder says plan mode is active and I must not edit. So I present the finalized plan now for the user to approve.

All confirmed. Here's the final execution plan:

## Plan

**1. Create `/DESIGN.md`** — the single design-system reference, structured to match the section numbering already cited in 37 code comments:

- **§1 Design philosophy & theme** — quiet Italian luxury: warm linen neutrals, single dark champagne-silk hero, restraint rules (2 accents max, whitespace over dividers, sharp rectangles)
- **§2 Typography** — Cormorant Garamond + DM Sans (self-hosted WOFF2, preloads, metric overrides), 1:1.333 scale (11/13/16/18/21/24/32/42/56/72px), mobile overrides (72→40, 56→36, 42→30; body locked ≥16px), weights, leading, tracking tokens, and per-style recipes
- **§3 Colour** — all 12 tokens with exact values + usage rules, tint patterns (`color-mix` sabbia 20–40%, white alphas 50–80%, 90%-black hover darkening), WebGL shader palette (base/highlight/sheen), reserved + dead-token inventory, "no new hex values" rule
- **§4 Layout & grid** — 1200px container, 24/40/80/120 stepped margins, 768/1024/1440 breakpoints, section rhythm clamps, 12-col / 5fr-7fr / 7fr-5fr splits, text measure caps (540px, 60ch, 680px, 720px)
- **§5 Interaction states** — hover/focus/active/disabled spec per pattern (underline draws, ghost fills, scale presses), mandatory `@media (hover: hover) and (pointer: fine)` gating, global focus-visible spec
- **§6 Spacing, surfaces & elevation** — space scale (4→160px), hairline divider recipe, radius inventory (100px pills + 50% dot only), the single shadow spec (TiltCard two-state), no-blur rule
- **§7 Motion & animation** — duration/easing/distance tokens, 4 spring presets, reveal system (0.8s expo-out + 80ms stagger), hero entrance choreography (700/950/1250/1500/2600ms), per-component motion (TiltCard, MagneticButton, CountUp, ValidationMorph, focus-ring morph, pinned scroll), layered reduced-motion policy, Emil Kowalski philosophy alignment
- **§8 Responsive & touch** — breakpoint behavior per component, mobile type scale, fixed WhatsApp bar, mobile overlay, §8.6 touch targets (56px primary / 48px min)
- **§9 Component specs** — §9.01 Navigation → §9.09 Footer matching existing code references, plus shared primitives (Button ×4 variants, TextLink, Eyebrow, SectionHeader, FabricCard, StatBlock, PullQuote, FormField, WhatsAppButton, motion components) — each with exact class recipes, states, and source file
- **§10 Element-type taxonomy** — master lookup tables: every element type → font/size/weight/leading/tracking/transform/color (rest + each state)/animation/source file. This is the table a future agent uses for "I'm adding a new sub-heading 2 — what exactly does it look like?"
- **§11 Governance** — extension rules, anomaly register (hardcoded 36/28/24/14px values etc.), dead tokens, known doc drift (stale TECHNICAL_ARCHITECTURE.md hero/stat descriptions)

Values cited as **token name + exact value + source file path** (no line numbers — they rot).

**2. Create `/MOTION_SPEC.md`** — one-line redirect stub: "The motion specification lives in `DESIGN.md` §7."

**3. Append one line to `/AGENTS.md`** — instruct agents to read `DESIGN.md` before any UI/styling work.

**Verification**: docs-only change, so tests/lint/typecheck aren't applicable (`DESIGN.md` is deliberately in `.prettierignore`). Every value in the doc has been extracted from and will be cross-checked against `globals.css` and the component module files.

Ready to execute on your approval.

---

## User

Execute, Do not forget to categorize the elements while you are at it, that is vital. ensure that the classifications do not exceed the necessary amount of sub-categories

---

## Assistant (Build · Kimi K3 (2x usage) · 98.0s)

_Thinking:_

The user wants me to execute the plan. Key requirements:

1. Create `/DESIGN.md` — the full design system document with §1–§11 structure
2. Categorize elements — vital, but don't create excessive sub-categories
3. Create `/MOTION_SPEC.md` — redirect stub
4. Add pointer to `/AGENTS.md`

The user emphasized: "Do not forget to categorize the elements while you are at it, that is vital. ensure that the classifications do not exceed the necessary amount of sub-categories" — so the §10 taxonomy (and categorization throughout) should be thorough but not over-fragmented. Keep the taxonomy tight: a sensible number of element types, not dozens of micro-categories.

Let me think about the element taxonomy. Based on my research, the site's elements naturally fall into these types:

**Text element types (typographic styles):**

1. **Display** — hero wordmark (serif 72/40px)
2. **Heading** — section headlines (h2 42/30px, h3 32px variants) — could split into "Section Heading" and "Sub-heading"
3. **Sub-heading** — item-level headings (WhyImperium h3 21px, FabricCard title 28px italic) — hmm
4. **Eyebrow** — the 11px uppercase tracked label (recurs 7×)
5. **Body** — 16px DM Sans (and Body Large 18px variant)
6. **Quote** — serif italic (PullQuote 36px, Testimonial 24px)
7. **Caption/Label** — 13px stat label, footer tagline etc.

**UI element types:** 8. **Nav item** — 13px uppercase 0.05em links 9. **Button/CTA** — pill, 13px uppercase 500 10. **Text link** — animated underline 11. **Form field** — label (16px uppercase floating) + input (16px) + error text 12. **Stat** — number + label 13. **Surface/Card** — gesso + hairline border 14. **Divider** — 1px sabbia tints 15. **Media/Image** — sharp rectangles, aspect ratios

The user says don't exceed necessary sub-categories. So I should keep the master taxonomy tight. Let me design a clean taxonomy with a small set of named types. I think the cleanest approach:

**Text styles (T1–T10 or named):**

- T1 Display
- T2 Heading (section headline, h2/h3)
- T3 Sub-heading (item title — serif, incl. italic card variant)
- T4 Eyebrow (label)
- T5 Body (base + large)
- T6 Quote
- T7 Caption

**UI element types (U1–...):**

- U1 Nav link
- U2 Button / CTA
- U3 Text link
- U4 Form field
- U5 Stat
- U6 Surface (card/band)
- U7 Divider
- U8 Media

Hmm, but the user's example was "If the nav bar items are to be categorised as sub-heading 2" — they want a type name and then full rules. The key is that every element on the site maps to exactly one type, and each type has complete rules. Let me not over-engineer with codes; use clear names.

Actually, let me reconsider the structure. The doc is large. I need to write it carefully with all exact values from my research. Let me be careful about accuracy — I have very detailed reports. Let me also double-check a few things I want to cite precisely:

- globals.css values — I read lines 1-140 directly. Good.
- Mobile type scale: lines 351-358 — display 40, h1 36, h2 30. I should read that section to be exact. The agent reported it; I trust it but let me verify the rest of globals.css (lines 141-358) since I'm citing it as the source of truth. Actually the typography agent quoted lines 141-200 (font faces), 221-231 (body), 242-248, 291-299 (h1-h4), 303-306 (focus-visible), 309-319 (visually-hidden), 326-347 (reduced motion), 351-358 (mobile scale). I have high confidence. But since I'm writing a "source of truth" doc, let me read the rest of globals.css myself to be safe — it's only 358 lines.

Also I should verify some key module files I'll cite heavily. The research is detailed and consistent across agents (cross-checked values match: e.g., eyebrow recipe cited by both typography and component agents identically). I'll trust the reports but spot-check the most-cited files: Button.module.css, Navigation.module.css partially, Section.module.css. Actually, given the volume, I'll read globals.css fully and spot-check Eyebrow.module.css + Button.module.css + Section.module.css quickly. The agents gave file:line evidence consistently.

Let me read the remaining part of globals.css first, plus a couple of spot checks. Then write the doc.

For AGENTS.md — the project one at root. Current content:

```
# Response Guidelines

## Database Schema Changes

- Whenever making changes to the database schema:
  1. Run the Drizzle generate command.
  2. Run the Drizzle migrate command.
- **Never** run `drizzle push`.

## Testing

- Use any testing tools, libraries, MCP tools, skills, or frameworks available in the project to test your changes.
- Never assume changes work without testing.
- If the project has no testing tools or infrastructure available, ask the user whether testing should be skipped.
```

I'll add a "## Design System" section with the pointer. One line (or two).

MOTION_SPEC.md stub:

```
# MOTION_SPEC

The motion specification lives in [DESIGN.md](./DESIGN.md) §7 — Motion & Animation.
```

Now the big one: DESIGN.md. Let me draft the content carefully.

Structure (matching code references):

- Header: purpose, audience (opencode agents), how to use, source-of-truth note
- §1 Design Philosophy & Theme
- §2 Typography
- §3 Colour
- §4 Layout & Grid
- §5 Interaction States
- §6 Spacing, Surfaces & Elevation
- §7 Motion & Animation
- §8 Responsive Behaviour & Touch Targets
- §9 Component Specifications (§9.01–§9.09 + primitives)
- §10 Element-Type Taxonomy (master lookup)
- §11 Governance & Extension Rules

On "classifications do not exceed the necessary amount of sub-categories": in §10 I'll define a tight set of element types. Let me finalize:

**Text types (8):**

1. `Display` — hero wordmark fallback
2. `Heading` — section headline (h2 default; h3 variant)
3. `Sub-heading` — item/card title (serif; standard and italic variants)
4. `Eyebrow` — uppercase micro-label
5. `Body` — base + large
6. `Quote` — editorial serif italic (large + small)
7. `Caption` — small supporting text
8. `Label` — UI micro-text on forms/buttons/nav?

Hmm wait — nav links, button labels, form labels are uppercase tracked sans text but with different sizes (13px 0.05em, 13px 0.05em, 16px 0.15em). Do I classify them as text types or as UI element types? They're UI elements whose typography is part of the component spec. The user's example: "If the nav bar items are to be categorised as sub-heading 2" — the user expects nav items to be classified as a _type_ and inherit that type's full rules. So nav item IS a type. I'll classify UI text by its element role:

**UI element types (7):** 9. `Nav item` — desktop link, mobile link variant, nav CTA, lang toggle 10. `Button / CTA` — the pill (4 color variants, one size) 11. `Text link` — animated underline link 12. `Form field` — label + input + error 13. `Stat` — number + label 14. `Surface` — section bands + card 15. `Divider` — hairline 16. `Media` — images (aspect ratios, treatments)

That's 16 total types — hmm, is that too many? The user said don't exceed the necessary amount. The site genuinely has these distinct element roles. 16 named types for a whole site is reasonable and not over-fragmented; merging further would lose the "exact same style" guarantee. But I could tighten:

- Merge `Caption` into Body? No — caption is 13px distinct. Keep.
- `Quote` could be a Sub-heading variant? No, it's a distinct editorial element. Keep.
- `Stat` — number uses h2 size, label uses caption. Could decompose into Heading + Caption... but Stat as a UI pattern has structure (number + label + countup animation). Keep as UI element.
- `Divider` and `Surface` and `Media` are non-text element types — needed for completeness ("all elements of the website categorised").

I think 8 text types + 8 UI types = 16 is defensible. Actually let me reconsider — "Label" as a text type vs buttons/nav being UI types: I dropped the generic "Label" text type; good, eyebrow covers the uppercase micro-label.

Let me reconsider text types:

1. Display (72px serif) — used once (hero fallback). Necessary as a type since it's the display tier of the scale.
2. Heading — section headlines. Includes h2 (42/30) and h3 (32) variants.
3. Sub-heading — 21px serif 500 (WhyImperium), 28px serif italic 500 (FabricCard), 32px serif 500 mobile menu links? Hmm, mobile menu links are 32px — that's h3 size with 500 weight. I'll classify mobile overlay links under Nav item (UI type) since they're nav. OK.
4. Eyebrow — 11px/500/0.15em/uppercase. Color variants: sabbia (default), oro-antico (attribution/accent), white-70 (on dark).
5. Body — 16px/400/1.7 ardesia; Large variant 18px (subline, hero tagline).
6. Quote — serif italic; large 36/28 (pull quote), small 24 (testimonial).
7. Caption — 13px sans; stat label, footer tagline, form note, error text (error color variant).

Hmm, footer legal/social are 11px sans 400 — that's eyebrow-size but not uppercase/tracked. Classify under Caption with 11px variant? Or Eyebrow variant without uppercase? The eyebrow recipe is specifically 11px/500/0.15em/uppercase. Footer legal is 11px/400 no tracking. I'll put it as Caption variant (micro caption 11px). Fine — Caption: 13px default, 11px micro variant.

UI types: 8. Nav item — desktop (13px/400/0.05em/uppercase/ardesia → carbone + underline), mobile overlay (32px serif 500), nav CTA (mini ghost pill), lang toggle (12px sabbia). 9. Button/CTA — pill geometry + 4 variants. 10. Text link — blu-notte 500 + underline draw; white variant on dark; 14px variant in cards. 11. Form field — floating label, underline input, error state, focus ring. 12. Stat — number (serif 42px + CountUp) + label (caption). 13. Surface — bands (pietra/gesso/carbone) + card (gesso + sabbia-20% border, 40px padding). 14. Divider — 1px sabbia tint hairlines. 15. Media — aspect ratios 4/5, 3/4, 2502/1770, natural; sabbia placeholder; sharp corners; treatments.

15 types total. Good — tight but complete. I'll present as two tables: Text Element Types (7) and UI Element Types (8). Each type gets a spec block.

Now — where do I put the taxonomy? §10 as planned. And §9 covers component-by-component specs. There will be some overlap between §9 and §10; that's fine — §9 is organized by _component_, §10 by _element type_. To avoid redundancy, §9 can reference type names. Actually to keep the doc manageable, I'll make §10 the master and keep §9 focused on structure/layout/behavior per component, referencing the type names for typography. Good.

Also categorization should appear in §2 (text styles) and throughout. The vital ask: every element categorized. §10 delivers the master matrix.

Let me now verify the remaining globals.css lines and spot-check a few modules before writing. Then write the three files.

Actually, one more consideration on length: this doc will be long (~700-900 lines). That's fine and appropriate for a design system source of truth. But I should keep it tight — tables over prose.

Let me read globals.css 141-358 and spot-check files.

Executing now. Let me first verify the remaining sections of `globals.css` and spot-check the most-cited module files so every value in the doc is accurate.

**Tool: read**

**Input:**

```json
{
  "filePath": "/Users/akshaymsingh/Documents/Liberate/Imperium/src/app/globals.css",
  "offset": 141
}
```

**Output:**

```
<path>/Users/akshaymsingh/Documents/Liberate/Imperium/src/app/globals.css</path>
<type>file</type>
<content>
141: @font-face {
142:   font-family: "Cormorant Garamond";
143:   font-style: normal;
144:   font-weight: 400;
145:   font-display: swap;
146:   src: url("/fonts/CormorantGaramond-Regular.woff2") format("woff2");
147:   /* Fallback metrics matched to Cormorant to minimise CLS */
148:   ascent-override: 96.22%;
149:   descent-override: 29.89%;
150:   line-gap-override: 0%;
151:   size-adjust: 96.03%;
152: }
153:
154: @font-face {
155:   font-family: "Cormorant Garamond";
156:   font-style: normal;
157:   font-weight: 500;
158:   font-display: swap;
159:   src: url("/fonts/CormorantGaramond-Medium.woff2") format("woff2");
160: }
161:
162: @font-face {
163:   font-family: "Cormorant Garamond";
164:   font-style: normal;
165:   font-weight: 600;
166:   font-display: swap;
167:   src: url("/fonts/CormorantGaramond-SemiBold.woff2") format("woff2");
168: }
169:
170: @font-face {
171:   font-family: "Cormorant Garamond";
172:   font-style: italic;
173:   font-weight: 400;
174:   font-display: swap;
175:   src: url("/fonts/CormorantGaramond-Italic.woff2") format("woff2");
176: }
177:
178: @font-face {
179:   font-family: "Cormorant Garamond";
180:   font-style: italic;
181:   font-weight: 500;
182:   font-display: swap;
183:   src: url("/fonts/CormorantGaramond-MediumItalic.woff2") format("woff2");
184: }
185:
186: @font-face {
187:   font-family: "DM Sans";
188:   font-style: normal;
189:   font-weight: 400;
190:   font-display: swap;
191:   src: url("/fonts/DMSans-Regular.woff2") format("woff2");
192: }
193:
194: @font-face {
195:   font-family: "DM Sans";
196:   font-style: normal;
197:   font-weight: 500;
198:   font-display: swap;
199:   src: url("/fonts/DMSans-Medium.woff2") format("woff2");
200: }
201:
202: /* --- CSS Reset (minimal, modern) ----------------------------------------- */
203:
204: *,
205: *::before,
206: *::after {
207:   box-sizing: border-box;
208: }
209:
210: * {
211:   margin: 0;
212: }
213:
214: html {
215:   -webkit-text-size-adjust: 100%;
216:   text-size-adjust: 100%;
217:   scroll-behavior: smooth;
218:   -webkit-tap-highlight-color: transparent;
219: }
220:
221: body {
222:   min-height: 100svh;
223:   line-height: var(--leading-body);
224:   -webkit-font-smoothing: antialiased;
225:   -moz-osx-font-smoothing: grayscale;
226:   text-rendering: optimizeLegibility;
227:   font-family: var(--font-sans);
228:   font-size: var(--text-body);
229:   color: var(--color-ardesia);
230:   background-color: var(--color-pietra);
231: }
232:
233: img,
234: picture,
235: video,
236: canvas,
237: svg {
238:   display: block;
239:   max-width: 100%;
240: }
241:
242: input,
243: button,
244: textarea,
245: select {
246:   font: inherit;
247:   color: inherit;
248: }
249:
250: button {
251:   background: none;
252:   border: none;
253:   cursor: pointer;
254:   touch-action: manipulation;
255: }
256:
257: a {
258:   color: inherit;
259:   text-decoration: none;
260:   touch-action: manipulation;
261: }
262:
263: /* Global touch-action parity (MOTION_SPEC.md §5.11).
264:    Carousel tracks explicitly override this with touch-action: pan-y. */
265: [role="button"],
266: [role="link"],
267: [role="tab"],
268: input,
269: textarea,
270: select {
271:   touch-action: manipulation;
272: }
273:
274: p,
275: h1,
276: h2,
277: h3,
278: h4,
279: h5,
280: h6 {
281:   overflow-wrap: break-word;
282: }
283:
284: #root,
285: #__next {
286:   isolation: isolate;
287: }
288:
289: /* --- Base Element Styles ------------------------------------------------- */
290:
291: h1,
292: h2,
293: h3,
294: h4 {
295:   font-family: var(--font-serif);
296:   font-weight: var(--font-weight-regular);
297:   color: var(--color-carbone);
298:   line-height: var(--leading-h2);
299: }
300:
301: /* --- Accessibility ------------------------------------------------------- */
302:
303: :focus-visible {
304:   outline: var(--focus-outline-width) solid var(--color-blu-notte);
305:   outline-offset: var(--focus-outline-offset);
306: }
307:
308: /* Visually hidden — for skip links, aria-live regions, etc. */
309: .visually-hidden {
310:   position: absolute !important;
311:   width: 1px;
312:   height: 1px;
313:   padding: 0;
314:   margin: -1px;
315:   overflow: hidden;
316:   clip: rect(0, 0, 0, 0);
317:   white-space: nowrap;
318:   border: 0;
319: }
320:
321: /* --- Reduced-Motion Strategy (MOTION_SPEC.md §4) ------------------------- */
322: /* All --motion-duration-* collapse to 0ms, so every CSS transition that
323:    references a token respects the user's preference without per-component
324:    overrides. Component-level Framer animations consume useReducedMotion(). */
325:
326: @media (prefers-reduced-motion: reduce) {
327:   :root {
328:     --motion-duration-instant: 0ms;
329:     --motion-duration-fast: 0ms;
330:     --motion-duration-base: 0ms;
331:     --motion-duration-slow: 0ms;
332:     --motion-duration-cinematic: 0ms;
333:   }
334:
335:   html {
336:     scroll-behavior: auto;
337:   }
338:
339:   *,
340:   *::before,
341:   *::after {
342:     animation-duration: 0ms !important;
343:     animation-iteration-count: 1 !important;
344:     transition-duration: 0ms !important;
345:     scroll-behavior: auto !important;
346:   }
347: }
348:
349: /* --- Mobile Type Scale (DESIGN.md §2) ----------------------------------- */
350:
351: @media (max-width: 767px) {
352:   :root {
353:     --text-display: 40px;
354:     --text-h1: 36px;
355:     --text-h2: 30px;
356:     /* Body stays at 16px — never smaller (prevents iOS auto-zoom) */
357:   }
358: }

(End of file - total 358 lines)
</content>
```

**Tool: read**

**Input:**

```json
{
  "filePath": "/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/ui/Button.module.css"
}
```

**Output:**

```
<path>/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/ui/Button.module.css</path>
<type>file</type>
<content>
1: /* Button — DESIGN.md §9.01, §9.02. Pill shape; ghost fills Blu Notte on
2:    hover, filled darkens 10%. Focus ring comes from :focus-visible in
3:    globals.css. Transitions read motion tokens (reduced-motion safe). */
4:
5: .button {
6:   display: inline-flex;
7:   align-items: center;
8:   justify-content: center;
9:   gap: var(--space-xs);
10:   min-block-size: 56px; /* touch target — DESIGN.md §8.6 */
11:   padding-inline: var(--space-lg);
12:   border-radius: 100px;
13:   font-family: var(--font-sans);
14:   font-size: var(--text-caption);
15:   font-weight: var(--font-weight-medium);
16:   letter-spacing: var(--tracking-label);
17:   text-transform: uppercase;
18:   transition:
19:     background-color var(--motion-duration-fast) var(--motion-ease-standard),
20:     color var(--motion-duration-fast) var(--motion-ease-standard),
21:     border-color var(--motion-duration-fast) var(--motion-ease-standard),
22:     transform 160ms var(--motion-ease-out);
23: }
24:
25: .button:disabled {
26:   opacity: 0.5;
27:   cursor: not-allowed;
28: }
29:
30: .button:active:not(:disabled) {
31:   transform: scale(0.97);
32:   transition-duration: 100ms;
33: }
34:
35: .ghost {
36:   border: 1px solid var(--color-blu-notte);
37:   color: var(--color-blu-notte);
38:   background-color: transparent;
39: }
40:
41: @media (hover: hover) and (pointer: fine) {
42:   .ghost:hover:not(:disabled) {
43:     background-color: var(--color-blu-notte);
44:     color: var(--color-gesso);
45:   }
46: }
47:
48: .ghost-light {
49:   border: 1px solid var(--color-gesso);
50:   color: var(--color-gesso);
51:   background-color: transparent;
52: }
53:
54: @media (hover: hover) and (pointer: fine) {
55:   .ghost-light:hover:not(:disabled) {
56:     background-color: var(--color-gesso);
57:     color: var(--color-carbone);
58:   }
59: }
60:
61: .filled {
62:   border: 1px solid var(--color-blu-notte);
63:   background-color: var(--color-blu-notte);
64:   color: var(--color-gesso);
65: }
66:
67: @media (hover: hover) and (pointer: fine) {
68:   .filled:hover:not(:disabled) {
69:     background-color: color-mix(in srgb, var(--color-blu-notte) 90%, black);
70:     border-color: color-mix(in srgb, var(--color-blu-notte) 90%, black);
71:   }
72: }
73:
74: .whatsapp {
75:   border: 1px solid var(--color-whatsapp);
76:   background-color: var(--color-whatsapp);
77:   color: var(--color-gesso);
78: }
79:
80: @media (hover: hover) and (pointer: fine) {
81:   .whatsapp:hover:not(:disabled) {
82:     background-color: color-mix(in srgb, var(--color-whatsapp) 90%, black);
83:     border-color: color-mix(in srgb, var(--color-whatsapp) 90%, black);
84:   }
85: }

(End of file - total 85 lines)
</content>
```

**Tool: read**

**Input:**

```json
{
  "filePath": "/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/layout/Section.module.css"
}
```

**Output:**

```
<path>/Users/akshaymsingh/Documents/Liberate/Imperium/src/components/layout/Section.module.css</path>
<type>file</type>
<content>
1: /* Section wrapper — max-width, responsive margins, vertical rhythm
2:    (DESIGN.md §4: grid margins 24/40/80/120, whitespace over dividers). */
3:
4: .section {
5:   padding-block: var(--section-padding-y);
6: }
7:
8: .dense {
9:   padding-block: var(--subsection-padding-y);
10: }
11:
12: .pietra {
13:   background-color: var(--color-pietra);
14: }
15:
16: .gesso {
17:   background-color: var(--color-gesso);
18: }
19:
20: .carbone {
21:   background-color: var(--color-carbone);
22:   color: var(--color-gesso);
23: }
24:
25: .inner {
26:   max-inline-size: var(--max-content-width);
27:   margin-inline: auto;
28:   padding-inline: var(--grid-margin-mobile);
29: }
30:
31: @media (min-width: 768px) {
32:   .inner {
33:     padding-inline: var(--grid-margin-tablet);
34:   }
35: }
36:
37: @media (min-width: 1024px) {
38:   .inner {
39:     padding-inline: var(--grid-margin-desktop);
40:   }
41: }
42:
43: @media (min-width: 1440px) {
44:   .inner {
45:     padding-inline: var(--grid-margin-desktop-xl);
46:   }
47: }

(End of file - total 47 lines)
</content>
```

---

## Assistant (Build · Kimi K3 (2x usage) · 178.6s)

_Thinking:_

All verified — the research matches the source exactly. Now I'll write the three files:

1. `/DESIGN.md` — the main document
2. `/MOTION_SPEC.md` — redirect stub
3. Update `/AGENTS.md` — add pointer

Let me set up a todo list and then write DESIGN.md. This is the big one. I'll write it carefully, using all the exact values from research.

Key constraint from user: "ensure that the classifications do not exceed the necessary amount of sub-categories" — keep taxonomy tight: 7 text element types + 8 UI element types = 15 total. That's my plan.

Let me draft DESIGN.md now. I'll write it in one `write` call. Structure:

```
# IMPERIUM — Design System
Header block: purpose, audience, how to use, sources of truth, doc conventions

§1 Design Philosophy & Theme
§2 Typography
§3 Colour
§4 Layout & Grid
§5 Interaction States
§6 Spacing, Surfaces & Elevation
§7 Motion & Animation
§8 Responsive Behaviour & Touch Targets
§9 Component Specifications
  §9.01 Navigation
  §9.02 Hero
  §9.03 StatsStrip
  §9.04 Collections
  §9.05 WhyImperium
  §9.06 Founder
  §9.07 Testimonials
  §9.08 Contact
  §9.09 Footer
  §9.10 Shared primitives (Button, TextLink, Eyebrow, SectionHeader, FabricCard, StatBlock, PullQuote, FormField, WhatsAppButton, motion components)

Hmm wait — code refs cite §9.01 Navigation (nav data, Button, Navigation.module.css), §9.02 Hero (Button.module.css says "§9.01, §9.02 specify the variants"), §9.03 StatsStrip, §9.04 Collections/FabricCard, §9.05 WhyImperium, §9.06 Founder/PullQuote, §9.07 Testimonials, §9.08 Contact/FormField/WhatsAppButton inline, §9.09 Footer. So primitives used by sections are spec'd within those sections (Button in 9.01/9.02, FabricCard in 9.04, PullQuote in 9.06, FormField in 9.08). I'll follow that: Button spec under §9.01 (it's cited there), but Button is also used in Hero (ghost-light, §9.02). I'll put the full Button spec in §9.01 and reference from §9.02. Actually cleaner: keep §9.01–§9.09 for page sections exactly as the refs imply, and add §9.10 "Shared UI primitives" for cross-cutting components (Button, TextLink, Eyebrow, SectionHeader, StatBlock, FormField, WhatsAppButton, motion wrappers). But FabricCard → §9.04 (only used there), PullQuote → §9.06 (only used there). Both are also fine in §9.10... The code comments say FabricCard is §9.04 and PullQuote §9.06, so I'll spec them inside those section entries. Button is cited as §9.01+§9.02 — I'll spec Button fully in §9.01 (nav CTA context... hmm, actually Button the component isn't the nav CTA; nav CTA is its own mini pill. Button ghost/filled variants are spec'd §9.01/9.02 per the comment).

Simplest defensible mapping:
- §9.01 Navigation — header bar, states, desktop links, nav CTA pill, lang toggle, hamburger, mobile overlay + the canonical Button spec (since Button.module.css cites §9.01)
- §9.02 Hero — silk canvas, wordmark, eyebrow, tagline, CTA group (ghost-light Button + text link), scroll indicator
- §9.03 StatsStrip — StatBlock, dividers, CountUp
- §9.04 Collections — pinned showcase, FabricCard, progress bar
- §9.05 WhyImperium — numbered rows, 5/7 grid
- §9.06 Founder — portrait/bio/PullQuote/certification
- §9.07 Testimonials — quote column
- §9.08 Contact — details, form card, FormField, submit flow, WhatsApp inline
- §9.09 Footer — dark band, three rows
- §9.10 Shared primitives — Eyebrow, SectionHeader, TextLink, WhatsAppButton (inline + fixed), motion wrappers (ScrollReveal, TiltCard, MagneticButton, CountUp, AnimatedFocusRing, ValidationMorph)

§10 Element-Type Taxonomy (master tables)
§11 Governance
```

Word on the doc header: mention that MOTION_SPEC.md redirects here, that this file is the source of truth referenced by code comments, and conventions (token + value + source file; logical properties; desktop-first values with mobile noted).

Now let me carefully compile all the content. I'll be thorough but use tables heavily. Let me write it.

Some care on facts:

- Breakpoints: 768/1024/1440; mobile-first min-width; max-width:767px for mobile-only.
- Nav: fixed, transparent → pietra at scrollY>100, sabbia-30% border, on-dark state under hero.
- Hero entrance: delays 700/950/1250/1500, scroll pulse at 2600ms, 2s ×3 iterations.
- Collections: mobile scroll-snap row; ≥1024 + no-preference reduced motion → pinned sticky horizontal translate; progress bar oro-antico.
- CountUp: RAF, 1200ms, ease 1-exp(-8t), en-AE format.
- TiltCard: ±4° X, ±8° Y, perspective 1200px, image 1.05 scale, press 0.98, shadows two states.
- MagneticButton: ±8px, 100px radius, firm spring.
- FormField: floating label y-16 scale 0.75 soft spring; focus ring layoutId morph; error pulse keyframe.
- ValidationMorph: error y8 0.2s in / y-8 0.15s out; check 0.6s draw ease [0.65,0,0.35,1].
- Contact: success bounce [1,1.03,1] snap; crossfade 0.3s; loading sweep 1.2s linear infinite; vibrate(8).
- Silk: WebGL2 gate + reduced motion + slow connection; DPR 1.0/1.25/1.5; displacement FBO 128/256/512; uRadius 0.06, damping 0.94; time ×0.15; colors base (0.38,0.29,0.17), highlight (0.82,0.70,0.48), sheen (0.58,0.48,0.32); vignette 0.22.

For the shader palette in §3, I can convert vec3 to approximate hex for readability: base (0.38,0.29,0.17) → 0.38*255=97, 0.29*255=74, 0.17*255=43 → #614A2B. Highlight (0.82,0.70,0.48) → 209,178,122 → #D1B27A (0.70*255=178.5→179 → #D1B37A; let me compute: 0.82*255=209.1→D1; 0.70*255=178.5→B3 (179=B3); 0.48*255=122.4→7A (122). So #D1B37A). Sheen (0.58,0.48,0.32) → 147.9→94 (148), 122.4→7A, 81.6→52 (82) → #947A52. I'll present both vec3 and approx hex.

Also the still tint {r:100,g:78,b:48} → #644E30.

Element-type taxonomy — final list (15 types):

TEXT TYPES (7):

- T1 Display
- T2 Heading (variants: h2 section headline, h3 sub-headline scale)
- T3 Sub-heading (variants: standard 21px/500, editorial italic 28px/500)
- T4 Eyebrow (color variants: sabbia / oro-antico / white-70)
- T5 Body (variants: base 16, large 18)
- T6 Quote (variants: feature 36/28, standard 24)
- T7 Caption (variants: standard 13, micro 11)

Wait — is "Sub-heading" the right name for 21px item headings and 28px italic card titles? The user's example said "sub-heading 2". I'll name types plainly: Display, Heading, Sub-heading, Eyebrow, Body, Quote, Caption. And UI types: Nav Item, Button, Text Link, Form Field, Stat, Surface, Divider, Media.

Hmm, should nav items be a text type or UI type? They're UI elements with states. UI type. Good.

One more check — the user example: "If the nav bar items are to be categorised as sub-heading 2, what font, color and animation style it follows so all future subheading 2's can be the exact same style." So the taxonomy table must give: type name → full style spec → so future instances match. My §10 does exactly that. I'll also add a "How to use this taxonomy" note: when adding any element, first check if it fits an existing type; if yes, apply that type's spec verbatim; if not, propose a new type via §11 governance (do not create ad-hoc styles).

UI TYPES (8):

- U1 Nav Item (desktop link; mobile overlay link; nav CTA pill; language toggle as sub-variants — these are genuinely different styles but all "nav items"... hmm. Desktop link vs mobile overlay link (32px serif) are quite different. But they're the same _role_ at different breakpoints. I'll treat Nav Item as one type with two responsive variants + note nav CTA and lang toggle as related but distinct: nav CTA = Button-type mini variant; lang toggle = Caption-ish utility. To avoid over-categorizing: Nav Item (desktop/mobile variants). Nav CTA: classify under Button (mini pill variant). Lang toggle: Caption micro variant with interactive states. OK.
- U2 Button (pill; variants ghost/ghost-light/filled/whatsapp; mini variant = nav CTA)
- U3 Text Link (underline draw; default blu-notte; on-dark white; card 14px)
- U4 Form Field (label, input, select, textarea, error, focus ring)
- U5 Stat (number + label + CountUp)
- U6 Surface (section bands pietra/gesso/carbone; card gesso+hairline)
- U7 Divider (hairline sabbia tints)
- U8 Media (aspect ratios, placeholder, treatments)

Total: 15 types (7 text + 8 UI). Tight, covers everything on the site.

Where do these get spec'd fully? §10 has the master table. To avoid duplicating full specs in both §9 and §10: §9 describes each component's structure/behavior and references type names; §10 holds the canonical per-type style table. Some duplication is inevitable but I'll keep §9 pointing at §10 for typography.

Actually, for usability by agents, the §10 table must be self-sufficient: for each type — family, size (d/m), weight, style, leading, tracking, transform, color per state, motion, source files. I'll make each type a compact sub-block with a table. 15 blocks. Fine.

Let me now also decide the "classification" approach inside §2/§3: in §2 I'll note that every text element on the site belongs to one of the 7 text types defined in §10. Forward reference.

Length: aiming for comprehensive but tight. Let me write it now.

Also AGENTS.md update — add:

## Design System

- `DESIGN.md` is the single source of truth for all visual design (colour, typography, layout, motion, element types). Read it before creating or modifying any UI; new elements must follow an existing element type (§10) or extend the system per §11.

And MOTION_SPEC.md:

# MOTION_SPEC

The motion specification lives in **[DESIGN.md](./DESIGN.md) §7 — Motion & Animation**. This file exists only to resolve legacy `MOTION_SPEC.md` references in code comments; do not add content here.

Now write DESIGN.md. I need to be very careful with every value. Let me compile the full text.

Details to include per section:

§1 Philosophy:

- Brand: premium Italian textiles for Gulf tailors/designers/hospitality
- Aesthetic: quiet luxury / editorial restraint
- Warm "raw linen" neutral canvas (pietra), pure white surfaces (gesso), one dark immersive champagne-silk hero
- Two-accent discipline: blu-notte (interactive), oro-antico (editorial luxury moments)
- Whitespace over dividers; sharp rectangles; serif/sans dualism (Cormorant = voice/heritage, DM Sans = interface/clarity)
- Motion: justified, physical, interruptible; nothing animates without purpose
- Accessibility & performance as design constraints (reduced motion, touch targets, font loading)

§2 Typography:

- Families table: Cormorant Garamond (400/500/600 normal, 400/500 italic) & DM Sans (400/500), files, preloads, metric overrides, fallback stacks, subsetting
- Scale table (token, desktop, mobile)
- Leading, tracking, weights
- Base element styles (body, h1-h4)
- Rules: headings serif 400; UI sans; uppercase only with tracking; body never <16px; text types in §10
- Note unused: semibold token + SemiBold face, h1/h4 tokens unused

§3 Colour:

- Token tables (primary, accent, functional) with exact usage
- Tint & alpha patterns table
- On-dark text ramp
- Shader palette
- Reserved/dead tokens
- Rules: tokens only, color-mix for tints/hover-darkening, no new hex

§4 Layout:

- Container, margins stepping, breakpoints, section rhythm, grids (12-col, 5/7, 7/5, 3-up), measure caps, band alternation order, z-index

§5 Interaction:

- Global rules: hover gating media query, focus-visible spec, press scale 0.97 @100-160ms, disabled 0.5
- Pattern table: button hover fill/darken, nav link underline scaleX, text link background-size draw, footer opacity, card tagline color, input border
- currentColor underline trick

§6 Spacing/surfaces/elevation:

- Space scale + usage frequency + conventional pairings
- Surfaces: bands, card recipe
- Dividers: hairline recipe + where
- Radius inventory: 100px pills, 50% dot, 0 elsewhere
- Shadows: TiltCard two states (only shadows)
- No blur, no gradients except currentColor underline + shader vignette

§7 Motion:

- Tokens tables
- Springs
- Reveal system + per-section amounts
- Hero choreography table
- Component motions (each with values)
- CSS keyframes inventory
- Reduced-motion policy (9 layers)
- Philosophy rules (from skills): ease-out for entries, <300ms UI, press 100-160ms, never scale(0), transform/opacity only, stagger 30-80ms, hover gating

§8 Responsive & touch:

- Breakpoint table + behavior per component
- Mobile type scale
- Touch targets: 56px primary CTAs/inputs, 48px min (hamburger 56 box, hero link 48), WhatsApp bar 56
- Fixed elements: nav, WhatsApp bar (mobile only), hamburger
- iOS zoom guard

§9 Components: as enumerated. Each with: file, role, structure, layout, typography (type refs), colors, states, motion, responsive, accessibility notes.

§10 Taxonomy: 15 types in two groups with full spec tables + usage rule.

§11 Governance:

- Adding elements checklist
- Token rules (no new hex, no new fonts, use logical properties, hover gating, reduced motion)
- Anomaly register (hardcoded values list with locations — PullQuote 36/28, FabricCard 28 & 14, Testimonials 24/14, Navigation 18/16/12/14, Footer 18, PullQuote padding 80px, Contact instagram 14)
- Dead tokens list
- Doc drift notes (TECHNICAL_ARCHITECTURE.md stale: IridescentSilkHero naming, FBM/thin-film description, DPR 1.75 vs 1.5, "StatBlock × 4" vs 3)
- Update policy: change code → update DESIGN.md in same PR

Alright, writing now. This will be a long file; I'll write it in one go with `write`. Let me be precise.

One thing: the doc should note values are "desktop / mobile" where applicable. Also mark the element type codes (T1–T7, U1–U8)? Using short codes makes referencing easy for agents. I'll use names primarily with codes as shorthand. Keep it simple: bold names, no codes... Actually codes help "categorise" crispness. I'll include codes like **T4 · Eyebrow**. Fine.

Let me write the file. I'll aim for precision and compact tables. Also include file paths for every component (source column).

Regarding "sources" citations: use paths relative to repo root, e.g. `src/components/ui/Button.module.css`.

Writing now — this is a big content generation. Be careful with markdown tables.

All values verified against source. Now creating the three files.

**Tool: todowrite**

**Input:**

```json
{
  "todos": [
    {
      "content": "Create /DESIGN.md — full design system (§1–§11) with element-type taxonomy",
      "status": "in_progress",
      "priority": "high"
    },
    {
      "content": "Create /MOTION_SPEC.md redirect stub",
      "status": "pending",
      "priority": "medium"
    },
    {
      "content": "Add DESIGN.md pointer to project AGENTS.md",
      "status": "pending",
      "priority": "medium"
    },
    {
      "content": "Verify: cross-check doc values against source files",
      "status": "pending",
      "priority": "high"
    }
  ]
}
```

**Output:**

```
[
  {
    "content": "Create /DESIGN.md — full design system (§1–§11) with element-type taxonomy",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "content": "Create /MOTION_SPEC.md redirect stub",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Add DESIGN.md pointer to project AGENTS.md",
    "status": "pending",
    "priority": "medium"
  },
  {
    "content": "Verify: cross-check doc values against source files",
    "status": "pending",
    "priority": "high"
  }
]
```

---

## Assistant (Build · Kimi K3 (2x usage) · 375.5s)

**Tool: write**

**Input:**

```json
{}
```

**Error:**

```
Tool execution aborted
```

---

## User

Continue

---

## Assistant (Build · Kimi K3 (2x usage) · 414.5s)

_Thinking:_

The mode has changed to build. I can now write the files. Let me write DESIGN.md — the big comprehensive design system document. I'll write it in one go, being careful with all exact values from my research.

Let me compose the full document now. I have all the data:

**Colors (globals.css:14-31):**

- --color-carbone: #1a1a1a
- --color-pietra: #faf8f3
- --color-gesso: #ffffff
- --color-sabbia: #b8a99a
- --color-ardesia: #4a4540
- --color-blu-notte: #1b2a4a
- --color-oro-antico: #c4a76c
- --color-terracotta: #c47a5a (reserved/unused)
- --color-whatsapp: #25d366
- --color-error: #b83a2e
- --color-success: #2e7d4f (unused)
- --color-hero-gradient: rgba(0,0,0,0.4) (unused)

**Typography:**

- Cormorant Garamond 400/500/600 normal, 400/500 italic; DM Sans 400/500
- --font-serif, --font-sans with fallback stacks
- Scale: 11/13/16/18/21/24/32/42/56/72; mobile: display 40, h1 36, h2 30
- Leading: body 1.7, subheadline 1.5, h4 1.35, h3 1.3, h2 1.2, h1 1.1, display 1.05
- Tracking: eyebrow 0.15em, caption 0.02em, nav 0.05em, label 0.05em
- Weights: 400/500/600

**Spacing:** 4/8/16/24/40/64/96/160; section clamp(80,10vw,160); subsection clamp(48,6vw,96); element clamp(24,3vw,40)

**Layout:** 1200 max; nav 72/56; whatsapp bar 56; grid 12 cols, gutters 32/24/20/16, margins 120/80/40/24; bp 768/1024/1440

**Motion:** 150/250/400/800/1200ms; easings expo-out (0.16,1,0.3,1), in-out (0.65,0,0.35,1), standard (0.25,0.1,0.25,1); distances 4/8/16/24/48; focus 2px/2px

**Z-index:** base 1, whatsapp 90, nav 100, overlay 200

**Springs:** soft 200/22, standard 150/18, firm 260/26, snap 400/30

**Reveals:** sectionReveal (y24, 0.8s, stagger 0.08), childReveal (y16, 0.6s, unused)

All component details from the research. Now writing the file. It'll be long — that's expected and appropriate.

Element taxonomy (15 types):
Text: T1 Display, T2 Heading, T3 Sub-heading, T4 Eyebrow, T5 Body, T6 Quote, T7 Caption
UI: U1 Nav Item, U2 Button, U3 Text Link, U4 Form Field, U5 Stat, U6 Surface, U7 Divider, U8 Media

Write now.

Now writing the main design system document.

**Tool: write**

**Input:**

```json
{}
```

**Error:**

```
Tool execution aborted
```

---

## User

Continue

---

## Assistant (Build · Kimi K3 (2x usage) · 90.8s)

_Thinking:_

Now I'm in build mode. Let me write the DESIGN.md file. I'll write it in full now.

**Tool: write**

**Input:**

```json
{}
```

**Error:**

```
Tool execution aborted
```

---

## User

Continue

---

## Assistant (Build · Grok 4.5 · 1.4s)

---

## User

continue

---

## Assistant (Build · Grok 4.5 · 164.6s)

_Thinking:_

The user wants me to continue executing. Let me write the DESIGN.md file now.

Writing the design system files now.

---

# Imperium Italian Textile — Design System

**Version 1.0 · June 2026**
**Prepared for Sofia Mazza**

---

## 1. Visual Design Philosophy

### The Guiding Principle: Restraint as Luxury

Imperium does not need to announce itself as luxury. The website must *feel* expensive the way a hand-finished lapel feels expensive — through quality of material, precision of execution, and the confidence to leave space empty.

Every design decision traces back to three commitments:

1. **Materiality over decoration.** Let the fabric speak. Photography and texture carry the emotional weight; the interface stays silent around them.
2. **Italian editorial tradition.** The layout language draws from *Domus*, *Abitare*, and the Milanese publishing houses — not from Silicon Valley landing pages. Asymmetric compositions. Decisive type. Generous margins.
3. **Respect for the client's intelligence.** The audience — Savile Row-grade tailors and five-star hospitality directors — does not need persuasion through visual tricks. They need evidence of taste.

### What This Is Not

This is not a SaaS conversion funnel. There are no floating badges, no countdown timers, no "trusted by 10,000+" social proof banners. The website is closer in spirit to:

- The editorial voice of *Loro Piana*
- The spatial restraint of *Aesop*
- The cinematic confidence of *Effe Hospitality*
- The typographic authority of *Zegna*

The underlying message is always the same: *we have nothing to prove, and everything to show.*

---

## 2. Typography

### System Overview

Typography is the skeleton of this brand. It must carry both Italian warmth and institutional authority. We use a strict two-typeface system — no third font, no exceptions.

| Role | Typeface | Weight(s) | Why |
|---|---|---|---|
| **Display / Headlines** | **Cormorant Garamond** | Regular 400, Medium 500, SemiBold 600 | A refined serif rooted in the Garamond tradition — the typeface of Italian publishing, papal manuscripts, and literary culture. High contrast strokes evoke the hand of a calligrapher. It is unmistakably European without being costume-like. |
| **Body / UI / Navigation** | **DM Sans** | Regular 400, Medium 500 | A geometric sans-serif with humanist proportions. Clean enough for functional text, warm enough to avoid clinical coldness. The slightly rounded terminals give it approachability that Inter or Helvetica lack. |

### Why Not Playfair Display (as the PRD Suggests)

The PRD recommends Playfair Display or Georgia. I respectfully challenge this:

- **Playfair Display** is dramatically overused in wedding invitations, boutique bakeries, and "luxury" WordPress themes. It has become visual shorthand for *aspirational* luxury rather than *actual* luxury. For a brand positioning itself against Dubai's most discerning clients, Playfair would read as derivative.
- **Georgia** is a system font designed for screen legibility at small sizes. It has no personality at display scale. It says "2004 blog" more than "Italian atelier."
- **Cormorant Garamond** occupies a rarer position: it has the historical authority of Garamond (the typeface of the Italian Renaissance), the display elegance of Didot, and is specifically designed for large-format use. It also has excellent italic forms — critical for a brand that uses Italian terminology.

### Type Scale

All sizes use a modular scale with ratio 1.333 (perfect fourth). This produces intervals that feel musical rather than mechanical.

```
Eyebrow / Label:     11px  ·  DM Sans 500  ·  tracking +0.15em  ·  uppercase
Caption:             13px  ·  DM Sans 400  ·  tracking +0.02em
Body:                16px  ·  DM Sans 400  ·  line-height 1.7
Body Large:          18px  ·  DM Sans 400  ·  line-height 1.7
Subheadline:         21px  ·  Cormorant 400 italic  ·  line-height 1.5
H4:                  24px  ·  Cormorant 500  ·  line-height 1.35
H3:                  32px  ·  Cormorant 500  ·  line-height 1.3
H2:                  42px  ·  Cormorant 400  ·  line-height 1.2
H1:                  56px  ·  Cormorant 400  ·  line-height 1.1
Display:             72px  ·  Cormorant 400  ·  line-height 1.05
```

**Mobile reductions:** Display → 40px, H1 → 36px, H2 → 30px. Body stays at 16px — never smaller.

### Typographic Rules

- **Headlines never bold.** Cormorant at regular or medium weight carries enough authority. Bold would make it shout; this brand whispers.
- **Eyebrow labels always uppercase, always tracked wide.** This is the editorial convention borrowed from Italian magazines. It signals a category without competing with the headline.
- **Italian terms set in italic.** *Tessuti Italiani*, *Pezzi Unici*, *Ospitalità di Lusso* — the italic form gives them linguistic distinction and typographic elegance. They should feel like a natural code-switch, not a marketing device.
- **Pull quotes use Cormorant italic at H2 scale.** Centred, with generous vertical padding. No quotation mark ornaments — let the text breathe.

---

## 3. Colour Palette

### Philosophy: Drawn from the Materials

The palette is not chosen from a colour wheel. It is extracted from the world the brand inhabits: unbleached linen, raw silk, Tuscan stone, midnight wool, and old gold thread.

### Primary Palette

| Swatch | Name | Hex | Usage |
|---|---|---|---|
| ◼ | **Carbone** | `#1A1A1A` | Primary text, navigation, strong headlines |
| ◻ | **Pietra** | `#FAF8F3` | Page background — the colour of raw Italian linen paper |
| ◻ | **Gesso** | `#FFFFFF` | Cards, overlays, form fields |
| ◻ | **Sabbia** | `#B8A99A` | Eyebrow text, secondary labels, dividers |
| ◼ | **Ardesia** | `#4A4540` | Body text — softer than pure black, easier on the eye |

### Accent Palette

| Swatch | Name | Hex | Usage |
|---|---|---|---|
| ◼ | **Blu Notte** | `#1B2A4A` | CTA borders, nav active state, brand signature moments |
| ◻ | **Oro Antico** | `#C4A76C` | Founder's quote, "Est. 2026" marker, hover accents |
| ◻ | **Terracotta** | `#C47A5A` | Reserved — only for error states and the map origin pin |

### Usage Rules

- **No coloured backgrounds for sections.** Every section lives on Pietra or Gesso. Color enters through photography, fabric texture, and the gold accent. Coloured section backgrounds are a SaaS convention — they segment the page into "features" and destroy editorial flow.
- **Blu Notte is the confidence colour.** It appears on primary CTAs, the navigation wordmark, and any moment where the brand asserts authority.
- **Oro Antico is rare.** It appears on the founder's quote attribution, the "Est. 2026" eyebrow, and link hover states. If gold is everywhere, it becomes brass.
- **Text is never pure black.** `#1A1A1A` (Carbone) for headlines. `#4A4540` (Ardesia) for body. This 90% darkness against the warm linen background produces comfortable contrast without the harshness of `#000000` on `#FFFFFF`.

### Dark Mode

Not recommended for launch. The brand identity is rooted in the warmth of linen-white. A dark mode can be considered for V2 if analytics show significant late-night browsing, but it must be designed from scratch — not auto-inverted.

---

## 4. Layout System

### Grid

A 12-column grid with the following breakpoint parameters:

| Breakpoint | Width | Columns | Gutter | Margin |
|---|---|---|---|---|
| **Desktop XL** | ≥ 1440px | 12 | 32px | 120px |
| **Desktop** | 1024–1439px | 12 | 24px | 80px |
| **Tablet** | 768–1023px | 8 | 20px | 40px |
| **Mobile** | < 768px | 4 | 16px | 24px |

**Max content width: 1200px, centred.** This is deliberate. Luxury brands do not stretch content edge-to-edge on ultrawide monitors. The 120px margins on desktop create the breathing room that signals confidence.

### Layout Principles

**1. Asymmetry over symmetry.**
Centred layouts feel static and expected. The most powerful sections use a 5/7 or 7/5 column split: image occupying the larger share, text aligned to a narrower column. This is how Italian editorial magazines compose their feature spreads — the image leads, the text follows.

**2. Vertical rhythm through whitespace, not through rules.**
No horizontal divider lines between sections. Sections are separated by vertical padding alone:
- Between major sections: `clamp(80px, 10vw, 160px)`
- Between subsections: `clamp(48px, 6vw, 96px)`
- Between elements within a section: `24px–40px`

**3. Content density decreases as importance increases.**
The hero section has the lowest density: one headline, one subline, one CTA, one video — and 100vh of space. The contact form, by contrast, can be denser — by the time a visitor reaches it, they are committed and want efficiency.

**4. The fold is a threshold, not a boundary.**
The hero section should give a *hint* of what comes next — either through a half-visible eyebrow label or the upper edge of the next section's image. This rewards scrolling without demanding it.

---

## 5. Motion Principles

### Philosophy: Movement That Reveals, Never Performs

Motion on this site serves one purpose: to make the user feel that content is *arriving* — unfurling, surfacing, appearing as if it was always there and they've simply reached it. It should feel like pulling back a curtain, not like watching a showreel.

### Core Animations

| Trigger | Element | Animation | Duration | Easing |
|---|---|---|---|---|
| **Scroll enter** | Headlines | Translate Y +24px → 0, opacity 0 → 1 | 800ms | `cubic-bezier(0.25, 0.1, 0.25, 1)` |
| **Scroll enter** | Body text | Translate Y +16px → 0, opacity 0 → 1 | 600ms | Same, 100ms delay after headline |
| **Scroll enter** | Images | Opacity 0 → 1 with subtle scale 1.02 → 1 | 1000ms | `ease-out` |
| **Scroll enter** | Stat numbers | Count up from 0, no bounce | 1200ms | `ease-in-out` |
| **Hover** | CTA buttons | Border colour Carbone → Blu Notte, smooth | 300ms | `ease` |
| **Hover** | Text links | Underline width 0% → 100%, left to right | 300ms | `ease` |
| **Hover** | Fabric cards | Image scale 1.0 → 1.03 within masked container | 600ms | `ease-out` |
| **Page load** | Navigation | Opacity 0 → 1, translate Y -8px → 0 | 500ms | `ease-out`, 200ms delay |
| **Page load** | Hero headline | Translate Y +32px → 0, opacity 0 → 1 | 1000ms | `cubic-bezier(0.16, 1, 0.3, 1)` |

### Rules

- **No parallax scrolling.** Parallax creates visual complexity that fights with the photography. The fabrics are the texture; the interface is flat.
- **No staggered card animations.** Cards should enter together, not in a cascade. Staggered entry feels like a tech demo.
- **No spring physics or bounce.** Bounce is playful. This brand is poised.
- **Every animation triggers once.** When an element has entered the viewport and played its animation, it stays. No re-triggering on scroll-up. The reveal is a one-time event.
- **Respect `prefers-reduced-motion`.** All motion must be wrapped in a media query. When reduced motion is preferred, elements simply appear — no translate, no delay.

---

## 6. Image Style Guidelines

### Photography Direction

The images carry the brand. They are not decorative — they are the primary evidence of quality.

**Subject Matter (in order of priority):**

1. **Close-up fabric textures** — macro shots that show weave, thread, and drape. Natural light. No post-processing colour grading that makes fabric look unnatural. The viewer should almost feel the texture through the screen.
2. **Italian mill interiors** — sun-lit workshops, wooden looms, rolls of fabric stacked on stone shelves. These should feel like stolen moments from a quiet studio, not staged factory tours.
3. **Artisan hands at work** — inspecting fabric, cutting, folding. Hands tell the story of craft more honestly than faces or logos.
4. **Landscape context** — Italian countryside, flax fields, stone architecture. Used sparingly, primarily in the origin map section and the about page.
5. **Sofia Mazza portrait** — warm light, natural setting. With fabric or in an Italian context. Professional but not corporate — more *portrait in a magazine profile* than *LinkedIn headshot*.

### Image Treatment

- **Colour temperature: warm.** All images lean warm. No blue-cool grading, no desaturation. The warmth should match the Pietra background.
- **Aspect ratios are deliberate:**
  - Hero video: 16:9, full-width
  - Fabric cards: 4:5 (portrait) — this is the aspect ratio of fabric swatches and editorial fashion photography
  - About section portrait: 3:4
  - Detail textures (inline): 3:2 (landscape)
- **No rounded corners on images.** Rounded corners are a UI convention from apps. Editorial images have sharp edges. The only exception: Sofia's portrait may use a very subtle `border-radius: 4px` — no more.
- **No image borders, shadows, or frames.** The image meets the page directly. Shadows and borders add visual noise that competes with the photograph.
- **All images served in WebP/AVIF** with a JPEG fallback. Quality: 80–85% for photographs, 90% for fabric close-ups where texture fidelity matters.

---

## 7. Video Style Guidelines

### Hero Video

The hero video is the single most important creative asset on the site. It sets the emotional tone before a word is read.

**Specifications:**
- **Duration:** 15–20 seconds, seamlessly looped
- **Audio:** None. Autoplay muted. No audio controls visible.
- **Colour grade:** Warm, desaturated slightly — not cinematic colour grading, but natural daylight with a warm shift. Think *golden hour in Tuscany*, not *Hollywood colour science*.
- **Content:** One continuous shot or 3–4 slow cuts. Suggested subjects:
  - Linen being woven on a traditional loom
  - An artisan's hands inspecting fabric against natural light
  - A sun-lit Italian mill interior with dust motes in the air
  - Bolts of fabric being unfurled on a stone table
- **Pacing:** Slow. Every shot holds for at least 4–5 seconds. No quick cuts. The tempo communicates patience, precision, and care.
- **Overlay:** A subtle dark gradient from the bottom (max 40% opacity) to ensure headline legibility. The gradient must not be visible as a gradient — it should feel like natural shadow.

**Technical:**
- **Format:** MP4 (H.264) for broad compatibility, with a poster frame JPEG for pre-load
- **Resolution:** 1920×1080 for desktop, 720×1280 (9:16) alternate cut for mobile
- **File size target:** Under 8MB for the desktop cut. Use two-pass encoding.
- **Loading:** The video should load lazily. Show the poster frame immediately; begin video playback only when the hero section is in viewport.

### Video Caption Overlay

As per the PRD: "Italia · 2026" — 11px, DM Sans 400, white at 60% opacity, bottom-right corner with 24px padding. This is not a watermark; it is a provenance stamp.

---

## 8. Mobile Design Principles

### Philosophy: The Same Brand, Not a Smaller Screen

Mobile is not a degraded desktop experience. In the Dubai market, many initial contact points happen on mobile via WhatsApp links shared between professionals. The mobile experience must feel equally considered.

### Key Mobile Decisions

**1. Navigation collapses to a clean full-screen overlay.**
Not a hamburger that slides a panel from the right. A full-screen overlay in Pietra with navigation links set in Cormorant at 32px, stacked vertically, centred. The WhatsApp CTA sits at the bottom of the overlay — always visible, always accessible.

**2. The hero video switches to a vertical crop.**
Serving a separate 9:16 cut rather than letterboxing the 16:9 desktop video. This fills the mobile viewport with texture and avoids the black-bar problem. If a vertical cut is unavailable, use a high-quality still image as the poster frame and skip autoplay video entirely — a poorly cropped video is worse than no video.

**3. Typography reduces proportionally, but never below 16px body.**
Inputs are 16px minimum to prevent iOS auto-zoom. Display headlines drop to 40px — still commanding but contained within the mobile viewport.

**4. The WhatsApp button is fixed at the bottom of the screen on mobile.**
A slim, 56px-tall bar with "Chat on WhatsApp →" in DM Sans 500, Gesso background, subtle top border in Sabbia. Always visible. This is the single most important conversion action in the Dubai B2B market and it must be omnipresent on mobile.

**5. Horizontal scrolling is used for fabric cards on mobile.**
Rather than stacking three cards vertically (which creates a long scroll and dilutes each card's impact), the three collection cards scroll horizontally with snap points. Each card occupies 85vw with 16px gaps.

**6. Touch targets are generous.**
Minimum 48×48px for all interactive elements. CTAs have minimum 56px height. Form inputs have 56px height with 16px interior padding.

---

## 9. Section-by-Section Visual Direction

### 01 — Navigation

**Desktop:**
- Fixed at top, transparent initially, transitioning to `Pietra` background with a subtle bottom border (`Sabbia` at 30% opacity) on scroll.
- Left: Wordmark "Imperium Italian Textile" in Cormorant 500, 18px, Carbone. Below it in a separate line: "Est. 2026" in DM Sans 400, 9px, Sabbia, uppercase, tracked wide.
- Centre: Nav links in DM Sans 400, 13px, Ardesia. Tracking +0.05em, uppercase. Hover: Carbone with underline animation.
- Right: "Request Samples →" ghost button — 1px Blu Notte border, Blu Notte text, DM Sans 500, 13px, pill shape (border-radius 100px). Hover: fill with Blu Notte, text goes Gesso.
- Far right: "EN · AR" language toggle in DM Sans 400, 12px, Sabbia.
- Nav height: 72px desktop, 56px mobile.

**Why this approach:** The transparent-to-opaque transition lets the hero video breathe beneath the navigation on first load. The wordmark is in serif because it is a name, not a UI element. The nav links are in sans-serif because they are functional. This contrast reinforces the hierarchy.

**Amended:** Retired — no establishment year appears anywhere on the site (client decision).

### 02 — Hero Section

**Structure:** Full viewport height (100vh). The video fills the entire section as a background. Content is centred vertically and horizontally.

**Content stack (top to bottom, centred):**
1. Eyebrow: "Made in Italy · Est. 2026" — 11px, DM Sans 500, white, uppercase, tracked +0.15em, 60% opacity
2. Headline: "Where Italian craft / meets the world." — 72px desktop / 40px mobile, Cormorant 400, white, line-height 1.05. The line break is intentional — "meets the world" sits on its own line for emphasis.
3. Subline: "Premium Italian fabrics — sourced from the finest mills of Italy, delivered to Dubai's most discerning tailors and hospitality groups." — 18px, DM Sans 400, white, 80% opacity, max-width 540px
4. CTA pair: "Explore our fabrics" ghost button (white border, white text) + "Request a sample →" text link below (white, underline on hover)

**Video caption:** "Italia · 2026" bottom-right corner as previously specified.

**The bottom 80px of the viewport shows a faint scroll indicator:** a thin vertical line (1px, white, 40% opacity) with a slow downward pulse animation (2s, infinite). No text label — the line alone communicates.

**Why this works:** The hero is a full-screen film still with words on it. It doesn't sell; it establishes atmosphere. The visitor's first impression is texture, light, and craft — the message arrives second, through the headline. This is how luxury hospitality brands (including Effe) open their story.

**PRD Challenge:** The PRD suggests the headline at 36–48px. This is too timid for a full-viewport hero. At 48px on a 1440px-wide screen, the headline would look lost in the space. 72px fills the frame with the confidence the brand requires. It can be reduced on tablet (56px) and mobile (40px) without losing impact.

**Amended:** V1 hero is logo-led (wordmark inside the h1 + tagline beneath); eyebrow reads "Made in Italy" with no year; the corner caption is retired.

### 03 — Origin Map Section

**Layout:** Two zones. Left (7 columns): the illustrated map. Right (5 columns): text content.

**Map:**
- A custom illustrated map — not a Google Maps embed, not a stock vector. A minimal, hand-drawn-feeling line illustration of Italy at centre, with delicate route lines extending to Dubai, Riyadh, London, and Mumbai.
- Italy rendered in warm tones (Sabbia fill, Ardesia stroke). Route lines in Blu Notte, 1px, with subtle dashed treatment for Mumbai (the "future expansion" market).
- Pin labels in DM Sans 400, 11px, uppercase. Italy's pin is larger and uses Oro Antico fill; the others use Ardesia.
- The map should feel cartographic and artisanal — like something you'd find in a leather-bound Italian atlas. Not a digital infographic.

**Text (right column):**
- Eyebrow: "Our reach"
- Headline: "Born in Italy. / Delivered to the world."
- Subline: Body text from PRD
- Below the text: the stats strip — four values laid out in a horizontal row on desktop, 2×2 grid on mobile. Each stat uses the number in Cormorant 400 at 42px (Carbone) with the label in DM Sans 400 at 13px (Sabbia) beneath.

**Elevation opportunity:** The PRD lists the stats as plain text. I recommend making them a horizontal strip that sits between this section and the next — visually bridging the two sections. Full-width Gesso background with 40px vertical padding, stats centred in four equal columns, separated by 1px vertical lines in Sabbia at 20% opacity. This creates an architectural moment — a plinth between two floors.

### 04 — Products Section (Three Collections)

**Layout:** Three cards in a row. Each card occupies 4 columns. No container — the cards sit directly on the Pietra background.

**Card anatomy (top to bottom):**
1. **Image:** 4:5 portrait ratio. Close-up fabric texture. No border-radius. On hover: image scales to 1.03 within its clipped container.
2. **Tag strip:** "LINEN · SILK · WOOL · COTTON" — 11px, DM Sans 500, Sabbia, uppercase, tracked wide. 16px below image.
3. **Title:** "Tessuti Italiani" — 28px, Cormorant 500 italic. The italic here signals the Italian language.
4. **Body:** Description text — 16px, DM Sans 400, Ardesia. Max 4 lines.
5. **CTA:** "View collection →" — 14px, DM Sans 500, Blu Notte. No button chrome. Underline on hover.

**Section header (above cards):**
- Eyebrow: "Our collections"
- Headline: "Fabric with a story."
- Subline from PRD

**The cards have no visible borders, no shadows, no background.** They are composed purely through spatial proximity and alignment. This is the editorial approach: the grid does the work, not decorative containers.

**Pezzi Unici card enhancement:** This card should feel slightly different — its "RARE · LIMITED · ONE OF A KIND" tag uses Oro Antico instead of Sabbia. This subtle colour shift signals rarity without requiring a badge or sticker.

**Ospitalità di Lusso card enhancement:** The CTA for this card reads "Talk to us about your project →" — it's intentionally longer and more consultative, signalling that hospitality orders are bespoke conversations, not transactions.

**Amended:** four cards; a short promise line replaces the material-tag strip beneath the image.

### 05 — Why Imperium (Trust Pillars)

**Layout:** Full-width Gesso band. Four pillars in a row, each occupying 3 columns.

**Pillar anatomy:**
1. **Number:** "01" — 11px, DM Sans 500, Sabbia, uppercase
2. **Label:** "Direct from the source" — 21px, Cormorant 500
3. **Body:** Paragraph text — 16px, DM Sans 400, Ardesia

**No icons.** Icons would domesticate these pillars into feature boxes. The numbered labels (01, 02, 03, 04) give them editorial authority — like the table of contents of a manifesto.

**PRD Challenge:** The PRD doesn't number the pillars. Adding numbers transforms them from marketing bullet points into principles — an ordered declaration of values. This is how architecture firms and fashion houses present their ethos.

**Separation between pillars:** A 1px vertical line in Sabbia at 15% opacity between each column on desktop. On mobile, they stack vertically with a 1px horizontal line between them.

**Amended:** three alternating 5/7 editorial rows with reserved map/stamp media slots replace the four-column band.

### 06 — About / Founder Section

**Layout:** Asymmetric. Left (5 columns): Sofia's portrait photograph. Right (7 columns): text content.

**Portrait treatment:**
- 3:4 ratio. Warm light. The image should feel like it belongs in a *Financial Times* profile, not a corporate brochure.
- A small caption beneath: "Sofia Mazza, Founder" in DM Sans 400, 11px, Sabbia.

**Text content:**
- Eyebrow: "The story behind Imperium"
- Headline: "A love for Italy, / built into every thread."
- Three paragraphs of the long-form bio from the PRD, set in DM Sans 400, 16px, Ardesia. Line-height 1.7 for readability.

**Pull quote block (after the bio text):**
- A dedicated vertical space: 80px padding above and below.
- Quote text: *"Every fabric I source is one I would stake my name on."* — Cormorant 400 italic, 36px, centred, Carbone.
- Attribution: "— Sofia Mazza, Founder" — DM Sans 500, 11px, Oro Antico, uppercase, tracked wide, centred. 24px below the quote.
- No quotation marks. No decorative rules. The typography and spacing do the work.

**Elevation opportunity:** Below the pull quote, add a small visual element — a photograph of Sofia's Made in Italy certification, presented as a discreet inline image (max-width 200px, centred) with a caption: "Certified Made in Italy Expert" in DM Sans 400, 11px, Sabbia. This turns a verbal claim into visual evidence. The PRD mentions the certification but only as linked text — showing it is far more powerful.

### 07 — Testimonials

**Layout:** A single centred column, max-width 680px.

**Structure:** Two testimonial blocks stacked vertically with 64px between them. Each block:
1. Quote text in Cormorant 400 italic, 24px, Carbone, centred
2. Attribution in DM Sans 400, 14px, Sabbia, centred, 16px below quote

**For launch (placeholders):** Display one real quote if available (Effe Hospitality would be ideal, as the PRD notes). If no testimonials are available at launch, this section should be hidden entirely — placeholder text with "[Name]" would undermine the brand's credibility at a critical moment. Better to launch without this section and add it when genuine testimonials exist.

**PRD Challenge:** The PRD shows two placeholder testimonials with "[Name]" fields. Displaying these live would be actively harmful. A blank "[Hotel group]" reads as "we have no clients yet." I strongly recommend suppressing this section until at least one real testimonial is confirmed.

### 08 — Contact Section

**Layout:** Split. Left (7 columns): text and contact information. Right (5 columns): the sample request form.

**Left side:**
- Eyebrow: "Contact"
- Headline: "Let's talk fabric."
- Subline from PRD
- Location: "Dubai, UAE · Italy" in DM Sans 400, 16px, Ardesia
- Email: `hello@imperiumitaliantextile.com` — DM Sans 400, 16px, Blu Notte, underline on hover
- **WhatsApp CTA (primary action):** A dedicated button — not a ghost button, but a filled button. Background: `#25D366` (WhatsApp green). Text: "Chat on WhatsApp →" in DM Sans 500, white, 14px. Pill shape. 56px height. This is the one moment where a coloured button is justified — WhatsApp green is universally recognised, and in the Dubai B2B market, this button is more important than the email address. The green against the warm palette is intentional contrast: it signals "act now" in a way that brand colours alone cannot.
- Instagram: "Follow our journey → @imperiumitaliantextile" — DM Sans 400, 14px, Sabbia, underline on hover.

**Right side — Form:**
- Background: Gesso
- Padding: 40px
- Subtle border: 1px, Sabbia at 20% opacity
- Fields styled as underline-only inputs (no boxes, no borders, just a bottom line in Sabbia). On focus: bottom line transitions to Blu Notte.
- Field labels in DM Sans 500, 11px, Sabbia, uppercase, tracked wide. Positioned above the input, not as floating labels.
- The dropdown for "Your role" uses a custom-styled select with a small chevron in Sabbia.
- Submit button: Full-width, Blu Notte background, Gesso text, DM Sans 500, 14px, uppercase, tracked. 56px height. Hover: background darkens 10%.
- Form note: "We respond within 24 hours." in DM Sans 400, 13px, Sabbia, below the submit button.

### 09 — Footer

**Layout:** Full-width, Carbone background (the only dark section). Padding: 80px top, 40px bottom.

**Content:**
- Top row: Wordmark "Imperium Italian Textile" in Cormorant 500, 18px, Gesso. Tagline "Premium Italian fabrics · Delivered to Dubai" in DM Sans 400, 13px, Sabbia.
- Middle row: Footer links in DM Sans 400, 13px, Gesso at 70% opacity. Tracking +0.05em, uppercase. Hover: 100% opacity. Links: Fabrics · Pezzi Unici · Hospitality · About · Contact · Privacy Policy.
- Bottom row: Legal line "© 2026 Imperium Italian Textile. All rights reserved." in DM Sans 400, 11px, Sabbia. Same row: Instagram handle and WhatsApp line.

**Why dark footer:** The dark background creates a clear visual full-stop. After scrolling through warm linen tones, the dark footer signals "you've reached the end." It also provides the strongest contrast for contact information and links — the last opportunity to convert.

**Amended:** Legal line carries no year (client decision); legal entity name pending PRD B-1.

---

## 10. Iconography

No custom icon set. This brand does not need icons. Where a directional indicator is required (dropdowns, CTAs), use a simple arrow character (→) set in the body typeface. Where a navigation indicator is needed (mobile menu), use two thin horizontal lines (not three — the classic hamburger is overused and reads as generic).

If icons become necessary in future (e.g., fabric care symbols), they should be custom line-drawn at 1px stroke weight in Ardesia, matching the cartographic style of the origin map.

---

## 11. Interaction Details

### Cursor

Default system cursor. Custom cursors are a distraction in this context and create accessibility issues.

### Scroll Behaviour

`scroll-behavior: smooth` on `html`. Anchor links (e.g., nav → section) should use smooth scrolling with an offset of 80px (nav height + 8px breathing room).

### Focus States

All interactive elements must have visible focus states for keyboard navigation:
- Inputs: bottom border transitions from Sabbia to Blu Notte
- Buttons: 2px outline in Blu Notte with 2px offset
- Links: underline appears
- Focus states must never be suppressed with `outline: none`

### Loading States

The submit button transitions to a loading state: text changes to "Sending..." and a simple horizontal line animation (Gesso, 2px, sweeping left-to-right in a loop) appears beneath the text. No spinners — spinners belong in apps, not in editorial websites.

---

*This document defines the visual language. Every implementation decision should be tested against the question: "Does this feel like a page from an Italian design magazine, or does this feel like a tech product?" If the answer is the latter, reconsider.*

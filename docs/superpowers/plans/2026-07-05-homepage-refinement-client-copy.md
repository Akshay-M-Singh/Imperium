# Homepage Refinement — Client Copy Pass (Edit Job) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the client's 2026-07-04 change request to the **already-built** homepage: remove every "2026" (including runtime-rendered ones), logo-led hero with the tagline beneath, Gulf-instead-of-Dubai positioning, a rebuilt 3-item stats strip led by "40+ Fabrics", four collections with taglines and new CTAs, "Why Imperium" restructured into three alternating rows with map/stamp placeholders, the new founder story, and a visible certification placeholder container.

**Architecture:** This is an **edit job on live components**, not a build job. Every section (Hero, OriginMap, StatsStrip, Collections, TrustPillars, Founder, Contact, Nav, Footer) is fully implemented at `main` HEAD `dadcd1f` with the motion layer (Framer Motion, Embla) wired in. Copy stays in typed `src/data/` files; components render data. CSS Modules + the token system in `globals.css`. The Contact form, WhatsApp buttons, Resend pipeline, and robots/indexing gate are **out of scope — do not touch them**.

**Tech Stack:** Next.js 15.5 · React 19 · TypeScript strict · CSS Modules · Framer Motion 11 + Embla 8 · Vitest 2 + Testing Library · Playwright.

## ⚠️ This plan supersedes `2026-07-04-homepage-content-build.md`

The 07-04 plan was written when every section was a stub (HEAD `6031497`). Commits `f0a2311`→`dadcd1f` then built all sections **with the old placeholder copy**, so that plan's "implement stub" tasks no longer match reality and executing it would destroy working features (it would replace the working contact form with a mailto link, drop the Embla carousel, etc.). **Do not execute the 07-04 plan.** This plan carries forward its client-approved copy and decisions, re-targeted at the current codebase. Task 0 marks the old plan superseded.

## Context You Must Know Before Starting

1. **Work in `/Users/rahique/Desktop/Builds/Imperium`** — a real git clone of `Akshay-M-Singh/Imperium`, on `main` at `dadcd1f`. If `git pull --ff-only origin main` brings new commits in Task 0, STOP and re-read changed files before continuing.
2. **The client asset folder is gone.** The 07-04 plan imported assets from `~/Desktop/Builds/Imperium-main/public/images/` (logo PNG 500×500, four collection PNGs, certification scan). That folder no longer exists on disk. Task 0 asks the user for the assets. The hero is built so it works **either way**: `SITE.logoSrc` set → renders the PNG; `null` → renders a typographic wordmark in the same slot.
3. **Do NOT touch:** `src/app/actions/contact.ts`, `src/app/api/contact/route.ts`, `src/components/sections/Contact.tsx`, `src/components/ui/WhatsAppButton.tsx`, `src/components/ui/FormField.tsx`, `src/lib/email.ts`, `src/app/robots.ts`, `next.config.ts`, anything under `src/components/motion/`. The site must stay non-indexable (`NEXT_PUBLIC_ALLOW_INDEXING` stays unset).
4. **`Testimonials` stays mounted** in `page.tsx` — it renders `null` on empty data by design.
5. **Existing tests assert the OLD copy** (e.g. `Hero.test.tsx` expects "Est. 2026", `Collections.test.tsx` expects three cards). Tasks update those assertions alongside the code — never delete a test file to make a task pass; keep the non-copy assertions (video/poster/reduced-motion, a11y) intact.
6. **House style (copy it exactly):** CSS logical properties (`padding-inline`, `max-inline-size`, `block-size`), design tokens for every colour/size/duration, media queries at `768px`/`1024px` min-width, `color-mix` for hover shades, file-top comments citing `DESIGN.md` sections, named export + default export per component, tests with Testing Library `getByRole` idiom.
7. **`next/image` renders fine in the jsdom test env without a mock** (proven by the passing `FabricCard.test.tsx`). Do not add a next/image mock to `tests/setup.ts`.
8. **Exactly one `h1` per page.** The hero's `h1` will contain the logo (accessible name = image `alt`) or the typographic wordmark.

## Global Constraints

- **Zero "2026" in `src/` and `public/`, and zero "2026" in rendered HTML** — including runtime-generated text (`new Date().getFullYear()` prints 2026 today, `sitemap.ts` `lastModified` serialises a 2026 date). Test files may contain the literal `/2026/` regex used to assert absence; `docs/` and plan filenames are not served — exempt.
- **All copy lives in `src/data/` or `src/lib/site.ts`** — a hard-coded UI string in a component is a defect (PRD §7). (Pre-existing exceptions inside Hero/placeholder markup are tolerated where noted.)
- **No new dependencies. No icon libraries** (the `→` / `↓` arrow characters are allowed — DESIGN.md §10). No Tailwind, no GSAP.
- **Conventional commits** (`feat:`/`fix:`/`docs:`/`test:`/`chore:`) — commitlint enforces this; Husky pre-commit runs eslint+prettier on staged files.
- **WCAG 2.1 AA:** one `h1`, no skipped heading levels, `prefers-reduced-motion` respected (the global token collapse + `*` rule in `globals.css` already handles CSS animation).
- **Never run `npm audit fix --force`** (it downgrades Next).
- Node ≥ 20.11, npm 10.8.1. Verification gates: `npm run lint && npm run typecheck && npm run test && npm run build`.

## Decisions Locked Into This Plan (and why)

These are the judgment calls this plan makes where the client request was silent. Each is flagged so the user/founder can veto before or after execution:

| #   | Decision                                                                                                                                                                                                                                                                                     | Rationale                                                                                                                                                                                                                                                  |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-A | **Whole stats strip replaced**, not just edited: "12+ Italian mills", "120+ Fabrics in library", "15 Years of expertise" go away along with "4 Cities served". New strip: `40+ Fabrics` (client) + `4 Curated collections` + `100% Italian fabrics` (🟡 team-proposed, trivially deletable). | The removed numbers are invented, checkable claims (CLAUDE.md §7.6 highest-risk item). "120+ fabrics" directly contradicts the client's "40+ Fabrics". The two companions are true by construction.                                                        |
| D-B | **OriginMap section removed from the homepage** (component deleted; recoverable via git).                                                                                                                                                                                                    | Client direction recorded 2026-07-04: the provenance visual moves into Why Imperium row 01 as an Italy→Gulf map placeholder; the current OriginMap names Dubai/Riyadh/London/Mumbai — unvalidated city claims that clash with removing "4 Markets Served". |
| D-C | **Hero tagline = `SITE.tagline`** ("Premium Italian fabrics · Delivered to the Gulf"); the old two-line headline and long subline are retired.                                                                                                                                               | Matches the recorded client direction "logo-led hero, tagline directly beneath". The long positioning sentence lives on in the meta description.                                                                                                           |
| D-D | **Hero "Request a sample →" link retargeted `#collections` → `#contact`.**                                                                                                                                                                                                                   | It currently points at the collections carousel, but a working contact form exists at `#contact`. Recorded intent (07-04 plan) was `#contact`.                                                                                                             |
| D-E | **Why Imperium section headline stays** "Not just fabric. A guarantee of origin."                                                                                                                                                                                                            | The client request names item headings only; keep the live headline (minimal change).                                                                                                                                                                      |
| D-F | The current 4th pillar **"A partner, not a catalogue" is dropped** (the client's list has exactly three sections; their "remove Always Available" instruction targets a heading from their own copy doc that was never built).                                                               | The client enumerated the target state: exactly 3 rows.                                                                                                                                                                                                    |
| D-G | **Pezzi Unici tagline** "Rare, limited, one of a kind." (🟡 team-derived from its tag strip — client specified taglines only for the other three cards).                                                                                                                                     | Every card now renders a tagline where the tag strip was; the card needs one.                                                                                                                                                                              |
| D-H | **Collection images stay as SVG placeholders** (and the new collection gets a matching procedural SVG). Client PNGs, if recovered, are staged in Task 0 and swapped in a later asset pass.                                                                                                   | Real photography is a Phase-6 asset task (progress.md backlog); don't block copy changes on missing binaries.                                                                                                                                              |
| D-I | **Footer year removed** (`© Imperium Italian Textile. All rights reserved.`) and **sitemap `lastModified` dropped**.                                                                                                                                                                         | Both render "2026" at runtime; the client said _no reference anywhere_. A change-frequency-only sitemap entry is valid.                                                                                                                                    |
| D-J | **A light `/fabrics` detail page replaces the one-line stub.**                                                                                                                                                                                                                               | Three cards now say "View Collection" → `/fabrics#<id>`; landing them on `<h1>Fabrics</h1>` is a dead-end. This is the recorded 07-04 direction. Severable: skipping this task leaves working-but-bare CTA targets.                                        |
| D-K | **Certification caption changes** "Certified Made in Italy Expert" → "Made in Italy Certification".                                                                                                                                                                                          | The bio's first paragraph now states Sofia is "a certified Made in Italy expert"; the slot below the story is for the certification _image_, per the client request.                                                                                       |

---

### Task 0: Preflight — sync, branch, supersede the old plan, stage assets

**Files:**

- Modify: `docs/superpowers/plans/2026-07-04-homepage-content-build.md` (banner only)
- Commit: this plan file (`docs/superpowers/plans/2026-07-05-homepage-refinement-client-copy.md`)
- Create (only if the user provides the asset): `public/images/logo/imperium-wordmark.png`
- Create (only if provided): `public/images/certifications/made-in-italy-certificate.png` (stored, NOT rendered)

**Interfaces:**

- Produces: a clean feature branch; the answer to "is the logo PNG available?" which Task 1 encodes as `SITE.logoSrc` (path string or `null`).

- [ ] **Step 1: Confirm the clone is current and clean**

```bash
cd /Users/rahique/Desktop/Builds/Imperium
git status --short   # expect: M CLAUDE.md + the two untracked plan files only
git log --oneline -1 # expect: dadcd1f feat: executed phase 5
git pull --ff-only origin main
```

If the pull brings new commits, STOP and re-read the files this plan modifies before continuing.

- [ ] **Step 2: Create the feature branch**

```bash
git checkout -b feat/homepage-refinement-client-copy
```

- [ ] **Step 3: Mark the old plan superseded**

At the very top of `docs/superpowers/plans/2026-07-04-homepage-content-build.md` (line 1, above the title), insert:

```markdown
> **⛔ SUPERSEDED (2026-07-05): do not execute.** Written against HEAD `6031497` when all sections were stubs; the sections have since been built with different copy (commits `f0a2311`…`dadcd1f`). Executing these tasks would overwrite working features. The client-approved copy it records is carried forward by `2026-07-05-homepage-refinement-client-copy.md`.
```

- [ ] **Step 4: Ask the user for the client assets** ⚠️ REQUIRES USER INPUT

The 07-04 delivery contained (folder now missing from disk):
`Logo/Logo_main-removebg-preview.png` (wordmark, 500×500, transparent), `Collection types/{tessuti italiani, limited edition, hospitality, interior&exterior design}.png`, `Main certification/Screenshot*.png`.

Ask the user: _"The client asset folder (`~/Desktop/Builds/Imperium-main`) is no longer on disk. Can you provide the logo PNG (and optionally the collection PNGs + certification scan)? If not, I'll ship a typographic wordmark in the hero — the logo drops in later with a one-line change."_

- **If the logo is provided:** `mkdir -p public/images/logo && cp <provided-file> public/images/logo/imperium-wordmark.png`. Task 1 then sets `logoSrc: "/images/logo/imperium-wordmark.png"`.
- **If the certification scan is provided:** `mkdir -p public/images/certifications && cp <provided-file> public/images/certifications/made-in-italy-certificate.png`. It is stored only — `founder.certification.src` stays `null` until Sofia approves display.
- **If collection PNGs are provided:** store them at `public/images/collections/<kebab-case>.png` for the later asset pass. This plan keeps the SVG placeholders either way (Decision D-H).
- **If nothing is provided:** proceed — `logoSrc` stays `null`.

- [ ] **Step 5: Commit the plan docs (and any staged assets)**

```bash
git add docs/superpowers/plans public/images 2>/dev/null
git commit -m "chore: add homepage refinement plan; supersede 07-04 build plan"
```

---

### Task 1: Kill the year everywhere + retarget Dubai → Gulf

Every source of a rendered or served "2026" and every "Delivered to Dubai" dies in this one task, so the repo passes its own sweep from here on (except Hero, fixed in Task 4).

**Files:**

- Modify: `src/lib/site.ts`
- Modify: `src/components/layout/Navigation.tsx:49` (remove the Est. line — the only consumer of `SITE.established`)
- Modify: `src/components/layout/Navigation.module.css:52-59` (remove the orphaned `.wordmarkEst` rule)
- Modify: `src/components/layout/Footer.tsx:11,34-36` (year-free legal line)
- Modify: `src/app/layout.tsx:9-25` (metadata strings)
- Modify: `src/data/seo.ts` (home + fabrics entries)
- Modify: `src/app/sitemap.ts` (drop `lastModified`)
- Modify: `src/app/globals.css:22` (comment only)
- Modify: `package.json:5` (description only)
- Modify: `public/site.webmanifest` (description only)
- Modify: `tests/unit/components/layout/Navigation.test.tsx` (Est. assertion → absence assertion)
- Test: `tests/unit/lib/site.test.ts` (new), `tests/unit/components/layout/Footer.test.tsx` (new)

**Interfaces:**

- Produces: `SITE.tagline === "Premium Italian fabrics · Delivered to the Gulf"` (Footer renders it now; Hero consumes it in Task 4); `SITE.logoSrc: string | null` (Hero consumes it in Task 4); `SITE` no longer has `established`.

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/lib/site.test.ts`:

```tsx
import { describe, it, expect } from "vitest";
import { SITE } from "@/lib/site";

describe("SITE brand configuration", () => {
  it("carries the Gulf tagline", () => {
    expect(SITE.tagline).toBe("Premium Italian fabrics · Delivered to the Gulf");
  });

  it("has no establishment-year field and no year anywhere", () => {
    expect(SITE).not.toHaveProperty("established");
    expect(JSON.stringify(SITE)).not.toMatch(/2026/);
  });

  it("declares the hero logo slot (path string or null)", () => {
    expect(SITE.logoSrc === null || typeof SITE.logoSrc === "string").toBe(true);
  });
});
```

Create `tests/unit/components/layout/Footer.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/site";

describe("Footer", () => {
  it("renders the wordmark and the Gulf tagline", () => {
    render(<Footer />);
    expect(screen.getByText(SITE.name)).toBeInTheDocument();
    expect(screen.getByText(SITE.tagline)).toBeInTheDocument();
  });

  it("renders a year-free legal line", () => {
    const { container } = render(<Footer />);
    expect(container.textContent).toMatch(/All rights reserved/);
    expect(container.textContent).not.toMatch(/\b20\d\d\b/);
  });
});
```

- [ ] **Step 2: Run them — expect FAIL**

```bash
npx vitest run tests/unit/lib/site.test.ts tests/unit/components/layout/Footer.test.tsx
```

Expected: site test fails on tagline ("Delivered to Dubai"), `established`, and missing `logoSrc`; Footer test fails on the `© 2026` year.

- [ ] **Step 3: Rewrite `src/lib/site.ts`**

```ts
// Site — brand configuration. The single source of truth for things that
// would otherwise be magic strings scattered across components.
// No establishment year anywhere on the site, by client decision.

export const SITE = {
  name: "Imperium Italian Textile",
  shortName: "Imperium",
  tagline: "Premium Italian fabrics · Delivered to the Gulf",
  // Hero wordmark logo. Point at the staged asset
  // ("/images/logo/imperium-wordmark.png") once the client logo is in
  // public/images/logo/; null renders the typographic wordmark instead.
  logoSrc: null as string | null,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://imperiumitaliantextile.com",
  email: "hello@imperiumitaliantextile.com",
  // Placeholder until Sofia's WhatsApp Business number is confirmed (Phase 4.17).
  // Replaced during the Phase 4 fine-tune pass. wa.me links work with this format.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "971500000000",
  instagram: "https://instagram.com/imperiumitaliantextile",
  instagramHandle: "@imperiumitaliantextile",
  location: "Dubai, UAE · Italy",
  locale: "en_AE" as const,
  locales: ["en", "ar"] as const,
} as const;
```

If Task 0 staged the logo, set `logoSrc: "/images/logo/imperium-wordmark.png" as string | null` instead of `null as string | null`.

- [ ] **Step 4: Remove the Est. line from `src/components/layout/Navigation.tsx`**

The wordmark link (lines 47–50) currently is:

```tsx
<Link href="/" className={styles.wordmark} aria-label="Imperium Italian Textile — home">
  <span className={styles.wordmarkName}>{SITE.name}</span>
  <span className={styles.wordmarkEst}>Est. {SITE.established}</span>
</Link>
```

Delete the `wordmarkEst` span so it becomes:

```tsx
<Link href="/" className={styles.wordmark} aria-label="Imperium Italian Textile — home">
  <span className={styles.wordmarkName}>{SITE.name}</span>
</Link>
```

In `src/components/layout/Navigation.module.css`, delete the whole `.wordmarkEst { ... }` rule (lines 52–59).

- [ ] **Step 5: Year-free legal line in `src/components/layout/Footer.tsx`**

Delete line 11 (`const currentYear = new Date().getFullYear();`) and change the legal paragraph (lines 34–36) from:

```tsx
<p className={styles.legal}>
  © {currentYear} {SITE.name}. All rights reserved.
</p>
```

to:

```tsx
<p className={styles.legal}>© {SITE.name}. All rights reserved.</p>
```

Also update the file-top comment's second line to record the rule:

```tsx
// Footer — site-wide dark full-stop (DESIGN.md §9.09).
// Full-width Carbone band with wordmark, footer links, legal line, and socials.
// The legal line carries no year by client decision (no year anywhere on the site).
```

- [ ] **Step 6: Gulf metadata in `src/app/layout.tsx`**

Replace the `title.default` and both `description` strings (this also softens "sourced directly" → "sourced from" — "directly" is an unconfirmed PRD B-3 claim):

```ts
  title: {
    default: "Imperium Italian Textile — Premium Italian Fabrics, Delivered to the Gulf",
    template: "%s · Imperium Italian Textile",
  },
  description:
    "Premium Italian fabrics sourced from Italy's finest mills and delivered to the Gulf's most discerning tailors, designers and hospitality groups.",
```

and inside `openGraph`:

```ts
    description:
      "Premium Italian fabrics sourced from Italy's finest mills and delivered to the Gulf's most discerning tailors, designers and hospitality groups.",
```

- [ ] **Step 7: Update `src/data/seo.ts`** (home + fabrics only; about/contact unchanged)

```ts
  home: {
    title: "Imperium Italian Textile — Premium Italian Fabrics, Delivered to the Gulf",
    description:
      "Premium Italian fabrics sourced from Italy's finest mills and delivered to the Gulf's most discerning tailors, designers and hospitality groups.",
    canonical: "/",
    ogTitle: "Imperium Italian Textile",
    ogDescription: "Premium Italian fabrics sourced from the finest mills of Italy.",
  },
  fabrics: {
    title: "Fabric Collections",
    description:
      "Tessuti Italiani, Pezzi Unici, Ospitalità di Lusso and Interior & Exterior Design — four collections of premium Italian fabric.",
    canonical: "/fabrics",
  },
```

- [ ] **Step 8: Drop `lastModified` from `src/app/sitemap.ts`**

`lastModified: new Date()` serialises today's date — a "2026-…" string in served XML. The field is optional; remove that one line so the entry becomes:

```ts
    {
      url: `${baseUrl}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
```

- [ ] **Step 9: Scrub the non-rendered stragglers**

`src/app/globals.css` line 22 — change the comment:

```css
--color-oro-antico: #c4a76c; /* founder quote, hover accents */
```

`package.json` line 5 — change:

```json
  "description": "Imperium Italian Textile — premium Italian fabrics delivered to the Gulf's most discerning tailors, designers and hospitality groups.",
```

`public/site.webmanifest` — change the description field:

```json
  "description": "Premium Italian fabrics sourced from Italy's finest mills and delivered to the Gulf's most discerning tailors, designers and hospitality groups.",
```

- [ ] **Step 10: Fix the Navigation test**

In `tests/unit/components/layout/Navigation.test.tsx`, replace the test that asserts the Est. subline (around lines 17–21) with:

```tsx
it("renders the wordmark without an establishment year", () => {
  const { container } = render(<Navigation />);
  expect(screen.getByText("Imperium Italian Textile")).toBeInTheDocument();
  expect(container.textContent).not.toMatch(/Est\.|20\d\d/);
});
```

(Keep every other test in that file unchanged.)

- [ ] **Step 11: Run tests + targeted sweep, expect PASS**

```bash
npm run test          # full suite green. (Hero.test still asserts the OLD hero copy,
                      # and Hero.tsx is untouched until Task 4 — so it passes here.)
npm run typecheck     # proves nothing else consumed SITE.established
grep -rn "2026" src public    # expect exactly two hits: Hero.tsx lines 74 and 103 (fixed in Task 4)
grep -rn "Delivered to Dubai" src public   # expect: no output
```

- [ ] **Step 12: Commit**

```bash
git add -A && git commit -m "feat: remove establishment year site-wide and retarget brand copy to the Gulf"
```

---

### Task 2: Collections — four cards, taglines, new CTAs

**Files:**

- Modify: `src/types/collections.ts` (add required `tagline`)
- Modify: `src/data/collections.ts` (4 entries, final copy, new CTAs)
- Create: `public/images/fabrics/interior-exterior.svg` (placeholder in the house SVG style)
- Modify: `src/components/ui/FabricCard.tsx` (render tagline instead of the tag strip; arrow after CTA label)
- Modify: `src/components/ui/FabricCard.module.css` (rename `.tags`/`.tagsAccent` → `.tagline`/`.taglineAccent`)
- Modify: `src/components/sections/Collections.tsx:25` (subline: "Three" → "Four")
- Modify: `tests/unit/components/ui/FabricCard.test.tsx` (fixture + assertions)
- Modify: `tests/unit/components/sections/Collections.test.tsx` (four cards)
- Test: `tests/unit/data/collections.test.ts` (new)

**Interfaces:**

- Produces: `CollectionCard` gains required `tagline: string`; `collections` has exactly 4 entries in order `tessuti-italiani`, `pezzi-unici`, `ospitalita-di-lusso`, `interior-exterior`. `FabricCard` keeps its existing prop shape `{ collection: CollectionCard }` (Task 8's `/fabrics` page also consumes `collections`).
- CTA contract: Pezzi Unici → `{ label: "Contact Us", href: "#contact" }`; the other three → `{ label: "View Collection", href: "/fabrics#<id>" }`. `FabricCard` renders the label with a trailing `→`.

- [ ] **Step 1: Write the failing data test**

Create `tests/unit/data/collections.test.ts`:

```tsx
import { describe, it, expect } from "vitest";
import { collections } from "@/data/collections";

describe("collections data", () => {
  it("has four collections in editorial order", () => {
    expect(collections.map((c) => c.id)).toEqual([
      "tessuti-italiani",
      "pezzi-unici",
      "ospitalita-di-lusso",
      "interior-exterior",
    ]);
  });

  it("carries the client-approved taglines", () => {
    const byId = Object.fromEntries(collections.map((c) => [c.id, c]));
    expect(byId["tessuti-italiani"].tagline).toBe("For those who don't compromise.");
    expect(byId["ospitalita-di-lusso"].tagline).toBe("Breathability, durability, and quality.");
    expect(byId["interior-exterior"].tagline).toBe("Timeless design, durability, and versatility.");
  });

  it("routes Pezzi Unici to contact and the rest to the fabrics page", () => {
    for (const c of collections) {
      if (c.id === "pezzi-unici") {
        expect(c.cta).toEqual({ label: "Contact Us", href: "#contact" });
      } else {
        expect(c.cta).toEqual({ label: "View Collection", href: `/fabrics#${c.id}` });
      }
    }
  });

  it("mentions hotels, resorts and restaurants for Ospitalità di Lusso", () => {
    const osp = collections.find((c) => c.id === "ospitalita-di-lusso")!;
    expect(osp.body).toMatch(/hotels/i);
    expect(osp.body).toMatch(/resorts/i);
    expect(osp.body).toMatch(/restaurants/i);
  });

  it("contains no year and points at real image files", () => {
    expect(JSON.stringify(collections)).not.toMatch(/2026/);
    for (const c of collections) {
      expect(c.image.src).toMatch(/^\/images\/(fabrics|collections)\/[a-z-]+\.(svg|png)$/);
      expect(c.image.alt.length).toBeGreaterThan(10);
    }
  });
});
```

- [ ] **Step 2: Run it — expect FAIL** (`tagline` doesn't exist, only 3 entries)

```bash
npx vitest run tests/unit/data/collections.test.ts
```

- [ ] **Step 3: Add `tagline` to the type**

`src/types/collections.ts` becomes:

```ts
// Collections types.

export type TagAccent = "sabbia" | "oro-antico";

export interface CollectionCard {
  id: string;
  /** Material tags — kept on the model as groundwork for a future
   *  filterable library (PRD D-01c); the card renders `tagline` instead. */
  tags: string[];
  tagAccent?: TagAccent;
  title: string;
  titleItalic?: boolean;
  /** Short promise line rendered beneath the card image. */
  tagline: string;
  body: string;
  cta: { label: string; href: string };
  image: { src: string; alt: string };
}

export type CollectionsData = CollectionCard[];
```

- [ ] **Step 4: Rewrite `src/data/collections.ts`**

```ts
import type { CollectionsData } from "@/types/collections";

// Collections — the four curated collections (client-confirmed, resolving
// PRD D-01 in favour of curated collections; DESIGN.md §9.04). `tags` stay
// on the model for a future filterable library even though the cards
// render `tagline`. Images are placeholder SVGs until the client
// photography lands (progress.md backlog).

export const collections: CollectionsData = [
  {
    id: "tessuti-italiani",
    tags: ["LINEN", "SILK", "WOOL", "COTTON"],
    title: "Tessuti Italiani",
    titleItalic: true,
    tagline: "For those who don't compromise.",
    body: "The foundation of the house: linens, silks, wools and cottons sourced from Italian mills we know by name. Fabric for work that carries your label.",
    cta: { label: "View Collection", href: "/fabrics#tessuti-italiani" },
    image: {
      src: "/images/fabrics/tessuti-italiani.svg",
      alt: "Close-up of Italian linen fabric showing natural weave texture.",
    },
  },
  {
    id: "pezzi-unici",
    tags: ["RARE", "LIMITED", "ONE OF A KIND"],
    tagAccent: "oro-antico",
    title: "Pezzi Unici",
    titleItalic: true,
    // 🟡 Team-derived from the tag strip — the client specified taglines
    // only for the other three cards. Swap if Sofia supplies one.
    tagline: "Rare, limited, one of a kind.",
    body: "Small runs, discontinued weaves, single bolts. When a piece is gone, it is gone — which is precisely the point.",
    cta: { label: "Contact Us", href: "#contact" },
    image: {
      src: "/images/fabrics/pezzi-unici.svg",
      alt: "Rare Italian silk shantung with subtle slub texture and warm sheen.",
    },
  },
  {
    id: "ospitalita-di-lusso",
    tags: ["HOSPITALITY", "BESPOKE"],
    title: "Ospitalità di Lusso",
    titleItalic: true,
    tagline: "Breathability, durability, and quality.",
    body: "Contract-grade fabric for hotels, resorts and restaurants that refuse to look like it. Specified with you, sampled fast.",
    cta: { label: "View Collection", href: "/fabrics#ospitalita-di-lusso" },
    image: {
      src: "/images/fabrics/ospitalita-di-lusso.svg",
      alt: "Close-up of durable Italian wool upholstery fabric with tight twill weave.",
    },
  },
  {
    id: "interior-exterior",
    tags: ["INTERIOR", "EXTERIOR", "CONTRACT"],
    title: "Interior & Exterior Design",
    titleItalic: false,
    tagline: "Timeless design, durability, and versatility.",
    body: "Premium Italian textiles designed for sophisticated interior and exterior spaces, bringing timeless craftsmanship to residential, commercial, and hospitality environments.",
    cta: { label: "View Collection", href: "/fabrics#interior-exterior" },
    image: {
      src: "/images/fabrics/interior-exterior.svg",
      alt: "Woven indoor-outdoor Italian textile with a subtle canvas stripe.",
    },
  },
];
```

Note locked in: `titleItalic: false` on the new collection — italics mark Italian-language titles (DESIGN.md §9.04); "Interior & Exterior Design" is English.

- [ ] **Step 5: Create `public/images/fabrics/interior-exterior.svg`**

Same procedural-texture style as the three existing placeholder SVGs (gradient ground + weave pattern + noise filter + light bloom), reading as a striped outdoor canvas in the site's warm neutrals with a whisper of Blu Notte:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500" aria-hidden="true">
  <defs>
    <filter id="canvas-noise" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="4" stitchTiles="stitch" result="noise"/>
      <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
      <feComponentTransfer in="grayNoise" result="softNoise">
        <feFuncA type="linear" slope="0.16"/>
      </feComponentTransfer>
      <feBlend mode="multiply" in="softNoise" in2="SourceGraphic" result="blend"/>
    </filter>
    <pattern id="canvas-weave" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
      <rect width="12" height="12" fill="#ddd2c2"/>
      <path d="M0 3h12M0 9h12" stroke="#cfc2ae" stroke-width="1.5" fill="none"/>
      <path d="M3 0v12M9 0v12" stroke="#c6b8a2" stroke-width="0.8" fill="none"/>
    </pattern>
    <pattern id="canvas-stripe" x="0" y="0" width="96" height="500" patternUnits="userSpaceOnUse">
      <rect x="60" width="20" height="500" fill="#8d8378" opacity="0.28"/>
      <rect x="84" width="6" height="500" fill="#1b2a4a" opacity="0.18"/>
    </pattern>
    <linearGradient id="canvas-warmth" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#efe7da"/>
      <stop offset="50%" stop-color="#e3d8c6"/>
      <stop offset="100%" stop-color="#d2c5b0"/>
    </linearGradient>
    <radialGradient id="canvas-light" cx="28%" cy="22%" r="85%">
      <stop offset="0%" stop-color="#fffdf8" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#fffdf8" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="400" height="500" fill="url(#canvas-warmth)"/>
  <rect width="400" height="500" fill="url(#canvas-weave)" filter="url(#canvas-noise)"/>
  <rect width="400" height="500" fill="url(#canvas-stripe)"/>
  <rect width="400" height="500" fill="url(#canvas-light)"/>
</svg>
```

- [ ] **Step 6: Render the tagline in `src/components/ui/FabricCard.tsx`**

The full file becomes (changes: destructure `tagline`; the `<p>` under the image renders `tagline` with the renamed classes; the CTA gets a trailing arrow; comment updated):

```tsx
// FabricCard — 4:5 portrait image + tagline + italic title + body + CTA
// (DESIGN.md §9.04, amended by client direction: a short promise line sits
// beneath the image where the material-tag strip was; tags stay in the
// data model for the future filterable library). TiltCard motion wrapper
// applied in Phase 5.6 (MOTION_SPEC.md §3.1).

import Image from "next/image";
import type { CollectionCard } from "@/types/collections";
import { TiltCard, TiltCardImage } from "@/components/motion/TiltCard";
import { TextLink } from "./TextLink";
import { cn } from "@/lib/utils";
import styles from "./FabricCard.module.css";

export interface FabricCardProps {
  collection: CollectionCard;
}

export function FabricCard({ collection }: FabricCardProps) {
  const { tagline, tagAccent, title, body, cta, image } = collection;

  return (
    <TiltCard className={styles.card}>
      <article className={styles.article}>
        <div className={styles.imageWrap}>
          <TiltCardImage>
            <Image
              src={image.src}
              alt={image.alt}
              width={400}
              height={500}
              loading="lazy"
              className={styles.image}
            />
          </TiltCardImage>
        </div>
        <div className={styles.content}>
          <p className={cn(styles.tagline, tagAccent === "oro-antico" && styles.taglineAccent)}>
            {tagline}
          </p>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.body}>{body}</p>
          <div className={styles.cta}>
            <span className={styles.ctaInner}>
              <TextLink href={cta.href}>{cta.label} →</TextLink>
            </span>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

export default FabricCard;
```

In `src/components/ui/FabricCard.module.css`, rename the selectors (styles unchanged): `.tags` → `.tagline`, `.tagsAccent` → `.taglineAccent`, and update the two state selectors `.card:focus-within .tags` → `.card:focus-within .tagline` and `.card:hover .tags` → `.card:hover .tagline`. Also update the file-top comment to `4:5 portrait image + tagline + italic title + body + CTA`.

- [ ] **Step 7: "Four curated collections" subline in `src/components/sections/Collections.tsx`**

Line 25, change the `subline` prop to:

```tsx
subline = "Four curated collections — each one a different way of working with Italian craft.";
```

Also update the file-top comment (line 1) to `// Collections — four collection cards / Embla carousel on all viewports`.

(No other change — `EmblaContainer` counts children via `Children.count`, so the fourth slide and its pagination dot appear automatically.)

- [ ] **Step 8: Update the component tests**

Replace the fixture + assertions in `tests/unit/components/ui/FabricCard.test.tsx` — the full file becomes:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FabricCard } from "@/components/ui/FabricCard";
import type { CollectionCard } from "@/types/collections";

const collection: CollectionCard = {
  id: "tessuti-italiani",
  tags: ["LINEN", "SILK"],
  title: "Tessuti Italiani",
  titleItalic: true,
  tagline: "For those who don't compromise.",
  body: "The foundation of the house.",
  cta: { label: "View Collection", href: "/fabrics#tessuti-italiani" },
  image: { src: "/images/fabrics/tessuti-italiani.svg", alt: "Italian linen texture" },
};

describe("FabricCard", () => {
  it("renders the tagline beneath the image instead of the tag strip", () => {
    render(<FabricCard collection={collection} />);

    expect(screen.getByText("For those who don't compromise.")).toBeInTheDocument();
    expect(screen.queryByText("LINEN · SILK")).not.toBeInTheDocument();
  });

  it("renders the collection title, body and CTA", () => {
    render(<FabricCard collection={collection} />);

    expect(screen.getByRole("heading", { name: "Tessuti Italiani" })).toBeInTheDocument();
    expect(screen.getByText("The foundation of the house.")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /View Collection/ });
    expect(link).toHaveAttribute("href", "/fabrics#tessuti-italiani");
  });

  it("renders the collection image with alt text", () => {
    render(<FabricCard collection={collection} />);

    const image = screen.getByAltText("Italian linen texture");
    expect(image).toBeInTheDocument();
  });
});
```

In `tests/unit/components/sections/Collections.test.tsx`, replace the "renders all three collection cards" test with:

```tsx
it("renders all four collection cards", async () => {
  render(<Collections />);
  expect(await screen.findByRole("heading", { name: "Tessuti Italiani" })).toBeInTheDocument();
  expect(await screen.findByRole("heading", { name: "Pezzi Unici" })).toBeInTheDocument();
  expect(await screen.findByRole("heading", { name: "Ospitalità di Lusso" })).toBeInTheDocument();
  expect(
    await screen.findByRole("heading", { name: "Interior & Exterior Design" }),
  ).toBeInTheDocument();
});

it("routes Pezzi Unici to the contact section", async () => {
  render(<Collections />);
  expect(await screen.findByRole("link", { name: /Contact Us/ })).toHaveAttribute(
    "href",
    "#contact",
  );
});
```

(Keep the "renders the section header" test unchanged.)

- [ ] **Step 9: Run tests + typecheck, expect PASS; commit**

```bash
npx vitest run tests/unit/data/collections.test.ts tests/unit/components/ui/FabricCard.test.tsx tests/unit/components/sections/Collections.test.tsx
npm run typecheck
git add -A && git commit -m "feat: four collections with client taglines and new CTAs"
```

---

### Task 3: Stats strip — 40+ Fabrics leads, invented numbers removed

**Files:**

- Create: `src/data/stats.ts`
- Modify: `src/components/sections/StatsStrip.tsx` (read data file instead of the inline array)
- Modify: `src/components/sections/StatsStrip.module.css` (grid for 3 items instead of 4)
- Modify: `src/data/index.ts` (export stats)
- Test: `tests/unit/data/stats.test.ts` (new)

**Interfaces:**

- Consumes: existing `StatBlock` (`value: number; label: string; suffix?: string; inView?: boolean`) — unchanged.
- Produces: `stats: StatItem[]` where `interface StatItem { value: number; suffix?: string; label: string }`.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/data/stats.test.ts`:

```tsx
import { describe, it, expect } from "vitest";
import { stats } from "@/data/stats";

describe("stats data", () => {
  it("leads with 40+ Fabrics", () => {
    expect(stats[0]).toEqual({ value: 40, suffix: "+", label: "Fabrics" });
  });

  it("contains no markets/cities-served stat, no mills or years claims, and no year", () => {
    const flat = JSON.stringify(stats);
    expect(flat).not.toMatch(/2026/);
    expect(flat).not.toMatch(/markets|cities/i);
    expect(flat).not.toMatch(/mills|years/i);
  });
});
```

- [ ] **Step 2: Run it — expect FAIL** (module doesn't exist)

```bash
npx vitest run tests/unit/data/stats.test.ts
```

- [ ] **Step 3: Create `src/data/stats.ts`**

```ts
// Stats strip — client-confirmed "40+ Fabrics". The previous strip
// ("12+ Italian mills", "120+ Fabrics in library", "15 Years of
// expertise", "4 Cities served") carried unvalidated, checkable claims
// and was removed by client decision. The two companion stats below are
// 🟡 team-proposed and true by construction (PRD §6.4) — delete a line
// if the founder vetoes it; the strip lays out 1–3 items cleanly.

export interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

export const stats: StatItem[] = [
  { value: 40, suffix: "+", label: "Fabrics" },
  { value: 4, label: "Curated collections" },
  { value: 100, suffix: "%", label: "Italian fabrics" },
];
```

- [ ] **Step 4: Point `src/components/sections/StatsStrip.tsx` at the data file**

Delete the inline `const stats = [...]` block (lines 13–18) and add the import. Also update the file-top comment — it currently says the strip "bridg[es] OriginMap and Collections", and OriginMap is removed in Task 6:

```tsx
// StatsStrip — horizontal stat band between Hero and Collections
// (DESIGN.md §9.03 elevation, Roadmap Phase 3.3). Reads src/data/stats.ts.
```

The imports section becomes:

```tsx
import { useRef } from "react";
import { useInView } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { StatBlock } from "@/components/ui/StatBlock";
import { stats } from "@/data/stats";
import styles from "./StatsStrip.module.css";
```

Everything else in the component stays exactly as it is (Section/ScrollReveal/useInView/StatBlock map).

- [ ] **Step 5: Re-grid `src/components/sections/StatsStrip.module.css` for three items**

The current CSS is a 2×2 mobile grid with `nth-child` divider logic that assumes exactly 4 cells. Replace the full file with:

```css
/* StatsStrip — DESIGN.md §9.03. Single column on mobile, three columns
   from tablet up; hairline Sabbia dividers between cells. */

.grid {
  display: grid;
  grid-template-columns: 1fr;
}

.cell {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-block: var(--space-md);
  padding-inline: var(--space-sm);
}

.cell + .cell {
  border-block-start: 1px solid color-mix(in srgb, var(--color-sabbia) 20%, transparent);
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .cell + .cell {
    border-block-start: none;
    border-inline-start: 1px solid color-mix(in srgb, var(--color-sabbia) 20%, transparent);
  }
}
```

- [ ] **Step 6: Export from the data barrel**

In `src/data/index.ts` add:

```ts
export { stats, type StatItem } from "./stats";
```

- [ ] **Step 7: Run tests + typecheck, expect PASS; commit**

```bash
npx vitest run tests/unit/data/stats.test.ts && npm run typecheck && npm run test
git add -A && git commit -m "feat: stats strip leads with 40+ fabrics; unvalidated claims removed"
```

---

### Task 4: Hero — logo-led hierarchy (keep the video infrastructure)

**Files:**

- Modify: `src/components/sections/Hero.tsx` (content stack only — video/poster/lazy-load logic untouched)
- Modify: `src/components/sections/Hero.module.css` (logo + tagline styles replace headline + subline + caption)
- Modify: `tests/unit/components/sections/Hero.test.tsx` (copy assertions; keep video/poster/reduced-motion tests)

**Interfaces:**

- Consumes: `SITE.logoSrc`, `SITE.name`, `SITE.tagline` (Task 1), `next/image`.
- Produces: the page's only `h1` contains the logo — as `<Image alt={SITE.name}>` when `SITE.logoSrc` is set, or a typographic wordmark otherwise. Accessible name matches `/Imperium/` in both branches. "Request a sample →" now targets `#contact` (Decision D-D).

- [ ] **Step 1: Rewrite the failing test**

Replace `tests/unit/components/sections/Hero.test.tsx` in full (the `installMatchMedia` helper and the two video tests are carried over verbatim from the current file):

```tsx
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/sections/Hero";
import { SITE } from "@/lib/site";

function installMatchMedia(matches: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const mql: MediaQueryList = {
    matches,
    media: "",
    onchange: null,
    addEventListener: (_: string, listener: (e: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_: string, listener: (e: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    },
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  } as unknown as MediaQueryList;
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(mql));
}

describe("Hero", () => {
  beforeEach(() => {
    installMatchMedia(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("leads with the brand as the page's only h1", () => {
    render(<Hero />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveAccessibleName(/Imperium/i);
    if (SITE.logoSrc) {
      expect(screen.getByRole("img", { name: SITE.name })).toBeInTheDocument();
    }
  });

  it("places the tagline directly beneath the logo", () => {
    render(<Hero />);
    expect(screen.getByText(SITE.tagline)).toBeInTheDocument();
  });

  it("renders the Made in Italy eyebrow without a year", () => {
    const { container } = render(<Hero />);
    expect(screen.getByText("Made in Italy")).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/2026|Est\./);
  });

  it("renders the primary CTA and routes the sample link to contact", () => {
    render(<Hero />);
    const cta = screen.getByRole("link", { name: "Explore our fabrics" });
    expect(cta).toHaveAttribute("href", "#collections");
    const sample = screen.getByRole("link", { name: /Request a sample/i });
    expect(sample).toHaveAttribute("href", "#contact");
  });

  it("renders a video element with a poster pointing at a hero image", () => {
    render(<Hero />);
    const video = document.querySelector("video");
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("poster");
    const poster = video!.getAttribute("poster") ?? "";
    expect(poster).toMatch(/\/images\/hero\/hero-(desktop|mobile)\.svg$/);
  });

  it("does not attach a video src under reduced motion (static poster)", () => {
    installMatchMedia(true);
    render(<Hero />);
    const video = document.querySelector("video");
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("poster");
    expect(video).not.toHaveAttribute("src");
  });
});
```

- [ ] **Step 2: Run it — expect FAIL** (h1 is still the two-line headline; sample link points at #collections; "Est. 2026" present)

```bash
npx vitest run tests/unit/components/sections/Hero.test.tsx
```

- [ ] **Step 3: Restructure the content stack in `src/components/sections/Hero.tsx`**

Add two imports at the top (below the existing ones):

```tsx
import Image from "next/image";
import { SITE } from "@/lib/site";
```

Replace the content block (current lines 73–104: everything from `<div className={styles.content}>` through the closing `</span>` of the caption) with:

```tsx
      <div className={styles.content}>
        <span className={styles.eyebrow}>Made in Italy</span>

        <h1 id="hero-heading" className={styles.logo}>
          {SITE.logoSrc ? (
            <Image
              src={SITE.logoSrc}
              alt={SITE.name}
              width={500}
              height={500}
              priority
              className={styles.logoImage}
            />
          ) : (
            <span className={styles.wordmark}>
              <span className={styles.wordmarkPrimary}>Imperium</span>
              <span className={styles.wordmarkSecondary}>Italian Textile</span>
            </span>
          )}
        </h1>

        <p className={styles.tagline}>{SITE.tagline}</p>

        <div className={styles.ctaGroup}>
          <MagneticButton>
            <Button variant="ghost-light" href="#collections">
              Explore our fabrics
            </Button>
          </MagneticButton>
          <a href="#contact" className={styles.textLink}>
            Request a sample →
          </a>
        </div>
      </div>

      <div className={styles.scrollIndicator} aria-hidden="true">
        <span className={styles.scrollLine} />
      </div>
```

Notes: the `Italia · 2026` caption `<span>` is **deleted entirely** (retired by client decision, not reworded). Everything above `<div className={styles.content}>` (the section wrapper, video, overlay) and everything below (closing tags) stays byte-for-byte identical. Update the file-top comment to:

```tsx
// Hero — full-viewport brand opening (DESIGN.md §9.02, amended by client
// direction: the wordmark logo leads inside the h1, with the brand
// tagline directly beneath). Video/poster lazy-load logic unchanged.
```

- [ ] **Step 4: Update `src/components/sections/Hero.module.css`**

1. **Delete** the `.headline` rule, the `.headline span` rules, the `.subline` rule, the `.caption` rule, and the `@keyframes hero-enter-headline` block.
2. **Add** in their place (after `.eyebrow`):

```css
.logo {
  margin: 0;
  opacity: 0;
  animation: hero-enter 1000ms var(--motion-ease-out) both;
  animation-delay: 80ms;
}

.logoImage {
  display: block;
  inline-size: min(420px, 78vw, 42dvh);
  block-size: auto;
  /* Client PNG is dark-on-transparent; render it white over the dark
     video/poster ground. Remove this line if the artwork is already light
     (visual check in Step 6). */
  filter: brightness(0) invert(1);
}

.wordmark {
  display: grid;
  justify-items: center;
  gap: var(--space-xs);
  color: #fff;
}

.wordmarkPrimary {
  font-family: var(--font-serif);
  font-weight: var(--font-weight-regular);
  font-size: var(--text-display);
  line-height: 1;
  letter-spacing: 0.04em;
}

.wordmarkSecondary {
  font-family: var(--font-sans);
  font-size: var(--text-eyebrow);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
}

.tagline {
  font-family: var(--font-sans);
  font-size: var(--text-body-large);
  font-weight: var(--font-weight-regular);
  line-height: var(--leading-body);
  letter-spacing: var(--tracking-caption);
  color: rgba(255, 255, 255, 0.8);
  max-inline-size: 540px;
  opacity: 0;
  animation: hero-enter 800ms var(--motion-ease-out) both;
  animation-delay: 200ms;
}
```

3. In the `.ctaGroup` rule, change `animation-delay: 320ms;` to `animation-delay: 320ms;` (unchanged — listed only so you don't "fix" it; the cascade is eyebrow 0ms → logo 80ms → tagline 200ms → CTAs 320ms).
4. Keep `.eyebrow`, `.content`, `.ctaGroup`, `.textLink`, `.scrollIndicator`, `.scrollLine`, `@keyframes hero-enter`, `@keyframes hero-pulse`, and the mobile media query untouched.

(Reduced motion needs no per-rule handling — `globals.css` collapses all animation durations globally.)

- [ ] **Step 5: Run tests, expect PASS**

```bash
npx vitest run tests/unit/components/sections/Hero.test.tsx && npm run test && npm run typecheck
```

- [ ] **Step 6: Visual check (decision point)**

```bash
npm run dev
```

At `http://localhost:3000`: eyebrow → logo (or wordmark) → tagline → CTAs, centred over the poster; entry cascade staggers; nothing overflows at 375px / 768px / 1280px widths and on a short viewport (e.g. 1280×700). **If a real logo PNG is in place:** confirm the white-inverted rendering reads cleanly over the poster; if the artwork is already light or the inversion looks wrong, delete the `filter` line in `.logoImage` and re-check.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: logo-led hero with tagline beneath; year references removed"
```

---

### Task 5: Why Imperium — three alternating rows with map & stamp placeholders

**Files:**

- Modify: `src/data/pillars.ts` (full rewrite — new exported shape)
- Create: `src/components/sections/WhyImperium.tsx`
- Create: `src/components/sections/WhyImperium.module.css`
- Delete: `src/components/sections/TrustPillars.tsx`, `src/components/sections/TrustPillars.module.css`
- Modify: `src/components/sections/index.ts` (swap the export)
- Modify: `src/data/index.ts` (swap the pillars export)
- Modify: `src/app/page.tsx` (mount WhyImperium)
- Test: `tests/unit/data/pillars.test.ts`, `tests/unit/components/sections/WhyImperium.test.tsx` (new)

**Interfaces:**

- Consumes: `Section`, `SectionHeader`, `ScrollReveal`, `cn`.
- Produces:

```ts
export type PillarMedia = "map" | "stamp" | null;
export interface WhyImperiumItem {
  number: string; // "01" | "02" | "03"
  heading: string;
  paragraphs: string[]; // 1–2 paragraphs each
  media: PillarMedia; // which placeholder container the row reserves
}
export const whyImperium: { eyebrow: string; headline: string; items: WhyImperiumItem[] };
```

- The old `pillars` export and its 4-item shape are deleted. Its only consumer is `TrustPillars.tsx`, which this task also deletes. Placeholder containers carry `data-testid="map-placeholder"` / `data-testid="stamp-placeholder"`; real artwork later replaces only the inner markup of `MediaSlot`.

- [ ] **Step 1: Write the failing data test**

Create `tests/unit/data/pillars.test.ts`:

```tsx
import { describe, it, expect } from "vitest";
import { whyImperium } from "@/data/pillars";

describe("whyImperium data", () => {
  it("has exactly three items — no fourth pillar survives", () => {
    expect(whyImperium.items).toHaveLength(3);
    expect(JSON.stringify(whyImperium)).not.toMatch(/always available/i);
    expect(JSON.stringify(whyImperium)).not.toMatch(/partner, not a catalogue/i);
  });

  it("carries the client-approved headings in order", () => {
    expect(whyImperium.items.map((i) => i.heading)).toEqual([
      "Direct From the Source",
      "Made in Italy Expertise",
      "For the Gulf's Luxury Market",
    ]);
  });

  it("reserves media placeholders for map and stamp", () => {
    expect(whyImperium.items[0].media).toBe("map");
    expect(whyImperium.items[1].media).toBe("stamp");
    expect(whyImperium.items[2].media).toBeNull();
  });

  it("speaks to the Gulf, not Dubai-only, in item 3", () => {
    expect(whyImperium.items[2].paragraphs.join(" ")).toMatch(/Gulf/);
  });
});
```

- [ ] **Step 2: Run it — expect FAIL** (`whyImperium` not exported)

```bash
npx vitest run tests/unit/data/pillars.test.ts
```

- [ ] **Step 3: Rewrite `src/data/pillars.ts`**

```ts
// Why Imperium — three numbered principles rendered as alternating
// editorial rows (client direction; supersedes the four-in-a-row
// manifesto in DESIGN.md §9.05 and absorbs the origin-map idea from
// §9.03). The fourth pillar was removed by client decision — do not
// re-add a replacement.

export type PillarMedia = "map" | "stamp" | null;

export interface WhyImperiumItem {
  number: string;
  heading: string;
  paragraphs: string[];
  /** Reserved visual slot: "map" (Italy → Gulf route), "stamp" (Made in
   *  Italy badge — NOT the certification image, which lives in the
   *  Founder section), or null for a text-only row. Artwork lands later. */
  media: PillarMedia;
}

export const whyImperium: {
  eyebrow: string;
  headline: string;
  items: WhyImperiumItem[];
} = {
  eyebrow: "Why Imperium",
  headline: "Not just fabric. A guarantee of origin.",
  items: [
    {
      number: "01",
      heading: "Direct From the Source",
      paragraphs: [
        "We buy from the mills, not from middlemen — and we visit them. Every collection begins in Italy, in conversations on factory floors with the people who weave what we sell.",
        "From those mills, fabric travels one route: Italy to the UAE and across the Gulf. One partner, one chain of custody, nothing anonymous between the loom and your project.",
      ],
      media: "map",
    },
    {
      number: "02",
      heading: "Made in Italy Expertise",
      paragraphs: [
        "Imperium is led by a certified Made in Italy expert. Provenance here is not a label claim — it is a discipline: verifying where a fabric is made, how, and by whom, before it ever reaches you.",
      ],
      media: "stamp",
    },
    {
      number: "03",
      heading: "For the Gulf's Luxury Market",
      paragraphs: [
        "Based in Dubai, serving the Gulf's luxury market. We understand the region's pace, climate and standard of finish — and we bring Italian craftsmanship that answers all three.",
      ],
      media: null,
    },
  ],
};
```

- [ ] **Step 4: Write the failing component test**

Create `tests/unit/components/sections/WhyImperium.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhyImperium } from "@/components/sections/WhyImperium";

describe("WhyImperium", () => {
  it("renders exactly the three client-approved principles", () => {
    render(<WhyImperium />);
    for (const heading of [
      "Direct From the Source",
      "Made in Italy Expertise",
      "For the Gulf's Luxury Market",
    ]) {
      expect(screen.getByRole("heading", { level: 3, name: heading })).toBeInTheDocument();
    }
    expect(screen.queryByText(/always available/i)).toBeNull();
  });

  it("reserves the Italy→Gulf map and stamp placeholders", () => {
    render(<WhyImperium />);
    expect(screen.getByTestId("map-placeholder")).toBeInTheDocument();
    expect(screen.getByTestId("stamp-placeholder")).toBeInTheDocument();
  });

  it("alternates media placement between rows", () => {
    const { container } = render(<WhyImperium />);
    const rows = container.querySelectorAll("[data-row]");
    expect(rows).toHaveLength(3);
    expect(rows[1].className).toMatch(/reversed/);
  });
});
```

Run: `npx vitest run tests/unit/components/sections/WhyImperium.test.tsx` — expect FAIL (module doesn't exist).

- [ ] **Step 5: Create `src/components/sections/WhyImperium.tsx`**

```tsx
// WhyImperium — three numbered principles as alternating editorial rows
// (client direction; replaces the DESIGN.md §9.05 four-in-a-row manifesto
// and absorbs §9.03's provenance story). Rows with media split 5/7 and
// alternate sides; the text-only closing row sits right to continue the
// rhythm. Placeholder containers reserve space for the Italy→Gulf route
// map and the Made in Italy stamp artwork (NOT the certification image —
// that container lives in the Founder section).

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { whyImperium, type WhyImperiumItem } from "@/data/pillars";
import styles from "./WhyImperium.module.css";

function MediaSlot({ media }: { media: WhyImperiumItem["media"] }): ReactNode {
  if (media === "map") {
    return (
      <figure className={styles.mapPlaceholder} data-testid="map-placeholder">
        <span className={styles.mapPoint}>Italy</span>
        <span className={styles.mapArrow} aria-hidden="true">
          ↓
        </span>
        <span className={styles.mapPoint}>UAE + the Gulf</span>
        <figcaption className={styles.placeholderCaption}>
          Route illustration in production
        </figcaption>
      </figure>
    );
  }
  if (media === "stamp") {
    return (
      <figure className={styles.stampSlot} data-testid="stamp-placeholder">
        <span className={styles.stampCircle}>Made in Italy</span>
        <figcaption className={styles.placeholderCaption}>
          Official stamp artwork to follow
        </figcaption>
      </figure>
    );
  }
  return null;
}

export function WhyImperium() {
  return (
    <ScrollReveal amount={0.15}>
      <Section id="why-imperium" background="gesso" ariaLabelledby="why-imperium-heading">
        <SectionHeader
          id="why-imperium-heading"
          eyebrow={whyImperium.eyebrow}
          headline={whyImperium.headline}
        />
        <div className={styles.rows}>
          {whyImperium.items.map((item, index) => (
            <div
              key={item.number}
              data-row={item.number}
              className={cn(
                styles.row,
                index % 2 === 1 && styles.reversed,
                !item.media && styles.textOnly,
              )}
            >
              <div className={styles.text}>
                <span className={styles.number}>{item.number}</span>
                <h3 className={styles.heading}>{item.heading}</h3>
                {item.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className={styles.body}>
                    {paragraph}
                  </p>
                ))}
              </div>
              {item.media ? (
                <div className={styles.media}>
                  <MediaSlot media={item.media} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Section>
    </ScrollReveal>
  );
}

export default WhyImperium;
```

- [ ] **Step 6: Create `src/components/sections/WhyImperium.module.css`**

```css
/* WhyImperium — alternating 5/7 rows on the Gesso band. Whitespace over
   dividers (DESIGN.md §4); numbered labels keep the manifesto DNA of
   §9.05. */

.rows {
  margin-block-start: var(--space-xl);
  display: grid;
  gap: var(--space-xl);
}

.row {
  display: grid;
  gap: var(--space-lg);
  align-items: center;
}

.text {
  display: grid;
  gap: var(--space-sm);
  align-content: center;
}

.number {
  font-family: var(--font-sans);
  font-size: var(--text-eyebrow);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--color-sabbia);
}

.heading {
  font-family: var(--font-serif);
  font-size: var(--text-subheadline);
  font-weight: var(--font-weight-medium);
  line-height: var(--leading-subheadline);
  color: var(--color-carbone);
}

.body {
  font-family: var(--font-sans);
  font-size: var(--text-body);
  line-height: var(--leading-body);
  color: var(--color-ardesia);
  max-inline-size: 60ch;
}

@media (min-width: 1024px) {
  .row {
    grid-template-columns: repeat(12, 1fr);
    gap: var(--grid-gutter-desktop);
  }

  .text {
    grid-column: span 5;
  }

  .media {
    grid-column: span 7;
  }

  .reversed .media {
    order: -1;
  }

  .textOnly .text {
    grid-column: 6 / -1;
  }
}

/* --- Map placeholder (Italy → UAE + Gulf) -------------------------------- */

.mapPlaceholder {
  display: grid;
  justify-items: center;
  align-content: center;
  gap: var(--space-sm);
  aspect-ratio: 4 / 3;
  border: 1px solid color-mix(in srgb, var(--color-sabbia) 30%, transparent);
  background-color: var(--color-pietra);
  text-align: center;
  padding: var(--space-lg);
}

.mapPoint {
  font-family: var(--font-serif);
  font-size: var(--text-h3);
  line-height: var(--leading-h3);
  color: var(--color-carbone);
}

.mapArrow {
  font-size: var(--text-subheadline);
  color: var(--color-oro-antico);
}

/* --- Stamp placeholder ---------------------------------------------------- */

.stampSlot {
  display: grid;
  justify-items: center;
  gap: var(--space-sm);
}

.stampCircle {
  display: grid;
  place-content: center;
  inline-size: 180px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--color-sabbia) 40%, transparent);
  font-family: var(--font-sans);
  font-size: var(--text-eyebrow);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  text-align: center;
  color: var(--color-sabbia);
  padding: var(--space-sm);
}

/* --- Shared placeholder caption -------------------------------------------- */

.placeholderCaption {
  font-family: var(--font-sans);
  font-size: var(--text-eyebrow);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--color-sabbia);
}
```

- [ ] **Step 7: Swap the exports and the page mount; delete TrustPillars**

```bash
git rm src/components/sections/TrustPillars.tsx src/components/sections/TrustPillars.module.css
```

In `src/components/sections/index.ts`, replace `export { TrustPillars } from "./TrustPillars";` with:

```ts
export { WhyImperium } from "./WhyImperium";
```

In `src/data/index.ts`, replace `export { pillars, type Pillar } from "./pillars";` with:

```ts
export { whyImperium, type WhyImperiumItem, type PillarMedia } from "./pillars";
```

In `src/app/page.tsx`, replace `TrustPillars` with `WhyImperium` in both the import list and the JSX (`<TrustPillars />` → `<WhyImperium />`).

- [ ] **Step 8: Run tests + typecheck, expect PASS; commit**

```bash
npx vitest run tests/unit/data/pillars.test.ts tests/unit/components/sections/WhyImperium.test.tsx
npm run typecheck && npm run test
git add -A && git commit -m "feat: restructure Why Imperium into three alternating rows with map and stamp placeholders"
```

---

### Task 6: Remove the OriginMap section (superseded by the Why Imperium map row)

Decision D-B. The component names Dubai/Riyadh/London/Mumbai — unvalidated market claims the client's stats change walks back. Git history keeps it recoverable (`git log --all -- src/components/sections/OriginMap.tsx`).

**Files:**

- Delete: `src/components/sections/OriginMap.tsx`, `src/components/sections/OriginMap.module.css`
- Modify: `src/components/sections/index.ts` (remove the export)
- Modify: `src/app/page.tsx` (remove import + mount)

**Interfaces:**

- Consumes/Produces: nothing — pure removal. No test file exists for OriginMap; no nav link targets `#origin` (verified: `navigation.ts` links point at `#collections`/`#founder`/`#contact`).

- [ ] **Step 1: Remove the section**

```bash
git rm src/components/sections/OriginMap.tsx src/components/sections/OriginMap.module.css
```

In `src/components/sections/index.ts`, delete the line `export { OriginMap } from "./OriginMap";`.

In `src/app/page.tsx`, delete `OriginMap,` from the import block and the `<OriginMap />` line. The final `page.tsx` becomes:

```tsx
import { Navigation } from "@/components/layout";
import {
  Hero,
  StatsStrip,
  Collections,
  WhyImperium,
  Founder,
  Testimonials,
  Contact,
} from "@/components/sections";

export default function HomePage() {
  // Narrative order (client flow): open on the brand, prove scale, show
  // the offering, argue trust, meet the founder, convert. Testimonials
  // renders null until real quotes exist (PRD D-10); the origin map was
  // superseded by the WhyImperium route-map row.
  return (
    <>
      <Navigation />
      <main id="main">
        <Hero />
        <StatsStrip />
        <Collections />
        <WhyImperium />
        <Founder />
        <Testimonials />
        <Contact />
      </main>
    </>
  );
}
```

- [ ] **Step 2: Verify nothing referenced it; run gates**

```bash
grep -rn "OriginMap\|#origin" src tests   # expect: no output
npm run typecheck && npm run test && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: remove OriginMap section, superseded by Why Imperium route-map row"
```

---

### Task 7: Founder — new story, new quote, certification placeholder container

**Files:**

- Modify: `src/data/founder.ts` (headline, bio, quote, certification caption)
- Modify: `src/components/sections/Founder.tsx:48-65` (visible placeholder container when `certification.src` is null)
- Modify: `src/components/sections/Founder.module.css` (add `.certPlaceholder` + `.certPlaceholderLabel`)
- Test: `tests/unit/components/sections/Founder.test.tsx` (new)

**Interfaces:**

- Consumes: existing `FounderData` interface (unchanged — `certification.src: string | null` already exists; `portrait.src` stays a string pointing at the existing SVG placeholder, which renders today and is out of scope).
- Produces: the certification container renders `data-testid="certification-placeholder"` while `src` is null, and the image when a path is set — the future swap is a one-line data change. The container sits below the pull quote, i.e. below the founder story, and does NOT appear in Why Imperium.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/components/sections/Founder.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Founder } from "@/components/sections/Founder";
import { founder } from "@/data/founder";

describe("Founder", () => {
  it("renders the client-approved headline and all three paragraphs", () => {
    render(<Founder />);
    expect(
      screen.getByRole("heading", { name: "Proudly Italian. Purposefully Global." }),
    ).toBeInTheDocument();
    for (const paragraph of founder.bioParagraphs) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    expect(founder.bioParagraphs).toHaveLength(3);
    expect(founder.bioParagraphs[0]).toMatch(/^Born and raised in Italy/);
  });

  it("renders the client-approved quote with attribution", () => {
    render(<Founder />);
    expect(
      screen.getByText(
        "Every fabric I select represents not only Italian craftsmanship, but my own commitment to excellence.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Sofia Mazza, Founder/)).toBeInTheDocument();
  });

  it("shows the certification placeholder container below the story", () => {
    render(<Founder />);
    expect(screen.getByTestId("certification-placeholder")).toBeInTheDocument();
    expect(screen.getByText("Made in Italy Certification")).toBeInTheDocument();
  });

  it("still renders the portrait", () => {
    render(<Founder />);
    expect(
      screen.getByAltText("Sofia Mazza, Founder of Imperium Italian Textile"),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it — expect FAIL**

```bash
npx vitest run tests/unit/components/sections/Founder.test.tsx
```

- [ ] **Step 3: Rewrite `src/data/founder.ts`**

```ts
// Founder — Sofia Mazza bio, quote, certification (DESIGN.md §9.06).
// Copy is client-approved. Set certification.src to the scan path
// (public/images/certifications/made-in-italy-certificate.png, staged
// when available) once the founder approves showing it.

export interface FounderData {
  eyebrow: string;
  headline: string;
  bioParagraphs: string[];
  portrait: { src: string; alt: string; caption: string };
  quote: string;
  quoteAttribution: string;
  certification: { src: string | null; caption: string };
}

export const founder: FounderData = {
  eyebrow: "The story behind Imperium",
  headline: "Proudly Italian. Purposefully Global.",
  bioParagraphs: [
    "Born and raised in Italy, Sofia Mazza is an Italian entrepreneur with a legal and business background and a certified Made in Italy expert. Now based in Dubai, she founded Imperium to create a direct bridge between Italy's finest textile manufacturers and the Gulf's most discerning designers, architects and fashion houses.",
    "Deeply proud of her heritage, Sofia believes that authentic Italian craftsmanship deserves to be represented with the same integrity with which it is created. She personally travels across Italy to meet mills, evaluate collections and build long-term relationships with manufacturers whose values reflect her own.",
    "Imperium is more than a textile supplier. It's a carefully curated expression of Italian excellence.",
  ],
  portrait: {
    src: "/images/about/sofia-portrait.svg",
    alt: "Sofia Mazza, Founder of Imperium Italian Textile",
    caption: "Sofia Mazza, Founder",
  },
  quote:
    "Every fabric I select represents not only Italian craftsmanship, but my own commitment to excellence.",
  quoteAttribution: "Sofia Mazza, Founder",
  certification: {
    src: null, // null until the founder approves displaying the scan
    caption: "Made in Italy Certification",
  },
};
```

- [ ] **Step 4: Upgrade the certification fallback in `src/components/sections/Founder.tsx`**

Replace the certification block (current lines 48–65) with:

```tsx
<div className={styles.certification}>
  {founder.certification.src ? (
    <>
      <div className={styles.certImageWrap}>
        <Image
          src={founder.certification.src}
          alt={founder.certification.caption}
          fill
          loading="lazy"
          className={styles.certImage}
        />
      </div>
      <p className={styles.certCaption}>{founder.certification.caption}</p>
    </>
  ) : (
    <>
      <div className={styles.certPlaceholder} data-testid="certification-placeholder">
        <span className={styles.certPlaceholderLabel}>Image to follow</span>
      </div>
      <p className={styles.certCaption}>{founder.certification.caption}</p>
    </>
  )}
</div>
```

- [ ] **Step 5: Add the placeholder styles to `src/components/sections/Founder.module.css`**

Append after the existing `.certCaption` rule:

```css
.certPlaceholder {
  display: grid;
  place-content: center;
  max-inline-size: 200px;
  aspect-ratio: 3 / 2;
  margin-inline: auto;
  margin-block-end: var(--space-sm);
  border: 1px dashed color-mix(in srgb, var(--color-sabbia) 40%, transparent);
}

.certPlaceholderLabel {
  font-family: var(--font-sans);
  font-size: var(--text-eyebrow);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--color-sabbia);
  padding: var(--space-sm);
  text-align: center;
}
```

(The dashed 3/2 box mirrors the `.certImageWrap` footprint, so the image swap causes no layout shift.)

- [ ] **Step 6: Run tests, expect PASS; commit**

```bash
npx vitest run tests/unit/components/sections/Founder.test.tsx && npm run test && npm run typecheck
git add -A && git commit -m "feat: client-approved founder story with certification placeholder container"
```

---

### Task 8: Light `/fabrics` detail page (backs the "View Collection" CTAs)

Decision D-J. Three cards deep-link to `/fabrics#<id>`; the current page is a one-line stub. The Navigation's unscrolled state is transparent with dark text (`--color-carbone`/`--color-ardesia`), which reads correctly on this light page — no nav changes needed.

**Files:**

- Modify: `src/app/fabrics/page.tsx` (replace the stub)
- Create: `src/app/fabrics/fabrics.module.css`

**Interfaces:**

- Consumes: `collections` (Task 2 — including `tagline`), `seo.fabrics` (Task 1), `Navigation`, `Section`, `Eyebrow`, `TextLink`, `cn`, next/image. Footer + WhatsApp bar come from the root layout — do NOT add them here.
- Produces: `Section id={collection.id}` per collection, so `/fabrics#tessuti-italiani`, `#ospitalita-di-lusso`, `#interior-exterior` land on their blocks.

- [ ] **Step 1: Replace `src/app/fabrics/page.tsx`**

```tsx
// Fabrics — light V1 detail page backing the collection-card CTAs.
// Deep anchors (/fabrics#tessuti-italiani etc.) land on each block.
// Footer and WhatsApp bar render from the root layout.

import type { Metadata } from "next";
import Image from "next/image";
import { Navigation } from "@/components/layout";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextLink } from "@/components/ui/TextLink";
import { collections } from "@/data/collections";
import { seo } from "@/data/seo";
import { cn } from "@/lib/utils";
import styles from "./fabrics.module.css";

export const metadata: Metadata = {
  title: seo.fabrics.title,
  description: seo.fabrics.description,
  alternates: { canonical: seo.fabrics.canonical },
};

export default function FabricsPage() {
  return (
    <>
      <Navigation />
      <main id="main">
        <Section>
          <header className={styles.pageHeader}>
            <Eyebrow>Our collections</Eyebrow>
            <h1 className={styles.pageTitle}>Fabric Collections</h1>
          </header>
        </Section>
        {collections.map((collection, index) => (
          <Section
            key={collection.id}
            id={collection.id}
            background={index % 2 === 0 ? "gesso" : "pietra"}
            ariaLabelledby={`${collection.id}-heading`}
          >
            <div className={cn(styles.row, index % 2 === 1 && styles.reversed)}>
              <div className={styles.imageFrame}>
                <Image
                  src={collection.image.src}
                  alt={collection.image.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className={styles.image}
                />
              </div>
              <div className={styles.text}>
                <p className={styles.tagline}>{collection.tagline}</p>
                <h2
                  id={`${collection.id}-heading`}
                  className={cn(styles.title, collection.titleItalic && styles.titleItalic)}
                >
                  {collection.title}
                </h2>
                <p className={styles.body}>{collection.body}</p>
                <TextLink href="/#contact">Request a sample →</TextLink>
              </div>
            </div>
          </Section>
        ))}
      </main>
    </>
  );
}
```

Note: if `Section`'s props don't accept `id`/`background`/`ariaLabelledby` exactly as written, open `src/components/layout/Section.tsx` and match its actual prop names — the homepage sections (`Collections.tsx`, `Founder.tsx`) are the reference for correct usage. Do not add props to `Section`.

- [ ] **Step 2: Create `src/app/fabrics/fabrics.module.css`**

```css
/* Fabrics page — alternating 5/7 collection blocks reusing the card
   imagery at editorial scale (DESIGN.md §4 asymmetry). */

.pageHeader {
  display: grid;
  gap: var(--space-sm);
  padding-block-start: var(--nav-height);
}

.pageTitle {
  font-family: var(--font-serif);
  font-size: var(--text-h1);
  line-height: var(--leading-h1);
  font-weight: var(--font-weight-medium);
  color: var(--color-carbone);
}

.row {
  display: grid;
  gap: var(--space-lg);
  align-items: center;
}

@media (min-width: 1024px) {
  .row {
    grid-template-columns: repeat(12, 1fr);
    gap: var(--grid-gutter-desktop);
  }

  .imageFrame {
    grid-column: span 5;
  }

  .text {
    grid-column: span 7;
  }

  .reversed .imageFrame {
    order: 1;
  }
}

.imageFrame {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background-color: var(--color-sabbia);
}

.image {
  object-fit: cover;
}

.text {
  display: grid;
  gap: var(--space-sm);
  align-content: center;
  justify-items: start;
}

.tagline {
  font-family: var(--font-sans);
  font-size: var(--text-eyebrow);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--color-sabbia);
}

.title {
  font-family: var(--font-serif);
  font-size: var(--text-h2);
  line-height: var(--leading-h2);
  font-weight: var(--font-weight-medium);
  color: var(--color-carbone);
}

.titleItalic {
  font-style: italic;
}

.body {
  font-family: var(--font-sans);
  font-size: var(--text-body);
  line-height: var(--leading-body);
  color: var(--color-ardesia);
  max-inline-size: 60ch;
}
```

If any token here (`--text-h1`, `--leading-h1`, `--text-h2`, `--leading-h2`) doesn't exist in `globals.css`, check the token list at `src/app/globals.css:40-60` and substitute the closest existing heading tokens rather than inventing new ones.

- [ ] **Step 3: Verify in the browser + gates; commit**

```bash
npm run build && npm run test && npm run typecheck && npm run lint
npm run dev
```

Visit `http://localhost:3000/fabrics` — four alternating blocks, header clears the fixed nav, nav text legible (dark on light). Click "View Collection" on the homepage's Tessuti card → lands at `/fabrics#tessuti-italiani`.

```bash
git add -A && git commit -m "feat: light fabrics detail page backing the View Collection CTAs"
```

---

### Task 9: Documentation alignment

Docs describe intent; code describes reality — record the decision trail. No tests; prettier formats markdown on commit.

**Files:**

- Modify: `progress.md` (backlog additions)
- Modify: `PRD.md` (decision register + section contract notes)
- Modify: `DESIGN.md` (year + superseded-layout notes)
- Modify: `CLAUDE.md` (ground-truth deltas)

- [ ] **Step 1: `progress.md`** — in the "Placeholder / fine-tune backlog" list, update/add these items (keep the rest):

```markdown
- [ ] Client wordmark logo PNG staged at `public/images/logo/imperium-wordmark.png` and `SITE.logoSrc` pointed at it (hero currently renders the typographic wordmark) <!-- omit if Task 0 staged it -->
- [ ] Commissioned Italy→Gulf route illustration for the Why Imperium map slot (replaces `MediaSlot` inner markup in `WhyImperium.tsx`)
- [ ] Official Made in Italy stamp artwork for the Why Imperium stamp slot
- [ ] Real fabric photography ×4 for collection cards (incl. Interior & Exterior Design)
- [ ] Made in Italy certification scan display approval → set `founder.certification.src`
```

Remove the line `- [ ] Commissioned origin map illustration` (superseded).

- [ ] **Step 2: `PRD.md`** — append these notes (keep table formatting; find each row/section by its heading):

1. **§5 Decisions Register, D-01:** _"Resolved (client): curated named collections confirmed; a fourth collection — Interior & Exterior Design — added. Material-filter library remains a V2 option (tags kept in the data model)."_
2. **§6.2 Hero:** _"Amended (client): hero is logo-led — the wordmark renders large inside the h1 with the tagline directly beneath; the headline candidates above are retired for V1. No establishment year anywhere."_
3. **§6.3 Origin Map:** _"Superseded (client): the provenance visual moved into Why Imperium row 01 as an Italy → UAE + Gulf route placeholder; the OriginMap section (and its city-list claims) was removed from V1."_
4. **§6.4 Stats Strip:** _"Updated (client): '40+ Fabrics' confirmed; '12+ mills', '120+ fabrics', '15 years', '4 cities served' removed as unvalidated. Companion stats '4 curated collections' and '100% Italian fabrics' are team-proposed 🟡 pending Sofia's veto (see `src/data/stats.ts`)."_
5. **§6.5 Collections:** _"Updated (client): four collections; per-card promise line ('tagline') renders beneath the image; Pezzi Unici's CTA is 'Contact Us' → #contact; the other cards link to /fabrics deep anchors."_
6. **§6.6 Trust Pillars / Why Imperium:** _"Updated (client): three alternating rows — Direct From the Source (+route-map slot), Made in Italy Expertise (+stamp slot), For the Gulf's Luxury Market. The fourth pillar was removed permanently."_
7. **§6.7 Founder:** _"Resolved (client): headline 'Proudly Italian. Purposefully Global.', three bio paragraphs and the pull-quote are client-approved and live in `src/data/founder.ts`. Certification container sits below the story; caption 'Made in Italy Certification'."_

- [ ] **Step 3: `DESIGN.md`** — lighter touch-ups:

1. §9.01 Navigation — where the wordmark spec mentions the "Est." subline, append: _"(Retired: no establishment year appears anywhere on the site — client decision.)"_
2. §9.02 Hero — append: _"Amended: V1 hero is logo-led (wordmark inside the h1 + tagline beneath); eyebrow reads 'Made in Italy' with no year; the corner caption is retired."_
3. §9.04 Products — append: _"Amended: four cards; a short promise line replaces the material-tag strip beneath the image."_
4. §9.05 Why Imperium — append: _"Amended: three alternating 5/7 editorial rows with reserved map/stamp media slots replace the four-column band."_
5. §9.09 Footer — append: _"Legal line carries no year (client decision); legal entity name pending PRD B-1."_

- [ ] **Step 4: `CLAUDE.md`** — update the ground-truth sections: sections now reflect the client copy pass (logo-led hero, 3-item stats, 4 collections with taglines, WhyImperium alternating rows, new founder story, OriginMap removed, `/fabrics` detail page real); the "stats strip four invented numbers" risk (§7.6) is resolved; the collections fork (§12.1) is resolved in favour of curated collections with tags retained for a V2 filter library; year removed site-wide including runtime footer year and sitemap lastModified.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "docs: record client copy decisions and section amendments"
```

---

### Task 10: Final verification sweep and handoff

**Files:** none created — verification + push.

- [ ] **Step 1: The zero-2026 sweep (the client's hard requirement)**

```bash
grep -rn "2026" src public                    # expect: NO output
grep -rni "always available" src              # expect: NO output
grep -rn "Delivered to Dubai" src public      # expect: NO output
grep -rni "cities served\|markets served" src # expect: NO output
grep -rn "Est\." src                          # expect: NO output
```

Then against the running production build (catches runtime-rendered years — the old footer bug):

```bash
npm run build
npm run start &
sleep 4
curl -s http://localhost:3000 | grep -c "2026"           # expect: 0
curl -s http://localhost:3000/fabrics | grep -c "2026"   # expect: 0
curl -s http://localhost:3000/sitemap.xml | grep -c "2026"  # expect: 0
kill %1
```

(`grep -c` prints `0` and exits non-zero when there are no matches — `0` is the success output here.)

- [ ] **Step 2: Full quality gates**

```bash
npm run lint          # 0 errors
npm run typecheck     # 0 errors
npm run test          # all unit suites pass (existing + the new data/section tests)
npm run build         # compiles clean
npx playwright test   # 2 e2e specs pass (homepage h1 + contact form — both unaffected by design)
```

- [ ] **Step 3: The client's acceptance checklist** (walk it in the browser at 375px / 768px / 1280px; every box must hold)

- [ ] Every occurrence of "2026" removed — source, rendered HTML, metadata, sitemap (Step 1 proves it)
- [ ] Hero: logo (or typographic wordmark) leads; tagline "Premium Italian fabrics · Delivered to the Gulf" directly beneath; luxury feel preserved; both CTAs work ("Request a sample" scrolls to the contact form)
- [ ] Stats: "40+ Fabrics" leads; no "Markets/Cities Served"; no year; no mills/years claims
- [ ] Collections: 4 cards in the carousel with a 4th pagination dot; Tessuti tagline "For those who don't compromise."; Ospitalità body mentions hotels, resorts and restaurants and its tagline reads "Breathability, durability, and quality."; Interior & Exterior Design card matches the others visually
- [ ] CTAs: Pezzi Unici "Contact Us" → scrolls to #contact; the other three "View Collection" → `/fabrics#<id>` deep anchors land correctly
- [ ] Why Imperium: exactly 3 rows alternating text/media sides — 01 has the Italy→Gulf map placeholder, 02 has the Made in Italy stamp placeholder (NOT the certification image), 03 reads "For the Gulf's Luxury Market" with Gulf copy; no fourth row
- [ ] Founder: "Proudly Italian. Purposefully Global."; three new paragraphs; new quote; certification placeholder container (dashed box + "Made in Italy Certification") below the story
- [ ] No existing functionality broken: contact form still submits (mock send logs to console without `RESEND_API_KEY`), WhatsApp buttons present, mobile nav overlay opens/closes, carousel swipes, reduced-motion mode renders everything statically
- [ ] Build succeeds without errors

- [ ] **Step 4: Push and open a PR**

```bash
git push -u origin feat/homepage-refinement-client-copy
gh pr create --title "feat: homepage refinement — client copy pass" --body "$(cat <<'EOF'
## Summary
- Removes every "2026" from the site — source, runtime-rendered (footer year, sitemap lastModified), and metadata
- Logo-led hero with the Gulf tagline beneath (typographic wordmark until the client PNG is staged; one-line swap via SITE.logoSrc)
- Stats strip: 40+ Fabrics + two team-proposed stats (PRD-flagged); invented mills/years/cities claims removed
- Four collections incl. new Interior & Exterior Design; per-card taglines; Pezzi Unici CTA → Contact
- Why Imperium: 3 alternating rows with Italy→Gulf map + Made in Italy stamp placeholders; fourth pillar removed
- Founder story replaced with client-approved copy; certification placeholder container below the story
- OriginMap section removed (superseded by the Why Imperium map row)
- Light /fabrics detail page backs the View Collection deep links
- PRD/DESIGN/CLAUDE/progress docs updated with the decision trail

Site remains noindex (NEXT_PUBLIC_ALLOW_INDEXING unset). Contact form, WhatsApp, motion layer untouched.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

**Contingency:** if `git push` is rejected with a permissions error, you are not a collaborator on `Akshay-M-Singh/Imperium`: either ask Akshay to add you (Settings → Collaborators) or `gh repo fork --remote` and open the PR cross-repo. The Vercel preview builds from the PR automatically; production is untouched until merge.

---

## Deferred by design (do NOT let these creep in)

- Real logo PNG swap (`SITE.logoSrc`), route-map illustration, stamp artwork, Sofia's portrait, certification display, hero video, collection photography — asset swaps into containers this plan builds/keeps.
- Contact form changes, WhatsApp number, Resend keys — separate operational decisions (PRD D-06/D-08).
- Testimonials — hidden until ≥1 real quote (D-10).
- Domain registration, indexing flip, favicons, OG image — launch phase (6.B) gates.
- Material-filter fabric library — V2 (tags retained in the data model for it).

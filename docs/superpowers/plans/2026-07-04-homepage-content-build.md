> **⛔ SUPERSEDED (2026-07-05): do not execute.** Written against HEAD `6031497` when all sections were stubs; the sections have since been built with different copy (commits `f0a2311`…`dadcd1f`). Executing these tasks would overwrite working features. The client-approved copy it records is carried forward by `2026-07-05-homepage-refinement-client-copy.md`.

# Homepage Content Build & Brand Refinement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Imperium homepage sections (Hero, Stats, Collections, Why Imperium, Founder, Contact, Nav, Footer) with the client-approved copy delivered 2026-07-04 — logo-led hero, four collections, three alternating "Why Imperium" rows with map/stamp placeholders, new founder story — and remove every mention of "2026" from the site.

**Architecture:** Next.js 15 App Router server components composing the already-implemented Phase-1 foundation (`Section`, `SectionHeader`, `Eyebrow`, `Button`, `TextLink`). All copy lives in typed `src/data/` files (PRD §7 rule); components render data only. CSS Modules with the token system in `globals.css`. Static build — the Framer Motion layer stays deferred to roadmap Phase 5; only CSS-token micro-interactions ship now.

**Tech Stack:** Next.js 15.5 · React 19 · TypeScript strict · CSS Modules · Vitest 2 + Testing Library · Playwright.

## Context You Must Know Before Starting

1. **Work in `/Users/rahique/Desktop/Builds/Imperium`** — the real git clone, in sync with GitHub `main` (HEAD `6031497`). Do **not** work in `/Users/rahique/Desktop/Builds/Imperium-main` — that is a stale ZIP snapshot, ~10 commits behind, whose only value is the image assets the client dropped there on 2026-07-04 (Task 0 imports them).
2. **There are no built sections anywhere.** Every file in `src/components/sections/` returns `null` or a bare heading. The change request reads like edits to an existing site; in this repo each "change" is the _target state_ of a section being built for the first time. Where the request says "change X to Y", implement Y.
3. **The foundation components are real and tested** (`Section`, `SectionHeader`, `Eyebrow`, `Button`, `TextLink` + CSS Modules + unit tests). Compose them; do not reinvent them.
4. **The site must stay non-indexable.** `NEXT_PUBLIC_ALLOW_INDEXING` stays unset. Do not touch `robots.ts` or the indexing gate.
5. **House style** (copy it exactly): CSS logical properties (`padding-inline`, `max-inline-size`, `min-block-size`), design tokens for every colour/size/duration, media queries at `768px`/`1024px`/`1440px` min-width, `color-mix` for hover shades, file-top comments citing `DESIGN.md` sections, named export + default export per component, tests with Testing Library `getByRole` idiom.

## Global Constraints

- **Zero "2026" anywhere in `src/` or `public/` or served HTML.** (Planning docs under `docs/` and this plan's filename are not served — exempt.)
- **All copy lives in `src/data/` or `src/lib/site.ts`** — a hard-coded UI string in a component is a defect (PRD §7).
- **No new dependencies. No icons** (the `→` / `↓` arrow characters are allowed — DESIGN.md §10). No Tailwind, no GSAP, no component libraries.
- **Conventional commits** — commitlint enforces `feat:`/`fix:`/`docs:`/`test:`/`chore:` prefixes. Husky pre-commit runs eslint+prettier on staged files.
- **WCAG 2.1 AA:** exactly one `h1` per page, no skipped heading levels, `prefers-reduced-motion` respected (the token collapse in `globals.css` already handles CSS animations).
- **Never run `npm audit fix --force`** (it downgrades Next).
- Node ≥ 20.11, npm 10.8.1. Verification gates: `npm run lint && npm run typecheck && npm run test && npm run build`.

---

### Task 0: Workspace, branch, and asset import

**Files:**

- Create: `public/images/logo/imperium-wordmark.png` (copied)
- Create: `public/images/collections/{tessuti-italiani,pezzi-unici,ospitalita-di-lusso,interior-exterior}.png` (copied)
- Create: `public/images/certifications/made-in-italy-certificate.png` (copied — stored for later, NOT rendered in this plan)
- Commit: this plan file (already at `docs/superpowers/plans/2026-07-04-homepage-content-build.md`)

**Interfaces:**

- Consumes: client assets sitting in the stale snapshot folder `Imperium-main`.
- Produces: kebab-case asset paths every later task references: `/images/logo/imperium-wordmark.png` (500×500, transparent-ish), `/images/collections/tessuti-italiani.png` (370×560), `/images/collections/pezzi-unici.png` (380×560), `/images/collections/ospitalita-di-lusso.png` (430×560), `/images/collections/interior-exterior.png` (1402×1122, landscape — will be centre-cropped by `object-fit: cover`).

- [ ] **Step 1: Confirm the clone is current and clean**

```bash
cd /Users/rahique/Desktop/Builds/Imperium
git status --short        # expect: only the untracked plan file
git log --oneline -1      # expect: 6031497 feat: implement TextLink animated underline
git pull --ff-only origin main
```

If `git pull` brings new commits, STOP and re-read the changed files before continuing (someone else pushed since 2026-07-04).

- [ ] **Step 2: Create the feature branch**

```bash
git checkout -b feat/homepage-content-build
```

- [ ] **Step 3: Import and rename the client assets**

```bash
SRC="/Users/rahique/Desktop/Builds/Imperium-main/public/images"
mkdir -p public/images/logo public/images/collections public/images/certifications
cp "$SRC/Logo/Logo_main-removebg-preview.png"            public/images/logo/imperium-wordmark.png
cp "$SRC/Collection types/tessuti italiani.png"          public/images/collections/tessuti-italiani.png
cp "$SRC/Collection types/limited edition.png"           public/images/collections/pezzi-unici.png
cp "$SRC/Collection types/hospitality.png"               public/images/collections/ospitalita-di-lusso.png
cp "$SRC/Collection types/interior&exterior design.png"  public/images/collections/interior-exterior.png
cp "$SRC/Main certification/"Screenshot*.png             public/images/certifications/made-in-italy-certificate.png
```

Deliberately NOT imported: `images.png` / `images-1.png` (web-downloaded "100% Made in Italy" roundel and OEKO-TEX badge — third-party certification marks; using them is a founder decision with licensing implications), `Logo main.jpeg` (has a baked-in background; the PNG is the usable one), the empty `Founder/` folder.

- [ ] **Step 4: Verify and commit**

```bash
ls -la public/images/logo public/images/collections public/images/certifications
npm run dev   # boots clean on :3000, Ctrl-C afterwards
git add public/images docs/superpowers/plans/2026-07-04-homepage-content-build.md
git commit -m "chore: add brand assets and homepage build plan"
```

---

### Task 1: Brand data sweep — kill "2026", retarget Dubai → Gulf

**Files:**

- Modify: `src/lib/site.ts`
- Modify: `src/app/layout.tsx:7-12` (title + description only)
- Modify: `src/data/seo.ts`
- Modify: `src/app/globals.css:22` (comment only)
- Modify: `package.json:5` (description only)
- Test: `tests/unit/data/site.test.ts` (new)

**Interfaces:**

- Produces: `SITE.tagline === "Premium Italian fabrics · Delivered to the Gulf"` (Hero and Footer render this string); `SITE` no longer has an `established` key (nothing consumed it — verified by grep).

- [ ] **Step 1: Write the failing test**

Create `tests/unit/data/site.test.ts`:

```tsx
import { describe, it, expect } from "vitest";
import { SITE } from "@/lib/site";

describe("SITE brand configuration", () => {
  it("carries the Gulf tagline", () => {
    expect(SITE.tagline).toBe("Premium Italian fabrics · Delivered to the Gulf");
  });

  it("has no established-year field and no 2026 anywhere", () => {
    expect(SITE).not.toHaveProperty("established");
    expect(JSON.stringify(SITE)).not.toMatch(/2026/);
  });
});
```

- [ ] **Step 2: Run it — expect FAIL**

```bash
npx vitest run tests/unit/data/site.test.ts
```

Expected: FAIL — tagline says "Delivered to Dubai" and `established: 2026` exists.

- [ ] **Step 3: Edit `src/lib/site.ts`**

Remove the `established` line entirely and change the tagline. The file becomes:

```ts
// Site — brand configuration. The single source of truth for things that
// would otherwise be magic strings scattered across components.
// No founding-year field by client decision (2026-07-04): the site shows
// no establishment year anywhere.

export const SITE = {
  name: "Imperium Italian Textile",
  shortName: "Imperium",
  tagline: "Premium Italian fabrics · Delivered to the Gulf",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://imperiumitaliantextile.com",
  email: "hello@imperiumitaliantextile.com",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  instagram: "https://instagram.com/imperiumitaliantextile",
  instagramHandle: "@imperiumitaliantextile",
  location: "Dubai, UAE · Italy",
  locale: "en_AE" as const,
  locales: ["en", "ar"] as const,
} as const;
```

- [ ] **Step 4: Edit `src/app/layout.tsx` metadata**

Replace the `title.default` and both `description` strings (the phrase "sourced directly" is also softened per PRD §11 — "directly" is an unconfirmed B-3 claim):

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

- [ ] **Step 5: Edit `src/data/seo.ts`**

Update `home` and `fabrics` to match (other entries unchanged):

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

- [ ] **Step 6: Scrub the two non-rendered stragglers**

`src/app/globals.css` line 22 — the comment mentions "Est. 2026". Change to:

```css
--color-oro-antico: #c4a76c; /* founder quote, hover accents */
```

`package.json` `"description"` — change to:

```json
  "description": "Imperium Italian Textile — premium Italian fabrics delivered to the Gulf's most discerning tailors, designers and hospitality groups.",
```

- [ ] **Step 7: Run tests + sweep, expect PASS and zero hits**

```bash
npx vitest run tests/unit/data/site.test.ts   # PASS
grep -rn "2026" src public                    # expect: no output
grep -rn "Delivered to Dubai" src             # expect: no output
```

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: remove founding year and retarget brand copy from Dubai to the Gulf"
```

---

### Task 2: Collections data — four collections, final copy, new CTAs

**Files:**

- Modify: `src/types/collections.ts`
- Modify: `src/data/collections.ts`
- Test: `tests/unit/data/collections.test.ts` (new)

**Interfaces:**

- Produces: `CollectionCard` gains required `tagline: string` (the short phrase rendered beneath the card image). `collections: CollectionsData` has exactly 4 entries in order `tessuti-italiani`, `pezzi-unici`, `ospitalita-di-lusso`, `interior-exterior`. Task 7 (FabricCard/Collections) and Task 11 (/fabrics page) consume this exact shape.
- CTA contract: Pezzi Unici → `{ label: "Contact Us", href: "#contact" }`; the other three → `{ label: "View Collection", href: "/fabrics#<id>" }`.

- [ ] **Step 1: Write the failing test**

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

  it("contains no 2026 and points at real image files", () => {
    expect(JSON.stringify(collections)).not.toMatch(/2026/);
    for (const c of collections) {
      expect(c.image.src).toMatch(/^\/images\/collections\/[a-z-]+\.png$/);
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

// Collections — the four curated collections (client-confirmed 2026-07-04,
// resolving PRD D-01 in favour of curated collections; DESIGN.md §9.04).
// `tags` are kept on the model as groundwork for a future filterable
// library (PRD D-01c) even though the cards render `tagline` instead.

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
      src: "/images/collections/tessuti-italiani.png",
      alt: "Folded bolts of Italian linen, silk, wool and cotton in warm neutral tones",
    },
  },
  {
    id: "pezzi-unici",
    tags: ["RARE", "LIMITED", "ONE OF A KIND"],
    tagAccent: "oro-antico",
    title: "Pezzi Unici",
    titleItalic: true,
    tagline: "Rare, limited, one of a kind.",
    body: "Small runs, discontinued weaves, single bolts. When a piece is gone, it is gone — which is precisely the point.",
    cta: { label: "Contact Us", href: "#contact" },
    image: {
      src: "/images/collections/pezzi-unici.png",
      alt: "A single bolt of rare, limited-edition Italian fabric",
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
      src: "/images/collections/ospitalita-di-lusso.png",
      alt: "Layered hospitality fabrics staged in a luxury hotel interior",
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
      src: "/images/collections/interior-exterior.png",
      alt: "Premium Italian textiles styled across an indoor-outdoor living space",
    },
  },
];
```

Notes locked in here: `titleItalic: false` on the new collection — italics mark Italian-language titles (DESIGN.md §9.04); "Interior & Exterior Design" is English. Pezzi Unici's tagline is derived from its existing tag strip, since the client specified taglines only for the other cards.

- [ ] **Step 5: Run tests, expect PASS; commit**

```bash
npx vitest run tests/unit/data/collections.test.ts && npm run typecheck
git add -A && git commit -m "feat: four-collection data model with client-approved copy and CTAs"
```

---

### Task 3: Why Imperium data — three alternating items with media slots

**Files:**

- Modify: `src/data/pillars.ts` (full rewrite — new exported shape)
- Test: `tests/unit/data/pillars.test.ts` (new)

**Interfaces:**

- Produces (consumed by Task 8's `WhyImperium` section):

```ts
export type PillarMedia = "map" | "stamp" | null;
export interface WhyImperiumItem {
  number: string; // "01" | "02" | "03"
  heading: string;
  paragraphs: string[]; // 1–2 paragraphs each
  media: PillarMedia; // which placeholder container the row reserves
}
export const whyImperium: {
  eyebrow: string;
  headline: string;
  items: WhyImperiumItem[];
};
```

- The old `pillars` export and 4-item shape are deleted (nothing imports them yet — the TrustPillars stub takes no data).

- [ ] **Step 1: Write the failing test**

Create `tests/unit/data/pillars.test.ts`:

```tsx
import { describe, it, expect } from "vitest";
import { whyImperium } from "@/data/pillars";

describe("whyImperium data", () => {
  it("has exactly three items — 'Always available' is gone", () => {
    expect(whyImperium.items).toHaveLength(3);
    expect(JSON.stringify(whyImperium)).not.toMatch(/always available/i);
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
// editorial rows (client direction 2026-07-04; supersedes the four-in-a-row
// manifesto in DESIGN.md §9.05 and absorbs the origin-map idea from §9.03).
// "Always available" was removed by client decision — do not re-add.

export type PillarMedia = "map" | "stamp" | null;

export interface WhyImperiumItem {
  number: string;
  heading: string;
  paragraphs: string[];
  /** Reserved visual slot: "map" (Italy → Gulf route), "stamp" (Made in
   *  Italy badge), or null for a text-only row. Real artwork lands later. */
  media: PillarMedia;
}

export const whyImperium: {
  eyebrow: string;
  headline: string;
  items: WhyImperiumItem[];
} = {
  eyebrow: "Why Imperium",
  headline: "The Imperium standard.",
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

- [ ] **Step 4: Run tests + typecheck, expect PASS; commit**

```bash
npx vitest run tests/unit/data/pillars.test.ts && npm run typecheck
git add -A && git commit -m "feat: restructure trust pillars into three Why Imperium rows with media slots"
```

---

### Task 4: Founder data — the new story

**Files:**

- Modify: `src/data/founder.ts`
- Test: `tests/unit/data/founder.test.ts` (new)

**Interfaces:**

- Produces (consumed by Task 9's `Founder` section): same `FounderData` interface except `portrait.src` becomes `string | null` (null = render placeholder). `certification.src: string | null` already exists — stays `null` until the founder approves displaying the scan (asset already stored at `/images/certifications/made-in-italy-certificate.png`).

- [ ] **Step 1: Write the failing test**

Create `tests/unit/data/founder.test.ts`:

```tsx
import { describe, it, expect } from "vitest";
import { founder } from "@/data/founder";

describe("founder data", () => {
  it("carries the client-approved headline and quote", () => {
    expect(founder.headline).toBe("Proudly Italian. Purposefully Global.");
    expect(founder.quote).toBe(
      "Every fabric I select represents not only Italian craftsmanship, but my own commitment to excellence.",
    );
  });

  it("has the three approved bio paragraphs", () => {
    expect(founder.bioParagraphs).toHaveLength(3);
    expect(founder.bioParagraphs[0]).toMatch(/^Born and raised in Italy/);
    expect(founder.bioParagraphs[2]).toMatch(/more than a textile supplier/);
  });

  it("keeps portrait and certification as pending placeholders", () => {
    expect(founder.portrait.src).toBeNull();
    expect(founder.certification.src).toBeNull();
    expect(founder.certification.caption).toBe("Made in Italy Certification");
  });
});
```

- [ ] **Step 2: Run it — expect FAIL**

```bash
npx vitest run tests/unit/data/founder.test.ts
```

- [ ] **Step 3: Rewrite `src/data/founder.ts`**

```ts
// Founder — Sofia Mazza bio, quote, certification (DESIGN.md §9.06).
// Copy client-approved 2026-07-04. The certification scan exists at
// /images/certifications/made-in-italy-certificate.png — set
// certification.src to that path when the founder approves showing it.

export interface FounderData {
  eyebrow: string;
  headline: string;
  bioParagraphs: string[];
  portrait: { src: string | null; alt: string; caption: string };
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
    src: null, // null until Sofia's portrait arrives → /images/about/sofia-portrait.jpg
    alt: "Sofia Mazza, Founder of Imperium Italian Textile",
    caption: "Sofia Mazza, Founder",
  },
  quote:
    "Every fabric I select represents not only Italian craftsmanship, but my own commitment to excellence.",
  quoteAttribution: "Sofia Mazza, Founder",
  certification: {
    src: null, // asset stored at /images/certifications/... — founder approval pending
    caption: "Made in Italy Certification",
  },
};
```

- [ ] **Step 4: Run tests + typecheck, expect PASS; commit**

```bash
npx vitest run tests/unit/data/founder.test.ts && npm run typecheck
git add -A && git commit -m "feat: client-approved founder story, quote and placeholder policy"
```

---

### Task 5: Stats — data file, StatBlock, StatsStrip section

**Files:**

- Create: `src/data/stats.ts`
- Modify: `src/components/ui/StatBlock.tsx` (implement stub)
- Create: `src/components/ui/StatBlock.module.css`
- Modify: `src/components/sections/StatsStrip.tsx` (implement stub)
- Create: `src/components/sections/StatsStrip.module.css`
- Test: `tests/unit/data/stats.test.ts`, `tests/unit/components/ui/StatBlock.test.tsx` (new)

**Interfaces:**

- Consumes: `Section` (`@/components/layout/Section`), tokens.
- Produces: `stats: StatItem[]` where `interface StatItem { value: number; suffix?: string; label: string }`; `<StatBlock value suffix? label />`; `<StatsStrip />` (no props — reads data). Task 11 mounts `<StatsStrip />`.

Content decision (surface to the founder later): the client confirmed "40+ Fabrics" and removed "4 Markets Served" and the year. A one-number strip looks thin, so two team-proposed 🟡 stats accompany it — "4 Curated collections" (true by construction) and "100% Italian fabrics" (definitionally true of the sourcing model). Both are trivially deletable from `stats.ts` if Sofia vetoes them; PRD updated in Task 12.

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/data/stats.test.ts`:

```tsx
import { describe, it, expect } from "vitest";
import { stats } from "@/data/stats";

describe("stats data", () => {
  it("leads with 40+ fabrics and contains no markets-served or year stat", () => {
    expect(stats[0]).toEqual({ value: 40, suffix: "+", label: "Fabrics" });
    const flat = JSON.stringify(stats);
    expect(flat).not.toMatch(/2026/);
    expect(flat).not.toMatch(/markets/i);
  });
});
```

Create `tests/unit/components/ui/StatBlock.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatBlock } from "@/components/ui/StatBlock";

describe("StatBlock", () => {
  it("renders value with suffix and label", () => {
    render(<StatBlock value={40} suffix="+" label="Fabrics" />);
    expect(screen.getByText("40+")).toBeInTheDocument();
    expect(screen.getByText("Fabrics")).toBeInTheDocument();
  });

  it("renders value without suffix", () => {
    render(<StatBlock value={4} label="Curated collections" />);
    expect(screen.getByText("4")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run them — expect FAIL**

```bash
npx vitest run tests/unit/data/stats.test.ts tests/unit/components/ui/StatBlock.test.tsx
```

- [ ] **Step 3: Create `src/data/stats.ts`**

```ts
// Stats strip — client-confirmed "40+ Fabrics" (2026-07-04).
// "Markets served" and the founding year were removed by client decision.
// The two companion stats are team-proposed 🟡 (PRD §6.4) — delete a line
// here if the founder vetoes it; the strip lays out 1–3 items cleanly.

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

- [ ] **Step 4: Implement `src/components/ui/StatBlock.tsx`**

```tsx
// StatBlock — single stat number + label (Roadmap Phase 3.3).
// Static for now; the CountUp motion wrapper arrives in Phase 5
// (MOTION_SPEC.md §3.7).

import type { ReactNode } from "react";
import styles from "./StatBlock.module.css";

export interface StatBlockProps {
  value: number;
  label: string;
  suffix?: string;
}

export function StatBlock({ value, label, suffix }: StatBlockProps): ReactNode {
  return (
    <div className={styles.stat}>
      <span className={styles.value}>
        {value}
        {suffix ?? ""}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export default StatBlock;
```

Create `src/components/ui/StatBlock.module.css`:

```css
/* StatBlock — DESIGN.md §9.03: number in Cormorant 42px Carbone,
   label in DM Sans 13px Sabbia beneath. */

.stat {
  display: grid;
  gap: var(--space-xxs);
  justify-items: center;
  text-align: center;
}

.value {
  font-family: var(--font-serif);
  font-size: var(--text-h2);
  line-height: var(--leading-h2);
  color: var(--color-carbone);
}

.label {
  font-family: var(--font-sans);
  font-size: var(--text-caption);
  letter-spacing: var(--tracking-caption);
  color: var(--color-sabbia);
}
```

- [ ] **Step 5: Implement `src/components/sections/StatsStrip.tsx`**

```tsx
// StatsStrip — full-width Gesso band between sections (DESIGN.md §9.03
// "a plinth between two floors"). Reads src/data/stats.ts.
// Section takes no aria-label (see SectionProps) and a strip of figures
// needs no landmark label — do not add props to Section for this.

import { Section } from "@/components/layout/Section";
import { StatBlock } from "@/components/ui/StatBlock";
import { stats } from "@/data/stats";
import styles from "./StatsStrip.module.css";

export function StatsStrip() {
  return (
    <Section background="gesso" dense>
      <div className={styles.strip}>
        {stats.map((stat) => (
          <StatBlock key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
        ))}
      </div>
    </Section>
  );
}

export default StatsStrip;
```

Create `src/components/sections/StatsStrip.module.css`:

```css
/* StatsStrip — centred columns with hairline separators
   (DESIGN.md §9.03: 1px Sabbia at 20% opacity between stats). */

.strip {
  display: grid;
  gap: var(--space-lg);
}

@media (min-width: 768px) {
  .strip {
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    align-items: center;
  }

  .strip > * + * {
    border-inline-start: 1px solid color-mix(in srgb, var(--color-sabbia) 20%, transparent);
  }
}
```

- [ ] **Step 6: Run tests + typecheck, expect PASS; commit**

```bash
npx vitest run tests/unit/data/stats.test.ts tests/unit/components/ui/StatBlock.test.tsx
npm run typecheck
git add -A && git commit -m "feat: stats strip with 40+ fabrics stat"
```

---

### Task 6: Hero — logo-led hierarchy

**Files:**

- Modify: `tests/setup.ts` (add next/image mock — first image-consuming component)
- Modify: `src/components/sections/Hero.tsx` (implement stub)
- Create: `src/components/sections/Hero.module.css`
- Test: `tests/unit/components/sections/Hero.test.tsx` (new)

**Interfaces:**

- Consumes: `SITE` (`@/lib/site`), `Button`, `TextLink`, logo at `/images/logo/imperium-wordmark.png` (500×500).
- Produces: `<Hero />` (no props) containing the page's only `h1` (the logo image inside it carries the accessible name). Task 11 mounts it first in `<main>`.

- [ ] **Step 1: Add the next/image mock to `tests/setup.ts`**

The whole file becomes:

```ts
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import React from "react";

// next/image needs the Next runtime; in jsdom render a plain <img> and
// strip Next-only boolean props so they don't hit the DOM as attributes.
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { priority: _priority, fill: _fill, sizes: _sizes, ...rest } = props;
    return React.createElement("img", rest as React.ImgHTMLAttributes<HTMLImageElement>);
  },
}));
```

Run the full suite once to prove the mock breaks nothing: `npm run test` → all existing tests PASS.

- [ ] **Step 2: Write the failing Hero test**

Create `tests/unit/components/sections/Hero.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/sections/Hero";
import { SITE } from "@/lib/site";

describe("Hero", () => {
  it("leads with the logo as the h1 and the tagline directly beneath", () => {
    render(<Hero />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(screen.getByRole("img", { name: SITE.name })).toBeInTheDocument();
    expect(screen.getByText(SITE.tagline)).toBeInTheDocument();
  });

  it("offers the two conversion paths", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: "Explore our fabrics" })).toHaveAttribute(
      "href",
      "#collections",
    );
    expect(screen.getByRole("link", { name: /Request a sample/ })).toHaveAttribute(
      "href",
      "#contact",
    );
  });

  it("contains no year", () => {
    const { container } = render(<Hero />);
    expect(container.textContent).not.toMatch(/2026/);
  });
});
```

- [ ] **Step 3: Run it — expect FAIL** (Hero renders null)

```bash
npx vitest run tests/unit/components/sections/Hero.test.tsx
```

- [ ] **Step 4: Implement `src/components/sections/Hero.tsx`**

```tsx
// Hero — full-viewport brand opening (DESIGN.md §9.02, amended by client
// direction 2026-07-04: the wordmark logo leads, with the positioning
// tagline directly beneath it). Entry cascade is CSS-only (Roadmap 2.6);
// motion tokens collapse to 0ms under prefers-reduced-motion.

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextLink } from "@/components/ui/TextLink";
import { SITE } from "@/lib/site";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-label={SITE.name}>
      <div className={styles.stack}>
        <div className={styles.eyebrow}>
          <Eyebrow>Made in Italy</Eyebrow>
        </div>
        <h1 className={styles.logo}>
          <Image
            src="/images/logo/imperium-wordmark.png"
            alt={SITE.name}
            width={500}
            height={500}
            priority
            className={styles.logoImage}
          />
        </h1>
        <p className={styles.tagline}>{SITE.tagline}</p>
        <div className={styles.actions}>
          <Button variant="ghost" href="#collections">
            Explore our fabrics
          </Button>
          <TextLink href="#contact">Request a sample →</TextLink>
        </div>
      </div>
      <span className={styles.scrollLine} aria-hidden="true" />
    </section>
  );
}

export default Hero;
```

- [ ] **Step 5: Create `src/components/sections/Hero.module.css`**

```css
/* Hero — logo-led, Pietra ground, centred stack. The 500×500 logo canvas
   has generous internal padding, so negative block margins on the image
   tighten the visual rhythm without touching the asset. */

.hero {
  position: relative;
  min-block-size: 100svh;
  display: grid;
  place-items: center;
  padding-block: calc(var(--nav-height) + var(--space-lg)) var(--space-2xl);
  padding-inline: var(--grid-margin-mobile);
  background-color: var(--color-pietra);
  text-align: center;
}

.stack {
  display: grid;
  justify-items: center;
  gap: var(--space-md);
}

.logo {
  margin: 0;
  line-height: 0;
}

.logoImage {
  inline-size: min(520px, 82vw);
  block-size: auto;
  margin-block: calc(-1 * var(--space-xl));
}

.tagline {
  font-family: var(--font-sans);
  font-size: var(--text-body-large);
  color: var(--color-ardesia);
  letter-spacing: var(--tracking-caption);
  max-inline-size: 540px;
}

.actions {
  display: grid;
  justify-items: center;
  gap: var(--space-md);
  margin-block-start: var(--space-lg);
}

/* Entry cascade — 80ms stagger (Roadmap 2.6). Durations are tokens, so
   prefers-reduced-motion collapses the whole cascade to instant. */

@keyframes heroRise {
  from {
    opacity: 0;
    transform: translateY(var(--motion-distance-md));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.eyebrow,
.logo,
.tagline,
.actions {
  animation: heroRise var(--motion-duration-slow) var(--motion-ease-out) both;
}

.logo {
  animation-delay: 80ms;
}

.tagline {
  animation-delay: 160ms;
}

.actions {
  animation-delay: 240ms;
}

/* Scroll indicator — thin pulsing line (DESIGN.md §9.02). */

@keyframes scrollPulse {
  0%,
  100% {
    opacity: 0.15;
  }
  50% {
    opacity: 0.55;
  }
}

.scrollLine {
  position: absolute;
  inset-block-end: var(--space-lg);
  inset-inline-start: 50%;
  inline-size: 1px;
  block-size: 48px;
  background-color: var(--color-sabbia);
  animation: scrollPulse 2s var(--motion-ease-in-out) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .scrollLine {
    opacity: 0.3;
  }
}
```

- [ ] **Step 6: Run tests, expect PASS**

```bash
npx vitest run tests/unit/components/sections/Hero.test.tsx && npm run test
```

- [ ] **Step 7: Visual check of the logo plate (decision point)**

```bash
npm run dev
```

Mount check isn't possible until Task 11 assembles the page — so temporarily view it: open `http://localhost:3000` — the scaffold still shows. Instead verify the asset itself renders cleanly on Pietra: open `http://localhost:3000/images/logo/imperium-wordmark.png` and judge against `#FAF8F3`. **Known risk:** the "removebg" export may retain a faint off-white rounded plate. If plate edges are visible when the full page assembles (Task 11 Step 6 re-checks this), the fix is to re-export a true transparent PNG (Preview.app → remove background, or remove.bg) and overwrite `public/images/logo/imperium-wordmark.png` — no code change needed. Long-term: request the logo as SVG (PRD asset A-1).

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: logo-led hero with tagline, CTAs and entry cascade"
```

---

### Task 7: FabricCard + Collections section (four cards)

**Files:**

- Modify: `src/components/ui/FabricCard.tsx` (implement stub — props change from `collectionId` to the full card object)
- Create: `src/components/ui/FabricCard.module.css`
- Modify: `src/components/sections/Collections.tsx` (implement stub)
- Create: `src/components/sections/Collections.module.css`
- Test: `tests/unit/components/ui/FabricCard.test.tsx`, `tests/unit/components/sections/Collections.test.tsx` (new)

**Interfaces:**

- Consumes: `CollectionCard` type + `collections` data (Task 2), `Section`, `SectionHeader`, `TextLink`, next/image.
- Produces: `<FabricCard card={CollectionCard} />`; `<Collections />` renders `Section id="collections"` with 4 cards. Task 11 mounts `<Collections />`; hero + nav link to `#collections`.

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/components/ui/FabricCard.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FabricCard } from "@/components/ui/FabricCard";
import type { CollectionCard } from "@/types/collections";

const card: CollectionCard = {
  id: "tessuti-italiani",
  tags: ["LINEN"],
  title: "Tessuti Italiani",
  titleItalic: true,
  tagline: "For those who don't compromise.",
  body: "Body copy.",
  cta: { label: "View Collection", href: "/fabrics#tessuti-italiani" },
  image: { src: "/images/collections/tessuti-italiani.png", alt: "Folded bolts of fabric" },
};

describe("FabricCard", () => {
  it("renders image, tagline beneath it, italic title, body and CTA", () => {
    render(<FabricCard card={card} />);
    expect(screen.getByRole("img", { name: "Folded bolts of fabric" })).toBeInTheDocument();
    expect(screen.getByText("For those who don't compromise.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Tessuti Italiani" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View Collection/ })).toHaveAttribute(
      "href",
      "/fabrics#tessuti-italiani",
    );
  });
});
```

Create `tests/unit/components/sections/Collections.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Collections } from "@/components/sections/Collections";

describe("Collections", () => {
  it("renders all four collections including Interior & Exterior Design", () => {
    render(<Collections />);
    for (const title of [
      "Tessuti Italiani",
      "Pezzi Unici",
      "Ospitalità di Lusso",
      "Interior & Exterior Design",
    ]) {
      expect(screen.getByRole("heading", { level: 3, name: title })).toBeInTheDocument();
    }
  });

  it("routes Pezzi Unici to the contact section", () => {
    render(<Collections />);
    expect(screen.getByRole("link", { name: /Contact Us/ })).toHaveAttribute("href", "#contact");
  });

  it("exposes the #collections anchor", () => {
    const { container } = render(<Collections />);
    expect(container.querySelector("#collections")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run them — expect FAIL**

```bash
npx vitest run tests/unit/components/ui/FabricCard.test.tsx tests/unit/components/sections/Collections.test.tsx
```

- [ ] **Step 3: Implement `src/components/ui/FabricCard.tsx`**

```tsx
// FabricCard — 4:5 portrait image + tagline strip + italic title + body
// + CTA (DESIGN.md §9.04, amended 2026-07-04: a short promise line sits
// beneath the image where the material-tag strip was; tags stay in the
// data model for the future filterable library). TiltCard wrapper lands
// in Phase 5.6.

import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TextLink } from "@/components/ui/TextLink";
import type { CollectionCard } from "@/types/collections";
import styles from "./FabricCard.module.css";

export interface FabricCardProps {
  card: CollectionCard;
}

export function FabricCard({ card }: FabricCardProps): ReactNode {
  return (
    <article id={card.id} className={styles.card}>
      <div className={styles.imageFrame}>
        <Image
          src={card.image.src}
          alt={card.image.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 85vw"
          className={styles.image}
        />
      </div>
      <p className={cn(styles.tagline, card.tagAccent === "oro-antico" && styles.taglineGold)}>
        {card.tagline}
      </p>
      <h3 className={cn(styles.title, card.titleItalic && styles.titleItalic)}>{card.title}</h3>
      <p className={styles.body}>{card.body}</p>
      <div className={styles.cta}>
        <TextLink href={card.cta.href}>{card.cta.label} →</TextLink>
      </div>
    </article>
  );
}

export default FabricCard;
```

- [ ] **Step 4: Create `src/components/ui/FabricCard.module.css`**

```css
/* FabricCard — no borders, no shadows, no background (DESIGN.md §9.04:
   "the grid does the work"). Hover scales the image inside its clipped
   frame. */

.card {
  display: grid;
  gap: var(--space-sm);
  align-content: start;
}

.imageFrame {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
}

.image {
  object-fit: cover;
  transition: transform var(--motion-duration-slow) var(--motion-ease-out);
}

.card:hover .image {
  transform: scale(1.03);
}

.tagline {
  font-family: var(--font-sans);
  font-size: var(--text-eyebrow);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--color-sabbia);
}

.taglineGold {
  color: var(--color-oro-antico);
}

.title {
  font-size: 28px; /* DESIGN.md §9.04 card title size */
  font-weight: var(--font-weight-medium);
  line-height: var(--leading-h3);
}

.titleItalic {
  font-style: italic; /* italics mark Italian-language titles */
}

.body {
  font-size: var(--text-body);
  color: var(--color-ardesia);
}

.cta {
  font-size: var(--text-caption);
  font-weight: var(--font-weight-medium);
  color: var(--color-blu-notte);
}
```

- [ ] **Step 5: Implement `src/components/sections/Collections.tsx`**

```tsx
// Collections — SectionHeader + four FabricCards (DESIGN.md §9.04;
// four collections per client decision 2026-07-04, resolving PRD D-01).
// Mobile: CSS scroll-snap row (Roadmap 3.9; Embla replaces it in Phase 5).

import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FabricCard } from "@/components/ui/FabricCard";
import { collections } from "@/data/collections";
import styles from "./Collections.module.css";

export function Collections() {
  return (
    <Section id="collections" ariaLabelledby="collections-heading">
      <SectionHeader
        id="collections-heading"
        eyebrow="Our collections"
        headline="Fabric with a story."
      />
      <div className={styles.grid}>
        {collections.map((card) => (
          <FabricCard key={card.id} card={card} />
        ))}
      </div>
    </Section>
  );
}

export default Collections;
```

- [ ] **Step 6: Create `src/components/sections/Collections.module.css`**

```css
/* Collections grid — 4-up desktop, 2-up tablet, scroll-snap row on
   mobile (Roadmap 3.9). */

.grid {
  margin-block-start: var(--space-xl);
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 85%;
  gap: var(--grid-gutter-mobile);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-block-end: var(--space-sm);
}

.grid > * {
  scroll-snap-align: start;
}

@media (min-width: 768px) {
  .grid {
    grid-auto-flow: row;
    grid-auto-columns: auto;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-xl) var(--grid-gutter-tablet);
    overflow-x: visible;
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--grid-gutter-desktop);
  }
}
```

- [ ] **Step 7: Run tests, expect PASS; commit**

```bash
npx vitest run tests/unit/components/ui/FabricCard.test.tsx tests/unit/components/sections/Collections.test.tsx
npm run typecheck
git add -A && git commit -m "feat: collections section with four fabric cards"
```

---

### Task 8: Why Imperium section — alternating rows, map & stamp placeholders

**Files:**

- Delete: `src/components/sections/TrustPillars.tsx`
- Create: `src/components/sections/WhyImperium.tsx`
- Create: `src/components/sections/WhyImperium.module.css`
- Modify: `src/components/sections/index.ts` (swap the export)
- Test: `tests/unit/components/sections/WhyImperium.test.tsx` (new)

**Interfaces:**

- Consumes: `whyImperium` data (Task 3), `Section`, `SectionHeader`, `Eyebrow` idiom via CSS (numbers styled like eyebrows).
- Produces: `<WhyImperium />` rendering `Section id="why-imperium"` on a Gesso band. Placeholder containers carry `data-testid="map-placeholder"` and `data-testid="stamp-placeholder"` — Task 13 verifies they exist; real artwork later replaces the inner markup of `MediaSlot` only.

- [ ] **Step 1: Write the failing test**

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

- [ ] **Step 2: Run it — expect FAIL**

```bash
npx vitest run tests/unit/components/sections/WhyImperium.test.tsx
```

- [ ] **Step 3: Create `src/components/sections/WhyImperium.tsx`**

```tsx
// WhyImperium — three numbered principles as alternating editorial rows
// (client direction 2026-07-04; replaces the DESIGN.md §9.05 four-in-a-row
// manifesto and absorbs §9.03's provenance story). Rows with media split
// 5/7; media alternates sides; the text-only closing row sits on the
// right to continue the rhythm. Placeholder containers reserve space for
// the Italy→Gulf route map and the Made in Italy stamp artwork.

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
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
  );
}

export default WhyImperium;
```

- [ ] **Step 4: Create `src/components/sections/WhyImperium.module.css`**

```css
/* WhyImperium — alternating 5/7 rows on the Gesso band. Whitespace over
   dividers (DESIGN.md §4); numbered labels keep the manifesto DNA of
   §9.05. */

.rows {
  margin-block-start: var(--space-2xl);
  display: grid;
  gap: var(--space-2xl);
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
  color: var(--color-sabbia);
}

.heading {
  font-size: var(--text-h3);
  font-weight: var(--font-weight-medium);
  line-height: var(--leading-h3);
}

.body {
  font-size: var(--text-body);
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

/* --- Map placeholder (Italy → UAE + Gulf) ------------------------------- */

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
  color: var(--color-carbone);
}

.mapArrow {
  font-size: var(--text-subheadline);
  color: var(--color-oro-antico);
}

/* --- Stamp placeholder --------------------------------------------------- */

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

/* --- Shared placeholder caption ------------------------------------------ */

.placeholderCaption {
  font-family: var(--font-sans);
  font-size: var(--text-eyebrow);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--color-sabbia);
}
```

- [ ] **Step 5: Delete the old stub and update the barrel**

```bash
git rm src/components/sections/TrustPillars.tsx
```

In `src/components/sections/index.ts`, replace the `TrustPillars` export line with:

```ts
export { WhyImperium } from "./WhyImperium";
```

(keep every other export as-is).

- [ ] **Step 6: Run tests + typecheck, expect PASS; commit**

```bash
npx vitest run tests/unit/components/sections/WhyImperium.test.tsx && npm run typecheck
git add -A && git commit -m "feat: alternating Why Imperium section with map and stamp placeholders"
```

---

### Task 9: Founder section — story, pull quote, certification container

**Files:**

- Modify: `src/components/ui/PullQuote.tsx` (implement stub)
- Create: `src/components/ui/PullQuote.module.css`
- Modify: `src/components/sections/Founder.tsx` (implement stub)
- Create: `src/components/sections/Founder.module.css`
- Test: `tests/unit/components/sections/Founder.test.tsx` (new)

**Interfaces:**

- Consumes: `founder` data (Task 4), `Section`, `SectionHeader`, next/image (only when srcs stop being null).
- Produces: `<PullQuote quote attribution />`; `<Founder />` rendering `Section id="founder"`. The certification container carries `data-testid="certification-placeholder"` when `founder.certification.src` is null, and renders the image when a path is set — the swap is a one-line data change.

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
  });

  it("renders the quote and attribution", () => {
    render(<Founder />);
    expect(screen.getByText(founder.quote)).toBeInTheDocument();
    expect(screen.getByText(/Sofia Mazza, Founder/)).toBeInTheDocument();
  });

  it("shows placeholder containers for portrait and certification", () => {
    render(<Founder />);
    expect(screen.getByTestId("portrait-placeholder")).toBeInTheDocument();
    expect(screen.getByTestId("certification-placeholder")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it — expect FAIL**

```bash
npx vitest run tests/unit/components/sections/Founder.test.tsx
```

- [ ] **Step 3: Implement `src/components/ui/PullQuote.tsx`**

```tsx
// PullQuote — centred Cormorant italic quote + Oro Antico attribution
// (DESIGN.md §9.06). No quotation marks — typography does the work.

import type { ReactNode } from "react";
import styles from "./PullQuote.module.css";

export interface PullQuoteProps {
  quote: ReactNode;
  attribution: string;
}

export function PullQuote({ quote, attribution }: PullQuoteProps): ReactNode {
  return (
    <figure className={styles.figure}>
      <blockquote className={styles.quote}>{quote}</blockquote>
      <figcaption className={styles.attribution}>— {attribution}</figcaption>
    </figure>
  );
}

export default PullQuote;
```

Create `src/components/ui/PullQuote.module.css`:

```css
/* PullQuote — DESIGN.md §9.06: dedicated vertical space, quote in
   Cormorant italic ~36px, attribution in Oro Antico uppercase. */

.figure {
  display: grid;
  justify-items: center;
  gap: var(--space-md);
  padding-block: var(--space-xl);
  text-align: center;
}

.quote {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(28px, 3.5vw, 36px);
  line-height: var(--leading-h3);
  color: var(--color-carbone);
  max-inline-size: 24ch;
}

.attribution {
  font-family: var(--font-sans);
  font-size: var(--text-eyebrow);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--color-oro-antico);
}
```

- [ ] **Step 4: Implement `src/components/sections/Founder.tsx`**

```tsx
// Founder — asymmetric 5/7 split, portrait left, story right
// (DESIGN.md §9.06). Copy client-approved 2026-07-04. Below the pull
// quote sits the container reserved for the Made in Italy Certification
// image — set founder.certification.src to render it (the scan is stored
// at /images/certifications/made-in-italy-certificate.png awaiting
// founder approval). The certification does NOT appear in Why Imperium.

import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PullQuote } from "@/components/ui/PullQuote";
import { founder } from "@/data/founder";
import styles from "./Founder.module.css";

export function Founder() {
  return (
    <Section id="founder" ariaLabelledby="founder-heading">
      <div className={styles.split}>
        <figure className={styles.portraitColumn}>
          {founder.portrait.src ? (
            <div className={styles.portraitFrame}>
              <Image
                src={founder.portrait.src}
                alt={founder.portrait.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className={styles.portraitImage}
              />
            </div>
          ) : (
            <div className={styles.portraitPlaceholder} data-testid="portrait-placeholder">
              <span className={styles.placeholderLabel}>Portrait to follow</span>
            </div>
          )}
          <figcaption className={styles.caption}>{founder.portrait.caption}</figcaption>
        </figure>
        <div className={styles.story}>
          <SectionHeader
            id="founder-heading"
            eyebrow={founder.eyebrow}
            headline={founder.headline}
          />
          <div className={styles.bio}>
            {founder.bioParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
      <PullQuote quote={founder.quote} attribution={founder.quoteAttribution} />
      <figure className={styles.certification}>
        {founder.certification.src ? (
          <Image
            src={founder.certification.src}
            alt={founder.certification.caption}
            width={200}
            height={150}
            className={styles.certificationImage}
          />
        ) : (
          <div className={styles.certificationPlaceholder} data-testid="certification-placeholder">
            <span className={styles.placeholderLabel}>Image to follow</span>
          </div>
        )}
        <figcaption className={styles.caption}>{founder.certification.caption}</figcaption>
      </figure>
    </Section>
  );
}

export default Founder;
```

- [ ] **Step 5: Create `src/components/sections/Founder.module.css`**

```css
/* Founder — DESIGN.md §9.06: 5/7 asymmetric split, portrait treated like
   an FT profile, certification presented small and discreet (≤200px). */

.split {
  display: grid;
  gap: var(--space-xl);
}

@media (min-width: 1024px) {
  .split {
    grid-template-columns: repeat(12, 1fr);
    gap: var(--grid-gutter-desktop);
  }

  .portraitColumn {
    grid-column: span 5;
  }

  .story {
    grid-column: span 7;
  }
}

.portraitColumn {
  display: grid;
  gap: var(--space-xs);
  align-content: start;
}

.portraitFrame {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
}

.portraitImage {
  object-fit: cover;
}

.portraitPlaceholder {
  display: grid;
  place-content: center;
  aspect-ratio: 3 / 4;
  background-color: color-mix(in srgb, var(--color-sabbia) 18%, var(--color-gesso));
}

.story {
  display: grid;
  gap: var(--space-lg);
  align-content: center;
}

.bio {
  display: grid;
  gap: var(--space-md);
  color: var(--color-ardesia);
}

.caption {
  font-family: var(--font-sans);
  font-size: var(--text-eyebrow);
  letter-spacing: var(--tracking-caption);
  color: var(--color-sabbia);
}

.certification {
  display: grid;
  justify-items: center;
  gap: var(--space-xs);
}

.certificationImage {
  inline-size: 200px;
  block-size: auto;
}

.certificationPlaceholder {
  display: grid;
  place-content: center;
  inline-size: 200px;
  aspect-ratio: 4 / 3;
  border: 1px dashed color-mix(in srgb, var(--color-sabbia) 40%, transparent);
}

.placeholderLabel {
  font-family: var(--font-sans);
  font-size: var(--text-eyebrow);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--color-sabbia);
  padding: var(--space-sm);
  text-align: center;
}
```

- [ ] **Step 6: Run tests, expect PASS; commit**

```bash
npx vitest run tests/unit/components/sections/Founder.test.tsx && npm run typecheck
git add -A && git commit -m "feat: founder story with pull quote and certification container"
```

---

### Task 10: Contact section (pre-form) + Footer

**Files:**

- Modify: `src/data/contact.ts` (subline only — one field)
- Modify: `src/components/sections/Contact.tsx` (implement stub)
- Create: `src/components/sections/Contact.module.css`
- Modify: `src/components/layout/Footer.tsx` (implement stub)
- Create: `src/components/layout/Footer.module.css`
- Test: `tests/unit/components/sections/Contact.test.tsx`, `tests/unit/components/layout/Footer.test.tsx` (new)

**Interfaces:**

- Consumes: `contact` data, `SITE`, `navigation` data (footer links), `Section`, `SectionHeader`, `TextLink`.
- Produces: `<Contact />` rendering `Section id="contact"` — the anchor target for "Contact Us" / "Request a sample". `<Footer />`. **Scope note:** the form, WhatsApp button and Resend pipeline are deliberately NOT built here — they are gated by open decisions D-06/D-08 (inbox, WhatsApp number, email/phone fields) and the F-1 security requirements. This section converts via the email link until that phase.

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/components/sections/Contact.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Contact } from "@/components/sections/Contact";
import { contact } from "@/data/contact";

describe("Contact", () => {
  it("renders the headline and a mailto link", () => {
    render(<Contact />);
    expect(screen.getByRole("heading", { name: "Let's talk fabric." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: contact.email })).toHaveAttribute(
      "href",
      `mailto:${contact.email}`,
    );
  });

  it("exposes the #contact anchor", () => {
    const { container } = render(<Contact />);
    expect(container.querySelector("#contact")).not.toBeNull();
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
  it("renders wordmark, Gulf tagline and a year-free legal line", () => {
    const { container } = render(<Footer />);
    expect(screen.getByText(SITE.name)).toBeInTheDocument();
    expect(screen.getByText(SITE.tagline)).toBeInTheDocument();
    expect(container.textContent).toMatch(/All rights reserved/);
    expect(container.textContent).not.toMatch(/\b20\d\d\b/);
  });
});
```

- [ ] **Step 2: Run them — expect FAIL**

```bash
npx vitest run tests/unit/components/sections/Contact.test.tsx tests/unit/components/layout/Footer.test.tsx
```

- [ ] **Step 3: Set the contact subline**

In `src/data/contact.ts` change only the `subline` value:

```ts
  subline: "Tell us what you're making. We'll bring samples, prices and timelines to the conversation.",
```

- [ ] **Step 4: Implement `src/components/sections/Contact.tsx`**

```tsx
// Contact — pre-form conversion section ("Let's talk fabric.", PRD §6.9).
// The inquiry form + WhatsApp CTA ship with the F-1 pipeline once D-06
// (inbox, WhatsApp number, SLA) and D-08 (email/phone fields) are decided;
// until then the email link is the conversion path.

import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TextLink } from "@/components/ui/TextLink";
import { contact } from "@/data/contact";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <Section id="contact" ariaLabelledby="contact-heading">
      <SectionHeader
        id="contact-heading"
        eyebrow={contact.eyebrow}
        headline={contact.headline}
        subline={contact.subline}
      />
      <div className={styles.details}>
        <TextLink href={`mailto:${contact.email}`}>{contact.email}</TextLink>
        <p className={styles.location}>{contact.location}</p>
      </div>
    </Section>
  );
}

export default Contact;
```

Create `src/components/sections/Contact.module.css`:

```css
/* Contact — details stack beneath the header (form arrives with F-1). */

.details {
  margin-block-start: var(--space-xl);
  display: grid;
  justify-items: start;
  gap: var(--space-sm);
  font-size: var(--text-body-large);
  color: var(--color-blu-notte);
}

.location {
  font-size: var(--text-body);
  color: var(--color-ardesia);
}
```

- [ ] **Step 5: Implement `src/components/layout/Footer.tsx`**

```tsx
// Footer — the only dark band (DESIGN.md §9.09). Legal line carries no
// year by client decision (no "2026" anywhere) and no legal-entity name
// until PRD B-1 lands. Instagram/Privacy links join when B-7/D-12 resolve.

import { navigation } from "@/data/navigation";
import { SITE } from "@/lib/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <p className={styles.wordmark}>{SITE.name}</p>
          <p className={styles.tagline}>{SITE.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <ul className={styles.links}>
            {navigation.links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={styles.link}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={styles.legal}>© {SITE.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
```

Create `src/components/layout/Footer.module.css`:

```css
/* Footer — Carbone full-stop (DESIGN.md §9.09). Inner container mirrors
   Section.module.css margins. */

.footer {
  background-color: var(--color-carbone);
  color: var(--color-gesso);
  padding-block: var(--space-2xl) var(--space-lg);
}

.inner {
  max-inline-size: var(--max-content-width);
  margin-inline: auto;
  padding-inline: var(--grid-margin-mobile);
  display: grid;
  gap: var(--space-lg);
}

@media (min-width: 768px) {
  .inner {
    padding-inline: var(--grid-margin-tablet);
  }
}

@media (min-width: 1024px) {
  .inner {
    padding-inline: var(--grid-margin-desktop);
  }
}

@media (min-width: 1440px) {
  .inner {
    padding-inline: var(--grid-margin-desktop-xl);
  }
}

.wordmark {
  font-family: var(--font-serif);
  font-size: 18px; /* DESIGN.md §9.09 wordmark size */
  font-weight: var(--font-weight-medium);
}

.tagline {
  font-size: var(--text-caption);
  color: var(--color-sabbia);
}

.links {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.link {
  font-size: var(--text-caption);
  letter-spacing: var(--tracking-nav);
  text-transform: uppercase;
  color: color-mix(in srgb, var(--color-gesso) 70%, transparent);
  transition: color var(--motion-duration-fast) var(--motion-ease-standard);
}

.link:hover {
  color: var(--color-gesso);
}

.legal {
  font-size: var(--text-eyebrow);
  color: var(--color-sabbia);
}
```

- [ ] **Step 6: Run tests, expect PASS; commit**

```bash
npx vitest run tests/unit/components/sections/Contact.test.tsx tests/unit/components/layout/Footer.test.tsx
npm run typecheck
git add -A && git commit -m "feat: contact section and footer with year-free legal line"
```

---

### Task 11: Navigation, homepage assembly, /fabrics page

**Files:**

- Modify: `src/data/navigation.ts` (collapse links per PRD §6.1)
- Modify: `src/components/layout/Navigation.tsx` (implement stub)
- Create: `src/components/layout/Navigation.module.css`
- Modify: `src/app/page.tsx` (assemble sections)
- Modify: `src/app/fabrics/page.tsx` (light collection detail page backing the "View Collection" CTAs)
- Create: `src/app/fabrics/fabrics.module.css`
- Modify: `src/app/globals.css` (one addition: `scroll-padding` for anchor offset under the fixed nav)
- Test: `tests/unit/components/layout/Navigation.test.tsx` (new)

**Interfaces:**

- Consumes: everything produced in Tasks 1–10.
- Produces: the assembled site. Homepage section order (client flow): Navigation → Hero → StatsStrip → Collections → WhyImperium → Founder → Contact → Footer. `Testimonials` stays unmounted (empty data, D-10) and `OriginMap` is superseded by the WhyImperium map row — neither appears in `page.tsx`.

- [ ] **Step 1: Update `src/data/navigation.ts`**

```ts
import type { NavigationData } from "@/types/navigation";

// Navigation — nav links + CTA config (PRD §6.1: collapsed link set until
// D-01 photography volume justifies more; language toggle data retained
// for the V2 Arabic decision D-05 but not rendered).

export const navigation: NavigationData = {
  links: [
    { label: "Fabrics", href: "#collections" },
    { label: "Why Imperium", href: "#why-imperium" },
    { label: "About", href: "#founder" },
    { label: "Contact", href: "#contact" },
  ],
  cta: { label: "Request Samples", href: "#contact" },
  languageToggle: { en: "EN", ar: "AR" },
};
```

- [ ] **Step 2: Write the failing Navigation test**

Create `tests/unit/components/layout/Navigation.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navigation } from "@/components/layout/Navigation";
import { SITE } from "@/lib/site";

describe("Navigation", () => {
  it("renders the wordmark without an establishment year", () => {
    const { container } = render(<Navigation />);
    expect(screen.getByText(SITE.name)).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/Est\.|20\d\d/);
  });

  it("renders anchor links and the Request Samples CTA", () => {
    render(<Navigation />);
    expect(screen.getByRole("link", { name: "Fabrics" })).toHaveAttribute("href", "#collections");
    expect(screen.getByRole("link", { name: "Request Samples" })).toHaveAttribute(
      "href",
      "#contact",
    );
  });
});
```

Run: `npx vitest run tests/unit/components/layout/Navigation.test.tsx` — expect FAIL.

- [ ] **Step 3: Implement `src/components/layout/Navigation.tsx`**

```tsx
// Navigation — fixed top bar (DESIGN.md §9.01, simplified: solid Pietra
// with hairline border rather than the transparent-over-video transition,
// because the hero ground is also Pietra; the wordmark's "Est." line is
// omitted by client decision — no year anywhere). Mobile shows wordmark
// + Contact link; the full-screen overlay ships with the dedicated nav
// pass (Roadmap 2.2).

import { navigation } from "@/data/navigation";
import { SITE } from "@/lib/site";
import styles from "./Navigation.module.css";

export function Navigation() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="/" className={styles.wordmark}>
          {SITE.name}
        </a>
        <nav aria-label="Primary" className={styles.nav}>
          <ul className={styles.links}>
            {navigation.links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={styles.link}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href={navigation.cta.href} className={styles.cta}>
          {navigation.cta.label}
        </a>
      </div>
    </header>
  );
}

export default Navigation;
```

- [ ] **Step 4: Create `src/components/layout/Navigation.module.css`**

```css
/* Navigation — 72px fixed bar (56px mobile), Pietra with Sabbia hairline
   (DESIGN.md §9.01). CTA is a compact ghost pill (nav-scale, not the 56px
   Button touch target). */

.header {
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  z-index: var(--z-nav);
  block-size: var(--nav-height-mobile);
  background-color: var(--color-pietra);
  border-block-end: 1px solid color-mix(in srgb, var(--color-sabbia) 30%, transparent);
}

@media (min-width: 768px) {
  .header {
    block-size: var(--nav-height);
  }
}

.inner {
  max-inline-size: var(--max-content-width);
  margin-inline: auto;
  padding-inline: var(--grid-margin-mobile);
  block-size: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

@media (min-width: 768px) {
  .inner {
    padding-inline: var(--grid-margin-tablet);
  }
}

@media (min-width: 1024px) {
  .inner {
    padding-inline: var(--grid-margin-desktop);
  }
}

.wordmark {
  font-family: var(--font-serif);
  font-size: 18px; /* DESIGN.md §9.01 */
  font-weight: var(--font-weight-medium);
  color: var(--color-carbone);
}

.nav {
  display: none;
}

@media (min-width: 1024px) {
  .nav {
    display: block;
  }
}

.links {
  list-style: none;
  padding: 0;
  display: flex;
  gap: var(--space-lg);
}

.link {
  font-size: var(--text-caption);
  letter-spacing: var(--tracking-nav);
  text-transform: uppercase;
  color: var(--color-ardesia);
  transition: color var(--motion-duration-fast) var(--motion-ease-standard);
}

.link:hover {
  color: var(--color-carbone);
}

.cta {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-blu-notte);
  border-radius: 100px;
  padding-block: var(--space-xs);
  padding-inline: var(--space-md);
  font-size: var(--text-caption);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--color-blu-notte);
  transition:
    background-color var(--motion-duration-fast) var(--motion-ease-standard),
    color var(--motion-duration-fast) var(--motion-ease-standard);
}

.cta:hover {
  background-color: var(--color-blu-notte);
  color: var(--color-gesso);
}
```

- [ ] **Step 5: Anchor offset for the fixed nav**

In `src/app/globals.css`, inside the existing `html { ... }` reset block, add one line:

```css
html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
  scroll-behavior: smooth;
  scroll-padding-block-start: calc(var(--nav-height) + var(--space-sm));
  -webkit-tap-highlight-color: transparent;
}
```

- [ ] **Step 6: Assemble `src/app/page.tsx`**

```tsx
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { Collections } from "@/components/sections/Collections";
import { WhyImperium } from "@/components/sections/WhyImperium";
import { Founder } from "@/components/sections/Founder";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  // Narrative order per client flow (2026-07-04): open on the brand,
  // prove scale, show the offering, argue trust, meet the founder,
  // convert. Testimonials joins when real quotes exist (PRD D-10);
  // OriginMap is superseded by the WhyImperium route-map row.
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <StatsStrip />
        <Collections />
        <WhyImperium />
        <Founder />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 7: Build the light `/fabrics` page**

The three "View Collection" CTAs need a real destination. Replace `src/app/fabrics/page.tsx`:

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
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
  // Light V1 detail page backing the collection-card CTAs. Deep anchors
  // (#tessuti-italiani etc.) land on each collection block.
  return (
    <>
      <Navigation />
      <main>
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
            dense
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
      <Footer />
    </>
  );
}
```

Create `src/app/fabrics/fabrics.module.css`:

```css
/* Fabrics page — alternating 5/7 collection blocks reusing the card
   imagery at editorial scale. */

.pageHeader {
  display: grid;
  gap: var(--space-sm);
  padding-block-start: var(--nav-height);
}

.pageTitle {
  font-size: var(--text-h1);
  line-height: var(--leading-h1);
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
}

.image {
  object-fit: cover;
}

.text {
  display: grid;
  gap: var(--space-sm);
  align-content: center;
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
  font-size: var(--text-h2);
  line-height: var(--leading-h2);
  font-weight: var(--font-weight-medium);
}

.titleItalic {
  font-style: italic;
}

.body {
  color: var(--color-ardesia);
  max-inline-size: 60ch;
}
```

- [ ] **Step 8: Full verification + browser pass**

```bash
npm run test && npm run typecheck && npm run lint && npm run build
npm run dev
```

In the browser at `http://localhost:3000`, walk this checklist:

- Hero: large wordmark logo, tagline "Premium Italian fabrics · Delivered to the Gulf" directly beneath, both CTAs scroll correctly. **Logo plate check from Task 6 Step 7:** on Pietra, confirm no visible rounded plate edges around the wordmark; if visible, re-export the PNG as described there.
- Stats strip: "40+ Fabrics" leads; no "Markets Served"; no year.
- Collections: 4 cards, correct taglines, Pezzi Unici says "Contact Us" and scrolls to the contact section at the page bottom; the other three navigate to `/fabrics#<id>`.
- Why Imperium: 3 rows; row 1 text-left/map-right; row 2 stamp-left/text-right; row 3 text on the right; no "Always Available".
- Founder: new headline/paragraphs/quote; portrait placeholder; certification container below the quote.
- `/fabrics`: four blocks, deep anchors land correctly, nav/footer present.
- Responsive: 375px (cards snap-scroll horizontally, nav collapses to wordmark+CTA), 768px, 1280px — no horizontal page scroll anywhere.
- Reduced motion (macOS: System Settings → Accessibility → Display → Reduce motion): hero appears instantly, hovers still work.

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: assemble homepage, navigation and fabrics detail page"
```

---

### Task 12: Documentation alignment (PRD, DESIGN, CLAUDE)

The repo's governance rule: docs describe intent, code describes reality — when the code moves, the docs must record the decision trail. No tests; prettier formats markdown on commit.

**Files:**

- Modify: `PRD.md` — decisions register + section contract + version log
- Modify: `DESIGN.md` — §9 spec lines that still carry the year or superseded layouts
- Modify: `CLAUDE.md` — ground-truth state section

- [ ] **Step 1: PRD decision updates**

In `PRD.md` make these surgical edits (keep table formatting; prettier will realign):

1. **D-01 row:** append to the Recommendation cell: _"**Resolved 2026-07-04 (client):** curated named collections confirmed; a fourth collection — Interior & Exterior Design — added. Material-filter library remains a V2 option (tags kept in the data model)."_
2. **B-2 row (year established):** append to Status: _"**Resolved by removal 2026-07-04:** the site shows no establishment year anywhere; `site.ts` no longer carries the field."_
3. **B-5 row (markets):** append: _"**Client direction 2026-07-04:** no city-list claims; positioning is Italy → UAE + the Gulf ('Delivered to the Gulf')."_
4. **B-6 row (stats):** append: _"**Partially resolved 2026-07-04:** '40+ Fabrics' client-confirmed. Companion stats '4 curated collections' and '100% Italian fabrics' are team-proposed 🟡 pending Sofia's veto (see `src/data/stats.ts`)."_
5. **B-4 row (certification):** append: _"Certificate scan received 2026-07-04 (`/images/certifications/made-in-italy-certificate.png`); displaying it on-site awaits founder approval — container is built in the Founder section."_
6. **§6.2 Hero:** append a line: _"**Amended 2026-07-04:** hero is logo-led — the wordmark logo renders large with the tagline directly beneath; the headline candidates above are retired for V1."_
7. **§6.3 Origin Map:** append: _"**Superseded 2026-07-04:** the provenance visual moved into Why Imperium row 01 as an Italy → UAE + Gulf route map (placeholder container built; illustration commissioned separately). No separate OriginMap section ships in V1."_
8. **§6.5 Collections:** append: _"**Updated 2026-07-04:** four collections (incl. Interior & Exterior Design); per-card promise line ('tagline') renders beneath the image; Pezzi Unici's CTA is 'Contact Us' → #contact; the other cards link to /fabrics deep anchors."_
9. **§6.6 Trust Pillars:** append: _"**Updated 2026-07-04:** three alternating rows — Direct From the Source (+route map slot), Made in Italy Expertise (+stamp slot), For the Gulf's Luxury Market. 'Always available' removed permanently (client)."_
10. **§6.7 Founder:** append: _"**Resolved 2026-07-04:** headline 'Proudly Italian. Purposefully Global.', three bio paragraphs and the pull-quote are client-approved and live in `src/data/founder.ts`."_
11. **§15 Version Log:** add a row/line: _"2026-07-04 — client copy pass: year removed site-wide, Gulf positioning, four collections, Why Imperium restructure, founder story approved; homepage sections built (branch feat/homepage-content-build)."_

- [ ] **Step 2: DESIGN.md year + layout touch-ups**

1. §9.01 Navigation — the wordmark spec line mentioning `"Est. 2026"`: append _"(Retired 2026-07-04: no establishment year appears anywhere on the site.)"_
2. §9.02 Hero — after the content-stack list, append: _"Amended 2026-07-04: V1 hero is logo-led (wordmark image + tagline beneath); eyebrow reads 'Made in Italy' with no year. Video caption 'Italia · 2026' is retired."_
3. §9.04 Products — append: _"Amended 2026-07-04: four cards; a short promise line replaces the material-tag strip beneath the image."_
4. §9.05 Why Imperium — append: _"Amended 2026-07-04: three alternating 5/7 editorial rows with reserved map/stamp media slots replace the four-column band."_
5. §9.09 Footer — change the legal-line example to _"© Imperium Italian Textile. All rights reserved."_ with a note _"(no year by client decision; legal entity name pending B-1)"_.

- [ ] **Step 3: CLAUDE.md ground-truth refresh**

In `CLAUDE.md` §3 (Ground Truth), §7 (unvalidated decisions), §12 (open decisions) and §14 (Quick Reference), update the state lines: sections built on `feat/homepage-content-build` (Hero, Stats, Collections ×4, WhyImperium, Founder, Contact, Nav, Footer, /fabrics); founder copy client-approved 2026-07-04; year removed site-wide; D-01 resolved; stats partially resolved; assets received (logo, 4 collection images, cert scan; portrait still missing); contact form still unimplemented (D-06/D-08 gate it). Keep the **[verified]** labelling convention and date the changes 2026-07-04.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "docs: record client copy decisions and section amendments of 2026-07-04"
```

---

### Task 13: Final verification sweep and handoff

**Files:** none created — verification + push.

- [ ] **Step 1: The 2026 sweep (the client's hard requirement)**

```bash
grep -rn "2026" src public                      # expect: NO output
grep -rni "always available" src                # expect: NO output
grep -rn "Delivered to Dubai" src               # expect: NO output
grep -rn "Markets Served" src                   # expect: NO output
```

Then against the running site (catches anything injected at render time):

```bash
npm run build && npm run start &
sleep 4
curl -s http://localhost:3000 | grep -c "2026"          # expect: 0
curl -s http://localhost:3000/fabrics | grep -c "2026"  # expect: 0
kill %1
```

- [ ] **Step 2: Full quality gates**

```bash
npm run lint          # 0 errors
npm run typecheck     # 0 errors
npm run test          # all unit tests pass (existing 5 suites + the new ones)
npm run build         # compiles clean
npx playwright test   # 2 e2e specs pass
```

- [ ] **Step 3: The client's acceptance checklist** (re-walk in the browser; every box must hold)

- [ ] Every occurrence of "2026" removed (Step 1 proves it)
- [ ] All requested text changes present (taglines, Gulf copy, founder story, quote)
- [ ] Interior & Exterior Design collection added with correct copy and CTA
- [ ] CTAs correct: 3× "View Collection", Pezzi Unici "Contact Us" → bottom contact section
- [ ] Placeholders exist: Italy→Gulf map (Why Imperium 01), Made in Italy stamp (Why Imperium 02), founder certification (below the pull quote)
- [ ] Why Imperium alternates correctly with 3 rows
- [ ] No existing functionality broken (foundation component tests still green)
- [ ] Build succeeds without errors

- [ ] **Step 4: Push and open a PR**

```bash
git push -u origin feat/homepage-content-build
gh pr create --title "feat: homepage content build — client copy pass of 2026-07-04" --body "$(cat <<'EOF'
## Summary
- Removes every "2026" from the site (year, stats, metadata, comments)
- Logo-led hero with the Gulf tagline beneath
- Stats strip: 40+ Fabrics (+ two team-proposed stats, PRD-flagged)
- Four collections incl. new Interior & Exterior Design; Pezzi Unici CTA → Contact
- Why Imperium: 3 alternating rows, map + stamp placeholder containers, "Always Available" removed
- Founder story replaced with client-approved copy; certification container below the quote
- Light /fabrics page backs the View Collection CTAs; nav + footer assembled
- PRD/DESIGN/CLAUDE docs updated with the decision trail

Site remains noindex (NEXT_PUBLIC_ALLOW_INDEXING unset). Contact form still gated by D-06/D-08.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

**Contingency:** if `git push` is rejected with a permissions error, you are not a collaborator on `Akshay-M-Singh/Imperium`. Options: (a) ask Akshay to add you as a collaborator (Settings → Collaborators), or (b) `gh repo fork --remote` and push the branch to your fork, opening the PR cross-repo. The Vercel preview deployment will build from the PR automatically; production is untouched until merge.

---

## Deferred by design (do NOT let these creep in)

- Contact form + Resend pipeline + WhatsApp button/bar — gated by D-06 (inbox, number, SLA), D-08 (email/phone fields), and the F-1 server-side validation/rate-limit requirements.
- Framer Motion scroll reveals, CountUp, TiltCard, Embla — roadmap Phase 5, after the static sections are approved.
- Real map illustration, stamp artwork, founder portrait, certification display, hero video — asset swaps into containers this plan builds.
- Testimonials — hidden until ≥1 real quote (D-10).
- Domain registration, indexing flip, favicons, OG image — launch phase (6.B) gates.

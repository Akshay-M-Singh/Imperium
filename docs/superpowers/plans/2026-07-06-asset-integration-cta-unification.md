# Asset Integration + CTA Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the client's real brand assets (derived logo, route map, stamp, certification scan, four fabric photos) into the live components, unify every collection CTA to "Contact Us Now" → `#contact`, and remove the now-orphaned `/fabrics` route.

**Architecture:** Pure content/asset integration on the existing Next.js 15 App Router site — no new components. A one-off `sharp` script derives a transparent, cropped hero wordmark from the opaque client logo. Data files (`src/data/*.ts`, `src/lib/site.ts`) carry the changes; the components' existing conditional rendering (Hero logo slot, Founder certification slot) switches on automatically. Unit tests pin each change.

**Tech Stack:** Next.js 15.5 (App Router, `src/`), TypeScript strict, CSS Modules, `next/image`, `sharp` (already a dependency), Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-07-06-asset-integration-cta-unification-design.md` — read it first; it records the user's four decisions and the pixel-probe findings this plan relies on.

## Global Constraints

- **Branch:** work on `feat/asset-integration-cta-unification` — it already exists with the raw assets committed (`1be75d6`). Check it out (or create a worktree **from it**); do NOT recreate it or branch from `main`.
- **Never** write the string `2026` anywhere under `src/` — not even in code comments (client hard rule, enforced by `grep -rn "2026" src` in prior sessions and re-checked in Task 8). Dates in root-level docs (`progress.md`, `CLAUDE.md`, `docs/`) are fine. The certification _image_ showing "aprile 2026" is a recorded user-accepted exception.
- All public image files use kebab-case names: `[a-z-]+.png` — no spaces, `&`, or uppercase (the client source `Logo.png` is the one archival exception; it is never referenced by app code).
- All rendered images go through `next/image` with the CSS-module class pattern used by `Founder.tsx` / `FabricCard.tsx` — no raw `<img>`, no inline `style` attributes.
- Commits must pass commitlint (conventional: `feat:`, `chore:`, `docs:`, `test:` …) and the pre-commit lint-staged hook (eslint --fix + prettier). Do not use `--no-verify`.
- Do not push; the user decides when/where to push and open a PR.
- Do not run `npm audit fix --force` under any circumstances.
- Node >= 20.11; run everything from the repo root.

---

### Task 1: Normalize asset filenames

Filenames with spaces/`&` break the repo's own test regex (`/^\/images\/(fabrics|collections)\/[a-z-]+\.(svg|png)$/`) and invite URL-encoding bugs.

**Files:**

- Rename: `public/images/fabrics/tessuti italiani.png` → `public/images/fabrics/tessuti-italiani.png`
- Rename: `public/images/fabrics/interior-&-exterior design.png` → `public/images/fabrics/interior-exterior.png`
- Rename: `public/images/certifications/made in italy certification.png` → `public/images/certifications/made-in-italy-certification.png`
- Rename: `public/images/stamp/made in italy stamp.png` → `public/images/stamp/made-in-italy-stamp.png`

**Interfaces:**

- Produces: the four paths above, consumed by Tasks 4, 6, 7. (`Logo.png`, `sofia-portrait.png`, `ospitalita-di-lusso.png`, `pezzi-unici.png`, `italy-gulf-routes.png` are already correctly named.)

- [ ] **Step 1: Rename with git mv** (files are tracked as of commit `1be75d6`)

```bash
git mv "public/images/fabrics/tessuti italiani.png" public/images/fabrics/tessuti-italiani.png
git mv "public/images/fabrics/interior-&-exterior design.png" public/images/fabrics/interior-exterior.png
git mv "public/images/certifications/made in italy certification.png" public/images/certifications/made-in-italy-certification.png
git mv "public/images/stamp/made in italy stamp.png" public/images/stamp/made-in-italy-stamp.png
```

- [ ] **Step 2: Verify no bad names remain**

Run: `find public/images -name "* *" -o -name "*&*"`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: kebab-case the client asset filenames"
```

---

### Task 2: Logo derivation script

The client logo (`public/images/logo/Logo.png`, 1000×1000) is **fully opaque**: pure-white canvas, off-white `#F7F8F7` plate behind the brown wordmark, artwork occupying only the middle band. This script keys out the white via a min-channel alpha ramp and crops to the artwork, producing the transparent wordmark the Hero needs.

**Files:**

- Create: `scripts/derive-brand-assets.mjs`
- Generates: `public/images/logo/imperium-wordmark.png`

**Interfaces:**

- Consumes: `public/images/logo/Logo.png` (client source, untouched).
- Produces: `public/images/logo/imperium-wordmark.png` (transparent background, cropped, brown artwork preserved) and prints its `WIDTHxHEIGHT` — Task 3 substitutes those printed numbers into `Hero.tsx`.

- [ ] **Step 1: Write the script**

Create `scripts/derive-brand-assets.mjs`:

```js
// Derives the web logo from the client's opaque source PNG
// (public/images/logo/Logo.png): pure-white canvas + #F7F8F7 plate behind
// a brown wordmark. White is keyed out with a min-channel alpha ramp, then
// the result is cropped to the artwork plus a small margin. Re-run when
// the client sends new artwork:  node scripts/derive-brand-assets.mjs
import sharp from "sharp";

const SRC = "public/images/logo/Logo.png";
const OUT = "public/images/logo/imperium-wordmark.png";
// Lightest channel >= WHITE → fully transparent (clears the #F7F8F7 plate);
// <= BLACK → fully opaque; linear ramp between (anti-aliased glyph edges).
const WHITE = 246;
const BLACK = 140;
const MARGIN = 12;

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

let minX = width;
let minY = height;
let maxX = -1;
let maxY = -1;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels;
    const lightest = Math.min(data[i], data[i + 1], data[i + 2]);
    const ramp = (WHITE - lightest) / (WHITE - BLACK);
    const alpha = Math.round(Math.max(0, Math.min(1, ramp)) * 255);
    data[i + 3] = alpha;
    if (alpha > 8) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

if (maxX < 0) throw new Error("No opaque pixels found — check WHITE/BLACK thresholds");

const left = Math.max(0, minX - MARGIN);
const top = Math.max(0, minY - MARGIN);
const cropWidth = Math.min(width, maxX + MARGIN + 1) - left;
const cropHeight = Math.min(height, maxY + MARGIN + 1) - top;

await sharp(data, { raw: { width, height, channels } })
  .extract({ left, top, width: cropWidth, height: cropHeight })
  .png()
  .toFile(OUT);

console.log(`${OUT}: ${cropWidth}x${cropHeight} (from ${width}x${height})`);
```

- [ ] **Step 2: Run it**

Run: `node scripts/derive-brand-assets.mjs`
Expected: `public/images/logo/imperium-wordmark.png: <W>x<H> (from 1000x1000)` with W roughly 700–800 and H roughly 150–210. **Write down W and H — Task 3 needs them.**

- [ ] **Step 3: Verify transparency and inspect visually**

```bash
node -e "const sharp=require('sharp');sharp('public/images/logo/imperium-wordmark.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}).then(({data,info})=>{console.log('corner alpha:',data[3],'dims:',info.width+'x'+info.height)})"
```

Expected: `corner alpha: 0` (transparent corner). Then open/view the generated PNG: brown "IMPERIUM / ITALIAN TEXTILE" wordmark, no white plate, no visible light halo around glyphs at 2× zoom. If glyph edges look chewed (too much removed), lower `WHITE` to 244 and re-run; if plate remnants survive, raise `BLACK` to 160 and re-run.

- [ ] **Step 4: Commit**

```bash
git add scripts/derive-brand-assets.mjs public/images/logo/imperium-wordmark.png
git commit -m "feat: derive transparent hero wordmark from client logo"
```

---

### Task 3: Hero logo integration

The Hero already has the complete conditional (`src/components/sections/Hero.tsx:81-95`): when `SITE.logoSrc` is non-null it renders `next/image` with `alt={SITE.name}` inside the `h1`, and `Hero.module.css` applies `filter: brightness(0) invert(1)` — which renders the transparent brown wordmark **pure white** over the dark video. That filter is only correct now that Task 2 removed the opaque background.

**Files:**

- Modify: `src/lib/site.ts:9-12`
- Modify: `src/components/sections/Hero.tsx:81-95` (Image width/height)
- Modify: `src/components/sections/Hero.module.css:59-67` (`.logoImage` size clamp)
- Test: `tests/unit/components/sections/Hero.test.tsx`, `tests/unit/lib/site.test.ts` (no edits expected — both already branch on `logoSrc`)

**Interfaces:**

- Consumes: `public/images/logo/imperium-wordmark.png` + its printed `W`/`H` from Task 2.
- Produces: `SITE.logoSrc: string` — any later consumer reads the logo path from `SITE.logoSrc`, never hardcodes it.

- [ ] **Step 1: Point `SITE.logoSrc` at the derived asset**

In `src/lib/site.ts`, replace:

```ts
  // Hero wordmark logo. Point at the staged asset
  // ("/images/logo/imperium-wordmark.png") once the client logo is in
  // public/images/logo/; null renders the typographic wordmark instead.
  logoSrc: null as string | null,
```

with:

```ts
  // Hero wordmark logo, derived from the client source by
  // scripts/derive-brand-assets.mjs; null falls back to the typographic
  // wordmark.
  logoSrc: "/images/logo/imperium-wordmark.png" as string | null,
```

- [ ] **Step 2: Set the real intrinsic dimensions on the Hero Image**

In `src/components/sections/Hero.tsx`, the `<Image>` inside the `h1` currently has `width={500} height={500}` (sized for a square logo that never arrived). Replace those two props with the **actual W and H printed by Task 2 Step 2**, e.g. if the script printed `754x184`:

```tsx
<Image
  src={SITE.logoSrc}
  alt={SITE.name}
  width={754}
  height={184}
  priority
  className={styles.logoImage}
/>
```

- [ ] **Step 3: Re-clamp the CSS for a wide wordmark**

In `src/components/sections/Hero.module.css`, replace:

```css
.logoImage {
  display: block;
  inline-size: min(420px, 78vw, 42dvh);
  block-size: auto;
  /* Client PNG is dark-on-transparent; render it white over the dark
     video/poster ground. Remove this line if the artwork is already light
     (visual check in Step 6). */
  filter: brightness(0) invert(1);
}
```

with:

```css
.logoImage {
  display: block;
  inline-size: min(480px, 80vw);
  block-size: auto;
  /* The derived wordmark is brown-on-transparent; render it white over
     the dark video/poster ground. */
  filter: brightness(0) invert(1);
}
```

(The `42dvh` clamp guarded against a tall square logo; a ~4.5:1 wordmark at 480px is only ~118px tall, so width is the only meaningful constraint.)

- [ ] **Step 4: Run the affected tests**

Run: `npx vitest run tests/unit/components/sections/Hero.test.tsx tests/unit/lib/site.test.ts`
Expected: all pass — the Hero h1 test's `if (SITE.logoSrc)` branch now activates and asserts `getByRole("img", { name: SITE.name })`, which matches `alt={SITE.name}`.

- [ ] **Step 5: Visual check**

Run: `npm run dev`, open `http://localhost:3000`. The hero must show the wordmark in **white**, crisp, roughly where the typographic wordmark used to sit, tagline beneath. Check at mobile width (~375px) too: wordmark ≤ 80vw, no overflow.
**Fallback (only if the wordmark shows fringing/halo artifacts that Step 3 of Task 2 couldn't tune out):** set `logoSrc` back to `null` in `site.ts` (keep the derived asset and script committed), note it in the final report, and continue — every other task is independent of this one.

- [ ] **Step 6: Commit**

```bash
git add src/lib/site.ts src/components/sections/Hero.tsx src/components/sections/Hero.module.css
git commit -m "feat: hero renders the derived client wordmark"
```

---

### Task 4: Collections — real photos + unified CTA (TDD)

All four `image.src` values currently point at **deleted** SVGs (the homepage carousel is broken); the user decided every collection CTA becomes `Contact Us Now` → `#contact`.

**Files:**

- Modify: `src/data/collections.ts` (whole file below)
- Test: `tests/unit/data/collections.test.ts:23-31` (CTA test), `tests/unit/components/ui/FabricCard.test.tsx` (fixture + CTA assertion)

**Interfaces:**

- Consumes: renamed fabric PNGs from Task 1.
- Produces: `collections` with `cta: { label: "Contact Us Now", href: "#contact" }` on every entry — Task 5 relies on no `/fabrics` hrefs remaining here.

- [ ] **Step 1: Rewrite the CTA test to the new contract**

In `tests/unit/data/collections.test.ts`, replace:

```ts
it("routes Pezzi Unici to contact and the rest to the fabrics page", () => {
  for (const c of collections) {
    if (c.id === "pezzi-unici") {
      expect(c.cta).toEqual({ label: "Contact Us", href: "#contact" });
    } else {
      expect(c.cta).toEqual({ label: "View Collection", href: `/fabrics#${c.id}` });
    }
  }
});
```

with:

```ts
it("routes every collection CTA to the contact section", () => {
  for (const c of collections) {
    expect(c.cta).toEqual({ label: "Contact Us Now", href: "#contact" });
  }
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/data/collections.test.ts`
Expected: FAIL — `routes every collection CTA to the contact section` (labels still "View Collection"/"Contact Us"). The `points at real image files` test also still FAILS (srcs reference deleted `.svg` files — pre-existing breakage this task fixes).

- [ ] **Step 3: Rewrite `src/data/collections.ts`**

Replace the entire file with:

```ts
import type { CollectionsData } from "@/types/collections";

// Collections — the four curated collections (client-confirmed, resolving
// PRD D-01 in favour of curated collections; DESIGN.md §9.04). `tags` stay
// on the model for a future filterable library even though the cards
// render `tagline`. Photography is the client's real delivery; every CTA
// routes to #contact by client decision (see the asset-integration spec
// in docs/superpowers/specs/).

export const collections: CollectionsData = [
  {
    id: "tessuti-italiani",
    tags: ["LINEN", "SILK", "WOOL", "COTTON"],
    title: "Tessuti Italiani",
    titleItalic: true,
    tagline: "For those who don't compromise.",
    body: "The foundation of the house: linens, silks, wools and cottons sourced from Italian mills we know by name. Fabric for work that carries your label.",
    cta: { label: "Contact Us Now", href: "#contact" },
    image: {
      src: "/images/fabrics/tessuti-italiani.png",
      alt: "Draped Italian jacquard in warm rose and gold, with a fringed selvedge and a black Made in Italy label.",
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
    cta: { label: "Contact Us Now", href: "#contact" },
    image: {
      src: "/images/fabrics/pezzi-unici.png",
      alt: "Gold and midnight-blue floral brocade with a Limited Edition 01 of 50 card.",
    },
  },
  {
    id: "ospitalita-di-lusso",
    tags: ["HOSPITALITY", "BESPOKE"],
    title: "Ospitalità di Lusso",
    titleItalic: true,
    tagline: "Breathability, durability, and quality.",
    body: "Contract-grade fabric for hotels, resorts and restaurants that refuse to look like it. Specified with you, sampled fast.",
    cta: { label: "Contact Us Now", href: "#contact" },
    image: {
      src: "/images/fabrics/ospitalita-di-lusso.png",
      alt: "Tailored taupe and black jackets with gold piping on Imperium-branded wooden hangers.",
    },
  },
  {
    id: "interior-exterior",
    tags: ["INTERIOR", "EXTERIOR", "CONTRACT"],
    title: "Interior & Exterior Design",
    titleItalic: false,
    tagline: "Timeless design, durability, and versatility.",
    body: "Premium Italian textiles designed for sophisticated interior and exterior spaces, bringing timeless craftsmanship to residential, commercial, and hospitality environments.",
    cta: { label: "Contact Us Now", href: "#contact" },
    image: {
      src: "/images/fabrics/interior-exterior.png",
      alt: "Layered neutral Italian textiles in cream and taupe beside an olive branch.",
    },
  },
];
```

- [ ] **Step 4: Run the data tests**

Run: `npx vitest run tests/unit/data/collections.test.ts`
Expected: PASS (5 tests) — including `contains no year and points at real image files`, whose regex the kebab-case `.png` names now satisfy.

- [ ] **Step 5: Update the FabricCard fixture to the new contract**

In `tests/unit/components/ui/FabricCard.test.tsx`, replace the fixture lines:

```ts
  cta: { label: "View Collection", href: "/fabrics#tessuti-italiani" },
  image: { src: "/images/fabrics/tessuti-italiani.svg", alt: "Italian linen texture" },
```

with:

```ts
  cta: { label: "Contact Us Now", href: "#contact" },
  image: { src: "/images/fabrics/tessuti-italiani.png", alt: "Italian linen texture" },
```

and replace the CTA assertion:

```ts
const link = screen.getByRole("link", { name: /View Collection/ });
expect(link).toHaveAttribute("href", "/fabrics#tessuti-italiani");
```

with:

```ts
const link = screen.getByRole("link", { name: /Contact Us Now/ });
expect(link).toHaveAttribute("href", "#contact");
```

- [ ] **Step 6: Run the component tests**

Run: `npx vitest run tests/unit/components/ui/FabricCard.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 7: Commit**

```bash
git add src/data/collections.ts tests/unit/data/collections.test.ts tests/unit/components/ui/FabricCard.test.tsx
git commit -m "feat: real collection photography and unified Contact Us Now CTA"
```

---

### Task 5: Remove the /fabrics route

User decision: with no card linking to it, the page is deleted rather than orphaned (recoverable via git; the V2 filterable-library idea keeps living in the data model's `tags`).

**Files:**

- Delete: `src/app/fabrics/page.tsx`, `src/app/fabrics/fabrics.module.css`
- Modify: `src/lib/metadata.ts:6`, `src/data/seo.ts:14-19`, `src/lib/constants.ts:11-16`
- Test: full unit suite + typecheck + build (no dedicated test file — the type system enforces the removal)

**Interfaces:**

- Consumes: Task 4 already removed every `/fabrics` href from data.
- Produces: `PageKey = "home" | "about" | "contact"` — `SeoData` is `Record<PageKey, SeoPageEntry>`, so `seo.ts` and `metadata.ts` MUST change in the same commit or typecheck fails.

- [ ] **Step 1: Delete the route**

```bash
git rm -r src/app/fabrics
```

- [ ] **Step 2: Shrink the `PageKey` union**

In `src/lib/metadata.ts`, replace:

```ts
export type PageKey = "home" | "fabrics" | "about" | "contact";
```

with:

```ts
export type PageKey = "home" | "about" | "contact";
```

- [ ] **Step 3: Drop the seo entry**

In `src/data/seo.ts`, delete this block (keep `home`, `about`, `contact`):

```ts
  fabrics: {
    title: "Fabric Collections",
    description:
      "Tessuti Italiani, Pezzi Unici, Ospitalità di Lusso and Interior & Exterior Design — four collections of premium Italian fabric.",
    canonical: "/fabrics",
  },
```

- [ ] **Step 4: Drop the route constant**

In `src/lib/constants.ts`, delete the line `  fabrics: "/fabrics",` from `ROUTES` (it has no consumers — verified by grep).

- [ ] **Step 5: Sweep, typecheck, test, build**

```bash
grep -rn "/fabrics" src tests
npm run typecheck
npm run test
npm run build
```

Expected: grep prints **nothing**; typecheck clean; all unit tests pass; build succeeds and the route list no longer contains `/fabrics` (`/`, `/about`, `/contact`, `/privacy`, `/api/contact`, `/_not-found`, `/robots.txt`, `/sitemap.xml` remain). `sitemap.ts` never listed `/fabrics` — no change there.

- [ ] **Step 6: Commit**

```bash
git add -A src/app/fabrics src/lib/metadata.ts src/data/seo.ts src/lib/constants.ts
git commit -m "feat: remove the orphaned /fabrics route"
```

---

### Task 6: WhyImperium — real map + stamp (TDD)

Finishes the hand edit from commit `1be75d6` properly: the map currently uses a raw `<img>` with a **wrong `.svg` extension** (file is `.png`) and an inline style; the stamp is still a placeholder circle. Both become `next/image` with CSS-module classes, and the placeholder chrome is removed.

**Files:**

- Modify: `src/components/sections/WhyImperium.tsx` (whole file below)
- Modify: `src/components/sections/WhyImperium.module.css:71-130`
- Test: `tests/unit/components/sections/WhyImperium.test.tsx:18-22`

**Interfaces:**

- Consumes: `public/images/map/italy-gulf-routes.png` (1536×1024), `public/images/stamp/made-in-italy-stamp.png` (462×432, from Task 1).
- Produces: testids `map-media` and `stamp-media` (replacing `map-placeholder`/`stamp-placeholder`) — nothing else consumes these outside this task's test.

- [ ] **Step 1: Rewrite the media test**

In `tests/unit/components/sections/WhyImperium.test.tsx`, replace:

```ts
  it("reserves the Italy→Gulf map and stamp placeholders", () => {
    render(<WhyImperium />);
    expect(screen.getByTestId("map-placeholder")).toBeInTheDocument();
    expect(screen.getByTestId("stamp-placeholder")).toBeInTheDocument();
  });
```

with:

```ts
  it("renders the real Italy→Gulf route map and Made in Italy stamp", () => {
    render(<WhyImperium />);
    expect(screen.getByTestId("map-media")).toBeInTheDocument();
    expect(screen.getByTestId("stamp-media")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /route map from Italy to the UAE and the Gulf/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /Made in Italy certification stamp/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/in production|to follow/i)).toBeNull();
  });
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/components/sections/WhyImperium.test.tsx`
Expected: FAIL — `Unable to find an element by: [data-testid="map-media"]`.

- [ ] **Step 3: Rewrite the component**

Replace the entire `src/components/sections/WhyImperium.tsx` with:

```tsx
// WhyImperium — three numbered principles as alternating editorial rows
// (client direction; replaces the DESIGN.md §9.05 four-in-a-row manifesto
// and absorbs §9.03's provenance story). Rows with media split 5/7 and
// alternate sides; the text-only closing row sits right to continue the
// rhythm. Media slots carry the client's Italy→Gulf route artwork and the
// Made in Italy stamp (NOT the certification scan — that lives in the
// Founder section).

import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { whyImperium, type WhyImperiumItem } from "@/data/pillars";
import styles from "./WhyImperium.module.css";

function MediaSlot({ media }: { media: WhyImperiumItem["media"] }): ReactNode {
  if (media === "map") {
    return (
      <figure className={styles.mapFigure} data-testid="map-media">
        <Image
          src="/images/map/italy-gulf-routes.png"
          alt="Illustrated route map from Italy to the UAE and the Gulf"
          width={1536}
          height={1024}
          loading="lazy"
          className={styles.mapImage}
        />
      </figure>
    );
  }
  if (media === "stamp") {
    return (
      <figure className={styles.stampSlot} data-testid="stamp-media">
        <Image
          src="/images/stamp/made-in-italy-stamp.png"
          alt="100% Made in Italy certification stamp"
          width={462}
          height={432}
          loading="lazy"
          className={styles.stampImage}
        />
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

- [ ] **Step 4: Replace the placeholder CSS**

In `src/components/sections/WhyImperium.module.css`, delete everything from the line `/* --- Map placeholder (Italy → UAE + Gulf) ---` to the end of the file (the `.mapPlaceholder`, `.mapPoint`, `.mapArrow`, `.stampSlot`, `.stampCircle`, `.placeholderCaption` blocks) and append instead:

```css
/* --- Map media (Italy → UAE + Gulf route artwork) ------------------------ */

.mapFigure {
  margin: 0;
}

.mapImage {
  inline-size: 100%;
  block-size: auto;
}

/* --- Made in Italy stamp --------------------------------------------------- */

/* The stamp PNG has an opaque pure-white background that blends into the
   Gesso section band — do not place it on any other background. */
.stampSlot {
  margin: 0;
  display: grid;
  justify-items: center;
}

.stampImage {
  inline-size: min(200px, 48vw);
  block-size: auto;
}
```

- [ ] **Step 5: Run the tests**

Run: `npx vitest run tests/unit/components/sections/WhyImperium.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/WhyImperium.tsx src/components/sections/WhyImperium.module.css tests/unit/components/sections/WhyImperium.test.tsx
git commit -m "feat: real route map and Made in Italy stamp in Why Imperium"
```

---

### Task 7: Founder — certification scan (TDD)

`Founder.tsx:48-70` already renders the real image when `certification.src` is set. The scan is 2502×1770 (≈1.414:1); the wrap's current `aspect-ratio: 3 / 2` + `object-fit: cover` would crop the diploma's ornate border, so the wrap ratio changes to match the scan. **Recorded user decision (spec §Decisions.4):** the scan is integrated as-is — Sofia's DOB/birthplace and "aprile 2026" are visible; her explicit OK is recommended before launch but does not block this task.

**Files:**

- Modify: `src/data/founder.ts:32-35`
- Modify: `src/components/sections/Founder.module.css:59-67`
- Test: `tests/unit/components/sections/Founder.test.tsx:29-33`

**Interfaces:**

- Consumes: `public/images/certifications/made-in-italy-certification.png` (Task 1).
- Produces: nothing consumed later.

- [ ] **Step 1: Rewrite the certification test**

In `tests/unit/components/sections/Founder.test.tsx`, replace:

```ts
  it("shows the certification placeholder container below the story", () => {
    render(<Founder />);
    expect(screen.getByTestId("certification-placeholder")).toBeInTheDocument();
    expect(screen.getByText("Made in Italy Certification")).toBeInTheDocument();
  });
```

with:

```ts
  it("renders the certification scan below the story", () => {
    render(<Founder />);
    expect(screen.getByRole("img", { name: "Made in Italy Certification" })).toBeInTheDocument();
    expect(screen.queryByTestId("certification-placeholder")).toBeNull();
    expect(screen.getByText("Made in Italy Certification")).toBeInTheDocument();
  });
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/components/sections/Founder.test.tsx`
Expected: FAIL — no img named "Made in Italy Certification" (src is still `null`, the placeholder branch renders).

- [ ] **Step 3: Set the scan path**

In `src/data/founder.ts`, replace:

```ts
  certification: {
    src: null, // null until the founder approves displaying the scan
    caption: "Made in Italy Certification",
  },
```

with:

```ts
  certification: {
    // Client scan, integrated as-is by user decision (asset-integration
    // spec): DOB and issue date are visible — Sofia's explicit OK
    // recommended before launch.
    src: "/images/certifications/made-in-italy-certification.png",
    caption: "Made in Italy Certification",
  },
```

Also update the stale staging comment at the top of the file: replace
`// Copy is client-approved. Set certification.src to the scan path`
`// (public/images/certifications/made-in-italy-certificate.png, staged`
`// when available) once the founder approves showing it.`
with
`// Copy is client-approved; portrait and certification scan are the real`
`// client assets (see the asset-integration spec in docs/superpowers/specs/).`

- [ ] **Step 4: Match the wrap ratio to the scan**

In `src/components/sections/Founder.module.css`, replace:

```css
.certImageWrap {
  position: relative;
  max-inline-size: 200px;
  aspect-ratio: 3 / 2;
  margin-inline: auto;
  margin-block-end: var(--space-sm);
  overflow: hidden;
  background-color: var(--color-sabbia);
}
```

with:

```css
.certImageWrap {
  position: relative;
  max-inline-size: 220px;
  /* Matches the scan (2502×1770) so object-fit: cover crops nothing —
     it's a document; its border must stay intact. */
  aspect-ratio: 2502 / 1770;
  margin-inline: auto;
  margin-block-end: var(--space-sm);
  overflow: hidden;
  background-color: var(--color-sabbia);
}
```

(Leave `.certPlaceholder` untouched — it is the live `null` fallback branch.)

- [ ] **Step 5: Run the tests**

Run: `npx vitest run tests/unit/components/sections/Founder.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add src/data/founder.ts src/components/sections/Founder.module.css tests/unit/components/sections/Founder.test.tsx
git commit -m "feat: display the Made in Italy certification scan"
```

---

### Task 8: Docs, full verification, visual pass

**Files:**

- Modify: `progress.md:188-194` (backlog ticks)
- Modify: `CLAUDE.md` (header addendum)
- Test: full suite + build + dev-server visual pass

**Interfaces:**

- Consumes: everything above.

- [ ] **Step 1: Tick the resolved backlog items in `progress.md`**

In the `### Placeholder / fine-tune backlog` section, replace these five lines:

```markdown
- [ ] Client wordmark logo PNG staged at `public/images/logo/imperium-wordmark.png` and `SITE.logoSrc` pointed at it (hero currently renders the typographic wordmark)
- [ ] Commissioned Italy→Gulf route illustration for the Why Imperium map slot (replaces `MediaSlot` inner markup in `WhyImperium.tsx`)
- [ ] Official Made in Italy stamp artwork for the Why Imperium stamp slot
- [ ] Real fabric photography ×4 for collection cards (incl. Interior & Exterior Design)
- [ ] Sofia’s professional 3:4 portrait
- [ ] Made in Italy certification scan display approval → set `founder.certification.src`
```

with:

```markdown
- [x] Client wordmark logo — derived transparent asset via `scripts/derive-brand-assets.mjs`, `SITE.logoSrc` set (2026-07-06)
- [x] Italy→Gulf route illustration in the Why Imperium map slot (2026-07-06)
- [x] Made in Italy stamp artwork in the Why Imperium stamp slot (2026-07-06)
- [x] Real fabric photography ×4 on collection cards — client re-export at ≥800×1000px still requested; current files are lower-res and render soft on retina (2026-07-06)
- [x] Sofia’s 3:4 portrait (2026-07-06)
- [x] Made in Italy certification scan wired in as-is per user decision — Sofia’s explicit OK on the visible DOB/date still recommended before launch (2026-07-06)
```

(If exact `- [ ]` lines differ slightly, match on their key phrases; do not touch the other backlog items — hero video, testimonial, WhatsApp number, Resend keys, legal entity name, 404 remain open.)

- [ ] **Step 2: Add the CLAUDE.md addendum**

In `CLAUDE.md` (repo root), directly after the existing header addendum paragraph (the blockquote ending "…real asset gaps (logo PNG, photography, video, certification scan, WhatsApp number, domain) are unchanged and still open."), append a new blockquote paragraph:

```markdown
> **Addendum 2 (2026-07-06):** the client asset batch landed and was integrated on branch `feat/asset-integration-cta-unification` (spec: `docs/superpowers/specs/2026-07-06-asset-integration-cta-unification-design.md`). Hero now renders a transparent wordmark derived from the opaque client logo (`scripts/derive-brand-assets.mjs`); real portrait, certification scan (integrated as-is by user decision — Sofia's explicit OK on the visible DOB and issue date is still recommended), Italy→Gulf route map, Made in Italy stamp, and four fabric photos (lower-res than ideal; client re-exports requested) are live. Every collection CTA is now "Contact Us Now" → `#contact`, and the `/fabrics` route was **removed** by client decision (recoverable via git). Still open: hero video, WhatsApp number, domain, testimonial, Resend keys, legal entity name.
```

- [ ] **Step 3: Referential integrity sweep**

```bash
grep -ohE '"/images/[^"]+"' src/data/*.ts src/lib/site.ts src/components/sections/*.tsx | tr -d '"' | sort -u | while read -r p; do [ -f "public$p" ] || echo "MISSING: $p"; done
grep -rn "2026" src
```

Expected: no output from either command (every referenced image exists on disk; no `2026` anywhere under `src/`).

- [ ] **Step 4: Full gates**

```bash
npm run test
npm run typecheck
npm run lint
npm run build
```

Expected: all unit tests pass (same 61-test count — every change replaced tests 1:1), typecheck clean, lint may show the pre-existing warning budget but **zero errors**, build succeeds without `/fabrics`.

- [ ] **Step 5: Visual pass**

Run `npm run dev`, open `http://localhost:3000`, verify top to bottom (desktop + ~375px mobile):

1. Hero: white wordmark, crisp, tagline beneath, no overflow.
2. Collections: four photo cards (no broken images), every card CTA reads "Contact Us Now" and scrolls to the contact section.
3. Why Imperium: route-map artwork in row 01 (no border box, no letterboxing bands); stamp in row 02 with **no visible white rectangle edge** against the white band.
4. Founder: portrait renders; certification scan below the story with its full border visible (nothing cropped).
5. `http://localhost:3000/fabrics` → 404.

Record any visual anomaly in the final report rather than improvising fixes beyond the fallbacks this plan defines.

- [ ] **Step 6: Commit**

```bash
git add progress.md CLAUDE.md
git commit -m "docs: record asset integration, CTA unification and /fabrics removal"
```

---

## Done means

All eight task checkboxes complete; `npm run test` / `typecheck` / `lint` / `build` green; visual pass clean; six commits on `feat/asset-integration-cta-unification` after the two landing commits. Then use superpowers:finishing-a-development-branch — the user decides merge/PR (do not push unprompted).

**Report back to the user:** the Task 3 fringing fallback (if taken), any visual anomalies from Task 8 Step 5, and the standing client follow-ups from the spec (hi-res photos, transparent logo original, Sofia's OK on the cert scan and stamp usage).

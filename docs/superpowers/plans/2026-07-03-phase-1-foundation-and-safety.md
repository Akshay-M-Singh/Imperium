# Phase 1 Foundation + Safety Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete build Phase 1 of the Imperium Italian Textile site (self-hosted fonts + five base components) and apply the three approved safety fixes (noindex switch, `/ar` loop removal + CSP tightening, `.DS_Store` cleanup), leaving a green CI and a foundation Phase 2 can build on.

**Architecture:** Next.js 15 App Router marketing site where all visual primitives read design tokens from `src/app/globals.css` (already implemented, 92 custom properties). Components are typed stubs with final prop interfaces already defined — this plan implements them in place, colocating a CSS Module per component and a Vitest+Testing Library test per component. Config fixes are pure `src/app/` + `next.config.ts` changes guarded by one new env switch.

**Tech Stack:** Next.js 15.5.19 · React 19.2.7 · TypeScript strict · CSS Modules + CSS custom properties · Vitest 2.1 + @testing-library/react (jsdom) · Playwright (e2e) · Husky + lint-staged + commitlint (Conventional Commits enforced on every commit).

**Spec sources:** `PRD.md` (F-5, F-6, §9 security, §10 A-9, §12) · `DEVELOPMENT_ROADMAP.md` Phase 1 (tasks 1.6–1.13) · `DESIGN.md` §2–§4, §9, §11 · `TECHNICAL_ARCHITECTURE.md` §5–§6. Read them read-only; this plan contains everything needed inline.

## Global Constraints

- Node `>=20.11.0`, npm ≥ 10 (`package.json` engines; `packageManager: npm@10.8.1`).
- **No new runtime or dev dependencies.** The stack is frozen (`TECHNICAL_ARCHITECTURE.md` §1); everything here uses what `package-lock.json` already has.
- **Never run `npm audit fix --force`** — it downgrades Next.js to 9.x (PRD §9).
- All styling via CSS Modules + tokens from `globals.css`; no inline styles, no new global classes, no Tailwind. Use CSS **logical properties** (`padding-inline`, `margin-block`) — the codebase is RTL-ready by rule.
- All transitions must reference `--motion-duration-*` / `--motion-ease-*` tokens so `prefers-reduced-motion` collapses them automatically (already wired in `globals.css`).
- Components take copy via props — no hardcoded copy strings inside components (PRD §7 rule).
- Commit messages: Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `docs:`) — commitlint rejects anything else. The pre-commit hook auto-formats staged files (lint-staged), so run `git add` again if the hook modifies files.
- Match existing code style: double quotes, semicolons, `@/*` import alias, one component per file, named export + default export (see any stub).
- **Do not touch:** `src/data/*` copy, `sitemap.ts`, `layout.tsx` metadata beyond what Task 2 specifies (canonical/OG domain questions are launch-phase, PRD D-07), anything in `src/components/sections/`.

## Pre-flight Context for the Executor

- The folder `~/Desktop/Builds/Imperium-main` is a **ZIP snapshot without git**. Real work happens in a fresh clone (Task 1). The snapshot is the source for three docs to carry over.
- The live site (imperium-opal.vercel.app) deploys from GitHub `main` via Vercel Git integration. **Nothing in this plan affects the live site until the branch is merged/pushed to `main`** — the final task hands that off.
- Design tokens, `@font-face` declarations (with CLS fallback metrics), the CSS reset, and reduced-motion collapse **already exist** in `src/app/globals.css`. Do not rewrite them. The font _files_ are what's missing.
- Component prop interfaces already exist in the stubs and are re-exported by barrels (`src/components/ui/index.ts`, `src/components/layout/index.ts`). **Implement to those exact interfaces; do not rename props.**
- `vitest.config.ts` sets `css: false` — CSS Module imports resolve to empty objects in tests, so **tests must assert on tags/roles/attributes, never on class names**.

---

### Task 1: Working copy, baseline, and docs

**Files:**

- Create: `<clone>/CLAUDE.md`, `<clone>/PRD.md`, `<clone>/docs/superpowers/plans/2026-07-03-phase-1-foundation-and-safety.md` (copied from the snapshot)
- No source changes.

**Interfaces:**

- Consumes: GitHub repo `https://github.com/Akshay-M-Singh/Imperium` (public).
- Produces: a git working copy at `~/Desktop/Builds/Imperium` on branch `feat/phase-1-foundation-and-safety`, baseline quality gates green, used by every later task. All later paths are relative to this clone.

- [ ] **Step 1: Clone and enter**

```bash
cd ~/Desktop/Builds
git clone https://github.com/Akshay-M-Singh/Imperium.git Imperium
cd Imperium
git log --oneline -3
```

Expected: clone succeeds; log shows `deabeb8 chore: trigger redeploy` at top (5 commits total).

- [ ] **Step 2: Verify toolchain and install**

```bash
node --version   # Expected: v20.x or v22.x (>= 20.11)
npm ci
```

Expected: `npm ci` exits 0 and prints `husky` prepare output; `node_modules/` populated from the lockfile.

- [ ] **Step 3: Baseline gates (must be green before any change)**

```bash
npm run typecheck && npm run lint && npm run test
```

Expected: typecheck exits 0; ESLint exits 0; Vitest reports **2 test files passed** (`tests/unit/components/ui/Button.test.tsx`, `tests/unit/lib/utils.test.ts`), 0 failures. If anything fails here, STOP — the repo moved since 2026-07-03; re-audit before proceeding.

- [ ] **Step 4: Branch**

```bash
git checkout -b feat/phase-1-foundation-and-safety
```

- [ ] **Step 5: Copy the planning docs from the snapshot and commit**

```bash
cp ~/Desktop/Builds/Imperium-main/CLAUDE.md ./CLAUDE.md
cp ~/Desktop/Builds/Imperium-main/PRD.md ./PRD.md
mkdir -p docs/superpowers/plans
cp ~/Desktop/Builds/Imperium-main/docs/superpowers/plans/2026-07-03-phase-1-foundation-and-safety.md docs/superpowers/plans/
git add CLAUDE.md PRD.md docs/
git commit -m "docs: add PRD, updated project brief, and phase 1 plan"
```

Expected: commit succeeds (commitlint accepts `docs:`).

---

### Task 2: Search-engine indexing switch (noindex until launch)

The live scaffold is currently indexable under the real brand name (PRD §9 / F-5). Add one explicit env switch, default **off**: `NEXT_PUBLIC_ALLOW_INDEXING`. Indexing turns on only when the var is literally `"true"` — never by accident of environment.

**Files:**

- Test: `tests/unit/app/robots.test.ts` (create)
- Modify: `src/app/robots.ts` (replace whole file — currently 11 lines)
- Modify: `src/app/layout.tsx:32-35` (the `robots` metadata block)
- Modify: `.env.example` (document the new var)

**Interfaces:**

- Consumes: nothing from other tasks.
- Produces: env contract `NEXT_PUBLIC_ALLOW_INDEXING === "true" → indexing on; anything else → noindex + disallow`. Launch flips it in Vercel project settings only (PRD §12 checklist).

- [ ] **Step 1: Write the failing test**

Create `tests/unit/app/robots.test.ts`:

```ts
import { describe, it, expect, afterEach, vi } from "vitest";
import robots from "@/app/robots";

// PRD F-5: the scaffold must not be indexable until launch. Indexing is an
// explicit opt-in via NEXT_PUBLIC_ALLOW_INDEXING="true" (set in Vercel at
// launch, Phase 6.B) — never a side effect of environment.

describe("robots", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("disallows all crawling by default (switch unset)", () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "");
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });

  it("disallows when the switch holds anything but the literal 'true'", () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "1");
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });

  it("allows crawling and advertises the sitemap only when explicitly enabled", () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "true");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://imperiumitaliantextile.com");
    const result = robots();
    expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(result.sitemap).toBe("https://imperiumitaliantextile.com/sitemap.xml");
  });
});
```

- [ ] **Step 2: Run it — verify it fails**

```bash
npx vitest run tests/unit/app/robots.test.ts
```

Expected: FAIL — first two tests fail with objects not equal (received `{ userAgent: "*", allow: "/" }`, expected `disallow`). The third passes coincidentally. Failure confirms the test bites.

- [ ] **Step 3: Implement — replace `src/app/robots.ts` entirely with:**

```ts
import type { MetadataRoute } from "next";

// Indexing is an explicit launch decision (PRD F-5, launch checklist §12).
// Default: NOT indexable. Set NEXT_PUBLIC_ALLOW_INDEXING="true" in the
// production environment only when the real domain is live (Phase 6.B).
export function isIndexingAllowed(): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://imperiumitaliantextile.com";

  if (!isIndexingAllowed()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
```

- [ ] **Step 4: Run the test — verify it passes**

```bash
npx vitest run tests/unit/app/robots.test.ts
```

Expected: PASS — 3 tests.

- [ ] **Step 5: Gate the metadata robots tag the same way**

In `src/app/layout.tsx`: add the import at the top and replace the `robots` block inside `metadata`.

Add after the existing imports (line 3):

```ts
import { isIndexingAllowed } from "@/app/robots";
```

Replace (currently lines 32–35):

```ts
  robots: {
    index: true,
    follow: true,
  },
```

with:

```ts
  robots: {
    index: isIndexingAllowed(),
    follow: isIndexingAllowed(),
  },
```

- [ ] **Step 6: Document the switch in `.env.example`**

Append at the end of `.env.example`:

```bash

# Search-engine indexing switch (PRD F-5). Leave unset everywhere until launch.
# At launch (Phase 6.B): set to "true" in the Vercel production environment ONLY.
NEXT_PUBLIC_ALLOW_INDEXING=
```

- [ ] **Step 7: Verify against a running dev server**

```bash
npm run dev &
sleep 6
curl -s http://localhost:3000/robots.txt
curl -s http://localhost:3000/ | grep -o '<meta name="robots"[^>]*>'
kill %1
```

Expected: robots.txt prints `User-Agent: *` / `Disallow: /` (no Sitemap line); the meta tag prints `content="noindex, nofollow"`.

- [ ] **Step 8: Commit**

```bash
git add src/app/robots.ts src/app/layout.tsx .env.example tests/unit/app/robots.test.ts
git commit -m "fix: gate search indexing behind explicit launch switch"
```

---

### Task 3: `next.config.ts` safety fixes — remove the `/ar` redirect loop and the Resend CSP entry

`/ar → /ar/` fights Next's trailing-slash stripping → infinite redirect live (PRD F-6; the Arabic route arrives with decision D-05, groundwork stays in CSS logical properties). `connect-src https://api.resend.com` invites a key-in-browser mistake — Resend is server-side only (PRD §9).

**Files:**

- Modify: `next.config.ts:26` (CSP `connect-src` line) and `next.config.ts:49-51` (the `redirects()` block)

**Interfaces:**

- Consumes: nothing.
- Produces: `/ar` returns Next's 404; CSP `connect-src 'self' https://plausible.io`.

- [ ] **Step 1: Edit the CSP line**

In `next.config.ts`, replace:

```ts
          `connect-src 'self' https://plausible.io https://api.resend.com`,
```

with:

```ts
          // Resend is called server-side only — the browser must never reach it (PRD §9).
          `connect-src 'self' https://plausible.io`,
```

- [ ] **Step 2: Delete the redirects block**

Remove these lines entirely (the `/ar` route ships with PRD D-05, not before):

```ts
  async redirects() {
    return [{ source: "/ar", destination: "/ar/", permanent: false }];
  },
```

- [ ] **Step 3: Verify on the dev server**

```bash
npm run dev &
sleep 6
curl -s -o /dev/null -w "/ar -> %{http_code}\n" http://localhost:3000/ar
curl -sI http://localhost:3000/ | grep -i content-security-policy
kill %1
```

Expected: `/ar -> 404` (not 307/308); the CSP header contains `connect-src 'self' https://plausible.io` and **no** `api.resend.com`.

- [ ] **Step 4: Commit**

```bash
git add next.config.ts
git commit -m "fix: remove /ar redirect loop and Resend CSP entry"
```

---

### Task 4: Remove the committed `.DS_Store`

**Files:**

- Delete from index: `.DS_Store` (already listed in `.gitignore`; was force-added by the scaffold commit)

- [ ] **Step 1: Untrack and commit**

```bash
git rm --cached .DS_Store
git commit -m "chore: stop tracking .DS_Store"
git ls-files | grep -c DS_Store
```

Expected: `git rm` prints `rm '.DS_Store'`; final grep prints `0`.

---

### Task 5: Self-hosted fonts (Cormorant Garamond + DM Sans)

`globals.css` already declares all seven `@font-face` blocks with CLS fallback metrics — only the files are missing, and `layout.tsx` still loads an **Inter placeholder from Google Fonts**, which violates the self-hosted rule (`TECHNICAL_ARCHITECTURE.md` §5; PRD A-9). Both families are OFL-licensed (free).

**Files:**

- Create: `public/fonts/CormorantGaramond-{Regular,Medium,SemiBold,Italic,MediumItalic}.woff2`, `public/fonts/DMSans-{Regular,Medium}.woff2`
- Modify: `src/app/layout.tsx:1-8` (remove Inter) and `src/app/layout.tsx:44-50` (root JSX: html class, preload links)

**Interfaces:**

- Consumes: nothing.
- Produces: the exact seven filenames `globals.css:141-200` already references. Later phases rely on `--font-serif` / `--font-sans` resolving to real fonts.

- [ ] **Step 1: Download WOFF2 files (primary path — google-webfonts-helper API, already latin-subset)**

```bash
mkdir -p .fonts-tmp && cd .fonts-tmp
curl -fL -o cormorant.zip "https://gwfh.mranftl.com/api/fonts/cormorant-garamond?download=zip&subsets=latin,latin-ext&formats=woff2&variants=regular,500,600,italic,500italic"
curl -fL -o dmsans.zip "https://gwfh.mranftl.com/api/fonts/dm-sans?download=zip&subsets=latin,latin-ext&formats=woff2&variants=regular,500"
unzip -o cormorant.zip && unzip -o dmsans.zip
ls *.woff2
```

Expected: 7 `.woff2` files, names like `cormorant-garamond-v##-latin_latin-ext-regular.woff2` and `dm-sans-v##-latin_latin-ext-500.woff2`.

**Fallback path (only if the API is down):** download the family zips from `https://fonts.google.com/download?family=Cormorant%20Garamond` and `...?family=DM%20Sans`, put the needed static TTFs into `.fonts-source/` with the names `scripts/subset-fonts.sh:37-43` expects (if DM Sans ships only a variable TTF, instance it first: `pip3 install fonttools brotli && fonttools varLib.instancer "DMSans[opsz,wght].ttf" wght=400 opsz=14 -o DMSans-Regular.ttf`, same with `wght=500` for Medium), then run `./scripts/subset-fonts.sh` from the repo root and skip Step 2.

- [ ] **Step 2: Rename into place (exact names `globals.css` expects)**

```bash
mv cormorant-garamond-*-regular.woff2    ../public/fonts/CormorantGaramond-Regular.woff2
mv cormorant-garamond-*-500.woff2        ../public/fonts/CormorantGaramond-Medium.woff2
mv cormorant-garamond-*-600.woff2        ../public/fonts/CormorantGaramond-SemiBold.woff2
mv cormorant-garamond-*-500italic.woff2  ../public/fonts/CormorantGaramond-MediumItalic.woff2
mv cormorant-garamond-*-italic.woff2     ../public/fonts/CormorantGaramond-Italic.woff2
mv dm-sans-*-regular.woff2               ../public/fonts/DMSans-Regular.woff2
mv dm-sans-*-500.woff2                   ../public/fonts/DMSans-Medium.woff2
cd .. && rm -rf .fonts-tmp
ls -la public/fonts/
```

Expected: exactly `.gitkeep` + the 7 `.woff2` files, each roughly 15–60 KB. (Order matters above: the `500italic` rename must run **before** the `italic` one.)

- [ ] **Step 3: Remove the Inter placeholder and add preloads in `src/app/layout.tsx`**

After Task 2 this file also contains the `isIndexingAllowed` import — it must survive this edit. Make the top of the file exactly:

```ts
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { isIndexingAllowed } from "@/app/robots";
```

by deleting three things: the `import { Inter } from "next/font/google";` line, the three-line `// NOTE: Font wiring is a placeholder …` comment block, and the `const inter = Inter({ subsets: ["latin"], variable: "--font-placeholder" });` line.

Replace the `RootLayout` return (currently `<html lang="en" className={inter.variable}>` … ):

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* React 19 hoists these to <head>. Preload only the two dominant
            text faces (Architecture §6.6); the rest load on demand. */}
        <link
          rel="preload"
          href="/fonts/CormorantGaramond-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/DMSans-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {children}
      </body>
    </html>
  );
}
```

(Keep the `isIndexingAllowed` import from Task 2 and everything else in the file unchanged.)

- [ ] **Step 4: Verify fonts actually serve and apply**

```bash
npm run dev &
sleep 6
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/fonts/CormorantGaramond-Regular.woff2   # Expected: 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/fonts/DMSans-Regular.woff2              # Expected: 200
curl -s http://localhost:3000/ | grep -c 'rel="preload"'                                               # Expected: 2
curl -s http://localhost:3000/ | grep -ci "fonts.googleapis\|fonts.gstatic\|__inter"                   # Expected: 0
kill %1
```

Then eyeball once in a browser: `h1` on the homepage renders in a serif (Cormorant), body in DM Sans — check via DevTools → Elements → Computed → "Rendered Fonts".

- [ ] **Step 5: Commit**

```bash
git add public/fonts src/app/layout.tsx
git commit -m "feat: self-host Cormorant Garamond and DM Sans, drop Inter placeholder"
```

---

### Task 6: `Section` layout wrapper

**Files:**

- Test: `tests/unit/components/layout/Section.test.tsx` (create)
- Modify: `src/components/layout/Section.tsx` (implement — keep the existing `SectionProps` interface verbatim)
- Modify: `src/components/layout/Section.module.css` (currently a one-line comment)

**Interfaces:**

- Consumes: tokens from `globals.css`; `cn` from `@/lib/utils` (`cn(...values: Array<string | false | null | undefined>): string`).
- Produces: `<Section id? ariaLabelledby? as?="section"|"aside"|"article" background?="pietra"|"gesso"|"carbone" dense?>` — every later section component (Phase 2+) wraps its content in this. Children are rendered inside an inner div that enforces `--max-content-width` and responsive margins.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/components/layout/Section.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Section } from "@/components/layout/Section";

describe("Section", () => {
  it("renders a <section> landmark with its children", () => {
    render(
      <Section id="contact" ariaLabelledby="contact-heading">
        <h2 id="contact-heading">Contact</h2>
      </Section>,
    );
    const region = screen.getByRole("region", { name: "Contact" });
    expect(region.tagName).toBe("SECTION");
    expect(region).toHaveAttribute("id", "contact");
  });

  it("renders alternative semantics via the as prop", () => {
    const { container } = render(<Section as="aside">stats</Section>);
    expect(container.firstElementChild?.tagName).toBe("ASIDE");
  });

  it("defaults to <section> without id when not provided", () => {
    const { container } = render(<Section>content</Section>);
    const el = container.firstElementChild;
    expect(el?.tagName).toBe("SECTION");
    expect(el).not.toHaveAttribute("id");
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it — verify it fails**

```bash
npx vitest run tests/unit/components/layout/Section.test.tsx
```

Expected: FAIL — `getByRole("region")` finds nothing (stub returns null).

- [ ] **Step 3: Implement `src/components/layout/Section.tsx`** (keep the header comment and the exported interface exactly as they are; replace only the function body):

```tsx
// Section — reusable section wrapper providing max-width, responsive
// margins, and consistent vertical rhythm (Roadmap Phase 1.9).
// Reads spacing tokens from globals.css.

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./Section.module.css";

export interface SectionProps {
  children: ReactNode;
  /** Optional id for anchor navigation. */
  id?: string;
  /** aria-labelledby target — the section header's h2 id. */
  ariaLabelledby?: string;
  /** Element semantics. Defaults to <section>. */
  as?: "section" | "aside" | "article";
  /** Background band. Defaults to the page (Pietra). */
  background?: "pietra" | "gesso" | "carbone";
  /** Reduce vertical padding to subsection rhythm. */
  dense?: boolean;
}

export function Section({
  children,
  id,
  ariaLabelledby,
  as: Tag = "section",
  background = "pietra",
  dense = false,
}: SectionProps): ReactNode {
  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn(styles.section, styles[background], dense && styles.dense)}
    >
      <div className={styles.inner}>{children}</div>
    </Tag>
  );
}

export default Section;
```

- [ ] **Step 4: Implement `src/components/layout/Section.module.css`** (replace file contents):

```css
/* Section wrapper — max-width, responsive margins, vertical rhythm
   (DESIGN.md §4: grid margins 24/40/80/120, whitespace over dividers). */

.section {
  padding-block: var(--section-padding-y);
}

.dense {
  padding-block: var(--subsection-padding-y);
}

.pietra {
  background-color: var(--color-pietra);
}

.gesso {
  background-color: var(--color-gesso);
}

.carbone {
  background-color: var(--color-carbone);
  color: var(--color-gesso);
}

.inner {
  max-inline-size: var(--max-content-width);
  margin-inline: auto;
  padding-inline: var(--grid-margin-mobile);
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
```

- [ ] **Step 5: Run the test — verify it passes**

```bash
npx vitest run tests/unit/components/layout/Section.test.tsx
```

Expected: PASS — 3 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/Section.tsx src/components/layout/Section.module.css tests/unit/components/layout/Section.test.tsx
git commit -m "feat: implement Section layout wrapper"
```

---

### Task 7: `Eyebrow` label

**Files:**

- Test: `tests/unit/components/ui/Eyebrow.test.tsx` (create)
- Modify: `src/components/ui/Eyebrow.tsx`, `src/components/ui/Eyebrow.module.css`

**Interfaces:**

- Consumes: tokens only.
- Produces: `<Eyebrow>children</Eyebrow>` → a `<span className={styles.eyebrow}>`. Task 8's `SectionHeader` imports `Eyebrow` from `./Eyebrow`.

- [ ] **Step 1: Write the failing test** — create `tests/unit/components/ui/Eyebrow.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Eyebrow } from "@/components/ui/Eyebrow";

describe("Eyebrow", () => {
  it("renders its children in a span", () => {
    render(<Eyebrow>Our collections</Eyebrow>);
    const el = screen.getByText("Our collections");
    expect(el.tagName).toBe("SPAN");
  });
});
```

- [ ] **Step 2: Run it — verify it fails**

```bash
npx vitest run tests/unit/components/ui/Eyebrow.test.tsx
```

Expected: FAIL — `getByText` finds nothing.

- [ ] **Step 3: Implement `src/components/ui/Eyebrow.tsx`** (replace function body only):

```tsx
// Eyebrow — uppercase tracked label pattern (DESIGN.md §2, Roadmap 1.10).
// 11px DM Sans 500, tracking +0.15em, uppercase.

import type { ReactNode } from "react";
import styles from "./Eyebrow.module.css";

export interface EyebrowProps {
  children: ReactNode;
}

export function Eyebrow({ children }: EyebrowProps): ReactNode {
  return <span className={styles.eyebrow}>{children}</span>;
}

export default Eyebrow;
```

- [ ] **Step 4: Implement `src/components/ui/Eyebrow.module.css`** (replace contents):

```css
/* Eyebrow — DESIGN.md §2 typographic rules: always uppercase, tracked wide. */

.eyebrow {
  display: block;
  font-family: var(--font-sans);
  font-size: var(--text-eyebrow);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--color-sabbia);
}
```

- [ ] **Step 5: Run the test — verify it passes**

```bash
npx vitest run tests/unit/components/ui/Eyebrow.test.tsx
```

Expected: PASS — 1 test.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/Eyebrow.tsx src/components/ui/Eyebrow.module.css tests/unit/components/ui/Eyebrow.test.tsx
git commit -m "feat: implement Eyebrow label"
```

---

### Task 8: `SectionHeader` composition

**Files:**

- Test: `tests/unit/components/ui/SectionHeader.test.tsx` (create)
- Modify: `src/components/ui/SectionHeader.tsx`, `src/components/ui/SectionHeader.module.css`

**Interfaces:**

- Consumes: `Eyebrow` from Task 7 (`import { Eyebrow } from "./Eyebrow"`).
- Produces: `<SectionHeader eyebrow headline subline? as?="h2"|"h3" id?>` — the heading receives the `id` so `Section`'s `ariaLabelledby` can point at it. Every content section in Phase 2+ uses this.

- [ ] **Step 1: Write the failing test** — create `tests/unit/components/ui/SectionHeader.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeader } from "@/components/ui/SectionHeader";

describe("SectionHeader", () => {
  it("renders eyebrow and an h2 headline with the given id", () => {
    render(
      <SectionHeader
        eyebrow="Our collections"
        headline="Fabric with a story."
        id="collections-heading"
      />,
    );
    expect(screen.getByText("Our collections")).toBeInTheDocument();
    const heading = screen.getByRole("heading", { level: 2, name: "Fabric with a story." });
    expect(heading).toHaveAttribute("id", "collections-heading");
  });

  it("renders an h3 when as='h3'", () => {
    render(<SectionHeader eyebrow="Contact" headline="Let's talk fabric." as="h3" />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Let's talk fabric." }),
    ).toBeInTheDocument();
  });

  it("renders the subline only when provided", () => {
    const { rerender } = render(
      <SectionHeader eyebrow="Contact" headline="Headline" subline="A subline." />,
    );
    expect(screen.getByText("A subline.")).toBeInTheDocument();
    rerender(<SectionHeader eyebrow="Contact" headline="Headline" />);
    expect(screen.queryByText("A subline.")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it — verify it fails**

```bash
npx vitest run tests/unit/components/ui/SectionHeader.test.tsx
```

Expected: FAIL — no heading rendered.

- [ ] **Step 3: Implement `src/components/ui/SectionHeader.tsx`** (replace function body only, keep interface):

```tsx
// SectionHeader — Eyebrow + headline + subline composition
// (Roadmap Phase 1.11). Used by every section with content above the fold.

import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";
import styles from "./SectionHeader.module.css";

export interface SectionHeaderProps {
  eyebrow: string;
  headline: ReactNode;
  subline?: ReactNode;
  /** Heading level — must not skip levels (Architecture §7.3). */
  as?: "h2" | "h3";
  /** id for aria-labelledby on the wrapping <section>. */
  id?: string;
}

export function SectionHeader({
  eyebrow,
  headline,
  subline,
  as: Heading = "h2",
  id,
}: SectionHeaderProps): ReactNode {
  return (
    <header className={styles.header}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading id={id} className={Heading === "h2" ? styles.headlineH2 : styles.headlineH3}>
        {headline}
      </Heading>
      {subline ? <p className={styles.subline}>{subline}</p> : null}
    </header>
  );
}

export default SectionHeader;
```

- [ ] **Step 4: Implement `src/components/ui/SectionHeader.module.css`** (replace contents):

```css
/* SectionHeader — eyebrow → headline → subline stack (DESIGN.md §9). */

.header {
  display: grid;
  gap: var(--space-sm);
}

.headlineH2 {
  font-size: var(--text-h2);
  line-height: var(--leading-h2);
}

.headlineH3 {
  font-size: var(--text-h3);
  line-height: var(--leading-h3);
}

.subline {
  font-size: var(--text-body-large);
  color: var(--color-ardesia);
  max-inline-size: 540px;
}
```

- [ ] **Step 5: Run the test — verify it passes**

```bash
npx vitest run tests/unit/components/ui/SectionHeader.test.tsx
```

Expected: PASS — 3 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/SectionHeader.tsx src/components/ui/SectionHeader.module.css tests/unit/components/ui/SectionHeader.test.tsx
git commit -m "feat: implement SectionHeader composition"
```

---

### Task 9: `Button` (ghost / filled / whatsapp)

**Files:**

- Test: `tests/unit/components/ui/Button.test.tsx` (replace the placeholder file)
- Modify: `src/components/ui/Button.tsx`, `src/components/ui/Button.module.css`

**Interfaces:**

- Consumes: `cn` from `@/lib/utils`; tokens.
- Produces: `<Button variant?="ghost"|"filled"|"whatsapp" type? disabled? loading? onClick? href?>` — `href` renders an `<a>`, otherwise a `<button>`. Phase 2 nav CTA and Phase 4 form submit rely on exactly this contract. `loading` implies disabled + `aria-busy`.

- [ ] **Step 1: Replace `tests/unit/components/ui/Button.test.tsx` entirely with the real tests:**

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders a button with type=button by default and fires onClick", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Request Samples</Button>);
    const button = screen.getByRole("button", { name: "Request Samples" });
    expect(button).toHaveAttribute("type", "button");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("respects an explicit type", () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole("button", { name: "Send" })).toHaveAttribute("type", "submit");
  });

  it("renders an anchor when href is given", () => {
    render(<Button href="#contact">Talk to us</Button>);
    const link = screen.getByRole("link", { name: "Talk to us" });
    expect(link).toHaveAttribute("href", "#contact");
  });

  it("does not fire onClick when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Send
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Send" });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("is disabled and announces busy while loading", () => {
    render(<Button loading>Send</Button>);
    const button = screen.getByRole("button", { name: "Send" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });
});
```

- [ ] **Step 2: Run it — verify it fails**

```bash
npx vitest run tests/unit/components/ui/Button.test.tsx
```

Expected: FAIL — every test (stub returns null).

- [ ] **Step 3: Implement `src/components/ui/Button.tsx`** (keep header comment, types, and interface; replace the function body):

```tsx
// Button — ghost (outline) and filled variants (Roadmap Phase 1.12).
// DESIGN.md §9.01, §9.02 specify the variants.
// MagneticButton motion wrapper (MOTION_SPEC.md §3.2) is applied in Phase 5.

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./Button.module.css";

export type ButtonVariant = "ghost" | "filled" | "whatsapp";

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  href?: string;
}

export function Button({
  children,
  variant = "ghost",
  type = "button",
  disabled = false,
  loading = false,
  onClick,
  href,
}: ButtonProps): ReactNode {
  const className = cn(styles.button, styles[variant]);

  if (href) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={className}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
```

- [ ] **Step 4: Implement `src/components/ui/Button.module.css`** (replace contents):

```css
/* Button — DESIGN.md §9.01, §9.02. Pill shape; ghost fills Blu Notte on
   hover, filled darkens 10%. Focus ring comes from :focus-visible in
   globals.css. Transitions read motion tokens (reduced-motion safe). */

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  min-block-size: 56px; /* touch target — DESIGN.md §8.6 */
  padding-inline: var(--space-lg);
  border-radius: 100px;
  font-family: var(--font-sans);
  font-size: var(--text-caption);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  transition:
    background-color var(--motion-duration-fast) var(--motion-ease-standard),
    color var(--motion-duration-fast) var(--motion-ease-standard),
    border-color var(--motion-duration-fast) var(--motion-ease-standard);
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ghost {
  border: 1px solid var(--color-blu-notte);
  color: var(--color-blu-notte);
  background-color: transparent;
}

.ghost:hover:not(:disabled) {
  background-color: var(--color-blu-notte);
  color: var(--color-gesso);
}

.filled {
  border: 1px solid var(--color-blu-notte);
  background-color: var(--color-blu-notte);
  color: var(--color-gesso);
}

.filled:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--color-blu-notte) 90%, black);
  border-color: color-mix(in srgb, var(--color-blu-notte) 90%, black);
}

.whatsapp {
  border: 1px solid var(--color-whatsapp);
  background-color: var(--color-whatsapp);
  color: var(--color-gesso);
}

.whatsapp:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--color-whatsapp) 90%, black);
  border-color: color-mix(in srgb, var(--color-whatsapp) 90%, black);
}
```

- [ ] **Step 5: Run the test — verify it passes**

```bash
npx vitest run tests/unit/components/ui/Button.test.tsx
```

Expected: PASS — 5 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/Button.tsx src/components/ui/Button.module.css tests/unit/components/ui/Button.test.tsx
git commit -m "feat: implement Button ghost, filled and whatsapp variants"
```

---

### Task 10: `TextLink` animated underline

**Files:**

- Test: `tests/unit/components/ui/TextLink.test.tsx` (create)
- Modify: `src/components/ui/TextLink.tsx`, `src/components/ui/TextLink.module.css`

**Interfaces:**

- Consumes: tokens.
- Produces: `<TextLink href>children</TextLink>` → `<a>` with a left-to-right underline draw on hover/focus (DESIGN.md §5: width 0% → 100%). Used by fabric-card CTAs and hero secondary CTA in later phases.

- [ ] **Step 1: Write the failing test** — create `tests/unit/components/ui/TextLink.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextLink } from "@/components/ui/TextLink";

describe("TextLink", () => {
  it("renders an anchor with href and children", () => {
    render(<TextLink href="#contact">Request a sample →</TextLink>);
    const link = screen.getByRole("link", { name: "Request a sample →" });
    expect(link).toHaveAttribute("href", "#contact");
  });
});
```

- [ ] **Step 2: Run it — verify it fails**

```bash
npx vitest run tests/unit/components/ui/TextLink.test.tsx
```

Expected: FAIL — no link rendered.

- [ ] **Step 3: Implement `src/components/ui/TextLink.tsx`** (replace function body only):

```tsx
// TextLink — animated underline link (DESIGN.md §5 hover spec,
// Roadmap Phase 1.13). Underline width animates 0% → 100% left-to-right.

import type { ReactNode } from "react";
import styles from "./TextLink.module.css";

export interface TextLinkProps {
  children: ReactNode;
  href: string;
}

export function TextLink({ children, href }: TextLinkProps): ReactNode {
  return (
    <a href={href} className={styles.link}>
      {children}
    </a>
  );
}

export default TextLink;
```

- [ ] **Step 4: Implement `src/components/ui/TextLink.module.css`** (replace contents):

```css
/* TextLink — underline draws left-to-right via background-size
   (DESIGN.md §5: width 0% → 100%, 300ms). Uses currentColor so the link
   adapts to light-on-dark contexts (hero) without variants. */

.link {
  color: var(--color-blu-notte);
  font-weight: var(--font-weight-medium);
  background-image: linear-gradient(currentColor, currentColor);
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 0% 1px;
  padding-block-end: 2px;
  transition: background-size var(--motion-duration-fast) var(--motion-ease-standard);
}

.link:hover,
.link:focus-visible {
  background-size: 100% 1px;
}
```

- [ ] **Step 5: Run the test — verify it passes**

```bash
npx vitest run tests/unit/components/ui/TextLink.test.tsx
```

Expected: PASS — 1 test.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/TextLink.tsx src/components/ui/TextLink.module.css tests/unit/components/ui/TextLink.test.tsx
git commit -m "feat: implement TextLink animated underline"
```

---

### Task 11: Phase 1 verification gate + handoff

The repo's own Phase 1 milestone (`DEVELOPMENT_ROADMAP.md:53-67`) plus this plan's additions, verified end-to-end. No new files.

- [ ] **Step 1: Full quality suite (same order as CI)**

```bash
npm run format:check && npm run lint && npm run typecheck && npm run test && npm run build
```

Expected: all exit 0. Vitest now reports **7 test files passed** — the 6 from this plan plus the pre-existing `tests/unit/lib/utils.test.ts`. This plan contributes **16 tests** (robots 3, Section 3, Eyebrow 1, SectionHeader 3, Button 5, TextLink 1); utils adds its own on top. Build compiles with no warnings about missing fonts. If `format:check` fails, run `npm run format`, re-run the suite, and amend the offending commit or add a `style:` commit.

- [ ] **Step 2: Playwright e2e still green**

```bash
npx playwright install --with-deps --no-shell chromium
npm run test:e2e
```

Expected: `contact-form.spec.ts` + `homepage.spec.ts` pass (they assert the title, which is unchanged).

- [ ] **Step 3: Visual eyeball of the foundation (temporary, reverted)**

Temporarily replace the JSX in `src/app/page.tsx` (do NOT commit this) with:

```tsx
export default function HomePage() {
  return (
    <main>
      <h1>Imperium Italian Textile</h1>
      <p>Scaffold placeholder. Sections are assembled per DEVELOPMENT_ROADMAP.md.</p>
    </main>
  );
}
```

→

```tsx
import { Section } from "@/components/layout";
import { Button, Eyebrow, SectionHeader, TextLink } from "@/components/ui";

export default function HomePage() {
  return (
    <main>
      <Section id="demo" ariaLabelledby="demo-heading">
        <SectionHeader
          id="demo-heading"
          eyebrow="Foundation check"
          headline="Fabric with a story."
          subline="Cormorant Garamond headline over DM Sans body — tokens, fonts and primitives working together."
        />
        <p>
          <Button variant="ghost">Explore our fabrics</Button>{" "}
          <Button variant="filled">Request Samples</Button>{" "}
          <Button variant="whatsapp">Chat on WhatsApp</Button> <Button loading>Sending…</Button>
        </p>
        <TextLink href="#demo">Request a sample →</TextLink>
      </Section>
      <Section background="gesso" dense>
        <Eyebrow>Dense gesso band</Eyebrow>
      </Section>
    </main>
  );
}
```

Run `npm run dev`, open http://localhost:3000 and confirm against `DESIGN.md`:

- [ ] Background is Pietra `#FAF8F3`; headline serif (Cormorant), body DM Sans; no font flash on reload
- [ ] Eyebrow: 11px, uppercase, wide tracking, Sabbia
- [ ] Ghost button fills Blu Notte on hover; filled darkens; whatsapp is green; loading button is dimmed and unclickable
- [ ] TextLink underline draws left→right on hover; Tab key shows a 2px Blu Notte focus ring on every control
- [ ] With OS reduced-motion enabled, hover states change instantly (no transition)
- [ ] No console errors; no 404s in the Network tab (fonts included)

Then revert the demo:

```bash
git checkout -- src/app/page.tsx
git status   # Expected: working tree clean
```

- [ ] **Step 4: Push and hand off**

```bash
git push -u origin feat/phase-1-foundation-and-safety
```

If the executor has no push rights to `Akshay-M-Singh/Imperium`: `git format-patch main --stdout > phase-1.patch` and hand the patch to Akshay. Either way, open a PR to `main` titled `Phase 1 foundation + safety fixes` and note in the description: **merging this makes the live site noindex** (intended — PRD F-5; flip `NEXT_PUBLIC_ALLOW_INDEXING=true` in Vercel only at launch) and **the /ar URL becomes a 404** (loop removed; Arabic ships with D-05).

- [ ] **Step 5: Confirm CI**

GitHub Actions runs lint → typecheck → test → build → e2e on the PR. Expected: green. If Playwright fails only in CI, read the uploaded `playwright-report` artifact before changing anything (superpowers:systematic-debugging).

---

## Out of Scope (deliberately)

- Nav/Hero (build Phase 2 — needs its own plan; hero asset A-5 and nav labels depend on PRD D-01/D-03 progress).
- Contact pipeline, email, rate limiting (Phase 4 — PRD F-1; blocked by D-06/D-08 and unblocked founder answers).
- Any copy or `src/data/` changes (content pass, PRD §7 — founder-gated).
- Canonical domain / metadataBase changes (launch phase, PRD D-07 — deferred by user 2026-07-02).
- Vitest 4 upgrade (separate maintenance window, PRD §9).

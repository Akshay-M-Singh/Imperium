# Contact Form Focus Fix, Email Button & Instagram Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the focus outline that strikes through floated form-field labels, add a direct-email pill button beside the WhatsApp button, and remove the "Follow our journey" Instagram line from the contact section — in both locales.

**Architecture:** One CSS-only fix in `FormField.module.css` (all six fields share the `.input` class), one new `EmailButton` ui component mirroring `WhatsAppButton`'s inline variant, and a clean deletion of the contact-section Instagram link plus its two data keys. No structural changes. Spec: `docs/superpowers/specs/2026-07-14-contact-form-focus-email-button-design.md`.

**Tech Stack:** Next.js 15.5 (App Router) · TypeScript strict · CSS Modules · Framer Motion (MagneticButton) · Vitest + Testing Library

## Global Constraints

- Branch: create `fix/contact-form-focus-email-button` off `main` (use superpowers:using-git-worktrees at execution time). First commit on the branch: the spec + this plan (`git add docs/superpowers/specs/2026-07-14-contact-form-focus-email-button-design.md docs/superpowers/plans/2026-07-14-contact-form-focus-email-button.md && git commit -m "docs: spec and plan for contact form focus fix, email button, instagram removal"`).
- **Never `git add -A` or `git add .`** — the working tree contains unrelated untracked files (`.claude/`, other sessions' plan docs). Add exact paths only, as each commit step lists.
- Both locales always: any string added to `src/data/contact.ts` goes into **both** `en` and `ar` objects, and any key removed comes out of **both** — `tests/unit/data/locale-parity.test.ts` enforces this.
- New AR strings are machine-assisted MSA drafts and MUST be added to `docs/superpowers/specs/2026-07-14-ar-copy-review-sheet.md` §8 (AR launch gate, CLAUDE.md §10 item 6). Brand names stay in Latin script.
- The email address is `imperium.italian.textile@gmail.com` (client-confirmed interim inbox — already in `contact.ts` as `t.email`; never hardcode it in components, read it from the data).
- Verification commands: `npm run test` (Vitest), `npm run typecheck`, `npm run build`. All must be green before the branch is offered for merge.
- The footer's Instagram link (`Footer.tsx:44-49`, driven by `SITE.instagram`/`SITE.instagramHandle` in `src/lib/site.ts`) is **out of scope — do not touch it**.
- The fixed mobile WhatsApp bar stays WhatsApp-only; the new email button is inline-only.

---

### Task 1: Fix the focus outline striking through floated labels

**Files:**

- Modify: `src/components/ui/FormField.module.css:50-52` (the `.input:focus-visible` block) and append two rules
- Test: manual browser verification (CSS-only change; existing `tests/unit/components/ui/FormField.test.tsx` guards behavior)

**Interfaces:**

- Consumes: global `:focus-visible` rule in `src/app/globals.css:351-354` (unchanged — it stays for every other element).
- Produces: nothing consumed by later tasks.

**Background for the implementer:** the fields are underline-only inputs (DESIGN.md §9.08). Focus is already signalled three ways: the `AnimatedFocusRing` component (an animated 2px blu-notte bottom line, skipped under reduced motion), the input's `border-bottom-color` change, and the floating label turning blu-notte. The global `:focus-visible` rectangle (2px outline, 2px offset) is redundant on these inputs and its top edge lands exactly where the floated label sits — that's the reported bug. We suppress the rectangle **only on `.input`** and thicken the underline so reduced-motion users keep a strong indicator.

- [ ] **Step 1: Reproduce the bug**

Start the dev server (`npm run dev`, or the Browser pane's launch config if present), open `http://localhost:3000/#contact`, click into the **Email** field. Confirm a rectangle outline appears whose top line crosses the floated "EMAIL" label. Check one more field (e.g. the textarea) to confirm it's universal.

- [ ] **Step 2: Apply the CSS fix**

In `src/components/ui/FormField.module.css`, replace:

```css
.input:focus-visible {
  border-bottom-color: var(--color-blu-notte);
}
```

with:

```css
.input:focus-visible {
  /* Underline-only design (DESIGN.md §9.08): the global focus rectangle
     strikes through the floated label, so the underline below + the
     AnimatedFocusRing are the focus indicator for these fields. */
  outline: none;
  border-bottom-color: var(--color-blu-notte);
  box-shadow: 0 1px 0 0 var(--color-blu-notte); /* 2px-equivalent underline, no layout shift */
}
```

Then, directly after the existing `.inputError, .inputError:focus-visible { ... }` block (around line 93), add:

```css
.inputError:focus-visible {
  box-shadow: 0 1px 0 0 var(--color-error);
}
```

(Order matters: this must come **after** the `.input:focus-visible` rule so the error color wins at equal specificity.)

- [ ] **Step 3: Verify in the browser (EN)**

Reload `http://localhost:3000/#contact`. Tab/click through all six fields (name, email, company, phone, role select, project textarea). Confirm: no rectangle outline; a clearly visible 2px underline on the focused field; floated label fully legible. Also submit the empty form once and focus an errored field — the underline must be error-red.

- [ ] **Step 4: Verify in the browser (AR / RTL) and fix the label origin if it drifts**

Open `http://localhost:3000/ar/#contact` and focus each field. The floated label must sit flush at the field's inline-start (right edge in RTL) while shrinking. If it drifts toward the center/left, add to `FormField.module.css` after the `.label[data-floating="true"]` block (this `[dir="rtl"]` pattern already exists in `Arrow.module.css` and `Collections.module.css`):

```css
[dir="rtl"] .label {
  transform-origin: right center;
}
```

Re-verify. If there was no drift, skip the rule — don't add dead CSS.

- [ ] **Step 5: Run the guards**

Run: `npx vitest run tests/unit/components/ui/FormField.test.tsx` → Expected: PASS (all existing tests).
Run: `npm run typecheck` → Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/FormField.module.css
git commit -m "fix: keep floated form labels clear of the focus indicator"
```

---

### Task 2: Remove the Instagram line from the contact section

**Files:**

- Modify: `src/components/sections/Contact.tsx` (delete the Instagram `<p>` block at lines 144-148; drop the `SITE` import at line 26 and the `Arrow` import at line 17 — both become unused, verified their only use in this file is the Instagram line)
- Modify: `src/components/sections/Contact.module.css` (delete the three `.instagram` rule blocks, lines 99-116)
- Modify: `src/data/contact.ts` (remove `instagramHandle` and `instagramLinkLabel` from the `ContactData` interface, lines 20 and 23, and from **both** locale objects — `en` lines 58/61, `ar` lines 114/117)
- Modify: `docs/superpowers/specs/2026-07-14-ar-copy-review-sheet.md` §8 (delete the "Follow our journey" / "تابِع رحلتنا" row — the string no longer ships)

**Interfaces:**

- Consumes: nothing from Task 1.
- Produces: `ContactData` without the two Instagram keys — Task 3 edits the same interface, so run this task first.

- [ ] **Step 1: Confirm the only consumers**

Run: `grep -rn "instagramLinkLabel\|instagramHandle" src tests`
Expected: hits only in `src/components/sections/Contact.tsx:146`, `src/data/contact.ts` (interface + both locales), and `src/lib/site.ts:21` (`SITE.instagramHandle` — footer's, untouched). If anything else appears, stop and reassess before deleting.

- [ ] **Step 2: Delete the render block**

In `src/components/sections/Contact.tsx`, delete:

```tsx
<p>
  <a href={SITE.instagram} className={styles.instagram}>
    {t.instagramLinkLabel} <Arrow /> {t.instagramHandle}
  </a>
</p>
```

and remove the two now-unused imports:

```tsx
import { Arrow } from "@/components/ui/Arrow";
```

```tsx
import { SITE } from "@/lib/site";
```

- [ ] **Step 3: Delete the styles**

In `src/components/sections/Contact.module.css`, delete all three `.instagram` blocks:

```css
.instagram {
  font-size: 14px;
  color: var(--color-sabbia);
  text-decoration: none;
  transition: color var(--motion-duration-fast) var(--motion-ease-out);
}

.instagram:focus-visible {
  color: var(--color-carbone);
  text-decoration: underline;
}

@media (hover: hover) and (pointer: fine) {
  .instagram:hover {
    color: var(--color-carbone);
    text-decoration: underline;
  }
}
```

- [ ] **Step 4: Remove the data keys (interface + both locales)**

In `src/data/contact.ts` remove from the interface:

```ts
instagramHandle: string;
```

```ts
instagramLinkLabel: string;
```

From the `en` object remove:

```ts
    instagramHandle: "@imperiumitaliantextile",
```

```ts
    instagramLinkLabel: "Follow our journey",
```

From the `ar` object remove:

```ts
    instagramHandle: "@imperiumitaliantextile",
```

```ts
    instagramLinkLabel: "تابِع رحلتنا",
```

- [ ] **Step 5: Update the AR review sheet**

In `docs/superpowers/specs/2026-07-14-ar-copy-review-sheet.md` §8 (Contact table), delete the row whose English source is "Follow our journey" (Arabic draft "تابِع رحلتنا"). Leave every other row untouched.

- [ ] **Step 6: Verify**

Run: `npm run test` → Expected: PASS, including `tests/unit/data/locale-parity.test.ts` (keys removed from both locales symmetrically).
Run: `npm run typecheck` → Expected: clean (proves no other consumer of the deleted keys).
Browser: reload `/#contact` and `/ar/#contact` — the Instagram line is gone; scroll to the footer — its Instagram link still renders.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/Contact.tsx src/components/sections/Contact.module.css src/data/contact.ts docs/superpowers/specs/2026-07-14-ar-copy-review-sheet.md
git commit -m "feat: remove instagram link from contact section"
```

---

### Task 3: EmailButton component beside the WhatsApp button

**Files:**

- Create: `src/components/ui/EmailButton.tsx`
- Create: `src/components/ui/EmailButton.module.css`
- Test: `tests/unit/components/ui/EmailButton.test.tsx`
- Modify: `src/data/contact.ts` (add `emailButtonLabel` + `emailSubjectPrefill` to the interface and both locales)
- Modify: `src/components/ui/index.ts` (export the new component)
- Modify: `src/components/sections/Contact.tsx` (render both channel buttons in a shared wrapper)
- Modify: `src/components/sections/Contact.module.css` (rename `.whatsapp` → `.channels`, make it a wrapping flex row)
- Modify: `docs/superpowers/specs/2026-07-14-ar-copy-review-sheet.md` §8 (two new rows)

**Interfaces:**

- Consumes: `ContactData` as left by Task 2 (no Instagram keys); `contact` record from `@/data/contact`; `MagneticButton` from `@/components/motion/MagneticButton` (`{ children: ReactNode }`); `Arrow` from `./Arrow`; `Locale` type from `@/lib/i18n`.
- Produces: `EmailButton({ locale?: Locale }): ReactNode`, exported from `@/components/ui/EmailButton` and re-exported from `@/components/ui`; new data keys `emailButtonLabel: string` and `emailSubjectPrefill: string` on `ContactData`.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/components/ui/EmailButton.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmailButton } from "@/components/ui/EmailButton";

describe("EmailButton", () => {
  it("renders a mailto link with the localized subject prefilled", () => {
    render(<EmailButton />);
    const link = screen.getByRole("link", { name: "Email Us" });
    expect(link).toHaveAttribute(
      "href",
      `mailto:imperium.italian.textile@gmail.com?subject=${encodeURIComponent(
        "Fabric inquiry — Imperium Italian Textile",
      )}`,
    );
    // mailto must open the mail client in place, never a blank tab
    expect(link).not.toHaveAttribute("target");
  });

  it("renders the Arabic label for locale ar", () => {
    render(<EmailButton locale="ar" />);
    expect(screen.getByRole("link", { name: "راسلنا عبر البريد الإلكتروني" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/components/ui/EmailButton.test.tsx`
Expected: FAIL — cannot resolve import `@/components/ui/EmailButton`.

- [ ] **Step 3: Add the data keys (interface + both locales)**

In `src/data/contact.ts`, add to the `ContactData` interface directly after `whatsappPrefill: string;`:

```ts
emailButtonLabel: string;
emailSubjectPrefill: string;
```

In the `en` object, directly after the `whatsappPrefill` line:

```ts
    emailButtonLabel: "Email Us",
    emailSubjectPrefill: "Fabric inquiry — Imperium Italian Textile",
```

In the `ar` object, directly after the `whatsappPrefill` line:

```ts
    emailButtonLabel: "راسلنا عبر البريد الإلكتروني",
    emailSubjectPrefill: "استفسار عن الأقمشة — Imperium Italian Textile",
```

(AR strings are MSA drafts; brand name stays Latin per review-sheet convention. Step 8 registers them for native review.)

- [ ] **Step 4: Create the component and its styles**

Create `src/components/ui/EmailButton.tsx`:

```tsx
import type { ReactNode } from "react";
import { contact } from "@/data/contact";
import type { Locale } from "@/lib/i18n";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Arrow } from "./Arrow";
import styles from "./EmailButton.module.css";

export interface EmailButtonProps {
  locale?: Locale;
}

export function EmailButton({ locale = "en" }: EmailButtonProps): ReactNode {
  const t = contact[locale];
  const href = `mailto:${t.email}?subject=${encodeURIComponent(t.emailSubjectPrefill)}`;

  return (
    <MagneticButton>
      <a href={href} className={styles.button} aria-label={t.emailButtonLabel}>
        {t.emailButtonLabel} <Arrow />
      </a>
    </MagneticButton>
  );
}

export default EmailButton;
```

Create `src/components/ui/EmailButton.module.css`:

```css
/* EmailButton — direct email channel pill; mirrors WhatsAppButton's inline
   variant in the brand's Blu Notte (WhatsApp green stays WhatsApp's). */

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  min-block-size: 56px;
  padding-inline: var(--space-lg);
  border: 1px solid var(--color-blu-notte);
  border-radius: 100px;
  background-color: var(--color-blu-notte);
  color: var(--color-gesso);
  font-family: var(--font-sans);
  font-size: var(--text-caption);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  text-decoration: none;
  transition:
    background-color var(--motion-duration-fast) var(--motion-ease-standard),
    border-color var(--motion-duration-fast) var(--motion-ease-standard),
    transform 100ms var(--motion-ease-out);
  touch-action: manipulation;
}

.button:active {
  transform: scale(0.97);
}

@media (hover: hover) and (pointer: fine) {
  .button:hover {
    background-color: color-mix(in srgb, var(--color-blu-notte) 90%, black);
    border-color: color-mix(in srgb, var(--color-blu-notte) 90%, black);
  }
}
```

(No `:focus-visible` override: the global blu-notte outline with its 2px offset gap reads clearly around the pill. No `.fixed` variant by design.)

Add to `src/components/ui/index.ts` after the `WhatsAppButton` line:

```ts
export { EmailButton, type EmailButtonProps } from "./EmailButton";
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/unit/components/ui/EmailButton.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 6: Wire it into the contact section**

In `src/components/sections/Contact.tsx`, add the import next to the `WhatsAppButton` import:

```tsx
import { EmailButton } from "@/components/ui/EmailButton";
```

and replace:

```tsx
<div className={styles.whatsapp}>
  <WhatsAppButton locale={locale} />
</div>
```

with:

```tsx
<div className={styles.channels}>
  <WhatsAppButton locale={locale} />
  <EmailButton locale={locale} />
</div>
```

In `src/components/sections/Contact.module.css`, replace:

```css
.whatsapp {
  margin-block-start: var(--space-xs);
}
```

with:

```css
.channels {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-block-start: var(--space-xs);
}
```

- [ ] **Step 7: Verify in the browser**

On `/#contact`: both pills render side by side (wrapping to two rows on narrow viewports — check at 375px width too); the email pill opens a mail draft to `imperium.italian.textile@gmail.com` with the subject prefilled; the plain email text link above them still renders. Repeat on `/ar/#contact` — Arabic label, RTL order correct, arrow flipped (Arrow handles this itself).

- [ ] **Step 8: Register the AR drafts for native review**

In `docs/superpowers/specs/2026-07-14-ar-copy-review-sheet.md` §8 (Contact table), add two rows:

```markdown
| Email Us (email button label) | راسلنا عبر البريد الإلكتروني |
| Fabric inquiry — Imperium Italian Textile (email subject prefill) | استفسار عن الأقمشة — Imperium Italian Textile |
```

- [ ] **Step 9: Full suite**

Run: `npm run test` → Expected: PASS, including locale-parity (keys added to both locales).
Run: `npm run typecheck` → Expected: clean.

- [ ] **Step 10: Commit**

```bash
git add src/components/ui/EmailButton.tsx src/components/ui/EmailButton.module.css src/components/ui/index.ts src/data/contact.ts src/components/sections/Contact.tsx src/components/sections/Contact.module.css tests/unit/components/ui/EmailButton.test.tsx docs/superpowers/specs/2026-07-14-ar-copy-review-sheet.md
git commit -m "feat: add direct email button beside whatsapp"
```

---

### Task 4: Docs + final verification

**Files:**

- Modify: `CLAUDE.md` (append Addendum 4 to the header block, after Addendum 3)

**Interfaces:**

- Consumes: the finished state of Tasks 1–3.
- Produces: nothing — this closes the branch.

- [ ] **Step 1: Append Addendum 4 to CLAUDE.md**

Directly after the Addendum 3 blockquote line in `CLAUDE.md`'s header, add:

```markdown
> **Addendum 4 (2026-07-14):** plan `docs/superpowers/plans/2026-07-14-contact-form-focus-email-button.md` (branch `fix/contact-form-focus-email-button`) fixed the contact-form focus indicator (the global `:focus-visible` rectangle was striking through floated field labels — inputs now use the underline-only indicator per DESIGN.md §9.08), added a direct **email pill button** beside the WhatsApp button (new `EmailButton` component; `emailButtonLabel`/`emailSubjectPrefill` in both locales — the AR pair is a machine draft added to the review sheet, §10 item 6 gate applies), and **removed the Instagram link from the contact section** by client decision (the "Follow our journey" line; the footer's Instagram link remains, and the handle's existence is still unverified — §7 item 11).
```

- [ ] **Step 2: Full verification suite**

Run: `npm run test` → Expected: all pass (baseline suite + 2 new EmailButton tests).
Run: `npm run typecheck` → Expected: clean.
Run: `npm run build` → Expected: succeeds.

- [ ] **Step 3: Final browser pass (use superpowers:verification-before-completion)**

With the production build (`npm run build && npm run start`) or dev server, on **both** `/#contact` and `/ar/#contact`:

1. Focus all six form fields — labels never struck through, 2px underline visible, error state red.
2. Both channel pills render and work; email opens a prefilled draft.
3. No "Follow our journey" text anywhere on the page (`curl -s http://localhost:3000 | grep -ci "follow our journey"` → `0`).
4. Footer Instagram link still present.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: record contact form focus fix, email button, instagram removal in brief"
```

- [ ] **Step 5: Finish the branch**

Use superpowers:finishing-a-development-branch — present merge/PR options to the user. Do not merge without their say-so.

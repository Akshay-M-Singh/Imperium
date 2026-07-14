# Contact Form Field Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop the "Your role" dropdown from rendering its label text twice, and stop the "Tell us about your project" textarea's floating label from overlapping typed text on narrow/mobile widths.

**Architecture:** Two small, independent fixes in the shared `FormField` component. Fix 1 is a one-token JSX change (empty the select's placeholder option). Fix 2 is two CSS rules (keep the floated label on one line + give the textarea top breathing room). No new components, no data changes, no copy changes. Spec: `docs/superpowers/specs/2026-07-14-contact-form-field-polish-design.md`.

**Tech Stack:** Next.js 15.5 (App Router) · TypeScript strict · CSS Modules · Framer Motion · Vitest + Testing Library

## Global Constraints

- Branch: create `fix/contact-form-field-polish` off `main` (use superpowers:using-git-worktrees at execution time). First commit on the branch: the spec + this plan (`git add docs/superpowers/specs/2026-07-14-contact-form-field-polish-design.md docs/superpowers/plans/2026-07-14-contact-form-field-polish.md && git commit -m "docs: spec and plan for contact form field polish"`).
- **Never `git add -A` or `git add .`** — the working tree has unrelated untracked files (`.claude/`, other sessions' docs). Add exact paths only, as each commit step lists.
- No copy changes: the labels "Your role" and "Tell us about your project" stay exactly as they are in `src/data/contact.ts`. These fixes are structural/visual only.
- No data-file changes: `src/data/contact.ts` is not touched, so the `locale-parity` test is unaffected and no AR review-sheet update is needed.
- Spacing tokens (from `src/app/globals.css`): `--space-sm: 16px`, `--space-md: 24px`, `--space-lg: 40px`. Use the token names in CSS, not raw pixels.
- Verification commands: `npm run test` (Vitest), `npm run typecheck`, `npm run build`. All green before the branch is offered for merge.
- Out of scope — do not touch: the QuillBot blue-circle icon (a browser extension, not a site element); the focus-outline fix, email button, and Instagram removal (already shipped on `main`); the friendly label wording.

---

### Task 1: Stop the "Your role" dropdown duplicating its label

**Files:**

- Modify: `src/components/ui/FormField.tsx` (the select's placeholder `<option>`, around lines 84-86)
- Test: `tests/unit/components/ui/FormField.test.tsx` (add one test)

**Interfaces:**

- Consumes: nothing from other tasks.
- Produces: nothing consumed by other tasks (independent of Task 2).

**Background for the implementer:** `FormField` renders text inputs, a textarea, and a `<select>`. Every text input is empty at rest and shows only its floating label (its real `placeholder` is a single space `" "`). The select is the exception: its placeholder `<option>` uses `{label}` as its text, so the field's own label ("Your role") is displayed _twice_ — once as the floating `<label>` and once as the dropdown's shown value — stacked with the float gap between them. The fix makes the placeholder option empty so the floating label is the sole placeholder, exactly like the text inputs. The `<select>` keeps its associated `<label htmlFor={id}>`, so the accessible name and `getByLabelText` lookups are unaffected; `required` still fires on the empty `value=""`.

- [ ] **Step 1: Write the failing test**

In `tests/unit/components/ui/FormField.test.tsx`, add this test inside the `describe("FormField", …)` block (e.g. after the existing "renders a select with options" test at line 55):

```tsx
it("does not duplicate the field label as the select's placeholder text", () => {
  render(
    <FormField
      name="role"
      label="Your role"
      type="select"
      options={[{ value: "tailor", label: "Tailor" }]}
    />,
  );
  const select = screen.getByLabelText("Your role") as HTMLSelectElement;
  const placeholder = select.querySelector('option[value=""]');
  expect(placeholder).not.toBeNull();
  // The placeholder option must be empty so it doesn't echo the floating label.
  expect(placeholder?.textContent).toBe("");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/components/ui/FormField.test.tsx -t "does not duplicate"`
Expected: FAIL — `expected 'Your role' to be ''` (the placeholder option currently contains the label text).

- [ ] **Step 3: Empty the placeholder option**

In `src/components/ui/FormField.tsx`, find the select branch:

```tsx
      <select {...commonProps} defaultValue="">
        <option value="" disabled hidden>
          {label}
        </option>
        {options.map((option) => (
```

Replace the placeholder option with an empty one:

```tsx
      <select {...commonProps} defaultValue="">
        <option value="" disabled hidden></option>
        {options.map((option) => (
```

(Only the `<option value="" disabled hidden>…</option>` changes — leave `defaultValue`, the `.map`, and everything else exactly as-is.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/components/ui/FormField.test.tsx`
Expected: PASS — the new test plus all existing FormField tests (the "renders a select with options" test still finds "Tailor"/"Designer" and looks the select up by its label, both unaffected).

- [ ] **Step 5: Verify in the browser**

Start the dev server (`npm run dev`, or the Browser pane launch config) and open `http://localhost:3000/#contact`.

- At rest, the "Your role" field shows the label **once** as a placeholder over a blank dropdown — no doubled "Your role / YOUR ROLE" block.
- Click it and choose "Tailor": the label floats up and the dropdown shows "Tailor" beneath — no duplication.
  Repeat on `http://localhost:3000/ar/#contact` (the Arabic label "مجال عملك" must likewise appear only once).

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/FormField.tsx tests/unit/components/ui/FormField.test.tsx
git commit -m "fix: stop role select from duplicating its label as placeholder"
```

---

### Task 2: Clear the textarea floating label off the typed text

**Files:**

- Modify: `src/components/ui/FormField.module.css` (the `.label[data-floating="true"]` block at lines 32-34, and the `textarea.input` block at lines 88-93)
- Test: none (CSS-only; jsdom has no layout). Browser-verified below.

**Interfaces:**

- Consumes: nothing from Task 1 (independent — either task can go first).
- Produces: nothing consumed by other tasks.

**Background for the implementer:** every field's label floats up with a fixed `translateY(-16px) scale(0.75)` (set in `FormField.tsx`'s `motion.label`), which is tuned for single-line labels. "Tell us about your project" is the longest label; at the contact card's width it wraps to **two lines when floated**, so the 16px lift clears only the first line and the second line lands on the textarea's first typed line. Measured on the live DOM at a 360px card: current overlap is +16px into the text; adding `white-space: nowrap` keeps the floated label one line and turns that into −8px clearance (floated label is 224px wide, fits the card). A small top-padding bump on the textarea adds comfort margin for cross-browser font variance. Only the textarea is affected in practice — `nowrap` is a no-op for the short single-line labels, and the padding change is `textarea`-scoped.

- [ ] **Step 1: Reproduce the bug**

With the dev server running, open `http://localhost:3000/#contact` and narrow the browser window until the form card is roughly 360-400px wide (or open dev tools device mode at 375px). Click into the "Tell us about your project" textarea and type a few words. Confirm the floated label's second line sits **on top of** the first typed line.

- [ ] **Step 2: Keep the floated label on one line**

In `src/components/ui/FormField.module.css`, change the floating-state label block (currently lines 32-34):

```css
.label[data-floating="true"] {
  color: var(--color-blu-notte);
}
```

to:

```css
.label[data-floating="true"] {
  color: var(--color-blu-notte);
  /* Keep the floated label one line so the fixed -16px lift always clears the
     field; otherwise the long textarea label wraps and its 2nd line overlaps
     the typed text (measured +16px overlap at a 360px card). */
  white-space: nowrap;
}
```

- [ ] **Step 3: Give the textarea top breathing room**

In the same file, change the `textarea.input` block (currently lines 88-93):

```css
/* Textarea keeps newlines and grows with content. */
textarea.input {
  min-block-size: 120px;
  resize: vertical;
  padding-block: var(--space-sm);
}
```

to:

```css
/* Textarea keeps newlines and grows with content. Extra top padding lets the
   first typed line clear the floated label; bottom stays 16px for the resize handle. */
textarea.input {
  min-block-size: 120px;
  resize: vertical;
  padding-block: var(--space-md) var(--space-sm);
}
```

(`padding-block: <top> <bottom>` → top becomes `--space-md` (24px), bottom stays `--space-sm` (16px). `min-block-size` and `resize` are unchanged.)

- [ ] **Step 4: Verify the fix in the browser (EN)**

Reload `http://localhost:3000/#contact`. At the narrow width from Step 1, focus the textarea and type two lines. Confirm the floated label is a single line sitting fully **above** the typing area with clear space — no overlap. Widen back to full desktop and confirm it still looks right (label floats cleanly, textarea unchanged otherwise). Also click into a text input and the select to confirm their labels are visually unchanged (nowrap is a no-op for them).

- [ ] **Step 5: Verify RTL (AR)**

Open `http://localhost:3000/ar/#contact`, focus the Arabic project textarea ("حدّثنا عن مشروعك") and type. The floated label must sit above the text on the right-hand (inline-start) side with no overlap. The label already has `[dir="rtl"] .label { transform-origin: right center; }` (lines 36-38), so it should anchor correctly; if it visibly drifts, stop and report — do not add new rules without confirming the cause.

- [ ] **Step 6: Run the guards**

Run: `npx vitest run tests/unit/components/ui/FormField.test.tsx` → Expected: PASS (unchanged behavior; the textarea test still finds the textarea).
Run: `npm run typecheck` → Expected: clean.

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/FormField.module.css
git commit -m "fix: keep textarea floating label clear of typed text"
```

---

### Task 3: Docs + final verification

**Files:**

- Modify: `CLAUDE.md` (append Addendum 5 to the header block, after Addendum 4)

**Interfaces:**

- Consumes: the finished state of Tasks 1-2.
- Produces: nothing — this closes the branch.

- [ ] **Step 1: Append Addendum 5 to CLAUDE.md**

Directly after the Addendum 4 blockquote line in `CLAUDE.md`'s header, add:

```markdown
> **Addendum 5 (2026-07-14):** plan `docs/superpowers/plans/2026-07-14-contact-form-field-polish.md` (branch `fix/contact-form-field-polish`) polished two contact-form fields: the **"Your role" select** no longer echoes its own label as the placeholder option (the option text was `{label}`, duplicating the floating `<label>`; it is now empty, so the floating label is the sole placeholder, matching the text inputs), and the **project textarea's floating label** no longer overlaps typed text on narrow/mobile widths (`white-space: nowrap` on the floated label keeps it one line, plus a `--space-md` top padding on the textarea for clearance). CSS/JSX only — no copy, data, or component changes. The blue-circle icon reported alongside these was diagnosed as the reporter's **QuillBot browser extension**, not a site element (no code change).
```

- [ ] **Step 2: Full verification suite**

Run: `npm run test` → Expected: all pass (baseline suite + the new select test from Task 1).
Run: `npm run typecheck` → Expected: clean.
Run: `npm run build` → Expected: succeeds.

- [ ] **Step 3: Final browser pass (use superpowers:verification-before-completion)**

With the dev server (or `npm run build && npm run start`), on **both** `/#contact` and `/ar/#contact`, at desktop and 375px mobile:

1. "Your role" dropdown shows its label only once (blank dropdown at rest; value shown after selecting).
2. Project textarea, focused with typed text, is never overlapped by its label.
3. The other four fields (name, email, company, phone) look unchanged.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: record contact form field polish in brief"
```

- [ ] **Step 5: Finish the branch**

Use superpowers:finishing-a-development-branch — present merge/PR options to the user. Do not merge without their say-so. (Note: this repo deploys `main` via Vercel's Git integration; if a deploy doesn't pick up automatically after merge, an empty `chore: force vercel redeploy` commit on `main` retriggers it — this happened last session.)

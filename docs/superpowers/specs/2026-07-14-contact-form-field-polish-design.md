# Contact Form Field Polish — "Your Role" Dropdown & Textarea Label — Design

**Date:** 2026-07-14 · **Status:** approved for planning · **Branch (at execution):** `fix/contact-form-field-polish`

## Context

Two visual defects in the contact-form fields (`FormField` component), reported after the focus/email-button pass shipped:

1. **"Your role" dropdown shows duplicated text.** The floating label ("YOUR ROLE") and the select's own placeholder ("Your role") are the same words stacked with the float gap between them — reads as an awkward doubled block.
2. **The "Tell us about your project" textarea label overlaps typed text** on narrower/mobile widths.

Both are confirmed against the live DOM (`https://imperium-opal.vercel.app`), not just inferred from code. The blue circle icon in the reporter's screenshot is the **QuillBot browser extension** injecting a button into the text field — not a site element, no code change, out of scope.

## 1. "Your role" dropdown — duplicated placeholder text

**Root cause (verified in code + live DOM):** in `src/components/ui/FormField.tsx`, the select's placeholder option is built with `{label}` as its text:

```tsx
<option value="" disabled hidden>
  {label}          // "Your role" — identical to the floating <label> above it
</option>
```

Live-DOM check returned `duplicatesLabel: true` (field label `"Your role"` === placeholder option `"Your role"`). The select is the only field that displays text at rest; every text input shows just its label because the real placeholder is a blank space (`placeholder=" "`). So the select uniquely renders the same words twice.

**Fix (JSX-only, `FormField.tsx`):** empty the placeholder option so the floating label becomes the select's sole placeholder — matching the text inputs.

```tsx
<option value="" disabled hidden></option>
```

**Resulting behavior:**

- At rest → blank dropdown with the label "Your role" sitting over it as placeholder (identical pattern to the text inputs).
- On focus / after a choice → label floats up, dropdown shows the chosen value ("Tailor", etc.). No duplication, no gap.

**Unaffected:** `required` validation still fires on the empty `value=""` (unchanged). Accessibility is unchanged — the accessible name comes from the associated `<label htmlFor={id}>Your role</label>`, not from the option, so `getByLabelText("Your role")` and screen-reader output still work.

**Test:** add one unit test to `tests/unit/components/ui/FormField.test.tsx` asserting the select's `option[value=""]` has empty text content (guards against the duplication regressing).

## 2. Textarea label overlaps typed text

**Root cause (verified in code + measured live):** every label floats with a _fixed_ `translateY(-16px) scale(0.75)` (set in `FormField.tsx`'s `motion.label` animate prop), tuned for single-line labels. "Tell us about your project" is the longest label; at the contact card's width it wraps to **two lines when floated**, so a 16px lift clears only the first line and the second line drops onto the textarea's first typed line.

Measured on the live DOM at a 360px-wide card (wrapping threshold / mobile):

| State                               | Result                                                                       |
| ----------------------------------- | ---------------------------------------------------------------------------- |
| Floated, current (wrap allowed)     | label bottom **+16px into** textarea text → overlaps                         |
| Floated, with `white-space: nowrap` | label bottom **−8px above** text → clears; floated width 224px fits the card |

**Fix (CSS-only, `FormField.module.css`), two complementary rules:**

1. Keep the floated label on one line — add to the existing `.label[data-floating="true"]` block:

   ```css
   white-space: nowrap;
   ```

   This alone turns the +16px overlap into −8px clearance. At rest the label may still wrap as a placeholder in the empty box — harmless (no typed text yet).

2. Add breathing room above the textarea text — change the textarea's top padding from the shared 16px to 24px:

   ```css
   textarea.input {
     /* …existing rules… */
     padding-block: var(--space-md) var(--space-sm); /* was: var(--space-sm) — top 24px, bottom 16px */
   }
   ```

   `--space-md` is 24px, `--space-sm` 16px. Combined with rule 1 this gives ~16px total clearance so the first typed line sits comfortably below the floated label across browsers/fonts. The bottom padding stays 16px (keeps the resize-handle area intact); `min-block-size: 120px` and `resize: vertical` are unchanged.

**Scope & safety:**

- Only the textarea is affected in practice — it is the only field whose label is long enough to wrap. `white-space: nowrap` is a no-op for the short single-line labels; the padding change is `textarea`-scoped.
- RTL: the label already carries `[dir="rtl"] .label { transform-origin: right center; }` (FormField.module.css lines 36–38). `nowrap` does not affect the origin. Verify `/ar` regardless.
- Edge case (documented, not fixed): on a viewport below ~270px the 224px floated label could overflow horizontally. Below any common device width; acceptable.
- CSS-only, so no unit test (jsdom has no layout) — browser-verified. The existing "renders a textarea" test stays.

## Out of scope

- The QuillBot blue-circle icon (browser extension, not a site element).
- The focus-outline fix, email button, and Instagram removal — already shipped on `main` (plan `2026-07-14-contact-form-focus-email-button.md`).
- Any copy change to the labels (the friendly "Tell us about your project" and "Your role" wording is preserved).

## Verification

`npm run test` (existing suite + the new select test), `npm run typecheck`, `npm run build`, then a dev-server browser pass in **both** locales at desktop and 375px mobile:

- "Your role" shows a single, non-duplicated placeholder; picking a value floats the label and shows the value.
- The textarea, focused and with typed text, is never overlapped by its label (EN `/` and AR `/ar`).

## Housekeeping

Append **Addendum 5** to `CLAUDE.md` recording this form-field polish: the select placeholder de-duplication and the textarea floated-label clearance (note the QuillBot icon was diagnosed as a browser extension, not a site issue).

# Contact Form Focus Fix, Email Button & Instagram Link Removal — Design

**Date:** 2026-07-14 · **Status:** approved for planning · **Branch (at execution):** `fix/contact-form-focus-email-button`

## Context

Three client-requested changes to the contact section (`#contact`) of the Imperium homepage, both locales:

1. **Bug:** clicking into any contact-form field draws an outline that strikes through the floated label text (e.g. the word "EMAIL" is covered by a line).
2. **Feature:** alongside the existing WhatsApp button, add a button that opens an email draft directly.
3. **Removal:** the "Follow our journey → @imperiumitaliantextile" text under the WhatsApp button must go.

## Decisions (user-confirmed 2026-07-14)

- **Instagram:** remove the **entire** link line from the contact section (not just the "Follow our journey" phrase). The footer's Instagram link (driven by `SITE.instagram` / `SITE.instagramHandle` in `src/lib/site.ts`) stays.
- **Email:** the plain email-address text link stays; the new button is **additive**.
- **Scope:** email button is inline-only (contact section). The fixed mobile bottom bar remains WhatsApp-only.

## 1. Floating-label / focus-outline bug

**Root cause (verified in code):** `src/app/globals.css:351` applies a global `:focus-visible { outline: 2px solid var(--color-blu-notte); outline-offset: 2px; }` to every element. The form fields (`src/components/ui/FormField.module.css`) are designed as **underline-only** inputs (DESIGN.md §9.08): focus is signalled by the `AnimatedFocusRing` (2px bottom line), a border-bottom colour change, and the label floating up 16px and shrinking to 12/16 scale. The floated label lands exactly on the global outline rectangle's top edge (input top − 2px offset), so the outline line crosses the label text. All six fields (name, email, company, phone, role select, project textarea) share the `.input` class and exhibit the bug.

**Fix (CSS-only, `FormField.module.css`):**

```css
.input:focus-visible {
  outline: none; /* underline-only design; the rules below + AnimatedFocusRing are the focus indicator */
  border-bottom-color: var(--color-blu-notte);
  box-shadow: 0 1px 0 0 var(--color-blu-notte); /* thickens the underline to 2px with no layout shift */
}

.inputError:focus-visible {
  box-shadow: 0 1px 0 0 var(--color-error);
}
```

**Accessibility rationale:** removing the UA/global rectangle is safe here because focus remains clearly visible for every user class: 2px blu-notte underline (static, via box-shadow — works even when `AnimatedFocusRing` returns `null` under reduced motion) + floated label colour change to blu-notte. Error-state fields keep the error-red underline on focus.

**RTL companion check:** `.label` uses `transform-origin: left center`, which is wrong for `/ar` (RTL) — the scale-down anchors to the label's trailing edge. During execution, verify the AR form; if the floated label drifts, add:

```css
[dir="rtl"] .label {
  transform-origin: right center;
}
```

## 2. Email button

**New component:** `src/components/ui/EmailButton.tsx` + `EmailButton.module.css`, modelled 1:1 on `WhatsAppButton`'s inline variant (MagneticButton wrapper → pill `<a>` → label + `<Arrow />`, 56px min-height, uppercase caption type). Differences:

- Background/border **Blu Notte** (`--color-blu-notte`), text Gesso; hover darkens via `color-mix` like WhatsApp's. WhatsApp green stays exclusive to WhatsApp.
- `href` = `` `mailto:${t.email}?subject=${encodeURIComponent(t.emailSubjectPrefill)}` `` — no `target="_blank"` (mailto opens the mail client, not a tab).
- No `fixedMobile` variant.
- Focus style: rely on the global `:focus-visible` outline (blu-notte ring with 2px pietra gap around the pill — visible and consistent).

**Data (`src/data/contact.ts`, both locales — locale-parity test enforces this):**

| Key                   | EN                                        | AR (MSA draft — needs native review)          |
| --------------------- | ----------------------------------------- | --------------------------------------------- |
| `emailButtonLabel`    | Email Us                                  | راسلنا عبر البريد الإلكتروني                  |
| `emailSubjectPrefill` | Fabric inquiry — Imperium Italian Textile | استفسار عن الأقمشة — Imperium Italian Textile |

(Brand name stays in Latin script per the AR review-sheet convention.) Add both rows to §8 of `docs/superpowers/specs/2026-07-14-ar-copy-review-sheet.md` — the AR launch gate (CLAUDE.md §10 item 6) requires every AR string to pass native review.

**Placement (`Contact.tsx`):** replace the `.whatsapp` wrapper div with a `.channels` flex container (`display: flex; flex-wrap: wrap; gap: var(--space-sm)`) holding `<WhatsAppButton locale={locale} />` then `<EmailButton locale={locale} />`.

**Test:** new `tests/unit/components/ui/EmailButton.test.tsx` (model on existing ui tests): renders the EN label, `href` starts with `mailto:imperium.italian.textile@gmail.com` and contains the URL-encoded subject; renders the AR label under `locale="ar"`.

## 3. Instagram line removal

- `Contact.tsx`: delete the `<p><a href={SITE.instagram} …>` block; drop the then-unused `SITE` and `Arrow` imports.
- `Contact.module.css`: delete the three `.instagram` rule blocks.
- `contact.ts`: remove `instagramHandle` and `instagramLinkLabel` from the `ContactData` interface and **both** locale objects (verified: `Contact.tsx:146` is their only consumer).
- AR review sheet §8: delete the "Follow our journey" / "تابِع رحلتنا" row (string no longer ships).

## Out of scope

- Footer Instagram link (stays).
- Fixed mobile WhatsApp bar (stays WhatsApp-only).
- The select's placeholder-option/label visual overlap at rest, if any — note it if observed during verification, don't fix here.

## Verification

`npm run test` (currently 61/61 + new EmailButton tests), `npm run typecheck`, `npm run build`, then a dev-server browser pass: focus every one of the six fields in `/` and `/ar` and confirm the label is never struck through; click both channel buttons; confirm the Instagram line is gone and the footer link remains.

## Housekeeping

Append **Addendum 4** to `CLAUDE.md` recording: the focus fix, the new email channel button (+ two AR draft strings pending native review), and the contact-section Instagram removal (§7 item 11 note: handle still unverified, now only surfaced in the footer).

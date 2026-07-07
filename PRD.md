# Imperium Italian Textile — Product Requirements Document (PRD)

**Version 1.0 · 2026-07-02 · Status: DRAFT — awaiting founder validation**
**Prepared by:** the project team (freelancer/agency + AI planning partner), for **Sofia Mazza** (founder, final sign-off)
**Supersedes:** nothing — this document did not previously exist. `DESIGN.md`, `TECHNICAL_ARCHITECTURE.md`, `MOTION_SPEC.md`, and `DEVELOPMENT_ROADMAP.md` all cite "the PRD" as their source of copy, keywords, stats, and business facts; this file is that source, written after the fact and honest about what is and isn't yet known.

---

## 0. How to Read This Document

Every item in this PRD carries one of three statuses:

| Tag             | Meaning                                                                                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ **DECIDED**  | Confirmed by the founder or the project owner (source and date noted). Safe to build against.                                                                                 |
| 🟡 **PROPOSED** | Drafted by the project team as a concrete starting point. Usable for build previews, but must be validated by Sofia before launch.                                            |
| 🔴 **OPEN**     | A fact or decision only the founder can supply. Has an owner, a recommendation where possible, and a list of what it blocks. **Nothing tagged 🔴 may ship on the live site.** |

**Hard rule inherited from the project brief:** no invented business facts. A 🟡 copy draft is a _wording proposal_; the moment a sentence asserts something about the world (a number, a certification, a market, a relationship), the underlying fact is 🔴 until Sofia confirms it.

**Document precedence** (when documents disagree):

1. **PRD.md (this file)** — what the site says and why: business truth, audiences, scope, content, functional requirements.
2. **DESIGN.md / MOTION_SPEC.md** — how it looks, feels, and moves.
3. **TECHNICAL_ARCHITECTURE.md** — how it's built.
4. **DEVELOPMENT_ROADMAP.md** — in what order.

Conflicts get surfaced to the project owner, never silently resolved. Code is reality; all documents are intent.

---

## 1. Business Context

### 1.1 What the business is ✅

**Imperium Italian Textile** is a Dubai-based (UAE) startup that imports and distributes **premium Italian fabrics** to professional buyers in the Gulf.

- **Founder:** Sofia Mazza.
- **Positioning statement:** _"A premium sourcing and textile partner connecting UAE businesses with exceptional Italian fabrics."_ Not a generic wholesaler; a consultative sourcing partner.
- **Business model:** **B2B only** ✅ (confirmed by project owner 2026-07-02, resolving an earlier B2C mention). Sales happen through conversations — the website generates and routes inquiries; orders, pricing, and fulfilment happen offline.
- **Explicitly not ecommerce:** no cart, no prices, no checkout, no inventory, no customer accounts. Sample requests and consultations are _inquiries_.

### 1.2 What the website must do ✅

1. **Establish credibility** — make a new company feel like an established Italian house.
2. **Tell the brand story** — Italy, craft, provenance, and Sofia's role in it.
3. **Showcase the fabric offering** — structure per decision D-01.
4. **Generate qualified inquiries** — via contact form and WhatsApp, routed somewhere a human actually answers.

### 1.3 Success metrics 🟡

Primary: **qualified inquiries per month** (form submissions + WhatsApp conversations started). Secondary: sample requests, inquiry-to-conversation rate (Sofia's feedback loop), organic impressions for target terms (post-launch, Search Console). Measured with Plausible custom events (§8, F-3). Numeric targets are deliberately deferred until a 4–6 week post-launch baseline exists — inventing targets now would be theatre. Sofia should confirm the _definition_ of a qualified inquiry: 🔴 **D-06c**.

### 1.4 Facts about the company the site needs and does not yet have 🔴

| #   | Fact                                                                                                      | Where it appears                        | Status                                                    |
| --- | --------------------------------------------------------------------------------------------------------- | --------------------------------------- | --------------------------------------------------------- |
| B-1 | Legal entity name + trade licence detail (for footer legal line, privacy policy)                          | Footer, privacy page                    | 🔴 Sofia                                                  |
| B-2 | Year established ("Est. 2026" is currently hard-coded in scaffold copy)                                   | Hero eyebrow, nav wordmark, JSON-LD     | 🔴 Sofia                                                  |
| B-3 | Mill relationships: how many, named or anonymous, any exclusivity                                         | Collections, pillars, stats, SEO copy   | 🔴 Sofia                                                  |
| B-4 | "Certified Made in Italy Expert" — real certification? Issuer? Scan available?                            | Founder section                         | 🔴 Sofia — **do not ship the claim without the document** |
| B-5 | Markets actually served today vs. aspirational (scaffold map claims Dubai, Riyadh, London, Mumbai-dashed) | Origin map                              | 🔴 Sofia — recommend shipping only validated markets      |
| B-6 | The four stats (scaffold plans a count-up strip with no numbers)                                          | Stats strip                             | 🔴 Sofia — see §6.4 for the proposed _shape_              |
| B-7 | Instagram account @imperiumitaliantextile — does it exist and is it active?                               | Contact, footer, JSON-LD sameAs         | 🔴 Sofia                                                  |
| B-8 | Sofia's nationality and languages (JSON-LD plan asserts "Italian" and "English, Arabic, Italian")         | Structured data, About                  | 🔴 Sofia                                                  |
| B-9 | Who answers inquiries, on what schedule (the site currently promises "within 24 hours")                   | Contact form note, form success message | 🔴 Sofia — the promise must be operationally true         |

---

## 2. Audience

### 2.1 Segments (B2B) ✅ — priority ranking 🔴 D-02

The business serves professional buyers: **tailors · bespoke tailoring houses · fashion businesses · hotels & hospitality groups · restaurants · interior designers.**

🔴 **D-02 — Which 2–3 segments are the year-one focus?** Owner: Sofia. Blocks: copy voice, hero subline, form role options, collections framing, photography brief. Designing for all six reads generic; focus reads premium. The scaffold's form already narrows roles to _tailor / hospitality / designer / other_ — treat that as a 🟡 guess to validate, not a decision.

### 2.2 Provisional segment sketches 🟡

These are working assumptions to make copy drafts possible — validate with Sofia's actual customer knowledge.

| Segment                            | What they need to believe before inquiring                                                                                  | Proof that works                                                           |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Bespoke tailors / tailoring houses | The fabric is genuinely Italian, consistent, and available in relevant quantities; a partner who understands garment-making | Provenance detail, mill story, fabric close-ups, fast sample process       |
| Hotels & hospitality groups        | Imperium can handle project scale, timelines, and specification (contract-grade fabrics)                                    | Project-oriented language, a consultative CTA, durability/spec willingness |
| Interior designers                 | Range and rarity; something clients haven't seen                                                                            | _Pezzi Unici_ framing, texture photography, sample-first workflow          |

Common to all: they are **professionals who buy on trust and evidence, not on discounting** — which is why the site leads with provenance and restraint rather than offers (see `DESIGN.md` §1).

### 2.3 Anti-audience ✅

Retail consumers. The site should not accommodate consumer purchase intent (no prices, no "buy", no consumer-style promotions). If a consumer inquires, that's handled by a human, not by the site's design.

---

## 3. Positioning & Voice

### 3.1 Brand attributes ✅ (from brief)

Sophisticated · professional · refined · Italian craftsmanship · trustworthy · premium · elegant. Feels like a luxury fashion / premium hospitality brand, **not** a textile supplier. Spirit references: Loro Piana, Aesop, Zegna, Effe Hospitality (philosophy only). Governing test: _"Does this feel like a page from an Italian design magazine, or a tech product?"_

### 3.2 Voice principles 🟡

1. **Understatement over persuasion.** No superlatives without evidence ("finest" is earned by photography, not adjectives). No urgency mechanics, ever.
2. **First person plural.** "We source", "we deliver" — a house, not a platform. Sofia speaks in first person only inside the Founder section.
3. **Short declaratives, generous rhythm.** Sentences breathe like the layout does.
4. **Italian terms as seasoning.** Set in italics (_Tessuti Italiani_), never translated inline, never more than one per paragraph.
5. **Concrete nouns beat abstractions.** "Linen from a family mill outside Como" beats "premium quality solutions". (The specific mill claim itself: 🔴 B-3.)
6. **British English spelling** (colour, metre) 🟡 — matches the Gulf professional register; confirm with Sofia.

**Never:** exclamation marks · "solutions" / "leverage" / corporate filler · discount language · fake scarcity · emoji in site copy.

### 3.3 Reading level

Professional adult; no jargon from either textiles or tech without necessity. Buyers know fabric — technical terms (momme, GSM, martindale) are welcome _when accurate_, and each such spec is a 🔴 fact.

---

## 4. Scope

### 4.1 V1 — in scope ✅

- Single-domain marketing site, **English only** at launch (Arabic gated by D-05).
- Editorial one-page home (section order per §6) + supporting routes per D-03.
- Contact pipeline: form → validated server action → email to the business inbox (F-1), plus WhatsApp CTA (F-2).
- Plausible analytics with four custom events (F-3).
- SEO baseline: metadata, JSON-LD Organization, sitemap, robots with launch gating (F-5).
- A **privacy policy page** — newly added to scope; see §4.3.
- Accessibility WCAG 2.1 AA and the performance budget per `TECHNICAL_ARCHITECTURE.md` §6/§9.

### 4.2 V1 — explicitly out ✅

Ecommerce of any kind · prices · client accounts · CMS (Sanity is V2) · Arabic/RTL (V2, pending D-05) · dark mode · blog/journal · testimonials section _until at least one real testimonial exists_ · fabric-level catalogue with stock data · third-party scripts beyond Plausible.

### 4.3 Scope addition discovered during planning: Privacy Policy 🔴 D-12

`DESIGN.md` §9.09 places a "Privacy Policy" link in the footer, and the form collects personal data (name, company, email) — but no plan anywhere produces that page. Requirement: a `/privacy` route in brand tone covering what the form collects, why (responding to inquiries), where it goes (email delivery via Resend, analytics via cookieless Plausible), retention, and contact for removal. Owner for content approval: Sofia (with whatever legal review she wants — UAE PDPL applies to UAE businesses). The project team drafts it 🟡; it must not launch unreviewed.

---

## 5. Decisions Register

The forks that shape everything else. Each has an ID used throughout this document.

| ID       | Decision                                         | Options                                                                                                                                                                                                                                                                                                                                                                                           | Recommendation                                                                                                                                                                                                                                                                                                                                                             | Owner                              | Blocks                                                                          |
| -------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------- |
| **D-01** | **How fabrics are presented** — the biggest fork | (a) Three curated, named collections (current scaffold: _Tessuti Italiani_, _Pezzi Unici_, _Ospitalità di Lusso_); (b) browsable library filtered by material (Linen/Silk/Velvet/Wool — the model in Sofia's theme demo); (c) hybrid: curated collections on the homepage, each card carrying material tags, with a filterable "all fabrics" view added only when photography volume justifies it | **(c) hybrid, phased:** launch with (a) because it needs only 3 strong photos and tells a story; the data model already carries material tags, so (b) can grow later without rework. But **ask Sofia her mental model first**: _"Do you picture your fabrics as a few curated named collections, or as a browsable library you filter by material?"_ Her answer overrides. | Sofia                              | Collections section, /fabrics route, nav labels, data schema, photography brief |
| **D-02** | Priority segments (top 2–3 of six)               | rank them                                                                                                                                                                                                                                                                                                                                                                                         | none possible — genuinely Sofia's                                                                                                                                                                                                                                                                                                                                          | Sofia                              | Copy voice, form roles, hero subline, imagery                                   |
| **D-03** | Information architecture                         | (a) one-page with anchor nav (scaffold's nav data already uses `#collections` etc.); (b) multi-page (`/fabrics`, `/about`, `/contact` exist as stubs)                                                                                                                                                                                                                                             | **(a) for V1.** The design docs, nav data, and editorial pacing all assume it; multi-page adds content burden with no V1 payoff. Keep stub routes unlinked (or redirect to `/#section`) until V2 gives them real content.                                                                                                                                                  | Project owner                      | Navigation build, sitemap, seo.ts                                               |
| **D-04** | Founder visibility                               | front-and-centre (name, face, story) vs. understated                                                                                                                                                                                                                                                                                                                                              | lean front-and-centre — a real person is this brand's strongest differentiator vs. anonymous traders — but this is personal; Sofia decides                                                                                                                                                                                                                                 | Sofia                              | Founder section, About, JSON-LD, photography                                    |
| **D-05** | Language                                         | EN only vs. EN + AR                                                                                                                                                                                                                                                                                                                                                                               | EN at launch; the codebase is already RTL-ready (logical properties, `/ar` redirect groundwork — currently a redirect loop that must be fixed or removed whenever touched). Decide AR as a scheduled V2 with real translation budget, not a toggle promise.                                                                                                                | Sofia                              | Nav toggle, `/ar` route, translation cost, font subsetting                      |
| **D-06** | Inquiry operations                               | (a) destination inbox; (b) WhatsApp Business number; (c) definition of "qualified inquiry" and the response SLA                                                                                                                                                                                                                                                                                   | must exist before the form ships; the "24h" promise stays **off the site** until Sofia commits to it                                                                                                                                                                                                                                                                       | Sofia                              | F-1, F-2, contact.ts, form success copy                                         |
| **D-07** | Domain & email identity                          | `imperiumitaliantextile.com` is hard-coded everywhere but **unregistered**. Registration deferred by project owner (2026-07-02).                                                                                                                                                                                                                                                                  | fine to defer while building on localhost; it is a **hard launch gate** — canonical URLs, robots host, contact email, and Resend verification all depend on it. Revisit before Phase 6.B, or sooner if the name itself is in doubt (a name change is cheap now, expensive later).                                                                                          | Sofia / project owner              | Launch, email deliverability, SEO canonical                                     |
| **D-08** | Form contact-back fields                         | add **email (required)** and **phone (optional)**? The scaffold form has neither — inquiries would be unanswerable.                                                                                                                                                                                                                                                                               | **yes to both**; see F-1 for validation rules                                                                                                                                                                                                                                                                                                                              | Project owner (confirm with Sofia) | F-1, contact.ts, forms.ts                                                       |
| **D-09** | Real content claims                              | stats (B-6), pillars (§6.5), certification (B-4), markets (B-5), established year (B-2)                                                                                                                                                                                                                                                                                                           | collect via discovery questionnaire; anything unconfirmed gets cut, not faked                                                                                                                                                                                                                                                                                              | Sofia                              | Stats strip, pillars, origin map, hero eyebrow                                  |
| **D-10** | Testimonials at launch                           | launch without (section hidden) vs. chase ≥1 real quote                                                                                                                                                                                                                                                                                                                                           | launch without; add when real. Never "[Name]" placeholders.                                                                                                                                                                                                                                                                                                                | Sofia                              | Testimonials section                                                            |
| **D-11** | Ownership & maintenance                          | who maintains post-launch (user vs. Akshay); how Sofia gets copy changed (edit `src/data/` via developer vs. eventual Sanity)                                                                                                                                                                                                                                                                     | document a named owner + turnaround for content edits before launch; Sanity stays a V2 decision                                                                                                                                                                                                                                                                            | Project owner + Akshay + Sofia     | Support model, V2 CMS                                                           |
| **D-12** | Privacy policy approval                          | see §4.3                                                                                                                                                                                                                                                                                                                                                                                          | draft 🟡 by team, Sofia approves                                                                                                                                                                                                                                                                                                                                           | Sofia                              | Footer, form consent line, launch                                               |
| **D-13** | Constraints                                      | launch date · budget (photography, video, map illustration, logo refinement, domain/hosting — fonts are free OFL) · final sign-off ritual                                                                                                                                                                                                                                                         | set at next founder session                                                                                                                                                                                                                                                                                                                                                | Sofia                              | Everything downstream                                                           |

**D-01 — Resolved (client, 2026-07-04):** curated named collections confirmed; a fourth collection — Interior & Exterior Design — added. Material-filter library remains a V2 option (tags kept in the data model).

---

## 6. Information Architecture & Section Content Contract

**V1 home page, in order** (per D-03a): Navigation → Hero → Origin Map → Stats Strip → Collections → Trust Pillars → Founder → Testimonials (hidden until real) → Contact → Footer. Visual/motion specification for each lives in `DESIGN.md` §9 and `MOTION_SPEC.md`; this section owns **what each section must say and what content it needs**.

Each block below: purpose → content inputs → proposed copy → acceptance criteria.

### 6.1 Navigation

- **Purpose:** orient without competing with the hero; carry the one conversion CTA.
- **Inputs:** wordmark text ✅ ("Imperium Italian Textile"), est. year 🔴 B-2, link labels (depend on D-01/D-03), CTA label.
- **Proposed copy 🟡:** links _Fabrics · About · Contact_ (collapse the scaffold's three collection links into one "Fabrics" until D-01 resolves); CTA **"Request Samples"** (keep — it's specific and B2B-correct). Language toggle omitted until D-05 says otherwise.
- **Accept when:** anchors scroll to the right sections with offset; CTA reaches the contact section; no dead links; mobile overlay per `DESIGN.md` §8.

### 6.2 Hero

- **Purpose:** atmosphere first, message second; establish "Italian editorial, not tech product" in one viewport.
- **Inputs:** headline, subline, eyebrow (🔴 B-2 for "Est."), CTA pair, hero visual (video or still — asset A-5), video caption (🔴 B-2).
- **Proposed copy 🟡 — candidates for Sofia to react to:**
  - H-A (current scaffold): _"Where Italian craft meets the world."_
  - H-B: _"Italian fabric, chosen by hand."_
  - H-C: _"The finest Italian mills. One partner in Dubai."_
  - Subline (adjust to D-02): _"Premium Italian fabrics — sourced from the finest mills of Italy, delivered to Dubai's most discerning tailors and hospitality groups."_
  - CTAs: **"Explore our fabrics"** (scrolls to Collections) + text link **"Request a sample →"** (scrolls to Contact).
- **Accept when:** exactly one `<h1>`; headline legible over the visual at all breakpoints; CTAs functional; eyebrow contains no unvalidated year.

**Amended (client, 2026-07-04):** hero is logo-led — the wordmark renders large inside the `<h1>` with the tagline directly beneath; the headline candidates above are retired for V1. No establishment year anywhere.

**Amended 2026-07-07 (`docs/superpowers/specs/2026-07-07-silk-hero-experience-design.md`, D-S1):** asset A-5 (hero video) is **retired, not fulfilled** — no video was ever sourced (progress.md 2.5). The hero visual is instead a live, cursor-reactive WebGL silk simulation continuing the existing champagne field. This removes a videography line item from the client's budget and closes A-5 in the table below by replacement. Sofia's sign-off on this substitution is checkpoint 1 of that spec (§10) and is still outstanding — recorded here so it isn't lost, independent of the code shipping to `main`.

### 6.3 Origin Map ("Our reach")

- **Purpose:** provenance made visual — Italy at the centre, the Gulf as destination.
- **Inputs:** 🔴 B-5 validated markets (recommend V1 ships **Italy → Dubai only** unless Sofia confirms more; aspirational dashed routes only with her explicit approval), map illustration (asset A-4, programmatic SVG placeholder until commissioned).
- **Proposed copy 🟡:** eyebrow _"Our reach"_; headline _"Born in Italy. Delivered to Dubai."_ (extend to "…and the Gulf" only if B-5 supports it); subline drafted after B-3/B-5 answers.
- **Accept when:** every city on the map is a validated market; the map reads as illustration, not infographic (`DESIGN.md` §9.03).

**Superseded (client, 2026-07-04):** the provenance visual moved into Why Imperium row 01 as an Italy → UAE + Gulf route placeholder; the OriginMap section (and its city-list claims) was removed from V1.

### 6.4 Stats Strip

- **Purpose:** scale and credibility in four numbers.
- **Inputs:** 🔴 B-6 — four true, defensible, durable numbers. Proposed _shape_ 🟡 (Sofia fills values or vetoes the stat): _mills we source from · fabrics in the library · years of textile experience (Sofia's, if the company is young) · cities served_.
- **Rule:** any stat that needs a caveat is the wrong stat. If only two honest numbers exist, ship two — or cut the strip entirely. A luxury brand with fake numbers is dead on discovery.
- **Accept when:** every number has a source Sofia can defend in a client meeting; count-up respects reduced motion.

**Updated (client, 2026-07-04):** "40+ Fabrics" confirmed; "12+ mills", "120+ fabrics", "15 years", "4 cities served" removed as unvalidated. Companion stats "4 curated collections" and "100% Italian fabrics" are team-proposed 🟡 pending Sofia's veto (see `src/data/stats.ts`).

### 6.5 Collections (structure gated by D-01)

- **Purpose:** the offering, grouped the way Sofia thinks about it.
- **Inputs:** D-01 answer; per collection — name, one-sentence promise, 3–4 line body, material tags, one hero photograph (asset A-2), CTA target.
- **Proposed copy 🟡 (written for D-01a/c; register sample — all body facts pending B-3):**
  - _Tessuti Italiani_ — tags LINEN · SILK · WOOL · COTTON — _"The foundation of the house: linens, silks, wools and cottons sourced from Italian mills we know by name. Fabric for work that carries your label."_
  - _Pezzi Unici_ — tags RARE · LIMITED · ONE OF A KIND — _"Small runs, discontinued weaves, single bolts. When a piece is gone, it is gone — which is precisely the point."_
  - _Ospitalità di Lusso_ — tags HOSPITALITY · BESPOKE — _"Contract-grade fabric for hotels and restaurants that refuse to look like it. Specified with you, sampled fast."_ CTA: _"Talk to us about your project →"_.
- **Accept when:** grouping matches Sofia's answer to D-01; every card has a real photograph (no stock at launch — stock is a build-time placeholder only); tags reflect actual materials on offer.

**Updated (client, 2026-07-04):** four collections; per-card promise line ("tagline") renders beneath the image; Pezzi Unici's CTA is "Contact Us" → #contact; the other cards link to /fabrics deep anchors.

### 6.6 Trust Pillars ("Why Imperium")

- **Purpose:** the manifesto — four reasons to trust, written as principles, not features.
- **Inputs:** 🔴 D-09 — each pillar's claim must be operationally true.
- **Proposed copy 🟡 — drafted claim-safe, with risk notes:**
  - 01 _Direct from the source_ — body: _"We buy from the mills, not from middlemen — and we visit them."_ (Ships only if literally true: 🔴 B-3.)
  - 02 _Made in Italy expertise_ — body references certification **only if B-4 verifies**; otherwise reframe to Sofia's genuine expertise.
  - 03 _Built for the Gulf_ — body: _"Based in Dubai. We understand the market's pace, climate and standard of finish."_ (Safer than the scaffold's "For the Gulf's luxury market".)
  - 04 — the scaffold's _"Always available"_ is an operational promise nobody has committed to. Propose instead: _A partner, not a catalogue_ — _"Tell us the project; we'll bring the options. Sourcing is a conversation, not a search bar."_
- **Accept when:** four pillars, numbered, no icons; every claim survivable in due diligence.

**Updated (client, 2026-07-04):** three alternating rows — Direct From the Source (+route-map slot), Made in Italy Expertise (+stamp slot), For the Gulf's Luxury Market. The fourth pillar was removed permanently.

### 6.7 Founder ("The story behind Imperium")

- **Purpose:** the human guarantee behind the brand (weight per D-04).
- **Inputs:** 🔴 Sofia's real story in her own words — the discovery questionnaire gathers: why fabrics, why Italy, why Dubai, one formative detail. Portrait (A-3), pull-quote, certification (B-4).
- **Proposed structure 🟡:** eyebrow _"The story behind Imperium"_; headline _"A love for Italy, built into every thread."_ (candidate; offer alternatives after her story lands); three bio paragraphs assembled **from her answers, edited — never authored from nothing**; pull-quote must be a sentence she actually says (the scaffold's _"Every fabric I source is one I would stake my name on."_ may be offered to her for adoption, clearly framed as a draft she can reject).
- **Accept when:** bio contains zero team-invented biography; quote is hers; portrait is a real photograph (fabric-texture placeholder acceptable only pre-launch).

**Resolved (client, 2026-07-04):** headline "Proudly Italian. Purposefully Global.", three bio paragraphs and the pull-quote are client-approved and live in `src/data/founder.ts`. Certification container sits below the story; caption "Made in Italy Certification".

### 6.8 Testimonials

Hidden until ≥1 real, attributable quote exists (D-10). Render-suppression on empty data is a build requirement (roadmap 4.7). Never placeholder names.

### 6.9 Contact ("Let's talk fabric.")

- **Purpose:** convert warmed-up visitors with the least friction the brand allows.
- **Inputs:** D-06 (inbox, WhatsApp number, SLA), D-08 (fields), D-12 (consent line), email address (D-07-dependent).
- **Proposed copy 🟡:** eyebrow _"Contact"_ · headline _"Let's talk fabric."_ ✅ (keep — it's good) · subline: _"Tell us what you're making. We'll bring samples, prices and timelines to the conversation."_ · form note: **omit the 24-hour promise until D-06 commits; then** _"We respond within one business day."_
- **Form fields (final set, pending D-08 confirmation):** Name (required) · Company (optional) · **Email (required)** · **Phone / WhatsApp (optional)** · Role (select; options finalized by D-02) · "Tell us about your project" (textarea, required). Consent microcopy under submit: _"We use your details only to respond to your inquiry. See our Privacy Policy."_
- **States copy 🟡:** loading _"Sending…"_ · success _"Thank you. We'll be in touch shortly."_ (upgrade wording when SLA lands) · error _"Something went wrong. Please try WhatsApp or email us directly."_
- **Accept when:** F-1 requirements all pass; submitting with a real address delivers to the D-06 inbox with a working reply-to.

### 6.10 Footer

- **Inputs:** legal line (🔴 B-1), links (mirror nav + Privacy Policy), Instagram (🔴 B-7), WhatsApp line.
- **Proposed 🟡:** _"© [year] [legal entity]. All rights reserved."_ — no invented entity name; block until B-1.

### 6.11 Not-found (404)

🟡 _"This page doesn't exist. Let's get you back."_ + link home (from roadmap 6.12 — keep).

---

## 7. Copy & Content Matrix

The complete inventory of strings the site needs, mapped to where they live in code. This table is the working checklist for the content phase; "source" says who produces the value.

| Slot                                                     | Code location                                  | Status                                                 | Source                     |
| -------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------ | -------------------------- |
| Site name / short name                                   | `src/lib/site.ts`                              | ✅                                                     | brief                      |
| Tagline "Premium Italian fabrics · Delivered to Dubai"   | `site.ts`                                      | 🟡                                                     | team draft, Sofia approves |
| Established year                                         | `site.ts`, hero eyebrow                        | 🔴 B-2                                                 | Sofia                      |
| Canonical URL / contact email                            | `site.ts`, `contact.ts`, env                   | 🔴 D-07                                                | domain decision            |
| WhatsApp number                                          | env `NEXT_PUBLIC_WHATSAPP_NUMBER`              | 🔴 D-06                                                | Sofia                      |
| Instagram handle                                         | `site.ts`, `contact.ts`                        | 🔴 B-7                                                 | Sofia                      |
| Nav links + CTA label                                    | `src/data/navigation.ts`                       | 🟡 §6.1                                                | team, gated by D-01/D-03   |
| Hero headline / subline / CTAs / eyebrow                 | component copy (extract to data file at build) | 🟡 §6.2                                                | team drafts, Sofia picks   |
| Origin map eyebrow/headline/subline + markets            | `OriginMap` + map SVG                          | 🟡 / 🔴 B-5                                            | team + Sofia               |
| Four stats (label + value each)                          | `StatsStrip` data                              | 🔴 B-6                                                 | Sofia                      |
| Collections: names, tags, bodies, CTAs                   | `src/data/collections.ts`                      | 🟡 §6.5, gated D-01                                    | team + Sofia               |
| Pillars: 4 labels + bodies                               | `src/data/pillars.ts`                          | 🟡 §6.6, facts 🔴 D-09                                 | team + Sofia               |
| Founder: headline, 3 bio paragraphs, quote, cert caption | `src/data/founder.ts`                          | 🔴 §6.7                                                | Sofia (edited by team)     |
| Testimonials                                             | `src/data/testimonials.ts`                     | 🔴 D-10                                                | real clients only          |
| Contact: headline, subline, form note, labels, states    | `src/data/contact.ts`                          | 🟡 §6.9                                                | team, SLA 🔴 D-06          |
| Footer links + legal line                                | `Footer`                                       | 🟡 / 🔴 B-1                                            | team + Sofia               |
| Privacy policy page                                      | new route `/privacy`                           | 🟡 draft / 🔴 approval D-12                            | team + Sofia               |
| 404 copy                                                 | `src/app/not-found.tsx`                        | 🟡                                                     | team                       |
| Page titles + meta descriptions                          | `src/data/seo.ts`, `layout.tsx`                | 🟡 §11                                                 | team                       |
| JSON-LD Organization fields                              | `src/lib/metadata.ts`                          | 🔴 B-1/B-7/B-8                                         | Sofia                      |
| OG image                                                 | `/public/images/og/`                           | 🔴 asset A-7                                           | photography                |
| WhatsApp prefilled message                               | `WhatsAppButton`                               | 🟡 _"Hello Imperium — I'd like to ask about fabrics."_ | team                       |

**Rule for the build:** components read copy **only** from `src/data/` (already the architecture). Any string found hard-coded in a component during build review is a defect.

---

## 8. Functional Requirements

### F-1 Contact form pipeline (the only piece of backend that exists)

**Flow:** form → React Server Action → shared validator → `lib/email.ts` → Resend → business inbox. The REST route `/api/contact` stays `405 Method Not Allowed` until a third-party integration genuinely needs it (one entry point = one attack surface).

**Server-side validation (authoritative — client-side HTML5 is UX only):**

- Name: required, 1–100 chars, control characters stripped, single line.
- Company: optional, ≤100 chars, single line.
- Email: required (per D-08), RFC-plausible format, ≤254 chars, **single line enforced** — this is the header-injection guard.
- Phone: optional, ≤20 chars, digits/`+`/spaces only.
- Role: must be one of the enum values from `contact.ts` — reject anything else.
- Project: required, 10–5,000 chars, control characters (except newlines) stripped.
- Honeypot field (name from `HONEYPOT_FIELD`, default `company_website`): must be empty → silently accept-and-drop if filled.
- Minimum-fill-time: reject submissions arriving < 3 s after form render (timestamp field, server-verified).
- Rate limit: max 5 submissions / 10 minutes / IP (Vercel WAF rule preferred; Upstash if code-level). Excess → 429 with the polite error state.

**Email construction:** via the Resend SDK only — user email goes into `replyTo`; `from` is the site identity on the verified domain; `subject` is a fixed template (_"New inquiry — [role]"_) containing no free-text user input; all user content lives in the plain-text body. Never hand-build MIME headers.

**Failure behavior:** if `RESEND_API_KEY`/`RESEND_TO` are missing in production, the action must **fail loudly** (error state + server log), not silently pretend success — `src/lib/env.ts`'s current silent-`undefined`-in-prod behavior gets fixed as part of this task. On localhost without a key: mock success + `console.log` payload (roadmap 4.13 behavior, to be actually implemented).

**Privacy:** no form payloads in analytics; no PII in URLs; log at most a timestamp + outcome.

### F-2 WhatsApp CTA

`https://wa.me/<number>?text=<prefill>` from `NEXT_PUBLIC_WHATSAPP_NUMBER`. **Renders nothing when the env var is unset** (the `.env.example` dummy `971500000000` must never reach production). Inline button in Contact + persistent 56 px mobile bar per `DESIGN.md` §8. Number itself: 🔴 D-06.

### F-3 Analytics (Plausible)

Cookieless, no consent banner needed. Custom events: `Form Submit` · `WhatsApp Click` · `Instagram Click` · `Request Samples Click`. Script loads only when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set.

### F-4 Email deliverability (launch)

Resend domain verification + SPF/DKIM/DMARC on the registered domain (blocked by D-07). Send a real test inquiry end-to-end before announcing launch.

### F-5 Robots / indexing lifecycle

While the site is placeholder: `noindex` + `disallow` (approved for build 2026-07-03; implemented by the Phase-1 plan). Indexing is an **explicit opt-in**: `NEXT_PUBLIC_ALLOW_INDEXING === "true"`, set only in the Vercel production environment at launch (Phase 6.B). An explicit switch is safer than inferring from `VERCEL_ENV` + domain, because a mis-set canonical variable can never accidentally enable indexing. Sitemap lists real routes only.

### F-6 Arabic groundwork (deferred, D-05)

The `/ar` redirect in `next.config.ts` anticipates the Arabic option ✅ (project owner, 2026-07-02) but currently loops infinitely (`/ar → /ar/ → /ar …`). Whenever this file is next touched: either implement the `/ar` route (D-05 = yes) or remove the redirect until then. CSS logical properties remain the standing RTL-readiness rule.

---

## 9. Non-Functional Requirements

- **Performance:** budget per `TECHNICAL_ARCHITECTURE.md` §6 — LCP < 2.5 s, CLS < 0.1, JS ≤ 130 KB gzip, page ≤ 1.5 MB excl. video. Lighthouse ≥ 95 across categories at Phase 6.A.
- **Accessibility:** WCAG 2.1 AA per `TECHNICAL_ARCHITECTURE.md` §9 — contrast table already verified in doc; skip-link, keyboard nav, visible focus, `prefers-reduced-motion` collapses all motion.
- **Security (from the 2026-07-02 audit — binding on the build):**
  - Keep the existing security headers; **remove `https://api.resend.com` from `connect-src`** (browsers must never call Resend; the key is server-side only, never `NEXT_PUBLIC_*`).
  - `script-src 'unsafe-inline'` is accepted for V1 (static site, no auth, no user-generated content); revisit with nonces if the threat model ever changes.
  - Server-authoritative validation per F-1; one shared validator for any future second entry point.
  - No secrets in the repo (verified clean; keep it that way — Vercel env vars only).
  - Dependency hygiene: never `npm audit fix --force` (it downgrades Next to 9.x); upgrade Vitest to v4 in a maintenance window.
- **Privacy:** Plausible only; privacy policy page (D-12); form-data handling per F-1.
- **Browser support:** evergreen Chrome/Safari/Firefox/Edge, iOS Safari + Android Chrome; degrade video to poster on slow connections per `TECHNICAL_ARCHITECTURE.md` §5.

---

## 10. Asset Pipeline

| ID  | Asset                                                                                                                    | Spec (see DESIGN.md §6–7)                   | Owner                    | Needed by          | Interim placeholder                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- | ------------------------ | ------------------ | --------------------------------------------------- |
| A-1 | Logo files + single-colour/on-ivory review                                                                               | SVG preferred                               | Sofia → team review      | Phase 2            | wordmark set in Cormorant                           |
| A-2 | Fabric photography ≥ 3 (one per collection)                                                                              | 4:5, 2× res, warm, consistent background    | Sofia / photographer     | Phase 3 fine-tune  | licensed stock (never past launch)                  |
| A-3 | Sofia portrait                                                                                                           | 3:4, editorial warmth                       | photographer             | Phase 4 fine-tune  | fabric texture + caption                            |
| A-4 | Origin-map illustration                                                                                                  | hand-drawn line style, SVG                  | illustrator              | Phase 3 fine-tune  | programmatic SVG                                    |
| A-5 | ~~Hero video 15–20 s + poster~~ **Retired 2026-07-07** — superseded by the silk hero WebGL shader; no video asset needed | H.264, ≤8 MB desktop / ≤4 MB mobile 9:16    | ~~Sofia / videographer~~ | Phase 2 fine-tune  | high-res fabric still (now: rendered shader poster) |
| A-6 | Made in Italy certification scan                                                                                         | legible, croppable to ≤200 px width         | Sofia                    | Phase 4            | text mention **only if B-4 verifies**               |
| A-7 | OG image 1200×630                                                                                                        | fabric close-up + wordmark                  | team from A-2            | Phase 6.A          | none (omit tag until real)                          |
| A-8 | Favicons + touch icons (webmanifest already references them)                                                             | standard set from logo                      | team from A-1            | Phase 6.A          | none                                                |
| A-9 | Fonts: Cormorant Garamond + DM Sans WOFF2 subsets                                                                        | via `scripts/subset-fonts.sh`; OFL, no cost | team                     | Phase 1 completion | Inter (current, must not launch)                    |

**Photography is the make-or-break asset.** The review of Sofia's existing photos (resolution, background consistency, lighting) is a discovery-phase task and feeds the D-13 budget question — commission new photography early if they don't hold up.

---

## 11. SEO & Keywords

**Baseline keyword set 🟡** (inherited from `TECHNICAL_ARCHITECTURE.md` §7, marked proposed — validate against real search data and D-02 before the content pass): _Italian fabric Dubai · Italian linen supplier UAE · Made in Italy fabric wholesale · luxury fabric Dubai tailor · hotel uniform fabric UAE · Italian textile importer Dubai · premium linen hospitality Gulf._

**Meta drafts 🟡** — home title: _"Imperium Italian Textile — Premium Italian Fabrics, Delivered to Dubai"_ (keep); description: _"Premium Italian fabrics sourced directly from Italy's finest mills and delivered to Dubai's most discerning tailors and hospitality groups."_ — the phrase "sourced directly" is a 🔴 B-3 claim; soften to "sourced from Italy's finest mills" if unconfirmed. Locale `en_AE` ✅.

**JSON-LD Organization:** ships only fields that are ✅ by launch (B-1, B-7, B-8 gate the founder/nationality/sameAs/logo fields). A sparse-but-true JSON-LD beats a complete-but-invented one.

---

## 12. Launch Readiness Checklist (gates Phase 6.B — every line must be checked)

**Content truth**

- [ ] Zero 🔴 items remaining in any live string; every 🟡 approved by Sofia in writing
- [ ] No placeholder text, stock photography, "[Name]" fields, or Inter font anywhere
- [ ] Privacy policy live and approved (D-12); footer legal line uses the real entity (B-1)

**Identity & channels**

- [ ] Domain registered and on Vercel with SSL (D-07 — currently deferred, hard gate here)
- [ ] Resend domain verified; SPF/DKIM/DMARC pass; real end-to-end inquiry delivered and replied to
- [ ] WhatsApp number live and answered (D-06); wa.me link tested on desktop + mobile

**Technical**

- [ ] Indexing flipped on via the env gate (F-5); sitemap correct; Search Console verified + sitemap submitted
- [ ] CSP updated (Resend entry removed); headers re-verified on the live domain
- [ ] Form abuse controls verified: honeypot, min-fill-time, rate limit (F-1)
- [ ] `env.ts` fails loudly on missing prod vars (F-1); no secrets in repo
- [ ] `/ar` loop resolved per D-05 (F-6)
- [ ] Lighthouse ≥ 95 ×4 on the live URL; reduced-motion pass; keyboard-only pass
- [ ] Plausible events firing (F-3)

**Sign-off**

- [ ] Sofia has walked the live site and approved (D-13 defines who else, if anyone)

---

## 13. Discovery → PRD Mapping (what unblocks what)

The founder questionnaire (already delivered to Sofia) resolves items in this order of leverage:

1. **Business model & segments** → D-02, §2, §3 voice, form roles — unblocks the copy pass.
2. **Founder story (raw notes)** → §6.7, B-8 — unblocks the Founder section and About.
3. **Fabric presentation mental model** → D-01 — unblocks Collections/Fabrics IA and data schema.
4. **Claims inventory:** B-2 through B-9, pillar facts (D-09) — unblocks stats, pillars, map, JSON-LD.
5. **Operations:** D-06 (inbox, WhatsApp, SLA) — unblocks the contact pipeline build (F-1/F-2).
6. **Constraints:** D-13 + photography review (A-2) — unblocks scheduling and the asset budget.

**Suggested cadence:** one working session with Sofia covering 1–3; async follow-up for 4–5; 6 closes at the same session where D-13 is set.

---

## 14. Execution & Governance

- **Build order** stays per `DEVELOPMENT_ROADMAP.md` (6 phases, localhost verification gate each) — this PRD does not replace it; it feeds it. Phase mapping: content pass (this doc's §6–7) precedes or accompanies build Phases 2–4; F-1 lands in build Phase 4; §12 is Phase 6.B's gate.
- **Phase-gating:** the project owner (the user) decides when a phase closes. Analysis by default; code only on explicit go-ahead. The two standing safety items (noindex the placeholder site; resolve the `/ar` loop) were **approved for build 2026-07-03** and are Tasks 2–3 of `docs/superpowers/plans/2026-07-03-phase-1-foundation-and-safety.md`.
- **Change control:** edits to ✅ items require the decision owner's sign-off; 🟡→✅ promotions are logged in §15; this file lives at the repo root beside the other planning docs and **must be committed to GitHub `main`** (the local working folder is a ZIP snapshot without git — pushing is Akshay's/the user's step).
- **For future agents:** treat this file as the source of truth for _what the site says_; `DESIGN.md`/`MOTION_SPEC.md`/`TECHNICAL_ARCHITECTURE.md` for _how_; verify all of them against code before repeating claims.

---

## 15. Version Log

| Version | Date       | Change                                                                                                                                                                                                                                                                                                                                                                          |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0     | 2026-07-02 | First edition, authored after the repo/live audit of the same date. B2B-only confirmed (project owner). Domain registration deferred (project owner). Established the ✅/🟡/🔴 system, decisions register D-01–D-13, business facts B-1–B-9, section contracts, copy matrix, functional specs F-1–F-6, asset pipeline A-1–A-9, launch checklist. Added privacy policy to scope. |
| 1.1     | 2026-07-03 | Project owner green-lit coding. Phase-1 implementation plan authored at `docs/superpowers/plans/2026-07-03-phase-1-foundation-and-safety.md` (noindex switch, `/ar` + CSP fixes, `.DS_Store` cleanup, self-hosted fonts, five base components). F-5 mechanism changed to the explicit `NEXT_PUBLIC_ALLOW_INDEXING` switch.                                                      |

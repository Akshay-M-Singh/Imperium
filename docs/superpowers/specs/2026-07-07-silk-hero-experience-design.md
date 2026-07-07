# Silk Hero Experience — Design & Implementation Plan

**Date:** 2026-07-07 · **Status:** PROPOSED — awaiting user review (no code written)
**Owner:** the user (Lead) + Akshay (build) · **Client checkpoints:** §10
**Supersedes (partially):** `TECHNICAL_ARCHITECTURE.md` §Excluded (Three.js/WebGL row) and `MOTION_SPEC.md` §1.2/§1.3 — amended in Phase 0, not silently violated.

---

## 0. Executive summary

Replace the hero's never-sourced background **video** (progress.md task 2.5, `/public/video/` is empty) with a **live, cursor-reactive silk simulation** rendered in WebGL: a full-viewport sheet of champagne silk, art-directed into a resting drape, that breathes slowly when idle, deforms softly under the cursor with believable inertia, and settles back like real cloth. The existing hero DOM (eyebrow, wordmark `h1`, tagline, CTAs, entry cascade) is untouched — only the background layer changes.

**Core creative thesis:** the current approved hero is already a champagne field (`#a89374`) behind a white wordmark. The silk shader is that exact frame _come alive_ — continuity with the client-approved look, not a redesign. And critically: **the light should move more than the cloth.** Luxury reads through restraint; the sheen band gliding across the weave carries most of the effect, geometry deformation stays whisper-quiet.

**Recommended stack:** React Three Fiber (v9) + a custom GLSL heightfield material + a small ping-pong FBO spring/wave simulation for cursor interaction. Static rendered poster as the universal fallback (no WebGL / reduced motion / save-data / kill switch).

---

## 1. Repo audit — what exists today (verified 2026-07-07)

| Area                                      | Finding                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework                                 | Next.js 15 App Router, React 19, TS strict, `src/` layout                                                                                                                                                                                                                                                                                                               |
| Hero (`src/components/sections/Hero.tsx`) | Client component; `100dvh` section; lazy `<video>` with SVG poster, gated by `useIntersectionObserver` + `useReducedMotion` + slow-connection sniff; background `#a89374`; white wordmark PNG (`SITE.logoSrc`, rendered white via CSS `filter`); bottom gradient overlay (`--color-hero-gradient` at 0.4); CSS `@keyframes hero-enter` cascade at 0/80/200/320ms delays |
| Video asset                               | **Never sourced** — `/public/video/` is empty; poster SVGs only. The silk experience _replaces_ this open asset requirement                                                                                                                                                                                                                                             |
| Motion stack                              | Framer Motion 11 (variants/springs, `useMotionValue` discipline), Embla; motion tokens in `globals.css`; reduced-motion collapses all durations to 0ms globally                                                                                                                                                                                                         |
| Hooks                                     | `useReducedMotion`, `useIntersectionObserver`, `useMediaQuery` — all reusable for the silk layer                                                                                                                                                                                                                                                                        |
| Styling                                   | CSS Modules + global tokens; palette: Pietra `#FAF8F3`, Carbone, Ardesia, Sabbia `#B8A99A`, Blu Notte `#1B2A4A`, Oro Antico `#C4A76C`                                                                                                                                                                                                                                   |
| Tests                                     | Vitest 2.1, jsdom, `tests/unit/**` mirroring `src/` (61/61 passing incl. `Hero.test.tsx`); Playwright e2e in `tests/e2e`                                                                                                                                                                                                                                                |
| Governing constraints                     | `TECHNICAL_ARCHITECTURE.md` **explicitly excludes Three.js/WebGL** ("No 3D is needed… resisted"); `MOTION_SPEC.md` excludes decorative motion and sets a ~130KB JS motion budget; both predate this brief and must be formally amended (Phase 0)                                                                                                                        |
| Bundle baseline                           | `/` route First Load JS 169 kB                                                                                                                                                                                                                                                                                                                                          |

**Conflict surfaced (per CLAUDE.md rule 7):** this feature contradicts two committed architecture decisions. The user's brief ("ignore performance, prioritize beauty, WebGL/shaders welcome") supersedes them, but the amendment must be recorded in the docs and flagged to Akshay so the repo's own rules and its code don't diverge.

---

## 2. Technical analysis

### 2.1 Options considered

| Approach                                                         | Verdict                  | Why                                                                                                                                                                                                                      |
| ---------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Pure CSS** (gradients, blur, background-position on mousemove) | ❌ Rejected as primary   | No lighting model, no deformation, no inertia. Cannot produce "physically believable silk." **Retained as the fallback poster's subtle idle treatment**                                                                  |
| **Framer Motion**                                                | ➕ Supporting role       | Not a renderer. But its `useMotionValue`/`useSpring` discipline (already house style) is the right seam for feeding smoothed cursor/scroll values into shader uniforms without React re-renders                          |
| **2D Canvas**                                                    | ❌ Rejected              | CPU rasterization; per-pixel lighting at 100dvh is not feasible; no realistic specular response                                                                                                                          |
| **Three.js (vanilla, imperative)**                               | ⚠️ Viable but not chosen | Full power, but imperative setup/teardown fights the React 19 App Router component model; more lifecycle code to hand-maintain                                                                                           |
| **React Three Fiber + drei**                                     | ✅ **Chosen host**       | Declarative Three.js that composes with the existing React architecture; fiber v9 targets React 19; drei provides `shaderMaterial`/`useFBO` so the custom-shader plumbing stays small                                    |
| **Custom GLSL shaders**                                          | ✅ **Chosen core**       | Non-negotiable for the look: anisotropic silk sheen, procedural folds, curvature shading and film grain are all per-pixel effects no off-the-shelf material composes correctly                                           |
| **Displacement/normal maps (authored textures)**                 | ✅ Partial               | One tiny tileable **silk-weave normal map** (~512px, mipmapped) supplies thread-level micro-detail that procedural noise can't fake without moiré. Macro folds stay procedural                                           |
| **Procedural noise (simplex/fbm/curl)**                          | ✅ In-shader             | Drape base shape + idle drift. Lives in GLSL (inlined ashima simplex) — **no runtime JS noise dependency**                                                                                                               |
| **Postprocessing library (bloom, grain passes)**                 | ❌ Deferred              | Grain/dither and vignette are cheaper and simpler **in the silk fragment shader itself**; a full postprocessing chain adds passes and a dependency for marginal gain. Revisit only if we later want bloom on gold glints |

### 2.2 Chosen architecture

Three cooperating layers, all inside one `<Canvas>` behind the hero content:

1. **Simulation (the physics)** — a ping-pong pair of small float FBOs (256×256, RGBA16F: height + velocity) advanced each frame by a fragment shader implementing a **damped spring-membrane (over-damped wave) equation**. The cursor injects force through a soft Gaussian brush **elongated along the cursor's velocity vector** (silk folds form perpendicular to the drag direction — this single detail is most of the difference between "silk" and "water"). Over-damping + slow propagation speed = tension and settle, never ripples.
2. **Surface (the geometry/light)** — a fullscreen plane whose fragment shader composes a heightfield: `staticDrape(uv)` (fixed-seed fbm folds, art-directed) + `idleDrift(uv, t)` (2–3 octaves of very slow noise) + `simulation(uv)` (the interactive layer). Normals derive from finite differences of the total height. Lighting: wrapped diffuse + **anisotropic specular (Kajiya-Kay-style, oriented along a thread-direction field)** + Charlie-style sheen at grazing angles + curvature-based occlusion in fold valleys + fresnel softening. Two virtual softboxes (warm key upper-left, cool ivory fill lower-right) emulate a fabric still-life studio.
3. **Finish (the grade)** — in-shader: champagne color ramp mapped to luminance, gold (`Oro Antico`) bias in highlights, a whisper of `Blu Notte` in the deepest folds (warm light / cool shadow — the couture grade), blue-noise dither + fine grain (**mandatory** — pale gradients band badly on 8-bit displays), gentle vignette.

**Why this is the superior choice here:** it is the only option that satisfies "physically believable, no gimmicks" (real lighting response from a real heightfield with inertia), it isolates cleanly into one directory the rest of the site never depends on, it reuses the existing hooks and fallback pattern the Hero already has for video, and its degraded state (a rendered still of the same shader) is indistinguishable from a high-end photograph — so every fallback path stays luxurious.

### 2.3 Integration seam

- `Hero.tsx`: the `<video>` element and its loading logic are replaced by `<SilkHero />`, mounted in the same z-slot (`--z-base`). Everything else in Hero — overlay scrim, content, scroll indicator, entry keyframes — is untouched.
- `SilkHero` is a client wrapper that (a) decides poster vs. live via the existing hooks + WebGL capability probe + kill switch, and (b) `next/dynamic`-imports the Canvas bundle with `ssr: false` so Three.js never enters the server bundle and first paint is always the poster.
- Cursor and scroll values are smoothed through Framer `useSpring` motion values and written into uniforms inside `useFrame` — zero React re-renders per frame (MOTION_SPEC §5 discipline preserved).
- All tuned values live in one file, `silk.config.ts`, as named, commented, plain-English dials (fold depth, sheen width, settle seconds, calm-zone radius…). **This is the learner-maintainability contract:** taste is adjusted in one readable file, never inside GLSL.

---

## 3. Visual architecture (art direction)

### 3.1 The frame at rest — a still-life, not a membrane

A flat sheet that only moves under the cursor reads as "tech-demo membrane." Instead the resting pose is an **art-directed drape**: three or four large, slow diagonal folds sweeping bottom-left → top-right (echoing the site's 7/5 asymmetry), weight biased to the lower third, and a **calm plateau behind the wordmark** where the fabric flattens. At frame one — before any interaction — the page must already read as _extraordinary fabric, photographed beautifully_. The reduced-motion and no-WebGL poster is literally a render of this frame, so every visitor sees the same composition.

### 3.2 Lighting model

- **Key light:** large virtual softbox, upper-left, warm (toward Oro Antico). Produces the principal sheen band lying diagonally across the folds.
- **Fill:** dim cool-ivory softbox, lower-right — lifts shadows so nothing goes muddy; silk never has black shadows.
- **Sheen:** anisotropic highlight stretched along the thread direction; wide, soft falloff. This band **glides** as normals change — it is the protagonist of the whole effect.
- **Grazing glow:** Charlie-sheen term brightens fold crests at glancing angles — the "peach-fuzz" softness of real silk.
- **Occlusion:** concave curvature darkens gently (fold valleys), convex lifts — this is what makes folds read as soft volume rather than bump-mapped noise.
- **Diffuse wrap:** light wraps past the terminator (≈0.35) so shading is velvety, never CG-hard.

### 3.3 Palette (proposal — calibrated live against tokens in Phase 2)

| Role            | Hex                       | Note                                              |
| --------------- | ------------------------- | ------------------------------------------------- |
| Sheen highlight | `#F3E9D5`                 | never pure white                                  |
| Lit silk        | `#D9C5A5`                 | champagne                                         |
| Base            | `#C3A985`                 | sits near the approved `#a89374`, slightly lifted |
| Shadow          | `#97805F`                 | warm                                              |
| Deep fold       | `#6E5A40` + ~6% Blu Notte | cool undertone in the deepest creases             |
| Glint bias      | `#C4A76C` (Oro Antico)    | highlights lean gold, never yellow                |

Tone mapping **off** (`NoToneMapping`, sRGB output) so these hexes survive to screen and match `globals.css` by eyedropper.

### 3.4 Texture

One tileable silk-weave **normal map** (512–1024px, mipmapped) at thread scale, amplitude ~15% of the lighting normal — visible only inside the sheen band, exactly like real silk where weave shows only where light rakes it. Faded out as screen-space frequency rises to kill moiré.

### 3.5 Cursor interaction (the touch)

- Slow cursor movement barely disturbs the surface — a soft pre-shadow swell, as if a hand hovers above the cloth.
- Faster movement injects force proportional to velocity: a fold forms **behind** the cursor path, elongated along the stroke, highlights sliding along its crest.
- Inertia: the disturbance keeps traveling briefly after the cursor stops, then settles over **1.8–2.6 s** with over-damped decay — no bounce, no rings.
- Amplitude ceiling: perceived displacement ≤ **~3% of viewport height**. The sheen shift should be 3–5× more noticeable than the geometric deformation. If a screen recording looks "wavy," it's overtuned.
- **Calm zone:** a soft radial mask around the wordmark reduces displacement ~70% and clamps specular energy there — legibility is protected physically, and the brand appears to rest on the stillest part of the cloth (a quietly deliberate detail).

### 3.6 Idle animation

Two to three octaves of very slow noise (periods 20–60 s) drift the drape a few pixels; the sheen band migrates almost imperceptibly; every ~30–45 s a barely-visible "breath" passes through one fold. The fabric is alive in peripheral vision, never performing.

### 3.7 Entry choreography (once, ~3.2 s)

1. `t=0` — poster (identical to the shader's resting frame) paints immediately; wordmark cascade (existing 0/80/200/320 ms CSS delays) begins.
2. Canvas ready → cross-fades over ~600 ms (imperceptible: same image).
3. One slow diagonal **tension wave** travels bottom-left → top-right over ~2.4 s (expo-out), the sheen sweeping across as the tagline and CTAs land.
4. Settles into idle. Never replays. Reduced motion: steps 2–4 skipped entirely.

### 3.8 Scroll interaction

As the hero scrolls out: silk translates at ~0.9× scroll (a breath of parallax), scroll velocity feeds a very gentle uniform downward drag (the cloth acknowledges being left), and interactive amplitude decays to zero by ~80% exit. Rendering pauses entirely once offscreen (`useIntersectionObserver`). **No pinning, no scroll-jacking.** Bottom 12% of the canvas dissolves into Pietra `#FAF8F3` so the silk appears laid onto the page's linen ground — the section seam becomes an art moment.

### 3.9 Page transitions

Out of scope for V1: the site is a single-page IA (`/` + `/privacy` + stubs). The scroll-out behavior _is_ the transition. A persistent cross-route canvas is real scope creep with nothing to transition to.

---

## 4. Technical implementation plan (phases)

> Each phase ends green: `npm run test && npm run typecheck && npm run build`. The site must be shippable after every phase — the poster path guarantees this.

### Phase 0 — Governance & direction lock _(docs only, no code)_

- **Objective:** amend `TECHNICAL_ARCHITECTURE.md` (lift the Three.js exclusion **for the hero only**, with rationale + bundle note) and `MOTION_SPEC.md` (add §3.8 Silk Hero with its reduced-motion contract); record in `PRD.md` that the silk experience **replaces the hero-video asset requirement** (closes progress.md 2.5 — and deletes a videography line from the client's budget).
- **Files:** `TECHNICAL_ARCHITECTURE.md`, `MOTION_SPEC.md`, `PRD.md`, `progress.md`.
- **Risks:** none technical; requires Sofia's nod on the video-replacement decision (checkpoint 1, §10).
- **Testing:** n/a.

### Phase 1 — Canvas foundation & fallback plumbing

- **Objective:** a flat champagne WebGL plane renders behind the untouched hero content; every fallback path works; zero regressions.
- **Dependencies added:** `three`, `@react-three/fiber@^9`, `@react-three/drei` (selective imports), `leva` (devDependency, dev-only mount), `@types/three`.
- **Files/components created:** `src/components/silk/SilkHero.tsx` (wrapper: capability probe, reduced-motion/save-data branches, `NEXT_PUBLIC_SILK_HERO` kill switch, dynamic import), `SilkCanvas.tsx` (Canvas setup: DPR clamp ≤2, `NoToneMapping`, sRGB, context-loss → poster swap), `SilkPoster.tsx` (static image + current CSS treatment), `silk.config.ts`, `src/components/silk/README.md` (learner explainer). Modified: `Hero.tsx` (video block → `<SilkHero />`), `.env.example`.
- **Risks:** R3F v9/React 19/Next 15 interop (mitigate: pin versions, `ssr:false` inside a client boundary); jsdom tests can't create GL contexts (mitigate: test the wrapper's branch logic, not the Canvas).
- **Testing:** new `tests/unit/components/silk/SilkHero.test.tsx` — poster on no-WebGL / reduced motion / kill switch, live path otherwise; existing `Hero.test.tsx` updated; full suite green.

### Phase 2 — The Still (drape, material, light) ⭐ art-direction phase

- **Objective:** a static frame beautiful enough to be the brand photograph: drape heightfield, normals, anisotropic sheen + Charlie sheen + wrap diffuse + curvature AO, champagne grade, weave normal map, grain/dither, vignette. **Money-shot gate:** does it pass "page from an Italian design magazine"?
- **Files:** `src/components/silk/shaders/{noise,lighting,silk.frag,silk.vert}.ts` (GLSL as template literals — no bundler config changes), `SilkPlane.tsx`, `public/textures/silk-weave-normal.png`, leva dev panel (dev-only), `silk.config.ts` populated.
- **Risks:** _the_ taste risk — CG-plastic look (mitigate: calibration session against reference photography, leva live-tuning, checkpoint 2 with Sofia); banding (grain is in from day one); moiré (mip bias + frequency fade).
- **Testing:** shader compile smoke test in real-browser Playwright; visual snapshot with a `?silkFreeze=<t>` test-only query param (fixed seed + frozen time → deterministic pixels); **export the poster** (`hero-desktop`/`hero-mobile` AVIF/WebP/JPEG) from this still, replacing the SVG placeholders.

### Phase 3 — Life (idle + entry)

- **Objective:** idle drift, breath, sheen migration; entry tension-wave choreographed against the existing CSS cascade timings; poster→canvas crossfade.
- **Files:** `silk.frag.ts` (idle terms), `SilkPlane.tsx` (time/entry uniforms), `SilkHero.tsx` (ready-state crossfade), `silk.config.ts`.
- **Risks:** idle motion too visible (dial: idle amplitude ≤ 25% of interactive ceiling); entry fighting the text cascade (single shared timeline constant in config).
- **Testing:** reduced-motion branch re-verified (static frame, no time advance); manual review at 0.25× playback speed — cinematic pacing is judged, not asserted; frame-time sanity in devtools.

### Phase 4 — The Touch (simulation) ⭐ hardest phase

- **Objective:** cursor/touch-reactive deformation with inertia and settle, per §3.5.
- **Files:** `useSilkSimulation.ts` (ping-pong FBO hook via drei `useFBO`), `shaders/simulation.frag.ts`, pointer plumbing (window-level `pointermove` → Framer springs → uniforms), calm-zone mask, touch strokes on mobile (passive listeners, `touch-action` unaffected — canvas is non-interactive, `aria-hidden`, `pointer-events: none`).
- **Risks:** water-look (over-damp, elongated brush, amplitude ceiling — plus checkpoint 3 explicitly asks "does it feel like cloth?"); half-float FBO support on older iOS (probe `EXT_color_buffer_half_float`, fall back to idle-only mode — still beautiful); focus-visible/keyboard unaffected (decorative layer only).
- **Testing:** unit tests for brush math + config bounds (pure functions extracted from the hook); Playwright pointer-path scenario asserting the canvas updates then settles (pixel-diff between t and t+4s ≈ resting frame); real-device matrix (iPhone Safari, Android Chrome — the existing MOTION_SPEC checklist).

### Phase 5 — Integration & hardening

- **Objective:** scroll coupling + bottom dissolve into Pietra; pause when offscreen/tab-hidden; Safari/iOS pass; context-loss recovery drill; a11y audit (canvas `aria-hidden`, contrast over the calm zone re-measured, reduced-motion end-to-end); docs updated (`MOTION_SPEC.md` verification checklist entries, silk README finalized); bundle impact recorded honestly in `progress.md` (~+180–200 kB gz expected — accepted by brief, revisit-later note filed).
- **Files:** `SilkCanvas.tsx`, `Hero.module.css` (dissolve), docs.
- **Risks:** Safari DPR/thermals (DPR 1.5 cap on iOS); `isolation: isolate` z-stacking on the section already handles overlay ordering.
- **Testing:** full Playwright e2e incl. visual snapshots on `?silkFreeze`; Lighthouse CLS check (poster and canvas share identical layout box → zero CLS); `npm run test`/`typecheck`/`build` green; manual cross-browser matrix signed off.

---

## 5. Recommended libraries

| Library                                   | Role          | Why it earns its place                                                                                                                                                                                                              |
| ----------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `three`                                   | renderer      | The WebGL foundation; no credible alternative at this quality bar                                                                                                                                                                   |
| `@react-three/fiber` v9                   | React host    | React-19-compatible declarative Three; composes with App Router + existing hook patterns                                                                                                                                            |
| `@react-three/drei`                       | helpers       | Only `shaderMaterial` + `useFBO` (+ maybe `useTexture`) — saves ~200 lines of FBO/material plumbing; tree-shaken                                                                                                                    |
| `leva` (dev-only)                         | tuning panel  | Turns taste into numbers during Phases 2–4 calibration with the client; excluded from prod bundle                                                                                                                                   |
| **Not** `postprocessing`                  | —             | grain/vignette live in the silk shader; defer unless bloom is later wanted                                                                                                                                                          |
| **Not** `simplex-noise` (npm)             | —             | noise is GLSL-inline; no runtime JS dep                                                                                                                                                                                             |
| **Not** GSAP / theatre.js                 | —             | no timeline choreography beyond one entry wave; Framer + config constants cover it; GSAP stays excluded per architecture doc                                                                                                        |
| `lenis` — **deferred, separate decision** | smooth scroll | Would deepen the cinematic feel _site-wide_, but changes scroll physics on every section and needs its own reduced-motion story. Recommend evaluating **after** Phase 5, as its own mini-spec. Not required for the hero to succeed |

---

## 6. Risks & fallback strategy

| Risk                                 | Assessment                                                                     | Mitigation                                                                                                                                                                                                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Browser compat                       | WebGL2 universal in evergreen + Safari 15+; half-float FBO quirks on older iOS | Capability probe → tiered: full sim → idle-only → poster. Never a blank hero                                                                                                                                                                                     |
| GPU load                             | Sim is tiny (256² FBO); fragment lighting is the cost; laptops/thermals        | DPR clamp, pause offscreen & on `visibilitychange` (hygiene, not optimization); "ignore perf" accepted otherwise                                                                                                                                                 |
| Bundle                               | ~+180–200 kB gz on a 169 kB baseline (~2×)                                     | Accepted per brief; `ssr:false` + post-LCP mount keeps first paint instant (LCP stays the DOM wordmark/poster); optimization pass deferred by design                                                                                                             |
| Accessibility                        | Vestibular triggers from large-field motion; text contrast                     | Reduced-motion → static poster (site convention already collapses all motion); amplitude ceiling; calm zone + existing scrim keep wordmark ≥3:1 (large text); canvas `aria-hidden`, `pointer-events:none`                                                        |
| Mobile                               | No cursor; battery                                                             | Touch strokes drive the same brush; idle drift carries the effect otherwise; DPR 1.5; save-data → poster (logic already exists in Hero)                                                                                                                          |
| Context loss (mobile tab switching)  | Real on iOS                                                                    | `webglcontextlost` handler swaps to poster; attempt restore silently                                                                                                                                                                                             |
| **Art risk: reads as water/CG**      | The make-or-break risk                                                         | Over-damped sim, velocity-elongated brush, amplitude restraint, warm/cool grade, checkpointed calibration with reference photography                                                                                                                             |
| Banding on pale gradients            | Certain without countermeasure                                                 | In-shader blue-noise dither + grain from Phase 2 day one                                                                                                                                                                                                         |
| Tone shift vs. brand hexes           | Three's default pipeline alters hues                                           | `NoToneMapping` + sRGB out + eyedropper verification vs. `globals.css`                                                                                                                                                                                           |
| Maintainability (learner-owned repo) | Custom GLSL is expert-level                                                    | Isolation in `src/components/silk/`; all taste in commented `silk.config.ts`; folder README explaining every shader block; kill switch (`NEXT_PUBLIC_SILK_HERO=off` → poster) means the site never _depends_ on WebGL; Akshay named co-owner of the shader layer |
| Doc/code divergence                  | Arch doc bans Three.js today                                                   | Phase 0 amends docs _before_ code exists                                                                                                                                                                                                                         |

---

## 7. Visual references (quality bar)

_Interaction quality:_ Lusion (lusion.co), Active Theory (activetheory.net), Unseen Studio (unseen.co), 14islands, Makemepulse — the current ceiling for tasteful WebGL interaction. David Li's realtime cloth sim (david.li/flag) for physical believability of cloth motion specifically. Igloo Inc (Awwwards SOTY 2024) for overall WebGL polish. Codrops (tympanus.net) WebGL fabric/distortion demos for technique; Shadertoy anisotropic satin/silk shaders for the sheen model.
_Brand tone:_ Loro Piana and Zegna (fabric macro imagery, restraint), Hermès (craft with warmth), Aesop (editorial calm), Apple's AirPods Max/Watch-band pages (material macro + choreography discipline), A. Lange & Söhne / Vacheron Constantin (watch-brand quietness).
_Scroll feel (if Lenis is later adopted):_ darkroom.engineering (formerly Studio Freight), makers of Lenis.
⚠️ Portfolio sites rot; verify each is live during the Phase 2 calibration session and screenshot the keepers into a moodboard.

---

## 8. Final recommendation (and where I push back on the brief)

Build it as: **poster-first champagne still-life that comes alive** — R3F canvas behind the untouched hero DOM; art-directed resting drape; anisotropic sheen doing the storytelling; over-damped spring-membrane sim for the touch; one cinematic entry wave; scroll-out decay; every fallback a beautiful photograph of the same frame.

Three challenges to the brief, with my recommendations:

1. **"The entire viewport should feel like a sheet of silk" — yes, but not a _flat_ sheet.** A flat plane that deforms only under the cursor reads as a rubber membrane demo. The resting **drape** (pre-sculpted folds, calm plateau behind the wordmark) is what makes frame one say _extraordinary fabric_ before the user moves at all. This is the single biggest art-direction decision in the project.
2. **"The silk should deform" — less than you think.** The luxury signal is the _highlight_ gliding across the weave, not geometry churning. Displacement capped at ~3% of viewport; if the fabric visibly "waves," we've built a flag, not couture. Restraint is the feature.
3. **"Ignore performance" — accepted, with two exceptions that are actually craft, not optimization:** the poster-first mount (first paint is instant and _is_ the cinematic fade-in) and pausing when offscreen (a hero that heats laptops while the user reads the contact form is not premium). Everything else — bundle size, GPU cost — is consciously deferred as you asked.

One honest cost to acknowledge: this doubles the JS bundle and introduces the repo's first expert-level subsystem into a learner-maintained codebase. The kill switch, config-file dial contract, and folder README are the price of admission — they're in the plan as first-class deliverables, not afterthoughts.

---

## 9. Decision register (needs owners before Phase 1 code)

| #    | Decision                                                                                  | Owner                                    | Default if unanswered                                                     |
| ---- | ----------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------- |
| D-S1 | Silk hero replaces the hero-video asset requirement (budget + PRD change)                 | **Sofia**                                | Proceed — no video was ever sourced                                       |
| D-S2 | Lift Three.js exclusion for hero only (arch doc amendment)                                | **User + Akshay**                        | Proceed per this brief                                                    |
| D-S3 | Hero stays white-on-champagne (current approved scheme) vs. flipping to dark-on-pale-silk | **User** (Sofia sees it at checkpoint 2) | Keep white-on-champagne — continuity with the approved wordmark treatment |
| D-S4 | Mobile gets the live sim (touch strokes) vs. poster-only                                  | **User**                                 | Live sim with idle-only tier fallback                                     |
| D-S5 | Lenis site-wide smooth scroll                                                             | **User**                                 | Defer to post-Phase-5 mini-spec                                           |
| D-S6 | Who co-owns the shader layer long-term                                                    | **User + Akshay**                        | Akshay                                                                    |

**What we know:** full verified audit (§1); approved hero copy/structure; empty video slot; house fallback conventions ready to reuse.
**What's missing:** the decisions above; a real-device test pool confirmation; Sofia's three checkpoints (§10).
**Deliverables gating implementation:** user approval of this spec → then invoke `superpowers:writing-plans` for the per-task executable plan (TDD steps, exact diffs, verification commands per task).

## 10. Client checkpoints

1. **After Phase 0:** Sofia confirms D-S1 (silk replaces video) — one message with a one-paragraph explanation and a reference clip.
2. **After Phase 2:** the Still — a full-res screenshot pair (desktop/mobile). Gate question: _"Does this look like a page from an Italian design magazine?"_
3. **After Phase 4:** the Touch — live URL on her own phone + laptop. Gate question: _"Does it feel like silk under your hand?"_

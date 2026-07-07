# Silk Hero

The hero's background is a live, cursor-reactive WebGL silk simulation. Full
design rationale: `docs/superpowers/specs/2026-07-07-silk-hero-experience-design.md`.
This file is the "how do I touch this without breaking it" explainer for
whoever maintains the repo next.

## The one file you should actually edit: `silk.config.ts`

Every number that affects how the silk _looks_ — fold depth, sheen width,
idle drift speed, how hard the cursor pushes the cloth, the colour ramp —
lives in `silk.config.ts` as a plain, commented object. If you want a
subtler resting drape or a wider sheen band, change a number there. You
should never need to open a `.frag.ts`/`.vert.ts` file just to restyle the
look.

**The current numbers are a first pass, not a finished tune.** They compile
and run correctly, but the art direction (§7 of the spec — "does this look
like a page from an Italian design magazine?") is explicitly gated on a
client review checkpoint that hasn't happened yet. Expect to revisit
`silk.config.ts` after that session.

## Capability tiers

`SilkHero.tsx` picks one of three outcomes, in order:

1. **Poster** — a static image, identical composition to the live shader's
   resting frame. Used when: no WebGL2, `prefers-reduced-motion`, a slow
   connection/`save-data`, the `NEXT_PUBLIC_SILK_HERO=off` kill switch, or a
   WebGL context-loss event. The site never depends on WebGL to render a
   complete hero.
2. **Live, idle-only** — the shader renders (drape, lighting, idle drift,
   entry wave) but cursor/touch deformation is disabled. Used on devices
   that support WebGL2 but not the `EXT_color_buffer_float` extension the
   touch simulation's FBO needs (some older iOS Safari versions).
3. **Live, full** — everything, including the cursor/touch simulation.

`src/lib/webgl.ts` decides 2 vs. 3 once (memoized) via a capability probe.

## File map

| File                   | What it does                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SilkHero.tsx`         | Decides poster vs. live; owns the crossfade, scroll parallax, and offscreen/tab-hidden pause.                                                                                                                                                                                                                                                                           |
| `SilkPoster.tsx`       | The static fallback — currently the pre-existing flat-champagne SVG (see "Known gaps" below).                                                                                                                                                                                                                                                                           |
| `SilkCanvas.tsx`       | The `<Canvas>` itself: DPR clamp, colour space, context-loss listeners, pointer tracking, picks the idle-only vs. full scene variant.                                                                                                                                                                                                                                   |
| `SilkPlane.tsx`        | The mesh + material + per-frame uniform updates (time, entry progress, breath envelope).                                                                                                                                                                                                                                                                                |
| `SilkMaterial.ts`      | Assembles the GLSL pieces into two `THREE.ShaderMaterial` subclasses. Deliberately _not_ registered as JSX intrinsics (`<silkMaterial />`) — instances are constructed directly (`new SilkMaterial()`) and mounted via `<primitive attach="material" object={...} />`, with uniforms set as plain properties. Simpler to read than typing custom per-uniform JSX props. |
| `useSilkSimulation.ts` | The cursor/touch physics: a ping-pong pair of tiny FBOs advanced one damped-wave timestep per frame.                                                                                                                                                                                                                                                                    |
| `useSilkPointer.ts`    | Reads the Framer spring-smoothed pointer position into a plain ref each frame (no React re-renders).                                                                                                                                                                                                                                                                    |
| `shaders/*.ts`         | GLSL as template-literal strings — no bundler/loader config needed for `.glsl` files. `noise.ts`/`lighting.ts` are reusable function libraries; `silk.*`/`simulation.*` are the two actual shader programs.                                                                                                                                                             |
| `silk.config.ts`       | Every tunable number. See above.                                                                                                                                                                                                                                                                                                                                        |

## Why the touch simulation looks like cloth, not water

Two details, both in `shaders/simulation.frag.ts`: the wave equation is
**over-damped** (no bounce, no rings — it settles), and the pointer's force
brush is **elongated along the cursor's velocity direction**, so a fold
forms perpendicular to the drag path. Turn either of those off and it reads
as a rubber membrane or a puddle.

## If you see a visible grid/checkerboard pattern on the surface

Two real bugs produced exactly this during development — both fixed, but
worth knowing about if a future edit reintroduces something similar:

1. **Unstable simulation.** `shaders/simulation.frag.ts`'s discrete
   Laplacian must be divided by the grid spacing squared (`uTexel.x²`).
   Without it, the effective wave speed is scaled up by roughly
   `simResolution²`, blowing straight through the CFL stability limit for
   an explicit finite-difference scheme — the textbook symptom is a
   persistent checkerboard. If you raise `touch.simResolution` in
   `silk.config.ts`, you must lower `touch.waveSpeed` to compensate
   (stability scales with `1/simResolution`).
2. **A dither/grain hash with hidden structure.** `ditherNoise()` in
   `shaders/lighting.ts` looks like plain noise in the source but two
   earlier versions (interleaved-gradient-noise, then a 2-constant hash
   with near-identical magic numbers) both produced a visible regular
   grid when sampled at integer `gl_FragCoord` pixel coordinates. If you
   ever swap this hash, screenshot-test the result — a hash "looking
   random" in isolation doesn't guarantee it stays random at integer
   pixel-lattice inputs.

Both were invisible to `npm run test`/`typecheck`/`build` and only showed
up by actually rendering the shader in a browser — see the testing note
below on why that has to be a _real GPU_ browser launch, not the default
headless one.

## Known gaps (tracked in `progress.md`)

- **Poster images are still the old flat-champagne SVG placeholders**
  (`public/images/hero/hero-{desktop,mobile}.svg`), not a real export of
  the shader's resting frame. The spec's Phase 2 testing step calls for a
  `?silkFreeze=<t>` deterministic capture to replace these — not yet built.
- **The weave normal map is procedural**, not an authored tileable texture
  (`silk.config.ts`'s `weave` block). An authored ~512px asset would look
  better at close inspection; the procedural stand-in avoids needing a
  binary asset for a first pass.
- **Art direction is untuned.** See the note at the top of this file.
- **Testing — unit tests:** jsdom can't create a WebGL2 context, so unit
  tests exercise `SilkHero`'s branch logic (poster vs. live, via a mocked
  capability probe) rather than the actual Canvas — this is the approach
  the spec itself recommends (§4, Phase 1). You'll see a benign
  `Not implemented: HTMLCanvasElement.prototype.getContext` line in test
  stderr; it's the try/catch in `webgl.ts` handling jsdom's lack of a real
  `getContext`, not a failure.
- **Testing — manual/visual verification:** Playwright's default headless
  Chromium launch uses SwiftShader (software rendering), not a real GPU.
  This is enough to sanity-check that the app doesn't crash, but it can
  both hide and manufacture visual bugs relative to real hardware (this
  happened during development — see above). For any visual judgment call
  on this shader, launch Chromium with
  `{ args: ["--use-gl=angle", "--use-angle=metal", "--ignore-gpu-blocklist", "--enable-gpu"] }`
  (adjust `--use-angle` for the platform) to get real GPU rendering first.

## Turning it off

Set `NEXT_PUBLIC_SILK_HERO=off` in the environment to force the poster
everywhere, bypassing WebGL entirely — useful if the live shader ever
misbehaves in production and you need an immediate, no-deploy-required
rollback lever (it's an env var, so it takes effect on the next
deploy/restart, not instantly, but it doesn't require touching code).

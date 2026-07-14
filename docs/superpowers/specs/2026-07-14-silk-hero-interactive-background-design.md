# Silk Hero Interactive Background — Design Spec

**Date:** 2026-07-14
**Branch (assets, this session):** `feat/silk-hero-background-assets`
**Branch (implementation, next session):** `feat/silk-hero-interactive-background`
**Status:** Assets delivered and client-selected. Implementation planned, not started.

---

## 0. What this is

Replace the hero's static backdrop image with an **interactive WebGL silk background**: the client-selected 5K caramel silk still as the base texture, plus subtle cursor-driven fabric deformation. **Nothing else in the hero or site changes** — not the navbar, typography, logo, buttons, hero text, spacing, layout, positioning, or any other section.

Image quality is the hard acceptance criterion, ranked above animation complexity. A simple, extremely sharp, beautifully animated silk surface beats an advanced interactive effect that looks blurry or pixelated.

## 1. Decision history (how we got here)

1. **The client's hero photo (`public/images/hero/hero.jpg`) is 1555 × 1012** — far below the 3840 × 2160 minimum for a sharp fullscreen Retina hero. Stretched ~2.5× on a DPR-2 display, it is the source of the "blurry, pixelated" complaint. Checked: repo, full git history, no higher-res copy exists anywhere. Per the client brief's own STOP gate, it was rejected as a base texture. **Do not reinstate it as the WebGL texture.**
2. **The in-repo procedural silk shader (`src/components/silk/`) was rejected as a direct visual source.** A 5120 × 2880 SwiftShader capture of it produced chaotic noise, blown highlights, and a visible flat "blob" (its config admits its fold/weave values were never calibrated). Its _machinery_ (pointer tracking, FBO wave sim, fallback gating) remains valuable and is reused — its _look_ is not.
3. **The base texture was instead rendered offline** by `scripts/render-silk-still.mjs` — a deterministic float-precision heightfield renderer (no `Math.random`, reproducible byte-for-byte). Three art-directed variants were rendered at 5120 × 2880; the client selected **V3 "corner drape"** (4 folds weighted to lower-left and far-right corners, calm centre behind the wordmark) with the darker "premium" grade (shadows `#38200a`, base `#8f571c`, peak highlight muted champagne `#deb37a` — never white, never saturated orange).
4. V1/V2 variants were deleted; they are reproducible exactly by re-running the renderer script.

## 2. Delivered assets (this session)

| File                                    | Size                    | Role                                                               |
| --------------------------------------- | ----------------------- | ------------------------------------------------------------------ |
| `public/images/hero/silk/silk-5120.jpg` | 5120 × 2880, q95, 4:4:4 | Master texture — large/Retina desktops                             |
| `public/images/hero/silk/silk-3840.jpg` | 3840 × 2160, q95, 4:4:4 | Standard desktop tier                                              |
| `public/images/hero/silk/silk-2048.jpg` | 2048 × 1152, q92, 4:4:4 | Mobile tier (also the floor for GPUs with `MAX_TEXTURE_SIZE` 4096) |
| `scripts/render-silk-still.mjs`         | —                       | Deterministic renderer; regenerates all variants/tiers             |

Verified at 100% zoom: visible anisotropic fibre grain (runs along the fold direction), zero banding (dithered before 8-bit quantise), zero chroma-subsampling artefacts.

**These files must be served as-is from `/public`.** Never route them through `next/image`, the Vercel image optimizer, or any build-time compression. Loading is `THREE.TextureLoader` (or equivalent) against the literal URL.

## 3. Architecture (implementation session)

```
Hero.tsx
 └─ (backdrop div ONLY is replaced)
     SilkFabricBackground            ← new wrapper: gating + poster + parallax
      ├─ poster <img> silk-3840.jpg  ← universal fallback; visually identical at rest
      └─ SilkFabricCanvas (dynamic, ssr:false)   ← R3F canvas
          ├─ texture tier selection (§5)
          ├─ subdivided plane + custom vertex/fragment shaders
          ├─ FBO wave simulation      ← adapted from src/components/silk/useSilkSimulation.ts
          ├─ pointer velocity input   ← adapted from src/components/silk/useSilkPointer.ts
          └─ idle drift + delta sheen
```

- **Reuse, don't rebuild:** `useSilkPointer` (pointer → UV + velocity), `useSilkSimulation` (RGBA16F height+velocity FBO, soft elongated brush, over-damped propagation — no rings), and the `SilkHero` gating logic (WebGL2 / reduced-motion / save-data / kill-switch / context-loss). Fabric taste dials live in a new `src/components/silk/fabric/fabric.config.ts`; the old `silk.config.ts` (retired procedural look) stays byte-identical for git archaeology.
- **The texture is the look; WebGL adds life:** vertex displacement hard-clamped to ≤ ~2.5% of viewport height so the baked photographic detail always dominates. Normals recomputed from the displaced heightfield drive a _delta_ sheen term (subtle brightening/darkening only — no colour shifts, no texture smearing).
- **Cover-fit UV mapping:** the 16:9 texture covers any viewport aspect the way `object-fit: cover` would — no stretching, crop the overflow axis. UV offsets keep the calm zone centred on the wordmark.
- **Fragment shader**: sample texture (sRGB), apply delta sheen from sim normals, nothing else. No blur, bloom, noise overlays, grain, chromatic aberration, motion blur, CSS filters, or sharpening — the "do not fake quality" list is a hard rule.

## 4. Rendering resolution (hard requirements)

- `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5))` — in R3F: `dpr={[1, 2.5]}`. The existing config's `dprCap: 2` is superseded for this component.
- Drawing buffer must match CSS size × effective DPR. **Never render internally at ~1920 wide and stretch across a Retina display.**
- On resize the buffer re-derives; no stale-size stretching.
- Do not lower the DPR cap for performance without measuring first (§7).

## 5. Texture quality (hard requirements)

- Tier selection at mount: `needed = viewportCssWidth × min(dpr, 2.5)` → smallest tier ≥ `needed` (5120 tier when `needed > 3840`), clamped by `renderer.capabilities.maxTextureSize` (4096-cap GPUs get the 2048 tier; do not attempt 5120 on them).
- `texture.colorSpace = THREE.SRGBColorSpace`
- `texture.anisotropy = renderer.capabilities.getMaxAnisotropy()`
- `texture.minFilter = THREE.LinearMipmapLinearFilter`, `magFilter = THREE.LinearFilter`, `generateMipmaps = true`
- No texture compression at load, in the build, or at deploy. Verify the **deployed** Vercel response serves the identical bytes (content-length / hash comparison against the repo file), not only localhost.

## 6. Motion model (from the client brief)

- **Cursor:** broad soft force under the silk, radius ≈ 200–350 CSS px, strength scaled by cursor velocity. Force → gradual reaction → tension propagates → brief inertia → damped settle (≈2.2 s, over-damped: no bounce, no rings). The fabric never follows the cursor directly. Forbidden: water ripples, circular waves, cursor glow, visible distortion circles, spotlight, liquid effects, rubber stretching.
- **Idle:** extremely slow, low-frequency drift (non-integer period ratios so no visible loop), tiny tension changes, slow sheen migration. Calm, discoverable, never performing.
- **Calm zone:** displacement and delta-sheen attenuated ~70% in the centre where the wordmark/tagline sit (the baked texture is already calm there; the sim must keep it so).
- **Entry:** hero's existing enter cascade is untouched; canvas cross-fades in over the poster only when ready (`onReady` → opacity transition, exactly like the old SilkHero pattern).

## 7. Performance & adaptive quality

- Target 60 fps desktop **at full resolution first**; measure before degrading anything. Resolution is the last thing sacrificed, geometry/shader complexity the first.
- Pause rendering when the hero is out of the viewport (IntersectionObserver) or the tab is hidden (`visibilitychange`) — machinery already exists in `SilkHero`.
- No React state updates inside the render loop; reuse vectors/objects; no per-frame allocations.
- Adaptive ladder (only if measurement demands it): plane segments 192×108 → 128×72; sim FBO 256 → 192; delta-sheen simplification. DPR cap reduction is the final rung, mobile-only.
- Mobile: 2048 tier, reduced sim resolution, ambient-only animation acceptable (touch has no hover); DPR reduction only if necessary.

## 8. Mandatory verification (gates completion)

Log at startup (dev builds; also exposed as `window.__SILK_DIAGNOSTICS__`):
CSS canvas width/height · `devicePixelRatio` · renderer pixel ratio · drawing buffer width/height · texture intrinsic width/height · `MAX_TEXTURE_SIZE` · anisotropy in use.

Screenshot matrix, each inspected at 100% zoom: 1920×1080 @DPR 1 and 2 · 2560×1440 @DPR 1 and 2 · MacBook Retina (1512×982 @DPR 2) · 4K (3840×2160 @DPR 1). Verify: no pixelation, no blur, no stretched texture, smooth interaction, readable hero typography, correct aspect (no distortion), sane GPU memory.

Final report format (required, from the client brief): SOURCE TEXTURE (intrinsic w/h) · DISPLAY (CSS w/h, DPR) · WEBGL (renderer pixel ratio, drawing buffer w/h, max texture size, anisotropy) · PERFORMANCE (avg FPS, approx GPU memory, mobile fallback used) · QUALITY CHECK (visible pixelation Y/N, texture stretching Y/N, compression detected Y/N, retina verified Y/N). **If pixelation, stretching, or compression is YES — the implementation is not complete.** Fix it or explain exactly why a higher-resolution source is required.

## 9. Out of scope / must not change

Navbar · typography · logo/wordmark · buttons/CTAs · hero copy · spacing/layout/positioning · overlay & dissolve divs (they stay, above the canvas) · every other section · `/ar` locale behaviour (canvas is locale-agnostic; RTL does not mirror the background) · the old `src/components/silk/` procedural look (leave the module in place; only import the hooks being reused).

## 10. Risks & mitigations

- **Baked highlights + displacement can read "painted on"** → displacement clamp + delta sheen keeps deformation subtle; the photographic detail always dominates.
- **In-memory GPU cost of the 5120 tier (~59 MB + mipmaps)** → tier ladder; only large Retina viewports load it.
- **Vercel/Next silently recompressing `/public` assets** → deployed-bytes verification step is mandatory (§5, §8).
- **`Testimonials`-style empty-state regressions**: none — no data files change.

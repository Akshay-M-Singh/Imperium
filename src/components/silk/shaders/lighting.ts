// lighting.ts — the silk-specific shading model (design spec §3.2), as
// reusable GLSL functions. Kept separate from silk.frag.ts so the fragment
// shader itself stays readable as "compose these named terms," not a wall
// of math.

export const lightingFunctions = /* glsl */ `
  // Wrapped diffuse: light wraps past the geometric terminator so shading
  // is velvety, never CG-hard (§3.2 "diffuse wrap").
  float wrapDiffuse(vec3 n, vec3 l, float wrap) {
    float ndotl = dot(n, l);
    return clamp((ndotl + wrap) / (1.0 + wrap), 0.0, 1.0);
  }

  // Kajiya-Kay anisotropic specular, oriented along a thread-direction
  // tangent field. This is the sheen band — the protagonist of the whole
  // effect (§3.2). Wide, soft falloff rather than a tight mirror highlight.
  float anisotropicSpecular(vec3 n, vec3 t, vec3 v, vec3 l, float spread) {
    vec3 h = normalize(v + l);
    float th = dot(t, h);
    float nh = dot(n, h);
    float sinTh = sqrt(max(0.0, 1.0 - th * th));
    float sinNh = sqrt(max(0.0, 1.0 - nh * nh));
    float spec = pow(clamp(sinTh * sinNh + th * nh, 0.0, 1.0), 1.0 / max(spread, 0.01));
    return spec;
  }

  // Charlie-style sheen: brightens fold crests at grazing angles — the
  // "peach-fuzz" softness of real silk (§3.2 "grazing glow").
  float charlieSheen(vec3 n, vec3 v, float width) {
    float ndotv = clamp(dot(n, v), 0.0, 1.0);
    float inv = 1.0 - ndotv;
    return pow(inv, 1.0 / max(width, 0.01));
  }

  // Curvature-based occlusion: concave folds darken gently, convex crests
  // lift — this is what reads as soft cloth volume instead of bump-mapped
  // noise (§3.2 "occlusion"). Approximated from the screen-space normal
  // divergence rather than a true second derivative of height, which is
  // cheap and visually indistinguishable at this scale.
  float curvatureAo(vec3 n, float strength) {
    vec3 dx = dFdx(n);
    vec3 dy = dFdy(n);
    float curvature = length(dx) + length(dy);
    return 1.0 - clamp(curvature * strength * 8.0, 0.0, 0.6);
  }

  // Per-pixel hash noise for dithering pale gradients (mandatory per §3.3
  // — champagne bands badly on 8-bit displays without this) and for film
  // grain. This went through two failed attempts, both caught by
  // screenshotting a still frame on real GPU hardware during Phase 2
  // testing (a visible regular grid across the whole surface, not subtle
  // grain — the tell in both cases): (1) interleaved-gradient-noise is a
  // smooth, structured low-discrepancy sequence meant to be temporally
  // averaged across frames (TAA-style) — sampled statically its diagonal
  // structure shows directly; (2) a 2-component hash with two nearly
  // identical magic constants (0.1031/0.1030) aliased against integer
  // gl_FragCoord pixel coordinates into a short, visible repeat period.
  // This 3-component variant (Inigo Quilez / Patricio Gonzalez Vivo's
  // "hash13"-style construction) decorrelates enough at integer pixel
  // inputs to read as genuine noise, not structure.
  float ditherNoise(vec2 fragCoord) {
    vec3 p3 = fract(vec3(fragCoord.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  float vignette(vec2 uv, float strength, float radius) {
    vec2 centered = uv - 0.5;
    float d = length(centered) / radius;
    return 1.0 - strength * smoothstep(0.4, 1.0, d);
  }
`;

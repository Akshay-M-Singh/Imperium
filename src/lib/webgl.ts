// webgl — capability probe for the Silk Hero (silk-hero-experience-design.md
// Phase 1). Kept separate from the silk/ directory so it stays a plain,
// dependency-free function any future WebGL feature could reuse.

export interface WebglCapability {
  webgl2: boolean;
  halfFloatFbo: boolean;
}

function probe(): WebglCapability {
  if (typeof document === "undefined") {
    return { webgl2: false, halfFloatFbo: false };
  }

  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) return { webgl2: false, halfFloatFbo: false };

    // The touch simulation (Phase 4) writes to a half-float ping-pong FBO.
    // Older iOS Safari supports WebGL2 but not always this extension —
    // when absent, the idle-only tier still renders (no cursor simulation).
    const halfFloat = gl.getExtension("EXT_color_buffer_float");
    return { webgl2: true, halfFloatFbo: Boolean(halfFloat) };
  } catch {
    return { webgl2: false, halfFloatFbo: false };
  }
}

let cached: WebglCapability | null = null;

/** Memoized: canvas probing is cheap but pointless to repeat per render. */
export function getWebglCapability(): WebglCapability {
  if (!cached) cached = probe();
  return cached;
}

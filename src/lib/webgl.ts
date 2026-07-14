// webgl — capability probe for the Silk Hero (silk-hero-experience-design.md
// Phase 1). Kept separate from the silk/ directory so it stays a plain,
// dependency-free function any future WebGL feature could reuse.

export interface WebglCapability {
  webgl2: boolean;
  halfFloatFbo: boolean;
  maxTextureSize: number;
  maxAnisotropy: number;
}

const UNAVAILABLE: WebglCapability = {
  webgl2: false,
  halfFloatFbo: false,
  maxTextureSize: 0,
  maxAnisotropy: 0,
};

function probe(): WebglCapability {
  if (typeof document === "undefined") {
    return UNAVAILABLE;
  }

  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) return UNAVAILABLE;

    // The touch simulation (Phase 4) writes to a half-float ping-pong FBO.
    // Older iOS Safari supports WebGL2 but not always this extension —
    // when absent, the idle-only tier still renders (no cursor simulation).
    const halfFloat = gl.getExtension("EXT_color_buffer_float");
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    const anisoExt =
      gl.getExtension("EXT_texture_filter_anisotropic") ||
      gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
    const maxAnisotropy = anisoExt
      ? (gl.getParameter(anisoExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number)
      : 0;
    return { webgl2: true, halfFloatFbo: Boolean(halfFloat), maxTextureSize, maxAnisotropy };
  } catch {
    return UNAVAILABLE;
  }
}

let cached: WebglCapability | null = null;

/** Memoized: canvas probing is cheap but pointless to repeat per render. */
export function getWebglCapability(): WebglCapability {
  if (!cached) cached = probe();
  return cached;
}

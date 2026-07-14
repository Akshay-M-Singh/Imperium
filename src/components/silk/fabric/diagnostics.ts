// The client brief demands these nine values be logged and verifiable
// after implementation. The verification script (scripts/
// verify-silk-quality.mjs) reads window.__SILK_DIAGNOSTICS__.

export interface SilkDiagnostics {
  cssWidth: number;
  cssHeight: number;
  devicePixelRatio: number;
  rendererPixelRatio: number;
  drawingBufferWidth: number;
  drawingBufferHeight: number;
  textureWidth: number;
  textureHeight: number;
  maxTextureSize: number;
  anisotropy: number;
  retinaExact: boolean;
}

export function collectSilkDiagnostics(
  values: Omit<SilkDiagnostics, "retinaExact">,
): SilkDiagnostics {
  const retinaExact =
    Math.abs(values.drawingBufferWidth - values.cssWidth * values.rendererPixelRatio) <= 1 &&
    Math.abs(values.drawingBufferHeight - values.cssHeight * values.rendererPixelRatio) <= 1;
  return { ...values, retinaExact };
}

declare global {
  interface Window {
    __SILK_DIAGNOSTICS__?: SilkDiagnostics;
  }
}

export function publishSilkDiagnostics(d: SilkDiagnostics): void {
  window.__SILK_DIAGNOSTICS__ = d;
  if (process.env.NODE_ENV !== "production") {
    console.table(d);
  }
}

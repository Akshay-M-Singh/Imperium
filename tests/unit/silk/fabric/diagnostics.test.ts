import { describe, expect, it } from "vitest";
import { collectSilkDiagnostics } from "@/components/silk/fabric/diagnostics";

describe("collectSilkDiagnostics", () => {
  it("assembles the nine client-required values", () => {
    const d = collectSilkDiagnostics({
      cssWidth: 1920,
      cssHeight: 1080,
      devicePixelRatio: 2,
      rendererPixelRatio: 2,
      drawingBufferWidth: 3840,
      drawingBufferHeight: 2160,
      textureWidth: 3840,
      textureHeight: 2160,
      maxTextureSize: 16384,
      anisotropy: 16,
    });
    expect(d.drawingBufferWidth).toBe(3840);
    expect(d.retinaExact).toBe(true); // buffer == css × renderer ratio
  });

  it("flags a stretched buffer", () => {
    const d = collectSilkDiagnostics({
      cssWidth: 1920,
      cssHeight: 1080,
      devicePixelRatio: 2,
      rendererPixelRatio: 2,
      drawingBufferWidth: 1920, // WRONG: rendered small, stretched 2x
      drawingBufferHeight: 1080,
      textureWidth: 3840,
      textureHeight: 2160,
      maxTextureSize: 16384,
      anisotropy: 16,
    });
    expect(d.retinaExact).toBe(false);
  });
});

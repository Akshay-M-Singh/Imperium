import { describe, it, expect } from "vitest";
import { getWebglCapability } from "@/lib/webgl";

describe("getWebglCapability", () => {
  it("degrades gracefully when the environment cannot create a WebGL2 context", () => {
    // jsdom does not implement canvas.getContext — this exercises the
    // try/catch fallback path that keeps the Silk Hero on its poster tier
    // rather than throwing during render.
    const capability = getWebglCapability();
    expect(capability.webgl2).toBe(false);
    expect(capability.halfFloatFbo).toBe(false);
  });

  it("memoizes the result across calls", () => {
    const first = getWebglCapability();
    const second = getWebglCapability();
    expect(second).toBe(first);
  });
});

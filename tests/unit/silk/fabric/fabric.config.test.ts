import { describe, expect, it } from "vitest";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { SILK_FABRIC_CONFIG } from "@/components/silk/fabric/fabric.config";

describe("SILK_FABRIC_CONFIG", () => {
  it("caps DPR at 2.5 per the client brief", () => {
    expect(SILK_FABRIC_CONFIG.render.dprCap).toBe(2.5);
  });

  it("clamps displacement to at most 2.5% of viewport height", () => {
    expect(SILK_FABRIC_CONFIG.motion.displacementCeiling).toBeLessThanOrEqual(0.025);
  });

  it("keeps the cursor radius inside the 200-350 CSS px band at 1080p", () => {
    // brushRadius is in sim-UV space, mapped over the viewport height.
    const px = SILK_FABRIC_CONFIG.motion.brushRadius * 1080;
    expect(px).toBeGreaterThanOrEqual(200);
    expect(px).toBeLessThanOrEqual(350);
  });

  it("ships every texture tier it names", () => {
    for (const tier of SILK_FABRIC_CONFIG.texture.tiers) {
      const p = join(process.cwd(), "public", tier.src);
      expect(existsSync(p), `${tier.src} missing`).toBe(true);
      expect(statSync(p).size).toBeGreaterThan(50_000);
    }
  });
});

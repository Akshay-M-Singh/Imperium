import { describe, expect, it } from "vitest";
import { chooseTextureTier } from "@/components/silk/fabric/chooseTextureTier";

describe("chooseTextureTier", () => {
  it("picks the 2048 tier for a mobile viewport", () => {
    expect(chooseTextureTier(390, 3, 8192).width).toBe(2048);
    // 390 × min(3, 2.5) = 975 needed → smallest tier ≥ 975 is 2048
  });

  it("picks the 3840 tier for 1920 CSS px at DPR 2", () => {
    expect(chooseTextureTier(1920, 2, 16384).width).toBe(3840);
  });

  it("picks the 5120 tier when 3840 is not enough", () => {
    expect(chooseTextureTier(2560, 2, 16384).width).toBe(5120); // needs 5120
  });

  it("allows 3840 on a 4096-cap GPU but never 5120", () => {
    // needed = 2560 × 2.5 = 6400; 5120 exceeds the GPU cap, so the largest
    // allowed tier (3840) wins even though it is smaller than needed.
    expect(chooseTextureTier(2560, 2.5, 4096).width).toBe(3840);
  });

  it("caps effective DPR at 2.5", () => {
    expect(chooseTextureTier(1280, 4, 16384).width).toBe(3840); // 1280×2.5=3200 → 3840
  });

  it("falls back to the smallest tier when maxTextureSize is unknown (0)", () => {
    expect(chooseTextureTier(1920, 2, 0).width).toBe(2048);
  });
});

import { describe, it, expect } from "vitest";
import { SITE } from "@/lib/site";

describe("SITE brand configuration", () => {
  it("carries the Gulf tagline", () => {
    expect(SITE.tagline).toBe("Premium Italian fabrics · Delivered to the Gulf");
  });

  it("has no establishment-year field and no year anywhere", () => {
    expect(SITE).not.toHaveProperty("established");
    expect(JSON.stringify(SITE)).not.toMatch(/2026/);
  });

  it("declares the hero logo slot (path string or null)", () => {
    expect(SITE.logoSrc === null || typeof SITE.logoSrc === "string").toBe(true);
  });
});

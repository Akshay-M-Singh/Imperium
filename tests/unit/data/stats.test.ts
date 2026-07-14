import { describe, it, expect } from "vitest";
import { stats } from "@/data/stats";

describe("stats data", () => {
  it("EN leads with 40+ Fabrics", () => {
    expect(stats.en[0]).toEqual({ value: 40, suffix: "+", label: "Fabrics" });
  });

  it("AR leads with 40+ من الأقمشة", () => {
    expect(stats.ar[0]).toEqual({
      value: 40,
      suffix: "+",
      label: "من الأقمشة",
    });
  });

  it("contains no markets/cities-served stat, no mills or years claims, and no year", () => {
    const flat = JSON.stringify(stats);
    expect(flat).not.toMatch(/2026/);
    expect(flat).not.toMatch(/markets|cities/i);
    expect(flat).not.toMatch(/mills|years/i);
  });
});

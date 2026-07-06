import { describe, it, expect } from "vitest";
import { collections } from "@/data/collections";

describe("collections data", () => {
  it("has four collections in editorial order", () => {
    expect(collections.map((c) => c.id)).toEqual([
      "tessuti-italiani",
      "pezzi-unici",
      "ospitalita-di-lusso",
      "interior-exterior",
    ]);
  });

  it("carries the client-approved taglines", () => {
    const byId = Object.fromEntries(collections.map((c) => [c.id, c]));
    expect(byId["tessuti-italiani"]!.tagline).toBe("For those who don't compromise.");
    expect(byId["ospitalita-di-lusso"]!.tagline).toBe("Breathability, durability, and quality.");
    expect(byId["interior-exterior"]!.tagline).toBe(
      "Timeless design, durability, and versatility.",
    );
  });

  it("routes every collection CTA to the contact section", () => {
    for (const c of collections) {
      expect(c.cta).toEqual({ label: "Contact Us Now", href: "#contact" });
    }
  });

  it("mentions hotels, resorts and restaurants for Ospitalità di Lusso", () => {
    const osp = collections.find((c) => c.id === "ospitalita-di-lusso")!;
    expect(osp.body).toMatch(/hotels/i);
    expect(osp.body).toMatch(/resorts/i);
    expect(osp.body).toMatch(/restaurants/i);
  });

  it("contains no year and points at real image files", () => {
    expect(JSON.stringify(collections)).not.toMatch(/2026/);
    for (const c of collections) {
      expect(c.image.src).toMatch(/^\/images\/(fabrics|collections)\/[a-z-]+\.(svg|png)$/);
      expect(c.image.alt.length).toBeGreaterThan(10);
    }
  });
});

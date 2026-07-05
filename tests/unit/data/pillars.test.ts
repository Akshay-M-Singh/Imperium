import { describe, it, expect } from "vitest";
import { whyImperium } from "@/data/pillars";

describe("whyImperium data", () => {
  it("has exactly three items — no fourth pillar survives", () => {
    expect(whyImperium.items).toHaveLength(3);
    expect(JSON.stringify(whyImperium)).not.toMatch(/always available/i);
    expect(JSON.stringify(whyImperium)).not.toMatch(/partner, not a catalogue/i);
  });

  it("carries the client-approved headings in order", () => {
    expect(whyImperium.items.map((i) => i.heading)).toEqual([
      "Direct From the Source",
      "Made in Italy Expertise",
      "For the Gulf's Luxury Market",
    ]);
  });

  it("reserves media placeholders for map and stamp", () => {
    expect(whyImperium.items[0]!.media).toBe("map");
    expect(whyImperium.items[1]!.media).toBe("stamp");
    expect(whyImperium.items[2]!.media).toBeNull();
  });

  it("speaks to the Gulf, not Dubai-only, in item 3", () => {
    expect(whyImperium.items[2]!.paragraphs.join(" ")).toMatch(/Gulf/);
  });
});

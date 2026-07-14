import { describe, it, expect } from "vitest";
import { whyImperium } from "@/data/pillars";

describe("whyImperium data", () => {
  it("has exactly three items — no fourth pillar survives", () => {
    expect(whyImperium.en.items).toHaveLength(3);
    expect(JSON.stringify(whyImperium.en)).not.toMatch(/always available/i);
    expect(JSON.stringify(whyImperium.en)).not.toMatch(/partner, not a catalogue/i);
  });

  it("carries the client-approved headings in order", () => {
    expect(whyImperium.en.items.map((i) => i.heading)).toEqual([
      "Direct From the Source",
      "Made in Italy Expertise",
      "For the Gulf's Luxury Market",
    ]);
  });

  it("reserves media placeholders for map and stamp", () => {
    expect(whyImperium.en.items[0]!.media).toBe("map");
    expect(whyImperium.en.items[1]!.media).toBe("stamp");
    expect(whyImperium.en.items[2]!.media).toBeNull();
  });

  it("speaks to the Gulf, not Dubai-only, in item 3", () => {
    expect(whyImperium.en.items[2]!.paragraphs.join(" ")).toMatch(/Gulf/);
  });

  it("has exactly three AR items with matching media slots", () => {
    expect(whyImperium.ar.items).toHaveLength(3);
    expect(whyImperium.ar.items.map((i) => i.media)).toEqual(["map", "stamp", null]);
  });

  it("carries the AR headings in order", () => {
    expect(whyImperium.ar.items.map((i) => i.heading)).toEqual([
      "من المصدر مباشرة",
      "خبرة معتمدة في «صُنِع في إيطاليا»",
      "لسوق الفخامة في الخليج",
    ]);
  });
});

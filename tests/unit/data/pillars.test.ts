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

  it("has locale-keyed alt text for the map and stamp media slots", () => {
    expect(whyImperium.en.mapAlt).toBe("Illustrated route map from Italy to the UAE and the Gulf");
    expect(whyImperium.en.stampAlt).toBe("100% Made in Italy certification stamp");
    expect(whyImperium.ar.mapAlt).toBe("خريطة توضيحية لمسار الشحن من إيطاليا إلى الإمارات والخليج");
    expect(whyImperium.ar.stampAlt).toBe("ختم شهادة صُنِع في إيطاليا 100%");
    expect(whyImperium.ar.mapAlt).not.toBe(whyImperium.en.mapAlt);
    expect(whyImperium.ar.stampAlt).not.toBe(whyImperium.en.stampAlt);
  });

  it("closes item 1 with the competitive-sourcing line, never naming price", () => {
    expect(whyImperium.en.items[0]!.paragraphs[1]).toMatch(/competitive/i);
    // Site-wide rule: luxury positioning never states prices (user decision 2026-07-16).
    expect(JSON.stringify(whyImperium.en)).not.toMatch(/price|pricing/i);
    expect(whyImperium.ar.items[0]!.paragraphs[1]).toMatch(/تنافسي/);
  });
});

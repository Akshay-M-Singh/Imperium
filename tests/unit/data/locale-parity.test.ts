import { describe, expect, it } from "vitest";
import { navigation } from "@/data/navigation";
import { contact } from "@/data/contact";
import { founder } from "@/data/founder";
import { whyImperium } from "@/data/pillars";
import { stats } from "@/data/stats";
import { seo } from "@/data/seo";
import { collections, collectionsSection } from "@/data/collections";
import { ui } from "@/data/ui";

/** Replace every leaf value with its type name so EN/AR structures can be
 *  compared while their string contents differ. */
function shapeOf(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shapeOf);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, shapeOf(v)]),
    );
  }
  return typeof value;
}

describe("EN/AR data parity", () => {
  const pairs: [string, { en: unknown; ar: unknown }][] = [
    ["navigation", navigation],
    ["contact", contact],
    ["founder", founder],
    ["whyImperium", whyImperium],
    ["stats", stats],
    ["seo", seo],
    ["collections", collections],
    ["collectionsSection", collectionsSection],
    ["ui", ui],
  ];

  for (const [name, data] of pairs) {
    it(`${name}: ar mirrors en's structure exactly`, () => {
      expect(shapeOf(data.ar)).toEqual(shapeOf(data.en));
    });
  }
});

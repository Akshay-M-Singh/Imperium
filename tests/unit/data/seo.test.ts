import { describe, it, expect } from "vitest";
import { seo } from "@/data/seo";

describe("seo data", () => {
  it("has EN canonicals rooted at /", () => {
    expect(seo.en.home.canonical).toBe("/");
    expect(seo.en.about.canonical).toBe("/about");
    expect(seo.en.contact.canonical).toBe("/contact");
  });

  it("has AR canonicals rooted at /ar", () => {
    expect(seo.ar.home.canonical).toBe("/ar");
    expect(seo.ar.about.canonical).toBe("/ar/about");
    expect(seo.ar.contact.canonical).toBe("/ar/contact");
  });

  it("contains no stray year reference in either locale", () => {
    expect(JSON.stringify(seo.en)).not.toMatch(/2026/);
    expect(JSON.stringify(seo.ar)).not.toMatch(/2026/);
  });

  it("has non-empty AR strings for home title/description that differ from EN", () => {
    expect(seo.ar.home.title.length).toBeGreaterThan(0);
    expect(seo.ar.home.description.length).toBeGreaterThan(0);
    expect(seo.ar.home.title).not.toBe(seo.en.home.title);
    expect(seo.ar.home.description).not.toBe(seo.en.home.description);
  });

  it("carries matching page keys across both locales", () => {
    expect(Object.keys(seo.ar).sort()).toEqual(Object.keys(seo.en).sort());
  });
});

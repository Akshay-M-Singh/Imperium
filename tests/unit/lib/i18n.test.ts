import { describe, expect, it } from "vitest";
import { LOCALES, DEFAULT_LOCALE, isLocale, dirFor, switchLocalePath } from "@/lib/i18n";

describe("i18n primitives", () => {
  it("declares exactly en and ar, defaulting to en", () => {
    expect(LOCALES).toEqual(["en", "ar"]);
    expect(DEFAULT_LOCALE).toBe("en");
  });

  it("narrows locale strings", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("ar")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("")).toBe(false);
  });

  it("maps locale to text direction", () => {
    expect(dirFor("en")).toBe("ltr");
    expect(dirFor("ar")).toBe("rtl");
  });
});

describe("switchLocalePath", () => {
  it("adds the /ar prefix", () => {
    expect(switchLocalePath("/", "ar")).toBe("/ar");
    expect(switchLocalePath("/privacy", "ar")).toBe("/ar/privacy");
  });

  it("removes the /ar prefix", () => {
    expect(switchLocalePath("/ar", "en")).toBe("/");
    expect(switchLocalePath("/ar/privacy", "en")).toBe("/privacy");
  });

  it("is idempotent for the current locale", () => {
    expect(switchLocalePath("/ar", "ar")).toBe("/ar");
    expect(switchLocalePath("/privacy", "en")).toBe("/privacy");
  });

  it("does not mangle paths that merely start with 'ar'", () => {
    expect(switchLocalePath("/articles", "ar")).toBe("/ar/articles");
  });
});

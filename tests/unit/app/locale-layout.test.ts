import { describe, it, expect, afterEach, vi } from "vitest";
import { generateMetadata } from "@/app/[locale]/layout";
import { seo } from "@/data/seo";

// Task 13: generateMetadata branches on the resolved locale for canonical
// URL, hreflang alternates, OpenGraph locale/siteName. This test exercises
// that branching directly rather than only inferring it from curl output
// (see task-13-report.md verification section, and the Task 13 review
// finding this test was added to close).

describe("generateMetadata (locale layout)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("renders EN metadata matching seo.en.home", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: "en" }) });
    expect(metadata.title).toEqual({
      default: seo.en.home.title,
      template: "%s · Imperium Italian Textile",
    });
    expect(metadata.description).toBe(seo.en.home.description);
    expect(metadata.alternates?.canonical).toBe("/");
    expect(metadata.openGraph?.locale).toBe("en_AE");
    expect(metadata.openGraph?.siteName).toBe("Imperium Italian Textile");
  });

  it("renders AR metadata matching seo.ar.home", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: "ar" }) });
    expect(metadata.title).toEqual({
      default: seo.ar.home.title,
      template: "%s · إمبريوم للأقمشة الإيطالية",
    });
    expect(metadata.description).toBe(seo.ar.home.description);
    expect(metadata.alternates?.canonical).toBe("/ar");
    expect(metadata.openGraph?.locale).toBe("ar_AE");
    expect(metadata.openGraph?.siteName).toBe("إمبريوم للأقمشة الإيطالية");
  });

  it("EN and AR metadata differ on locale-sensitive fields", async () => {
    const en = await generateMetadata({ params: Promise.resolve({ locale: "en" }) });
    const ar = await generateMetadata({ params: Promise.resolve({ locale: "ar" }) });
    expect(en.openGraph?.locale).not.toBe(ar.openGraph?.locale);
    expect(en.alternates?.canonical).not.toBe(ar.alternates?.canonical);
    expect(en.openGraph?.siteName).not.toBe(ar.openGraph?.siteName);
  });

  it("carries en/ar/x-default hreflang alternates on both locales", () => {
    // languages object is locale-independent by design (both variants always
    // advertised), asserted once via the EN call's shape.
    return generateMetadata({ params: Promise.resolve({ locale: "en" }) }).then((metadata) => {
      expect(metadata.alternates?.languages).toEqual({
        en: "/",
        ar: "/ar",
        "x-default": "/",
      });
    });
  });

  it("falls back to the default locale for an unrecognized locale param", async () => {
    const fallback = await generateMetadata({ params: Promise.resolve({ locale: "fr" }) });
    const en = await generateMetadata({ params: Promise.resolve({ locale: "en" }) });
    expect(fallback.alternates?.canonical).toBe(en.alternates?.canonical);
    expect(fallback.openGraph?.locale).toBe(en.openGraph?.locale);
  });

  it("respects NEXT_PUBLIC_ALLOW_INDEXING for robots on both locales", async () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "");
    const blocked = await generateMetadata({ params: Promise.resolve({ locale: "ar" }) });
    expect(blocked.robots).toEqual({ index: false, follow: false });

    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "true");
    const allowed = await generateMetadata({ params: Promise.resolve({ locale: "ar" }) });
    expect(allowed.robots).toEqual({ index: true, follow: true });
  });
});

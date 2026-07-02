import { describe, it, expect, afterEach, vi } from "vitest";
import robots from "@/app/robots";

// PRD F-5: the scaffold must not be indexable until launch. Indexing is an
// explicit opt-in via NEXT_PUBLIC_ALLOW_INDEXING="true" (set in Vercel at
// launch, Phase 6.B) — never a side effect of environment.

describe("robots", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("disallows all crawling by default (switch unset)", () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "");
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });

  it("disallows when the switch holds anything but the literal 'true'", () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "1");
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });

  it("allows crawling and advertises the sitemap only when explicitly enabled", () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "true");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://imperiumitaliantextile.com");
    const result = robots();
    expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(result.sitemap).toBe("https://imperiumitaliantextile.com/sitemap.xml");
  });
});

import { describe, it, expect } from "vitest";
import { cn, waLink } from "@/lib/utils";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("skips falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("returns empty string for all falsy", () => {
    expect(cn(false, null, undefined)).toBe("");
  });
});

describe("waLink", () => {
  it("builds a wa.me link from a clean number", () => {
    expect(waLink("971500000000")).toBe("https://wa.me/971500000000");
  });

  it("strips non-digits from the number", () => {
    expect(waLink("+971 500 000 000")).toBe("https://wa.me/971500000000");
  });

  it("appends an encoded message when provided", () => {
    const link = waLink("971500000000", "Hello Imperium");
    expect(link).toBe("https://wa.me/971500000000?text=Hello%20Imperium");
  });
});

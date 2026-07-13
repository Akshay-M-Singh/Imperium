import { describe, it, expect } from "vitest";
import { SITE } from "@/lib/site";

describe("SITE brand configuration", () => {
  it("carries the Gulf tagline", () => {
    expect(SITE.tagline).toBe("Premium Italian fabrics · Delivered to the Gulf");
  });

  it("has no establishment-year field and no year anywhere", () => {
    expect(SITE).not.toHaveProperty("established");
    expect(JSON.stringify(SITE)).not.toMatch(/2026/);
  });

  it("declares the hero logo slot (path string or null)", () => {
    expect(SITE.logoSrc === null || typeof SITE.logoSrc === "string").toBe(true);
  });
});

describe("SITE.whatsapp", () => {
  it("is the confirmed WhatsApp Business number", () => {
    // Client-confirmed 2026-07-14. If this changes, update .env.example
    // and the Vercel env var NEXT_PUBLIC_WHATSAPP_NUMBER too.
    expect(SITE.whatsapp).toBe("971544844082");
  });

  it("is digits-only so raw wa.me interpolation stays valid", () => {
    // Navigation.tsx and Footer.tsx build `https://wa.me/${SITE.whatsapp}`
    // without waLink()'s sanitising — the stored value must be clean.
    expect(SITE.whatsapp).toMatch(/^\d{10,15}$/);
  });
});

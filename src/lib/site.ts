// Site — brand configuration. The single source of truth for things that
// would otherwise be magic strings scattered across components.
// No establishment year anywhere on the site, by client decision.

export const SITE = {
  name: "Imperium Italian Textile",
  shortName: "Imperium",
  tagline: "Premium Italian fabrics · Delivered to the Gulf",
  // Hero wordmark logo, derived from the client source by
  // scripts/derive-brand-assets.mjs; null falls back to the typographic
  // wordmark.
  logoSrc: "/images/logo/imperium-wordmark.png" as string | null,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://imperiumitaliantextile.com",
  email: "hello@imperiumitaliantextile.com",
  // Placeholder until Sofia's WhatsApp Business number is confirmed (Phase 4.17).
  // Replaced during the Phase 4 fine-tune pass. wa.me links work with this format.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "971500000000",
  instagram: "https://instagram.com/imperiumitaliantextile",
  instagramHandle: "@imperiumitaliantextile",
  location: "Dubai, UAE · Italy",
  locale: "en_AE" as const,
  locales: ["en", "ar"] as const,
} as const;

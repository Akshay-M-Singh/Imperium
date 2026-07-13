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
  // Official lead inbox (client-confirmed 2026-07-14). Interim Gmail until
  // the brand domain is registered and hello@ is provisioned (PRD D-07).
  email: "imperium.italian.textile@gmail.com",
  // Client-confirmed WhatsApp Business number (2026-07-14), digits-only
  // wa.me format. Env var overrides for per-environment testing.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "971544844082",
  instagram: "https://instagram.com/imperiumitaliantextile",
  instagramHandle: "@imperiumitaliantextile",
  location: "Dubai, UAE · Italy",
  locale: "en_AE" as const,
  locales: ["en", "ar"] as const,
} as const;

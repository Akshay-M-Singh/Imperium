// Site — brand configuration. The single source of truth for things that
// would otherwise be magic strings scattered across components.

export const SITE = {
  name: "Imperium Italian Textile",
  shortName: "Imperium",
  tagline: "Premium Italian fabrics · Delivered to Dubai",
  established: 2026,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://imperiumitaliantextile.com",
  email: "hello@imperiumitaliantextile.com",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  instagram: "https://instagram.com/imperiumitaliantextile",
  instagramHandle: "@imperiumitaliantextile",
  location: "Dubai, UAE · Italy",
  locale: "en_AE" as const,
  locales: ["en", "ar"] as const,
} as const;

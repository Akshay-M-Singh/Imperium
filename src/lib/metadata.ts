// Metadata — SEO metadata generator + JSON-LD structured data
// (Architecture §7, Roadmap Phase 6.5). Implementation deferred.

import type { Metadata } from "next";

export type PageKey = "home" | "about" | "contact";

export function generatePageMetadata(_page: PageKey): Metadata {
  return {};
}

export function organizationJsonLd() {
  // TODO(Phase 6.5): JSON-LD Organization blob per Architecture §7.5.
  return {};
}

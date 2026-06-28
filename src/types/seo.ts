// SEO types (Architecture §7.2).

import type { PageKey } from "@/lib/metadata";

export interface SeoPageEntry {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
}

export type SeoData = Record<PageKey, SeoPageEntry>;

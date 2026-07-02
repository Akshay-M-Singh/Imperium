import type { MetadataRoute } from "next";

// Indexing is an explicit launch decision (PRD F-5, launch checklist §12).
// Default: NOT indexable. Set NEXT_PUBLIC_ALLOW_INDEXING="true" in the
// production environment only when the real domain is live (Phase 6.B).
export function isIndexingAllowed(): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://imperiumitaliantextile.com";

  if (!isIndexingAllowed()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

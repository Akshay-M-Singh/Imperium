import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://imperiumitaliantextile.com";

  return [
    {
      url: `${baseUrl}/`,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: { en: `${baseUrl}/`, ar: `${baseUrl}/ar` },
      },
    },
    {
      url: `${baseUrl}/ar`,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: { en: `${baseUrl}/`, ar: `${baseUrl}/ar` },
      },
    },
  ];
}

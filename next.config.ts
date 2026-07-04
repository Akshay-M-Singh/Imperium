import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    const securityHeaders = [
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "img-src 'self' data: blob:",
          // Next.js dev mode (React Fast Refresh) requires 'unsafe-eval'.
          // Production builds do not, so we keep the stricter policy there.
          `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://plausible.io`,
          // Resend is called server-side only — the browser must never reach it (PRD §9).
          `connect-src 'self' https://plausible.io`,
          "style-src 'self' 'unsafe-inline'",
          "font-src 'self' data:",
          "media-src 'self'",
          "object-src 'none'",
          "base-uri 'self'",
          "frame-ancestors 'self'",
          "form-action 'self'",
        ].join("; "),
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

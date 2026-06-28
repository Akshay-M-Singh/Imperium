import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// NOTE: Font wiring is a placeholder. Phase 1 task 1.8 replaces this with
// self-hosted Cormorant Garamond + DM Sans via <link> preload in <head>,
// per Architecture §5. The local font files live in /public/fonts/.
const inter = Inter({ subsets: ["latin"], variable: "--font-placeholder" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://imperiumitaliantextile.com"),
  title: {
    default: "Imperium Italian Textile — Premium Italian Fabrics, Delivered to Dubai",
    template: "%s · Imperium Italian Textile",
  },
  description:
    "Premium Italian fabrics sourced directly from Italy's finest mills and delivered to Dubai's most discerning tailors and hospitality groups.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Imperium Italian Textile",
    description:
      "Premium Italian fabrics sourced directly from Italy's finest mills and delivered to Dubai's most discerning tailors and hospitality groups.",
    type: "website",
    locale: "en_AE",
    siteName: "Imperium Italian Textile",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}

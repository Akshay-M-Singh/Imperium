import type { Metadata, Viewport } from "next";
import "./globals.css";
import { isIndexingAllowed } from "@/app/robots";
import { Footer } from "@/components/layout";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

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
    index: isIndexingAllowed(),
    follow: isIndexingAllowed(),
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* React 19 hoists these to <head>. Preload only the two dominant
            text faces (Architecture §6.6); the rest load on demand. */}
        <link
          rel="preload"
          href="/fonts/CormorantGaramond-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/DMSans-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {children}
        <Footer />
        <WhatsAppButton fixedMobile />
      </body>
    </html>
  );
}

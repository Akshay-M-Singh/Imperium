import type { Metadata, Viewport } from "next";
import "../globals.css";
import { isIndexingAllowed } from "@/app/robots";
import { Footer } from "@/components/layout";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { LOCALES, DEFAULT_LOCALE, dirFor, isLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://imperiumitaliantextile.com"),
  title: {
    default: "Imperium Italian Textile — Premium Italian Fabrics, Delivered to the Gulf",
    template: "%s · Imperium Italian Textile",
  },
  description:
    "Premium Italian fabrics sourced from Italy's finest mills and delivered to the Gulf's most discerning tailors, designers and hospitality groups.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Imperium Italian Textile",
    description:
      "Premium Italian fabrics sourced from Italy's finest mills and delivered to the Gulf's most discerning tailors, designers and hospitality groups.",
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

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  return (
    <html lang={locale} dir={dirFor(locale)}>
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

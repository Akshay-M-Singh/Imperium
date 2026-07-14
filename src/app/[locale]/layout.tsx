import type { Metadata, Viewport } from "next";
import "../globals.css";
import { isIndexingAllowed } from "@/app/robots";
import { Footer } from "@/components/layout";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { seo } from "@/data/seo";
import { LOCALES, DEFAULT_LOCALE, dirFor, isLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const s = seo[locale].home;
  const siteName = locale === "ar" ? "إمبريوم للأقمشة الإيطالية" : "Imperium Italian Textile";
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://imperiumitaliantextile.com"),
    title: { default: s.title, template: `%s · ${siteName}` },
    description: s.description,
    alternates: {
      canonical: locale === "ar" ? "/ar" : "/",
      languages: { en: "/", ar: "/ar", "x-default": "/" },
    },
    openGraph: {
      title: s.ogTitle ?? s.title,
      description: s.ogDescription ?? s.description,
      type: "website",
      locale: locale === "ar" ? "ar_AE" : "en_AE",
      siteName,
    },
    twitter: { card: "summary_large_image" },
    robots: { index: isIndexingAllowed(), follow: isIndexingAllowed() },
  };
}

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
        {locale === "ar" && (
          <>
            <link
              rel="preload"
              href="/fonts/Amiri-Regular.woff2"
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            />
            <link
              rel="preload"
              href="/fonts/IBMPlexSansArabic-Regular.woff2"
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            />
          </>
        )}
        {children}
        <Footer locale={locale} />
        <WhatsAppButton fixedMobile locale={locale} />
      </body>
    </html>
  );
}

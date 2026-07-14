import { Navigation } from "@/components/layout";
import {
  Hero,
  StatsStrip,
  Collections,
  WhyImperium,
  Founder,
  Testimonials,
  Contact,
} from "@/components/sections";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  // Narrative order (client flow): open on the brand, prove scale, show
  // the offering, argue trust, meet the founder, convert. Testimonials
  // renders null until real quotes exist (PRD D-10); the origin map was
  // superseded by the WhyImperium route-map row.
  return (
    <>
      <Navigation locale={locale} />
      <main id="main">
        <Hero locale={locale} />
        <StatsStrip locale={locale} />
        <Collections locale={locale} />
        <WhyImperium locale={locale} />
        <Founder locale={locale} />
        <Testimonials />
        <Contact locale={locale} />
      </main>
    </>
  );
}

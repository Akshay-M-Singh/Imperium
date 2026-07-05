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

export default function HomePage() {
  // Narrative order (client flow): open on the brand, prove scale, show
  // the offering, argue trust, meet the founder, convert. Testimonials
  // renders null until real quotes exist (PRD D-10); the origin map was
  // superseded by the WhyImperium route-map row.
  return (
    <>
      <Navigation />
      <main id="main">
        <Hero />
        <StatsStrip />
        <Collections />
        <WhyImperium />
        <Founder />
        <Testimonials />
        <Contact />
      </main>
    </>
  );
}

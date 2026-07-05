import { Navigation } from "@/components/layout";
import {
  Hero,
  OriginMap,
  StatsStrip,
  Collections,
  TrustPillars,
  Founder,
  Testimonials,
  Contact,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main id="main">
        <Hero />
        <OriginMap />
        <StatsStrip />
        <Collections />
        <TrustPillars />
        <Founder />
        <Testimonials />
        <Contact />
      </main>
    </>
  );
}

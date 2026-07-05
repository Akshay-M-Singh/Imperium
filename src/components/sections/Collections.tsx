// Collections — four collection cards / Embla carousel on all viewports
// (DESIGN.md §9.04, MOTION_SPEC.md §3.5, Roadmap Phase 5.5 / 5.8).

import dynamic from "next/dynamic";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FabricCard } from "@/components/ui/FabricCard";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { collections } from "@/data/collections";
import { CarouselSlide } from "@/components/motion/Carousel/CarouselSlide";
import styles from "./Collections.module.css";

// Lazy-load the Embla wrapper (the heavier dependency) without disabling SSR.
// CarouselSlide stays static so it can render immediately during tests.
const EmblaContainer = dynamic(() => import("@/components/motion/Carousel/EmblaContainer"));

export function Collections() {
  return (
    <ScrollReveal amount={0.2}>
      <Section id="collections" ariaLabelledby="collections-heading" background="pietra">
        <div className={styles.header}>
          <SectionHeader
            eyebrow="Our collections"
            headline="Fabric with a story."
            subline="Four curated collections — each one a different way of working with Italian craft."
            id="collections-heading"
          />
        </div>
        <EmblaContainer>
          {collections.map((collection, index) => (
            <CarouselSlide key={collection.id} index={index}>
              <FabricCard collection={collection} />
            </CarouselSlide>
          ))}
        </EmblaContainer>
      </Section>
    </ScrollReveal>
  );
}

export default Collections;

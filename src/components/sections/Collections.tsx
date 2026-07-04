// Collections — three collection cards / desktop grid, mobile scroll-snap
// (DESIGN.md §9.04, Roadmap Phase 3.5 / Phase 5.8).

import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FabricCard } from "@/components/ui/FabricCard";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { collections } from "@/data/collections";
import styles from "./Collections.module.css";

export function Collections() {
  return (
    <ScrollReveal amount={0.2}>
      <Section id="collections" ariaLabelledby="collections-heading" background="pietra">
        <div className={styles.header}>
          <SectionHeader
            eyebrow="Our collections"
            headline="Fabric with a story."
            subline="Three curated collections — each one a different way of working with Italian craft."
            id="collections-heading"
          />
        </div>
        <ul className={styles.grid}>
          {collections.map((collection) => (
            <li key={collection.id} className={styles.item}>
              <FabricCard collection={collection} />
            </li>
          ))}
        </ul>
      </Section>
    </ScrollReveal>
  );
}

export default Collections;

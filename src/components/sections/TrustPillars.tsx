// TrustPillars — numbered manifesto band on Gesso
// (DESIGN.md §9.05, Roadmap Phase 4.1).

import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { pillars } from "@/data/pillars";
import styles from "./TrustPillars.module.css";

export function TrustPillars() {
  return (
    <ScrollReveal amount={0.2}>
      <Section background="gesso" ariaLabelledby="pillars-heading">
        <SectionHeader
          eyebrow="Why Imperium"
          headline="Not just fabric. A guarantee of origin."
          id="pillars-heading"
        />
        <div className={styles.grid} role="list">
          {pillars.map((pillar) => (
            <article key={pillar.number} className={styles.pillar} role="listitem">
              <span className={styles.number}>{pillar.number}</span>
              <h3 className={styles.label}>{pillar.label}</h3>
              <p className={styles.body}>{pillar.body}</p>
            </article>
          ))}
        </div>
      </Section>
    </ScrollReveal>
  );
}

export default TrustPillars;

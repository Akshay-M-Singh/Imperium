"use client";

// StatsStrip — horizontal stat band bridging OriginMap and Collections
// (DESIGN.md §9.03 elevation, Roadmap Phase 3.3).

import { useRef } from "react";
import { useInView } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { StatBlock } from "@/components/ui/StatBlock";
import styles from "./StatsStrip.module.css";

const stats = [
  { value: 12, suffix: "+", label: "Italian mills" },
  { value: 120, suffix: "+", label: "Fabrics in library" },
  { value: 15, suffix: "", label: "Years of expertise" },
  { value: 4, suffix: "", label: "Cities served" },
];

export function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Section id="stats" background="gesso" dense>
      <ScrollReveal amount={0.3}>
        <div ref={ref} className={styles.grid} role="list">
          {stats.map((stat) => (
            <div key={stat.label} className={styles.cell} role="listitem">
              <StatBlock
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                inView={inView}
              />
            </div>
          ))}
        </div>
      </ScrollReveal>
    </Section>
  );
}

export default StatsStrip;

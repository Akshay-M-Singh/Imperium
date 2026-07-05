// WhyImperium — three numbered principles as alternating editorial rows
// (client direction; replaces the DESIGN.md §9.05 four-in-a-row manifesto
// and absorbs §9.03's provenance story). Rows with media split 5/7 and
// alternate sides; the text-only closing row sits right to continue the
// rhythm. Placeholder containers reserve space for the Italy→Gulf route
// map and the Made in Italy stamp artwork (NOT the certification image —
// that container lives in the Founder section).

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { whyImperium, type WhyImperiumItem } from "@/data/pillars";
import styles from "./WhyImperium.module.css";

function MediaSlot({ media }: { media: WhyImperiumItem["media"] }): ReactNode {
  if (media === "map") {
    return (
      <figure className={styles.mapPlaceholder} data-testid="map-placeholder">
        <span className={styles.mapPoint}>Italy</span>
        <span className={styles.mapArrow} aria-hidden="true">
          ↓
        </span>
        <span className={styles.mapPoint}>UAE + the Gulf</span>
        <figcaption className={styles.placeholderCaption}>
          Route illustration in production
        </figcaption>
      </figure>
    );
  }
  if (media === "stamp") {
    return (
      <figure className={styles.stampSlot} data-testid="stamp-placeholder">
        <span className={styles.stampCircle}>Made in Italy</span>
        <figcaption className={styles.placeholderCaption}>
          Official stamp artwork to follow
        </figcaption>
      </figure>
    );
  }
  return null;
}

export function WhyImperium() {
  return (
    <ScrollReveal amount={0.15}>
      <Section id="why-imperium" background="gesso" ariaLabelledby="why-imperium-heading">
        <SectionHeader
          id="why-imperium-heading"
          eyebrow={whyImperium.eyebrow}
          headline={whyImperium.headline}
        />
        <div className={styles.rows}>
          {whyImperium.items.map((item, index) => (
            <div
              key={item.number}
              data-row={item.number}
              className={cn(
                styles.row,
                index % 2 === 1 && styles.reversed,
                !item.media && styles.textOnly,
              )}
            >
              <div className={styles.text}>
                <span className={styles.number}>{item.number}</span>
                <h3 className={styles.heading}>{item.heading}</h3>
                {item.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className={styles.body}>
                    {paragraph}
                  </p>
                ))}
              </div>
              {item.media ? (
                <div className={styles.media}>
                  <MediaSlot media={item.media} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Section>
    </ScrollReveal>
  );
}

export default WhyImperium;

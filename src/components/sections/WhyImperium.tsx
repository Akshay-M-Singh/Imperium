// WhyImperium — three numbered principles as alternating editorial rows
// (client direction; replaces the DESIGN.md §9.05 four-in-a-row manifesto
// and absorbs §9.03's provenance story). Rows with media split 5/7 and
// alternate sides; the text-only closing row sits right to continue the
// rhythm. Media slots carry the client's Italy→Gulf route artwork and the
// Made in Italy stamp (NOT the certification scan — that lives in the
// Founder section).

import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { whyImperium, type WhyImperiumItem } from "@/data/pillars";
import styles from "./WhyImperium.module.css";

function MediaSlot({ media }: { media: WhyImperiumItem["media"] }): ReactNode {
  if (media === "map") {
    return (
      <figure className={styles.mapFigure} data-testid="map-media">
        <Image
          src="/images/map/italy-gulf-routes.png"
          alt="Illustrated route map from Italy to the UAE and the Gulf"
          width={1536}
          height={1024}
          loading="lazy"
          className={styles.mapImage}
        />
      </figure>
    );
  }
  if (media === "stamp") {
    return (
      <figure className={styles.stampSlot} data-testid="stamp-media">
        <Image
          src="/images/stamp/made-in-italy-stamp.png"
          alt="100% Made in Italy certification stamp"
          width={462}
          height={432}
          loading="lazy"
          className={styles.stampImage}
        />
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

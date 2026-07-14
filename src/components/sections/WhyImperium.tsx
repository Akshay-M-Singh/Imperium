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
import type { Locale } from "@/lib/i18n";
import styles from "./WhyImperium.module.css";

function MediaSlot({
  media,
  mapAlt,
  stampAlt,
}: {
  media: WhyImperiumItem["media"];
  mapAlt: string;
  stampAlt: string;
}): ReactNode {
  if (media === "map") {
    return (
      <figure className={styles.mapFigure} data-testid="map-media">
        <Image
          src="/images/map/italy-gulf-routes.png"
          alt={mapAlt}
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
          alt={stampAlt}
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

export function WhyImperium({ locale = "en" }: { locale?: Locale }) {
  return (
    <ScrollReveal amount={0.15}>
      <Section id="why-imperium" background="gesso" ariaLabelledby="why-imperium-heading">
        <SectionHeader
          id="why-imperium-heading"
          eyebrow={whyImperium[locale].eyebrow}
          headline={whyImperium[locale].headline}
        />
        <div className={styles.rows}>
          {whyImperium[locale].items.map((item, index) => (
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
                  <MediaSlot
                    media={item.media}
                    mapAlt={whyImperium[locale].mapAlt}
                    stampAlt={whyImperium[locale].stampAlt}
                  />
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

// Founder — asymmetric 5/7 portrait + bio + pull quote + certification
// (DESIGN.md §9.06, Roadmap Phase 4.2).

import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PullQuote } from "@/components/ui/PullQuote";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { founder } from "@/data/founder";
import type { Locale } from "@/lib/i18n";
import styles from "./Founder.module.css";

export function Founder({ locale = "en" }: { locale?: Locale }) {
  const copy = founder[locale];

  return (
    <ScrollReveal amount={0.25}>
      <Section id="founder" ariaLabelledby="founder-heading">
        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.imageWrap}>
              <Image
                src={copy.portrait.src}
                alt={copy.portrait.alt}
                width={600}
                height={800}
                loading="lazy"
                className={styles.image}
              />
            </div>
            <p className={styles.caption}>{copy.portrait.caption}</p>
          </div>

          <div className={styles.right}>
            <SectionHeader eyebrow={copy.eyebrow} headline={copy.headline} id="founder-heading" />

            <div className={styles.bio}>
              {copy.bioParagraphs.map((paragraph, index) => (
                <p key={index} className={styles.bioParagraph}>
                  {paragraph}
                </p>
              ))}
            </div>

            <PullQuote quote={copy.quote} attribution={copy.quoteAttribution} />

            <div className={styles.certification}>
              {copy.certification.src ? (
                <>
                  <div className={styles.certImageWrap}>
                    <Image
                      src={copy.certification.src}
                      alt={copy.certification.caption}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 340px, 80vw"
                      className={styles.certImage}
                    />
                  </div>
                  <p className={styles.certCaption}>{copy.certification.caption}</p>
                </>
              ) : (
                <>
                  <div className={styles.certPlaceholder} data-testid="certification-placeholder">
                    <span className={styles.certPlaceholderLabel}>
                      {copy.certificationPlaceholderLabel}
                    </span>
                  </div>
                  <p className={styles.certCaption}>{copy.certification.caption}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </Section>
    </ScrollReveal>
  );
}

export default Founder;

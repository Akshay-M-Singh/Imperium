// Founder — asymmetric 5/7 portrait + bio + pull quote + certification
// (DESIGN.md §9.06, Roadmap Phase 4.2).

import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PullQuote } from "@/components/ui/PullQuote";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { founder } from "@/data/founder";
import styles from "./Founder.module.css";

export function Founder() {
  return (
    <ScrollReveal amount={0.25}>
      <Section id="founder" ariaLabelledby="founder-heading">
        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.imageWrap}>
              <Image
                src={founder.portrait.src}
                alt={founder.portrait.alt}
                width={600}
                height={800}
                loading="lazy"
                className={styles.image}
              />
            </div>
            <p className={styles.caption}>{founder.portrait.caption}</p>
          </div>

          <div className={styles.right}>
            <SectionHeader
              eyebrow={founder.eyebrow}
              headline={founder.headline}
              id="founder-heading"
            />

            <div className={styles.bio}>
              {founder.bioParagraphs.map((paragraph, index) => (
                <p key={index} className={styles.bioParagraph}>
                  {paragraph}
                </p>
              ))}
            </div>

            <PullQuote quote={founder.quote} attribution={founder.quoteAttribution} />

            <div className={styles.certification}>
              {founder.certification.src ? (
                <>
                  <div className={styles.certImageWrap}>
                    <Image
                      src={founder.certification.src}
                      alt={founder.certification.caption}
                      fill
                      loading="lazy"
                      className={styles.certImage}
                    />
                  </div>
                  <p className={styles.certCaption}>{founder.certification.caption}</p>
                </>
              ) : (
                <>
                  <div className={styles.certPlaceholder} data-testid="certification-placeholder">
                    <span className={styles.certPlaceholderLabel}>Image to follow</span>
                  </div>
                  <p className={styles.certCaption}>{founder.certification.caption}</p>
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

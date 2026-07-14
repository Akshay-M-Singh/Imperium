// Hero — full-viewport brand opening (DESIGN.md §9.02, amended by client
// direction: the wordmark logo leads inside the h1, with the brand
// tagline directly beneath). Background: interactive silk fabric WebGL
// layer (2026-07-15, replacing the static hero photograph — spec
// docs/superpowers/specs/2026-07-14-silk-hero-interactive-background-design.md;
// the old procedural Silk WebGL module is kept in src/components/silk/,
// recoverable). The hero is fully static once the entrance cascade
// completes; the backdrop's own cursor-driven deformation is separate
// from that cascade.

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Arrow } from "@/components/ui/Arrow";
import { SilkFabricBackground } from "@/components/silk/fabric/SilkFabricBackground";
import { SITE } from "@/lib/site";
import { ui } from "@/data/ui";
import type { Locale } from "@/lib/i18n";
import styles from "./Hero.module.css";

export function Hero({ locale = "en" }: { locale?: Locale }) {
  const t = ui[locale].hero;

  return (
    <section className={styles.section} aria-labelledby="hero-heading">
      <div className={styles.backdrop} aria-hidden="true">
        <SilkFabricBackground />
      </div>

      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.dissolve} aria-hidden="true" />

      <div className={styles.content}>
        <span className={styles.eyebrow}>{t.eyebrow}</span>

        <h1 id="hero-heading" className={styles.logo}>
          {SITE.logoSrc ? (
            <Image
              src={SITE.logoSrc}
              alt={SITE.name}
              width={756}
              height={143}
              priority
              className={styles.logoImage}
            />
          ) : (
            <span className={styles.wordmark}>
              <span className={styles.wordmarkPrimary}>Imperium</span>
              <span className={styles.wordmarkSecondary}>Italian Textile</span>
            </span>
          )}
        </h1>

        <p className={styles.tagline}>{t.tagline}</p>

        <div className={styles.ctaGroup}>
          <MagneticButton>
            <Button variant="ghost-light" href="#collections">
              {t.ctaPrimary}
            </Button>
          </MagneticButton>
          <a href="#contact" className={styles.textLink}>
            {t.ctaSecondary} <Arrow />
          </a>
        </div>
      </div>

      <div className={styles.scrollIndicator} aria-hidden="true">
        <span className={styles.scrollLine} />
      </div>
    </section>
  );
}

export default Hero;

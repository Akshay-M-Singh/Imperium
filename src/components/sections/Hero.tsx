// Hero — full-viewport brand opening (DESIGN.md §9.02, amended by client
// direction: the wordmark logo leads inside the h1, with the brand
// tagline directly beneath). Background: client-supplied hero photograph
// (2026-07-14, replacing the silk-shader still; the Silk WebGL module is
// kept in src/components/silk/, recoverable). The hero is fully static
// once the entrance cascade completes.

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Arrow } from "@/components/ui/Arrow";
import { SITE } from "@/lib/site";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.section} aria-labelledby="hero-heading">
      <div className={styles.backdrop} aria-hidden="true">
        <Image
          src="/images/hero/hero.jpg"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className={styles.backdropImage}
        />
      </div>

      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.dissolve} aria-hidden="true" />

      <div className={styles.content}>
        <span className={styles.eyebrow}>Made in Italy</span>

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

        <p className={styles.tagline}>{SITE.tagline}</p>

        <div className={styles.ctaGroup}>
          <MagneticButton>
            <Button variant="ghost-light" href="#collections">
              Explore our fabrics
            </Button>
          </MagneticButton>
          <a href="#contact" className={styles.textLink}>
            Request a sample <Arrow />
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

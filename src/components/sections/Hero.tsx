import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { IridescentSilkHero } from "@/components/silk/IridescentSilkHero";
import { SITE } from "@/lib/site";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.section} aria-labelledby="hero-heading">
      <IridescentSilkHero />
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
            Request a sample →
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

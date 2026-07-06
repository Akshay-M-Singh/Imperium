"use client";

// Hero — full-viewport brand opening (DESIGN.md §9.02, amended by client
// direction: the wordmark logo leads inside the h1, with the brand
// tagline directly beneath). Video/poster lazy-load logic unchanged.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SITE } from "@/lib/site";
import styles from "./Hero.module.css";

const DESKTOP_POSTER = "/images/hero/hero-desktop.svg";
const MOBILE_POSTER = "/images/hero/hero-mobile.svg";
const DESKTOP_VIDEO = "/video/hero-desktop.mp4";
const MOBILE_VIDEO = "/video/hero-mobile.mp4";

function isSlowConnection(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (
    navigator as unknown as { connection?: { effectiveType?: string; saveData?: boolean } }
  ).connection;
  if (!conn) return false;
  return conn.effectiveType === "2g" || conn.effectiveType === "slow-2g" || Boolean(conn.saveData);
}

export function Hero() {
  const { ref: visibilityRef, isVisible } = useIntersectionObserver({
    threshold: 0.05,
    once: true,
  });
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reducedMotion = useReducedMotion();
  const [slow] = useState(isSlowConnection);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const poster = isDesktop ? DESKTOP_POSTER : MOBILE_POSTER;
  const videoSrc = isDesktop ? DESKTOP_VIDEO : MOBILE_VIDEO;
  const shouldLoadVideo = isVisible && !slow && !reducedMotion;

  useEffect(() => {
    if (!shouldLoadVideo) return;
    const el = videoRef.current;
    if (!el) return;
    const promise = el.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(() => {});
    }
  }, [shouldLoadVideo]);

  return (
    <section
      ref={visibilityRef}
      className={styles.section}
      aria-labelledby="hero-heading"
      style={{ backgroundColor: "#a89374" }}
    >
      <video
        ref={videoRef}
        className={styles.video}
        poster={poster}
        preload={shouldLoadVideo ? "auto" : "none"}
        muted
        loop
        playsInline
        autoPlay={shouldLoadVideo}
        aria-hidden="true"
        {...(shouldLoadVideo ? { src: videoSrc } : {})}
      />

      <div className={styles.overlay} aria-hidden="true" />

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

"use client";

// Hero — full-viewport brand opening (DESIGN.md §9.02, Roadmap Phase 2.3).

import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
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
        <span className={styles.eyebrow}>Made in Italy · Est. 2026</span>

        <h1 id="hero-heading" className={styles.headline}>
          <span>Where Italian craft</span>
          <span>meets the world.</span>
        </h1>

        <p className={styles.subline}>
          Premium Italian fabrics — sourced from the finest mills of Italy, delivered to
          Dubai&apos;s most discerning tailors and hospitality groups.
        </p>

        <div className={styles.ctaGroup}>
          <a href="#collections" className={styles.cta}>
            Explore our fabrics
          </a>
          <a href="#collections" className={styles.textLink}>
            Request a sample →
          </a>
        </div>
      </div>

      <div className={styles.scrollIndicator} aria-hidden="true">
        <span className={styles.scrollLine} />
      </div>

      <span className={styles.caption} aria-hidden="true">
        Italia · 2026
      </span>
    </section>
  );
}

export default Hero;

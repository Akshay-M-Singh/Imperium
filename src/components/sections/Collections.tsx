"use client";

// Collections — scroll-driven horizontal showcase (rebuilt 2026-07-07,
// replacing the Embla carousel). Desktop pins the viewport with position:
// sticky and maps vertical scroll progress onto horizontal track travel —
// no autoplay, no wheel hijacking, no scroll trap: native scrolling keeps
// working and the section releases the moment the last panel is reached.
// Small screens and prefers-reduced-motion get the same track as a native
// CSS scroll-snap swipe row.

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FabricCard } from "@/components/ui/FabricCard";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { collections } from "@/data/collections";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./Collections.module.css";

export function Collections() {
  const outerRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reducedMotion = useReducedMotion();
  const pinned = isDesktop && !reducedMotion;
  const [travel, setTravel] = useState(0);

  // The pin distance is the track's real overflow, re-measured on resize,
  // so the release point always matches the actual layout.
  useEffect(() => {
    if (!pinned || typeof ResizeObserver === "undefined") {
      setTravel(0);
      return;
    }
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;
    const measure = () => setTravel(Math.max(0, track.scrollWidth - viewport.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [pinned]);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  return (
    <section
      id="collections"
      ref={outerRef}
      aria-labelledby="collections-heading"
      className={styles.outer}
      style={pinned ? { blockSize: `calc(100dvh + ${travel}px)` } : undefined}
    >
      <div ref={viewportRef} className={styles.viewport}>
        <ScrollReveal amount={0.4}>
          <div className={styles.header}>
            <SectionHeader
              eyebrow="Our collections"
              headline="Fabric with a story."
              subline="Four curated collections — each one a different way of working with Italian craft."
              id="collections-heading"
            />
          </div>
        </ScrollReveal>

        <motion.div
          ref={trackRef}
          className={styles.track}
          style={pinned ? { x } : undefined}
          tabIndex={pinned ? undefined : 0}
          role="group"
          aria-label="Collection panels"
        >
          {collections.map((collection) => (
            <div key={collection.id} className={styles.panel}>
              <FabricCard collection={collection} layout="spread" />
            </div>
          ))}
        </motion.div>

        <div className={styles.progressTrack} aria-hidden="true">
          <motion.div className={styles.progressFill} style={{ scaleX: scrollYProgress }} />
        </div>
      </div>
    </section>
  );
}

export default Collections;

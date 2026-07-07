"use client";

// SilkHero — the wrapper that decides poster vs. live (design spec §2.3).
// Mounted in place of the old <video> in Hero.tsx; everything else in the
// hero (eyebrow, wordmark, tagline, CTAs, entry cascade) is untouched.
//
// Fallback gates, all of which resolve to the same static poster:
//   - no WebGL2 (getWebglCapability)
//   - prefers-reduced-motion
//   - slow connection / save-data (reused from the old video gate)
//   - NEXT_PUBLIC_SILK_HERO=off (kill switch)
//   - a WebGL context-loss event on an already-live canvas
//
// See silk/README.md for the full capability-tier explainer.

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { isSlowConnection } from "@/lib/connection";
import { getWebglCapability } from "@/lib/webgl";
import { SilkPoster } from "./SilkPoster";
import { SILK_CONFIG } from "./silk.config";
import styles from "./SilkHero.module.css";

const SilkCanvas = dynamic(() => import("./SilkCanvas").then((mod) => mod.SilkCanvas), {
  ssr: false,
});

function isKillSwitchDisabled(): boolean {
  return process.env.NEXT_PUBLIC_SILK_HERO === "off";
}

export function SilkHero() {
  const { ref: visibilityRef, isVisible } = useIntersectionObserver({
    threshold: 0.05,
    once: false,
  });
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reducedMotion = useReducedMotion();
  const [slow] = useState(isSlowConnection);
  const [documentHidden, setDocumentHidden] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  // `useReducedMotion`/`isSlowConnection` read window/navigator synchronously
  // on first render, so their values can legitimately differ between the
  // server pass and the client's first paint. Gating the live/poster branch
  // on `mounted` (always false until a post-mount effect flips it) keeps
  // that first client paint identical to the SSR output — the canvas only
  // ever appears in a later, hydration-safe re-render.
  const [mounted, setMounted] = useState(false);
  const parallaxLayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const handler = () => setDocumentHidden(document.hidden);
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  // Scroll coupling (§3.8): the silk layer translates at ~0.9x scroll — a
  // breath of parallax, not a scroll-jacking effect. Plain scroll listener
  // + direct style mutation (no React state) to stay on the zero-re-render
  // discipline the rest of the motion system follows.
  useEffect(() => {
    if (reducedMotion) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const node = visibilityRef.current;
        const layer = parallaxLayerRef.current;
        if (!node || !layer) return;
        const rect = node.getBoundingClientRect();
        const offset = rect.top * (1 - SILK_CONFIG.scroll.parallaxFactor);
        layer.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reducedMotion, visibilityRef]);

  const capability = getWebglCapability();
  const shouldAttemptLive =
    mounted &&
    capability.webgl2 &&
    !reducedMotion &&
    !slow &&
    !isKillSwitchDisabled() &&
    !contextLost;
  const active = isVisible && !documentHidden;

  return (
    <div
      ref={visibilityRef as React.RefObject<HTMLDivElement>}
      className={styles.wrap}
      data-testid="silk-hero"
    >
      <div ref={parallaxLayerRef} className={styles.parallaxLayer}>
        <SilkPoster isDesktop={isDesktop} />
        {shouldAttemptLive && (
          <div className={canvasReady ? styles.canvasReady : styles.canvasHidden}>
            <SilkCanvas
              isDesktop={isDesktop}
              enableSimulation={capability.halfFloatFbo}
              active={active}
              onReady={() => setCanvasReady(true)}
              onContextLost={() => setContextLost(true)}
              onContextRestored={() => setContextLost(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default SilkHero;

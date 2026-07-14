"use client";

// Gating wrapper for the texture-based silk background. Same fallback
// contract as the retired SilkHero: no WebGL2, prefers-reduced-motion,
// save-data/slow connection, NEXT_PUBLIC_SILK_HERO=off, or context loss
// all resolve to the static poster — which is the SAME image the live
// canvas renders at rest, so the fallback is visually identical.

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { isSlowConnection } from "@/lib/connection";
import { getWebglCapability } from "@/lib/webgl";
import { SILK_FABRIC_CONFIG } from "./fabric.config";
import styles from "./SilkFabricBackground.module.css";

const SilkFabricCanvas = dynamic(
  () => import("./SilkFabricCanvas").then((m) => m.SilkFabricCanvas),
  { ssr: false },
);

export function SilkFabricBackground() {
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handler = () => setDocumentHidden(document.hidden);
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  const capability = getWebglCapability();
  const shouldAttemptLive =
    mounted &&
    capability.webgl2 &&
    !reducedMotion &&
    !slow &&
    process.env.NEXT_PUBLIC_SILK_HERO !== "off" &&
    !contextLost;
  const active = isVisible && !documentHidden;

  return (
    <div
      ref={visibilityRef as React.RefObject<HTMLDivElement>}
      className={styles.wrap}
      data-testid="silk-fabric-background"
    >
      {/* Plain img on purpose: this asset must never pass through an
          optimizer (client brief). It is also the LCP image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SILK_FABRIC_CONFIG.texture.posterSrc}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className={styles.poster}
      />
      {shouldAttemptLive && (
        <div className={canvasReady ? styles.canvasReady : styles.canvasHidden}>
          <SilkFabricCanvas
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
  );
}

export default SilkFabricBackground;

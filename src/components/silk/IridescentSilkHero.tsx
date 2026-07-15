"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGL2 } from "@/hooks/useWebGL2";
import { usePointerPosition } from "@/hooks/usePointerPosition";
import { canRenderSilkHero } from "@/lib/silkHero";
import styles from "./IridescentSilkHero.module.css";

const IridescentSilkCanvas = dynamic(() => import("./IridescentSilkCanvas"), { ssr: false });

export function IridescentSilkHero() {
  const reducedMotion = useReducedMotion();
  const webgl2 = useWebGL2();
  const showCanvas = canRenderSilkHero(reducedMotion, webgl2);
  const { springX, springY, getTimeSinceLastMove } = usePointerPosition();

  return (
    <div className={styles.container} aria-hidden="true">
      {showCanvas ? (
        <IridescentSilkCanvas
          springX={springX}
          springY={springY}
          getTimeSinceLastMove={getTimeSinceLastMove}
        />
      ) : (
        <img src="/images/hero/silk-still.jpg" alt="" className={styles.still} />
      )}
    </div>
  );
}

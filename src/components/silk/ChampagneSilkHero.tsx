"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGL2 } from "@/hooks/useWebGL2";
import { usePointerPosition } from "@/hooks/usePointerPosition";
import { canRenderSilkHero } from "@/lib/silkHero";
import styles from "./ChampagneSilkHero.module.css";

const ChampagneSilkCanvas = dynamic(() => import("./ChampagneSilkCanvas"), { ssr: false });

export function ChampagneSilkHero() {
  const reducedMotion = useReducedMotion();
  const webgl2 = useWebGL2();
  const showCanvas = canRenderSilkHero(reducedMotion, webgl2);
  const { springX, springY, getTimeSinceLastMove, getVelocity, getIsIdle } = usePointerPosition();

  return (
    <div className={styles.container} aria-hidden="true" data-testid="silk-hero">
      {showCanvas ? (
        <ChampagneSilkCanvas
          springX={springX}
          springY={springY}
          getTimeSinceLastMove={getTimeSinceLastMove}
          getVelocity={getVelocity}
          getIsIdle={getIsIdle}
        />
      ) : (
        <Image
          src="/images/hero/silk-still.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.still}
        />
      )}
    </div>
  );
}

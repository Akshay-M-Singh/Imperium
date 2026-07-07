"use client";

// SilkCanvas — the live WebGL layer (design spec §2.3). Loaded exclusively
// via SilkHero's `next/dynamic(..., { ssr: false })`, so Three.js never
// enters the server bundle or the poster-only code path. Owns: renderer
// setup (DPR clamp, no tone mapping, sRGB output), pointer smoothing,
// context-loss recovery, and choosing between the simulation-enabled and
// idle-only scene variants based on capability.

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { SilkPlane } from "./SilkPlane";
import { useSilkSimulation } from "./useSilkSimulation";
import { useSilkPointer } from "./useSilkPointer";
import { SILK_CONFIG } from "./silk.config";
import styles from "./SilkCanvas.module.css";

const POINTER_SPRING = { stiffness: 55, damping: 18, mass: 0.6 };

function SilkSceneWithSimulation({
  smoothX,
  smoothY,
}: {
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
}) {
  const pointerRef = useSilkPointer(smoothX, smoothY);
  const simTextureRef = useSilkSimulation(pointerRef);
  return <SilkPlane simTextureRef={simTextureRef} />;
}

const NO_SIM_REF = { current: null } as const;

function SilkSceneIdleOnly({
  smoothX,
  smoothY,
}: {
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
}) {
  useSilkPointer(smoothX, smoothY);
  return <SilkPlane simTextureRef={NO_SIM_REF} />;
}

export interface SilkCanvasProps {
  isDesktop: boolean;
  enableSimulation: boolean;
  active: boolean;
  onReady: () => void;
  onContextLost: () => void;
  onContextRestored: () => void;
}

export function SilkCanvas({
  isDesktop,
  enableSimulation,
  active,
  onReady,
  onContextLost,
  onContextRestored,
}: SilkCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.62);
  const smoothX = useSpring(pointerX, POINTER_SPRING);
  const smoothY = useSpring(pointerY, POINTER_SPRING);
  const [dpr] = useState(() =>
    Math.min(
      typeof window === "undefined" ? 1 : window.devicePixelRatio || 1,
      isDesktop ? SILK_CONFIG.render.dprCap : SILK_CONFIG.render.dprCapIos,
    ),
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const updateFromPoint = (clientX: number, clientY: number) => {
      const rect = node.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointerX.set((clientX - rect.left) / rect.width);
      pointerY.set(1 - (clientY - rect.top) / rect.height);
    };

    const handlePointerMove = (event: PointerEvent) =>
      updateFromPoint(event.clientX, event.clientY);
    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) updateFromPoint(touch.clientX, touch.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [pointerX, pointerY]);

  return (
    <div ref={containerRef} className={styles.canvasWrap} aria-hidden="true">
      <Canvas
        className={styles.canvas}
        dpr={dpr}
        gl={{ antialias: false, toneMapping: THREE.NoToneMapping, alpha: false }}
        frameloop={active ? "always" : "never"}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            onContextLost();
          });
          // Attempt restore silently (design spec §6 "Context loss")
          // rather than leaving the visitor stuck on the poster for the
          // rest of the session once the GPU recovers.
          gl.domElement.addEventListener("webglcontextrestored", onContextRestored);
          onReady();
        }}
        // Distant, narrow-lens camera: the heightfield's Z displacement is
        // tiny in world units, but at a close/wide-angle camera (the
        // original [0,0,1]/fov 50 setup) that displacement produced
        // wide-angle-lens-style perspective distortion — folds near the
        // edges warped into a pinched diamond instead of a flat sheet
        // filling the frame. A distant, narrow FOV camera (viewport size
        // auto-scales to still fill the frame exactly) reads as a
        // telephoto product shot instead, matching a still-life brief.
        camera={{ position: [0, 0, 12], fov: 20 }}
      >
        {enableSimulation ? (
          <SilkSceneWithSimulation smoothX={smoothX} smoothY={smoothY} />
        ) : (
          <SilkSceneIdleOnly smoothX={smoothX} smoothY={smoothY} />
        )}
      </Canvas>
    </div>
  );
}

export default SilkCanvas;

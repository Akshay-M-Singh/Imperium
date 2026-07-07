"use client";

// useSilkPointer — reads the smoothed Framer spring motion values each
// frame inside the Canvas and writes them into a plain ref (design spec
// §2.3: "zero React re-renders per frame"). Shared by both the
// simulation-enabled and idle-only scene variants (SilkCanvas.tsx) so the
// pointer-tracking logic isn't duplicated between them.

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import type { SilkPointerState } from "./useSilkSimulation";

const ACTIVITY_THRESHOLD = 0.00008;

export function useSilkPointer(smoothX: MotionValue<number>, smoothY: MotionValue<number>) {
  const pointerRef = useRef<SilkPointerState>({ x: 0.5, y: 0.62, vx: 0, vy: 0, active: false });

  useFrame(() => {
    const x = smoothX.get();
    const y = smoothY.get();
    // getVelocity() is per-second; the simulation shader wants a per-frame
    // delta, so divide down to a ~60fps step.
    const vx = smoothX.getVelocity() / 60;
    const vy = smoothY.getVelocity() / 60;
    const pointer = pointerRef.current;
    pointer.x = x;
    pointer.y = y;
    pointer.vx = vx;
    pointer.vy = vy;
    pointer.active = Math.hypot(vx, vy) > ACTIVITY_THRESHOLD;
  });

  return pointerRef;
}

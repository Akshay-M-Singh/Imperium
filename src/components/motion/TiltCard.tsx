"use client";

// TiltCard — cursor-aware 3D tilt for fabric cards (MOTION_SPEC.md §3.1).
// Max ±4° rotateX / ±8° rotateY, image scale 1.05, two-layer shadow elevation.
// Touch: no interaction (the former press-scale was removed 2026-07-16 —
// animating a transform on the touched element could cancel the Collections
// row's scroll gesture on iOS Safari). Reduced motion: static.

import { createContext, useContext, useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./TiltCard.module.css";

interface TiltCardContextValue {
  hover: MotionValue<number>;
  hoverSpring: MotionValue<number>;
}

const TiltCardContext = createContext<TiltCardContextValue | null>(null);

function useTiltCardContext() {
  const ctx = useContext(TiltCardContext);
  if (!ctx) {
    throw new Error("TiltCardImage must be used inside a TiltCard");
  }
  return ctx;
}

export interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export interface TiltCardImageProps {
  children: ReactNode;
  className?: string;
}

const ROTATE_X_RANGE = 4; // ±4° from cursor Y
const ROTATE_Y_RANGE = 8; // ±8° from cursor X

export function TiltCard({ children, className }: TiltCardProps): ReactNode {
  const reduced = useReducedMotion();

  // Raw interaction values (updated on events, never in React state).
  const hover = useMotionValue(0);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Spring-smoothed values for all motion outputs.
  const hoverSpring = useSpring(hover, springs.standard);
  const springMouseX = useSpring(mouseX, springs.standard);
  const springMouseY = useSpring(mouseY, springs.standard);

  // Cursor-driven tilt.
  const rotateY = useTransform(springMouseX, [0, 1], [-ROTATE_Y_RANGE, ROTATE_Y_RANGE]);
  const rotateX = useTransform(springMouseY, [0, 1], [ROTATE_X_RANGE, -ROTATE_X_RANGE]);

  // Shadow elevation follows cursor hover.
  const boxShadow = useTransform(
    hoverSpring,
    [0, 1],
    [
      "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
      "0 24px 48px rgba(0,0,0,0.08), 0 12px 24px rgba(0,0,0,0.05)",
    ],
  );

  const rootRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced || !rootRef.current) return;

    const rect = rootRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    mouseX.set(Math.max(0, Math.min(1, x)));
    mouseY.set(Math.max(0, Math.min(1, y)));
  };

  const handleMouseEnter = () => {
    if (reduced) return;
    hover.set(1);
  };

  const handleMouseLeave = () => {
    if (reduced) return;
    hover.set(0);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <TiltCardContext.Provider value={{ hover, hoverSpring }}>
      <motion.div
        ref={rootRef}
        className={[styles.root, className].filter(Boolean).join(" ")}
        style={{ boxShadow: reduced ? undefined : boxShadow }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className={styles.surface}
          style={{
            rotateX: reduced ? 0 : rotateX,
            rotateY: reduced ? 0 : rotateY,
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </TiltCardContext.Provider>
  );
}

export function TiltCardImage({ children, className }: TiltCardImageProps): ReactNode {
  const { hoverSpring } = useTiltCardContext();
  const scale = useTransform(hoverSpring, [0, 1], [1, 1.05]);

  return (
    <motion.div className={[styles.image, className].filter(Boolean).join(" ")} style={{ scale }}>
      {children}
    </motion.div>
  );
}

export default TiltCard;

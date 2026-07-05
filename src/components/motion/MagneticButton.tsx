"use client";

// MagneticButton — cursor-attracted CTA translate (MOTION_SPEC.md §3.2).
// Max 8px, spring `firm`. No-op on touch devices. Reduced motion: static.

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./MagneticButton.module.css";

export interface MagneticButtonProps {
  children: ReactNode;
}

function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

const MAX_OFFSET = 8;
const HIT_RADIUS = 100;

export function MagneticButton({ children }: MagneticButtonProps): ReactNode {
  const reducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [touch, setTouch] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springs.firm);
  const springY = useSpring(y, springs.firm);

  useEffect(() => {
    setTouch(isTouchDevice());
  }, []);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const tx = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, (dx / HIT_RADIUS) * MAX_OFFSET));
    const ty = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, (dy / HIT_RADIUS) * MAX_OFFSET));

    x.set(tx);
    y.set(ty);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (touch || reducedMotion) {
    return <>{children}</>;
  }

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <motion.div className={styles.inner} style={{ x: springX, y: springY }}>
        {children}
      </motion.div>
    </div>
  );
}

export default MagneticButton;

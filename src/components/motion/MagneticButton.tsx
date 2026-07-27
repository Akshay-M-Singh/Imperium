"use client";

// MagneticButton — cursor-attracted CTA translate (DESIGN.md §7.6).
// Max 8px within a 100px hit box, spring `firm`. No-op on touch devices.
// Reduced motion: static. The cursor is tracked on window mousemove — there
// is deliberately no expanded DOM hit-area, so neighbouring links keep their
// own clicks (the old ::before overlay swallowed them).

import { useEffect, useRef, useState, type ReactNode } from "react";
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

  useEffect(() => {
    if (touch || reducedMotion) return;

    const handleMove = (e: globalThis.MouseEvent) => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;

      const withinHitBox =
        e.clientX >= rect.left - HIT_RADIUS &&
        e.clientX <= rect.right + HIT_RADIUS &&
        e.clientY >= rect.top - HIT_RADIUS &&
        e.clientY <= rect.bottom + HIT_RADIUS;

      if (!withinHitBox) {
        x.set(0);
        y.set(0);
        return;
      }

      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);

      x.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, (dx / HIT_RADIUS) * MAX_OFFSET)));
      y.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, (dy / HIT_RADIUS) * MAX_OFFSET)));
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [touch, reducedMotion, x, y]);

  if (touch || reducedMotion) {
    return <>{children}</>;
  }

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <motion.div className={styles.inner} style={{ x: springX, y: springY }}>
        {children}
      </motion.div>
    </div>
  );
}

export default MagneticButton;

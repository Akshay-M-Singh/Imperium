"use client";

// AnimatedFocusRing — shared layoutId morph between FormFields
// (MOTION_SPEC.md §3.3). Spring `soft`. Reduced motion: color change only.

import { motion } from "framer-motion";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./AnimatedFocusRing.module.css";

export function AnimatedFocusRing() {
  const reduced = useReducedMotion();

  if (reduced) {
    return null;
  }

  return (
    <motion.div
      layoutId="form-focus-ring"
      className={styles.ring}
      transition={springs.soft}
      data-testid="animated-focus-ring"
    />
  );
}

export default AnimatedFocusRing;

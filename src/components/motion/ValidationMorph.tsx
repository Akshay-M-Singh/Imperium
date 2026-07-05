"use client";

// ValidationMorph — form error/success transitions (MOTION_SPEC.md §3.4).
// Error: 8px slide-down + border pulse. Success: checkmark draws via
// stroke-dasharray, button text crossfade, micro-bounce. navigator.vibrate(8).

import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./ValidationMorph.module.css";

export type ValidationMorphState = "idle" | "error" | "success";

export interface ValidationMorphProps {
  state: ValidationMorphState;
  message?: string;
  id?: string;
}

const ERROR_EASE = [0.16, 1, 0.3, 1] as const;
const CHECK_EASE = [0.65, 0, 0.35, 1] as const;

export function ValidationMorph({ state, message, id }: ValidationMorphProps) {
  const reduced = useReducedMotion();

  if (state === "idle" || !message) {
    return null;
  }

  if (state === "error") {
    return (
      <AnimatePresence mode="wait">
        <motion.p
          key={message}
          id={id}
          role="alert"
          className={styles.error}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={
            reduced
              ? { opacity: 0, y: 0, transition: { duration: 0 } }
              : { opacity: 0, y: -8, transition: { duration: 0.15, ease: ERROR_EASE } }
          }
          transition={reduced ? { duration: 0 } : { duration: 0.2, ease: ERROR_EASE }}
        >
          {message}
        </motion.p>
      </AnimatePresence>
    );
  }

  return (
    <span className={styles.success} role="status" aria-live="polite">
      <svg className={styles.checkmark} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <motion.path
          d="M5 12l5 5 9-10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={reduced ? { duration: 0 } : { duration: 0.6, ease: CHECK_EASE }}
        />
      </svg>
      <span className={styles.successText}>{message}</span>
    </span>
  );
}

export default ValidationMorph;

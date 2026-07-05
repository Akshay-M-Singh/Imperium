// Motion — Framer Motion spring presets and reveal variants.
// Single source of truth (Architecture §4, MOTION_SPEC.md §2).
// Duplicated from MOTION_SPEC.md. Do not inline magic numbers in components.

import type { Transition, Variants } from "framer-motion";

export const springs = {
  // MOTION_SPEC.md §3.3 uses `soft` for the focus-ring morph and label float.
  soft: { type: "spring", stiffness: 200, damping: 22 },
  standard: { type: "spring", stiffness: 150, damping: 18 },
  firm: { type: "spring", stiffness: 260, damping: 26 },
  snap: { type: "spring", stiffness: 400, damping: 30 },
} as const satisfies Record<string, Transition>;

// Expo-out easing for entries (matches --motion-ease-out in globals.css).
const easeOut = [0.16, 1, 0.3, 1] as const;

export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOut, staggerChildren: 0.08 },
  },
};

export const childReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

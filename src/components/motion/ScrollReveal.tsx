"use client";

// ScrollReveal — one-shot Framer whileInView wrapper (MOTION_SPEC.md §3.6).
// Stagger children at 80ms. viewport.once: true. Per-section thresholds.

import type { ReactNode } from "react";

export interface ScrollRevealProps {
  children: ReactNode;
  amount?: number;
  delay?: number;
}

export function ScrollReveal(_: ScrollRevealProps): ReactNode {
  return null;
}

export default ScrollReveal;

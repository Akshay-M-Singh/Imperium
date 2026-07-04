"use client";

// ScrollReveal — one-shot Framer whileInView wrapper (MOTION_SPEC.md §3.6).
// Stagger children at 80ms. viewport.once: true. Per-section thresholds.
// Reduced motion: children appear in final state instantly (§3.6).

import { createElement, useMemo, type ReactNode } from "react";
import { motion, type TargetAndTransition, type Variants } from "framer-motion";
import { sectionReveal } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface ScrollRevealProps {
  children: ReactNode;
  amount?: number;
  delay?: number;
  as?: "div" | "section" | "ul";
}

const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  ul: motion.ul,
} as const;

const PLAIN_TAGS = {
  div: "div",
  section: "section",
  ul: "ul",
} as const;

export function ScrollReveal({
  children,
  amount = 0.15,
  delay = 0,
  as = "div",
}: ScrollRevealProps): ReactNode {
  const reduced = useReducedMotion();

  const variants = useMemo<Variants>(() => {
    const visible: TargetAndTransition = {
      ...(sectionReveal.visible as TargetAndTransition),
      transition: {
        ...(sectionReveal.visible as TargetAndTransition).transition,
        delay,
      },
    };
    return { ...sectionReveal, visible };
  }, [delay]);

  if (reduced) {
    return createElement(PLAIN_TAGS[as], null, children);
  }

  const MotionTag = MOTION_TAGS[as];
  return (
    <MotionTag
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </MotionTag>
  );
}

export default ScrollReveal;

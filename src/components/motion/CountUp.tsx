"use client";

// CountUp — RAF-driven spring-eased number counter (MOTION_SPEC.md §3.7).
// Triggers on parent ScrollReveal. Direct text node mutation (zero re-renders).
// Reduced motion: renders the final value on mount.

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface CountUpProps {
  end: number;
  suffix?: string;
  duration?: number;
  inView?: boolean;
}

const formatter = new Intl.NumberFormat("en-AE");

function updateNode(node: HTMLElement | null, value: number, suffix: string) {
  if (!node) return;
  node.textContent = formatter.format(value) + suffix;
}

export function CountUp({ end, suffix = "", duration = 1200, inView = false }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || reduced) return;
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const node = ref.current;
    if (!node) return;

    const startTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.exp(-t * 8);
      const current = Math.round(eased * end);

      if (t < 1) {
        updateNode(node, current, suffix);
        rafId = requestAnimationFrame(tick);
      } else {
        updateNode(node, end, suffix);
      }
    };

    // Start from 0 synchronously so the first visible frame is the beginning
    // of the count, not the target value.
    updateNode(node, 0, suffix);

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, reduced, end, suffix, duration]);

  // Reduced motion: final value immediately. Otherwise start at 0 and count
  // when the parent reveals. A server/client mismatch is possible only for
  // users with prefers-reduced-motion, which is accepted and suppressed below.
  const initialValue = reduced ? end : 0;

  return (
    <span ref={ref} suppressHydrationWarning>
      {formatter.format(initialValue)}
      {suffix}
    </span>
  );
}

export default CountUp;

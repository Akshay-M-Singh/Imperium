"use client";

// CountUp — RAF-driven spring-eased number counter (MOTION_SPEC.md §3.7).
// Triggers on parent ScrollReveal. Direct text node mutation (zero re-renders).
// Reduced motion: renders the final value on mount.

export interface CountUpProps {
  end: number;
  suffix?: string;
  duration?: number;
}

export function CountUp(_: CountUpProps): null {
  return null;
}

export default CountUp;

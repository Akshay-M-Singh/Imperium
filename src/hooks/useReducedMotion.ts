"use client";

// useReducedMotion — wraps prefers-reduced-motion (MOTION_SPEC.md §4).
// Framer Motion also exports its own useReducedMotion; this hook is the
// app-level wrapper for components not using Framer's variant system.

import { useEffect, useState } from "react";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export default useReducedMotion;

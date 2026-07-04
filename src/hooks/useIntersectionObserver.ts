"use client";

// useIntersectionObserver — returns an element ref + boolean visibility flag.
// Used by non-Framer IntersectionObserver needs (e.g. hero video lazy loading,
// MOTION_SPEC.md §3.6). Framer's whileInView handles section reveals.

import { useEffect, useRef, useState } from "react";

export interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

export function useIntersectionObserver(options?: UseIntersectionObserverOptions) {
  const { root, rootMargin, threshold, once = true } = options ?? {};
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const thresholdKey = Array.isArray(threshold) ? JSON.stringify(threshold) : threshold;

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setIsVisible(false);
          }
        }
      },
      { root: root ?? null, rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, root, rootMargin, thresholdKey]);

  return { ref, isVisible };
}

export default useIntersectionObserver;

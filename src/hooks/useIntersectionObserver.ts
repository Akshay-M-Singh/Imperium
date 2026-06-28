"use client";

// useIntersectionObserver — returns an element ref + boolean visibility flag.
// Used by non-Framer IntersectionObserver needs (e.g. hero video lazy loading,
// Roadmap Phase 2.4 / 2.8). Framer's whileInView handles section reveals.

import { useEffect, useRef, useState } from "react";

export interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

export function useIntersectionObserver(_options?: UseIntersectionObserverOptions) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // TODO(Phase 2.8): wire IntersectionObserver.
    void setIsVisible;
    void ref;
  }, []);
  return { ref, isVisible };
}

export default useIntersectionObserver;

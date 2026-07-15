"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import type { MotionValue } from "framer-motion";

interface UsePointerPositionReturn {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  getTimeSinceLastMove: () => number;
}

export function usePointerPosition(): UsePointerPositionReturn {
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const springX = useSpring(rawX, { stiffness: 100, damping: 14, mass: 0.8 });
  const springY = useSpring(rawY, { stiffness: 100, damping: 14, mass: 0.8 });
  const lastMoveTimeRef = useRef(Date.now());

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      rawX.set(e.clientX / window.innerWidth);
      rawY.set(1 - e.clientY / window.innerHeight);
      lastMoveTimeRef.current = Date.now();
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [rawX, rawY]);

  const getTimeSinceLastMove = useCallback(() => (Date.now() - lastMoveTimeRef.current) / 1000, []);

  return { springX, springY, getTimeSinceLastMove };
}

export default usePointerPosition;

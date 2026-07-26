"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import type { MotionValue } from "framer-motion";

interface UsePointerPositionReturn {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  getTimeSinceLastMove: () => number;
  getVelocity: () => number;
  getIsIdle: () => boolean;
}

export function usePointerPosition(): UsePointerPositionReturn {
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const springX = useSpring(rawX, { stiffness: 100, damping: 14, mass: 0.8 });
  const springY = useSpring(rawY, { stiffness: 100, damping: 14, mass: 0.8 });
  const lastMoveTimeRef = useRef(Date.now());
  const velocityRef = useRef(0);
  const prevXRef = useRef(0.5);
  const prevYRef = useRef(0.5);
  const prevTimeRef = useRef(Date.now());

  useEffect(() => {
    const handleMove = (nx: number, ny: number) => {
      const now = Date.now();
      const dt = Math.max((now - prevTimeRef.current) / 1000, 0.001);
      const dx = nx - prevXRef.current;
      const dy = ny - prevYRef.current;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;

      velocityRef.current = velocityRef.current * 0.8 + speed * 0.2;
      prevXRef.current = nx;
      prevYRef.current = ny;
      prevTimeRef.current = now;

      rawX.set(nx);
      rawY.set(ny);
      lastMoveTimeRef.current = now;
    };

    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      handleMove(t.clientX / window.innerWidth, 1 - t.clientY / window.innerHeight);
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const nx = t.clientX / window.innerWidth;
      const ny = 1 - t.clientY / window.innerHeight;
      prevXRef.current = nx;
      prevYRef.current = ny;
      prevTimeRef.current = Date.now();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, [rawX, rawY]);

  const getTimeSinceLastMove = useCallback(() => (Date.now() - lastMoveTimeRef.current) / 1000, []);
  const getVelocity = useCallback(() => velocityRef.current, []);
  const getIsIdle = useCallback(() => getTimeSinceLastMove() > 2.0, [getTimeSinceLastMove]);

  return { springX, springY, getTimeSinceLastMove, getVelocity, getIsIdle };
}

export default usePointerPosition;

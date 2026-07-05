"use client";

// CarouselSlide — single slide with entry animation + Ken Burns on active
// (MOTION_SPEC.md §3.5). Also owns the shared carousel context so it can be
// statically imported by consumers while EmblaContainer is lazy-loaded.

import { createContext, useContext, useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./CarouselSlide.module.css";

export interface CarouselSlideProps {
  children: ReactNode;
  index: number;
}

interface CarouselContextValue {
  activeIndex: number;
  slideCount: number;
}

export const CarouselContext = createContext<CarouselContextValue | null>(null);

export function useCarouselContext(): CarouselContextValue {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("CarouselSlide must be rendered inside EmblaContainer");
  }
  return context;
}

export function CarouselSlide({ children, index }: CarouselSlideProps): ReactNode {
  const reduced = useReducedMotion();
  const { activeIndex, slideCount } = useCarouselContext();
  const ref = useRef<HTMLDivElement>(null);
  const isActive = index === activeIndex;
  const hasEntered = useInView(ref, { once: true, amount: 0.3 });

  const transition = reduced ? { duration: 0 } : springs.soft;

  return (
    <motion.div
      ref={ref}
      className={`${styles.slide} ${isActive ? styles.active : ""}`}
      role="group"
      aria-roledescription="slide"
      aria-label={`Slide ${index + 1} of ${slideCount}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={
        hasEntered
          ? isActive
            ? { opacity: 1, scale: 1 }
            : { opacity: 0.7, scale: 0.95 }
          : { opacity: 0, scale: 0.95 }
      }
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

export default CarouselSlide;

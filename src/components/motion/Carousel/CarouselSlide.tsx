"use client";

// CarouselSlide — single slide with entry animation + Ken Burns on active
// (MOTION_SPEC.md §3.5).

import type { ReactNode } from "react";

export interface CarouselSlideProps {
  children: ReactNode;
  index: number;
}

export function CarouselSlide(_: CarouselSlideProps): ReactNode {
  return null;
}

export default CarouselSlide;

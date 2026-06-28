"use client";

// TiltCard — cursor-aware 3D tilt for fabric cards (MOTION_SPEC.md §3.1).
// Max ±8° rotation, image scale 1.05, two-layer shadow elevation.
// Touch: scale 0.98 + shadow, no tilt. Reduced motion: static.

import type { ReactNode } from "react";

export interface TiltCardProps {
  children: ReactNode;
}

export function TiltCard(_: TiltCardProps): ReactNode {
  return null;
}

export default TiltCard;

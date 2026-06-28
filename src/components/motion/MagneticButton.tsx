"use client";

// MagneticButton — cursor-attracted CTA translate (MOTION_SPEC.md §3.2).
// Max 8px, spring `firm`. No-op on touch devices. Reduced motion: static.

import type { ReactNode } from "react";

export interface MagneticButtonProps {
  children: ReactNode;
}

export function MagneticButton(_: MagneticButtonProps): ReactNode {
  return null;
}

export default MagneticButton;

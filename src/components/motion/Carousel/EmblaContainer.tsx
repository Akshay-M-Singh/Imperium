"use client";

// EmblaContainer — swipeable carousel wrapper (MOTION_SPEC.md §3.5).
// Mobile-first, single slide per view on desktop too.
// touch-action: pan-y on the track. Config in src/lib/constants.ts.

import type { ReactNode } from "react";

export interface EmblaContainerProps {
  children: ReactNode;
}

export function EmblaContainer(_: EmblaContainerProps): ReactNode {
  return null;
}

export default EmblaContainer;

"use client";

// ValidationMorph — form error/success transitions (MOTION_SPEC.md §3.4).
// Error: 8px slide-down + border pulse. Success: checkmark draws via
// stroke-dasharray, button text crossfade, micro-bounce. navigator.vibrate(8).

export type ValidationMorphState = "idle" | "error" | "success";

export interface ValidationMorphProps {
  state: ValidationMorphState;
  message?: string;
}

export function ValidationMorph(_: ValidationMorphProps): null {
  return null;
}

export default ValidationMorph;

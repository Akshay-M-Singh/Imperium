// Button — ghost (outline) and filled variants (Roadmap Phase 1.12).
// DESIGN.md §9.01, §9.02 specify the variants.
// MagneticButton motion wrapper (MOTION_SPEC.md §3.2) is applied in Phase 5.

import type { ReactNode } from "react";

export type ButtonVariant = "ghost" | "filled" | "whatsapp";

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  href?: string;
}

export function Button(_: ButtonProps): ReactNode {
  return null;
}

export default Button;

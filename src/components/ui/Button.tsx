// Button — ghost (outline) and filled variants (Roadmap Phase 1.12).
// DESIGN.md §9.01, §9.02 specify the variants.
// MagneticButton motion wrapper (MOTION_SPEC.md §3.2) is applied in Phase 5.

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./Button.module.css";

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

export function Button({
  children,
  variant = "ghost",
  type = "button",
  disabled = false,
  loading = false,
  onClick,
  href,
}: ButtonProps): ReactNode {
  const className = cn(styles.button, styles[variant]);

  if (href) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={className}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;

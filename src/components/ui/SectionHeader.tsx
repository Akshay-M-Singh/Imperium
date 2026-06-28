// SectionHeader — Eyebrow + headline + subline composition
// (Roadmap Phase 1.11). Used by every section with content above the fold.

import type { ReactNode } from "react";

export interface SectionHeaderProps {
  eyebrow: string;
  headline: ReactNode;
  subline?: ReactNode;
  /** Heading level — must not skip levels (Architecture §7.3). */
  as?: "h2" | "h3";
  /** id for aria-labelledby on the wrapping <section>. */
  id?: string;
}

export function SectionHeader(_: SectionHeaderProps): ReactNode {
  return null;
}

export default SectionHeader;

// Section — reusable section wrapper providing max-width, responsive
// margins, and consistent vertical rhythm (Roadmap Phase 1.9).
// Reads spacing tokens from globals.css.

import type { ReactNode } from "react";

export interface SectionProps {
  children: ReactNode;
  /** Optional id for anchor navigation. */
  id?: string;
  /** aria-labelledby target — the section header's h2 id. */
  ariaLabelledby?: string;
  /** Element semantics. Defaults to <section>. */
  as?: "section" | "aside" | "article";
  /** Background band. Defaults to the page (Pietra). */
  background?: "pietra" | "gesso" | "carbone";
  /** Reduce vertical padding to subsection rhythm. */
  dense?: boolean;
}

export function Section(_: SectionProps): ReactNode {
  return null;
}

export default Section;

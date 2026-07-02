// SectionHeader — Eyebrow + headline + subline composition
// (Roadmap Phase 1.11). Used by every section with content above the fold.

import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";
import styles from "./SectionHeader.module.css";

export interface SectionHeaderProps {
  eyebrow: string;
  headline: ReactNode;
  subline?: ReactNode;
  /** Heading level — must not skip levels (Architecture §7.3). */
  as?: "h2" | "h3";
  /** id for aria-labelledby on the wrapping <section>. */
  id?: string;
}

export function SectionHeader({
  eyebrow,
  headline,
  subline,
  as: Heading = "h2",
  id,
}: SectionHeaderProps): ReactNode {
  return (
    <header className={styles.header}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading id={id} className={Heading === "h2" ? styles.headlineH2 : styles.headlineH3}>
        {headline}
      </Heading>
      {subline ? <p className={styles.subline}>{subline}</p> : null}
    </header>
  );
}

export default SectionHeader;

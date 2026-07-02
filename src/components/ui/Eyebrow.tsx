// Eyebrow — uppercase tracked label pattern (DESIGN.md §2, Roadmap 1.10).
// 11px DM Sans 500, tracking +0.15em, uppercase.

import type { ReactNode } from "react";
import styles from "./Eyebrow.module.css";

export interface EyebrowProps {
  children: ReactNode;
}

export function Eyebrow({ children }: EyebrowProps): ReactNode {
  return <span className={styles.eyebrow}>{children}</span>;
}

export default Eyebrow;

// TextLink — animated underline link (DESIGN.md §5 hover spec,
// Roadmap Phase 1.13). Underline width animates 0% → 100% left-to-right.

import type { ReactNode } from "react";
import styles from "./TextLink.module.css";

export interface TextLinkProps {
  children: ReactNode;
  href: string;
}

export function TextLink({ children, href }: TextLinkProps): ReactNode {
  return (
    <a href={href} className={styles.link}>
      {children}
    </a>
  );
}

export default TextLink;

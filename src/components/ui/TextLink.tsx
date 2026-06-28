// TextLink — animated underline link (DESIGN.md §5 hover spec,
// Roadmap Phase 1.13). Underline width animates 0% → 100% left-to-right.

import type { ReactNode } from "react";

export interface TextLinkProps {
  children: ReactNode;
  href: string;
}

export function TextLink(_: TextLinkProps): ReactNode {
  return null;
}

export default TextLink;

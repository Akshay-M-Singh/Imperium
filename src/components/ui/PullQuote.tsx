// PullQuote — centred Cormorant italic quote + Oro Antico attribution
// (DESIGN.md §9.06, Roadmap Phase 4.3). No quotation marks — let text breathe.

import type { ReactNode } from "react";
import styles from "./PullQuote.module.css";

export interface PullQuoteProps {
  quote: ReactNode;
  attribution: string;
}

export function PullQuote({ quote, attribution }: PullQuoteProps): ReactNode {
  return (
    <figure className={styles.pullQuote}>
      <blockquote className={styles.quote}>{quote}</blockquote>
      <figcaption className={styles.attribution}>{attribution}</figcaption>
    </figure>
  );
}

export default PullQuote;

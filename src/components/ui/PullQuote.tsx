// PullQuote — centred Cormorant italic quote + Oro Antico attribution
// (DESIGN.md §9.06, Roadmap Phase 4.3). No quotation marks — let text breathe.

import type { ReactNode } from "react";

export interface PullQuoteProps {
  quote: ReactNode;
  attribution: string;
}

export function PullQuote(_: PullQuoteProps): ReactNode {
  return null;
}

export default PullQuote;

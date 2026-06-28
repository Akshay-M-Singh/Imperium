// Founder — Sofia Mazza bio, quote, certification (DESIGN.md §9.06).

export interface FounderData {
  eyebrow: string;
  headline: string;
  bioParagraphs: string[];
  portrait: { src: string; alt: string; caption: string };
  quote: string;
  quoteAttribution: string;
  certification: { src: string | null; caption: string };
}

export const founder: FounderData = {
  eyebrow: "The story behind Imperium",
  headline: "A love for Italy, built into every thread.",
  bioParagraphs: ["Placeholder — PRD bio paragraph 1.", "Placeholder 2.", "Placeholder 3."],
  portrait: {
    src: "/images/about/sofia-portrait.jpg",
    alt: "Sofia Mazza, Founder",
    caption: "Sofia Mazza, Founder",
  },
  quote: "Every fabric I source is one I would stake my name on.",
  quoteAttribution: "Sofia Mazza, Founder",
  certification: {
    src: null, // null until certification scan is provided (Phase 4 fine-tune)
    caption: "Certified Made in Italy Expert",
  },
};

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
  bioParagraphs: [
    "Sofia Mazza founded Imperium on a simple conviction: the best Italian fabrics deserve to be handled by people who understand them.",
    "Born from years spent between Milanese mills and Dubai showrooms, the company connects Italian craft with the Gulf's most exacting clients — tailors who measure in millimetres and hospitality groups who think in decades.",
    "Every bolt is chosen by hand. Every relationship is built on trust. And every delivery carries the promise that the fabric is exactly what it claims to be.",
  ],
  portrait: {
    src: "/images/about/sofia-portrait.svg",
    alt: "Sofia Mazza, Founder of Imperium Italian Textile",
    caption: "Sofia Mazza, Founder",
  },
  quote: "Every fabric I source is one I would stake my name on.",
  quoteAttribution: "Sofia Mazza, Founder",
  certification: {
    src: null, // null until certification scan is provided (Phase 4 fine-tune)
    caption: "Certified Made in Italy Expert",
  },
};

// Founder — Sofia Mazza bio, quote, certification (DESIGN.md §9.06).
// Copy is client-approved. Set certification.src to the scan path
// (public/images/certifications/made-in-italy-certificate.png, staged
// when available) once the founder approves showing it.

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
  headline: "Proudly Italian. Purposefully Global.",
  bioParagraphs: [
    "Born and raised in Italy, Sofia Mazza is an Italian entrepreneur with a legal and business background and a certified Made in Italy expert. Now based in Dubai, she founded Imperium to create a direct bridge between Italy's finest textile manufacturers and the Gulf's most discerning designers, architects and fashion houses.",
    "Deeply proud of her heritage, Sofia believes that authentic Italian craftsmanship deserves to be represented with the same integrity with which it is created. She personally travels across Italy to meet mills, evaluate collections and build long-term relationships with manufacturers whose values reflect her own.",
    "Imperium is more than a textile supplier. It's a carefully curated expression of Italian excellence.",
  ],
  portrait: {
    src: "/images/about/sofia-portrait.png",
    alt: "Sofia Mazza, Founder of Imperium Italian Textile",
    caption: "Sofia Mazza, Founder",
  },
  quote:
    "Every fabric I select represents not only Italian craftsmanship, but my own commitment to excellence.",
  quoteAttribution: "Sofia Mazza, Founder",
  certification: {
    src: null, // null until the founder approves displaying the scan
    caption: "Made in Italy Certification",
  },
};

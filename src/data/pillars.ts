// Why Imperium — three numbered principles rendered as alternating
// editorial rows (client direction; supersedes the four-in-a-row
// manifesto in DESIGN.md §9.05 and absorbs the origin-map idea from
// §9.03). The fourth pillar was removed by client decision — do not
// re-add a replacement.

export type PillarMedia = "map" | "stamp" | null;

export interface WhyImperiumItem {
  number: string;
  heading: string;
  paragraphs: string[];
  /** Reserved visual slot: "map" (Italy → Gulf route), "stamp" (Made in
   *  Italy badge — NOT the certification image, which lives in the
   *  Founder section), or null for a text-only row. Artwork lands later. */
  media: PillarMedia;
}

export const whyImperium: {
  eyebrow: string;
  headline: string;
  items: WhyImperiumItem[];
} = {
  eyebrow: "Why Imperium",
  headline: "Not just fabric. A guarantee of origin.",
  items: [
    {
      number: "01",
      heading: "Direct From the Source",
      paragraphs: [
        "We buy from the mills, not from middlemen — and we visit them. Every collection begins in Italy, in conversations on factory floors with the people who weave what we sell.",
        "From those mills, fabric travels one route: Italy to the UAE and across the Gulf. One partner, one chain of custody, nothing anonymous between the loom and your project.",
      ],
      media: "map",
    },
    {
      number: "02",
      heading: "Made in Italy Expertise",
      paragraphs: [
        "Imperium is led by a certified Made in Italy expert. Provenance here is not a label claim — it is a discipline: verifying where a fabric is made, how, and by whom, before it ever reaches you.",
      ],
      media: "stamp",
    },
    {
      number: "03",
      heading: "For the Gulf's Luxury Market",
      paragraphs: [
        "Based in Dubai, serving the Gulf's luxury market. We understand the region's pace, climate and standard of finish — and we bring Italian craftsmanship that answers all three.",
      ],
      media: null,
    },
  ],
};

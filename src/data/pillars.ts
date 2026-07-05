// TrustPillars — four numbered principles (DESIGN.md §9.05).
// Numbers transform bullet points into an ordered manifesto.

export interface Pillar {
  number: string;
  label: string;
  body: string;
}

export const pillars: Pillar[] = [
  {
    number: "01",
    label: "Direct from the source",
    body: "We buy from the mills, not from middlemen — and we visit them.",
  },
  {
    number: "02",
    label: "Made in Italy expertise",
    body: "Years of working with Italian weavers mean we can read a fabric the way a tailor reads a cloth.",
  },
  {
    number: "03",
    label: "Built for the Gulf",
    body: "Based in Dubai. We understand the market's pace, climate and standard of finish.",
  },
  {
    number: "04",
    label: "A partner, not a catalogue",
    body: "Tell us the project; we'll bring the options. Sourcing is a conversation, not a search bar.",
  },
];

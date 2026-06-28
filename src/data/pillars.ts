// TrustPillars — four numbered principles (DESIGN.md §9.05).
// Numbers transform bullet points into an ordered manifesto.

export interface Pillar {
  number: string;
  label: string;
  body: string;
}

export const pillars: Pillar[] = [
  { number: "01", label: "Direct from the source", body: "Placeholder copy." },
  { number: "02", label: "Made in Italy expertise", body: "Placeholder copy." },
  { number: "03", label: "For the Gulf's luxury market", body: "Placeholder copy." },
  { number: "04", label: "Always available", body: "Placeholder copy." },
];

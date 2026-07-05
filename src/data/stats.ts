// Stats strip — client-confirmed "40+ Fabrics". The previous strip
// ("12+ Italian mills", "120+ Fabrics in library", "15 Years of
// expertise", "4 Cities served") carried unvalidated, checkable claims
// and was removed by client decision. The two companion stats below are
// 🟡 team-proposed and true by construction (PRD §6.4) — delete a line
// if the founder vetoes it; the strip lays out 1–3 items cleanly.

export interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

export const stats: StatItem[] = [
  { value: 40, suffix: "+", label: "Fabrics" },
  { value: 4, label: "Curated collections" },
  { value: 100, suffix: "%", label: "Italian fabrics" },
];

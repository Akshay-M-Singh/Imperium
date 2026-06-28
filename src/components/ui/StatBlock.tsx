// StatBlock — single stat number + label (Roadmap Phase 3.3).
// Number animates via the CountUp motion component (MOTION_SPEC.md §3.7).

export interface StatBlockProps {
  value: number;
  label: string;
  suffix?: string;
}

export function StatBlock(_: StatBlockProps) {
  return null;
}

export default StatBlock;

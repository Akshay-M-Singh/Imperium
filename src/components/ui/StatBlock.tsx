// StatBlock — single stat number + label (Roadmap Phase 3.3).
// Number animates via the CountUp motion component (MOTION_SPEC.md §3.7).

import type { ReactNode } from "react";
import { CountUp } from "@/components/motion/CountUp";
import styles from "./StatBlock.module.css";

export interface StatBlockProps {
  value: number;
  label: string;
  suffix?: string;
  inView?: boolean;
}

export function StatBlock({ value, label, suffix, inView }: StatBlockProps): ReactNode {
  return (
    <div className={styles.block}>
      <span className={styles.number} aria-label={`${value}${suffix ?? ""} ${label}`}>
        <CountUp end={value} suffix={suffix} inView={inView} />
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export default StatBlock;

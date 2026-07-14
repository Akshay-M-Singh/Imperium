import type { ReactNode } from "react";
import { contact } from "@/data/contact";
import type { Locale } from "@/lib/i18n";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Arrow } from "./Arrow";
import styles from "./EmailButton.module.css";

export interface EmailButtonProps {
  locale?: Locale;
}

export function EmailButton({ locale = "en" }: EmailButtonProps): ReactNode {
  const t = contact[locale];
  const href = `mailto:${t.email}?subject=${encodeURIComponent(t.emailSubjectPrefill)}`;

  return (
    <MagneticButton>
      <a href={href} className={styles.button} aria-label={t.emailButtonLabel}>
        {t.emailButtonLabel} <Arrow />
      </a>
    </MagneticButton>
  );
}

export default EmailButton;

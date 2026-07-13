import type { ReactNode } from "react";
import { SITE } from "@/lib/site";
import { contact } from "@/data/contact";
import { waLink } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Arrow } from "./Arrow";
import styles from "./WhatsAppButton.module.css";

export interface WhatsAppButtonProps {
  /** Render as the fixed mobile bar. Defaults to inline. */
  fixedMobile?: boolean;
}

export function WhatsAppButton({ fixedMobile = false }: WhatsAppButtonProps): ReactNode {
  const number = SITE.whatsapp;
  if (!number) {
    return null;
  }

  const href = waLink(number, contact.whatsappPrefill);

  if (fixedMobile) {
    return (
      <a
        href={href}
        className={styles.fixed}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={contact.whatsappButtonLabel}
      >
        <span className={styles.indicator} aria-hidden="true" />
        {contact.whatsappButtonLabel} <Arrow />
      </a>
    );
  }

  return (
    <MagneticButton>
      <a
        href={href}
        className={cn(styles.button, styles.inline)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={contact.whatsappButtonLabel}
      >
        {contact.whatsappButtonLabel} <Arrow />
      </a>
    </MagneticButton>
  );
}

export default WhatsAppButton;

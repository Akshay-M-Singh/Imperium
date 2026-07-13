import type { NavigationData } from "@/types/navigation";
import type { Locale } from "@/lib/i18n";

// Navigation — nav links + CTA config (Architecture §2, §8), keyed by
// locale. AR strings are DRAFTS pending native review (see the AR copy
// review sheet in docs/superpowers/specs/).

export const navigation: Record<Locale, NavigationData> = {
  en: {
    links: [
      { label: "Fabrics", href: "#collections" },
      { label: "About", href: "#founder" },
      { label: "Contact", href: "#contact" },
    ],
    cta: { label: "Request Samples", href: "#contact" },
    languageToggle: { en: "EN", ar: "AR" },
  },
  ar: {
    links: [
      { label: "الأقمشة", href: "#collections" },
      { label: "من نحن", href: "#founder" },
      { label: "تواصل معنا", href: "#contact" },
    ],
    cta: { label: "اطلب العيّنات", href: "#contact" },
    languageToggle: { en: "EN", ar: "AR" },
  },
};

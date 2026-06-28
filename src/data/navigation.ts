import type { NavigationData } from "@/types/navigation";

// Navigation — nav links + CTA config (Architecture §2, DESIGN.md §9.01).
// Typed copy file → maps 1:1 to V2 Sanity schema.

export const navigation: NavigationData = {
  links: [
    { label: "Fabrics", href: "#collections" },
    { label: "Pezzi Unici", href: "#collections" },
    { label: "Hospitality", href: "#collections" },
    { label: "About", href: "#founder" },
    { label: "Contact", href: "#contact" },
  ],
  cta: { label: "Request Samples", href: "#contact" },
  languageToggle: { en: "EN", ar: "AR" },
};

// V2 i18n pattern (Architecture §8):
// export const navigation = { en: {...}, ar: {...} };

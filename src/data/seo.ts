import type { SeoData } from "@/types/seo";

// SEO — per-page metadata (Architecture §7.2, Roadmap Phase 6.5).

export const seo: SeoData = {
  home: {
    title: "Imperium Italian Textile — Premium Italian Fabrics, Delivered to the Gulf",
    description:
      "Premium Italian fabrics sourced from Italy's finest mills and delivered to the Gulf's most discerning tailors, designers and hospitality groups.",
    canonical: "/",
    ogTitle: "Imperium Italian Textile",
    ogDescription: "Premium Italian fabrics sourced from the finest mills of Italy.",
  },
  fabrics: {
    title: "Fabric Collections",
    description:
      "Tessuti Italiani, Pezzi Unici, Ospitalità di Lusso and Interior & Exterior Design — four collections of premium Italian fabric.",
    canonical: "/fabrics",
  },
  about: {
    title: "About — Sofia Mazza, Founder",
    description: "The story behind Imperium Italian Textile.",
    canonical: "/about",
  },
  contact: {
    title: "Contact",
    description: "Request Italian fabric samples or talk to us about your project.",
    canonical: "/contact",
  },
};

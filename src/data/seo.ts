import type { SeoData } from "@/types/seo";
import type { Locale } from "@/lib/i18n";

// SEO — per-page metadata (Architecture §7.2, Roadmap Phase 6.5), keyed by locale.
// AR strings are DRAFTS pending native review.

export const seo: Record<Locale, SeoData> = {
  en: {
    home: {
      title: "Imperium Italian Textile — Premium Italian Fabrics, Delivered to the Gulf",
      description:
        "Premium Italian fabrics sourced from Italy's finest mills and delivered to the Gulf's most discerning tailors, designers and hospitality groups.",
      canonical: "/",
      ogTitle: "Imperium Italian Textile",
      ogDescription: "Premium Italian fabrics sourced from the finest mills of Italy.",
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
  },
  ar: {
    home: {
      title: "إمبريوم للأقمشة الإيطالية — أقمشة إيطالية فاخرة تصل إلى الخليج",
      description:
        "أقمشة إيطالية فاخرة من أرقى مصانع النسيج في إيطاليا، تصل إلى أكثر الخيّاطين والمصمّمين ومجموعات الضيافة تميّزًا في الخليج.",
      canonical: "/ar",
      ogTitle: "إمبريوم للأقمشة الإيطالية",
      ogDescription: "أقمشة إيطالية فاخرة من أرقى مصانع النسيج في إيطاليا.",
    },
    about: {
      title: "من نحن — صوفيا ماتزا، المؤسِّسة",
      description: "القصة وراء إمبريوم للأقمشة الإيطالية.",
      canonical: "/ar/about",
    },
    contact: {
      title: "تواصل معنا",
      description: "اطلب عيّنات من الأقمشة الإيطالية أو حدّثنا عن مشروعك.",
      canonical: "/ar/contact",
    },
  },
};

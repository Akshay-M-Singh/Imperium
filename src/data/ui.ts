import type { Locale } from "@/lib/i18n";

// UI chrome strings — cross-cutting labels that don't belong to one
// section's data file. AR strings are DRAFTS pending native review.

export interface UiStrings {
  nav: {
    primaryAria: string;
    homeAria: string;
    openMenu: string;
    closeMenu: string;
    overlayWhatsApp: string;
    switchToEn: string;
    switchToAr: string;
  };
  footer: {
    aria: string;
    rightsReserved: string;
    privacyPolicy: string;
    whatsapp: string;
  };
}

export const ui: Record<Locale, UiStrings> = {
  en: {
    nav: {
      primaryAria: "Primary",
      homeAria: "Imperium Italian Textile — home",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      overlayWhatsApp: "Chat on WhatsApp",
      switchToEn: "Switch to English",
      switchToAr: "التبديل إلى العربية",
    },
    footer: {
      aria: "Footer",
      rightsReserved: "All rights reserved.",
      privacyPolicy: "Privacy Policy",
      whatsapp: "WhatsApp",
    },
  },
  ar: {
    nav: {
      primaryAria: "التنقل الرئيسي",
      homeAria: "إمبريوم للأقمشة الإيطالية — الصفحة الرئيسية",
      openMenu: "افتح القائمة",
      closeMenu: "أغلق القائمة",
      overlayWhatsApp: "تحدّث معنا عبر واتساب",
      switchToEn: "Switch to English",
      switchToAr: "التبديل إلى العربية",
    },
    footer: {
      aria: "روابط تذييل الصفحة",
      rightsReserved: "جميع الحقوق محفوظة.",
      privacyPolicy: "سياسة الخصوصية",
      whatsapp: "واتساب",
    },
  },
};

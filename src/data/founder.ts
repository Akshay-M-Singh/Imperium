// Founder — Sofia Mazza bio, quote, certification (DESIGN.md §9.06).
// Copy is client-approved; portrait and certification scan are the real
// client assets (see the asset-integration spec in docs/superpowers/specs/).

import type { Locale } from "@/lib/i18n";

export interface FounderData {
  eyebrow: string;
  headline: string;
  bioParagraphs: string[];
  portrait: { src: string; alt: string; caption: string };
  quote: string;
  quoteAttribution: string;
  certification: { src: string | null; caption: string };
  /** Fallback label shown in the certification slot when certification.src is null. */
  certificationPlaceholderLabel: string;
}

export const founder: Record<Locale, FounderData> = {
  en: {
    eyebrow: "The story behind Imperium",
    headline: "Proudly Italian. Purposefully Global.",
    bioParagraphs: [
      "Born and raised in Italy, Sofia Mazza is an Italian entrepreneur with a legal and business background and a certified Made in Italy expert. Now based in Dubai, she founded Imperium to create a direct bridge between Italy's finest textile manufacturers and the Gulf's most discerning designers, architects and fashion houses.",
      "Deeply proud of her heritage, Sofia believes that authentic Italian craftsmanship deserves to be represented with the same integrity with which it is created. She personally travels across Italy to meet mills, evaluate collections and build long-term relationships with manufacturers whose values reflect her own.",
      "Imperium is more than a textile supplier. It's a carefully curated expression of Italian excellence.",
    ],
    portrait: {
      src: "/images/about/sofia-portrait.png",
      alt: "Sofia Mazza, Founder of Imperium Italian Textile",
      caption: "Sofia Mazza, Founder",
    },
    quote:
      "Every fabric I select represents not only Italian craftsmanship, but my own commitment to excellence.",
    quoteAttribution: "Sofia Mazza, Founder",
    certification: {
      // Client scan, integrated as-is by user decision (asset-integration
      // spec): DOB and issue date are visible — Sofia's explicit OK
      // recommended before launch.
      src: "/images/certifications/made-in-italy-certification.png",
      caption: "Made in Italy Certification",
    },
    certificationPlaceholderLabel: "Image to follow",
  },
  ar: {
    eyebrow: "القصة وراء إمبريوم",
    headline: "إيطالية بفخر. عالمية عن قصد.",
    bioParagraphs: [
      "وُلدت صوفيا ماتزا ونشأت في إيطاليا، وهي رائدة أعمال إيطالية بخلفية قانونية وتجارية، وخبيرة معتمدة في «صُنِع في إيطاليا». تقيم اليوم في دبي، وقد أسّست إمبريوم لتقيم جسرًا مباشرًا بين أرقى مصانع النسيج الإيطالية وأكثر المصمّمين والمعماريين ودور الأزياء تميّزًا في الخليج.",
      "انطلاقًا من اعتزازها العميق بإرثها، تؤمن صوفيا بأن الحرفية الإيطالية الأصيلة تستحق أن تُمثَّل بالنزاهة نفسها التي صُنعت بها. تسافر بنفسها عبر إيطاليا للقاء المصانع وتقييم المجموعات وبناء علاقات طويلة الأمد مع صنّاع تعكس قيمُهم قيمَها.",
      "إمبريوم أكثر من مورّد أقمشة؛ إنها تعبير منتقى بعناية عن التميّز الإيطالي.",
    ],
    portrait: {
      src: "/images/about/sofia-portrait.png",
      alt: "صوفيا ماتزا، مؤسِّسة إمبريوم للأقمشة الإيطالية",
      caption: "صوفيا ماتزا، المؤسِّسة",
    },
    quote: "كل قماش أختاره لا يجسّد الحرفية الإيطالية فحسب، بل التزامي الشخصي بالتميّز أيضًا.",
    quoteAttribution: "صوفيا ماتزا، المؤسِّسة",
    certification: {
      src: "/images/certifications/made-in-italy-certification.png",
      caption: "شهادة «صُنِع في إيطاليا»",
    },
    certificationPlaceholderLabel: "الصورة قادمة قريبًا",
  },
};

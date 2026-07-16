// Why Imperium — three numbered principles rendered as alternating
// editorial rows (client direction; supersedes the four-in-a-row
// manifesto in DESIGN.md §9.05 and absorbs the origin-map idea from
// §9.03). The fourth pillar was removed by client decision — do not
// re-add a replacement.

import type { Locale } from "@/lib/i18n";

export type PillarMedia = "map" | "stamp" | null;

export interface WhyImperiumItem {
  number: string;
  heading: string;
  paragraphs: string[];
  /** Reserved visual slot: "map" (Italy → Gulf route), "stamp" (Made in
   *  Italy badge — NOT the certification image, which lives in the
   *  Founder section), or null for a text-only row. Artwork lands later. */
  media: PillarMedia;
}

export interface WhyImperiumData {
  eyebrow: string;
  headline: string;
  /** Alt text for the item-01 "map" media slot (Italy → Gulf route artwork). */
  mapAlt: string;
  /** Alt text for the item-02 "stamp" media slot (Made in Italy badge). */
  stampAlt: string;
  items: WhyImperiumItem[];
}

export const whyImperium: Record<Locale, WhyImperiumData> = {
  en: {
    eyebrow: "Why Imperium",
    headline: "Not just fabric. A guarantee of origin.",
    mapAlt: "Illustrated route map from Italy to the UAE and the Gulf",
    stampAlt: "100% Made in Italy certification stamp",
    items: [
      {
        number: "01",
        heading: "Direct From the Source",
        paragraphs: [
          "We buy from the mills, not from middlemen — and we visit them. Every collection begins in Italy, in conversations on factory floors with the people who weave what we sell.",
          "From those mills, fabric travels one route: Italy to the UAE and across the Gulf. One partner, one chain of custody, nothing anonymous between the loom and your project. And with no one in between, that provenance comes with an edge — sourcing direct keeps us genuinely competitive.",
        ],
        media: "map",
      },
      {
        number: "02",
        heading: "Made in Italy Expertise",
        paragraphs: [
          "Imperium is led by a certified Made in Italy expert. Provenance here is not a label claim — it is a discipline: verifying where a fabric is made, how, and by whom, before it ever reaches you.",
        ],
        media: "stamp",
      },
      {
        number: "03",
        heading: "For the Gulf's Luxury Market",
        paragraphs: [
          "Based in Dubai, serving the Gulf's luxury market. We understand the region's pace, climate and standard of finish — and we bring Italian craftsmanship that answers all three.",
        ],
        media: null,
      },
    ],
  },
  ar: {
    eyebrow: "لماذا إمبريوم",
    headline: "ليست مجرد أقمشة، بل ضمان للمنشأ.",
    mapAlt: "خريطة توضيحية لمسار الشحن من إيطاليا إلى الإمارات والخليج",
    stampAlt: "ختم شهادة صُنِع في إيطاليا 100%",
    items: [
      {
        number: "01",
        heading: "من المصدر مباشرة",
        paragraphs: [
          "نشتري من المصانع لا من الوسطاء — ونزورها بأنفسنا. كل مجموعة تبدأ في إيطاليا، من حوارات في صالات الإنتاج مع من ينسجون ما نبيعه.",
          "من تلك المصانع يسلك القماش طريقًا واحدًا: من إيطاليا إلى الإمارات وعبر الخليج. شريك واحد، وسلسلة عهدة واحدة، ولا شيء مجهول بين النول ومشروعك. ولأن لا وسيط بيننا وبين المصانع، يتحول هذا المنشأ إلى أفضلية — فالتوريد المباشر يجعلنا في موقع تنافسي حقيقي.",
        ],
        media: "map",
      },
      {
        number: "02",
        heading: "خبرة معتمدة في «صُنِع في إيطاليا»",
        paragraphs: [
          "تقود إمبريوم خبيرة معتمدة في «صُنِع في إيطاليا». المنشأ هنا ليس ادعاءً على بطاقة — بل منهج عمل: نتحقق من مكان صناعة القماش وطريقتها وصانعها قبل أن يصل إليك.",
        ],
        media: "stamp",
      },
      {
        number: "03",
        heading: "لسوق الفخامة في الخليج",
        paragraphs: [
          "من دبي، نخدم سوق الفخامة في الخليج. نفهم إيقاع المنطقة ومناخها ومعاييرها في الإتقان — ونقدّم حرفية إيطالية تلبّي الثلاثة معًا.",
        ],
        media: null,
      },
    ],
  },
};

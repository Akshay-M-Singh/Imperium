import type { CollectionsData } from "@/types/collections";
import type { Locale } from "@/lib/i18n";

// Collections — the four curated collections (client-confirmed, resolving
// PRD D-01 in favour of curated collections; DESIGN.md §9.04). `tags` stay
// on the model for a future filterable library even though the cards
// render `tagline`. Photography is the client's real delivery; every CTA
// routes to #contact by client decision (see the asset-integration spec
// in docs/superpowers/specs/). Localized 2026-07-14 (arabic-version branch,
// task 7): `en` is the client-approved copy above, unchanged; `ar` is a
// first-pass Arabic draft, not yet native-reviewed — see AR review gate.

export const collectionsSection: Record<
  Locale,
  { eyebrow: string; headline: string; carouselAria: string }
> = {
  en: {
    eyebrow: "Our collections",
    headline: "Fabric with a story.",
    carouselAria: "Collection panels",
  },
  ar: {
    eyebrow: "مجموعاتنا",
    headline: "أقمشة تحمل قصة.",
    carouselAria: "لوحات المجموعات",
  },
};

export const collections: Record<Locale, CollectionsData> = {
  en: [
    {
      id: "tessuti-italiani",
      tags: ["LINEN", "SILK", "WOOL", "COTTON"],
      title: "Tessuti Italiani",
      titleItalic: true,
      tagline: "For those who don't compromise.",
      body: "The foundation of the house: linens, silks, wools and cottons sourced from Italian mills we know by name. Fabric for work that carries your label.",
      cta: { label: "Contact Us Now", href: "#contact" },
      image: {
        src: "/images/fabrics/tessuti-italiani.png",
        alt: "Draped Italian jacquard in warm rose and gold, with a fringed selvedge and a black Made in Italy label.",
      },
    },
    {
      id: "pezzi-unici",
      tags: ["RARE", "LIMITED", "ONE OF A KIND"],
      tagAccent: "oro-antico",
      title: "Pezzi Unici",
      titleItalic: true,
      // 🟡 Team-derived from the tag strip — the client specified taglines
      // only for the other three cards. Swap if Sofia supplies one.
      tagline: "Rare, limited, one of a kind.",
      body: "Small runs, discontinued weaves, single bolts. When a piece is gone, it is gone — which is precisely the point.",
      cta: { label: "Contact Us Now", href: "#contact" },
      image: {
        src: "/images/fabrics/pezzi-unici.png",
        alt: "Gold and midnight-blue floral brocade with a Limited Edition 01 of 50 card.",
      },
    },
    {
      id: "ospitalita-di-lusso",
      tags: ["HOSPITALITY", "BESPOKE"],
      title: "Ospitalità di Lusso",
      titleItalic: true,
      tagline: "Breathability, durability, and quality.",
      body: "Contract-grade fabric for hotels, resorts and restaurants that refuse to look like it. Specified with you, sampled fast.",
      cta: { label: "Contact Us Now", href: "#contact" },
      image: {
        src: "/images/fabrics/ospitalita-di-lusso.png",
        alt: "Tailored taupe and black jackets with gold piping on Imperium-branded wooden hangers.",
      },
    },
    {
      id: "interior-exterior",
      tags: ["INTERIOR", "EXTERIOR", "CONTRACT"],
      title: "Interior & Exterior Design",
      titleItalic: false,
      tagline: "Timeless design, durability, and versatility.",
      body: "Premium Italian textiles designed for sophisticated interior and exterior spaces, bringing timeless craftsmanship to residential, commercial, and hospitality environments.",
      cta: { label: "Contact Us Now", href: "#contact" },
      image: {
        src: "/images/fabrics/interior-exterior.png",
        alt: "Layered neutral Italian textiles in cream and taupe beside an olive branch.",
      },
    },
  ],
  ar: [
    {
      id: "tessuti-italiani",
      tags: ["كتان", "حرير", "صوف", "قطن"],
      title: "Tessuti Italiani",
      titleItalic: true,
      tagline: "لمن لا يقبلون الحلول الوسط.",
      body: "أساس الدار: كتان وحرير وصوف وقطن من مصانع نسيج إيطالية نعرفها بالاسم. أقمشة لأعمال تحمل علامتك الخاصة.",
      cta: { label: "تواصل معنا الآن", href: "#contact" },
      image: {
        src: "/images/fabrics/tessuti-italiani.png",
        alt: "قماش جاكار إيطالي منسدل بلونَي الورد الدافئ والذهبي، مع حاشية مهدّبة وبطاقة سوداء «صُنِع في إيطاليا».",
      },
    },
    {
      id: "pezzi-unici",
      tags: ["نادر", "إصدار محدود", "فريد"],
      tagAccent: "oro-antico",
      title: "Pezzi Unici",
      titleItalic: true,
      tagline: "نادرة، محدودة، فريدة من نوعها.",
      body: "كميات صغيرة، ونسجات أُوقف إنتاجها، ولفّات وحيدة. حين تنفد القطعة فلن تعود — وهذا هو المقصود تحديدًا.",
      cta: { label: "تواصل معنا الآن", href: "#contact" },
      image: {
        src: "/images/fabrics/pezzi-unici.png",
        alt: "بروكار مزهر بالذهبي والأزرق الليلي مع بطاقة إصدار محدود 01 من 50.",
      },
    },
    {
      id: "ospitalita-di-lusso",
      tags: ["ضيافة", "حسب الطلب"],
      title: "Ospitalità di Lusso",
      titleItalic: true,
      tagline: "تهوية ومتانة وجودة.",
      body: "أقمشة بمواصفات تعاقدية للفنادق والمنتجعات والمطاعم التي ترفض أن يبدو ذلك عليها. نحدّد المواصفات معك، ونرسل العيّنات بسرعة.",
      cta: { label: "تواصل معنا الآن", href: "#contact" },
      image: {
        src: "/images/fabrics/ospitalita-di-lusso.png",
        alt: "سترات مفصّلة بدرجات الرمادي الداكن والأسود مع حواف ذهبية على علّاقات خشبية تحمل شعار إمبريوم.",
      },
    },
    {
      id: "interior-exterior",
      tags: ["داخلي", "خارجي", "تعاقدي"],
      title: "تصميم داخلي وخارجي",
      titleItalic: false,
      tagline: "تصميم خالد ومتانة وتعدّد استخدامات.",
      body: "منسوجات إيطالية فاخرة مصمّمة للمساحات الداخلية والخارجية الراقية، تنقل الحرفية الإيطالية الخالدة إلى البيئات السكنية والتجارية وقطاع الضيافة.",
      cta: { label: "تواصل معنا الآن", href: "#contact" },
      image: {
        src: "/images/fabrics/interior-exterior.png",
        alt: "طبقات من المنسوجات الإيطالية بدرجات محايدة من الكريمي والبيج إلى جانب غصن زيتون.",
      },
    },
  ],
};

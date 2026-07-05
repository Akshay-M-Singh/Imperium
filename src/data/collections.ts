import type { CollectionsData } from "@/types/collections";

// Collections — the four curated collections (client-confirmed, resolving
// PRD D-01 in favour of curated collections; DESIGN.md §9.04). `tags` stay
// on the model for a future filterable library even though the cards
// render `tagline`. Images are placeholder SVGs until the client
// photography lands (progress.md backlog).

export const collections: CollectionsData = [
  {
    id: "tessuti-italiani",
    tags: ["LINEN", "SILK", "WOOL", "COTTON"],
    title: "Tessuti Italiani",
    titleItalic: true,
    tagline: "For those who don't compromise.",
    body: "The foundation of the house: linens, silks, wools and cottons sourced from Italian mills we know by name. Fabric for work that carries your label.",
    cta: { label: "View Collection", href: "/fabrics#tessuti-italiani" },
    image: {
      src: "/images/fabrics/tessuti-italiani.svg",
      alt: "Close-up of Italian linen fabric showing natural weave texture.",
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
    cta: { label: "Contact Us", href: "#contact" },
    image: {
      src: "/images/fabrics/pezzi-unici.svg",
      alt: "Rare Italian silk shantung with subtle slub texture and warm sheen.",
    },
  },
  {
    id: "ospitalita-di-lusso",
    tags: ["HOSPITALITY", "BESPOKE"],
    title: "Ospitalità di Lusso",
    titleItalic: true,
    tagline: "Breathability, durability, and quality.",
    body: "Contract-grade fabric for hotels, resorts and restaurants that refuse to look like it. Specified with you, sampled fast.",
    cta: { label: "View Collection", href: "/fabrics#ospitalita-di-lusso" },
    image: {
      src: "/images/fabrics/ospitalita-di-lusso.svg",
      alt: "Close-up of durable Italian wool upholstery fabric with tight twill weave.",
    },
  },
  {
    id: "interior-exterior",
    tags: ["INTERIOR", "EXTERIOR", "CONTRACT"],
    title: "Interior & Exterior Design",
    titleItalic: false,
    tagline: "Timeless design, durability, and versatility.",
    body: "Premium Italian textiles designed for sophisticated interior and exterior spaces, bringing timeless craftsmanship to residential, commercial, and hospitality environments.",
    cta: { label: "View Collection", href: "/fabrics#interior-exterior" },
    image: {
      src: "/images/fabrics/interior-exterior.svg",
      alt: "Woven indoor-outdoor Italian textile with a subtle canvas stripe.",
    },
  },
];

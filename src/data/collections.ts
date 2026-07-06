import type { CollectionsData } from "@/types/collections";

// Collections — the four curated collections (client-confirmed, resolving
// PRD D-01 in favour of curated collections; DESIGN.md §9.04). `tags` stay
// on the model for a future filterable library even though the cards
// render `tagline`. Photography is the client's real delivery; every CTA
// routes to #contact by client decision (see the asset-integration spec
// in docs/superpowers/specs/).

export const collections: CollectionsData = [
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
];

import type { CollectionsData } from "@/types/collections";

// Collections — Tessuti Italiani, Pezzi Unici, Ospitalità di Lusso
// (DESIGN.md §9.04, PRD §6.5). Image paths point to /public/images/fabrics/.

export const collections: CollectionsData = [
  {
    id: "tessuti-italiani",
    tags: ["LINEN", "SILK", "WOOL", "COTTON"],
    title: "Tessuti Italiani",
    titleItalic: true,
    body: "The foundation of the house: linens, silks, wools and cottons sourced from Italian mills we know by name. Fabric for work that carries your label.",
    cta: { label: "View collection →", href: "/fabrics" },
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
    body: "Small runs, discontinued weaves, single bolts. When a piece is gone, it is gone — which is precisely the point.",
    cta: { label: "View collection →", href: "/fabrics" },
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
    body: "Contract-grade fabric for hotels and restaurants that refuse to look like it. Specified with you, sampled fast.",
    cta: { label: "Talk to us about your project →", href: "#contact" },
    image: {
      src: "/images/fabrics/ospitalita-di-lusso.svg",
      alt: "Close-up of durable Italian wool upholstery fabric with tight twill weave.",
    },
  },
];

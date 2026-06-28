import type { CollectionsData } from "@/types/collections";

// Collections — Tessuti Italiani, Pezzi Unici, Ospitalità di Lusso
// (DESIGN.md §9.04, PRD copy). Image paths point to /public/images/fabrics/.

export const collections: CollectionsData = [
  {
    id: "tessuti-italiani",
    tags: ["LINEN", "SILK", "WOOL", "COTTON"],
    title: "Tessuti Italiani",
    titleItalic: true,
    body: "Placeholder copy. Final copy from the PRD lands here during the content pass.",
    cta: { label: "View collection", href: "#collections" },
    image: { src: "/images/fabrics/tessuti-italiani.jpg", alt: "" },
  },
  {
    id: "pezzi-unici",
    tags: ["RARE", "LIMITED", "ONE OF A KIND"],
    tagAccent: "oro-antico",
    title: "Pezzi Unici",
    titleItalic: true,
    body: "Placeholder copy.",
    cta: { label: "View collection", href: "#collections" },
    image: { src: "/images/fabrics/pezzi-unici.jpg", alt: "" },
  },
  {
    id: "ospitalita-di-lusso",
    tags: ["HOSPITALITY", "BESPOKE"],
    title: "Ospitalità di Lusso",
    titleItalic: true,
    body: "Placeholder copy.",
    cta: { label: "Talk to us about your project", href: "#contact" },
    image: { src: "/images/fabrics/ospitalita-di-lusso.jpg", alt: "" },
  },
];

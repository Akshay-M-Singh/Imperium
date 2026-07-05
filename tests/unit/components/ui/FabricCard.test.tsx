import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FabricCard } from "@/components/ui/FabricCard";
import type { CollectionCard } from "@/types/collections";

const collection: CollectionCard = {
  id: "tessuti-italiani",
  tags: ["LINEN", "SILK"],
  title: "Tessuti Italiani",
  titleItalic: true,
  tagline: "For those who don't compromise.",
  body: "The foundation of the house.",
  cta: { label: "View Collection", href: "/fabrics#tessuti-italiani" },
  image: { src: "/images/fabrics/tessuti-italiani.svg", alt: "Italian linen texture" },
};

describe("FabricCard", () => {
  it("renders the tagline beneath the image instead of the tag strip", () => {
    render(<FabricCard collection={collection} />);

    expect(screen.getByText("For those who don't compromise.")).toBeInTheDocument();
    expect(screen.queryByText("LINEN · SILK")).not.toBeInTheDocument();
  });

  it("renders the collection title, body and CTA", () => {
    render(<FabricCard collection={collection} />);

    expect(screen.getByRole("heading", { name: "Tessuti Italiani" })).toBeInTheDocument();
    expect(screen.getByText("The foundation of the house.")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /View Collection/ });
    expect(link).toHaveAttribute("href", "/fabrics#tessuti-italiani");
  });

  it("renders the collection image with alt text", () => {
    render(<FabricCard collection={collection} />);

    const image = screen.getByAltText("Italian linen texture");
    expect(image).toBeInTheDocument();
  });
});

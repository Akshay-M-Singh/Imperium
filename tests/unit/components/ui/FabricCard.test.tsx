import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FabricCard } from "@/components/ui/FabricCard";
import type { CollectionCard } from "@/types/collections";

const collection: CollectionCard = {
  id: "tessuti-italiani",
  tags: ["LINEN", "SILK"],
  title: "Tessuti Italiani",
  titleItalic: true,
  body: "The foundation of the house.",
  cta: { label: "View collection →", href: "/fabrics" },
  image: { src: "/images/fabrics/tessuti-italiani.svg", alt: "Italian linen texture" },
};

describe("FabricCard", () => {
  it("renders the collection title, body and CTA", () => {
    render(<FabricCard collection={collection} />);

    expect(screen.getByRole("heading", { name: "Tessuti Italiani" })).toBeInTheDocument();
    expect(screen.getByText("The foundation of the house.")).toBeInTheDocument();
    expect(screen.getByText("LINEN · SILK")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "View collection →" });
    expect(link).toHaveAttribute("href", "/fabrics");
  });

  it("renders the collection image with alt text", () => {
    render(<FabricCard collection={collection} />);

    const image = screen.getByAltText("Italian linen texture");
    expect(image).toBeInTheDocument();
  });
});

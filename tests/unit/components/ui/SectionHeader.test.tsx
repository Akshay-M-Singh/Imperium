import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeader } from "@/components/ui/SectionHeader";

describe("SectionHeader", () => {
  it("renders eyebrow and an h2 headline with the given id", () => {
    render(
      <SectionHeader
        eyebrow="Our collections"
        headline="Fabric with a story."
        id="collections-heading"
      />,
    );
    expect(screen.getByText("Our collections")).toBeInTheDocument();
    const heading = screen.getByRole("heading", { level: 2, name: "Fabric with a story." });
    expect(heading).toHaveAttribute("id", "collections-heading");
  });

  it("renders an h3 when as='h3'", () => {
    render(<SectionHeader eyebrow="Contact" headline="Let's talk fabric." as="h3" />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Let's talk fabric." }),
    ).toBeInTheDocument();
  });

  it("renders the subline only when provided", () => {
    const { rerender } = render(
      <SectionHeader eyebrow="Contact" headline="Headline" subline="A subline." />,
    );
    expect(screen.getByText("A subline.")).toBeInTheDocument();
    rerender(<SectionHeader eyebrow="Contact" headline="Headline" />);
    expect(screen.queryByText("A subline.")).not.toBeInTheDocument();
  });
});

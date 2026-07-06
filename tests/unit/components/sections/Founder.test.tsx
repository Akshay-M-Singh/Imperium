import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Founder } from "@/components/sections/Founder";
import { founder } from "@/data/founder";

describe("Founder", () => {
  it("renders the client-approved headline and all three paragraphs", () => {
    render(<Founder />);
    expect(
      screen.getByRole("heading", { name: "Proudly Italian. Purposefully Global." }),
    ).toBeInTheDocument();
    for (const paragraph of founder.bioParagraphs) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    expect(founder.bioParagraphs).toHaveLength(3);
    expect(founder.bioParagraphs[0]).toMatch(/^Born and raised in Italy/);
  });

  it("renders the client-approved quote with attribution", () => {
    render(<Founder />);
    expect(
      screen.getByText(
        "Every fabric I select represents not only Italian craftsmanship, but my own commitment to excellence.",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Sofia Mazza, Founder/).length).toBeGreaterThan(0);
  });

  it("renders the certification scan below the story", () => {
    render(<Founder />);
    expect(screen.getByRole("img", { name: "Made in Italy Certification" })).toBeInTheDocument();
    expect(screen.queryByTestId("certification-placeholder")).toBeNull();
    expect(screen.getByText("Made in Italy Certification")).toBeInTheDocument();
  });

  it("still renders the portrait", () => {
    render(<Founder />);
    expect(
      screen.getByAltText("Sofia Mazza, Founder of Imperium Italian Textile"),
    ).toBeInTheDocument();
  });
});

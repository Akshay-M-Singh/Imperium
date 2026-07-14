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
    for (const paragraph of founder.en.bioParagraphs) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    expect(founder.en.bioParagraphs).toHaveLength(3);
    expect(founder.en.bioParagraphs[0]).toMatch(/^Born and raised in Italy/);
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

  it("renders Arabic copy, portrait alt, and quote when locale is ar", () => {
    render(<Founder locale="ar" />);
    expect(screen.getByRole("heading", { name: founder.ar.headline })).toBeInTheDocument();
    for (const paragraph of founder.ar.bioParagraphs) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    expect(screen.getByText(founder.ar.quote)).toBeInTheDocument();
    expect(screen.getAllByText(founder.ar.quoteAttribution).length).toBeGreaterThan(0);
    expect(screen.getByAltText(founder.ar.portrait.alt)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: founder.ar.certification.caption })).toBeInTheDocument();
  });

  it("uses the locale-keyed placeholder label, not hardcoded English, when certification.src is null", () => {
    expect(founder.en.certificationPlaceholderLabel).toBe("Image to follow");
    expect(founder.ar.certificationPlaceholderLabel).toBe("الصورة قادمة قريبًا");
    expect(founder.ar.certificationPlaceholderLabel).not.toBe(
      founder.en.certificationPlaceholderLabel,
    );
  });
});

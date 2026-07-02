import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Section } from "@/components/layout/Section";

describe("Section", () => {
  it("renders a <section> landmark with its children", () => {
    render(
      <Section id="contact" ariaLabelledby="contact-heading">
        <h2 id="contact-heading">Contact</h2>
      </Section>,
    );
    const region = screen.getByRole("region", { name: "Contact" });
    expect(region.tagName).toBe("SECTION");
    expect(region).toHaveAttribute("id", "contact");
  });

  it("renders alternative semantics via the as prop", () => {
    const { container } = render(<Section as="aside">stats</Section>);
    expect(container.firstElementChild?.tagName).toBe("ASIDE");
  });

  it("defaults to <section> without id when not provided", () => {
    const { container } = render(<Section>content</Section>);
    const el = container.firstElementChild;
    expect(el?.tagName).toBe("SECTION");
    expect(el).not.toHaveAttribute("id");
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});

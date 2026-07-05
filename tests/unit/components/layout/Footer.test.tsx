import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/site";

describe("Footer", () => {
  it("renders the wordmark and the Gulf tagline", () => {
    render(<Footer />);
    expect(screen.getByText(SITE.name)).toBeInTheDocument();
    expect(screen.getByText(SITE.tagline)).toBeInTheDocument();
  });

  it("renders a year-free legal line", () => {
    const { container } = render(<Footer />);
    expect(container.textContent).toMatch(/All rights reserved/);
    expect(container.textContent).not.toMatch(/\b20\d\d\b/);
  });
});

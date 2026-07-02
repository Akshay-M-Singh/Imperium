import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextLink } from "@/components/ui/TextLink";

describe("TextLink", () => {
  it("renders an anchor with href and children", () => {
    render(<TextLink href="#contact">Request a sample →</TextLink>);
    const link = screen.getByRole("link", { name: "Request a sample →" });
    expect(link).toHaveAttribute("href", "#contact");
  });
});

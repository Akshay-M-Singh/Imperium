import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Eyebrow } from "@/components/ui/Eyebrow";

describe("Eyebrow", () => {
  it("renders its children in a span", () => {
    render(<Eyebrow>Our collections</Eyebrow>);
    const el = screen.getByText("Our collections");
    expect(el.tagName).toBe("SPAN");
  });
});

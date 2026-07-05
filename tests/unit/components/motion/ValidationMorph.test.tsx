import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ValidationMorph } from "@/components/motion/ValidationMorph";

describe("ValidationMorph", () => {
  const original = window.matchMedia;

  beforeEach(() => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    }));
  });

  afterEach(() => {
    window.matchMedia = original;
  });

  it("renders nothing in the idle state", () => {
    const { container } = render(<ValidationMorph state="idle" message="Ignored" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders an error message with alert role", () => {
    render(<ValidationMorph state="error" message="Please enter your name." />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Please enter your name.");
  });

  it("renders a success checkmark and message", () => {
    render(<ValidationMorph state="success" message="Thank you" />);
    expect(screen.getByText("Thank you")).toBeInTheDocument();
    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  it("renders the success checkmark fully drawn under reduced motion", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    }));

    render(<ValidationMorph state="success" message="Thank you" />);
    const path = document.querySelector("svg path") as SVGPathElement;
    expect(path).toBeInTheDocument();
  });
});

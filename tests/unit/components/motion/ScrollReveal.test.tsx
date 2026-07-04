import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

describe("ScrollReveal", () => {
  const original = window.matchMedia;

  beforeEach(() => {
    // jsdom lacks matchMedia; ScrollReveal uses useReducedMotion.
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
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

  it("renders its children", () => {
    render(
      <ScrollReveal>
        <span>hello</span>
      </ScrollReveal>,
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("renders children in a plain wrapper with no opacity under reduced motion", () => {
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

    const { container } = render(
      <ScrollReveal>
        <span>calm</span>
      </ScrollReveal>,
    );
    expect(screen.getByText("calm")).toBeInTheDocument();
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.opacity).toBe("");
    expect(wrapper.style.transform).toBe("");
  });

  it("supports the as prop", () => {
    const { container } = render(
      <ScrollReveal as="section">
        <span>sec</span>
      </ScrollReveal>,
    );
    expect(container.firstElementChild?.tagName).toBe("SECTION");
  });
});

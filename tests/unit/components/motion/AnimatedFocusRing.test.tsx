import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AnimatedFocusRing } from "@/components/motion/AnimatedFocusRing";

describe("AnimatedFocusRing", () => {
  const original = window.matchMedia;

  beforeEach(() => {
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

  it("renders the focus ring element when motion is enabled", async () => {
    render(<AnimatedFocusRing />);
    await waitFor(() => {
      expect(screen.getByTestId("animated-focus-ring")).toBeInTheDocument();
    });
  });

  it("renders nothing under reduced motion", () => {
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

    const { container } = render(<AnimatedFocusRing />);
    expect(container.firstElementChild).toBeNull();
  });
});

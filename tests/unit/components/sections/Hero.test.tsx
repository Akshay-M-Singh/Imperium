import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/sections/Hero";
import { SITE } from "@/lib/site";

function installMatchMedia(matches: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const mql: MediaQueryList = {
    matches,
    media: "",
    onchange: null,
    addEventListener: (_: string, listener: (e: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_: string, listener: (e: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    },
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  } as unknown as MediaQueryList;
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(mql));
}

describe("Hero", () => {
  beforeEach(() => {
    installMatchMedia(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("leads with the brand as the page's only h1", () => {
    render(<Hero />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveAccessibleName(/Imperium/i);
    if (SITE.logoSrc) {
      expect(screen.getByRole("img", { name: SITE.name })).toBeInTheDocument();
    }
  });

  it("places the tagline directly beneath the logo", () => {
    render(<Hero />);
    expect(screen.getByText(SITE.tagline)).toBeInTheDocument();
  });

  it("renders the Made in Italy eyebrow without a year", () => {
    const { container } = render(<Hero />);
    expect(screen.getByText("Made in Italy")).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/2026|Est\./);
  });

  it("renders the primary CTA and routes the sample link to contact", () => {
    render(<Hero />);
    const cta = screen.getByRole("link", { name: "Explore our fabrics" });
    expect(cta).toHaveAttribute("href", "#collections");
    const sample = screen.getByRole("link", { name: /Request a sample/i });
    expect(sample).toHaveAttribute("href", "#contact");
  });

  it("renders a decorative still backdrop when WebGL is unavailable", () => {
    const { container } = render(<Hero />);
    const backdrop = container.querySelector('img[src*="silk-still"]');
    expect(backdrop).toBeInTheDocument();
    expect(backdrop).toHaveAttribute("alt", "");
    expect(screen.queryByTestId("silk-hero")).toBeNull();
  });
});

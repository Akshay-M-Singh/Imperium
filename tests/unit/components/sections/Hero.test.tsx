import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/sections/Hero";

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

  it("renders the headline as a single h1", () => {
    render(<Hero />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Where Italian craft");
    expect(heading).toHaveTextContent("meets the world.");
    const allH1 = screen.getAllByRole("heading", { level: 1 });
    expect(allH1).toHaveLength(1);
  });

  it("renders the eyebrow", () => {
    render(<Hero />);
    expect(screen.getByText("Made in Italy · Est. 2026")).toBeInTheDocument();
  });

  it("renders the subline", () => {
    render(<Hero />);
    expect(
      screen.getByText(/Premium Italian fabrics — sourced from the finest mills of Italy/i),
    ).toBeInTheDocument();
  });

  it("renders the primary CTA and the sample text link", () => {
    render(<Hero />);
    const cta = screen.getByRole("link", { name: "Explore our fabrics" });
    expect(cta).toHaveAttribute("href", "#collections");
    const sample = screen.getByRole("link", { name: /Request a sample/i });
    expect(sample).toHaveAttribute("href", "#collections");
  });

  it("renders the Italia · 2026 caption", () => {
    render(<Hero />);
    expect(screen.getByText("Italia · 2026")).toBeInTheDocument();
  });

  it("renders a video element with a poster pointing at a hero image", () => {
    render(<Hero />);
    const video = document.querySelector("video");
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("poster");
    const poster = video!.getAttribute("poster") ?? "";
    expect(poster).toMatch(/\/images\/hero\/hero-(desktop|mobile)\.svg$/);
  });

  it("does not attach a video src under reduced motion (static poster)", () => {
    installMatchMedia(true);
    render(<Hero />);
    const video = document.querySelector("video");
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("poster");
    expect(video).not.toHaveAttribute("src");
  });
});

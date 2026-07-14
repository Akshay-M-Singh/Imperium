import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Collections } from "@/components/sections/Collections";
import { collectionsSection } from "@/data/collections";

describe("Collections", () => {
  const original = window.matchMedia;

  beforeEach(() => {
    // Reduced motion on + narrow viewport → the static scroll-snap branch
    // renders in jsdom (no ResizeObserver, no sticky pinning needed).
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

  it("renders the section header", () => {
    render(<Collections />);
    expect(screen.getByText("Our collections")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Fabric with a story." })).toBeInTheDocument();
  });

  it("renders all four collection panels", () => {
    render(<Collections />);
    for (const name of [
      "Tessuti Italiani",
      "Pezzi Unici",
      "Ospitalità di Lusso",
      "Interior & Exterior Design",
    ]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
  });

  it("keeps the approved taglines and hospitality copy", () => {
    render(<Collections />);
    expect(screen.getByText("For those who don't compromise.")).toBeInTheDocument();
    expect(screen.getByText("Breathability, durability, and quality.")).toBeInTheDocument();
    expect(screen.getByText(/hotels, resorts and restaurants/)).toBeInTheDocument();
  });

  it("routes every collection card to the contact section", () => {
    const links = render(<Collections />).getAllByRole("link", { name: /Contact Us Now/ });
    expect(links).toHaveLength(4);
    for (const link of links) {
      expect(link).toHaveAttribute("href", "#contact");
    }
  });

  it("renders Arabic section strings when locale is ar", () => {
    render(<Collections locale="ar" />);
    expect(screen.getByText(collectionsSection.ar.headline)).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: collectionsSection.ar.carouselAria }),
    ).toBeInTheDocument();
  });

  it("unmounts cleanly", () => {
    const { unmount } = render(<Collections />);
    expect(() => unmount()).not.toThrow();
  });
});

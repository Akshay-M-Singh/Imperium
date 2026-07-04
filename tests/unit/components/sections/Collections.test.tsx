import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Collections } from "@/components/sections/Collections";

describe("Collections", () => {
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

  it("renders the section header", () => {
    render(<Collections />);
    expect(screen.getByText("Our collections")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Fabric with a story." })).toBeInTheDocument();
  });

  it("renders all three collection cards", () => {
    render(<Collections />);
    expect(screen.getByRole("heading", { name: "Tessuti Italiani" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pezzi Unici" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ospitalità di Lusso" })).toBeInTheDocument();
  });
});

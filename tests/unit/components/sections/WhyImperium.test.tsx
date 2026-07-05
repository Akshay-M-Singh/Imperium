import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhyImperium } from "@/components/sections/WhyImperium";

describe("WhyImperium", () => {
  it("renders exactly the three client-approved principles", () => {
    render(<WhyImperium />);
    for (const heading of [
      "Direct From the Source",
      "Made in Italy Expertise",
      "For the Gulf's Luxury Market",
    ]) {
      expect(screen.getByRole("heading", { level: 3, name: heading })).toBeInTheDocument();
    }
    expect(screen.queryByText(/always available/i)).toBeNull();
  });

  it("reserves the Italy→Gulf map and stamp placeholders", () => {
    render(<WhyImperium />);
    expect(screen.getByTestId("map-placeholder")).toBeInTheDocument();
    expect(screen.getByTestId("stamp-placeholder")).toBeInTheDocument();
  });

  it("alternates media placement between rows", () => {
    const { container } = render(<WhyImperium />);
    const rows = container.querySelectorAll("[data-row]");
    expect(rows).toHaveLength(3);
    expect(rows[1]!.className).toMatch(/reversed/);
  });
});

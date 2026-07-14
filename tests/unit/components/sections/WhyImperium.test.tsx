import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhyImperium } from "@/components/sections/WhyImperium";
import { whyImperium } from "@/data/pillars";

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

  it("renders the real Italy→Gulf route map and Made in Italy stamp", () => {
    render(<WhyImperium />);
    expect(screen.getByTestId("map-media")).toBeInTheDocument();
    expect(screen.getByTestId("stamp-media")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /route map from Italy to the UAE and the Gulf/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /Made in Italy certification stamp/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/in production|to follow/i)).toBeNull();
  });

  it("alternates media placement between rows", () => {
    const { container } = render(<WhyImperium />);
    const rows = container.querySelectorAll("[data-row]");
    expect(rows).toHaveLength(3);
    expect(rows[1]!.className).toMatch(/reversed/);
  });

  it("renders Arabic headings and headline when locale is ar", () => {
    render(<WhyImperium locale="ar" />);
    expect(screen.getByRole("heading", { name: whyImperium.ar.headline })).toBeInTheDocument();
    for (const item of whyImperium.ar.items) {
      expect(screen.getByRole("heading", { level: 3, name: item.heading })).toBeInTheDocument();
    }
  });

  it("uses locale-keyed alt text for the map and stamp images, not hardcoded English", () => {
    render(<WhyImperium locale="ar" />);
    expect(screen.getByRole("img", { name: whyImperium.ar.mapAlt })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: whyImperium.ar.stampAlt })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: whyImperium.en.mapAlt })).toBeNull();
    expect(screen.queryByRole("img", { name: whyImperium.en.stampAlt })).toBeNull();
  });
});

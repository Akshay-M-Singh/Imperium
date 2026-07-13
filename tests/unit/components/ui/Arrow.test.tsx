import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Arrow } from "@/components/ui/Arrow";

describe("Arrow", () => {
  it("renders a decorative arrow hidden from the accessibility tree", () => {
    const { container } = render(<Arrow />);
    const arrow = container.querySelector("span");
    expect(arrow).toHaveTextContent("→");
    expect(arrow).toHaveAttribute("aria-hidden", "true");
  });
});

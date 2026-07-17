import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SilkFabricBackground } from "@/components/silk/fabric/SilkFabricBackground";

describe("SilkFabricBackground (static)", () => {
  it("renders only the static silk poster image", () => {
    const { getByTestId } = render(<SilkFabricBackground />);
    const wrap = getByTestId("silk-fabric-background");
    const imgs = wrap.querySelectorAll("img");
    expect(imgs).toHaveLength(1);
    expect(imgs[0]).toHaveAttribute("src", "/images/hero/silk/silk-3840.jpg");
    expect(imgs[0]).toHaveAttribute("alt", "");
  });

  it("does not mount a WebGL canvas", () => {
    const { getByTestId } = render(<SilkFabricBackground />);
    const wrap = getByTestId("silk-fabric-background");
    expect(wrap.querySelector("canvas")).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { coverUv } from "@/components/silk/fabric/coverUv";

const TEX = 5120 / 2880; // 1.777…

describe("coverUv", () => {
  it("is identity when aspects match", () => {
    const { scale, offset } = coverUv(TEX, TEX);
    expect(scale[0]).toBeCloseTo(1);
    expect(scale[1]).toBeCloseTo(1);
    expect(offset[0]).toBeCloseTo(0);
    expect(offset[1]).toBeCloseTo(0);
  });

  it("crops width (never squashes) on a portrait phone", () => {
    const { scale, offset } = coverUv(390 / 844, TEX);
    expect(scale[1]).toBeCloseTo(1); // full height used
    expect(scale[0]).toBeCloseTo(390 / 844 / TEX); // narrow horizontal window
    expect(offset[0]).toBeCloseTo((1 - scale[0]) / 2); // centred crop
  });

  it("crops height on an ultrawide viewport", () => {
    const { scale, offset } = coverUv(21 / 9, TEX);
    expect(scale[0]).toBeCloseTo(1);
    expect(scale[1]).toBeCloseTo(TEX / (21 / 9));
    expect(offset[1]).toBeCloseTo((1 - scale[1]) / 2);
  });
});

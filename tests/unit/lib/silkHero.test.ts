import { describe, it, expect, vi } from "vitest";
import { canRenderSilkHero } from "@/lib/silkHero";

vi.mock("@/lib/connection", () => ({
  isSlowConnection: vi.fn(() => false),
}));

import { isSlowConnection } from "@/lib/connection";
const mockSlowConn = vi.mocked(isSlowConnection);

describe("canRenderSilkHero", () => {
  it("returns true when WebGL2 is available, motion is allowed, and connection is fast", () => {
    mockSlowConn.mockReturnValue(false);
    expect(canRenderSilkHero(false, true)).toBe(true);
  });

  it("returns false when reduced motion is preferred", () => {
    mockSlowConn.mockReturnValue(false);
    expect(canRenderSilkHero(true, true)).toBe(false);
  });

  it("returns false when WebGL2 is unavailable", () => {
    mockSlowConn.mockReturnValue(false);
    expect(canRenderSilkHero(false, false)).toBe(false);
  });

  it("returns false on a slow connection", () => {
    mockSlowConn.mockReturnValue(true);
    expect(canRenderSilkHero(false, true)).toBe(false);
  });

  it("returns false when all conditions are unfavourable", () => {
    mockSlowConn.mockReturnValue(true);
    expect(canRenderSilkHero(true, false)).toBe(false);
  });

  it("returns false when WebGL2 is unavailable even with fast connection", () => {
    mockSlowConn.mockReturnValue(false);
    expect(canRenderSilkHero(false, false)).toBe(false);
  });
});

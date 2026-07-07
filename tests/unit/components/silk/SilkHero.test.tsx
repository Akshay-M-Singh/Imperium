import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SilkHero } from "@/components/silk/SilkHero";
import { getWebglCapability } from "@/lib/webgl";

vi.mock("@/lib/webgl", () => ({
  getWebglCapability: vi.fn(),
}));

vi.mock("next/dynamic", () => ({
  default: () => {
    function MockSilkCanvas() {
      return <div data-testid="mock-silk-canvas" />;
    }
    return MockSilkCanvas;
  },
}));

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

describe("SilkHero", () => {
  beforeEach(() => {
    installMatchMedia(false);
    vi.mocked(getWebglCapability).mockReturnValue({ webgl2: true, halfFloatFbo: true });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("attempts the live canvas when WebGL2, motion and the kill switch all allow it", () => {
    render(<SilkHero />);
    expect(screen.getByTestId("mock-silk-canvas")).toBeInTheDocument();
  });

  it("falls back to the static poster when WebGL2 is unavailable", () => {
    vi.mocked(getWebglCapability).mockReturnValue({ webgl2: false, halfFloatFbo: false });
    render(<SilkHero />);
    expect(screen.queryByTestId("mock-silk-canvas")).not.toBeInTheDocument();
  });

  it("falls back to the static poster under reduced motion, even with WebGL2 available", () => {
    installMatchMedia(true);
    render(<SilkHero />);
    expect(screen.queryByTestId("mock-silk-canvas")).not.toBeInTheDocument();
  });

  it("falls back to the static poster when the NEXT_PUBLIC_SILK_HERO kill switch is off", () => {
    vi.stubEnv("NEXT_PUBLIC_SILK_HERO", "off");
    render(<SilkHero />);
    expect(screen.queryByTestId("mock-silk-canvas")).not.toBeInTheDocument();
  });

  it("always renders the poster image regardless of which tier is active", () => {
    render(<SilkHero />);
    expect(document.querySelector("img")).not.toBeNull();
  });
});

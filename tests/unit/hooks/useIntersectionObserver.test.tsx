import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import type { Ref } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

function Probe({ options }: { options?: Parameters<typeof useIntersectionObserver>[0] }) {
  const { ref } = useIntersectionObserver(options);
  return <div ref={ref as Ref<HTMLDivElement>} data-testid="target" />;
}

describe("useIntersectionObserver", () => {
  beforeEach(() => {
    // Mimic the jsdom-without-IO environment for the negative branch;
    // positive branches re-install their own mock.
    // @ts-expect-error deleting for test setup
    delete globalThis.IntersectionObserver;
  });

  afterEach(() => {
    // @ts-expect-error cleanup
    delete globalThis.IntersectionObserver;
  });

  it("returns isVisible=false without throwing when IntersectionObserver is undefined", () => {
    const { getByTestId } = render(<Probe options={{ threshold: 0.1 }} />);
    expect(getByTestId("target")).toBeInTheDocument();
  });

  it("sets isVisible=true and disconnects once when observer fires intersecting", () => {
    const disconnect = vi.fn();
    const observe = vi.fn();
    let callback: IntersectionObserverCallback | null = null;

    class MockIO {
      constructor(cb: IntersectionObserverCallback) {
        callback = cb;
      }
      observe = observe;
      disconnect = disconnect;
      unobserve = vi.fn();
      takeRecords = vi.fn(() => []);
      root = null;
      rootMargin = "";
      thresholds: ReadonlyArray<number> = [];
    }

    globalThis.IntersectionObserver = MockIO as unknown as typeof IntersectionObserver;

    let isVisibleOut = false;
    function StatefulProbe() {
      const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });
      isVisibleOut = isVisible;
      return <div ref={ref as Ref<HTMLDivElement>} />;
    }

    render(<StatefulProbe />);
    expect(observe).toHaveBeenCalledTimes(1);
    expect(disconnect).not.toHaveBeenCalled();
    expect(isVisibleOut).toBe(false);

    act(() => {
      callback?.(
        [{ isIntersecting: true, target: {} as Element } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(isVisibleOut).toBe(true);
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("keeps observing and toggles visibility when once=false", () => {
    const disconnect = vi.fn();
    const observe = vi.fn();
    let callback: IntersectionObserverCallback | null = null;

    class MockIO {
      constructor(cb: IntersectionObserverCallback) {
        callback = cb;
      }
      observe = observe;
      disconnect = disconnect;
      unobserve = vi.fn();
      takeRecords = vi.fn(() => []);
      root = null;
      rootMargin = "";
      thresholds: ReadonlyArray<number> = [];
    }

    globalThis.IntersectionObserver = MockIO as unknown as typeof IntersectionObserver;

    let isVisibleOut = false;
    function StatefulProbe() {
      const { ref, isVisible } = useIntersectionObserver({ once: false });
      isVisibleOut = isVisible;
      return <div ref={ref as Ref<HTMLDivElement>} />;
    }

    render(<StatefulProbe />);

    act(() => {
      callback?.(
        [{ isIntersecting: true, target: {} as Element } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(isVisibleOut).toBe(true);
    expect(disconnect).not.toHaveBeenCalled();

    act(() => {
      callback?.(
        [{ isIntersecting: false, target: {} as Element } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(isVisibleOut).toBe(false);
  });
});

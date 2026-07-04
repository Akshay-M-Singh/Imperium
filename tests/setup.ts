import "@testing-library/jest-dom/vitest";

// jsdom does not implement IntersectionObserver. Framer Motion's whileInView
// and useIntersectionObserver both rely on it. Install a no-op stub so render
// never throws; individual tests may override the global to drive callbacks.
if (typeof globalThis.IntersectionObserver === "undefined") {
  class IntersectionObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
    root: Element | null = null;
    rootMargin = "";
    thresholds: ReadonlyArray<number> = [];
  }
  globalThis.IntersectionObserver =
    IntersectionObserverStub as unknown as typeof IntersectionObserver;
}

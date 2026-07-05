"use client";

// EmblaContainer — swipeable carousel wrapper (MOTION_SPEC.md §3.5).
// Mobile-first, single slide per view on desktop too.
// touch-action: pan-y on the track. Config in src/lib/constants.ts.

import {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { motion } from "framer-motion";
import { EMBLA_OPTIONS } from "@/lib/constants";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CarouselContext } from "./CarouselSlide";
import styles from "./EmblaContainer.module.css";

export interface EmblaContainerProps {
  children: ReactNode;
}

export function EmblaContainer({ children }: EmblaContainerProps): ReactNode {
  const reduced = useReducedMotion();
  const [emblaRef, api] = useEmblaCarousel(EMBLA_OPTIONS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const slideCount = useMemo(() => Children.count(children), [children]);

  useEffect(() => {
    if (!api) return;

    const onSelect = (emblaApi: EmblaCarouselType) => {
      const index = emblaApi.selectedScrollSnap();
      setActiveIndex(index);
      setAnnouncement(`Slide ${index + 1} of ${slideCount}`);
    };

    api.on("select", onSelect);
    onSelect(api);

    return () => {
      api.off("select", onSelect);
    };
  }, [api, slideCount]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!api) return;

      switch (event.key) {
        case "ArrowLeft":
          api.scrollPrev();
          event.preventDefault();
          break;
        case "ArrowRight":
          api.scrollNext();
          event.preventDefault();
          break;
        case "Home":
          api.scrollTo(0);
          event.preventDefault();
          break;
        case "End":
          api.scrollTo(slideCount - 1);
          event.preventDefault();
          break;
      }
    },
    [api, slideCount],
  );

  const contextValue = useMemo(() => ({ activeIndex, slideCount }), [activeIndex, slideCount]);

  return (
    <CarouselContext.Provider value={contextValue}>
      <div
        className={styles.root}
        role="region"
        aria-roledescription="carousel"
        aria-label="Collections carousel"
        onKeyDown={handleKeyDown}
      >
        <div className={styles.viewport} ref={emblaRef}>
          <div className={styles.track}>{children}</div>
        </div>

        <div className={styles.pagination} role="tablist" aria-label="Slide pagination">
          {Array.from({ length: slideCount }, (_, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                type="button"
                className={styles.dot}
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? "true" : undefined}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollTo(i)}
              >
                {isActive && (
                  <motion.span
                    layoutId="carousel-dot"
                    className={styles.dotBackground}
                    transition={reduced ? { duration: 0 } : springs.soft}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className={styles.announcement} aria-live="polite" aria-atomic="true">
          {announcement}
        </div>
      </div>
    </CarouselContext.Provider>
  );
}

export default EmblaContainer;

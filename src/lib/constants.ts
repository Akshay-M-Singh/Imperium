// Constants — breakpoints, routes, motion durations for JS consumption.
// CSS counterparts live in src/app/globals.css. Keep both in sync.

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  desktopXl: 1440,
} as const;

export const ROUTES = {
  home: "/",
  about: "/about",
  contact: "/contact",
} as const;

// Spring presets are re-exported from lib/motion.ts (single source of truth).
// Duration tokens mirror --motion-duration-* in globals.css for JS consumers.
export const MOTION_DURATIONS = {
  instant: 0.15,
  fast: 0.25,
  base: 0.4,
  slow: 0.8,
  cinematic: 1.2,
} as const;

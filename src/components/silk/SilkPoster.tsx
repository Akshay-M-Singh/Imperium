"use client";

// SilkPoster — the universal fallback (design spec §0, §3.7 step 1):
// no WebGL2, reduced motion, save-data/slow connection, or the
// NEXT_PUBLIC_SILK_HERO kill switch all resolve here. It is the exact
// resting-frame composition the live shader renders, minus motion.
//
// Known gap (tracked in progress.md): these are still the pre-existing
// flat-champagne SVG placeholders used as the video poster, not a real
// export of the shader's resting drape. Phase 2's "export the poster"
// testing step (spec §4) calls for `?silkFreeze` captures to replace
// these once the live look is calibrated — see silk/README.md.

import styles from "./SilkPoster.module.css";

const DESKTOP_POSTER = "/images/hero/hero-desktop.svg";
const MOBILE_POSTER = "/images/hero/hero-mobile.svg";

export interface SilkPosterProps {
  isDesktop: boolean;
}

export function SilkPoster({ isDesktop }: SilkPosterProps) {
  const src = isDesktop ? DESKTOP_POSTER : MOBILE_POSTER;
  // Plain <img>, not next/image: next.config.ts does not set
  // `images.dangerouslyAllowSVG`, and this is a fixed local asset that
  // needs no responsive srcset/optimization.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" aria-hidden="true" className={styles.poster} />;
}

export default SilkPoster;

// Static silk hero backdrop. The interactive WebGL silk canvas was
// removed (client direction 2026-07-18) — the hero now shows only the
// baked silk still. The retired canvas/plane/material/shader files in
// this folder are left un-imported and recoverable via git, matching the
// convention for the earlier retired SilkHero module.

import { SILK_FABRIC_CONFIG } from "./fabric.config";
import styles from "./SilkFabricBackground.module.css";

export function SilkFabricBackground() {
  return (
    <div className={styles.wrap} data-testid="silk-fabric-background">
      {/* Plain img on purpose: this asset must never pass through an
          optimizer (client brief). It is also the LCP image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SILK_FABRIC_CONFIG.texture.posterSrc}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className={styles.poster}
      />
    </div>
  );
}

export default SilkFabricBackground;

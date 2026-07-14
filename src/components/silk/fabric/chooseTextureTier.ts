import { SILK_FABRIC_CONFIG } from "./fabric.config";

const DPR_CAP = SILK_FABRIC_CONFIG.render.dprCap;

export interface TextureTier {
  src: string;
  width: number;
  height: number;
}

/**
 * Smallest shipped tier whose width covers cssWidth × min(dpr, 2.5),
 * clamped by the GPU's MAX_TEXTURE_SIZE. maxTextureSize=0 (unknown /
 * probe failed) degrades to the smallest tier — safe, never broken.
 */
export function chooseTextureTier(
  cssWidth: number,
  devicePixelRatio: number,
  maxTextureSize: number,
): TextureTier {
  const tiers = SILK_FABRIC_CONFIG.texture.tiers;
  if (maxTextureSize <= 0) return tiers[0];

  const needed = cssWidth * Math.min(devicePixelRatio, DPR_CAP);
  const allowed = tiers.filter((t) => t.width <= maxTextureSize);
  if (allowed.length === 0) return tiers[0];

  for (const tier of allowed) {
    if (tier.width >= needed) return tier;
  }
  return allowed[allowed.length - 1];
}

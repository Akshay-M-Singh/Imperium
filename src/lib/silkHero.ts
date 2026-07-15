import { isSlowConnection } from "./connection";

export function canRenderSilkHero(reducedMotion: boolean, webgl2Available: boolean): boolean {
  return webgl2Available && !reducedMotion && !isSlowConnection();
}

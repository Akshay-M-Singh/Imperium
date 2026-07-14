/** object-fit: cover for texture UVs. Crop, never stretch (client brief). */
export function coverUv(
  planeAspect: number,
  textureAspect: number,
): { scale: [number, number]; offset: [number, number] } {
  if (planeAspect > textureAspect) {
    // viewport is wider than the texture: full width, crop top/bottom
    const sy = textureAspect / planeAspect;
    return { scale: [1, sy], offset: [0, (1 - sy) / 2] };
  }
  // viewport is narrower: full height, crop left/right (centred keeps the
  // calm zone behind the centred wordmark)
  const sx = planeAspect / textureAspect;
  return { scale: [sx, 1], offset: [(1 - sx) / 2, 0] };
}

// simulation.vert.ts — trivial fullscreen-quad pass-through for the
// ping-pong simulation pass (design spec §2.2.1). The quad geometry is a
// 2x2 PlaneGeometry (vertices already span NDC -1..1), so no projection
// matrix is needed.

export const simulationVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

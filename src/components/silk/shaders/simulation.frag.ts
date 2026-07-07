// simulation.frag.ts — the damped spring-membrane wave equation (design
// spec §2.2.1 "Simulation"). Advances a ping-pong RG state texture
// (height, velocity) by one timestep per frame. Over-damping + slow
// propagation = tension and settle, never ripples — this is what
// separates "silk" from "water" alongside the elongated brush below.

export const simulationFragmentShader = /* glsl */ `
  uniform sampler2D uPrevState;
  uniform vec2 uPointer;
  uniform vec2 uPointerVelocity;
  uniform float uPointerActive;
  uniform float uDt;
  uniform float uWaveSpeed;
  uniform float uDamping;
  uniform float uBrushRadius;
  uniform float uBrushElongation;
  uniform float uBrushStrength;
  uniform vec2 uTexel;

  varying vec2 vUv;

  void main() {
    vec2 state = texture2D(uPrevState, vUv).rg;
    float height = state.x;
    float velocity = state.y;

    float hL = texture2D(uPrevState, vUv - vec2(uTexel.x, 0.0)).r;
    float hR = texture2D(uPrevState, vUv + vec2(uTexel.x, 0.0)).r;
    float hD = texture2D(uPrevState, vUv - vec2(0.0, uTexel.y)).r;
    float hU = texture2D(uPrevState, vUv + vec2(0.0, uTexel.y)).r;
    // The discrete Laplacian must be divided by the grid spacing squared
    // (dx^2) to approximate the continuous operator — omitting this was a
    // real bug caught in browser testing: without it, the effective wave
    // speed is scaled up by 1/dx^2 (~65,000x at a 256px sim resolution),
    // blowing straight through the CFL stability limit for an explicit
    // scheme. The visible symptom was a persistent checkerboard grid
    // across the whole surface — the textbook signature of numerical
    // instability in a finite-difference wave/diffusion solver, not a
    // shading or texture bug.
    float dx2 = uTexel.x * uTexel.x;
    float laplacian = (hL + hR + hD + hU - 4.0 * height) / dx2;

    velocity += laplacian * uWaveSpeed * uWaveSpeed * uDt;
    velocity -= uDamping * velocity * uDt;
    // Belt-and-braces clamp: keeps a still-unstable combination of tuned
    // constants (silk.config.ts) from ever blowing up to NaN/Infinity and
    // corrupting the feedback texture permanently.
    velocity = clamp(velocity, -4.0, 4.0);

    if (uPointerActive > 0.5) {
      vec2 toFrag = vUv - uPointer;
      float speed = length(uPointerVelocity);
      vec2 dir = speed > 0.0001 ? uPointerVelocity / speed : vec2(1.0, 0.0);
      vec2 perp = vec2(-dir.y, dir.x);
      float along = dot(toFrag, dir);
      float across = dot(toFrag, perp);
      // Elongate the brush along the drag direction as speed rises — folds
      // form perpendicular to the stroke, the detail that reads as cloth
      // rather than a rubber membrane.
      float elong = mix(1.0, uBrushElongation, clamp(speed * 8.0, 0.0, 1.0));
      float d2 = (along * along) / (elong * elong) + across * across;
      float brush = exp(-d2 / (uBrushRadius * uBrushRadius))
        * uBrushStrength * clamp(speed * 12.0, 0.0, 1.0);
      velocity -= brush * uDt * 12.0;
    }

    height += velocity * uDt;

    gl_FragColor = vec4(height, velocity, 0.0, 1.0);
  }
`;

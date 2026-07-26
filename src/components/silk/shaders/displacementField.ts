export const displacementVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const splatFragment = /* glsl */ `
precision highp float;

varying vec2 vUv;
uniform sampler2D uPrev;
uniform vec2 uCursorPos;
uniform float uIntensity;
uniform float uRadius;

void main() {
  vec2 diff = vUv - uCursorPos;
  float dist2 = dot(diff, diff);
  float splat = exp(-dist2 / (uRadius * uRadius)) * uIntensity;
  float prev = texture2D(uPrev, vUv).r;
  gl_FragColor = vec4(prev + splat, 0.0, 0.0, 1.0);
}
`;

export const dampingFragment = /* glsl */ `
precision highp float;

varying vec2 vUv;
uniform sampler2D uInput;
uniform float uDamping;
uniform vec2 uTexelSize;

void main() {
  float c  = texture2D(uInput, vUv).r;
  float l  = texture2D(uInput, vUv - vec2(uTexelSize.x, 0.0)).r;
  float r  = texture2D(uInput, vUv + vec2(uTexelSize.x, 0.0)).r;
  float t  = texture2D(uInput, vUv + vec2(0.0, uTexelSize.y)).r;
  float b  = texture2D(uInput, vUv - vec2(0.0, uTexelSize.y)).r;

  float blurred = (c * 4.0 + l + r + t + b) / 8.0;
  float result = blurred * uDamping;

  gl_FragColor = vec4(result, 0.0, 0.0, 1.0);
}
`;

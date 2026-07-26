export const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uDisplacement;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uCursorPos;
uniform float uTimeSinceLastMove;

const vec3 CHAMPAGNE_BASE = vec3(0.38, 0.29, 0.17);
const vec3 HIGHLIGHT      = vec3(0.82, 0.70, 0.48);
const vec3 SHEEN          = vec3(0.58, 0.48, 0.32);

float folds(vec2 uv, float t) {
  float d1 = sin(uv.x * 1.5 + sin(uv.y * 1.1 + t * 0.04) * 0.6) * 0.5 + 0.5;
  float d2 = sin(uv.y * 1.8 + uv.x * 0.6 + cos(uv.x * 0.7 + t * 0.03) * 0.5) * 0.5 + 0.5;
  float d3 = sin((uv.x + uv.y) * 1.3 + uv.x * 0.4 + t * 0.02) * 0.5 + 0.5;
  return d1 * 0.40 + d2 * 0.35 + d3 * 0.25;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 aUV = vec2(uv.x * aspect, uv.y);

  float t = uTime * 0.15;

  // ── 0. SAMPLE DISPLACEMENT FIELD ───────────────────────────────────
  float disp = texture2D(uDisplacement, uv).r;

  // ── 1. FOLD DEPTH ───────────────────────────────────────────────────
  float fold = folds(aUV * 2.8, t);

  // ── 2. FOLD NORMALS (distorted by displacement) ─────────────────────
  float eps = 0.003;
  float fL = folds(aUV * 2.8 - vec2(eps, 0.0), t);
  float fR = folds(aUV * 2.8 + vec2(eps, 0.0), t);
  float fD = folds(aUV * 2.8 - vec2(0.0, eps), t);
  float fU = folds(aUV * 2.8 + vec2(0.0, eps), t);

  vec3 N = normalize(vec3(
    (fR - fL) * 5.0 + disp * 0.2,
    (fU - fD) * 5.0 + disp * 0.2,
    1.0
  ));

  // ── 3. UV DISPLACEMENT (fabric draping + cursor shimmer) ─────────────
  vec2 texUV = aUV * 0.5 + N.xy * 0.06;

  // ── 4. SAMPLE TEXTURE ───────────────────────────────────────────────
  vec3 texel = texture2D(uTexture, texUV).rgb;

  // ── 5. COLOR GRADE: convert to grayscale, apply champagne tint ──────
  float luma = dot(texel, vec3(0.299, 0.587, 0.114));
  vec3 color = CHAMPAGNE_BASE * (0.45 + luma * 1.4);

  // ── 6. FOLD SHADOW/HIGHLIGHT (boosted by displacement) ──────────────
  float foldMod = mix(0.65, 1.20, fold + disp * 0.12);
  color *= foldMod;

  // ── 7. LIGHTING ─────────────────────────────────────────────────────
  vec3 lightDir = normalize(vec3(0.35, 0.55, 1.0));
  vec3 viewDir  = vec3(0.0, 0.0, 1.0);
  vec3 halfVec  = normalize(lightDir + viewDir);

  float NdL = max(dot(N, lightDir), 0.0);
  float NdH = max(dot(N, halfVec), 0.0);
  float NdV = max(dot(N, viewDir), 0.0);

  // ── 8. WARD ANISOTROPIC SPECULAR ────────────────────────────────────
  vec3 threadDir = vec3(1.0, 0.0, 0.0);
  vec3 bitangent = normalize(cross(N, threadDir));
  vec3 tangent   = normalize(cross(bitangent, N));

  float TdH = dot(tangent, halfVec);
  float BdH = dot(bitangent, halfVec);

  float ax = 0.15;
  float ay = 0.45;

  float ward = exp(-2.0 * (
    (TdH * TdH) / (ax * ax) +
    (BdH * BdH) / (ay * ay)
  )) / (3.14159 * ax * ay * max(NdL * NdV, 0.001));

  float specAniso = ward * 0.25;

  // ── 9. FRESNEL SHEEN (boosted by displacement) ──────────────────────
  float fresnel = pow(1.0 - NdV, 3.5) * 0.30 * (1.0 + disp * 0.8);

  // ── 10. COMPOSITE ───────────────────────────────────────────────────
  float ambient = 0.65 + 0.35 * NdL;
  color *= ambient;

  color += HIGHLIGHT * specAniso * (1.0 + disp * 0.5);
  color += SHEEN * fresnel;

  // ── 11. VIGNETTE ────────────────────────────────────────────────────
  float vignette = 1.0 - 0.22 * pow(length(uv - 0.5) * 1.3, 2.0);
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}
`;

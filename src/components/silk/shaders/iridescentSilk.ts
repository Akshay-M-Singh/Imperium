export const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uCursorPos;
uniform float uTimeSinceLastMove;
uniform vec2 uResolution;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;
  vec2 aUV = vec2(uv.x * aspect, uv.y);

  float tFreq = 180.0;
  float halfFreq = tFreq * 0.5;

  float warpT = smoothstep(0.3, 0.7, sin(aUV.x * tFreq));
  float weftT = smoothstep(0.3, 0.7, sin(aUV.y * tFreq));

  float interlace = smoothstep(0.3, 0.7, sin(aUV.x * halfFreq) * sin(aUV.y * halfFreq) * 0.5 + 0.5);
  float weaveH = mix(warpT, weftT, interlace);

  float fabricNoise = fbm(aUV * 20.0);
  weaveH = mix(weaveH, fabricNoise, 0.15);

  vec3 baseDark = vec3(0.11, 0.07, 0.04);
  vec3 baseMid = vec3(0.17, 0.12, 0.08);
  vec3 baseCrest = vec3(0.22, 0.16, 0.10);
  vec3 baseColor = mix(baseDark, baseMid, weaveH * 0.5);
  baseColor = mix(baseColor, baseCrest, pow(weaveH, 2.0) * 0.3);
  baseColor += vec3(0.015, 0.01, 0.005) * fabricNoise;

  float tStr = 3.5;
  float wNx = cos(aUV.x * tFreq) * tStr * (1.0 - interlace);
  float wNy = cos(aUV.y * tFreq) * tStr * interlace;
  float nEps = 0.008;
  float nNx = (fbm((aUV + vec2(nEps, 0.0)) * 20.0) - fbm((aUV - vec2(nEps, 0.0)) * 20.0)) * 1.5;
  float nNy = (fbm((aUV + vec2(0.0, nEps)) * 20.0) - fbm((aUV - vec2(0.0, nEps)) * 20.0)) * 1.5;
  vec3 pNormal = normalize(vec3(wNx + nNx, wNy + nNy, 1.0));

  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  float NdotV = max(dot(pNormal, viewDir), 0.0);
  float fresnel = pow(1.0 - NdotV, 3.5);

  vec3 iridA = vec3(0.831, 0.722, 0.525);
  vec3 iridB = vec3(0.722, 0.565, 0.439);
  float iridPhase = sin(fresnel * 6.28318 + uTime * 0.08 + weaveH * 3.0) * 0.5 + 0.5;
  vec3 iridColor = mix(iridA, iridB, iridPhase);

  vec3 sheenDir = normalize(vec3(0.5, 0.3, 1.0));
  float sheen = pow(max(dot(pNormal, sheenDir), 0.0), 8.0) * 0.12;

  vec2 cursorAspect = vec2(uCursorPos.x * aspect, uCursorPos.y);
  float cDist = distance(aUV, cursorAspect);
  float lightRadius = 0.35;
  float light = smoothstep(lightRadius, 0.0, cDist);
  light = pow(light, 1.8) * 0.55;
  vec3 lightColor = vec3(1.0, 0.957, 0.839);

  float ripple = sin(cDist * 36.0 - uTime * 2.5) * exp(-uTimeSinceLastMove * 0.6);
  ripple *= smoothstep(lightRadius * 1.2, 0.0, cDist) * 0.12;
  ripple *= smoothstep(3.0, 0.0, uTimeSinceLastMove);

  float ambient = 0.72 + 0.28 * max(dot(pNormal, normalize(vec3(0.2, 0.4, 1.0))), 0.0);

  vec3 color = baseColor * ambient;
  color += iridColor * fresnel * 0.45;
  color += vec3(0.30, 0.22, 0.15) * sheen;
  color += lightColor * light;
  color += iridColor * 0.5 * ripple;

  float vignette = 1.0 - 0.25 * pow(length(uv - 0.5) * 1.4, 2.0);
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}
`;

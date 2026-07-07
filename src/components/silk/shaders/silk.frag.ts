// silk.frag.ts — the shading model (design spec §2.2.3 "Finish" +
// §3.2 lighting). Composes the named terms from lighting.ts; this file is
// the "recipe," lighting.ts is the "ingredients."

export const silkFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uSheenHighlight;
  uniform vec3 uLitSilk;
  uniform vec3 uBase;
  uniform vec3 uDeepFold;
  uniform vec3 uDeepFoldCool;
  uniform float uDeepFoldCoolAmount;
  uniform vec3 uGlintBias;

  uniform vec3 uKeyDir;
  uniform vec3 uKeyColor;
  uniform float uKeyIntensity;
  uniform vec3 uFillDir;
  uniform vec3 uFillColor;
  uniform float uFillIntensity;
  uniform float uWrapDiffuse;
  uniform float uAnisotropySpread;
  uniform float uSheenWidth;
  uniform float uCurvatureAoStrength;

  uniform float uWeaveFrequency;
  uniform float uWeaveAmplitude;
  uniform float uWeaveMoireFadeStart;

  uniform float uGrainAmount;
  uniform float uDitherAmount;
  uniform float uVignetteStrength;
  uniform float uVignetteRadius;

  uniform vec2 uCalmZoneCenter;
  uniform float uCalmZoneRadius;
  uniform float uCalmZoneSpecularFactor;
  uniform float uAspect;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vHeight;
  varying vec3 vThreadDir;

  // -- lighting.ts functions inlined by SilkMaterial.ts above this block --

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = vec3(0.0, 0.0, 1.0);
    vec3 keyDir = normalize(uKeyDir);
    vec3 fillDir = normalize(uFillDir);

    float diffuseKey = wrapDiffuse(n, keyDir, uWrapDiffuse);
    float diffuseFill = wrapDiffuse(n, fillDir, uWrapDiffuse);

    float spec = anisotropicSpecular(n, vThreadDir, v, keyDir, uAnisotropySpread);
    float sheen = charlieSheen(n, v, uSheenWidth);
    float ao = curvatureAo(n, uCurvatureAoStrength);

    // The calm zone protects the wordmark physically: less specular energy
    // as well as less displacement (§3.5).
    float calmDist = length((vUv - uCalmZoneCenter) * vec2(uAspect, 1.0));
    float calmMask = smoothstep(uCalmZoneRadius, uCalmZoneRadius + 0.15, calmDist);
    float calmSpecFactor = mix(uCalmZoneSpecularFactor, 1.0, calmMask);
    spec *= calmSpecFactor;
    sheen *= calmSpecFactor;

    // Thread-scale weave micro-detail, visible only where light rakes
    // (i.e. gated by the sheen/spec terms), faded out as screen-space
    // frequency rises to avoid moire (§3.4).
    float weave = sin(vUv.x * uWeaveFrequency) * sin(vUv.y * uWeaveFrequency);
    float screenFreq = fwidth(vUv.x) * uWeaveFrequency;
    float moireFade = 1.0 - smoothstep(uWeaveMoireFadeStart, 1.0, screenFreq);
    weave *= uWeaveAmplitude * moireFade * clamp(spec + sheen, 0.0, 1.0);

    // Height-based colour ramp: crests toward lit silk, folds toward the
    // warm shadow with a cool (Blu Notte) undertone in the deepest creases
    // — the couture warm-light/cool-shadow grade (§3.3).
    float t = clamp(vHeight * 1.6 + 0.5, 0.0, 1.0);
    vec3 base = mix(uDeepFold, uBase, smoothstep(0.0, 0.5, t));
    base = mix(base, uLitSilk, smoothstep(0.4, 0.85, t));
    base = mix(base, uDeepFoldCool, uDeepFoldCoolAmount * (1.0 - smoothstep(0.0, 0.3, t)));

    vec3 lit = base * (diffuseKey * uKeyColor * uKeyIntensity + diffuseFill * uFillColor * uFillIntensity);
    lit *= ao;
    lit += uSheenHighlight * spec * uKeyIntensity;
    lit += uGlintBias * sheen * 0.4;
    lit += weave * uSheenHighlight;

    // Grade: dither + grain (mandatory — pale gradients band on 8-bit
    // displays without this) + vignette.
    lit += (ditherNoise(gl_FragCoord.xy) - 0.5) * (uDitherAmount / 255.0);
    lit += (ditherNoise(gl_FragCoord.xy * 1.7 + uTime) - 0.5) * uGrainAmount;
    lit *= vignette(vUv, uVignetteStrength, uVignetteRadius);

    gl_FragColor = vec4(lit, 1.0);
  }
`;

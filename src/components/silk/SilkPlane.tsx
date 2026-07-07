"use client";

// SilkPlane — the mesh + material + per-frame uniform updates (design
// spec §2.2.2 "Surface"). Only mounted inside the live WebGL tier; the
// poster tier never imports this file (kept out of the initial bundle via
// SilkHero's dynamic import).

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { SilkMaterial } from "./SilkMaterial";
import { SILK_CONFIG } from "./silk.config";

export interface SilkPlaneProps {
  // A ref, not a value: the simulation ping-pongs between two textures
  // every frame, and refs don't trigger a re-render — reading
  // `simTextureRef.current` fresh inside useFrame (rather than closing
  // over a snapshot passed as a prop value) is what keeps this in sync.
  simTextureRef: React.RefObject<THREE.Texture | null>;
}

function applyStaticUniforms(material: InstanceType<typeof SilkMaterial>) {
  const { drape, idle, touch, color, lighting, weave, grade } = SILK_CONFIG;

  material.uFoldDepth = drape.foldDepth;
  material.uFoldDirection = (drape.foldDirectionDeg * Math.PI) / 180;
  material.uWeightBias = drape.weightBias;
  material.uPlateauRadius = drape.plateauRadius;
  material.uPlateauSoftness = drape.plateauSoftness;
  material.uPlateauFlatten = drape.plateauFlatten;

  material.uIdleAmplitude = idle.driftAmplitude;
  material.uIdlePeriods.set(...idle.driftPeriodsSec);
  material.uBreathAmplitude = idle.breathAmplitude;

  material.uCalmZoneRadius = touch.calmZoneRadius;
  material.uCalmZoneDisplacementFactor = touch.calmZoneDisplacementFactor;
  material.uCalmZoneSpecularFactor = touch.calmZoneSpecularFactor;
  material.uDisplacementCeiling = touch.displacementCeiling;

  material.uSheenHighlight.set(color.sheenHighlight);
  material.uLitSilk.set(color.litSilk);
  material.uBase.set(color.base);
  material.uDeepFold.set(color.deepFold);
  material.uDeepFoldCool.set(color.deepFoldCoolBias);
  material.uDeepFoldCoolAmount = color.deepFoldCoolAmount;
  material.uGlintBias.set(color.glintBias);

  material.uKeyColor.set(lighting.keyColor);
  material.uKeyIntensity = lighting.keyIntensity;
  material.uFillColor.set(lighting.fillColor);
  material.uFillIntensity = lighting.fillIntensity;
  material.uWrapDiffuse = lighting.wrapDiffuse;
  material.uAnisotropySpread = lighting.anisotropySpread;
  material.uSheenWidth = lighting.sheenWidth;
  material.uCurvatureAoStrength = lighting.curvatureAoStrength;

  const keyAz = (lighting.keyAzimuthDeg * Math.PI) / 180;
  const keyEl = (lighting.keyElevationDeg * Math.PI) / 180;
  material.uKeyDir.set(
    Math.cos(keyEl) * Math.cos(keyAz),
    Math.cos(keyEl) * Math.sin(keyAz),
    Math.sin(keyEl),
  );
  const fillAz = (lighting.fillAzimuthDeg * Math.PI) / 180;
  const fillEl = (lighting.fillElevationDeg * Math.PI) / 180;
  material.uFillDir.set(
    Math.cos(fillEl) * Math.cos(fillAz),
    Math.cos(fillEl) * Math.sin(fillAz),
    Math.sin(fillEl),
  );

  material.uWeaveFrequency = weave.frequency;
  material.uWeaveAmplitude = weave.amplitude;
  material.uWeaveMoireFadeStart = weave.moireFadeStart;

  material.uGrainAmount = grade.grainAmount;
  material.uDitherAmount = grade.ditherAmount;
  material.uVignetteStrength = grade.vignetteStrength;
  material.uVignetteRadius = grade.vignetteRadius;
}

export function SilkPlane({ simTextureRef }: SilkPlaneProps) {
  const { viewport } = useThree();
  const material = useMemo(() => new SilkMaterial(), []);
  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 160, 160), []);
  const entryStartRef = useRef<number | null>(null);

  useEffect(() => {
    applyStaticUniforms(material);
    material.uEntryProgress = 0;
    return () => material.dispose();
  }, [material]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (entryStartRef.current === null) entryStartRef.current = t;

    material.uTime = t;
    material.uAspect = viewport.width / viewport.height;
    const simTexture = simTextureRef.current;
    material.uSimTexture = simTexture;
    material.uSimEnabled = simTexture ? 1 : 0;

    const entryElapsedMs = (t - entryStartRef.current) * 1000;
    material.uEntryProgress = Math.min(1, entryElapsedMs / SILK_CONFIG.entry.waveDurationMs);

    const cyclePos = t % SILK_CONFIG.idle.breathIntervalSec;
    material.uBreathEnvelope =
      cyclePos < SILK_CONFIG.idle.breathDurationSec
        ? Math.sin((cyclePos / SILK_CONFIG.idle.breathDurationSec) * Math.PI)
        : 0;
  });

  return (
    <mesh geometry={geometry} scale={[viewport.width, viewport.height, 1]}>
      <primitive object={material} attach="material" />
    </mesh>
  );
}

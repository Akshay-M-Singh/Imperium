"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { SilkFabricMaterial } from "./SilkFabricMaterial";
import { coverUv } from "./coverUv";
import { SILK_FABRIC_CONFIG } from "./fabric.config";

export interface SilkFabricPlaneProps {
  texture: THREE.Texture;
  simTextureRef: React.RefObject<THREE.Texture | null>;
  simEnabled: boolean;
}

export function SilkFabricPlane({ texture, simTextureRef, simEnabled }: SilkFabricPlaneProps) {
  const { viewport } = useThree();
  const material = useMemo(() => new SilkFabricMaterial(), []);
  const geometry = useMemo(() => {
    const [segX, segY] = SILK_FABRIC_CONFIG.render.planeSegments;
    return new THREE.PlaneGeometry(1, 1, segX, segY);
  }, []);

  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useEffect(() => {
    const { motion, sheen, calm, texture: tex } = SILK_FABRIC_CONFIG;
    material.uMap = texture;
    material.uSimEnabled = simEnabled ? 1 : 0;
    // World units: viewport.height is the visible height at z=0.
    material.uDisplacement = viewport.height * motion.displacementCeiling;
    material.uInPlaneTug = motion.inPlaneTug;
    material.uWarpStrength = motion.warpStrength;
    material.uIdleWarp = motion.idleWarp;
    material.uIdleAmplitude = viewport.height * motion.displacementCeiling * motion.idleAmplitude;
    material.uIdlePeriods.set(motion.idlePeriodsSec[0], motion.idlePeriodsSec[1]);
    material.uSheenStrength = sheen.strength;
    material.uSheenPower = sheen.power;
    material.uNormalScale = sheen.normalScale;
    material.uHeightShade = sheen.heightShade;
    material.uLightAzimuth = sheen.baseAzimuthRad;
    material.uSheenMigration = sheen.migrationRadPerSec;
    material.uCalmCenter.set(calm.center[0], calm.center[1]);
    material.uCalmRadius = calm.radius;
    material.uCalmFactor = calm.factor;

    const { scale, offset } = coverUv(viewport.width / viewport.height, tex.aspect);
    material.uUvScale.set(scale[0], scale[1]);
    material.uUvOffset.set(offset[0], offset[1]);
  }, [material, texture, simEnabled, viewport.width, viewport.height]);

  useFrame((state) => {
    material.uTime = state.clock.elapsedTime;
    material.uSimTexture = simTextureRef.current;
  });

  return (
    <mesh geometry={geometry} scale={[viewport.width, viewport.height, 1]}>
      <primitive object={material} attach="material" />
    </mesh>
  );
}

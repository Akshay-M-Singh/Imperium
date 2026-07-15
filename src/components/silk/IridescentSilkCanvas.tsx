"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { vertexShader, fragmentShader } from "./shaders/iridescentSilk";

interface SilkPlaneProps {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  getTimeSinceLastMove: () => number;
}

function SilkPlane({ springX, springY, getTimeSinceLastMove }: SilkPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    const u = material.uniforms;
    if (u.uTime) u.uTime.value = state.clock.elapsedTime;
    if (u.uCursorPos) u.uCursorPos.value.set(springX.get(), springY.get());
    if (u.uTimeSinceLastMove) u.uTimeSinceLastMove.value = getTimeSinceLastMove();
    if (u.uResolution && size.width > 0 && size.height > 0) {
      u.uResolution.value.set(size.width, size.height);
    }
  });

  return (
    <mesh ref={meshRef} scale={[size.width, size.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uCursorPos: { value: new THREE.Vector2(0.5, 0.5) },
          uTimeSinceLastMove: { value: 10 },
          uResolution: { value: new THREE.Vector2(size.width || 1920, size.height || 1080) },
        }}
      />
    </mesh>
  );
}

interface IridescentSilkCanvasProps {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  getTimeSinceLastMove: () => number;
}

export default function IridescentSilkCanvas({
  springX,
  springY,
  getTimeSinceLastMove,
}: IridescentSilkCanvasProps) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1] }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <SilkPlane springX={springX} springY={springY} getTimeSinceLastMove={getTimeSinceLastMove} />
    </Canvas>
  );
}

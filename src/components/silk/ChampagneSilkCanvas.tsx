"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { vertexShader, fragmentShader } from "./shaders/champagneSilk";
import { displacementVertex, splatFragment, dampingFragment } from "./shaders/displacementField";

function getMaxDpr(): number {
  if (typeof window === "undefined") return 1.5;
  const w = window.innerWidth;
  if (w < 768) return 1.0;
  if (w < 1024) return 1.25;
  return 1.5;
}

function getFboSize(): number {
  if (typeof window === "undefined") return 256;
  const w = window.innerWidth;
  if (w < 768) return 128;
  if (w >= 1920 && window.devicePixelRatio >= 2) return 512;
  return 256;
}

interface PointerData {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  getTimeSinceLastMove: () => number;
  getVelocity: () => number;
  getIsIdle: () => boolean;
}

function DisplacementField({
  silkMaterialRef,
  springX,
  springY,
  getVelocity,
  getIsIdle,
}: PointerData & { silkMaterialRef: React.MutableRefObject<THREE.ShaderMaterial | null> }) {
  const { gl } = useThree();
  const fboSize = useMemo(getFboSize, []);

  const fboCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

  const targetA = useMemo(
    () =>
      new THREE.WebGLRenderTarget(fboSize, fboSize, {
        type: THREE.UnsignedByteType,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
      }),
    [fboSize],
  );

  const targetB = useMemo(
    () =>
      new THREE.WebGLRenderTarget(fboSize, fboSize, {
        type: THREE.UnsignedByteType,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
      }),
    [fboSize],
  );

  const splatMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: displacementVertex,
        fragmentShader: splatFragment,
        uniforms: {
          uPrev: { value: null },
          uCursorPos: { value: new THREE.Vector2(0.5, 0.5) },
          uIntensity: { value: 0 },
          uRadius: { value: 0.06 },
        },
      }),
    [],
  );

  const dampingMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: displacementVertex,
        fragmentShader: dampingFragment,
        uniforms: {
          uInput: { value: null },
          uDamping: { value: 0.94 },
          uTexelSize: { value: new THREE.Vector2(1 / fboSize, 1 / fboSize) },
        },
      }),
    [fboSize],
  );

  const splatScene = useMemo(() => {
    const scene = new THREE.Scene();
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), splatMaterial);
    scene.add(mesh);
    return scene;
  }, [splatMaterial]);

  const dampingScene = useMemo(() => {
    const scene = new THREE.Scene();
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), dampingMaterial);
    scene.add(mesh);
    return scene;
  }, [dampingMaterial]);

  useFrame(() => {
    const prevAutoClear = gl.autoClear;
    gl.autoClear = false;

    const velocity = getVelocity();
    const idle = getIsIdle();
    const intensity = idle ? 0 : Math.min(velocity * 0.12, 0.35);

    const su = splatMaterial.uniforms;
    if (su.uPrev) su.uPrev.value = targetB.texture;
    if (su.uCursorPos) su.uCursorPos.value.set(springX.get(), springY.get());
    if (su.uIntensity) su.uIntensity.value = intensity;

    gl.setRenderTarget(targetA);
    gl.clear();
    gl.render(splatScene, fboCamera);

    const du = dampingMaterial.uniforms;
    if (du.uInput) du.uInput.value = targetA.texture;

    gl.setRenderTarget(targetB);
    gl.clear();
    gl.render(dampingScene, fboCamera);

    gl.setRenderTarget(null);
    gl.autoClear = prevAutoClear;

    const mat = silkMaterialRef.current;
    if (mat?.uniforms?.uDisplacement) {
      mat.uniforms.uDisplacement.value = targetB.texture;
    }
  });

  return null;
}

interface SilkPlaneProps extends PointerData {
  silkMaterialRef: React.MutableRefObject<THREE.ShaderMaterial | null>;
}

function SilkPlane({ springX, springY, getTimeSinceLastMove, silkMaterialRef }: SilkPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const texture = useLoader(THREE.TextureLoader, "/images/hero/champagne-silk.jpg");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const emptyTexture = useMemo(() => {
    const t = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1, THREE.RGBAFormat);
    t.needsUpdate = true;
    return t;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    silkMaterialRef.current = material;
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
          uTexture: { value: texture },
          uDisplacement: { value: emptyTexture },
          uTime: { value: 0 },
          uCursorPos: { value: new THREE.Vector2(0.5, 0.5) },
          uTimeSinceLastMove: { value: 10 },
          uResolution: { value: new THREE.Vector2(size.width || 1920, size.height || 1080) },
        }}
      />
    </mesh>
  );
}

export default function ChampagneSilkCanvas(props: PointerData) {
  const maxDpr = useMemo(getMaxDpr, []);
  const silkMaterialRef = useRef<THREE.ShaderMaterial | null>(null);

  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1] }}
      dpr={[1, maxDpr]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
    >
      <SilkPlane {...props} silkMaterialRef={silkMaterialRef} />
      <DisplacementField {...props} silkMaterialRef={silkMaterialRef} />
    </Canvas>
  );
}

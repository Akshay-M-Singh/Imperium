"use client";

// Owns: renderer setup (DPR ≤ 2.5, sRGB out, no tone mapping), texture
// tier load + sampling config, pointer smoothing, sim wiring, context
// loss, and the diagnostics contract. Loaded only via SilkFabricBackground's
// next/dynamic(..., { ssr: false }).

import { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { useSilkPointer } from "../useSilkPointer";
import { useSilkSimulation } from "../useSilkSimulation";
import { SilkFabricPlane } from "./SilkFabricPlane";
import { chooseTextureTier } from "./chooseTextureTier";
import { SILK_FABRIC_CONFIG } from "./fabric.config";
import { getWebglCapability } from "@/lib/webgl";
import { collectSilkDiagnostics, publishSilkDiagnostics } from "./diagnostics";
import styles from "./SilkFabricCanvas.module.css";

const POINTER_SPRING = { stiffness: 55, damping: 18, mass: 0.6 };

const FABRIC_TOUCH = {
  simResolution: 256,
  waveSpeed: 0.05,
  damping: 3.4, // over-damped: no bounce, no rings (brief hard rule)
  brushRadius: SILK_FABRIC_CONFIG.motion.brushRadius,
  brushElongation: 2.6,
  brushStrength: SILK_FABRIC_CONFIG.motion.brushStrength,
};

function FabricScene({
  texture,
  simEnabled,
  smoothX,
  smoothY,
}: {
  texture: THREE.Texture;
  simEnabled: boolean;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
}) {
  const pointerRef = useSilkPointer(smoothX, smoothY);
  const simTextureRef = useSilkSimulation(pointerRef, FABRIC_TOUCH);
  return (
    <SilkFabricPlane texture={texture} simTextureRef={simTextureRef} simEnabled={simEnabled} />
  );
}

const NO_SIM_REF = { current: null } as const;

function FabricSceneIdle({
  texture,
  smoothX,
  smoothY,
}: {
  texture: THREE.Texture;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
}) {
  useSilkPointer(smoothX, smoothY);
  return <SilkFabricPlane texture={texture} simTextureRef={NO_SIM_REF} simEnabled={false} />;
}

function TextureGate({
  enableSimulation,
  smoothX,
  smoothY,
  onReady,
}: {
  enableSimulation: boolean;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
  onReady: () => void;
}) {
  const { gl, size } = useThree();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const caps = gl.capabilities;
    const tier = chooseTextureTier(size.width, window.devicePixelRatio || 1, caps.maxTextureSize);
    let disposed = false;
    new THREE.TextureLoader().load(tier.src, (tex) => {
      if (disposed) {
        tex.dispose();
        return;
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = caps.getMaxAnisotropy();
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.needsUpdate = true;
      setTexture(tex);

      publishSilkDiagnostics(
        collectSilkDiagnostics({
          cssWidth: size.width,
          cssHeight: size.height,
          devicePixelRatio: window.devicePixelRatio || 1,
          rendererPixelRatio: gl.getPixelRatio(),
          drawingBufferWidth: gl.getContext().drawingBufferWidth,
          drawingBufferHeight: gl.getContext().drawingBufferHeight,
          textureWidth: tier.width,
          textureHeight: tier.height,
          maxTextureSize: caps.maxTextureSize,
          anisotropy: tex.anisotropy,
        }),
      );
      onReady();
    });
    return () => {
      disposed = true;
    };
    // Intentionally mount-only: tier re-selection on live resize would
    // re-download textures mid-session for no visual gain.
  }, []);

  useEffect(() => () => texture?.dispose(), [texture]);

  if (!texture) return null;
  return enableSimulation ? (
    <FabricScene texture={texture} simEnabled smoothX={smoothX} smoothY={smoothY} />
  ) : (
    <FabricSceneIdle texture={texture} smoothX={smoothX} smoothY={smoothY} />
  );
}

export interface SilkFabricCanvasProps {
  isDesktop: boolean;
  enableSimulation: boolean;
  active: boolean;
  onReady: () => void;
  onContextLost: () => void;
  onContextRestored: () => void;
}

export function SilkFabricCanvas({
  isDesktop,
  enableSimulation,
  active,
  onReady,
  onContextLost,
  onContextRestored,
}: SilkFabricCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.62);
  const smoothX = useSpring(pointerX, POINTER_SPRING);
  const smoothY = useSpring(pointerY, POINTER_SPRING);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const updateFromPoint = (clientX: number, clientY: number) => {
      const rect = node.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointerX.set((clientX - rect.left) / rect.width);
      pointerY.set(1 - (clientY - rect.top) / rect.height);
    };
    const handlePointerMove = (e: PointerEvent) => updateFromPoint(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) updateFromPoint(t.clientX, t.clientY);
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [pointerX, pointerY]);

  // NOTE the DPR contract (client brief): min(devicePixelRatio, 2.5) on
  // every device class. Unlike the old SilkCanvas there is no lower iOS
  // cap by default — reduce only if Task 12's measurement demands it.
  void isDesktop;

  return (
    <div ref={containerRef} className={styles.canvasWrap} aria-hidden="true">
      <Canvas
        className={styles.canvas}
        dpr={[1, SILK_FABRIC_CONFIG.render.dprCap]}
        gl={{ antialias: false, toneMapping: THREE.NoToneMapping, alpha: false }}
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 12], fov: 20 }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            onContextLost();
          });
          gl.domElement.addEventListener("webglcontextrestored", onContextRestored);
        }}
      >
        <TextureGate
          enableSimulation={enableSimulation && getWebglCapability().halfFloatFbo}
          smoothX={smoothX}
          smoothY={smoothY}
          onReady={onReady}
        />
      </Canvas>
    </div>
  );
}

export default SilkFabricCanvas;

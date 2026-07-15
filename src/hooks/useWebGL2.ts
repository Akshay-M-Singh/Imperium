"use client";

import { useEffect, useState } from "react";

export function useWebGL2(): boolean {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2");
      setAvailable(!!gl);
    } catch {
      setAvailable(false);
    }
  }, []);

  return available;
}

export default useWebGL2;

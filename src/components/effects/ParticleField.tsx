"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";

function ParticlePoints({ seed }: { seed: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const intensity = useWorldStore((state) => state.minuteIntensity);
  const particleSpiral = useRuntimeStore((state) => state.particleSpiral);
  const portalPull = useRuntimeStore((state) => state.portalPullStrength);
  const positions = useMemo(() => {
    const values = new Float32Array(900);

    for (let i = 0; i < values.length; i += 3) {
      const index = i / 3;
      values[i] = Math.sin(index * 13.1 + seed) * 8.5;
      values[i + 1] = Math.cos(index * 7.7 + seed) * 5.2;
      values[i + 2] = Math.sin(index * 3.9 + seed) * 3.4;
    }

    return values;
  }, [seed]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) {
      return;
    }

    pointsRef.current.rotation.z = clock.elapsedTime * (0.012 + intensity * 0.035 + particleSpiral * 0.06);
    pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.13) * (0.08 + portalPull * 0.12);
    pointsRef.current.scale.setScalar(1 - portalPull * 0.08 + Math.sin(clock.elapsedTime * 2) * portalPull * 0.02);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#b9f9ff"
        size={0.035}
        transparent
        opacity={0.58}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleField() {
  const dailyMutationSeed = useWorldStore((state) => state.dailyMutationSeed);

  return (
    <div className="particle-field" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.8} />
        <ParticlePoints seed={dailyMutationSeed} />
      </Canvas>
    </div>
  );
}

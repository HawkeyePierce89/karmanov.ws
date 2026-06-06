import { createElement, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import type { Mesh } from 'three';
import { pickShape } from '../../lib/shapes';

/**
 * Faceted refractive crystal. The transmission material refracts whatever the
 * Environment in HeroCanvas emits, so the gem picks up the brand colours.
 * Per-frame work is a cheap slow spin plus an eased tilt toward the pointer.
 */
export default function Crystal() {
  const mesh = useRef<Mesh>(null);
  // Picked once on mount, so each page load/refresh shows a new shape.
  const shape = useMemo(() => pickShape(), []);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const { x, y } = state.pointer;
    m.rotation.y += delta * 0.25; // constant slow spin
    m.rotation.x += (-y * 0.4 - m.rotation.x) * Math.min(1, delta * 2);
    m.rotation.z += (x * 0.25 - m.rotation.z) * Math.min(1, delta * 2);
  });

  return (
    <mesh ref={mesh}>
      {/* random faceted geometry; detail 0 = sharp gem facets */}
      {createElement(shape.type, { args: shape.args })}
      <MeshTransmissionMaterial
        samples={6}
        resolution={256}
        thickness={1.5}
        roughness={0.12}
        transmission={0.55}
        ior={1.5}
        chromaticAberration={0.08}
        color="#7c3aed"
        attenuationColor="#a855f7"
        attenuationDistance={1.2}
      />
    </mesh>
  );
}

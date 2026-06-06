import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import type { Mesh } from 'three';

/**
 * Faceted refractive crystal. The transmission material refracts whatever the
 * Environment in HeroCanvas emits, so the gem picks up the brand colours.
 * Per-frame work is a cheap slow spin plus an eased tilt toward the pointer.
 */
export default function Crystal() {
  const mesh = useRef<Mesh>(null);

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
      {/* detail 0 = sharp gem facets */}
      <icosahedronGeometry args={[1, 0]} />
      <MeshTransmissionMaterial
        samples={6}
        resolution={256}
        thickness={1.4}
        roughness={0.05}
        transmission={1}
        ior={1.45}
        chromaticAberration={0.4}
        anisotropy={0.3}
        distortion={0.3}
        distortionScale={0.4}
        temporalDistortion={0.1}
        color="#ffffff"
        attenuationColor="#a855f7"
        attenuationDistance={1.4}
      />
    </mesh>
  );
}

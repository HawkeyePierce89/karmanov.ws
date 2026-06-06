import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import type { Mesh } from 'three';

/**
 * Distorted sphere that gently rotates toward the pointer.
 * Driven entirely on the GPU via MeshDistortMaterial; the per-frame
 * work here is a cheap eased rotation, safe for the hero island.
 */
export default function Blob() {
  const mesh = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const { x, y } = state.pointer;
    // Ease rotation toward the pointer for a soft, reactive feel.
    m.rotation.y += (x * 0.6 - m.rotation.y) * Math.min(1, delta * 2);
    m.rotation.x += (-y * 0.4 - m.rotation.x) * Math.min(1, delta * 2);
  });

  return (
    <mesh ref={mesh} scale={1.6}>
      <sphereGeometry args={[1, 128, 128]} />
      <MeshDistortMaterial
        color="#a855f7"
        emissive="#22d3ee"
        emissiveIntensity={0.15}
        roughness={0.2}
        metalness={0.45}
        distort={0.4}
        speed={1.6}
      />
    </mesh>
  );
}

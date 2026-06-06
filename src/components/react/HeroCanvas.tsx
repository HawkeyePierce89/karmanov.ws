import { useMemo } from 'react';
import { BackSide } from 'three';
import { Canvas } from '@react-three/fiber';
import { Float, Environment, Lightformer } from '@react-three/drei';
import Crystal from './Crystal';
import { pickLightPosition } from '../../lib/lighting';

/**
 * R3F island mounted over the CSS-gradient fallback in Hero.astro.
 * Default export so Astro can lazily resolve it as a client component.
 *
 * Lighting model: a single soft key light (one Lightformer "softbox") placed at
 * a random position per load, matched by a directionalLight from the same
 * direction for crisp edge specular. A very dark neutral backdrop keeps facets
 * from refracting pure black without adding the busy multi-panel shimmer.
 */
export default function HeroCanvas() {
  // One light direction, chosen once per mount → different each page load.
  const lightPos = useMemo(() => pickLightPosition(), []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={lightPos} intensity={3.5} />

      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.7}>
        <group position={[1.6, 0.1, 0]} scale={1.15}>
          <Crystal />
        </group>
      </Float>

      {/* Built once (frames={1}); the single softbox is the only env light. */}
      <Environment resolution={256} frames={1}>
        <mesh scale={100}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#1a1426" side={BackSide} />
        </mesh>
        <Lightformer form="circle" intensity={8} color="#ffffff" position={lightPos} scale={5} />
      </Environment>
    </Canvas>
  );
}

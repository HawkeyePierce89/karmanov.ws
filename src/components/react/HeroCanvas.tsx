import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import Blob from './Blob';

/**
 * R3F island mounted over the CSS-gradient fallback in Hero.astro.
 * Default export so Astro can lazily resolve it as a client component.
 */
export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#ffffff" />
      <pointLight position={[-4, -2, -3]} intensity={2} color="#22d3ee" />
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={0.9}>
        <Blob />
      </Float>
    </Canvas>
  );
}

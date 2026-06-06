import { Canvas } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import Crystal from './Crystal';

/**
 * R3F island mounted over the CSS-gradient fallback in Hero.astro.
 * Default export so Astro can lazily resolve it as a client component.
 *
 * The crystal sits to the right and modestly sized so the hero copy on the
 * left stays readable. A "city" HDR environment gives rich reflections for the
 * glass to refract; extra brand-coloured Lightformers tint the highlights.
 */
export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 5, 3]} intensity={1.2} />

      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.7}>
        <group position={[1.6, 0.1, 0]} scale={1.15}>
          <Crystal />
        </group>
      </Float>

      <Environment preset="city" />
    </Canvas>
  );
}

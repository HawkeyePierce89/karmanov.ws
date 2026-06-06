import { createElement, useEffect, useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import type { Mesh } from 'three';
import { pickShape } from '../../lib/shapes';
import { applyFriction, type Velocity } from '../../lib/spin';

/**
 * Faceted refractive crystal. The transmission material refracts whatever the
 * Environment in HeroCanvas emits, so the gem picks up the brand colours.
 *
 * Interaction is a flywheel: grab the gem and drag to spin it any direction;
 * on release the last drag delta becomes an angular velocity that keeps the
 * gem spinning and decays to a stop via `applyFriction` (frame-rate
 * independent). A light idle auto-spin runs only until the first grab so the
 * gem is never static on load.
 */

// Drag sensitivity: screen pixels -> radians of rotation.
const DRAG_K = 0.005;
// Per-frame friction/decay factor (the feel at 60fps).
const FRICTION = 0.94;
// Idle auto-spin speed (radians/sec) before the first interaction.
const IDLE_SPIN = 0.25;

export default function Crystal() {
  const mesh = useRef<Mesh>(null);
  // Picked once on mount, so each page load/refresh shows a new shape.
  const shape = useMemo(() => pickShape(), []);

  const dragging = useRef(false);
  const hasInteracted = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  // Inertia velocity in rotation units/sec; each drag move writes the latest
  // "throw" value here and useFrame consumes/decays it once the drag ends.
  const velocity = useRef<Velocity>({ x: 0, y: 0 });

  const setCursor = (cursor: string) => {
    document.body.style.cursor = cursor;
  };

  // If the island unmounts mid-drag (e.g. the client:media query stops
  // matching on resize), don't leave the page stuck on a grab/grabbing cursor.
  useEffect(() => () => {
    document.body.style.cursor = '';
  }, []);

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    dragging.current = true;
    hasInteracted.current = true;
    velocity.current = { x: 0, y: 0 };
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setCursor('grabbing');
  };

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging.current) return;
    const m = mesh.current;
    if (!m) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    m.rotation.y += dx * DRAG_K;
    m.rotation.x += dy * DRAG_K;
    // Per-second velocity for the throw; consumed/decayed by useFrame on release.
    velocity.current = { x: dy * DRAG_K * 60, y: dx * DRAG_K * 60 };
    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const endDrag = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging.current) return;
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {
      // capture may already be gone (e.g. pointerleave) — ignore.
    }
    dragging.current = false;
    // velocity already holds the latest move's throw value; useFrame takes over.
    setCursor('grab');
  };

  useFrame((_state, delta) => {
    const m = mesh.current;
    if (!m) return;
    if (!hasInteracted.current) {
      m.rotation.y += delta * IDLE_SPIN; // gentle idle spin until first grab
      return;
    }
    if (dragging.current) return; // pointer drives rotation directly
    m.rotation.x += velocity.current.x * delta;
    m.rotation.y += velocity.current.y * delta;
    velocity.current = applyFriction(velocity.current, FRICTION, delta);
  });

  return (
    <mesh
      ref={mesh}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onPointerOver={() => {
        if (!dragging.current) setCursor('grab');
      }}
      onPointerOut={() => {
        if (!dragging.current) setCursor('');
      }}
    >
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

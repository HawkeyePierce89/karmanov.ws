/**
 * Pure friction-step helper for the hero crystal's drag-to-spin inertia.
 *
 * Extracted into `src/lib/` (like `shapes.ts` / `lighting.ts`) so the decay
 * logic is unit-testable without R3F / three. `applyFriction` is a pure
 * function of its inputs — no globals, no time source — so frame-rate-
 * independent behavior can be asserted directly in Vitest.
 */

export type Velocity = { x: number; y: number };

/**
 * Velocities whose per-axis magnitude falls below this snap to exactly 0, so a
 * decaying flywheel comes to a clean stop instead of jittering forever.
 */
export const SPIN_EPSILON = 1e-4;

/**
 * Decay an angular velocity by a friction factor in a frame-rate-independent
 * way. `friction` is the per-frame decay factor that gives the intended feel at
 * 60fps (≈0.94). We raise it to the power of the number of 60fps frames the
 * elapsed `dt` (seconds) represents, so the same physical decay happens whether
 * the display runs at 30, 60, or 144Hz. Per-axis results below `SPIN_EPSILON`
 * snap to 0.
 */
export function applyFriction(vel: Velocity, friction: number, dt: number): Velocity {
  const factor = friction ** (dt * 60);
  return {
    x: snapToZero(vel.x * factor),
    y: snapToZero(vel.y * factor),
  };
}

/** Clamp a near-zero value to exactly 0 so residual velocity stops cleanly. */
export function snapToZero(v: number, epsilon = SPIN_EPSILON): number {
  return Math.abs(v) < epsilon ? 0 : v;
}

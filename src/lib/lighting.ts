/**
 * Pure light-placement helper for the hero crystal.
 *
 * Extracted into `src/lib/` (like `shapes.ts` / `github.ts`) so the logic is
 * unit-testable without R3F / three. `pickLightPosition` takes an injectable
 * `rng` for deterministic tests.
 */

export type Vec3 = [number, number, number];

/**
 * Pick a single key-light position on a sphere around the gem. The azimuth is
 * constrained to the front hemisphere (toward the camera at +Z) so the light
 * always illuminates the viewer-facing facets, varying left↔right per load. The
 * elevation is biased to the upper hemisphere so the light always reads as
 * coming from above — natural, never from below. `rng` is injectable for tests.
 */
export function pickLightPosition(rng: () => number = Math.random, radius = 6): Vec3 {
  const azimuth = rng() * Math.PI; // 0..π → keeps Z ≥ 0 (front, toward camera)
  const elevation = 0.25 + rng() * 0.9; // ~14°..66° above the horizon
  const horizontal = Math.cos(elevation) * radius;
  const x = Math.cos(azimuth) * horizontal;
  const y = Math.sin(elevation) * radius;
  const z = Math.sin(azimuth) * horizontal;
  return [x, y, z];
}

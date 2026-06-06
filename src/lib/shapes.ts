/**
 * Pure shape-selection module for the hero crystal.
 *
 * Extracted into `src/lib/` (like `github.ts`) so the selection logic is unit
 * testable without R3F / three. `pickShape` takes an injectable `rng` for
 * deterministic tests, mirroring the dependency-injection style of `github.ts`.
 */

/** A faceted geometry: the R3F intrinsic element tag plus its constructor args. */
export type Shape = { type: string; args: number[] };

/**
 * The five candidate geometries, args tuned to a common scale (≈ radius 1) so
 * the transmission material and rotation logic read the same across shapes.
 */
export const SHAPES: Shape[] = [
  { type: 'icosahedronGeometry', args: [1, 0] },
  { type: 'dodecahedronGeometry', args: [1, 0] },
  { type: 'octahedronGeometry', args: [1.15, 0] },
  { type: 'tetrahedronGeometry', args: [1.3, 0] },
  { type: 'torusKnotGeometry', args: [0.6, 0.25, 128, 16] },
];

/** Pick one shape at random. `rng` is injectable for deterministic testing. */
export function pickShape(rng: () => number = Math.random): Shape {
  return SHAPES[Math.floor(rng() * SHAPES.length)];
}

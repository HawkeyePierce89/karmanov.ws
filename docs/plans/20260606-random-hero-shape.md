# Random Shape in the Hero

## Overview
Replace the fixed `icosahedronGeometry` in the hero's 3D crystal with a random pick from 5 faceted geometries. The shape is chosen once on component mount, so on every page load/refresh the user sees a new shape. The material (`MeshTransmissionMaterial`) and rotation logic stay unchanged.

## Context
- Files involved:
  - `src/components/react/Crystal.tsx` — geometry consumer (renders the mesh).
  - `src/lib/shapes.ts` (new) — pure module: shape table + random-pick function.
  - `src/lib/shapes.test.ts` (new) — unit tests for shape selection.
- Related patterns:
  - The project unit-tests only the pure modules in `src/lib/` (see `github.ts` / `github.test.ts`); components/markup are verified via `npm run build` + `npm run check:seo`, not Vitest. So the selection logic is extracted into `src/lib/` to make it testable without R3F/three.
  - `src/lib/github.ts` is dependency-injected (it takes `now`/`fetchImpl`); by analogy `pickShape` accepts an injectable `rng = Math.random` for deterministic testing.
  - Dependency injection for R3F: the dynamic geometry tag is produced via `React.createElement(shape.type, { args: shape.args })` — R3F resolves intrinsic three elements by their string tag name, which lets us swap geometry without a switch in JSX.
- Dependencies: none added (three / @react-three/* are already in the project).

## Development Approach
- **Testing approach**: TDD for the pure module `src/lib/shapes.ts` (test → implementation), then integrate into `Crystal.tsx`.
- Complete each task fully before moving to the next.
- Tests: only for the pure shape-selection module (matches the repo convention). Component render correctness is verified via `npm run build` + `npm run check:seo`.
- **CRITICAL: every code task includes new/updated tests where the repo convention allows (pure logic only).**
- **CRITICAL: all tests must pass before starting the next task.**

## Implementation Steps

### Task 1: Pure shape-selection module

**Files:**
- Create: `src/lib/shapes.ts`
- Create: `src/lib/shapes.test.ts`

- [x] Declare type `Shape = { type: string; args: number[] }` and export a `SHAPES` array of 5 entries with args tuned to a common scale (≈ radius 1):
  - `icosahedronGeometry` args `[1, 0]`
  - `dodecahedronGeometry` args `[1, 0]`
  - `octahedronGeometry` args `[1.15, 0]`
  - `tetrahedronGeometry` args `[1.3, 0]`
  - `torusKnotGeometry` args `[0.6, 0.25, 128, 16]`
  (numbers are starting values; fine-tune visually during the build step)
- [x] Export a pure function `pickShape(rng: () => number = Math.random): Shape` returning `SHAPES[Math.floor(rng() * SHAPES.length)]`.
- [x] Write tests in `src/lib/shapes.test.ts`: `SHAPES` contains the 5 expected `type` values; all `args` are non-empty; `pickShape` with a stub rng returns a deterministic shape (values 0 and ~0.99 → boundary indices); the index never goes out of array bounds.
- [x] Run `npm test` — must pass before Task 2.

### Task 2: Integrate the random shape into Crystal

**Files:**
- Modify: `src/components/react/Crystal.tsx`

- [ ] Import `pickShape` from `../../lib/shapes` and `useMemo` / `createElement` from `react`.
- [ ] Add `const shape = useMemo(() => pickShape(), [])` — picked once on mount (new shape on each refresh).
- [ ] Replace the static `<icosahedronGeometry args={[1, 0]} />` with `createElement(shape.type, { args: shape.args })` inside `<mesh>`.
- [ ] Leave `MeshTransmissionMaterial` and the `useFrame` rotation logic unchanged.
- [ ] Run `npm test` — must pass before Task 3.

### Task 3: Verify acceptance criteria

- [ ] `npm test` — full suite green.
- [ ] `npm run check` — astro check with no type/template errors.
- [ ] `npm run build` — static build succeeds.
- [ ] `npm run check:seo` — SEO check passes (résumé stays in the server-rendered HTML).

### Task 4: Update documentation

- [ ] Update `CLAUDE.md` if the internal convention changed (note the new pure module `src/lib/shapes.ts` and that the hero geometry is now random).
- [ ] README.md needs no changes (no user-facing control/content changes).

# Drag-to-spin with inertia for the hero crystal

## Overview

Replace the crystal's current "constant slow spin + eased tilt-toward-pointer" behavior with a flywheel-style interaction: grab the gem with the mouse and spin it any direction, then on a quick flick-and-release it keeps spinning by inertia and smoothly decays to a stop (like a wheel with friction). A light idle auto-spin remains only until the first interaction so the gem is never static on load. The frame-rate-independent friction step is extracted into a pure, dependency-injected `src/lib/spin.ts` module with Vitest coverage, mirroring `shapes.ts` / `lighting.ts`.

## Context

- Files involved:
  - `src/components/react/Crystal.tsx` — rotation logic lives in `useFrame`; will gain pointer handlers + inertia refs.
  - `src/components/react/HeroCanvas.tsx` — wraps `<Crystal>` in `<Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.7}>`, whose auto-rotation would fight manual rotation.
  - `src/lib/spin.ts` (new) — pure friction-step helper.
  - `src/lib/spin.test.ts` (new) — Vitest unit tests.
- Related patterns:
  - Pure DI lib modules with default-arg injection for testability: `src/lib/shapes.ts`, `src/lib/lighting.ts`.
  - Test style: `src/lib/shapes.test.ts`, `src/lib/lighting.test.ts` (Vitest `describe`/`it`/`expect`).
  - R3F pointer events on `<mesh>` (`onPointerDown/Move/Up`) + `event.target.setPointerCapture`.
- Dependencies: none new — `@react-three/fiber`, `@react-three/drei`, `three` already present.

## Key behavior decisions

- Angular velocity stored in a ref `{ x, y }` (radians/sec equivalent). While dragging, pointer delta drives rotation directly and also feeds the velocity estimate for the "throw".
- On release, velocity carries the rotation; each frame `useFrame` applies `applyFriction` so the decay is frame-rate independent (not a raw per-frame `*= 0.94`).
- Idle auto-spin: a small constant `rotation.y` increment applies only until `hasInteracted` becomes true on first pointer-down; after that the gem moves purely from drag + inertia.
- `<Float rotationIntensity>` set to 0 so drei's auto-rotation no longer conflicts; a light `floatIntensity` (gentle bob) is kept. Cursor shows `grab`, switching to `grabbing` while dragging.

## Development Approach

- **Testing approach**: TDD-ish for the pure module (Task 1 writes `spin.ts` + its tests together and must pass before moving on); components are verified via `npm run build` + `npm run check:seo` per repo convention (no Vitest for `.tsx`/`.astro`).
- Complete each task fully before moving to the next.
- **CRITICAL: every task that changes pure logic MUST include new/updated tests.**
- **CRITICAL: all tests must pass before starting the next task.**

## Implementation Steps

### Task 1: Pure friction-step module + tests

**Files:**
- Create: `src/lib/spin.ts`
- Create: `src/lib/spin.test.ts`

- [x] Define `Velocity = { x: number; y: number }`.
- [x] Implement `applyFriction(vel, friction, dt)`: takes an angular velocity `{ x, y }`, a per-frame friction/decay factor (≈0.94, the feel at 60fps), and frame delta `dt`; returns the decayed velocity using a frame-rate-independent formula (`factor = friction ** (dt * 60)`) so the ~0.94/frame feel holds across refresh rates.
- [x] Add a snap-to-zero: if the resulting magnitude on an axis is below a small epsilon, clamp it to 0 so residual velocity stops cleanly. Export the epsilon or a helper if it keeps the code clean.
- [x] Write tests: decay reduces magnitude; a larger `dt` decays more than a smaller `dt`; `dt = 1/60` reproduces approximately the per-frame `friction` factor; velocity below epsilon snaps to exactly 0; zero velocity stays zero.
- [x] Run `npm test` — must pass before Task 2.

### Task 2: Drag-to-spin + inertia in Crystal.tsx

**Files:**
- Modify: `src/components/react/Crystal.tsx`

- [x] Add refs: `dragging` (boolean), `hasInteracted` (boolean), `lastPointer` (`{x,y}`), `velocity` (`{x,y}`).
- [x] `onPointerDown`: `e.stopPropagation()`, `e.target.setPointerCapture(e.pointerId)`, `dragging=true`, `hasInteracted=true`, zero out inertia velocity, store pointer position, set cursor `grabbing`.
- [x] `onPointerMove` (only while dragging): compute pointer delta from `lastPointer`, apply `rotation.y += dx*k`, `rotation.x += dy*k` (small sensitivity `k`); store the latest delta as the throw velocity; update `lastPointer`.
- [x] `onPointerUp` / `onPointerLeave`: `releasePointerCapture`, `dragging=false`, set inertia velocity from last delta, cursor `grab`.
- [x] `useFrame`: while dragging, skip inertia; while not dragging, apply `velocity` to rotation then decay it via `applyFriction(velocity, 0.94, delta)`. Keep a light idle `rotation.y` increment only while `!hasInteracted`.
- [x] Set cursor to `grab` on hover via `onPointerOver`/`onPointerOut` (reset to default when not dragging).
- [x] Update the file's top doc comment to describe the new drag-to-spin + inertia model (replace the "cheap slow spin plus eased tilt" description).
- [x] Build verification: `npm run build` (no Vitest for components per repo convention) — must pass before Task 3.

### Task 3: Stop Float from fighting manual rotation

**Files:**
- Modify: `src/components/react/HeroCanvas.tsx`

- [ ] Set `<Float rotationIntensity={0}>` (keep `speed` and a light `floatIntensity` for the gentle bob), so drei no longer auto-rotates the group.
- [ ] Confirm the wrapping `<group>` / mesh still receives pointer events and the gem is grabbable (Float wraps a group; pointer events bubble from the mesh).
- [ ] Run `npm run build` to confirm the island compiles.

### Task 4: Verify acceptance criteria

- [ ] `npm test` — full Vitest suite passes (includes new `spin.test.ts`).
- [ ] `npm run check` — astro type/template diagnostics pass.
- [ ] `npm run build` — static build succeeds.
- [ ] `npm run check:seo` — SEO guard passes (run after build).
- [ ] New `spin.ts` logic has 80%+ coverage via its test.

### Task 5: Update documentation

- [ ] Update `CLAUDE.md` "Non-obvious gotchas" / testing-scope notes: document the drag-to-spin interaction model, the new pure `lib/spin.ts` module (add to the unit-tested lib list alongside `github.ts`, `shapes.ts`), and that `Float rotationIntensity` is intentionally 0 to avoid conflicting with manual rotation.
- [ ] Update `README.md` only if the hero interaction is described there.

## Post-Completion (manual / not agent-automatable)

- Manually verify in `npm run dev` on a desktop (mouse, `pointer: fine`): grab + spin any direction; flick-release produces an inertial spin that decays smoothly to a stop; idle auto-spin shows on first load and stops after the first grab; cursor shows `grab` on hover and `grabbing` while dragging.

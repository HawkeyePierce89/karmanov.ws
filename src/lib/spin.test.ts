import { describe, it, expect } from 'vitest';
import { applyFriction, snapToZero, SPIN_EPSILON } from './spin';

describe('applyFriction', () => {
  it('reduces the magnitude of a non-trivial velocity', () => {
    const out = applyFriction({ x: 1, y: -2 }, 0.94, 1 / 60);
    expect(Math.abs(out.x)).toBeLessThan(1);
    expect(Math.abs(out.y)).toBeLessThan(2);
  });

  it('decays more over a larger dt than a smaller dt', () => {
    const small = applyFriction({ x: 1, y: 1 }, 0.94, 1 / 120);
    const large = applyFriction({ x: 1, y: 1 }, 0.94, 1 / 30);
    expect(large.x).toBeLessThan(small.x);
    expect(large.y).toBeLessThan(small.y);
  });

  it('reproduces approximately the per-frame friction factor at dt = 1/60', () => {
    const out = applyFriction({ x: 1, y: 1 }, 0.94, 1 / 60);
    expect(out.x).toBeCloseTo(0.94, 6);
    expect(out.y).toBeCloseTo(0.94, 6);
  });

  it('is frame-rate independent: two half-steps ≈ one full step', () => {
    const dt = 1 / 60;
    const one = applyFriction({ x: 1, y: 1 }, 0.94, dt);
    const half = applyFriction({ x: 1, y: 1 }, 0.94, dt / 2);
    const twoHalves = applyFriction(half, 0.94, dt / 2);
    expect(twoHalves.x).toBeCloseTo(one.x, 10);
    expect(twoHalves.y).toBeCloseTo(one.y, 10);
  });

  it('snaps a velocity below epsilon to exactly 0', () => {
    const tiny = SPIN_EPSILON / 2;
    const out = applyFriction({ x: tiny, y: tiny }, 0.94, 1 / 60);
    expect(out.x).toBe(0);
    expect(out.y).toBe(0);
  });

  it('keeps zero velocity at zero', () => {
    expect(applyFriction({ x: 0, y: 0 }, 0.94, 1 / 60)).toEqual({ x: 0, y: 0 });
  });

  it('eventually decays a spin to a full stop', () => {
    let vel = { x: 5, y: -3 };
    for (let i = 0; i < 1000 && (vel.x !== 0 || vel.y !== 0); i++) {
      vel = applyFriction(vel, 0.94, 1 / 60);
    }
    expect(vel).toEqual({ x: 0, y: 0 });
  });
});

describe('snapToZero', () => {
  it('clamps sub-epsilon magnitudes to exactly 0', () => {
    expect(snapToZero(SPIN_EPSILON / 2)).toBe(0);
    expect(snapToZero(-SPIN_EPSILON / 2)).toBe(0);
  });

  it('leaves above-epsilon values untouched', () => {
    expect(snapToZero(0.5)).toBe(0.5);
    expect(snapToZero(-0.5)).toBe(-0.5);
  });
});

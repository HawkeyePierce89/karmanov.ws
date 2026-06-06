import { describe, it, expect } from 'vitest';
import { pickLightPosition } from './lighting';

describe('pickLightPosition', () => {
  it('returns a 3-component vector', () => {
    expect(pickLightPosition(() => 0.5)).toHaveLength(3);
  });

  it('always places the light above the gem (positive Y)', () => {
    for (let i = 0; i < 100; i++) {
      const [, y] = pickLightPosition(() => i / 100);
      expect(y).toBeGreaterThan(0);
    }
  });

  it('keeps the light in front of the gem (Z >= 0, toward camera)', () => {
    for (let i = 0; i < 100; i++) {
      const [, , z] = pickLightPosition(() => i / 100);
      expect(z).toBeGreaterThanOrEqual(0);
    }
  });

  it('keeps the light on the sphere of the given radius', () => {
    const radius = 6;
    for (let i = 0; i < 50; i++) {
      const r = i / 50;
      const [x, y, z] = pickLightPosition(() => r, radius);
      const mag = Math.sqrt(x * x + y * y + z * z);
      expect(mag).toBeCloseTo(radius, 5);
    }
  });

  it('is deterministic for a fixed rng', () => {
    expect(pickLightPosition(() => 0, 6)).toEqual(pickLightPosition(() => 0, 6));
  });

  it('moves the light to different azimuths for different rng values', () => {
    const a = pickLightPosition(() => 0.1);
    const b = pickLightPosition(() => 0.6);
    expect(a).not.toEqual(b);
  });
});

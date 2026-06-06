import { describe, it, expect } from 'vitest';
import { SHAPES, pickShape } from './shapes';

describe('SHAPES', () => {
  it('contains the five expected geometry types', () => {
    expect(SHAPES.map((s) => s.type)).toEqual([
      'icosahedronGeometry',
      'dodecahedronGeometry',
      'octahedronGeometry',
      'tetrahedronGeometry',
      'torusKnotGeometry',
    ]);
  });

  it('gives every shape a non-empty args tuple', () => {
    for (const shape of SHAPES) {
      expect(shape.args.length).toBeGreaterThan(0);
    }
  });
});

describe('pickShape', () => {
  it('returns the first shape when rng is 0', () => {
    expect(pickShape(() => 0)).toBe(SHAPES[0]);
  });

  it('returns the last shape when rng is ~0.99', () => {
    expect(pickShape(() => 0.99)).toBe(SHAPES[SHAPES.length - 1]);
  });

  it('maps the middle of the range to a middle index', () => {
    expect(pickShape(() => 0.5)).toBe(SHAPES[2]);
  });

  it('never goes out of bounds across the [0, 1) range', () => {
    for (let i = 0; i < 100; i++) {
      const r = i / 100; // 0 .. 0.99
      const shape = pickShape(() => r);
      expect(SHAPES).toContain(shape);
    }
  });

  it('defaults to Math.random and returns a valid shape', () => {
    expect(SHAPES).toContain(pickShape());
  });
});

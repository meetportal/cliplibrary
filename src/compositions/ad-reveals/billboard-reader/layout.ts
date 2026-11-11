export type Vec3 = [number, number, number];

export const BOARD = { width: 16, height: 10, depth: 0.7, rim: 0.22 } as const;

export const FACE_Z = BOARD.depth / 2 + 0.01;

export const TOP = BOARD.height / 2;

export const GROUND_Y = -64;

export const LAMP_XS = [-5.4, -1.6, 2.2] as const;

export const READER = { x: 6.2, z: -0.05, scale: 2.95, turn: -0.3 } as const;

export const SHORE_X = -46;

export const ROAD = { from: -24, to: -9 } as const;

export const CITY_EDGE = -5;

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const seeded = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

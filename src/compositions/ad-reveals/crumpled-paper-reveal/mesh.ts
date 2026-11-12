import { random } from 'remotion';
import { clamp01, lerp } from '../../kit/motion';

export const SHEET = { width: 900, height: 1260 } as const;

const COLS = 20;
const ROWS = 28;
const CREASE_COUNT = 24;
const NOISE = 1.5;

type Crease = { nx: number; ny: number; d: number; slope: number; reach: number };

const signedSeed = (seed: string) => random(seed) * 2 - 1;

const CREASES: Crease[] = Array.from({ length: CREASE_COUNT }, (_, index) => {
  const angle = random(`crease-angle-${index}`) * Math.PI;
  return {
    nx: Math.cos(angle),
    ny: Math.sin(angle),
    d: signedSeed(`crease-offset-${index}`) * 460,
    slope:
      (0.06 + 0.14 * random(`crease-slope-${index}`)) *
      Math.sign(signedSeed(`crease-sign-${index}`)),
    reach: 36 + 110 * random(`crease-reach-${index}`),
  };
});

const creaseHeight = (x: number, y: number) =>
  CREASES.reduce((sum, crease) => {
    const distance = Math.abs(crease.nx * x + crease.ny * y - crease.d);
    return sum + crease.slope * (Math.min(distance, crease.reach) - crease.reach / 2);
  }, 0);

type Vertex = {
  fx: number;
  fy: number;
  fh: number;
  bx: number;
  by: number;
  bz: number;
  lag: number;
  phase: number;
  wobX: number;
  wobY: number;
  billow: number;
};

export type Mesh = { vertices: Vertex[]; triangles: [number, number, number][] };

const signed = signedSeed;

const makeVertex = (col: number, row: number): Vertex => {
  const u = (col / COLS) * 2 - 1;
  const v = (row / ROWS) * 2 - 1;
  const key = `crumple-${col}-${row}`;
  const edge = col === 0 || col === COLS || row === 0 || row === ROWS;
  const cellW = SHEET.width / COLS;
  const cellH = SHEET.height / ROWS;
  const jitter = edge ? 0.12 : 0.38;
  const jx = col === 0 || col === COLS ? 0.06 : jitter;
  const jy = row === 0 || row === ROWS ? 0.06 : jitter;
  const dx = u * Math.sqrt(1 - (v * v) / 2);
  const dy = v * Math.sqrt(1 - (u * u) / 2);
  const reach = 0.78 + 0.3 * random(`${key}-reach`);
  const rawX = dx * reach + 0.15 * signed(`${key}-bx`);
  const rawY = dy * reach + 0.15 * signed(`${key}-by`);
  const outside = Math.max(1, Math.hypot(rawX, rawY));
  const bx = rawX / outside;
  const by = rawY / outside;
  const rim = Math.min(1, bx * bx + by * by);
  const fx = (u * SHEET.width) / 2 + jx * cellW * signed(`${key}-fx`);
  const fy = (v * SHEET.height) / 2 + jy * cellH * signed(`${key}-fy`);
  return {
    fx,
    fy,
    fh: creaseHeight(fx, fy) + NOISE * signed(`${key}-fh`),
    bx,
    by,
    bz: Math.sqrt(1 - rim) + 0.25 * signed(`${key}-bz`),
    lag: 1 - Math.min(1, Math.hypot(u, v) / Math.SQRT2),
    phase: random(`${key}-phase`) * Math.PI * 2,
    wobX: signed(`${key}-wx`),
    wobY: signed(`${key}-wy`),
    billow: signed(`${key}-billow`),
  };
};

export const buildMesh = (): Mesh => {
  const vertices: Vertex[] = [];
  for (let row = 0; row <= ROWS; row++) {
    for (let col = 0; col <= COLS; col++) {
      vertices.push(makeVertex(col, row));
    }
  }
  const at = (col: number, row: number) => row * (COLS + 1) + col;
  const triangles: [number, number, number][] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const a = at(col, row);
      const b = at(col + 1, row);
      const c = at(col + 1, row + 1);
      const d = at(col, row + 1);
      if (random(`crumple-diag-${col}-${row}`) < 0.5) {
        triangles.push([a, b, c], [a, c, d]);
      } else {
        triangles.push([a, b, d], [b, c, d]);
      }
    }
  }
  const depth = (triangle: [number, number, number]) =>
    triangle.reduce((sum, index) => sum + (vertices[index]?.bz ?? 0), 0);
  triangles.sort((left, right) => depth(left) - depth(right));
  return { vertices, triangles };
};

export type Pose = {
  crumple: number;
  squeeze: number;
  time: number;
  wrinkles: number;
  radius: number;
  rotation: number;
  cx: number;
  cy: number;
};

export type Point3 = { x: number; y: number; z: number };

const smooth = (t: number) => t * t * (3 - 2 * t);

export const foldAt = (crumple: number, lag: number) =>
  smooth(clamp01((crumple - 0.3 * lag) / 0.7));

export const posePoints = (mesh: Mesh, pose: Pose): Point3[] => {
  const cos = Math.cos(pose.rotation);
  const sin = Math.sin(pose.rotation);
  const r = pose.radius;
  return mesh.vertices.map((vertex) => {
    const e = foldAt(pose.crumple, vertex.lag);
    const billow = 4 * e * (1 - e);
    const squeezeX = pose.squeeze * r * 0.06 * Math.sin(pose.time * 0.32 + vertex.phase);
    const squeezeY = pose.squeeze * r * 0.06 * Math.cos(pose.time * 0.27 + vertex.phase);
    const x = lerp(vertex.fx, vertex.bx * r, e) + billow * vertex.wobX * r * 0.2 + squeezeX;
    const y = lerp(vertex.fy, vertex.by * r, e) + billow * vertex.wobY * r * 0.2 + squeezeY;
    const z = lerp(vertex.fh * pose.wrinkles, vertex.bz * r, e) + billow * vertex.billow * r * 0.7;
    return { x: pose.cx + x * cos - y * sin, y: pose.cy + x * sin + y * cos, z };
  });
};

export type Light = { x: number; y: number; z: number };

export const lightAt = (phase: number, drift: number): Light => {
  const x = -0.55 + 0.22 * drift * Math.sin(phase);
  const y = -0.62 + 0.22 * drift * Math.cos(phase);
  const length = Math.hypot(x, y, 1);
  return { x: x / length, y: y / length, z: 1 / length };
};

export const facetShade = (a: Point3, b: Point3, c: Point3, light: Light): number => {
  const ux = b.x - a.x;
  const uy = b.y - a.y;
  const uz = b.z - a.z;
  const vx = c.x - a.x;
  const vy = c.y - a.y;
  const vz = c.z - a.z;
  let nx = uy * vz - uz * vy;
  let ny = uz * vx - ux * vz;
  let nz = ux * vy - uy * vx;
  const length = Math.hypot(nx, ny, nz) || 1;
  if (nz < 0) {
    nx = -nx;
    ny = -ny;
    nz = -nz;
  }
  return (nx * light.x + ny * light.y + nz * light.z) / length - light.z;
};

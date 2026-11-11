import { CITY_EDGE, GROUND_Y, ROAD, seeded } from './layout';

type Block = {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  roof: number;
  tint: number;
};

export type Tree = { x: number; z: number; size: number; tint: number };

type Car = { lane: number; z: number; tint: number };

const SPACING = 13.5;
const REACH = 950;
const CLEARING = 16;
export const ROAD_LENGTH = 1500;
export const ROAD_START = -1240;

export const LANES = [
  { x: ROAD.from + 2.6, direction: 1, speed: 0.62 },
  { x: ROAD.from + 5.2, direction: 1, speed: 0.5 },
  { x: ROAD.to - 5.2, direction: -1, speed: 0.55 },
  { x: ROAD.to - 2.6, direction: -1, speed: 0.68 },
] as const;

export const TOWER = { x: 36, z: -78, width: 15, height: 46 } as const;

const nearTower = (x: number, z: number) =>
  Math.abs(x - TOWER.x) < TOWER.width && Math.abs(z - TOWER.z) < TOWER.width;

const grove = (random: () => number, x: number, z: number): Tree[] =>
  Array.from({ length: 1 + Math.floor(random() * 3) }, () => ({
    x: x + (random() - 0.5) * 8,
    z: z + (random() - 0.5) * 8,
    size: 2.4 + random() * 1.6,
    tint: random(),
  }));

const blocked = (x: number, z: number) => {
  const distance = Math.hypot(x, z);
  return distance > REACH || distance < CLEARING || nearTower(x, z);
};

export const buildCity = () => {
  const random = seeded(7);
  const blocks: Block[] = [];
  const trees: Tree[] = [];
  for (let x = CITY_EDGE + 5; x < REACH; x += SPACING) {
    for (let z = -REACH; z < 300; z += SPACING) {
      const jitterX = (random() - 0.5) * 2.4;
      const jitterZ = (random() - 0.5) * 2.4;
      const px = x + jitterX;
      const pz = z + jitterZ;
      const roll = random();
      if (blocked(px, pz)) {
        continue;
      }
      if (roll < 0.2) {
        trees.push(...grove(random, px, pz));
        continue;
      }
      blocks.push({
        x: px,
        z: pz,
        width: 6.4 + random() * 3.2,
        depth: 6.4 + random() * 3.2,
        height: 3.4 + random() * 3.4 + (random() < 0.08 ? 5 : 0),
        roof: 1.8 + random() * 1.4,
        tint: random(),
      });
      if (random() < 0.35) {
        trees.push({
          x: px + SPACING / 2,
          z: pz + (random() - 0.5) * 6,
          size: 2 + random() * 1.4,
          tint: random(),
        });
      }
    }
  }
  const cars: Car[] = [];
  LANES.forEach((_lane, lane) => {
    let z = ROAD_START;
    while (z < ROAD_START + ROAD_LENGTH) {
      cars.push({ lane, z, tint: random() });
      z += 9 + random() * 26;
    }
  });
  const palms: Tree[] = [];
  for (let z = -1000; z < 280; z += 15 + random() * 6) {
    palms.push({ x: ROAD.from - 3, z, size: 0.85 + random() * 0.3, tint: random() });
  }
  return { blocks, trees, cars, palms, ground: GROUND_Y };
};

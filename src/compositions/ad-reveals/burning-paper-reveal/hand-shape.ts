type Vec = readonly [number, number];

const add = (a: Vec, b: Vec, scale = 1): Vec => [a[0] + b[0] * scale, a[1] + b[1] * scale];
const at = (point: Vec) => `${point[0].toFixed(1)} ${point[1].toFixed(1)}`;

const ARM: Vec = [-0.6, 0.8];
const SIDE: Vec = [ARM[1], -ARM[0]];
const WRIST_OUTER: Vec = [-140, 410];
const WRIST_INNER: Vec = [-62, 448];
const ARM_LENGTH = 1100;

export const CUFF_FROM = 18;
export const CUFF_TO = 78;
export const SLEEVE_FROM = 120;

const along = (start: Vec, distance: number) => add(start, ARM, distance);

const ARM_FLARE = 0.06;

export const ARM_PATH = [
  `M ${at(WRIST_OUTER)}`,
  `L ${at(add(along(WRIST_OUTER, ARM_LENGTH), SIDE, -ARM_FLARE * ARM_LENGTH))}`,
  `L ${at(add(along(WRIST_INNER, ARM_LENGTH), SIDE, ARM_FLARE * ARM_LENGTH))}`,
  `L ${at(WRIST_INNER)}`,
  'Z',
].join(' ');

export const PALM_PATH = [
  'M -18 188',
  'C 4 184 30 190 46 206',
  'L 46 330',
  'L -13 377',
  `C -30 400 -46 424 ${at(WRIST_INNER)}`,
  `L ${at(WRIST_OUTER)}`,
  'C -150 360 -148 280 -136 236',
  'C -124 206 -80 196 -50 194',
  'C -38 192 -28 189 -18 188',
  'Z',
].join(' ');

export const KNUCKLE_LINES = [
  'M -104 212 C -100 220 -98 228 -98 236',
  'M -74 202 C -70 210 -68 218 -68 226',
  'M -44 196 C -40 204 -38 212 -38 220',
] as const;

export const INDEX_EDGE = [
  'M -8 186',
  'C 2 184 10 192 11 204',
  'C 12 218 10 232 2 240',
  'C -2 244 -8 244 -8 240',
  'Z',
].join(' ');

const sleeveSpread = (distance: number) => ARM_FLARE * distance;

const mid = (a: Vec, b: Vec): Vec => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

export const band = (from: number, to: number, spread: number) => {
  const outerA = add(along(WRIST_OUTER, from), SIDE, -(spread + sleeveSpread(from)));
  const outerB = add(along(WRIST_OUTER, to), SIDE, -(spread + sleeveSpread(to)));
  const innerA = add(along(WRIST_INNER, from), SIDE, spread + sleeveSpread(from));
  const innerB = add(along(WRIST_INNER, to), SIDE, spread + sleeveSpread(to));
  const bow = (to - from) * 0.12;
  return [
    `M ${at(outerA)}`,
    `Q ${at(add(mid(outerA, innerA), ARM, bow))} ${at(innerA)}`,
    `L ${at(innerB)}`,
    `Q ${at(add(mid(outerB, innerB), ARM, bow))} ${at(outerB)}`,
    'Z',
  ].join(' ');
};

export const bandAxis = (from: number, to: number) => ({
  from: along(WRIST_OUTER, (from + to) / 2),
  to: along(WRIST_INNER, (from + to) / 2),
});

const THUMB_BASE: Vec = [-34, 350];
const THUMB_KNUCKLE: Vec = [52, 282];
const THUMB_TIP: Vec = [150, 244];
const BASE_HALF = 34;
const KNUCKLE_HALF = 23;
const TIP_HALF = 17;
const THUMB_STEPS = 28;

const thumbPoint = (t: number): Vec => {
  const control: Vec = [
    2 * THUMB_KNUCKLE[0] - (THUMB_BASE[0] + THUMB_TIP[0]) / 2,
    2 * THUMB_KNUCKLE[1] - (THUMB_BASE[1] + THUMB_TIP[1]) / 2,
  ];
  const u = 1 - t;
  return [
    u * u * THUMB_BASE[0] + 2 * u * t * control[0] + t * t * THUMB_TIP[0],
    u * u * THUMB_BASE[1] + 2 * u * t * control[1] + t * t * THUMB_TIP[1],
  ];
};

const halfWidth = (t: number) =>
  t < 0.5
    ? BASE_HALF + (KNUCKLE_HALF - BASE_HALF) * (t / 0.5)
    : KNUCKLE_HALF + (TIP_HALF - KNUCKLE_HALF) * ((t - 0.5) / 0.5);

const unit = (v: Vec): Vec => {
  const length = Math.hypot(v[0], v[1]) || 1;
  return [v[0] / length, v[1] / length];
};

const thumbGeometry = () => {
  const top: Vec[] = [];
  const bottom: Vec[] = [];
  for (let step = 0; step <= THUMB_STEPS; step++) {
    const t = step / THUMB_STEPS;
    const point = thumbPoint(t);
    const ahead = thumbPoint(Math.min(1, t + 0.01));
    const behind = thumbPoint(Math.max(0, t - 0.01));
    const dir = unit([ahead[0] - behind[0], ahead[1] - behind[1]]);
    const normal: Vec = [-dir[1], dir[0]];
    const half = halfWidth(t);
    top.push(add(point, normal, -half));
    bottom.push(add(point, normal, half));
  }
  const tipDir = unit([THUMB_TIP[0] - THUMB_KNUCKLE[0], THUMB_TIP[1] - THUMB_KNUCKLE[1]]);
  const tipNormal: Vec = [-tipDir[1], tipDir[0]];
  const front = add(THUMB_TIP, tipDir, TIP_HALF);
  const topTip = top.at(-1) ?? THUMB_TIP;
  const bottomTip = bottom.at(-1) ?? THUMB_TIP;
  const path = [
    `M ${top.map(at).join(' L ')}`,
    `Q ${at(add(topTip, tipDir, TIP_HALF))} ${at(front)}`,
    `Q ${at(add(bottomTip, tipDir, TIP_HALF))} ${at(bottomTip)}`,
    `L ${[...bottom].reverse().map(at).join(' L ')}`,
    'Z',
  ].join(' ');
  const knuckleDir = unit([THUMB_TIP[0] - THUMB_BASE[0], THUMB_TIP[1] - THUMB_BASE[1]]);
  const knuckleNormal: Vec = [-knuckleDir[1], knuckleDir[0]];
  return {
    path,
    root: THUMB_BASE,
    rootEnd: thumbPoint(0.5),
    angle: (Math.atan2(tipDir[1], tipDir[0]) * 180) / Math.PI,
    nail: add(add(THUMB_TIP, tipDir, -TIP_HALF * 0.1), tipNormal, -TIP_HALF * 0.3),
    knuckle: thumbPoint(0.5),
    light: add(THUMB_KNUCKLE, knuckleNormal, -KNUCKLE_HALF - 4),
    dark: add(THUMB_KNUCKLE, knuckleNormal, KNUCKLE_HALF + 4),
  };
};

export const THUMB = thumbGeometry();

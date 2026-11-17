type Pt = [number, number];

type Cubic = [Pt, Pt, Pt, Pt];

export type Swoosh = { d: string; pace: number[]; soft: number };

const SAMPLES = 24;
const TABLE = 129;
const CURL_SLOWDOWN = 2.4;
const BLEND = 0.1;
const SOFT_TIP = 0.75;

const at = (c: Cubic, t: number): Pt => {
  const s = 1 - t;
  const a = s * s * s;
  const b = 3 * s * s * t;
  const e = 3 * s * t * t;
  const f = t * t * t;
  return [
    a * c[0][0] + b * c[1][0] + e * c[2][0] + f * c[3][0],
    a * c[0][1] + b * c[1][1] + e * c[2][1] + f * c[3][1],
  ];
};

const lengthOf = (c: Cubic) => {
  let total = 0;
  let prev = c[0];
  for (let i = 1; i <= SAMPLES; i += 1) {
    const next = at(c, i / SAMPLES);
    total += Math.hypot(next[0] - prev[0], next[1] - prev[1]);
    prev = next;
  }
  return total;
};

const smoothstep = (x: number) => {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
};

const paceTable = (runShare: number) => {
  const steps = 512;
  const weight = (p: number) =>
    1 + (CURL_SLOWDOWN - 1) * smoothstep((p - runShare + BLEND) / (2 * BLEND));
  const virtual = [0];
  for (let i = 1; i <= steps; i += 1) {
    virtual.push((virtual[i - 1] ?? 0) + weight((i - 0.5) / steps) / steps);
  }
  const total = virtual[steps] ?? 1;
  const table: number[] = [];
  let j = 0;
  for (let k = 0; k < TABLE; k += 1) {
    const target = (k / (TABLE - 1)) * total;
    while (j < steps && (virtual[j + 1] ?? total) < target) {
      j += 1;
    }
    const lo = virtual[j] ?? 0;
    const hi = virtual[j + 1] ?? total;
    const within = hi > lo ? (target - lo) / (hi - lo) : 0;
    table.push(Math.min(1, (j + within) / steps));
  }
  return table;
};

export const paced = (pace: number[], progress: number) => {
  const x = Math.max(0, Math.min(1, progress)) * (pace.length - 1);
  const i = Math.min(pace.length - 2, Math.floor(x));
  const lo = pace[i] ?? 0;
  const hi = pace[i + 1] ?? 1;
  return lo + (hi - lo) * (x - i);
};

export const swooshShape = (
  left: number,
  right: number,
  b: number,
  u: number,
  loop: boolean,
): Swoosh => {
  const start: Pt = [left - 0.5 * u, b + 0.2 * u];
  const runEnd: Pt = [right + 0.3 * u, b + 0.05 * u];
  const run: Cubic = [
    start,
    [left - 0.05 * u, b + 0.11 * u],
    [right - 0.3 * u, b + 0.17 * u],
    runEnd,
  ];
  const curlA: Pt = [right + 0.42 * u, b - 0.19 * u];
  const curlB: Pt = [right + 0.38 * u, b + 0.08 * u];
  const curl: Cubic[] = loop
    ? [
        [runEnd, [right + 0.45 * u, b + 0.02 * u], [right + 0.52 * u, b - 0.15 * u], curlA],
        [curlA, [right + 0.32 * u, b - 0.23 * u], [right + 0.24 * u, b - 0.06 * u], curlB],
        [
          curlB,
          [right + 0.5 * u, b + 0.19 * u],
          [right + 0.74 * u, b + 0.17 * u],
          [right + 1 * u, b + 0.13 * u],
        ],
      ]
    : [
        [
          runEnd,
          [right + 0.55 * u, b],
          [right + 0.76 * u, b + 0.13 * u],
          [right + 1 * u, b + 0.12 * u],
        ],
      ];
  const p = (pt: Pt) => `${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`;
  const d = [
    `M ${p(start)}`,
    ...[run, ...curl].map((c) => `C ${p(c[1])} ${p(c[2])} ${p(c[3])}`),
  ].join(' ');
  const runLength = lengthOf(run);
  const curlLength = curl.reduce((sum, c) => sum + lengthOf(c), 0);
  const length = runLength + curlLength;
  return { d, pace: paceTable(runLength / length), soft: (SOFT_TIP * u) / length };
};

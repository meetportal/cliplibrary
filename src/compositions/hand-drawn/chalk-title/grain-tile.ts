export const GRAIN_TILE = 512;

const FREQUENCY = 0.35;
const TILE_BLUR = 0.65;
const OCTAVES = 1;
const SEED = 11;
const SIZE = 256;
const MASK = 255;
const PERLIN = 4096;
const RAND_M = 2147483647;
const RAND_A = 16807;
const RAND_Q = 127773;
const RAND_R = 2836;

type Stitch = { width: number; height: number; wrapX: number; wrapY: number };
type Gradient = [number, number];
type Lattice = { selector: Int32Array; gradients: Gradient[][] };

const nextRandom = (seed: number) => {
  const value = RAND_A * (seed % RAND_Q) - RAND_R * Math.floor(seed / RAND_Q);
  return value <= 0 ? value + RAND_M : value;
};

const gradientTables = (start: number) => {
  let seed = start;
  const gradients = Array.from({ length: 4 }, () =>
    Array.from({ length: SIZE + SIZE + 2 }, (): Gradient => [0, 0]),
  );
  for (const table of gradients) {
    for (let i = 0; i < SIZE; i++) {
      const pair = [0, 0].map(() => {
        seed = nextRandom(seed);
        return ((seed % (SIZE + SIZE)) - SIZE) / SIZE;
      });
      const length = Math.hypot(pair[0] ?? 0, pair[1] ?? 0) || 1;
      table[i] = [(pair[0] ?? 0) / length, (pair[1] ?? 0) / length];
    }
  }
  return { gradients, seed };
};

const lattice = (initialSeed: number): Lattice => {
  const first =
    initialSeed <= 0 ? -(initialSeed % (RAND_M - 1)) + 1 : Math.min(initialSeed, RAND_M - 1);
  const { gradients, seed: after } = gradientTables(first);
  let seed = after;
  const selector = Int32Array.from({ length: SIZE + SIZE + 2 }, (_, i) => (i < SIZE ? i : 0));
  for (let i = SIZE - 1; i > 0; i--) {
    const held = selector[i] ?? 0;
    seed = nextRandom(seed);
    const j = seed % SIZE;
    selector[i] = selector[j] ?? 0;
    selector[j] = held;
  }
  for (let i = 0; i < SIZE + 2; i++) {
    selector[SIZE + i] = selector[i] ?? 0;
    for (const table of gradients) {
      table[SIZE + i] = table[i] ?? [0, 0];
    }
  }
  return { selector, gradients };
};

const wrap = (value: number, limit: number, span: number) =>
  value >= limit ? value - span : value;

const curve = (t: number) => t * t * (3 - 2 * t);

const noise = (table: Lattice, channel: number, x: number, y: number, stitch: Stitch) => {
  const tx = x + PERLIN;
  const ty = y + PERLIN;
  const rx0 = tx - Math.trunc(tx);
  const ry0 = ty - Math.trunc(ty);
  const bx0 = wrap(Math.trunc(tx), stitch.wrapX, stitch.width);
  const bx1 = wrap(Math.trunc(tx) + 1, stitch.wrapX, stitch.width);
  const by0 = wrap(Math.trunc(ty), stitch.wrapY, stitch.height);
  const by1 = wrap(Math.trunc(ty) + 1, stitch.wrapY, stitch.height);
  const at = (index: number) => table.selector[index] ?? 0;
  const grads = table.gradients[channel] ?? [];
  const i = at(bx0 & MASK);
  const j = at(bx1 & MASK);
  const dot = (cell: number, rx: number, ry: number) => {
    const g = grads[cell] ?? [0, 0];
    return rx * g[0] + ry * g[1];
  };
  const sx = curve(rx0);
  const sy = curve(ry0);
  const a = dot(at(i + (by0 & MASK)), rx0, ry0);
  const b = dot(at(j + (by0 & MASK)), rx0 - 1, ry0);
  const c = dot(at(i + (by1 & MASK)), rx0, ry0 - 1);
  const d = dot(at(j + (by1 & MASK)), rx0 - 1, ry0 - 1);
  const top = a + sx * (b - a);
  return top + sy * (c + sx * (d - c) - top);
};

const fractal = (table: Lattice, channel: number, px: number, py: number, base: number) => {
  const width = Math.round(GRAIN_TILE * base);
  const stitch = { width, height: width, wrapX: PERLIN + width, wrapY: PERLIN + width };
  let sum = 0;
  let x = px * base;
  let y = py * base;
  let ratio = 1;
  for (let octave = 0; octave < OCTAVES; octave++) {
    sum += noise(table, channel, x, y, stitch) / ratio;
    x *= 2;
    y *= 2;
    ratio *= 2;
    stitch.width *= 2;
    stitch.height *= 2;
    stitch.wrapX = 2 * stitch.wrapX - PERLIN;
    stitch.wrapY = 2 * stitch.wrapY - PERLIN;
  }
  return Math.max(0, Math.min(1, (sum + 1) / 2));
};

const fields = new Map<number, Float32Array>();

const field = (channel: number) => {
  const cached = fields.get(channel);
  if (cached !== undefined) {
    return cached;
  }
  const table = lattice(SEED);
  const base = Math.round(GRAIN_TILE * FREQUENCY) / GRAIN_TILE;
  const values = new Float32Array(GRAIN_TILE * GRAIN_TILE);
  for (let py = 0; py < GRAIN_TILE; py++) {
    for (let px = 0; px < GRAIN_TILE; px++) {
      values[py * GRAIN_TILE + px] = fractal(table, channel, px, py, base);
    }
  }
  fields.set(channel, values);
  return values;
};

const tiles = new Map<string, string>();

const paint = (key: string, build: () => (at: number) => [number, number, number, number]) => {
  const cached = tiles.get(key);
  if (cached !== undefined || typeof document === 'undefined') {
    return cached ?? '';
  }
  const canvas = document.createElement('canvas');
  canvas.width = GRAIN_TILE;
  canvas.height = GRAIN_TILE;
  const context = canvas.getContext('2d');
  if (context === null) {
    return '';
  }
  const pixel = build();
  const image = context.createImageData(GRAIN_TILE, GRAIN_TILE);
  for (let at = 0; at < GRAIN_TILE * GRAIN_TILE; at++) {
    image.data.set(pixel(at), 4 * at);
  }
  context.putImageData(image, 0, 0);
  const url = canvas.toDataURL('image/png');
  tiles.set(key, url);
  return url;
};

const byte = (value: number) => Math.round(255 * Math.max(0, Math.min(1, value)));

const kernel = (sigma: number) => {
  const radius = Math.ceil(3 * sigma);
  const weights = Array.from({ length: 2 * radius + 1 }, (_, at) =>
    Math.exp(-((at - radius) ** 2) / (2 * sigma * sigma)),
  );
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return { radius, weights: weights.map((weight) => weight / total) };
};

const blurPass = (values: Float32Array, sigma: number, step: [number, number]) => {
  const { radius, weights } = kernel(sigma);
  const out = new Float32Array(values.length);
  for (let py = 0; py < GRAIN_TILE; py++) {
    for (let px = 0; px < GRAIN_TILE; px++) {
      let sum = 0;
      for (let k = -radius; k <= radius; k++) {
        const x = (px + k * step[0] + GRAIN_TILE) % GRAIN_TILE;
        const y = (py + k * step[1] + GRAIN_TILE) % GRAIN_TILE;
        sum += (weights[k + radius] ?? 0) * (values[y * GRAIN_TILE + x] ?? 0);
      }
      out[py * GRAIN_TILE + px] = sum;
    }
  }
  return out;
};

const blurred = (values: Float32Array, sigma: number) =>
  blurPass(blurPass(values, sigma, [1, 0]), sigma, [0, 1]);

export type Coverage = { gain: number; offset: number };

export const grainTile = ({ gain, offset }: Coverage) =>
  paint(`grain:${gain}:${offset}`, () => {
    const red = field(0);
    const alpha = blurred(
      red.map((value) => Math.max(0, Math.min(1, offset + gain * value))),
      TILE_BLUR,
    );
    return (at) => [255, 255, 255, byte(alpha[at] ?? 0)];
  });

export const wobbleTile = () =>
  paint('wobble', () => {
    const red = field(0);
    const green = field(1);
    return (at) => [byte(red[at] ?? 0), byte(green[at] ?? 0), 0, 255];
  });

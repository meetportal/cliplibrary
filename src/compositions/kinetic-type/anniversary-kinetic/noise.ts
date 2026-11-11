export const hash = (x: number, y: number, seed: number): number => {
  let state = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(seed, 2147483647);
  state = Math.imul(state ^ (state >>> 13), 1274126177);
  return ((state ^ (state >>> 16)) >>> 0) / 4294967296;
};

const fade = (t: number) => t * t * (3 - 2 * t);

const valueNoise = (x: number, y: number, seed: number): number => {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const tx = fade(x - x0);
  const ty = fade(y - y0);
  const top = hash(x0, y0, seed) + (hash(x0 + 1, y0, seed) - hash(x0, y0, seed)) * tx;
  const bottom =
    hash(x0, y0 + 1, seed) + (hash(x0 + 1, y0 + 1, seed) - hash(x0, y0 + 1, seed)) * tx;
  return top + (bottom - top) * ty;
};

export const fractalNoise = (x: number, y: number, frequency: number, seed: number): number => {
  let sum = 0;
  let weight = 0;
  let amplitude = 1;
  let scale = frequency;
  for (let octave = 0; octave < 3; octave++) {
    sum += valueNoise(x * scale, y * scale, seed + octave * 31) * amplitude;
    weight += amplitude;
    amplitude *= 0.5;
    scale *= 2;
  }
  return sum / weight;
};

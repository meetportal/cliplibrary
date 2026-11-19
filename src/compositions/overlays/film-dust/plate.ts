const PLATE_START = 0.25;
const CENTER_Y = 0.48;

const channels = (hex: string): number[] =>
  [1, 3, 5].map((at) => Number.parseInt(hex.slice(at, at + 2), 16) || 0);

const hash = (x: number, y: number, salt: number) => {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(salt, 2246822519);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

export const buildPlate = (
  background: string,
  edge: string,
  wide: number,
  high: number,
): HTMLCanvasElement | null => {
  const canvas = document.createElement('canvas');
  canvas.width = wide;
  canvas.height = high;
  const context = canvas.getContext('2d');
  if (context === null) {
    return null;
  }
  const image = context.createImageData(wide, high);
  const from = channels(background);
  const to = channels(edge);
  const centerX = wide / 2;
  const centerY = high * CENTER_Y;
  const radius = Math.hypot(wide, high) / 2;
  const { data } = image;
  for (let y = 0; y < high; y++) {
    for (let x = 0; x < wide; x++) {
      const reach = Math.hypot(x + 0.5 - centerX, y + 0.5 - centerY) / radius;
      const t = Math.min(1, Math.max(0, (reach - PLATE_START) / (1 - PLATE_START)));
      const mix = t * t * (3 - 2 * t);
      const dither = hash(x, y, 1) + hash(x, y, 2) - 1;
      const at = (y * wide + x) * 4;
      for (let c = 0; c < 3; c++) {
        const start = from[c] ?? 0;
        const value = start + ((to[c] ?? 0) - start) * mix + dither;
        data[at + c] = Math.max(0, Math.min(255, Math.round(value)));
      }
      data[at + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  return canvas;
};

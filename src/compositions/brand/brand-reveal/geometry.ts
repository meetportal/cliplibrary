export type Stadium = { cx: number; cy: number; half: number; radius: number };

export const stadiumPath = ({ cx, cy, half, radius }: Stadium) =>
  [
    `M ${cx} ${cy - radius}`,
    `H ${cx + half}`,
    `A ${radius} ${radius} 0 0 1 ${cx + half} ${cy + radius}`,
    `H ${cx - half}`,
    `A ${radius} ${radius} 0 0 1 ${cx - half} ${cy - radius}`,
    'Z',
  ].join(' ');

const wrap = (value: number) => value - Math.floor(value);

export const stadiumPoint = ({ cx, cy, half, radius }: Stadium, at: number) => {
  const arc = Math.PI * radius;
  const total = 4 * half + 2 * arc;
  let left = wrap(at) * total;
  if (left < half) {
    return { x: cx + left, y: cy - radius };
  }
  left -= half;
  if (left < arc) {
    const angle = left / radius;
    return { x: cx + half + radius * Math.sin(angle), y: cy - radius * Math.cos(angle) };
  }
  left -= arc;
  if (left < 2 * half) {
    return { x: cx + half - left, y: cy + radius };
  }
  left -= 2 * half;
  if (left < arc) {
    const angle = left / radius;
    return { x: cx - half - radius * Math.sin(angle), y: cy + radius * Math.cos(angle) };
  }
  left -= arc;
  return { x: cx - half + left, y: cy - radius };
};

export type PlateSize = { width: number; height: number; logoWidth: number; logoHeight: number };

export const plateSize = (
  height: number,
  aspect: number | null,
  padding: number,
  widest: number,
): PlateSize => {
  const inner = height * (1 - (2 * padding) / 100);
  const shape = aspect ?? 1;
  const width = Math.max(height, Math.min(height * widest, height + inner * (shape - 1)));
  const logoWidth = Math.max(
    inner,
    width - (height - inner) - Math.min(width - height, height / 4),
  );
  return { width, height, logoWidth, logoHeight: inner };
};

export const drawStretch = ({ width, height }: PlateSize) =>
  Math.sqrt(1 + (4 * (width - height)) / (2 * Math.PI * height));

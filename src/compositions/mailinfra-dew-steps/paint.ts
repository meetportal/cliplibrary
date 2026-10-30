const channels = (hex: string): [number, number, number] => [
  Number.parseInt(hex.slice(1, 3), 16),
  Number.parseInt(hex.slice(3, 5), 16),
  Number.parseInt(hex.slice(5, 7), 16),
];

const toHex = (value: number): string =>
  Math.round(Math.max(0, Math.min(255, value)))
    .toString(16)
    .padStart(2, '0');

export const mix = (from: string, to: string, amount: number): string => {
  const a = channels(from);
  const b = channels(to);
  const t = Math.max(0, Math.min(1, amount));
  return `#${toHex(a[0] + (b[0] - a[0]) * t)}${toHex(a[1] + (b[1] - a[1]) * t)}${toHex(a[2] + (b[2] - a[2]) * t)}`;
};

export const lighten = (color: string, amount: number): string => mix(color, '#ffffff', amount);

export const seeded = (seed: number): (() => number) => {
  let state = (seed * 2654435761) % 4294967296;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

export const EASED_STOPS = [0, 0.04, 0.14, 0.3, 0.5, 0.7, 0.86, 0.96, 1];

export const sparklePath = (size: number): string => {
  const waist = size * 0.16;
  return [
    `M 0 ${-size}`,
    `Q ${waist} ${-waist} ${size} 0`,
    `Q ${waist} ${waist} 0 ${size}`,
    `Q ${-waist} ${waist} ${-size} 0`,
    `Q ${-waist} ${-waist} 0 ${-size}`,
    'Z',
  ].join(' ');
};

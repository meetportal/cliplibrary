import { contrastRatio } from '../dot-ring-logo-reveal/contrast';

const MIN_CONTRAST = 1.5;
const HEX = /^#[0-9a-f]{6}$/i;

const channels = (hex: string) => [1, 3, 5].map((at) => Number.parseInt(hex.slice(at, at + 2), 16));

const mix = (from: string, to: string, amount: number) => {
  const start = channels(from);
  const end = channels(to);
  return `#${start
    .map((value, index) => {
      const mixed = Math.round(value + ((end[index] ?? value) - value) * amount);
      return mixed.toString(16).padStart(2, '0');
    })
    .join('')}`;
};

export const withContrast = (color: string, background: string, toward: string) => {
  if (!(HEX.test(color) && HEX.test(background) && HEX.test(toward))) {
    return color;
  }
  if (contrastRatio(color, background) >= MIN_CONTRAST) {
    return color;
  }
  for (let step = 1; step <= 20; step++) {
    const candidate = mix(color, toward, step / 20);
    if (contrastRatio(candidate, background) >= MIN_CONTRAST) {
      return candidate;
    }
  }
  return toward;
};

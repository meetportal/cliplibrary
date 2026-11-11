import { clampChroma, converter, formatHex, parse, wcagContrast } from 'culori';

const toOklab = converter('oklab');

const MIN_CONTRAST = 1.7;
const STEPS = 24;

export const visibleInk = (color: string, background: string): string => {
  const base = parse(color);
  const ground = parse(background);
  if (base === undefined || ground === undefined || wcagContrast(base, ground) >= MIN_CONTRAST) {
    return color;
  }
  const lab = toOklab(base);
  const darker = toOklab(ground).l > 0.5;
  for (let step = 1; step <= STEPS; step++) {
    const shift = (step / STEPS) * 0.45;
    const candidate = clampChroma(
      { ...lab, l: Math.max(0, Math.min(1, lab.l + (darker ? -shift : shift))) },
      'oklch',
    );
    if (wcagContrast(candidate, ground) >= MIN_CONTRAST) {
      return formatHex(candidate);
    }
  }
  return color;
};

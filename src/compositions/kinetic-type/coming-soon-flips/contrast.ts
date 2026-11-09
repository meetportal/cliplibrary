const channel = (value: number) => {
  const unit = value / 255;
  return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string) => {
  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);
  return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
};

const contrastRatio = (first: string, second: string) => {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

const HEX = /^#[0-9a-f]{6}$/i;

const mix = (from: string, to: string, amount: number) => {
  const channels = (hex: string) =>
    [1, 3, 5].map((at) => Number.parseInt(hex.slice(at, at + 2), 16));
  const start = channels(from);
  const end = channels(to);
  return `#${start
    .map((value, index) =>
      Math.round(value + ((end[index] ?? value) - value) * amount)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
};

export const inkOn = (fill: string, first: string, second: string) => {
  if (!(HEX.test(fill) && HEX.test(first) && HEX.test(second))) {
    return first;
  }
  return contrastRatio(first, fill) >= contrastRatio(second, fill) ? first : second;
};

export const withContrast = (color: string, background: string, toward: string, floor = 3) => {
  if (!(HEX.test(color) && HEX.test(background) && HEX.test(toward))) {
    return color;
  }
  for (let step = 0; step <= 20; step++) {
    const candidate = step === 0 ? color : mix(color, toward, step / 20);
    if (contrastRatio(candidate, background) >= floor) {
      return candidate;
    }
  }
  return toward;
};

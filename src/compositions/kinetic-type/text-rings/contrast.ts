const HEX = /^#[0-9a-f]{6}$/i;

const channels = (hex: string) => [1, 3, 5].map((at) => Number.parseInt(hex.slice(at, at + 2), 16));

const linear = (value: number) => {
  const unit = value / 255;
  return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string) => {
  const [red = 0, green = 0, blue = 0] = channels(hex).map(linear);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

const contrastRatio = (first: string, second: string) => {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

const mix = (from: string, to: string, amount: number) => {
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

const MIN_CONTRAST = 3;

export const readableOn = (color: string, background: string, toward: string) => {
  const base = color.slice(0, 7);
  if (!(HEX.test(base) && HEX.test(background.slice(0, 7)) && HEX.test(toward.slice(0, 7)))) {
    return color;
  }
  const page = background.slice(0, 7);
  if (contrastRatio(base, page) >= MIN_CONTRAST) {
    return base;
  }
  for (let step = 1; step <= 20; step++) {
    const candidate = mix(base, toward.slice(0, 7), step / 20);
    if (contrastRatio(candidate, page) >= MIN_CONTRAST) {
      return candidate;
    }
  }
  return toward.slice(0, 7);
};

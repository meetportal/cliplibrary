const HEX = /^#[0-9a-f]{6}$/i;

const channels = (hex: string) => [1, 3, 5].map((at) => Number.parseInt(hex.slice(at, at + 2), 16));

const valid = (hex: string) => HEX.test(hex.slice(0, 7));

const linear = (value: number) => {
  const unit = value / 255;
  return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string) => {
  const [red = 0, green = 0, blue = 0] = channels(hex).map(linear);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

export const contrast = (first: string, second: string) => {
  if (!(valid(first) && valid(second))) {
    return 21;
  }
  const a = luminance(first.slice(0, 7));
  const b = luminance(second.slice(0, 7));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

export const mixHex = (from: string, to: string, amount: number) => {
  if (!(valid(from) && valid(to))) {
    return amount < 0.5 ? from : to;
  }
  const start = channels(from.slice(0, 7));
  const end = channels(to.slice(0, 7));
  const share = Math.min(1, Math.max(0, amount));
  return `#${start
    .map((value, index) =>
      Math.round(value + ((end[index] ?? value) - value) * share)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
};

export const alpha = (hex: string, amount: number) => {
  if (!valid(hex)) {
    return hex;
  }
  const value = Math.round(Math.min(1, Math.max(0, amount)) * 255);
  return `${hex.slice(0, 7)}${value.toString(16).padStart(2, '0')}`;
};

export const readableOn = (color: string, background: string, toward: string, minimum = 3) => {
  if (contrast(color, background) >= minimum) {
    return color.slice(0, 7);
  }
  for (let step = 1; step <= 20; step++) {
    const candidate = mixHex(color, toward, step / 20);
    if (contrast(candidate, background) >= minimum) {
      return candidate;
    }
  }
  return toward.slice(0, 7);
};

export const bestInk = (fill: string, first: string, second: string) =>
  contrast(first, fill) >= contrast(second, fill) ? first.slice(0, 7) : second.slice(0, 7);

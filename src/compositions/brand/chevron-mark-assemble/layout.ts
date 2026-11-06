import type { ChevronMarkAssembleProps, ChevronNameFont } from '@/schemas';

const NAME_WIDTH_FACTOR: Record<ChevronNameFont, number> = { sans: 0.58, serif: 0.47 };

const LINE_HEIGHT = 1.08;
const MIN_NAME = 44;

const nameFit = (
  name: string,
  font: ChevronNameFont,
  maxSize: number,
  boxWidth: number,
): { size: number; lines: number } => {
  const length = Math.max(1, name.length);
  const factor = NAME_WIDTH_FACTOR[font];
  if (length * factor * maxSize <= boxWidth) {
    return { size: maxSize, lines: 1 };
  }
  const perLine = Math.ceil(length * 0.6);
  const single = boxWidth / (factor * length);
  const double = boxWidth / (factor * perLine);
  if (single >= 0.8 * maxSize) {
    return { size: Math.round(single), lines: 1 };
  }
  return { size: Math.round(Math.max(MIN_NAME, Math.min(maxSize, double))), lines: 2 };
};

export type EndLayout = {
  emblem: { x: number; y: number; scale: number };
  plate: { x: number; y: number; width: number; height: number; radius: number } | null;
  logo: { width: number; height: number };
  name: { x: number; y: number; size: number; lines: number; width: number };
};

type Box = { width: number; height: number; radius: number };

const roundedBox = (width: number, height: number, roundness: number): Box => ({
  width,
  height,
  radius: (roundness / 100) * (Math.min(width, height) / 2),
});

const holdsLogo = (box: Box, logo: { width: number; height: number }, padding: number) => {
  const cornerX = box.width / 2 - box.radius;
  const cornerY = box.height / 2 - box.radius;
  const overX = Math.max(0, logo.width / 2 - cornerX);
  const overY = Math.max(0, logo.height / 2 - cornerY);
  return Math.hypot(overX, overY) <= Math.max(0, box.radius - padding) + 0.01;
};

const plateBox = (
  logo: { width: number; height: number },
  padding: number,
  roundness: number,
): Box => {
  const sized = (grow: number) =>
    roundedBox(logo.width + 2 * (padding + grow), logo.height + 2 * (padding + grow), roundness);
  if (holdsLogo(sized(0), logo, padding)) {
    return sized(0);
  }
  let low = 0;
  let high = Math.max(logo.width, logo.height);
  for (let step = 0; step < 30; step++) {
    const middle = (low + high) / 2;
    if (holdsLogo(sized(middle), logo, padding)) {
      high = middle;
    } else {
      low = middle;
    }
  }
  return sized(high);
};

const fittedPlate = (
  logo: { width: number; height: number },
  padding: number,
  roundness: number,
  maxWidth: number,
) => {
  const box = plateBox(logo, padding, roundness);
  if (box.width <= maxWidth) {
    return { logo, box };
  }
  const shrink = (maxWidth - 2 * padding) / (box.width - 2 * padding);
  const smaller = { width: logo.width * shrink, height: logo.height * shrink };
  return { logo: smaller, box: plateBox(smaller, padding, roundness) };
};

export const buildCenter = (width: number, height: number) => ({
  x: width / 2,
  y: height * 0.47,
});

export const endLayout = (
  props: ChevronMarkAssembleProps,
  aspect: number | null,
  width: number,
  height: number,
): EndLayout => {
  const { brand, plate, mark } = props;
  const scale = mark.emblem / 100;
  const emblemHeight = 3 * Math.SQRT2 * mark.cell * scale;
  const maxLogoWidth = width - 2 * (plate.show ? plate.padding : 0) - 160;
  const logoWidth =
    aspect === null ? 0 : Math.min(maxLogoWidth, brand.logoSize * Math.sqrt(aspect));
  const padding = plate.show ? plate.padding : 0;
  const fitted = fittedPlate(
    { width: logoWidth, height: aspect === null ? 0 : logoWidth / aspect },
    padding,
    plate.show ? plate.roundness : 0,
    width - 100,
  );
  const { logo } = fitted;
  const plateWidth = fitted.box.width;
  const plateHeight = fitted.box.height;
  const nameWidth = width - 180;
  const fit = nameFit(brand.name, brand.nameFont, brand.nameSize, nameWidth);
  const nameHeight = fit.lines * fit.size * LINE_HEIGHT;
  const gapAbove = aspect === null ? 0 : 0.85 * mark.cell;
  const gapBelow = aspect === null ? 0.7 * mark.cell : Math.max(56, 0.3 * fit.size + 40);
  const total = emblemHeight + gapAbove + plateHeight + gapBelow + nameHeight;
  const top = height * 0.49 - total / 2;
  const plateTop = top + emblemHeight + gapAbove;
  return {
    emblem: { x: width / 2, y: top + emblemHeight / 2, scale },
    plate:
      aspect === null
        ? null
        : {
            x: width / 2,
            y: plateTop + plateHeight / 2,
            width: plateWidth,
            height: plateHeight,
            radius: fitted.box.radius,
          },
    logo,
    name: {
      x: width / 2,
      y: plateTop + plateHeight + gapBelow,
      size: fit.size,
      lines: fit.lines,
      width: nameWidth,
    },
  };
};

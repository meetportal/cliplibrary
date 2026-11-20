import type { PillStickerCollageProps } from '@/schemas';
import type { Measure } from './fonts';
import type { Sticker } from './layout';

const PLATE_OVERLAP = 0.14;
const WIDE_LOGO = 1.25;
const STACKED_PLATE = 0.8;
const NAME_RING = 6;
const LINE_HEIGHT = 1.06;

export type LogoSlot = { aspect: number } | null;

type Fit = { text: string; fontSize: number; w: number; h: number };

type Arrangement = { name: Fit; stacked: boolean; plate: number; plateW: number };

const plateWidth = (plate: number, logo: LogoSlot) => {
  if (logo === null) {
    return 0;
  }
  if (logo.aspect <= WIDE_LOGO) {
    return plate;
  }
  return Math.round(Math.min(plate * 2.2, plate * 0.42 * logo.aspect + plate * 0.7));
};

const fitLine = (
  text: string,
  size: number,
  pad: number,
  room: number,
  measure: Measure,
  least: number,
) => {
  const textWidth = measure(text) * size;
  const natural = Math.max(textWidth + pad * 2, Math.min(least, room));
  if (natural <= room || textWidth === 0) {
    return { w: Math.round(natural), fontSize: size };
  }
  return { w: Math.round(room), fontSize: (size * (room - pad * 2)) / textWidth };
};

const balancedBreak = (text: string, measure: Measure): string | null => {
  const words = text.split(' ').filter(Boolean);
  if (words.length < 2) {
    return null;
  }
  let best: { text: string; widest: number } | null = null;
  for (let at = 1; at < words.length; at++) {
    const first = words.slice(0, at).join(' ');
    const second = words.slice(at).join(' ');
    const widest = Math.max(measure(first), measure(second));
    if (best === null || widest < best.widest) {
      best = { text: `${first}\n${second}`, widest };
    }
  }
  return best?.text ?? null;
};

const fitName = (
  text: string,
  lines: 1 | 2,
  size: number,
  room: number,
  measure: Measure,
): Fit | null => {
  const pad = size * 0.55;
  const oneHeight = Math.round(size * 1.5);
  if (lines === 1) {
    const line = fitLine(text, size, pad, room, measure, oneHeight * 2);
    return { text, fontSize: line.fontSize, w: line.w, h: oneHeight };
  }
  const wrapped = balancedBreak(text, measure);
  if (wrapped === null) {
    return null;
  }
  const widest = Math.max(...wrapped.split('\n').map((line) => measure(line)));
  const fontSize = Math.min(size, (room - pad * 2) / widest);
  return {
    text: wrapped,
    fontSize,
    w: Math.round(Math.min(room, widest * fontSize + pad * 2)),
    h: Math.round(fontSize * LINE_HEIGHT * 2 + size * 0.5),
  };
};

const arrange = (
  props: PillStickerCollageProps,
  logo: LogoSlot,
  measure: Measure,
  usable: number,
  scale: number,
): Arrangement => {
  const name = props.companyName.trim();
  const size = props.type.nameSize * scale;
  const oneHeight = Math.round(size * 1.5);
  const besidePlate = Math.round(oneHeight * props.brand.logoSize);
  const besideW = plateWidth(besidePlate, logo);
  const overlap = logo === null ? 0 : Math.round(besidePlate * PLATE_OVERLAP);
  const stackedPlate = Math.round(oneHeight * STACKED_PLATE * props.brand.logoSize);
  const besideRoom = usable - besideW + overlap;
  const options: Arrangement[] = [];
  const add = (fit: Fit | null, stacked: boolean) => {
    if (fit !== null) {
      const plate = stacked ? stackedPlate : besidePlate;
      options.push({ name: fit, stacked, plate, plateW: plateWidth(plate, logo) });
    }
  };
  add(fitName(name, 1, size, besideRoom, measure), false);
  add(fitName(name, 2, size, besideRoom, measure), false);
  if (logo !== null) {
    add(fitName(name, 2, size, usable, measure), true);
    add(fitName(name, 1, size, usable, measure), true);
  }
  const hero = Math.min(props.type.nameSize, props.type.wordSize) * scale * 0.999;
  const first = options.find((option) => option.name.fontSize >= hero);
  const largest = options.reduce<Arrangement | undefined>(
    (best, option) =>
      best === undefined || option.name.fontSize > best.name.fontSize + 0.5 ? option : best,
    undefined,
  );
  return (
    first ??
    largest ?? {
      name: { text: name, fontSize: size, w: 0, h: oneHeight },
      stacked: false,
      plate: besidePlate,
      plateW: besideW,
    }
  );
};

type Spot = Omit<Sticker, 'row' | 'exitAt'>;

export const planLockup = (
  props: PillStickerCollageProps,
  logo: LogoSlot,
  measure: Measure,
  usable: number,
  scale: number,
): Sticker[] => {
  const { type, brand } = props;
  const name = props.companyName.trim();
  const website = props.website.trim();
  const { name: fit, stacked, plate, plateW } = arrange(props, logo, measure, usable, scale);
  const overlap = logo === null || stacked || name === '' ? 0 : Math.round(plate * PLATE_OVERLAP);
  const webSize = type.websiteSize * scale;
  const webHeight = Math.round(webSize * 1.6);
  const arrow = brand.websiteArrow && website !== '' ? Math.round(webHeight * 1.1) : 0;
  const gap = Math.round(webHeight * 0.18);
  const arrowRoom = arrow === 0 ? 0 : arrow + gap;
  const logoRoom = stacked ? plateW + gap : 0;
  const web =
    website === ''
      ? { w: 0, fontSize: webSize }
      : fitLine(website, webSize, webSize * 0.6, usable - arrowRoom - logoRoom, measure, 0);
  const lineOne = stacked ? fit.w : plateW - overlap + fit.w;
  const left = -lineOne / 2;
  const nameLeft = stacked ? left : left + lineOne - fit.w;
  const lineTwoHeight = Math.max(stacked ? plate : 0, website === '' ? 0 : webHeight);
  const lineTwoY = fit.h / 2 - Math.min(lineTwoHeight, webHeight) * 0.12 + lineTwoHeight / 2;
  const lineTwoWidth = logoRoom + arrowRoom + web.w;
  const edge = usable / 2;
  const besideWebX = Math.min(
    edge - web.w / 2,
    Math.max(-edge + arrowRoom + web.w / 2, nameLeft + fit.w * 0.62),
  );
  const webX = stacked ? -lineTwoWidth / 2 + logoRoom + arrowRoom + web.w / 2 : besideWebX;
  const webY = stacked ? lineTwoY : fit.h / 2 - webHeight * 0.12 + webHeight / 2;
  const tilt = props.stickers.tilt / 9;
  const spots: Spot[] = [
    {
      key: 'brand-name',
      content: { kind: 'word', text: fit.text, fontSize: fit.fontSize },
      style: 'primary',
      disc: false,
      w: fit.w,
      h: fit.h,
      rotate: -2.2 * tilt,
      at: 0,
      x: nameLeft + fit.w / 2,
      y: 0,
      ring: Math.round(NAME_RING * scale),
      accent: false,
    },
    {
      key: 'brand-logo',
      content: { kind: 'logo' },
      style: 'surface',
      disc: plateW === plate,
      w: logo === null ? 0 : plateW,
      h: plate,
      rotate: (stacked ? -4 : 6) * tilt,
      at: 6,
      x: stacked ? -lineTwoWidth / 2 + plateW / 2 : left + plateW / 2,
      y: stacked ? lineTwoY : 0,
      ring: 0,
      accent: false,
    },
    {
      key: 'brand-website',
      content: { kind: 'word', text: website, fontSize: web.fontSize },
      style: 'surface',
      disc: false,
      w: web.w,
      h: webHeight,
      rotate: 2.5 * tilt,
      at: 12,
      x: webX,
      y: webY,
      ring: 0,
      accent: false,
    },
    {
      key: 'brand-arrow',
      content: { kind: 'badge', badge: 'arrow' },
      style: 'surface',
      disc: true,
      w: arrow,
      h: arrow,
      rotate: -12 * tilt,
      at: 17,
      x: webX - web.w / 2 - gap - arrow / 2,
      y: webY,
      ring: 0,
      accent: true,
    },
  ];
  return spots
    .filter((spot) => spot.w > 0 && (spot.key !== 'brand-name' || name !== ''))
    .map((spot) => ({ ...spot, row: -1, exitAt: null }));
};

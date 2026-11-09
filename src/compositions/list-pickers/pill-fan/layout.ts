import type { PillFanProps } from '@/schemas';
import { displayFace, type Measure, REFERENCE_SIZE, textFace } from './fonts';

type Frame = { width: number; height: number };

export type PhraseLayout = { lines: string[]; size: number; right: number; centerY: number };

type PillGeometry = {
  scale: number;
  height: number;
  textSize: number;
  padding: number;
  hinge: number;
  slide: number;
  lengths: number[];
};

export type Lockup = {
  x: number;
  y: number;
  logoWidth: number;
  logoHeight: number;
  platePadding: number;
  nameSize: number;
  gap: number;
  width: number;
  height: number;
};

export type FanLayout = {
  pivot: { x: number; y: number };
  phrase: PhraseLayout;
  pills: PillGeometry;
  lockup: Lockup;
  endShift: number;
};

const LINE_HEIGHT = 1.08;
const MIN_PILL = 1.5;

const balancedSplit = (text: string, measure: (value: string) => number): string[] | null => {
  const words = text.trim().split(/\s+/);
  if (words.length < 2) {
    return null;
  }
  let best: string[] | null = null;
  let bestWidth = Number.POSITIVE_INFINITY;
  for (let cut = 1; cut < words.length; cut++) {
    const lines = [words.slice(0, cut).join(' '), words.slice(cut).join(' ')];
    const widest = Math.max(...lines.map(measure));
    if (widest < bestWidth) {
      bestWidth = widest;
      best = lines;
    }
  }
  return best;
};

const fitPhrase = (props: PillFanProps, measure: Measure, available: number) => {
  const face = displayFace(props.phrase.font);
  const width = (value: string) => (measure(value, face) * props.phrase.size) / REFERENCE_SIZE;
  const text = props.headline.trim();
  const single = width(text);
  const singleSize = Math.min(props.phrase.size, (props.phrase.size * available) / single);
  if (single <= available || singleSize >= props.phrase.size * 0.85) {
    return { lines: [text], size: singleSize };
  }
  const split = balancedSplit(text, width);
  if (split === null) {
    return { lines: [text], size: singleSize };
  }
  const widest = Math.max(...split.map(width));
  const splitSize = Math.min(props.phrase.size, (props.phrase.size * available) / widest);
  return splitSize > singleSize
    ? { lines: split, size: splitSize }
    : { lines: [text], size: singleSize };
};

const pillLengths = (props: PillFanProps, measure: Measure) => {
  const face = textFace(props.pills.font);
  return props.words.map((word) =>
    Math.max(
      props.pills.height * MIN_PILL,
      (measure(word.trim(), face) * props.pills.textSize) / REFERENCE_SIZE +
        props.pills.padding * 2,
    ),
  );
};

const fanScale = (
  props: PillFanProps,
  pivot: { x: number; y: number },
  longest: number,
  frame: Frame,
) => {
  const { fan, pills, layout } = props;
  const m = layout.margin;
  const half = pills.height / 2;
  const bounds: number[] = [1];
  const limit = (extent: number, room: number) => {
    if (extent > 0) {
      bounds.push(room / extent);
    }
  };
  const depths = [-0.35, ...Array.from({ length: fan.trail + 1 }, (_, depth) => depth)];
  for (const depth of depths) {
    const shrink = 1 - fan.shrink * Math.max(0, depth);
    const reach = fan.hinge + fan.slide * Math.max(0, depth) + longest * shrink;
    const mirror = fan.direction === 'up' ? -1 : 1;
    const radians = ((fan.angle + mirror * fan.spread * depth) * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const side = half * shrink;
    const edge = depth === fan.trail ? 0 : m;
    limit(reach * cos + side, frame.width - edge - pivot.x);
    limit(side - reach * cos, pivot.x - edge);
    limit(reach * sin + side, frame.height - edge - pivot.y);
    limit(side - reach * sin, pivot.y - edge);
  }
  return Math.max(0.35, Math.min(...bounds));
};

const lockupSize = (
  props: PillFanProps,
  measure: Measure,
  aspect: number | null,
  available: number,
) => {
  const { brand } = props;
  const logoWidth =
    aspect === null ? 0 : Math.min(brand.logoWidth, brand.logoHeight * Math.max(aspect, 0.01));
  const logoHeight = aspect === null ? 0 : logoWidth / Math.max(aspect, 0.01);
  const platePadding = brand.plate && aspect !== null ? logoHeight * 0.22 : 0;
  const logoSpan = logoWidth + platePadding * 2;
  const name = props.companyName.trim();
  const gap = logoSpan > 0 && name !== '' ? Math.max(18, brand.nameSize * 0.6) : 0;
  const nameWidth = (measure(name, displayFace(props.phrase.font)) * brand.nameSize) / 100;
  const room = Math.max(0, available - logoSpan - gap);
  const nameSize =
    nameWidth > room && nameWidth > 0 ? (brand.nameSize * room) / nameWidth : brand.nameSize;
  return {
    logoWidth,
    logoHeight,
    platePadding,
    nameSize,
    gap,
    width: logoSpan + gap + (nameWidth * nameSize) / brand.nameSize,
    height: Math.max(logoHeight + platePadding * 2, nameSize * 1.2),
  };
};

export const buildLayout = (
  props: PillFanProps,
  measure: Measure,
  aspect: number | null,
  frame: Frame,
): FanLayout => {
  const pivot = {
    x: frame.width / 2 + props.layout.x,
    y: frame.height / 2 + props.layout.y,
  };
  const right = pivot.x - props.phrase.gap;
  const phrase = fitPhrase(props, measure, Math.max(80, right - props.layout.margin));
  const lengths = pillLengths(props, measure);
  const scale = fanScale(props, pivot, Math.max(...lengths), frame);
  const pills: PillGeometry = {
    scale,
    height: props.pills.height * scale,
    textSize: props.pills.textSize * scale,
    padding: props.pills.padding * scale,
    hinge: props.fan.hinge * scale,
    slide: props.fan.slide * scale,
    lengths: lengths.map((length) => length * scale),
  };
  const size = lockupSize(props, measure, aspect, frame.width - props.layout.margin * 2);
  const radians = (props.fan.angle * Math.PI) / 180;
  const lastLength = pills.lengths.at(-1) ?? 0;
  const lineEnd = pivot.x + (pills.hinge + lastLength) * Math.cos(radians);
  const phraseWidth =
    (Math.max(...phrase.lines.map((line) => measure(line, displayFace(props.phrase.font)))) *
      phrase.size) /
    REFERENCE_SIZE;
  const lineCenter = (right - phraseWidth + lineEnd) / 2;
  const signOff = props.brand.placement === 'below-line';
  const lockupX = signOff
    ? Math.max(
        props.layout.margin,
        Math.min(frame.width - props.layout.margin - size.width, lineCenter - size.width / 2),
      )
    : props.layout.margin;
  const lockupY = signOff
    ? Math.min(frame.height - props.layout.margin - size.height, pivot.y + props.brand.gap)
    : props.layout.margin;
  const reach = pills.hinge + lastLength;
  const halfPhrase = (phrase.lines.length * phrase.size * LINE_HEIGHT) / 2;
  const tops = [
    pivot.y - halfPhrase,
    pivot.y + Math.min(0, Math.sin(radians)) * reach - pills.height / 2,
  ];
  const bottoms = [
    pivot.y + halfPhrase,
    pivot.y + Math.max(0, Math.sin(radians)) * reach + pills.height / 2,
    ...(signOff ? [lockupY + size.height] : []),
  ];
  const groupCenter = (Math.min(...tops) + Math.max(...bottoms)) / 2;
  return {
    pivot,
    phrase: { ...phrase, right, centerY: pivot.y },
    pills,
    lockup: { ...size, x: lockupX, y: lockupY },
    endShift: props.fan.clearAtEnd ? Math.round(groupCenter - frame.height / 2) : 0,
  };
};

export const phraseHeight = (phrase: PhraseLayout) =>
  phrase.lines.length * phrase.size * LINE_HEIGHT;

export const PHRASE_LINE_HEIGHT = LINE_HEIGHT;

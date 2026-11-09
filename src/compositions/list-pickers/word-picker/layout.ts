import type { WordPickerProps } from '@/schemas';
import { FACES, type Face, type MeasureWidth } from './fonts';

export type Box = { left: number; top: number; width: number; height: number };

export type BrandLayout = {
  floor: number;
  plate: Box | null;
  logo: Box | null;
  name: { left: number; top: number; width: number; size: number; align: 'left' | 'center' };
};

export type ListLayout = {
  centerX: number;
  centerY: number;
  column: number;
  frame: Box;
  pickSize: number;
  sideScale: number;
  pitch: number;
  counterWidth: number;
};

const MARGIN = 110;

const logoBox = (aspect: number, size: number) => {
  const height = size / Math.max(1, aspect) ** 0.36;
  const width = height * aspect;
  return { width: Math.round(width), height: Math.round(height) };
};

const platePad = (logo: { width: number; height: number }) =>
  Math.round(Math.min(logo.width, logo.height) * 0.12 + 6);

const fitName = (
  text: string,
  face: Face,
  size: number,
  maxWidth: number,
  measure: MeasureWidth,
) => {
  const em = measure(text, face);
  return em <= 0 ? size : Math.max(18, Math.min(size, maxWidth / em));
};

type Lockup = {
  props: WordPickerProps;
  face: Face;
  logo: { width: number; height: number } | null;
  pad: number;
  outer: { width: number; height: number };
  hasName: boolean;
  measure: MeasureWidth;
};

const splitBrand = (lockup: Lockup, height: number, width: number): BrandLayout => {
  const { props, face, logo, pad, outer, hasName, measure } = lockup;
  const columnWidth = width * 0.42 - MARGIN;
  const centerX = MARGIN + columnWidth / 2;
  const nameSize = props.brand.nameSize;
  const size = hasName ? fitName(props.companyName, face, nameSize, columnWidth - 60, measure) : 0;
  const gap = logo === null || !hasName ? 0 : Math.round(nameSize * 0.6);
  const total = outer.height + gap + (hasName ? Math.round(size * 1.25) : 0);
  const top = Math.round(height / 2 - total / 2);
  const left = Math.round(centerX - outer.width / 2);
  return {
    floor: 0,
    plate: logo === null ? null : { left, top, ...outer },
    logo: logo === null ? null : { left: left + pad, top: top + pad, ...logo },
    name: {
      left: Math.round(centerX - columnWidth / 2),
      top: top + outer.height + gap,
      width: Math.round(columnWidth),
      size,
      align: 'center',
    },
  };
};

const stackedBrand = (lockup: Lockup, width: number): BrandLayout => {
  const { props, face, logo, pad, outer, hasName, measure } = lockup;
  const nameSize = props.brand.nameSize;
  const gap = logo === null || !hasName ? 0 : Math.round(nameSize * 0.7);
  const available = width - MARGIN * 2 - outer.width - gap;
  const size = hasName ? fitName(props.companyName, face, nameSize, available, measure) : 0;
  const nameWidth = hasName ? Math.ceil(measure(props.companyName, face) * size) : 0;
  const rowHeight = Math.max(outer.height, Math.round(size * 1.25));
  const centerY = Math.round(MARGIN * 0.7 + rowHeight / 2);
  const left = Math.round(width / 2 - (outer.width + gap + nameWidth) / 2);
  const top = Math.round(centerY - outer.height / 2);
  return {
    floor: Math.round(centerY + rowHeight / 2),
    plate: logo === null ? null : { left, top, ...outer },
    logo: logo === null ? null : { left: left + pad, top: top + pad, ...logo },
    name: {
      left: left + outer.width + gap,
      top: Math.round(centerY - (size * 1.25) / 2),
      width: nameWidth + 4,
      size,
      align: 'left',
    },
  };
};

export const brandLayout = (
  props: WordPickerProps,
  aspect: number | null,
  width: number,
  height: number,
  measure: MeasureWidth,
): BrandLayout => {
  const logo = aspect === null ? null : logoBox(aspect, props.brand.logoSize);
  const pad = logo === null || !props.brand.plate ? 0 : platePad(logo);
  const outer =
    logo === null
      ? { width: 0, height: 0 }
      : { width: logo.width + pad * 2, height: logo.height + pad * 2 };
  const lockup: Lockup = {
    props,
    face: FACES[props.brand.nameFont],
    logo,
    pad,
    outer,
    hasName: props.companyName.trim() !== '',
    measure,
  };
  return props.layout === 'split' ? splitBrand(lockup, height, width) : stackedBrand(lockup, width);
};

export const listLayout = (
  props: WordPickerProps,
  width: number,
  height: number,
  measure: MeasureWidth,
): ListLayout => {
  const split = props.layout === 'split';
  const centerX = Math.round(split ? width * 0.42 + (width * 0.58 - MARGIN * 0.5) / 2 : width / 2);
  const centerY = Math.round(split ? height / 2 : height / 2 + height * 0.07);
  const room = split ? (width - centerX - MARGIN * 0.5) * 2 : width - MARGIN * 2;
  const frameWidth = Math.round(Math.min(props.selection.width, room));
  const counterWidth = props.selection.counter ? Math.round(props.selection.height * 0.62) : 0;
  const inner = frameWidth - Math.round(frameWidth * 0.05) * 2 - counterWidth * 2;
  const listFace = FACES[props.type.listFont];
  const pickFace = FACES[props.type.pickFont];
  const widest = Math.max(
    0.01,
    ...props.items.map((item) => Math.max(measure(item, listFace), measure(item, pickFace))),
  );
  const pickSize = Math.min(props.type.pickSize, inner / widest);
  const frameHeight = Math.round(Math.max(props.selection.height, pickSize * 1.3));
  return {
    centerX,
    centerY,
    column: Math.round(Math.max(frameWidth, widest * pickSize) + 200),
    frame: {
      left: Math.round(centerX - frameWidth / 2),
      top: Math.round(centerY - frameHeight / 2),
      width: frameWidth,
      height: frameHeight,
    },
    pickSize,
    sideScale: Math.min(1, props.type.size / props.type.pickSize),
    pitch: Math.round(props.type.pitch),
    counterWidth,
  };
};

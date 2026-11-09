import type { ComingSoonFlipsProps } from '@/schemas';
import type { Face } from './fonts';
import { capTop, fitSize, type Measure } from './measure';

const SIDE = 90;
const TALL_LIMIT = 1.15;
const WINDOW_FADE = 120;

export type Box = { left: number; top: number; width: number; height: number };

export type Lockup = {
  logo: Box | null;
  inset: number;
  name: { size: number; top: number; capTop: number } | null;
  bounds: Box;
};

const logoSize = (aspect: number, lockup: ComingSoonFlipsProps['lockup']) => {
  const inset = lockup.plate ? lockup.platePadding : 0;
  const root = Math.sqrt(Math.max(0.05, aspect));
  let width = lockup.logoSize * root;
  let height = lockup.logoSize / root;
  if (height > lockup.logoSize * TALL_LIMIT) {
    height = lockup.logoSize * TALL_LIMIT;
    width = height * aspect;
  }
  const room = Math.max(40, lockup.logoMaxWidth - inset * 2);
  if (width > room) {
    width = room;
    height = width / aspect;
  }
  return { width: width + inset * 2, height: height + inset * 2, inset };
};

export const lockupLayout = (
  props: ComingSoonFlipsProps,
  aspect: number | null,
  measure: Measure,
  nameFace: Face,
  frame: { width: number; height: number },
): Lockup => {
  const { lockup } = props;
  const name = props.companyName.trim();
  const box = measure(name, nameFace);
  const nameSize = fitSize(box, lockup.nameSize, 0, 0, frame.width - SIDE * 2);
  const logo = aspect === null ? null : logoSize(aspect, lockup);
  const nameCap = name === '' ? 0 : box.cap * nameSize;
  const gap = logo !== null && name !== '' ? lockup.nameGap : 0;
  const total = (logo?.height ?? 0) + gap + nameCap;
  const top = lockup.y * frame.height - total / 2;
  const nameCapTop = top + (logo?.height ?? 0) + gap;
  const width = Math.max(logo?.width ?? 0, name === '' ? 0 : box.width * nameSize);
  return {
    logo:
      logo === null
        ? null
        : {
            left: (frame.width - logo.width) / 2,
            top,
            width: logo.width,
            height: logo.height,
          },
    inset: logo?.inset ?? 0,
    name:
      name === ''
        ? null
        : { size: nameSize, top: nameCapTop - capTop(box, nameSize), capTop: nameCapTop },
    bounds: { left: (frame.width - width) / 2, top, width, height: total },
  };
};

export type TitleLine = { text: string; size: number; capTop: number; top: number };

export const titleLayout = (
  title: ComingSoonFlipsProps['title'],
  measure: Measure,
  face: Face,
  frame: { width: number; height: number },
): { top: TitleLine; bottom: TitleLine; bounds: Box } => {
  const maxWidth = frame.width - SIDE * 2;
  const line = (text: string, size: number, at: number): TitleLine => {
    const box = measure(text, face);
    const fitted = fitSize(box, size, title.tracking, [...text].length, maxWidth);
    return { text, size: fitted, capTop: at, top: at - capTop(box, fitted) };
  };
  const start = title.y * frame.height;
  const top = line(title.top, title.topSize, start);
  const topCap = measure(title.top, face).cap * top.size;
  const bottom = line(title.bottom, title.bottomSize, start + topCap + title.gap);
  const bottomCap = measure(title.bottom, face).cap * bottom.size;
  return {
    top,
    bottom,
    bounds: { left: SIDE, top: start, width: maxWidth, height: bottom.capTop + bottomCap - start },
  };
};

export type LitRegion = { top: number; bottom: number; fade: 'top' | 'bottom' };

export const litRegion = (title: Box, lockup: Box, margin: number, height: number): LitRegion => {
  const titleMiddle = title.top + title.height / 2;
  const lockupMiddle = lockup.top + lockup.height / 2;
  if (titleMiddle <= lockupMiddle) {
    const edge = Math.max(0, title.top + title.height + margin);
    return { top: edge, bottom: Math.min(height, edge + WINDOW_FADE), fade: 'top' };
  }
  const edge = Math.min(height, title.top - margin);
  return { top: Math.max(0, edge - WINDOW_FADE), bottom: edge, fade: 'bottom' };
};

export type Axis = {
  center: number;
  before: number;
  after: number;
  extent: number;
  length: number;
};

export const lightAxis = (
  angle: number,
  lockup: Box,
  region: LitRegion,
  spread: number,
  frame: { width: number; height: number },
): Axis => {
  const radians = (angle * Math.PI) / 180;
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);
  const length = Math.abs(frame.width * sin) + Math.abs(frame.height * cos);
  const project = (x: number, y: number) =>
    length / 2 + (x - frame.width / 2) * sin - (y - frame.height / 2) * cos;
  const center = project(lockup.left + lockup.width / 2, lockup.top + lockup.height / 2);
  const lit = region.fade === 'top' ? [region.top, frame.height] : [0, region.bottom];
  const corners = [0, frame.width].flatMap((x) => lit.map((y) => project(x, y) - center));
  const extent = (Math.abs(lockup.width * sin) + Math.abs(lockup.height * cos)) / 2;
  return {
    center,
    before: spread - Math.min(...corners),
    after: spread + Math.max(...corners),
    extent,
    length,
  };
};

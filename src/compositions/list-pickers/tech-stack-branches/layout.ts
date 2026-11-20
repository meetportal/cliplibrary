import type { TechStackBranchesProps } from '@/schemas';
import { type Faces, type Measure, REFERENCE_SIZE } from './fonts';

type Frame = { width: number; height: number };

export type PillBox = {
  height: number;
  width: number;
  titleSize: number;
  detailSize: number;
  padLeft: number;
  icon: number;
  iconGap: number;
};

export type ChipBox = { width: number; height: number; logoWidth: number; logoHeight: number };

export type Layout = {
  root: PillBox & { x: number };
  items: PillBox[];
  centerY: number;
  wheelX: number;
  curve: number;
  chip: ChipBox | null;
  pillHeight: number;
};

const ROOT_SCALE = 1.14;
const ROOT_SHARE = 0.45;
const ROOT_INSET = 4;
const EDGE = 24;
const WHEEL_ANCHOR = 0.49;
const REACH_BASE = 190;
const CHIP_PAD_X = 0.34;
const CHIP_PAD_Y = 0.18;
const MIN_TEXT = 0.45;
const SPANS = [0, 1, 1.4];
const MIN_REACH = 80;

type Copy = { title: string; detail: string };

type Lead = { padLeft: number; width: number; gap: number };

const glyphLead = (height: number, icon: boolean): Lead => ({
  padLeft: height * 0.3,
  width: icon ? height * 0.26 : 0,
  gap: icon ? height * 0.13 : 0,
});

const chrome = (height: number, lead: Lead) => {
  const { padLeft, width, gap } = lead;
  return { padLeft, iconSize: width, iconGap: gap, total: padLeft + width + gap + height * 0.38 };
};

type Sizes = { title: number; detail: number };

const DETAIL_CAP = 0.72;

const lineWidths = (copy: Copy, faces: Faces, measure: Measure, sizes: Sizes): Sizes => ({
  title: (measure(copy.title.trim(), faces.title) * sizes.title) / REFERENCE_SIZE,
  detail:
    copy.detail.trim() === ''
      ? 0
      : (measure(copy.detail.trim(), faces.detail) * sizes.detail) / REFERENCE_SIZE,
});

const fitScale = (widest: number, room: number) =>
  widest <= 0 ? 1 : Math.max(MIN_TEXT, Math.min(1, room / widest));

const fitScales = (
  copies: readonly Copy[],
  sizes: Sizes,
  room: number,
  faces: Faces,
  measure: Measure,
): Sizes => {
  const widths = copies.map((copy) => lineWidths(copy, faces, measure, sizes));
  const title = fitScale(Math.max(0, ...widths.map((width) => width.title)), room);
  const detail = fitScale(Math.max(0, ...widths.map((width) => width.detail)), room);
  return {
    title,
    detail: Math.min(detail, (sizes.title * title * DETAIL_CAP) / sizes.detail),
  };
};

const verticalFit = (height: number, title: number, detail: number, hasDetail: boolean) => {
  const block = title * 1.05 + (hasDetail ? detail * 1.2 : 0);
  return Math.min(1, (height * 0.8) / block);
};

const pillBox = (
  copy: Copy,
  height: number,
  sizes: Sizes,
  scales: Sizes,
  lead: Lead,
  faces: Faces,
  measure: Measure,
): PillBox => {
  const parts = chrome(height, lead);
  const hasDetail = copy.detail.trim() !== '';
  const titleSize = sizes.title * scales.title;
  const detailSize = sizes.detail * scales.detail;
  const fit = verticalFit(height, titleSize, detailSize, hasDetail);
  const fitted = { title: titleSize * fit, detail: detailSize * fit };
  const widths = lineWidths(copy, faces, measure, fitted);
  return {
    height,
    width: Math.max(height * 1.6, parts.total + Math.max(widths.title, widths.detail)),
    titleSize: fitted.title,
    detailSize: fitted.detail,
    padLeft: parts.padLeft,
    icon: parts.iconSize,
    iconGap: parts.iconGap,
  };
};

const chipBox = (props: TechStackBranchesProps, aspect: number | null, rootHeight: number) => {
  if (aspect === null) {
    return null;
  }
  const { brand } = props;
  const height = rootHeight * brand.logoHeight;
  const padX = brand.plate ? height * CHIP_PAD_X : 0;
  const padY = brand.plate ? height * CHIP_PAD_Y : 0;
  const logoWidth = Math.min(brand.logoWidth - padX * 2, (height - padY * 2) * aspect);
  const logoHeight = logoWidth / aspect;
  return { width: logoWidth + padX * 2, height, logoWidth, logoHeight };
};

export const buildLayout = (
  props: TechStackBranchesProps,
  faces: Faces,
  measure: Measure,
  aspect: number | null,
  frame: Frame,
): Layout => {
  const { pills, wheel, layout } = props;
  const margin = layout.margin;
  const available = frame.width - margin * 2;
  const icon = pills.icon !== 'none';
  const rootHeight = pills.height * ROOT_SCALE;
  const rootSizes = { title: pills.titleSize * ROOT_SCALE, detail: pills.detailSize * 1.08 };
  const rootCopy = { title: props.companyName, detail: props.tagline };
  const chip = chipBox(props, aspect, rootHeight);
  const rootLead: Lead =
    chip === null
      ? glyphLead(rootHeight, icon)
      : { padLeft: (rootHeight - chip.height) / 2, width: chip.width, gap: props.brand.gap };
  const rootChrome = chrome(rootHeight, rootLead).total;
  const itemLead = glyphLead(pills.height, icon);
  const itemChrome = chrome(pills.height, itemLead).total;
  const sizes = { title: pills.titleSize, detail: pills.detailSize };
  const full = { title: 1, detail: 1 };
  const widestLine = (copy: Copy, at: Sizes) => {
    const widths = lineWidths(copy, faces, measure, at);
    return Math.max(widths.title, widths.detail);
  };
  const itemText = Math.max(...props.items.map((copy) => widestLine(copy, sizes)));
  const plannedItem = (cap: number) =>
    Math.max(
      pills.height * 1.6,
      itemChrome +
        Math.max(
          ...props.items.map((copy) =>
            widestLine(copy, {
              title: sizes.title * cap,
              detail: Math.min(sizes.detail, sizes.title * cap * DETAIL_CAP),
            }),
          ),
        ),
    );
  const rootText = Math.max(1, widestLine(rootCopy, rootSizes));
  const right = frame.width - margin;
  const arrange = () => {
    const rootX = Math.max(EDGE, margin + ROOT_INSET);
    const shared = fitScales(
      [rootCopy],
      rootSizes,
      available * ROOT_SHARE - rootChrome,
      faces,
      measure,
    );
    const level = sizes.title / rootSizes.title;
    const space = right - rootX - MIN_REACH - rootChrome - itemChrome;
    const together = Math.max(MIN_TEXT, Math.min(1, space / (rootText * level + itemText)));
    const rootFull = (space - itemText) / rootText;
    const rootScale =
      shared.title >= level ? shared.title : rootFull >= level ? level : together * level;
    const rootScales = shared.title >= level ? shared : { title: rootScale, detail: rootScale };
    const root = pillBox(rootCopy, rootHeight, rootSizes, rootScales, rootLead, faces, measure);
    const rootTitle = Math.min(1, root.titleSize / sizes.title);
    const fullItem = plannedItem(rootTitle);
    const rootRight = rootX + root.width;
    const anchor = frame.width * WHEEL_ANCHOR + props.branch.reach - REACH_BASE;
    const wheelAt = (branch: number) =>
      Math.max(anchor - (props.branch.reach - branch), rootRight + branch);
    const highest = wheelAt(props.branch.reach);
    const lowest = wheelAt(Math.min(MIN_REACH, props.branch.reach));
    const spanFor = (bend: number, width: number) =>
      Math.max(...SPANS.map((d) => bend * d * d + width * (d === 0 ? 1 : wheel.sideScale)));
    const bendFrom = highest + fullItem <= right ? highest : lowest;
    const bendRoom = Math.max(
      0,
      Math.min(
        ...SPANS.filter((d) => d > 0).map(
          (d) => (right - bendFrom - fullItem * wheel.sideScale) / (d * d),
        ),
      ),
    );
    const curve = wheel.curve * bendRoom;
    const wheelX = Math.max(lowest, Math.min(highest, right - spanFor(curve, fullItem)));
    const itemRoom = Math.min(
      ...SPANS.map((d) => (right - wheelX - curve * d * d) / (d === 0 ? 1 : wheel.sideScale)),
    );
    const fitted = fitScales(props.items, sizes, itemRoom - itemChrome, faces, measure);
    const title = Math.min(fitted.title, rootTitle, full.title);
    const scales = {
      title,
      detail: Math.min(fitted.detail, (sizes.title * title * DETAIL_CAP) / sizes.detail),
    };
    const items = props.items.map((copy) =>
      pillBox(copy, pills.height, sizes, scales, itemLead, faces, measure),
    );
    return { root, rootX, wheelX, curve, items };
  };
  const { root, rootX, wheelX, curve, items } = arrange();
  const centerY = Math.max(
    margin + rootHeight / 2,
    Math.min(frame.height - margin - rootHeight / 2, frame.height / 2 + layout.y),
  );
  return {
    root: { ...root, x: Math.round(rootX) },
    items,
    centerY: Math.round(centerY),
    wheelX: Math.round(wheelX),
    curve,
    pillHeight: pills.height,
    chip,
  };
};

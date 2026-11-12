import type { BurningPaperRevealProps } from '@/schemas';
import { CARD } from './burn';
import { HEADLINE_FACE, type Measure, NAME_FACE, SCRIPT_FACE } from './fonts';

const MIN_LEFT = 176;
const SLOT_CENTER = 254;
const ROW_CENTER = CARD.height - 86;
const RIGHT_MARGIN = 64;
const NAME_TRACKING = 0.16;
const LOGO_GAP = 20;
const MAX_LOGO_RATIO = 3.6;
const INTRO_WIDTH = 440;

export type Line = { text: string; left: number; top: number; size: number; width: number };

export type CardLayout = {
  intro: Line;
  headline: Line;
  underline: { x1: number; x2: number; y: number };
  accent: Line;
  logo: { left: number; top: number; width: number; height: number } | null;
  name: Line & { tracking: number };
};

const fitSize = (width: number, size: number, room: number) =>
  width <= 0 ? size : Math.min(size, room / width);

const MIN_INLINE_NAME = 21;
const STACK_LEFT = 80;
const STACK_BOTTOM = CARD.height - 30;
const SQUARE_RATIO = 1.2;
const WIDE_FLOOR = 0.62;
const STACK_GAP = 10;

const brandRow = (
  props: BurningPaperRevealProps,
  measure: Measure,
  aspect: number | null,
  left: number,
): Pick<CardLayout, 'logo' | 'name'> => {
  const base = props.lockup.logoHeight;
  const tall =
    aspect === null
      ? 0
      : aspect <= SQUARE_RATIO
        ? base
        : base * Math.max(WIDE_FLOOR, SQUARE_RATIO / Math.sqrt(aspect));
  const wide = aspect === null ? 0 : Math.min(tall * aspect, base * MAX_LOGO_RATIO);
  const text = props.companyName.toUpperCase();
  const unit = measure(text, NAME_FACE, NAME_TRACKING);
  const nameLeft = left + (wide > 0 ? wide + LOGO_GAP : 0);
  const inline = fitSize(unit, props.type.nameSize, CARD.width - RIGHT_MARGIN - nameLeft);
  if (inline >= Math.min(MIN_INLINE_NAME, props.type.nameSize) || aspect === null) {
    const height = aspect === null ? 0 : wide / aspect;
    return {
      logo: wide > 0 ? { left, top: ROW_CENTER - height / 2, width: wide, height } : null,
      name: {
        text,
        left: nameLeft,
        top: ROW_CENTER - inline * 0.5,
        size: inline,
        width: unit * inline,
        tracking: NAME_TRACKING,
      },
    };
  }
  const width = Math.min(tall * aspect, base * MAX_LOGO_RATIO);
  const shown = width / aspect;
  const size = fitSize(unit, props.type.nameSize, CARD.width - RIGHT_MARGIN - STACK_LEFT);
  const stackTop = STACK_BOTTOM - (shown + STACK_GAP + size);
  return {
    logo: { left: STACK_LEFT, top: stackTop, width, height: shown },
    name: {
      text,
      left: STACK_LEFT,
      top: stackTop + shown + STACK_GAP,
      size,
      width: unit * size,
      tracking: NAME_TRACKING,
    },
  };
};

export const cardLayout = (
  props: BurningPaperRevealProps,
  measure: Measure,
  aspect: number | null,
): CardLayout => {
  const unitHeadline = measure(props.headline, HEADLINE_FACE);
  const headlineSize = fitSize(
    unitHeadline,
    props.type.headlineSize,
    CARD.width - MIN_LEFT - RIGHT_MARGIN,
  );
  const headlineWidth = unitHeadline * headlineSize;
  const unitIntro = measure(props.headlineIntro, SCRIPT_FACE);
  const introSize = fitSize(unitIntro, props.type.scriptSize, INTRO_WIDTH);
  const introWidth = unitIntro * introSize;
  const block = Math.max(headlineWidth, introWidth);
  const left = Math.max(MIN_LEFT, (CARD.width - block) / 2 - 24);
  const top = SLOT_CENTER - headlineSize * 0.5;
  const underlineY = top + headlineSize * 0.96;
  const underlineEnd = left + Math.max(headlineWidth, 120) + 18;
  const accentRight = Math.min(CARD.width - 56, underlineEnd + 30);
  const unitAccent = measure(props.headlineAccent, SCRIPT_FACE);
  const accentSize = fitSize(unitAccent, props.type.scriptSize, accentRight - left - 40);
  const accentWidth = unitAccent * accentSize;
  const brand = brandRow(props, measure, aspect, left);
  return {
    intro: {
      text: props.headlineIntro,
      left: left + 6,
      top: top + headlineSize * 0.16 - introSize * 0.98,
      size: introSize,
      width: introWidth,
    },
    headline: {
      text: props.headline,
      left,
      top,
      size: headlineSize,
      width: headlineWidth,
    },
    underline: { x1: left + 4, x2: underlineEnd, y: underlineY },
    accent: {
      text: props.headlineAccent,
      left: accentRight - accentWidth,
      top: underlineY + 12,
      size: accentSize,
      width: accentWidth,
    },
    ...brand,
  };
};

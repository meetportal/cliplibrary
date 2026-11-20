import type { GrowthCallScreenProps } from '@/schemas';
import type { LogoBox } from '../../kit/use-logo-box';
import { type Face, type FaceSet, fontSpec } from './fonts';

export const FRAME = { width: 1080, height: 1920, centerX: 540 };

export type Run = { text: string; face: Face; size: number; x: number; y: number; width: number };

type Rect = { x: number; y: number; w: number; h: number };

export type Plate = Rect & { radius: number; logo: Rect };

export type Action = { cx: number; cy: number; size: number; label: Run | null };

export type Layout = {
  plate: Plate | null;
  name: Run | null;
  lead: Run | null;
  headline: Run[];
  trail: Run | null;
  remind: Action | null;
  message: Action | null;
  bar: Rect & { radius: number };
  knob: { size: number; inset: number; travel: number };
  slide: Run | null;
  website: Run | null;
};

const TEXT_WIDTH = 900;
const NAME_WIDTH = 880;
const WRAP_SHARE = 0.86;
const TOP_LIMIT = 110;
const RIPPLE_EDGE = 40;
const SIDE_EDGE = 40;
const BIAS = 0.42;
const FIT_TRIES = 32;
const FIT_STEP = 0.97;
const BAR_HEIGHT = 232;
const KNOB_INSET = 11;
const BOTTOM_MARGIN = 90;
const ICON_SIZE = 54;
const ICON_ABOVE_BAR = 250;
const LABEL_ABOVE_BAR = 150;
const ACTION_SPREAD = 240;
const ACTION_LABEL_SIZE = 32;
const ACTION_LABEL_WIDTH = 380;
const ACTION_CLEARANCE = 64;
const BAR_CLEARANCE = 90;
const SLIDE_SIZE = 44;
const WEBSITE_SIZE = 54;
const ROUND_ASPECT = 1.3;
const LOGO_IN_CIRCLE = 0.62;
const LOGO_BARE = 0.86;
const CAPSULE_HEIGHT = 0.74;
const LOGO_IN_CAPSULE = 0.5;
const CAPSULE_PAD = 0.62;
const MAX_PLATE_WIDTH = 820;
const PLATE_GAP = 30;
const RIPPLE_CLEAR = 0.9;
const NAME_BOX = 1.3;
const LINES_GAP = 52;
const LINE_BOX = 1.14;
const HEADLINE_BOX = 1.1;
const TRAIL_SHARE = 0.74;
const TRAIL_BOX = 1.06;
const BASELINE = 0.88;

let measurer: CanvasRenderingContext2D | null = null;

const context = () => {
  if (measurer === null) {
    measurer = document.createElement('canvas').getContext('2d');
  }
  return measurer;
};

const measure = (text: string, face: Face, size: number) => {
  const ctx = context();
  if (ctx === null) {
    return text.length * size * 0.56;
  }
  ctx.font = fontSpec(face, size);
  ctx.letterSpacing = `${face.tracking * size}px`;
  return ctx.measureText(text).width;
};

const fitSize = (text: string, face: Face, size: number, width: number) => {
  const measured = measure(text, face, size);
  return measured <= width ? size : Math.max(1, size * (width / measured));
};

const run = (text: string, face: Face, size: number, maxWidth: number): Run | null => {
  const clean = text.trim();
  if (clean === '') {
    return null;
  }
  const fitted = fitSize(clean, face, size, maxWidth);
  return { text: clean, face, size: fitted, x: 0, y: 0, width: measure(clean, face, fitted) };
};

const splits = (text: string): [string, string][] => {
  const words = text.split(/\s+/);
  return words
    .slice(1)
    .map((_, at) => [words.slice(0, at + 1).join(' '), words.slice(at + 1).join(' ')]);
};

const headlineRuns = (text: string, face: Face, size: number, width: number): Run[] => {
  const clean = text.trim().replace(/\s+/g, ' ');
  const single = run(clean, face, size, width);
  if (single === null) {
    return [];
  }
  const options = splits(clean);
  if (single.size >= size * WRAP_SHARE || options.length === 0) {
    return [single];
  }
  const [best] = options
    .map((pair) => ({ pair, widest: Math.max(...pair.map((line) => measure(line, face, size))) }))
    .sort((a, b) => a.widest - b.widest);
  if (best === undefined) {
    return [single];
  }
  const shared = Math.min(size, size * (width / best.widest));
  if (shared <= single.size) {
    return [single];
  }
  return best.pair.map((line) => ({
    text: line,
    face,
    size: shared,
    x: 0,
    y: 0,
    width: measure(line, face, shared),
  }));
};

const platePlan = (box: LogoBox, height: number, plate: boolean, reach: number) => {
  if (box.aspect <= ROUND_ASPECT) {
    const inner = height * (plate ? LOGO_IN_CIRCLE : LOGO_BARE);
    const w = box.aspect >= 1 ? inner : inner * box.aspect;
    return { w: height, h: height, logo: { w, h: w / box.aspect } };
  }
  const h = height * CAPSULE_HEIGHT;
  const pad = plate ? h * CAPSULE_PAD : 0;
  const share = plate ? LOGO_IN_CAPSULE : LOGO_BARE;
  const widest = Math.min(MAX_PLATE_WIDTH, FRAME.width - 2 * (SIDE_EDGE + h * reach));
  const logoH = Math.min(h * share, (widest - pad * 2) / box.aspect);
  const logoW = logoH * box.aspect;
  return { w: logoW + pad * 2, h, logo: { w: logoW, h: logoH } };
};

type Role = 'name' | 'lead' | 'headline' | 'trail';

type Entry = { role: Role; run: Run; box: number };

type Stack = { plate: Plate | null; entries: Entry[]; height: number; above: number };

const lineEntries = (props: GrowthCallScreenProps, faces: FaceSet, scale: number): Entry[] => {
  const lineSize = props.type.lineSize * scale;
  const lead = run(props.leadLine, faces.line, lineSize, TEXT_WIDTH);
  const trail = run(props.trailLine, faces.line, lineSize * TRAIL_SHARE, TEXT_WIDTH);
  const headline = headlineRuns(
    props.headline,
    faces.display,
    props.type.headlineSize * scale,
    TEXT_WIDTH,
  );
  return [
    ...(lead === null ? [] : [{ role: 'lead' as const, run: lead, box: lead.size * LINE_BOX }]),
    ...headline.map((line) => ({
      role: 'headline' as const,
      run: line,
      box: line.size * HEADLINE_BOX,
    })),
    ...(trail === null
      ? []
      : [{ role: 'trail' as const, run: trail, box: trail.size * LINE_BOX * TRAIL_BOX }]),
  ];
};

const stack = (
  props: GrowthCallScreenProps,
  faces: FaceSet,
  logo: LogoBox | null,
  scale: number,
): Stack => {
  const reach = props.caller.ripples > 0 ? props.caller.rippleReach / 100 : 0;
  const plan =
    props.caller.showLogo && logo !== null
      ? platePlan(logo, props.caller.logoSize * scale, props.caller.plate, reach)
      : null;
  const above = plan === null ? 0 : plan.h * reach;
  const name = props.caller.showName
    ? run(props.companyName, faces.label, props.type.nameSize * scale, NAME_WIDTH)
    : null;
  const lines = lineEntries(props, faces, scale);
  const rippleRoom = above * RIPPLE_CLEAR;
  const plateGap = PLATE_GAP * scale + rippleRoom;
  const afterPlate = plan === null ? 0 : plateGap + LINES_GAP * scale * 0.5;
  const firstLineGap = name === null ? afterPlate : LINES_GAP * scale;
  let cursor = plan === null ? 0 : above + plan.h;
  const entries: Entry[] = [];
  const place = (entry: Entry, gap: number) => {
    cursor += gap;
    entries.push({ ...entry, run: { ...entry.run, y: cursor + entry.run.size * BASELINE } });
    cursor += entry.box;
  };
  if (name !== null) {
    place({ role: 'name', run: name, box: name.size * NAME_BOX }, plan === null ? 0 : plateGap);
  }
  lines.forEach((entry, at) => {
    place(entry, at === 0 ? firstLineGap : 0);
  });
  const plate =
    plan === null
      ? null
      : {
          x: FRAME.centerX - plan.w / 2,
          y: above,
          w: plan.w,
          h: plan.h,
          radius: plan.h / 2,
          logo: {
            x: FRAME.centerX - plan.logo.w / 2,
            y: above + (plan.h - plan.logo.h) / 2,
            w: plan.logo.w,
            h: plan.logo.h,
          },
        };
  return { plate, entries, height: cursor, above };
};

const fitStack = (
  props: GrowthCallScreenProps,
  faces: FaceSet,
  logo: LogoBox | null,
  room: number,
): Stack => {
  let scale = 1;
  let fitted = stack(props, faces, logo, scale);
  for (let attempt = 0; attempt < FIT_TRIES && fitted.height > room; attempt++) {
    scale *= Math.min(FIT_STEP, room / fitted.height);
    fitted = stack(props, faces, logo, scale);
  }
  return fitted;
};

const centered = (entry: Run, y: number): Run => ({
  ...entry,
  x: FRAME.centerX - entry.width / 2,
  y: entry.y + y,
});

const action = (text: string, cx: number, cy: number, labelY: number, faces: FaceSet) => {
  const label = run(text, faces.label, ACTION_LABEL_SIZE, ACTION_LABEL_WIDTH);
  return {
    cx,
    cy,
    size: ICON_SIZE,
    label: label === null ? null : { ...label, x: cx - label.width / 2, y: labelY },
  };
};

export const buildLayout = (
  props: GrowthCallScreenProps,
  faces: FaceSet,
  logo: LogoBox | null,
): Layout => {
  const barW = (FRAME.width * props.layout.barWidth) / 100;
  const barY = Math.min(props.layout.barY, FRAME.height - BOTTOM_MARGIN - BAR_HEIGHT / 2);
  const bar = {
    x: FRAME.centerX - barW / 2,
    y: barY - BAR_HEIGHT / 2,
    w: barW,
    h: BAR_HEIGHT,
    radius: BAR_HEIGHT / 2,
  };
  const knobSize = BAR_HEIGHT - KNOB_INSET * 2;
  const iconY = bar.y - ICON_ABOVE_BAR;
  const actionsShown = props.layout.showActions;
  const regionBottom = actionsShown
    ? iconY - ICON_SIZE / 2 - ACTION_CLEARANCE
    : bar.y - BAR_CLEARANCE;
  const regionTop =
    TOP_LIMIT - Math.min(stack(props, faces, logo, 1).above, TOP_LIMIT - RIPPLE_EDGE);
  const room = regionBottom - regionTop;
  const top = fitStack(props, faces, logo, room);
  const free = Math.max(0, room - top.height);
  const offset = Math.max(
    regionTop,
    Math.min(regionBottom - top.height, regionTop + free * BIAS + props.layout.callerY),
  );
  const shift = (role: Role) =>
    top.entries.filter((entry) => entry.role === role).map((entry) => centered(entry.run, offset));
  const plate =
    top.plate === null
      ? null
      : {
          ...top.plate,
          y: top.plate.y + offset,
          logo: { ...top.plate.logo, y: top.plate.logo.y + offset },
        };
  const labelY = bar.y - LABEL_ABOVE_BAR;
  const slideLeft = bar.x + KNOB_INSET + knobSize + 10;
  const slideRight = bar.x + bar.w - bar.radius * 0.35;
  const slide = run(props.slideLabel, faces.label, SLIDE_SIZE, slideRight - slideLeft);
  const webLeft = bar.x + bar.radius * 0.36;
  const webRight = bar.x + bar.w - KNOB_INSET - knobSize - 28;
  const website = run(props.website, faces.line, WEBSITE_SIZE, Math.max(40, webRight - webLeft));
  const textY = bar.y + bar.h / 2;
  return {
    plate,
    name: shift('name')[0] ?? null,
    lead: shift('lead')[0] ?? null,
    headline: shift('headline'),
    trail: shift('trail')[0] ?? null,
    remind: actionsShown
      ? action(props.remindLabel, FRAME.centerX - ACTION_SPREAD, iconY, labelY, faces)
      : null,
    message: actionsShown
      ? action(props.messageLabel, FRAME.centerX + ACTION_SPREAD, iconY, labelY, faces)
      : null,
    bar,
    knob: { size: knobSize, inset: KNOB_INSET, travel: bar.w - knobSize - KNOB_INSET * 2 },
    slide:
      slide === null
        ? null
        : { ...slide, x: (slideLeft + slideRight - slide.width) / 2, y: textY + slide.size * 0.34 },
    website:
      website === null
        ? null
        : {
            ...website,
            x: (webLeft + webRight - website.width) / 2,
            y: textY + website.size * 0.34,
          },
  };
};

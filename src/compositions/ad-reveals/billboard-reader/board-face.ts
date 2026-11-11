import type { BillboardReaderProps } from '@/schemas';
import { type FaceKey, font } from './assets';
import { mix, readableOn } from './color';

const FACE_WIDTH = 2048;
const FACE_HEIGHT = 1280;

const LEFT = 150;
const COLUMN = 1080;
const RIGHT = FACE_WIDTH - 170;
const BOTTOM = FACE_HEIGHT - 160;
const LOCKUP_WIDTH = 560;
const LOGO_WIDTH = 560;
const SHORT_GROWTH = 1.34;
const PLATE_PAD = 26;

type Fitted = { lines: string[]; size: number };

const breakWord = (ctx: CanvasRenderingContext2D, word: string, width: number): string[] => {
  const pieces: string[] = [];
  let piece = '';
  for (const char of word) {
    if (piece !== '' && ctx.measureText(piece + char).width > width) {
      pieces.push(piece);
      piece = char;
    } else {
      piece += char;
    }
  }
  return piece === '' ? pieces : [...pieces, piece];
};

const wrap = (ctx: CanvasRenderingContext2D, text: string, width: number): string[] => {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/).filter((part) => part !== '')) {
    const next = line === '' ? word : `${line} ${word}`;
    if (ctx.measureText(next).width <= width) {
      line = next;
    } else if (line === '') {
      lines.push(...breakWord(ctx, word, width));
    } else {
      lines.push(line);
      line = word;
    }
  }
  return line === '' ? lines : [...lines, line];
};

const setFace = (ctx: CanvasRenderingContext2D, face: FaceKey, size: number, tracking: number) => {
  ctx.font = font(face, size);
  ctx.letterSpacing = `${(tracking * size).toFixed(2)}px`;
};

const fitText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  face: FaceKey,
  tracking: number,
  sizes: { max: number; min: number; single?: number },
  width: number,
  maxLines: number,
  shrinkFirst = 0.74,
): Fitted => {
  for (let count = 1; count <= maxLines; count++) {
    const floor = count < maxLines ? Math.max(sizes.min, sizes.max * shrinkFirst) : sizes.min;
    const start = count === 1 ? Math.max(sizes.max, sizes.single ?? 0) : sizes.max;
    for (let size = start; size >= floor; size -= 2) {
      setFace(ctx, face, size, tracking);
      const lines = wrap(ctx, text, width);
      const fits = lines.every((line) => ctx.measureText(line).width <= width);
      if (lines.length <= count && fits) {
        return { lines, size };
      }
    }
  }
  setFace(ctx, face, sizes.min, tracking);
  return { lines: wrap(ctx, text, width).slice(0, maxLines), size: sizes.min };
};

const drawLines = (
  ctx: CanvasRenderingContext2D,
  fitted: Fitted,
  face: FaceKey,
  tracking: number,
  color: string,
  x: number,
  top: number,
  leading: number,
  align: CanvasTextAlign,
) => {
  setFace(ctx, face, fitted.size, tracking);
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  fitted.lines.forEach((line, index) => {
    ctx.fillText(line, x, top + fitted.size * (0.8 + index * leading));
  });
  return fitted.lines.length * fitted.size * leading;
};

const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
};

const drawBrackets = (ctx: CanvasRenderingContext2D, color: string) => {
  const inset = 92;
  const arm = 120;
  const thick = 14;
  ctx.fillStyle = color;
  ctx.fillRect(inset, inset, arm, thick);
  ctx.fillRect(inset, inset, thick, arm);
  ctx.fillRect(FACE_WIDTH - inset - arm, FACE_HEIGHT - inset - thick, arm, thick);
  ctx.fillRect(FACE_WIDTH - inset - thick, FACE_HEIGHT - inset - arm, thick, arm);
};

export type FaceInput = Pick<
  BillboardReaderProps,
  'headline' | 'headlineAccent' | 'tagline' | 'companyName' | 'colors' | 'type' | 'lockup'
> & { brackets: boolean };

export const faceInput = (props: BillboardReaderProps): FaceInput => ({
  headline: props.headline,
  headlineAccent: props.headlineAccent,
  tagline: props.tagline,
  companyName: props.companyName,
  colors: props.colors,
  type: props.type,
  lockup: props.lockup,
  brackets: props.board.brackets,
});

const drawLockup = (
  ctx: CanvasRenderingContext2D,
  props: FaceInput,
  logo: HTMLImageElement | null,
  text: string,
) => {
  const name = props.type.uppercase ? props.companyName.toUpperCase() : props.companyName;
  const fitted = fitText(
    ctx,
    name,
    'name',
    0.05,
    { max: props.type.nameSize, min: 40 },
    LOCKUP_WIDTH,
    2,
  );
  const nameHeight = name.trim() === '' ? 0 : fitted.lines.length * fitted.size * 1.08;
  if (nameHeight > 0) {
    drawLines(ctx, fitted, 'name', 0.05, text, RIGHT, BOTTOM - nameHeight, 1.08, 'right');
  }
  if (logo === null) {
    return;
  }
  const aspect = logo.naturalWidth / Math.max(1, logo.naturalHeight);
  const height = Math.min(props.lockup.logoHeight, LOGO_WIDTH / aspect);
  const width = height * aspect;
  const pad = props.lockup.showPlate ? PLATE_PAD : 0;
  const bottom = BOTTOM - nameHeight - (nameHeight > 0 ? 34 : 0);
  const top = bottom - height - pad * 2;
  if (props.lockup.showPlate) {
    ctx.fillStyle = props.colors.plate;
    roundRect(ctx, RIGHT - width - pad * 2, top, width + pad * 2, height + pad * 2, 22);
  }
  ctx.drawImage(logo, RIGHT - width - pad, top + pad, width, height);
};

const TEXT_TOP = 320;
const TEXT_ROOM = FACE_HEIGHT - 180 - TEXT_TOP;

const layoutCopy = (
  ctx: CanvasRenderingContext2D,
  props: FaceInput,
  scale: number,
  taglineScale: number,
) => {
  const caps = (value: string) => (props.type.uppercase ? value.toUpperCase() : value);
  const sizes = {
    max: props.type.headlineSize * scale,
    min: 70 * scale,
    single: props.type.headlineSize * SHORT_GROWTH * scale,
  };
  const headline = caps(props.headline);
  const accentLine = caps(props.headlineAccent);
  const first = fitText(ctx, headline, 'headline', -0.02, sizes, COLUMN, 2);
  const second = fitText(ctx, accentLine, 'headline', -0.02, sizes, COLUMN, 2);
  const size = Math.min(first.size, second.size);
  const shared = { max: size, min: sizes.min, single: size };
  const one = fitText(ctx, headline, 'headline', -0.02, shared, COLUMN, 2);
  const two = fitText(ctx, accentLine, 'headline', -0.02, shared, COLUMN, 2);
  const tagline = fitText(
    ctx,
    props.tagline,
    'tagline',
    0,
    { max: props.type.taglineSize * taglineScale, min: 36 * taglineScale },
    COLUMN * 0.86,
    3,
    0.94,
  );
  const ruleGap = size * 0.3;
  const heads = (one.lines.length + two.lines.length) * size;
  const block = heads + ruleGap * 1.9 + 12 + tagline.lines.length * tagline.size * 1.32;
  return { one, two, tagline, size, block, ruleGap };
};

const fitCopy = (ctx: CanvasRenderingContext2D, props: FaceInput) => {
  const tries: [number, number][] = [1, 0.9, 0.8, 0.72].map((taglineScale) => [1, taglineScale]);
  for (let scale = 0.95; scale >= 0.6; scale -= 0.05) {
    tries.push([scale, 0.72 * scale]);
  }
  let copy = layoutCopy(ctx, props, 1, 1);
  for (const [scale, taglineScale] of tries) {
    copy = layoutCopy(ctx, props, scale, taglineScale);
    if (copy.block <= TEXT_ROOM) {
      return copy;
    }
  }
  return copy;
};

export const drawBoardFace = (
  canvas: HTMLCanvasElement,
  props: FaceInput,
  logo: HTMLImageElement | null,
) => {
  canvas.width = FACE_WIDTH;
  canvas.height = FACE_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    return;
  }
  const { colors } = props;
  const accent = readableOn(colors.accent, colors.board, 3.2);
  const shade = ctx.createLinearGradient(0, 0, 0, FACE_HEIGHT);
  shade.addColorStop(0, mix(colors.board, '#ffffff', 0.05));
  shade.addColorStop(0.55, colors.board);
  shade.addColorStop(1, mix(colors.board, '#000000', 0.18));
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, FACE_WIDTH, FACE_HEIGHT);
  if (props.brackets) {
    drawBrackets(ctx, accent);
  }
  const copy = fitCopy(ctx, props);
  const { one, two, tagline, size, block, ruleGap } = copy;
  const leading = 1.0;
  const top = Math.max(
    TEXT_TOP,
    Math.min(FACE_HEIGHT - 180 - block, FACE_HEIGHT * 0.57 - block / 2),
  );
  let y = top;
  y += drawLines(ctx, one, 'headline', -0.02, colors.text, LEFT, y, leading, 'left');
  y += drawLines(ctx, two, 'headline', -0.02, accent, LEFT, y, leading, 'left');
  y += ruleGap;
  ctx.fillStyle = accent;
  ctx.fillRect(LEFT + 4, y, Math.max(90, size * 0.75), 12);
  y += 12 + ruleGap * 0.9;
  drawLines(ctx, tagline, 'tagline', 0, colors.tagline, LEFT + 2, y, 1.32, 'left');
  drawLockup(ctx, props, logo, colors.text);
};

export const drawLampPool = (canvas: HTMLCanvasElement) => {
  const width = 512;
  const height = 1024;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    return;
  }
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(width / 2, -height * 0.04);
  ctx.scale(1, 2.1);
  const pool = ctx.createRadialGradient(0, 0, 0, 0, 0, width * 0.5);
  pool.addColorStop(0, 'rgba(255,255,255,0.62)');
  pool.addColorStop(0.25, 'rgba(255,255,255,0.36)');
  pool.addColorStop(0.55, 'rgba(255,255,255,0.12)');
  pool.addColorStop(0.8, 'rgba(255,255,255,0.03)');
  pool.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = pool;
  ctx.fillRect(-width, 0, width * 2, height);
  ctx.restore();
};

import { mixLab } from '../../kit/lab-color';
import { fontSpec } from './fonts';
import { FRAME, type Plate, type Run } from './layout';
import type { Palette } from './palette';
import type { LogoImage } from './use-logo-image';

type Context = CanvasRenderingContext2D;

const STOPS = [0, 0.04, 0.14, 0.3, 0.5, 0.7, 0.86, 0.96, 1];
const GLOW_REACH_X = 760;
const GLOW_REACH_Y = 900;
const DITHER = 3;
const SEED = 0x51ab3c7;
const RIPPLE_ALPHA = 0.75;
const RIPPLE_WIDTH = 5;
const RIPPLE_ATTACK = 0.14;

const ease = (t: number) => t * t * (3 - 2 * t);

export type BackdropLayer = { key: string; canvas: HTMLCanvasElement };

const dither = (context: Context, wide: number, high: number) => {
  const image = context.getImageData(0, 0, wide, high);
  const pixels = image.data;
  let state = SEED;
  for (let at = 0; at < pixels.length; at += 4) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const offset = ((state >>> 8) / 0x1000000 - 0.5) * DITHER;
    pixels[at] = (pixels[at] ?? 0) + offset;
    pixels[at + 1] = (pixels[at + 1] ?? 0) + offset;
    pixels[at + 2] = (pixels[at + 2] ?? 0) + offset;
  }
  context.putImageData(image, 0, 0);
};

export const backdropLayer = (
  palette: Palette,
  glow: number,
  centerY: number,
  ratio: number,
  previous: BackdropLayer | undefined,
): BackdropLayer => {
  const wide = Math.round(FRAME.width * ratio);
  const high = Math.round(FRAME.height * ratio);
  const key = JSON.stringify([palette.background, palette.glow, glow, centerY, wide, high]);
  if (previous?.key === key) {
    return previous;
  }
  const canvas = previous?.canvas ?? document.createElement('canvas');
  canvas.width = wide;
  canvas.height = high;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (context !== null) {
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.fillStyle = palette.background;
    context.fillRect(0, 0, FRAME.width, FRAME.height);
    if (glow > 0) {
      const center = mixLab(palette.background, palette.glow, glow / 100);
      context.save();
      context.translate(FRAME.centerX, centerY);
      context.scale(1, GLOW_REACH_Y / GLOW_REACH_X);
      const gradient = context.createRadialGradient(0, 0, 0, 0, 0, GLOW_REACH_X);
      for (const stop of STOPS) {
        gradient.addColorStop(stop, mixLab(center, palette.background, ease(stop)));
      }
      context.fillStyle = gradient;
      const span = GLOW_REACH_X * 2;
      context.fillRect(-span, -span * 2, span * 2, span * 4);
      context.restore();
      context.setTransform(1, 0, 0, 1, 0, 0);
      dither(context, wide, high);
    }
  }
  return { key, canvas };
};

const capsule = (context: Context, x: number, y: number, w: number, h: number) => {
  context.beginPath();
  context.roundRect(x, y, w, h, Math.min(h, w) / 2);
};

export type RippleState = { frame: number; start: number; every: number; count: number };

export const drawRipples = (
  context: Context,
  plate: Plate,
  palette: Palette,
  state: RippleState,
  reach: number,
  strength: number,
) => {
  if (state.count <= 0 || strength <= 0) {
    return;
  }
  const base = context.globalAlpha;
  const spacing = state.every / state.count;
  const distance = (plate.h * reach) / 100;
  for (let ring = 0; ring < state.count; ring++) {
    const since = state.frame - state.start - ring * spacing;
    if (since < 0) {
      continue;
    }
    const t = (since % state.every) / state.every;
    const grow = 1 - (1 - t) ** 2;
    const attack = Math.min(1, t / RIPPLE_ATTACK);
    const alpha = RIPPLE_ALPHA * (1 - t) ** 1.4 * attack * (2 - attack) * strength;
    const e = RIPPLE_WIDTH / 2 + grow * distance;
    context.globalAlpha = base * alpha;
    context.strokeStyle = palette.ripple;
    context.lineWidth = RIPPLE_WIDTH * (1 - 0.5 * t);
    capsule(context, plate.x - e, plate.y - e, plate.w + e * 2, plate.h + e * 2);
    context.stroke();
  }
  context.globalAlpha = base;
};

export const drawPlate = (
  context: Context,
  plate: Plate,
  logo: LogoImage,
  palette: Palette,
  look: { alpha: number; scale: number; backing: boolean },
) => {
  if (look.alpha <= 0) {
    return;
  }
  const cx = plate.x + plate.w / 2;
  const cy = plate.y + plate.h / 2;
  context.save();
  context.globalAlpha *= look.alpha;
  context.translate(cx, cy);
  context.scale(look.scale, look.scale);
  context.translate(-cx, -cy);
  if (look.backing) {
    context.fillStyle = palette.plate;
    capsule(context, plate.x, plate.y, plate.w, plate.h);
    context.fill();
    if (palette.plateRim !== null) {
      context.lineWidth = 3;
      context.strokeStyle = palette.plateRim;
      context.stroke();
    }
  }
  if (logo !== null) {
    const { image, box } = logo;
    context.drawImage(
      image,
      box.x * image.naturalWidth,
      box.y * image.naturalHeight,
      box.w * image.naturalWidth,
      box.h * image.naturalHeight,
      plate.logo.x,
      plate.logo.y,
      plate.logo.w,
      plate.logo.h,
    );
  }
  context.restore();
};

const SPRITE_PAD = 0.6;
const SPRITE_ASCENT = 1.3;
const SPRITE_HEIGHT = 1.9;
const SPRITE_LIMIT = 96;
const sprites = new Map<string, HTMLCanvasElement>();

const spriteFor = (run: Run, color: string, ratio: number) => {
  const key = JSON.stringify([run.text, run.face, run.size, color, ratio]);
  const known = sprites.get(key);
  if (known !== undefined) {
    return known;
  }
  if (sprites.size >= SPRITE_LIMIT) {
    sprites.clear();
  }
  const pad = run.size * SPRITE_PAD;
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil((run.width + pad * 2) * ratio);
  canvas.height = Math.ceil(run.size * SPRITE_HEIGHT * ratio);
  const local = canvas.getContext('2d');
  if (local !== null) {
    local.setTransform(ratio, 0, 0, ratio, 0, 0);
    local.font = fontSpec(run.face, run.size);
    local.letterSpacing = `${run.face.tracking * run.size}px`;
    local.textAlign = 'left';
    local.textBaseline = 'alphabetic';
    local.fillStyle = color;
    local.fillText(run.text, pad, run.size * SPRITE_ASCENT);
  }
  sprites.set(key, canvas);
  return canvas;
};

const snap = (value: number, ratio: number) => Math.round(value * ratio) / ratio;

export const drawRun = (
  context: Context,
  run: Run | null,
  color: string,
  alpha: number,
  dy = 0,
) => {
  if (run === null || alpha <= 0) {
    return;
  }
  const ratio = context.getTransform().a;
  const sprite = spriteFor(run, color, ratio);
  const base = context.globalAlpha;
  context.globalAlpha = base * Math.min(1, alpha);
  context.drawImage(
    sprite,
    snap(run.x - run.size * SPRITE_PAD, ratio),
    snap(run.y - run.size * SPRITE_ASCENT, ratio) + dy,
    sprite.width / ratio,
    sprite.height / ratio,
  );
  context.globalAlpha = base;
};

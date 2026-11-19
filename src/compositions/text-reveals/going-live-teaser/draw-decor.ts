import { mixLab } from '../../kit/lab-color';
import { lerp } from '../../kit/motion';
import type { Palette } from './palette';
import { FRAME } from './text-fit';
import { DECOR, eased, glide, progress, settle, smooth } from './timeline';

type Context = CanvasRenderingContext2D;

const STOPS = [0, 0.12, 0.25, 0.38, 0.5, 0.62, 0.75, 0.88, 1];

const DITHER_SIZE = 128;
const DITHER_ALPHA = 0.015;

let dither: HTMLCanvasElement | null = null;

const ditherTile = (): HTMLCanvasElement | null => {
  if (dither !== null || typeof document === 'undefined') {
    return dither;
  }
  const canvas = document.createElement('canvas');
  canvas.width = DITHER_SIZE;
  canvas.height = DITHER_SIZE;
  const context = canvas.getContext('2d');
  if (context === null) {
    return null;
  }
  const image = context.createImageData(DITHER_SIZE, DITHER_SIZE);
  let seed = 0x2f1f5f;
  for (let at = 0; at < image.data.length; at += 4) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const value = seed >>> 31 === 1 ? 255 : 0;
    image.data[at] = value;
    image.data[at + 1] = value;
    image.data[at + 2] = value;
    image.data[at + 3] = 255;
  }
  context.putImageData(image, 0, 0);
  dither = canvas;
  return dither;
};

const ditherPattern = (context: Context): CanvasPattern | null => {
  const tile = ditherTile();
  return tile === null ? null : context.createPattern(tile, 'repeat');
};

const smoothstep = (t: number) => t * t * (3 - 2 * t);

const bell = (t: number) => Math.sin(Math.PI * Math.max(0, Math.min(1, t)));

export const drawBackdrop = (context: Context, palette: Palette, frame: number) => {
  const x = FRAME.centerX + Math.sin(frame / 70) * 60;
  const y = FRAME.height * 0.52 + Math.cos(frame / 90) * 80;
  const radius = Math.hypot(FRAME.width, FRAME.height) * 0.52;
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
  for (const offset of STOPS) {
    gradient.addColorStop(offset, mixLab(palette.background, palette.edge, smoothstep(offset)));
  }
  context.fillStyle = gradient;
  context.fillRect(0, 0, FRAME.width, FRAME.height);
  const grain = ditherPattern(context);
  if (grain !== null) {
    context.save();
    context.globalAlpha = DITHER_ALPHA;
    context.fillStyle = grain;
    context.fillRect(0, 0, FRAME.width, FRAME.height);
    context.restore();
  }
};

export const BAR_WIDTH = 230;
const BAR_SHADE = 0.22;

const BAR_START = 380;
const BAR_SPEED = 60;
const BAR_PULL = 1.2;

export const barEdge = (frame: number) => {
  const t = Math.max(0, frame - DECOR.bar.from);
  return BAR_START - BAR_SPEED * t - BAR_PULL * t * t;
};

export const drawBar = (context: Context, palette: Palette, frame: number) => {
  if (frame > DECOR.bar.to) {
    return;
  }
  const left = barEdge(frame);
  const shade = context.createLinearGradient(left, 0, left + BAR_WIDTH, 0);
  shade.addColorStop(0, palette.sheet);
  shade.addColorStop(1, mixLab(palette.sheet, palette.background, BAR_SHADE));
  context.fillStyle = shade;
  context.fillRect(left, -10, BAR_WIDTH, FRAME.height + 20);
};

const roundedRect = (context: Context, x: number, y: number, w: number, h: number, r: number) => {
  context.beginPath();
  context.roundRect(x, y, w, h, r);
};

const SHEETS = [
  { y: 600, tilt: -0.08, from: -980, to: 1500, start: 0, end: 0.86 },
  { y: 1330, tilt: 0.06, from: -1300, to: 1250, start: 0.12, end: 1 },
];

export const drawSheets = (context: Context, palette: Palette, frame: number) => {
  const life = progress(frame, DECOR.sheets);
  if (life <= 0 || life >= 1) {
    return;
  }
  for (const sheet of SHEETS) {
    const t = Math.max(0, Math.min(1, (life - sheet.start) / (sheet.end - sheet.start)));
    if (t <= 0 || t >= 1) {
      continue;
    }
    const x = lerp(sheet.from, sheet.to, smooth(t));
    const speed = Math.abs(smooth(Math.min(1, t + 0.02)) - smooth(t));
    context.save();
    context.translate(x, sheet.y);
    context.rotate(sheet.tilt);
    context.filter = `blur(${(4 + speed * 260).toFixed(2)}px)`;
    context.globalAlpha = 0.94;
    context.fillStyle = palette.sheet;
    roundedRect(context, 0, -120, 900, 240, 28);
    context.fill();
    context.fillStyle = palette.sheetLine;
    roundedRect(context, 420, 30, 380, 14, 7);
    context.fill();
    roundedRect(context, 470, 62, 330, 14, 7);
    context.fill();
    context.restore();
  }
};

const ARCS = [
  { x: 1180, y: -60, r: 560, spin: 0.004, start: 2.2 },
  { x: 1240, y: 40, r: 420, spin: -0.003, start: 2.5 },
  { x: -140, y: 2000, r: 560, spin: 0.0035, start: 5.2 },
];

export const drawArcs = (context: Context, palette: Palette, frame: number, scale: number) => {
  const life = progress(frame, DECOR.arcs);
  if (life <= 0 || life >= 1) {
    return;
  }
  const show = smooth(Math.min(1, life * 5)) * (1 - smooth(Math.max(0, (life - 0.8) * 5)));
  const drift = 1 + ARC_DRIFT * glide(life);
  context.save();
  context.globalAlpha = 0.85 * show;
  context.strokeStyle = palette.accent;
  context.lineWidth = 7;
  context.lineCap = 'butt';
  context.filter = `blur(${(2.5 * scale).toFixed(2)}px)`;
  for (const arc of ARCS) {
    const begin = arc.start + frame * arc.spin;
    context.beginPath();
    context.arc(arc.x, arc.y, arc.r * drift, begin, begin + 1.15);
    context.stroke();
  }
  context.restore();
};

const ARC_DRIFT = 0.24;
const SIGNAL_RADII = [330, 430];
const SIGNAL_TRAVEL = 230;
const SIGNAL_FROM = Math.PI * 1.14;
const SIGNAL_TO = Math.PI * 1.86;

export const drawSignal = (
  context: Context,
  palette: Palette,
  frame: number,
  options: { y: number; scale: number },
) => {
  const life = progress(frame, DECOR.signal);
  if (life <= 0) {
    return;
  }
  const show = Math.min(1, life * 6);
  const travel = SIGNAL_TRAVEL * glide(life);
  context.save();
  context.strokeStyle = palette.accent;
  context.lineWidth = 7;
  context.lineCap = 'butt';
  context.filter = `blur(${(2.5 * options.scale).toFixed(2)}px)`;
  SIGNAL_RADII.forEach((radius, at) => {
    context.globalAlpha = 0.85 * show * (1 - at * 0.35);
    context.beginPath();
    context.arc(FRAME.centerX, options.y, radius + travel, SIGNAL_FROM, SIGNAL_TO);
    context.stroke();
  });
  context.restore();
};

const TILE_BARS = [0.45, 0.8, 0.6];

const drawTiles = (context: Context, palette: Palette, top: number, flip: boolean) => {
  const tileWidth = FRAME.width / 3;
  context.strokeStyle = mixLab(palette.panel, palette.glow, 0.35);
  context.lineWidth = 2;
  for (let at = 1; at < 3; at++) {
    context.beginPath();
    context.moveTo(at * tileWidth, top);
    context.lineTo(at * tileWidth, top + 190);
    context.stroke();
  }
  context.beginPath();
  context.moveTo(0, flip ? top : top + 190);
  context.lineTo(FRAME.width, flip ? top : top + 190);
  context.stroke();
  context.fillStyle = mixLab(palette.panel, palette.accent, 0.55);
  for (let tile = 0; tile < 3; tile++) {
    TILE_BARS.forEach((share, at) => {
      const height = 90 * (tile === 1 ? 1 - share * 0.5 : share);
      const x = tile * tileWidth + tileWidth / 2 - 50 + at * 38;
      const base = flip ? top + 50 : top + 140;
      context.fillRect(x, flip ? base : base - height, 24, height);
    });
  }
};

const BOKEH = [
  { x: 150, y: -380, r: 70 },
  { x: 880, y: -300, r: 54 },
  { x: 560, y: -560, r: 66 },
  { x: 140, y: 280, r: 60 },
  { x: 860, y: 340, r: 48 },
  { x: 520, y: 470, r: 56 },
];

export const drawDashboard = (context: Context, palette: Palette, frame: number, scale: number) => {
  const life = progress(frame, DECOR.dashboard);
  if (life <= 0 || life >= 1) {
    return;
  }
  const alpha = smooth(Math.min(1, life * 6)) * (1 - smooth(Math.max(0, (life - 0.78) / 0.22)));
  const center = lerp(1120, 820, glide(life));
  context.save();
  context.globalAlpha = alpha;
  context.fillStyle = palette.panel;
  context.fillRect(-10, center - 760, FRAME.width + 20, 1520);
  drawTiles(context, palette, center - 700, false);
  drawTiles(context, palette, center + 510, true);
  context.strokeStyle = mixLab(palette.panel, palette.glow, 0.45);
  context.lineWidth = 10;
  context.lineCap = 'round';
  for (const offset of [-250, 250]) {
    context.beginPath();
    context.moveTo(180, center + offset);
    context.lineTo(700, center + offset);
    context.stroke();
  }
  context.fillStyle = palette.accent;
  context.filter = `blur(${(22 * scale).toFixed(2)}px)`;
  BOKEH.forEach((dot, at) => {
    context.globalAlpha = alpha * 0.55;
    const sway = Math.sin(frame / 24 + at * 1.3) * 30;
    context.beginPath();
    context.ellipse(dot.x + sway, center + dot.y, dot.r * 1.4, dot.r * 0.7, 0, 0, Math.PI * 2);
    context.fill();
  });
  context.restore();
};

const WIPE_WIDTH = 380;
const WIPE_CURVE = 320;

const wipeLeft = (frame: number) =>
  lerp(FRAME.width + 30, -WIPE_WIDTH - WIPE_CURVE - 30, eased(frame, DECOR.wipe, glide));

export const wipeTrailingEdge = (frame: number) => wipeLeft(frame) + WIPE_WIDTH + WIPE_CURVE;

export const drawWipe = (context: Context, palette: Palette, frame: number) => {
  if (frame < DECOR.wipe.from || frame > DECOR.wipe.to) {
    return;
  }
  const left = wipeLeft(frame);
  const bend = FRAME.height * 0.66;
  context.fillStyle = palette.wipe;
  context.beginPath();
  context.moveTo(left, -10);
  context.lineTo(left, bend);
  context.bezierCurveTo(
    left,
    bend + 380,
    left + WIPE_CURVE * 0.6,
    FRAME.height,
    left + WIPE_CURVE,
    FRAME.height + 10,
  );
  context.lineTo(left + WIPE_WIDTH + WIPE_CURVE, FRAME.height + 10);
  context.lineTo(left + WIPE_WIDTH + WIPE_CURVE, -10);
  context.closePath();
  context.fill();
};

const PUFFS = [0, 1, 2, 3, 4, 5];

export const drawSmoke = (
  context: Context,
  palette: Palette,
  frame: number,
  options: { amount: number; halfWidth: number; y: number; size: number; scale: number },
) => {
  const life = progress(frame, DECOR.smoke);
  if (options.amount <= 0 || life <= 0 || life >= 1) {
    return;
  }
  context.save();
  context.fillStyle = palette.glow;
  context.filter = `blur(${(16 * options.scale).toFixed(2)}px)`;
  for (const side of [-1, 1]) {
    for (const at of PUFFS) {
      const own = Math.max(0, Math.min(1, (life - at * 0.05) / 0.7));
      if (own <= 0) {
        continue;
      }
      const reach = settle(own);
      const x = FRAME.centerX + side * (options.halfWidth + 40 + at * 46 + reach * (120 + at * 30));
      const y = options.y + Math.sin(at * 2.1) * options.size * 0.28 - reach * 20;
      const radius = options.size * (0.38 + 0.08 * (at % 3)) * (0.7 + 0.5 * reach);
      context.globalAlpha = options.amount * 0.55 * bell(own);
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
  }
  context.restore();
};

const pulseLevel = (frame: number, span: { from: number; to: number }) => {
  const t = progress(frame, span);
  if (t <= 0 || t >= 1) {
    return 0;
  }
  const rise = 0.3;
  return t < rise ? smooth(t / rise) : 1 - smooth((t - rise) / (1 - rise));
};

export const drawPulse = (context: Context, palette: Palette, frame: number, amount: number) => {
  const level = Math.max(pulseLevel(frame, DECOR.pulseOne), pulseLevel(frame, DECOR.pulseTwo));
  if (amount <= 0 || level <= 0) {
    return;
  }
  context.save();
  context.globalAlpha = 0.82 * amount * level;
  context.fillStyle = palette.secondary;
  context.fillRect(0, 0, FRAME.width, FRAME.height);
  context.restore();
};

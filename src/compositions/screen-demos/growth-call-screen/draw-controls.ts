import { drawRun } from './draw-caller';
import type { Action, Layout, Run } from './layout';
import type { Palette } from './palette';

type Context = CanvasRenderingContext2D;

const PHONE =
  'M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384';
const BUBBLE =
  'M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719';
const ICON_GRID = 24;
const ALARM_BOX = 1.4;
const GLYPH_SHARE = 0.36;
const BAND_STOPS = [0, 0.15, 0.3, 0.45, 0.5, 0.55, 0.7, 0.85, 1];
const GLOSS_WIDTH = 150;
const GLOSS_ALPHA = 0.24;
const FILL_FADE = 1.25;
const PULSE_RINGS = 2;
const PULSE_ALPHA = 0.55;
const PULSE_WIDTH = 6;
const PULSE_REACH = 64;
const PULSE_EDGE = 24;
const PULSE_ATTACK = 0.14;

let paths: { phone: Path2D; bubble: Path2D } | null = null;

const icons = () => {
  if (paths === null) {
    paths = { phone: new Path2D(PHONE), bubble: new Path2D(BUBBLE) };
  }
  return paths;
};

const band = (t: number) => {
  const d = Math.abs(t - 0.5) * 2;
  const s = 1 - d;
  return s * s * (3 - 2 * s);
};

const paintAlarm = (context: Context, s: number, color: string) => {
  const cx = s * ALARM_BOX * 0.5;
  const cy = cx + s * 0.05;
  const r = s * 0.36;
  context.fillStyle = color;
  context.strokeStyle = color;
  context.lineCap = 'round';
  context.lineWidth = s * 0.08;
  for (const side of [-1, 1]) {
    context.save();
    context.translate(cx + side * s * 0.27, cy - s * 0.33);
    context.rotate(side * 0.72);
    context.beginPath();
    context.arc(0, 0, s * 0.15, Math.PI, 0);
    context.closePath();
    context.fill();
    context.restore();
    context.beginPath();
    context.moveTo(cx + side * s * 0.24, cy + s * 0.32);
    context.lineTo(cx + side * s * 0.34, cy + s * 0.44);
    context.stroke();
  }
  context.globalCompositeOperation = 'destination-out';
  context.lineWidth = s * 0.07;
  context.beginPath();
  context.arc(cx, cy, r + s * 0.035, 0, Math.PI * 2);
  context.stroke();
  context.globalCompositeOperation = 'source-over';
  context.beginPath();
  context.arc(cx, cy, r, 0, Math.PI * 2);
  context.fill();
  context.globalCompositeOperation = 'destination-out';
  context.lineCap = 'square';
  context.beginPath();
  context.moveTo(cx, cy - s * 0.2);
  context.lineTo(cx, cy);
  context.lineTo(cx - s * 0.15, cy);
  context.stroke();
  context.globalCompositeOperation = 'source-over';
};

let alarm: { key: string; canvas: HTMLCanvasElement } | null = null;

const alarmSprite = (s: number, color: string, ratio: number) => {
  const key = JSON.stringify([s, color, ratio]);
  if (alarm?.key === key) {
    return alarm.canvas;
  }
  const canvas = alarm?.canvas ?? document.createElement('canvas');
  canvas.width = Math.ceil(s * ALARM_BOX * ratio);
  canvas.height = canvas.width;
  const local = canvas.getContext('2d');
  if (local !== null) {
    local.setTransform(ratio, 0, 0, ratio, 0, 0);
    local.clearRect(0, 0, s * ALARM_BOX, s * ALARM_BOX);
    paintAlarm(local, s, color);
  }
  alarm = { key, canvas };
  return canvas;
};

const drawAlarm = (context: Context, icon: Action, palette: Palette) => {
  const ratio = context.getTransform().a;
  const box = icon.size * ALARM_BOX;
  context.drawImage(
    alarmSprite(icon.size, palette.text, ratio),
    icon.cx - box / 2,
    icon.cy - box / 2,
    box,
    box,
  );
};

const drawBubble = (context: Context, icon: Action, palette: Palette) => {
  const k = icon.size / ICON_GRID;
  context.save();
  context.translate(icon.cx - icon.size / 2, icon.cy - icon.size / 2);
  context.scale(k, k);
  context.fillStyle = palette.text;
  context.fill(icons().bubble);
  context.restore();
};

export const drawActions = (
  context: Context,
  layout: Layout,
  palette: Palette,
  alpha: number,
  dy: number,
) => {
  if (alpha <= 0) {
    return;
  }
  context.save();
  context.translate(0, dy);
  context.globalAlpha *= alpha;
  if (layout.remind !== null) {
    drawAlarm(context, layout.remind, palette);
  }
  if (layout.message !== null) {
    drawBubble(context, layout.message, palette);
  }
  context.restore();
  drawRun(context, layout.remind?.label ?? null, palette.text, alpha, dy);
  drawRun(context, layout.message?.label ?? null, palette.text, alpha, dy);
};

const pill = (context: Context, x: number, y: number, w: number, h: number) => {
  context.beginPath();
  context.roundRect(x, y, w, h, h / 2);
};

export const drawBar = (context: Context, layout: Layout, palette: Palette) => {
  const { bar } = layout;
  const gradient = context.createLinearGradient(0, bar.y, 0, bar.y + bar.h);
  gradient.addColorStop(0, palette.surfaceTop);
  gradient.addColorStop(1, palette.surface);
  context.fillStyle = gradient;
  pill(context, bar.x, bar.y, bar.w, bar.h);
  context.fill();
};

export const drawFill = (context: Context, layout: Layout, palette: Palette, answered: number) => {
  if (answered <= 0) {
    return;
  }
  const { bar, knob } = layout;
  const right = knob.inset * 2 + knob.size + knob.travel * answered;
  const base = context.globalAlpha;
  context.globalAlpha = base * Math.min(1, answered * FILL_FADE);
  context.fillStyle = palette.fill;
  pill(context, bar.x, bar.y, right, bar.h);
  context.fill();
  context.globalAlpha = base;
};

const withAlpha = (hex: string, alpha: number) => {
  const value = Number.parseInt(hex.slice(1, 7), 16);
  return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${alpha.toFixed(3)})`;
};

export const drawGloss = (context: Context, layout: Layout, palette: Palette, t: number | null) => {
  if (t === null) {
    return;
  }
  const { bar } = layout;
  const center = bar.x - GLOSS_WIDTH + t * (bar.w + GLOSS_WIDTH * 2);
  const gradient = context.createLinearGradient(center - GLOSS_WIDTH, 0, center + GLOSS_WIDTH, 0);
  for (const stop of BAND_STOPS) {
    gradient.addColorStop(stop, withAlpha(palette.gloss, GLOSS_ALPHA * band(stop)));
  }
  context.save();
  pill(context, bar.x, bar.y, bar.w, bar.h);
  context.clip();
  context.fillStyle = gradient;
  context.fillRect(center - GLOSS_WIDTH, bar.y, GLOSS_WIDTH * 2, bar.h);
  context.restore();
};

export type Pulse = { frame: number; every: number; strength: number; answered: number };

export const drawKnobPulse = (context: Context, layout: Layout, palette: Palette, pulse: Pulse) => {
  if (pulse.strength <= 0) {
    return;
  }
  const { bar, knob } = layout;
  const r = knob.size / 2;
  const cx = bar.x + knob.inset + r + knob.travel * pulse.answered;
  const cy = bar.y + bar.h / 2;
  const reach = Math.max(0, Math.min(PULSE_REACH, bar.x - PULSE_EDGE));
  const base = context.globalAlpha;
  context.strokeStyle = palette.knob;
  for (let ring = 0; ring < PULSE_RINGS; ring++) {
    const since = pulse.frame - (ring * pulse.every) / PULSE_RINGS;
    if (since < 0) {
      continue;
    }
    const t = (since % pulse.every) / pulse.every;
    const attack = Math.min(1, t / PULSE_ATTACK);
    context.globalAlpha =
      base * PULSE_ALPHA * (1 - t) ** 1.3 * attack * (2 - attack) * pulse.strength;
    context.lineWidth = PULSE_WIDTH * (1 - 0.4 * t);
    context.beginPath();
    context.arc(cx, cy, r + PULSE_WIDTH / 2 + (1 - (1 - t) ** 2) * reach, 0, Math.PI * 2);
    context.stroke();
  }
  context.globalAlpha = base;
};

export const drawKnob = (context: Context, layout: Layout, palette: Palette, answered: number) => {
  const { bar, knob } = layout;
  const r = knob.size / 2;
  const cx = bar.x + knob.inset + r + knob.travel * answered;
  const cy = bar.y + bar.h / 2;
  context.fillStyle = palette.knob;
  context.beginPath();
  context.arc(cx, cy, r, 0, Math.PI * 2);
  context.fill();
  const base = context.globalAlpha;
  context.globalAlpha = base * 0.45;
  context.lineWidth = 2;
  context.strokeStyle = palette.knobEdge;
  context.stroke();
  context.globalAlpha = base;
  const glyph = knob.size * GLYPH_SHARE;
  const k = glyph / ICON_GRID;
  context.save();
  context.translate(cx - glyph / 2, cy - glyph / 2);
  context.scale(k, k);
  context.fillStyle = palette.accent;
  context.strokeStyle = palette.accent;
  context.lineWidth = 1.6;
  context.lineJoin = 'round';
  context.fill(icons().phone);
  context.stroke(icons().phone);
  context.restore();
};

let sheen: HTMLCanvasElement | null = null;

const sheenCanvas = () => {
  if (sheen === null) {
    sheen = document.createElement('canvas');
  }
  return sheen;
};

export const drawSlideLabel = (
  context: Context,
  run: Run | null,
  palette: Palette,
  look: { alpha: number; shimmer: number | null; width: number; ratio: number },
) => {
  if (run === null || look.alpha <= 0) {
    return;
  }
  drawRun(context, run, palette.label, look.alpha);
  if (look.shimmer === null) {
    return;
  }
  const pad = run.size;
  const boxW = run.width + pad * 2;
  const boxH = run.size * 2;
  const canvas = sheenCanvas();
  const wide = Math.ceil(boxW * look.ratio);
  const high = Math.ceil(boxH * look.ratio);
  if (canvas.width !== wide || canvas.height !== high) {
    canvas.width = wide;
    canvas.height = high;
  }
  const local = canvas.getContext('2d');
  if (local === null) {
    return;
  }
  local.setTransform(look.ratio, 0, 0, look.ratio, 0, 0);
  local.clearRect(0, 0, boxW, boxH);
  local.globalCompositeOperation = 'source-over';
  drawRun(local, { ...run, x: pad, y: run.size * 1.3 }, palette.shimmer, 1);
  const half = (run.width * look.width) / 200;
  const center = pad - half + look.shimmer * (run.width + half * 2);
  const gradient = local.createLinearGradient(center - half, 0, center + half, 0);
  for (const stop of BAND_STOPS) {
    gradient.addColorStop(stop, `rgba(0,0,0,${band(stop).toFixed(3)})`);
  }
  local.globalCompositeOperation = 'destination-in';
  local.fillStyle = gradient;
  local.fillRect(0, 0, boxW, boxH);
  local.globalCompositeOperation = 'source-over';
  const base = context.globalAlpha;
  context.globalAlpha = base * look.alpha;
  context.drawImage(canvas, run.x - pad, run.y - run.size * 1.3, boxW, boxH);
  context.globalAlpha = base;
};

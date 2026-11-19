import { type Face, fontSpec } from './fonts';

export type Sprite = {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  originX: number;
  originY: number;
};

export type Ink = { fill: string; stroke?: string; strokeWidth?: number };

export type TextStyle = { face: Face; size: number; tracking: number };

const PAD = 0.35;

let scratch: CanvasRenderingContext2D | null = null;

const measureContext = (): CanvasRenderingContext2D | null => {
  if (scratch === null && typeof document !== 'undefined') {
    scratch = document.createElement('canvas').getContext('2d');
  }
  return scratch;
};

const applyFont = (context: CanvasRenderingContext2D, style: TextStyle) => {
  context.font = fontSpec(style.face, style.size);
  context.letterSpacing = `${style.tracking * style.size}px`;
};

export const textWidth = (text: string, style: TextStyle): number => {
  const context = measureContext();
  if (context === null) {
    return text.length * style.size * 0.6;
  }
  applyFont(context, style);
  const trailing = text.length > 0 ? style.tracking * style.size : 0;
  return Math.max(0, context.measureText(text).width - trailing);
};

export const makeSprite = (
  text: string,
  style: TextStyle,
  ink: Ink,
  ratio: number,
  anchor: 'center' | 'left' = 'center',
): Sprite => {
  const stroke = ink.stroke === undefined ? 0 : (ink.strokeWidth ?? 0);
  const pad = style.size * PAD + stroke;
  const width = textWidth(text, style) + pad * 2;
  const height = style.size * 1.3 + pad * 2;
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.ceil(width * ratio));
  canvas.height = Math.max(1, Math.ceil(height * ratio));
  const context = canvas.getContext('2d');
  if (context !== null) {
    context.scale(ratio, ratio);
    applyFont(context, style);
    context.textBaseline = 'middle';
    context.textAlign = 'left';
    const y = height / 2 + style.size * 0.04;
    if (ink.stroke !== undefined && stroke > 0) {
      context.lineJoin = 'round';
      context.lineWidth = stroke * 2;
      context.strokeStyle = ink.stroke;
      context.strokeText(text, pad, y);
    }
    context.fillStyle = ink.fill;
    context.fillText(text, pad, y);
  }
  return {
    canvas,
    width,
    height,
    originX: anchor === 'left' ? pad : width / 2,
    originY: height / 2,
  };
};

export type Placement = {
  x: number;
  y: number;
  scale?: number;
  alpha?: number;
  blur?: number;
  rotate?: number;
};

export const drawSprite = (
  context: CanvasRenderingContext2D,
  sprite: Sprite,
  place: Placement,
  ratio: number,
) => {
  const alpha = place.alpha ?? 1;
  if (alpha <= 0.002) {
    return;
  }
  const scale = place.scale ?? 1;
  context.save();
  context.globalAlpha *= alpha;
  const blur = (place.blur ?? 0) * ratio * scale;
  context.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none';
  context.translate(place.x, place.y);
  if (place.rotate) {
    context.rotate(place.rotate);
  }
  context.scale(scale, scale);
  context.drawImage(sprite.canvas, -sprite.originX, -sprite.originY, sprite.width, sprite.height);
  context.restore();
};

const wrap = (words: string[], style: TextStyle, maxWidth: number): string[] => {
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current === '' ? word : `${current} ${word}`;
    if (current !== '' && textWidth(next, style) > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  return current === '' ? lines : [...lines, current];
};

export type Fitted = { size: number; lines: string[] };

export const fitLines = (
  text: string,
  base: TextStyle,
  maxWidth: number,
  maxLines: number,
): Fitted => {
  const paragraphs = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');
  if (paragraphs.length === 0) {
    return { size: base.size, lines: [] };
  }
  let size = base.size;
  for (let attempt = 0; attempt < 48; attempt++) {
    const style = { ...base, size };
    const lines = paragraphs.flatMap((line) =>
      wrap(
        line.split(' ').filter((word) => word !== ''),
        style,
        maxWidth,
      ),
    );
    const widest = Math.max(...lines.map((line) => textWidth(line, style)));
    if ((lines.length <= maxLines && widest <= maxWidth) || attempt === 47) {
      return { size, lines };
    }
    size *= 0.96;
  }
  return { size, lines: paragraphs };
};

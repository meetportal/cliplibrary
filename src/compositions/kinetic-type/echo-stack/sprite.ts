import { type Face, fontSpec, type LineMetrics } from './fonts';

const PAD = 0.2;
const BLUR_REACH = 2.5;

export type LineBox = { width: number; height: number; pad: number };

export const lineBox = (metrics: LineMetrics, size: number, maxBlur: number): LineBox => {
  const pad = Math.ceil(size * PAD + maxBlur * BLUR_REACH);
  return {
    width: Math.ceil(metrics.width * size) + 2 * pad,
    height: Math.ceil((metrics.ascent + metrics.descent) * size) + 2 * pad,
    pad,
  };
};

export type Sprite = { image: HTMLCanvasElement; box: LineBox };

export const makeSprite = ({
  text,
  face,
  size,
  tracking,
  metrics,
  box,
  color,
  ratio,
}: {
  text: string;
  face: Face;
  size: number;
  tracking: number;
  metrics: LineMetrics;
  box: LineBox;
  color: string;
  ratio: number;
}): Sprite | null => {
  if (typeof document === 'undefined') {
    return null;
  }
  const image = document.createElement('canvas');
  image.width = Math.max(1, Math.round(box.width * ratio));
  image.height = Math.max(1, Math.round(box.height * ratio));
  const context = image.getContext('2d');
  if (context === null) {
    return null;
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.font = fontSpec(face, size);
  context.letterSpacing = `${tracking * size}px`;
  context.textBaseline = 'alphabetic';
  context.textAlign = 'left';
  context.fillStyle = color;
  context.fillText(text, box.pad, box.pad + metrics.ascent * size);
  return { image, box };
};

export const drawSprite = (
  context: CanvasRenderingContext2D,
  sprite: Sprite,
  centerX: number,
  inkCenterY: number,
  inkHalf: number,
) => {
  const { box, image } = sprite;
  context.drawImage(
    image,
    centerX - box.width / 2,
    inkCenterY - inkHalf - box.pad,
    box.width,
    box.height,
  );
};

export const drawBand = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  radius: number,
  fill: string,
) => {
  context.fillStyle = fill;
  context.beginPath();
  context.roundRect(-width / 2, -height / 2, width, height, Math.min(height / 2, radius * height));
  context.fill();
};

export const prepareCanvas = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  ratio: number,
) => {
  const wide = Math.max(1, Math.round(width * ratio));
  const high = Math.max(1, Math.round(height * ratio));
  if (canvas.width !== wide || canvas.height !== high) {
    canvas.width = wide;
    canvas.height = high;
  }
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, wide, high);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
};

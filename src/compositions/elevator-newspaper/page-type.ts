import { sansFont, serifFont } from './page-fonts';

export type Context = CanvasRenderingContext2D;

export type Box = { x: number; y: number; width: number; height: number };

export const linesOf = (text: string): string[] =>
  text.split('\n').filter((line) => line.trim().length > 0);

export const serif = (context: Context, size: number, weight = 900) => {
  context.font = `${weight} ${size}px "${serifFont}"`;
};

export const sans = (context: Context, size: number, weight = 500) => {
  context.font = `${weight} ${size}px "${sansFont}"`;
};

export const spaced = (context: Context, size: number, tracking: number) => {
  context.letterSpacing = `${size * tracking}px`;
};

export const fitText = (
  context: Context,
  lines: string[],
  size: number,
  maxWidth: number,
  setFont: (size: number) => void,
): number => {
  setFont(size);
  const widest = Math.max(1, ...lines.map((line) => context.measureText(line).width));
  return widest > maxWidth ? (size * maxWidth) / widest : size;
};

export const condensedLines = (
  context: Context,
  lines: string[],
  { x, y, width }: { x: number; y: number; width: number },
  size: number,
  lineGap: number,
  squeeze: number,
) => {
  lines.forEach((line, index) => {
    context.save();
    context.translate(x + width / 2, y + index * size * lineGap);
    context.scale(squeeze, 1);
    context.fillText(line, 0, 0);
    context.restore();
  });
};

export const rule = (context: Context, x: number, y: number, width: number, weight: number) => {
  context.fillRect(x, y - weight / 2, width, weight);
};

export const fillerLines = (
  context: Context,
  box: Box,
  { gap, weight, seed }: { gap: number; weight: number; seed: number },
) => {
  for (let row = 0; box.y + row * gap + weight <= box.y + box.height; row += 1) {
    const ragged = (row * 7 + seed * 3) % 11 === 0 ? 0.55 : (row * 5 + seed) % 4 === 0 ? 0.88 : 1;
    context.fillRect(box.x, box.y + row * gap, box.width * ragged, weight);
  }
};

export const coverImage = (context: Context, image: CanvasImageSource, box: Box) => {
  const source = image as { width: number; height: number };
  const scale = Math.max(box.width / source.width, box.height / source.height);
  const width = source.width * scale;
  const height = source.height * scale;
  context.save();
  context.beginPath();
  context.rect(box.x, box.y, box.width, box.height);
  context.clip();
  context.drawImage(
    image,
    box.x + (box.width - width) / 2,
    box.y + (box.height - height) / 2,
    width,
    height,
  );
  context.restore();
};

export const placeholderImage = (context: Context, box: Box, color: string) => {
  context.save();
  context.fillStyle = color;
  context.globalAlpha = 0.18;
  context.fillRect(box.x, box.y, box.width, box.height);
  context.restore();
};

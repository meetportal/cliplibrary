import type { FilmDustProps } from '@/schemas';
import type { MarkInks } from './accent';
import { type Mark, markAlpha } from './dust';
import type { TitleSprite } from './title';

export type Weave = { x: number; y: number; scale: number };

type Frame = { width: number; height: number; frame: number; frames: number };

const drawPlate = (context: CanvasRenderingContext2D, plate: HTMLCanvasElement) => {
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.imageSmoothingEnabled = false;
  context.drawImage(plate, 0, 0);
  context.restore();
};

const drawSprite = (
  context: CanvasRenderingContext2D,
  sprite: TitleSprite,
  centerY: number,
  size: Frame,
  weave: Weave,
) => {
  context.save();
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.translate(size.width / 2 + weave.x, centerY + weave.y);
  context.scale(weave.scale, weave.scale);
  context.drawImage(sprite.canvas, sprite.left, sprite.top, sprite.width, sprite.height);
  context.restore();
};

const strokeHair = (context: CanvasRenderingContext2D, mark: Mark, x: number, y: number) => {
  const dx = Math.cos(mark.angle) * mark.length;
  const dy = Math.sin(mark.angle) * mark.length;
  const nx = -dy;
  const ny = dx;
  context.beginPath();
  context.moveTo(x - dx / 2, y - dy / 2);
  if (mark.kind === 'fibre') {
    context.quadraticCurveTo(
      x + nx * mark.bendA * 0.3,
      y + ny * mark.bendA * 0.3,
      x + dx / 2,
      y + dy / 2,
    );
  } else {
    context.bezierCurveTo(
      x - dx / 6 + nx * mark.bendA,
      y - dy / 6 + ny * mark.bendA,
      x + dx / 6 + nx * mark.bendB,
      y + dy / 6 + ny * mark.bendB,
      x + dx / 2,
      y + dy / 2,
    );
  }
  context.lineWidth = mark.width;
  context.stroke();
};

const drawMarks = (
  context: CanvasRenderingContext2D,
  inks: MarkInks,
  marks: readonly Mark[],
  size: Frame,
) => {
  context.save();
  context.lineCap = 'round';
  for (const mark of marks) {
    const alpha = markAlpha(mark, size.frame, size.frames);
    if (alpha <= 0) {
      continue;
    }
    const x = mark.x * size.width;
    const y = mark.y * size.height;
    context.globalAlpha = alpha;
    const ink = mark.kind === 'dark' ? inks.dark : inks.dust;
    context.strokeStyle = ink;
    context.fillStyle = ink;
    if (mark.kind === 'hair' || mark.kind === 'fibre') {
      strokeHair(context, mark, x, y);
    } else if (mark.kind === 'scratch') {
      const top = y;
      const bottom = y + mark.length * size.height;
      context.beginPath();
      context.moveTo(x, top);
      context.quadraticCurveTo(
        x + mark.bendA * size.width,
        (top + bottom) / 2,
        x + mark.bendB * size.width,
        bottom,
      );
      context.lineWidth = mark.width;
      context.stroke();
    } else {
      context.beginPath();
      context.arc(x, y, mark.width / 2, 0, Math.PI * 2);
      context.fill();
    }
  }
  context.restore();
};

export const drawFilm = (
  context: CanvasRenderingContext2D,
  props: FilmDustProps,
  plate: HTMLCanvasElement | null,
  sprite: TitleSprite | null,
  inks: MarkInks,
  marks: readonly Mark[],
  size: Frame,
  weave: Weave,
) => {
  if (props.showBackground && plate !== null) {
    drawPlate(context, plate);
  }
  if (props.title.show && sprite !== null) {
    drawSprite(context, sprite, props.title.centerY, size, weave);
  }
  drawMarks(context, inks, marks, size);
};

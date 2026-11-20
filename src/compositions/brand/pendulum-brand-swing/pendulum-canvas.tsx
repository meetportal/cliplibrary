import { useLayoutEffect, useRef } from 'react';
import { AbsoluteFill } from 'remotion';
import { useCanvasPixelRatio } from '../../kit/pixel-ratio';
import type { BobShape } from './bob';
import { fontSpec, WEIGHTS } from './fonts';
import type { Palette } from './palette';
import { angleAt, bobCenter, FRAME, PIVOT, type Swing, speedAt } from './swing';
import type { BobLogo } from './use-bob-logo';

type PendulumLook = {
  cordWidth: number;
  trail: number;
  shadow: number;
  monogram: string;
  family: string | null;
};

const GHOSTS = [0.34, 0.68, 1.02];
const GHOST_ALPHA = 0.2;
const SHADOW = { blur: 30, x: 12, y: 18, alpha: 0.6 };

const stadium = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.beginPath();
  ctx.roundRect(-width / 2, -height / 2, width, height, height / 2);
};

const drawLogo = (ctx: CanvasRenderingContext2D, shape: BobShape, logo: BobLogo) => {
  if (logo === null) {
    return false;
  }
  const { image, box } = logo;
  ctx.drawImage(
    image,
    box.x * image.naturalWidth,
    box.y * image.naturalHeight,
    box.w * image.naturalWidth,
    box.h * image.naturalHeight,
    -shape.logoWidth / 2,
    -shape.logoHeight / 2,
    shape.logoWidth,
    shape.logoHeight,
  );
  return true;
};

const drawMonogram = (
  ctx: CanvasRenderingContext2D,
  shape: BobShape,
  look: PendulumLook,
  palette: Palette,
) => {
  if (look.family === null || look.monogram === '') {
    return;
  }
  ctx.fillStyle = palette.monogram;
  ctx.font = fontSpec(look.family, WEIGHTS.bold, (shape.height - 2 * shape.ring) * 0.56);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(look.monogram, 0, shape.height * 0.03);
};

const placeBob = (ctx: CanvasRenderingContext2D, swing: Swing, angle: number) => {
  const center = bobCenter(swing, angle);
  ctx.translate(center.x, center.y);
  ctx.rotate(-angle);
};

type DrawArgs = {
  swing: Swing;
  time: number;
  shape: BobShape;
  palette: Palette;
  logo: BobLogo;
  look: PendulumLook;
};

const draw = (ctx: CanvasRenderingContext2D, ratio: number, args: DrawArgs) => {
  const { swing, time, shape, palette, logo, look } = args;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, FRAME.width, FRAME.height);
  const speed = speedAt(swing, time);
  ctx.fillStyle = palette.cord;
  GHOSTS.forEach((lag, at) => {
    ctx.save();
    ctx.globalAlpha = look.trail * GHOST_ALPHA * speed * (1 - at / GHOSTS.length);
    placeBob(ctx, swing, angleAt(swing, time - lag));
    stadium(ctx, shape.width, shape.height);
    ctx.fill();
    ctx.restore();
  });
  const angle = angleAt(swing, time);
  const reach = swing.length - shape.height / 2 + 1;
  ctx.strokeStyle = palette.cord;
  ctx.lineWidth = look.cordWidth;
  ctx.lineCap = 'butt';
  ctx.beginPath();
  ctx.moveTo(PIVOT.x, PIVOT.y);
  ctx.lineTo(PIVOT.x + reach * Math.sin(angle), PIVOT.y + reach * Math.cos(angle));
  ctx.stroke();
  ctx.save();
  placeBob(ctx, swing, angle);
  ctx.save();
  ctx.shadowColor = `rgba(0, 0, 0, ${(SHADOW.alpha * look.shadow).toFixed(3)})`;
  ctx.shadowBlur = SHADOW.blur * ratio;
  ctx.shadowOffsetX = SHADOW.x * ratio;
  ctx.shadowOffsetY = SHADOW.y * ratio;
  ctx.fillStyle = palette.cord;
  stadium(ctx, shape.width, shape.height);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = palette.plate;
  stadium(ctx, shape.width - 2 * shape.ring, shape.height - 2 * shape.ring);
  ctx.fill();
  if (!drawLogo(ctx, shape, logo)) {
    drawMonogram(ctx, shape, look, palette);
  }
  ctx.restore();
};

export const PendulumCanvas = (args: DrawArgs) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const ratio = useCanvasPixelRatio(1);
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext('2d') ?? null;
    if (ctx !== null) {
      draw(ctx, ratio, args);
    }
  });
  return (
    <AbsoluteFill>
      <canvas
        ref={ref}
        width={Math.round(FRAME.width * ratio)}
        height={Math.round(FRAME.height * ratio)}
        style={{ width: FRAME.width, height: FRAME.height }}
      />
    </AbsoluteFill>
  );
};

import { useLayoutEffect, useRef } from 'react';
import { type Face, fontSpec } from './fonts';
import { CENTER_X } from './geometry';

const RESOLUTION = 3;
const PAD = 0.7;
const FEATHER_CHARS = 5;
const WIDTH = CENTER_X * 2;

export type LineLook = {
  text: string;
  face: Face;
  size: number;
  tracking: number;
  color: string;
  top: number;
  height: number;
};

const drawLine = (canvas: HTMLCanvasElement, look: LineLook, reveal: number, pad: number) => {
  const context = canvas.getContext('2d');
  if (context === null) {
    return;
  }
  const height = look.height + pad * 2;
  const pixelsWide = Math.ceil(WIDTH * RESOLUTION);
  const pixelsHigh = Math.ceil(height * RESOLUTION);
  if (canvas.width !== pixelsWide || canvas.height !== pixelsHigh) {
    canvas.width = pixelsWide;
    canvas.height = pixelsHigh;
  }
  context.setTransform(RESOLUTION, 0, 0, RESOLUTION, 0, 0);
  context.globalCompositeOperation = 'source-over';
  context.clearRect(0, 0, WIDTH, height);
  if (reveal <= 0 || look.text === '') {
    return;
  }
  const spacing = look.tracking * look.size;
  context.font = fontSpec(look.face, look.size);
  context.letterSpacing = `${spacing}px`;
  context.textBaseline = 'alphabetic';
  context.textAlign = 'left';
  context.fillStyle = look.color;
  const metrics = context.measureText(look.text);
  const visible = Math.max(0, metrics.width - spacing);
  const ascent = metrics.fontBoundingBoxAscent;
  const descent = metrics.fontBoundingBoxDescent;
  const left = (WIDTH - visible) / 2;
  context.fillText(look.text, left, pad + (look.height - ascent - descent) / 2 + ascent);
  if (reveal >= 1) {
    return;
  }
  const feather = (FEATHER_CHARS * visible) / Math.max(1, Array.from(look.text).length);
  const head = left + reveal * (visible + feather);
  const mask = context.createLinearGradient(head - feather, 0, head, 0);
  mask.addColorStop(0, 'rgba(0, 0, 0, 1)');
  mask.addColorStop(1, 'rgba(0, 0, 0, 0)');
  context.globalCompositeOperation = 'destination-in';
  context.fillStyle = mask;
  context.fillRect(0, 0, WIDTH, height);
  context.globalCompositeOperation = 'source-over';
};

export const CanvasLine = ({
  look,
  offset,
  opacity,
  reveal,
}: {
  look: LineLook;
  offset: number;
  opacity: number;
  reveal: number;
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const pad = look.size * PAD;
  useLayoutEffect(() => {
    if (ref.current !== null) {
      drawLine(ref.current, look, reveal, pad);
    }
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: look.top,
        width: WIDTH,
        height: look.height,
        opacity,
        transform: offset === 0 ? undefined : `translateY(${offset.toFixed(3)}px)`,
      }}
    >
      <canvas
        ref={ref}
        aria-label={look.text}
        style={{
          position: 'absolute',
          left: 0,
          top: -pad,
          width: WIDTH,
          height: look.height + pad * 2,
        }}
      />
    </div>
  );
};

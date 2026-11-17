import { useLayoutEffect, useRef } from 'react';
import type { Face } from './fonts';
import { vanishAlpha } from './pencil';

const RESOLUTION = 2;
const GRAIN = 2;
const TEXT_VANISH = { bias: 0.22, spread: 0.53, fade: 0.25 };

type Letter = { char: string; reveal: number };

export type LineLook = {
  letters: Letter[];
  face: Face;
  size: number;
  leading: number;
  color: string;
  rise: number;
  erase: number;
};

const grainHash = (x: number, y: number) => {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

const prepare = (canvas: HTMLCanvasElement, width: number, height: number) => {
  const context = canvas.getContext('2d');
  if (context === null) {
    return null;
  }
  const wide = Math.ceil(width * RESOLUTION);
  const high = Math.ceil(height * RESOLUTION);
  if (canvas.width !== wide || canvas.height !== high) {
    canvas.width = wide;
    canvas.height = high;
  }
  context.setTransform(RESOLUTION, 0, 0, RESOLUTION, 0, 0);
  context.clearRect(0, 0, width, height);
  return context;
};

const rubOut = (
  context: CanvasRenderingContext2D,
  erase: number,
  width: number,
  height: number,
) => {
  context.globalCompositeOperation = 'destination-out';
  for (let x = 0; x < width; x += GRAIN) {
    let cleared = -1;
    for (let y = 0; y < height; y += GRAIN) {
      const left = 1 - vanishAlpha(erase, x / width, grainHash(x, y), TEXT_VANISH);
      if (left >= 1) {
        cleared = cleared < 0 ? y : cleared;
        continue;
      }
      if (cleared >= 0) {
        context.clearRect(x, cleared, GRAIN, y - cleared);
        cleared = -1;
      }
      if (left > 0) {
        const size = GRAIN * (0.75 + grainHash(y, x) * 0.6);
        context.globalAlpha = left;
        context.fillRect(
          x + (grainHash(x + 0.5, y) - 0.5) * GRAIN * 0.8,
          y + (grainHash(x, y + 0.5) - 0.5) * GRAIN * 0.8,
          size,
          size,
        );
      }
    }
    if (cleared >= 0) {
      context.clearRect(x, cleared, GRAIN, height - cleared);
    }
  }
  context.globalAlpha = 1;
  context.globalCompositeOperation = 'source-over';
};

const drawLine = (canvas: HTMLCanvasElement, look: LineLook, width: number, pad: number) => {
  const line = look.size * look.leading;
  const height = line + pad * 2;
  const context = prepare(canvas, width + pad * 2, height);
  if (context === null) {
    return;
  }
  context.font = `${look.face.weight} ${look.size}px "${look.face.family}"`;
  context.textBaseline = 'alphabetic';
  context.fillStyle = look.color;
  const metrics = context.measureText('Hg');
  const ascent = metrics.fontBoundingBoxAscent;
  const descent = metrics.fontBoundingBoxDescent;
  const baseline = pad + (line - ascent - descent) / 2 + ascent;
  let text = '';
  for (const letter of look.letters) {
    const x = pad + context.measureText(text).width;
    text += letter.char;
    if (letter.reveal > 0) {
      context.globalAlpha = letter.reveal;
      context.fillText(letter.char, x, baseline + look.rise * (1 - letter.reveal));
    }
  }
  context.globalAlpha = 1;
  if (look.erase > 0) {
    rubOut(context, look.erase, width + pad * 2, height);
  }
};

export const LineCanvas = ({
  look,
  left,
  top,
  width,
}: {
  look: LineLook;
  left: number;
  top: number;
  width: number;
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const pad = look.size * 0.4;
  useLayoutEffect(() => {
    if (ref.current !== null) {
      drawLine(ref.current, look, width, pad);
    }
  });
  return (
    <canvas
      ref={ref}
      aria-label={look.letters.map((letter) => letter.char).join('')}
      style={{
        position: 'absolute',
        left: left - pad,
        top: top - pad,
        width: width + pad * 2,
        height: look.size * look.leading + pad * 2,
      }}
    />
  );
};

export type NameLook = { text: string; face: Face; size: number; color: string; height: number };

const drawName = (canvas: HTMLCanvasElement, look: NameLook, width: number, pad: number) => {
  const context = prepare(canvas, width + pad * 2, look.height + pad * 2);
  if (context === null || look.text === '') {
    return;
  }
  context.font = `${look.face.weight} ${look.size}px "${look.face.family}"`;
  context.letterSpacing = `${-0.01 * look.size}px`;
  context.textBaseline = 'alphabetic';
  context.fillStyle = look.color;
  const metrics = context.measureText(look.text);
  const ascent = metrics.fontBoundingBoxAscent;
  const descent = metrics.fontBoundingBoxDescent;
  context.fillText(look.text, pad, pad + look.height / 2 + (ascent - descent) / 2);
};

export const NameCanvas = ({
  look,
  left,
  top,
  width,
}: {
  look: NameLook;
  left: number;
  top: number;
  width: number;
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const pad = look.size * 0.4;
  useLayoutEffect(() => {
    if (ref.current !== null) {
      drawName(ref.current, look, width, pad);
    }
  });
  return (
    <canvas
      ref={ref}
      aria-label={look.text}
      style={{
        position: 'absolute',
        left: left - pad,
        top: top - pad,
        width: width + pad * 2,
        height: look.height + pad * 2,
      }}
    />
  );
};

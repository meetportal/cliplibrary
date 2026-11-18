import { useMemo } from 'react';
import { AbsoluteFill, Img } from 'remotion';

const SCALE = 0.25;
const SHARE = 0.012;
const SEED = 31;

const hash = (x: number, y: number) => {
  const value = Math.sin(x * 127.1 + y * 311.7 + SEED * 74.7) * 43758.5453;
  return value - Math.floor(value);
};

const speckles = (width: number, height: number): string | null => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (context === null) {
    return null;
  }
  const image = context.createImageData(width, height);
  for (let at = 0; at < width * height; at++) {
    const lit = hash(at % width, Math.floor(at / width)) < SHARE;
    image.data[at * 4] = 255;
    image.data[at * 4 + 1] = 255;
    image.data[at * 4 + 2] = 255;
    image.data[at * 4 + 3] = lit ? 255 : 0;
  }
  context.putImageData(image, 0, 0);
  return canvas.toDataURL('image/png');
};

type GrainProps = { amount: number; width: number; height: number };

export const Grain = ({ amount, width, height }: GrainProps) => {
  const tile = useMemo(
    () => speckles(Math.round(width * SCALE), Math.round(height * SCALE)),
    [width, height],
  );
  if (amount <= 0 || tile === null) {
    return null;
  }
  return (
    <AbsoluteFill style={{ opacity: amount }}>
      <Img src={tile} style={{ width: '100%', height: '100%', display: 'block' }} />
    </AbsoluteFill>
  );
};

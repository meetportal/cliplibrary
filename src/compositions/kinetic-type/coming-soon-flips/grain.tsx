import { useMemo } from 'react';
import { AbsoluteFill, Img, useVideoConfig } from 'remotion';
import { pixelHash } from './noise';

const TILES = 6;
const DETAIL = 0.5;
const CUTOFF = 0.12;

const paintGrain = (width: number, height: number, seed: number): string | null => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (context === null) {
    return null;
  }
  const image = context.createImageData(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = pixelHash(x, y, seed);
      const at = (y * width + x) * 4;
      const light = value > 1 - CUTOFF;
      const strength = light ? (value - (1 - CUTOFF)) / CUTOFF : (CUTOFF - value) / CUTOFF;
      const tone = light ? 255 : 0;
      image.data[at] = tone;
      image.data[at + 1] = tone;
      image.data[at + 2] = tone;
      image.data[at + 3] = light || value < CUTOFF ? Math.round(255 * strength) : 0;
    }
  }
  context.putImageData(image, 0, 0);
  return canvas.toDataURL('image/png');
};

export const Grain = ({ amount, frame }: { amount: number; frame: number }) => {
  const { width, height } = useVideoConfig();
  const tiles = useMemo(
    () =>
      Array.from({ length: TILES }, (_, index) =>
        paintGrain(Math.round(width * DETAIL), Math.round(height * DETAIL), 7 + index),
      ),
    [width, height],
  );
  const tile = tiles[Math.abs(Math.floor(frame)) % TILES] ?? null;
  if (amount <= 0 || tile === null) {
    return null;
  }
  return (
    <AbsoluteFill style={{ opacity: amount * 2 }}>
      <Img src={tile} style={{ width: '100%', height: '100%', display: 'block' }} />
    </AbsoluteFill>
  );
};

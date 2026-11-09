import { useMemo } from 'react';
import { AbsoluteFill, Img, useVideoConfig } from 'remotion';
import type { ComingSoonFlipsProps } from '@/schemas';
import { fractalNoise } from './noise';

const DETAIL = 0.5;
const CONTRAST = 1.4;
const EDGE_SLOPE = 12;
const SPECK_SLOPE = 7;
const SPECK_FREQUENCY = 0.22;

const rgb = (hex: string) => [1, 3, 5].map((at) => Number.parseInt(hex.slice(at, at + 2), 16));

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const stretched = (value: number) => 0.5 + (value - 0.5) * CONTRAST;

type Plaster = ComingSoonFlipsProps['wall'] & {
  base: string;
  shade: string;
  speck: string;
  width: number;
  height: number;
};

const paintPlaster = (plaster: Plaster): string | null => {
  const { width, height } = plaster;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (context === null) {
    return null;
  }
  const wall = plaster;
  const base = rgb(plaster.base);
  const shade = rgb(plaster.shade);
  const speck = rgb(plaster.speck);
  const threshold = 0.66 - wall.blotchAmount * 0.3;
  const speckThreshold = 0.62 - wall.speckAmount * 0.24;
  const image = context.createImageData(width, height);
  const step = 1 / DETAIL;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const field = stretched(fractalNoise(x * step, y * step, wall.blotchScale, 5, wall.seed));
      const patch = wall.blotchAmount > 0 ? clamp01((field - threshold) * EDGE_SLOPE) : 0;
      const grain = stretched(fractalNoise(x * step, y * step, SPECK_FREQUENCY, 2, wall.seed + 5));
      const dot = patch * clamp01((grain - speckThreshold) * SPECK_SLOPE);
      const at = (y * width + x) * 4;
      for (let channel = 0; channel < 3; channel++) {
        const withPatch =
          (base[channel] ?? 0) + ((shade[channel] ?? 0) - (base[channel] ?? 0)) * patch;
        image.data[at + channel] = withPatch + ((speck[channel] ?? 0) - withPatch) * dot;
      }
      image.data[at + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  return canvas.toDataURL('image/png');
};

export const PlasterWall = ({ props }: { props: ComingSoonFlipsProps }) => {
  const { width, height } = useVideoConfig();
  const { wall, colors } = props;
  const { blotchScale, blotchAmount, speckAmount, seed } = wall;
  const texture = useMemo(
    () =>
      paintPlaster({
        blotchScale,
        blotchAmount,
        speckAmount,
        seed,
        base: colors.wall,
        shade: colors.wallShade,
        speck: colors.speck,
        width: Math.round(width * DETAIL),
        height: Math.round(height * DETAIL),
      }),
    [
      blotchScale,
      blotchAmount,
      speckAmount,
      seed,
      colors.wall,
      colors.wallShade,
      colors.speck,
      width,
      height,
    ],
  );
  return (
    <AbsoluteFill style={{ backgroundColor: colors.wall }}>
      {texture === null ? null : (
        <Img src={texture} style={{ width: '100%', height: '100%', display: 'block' }} />
      )}
    </AbsoluteFill>
  );
};

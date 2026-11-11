import { useMemo } from 'react';
import { AbsoluteFill, Img } from 'remotion';
import { fractalNoise, hash } from './noise';

const NOISE_WIDTH = 270;
const NOISE_HEIGHT = 480;
const NOISE_SEEDS = [11, 23, 37];
const STREAK_WIDTH = 810;
const STREAK_HEIGHT = 480;
const STREAK_TRAVEL = 2;
const STREAK_SPEED = 5.5;

const rgb = (hex: string) => [1, 3, 5].map((at) => Number.parseInt(hex.slice(at, at + 2), 16));

const paint = (
  width: number,
  height: number,
  color: string,
  shade: (x: number, y: number) => number,
): string | null => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (context === null) {
    return null;
  }
  const image = context.createImageData(width, height);
  const [red = 0, green = 0, blue = 0] = rgb(color);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const at = (y * width + x) * 4;
      image.data[at] = red;
      image.data[at + 1] = green;
      image.data[at + 2] = blue;
      image.data[at + 3] = Math.round(255 * Math.max(0, Math.min(1, shade(x, y))));
    }
  }
  context.putImageData(image, 0, 0);
  return canvas.toDataURL('image/png');
};

const blotch = (value: number) => {
  const t = Math.max(0, Math.min(1, (value - 0.38) / 0.3));
  return t * t * (3 - 2 * t);
};

export const NoiseField = ({
  color,
  opacity,
  frame,
}: {
  color: string;
  opacity: number;
  frame: number;
}) => {
  const tiles = useMemo(
    () =>
      NOISE_SEEDS.map((seed) =>
        paint(NOISE_WIDTH, NOISE_HEIGHT, color, (x, y) => blotch(fractalNoise(x, y, 0.11, seed))),
      ),
    [color],
  );
  const tile = tiles[Math.floor(Math.abs(frame)) % tiles.length] ?? null;
  if (opacity <= 0.002 || tile === null) {
    return null;
  }
  return (
    <AbsoluteFill style={{ opacity }}>
      <Img src={tile} style={{ width: '100%', height: '100%', display: 'block' }} />
    </AbsoluteFill>
  );
};

export const Streaks = ({
  color,
  opacity,
  frame,
  angle,
  imageHeight,
}: {
  color: string;
  opacity: number;
  frame: number;
  angle: number;
  imageHeight?: number;
}) => {
  const tile = useMemo(() => {
    const cos = Math.cos((angle * Math.PI) / 180);
    const sin = Math.sin((angle * Math.PI) / 180);
    return paint(STREAK_WIDTH, STREAK_HEIGHT, color, (x, y) => {
      const along = x * cos + y * sin;
      const across = -x * sin + y * cos;
      return blotch(fractalNoise(along * 0.06 + 40, across + 40, 0.2, 5) * 1.1 - 0.02);
    });
  }, [color, angle]);
  if (opacity <= 0.002 || tile === null) {
    return null;
  }
  const shift = Math.min(STREAK_TRAVEL * 100, Math.max(0, frame) * STREAK_SPEED);
  const span = STREAK_TRAVEL + 1;
  return (
    <AbsoluteFill style={{ opacity, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: imageHeight === undefined ? 0 : '50%',
          marginTop: imageHeight === undefined ? 0 : -imageHeight / 2,
          width: `${span * 100}%`,
          height: imageHeight ?? '100%',
          transform: `translateX(${((shift - STREAK_TRAVEL * 100) / span).toFixed(3)}%)`,
        }}
      >
        <Img src={tile} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>
    </AbsoluteFill>
  );
};

export const Stars = ({
  count,
  color,
  frame,
  width,
  height,
}: {
  count: number;
  color: string;
  frame: number;
  width: number;
  height: number;
}) => {
  const stars = useMemo(
    () =>
      Array.from({ length: Math.round(count) }, (_, index) => ({
        x: Math.round(hash(index, 1, 91) * width),
        y: Math.round(hash(index, 2, 91) * height),
        size: hash(index, 3, 91) > 0.8 ? 5 : 3,
        phase: hash(index, 4, 91) * Math.PI * 2,
        base: 0.35 + hash(index, 5, 91) * 0.5,
      })),
    [count, width, height],
  );
  return (
    <AbsoluteFill>
      {stars.map((star) => (
        <div
          key={`${star.x}-${star.y}`}
          style={{
            position: 'absolute',
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            borderRadius: star.size,
            backgroundColor: color,
            opacity: star.base * (0.55 + 0.45 * Math.sin(frame / 4 + star.phase)),
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const GRAIN_TILES = 6;
const GRAIN_SCALE = 0.25;
const GRAIN_SHARE = 0.012;

export const Grain = ({
  amount,
  color,
  frame,
  width,
  height,
}: {
  amount: number;
  color: string;
  frame: number;
  width: number;
  height: number;
}) => {
  const tiles = useMemo(
    () =>
      Array.from({ length: GRAIN_TILES }, (_, index) =>
        paint(Math.round(width * GRAIN_SCALE), Math.round(height * GRAIN_SCALE), color, (x, y) =>
          hash(x, y, 53 + index) < GRAIN_SHARE ? 1 : 0,
        ),
      ),
    [color, width, height],
  );
  const tile = tiles[Math.floor(Math.abs(frame)) % GRAIN_TILES] ?? null;
  if (amount <= 0 || tile === null) {
    return null;
  }
  return (
    <AbsoluteFill style={{ opacity: amount }}>
      <Img src={tile} style={{ width: '100%', height: '100%', display: 'block' }} />
    </AbsoluteFill>
  );
};

import { useId, useMemo } from 'react';
import { AbsoluteFill, Img } from 'remotion';
import { mixLab } from '../../kit/lab-color';

const STOPS = [0, 0.04, 0.14, 0.3, 0.5, 0.7, 0.86, 0.96, 1];

const smooth = (t: number) => t * t * (3 - 2 * t);

const hash = (x: number, y: number) => {
  let state = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ 0x5bd1e995;
  state = Math.imul(state ^ (state >>> 13), 1274126177);
  return ((state ^ (state >>> 16)) >>> 0) / 4294967296;
};

const paintDither = (width: number, height: number): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }
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
      const value = hash(x, y);
      const at = (y * width + x) * 4;
      const tone = value > 0.5 ? 255 : 0;
      image.data[at] = tone;
      image.data[at + 1] = tone;
      image.data[at + 2] = tone;
      image.data[at + 3] = Math.round(Math.abs(value - 0.5) * 2 * 255);
    }
  }
  context.putImageData(image, 0, 0);
  return canvas.toDataURL('image/png');
};

export const CollageBackdrop = ({
  width,
  height,
  background,
  glow,
  reach,
  drift,
  dither,
  frame,
}: {
  width: number;
  height: number;
  background: string;
  glow: string;
  reach: number;
  drift: number;
  dither: number;
  frame: number;
}) => {
  const id = `sticker-glow-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  const noise = useMemo(() => paintDither(width, height), [width, height]);
  const sway = Math.sin(frame / 70) * drift;
  const lift = Math.cos(frame / 95) * drift;
  const x1 = width * (1 + 0.04 * sway);
  const y1 = height * (-0.06 + 0.05 * lift);
  const x2 = width * (1 - reach * 0.95 + 0.05 * sway);
  const y2 = height * reach * 1.05;
  return (
    <AbsoluteFill style={{ backgroundColor: background }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
        <defs>
          <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
            {STOPS.map((offset) => (
              <stop
                key={offset}
                offset={offset}
                stopColor={mixLab(glow, background, smooth(offset))}
              />
            ))}
          </linearGradient>
        </defs>
        <rect width={width} height={height} fill={`url(#${id})`} />
      </svg>
      {dither > 0 && noise !== null ? (
        <Img
          src={noise}
          style={{ position: 'absolute', inset: 0, width, height, opacity: dither }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

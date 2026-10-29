import type { CSSProperties } from 'react';
import { useId } from 'react';
import { accelerate, pixelTween, settle, smooth, tween } from '../../promo/timing';

const ENTER_FRAMES = 30;

const EXIT_FRAMES = 18;

export const riseIn = (frame: number, start: number, distance: number) => {
  const range: [number, number] = [start, start + ENTER_FRAMES];
  return {
    opacity: tween(frame, range, [0, 1], settle),
    offset: pixelTween(frame, range, [distance, 0], settle),
  };
};

export const fadeAway = (frame: number, start: number, distance: number) => {
  const range: [number, number] = [start, start + EXIT_FRAMES];
  return {
    opacity: tween(frame, range, [1, 0], smooth),
    offset: pixelTween(frame, range, [0, -distance], accelerate),
  };
};

export const drawProgress = (progress: number): number => Math.min(1, progress / 0.97);

export const dashStyle = (progress: number) => {
  const drawn = drawProgress(progress);
  return drawn >= 1 ? {} : { strokeDasharray: `${drawn} 2` };
};

export const goldText = (light: string, dark: string): CSSProperties => ({
  backgroundImage: `linear-gradient(180deg, ${light} 18%, ${dark} 92%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  padding: '0.3em 0.4em',
  margin: '-0.3em -0.4em',
});

export const useSvgId = (prefix: string): string =>
  `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

export const withAlpha = (hex: string, alpha: number): string => {
  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha.toFixed(4)})`;
};

import type { Box } from './geometry';

export const INSET = 11;

export const innerBox = (box: Box): Box => ({
  x: box.x + INSET,
  y: box.y + INSET,
  width: box.width - INSET * 2,
  height: box.height - INSET * 2,
});

export const liquidSurface = (box: Box, level: number, wave: number) => {
  const inner = innerBox(box);
  return {
    surface: inner.y + inner.height - level * inner.height * 0.94,
    amplitude: wave * Math.min(1, level / 0.04) * (11 - 5 * level),
  };
};

export const waveY = (
  x: number,
  frame: number,
  surface: number,
  amplitude: number,
  phase: number,
) => {
  const time = frame / 30;
  return (
    surface +
    amplitude * Math.sin((x / 240) * Math.PI * 2 + time * 2.2 + phase) +
    amplitude * 0.45 * Math.sin((x / 130) * Math.PI * 2 - time * 1.6 + phase * 2)
  );
};

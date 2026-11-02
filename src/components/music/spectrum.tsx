'use client';

import { useEffect, useRef } from 'react';

const FLOOR_DB = -100;
const BARS = 48;

const logBins = (values: Float32Array): number[] =>
  Array.from({ length: BARS }, (_, bar) => {
    const from = Math.floor(values.length ** (bar / BARS));
    const to = Math.max(from + 1, Math.floor(values.length ** ((bar + 1) / BARS)));
    let peak = FLOOR_DB;
    for (let index = from; index < to; index += 1) {
      peak = Math.max(peak, values[index] ?? FLOOR_DB);
    }
    return peak;
  });

export const Spectrum = ({
  read,
  playing,
}: {
  read: () => Float32Array | null;
  playing: boolean;
}) => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext('2d');
    if (element === null || element === undefined || context === null || context === undefined) {
      return;
    }
    let frame = 0;
    const draw = () => {
      const { width, height } = element.getBoundingClientRect();
      const ratio = window.devicePixelRatio;
      element.width = width * ratio;
      element.height = height * ratio;
      context.scale(ratio, ratio);
      context.clearRect(0, 0, width, height);
      const raw = playing ? read() : null;
      const values = raw === null ? null : logBins(raw);
      const bins = BARS;
      const gap = 3;
      const barWidth = (width - gap * (bins - 1)) / bins;
      const gradient = context.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, '#8b5cf6');
      gradient.addColorStop(1, '#ec4899');
      context.fillStyle = gradient;
      for (let index = 0; index < bins; index += 1) {
        const db = values?.[index] ?? FLOOR_DB;
        const level = Math.max(0.04, Math.min(1, (db - FLOOR_DB) / -FLOOR_DB));
        const barHeight = level * height;
        context.globalAlpha = playing ? 0.9 : 0.25;
        context.beginPath();
        context.roundRect(index * (barWidth + gap), height - barHeight, barWidth, barHeight, 2);
        context.fill();
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [read, playing]);

  return <canvas ref={canvas} aria-hidden className="h-14 w-full" />;
};

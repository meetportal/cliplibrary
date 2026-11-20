import { useLayoutEffect, useRef } from 'react';
import { AbsoluteFill } from 'remotion';
import { useCanvasPixelRatio } from '../../kit/pixel-ratio';

const SEED = 0x51a3c7;
const ALPHA = 3;

const paint = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('2d');
  if (context === null) {
    return;
  }
  const image = context.createImageData(canvas.width, canvas.height);
  const pixels = image.data;
  let state = SEED;
  for (let at = 0; at < pixels.length; at += 4) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const light = state >>> 31 === 1 ? 255 : 0;
    pixels[at] = light;
    pixels[at + 1] = light;
    pixels[at + 2] = light;
    pixels[at + 3] = ALPHA;
  }
  context.putImageData(image, 0, 0);
};

export const Dither = ({ width, height }: { width: number; height: number }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const ratio = useCanvasPixelRatio(1);
  const wide = Math.max(1, Math.round(width * ratio));
  const high = Math.max(1, Math.round(height * ratio));
  useLayoutEffect(() => {
    const canvas = ref.current;
    if (canvas !== null && wide > 0 && high > 0) {
      paint(canvas);
    }
  }, [wide, high]);
  return (
    <AbsoluteFill>
      <canvas ref={ref} width={wide} height={high} style={{ width, height, display: 'block' }} />
    </AbsoluteFill>
  );
};

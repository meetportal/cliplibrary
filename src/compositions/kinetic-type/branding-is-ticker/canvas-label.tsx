import { useEffect, useLayoutEffect, useRef } from 'react';
import { useCanvasPixelRatio } from '../../kit/pixel-ratio';
import type { Face } from './fonts';

const PAD = 0.3;
const RESOLUTION = 2;

export const CanvasLabel = ({
  text,
  face,
  size,
  color,
  width,
  tracking = 0,
  inset = 0,
}: {
  text: string;
  face: Face;
  size: number;
  color: string;
  width: number;
  tracking?: number;
  inset?: number;
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const ratio = useCanvasPixelRatio(RESOLUTION);
  const pad = Math.ceil(size * PAD);
  const box = { width: Math.ceil(width) + 2 * pad, height: Math.ceil(size) + 2 * pad };
  useEffect(() => {
    const canvas = ref.current;
    return () => {
      if (canvas !== null) {
        canvas.width = 0;
        canvas.height = 0;
      }
    };
  }, []);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!(canvas && context)) {
      return;
    }
    const wide = Math.max(1, Math.round(box.width * ratio));
    const high = Math.max(1, Math.round(box.height * ratio));
    if (canvas.width !== wide || canvas.height !== high) {
      canvas.width = wide;
      canvas.height = high;
    }
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, wide, high);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.font = `${face.style} ${face.weight} ${size}px "${face.family}"`;
    context.letterSpacing = `${tracking * size}px`;
    context.textBaseline = 'alphabetic';
    context.textAlign = 'left';
    context.fillStyle = color;
    const metrics = context.measureText(text);
    const ascent = metrics.fontBoundingBoxAscent;
    const baseline = (size - ascent - metrics.fontBoundingBoxDescent) / 2 + ascent;
    context.fillText(text, pad + inset, pad + baseline);
  });
  return (
    <div style={{ position: 'relative', flex: 'none', width, height: size }}>
      <canvas
        ref={ref}
        aria-label={text}
        style={{
          position: 'absolute',
          left: -pad,
          top: -pad,
          width: box.width,
          height: box.height,
        }}
      />
    </div>
  );
};

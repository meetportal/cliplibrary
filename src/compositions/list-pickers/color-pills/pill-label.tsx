import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDelayRender } from 'remotion';

const BLEED = 0.4;
const DETAIL = 2;
const MAX_RESOLUTION = 4;

const resolution = () => {
  const ratio = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  return Math.min(MAX_RESOLUTION, ratio * DETAIL);
};

export const PillLabel = ({
  text,
  color,
  family,
  weight,
  size,
  ready,
}: {
  text: string;
  color: string;
  family: string;
  weight: number;
  size: number;
  ready: () => Promise<unknown>;
}) => {
  const box = useRef<HTMLSpanElement>(null);
  const ref = useRef<HTMLCanvasElement>(null);
  const bleed = size * BLEED;
  const spec = `${weight} ${size}px "${family}"`;
  const [drawn, setDrawn] = useState<string | null>(null);
  const [handle, setHandle] = useState<number | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  useEffect(() => {
    let active = true;
    const pending = delayRender(`Loading the ${family} pill label font`);
    setHandle(pending);
    const finish = () => {
      if (active) {
        setDrawn(spec);
      } else {
        continueRender(pending);
      }
    };
    ready()
      .then(() => document.fonts.load(spec))
      .then(finish, finish);
    return () => {
      active = false;
    };
  }, [spec, family, ready, delayRender, continueRender]);
  useEffect(() => {
    if (drawn === spec && handle !== null) {
      continueRender(handle);
      setHandle(null);
    }
  }, [drawn, spec, handle, continueRender]);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    const holder = box.current;
    if (!(canvas && context && holder)) {
      return;
    }
    const width = holder.offsetWidth + bleed * 2;
    const height = holder.offsetHeight + bleed * 2;
    const scale = resolution();
    const pixelsWide = Math.ceil(width * scale);
    const pixelsHigh = Math.ceil(height * scale);
    if (canvas.width !== pixelsWide || canvas.height !== pixelsHigh) {
      canvas.width = pixelsWide;
      canvas.height = pixelsHigh;
    }
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.clearRect(0, 0, width, height);
    context.font = spec;
    context.textBaseline = 'alphabetic';
    context.fillStyle = color;
    const metrics = context.measureText(text);
    const ascent = metrics.fontBoundingBoxAscent;
    const descent = metrics.fontBoundingBoxDescent;
    context.fillText(text, bleed, bleed + (size - ascent - descent) / 2 + ascent);
  });
  return (
    <span ref={box} style={{ position: 'relative', display: 'block', color: 'transparent' }}>
      {text}
      <canvas
        ref={ref}
        aria-hidden
        style={{ position: 'absolute', left: -bleed, top: -bleed, display: 'block' }}
      />
    </span>
  );
};

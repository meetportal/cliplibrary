import {
  type CSSProperties,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import { useCanvasPixelRatio } from '../../kit/pixel-ratio';
import type { Face } from './fonts';

const LINE_HEIGHT = 1.24;
const PAD = 0.2;
const RESOLUTION = 2;
const SNAP = 4;

export type LetterStyle = {
  x?: number;
  y?: number;
  rotate?: number;
  opacity?: number;
  color?: string;
};

export type ShredRow = { from: number; to: number; offset: number };

export const ShredRows = createContext<readonly ShredRow[] | null>(null);

type Placed = { letter: string; left: number; advance: number; look: LetterStyle };

let measurer: CanvasRenderingContext2D | null = null;

const measuring = () => {
  measurer ??= document.createElement('canvas').getContext('2d');
  return measurer;
};

const fontOf = (face: Face, size: number) => `${face.weight} ${size}px "${face.family}"`;

const place = (
  text: string,
  face: Face,
  size: number,
  spacing: number,
  styleOf: ((index: number, count: number) => LetterStyle) | undefined,
) => {
  const context = measuring();
  if (context !== null) {
    context.font = fontOf(face, size);
  }
  const widthOf = (value: string) =>
    context === null ? [...value].length * size * 0.58 : context.measureText(value).width;
  const letters = [...text];
  let prefix = '';
  let before = 0;
  const placed: Placed[] = letters.map((letter, index) => {
    prefix += letter;
    const after = widthOf(prefix);
    const item = {
      letter,
      left: before + index * spacing,
      advance: after - before,
      look: styleOf?.(index, letters.length) ?? {},
    };
    before = after;
    return item;
  });
  return { placed, total: before + Math.max(0, letters.length - 1) * spacing };
};

type Drawing = {
  placed: Placed[];
  face: Face;
  size: number;
  color: string;
  box: number;
  originX: number;
  originY: number;
  width: number;
  height: number;
  ratio: number;
  rows: readonly ShredRow[] | null;
  rowsTop: number;
};

const paint = (context: CanvasRenderingContext2D, drawing: Drawing, baseline: number) => {
  const { placed, originX, originY, box, color } = drawing;
  for (const item of placed) {
    const alpha = item.look.opacity ?? 1;
    if (alpha <= 0.002 || item.letter.trim() === '') {
      continue;
    }
    context.globalAlpha = Math.min(1, alpha);
    context.fillStyle = item.look.color ?? color;
    context.save();
    context.translate(
      originX + item.left + (item.look.x ?? 0) + item.advance / 2,
      originY + (item.look.y ?? 0) + box / 2,
    );
    if ((item.look.rotate ?? 0) !== 0) {
      context.rotate(((item.look.rotate ?? 0) * Math.PI) / 180);
    }
    context.fillText(item.letter, -item.advance / 2, baseline - box / 2);
    context.restore();
  }
};

const draw = (canvas: HTMLCanvasElement, drawing: Drawing) => {
  const context = canvas.getContext('2d');
  if (context === null) {
    return;
  }
  const { width, height, ratio } = drawing;
  const wide = Math.max(1, Math.round(width * ratio));
  const high = Math.max(1, Math.round(height * ratio));
  if (canvas.width !== wide || canvas.height !== high) {
    canvas.width = wide;
    canvas.height = high;
  }
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, wide, high);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.font = fontOf(drawing.face, drawing.size);
  context.textBaseline = 'alphabetic';
  context.textAlign = 'left';
  const metrics = context.measureText('Hg');
  const ascent = metrics.fontBoundingBoxAscent;
  const baseline = (drawing.box - ascent - metrics.fontBoundingBoxDescent) / 2 + ascent;
  if (drawing.rows === null) {
    paint(context, drawing, baseline);
    return;
  }
  for (const row of drawing.rows) {
    context.save();
    context.beginPath();
    context.rect(0, row.from - drawing.rowsTop, width, row.to - row.from);
    context.clip();
    context.translate(row.offset, 0);
    paint(context, drawing, baseline);
    context.restore();
  }
};

export const Line = ({
  face,
  size,
  center,
  x = 0,
  color,
  style,
  text,
  styleOf,
  tracking = 0,
}: {
  face: Face;
  size: number;
  center: number;
  x?: number;
  color: string;
  style?: CSSProperties;
  text: string;
  styleOf?: (index: number, count: number) => LetterStyle;
  tracking?: number;
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const rows = useContext(ShredRows);
  const ratio = useCanvasPixelRatio(RESOLUTION);
  const box = size * LINE_HEIGHT;
  const { placed, total } = place(text, face, size, tracking * size, styleOf);
  const shift = rows === null ? 0 : Math.max(0, ...rows.map((row) => Math.abs(row.offset)));
  const pad = size * PAD + shift;
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = box;
  placed.forEach((item, index) => {
    const left = -total / 2 + item.left + (item.look.x ?? 0);
    minX = index === 0 ? left : Math.min(minX, left);
    maxX = index === 0 ? left + item.advance : Math.max(maxX, left + item.advance);
    minY = Math.min(minY, item.look.y ?? 0);
    maxY = Math.max(maxY, box + (item.look.y ?? 0));
  });
  const left = Math.floor((minX - pad) / SNAP) * SNAP;
  const top = Math.floor((minY - pad) / SNAP) * SNAP;
  const width = Math.ceil((maxX + pad) / SNAP) * SNAP - left;
  const height = Math.ceil((maxY + pad) / SNAP) * SNAP - top;
  const top0 = center - box / 2;
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
    if (ref.current !== null) {
      draw(ref.current, {
        placed,
        face,
        size,
        color,
        box,
        originX: -total / 2 - left,
        originY: -top,
        width,
        height,
        ratio,
        rows,
        rowsTop: top0 + top,
      });
    }
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: box,
        ...style,
        transform: `translate(${x.toFixed(3)}px, ${top0.toFixed(3)}px) ${style?.transform ?? ''}`,
      }}
    >
      <canvas
        ref={ref}
        aria-label={text}
        style={{
          position: 'absolute',
          left: `calc(50% + ${left}px)`,
          top,
          width,
          height,
        }}
      />
    </div>
  );
};

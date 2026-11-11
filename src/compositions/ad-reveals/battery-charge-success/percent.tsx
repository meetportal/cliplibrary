import { LABEL_FACE } from './fonts';
import type { Box } from './geometry';
import { liquidSurface, waveY } from './liquid';

const LINE = 1.2;
const STEP = 6;
const DIGIT_WIDTH = '0.62em';

export const Percent = ({
  box,
  level,
  size,
  frame,
  wave,
  light,
  dark,
}: {
  box: Box;
  level: number;
  size: number;
  frame: number;
  wave: number;
  light: string;
  dark: string;
}) => {
  const top = Math.round(box.y + box.height * 0.42 - size * 0.6);
  const height = Math.round(size * LINE);
  const { surface, amplitude } = liquidSurface(box, level, wave);
  const steps = Math.ceil(box.width / STEP);
  const edge = Array.from({ length: steps + 1 }, (_, index) => {
    const x = Math.min(box.width, index * STEP);
    const y = level <= 0.0005 ? height + 1 : waveY(box.x + x, frame, surface, amplitude, 0) - top;
    return { x, y: Math.max(-1, Math.min(height + 1, y)) };
  });
  const above = edge.every((point) => point.y <= -1);
  const below = edge.every((point) => point.y >= height + 1);
  const curve = edge.map((point) => `${point.x.toFixed(1)}px ${point.y.toFixed(1)}px`);
  const lightClip = `polygon(0px -1px, ${box.width}px -1px, ${[...curve].reverse().join(', ')})`;
  const darkClip = `polygon(${curve.join(', ')}, ${box.width}px ${height + 1}px, 0px ${height + 1}px)`;
  const text = [...`${Math.round(level * 100)}`].map((digit, index, all) => (
    <span
      key={all.length - index}
      style={{ display: 'inline-block', width: DIGIT_WIDTH, textAlign: 'center' }}
    >
      {digit}
    </span>
  ));
  text.push(<span key="sign">%</span>);
  const style = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: box.width,
    height,
    display: 'flex',
    justifyContent: 'center',
    fontFamily: LABEL_FACE.family,
    fontWeight: LABEL_FACE.weight,
    fontSize: size,
    lineHeight: `${height}px`,
    whiteSpace: 'nowrap',
  } as const;
  return (
    <div style={{ position: 'absolute', left: box.x, top, width: box.width, height }}>
      {above ? null : (
        <div style={{ ...style, color: light, clipPath: below ? undefined : lightClip }}>
          {text}
        </div>
      )}
      {below ? null : (
        <div style={{ ...style, color: dark, clipPath: above ? undefined : darkClip }}>{text}</div>
      )}
    </div>
  );
};

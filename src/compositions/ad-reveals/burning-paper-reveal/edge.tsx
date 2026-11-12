import { useId } from 'react';
import { type BurnState, CARD, type Point, wave } from './burn';
import { mixLab } from './color';
import type { BurnLook } from './look';
import { FILTER_REGION } from './overlay';

const line = (points: readonly Point[]) =>
  points.map((point, at) => `${at === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y}`).join(' ');

const charBand = (points: readonly Point[], depth: number) => {
  const inner = points
    .map((point) => ({
      x: point.x - depth * (10 + 8 * (0.5 + 0.5 * Math.sin(point.y * 0.13 + 1.7))),
      y: point.y,
    }))
    .reverse();
  return `${line(points)} ${inner.map((point) => `L ${point.x.toFixed(2)} ${point.y}`).join(' ')} Z`;
};

export const BurningEdge = ({
  look,
  state,
  points,
  clip,
}: {
  look: BurnLook;
  state: BurnState;
  points: readonly Point[];
  clip: string;
}) => {
  const id = useId().replace(/:/g, '');
  const t = look.frame / look.fps;
  const ember = mixLab(look.flame, '#ffd48a', 0.5);
  const flicker = 0.82 + 0.18 * wave(t * 6.3, 3.1);
  const scorch = points.map((point) => ({ x: point.x - 16, y: point.y }));
  return (
    <g>
      <defs>
        <clipPath id={`${id}-paper`}>
          <path d={clip} />
        </clipPath>
        <clipPath id={`${id}-card`}>
          <rect x={-4} y={-2} width={CARD.width + 8} height={CARD.height + 4} />
        </clipPath>
        <filter id={`${id}-blur`} filterUnits="userSpaceOnUse" {...FILTER_REGION}>
          <feGaussianBlur stdDeviation={7} />
        </filter>
        <filter id={`${id}-glow`} filterUnits="userSpaceOnUse" {...FILTER_REGION}>
          <feGaussianBlur stdDeviation={4} />
        </filter>
      </defs>
      <g clipPath={`url(#${id}-paper)`} opacity={state.char}>
        <path
          d={line(scorch)}
          stroke="#6b3a18"
          strokeWidth={34}
          fill="none"
          opacity={0.5}
          filter={`url(#${id}-blur)`}
        />
        <path d={charBand(points, 1)} fill="#1d120c" />
      </g>
      <g clipPath={`url(#${id}-card)`} opacity={state.char * flicker}>
        <path
          d={line(points)}
          stroke={look.flame}
          strokeWidth={10}
          fill="none"
          filter={`url(#${id}-glow)`}
        />
        <path d={line(points)} stroke={ember} strokeWidth={3.2} fill="none" />
      </g>
    </g>
  );
};

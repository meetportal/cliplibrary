import { useId } from 'react';
import { type BurnState, CARD, edgeX, hash, tongueLife, wave } from './burn';
import { mixLab } from './color';
import type { BurnLook } from './look';
import { FILTER_REGION } from './overlay';

const TONGUES = 10;
const EDGE_INSET = 8;
const SAMPLES = 14;

type Tongue = {
  key: number;
  x: number;
  y: number;
  width: number;
  height: number;
  lean: number;
  phase: number;
};

const TOP_ALONG = 0.03;
const TOP_RISE = (1 - TOP_ALONG) ** 0.9;
const VISIBLE_TIP = 0.68;

const SPAN = 0.86;
const CLAMP_RANGE = 40;

type Shape = Tongue & { opacity: number };

const bottomness = (index: number) => index / (TONGUES - 1);

const clampAmount = (y: number, front: number, look: BurnLook) =>
  Math.max(0, Math.min(1, (edgeX(y, front, look.burn) - (CARD.width - EDGE_INSET)) / CLAMP_RANGE));

export const flameTip = (look: BurnLook, front: number, dying: number) => {
  const y = CARD.height * TOP_ALONG;
  const x = Math.min(CARD.width - EDGE_INSET, edgeX(y, front, look.burn)) + 12;
  const life = tongueLife(dying, 0);
  const height = look.height * (170 + 360 * TOP_RISE) * life;
  return { x: x + 0.08 * height, y: y - VISIBLE_TIP * height };
};

const BODY_HALF = 24;
const BODY_STEP = 10;
const BODY_TAPER = 70;
const LIT = 0.3;

export const burningUntil = (dying: number) => {
  const reach = 1 - Math.max(0, dying - 0.24) / 0.62;
  return CARD.height * (TOP_ALONG + SPAN * Math.max(0, Math.min(1, reach))) + 30;
};

const bodyPath = (look: BurnLook, state: BurnState, scale: number) => {
  const end = burningUntil(state.dying);
  const fade = Math.min(1, tongueLife(state.dying, 0) / LIT);
  if (end <= 40 || fade <= 0.01) {
    return '';
  }
  const left: string[] = [];
  const right: string[] = [];
  for (let y = 0; y <= end; y += BODY_STEP) {
    const x = Math.min(CARD.width - EDGE_INSET, edgeX(y, state.front, look.burn)) + 12;
    const taper = Math.min(1, (end - y) / BODY_TAPER, (y + 20) / 40);
    const half = BODY_HALF * scale * fade * Math.max(0, taper);
    left.push(`${(x - half).toFixed(1)} ${y}`);
    right.unshift(`${(x + half).toFixed(1)} ${y}`);
  }
  return `M ${left.join(' L ')} L ${right.join(' L ')} Z`;
};

const tongues = (look: BurnLook, state: BurnState): Shape[] => {
  const t = look.frame / look.fps;
  return Array.from({ length: TONGUES }, (_, index) => {
    const along = TOP_ALONG + (SPAN * index) / (TONGUES - 1);
    const y = CARD.height * along;
    const clamped = clampAmount(y, state.front, look);
    const jitter = clamped * (26 * (hash(index * 4.3) - 0.5) + 8 * wave(t * 1.7, index * 3.1));
    const x = Math.min(CARD.width - EDGE_INSET, edgeX(y, state.front, look.burn)) + 12 + jitter;
    const rise = (1 - along) ** 0.9;
    const life = tongueLife(state.dying, bottomness(index));
    const flicker = 0.8 + 0.22 * wave(t * 4.9, index * 1.9) + 0.09 * wave(t * 8.6, index * 0.7);
    const height = look.height * life * (170 + 360 * rise) * flicker;
    const width = (78 + 64 * rise) * (0.45 + 0.55 * life);
    const lean =
      22 * wave(t * 2.9, index * 2.7 + 1) +
      0.1 * height +
      clamped * 16 * (hash(index * 2.9 + 1) - 0.5);
    return {
      key: index,
      x,
      y,
      width,
      height,
      lean,
      phase: t * 7.5 + index * 1.37,
      opacity: Math.min(1, life / LIT),
    };
  });
};

const outline = (tongue: Tongue, scale: number) => {
  const width = tongue.width * scale;
  const height = tongue.height * (0.3 + 0.7 * scale);
  const left: string[] = [];
  const right: string[] = [];
  for (let step = 0; step <= SAMPLES; step++) {
    const s = step / SAMPLES;
    const centre =
      tongue.x +
      tongue.lean * s ** 1.5 +
      20 * scale * s * Math.sin(s * Math.PI * 2.6 - tongue.phase);
    const half =
      (width / 2) *
      (1 - s) ** 0.85 *
      (0.45 + 0.55 * Math.sin((Math.PI / 2) * Math.min(1, s / 0.3)));
    const y = tongue.y + width * 0.15 - height * s;
    left.push(`${(centre - half).toFixed(1)} ${y.toFixed(1)}`);
    right.unshift(`${(centre + half).toFixed(1)} ${y.toFixed(1)}`);
  }
  const bottom = `Q ${tongue.x} ${(tongue.y + width * 0.12).toFixed(1)}`;
  return `M ${left.join(' L ')} L ${right.join(' L ')} ${bottom} ${left[0]} Z`;
};

const Tongues = ({
  shapes,
  scale,
  stops,
  id,
}: {
  shapes: readonly Shape[];
  scale: number;
  stops: readonly (readonly [number, string, number])[];
  id: string;
}) => (
  <>
    {shapes.map((tongue) => {
      const gradient = `${id}-${tongue.key}`;
      const height = tongue.height * (0.3 + 0.7 * scale);
      return (
        <g key={tongue.key}>
          <defs>
            <linearGradient
              id={gradient}
              gradientUnits="userSpaceOnUse"
              x1={0}
              y1={tongue.y + tongue.width * 0.2}
              x2={0}
              y2={tongue.y - height}
            >
              {stops.map(([offset, color, opacity]) => (
                <stop key={offset} offset={offset} stopColor={color} stopOpacity={opacity} />
              ))}
            </linearGradient>
          </defs>
          <path
            d={outline(tongue, scale)}
            fill={`url(#${gradient})`}
            fillOpacity={tongue.opacity}
          />
        </g>
      );
    })}
  </>
);

export const Flames = ({ look, state }: { look: BurnLook; state: BurnState }) => {
  const id = useId().replace(/:/g, '');
  if (look.height <= 0) {
    return null;
  }
  const shapes = tongues(look, state).filter((tongue) => tongue.opacity > 0.01);
  const deep = mixLab(look.flame, '#a8200a', 0.5);
  const hot = mixLab(look.flame, '#ffd36b', 0.55);
  const core = mixLab(look.flame, '#fffbea', 0.86);
  return (
    <g>
      <defs>
        <filter id={`${id}-soft`} filterUnits="userSpaceOnUse" {...FILTER_REGION}>
          <feGaussianBlur stdDeviation={6.5} />
        </filter>
        <filter id={`${id}-core`} filterUnits="userSpaceOnUse" {...FILTER_REGION}>
          <feGaussianBlur stdDeviation={3} />
        </filter>
        <filter id={`${id}-halo`} filterUnits="userSpaceOnUse" {...FILTER_REGION}>
          <feGaussianBlur stdDeviation={30} />
        </filter>
      </defs>
      <g filter={`url(#${id}-halo)`} opacity={0.5 * Math.min(1, look.glow)}>
        <Tongues
          shapes={shapes}
          scale={1.2}
          id={`${id}-h`}
          stops={[
            [0, look.flame, 1],
            [1, deep, 0],
          ]}
        />
      </g>
      <g filter={`url(#${id}-soft)`}>
        <path d={bodyPath(look, state, 1)} fill={look.flame} fillOpacity={0.85} />
        <Tongues
          shapes={shapes}
          scale={1}
          id={`${id}-b`}
          stops={[
            [0, hot, 0.95],
            [0.35, look.flame, 0.9],
            [0.75, deep, 0.55],
            [1, deep, 0],
          ]}
        />
      </g>
      <g filter={`url(#${id}-core)`}>
        <path d={bodyPath(look, state, 0.45)} fill={hot} fillOpacity={0.8} />
        <Tongues
          shapes={shapes}
          scale={0.55}
          id={`${id}-c`}
          stops={[
            [0, core, 1],
            [0.5, hot, 0.85],
            [1, hot, 0],
          ]}
        />
      </g>
    </g>
  );
};

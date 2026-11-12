import { type Box, WIPE } from './layout';
import type { Window } from './timeline';

const UNIT = Math.hypot(WIPE.x, WIPE.y);
const TIP_MOTES = 9;
const TIP_LIFE = 22;
const AIR_MOTES = 10;

const seeded = (index: number, salt: number) => {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

export type Stroke = { box: Box; window: Window; edgeAt: (frame: number) => number };

const xOnEdge = (edge: number, y: number) => (edge * UNIT - y * WIPE.y) / WIPE.x;

export const TipDust = (props: {
  strokes: Stroke[];
  frame: number;
  level: number;
  color: string;
}) => {
  if (props.level <= 0) {
    return null;
  }
  return (
    <g fill={props.color}>
      {props.strokes.flatMap((stroke, which) =>
        Array.from({ length: TIP_MOTES }, (_, index) => {
          const length = stroke.window.to - stroke.window.from;
          const born = stroke.window.from + ((index + 0.5) * length) / TIP_MOTES;
          const age = props.frame - born;
          if (age < 0 || age >= TIP_LIFE) {
            return null;
          }
          const salt = which * 31 + index;
          const { box } = stroke;
          const y0 = box.y0 + (0.25 + 0.6 * seeded(salt, 1)) * (box.y1 - box.y0);
          const x0 = Math.min(box.x1, Math.max(box.x0, xOnEdge(stroke.edgeAt(born), y0)));
          const t = age / TIP_LIFE;
          const x = x0 + (10 + 26 * seeded(salt, 2)) * t;
          const y = y0 + 70 * t * t + 14 * t;
          const fade = Math.sin(Math.PI * Math.min(1, t * 1.15));
          return (
            <circle
              key={`${which}-${index}`}
              cx={x.toFixed(2)}
              cy={y.toFixed(2)}
              r={(1.6 + 1.8 * seeded(salt, 3)).toFixed(2)}
              opacity={(0.55 * props.level * fade).toFixed(3)}
            />
          );
        }),
      )}
    </g>
  );
};

export const AirDust = (props: {
  area: Box;
  frame: number;
  level: number;
  color: string;
  duration: number;
}) => {
  if (props.level <= 0) {
    return null;
  }
  const { area, frame } = props;
  const count = Math.round(AIR_MOTES * Math.min(1, props.level));
  const strength = Math.min(2, props.level);
  const span = area.x1 - area.x0;
  const rise = area.y1 - area.y0;
  return (
    <g fill={props.color}>
      {Array.from({ length: count }, (_, index) => {
        const period = props.duration / (1 + Math.floor(2 * seeded(index, 1)));
        const cycle = ((frame + seeded(index, 2) * period) % period) / period;
        const x = area.x0 + span * seeded(index, 3) + 16 * Math.sin(2 * Math.PI * cycle);
        const y = area.y1 - (0.2 + 0.8 * seeded(index, 5)) * rise * cycle;
        const fade = Math.sin(Math.PI * cycle);
        return (
          <circle
            key={index}
            cx={x.toFixed(2)}
            cy={y.toFixed(2)}
            r={(1.3 + 1.7 * seeded(index, 6)).toFixed(2)}
            opacity={(0.22 * strength * fade).toFixed(3)}
          />
        );
      })}
    </g>
  );
};

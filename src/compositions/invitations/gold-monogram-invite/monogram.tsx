import { useId } from 'react';
import { type GoldTones, mix } from './color';
import type { Face } from './fonts';
import { sheenStops } from './mandala';
import { circle, heartPath } from './patterns';
import { dashOf, ramp, settle, smooth } from './timeline';

const RING_DRAW = 36;

const RING_LEAD = 14;

const GLINT = 34;

const GLOW_UP = 90;

const GLOW_STOPS = [0, 0.14, 0.3, 0.5, 0.7, 0.86, 1];

export type MonogramLook = {
  letters: string;
  fontSize: number;
  baseline: number;
  ringRadius: number;
  heart: boolean;
  fillAt: number;
  glintAt: number;
};

export const Monogram = ({
  look,
  face,
  center,
  frame,
  gold,
  background,
}: {
  look: MonogramLook;
  face: Face;
  center: [number, number];
  frame: number;
  gold: GoldTones;
  background: string | null;
}) => {
  const base = useId().replace(/[^a-zA-Z0-9]/g, '');
  const ids = {
    sheen: `mono${base}s`,
    fill: `mono${base}f`,
    glint: `mono${base}g`,
    glow: `mono${base}w`,
  };
  const r = look.ringRadius;
  const half = Math.ceil(r * 1.9);
  const outline = 0.85 + 0.15 * ramp(frame, 0, 10, smooth);
  const fill = 0.3 + 0.7 * ramp(frame, 0, look.fillAt, smooth);
  const ringDraw = ramp(frame, -RING_LEAD, RING_DRAW, settle);
  const heart = look.heart ? ramp(frame, 26, 50, smooth) : 0;
  const glintCenter = -0.3 + 1.6 * ramp(frame, look.glintAt, look.glintAt + GLINT, smooth);
  const glinting = frame > look.glintAt && frame < look.glintAt + GLINT;
  const glow = 0.25 + 0.75 * ramp(frame, 0, GLOW_UP, (t) => t);
  const letters = (paint: string, stroke?: string) => (
    <text
      x={0}
      y={look.baseline}
      textAnchor="middle"
      fill={paint}
      stroke={stroke}
      strokeWidth={stroke === undefined ? undefined : Math.max(1.2, look.fontSize * 0.012)}
      style={{
        fontFamily: face.family,
        fontWeight: face.weight,
        fontSize: look.fontSize,
        textRendering: 'geometricPrecision',
      }}
    >
      {look.letters}
    </text>
  );
  const ringPath = (radius: number, width: number, share: number) => (
    <path
      d={circle(radius)}
      fill="none"
      stroke={`url(#${ids.sheen})`}
      strokeWidth={width}
      strokeLinecap="butt"
      {...dashOf(share)}
    />
  );
  return (
    <svg
      aria-hidden="true"
      width={half * 2}
      height={half * 2}
      viewBox={`${-half} ${-half} ${half * 2} ${half * 2}`}
      style={{
        position: 'absolute',
        left: Math.round(center[0]) - half,
        top: Math.round(center[1]) - half,
      }}
    >
      <defs>
        <radialGradient id={ids.glow} cx="0" cy="0" r={r * 1.7} gradientUnits="userSpaceOnUse">
          {GLOW_STOPS.map((offset) => (
            <stop
              key={offset}
              offset={offset}
              stopColor={gold.mid}
              stopOpacity={(0.2 * (1 - offset) ** 2.2).toFixed(4)}
            />
          ))}
        </radialGradient>
        <linearGradient id={ids.sheen} gradientUnits="userSpaceOnUse" x1={-r} y1={-r} x2={r} y2={r}>
          {sheenStops(gold).map(([offset, color]) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
        <linearGradient id={ids.fill} x1="0" y1="0" x2="0.15" y2="1">
          <stop offset="0" stopColor={gold.highlight} />
          <stop offset="0.3" stopColor={gold.light} />
          <stop offset="0.55" stopColor={gold.mid} />
          <stop offset="0.78" stopColor={gold.deep} />
          <stop offset="1" stopColor={gold.light} />
        </linearGradient>
        <linearGradient id={ids.glint} x1="0" y1="0" x2="1" y2="0.35">
          {[
            [-0.2, 0],
            [-0.07, 0.5],
            [0, 1],
            [0.07, 0.5],
            [0.2, 0],
          ].map(([offset = 0, opacity = 0]) => (
            <stop
              key={offset}
              offset={Math.max(0, Math.min(1, glintCenter + offset))}
              stopColor={mix(gold.highlight, '#ffffff', 0.4)}
              stopOpacity={opacity}
            />
          ))}
        </linearGradient>
      </defs>
      <circle r={r * 1.7} fill={`url(#${ids.glow})`} opacity={glow} />
      {ringDraw > 0.002 ? ringPath(r, 2.4, ringDraw) : null}
      {ringDraw > 0.002 ? ringPath(r - 9, 1.2, ringDraw) : null}
      <g opacity={outline}>{letters('none', `url(#${ids.sheen})`)}</g>
      <g opacity={fill}>{letters(`url(#${ids.fill})`)}</g>
      {glinting ? letters(`url(#${ids.glint})`) : null}
      {heart > 0 ? (
        <g opacity={heart}>
          {background === null ? null : (
            <path
              d={heartPath([0, -r - 2], r * 0.12)}
              fill={background}
              stroke={background}
              strokeWidth={10}
            />
          )}
          <path d={heartPath([0, -r - 2], r * 0.1)} fill={`url(#${ids.fill})`} />
        </g>
      ) : null}
    </svg>
  );
};

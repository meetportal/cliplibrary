import type { ReactNode } from 'react';
import type { BotanicalSaveTheDateProps } from '@/schemas';
import { ArchCard, HexagonFrame } from './card-frames';
import { linear, settle, smooth, TAU, tween } from './motion';
import { fixed, type Point } from './paint';
import { CornerSpray, type FloralInks } from './spray';
import { PeachWash } from './wash';

type Florals = BotanicalSaveTheDateProps['florals'];

const SPRAYS: { at: Point; from: Point; seed: number; phase: number }[] = [
  { at: [290, 410], from: [-1, -1], seed: 3, phase: 0 },
  { at: [500, 1760], from: [1, 1], seed: 9, phase: 2.1 },
];

const SHOW_SHARE = 0.4;
const TILT = 7;
const HEXAGON_START = 6;
const HEXAGON_FRAMES = 50;
const WASH_DRIFT = 40;

const Placed = ({
  frame,
  start,
  florals,
  at,
  from,
  phase,
  children,
}: {
  frame: number;
  start: number;
  florals: Florals;
  at: Point;
  from: Point;
  phase: number;
  children: ReactNode;
}) => {
  const arrive = tween(frame, [start, start + florals.enterFrames], [0, 1], settle);
  const shown = tween(frame, [start, start + florals.enterFrames * SHOW_SHARE], [0, 1], smooth);
  const away = 1 - arrive;
  const length = Math.hypot(from[0], from[1]) || 1;
  const x = at[0] + (from[0] / length) * florals.slide * away;
  const y = at[1] + (from[1] / length) * florals.slide * away;
  const sway =
    florals.sway * Math.sin(((frame - start) / Math.max(1, florals.swayPeriod)) * TAU + phase);
  const turn = sway + away * TILT * Math.sign(from[0] || 1);
  const size = florals.size * (0.95 + 0.05 * arrive);
  return (
    <g
      transform={`translate(${fixed(x)} ${fixed(y)}) rotate(${fixed(turn)}) scale(${size.toFixed(4)})`}
      opacity={shown}
    >
      {children}
    </g>
  );
};

export const Scenery = ({
  props,
  frame,
  width,
  height,
  duration,
}: {
  props: BotanicalSaveTheDateProps;
  frame: number;
  width: number;
  height: number;
  duration: number;
}) => {
  const { colors, backdrop, florals } = props;
  const inks = (id: string): FloralInks => ({
    greens: { id, base: colors.leaf },
    ghost: colors.ghost,
    gold: colors.gold,
    petal: colors.petal,
    heart: colors.heart,
    goldLines: florals.goldLines,
  });
  const drift = tween(frame, [0, duration], [0, WASH_DRIFT], linear);
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', left: 0, top: 0 }}
      aria-hidden="true"
    >
      {backdrop.wash ? (
        <g
          opacity={backdrop.washOpacity}
          transform={`translate(${fixed(-drift)} ${fixed(drift * 0.6)})`}
        >
          <PeachWash id="wash" color={colors.surface} gold={colors.gold} />
        </g>
      ) : null}
      {backdrop.frame === 'arch' ? (
        <ArchCard fill={colors.surface} border={colors.line} width={backdrop.lineWidth} />
      ) : null}
      {backdrop.frame === 'hexagon' ? (
        <HexagonFrame
          frame={frame}
          start={HEXAGON_START}
          frames={HEXAGON_FRAMES}
          fill={colors.surface}
          line={colors.line}
          width={backdrop.lineWidth}
        />
      ) : null}
      {SPRAYS.map((spray, index) => (
        <Placed
          key={spray.seed}
          frame={frame}
          start={index * florals.stagger}
          florals={florals}
          at={spray.at}
          from={spray.from}
          phase={spray.phase}
        >
          <CornerSpray id={`spray-${index}`} inks={inks(`spray-${index}`)} seed={spray.seed} />
        </Placed>
      ))}
    </svg>
  );
};

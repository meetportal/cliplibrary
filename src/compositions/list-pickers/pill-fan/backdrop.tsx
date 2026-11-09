import { AbsoluteFill } from 'remotion';
import type { PillFanProps } from '@/schemas';
import { withAlpha } from './colors';

const STOPS = [0, 0.12, 0.25, 0.4, 0.55, 0.7, 0.85, 1];

const smooth = (t: number) => t * t * (3 - 2 * t);

const glow = (color: string, strength: number, angle: number, extent: number) =>
  `linear-gradient(${angle.toFixed(3)}deg, ${STOPS.map(
    (t) => `${withAlpha(color, strength * (1 - smooth(t)))} ${(t * extent).toFixed(3)}%`,
  ).join(', ')})`;

export const Backdrop = ({ frame, props }: { frame: number; props: PillFanProps }) => {
  const { colors, glow: look } = props;
  const drift = look.drift;
  const first = glow(
    colors.glow,
    look.strength,
    135 + drift * 10 * Math.sin(frame / 47),
    46 + drift * 8 * Math.sin(frame / 23),
  );
  const second = glow(
    colors.glow,
    look.strength,
    315 + drift * 10 * Math.cos(frame / 53),
    50 + drift * 8 * Math.cos(frame / 27),
  );
  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {look.strength > 0 ? (
        <>
          <AbsoluteFill style={{ backgroundImage: first }} />
          <AbsoluteFill style={{ backgroundImage: second }} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

import { AbsoluteFill } from 'remotion';
import { withAlpha } from './palette';

const STOPS = [0, 0.12, 0.25, 0.4, 0.55, 0.7, 0.85, 1];

const smooth = (t: number) => t * t * (3 - 2 * t);

const wash = (color: string, strength: number, angle: number, extent: number) =>
  `linear-gradient(${angle.toFixed(3)}deg, ${STOPS.map(
    (t) => `${withAlpha(color, strength * (1 - smooth(t)))} ${(t * extent).toFixed(3)}%`,
  ).join(', ')})`;

export const Backdrop = ({
  background,
  tints,
  strength,
  drift,
  phase,
}: {
  background: string;
  tints: { first: string; second: string };
  strength: number;
  drift: number;
  phase: number;
}) => {
  const turn = phase * Math.PI * 2;
  const first = wash(
    tints.first,
    strength,
    135 + drift * 16 * Math.sin(turn),
    40 + drift * 14 * Math.sin(turn * 2),
  );
  const second = wash(
    tints.second,
    strength,
    315 + drift * 16 * Math.cos(turn),
    42 + drift * 14 * Math.cos(turn * 2),
  );
  return (
    <AbsoluteFill style={{ backgroundColor: background }}>
      {strength > 0 ? (
        <>
          <AbsoluteFill style={{ backgroundImage: first }} />
          <AbsoluteFill style={{ backgroundImage: second }} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

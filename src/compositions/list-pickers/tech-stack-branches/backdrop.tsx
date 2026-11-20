import { AbsoluteFill, useVideoConfig } from 'remotion';
import type { TechStackBranchesProps } from '@/schemas';
import { mixLab } from '../../kit/lab-color';
import { Dither } from './dither';
import { withAlpha } from './palette';

const STOPS = [0, 0.04, 0.14, 0.3, 0.5, 0.7, 0.86, 0.96, 1];

const eased = (t: number) => t * t * (3 - 2 * t);

const ramp = (from: string, to: string, start: number, end: number) =>
  STOPS.map((t) => `${mixLab(from, to, eased(t))} ${(start + (end - start) * t).toFixed(2)}%`);

const fade = (color: string, strength: number, extent: number) =>
  STOPS.map(
    (t) => `${withAlpha(color, strength * (1 - eased(t)))} ${(t * extent).toFixed(2)}%`,
  ).join(', ');

export const Backdrop = ({ frame, props }: { frame: number; props: TechStackBranchesProps }) => {
  const { width, height } = useVideoConfig();
  const { top, glow, bottom, drift } = props.background;
  const sway = Math.sin(frame / 28) * drift;
  const swell = Math.cos(frame / 28) * drift;
  const base = [...ramp(top, glow, 0, 52), ...ramp(glow, bottom, 52, 100).slice(1)].join(', ');
  return (
    <AbsoluteFill style={{ backgroundColor: top }}>
      <AbsoluteFill
        style={{ backgroundImage: `linear-gradient(${(158 + sway * 16).toFixed(3)}deg, ${base})` }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${(242 + swell * 42).toFixed(3)}deg, ${fade(glow, 0.85, 58 + swell * 12)})`,
        }}
      />
      <AbsoluteFill
        style={{ backgroundImage: `linear-gradient(0deg, ${fade(bottom, 0.9, 40 + sway * 6)})` }}
      />
      <Dither width={width} height={height} />
    </AbsoluteFill>
  );
};

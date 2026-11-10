import { random } from 'remotion';
import type { GoldTones } from './color';
import { ramp, smooth } from './timeline';

const SPAN = 1180;

export const Dust = ({
  count,
  size,
  rise,
  frame,
  gold,
}: {
  count: number;
  size: number;
  rise: number;
  frame: number;
  gold: GoldTones;
}) => {
  if (count <= 0) {
    return null;
  }
  const appear = ramp(frame, 0, 24, smooth);
  return (
    <svg
      aria-hidden="true"
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: 'absolute', inset: 0 }}
    >
      {Array.from({ length: count }, (_, index) => {
        const seed = `gold-dust-${index}`;
        const speed = rise * (0.55 + random(`${seed}-v`) * 0.9);
        const travel = (random(`${seed}-y`) * SPAN + frame * speed) % SPAN;
        const y = 1100 - travel;
        const x = random(`${seed}-x`) * 1920 + Math.sin(frame / 46 + index) * 10;
        const edge = Math.min(1, Math.max(0, (1100 - y) / 160), Math.max(0, (y + 60) / 260));
        const twinkle =
          0.45 +
          0.55 * (0.5 + 0.5 * Math.sin(frame / (9 + random(`${seed}-t`) * 14) + index * 2.1));
        const opacity = appear * edge * twinkle * (0.35 + random(`${seed}-o`) * 0.55);
        if (opacity <= 0.01) {
          return null;
        }
        return (
          <circle
            key={seed}
            cx={x}
            cy={y}
            r={size * (0.5 + random(`${seed}-r`))}
            fill={index % 3 === 0 ? gold.highlight : gold.light}
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
};

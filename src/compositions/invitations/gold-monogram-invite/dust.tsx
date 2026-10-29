import { AbsoluteFill, random } from 'remotion';
import type { GoldMonogramInviteProps } from '@/schemas';
import { smooth, tween } from '../../promo/timing';

const SPAN = 1180;

export const GoldDust = ({
  frame,
  start,
  dust,
  color,
}: {
  frame: number;
  start: number;
  dust: GoldMonogramInviteProps['dust'];
  color: string;
}) => {
  const presence = tween(frame, [start, start + 75], [0, 1], smooth);
  if (dust.count === 0 || presence <= 0) {
    return null;
  }
  return (
    <AbsoluteFill style={{ opacity: presence }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" role="presentation">
        {Array.from({ length: dust.count }, (_, index) => {
          const seed = `gold-dust-${index}`;
          const speed = (0.35 + 0.65 * random(`${seed}-speed`)) * dust.rise;
          const phase = random(`${seed}-phase`) * Math.PI * 2;
          const travelled = random(`${seed}-y`) * SPAN - speed * (frame - start);
          const y = (((travelled % SPAN) + SPAN) % SPAN) - 50;
          const x = random(`${seed}-x`) * 1920 + Math.sin(frame / 54 + phase) * 9;
          const twinkle = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(frame / 26 + phase * 3));
          return (
            <circle
              key={seed}
              cx={x.toFixed(2)}
              cy={y.toFixed(2)}
              r={(dust.size * (0.55 + 0.9 * random(`${seed}-size`))).toFixed(2)}
              fill={color}
              opacity={twinkle.toFixed(3)}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

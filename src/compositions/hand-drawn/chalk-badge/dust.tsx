import type { BadgeLayout } from './layout';

const MOTES = 14;

const seeded = (index: number, salt: number) => {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

export const Dust = (props: {
  layout: BadgeLayout;
  frame: number;
  level: number;
  color: string;
}) => {
  if (props.level <= 0) {
    return null;
  }
  const { layout, frame } = props;
  const u = layout.size;
  const count = Math.round(MOTES * Math.min(1, props.level));
  const strength = Math.min(2, props.level);
  const left = layout.left - 0.5 * u;
  const span = layout.right + 0.9 * u - left;
  return (
    <g fill={props.color}>
      {Array.from({ length: count }, (_, index) => {
        const period = 150 + 90 * seeded(index, 1);
        const cycle = ((frame + seeded(index, 2) * period) % period) / period;
        const x =
          left + span * seeded(index, 3) + 18 * Math.sin(2 * Math.PI * (cycle + seeded(index, 4)));
        const y = layout.baseline + 0.3 * u - (0.25 + 0.9 * seeded(index, 5)) * u * cycle;
        const fade = Math.sin(Math.PI * cycle);
        return (
          <circle
            key={index}
            cx={x.toFixed(2)}
            cy={y.toFixed(2)}
            r={(1.4 + 1.8 * seeded(index, 6)).toFixed(2)}
            opacity={(0.32 * strength * fade).toFixed(3)}
          />
        );
      })}
    </g>
  );
};

import type { ArchSaveTheDateProps } from '@/schemas';
import { seeded, wrap } from './geometry';

const MARGIN = 80;

export const FallingPetals = ({
  petals,
  time,
  width,
  height,
}: {
  petals: ArchSaveTheDateProps['petals'];
  time: number;
  width: number;
  height: number;
}) => {
  if (petals.count === 0) {
    return null;
  }
  const span = height + MARGIN * 2;
  return (
    <svg
      width={width}
      height={height}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      {Array.from({ length: petals.count }, (_, index) => {
        const speed = petals.fallSpeed * (0.7 + seeded(index, 11) * 0.6);
        const y = wrap(seeded(index, 12) * span + time * speed, span) - MARGIN;
        const x =
          (seeded(index, 13) * 0.9 + 0.05) * width +
          Math.sin(time / (38 + seeded(index, 14) * 30) + index) * petals.sway;
        const spin =
          seeded(index, 15) * 360 +
          time * (0.6 + seeded(index, 16) * 1.2) * (index % 2 === 0 ? 1 : -1);
        const tumble =
          0.35 + 0.65 * Math.abs(Math.cos(time / (26 + seeded(index, 17) * 24) + index));
        const size = petals.size * (0.75 + seeded(index, 18) * 0.5);
        return (
          <path
            key={index}
            d={`M 0 ${-size / 2} C ${size * 0.42} ${-size * 0.3} ${size * 0.34} ${size * 0.34} 0 ${size / 2} C ${-size * 0.34} ${size * 0.34} ${-size * 0.42} ${-size * 0.3} 0 ${-size / 2} Z`}
            fill={index % 3 === 2 ? petals.colorB : petals.colorA}
            opacity={petals.opacity}
            transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${spin.toFixed(2)}) scale(${tumble.toFixed(4)} 1)`}
          />
        );
      })}
    </svg>
  );
};

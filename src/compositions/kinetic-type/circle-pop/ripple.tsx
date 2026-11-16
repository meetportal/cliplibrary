import { lerp } from '../../kit/motion';

export const Ripple = ({
  progress,
  cx,
  cy,
  from,
  to,
  strokeWidth,
  color,
  width,
  height,
}: {
  progress: number;
  cx: number;
  cy: number;
  from: number;
  to: number;
  strokeWidth: number;
  color: string;
  width: number;
  height: number;
}) => {
  if (progress <= 0 || progress >= 1) {
    return null;
  }
  const thickness = strokeWidth * Math.min(1, progress / 0.12) * (1 - progress);
  if (thickness < 0.3) {
    return null;
  }
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', inset: 0 }}
    >
      <title>Ripple</title>
      <circle
        cx={cx}
        cy={cy}
        r={lerp(from, to, progress)}
        fill="none"
        stroke={color}
        strokeWidth={thickness}
      />
    </svg>
  );
};

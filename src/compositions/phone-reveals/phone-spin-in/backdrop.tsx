import { AbsoluteFill } from 'remotion';

const EASED_STOPS = [0, 0.04, 0.14, 0.3, 0.5, 0.7, 0.86, 0.96, 1];

type Rgba = [number, number, number, number];

const parse = (hex: string): Rgba => [
  Number.parseInt(hex.slice(1, 3), 16),
  Number.parseInt(hex.slice(3, 5), 16),
  Number.parseInt(hex.slice(5, 7), 16),
  hex.length === 9 ? Number.parseInt(hex.slice(7, 9), 16) / 255 : 1,
];

const css = ([red, green, blue, alpha]: Rgba) =>
  `rgba(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)}, ${alpha.toFixed(3)})`;

const mix = (from: Rgba, to: Rgba, amount: number): Rgba => [
  from[0] + (to[0] - from[0]) * amount,
  from[1] + (to[1] - from[1]) * amount,
  from[2] + (to[2] - from[2]) * amount,
  from[3] + (to[3] - from[3]) * amount,
];

const easedStops = (from: Rgba, to: Rgba, start: number, end: number) =>
  EASED_STOPS.map(
    (amount, index) =>
      `${css(mix(from, to, amount))} ${(start + ((end - start) * index) / (EASED_STOPS.length - 1)).toFixed(2)}%`,
  );

export const Backdrop = ({
  center,
  edge,
  focusX,
}: {
  center: string;
  edge: string;
  focusX: number;
}) => {
  const middle = parse(center);
  const rim = parse(edge);
  const shade: Rgba = [rim[0], rim[1], rim[2], 0.7];
  const clear: Rgba = [rim[0], rim[1], rim[2], 0];
  const vertical = [`${css(middle)} 0%`, ...easedStops(middle, rim, 35, 100)];
  const sides = [...easedStops(shade, clear, 0, focusX), ...easedStops(clear, shade, focusX, 100)];
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{ backgroundImage: `linear-gradient(to bottom, ${vertical.join(', ')})` }}
      />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(to right, ${sides.join(', ')})` }} />
    </AbsoluteFill>
  );
};

import { pathData, type Stroke } from './geometry';

const TAPER_LENGTH = 4;

export const PencilStroke = ({
  shape,
  progress,
  width,
  color,
}: {
  shape: Stroke;
  progress: number;
  width: number;
  color: string;
}) => {
  if (progress <= 0) {
    return null;
  }
  const drawn = shape.length * Math.min(1, progress);
  const taper = Math.min(1, 0.4 + (0.6 * drawn) / (TAPER_LENGTH * width));
  const dash = `${drawn.toFixed(2)} ${(shape.length + 40).toFixed(2)}`;
  const d = pathData(shape.points);
  const grain = width * 0.34;
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeOpacity={0.9}
        strokeWidth={width * taper}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dash}
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeOpacity={0.4}
        strokeWidth={width * 0.42 * taper}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dash}
        transform={`translate(${grain.toFixed(2)} ${(-grain * 0.8).toFixed(2)})`}
      />
    </g>
  );
};

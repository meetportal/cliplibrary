import type { BotanicalSaveTheDateProps } from '@/schemas';
import { smooth, tween } from '../../promo/timing';
import { type Point, pathData, polyline } from './geometry';

export const PageBorder = ({
  frame,
  width,
  height,
  border,
  color,
  start,
}: {
  frame: number;
  width: number;
  height: number;
  border: BotanicalSaveTheDateProps['border'];
  color: string;
  start: number;
}) => {
  const progress = tween(frame, [start, start + border.drawFrames], [0, 1], smooth);
  if (!border.show || progress <= 0 || border.width <= 0) {
    return null;
  }
  const left = border.inset;
  const right = width - border.inset;
  const top = border.inset;
  const bottom = height - border.inset;
  const middle = width / 2;
  const stroke = { fill: 'none', stroke: color, strokeWidth: border.width };
  if (progress >= 1) {
    return <rect x={left} y={top} width={right - left} height={bottom - top} {...stroke} />;
  }
  const halves: Point[][] = [
    [
      [middle, top],
      [right, top],
      [right, bottom],
      [middle, bottom],
    ],
    [
      [middle, top],
      [left, top],
      [left, bottom],
      [middle, bottom],
    ],
  ];
  return (
    <g>
      {halves.map((points) => {
        const { total } = polyline(points);
        return (
          <path
            key={points[1]?.[0]}
            d={pathData(points)}
            {...stroke}
            strokeLinecap="butt"
            strokeDasharray={`${total} ${total}`}
            strokeDashoffset={total * (1 - progress)}
          />
        );
      })}
    </g>
  );
};

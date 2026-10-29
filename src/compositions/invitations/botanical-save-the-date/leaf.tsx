import { settle, tween } from '../../promo/timing';
import { leafPath, type Point } from './geometry';

const LEAF_OPEN_FRAMES = 20;

export interface LeafInk {
  color: string;
  fill: number;
  lineWidth: number;
}

export const leafOpening = (frame: number, opensAt: number): number =>
  tween(frame, [opensAt, opensAt + LEAF_OPEN_FRAMES], [0, 1], settle);

export const Leaf = ({
  at,
  angle,
  spread,
  length,
  width,
  open,
  ink,
}: {
  at: Point;
  angle: number;
  spread: number;
  length: number;
  width: number;
  open: number;
  ink: LeafInk;
}) => {
  if (open <= 0) {
    return null;
  }
  const rotation = angle + spread * (0.3 + 0.7 * open);
  const scale = 0.2 + 0.8 * open;
  return (
    <g
      transform={`translate(${at[0].toFixed(2)} ${at[1].toFixed(2)}) rotate(${rotation.toFixed(3)}) scale(${scale.toFixed(4)})`}
      opacity={Math.min(1, open * 2.2)}
    >
      <path
        d={leafPath(length, width)}
        fill={ink.color}
        fillOpacity={ink.fill}
        stroke={ink.color}
        strokeWidth={ink.lineWidth}
        strokeLinejoin="round"
      />
      <path
        d={`M${(length * 0.1).toFixed(2)} 0 L${(length * 0.8).toFixed(2)} 0`}
        stroke={ink.color}
        strokeWidth={ink.lineWidth * 0.7}
        strokeOpacity={0.8}
        fill="none"
      />
    </g>
  );
};

export const LeafCluster = ({
  at,
  direction,
  size,
  open,
  ink,
}: {
  at: Point;
  direction: number;
  size: number;
  open: number;
  ink: LeafInk;
}) => (
  <g>
    <Leaf
      at={at}
      angle={direction}
      spread={-46}
      length={50 * size}
      width={19 * size}
      open={open}
      ink={ink}
    />
    <Leaf
      at={at}
      angle={direction}
      spread={46}
      length={50 * size}
      width={19 * size}
      open={open}
      ink={ink}
    />
    <Leaf
      at={at}
      angle={direction}
      spread={0}
      length={68 * size}
      width={25 * size}
      open={open}
      ink={ink}
    />
  </g>
);

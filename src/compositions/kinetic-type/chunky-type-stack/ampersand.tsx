import { STACK_FAMILY } from './fonts';
import { EASE_IN, EASE_IN_OUT } from './timeline';

type AmpersandProps = {
  x: number;
  centerY: number;
  baseline: number;
  size: number;
  grow: number;
  shrink: number;
  fill: string;
};

export const Ampersand = ({ x, centerY, baseline, size, grow, shrink, fill }: AmpersandProps) => {
  const scale = EASE_IN_OUT(grow) * (1 - EASE_IN(shrink));
  if (scale < 0.01) {
    return null;
  }
  return (
    <text
      x={x.toFixed(2)}
      y={baseline.toFixed(2)}
      fontSize={size}
      fontFamily={`"${STACK_FAMILY}"`}
      textAnchor="middle"
      fill={fill}
      transform={`translate(${x.toFixed(2)} ${centerY.toFixed(2)}) scale(${scale.toFixed(4)}) translate(${(-x).toFixed(2)} ${(-centerY).toFixed(2)})`}
    >
      &amp;
    </text>
  );
};

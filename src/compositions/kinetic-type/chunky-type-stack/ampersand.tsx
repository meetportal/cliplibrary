import { mixLab } from '../../kit/lab-color';
import { STACK_FAMILY } from './fonts';
import { EASE_IN_OUT } from './timeline';

const PEAK_SCALE = 4.4;
const GROWTH = 2;
const FADE_FROM = 0.8;
const CHALK = '#ffffff';

type AmpersandProps = {
  x: number;
  centerY: number;
  baseline: number;
  size: number;
  zoom: number;
  fill: string;
};

export const Ampersand = ({ x, centerY, baseline, size, zoom, fill }: AmpersandProps) => {
  const scale = PEAK_SCALE * zoom ** GROWTH;
  const fade = EASE_IN_OUT(Math.max(0, (zoom - FADE_FROM) / (1 - FADE_FROM)));
  if (scale < 0.01 || fade >= 1) {
    return null;
  }
  return (
    <text
      x={x.toFixed(2)}
      y={baseline.toFixed(2)}
      fontSize={size}
      fontFamily={`"${STACK_FAMILY}"`}
      textAnchor="middle"
      fill={fade > 0 ? mixLab(fill, CHALK, Math.min(1, fade * 2) * 0.75) : fill}
      opacity={1 - fade}
      transform={`translate(${x.toFixed(2)} ${centerY.toFixed(2)}) scale(${scale.toFixed(4)}) translate(${(-x).toFixed(2)} ${(-centerY).toFixed(2)})`}
    >
      &amp;
    </text>
  );
};

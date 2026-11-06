import { Easing } from 'remotion';
import { contrastRatio } from './contrast';
import { curveD, ringD } from './geometry';
import type { Lockup } from './lockup';
import { cometLength, dotState, headDistance, progress, type Timeline } from './timeline';

const LOW_CONTRAST = 2.4;
const EDGE_WIDTH = 2.5;

export type CometColors = { primary: string; background: string; ring: string; text: string };

export const Comet = ({
  frame,
  lockup,
  line,
  colors,
}: {
  frame: number;
  lockup: Lockup;
  line: Timeline;
  colors: CometColors;
}) => {
  const dot = dotState(frame, line, lockup);
  const head = headDistance(frame, line, lockup);
  const comet =
    frame >= line.merge && frame < line.exitEnd
      ? { head, length: cometLength(head, line, lockup) }
      : null;
  const outer =
    contrastRatio(colors.primary, colors.background) < LOW_CONTRAST ? colors.text : null;
  const inner =
    contrastRatio(colors.primary, colors.ring) < LOW_CONTRAST ? colors.background : null;
  const inset =
    inner === null
      ? 0
      : EDGE_WIDTH * (1 - progress(frame, [line.close, line.exitEnd], Easing.linear));
  const width = dot.radius * 2 * dot.scaleX;
  const height = dot.radius * 2 * dot.scaleY;
  const layer = (fill: string, grow: number) => (
    <>
      {comet !== null && comet.length > 0.5 ? (
        <path
          d={`${ringD(lockup.center, lockup.radius)} ${curveD(lockup.exit)}`}
          fill="none"
          stroke={fill}
          strokeWidth={lockup.thickness + grow * 2}
          strokeLinecap="round"
          pathLength={line.total}
          strokeDasharray={`${comet.length} ${line.total * 3}`}
          strokeDashoffset={-(comet.head - comet.length)}
        />
      ) : null}
      <rect
        x={dot.point.x - width / 2 - grow}
        y={dot.point.y - height / 2 - grow}
        width={Math.max(0, width + grow * 2)}
        height={Math.max(0, height + grow * 2)}
        rx={Math.max(0, height / 2 + grow)}
        fill={fill}
      />
    </>
  );
  return (
    <g opacity={dot.opacity}>
      {outer === null ? null : layer(outer, EDGE_WIDTH)}
      {inner === null || inset <= 0.05 ? null : layer(inner, 0)}
      {layer(colors.primary, -inset)}
    </g>
  );
};

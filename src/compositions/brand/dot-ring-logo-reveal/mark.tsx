import { Easing, interpolateColors } from 'remotion';
import type { DotRingLogoRevealProps } from '@/schemas';
import { ringD, roundedRectD } from './geometry';
import type { Lockup } from './lockup';
import { headDistance, progress, type Timeline } from './timeline';

type MarkProps = {
  frame: number;
  props: DotRingLogoRevealProps;
  lockup: Lockup;
  line: Timeline;
};

const FILL_FRAMES = 10;

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

export const frameOutline = (frame: number, line: Timeline, lockup: Lockup, outline: number) => {
  const morph = progress(frame, [line.close + 2, line.close + 24]);
  const diameter = lockup.radius * 2;
  const width = lockup.shape.width - outline;
  const height = lockup.shape.height - outline;
  return {
    width: lerp(diameter, width, morph),
    height: lerp(diameter, height, morph),
    radius: lerp(diameter / 2, lockup.shape.radius, morph),
    stroke: lerp(lockup.thickness, outline, morph),
    fit: Math.min(1, lerp(diameter, width, morph) / width, lerp(diameter, height, morph) / height),
  };
};

const bloomFade = (frame: number, line: Timeline) =>
  progress(frame, [line.close - 3, line.close + 10]);

const RoundedRect = ({
  lockup,
  width,
  height,
  radius,
  fill,
  stroke,
  strokeWidth,
  opacity = 1,
}: {
  lockup: Lockup;
  width: number;
  height: number;
  radius: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity?: number;
}) => (
  <rect
    x={lockup.center.x - width / 2}
    y={lockup.center.y - height / 2}
    width={width}
    height={height}
    rx={Math.min(radius, width / 2, height / 2)}
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    opacity={opacity}
  />
);

const DrawingRing = ({ frame, props, lockup, line }: MarkProps) => {
  const drawn = headDistance(frame, line, lockup);
  if (drawn <= 0.5) {
    return null;
  }
  const growth = progress(drawn, [0, lockup.mergeDistance]);
  const fade = props.ring.handoff === 'bloom' ? bloomFade(frame, line) : 0;
  return (
    <path
      d={ringD(lockup.center, lockup.radius)}
      fill="none"
      stroke={props.colors.ring}
      opacity={1 - fade * fade}
      strokeWidth={lockup.thickness * (0.22 + 0.78 * growth) * (1 - fade)}
      strokeLinecap="butt"
      pathLength={lockup.circumference}
      strokeDasharray={`${drawn} ${lockup.circumference * 2}`}
    />
  );
};

const Handoff = ({ frame, props, lockup, line }: MarkProps) => {
  const { ring, colors } = props;
  const diameter = lockup.radius * 2;
  const thickness = lockup.thickness;
  if (ring.handoff === 'bloom') {
    const fade = bloomFade(frame, line);
    if (fade >= 1) {
      return null;
    }
    const size =
      diameter *
      (1 + 0.16 * progress(frame, [line.close, line.close + 18], Easing.out(Easing.quad)));
    return (
      <RoundedRect
        lockup={lockup}
        width={size}
        height={size}
        radius={size / 2}
        fill="none"
        stroke={colors.ring}
        strokeWidth={thickness * (1 - fade)}
        opacity={1 - fade * fade}
      />
    );
  }
  if (ring.handoff === 'plate') {
    const outer = diameter + thickness;
    const morph = progress(frame, [line.close + 3, line.close + 26]);
    const width = lerp(outer, lockup.shape.width, morph);
    const height = lerp(outer, lockup.shape.height, morph);
    const radius = lerp(outer / 2, lockup.shape.radius, morph);
    const fill = progress(frame, [line.close, line.close + FILL_FRAMES], Easing.in(Easing.quad));
    const scale = 1 - fill;
    const inset = thickness;
    const outline = roundedRectD(lockup.center, width, height, radius);
    const hole =
      scale > 0.01
        ? roundedRectD(
            lockup.center,
            (width - 2 * inset) * scale,
            (height - 2 * inset) * scale,
            Math.max(0, radius - inset) * scale,
          )
        : '';
    return (
      <path
        d={`${outline} ${hole}`}
        fillRule="evenodd"
        fill={interpolateColors(fill, [0, 1], [colors.ring, colors.plate])}
      />
    );
  }
  const outline = frameOutline(frame, line, lockup, ring.frameThickness);
  return (
    <RoundedRect
      lockup={lockup}
      width={outline.width}
      height={outline.height}
      radius={outline.radius}
      fill="none"
      stroke={colors.ring}
      strokeWidth={outline.stroke}
    />
  );
};

export const Mark = (markProps: MarkProps) =>
  markProps.frame < markProps.line.close ? (
    <DrawingRing {...markProps} />
  ) : (
    <Handoff {...markProps} />
  );

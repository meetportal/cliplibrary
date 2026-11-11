import { Easing, Img } from 'remotion';
import type { BrandRevealProps } from '@/schemas';
import { ramp } from '../../kit/motion';
import { resolveCustom } from '../../kit/resolve-custom';
import { type PlateSize, stadiumPath, stadiumPoint } from './geometry';
import { visibleInk } from './ink';
import { drawProgress, plateIn, ringClosed, ringDash, type Timeline } from './timeline';

const DOT_LEAD = 0.02;

export const haloReach = (props: BrandRevealProps) => props.halo.gap + props.halo.thickness;

export const dotReach = (props: BrandRevealProps) =>
  props.dot.show ? props.dot.distance + props.dot.size : 0;

export const Halo = ({
  frame,
  fps,
  line,
  props,
  plate,
  logo,
  centerX,
  centerY,
}: {
  frame: number;
  fps: number;
  line: Timeline;
  props: BrandRevealProps;
  plate: PlateSize;
  logo: string | null;
  centerX: number;
  centerY: number;
}) => {
  const { halo, dot, colors } = props;
  const half = (plate.width - plate.height) / 2;
  const ringRadius = plate.height / 2 + halo.gap + halo.thickness / 2;
  const dotRadius = ringRadius + halo.thickness / 2 + dot.distance + dot.size / 2;
  const pad = Math.ceil(dotRadius + dot.size);
  const box = { width: 2 * (half + pad), height: 2 * pad };
  const local = { cx: box.width / 2, cy: box.height / 2, half };
  const ink = visibleInk(colors.primary, colors.background);
  const progress = drawProgress(frame, line);
  const closed = ringClosed(progress);
  const grow = ramp(progress, 0, 0.35);
  const strokeWidth = halo.thickness * (0.35 + 0.65 * grow);
  const shown = plateIn(frame, line);
  const elapsed = Math.max(0, frame - line.ringStart) / fps;
  const dotAt = progress + DOT_LEAD + (dot.orbit / 360) * elapsed;
  const dotPoint = stadiumPoint({ ...local, radius: dotRadius }, dotAt);
  const dotShown = ramp(progress, 0.55, 0.95, Easing.inOut(Easing.quad));
  const plateShape = stadiumPath({ ...local, radius: plate.height / 2 });
  return (
    <div
      style={{
        position: 'absolute',
        left: centerX - box.width / 2,
        top: centerY - box.height / 2,
        width: box.width,
        height: box.height,
      }}
    >
      <svg
        width={box.width}
        height={box.height}
        viewBox={`0 0 ${box.width} ${box.height}`}
        aria-hidden="true"
        style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}
      >
        {logo === null ? null : (
          <path
            d={plateShape}
            fill={colors.plate}
            opacity={shown.opacity}
            transform={`translate(${local.cx} ${local.cy}) scale(${shown.scale}) translate(${-local.cx} ${-local.cy})`}
          />
        )}
        {progress <= 0 ? null : (
          <path
            d={stadiumPath({ ...local, radius: ringRadius })}
            fill="none"
            stroke={ink}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            pathLength={1}
            strokeDasharray={closed ? undefined : `${ringDash(progress)} 2`}
          />
        )}
        {dot.show && dotShown > 0 ? (
          <circle
            cx={dotPoint.x}
            cy={dotPoint.y}
            r={(dot.size / 2) * (0.5 + 0.5 * dotShown)}
            fill={ink}
            opacity={dotShown}
          />
        ) : null}
      </svg>
      {logo === null ? null : (
        <Img
          src={resolveCustom(logo)}
          style={{
            position: 'absolute',
            left: local.cx - plate.logoWidth / 2,
            top: local.cy - plate.logoHeight / 2,
            width: plate.logoWidth,
            height: plate.logoHeight,
            objectFit: 'contain',
            opacity: shown.opacity,
            transform: `scale(${shown.scale})`,
          }}
        />
      )}
    </div>
  );
};

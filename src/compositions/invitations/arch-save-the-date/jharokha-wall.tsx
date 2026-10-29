import type { ArchSaveTheDateProps } from '@/schemas';
import { type ArchShape, archPath, archYAt, CENTER_X, growArch, type WorldBox } from './geometry';

const BAND_ORIGIN = -400;

const repeatAcross = (world: WorldBox, origin: number, pitch: number, reach: number): number[] => {
  const first = Math.floor((world.left - reach - origin) / pitch);
  const last = Math.ceil((world.left + world.width + reach - origin) / pitch);
  return Array.from({ length: last - first + 1 }, (_, index) => origin + (first + index) * pitch);
};

const Rosette = ({
  x,
  y,
  radius,
  carving,
  trim,
}: {
  x: number;
  y: number;
  radius: number;
  carving: string;
  trim: string;
}) => (
  <g transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}>
    {Array.from({ length: 8 }, (_, index) => (
      <ellipse
        key={index}
        cx={0}
        cy={-radius * 0.55}
        rx={radius * 0.2}
        ry={radius * 0.45}
        fill="none"
        stroke={carving}
        strokeWidth={2}
        transform={`rotate(${index * 45})`}
      />
    ))}
    <circle r={radius} fill="none" stroke={carving} strokeWidth={1.5} />
    <circle r={radius * 0.16} fill={trim} />
  </g>
);

const Kanguras = ({
  y,
  color,
  carving,
  world,
}: {
  y: number;
  color: string;
  carving: string;
  world: WorldBox;
}) => (
  <g>
    {repeatAcross(world, BAND_ORIGIN, 56, 20).map((x) => {
      return (
        <path
          key={x}
          d={`M ${x - 20} ${y} V ${y - 26} Q ${x - 20} ${y - 40} ${x} ${y - 48} Q ${x + 20} ${y - 40} ${x + 20} ${y - 26} V ${y} Z`}
          fill={color}
          stroke={carving}
          strokeWidth={1.5}
        />
      );
    })}
  </g>
);

const Frieze = ({
  y,
  wall,
  world,
}: {
  y: number;
  wall: ArchSaveTheDateProps['wall'];
  world: WorldBox;
}) => (
  <g>
    <rect x={world.left} y={y} width={world.width} height={56} fill={wall.shade} opacity={0.45} />
    <line
      x1={world.left}
      x2={world.left + world.width}
      y1={y}
      y2={y}
      stroke={wall.carving}
      strokeWidth={2}
    />
    <line
      x1={world.left}
      x2={world.left + world.width}
      y1={y + 56}
      y2={y + 56}
      stroke={wall.carving}
      strokeWidth={2}
    />
    {repeatAcross(world, BAND_ORIGIN + 25, 50, 16).map((x) => {
      return (
        <path
          key={x}
          d={`M ${x} ${y + 12} L ${x + 16} ${y + 28} L ${x} ${y + 44} L ${x - 16} ${y + 28} Z`}
          fill="none"
          stroke={wall.carving}
          strokeWidth={1.5}
        />
      );
    })}
  </g>
);

const Pilaster = ({
  x,
  top,
  bottom,
  wall,
}: {
  x: number;
  top: number;
  bottom: number;
  wall: ArchSaveTheDateProps['wall'];
}) => (
  <g>
    <rect
      x={x - 30}
      y={top}
      width={60}
      height={bottom - top}
      fill={wall.color}
      stroke={wall.carving}
      strokeWidth={2}
    />
    <rect
      x={x - 18}
      y={top + 60}
      width={36}
      height={bottom - top - 120}
      fill={wall.shade}
      opacity={0.6}
    />
    <rect
      x={x - 44}
      y={top}
      width={88}
      height={28}
      fill={wall.shade}
      stroke={wall.carving}
      strokeWidth={2}
    />
    <rect
      x={x - 44}
      y={bottom - 34}
      width={88}
      height={34}
      fill={wall.shade}
      stroke={wall.carving}
      strokeWidth={2}
    />
  </g>
);

const Corbel = ({ x, y, wall }: { x: number; y: number; wall: ArchSaveTheDateProps['wall'] }) => (
  <g>
    <path
      d={`M ${x - 34} ${y} H ${x + 34} V ${y + 18} H ${x + 24} V ${y + 40} H ${x + 14} Q ${x + 12} ${y + 82} ${x} ${y + 96} Q ${x - 12} ${y + 82} ${x - 14} ${y + 40} H ${x - 24} V ${y + 18} H ${x - 34} Z`}
      fill={wall.shade}
      stroke={wall.carving}
      strokeWidth={2}
    />
    <circle cx={x} cy={y + 100} r={6} fill={wall.trim} />
  </g>
);

export const JharokhaWall = ({
  shape,
  arch,
  wall,
  world,
  ids,
}: {
  shape: ArchShape;
  arch: ArchSaveTheDateProps['arch'];
  wall: ArchSaveTheDateProps['wall'];
  world: WorldBox;
  ids: { wall: string; opening: string; eave: string };
}) => {
  const worldRight = world.left + world.width;
  const worldBottom = world.top + world.height;
  const backing = `M ${world.left} ${world.top} H ${worldRight} V ${worldBottom} H ${world.left} Z`;
  const opening = archPath(shape, arch.lobes);
  const outerShape = growArch(shape, arch.band);
  const outer = archPath(outerShape, 0);
  const frameLeft = CENTER_X - outerShape.halfWidth - 34;
  const frameRight = CENTER_X + outerShape.halfWidth + 34;
  const frameTop = outerShape.apexY - 40;
  const eaveY = frameTop - 26;
  const rosetteX = outerShape.halfWidth * 0.66;
  const rosetteRoom = archYAt(outerShape, CENTER_X - rosetteX) - frameTop;
  const rosetteRadius = Math.max(0, Math.min(46, rosetteRoom / 2 - 12));
  const rosetteY = frameTop + rosetteRoom / 2;
  const ledgeLeft = frameLeft - 30;
  const ledgeRight = frameRight + 30;
  return (
    <g>
      <defs>
        <linearGradient
          id={ids.wall}
          gradientUnits="userSpaceOnUse"
          x1={-260}
          y1={0}
          x2={1340}
          y2={0}
        >
          <stop offset={0} stopColor={wall.shade} />
          <stop offset={0.3} stopColor={wall.color} />
          <stop offset={0.7} stopColor={wall.color} />
          <stop offset={1} stopColor={wall.shade} />
        </linearGradient>
        <linearGradient id={ids.eave} x1={0} y1={0} x2={0} y2={1}>
          <stop offset={0} stopColor={wall.color} />
          <stop offset={1} stopColor={wall.shade} />
        </linearGradient>
        <clipPath id={ids.opening}>
          <path d={opening} />
        </clipPath>
      </defs>
      <path d={`${backing} ${opening}`} fill={`url(#${ids.wall})`} fillRule="evenodd" />
      <path d={`${outer} ${opening}`} fill={wall.shade} opacity={0.55} fillRule="evenodd" />
      <g clipPath={`url(#${ids.opening})`}>
        <path
          d={archPath(shape, arch.lobes, false)}
          fill="none"
          stroke={wall.shade}
          strokeWidth={34}
        />
        <path
          d={archPath(shape, arch.lobes, false)}
          fill="none"
          stroke={wall.carving}
          strokeWidth={34}
          opacity={0.18}
        />
      </g>
      <path
        d={archPath(outerShape, 0, false)}
        fill="none"
        stroke={wall.carving}
        strokeWidth={2.5}
      />
      <path
        d={archPath(growArch(shape, arch.band - 12), 0, false)}
        fill="none"
        stroke={wall.carving}
        strokeWidth={1.2}
      />
      {wall.beads ? (
        <path
          d={archPath(growArch(shape, arch.band * 0.45), 0, false)}
          fill="none"
          stroke={wall.carving}
          strokeWidth={7}
          strokeDasharray="0 17"
          strokeLinecap="round"
        />
      ) : null}
      {wall.trimWidth > 0 ? (
        <path
          d={archPath(shape, arch.lobes, false)}
          fill="none"
          stroke={wall.trim}
          strokeWidth={wall.trimWidth}
          strokeLinejoin="round"
        />
      ) : null}
      <rect
        x={frameLeft}
        y={frameTop}
        width={frameRight - frameLeft}
        height={shape.sillY - frameTop}
        fill="none"
        stroke={wall.carving}
        strokeWidth={2.5}
      />
      <rect
        x={frameLeft + 12}
        y={frameTop + 12}
        width={frameRight - frameLeft - 24}
        height={shape.sillY - frameTop - 12}
        fill="none"
        stroke={wall.carving}
        strokeWidth={1.2}
      />
      {wall.rosettes && rosetteRadius > 8 ? (
        <>
          <Rosette
            x={CENTER_X - rosetteX}
            y={rosetteY}
            radius={rosetteRadius}
            carving={wall.carving}
            trim={wall.trim}
          />
          <Rosette
            x={CENTER_X + rosetteX}
            y={rosetteY}
            radius={rosetteRadius}
            carving={wall.carving}
            trim={wall.trim}
          />
        </>
      ) : null}
      <rect
        x={world.left}
        y={eaveY - 70}
        width={world.width}
        height={52}
        fill={`url(#${ids.eave})`}
        stroke={wall.carving}
        strokeWidth={2}
      />
      <rect x={world.left} y={eaveY - 18} width={world.width} height={18} fill={wall.shade} />
      <line
        x1={world.left}
        x2={worldRight}
        y1={eaveY}
        y2={eaveY}
        stroke={wall.carving}
        strokeWidth={2}
      />
      <Kanguras y={eaveY - 70} color={wall.color} carving={wall.carving} world={world} />
      <Frieze y={eaveY - 230} wall={wall} world={world} />
      <Pilaster x={frameLeft - 110} top={eaveY} bottom={worldBottom + 40} wall={wall} />
      <Pilaster x={frameRight + 110} top={eaveY} bottom={worldBottom + 40} wall={wall} />
      <rect
        x={ledgeLeft}
        y={shape.sillY}
        width={ledgeRight - ledgeLeft}
        height={30}
        fill={`url(#${ids.eave})`}
        stroke={wall.carving}
        strokeWidth={2}
      />
      <rect
        x={ledgeLeft + 16}
        y={shape.sillY + 30}
        width={ledgeRight - ledgeLeft - 32}
        height={12}
        fill={wall.shade}
        stroke={wall.carving}
        strokeWidth={1.5}
      />
      {[-1, 0, 1].map((side) => (
        <Corbel
          key={side}
          x={CENTER_X + side * (shape.halfWidth - 20)}
          y={shape.sillY + 42}
          wall={wall}
        />
      ))}
    </g>
  );
};

import type { MagnifierCaptionProps } from '@/schemas';

type LensProps = MagnifierCaptionProps['lens'];

export type GlassColors = { rim: string; handle: string; edge: string };

const arcPath = (radius: number, from: number, to: number): string => {
  const point = (degrees: number) => {
    const angle = (degrees * Math.PI) / 180;
    return `${(radius * Math.cos(angle)).toFixed(2)} ${(radius * Math.sin(angle)).toFixed(2)}`;
  };
  return `M ${point(from)} A ${radius} ${radius} 0 0 1 ${point(to)}`;
};

const HANDLE_WIDTH = 48;
const HANDLE_GAP = 8;

const Handle = ({ lens, colors }: { lens: LensProps; colors: GlassColors }) => {
  const half = HANDLE_WIDTH / 2;
  const collarWidth = HANDLE_WIDTH * 1.36;
  const collarHeight = HANDLE_WIDTH * 0.62;
  const top = lens.radius + lens.rimWidth / 2 + HANDLE_GAP;
  return (
    <>
      <rect
        x={-half}
        y={top + collarHeight * 0.5}
        width={HANDLE_WIDTH}
        height={lens.handle}
        rx={half}
        fill={colors.handle}
        stroke={colors.rim}
        strokeWidth={lens.rimWidth}
      />
      <rect
        x={-collarWidth / 2}
        y={top}
        width={collarWidth}
        height={collarHeight}
        rx={collarHeight * 0.32}
        fill={colors.rim}
      />
      {lens.handle > HANDLE_WIDTH * 2 ? (
        <line
          x1={0}
          y1={top + collarHeight + HANDLE_WIDTH * 0.5}
          x2={0}
          y2={top + collarHeight * 0.5 + lens.handle - HANDLE_WIDTH * 0.55}
          stroke={colors.rim}
          strokeOpacity={0.28}
          strokeWidth={Math.max(1.5, lens.rimWidth * 0.32)}
          strokeLinecap="round"
        />
      ) : null}
    </>
  );
};

export const MagnifierGlass = ({
  pose,
  lens,
  colors,
}: {
  pose: { x: number; y: number; angle: number };
  lens: LensProps;
  colors: GlassColors;
}) => {
  const glintRadius = lens.radius - lens.rimWidth * 2.4;
  const glintWidth = Math.max(2, lens.rimWidth * 0.75);
  return (
    <svg
      aria-hidden="true"
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{ position: 'absolute', left: 0, top: 0 }}
    >
      <g
        transform={`translate(${pose.x.toFixed(3)} ${pose.y.toFixed(3)}) rotate(${pose.angle.toFixed(3)})`}
      >
        {lens.handle > 0 ? <Handle lens={lens} colors={colors} /> : null}
        <circle
          r={lens.radius + lens.rimWidth * 0.5}
          fill="none"
          stroke={colors.edge}
          strokeOpacity={0.5}
          strokeWidth={1.5}
        />
        <circle r={lens.radius} fill="none" stroke={colors.rim} strokeWidth={lens.rimWidth} />
        <circle
          r={lens.radius - lens.rimWidth * 1.4}
          fill="none"
          stroke={colors.rim}
          strokeOpacity={0.32}
          strokeWidth={Math.max(1, lens.rimWidth * 0.2)}
        />
      </g>
      {lens.glint > 0 ? (
        <g
          transform={`translate(${pose.x.toFixed(3)} ${pose.y.toFixed(3)})`}
          fill="none"
          stroke="#ffffff"
          strokeLinecap="round"
          strokeWidth={glintWidth}
        >
          <path d={arcPath(glintRadius, 198, 246)} strokeOpacity={lens.glint} />
          <path d={arcPath(glintRadius, 254, 263)} strokeOpacity={lens.glint * 0.7} />
        </g>
      ) : null}
    </svg>
  );
};

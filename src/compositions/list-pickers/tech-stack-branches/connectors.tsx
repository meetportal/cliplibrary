import { AbsoluteFill } from 'remotion';
import type { TechStackBranchesProps } from '@/schemas';
import type { Layout } from './layout';
import { withAlpha } from './palette';

const ARC_REACH = 3.2;
const ARC_STEP = 0.05;
const DASH_INSET = 0.75;
const DASH_FLOW = 0.6;

type ArcProps = {
  clock: number;
  props: TechStackBranchesProps;
  layout: Layout;
  offset: number;
  color: string;
  opacity: number;
  frame: { width: number; height: number };
};

export const DashedArc = ({ clock, props, layout, offset, color, opacity, frame }: ArcProps) => {
  const { wheel, branch } = props;
  if (wheel.dashes <= 0) {
    return null;
  }
  const points: string[] = [];
  for (let d = -ARC_REACH; d <= ARC_REACH + 1e-6; d += ARC_STEP) {
    const x = layout.wheelX + layout.pillHeight * DASH_INSET + layout.curve * d * d;
    const y = layout.centerY + d * wheel.spacing;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const dash = Math.max(10, layout.pillHeight * 0.13);
  const stroke = Math.max(2, branch.width * 1.1);
  return (
    <AbsoluteFill style={{ opacity: opacity * wheel.dashes }}>
      <svg
        width={frame.width}
        height={frame.height}
        viewBox={`0 0 ${frame.width} ${frame.height}`}
        aria-hidden="true"
      >
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash.toFixed(1)} ${(dash * 1.15).toFixed(1)}`}
          strokeDashoffset={(offset + clock * DASH_FLOW).toFixed(2)}
        />
      </svg>
    </AbsoluteFill>
  );
};

type BranchProps = {
  props: TechStackBranchesProps;
  layout: Layout;
  color: string;
  pulse: number | null;
};

export const Branch = ({ props, layout, color, pulse }: BranchProps) => {
  const { branch } = props;
  const from = layout.root.x + layout.root.width;
  const length = Math.max(0, layout.wheelX - from);
  const thickness = branch.width;
  const dot = thickness * 2.6 + 6;
  const eased = pulse === null ? 0 : pulse * pulse * (3 - 2 * pulse);
  const glow = pulse === null ? 0 : Math.sin(Math.PI * pulse) * branch.pulse;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: from,
          top: layout.centerY - thickness / 2,
          width: length,
          height: thickness,
          borderRadius: thickness,
          backgroundImage: `linear-gradient(90deg, ${withAlpha(color, 0.55)} 0%, ${withAlpha(color, 1)} 45%, ${withAlpha(color, 0.9)} 100%)`,
        }}
      />
      {glow > 0.002 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: dot,
            height: dot,
            borderRadius: dot,
            opacity: glow,
            backgroundColor: color,
            boxShadow: `0 0 ${(dot * 1.6).toFixed(1)}px ${(dot * 0.5).toFixed(1)}px ${withAlpha(color, 0.75)}`,
            transform: `translate(${(from + eased * length - dot / 2).toFixed(2)}px, ${(layout.centerY - dot / 2).toFixed(2)}px)`,
          }}
        />
      ) : null}
    </>
  );
};

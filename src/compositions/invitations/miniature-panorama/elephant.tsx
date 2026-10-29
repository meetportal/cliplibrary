import type { ProcessionColors } from './procession';

const LEG_SWING = 9;

const LEGS = [
  { x: -62, lag: Math.PI, far: true },
  { x: 58, lag: 0, far: true },
  { x: -80, lag: 0, far: false },
  { x: 40, lag: Math.PI, far: false },
] as const;

const SCALLOPS = [-72, -48, -24, 0, 24, 48, 72] as const;

const Leg = ({ x, angle, fill }: { x: number; angle: number; fill: string }) => (
  <g transform={`rotate(${angle.toFixed(3)} ${x + 14} -70)`}>
    <path d={`M ${x} -78 L ${x + 28} -78 L ${x + 27} -4 Q ${x + 14} 2 ${x + 1} -4 Z`} fill={fill} />
  </g>
);

export const Elephant = ({
  x,
  phase,
  colors,
  frame,
}: {
  x: number;
  phase: number;
  colors: ProcessionColors;
  frame: number;
}) => {
  const bob = -Math.abs(Math.sin(phase)) * 2.5;
  const trunk = Math.sin(frame / 22) * 4;
  return (
    <g transform={`translate(${x} 0)`}>
      {LEGS.filter((leg) => leg.far).map((leg) => (
        <Leg
          key={leg.x}
          x={leg.x}
          angle={Math.sin(phase + leg.lag) * LEG_SWING}
          fill={colors.elephantFar}
        />
      ))}
      <g transform={`translate(0 ${bob.toFixed(3)})`}>
        <path
          d="M -112 -104 Q -128 -90 -122 -60"
          stroke={colors.elephant}
          strokeWidth={4}
          fill="none"
        />
        <ellipse cx={0} cy={-108} rx={116} ry={64} fill={colors.elephant} />
        <g transform={`rotate(${trunk.toFixed(3)} 132 -112)`}>
          <path
            d="M 128 -132 Q 166 -112 164 -60 Q 162 -26 176 -16 Q 184 -12 180 -4 Q 160 -2 148 -24 Q 136 -52 126 -92 Z"
            fill={colors.elephant}
          />
        </g>
        <circle cx={108} cy={-128} r={46} fill={colors.elephant} />
        <path
          d="M 86 -158 Q 52 -150 54 -110 Q 60 -78 92 -84 Q 102 -120 86 -158 Z"
          fill={colors.elephantFar}
        />
        <path d="M 138 -112 Q 156 -98 166 -104" stroke={colors.kurta} strokeWidth={6} fill="none" />
        <circle cx={128} cy={-138} r={4} fill={colors.elephantFar} />
        <path
          d="M 112 -172 Q 136 -168 146 -146 L 136 -128 Q 126 -152 108 -156 Z"
          fill={colors.blanket}
        />
        <circle cx={136} cy={-146} r={5} fill={colors.trim} />
        <path
          d={`M -84 -168 L 84 -168 L 84 -96 ${SCALLOPS.map((s) => `Q ${s} -76 ${s - 12} -96`)
            .reverse()
            .join(' ')} L -84 -96 Z`}
          fill={colors.blanket}
        />
        <rect x={-84} y={-168} width={168} height={10} fill={colors.trim} />
        {SCALLOPS.map((s) => (
          <circle key={s} cx={s} cy={-84} r={4} fill={colors.trim} />
        ))}
        <rect x={-58} y={-206} width={116} height={38} rx={4} fill={colors.canopy} />
        <rect x={-58} y={-194} width={116} height={6} fill={colors.trim} />
        <circle cx={0} cy={-220} r={10} fill={colors.skin} />
        <path d="M -11 -222 Q -12 -238 1 -238 Q 14 -236 12 -222 Z" fill={colors.turban} />
        {[-50, 46].map((post) => (
          <rect key={post} x={post} y={-262} width={4} height={58} fill={colors.trim} />
        ))}
        <path d="M -72 -258 Q -62 -306 0 -318 Q 62 -306 72 -258 Z" fill={colors.canopy} />
        <rect x={-74} y={-262} width={148} height={8} rx={3} fill={colors.trim} />
        <line x1={0} y1={-318} x2={0} y2={-336} stroke={colors.trim} strokeWidth={3} />
        <circle cx={0} cy={-338} r={5} fill={colors.trim} />
      </g>
      {LEGS.filter((leg) => !leg.far).map((leg) => (
        <Leg
          key={leg.x}
          x={leg.x}
          angle={Math.sin(phase + leg.lag) * LEG_SWING}
          fill={colors.elephant}
        />
      ))}
    </g>
  );
};

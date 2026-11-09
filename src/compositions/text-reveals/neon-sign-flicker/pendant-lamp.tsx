import { mix } from './color';
import { LampLight } from './glow';

export type LampGeometry = {
  x: number;
  shadeTop: number;
  shadeWidth: number;
  coneLength: number;
  coneSpread: number;
};

const CORD_WIDTH = 3;

const Shade = ({
  geometry,
  shell,
  light,
  level,
}: {
  geometry: LampGeometry;
  shell: string;
  light: string;
  level: number;
}) => {
  const width = geometry.shadeWidth;
  const height = width * 0.56;
  const half = width / 2;
  const cap = width * 0.1;
  const rim = height * 0.14;
  const rimLight = mix(shell, '#ffffff', 0.45);
  const body = [
    `M ${half - cap} 0`,
    `L ${half + cap} 0`,
    `C ${half + cap * 1.4} ${height * 0.45} ${width} ${height * 0.55} ${width} ${height}`,
    `L 0 ${height}`,
    `C 0 ${height * 0.55} ${half - cap * 1.4} ${height * 0.45} ${half - cap} 0`,
    'Z',
  ].join(' ');
  return (
    <svg
      aria-hidden="true"
      width={width}
      height={height + rim}
      style={{ position: 'absolute', left: -half, top: geometry.shadeTop, overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="neon-sign-flicker-shade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={shell} />
          <stop offset="0.38" stopColor={rimLight} />
          <stop offset="0.62" stopColor={shell} />
          <stop offset="1" stopColor={shell} />
        </linearGradient>
      </defs>
      <ellipse
        cx={half}
        cy={height}
        rx={half * 0.9}
        ry={rim}
        fill={mix(shell, light, 0.15 + 0.85 * level)}
      />
      <path d={body} fill="url(#neon-sign-flicker-shade)" />
      <rect x={half - cap * 0.7} y={-6} width={cap * 1.4} height={8} rx={2} fill={shell} />
    </svg>
  );
};

export const PendantLamp = ({
  geometry,
  angle,
  shell,
  light,
  level,
  beam,
}: {
  geometry: LampGeometry;
  angle: number;
  shell: string;
  light: string;
  level: number;
  beam: number;
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: geometry.x,
        top: 0,
        width: 0,
        height: 0,
        transformOrigin: '0 0',
        transform: `rotate(${angle.toFixed(4)}deg)`,
      }}
    >
      <LampLight geometry={geometry} light={light} level={level * beam} />
      <div
        style={{
          position: 'absolute',
          left: -CORD_WIDTH / 2,
          top: -20,
          width: CORD_WIDTH,
          height: geometry.shadeTop + 22,
          background: mix(shell, '#ffffff', 0.12),
        }}
      />
      <Shade geometry={geometry} shell={shell} light={light} level={level} />
    </div>
  );
};

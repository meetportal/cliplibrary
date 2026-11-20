import type { BadgeKind } from './layout';

const STROKE = 6.5;
const RAYS = 16;

const Arrow = ({ color }: { color: string }) => (
  <g stroke={color} strokeWidth={STROKE} fill="none" strokeLinecap="butt" strokeLinejoin="miter">
    <path d="M 22 50 L 74 50" />
    <path d="M 54 30 L 76 50 L 54 70" />
  </g>
);

const ArrowDown = ({ color }: { color: string }) => (
  <g stroke={color} strokeWidth={STROKE} fill="none" strokeLinecap="butt" strokeLinejoin="miter">
    <path d="M 70 30 L 32 68" />
    <path d="M 31 40 L 31 69 L 60 69" />
  </g>
);

const Hash = ({ color }: { color: string }) => (
  <g stroke={color} strokeWidth={STROKE} fill="none" strokeLinecap="butt">
    <path d="M 44 26 L 38 74" />
    <path d="M 62 26 L 56 74" />
    <path d="M 27 41 L 74 41" />
    <path d="M 25 59 L 72 59" />
  </g>
);

const Burst = ({ color, turn }: { color: string; turn: number }) => (
  <g stroke={color} strokeWidth={3.4} strokeLinecap="butt" transform={`rotate(${turn} 50 50)`}>
    {Array.from({ length: RAYS }, (_, ray) => {
      const angle = (ray / RAYS) * Math.PI * 2;
      const inner = 7;
      const outer = 31;
      return (
        <line
          key={ray}
          x1={50 + Math.cos(angle) * inner}
          y1={50 + Math.sin(angle) * inner}
          x2={50 + Math.cos(angle) * outer}
          y2={50 + Math.sin(angle) * outer}
        />
      );
    })}
  </g>
);

export const BadgeGlyph = ({
  kind,
  glyph,
  burst,
  turn,
  nudge,
}: {
  kind: BadgeKind;
  glyph: string;
  burst: string;
  turn: number;
  nudge: number;
}) => {
  const shift =
    kind === 'arrow'
      ? `translate(${nudge} 0)`
      : kind === 'arrow-down'
        ? `translate(${-nudge * 0.7} ${nudge * 0.7})`
        : 'translate(0 0)';
  return (
    <svg
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <g transform={shift}>
        {kind === 'arrow' ? <Arrow color={glyph} /> : null}
        {kind === 'arrow-down' ? <ArrowDown color={glyph} /> : null}
        {kind === 'hash' ? <Hash color={glyph} /> : null}
        {kind === 'burst' ? <Burst color={burst} turn={turn} /> : null}
      </g>
    </svg>
  );
};

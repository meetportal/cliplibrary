import type { ArchSaveTheDateProps } from '@/schemas';
import { Chandelier } from './chandelier';
import { BANDS, CENTER_X, COLUMN_X, cuspedOutline, FLOOR_Y, SPRING_Y } from './geometry';
import { shade, tint } from './paint';

const COLUMNS = [CENTER_X - COLUMN_X, CENTER_X + COLUMN_X] as const;
const PASSAGE = `M ${CENTER_X - BANDS[0].half} ${SPRING_Y - 2} L ${CENTER_X + BANDS[0].half} ${SPRING_Y - 2} L ${CENTER_X + BANDS[0].half} ${FLOOR_Y + 40} L ${CENTER_X - BANDS[0].half} ${FLOOR_Y + 40} Z`;
const OUTLINES = BANDS.map((band) => cuspedOutline(band.half, band.apex));
const EDGES = BANDS.map((band) => cuspedOutline(band.half, band.apex, false));
const BAND_TINTS = [0.18, 0.36, 0.52] as const;

const Rosette = ({ x, y, r, arch, jasmine }: RosetteProps) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={tint(arch, 0.22)} stroke={tint(arch, 0.5)} strokeWidth={3} />
    {Array.from({ length: 8 }, (_, index) => {
      const angle = (index / 8) * 360;
      return (
        <ellipse
          key={angle}
          cx={x}
          cy={y - r * 0.45}
          rx={r * 0.17}
          ry={r * 0.36}
          fill={tint(jasmine, 0.2)}
          transform={`rotate(${angle} ${x} ${y})`}
        />
      );
    })}
    <circle cx={x} cy={y} r={r * 0.16} fill={tint(arch, 0.1)} />
  </g>
);

type RosetteProps = { x: number; y: number; r: number; arch: string; jasmine: string };

const ROSETTE_Y = 150;
const ROSETTE_R = 82;
const SIDE_PANELS = [CENTER_X - 840, CENTER_X + 840] as const;

const Column = ({ x, arch }: { x: number; arch: string }) => {
  const light = tint(arch, 0.5);
  const id = 'arch-column';
  return (
    <g>
      {[-1, -0.5, 0, 0.5, 1].map((spread) => (
        <path
          key={spread}
          d={`M ${x} ${SPRING_Y - 10} Q ${x + spread * 40} ${SPRING_Y - 70} ${x + spread * 64} ${SPRING_Y - 110 + Math.abs(spread) * 40} Q ${x + spread * 20} ${SPRING_Y - 60} ${x} ${SPRING_Y - 10} Z`}
          fill={spread === 0 ? light : tint(arch, 0.3)}
          stroke={shade(arch, 0.05)}
          strokeWidth={2}
        />
      ))}
      <rect x={x - 88} y={SPRING_Y - 10} width={176} height={26} fill={tint(arch, 0.28)} />
      <path
        d={`M ${x - 76} ${SPRING_Y + 16} C ${x - 86} ${SPRING_Y + 80} ${x - 60} ${SPRING_Y + 116} ${x - 52} ${SPRING_Y + 124} L ${x + 52} ${SPRING_Y + 124} C ${x + 60} ${SPRING_Y + 116} ${x + 86} ${SPRING_Y + 80} ${x + 76} ${SPRING_Y + 16} Z`}
        fill={`url(#${id})`}
      />
      {[-44, -16, 16, 44].map((dx) => (
        <path
          key={dx}
          d={`M ${x + dx} ${SPRING_Y + 26} Q ${x + dx * 1.3} ${SPRING_Y + 70} ${x + dx * 0.9} ${SPRING_Y + 116}`}
          stroke={shade(arch, 0.1)}
          strokeWidth={2.5}
          fill="none"
        />
      ))}
      <rect x={x - 62} y={SPRING_Y + 124} width={124} height={18} fill={tint(arch, 0.25)} />
      <rect
        x={x - 52}
        y={SPRING_Y + 142}
        width={104}
        height={FLOOR_Y - SPRING_Y - 340}
        fill={`url(#${id})`}
      />
      <rect x={x - 62} y={FLOOR_Y - 198} width={124} height={16} fill={tint(arch, 0.25)} />
      <rect x={x - 70} y={FLOOR_Y - 182} width={140} height={182} fill={`url(#${id})`} />
      <rect x={x - 82} y={FLOOR_Y - 60} width={164} height={60} fill={shade(arch, 0.04)} />
      <circle
        cx={x}
        cy={FLOOR_Y - 120}
        r={22}
        fill="none"
        stroke={shade(arch, 0.1)}
        strokeWidth={2.5}
      />
    </g>
  );
};

const GARLAND_XS = [215, 280, 345, 410, 670, 735, 800, 865] as const;

const Garland = ({ x, length, jasmine, leaf, sway }: GarlandProps) => {
  const beads = Math.floor(length / 22);
  return (
    <g transform={`rotate(${sway} ${x} -40)`}>
      {Array.from({ length: beads }, (_, index) => (
        <circle key={`${x}:${index * 22}`} cx={x} cy={-40 + index * 22} r={7.5} fill={jasmine} />
      ))}
      <path
        d={`M ${x} ${length - 40} C ${x + 22} ${length - 10} ${x + 16} ${length + 30} ${x} ${length + 40} C ${x - 16} ${length + 30} ${x - 22} ${length - 10} ${x} ${length - 40} Z`}
        fill={tint(jasmine, 0.3)}
        stroke={shade(jasmine, 0.12)}
        strokeWidth={1.5}
      />
      <path
        d={`M ${x - 12} ${length - 30} Q ${x} ${length - 50} ${x + 12} ${length - 30} Q ${x} ${length - 18} ${x - 12} ${length - 30} Z`}
        fill={leaf}
      />
    </g>
  );
};

type GarlandProps = { x: number; length: number; jasmine: string; leaf: string; sway: number };

export const ArchDefs = ({ arch }: { arch: string }) => (
  <defs>
    <linearGradient id="arch-column" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={shade(arch, 0.08)} />
      <stop offset="0.38" stopColor={tint(arch, 0.5)} />
      <stop offset="1" stopColor={shade(arch, 0.12)} />
    </linearGradient>
    <pattern id="arch-motif" width={120} height={120} patternUnits="userSpaceOnUse">
      {[0, 60].map((offset) => (
        <g key={offset} transform={`translate(${30 + offset} ${30 + offset})`}>
          {[0, 90, 180, 270].map((angle) => (
            <ellipse
              key={angle}
              cx={0}
              cy={-9}
              rx={5}
              ry={9}
              fill={tint(arch, 0.16)}
              transform={`rotate(${angle})`}
            />
          ))}
          <circle r={3.5} fill={shade(arch, 0.12)} />
        </g>
      ))}
    </pattern>
    <mask
      id="arch-wall"
      maskUnits="userSpaceOnUse"
      x={-3000}
      y={-3000}
      width={7080}
      height={3040 + FLOOR_Y}
    >
      <rect x={-3000} y={-3000} width={7080} height={3040 + FLOOR_Y} fill="#ffffff" />
      <path d={`${OUTLINES[0]} ${PASSAGE}`} fill="#000000" />
    </mask>
  </defs>
);

const Bay = ({ props, frame }: { props: ArchSaveTheDateProps; frame: number }) => {
  const { colors, arcade } = props;
  return (
    <g>
      {BAND_TINTS.map((amount, index) => (
        <path
          key={amount}
          d={`${OUTLINES[index]} ${OUTLINES[index + 1]}`}
          fill={tint(colors.arch, amount)}
          fillRule="evenodd"
        />
      ))}
      {EDGES.slice(0, -1).map((edge) => (
        <path key={edge} d={edge} fill="none" stroke={shade(colors.arch, 0.08)} strokeWidth={2} />
      ))}
      <path
        d={EDGES[BANDS.length - 1]}
        fill="none"
        stroke={tint(colors.arch, 0.75)}
        strokeWidth={6}
      />
      {arcade.garlands
        ? GARLAND_XS.map((x, index) => (
            <Garland
              key={x}
              x={x}
              length={150 + ((index * 67) % 140)}
              jasmine={colors.jasmine}
              leaf={colors.foliage}
              sway={Math.sin(frame / 34 + index * 1.3) * arcade.sway}
            />
          ))
        : null}
    </g>
  );
};

export const Arch = ({ props, frame }: { props: ArchSaveTheDateProps; frame: number }) => {
  const { colors, arcade } = props;
  return (
    <g>
      <rect
        x={-3000}
        y={-3000}
        width={7080}
        height={3040 + FLOOR_Y}
        fill={shade(colors.arch, 0.06)}
        mask="url(#arch-wall)"
      />
      <rect
        x={-3000}
        y={-3000}
        width={7080}
        height={3040 + FLOOR_Y}
        fill="url(#arch-motif)"
        mask="url(#arch-wall)"
      />
      {SIDE_PANELS.map((x) => (
        <g key={x}>
          <rect
            x={x - 150}
            y={360}
            width={300}
            height={1380}
            rx={150}
            fill="none"
            stroke={tint(colors.arch, 0.3)}
            strokeWidth={6}
          />
          <rect
            x={x - 120}
            y={390}
            width={240}
            height={1320}
            rx={120}
            fill={shade(colors.arch, 0.1)}
          />
          {arcade.rosettes ? (
            <Rosette x={x} y={640} r={ROSETTE_R} arch={colors.arch} jasmine={colors.jasmine} />
          ) : null}
        </g>
      ))}
      <Bay props={props} frame={frame} />
      {arcade.rosettes
        ? COLUMNS.map((x) => (
            <Rosette
              key={x}
              x={x}
              y={ROSETTE_Y}
              r={ROSETTE_R}
              arch={colors.arch}
              jasmine={colors.jasmine}
            />
          ))
        : null}
      {COLUMNS.map((x) => (
        <Column key={x} x={x} arch={colors.arch} />
      ))}
      {arcade.chandelier ? (
        <g transform={`rotate(${Math.sin(frame / 52) * arcade.sway * 0.22} ${CENTER_X} -400)`}>
          <Chandelier crystal={colors.crystal} gold={colors.gold} />
        </g>
      ) : null}
    </g>
  );
};

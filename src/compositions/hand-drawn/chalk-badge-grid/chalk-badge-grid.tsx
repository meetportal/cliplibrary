import { type ComponentType, useId } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ChalkBadgeGridProps } from '@/schemas';
import { clamp01 } from '../../kit/motion';
import { FrameBadge, LinesBadge, SunBadge } from './badges-caps';
import { ArrowBadge, BurstBadge, RibbonBadge, TapeBadge } from './badges-fill';
import { ArcBadge, BubbleBadge, DashesBadge, SwooshBadge } from './badges-script';
import { ChalkGrain, GridBoard } from './board';
import { inkOn, liftOn, mixOklab } from './color';
import { makeMeasure, useGridFonts } from './fonts';
import { LogoImage, LogoPlate, logoBox } from './logo-badge';
import type { BadgeKit, GridPalette } from './parts';
import { badgeState, type GridTiming } from './timeline';
import { useGridLogo } from './use-logo';

const WORD_BADGES: {
  cell: [number, number];
  draw: ComponentType<{ kit: BadgeKit }>;
  caps?: boolean;
}[] = [
  { cell: [0, 0], draw: SwooshBadge },
  { cell: [1, 0], draw: LinesBadge },
  { cell: [2, 0], draw: TapeBadge, caps: true },
  { cell: [3, 0], draw: FrameBadge, caps: true },
  { cell: [0, 1], draw: ArcBadge },
  { cell: [2, 1], draw: BurstBadge, caps: true },
  { cell: [3, 1], draw: SunBadge },
  { cell: [0, 2], draw: BubbleBadge },
  { cell: [1, 2], draw: ArrowBadge, caps: true },
  { cell: [2, 2], draw: DashesBadge },
];

const COLUMN_STEP = 460;
const ROW_STEP = 318;

const palette = (colors: ChalkBadgeGridProps['colors']): GridPalette => ({
  chalk: colors.chalk,
  primary: colors.primary,
  primaryInk: inkOn(colors.ink, colors.primary, colors.chalk),
  warm: liftOn(colors.warm, colors.board, 3),
  pink: liftOn(colors.pink, colors.board, 2.6),
  secondary: colors.secondary,
  secondaryInk: inkOn(colors.ink, colors.secondary, colors.chalk),
  accent: colors.accent,
  accentLine: liftOn(colors.accent, colors.board, 3),
  accentInk: inkOn(colors.ink, colors.accent, colors.chalk),
  accentShade: mixOklab(colors.accent, colors.boardEdge, 0.38),
  highlight: liftOn(colors.highlight, colors.board, 3),
  plate: colors.plate,
});

export const ChalkBadgeGrid = (props: ChalkBadgeGridProps) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const id = useId().replace(/:/g, '');
  const ready = useGridFonts();
  const measure = makeMeasure(ready);
  const logo = useGridLogo(props.logo);
  const colors = palette(props.colors);
  const timing: GridTiming = {
    drawFrames: Math.round(props.motion.drawSeconds * fps),
    stagger: props.motion.stagger,
    eraseAtEnd: props.motion.eraseAtEnd,
    total: durationInFrames,
  };
  const scale = props.layout.scale;
  const center = (column: number, row: number) => ({
    x: width / 2 + (column - 1.5) * COLUMN_STEP * props.layout.spreadX,
    y: height / 2 + (row - 1) * ROW_STEP * props.layout.spreadY,
  });
  const kitFor = (slot: number, text: string): BadgeKit => ({
    id: `${id}-${slot}`,
    frame,
    state: badgeState(frame, slot, timing),
    text,
    palette: colors,
    measure,
    ornaments: props.ornaments.show,
    twinkle: props.ornaments.twinkle,
  });
  const cells: {
    column: number;
    row: number;
    slot: number;
    draw: ComponentType<{ kit: BadgeKit }>;
    text: string;
  }[] = [
    ...WORD_BADGES.map((badge, at) => ({
      column: badge.cell[0],
      row: badge.cell[1],
      slot: at + 2,
      draw: badge.draw,
      text: badge.caps
        ? (props.words[at] ?? '').trim().toLocaleUpperCase()
        : (props.words[at] ?? '').trim(),
    })),
    { column: 1, row: 1, slot: 1, draw: RibbonBadge, text: props.companyName.trim() },
  ];
  const logoKit = kitFor(0, '');
  const box = logoBox(logo, props.logoBadge.height);
  const logoAt = center(3, 2);
  const drift = (2 * Math.PI * frame) / durationInFrames;
  const light = {
    x: width * 0.5 + Math.cos(drift) * props.board.lightDrift,
    y: height * 0.45 + Math.sin(drift) * props.board.lightDrift,
  };
  return (
    <AbsoluteFill
      style={{ backgroundColor: props.showBackground ? props.colors.boardEdge : 'transparent' }}
    >
      {props.showBackground ? (
        <GridBoard
          width={width}
          height={height}
          board={props.colors.board}
          edge={props.colors.boardEdge}
          grid={props.colors.grid}
          gridSize={props.board.gridSize}
          gridOpacity={props.board.gridOpacity}
          smudge={props.board.smudge}
          light={light}
        />
      ) : null}
      <svg
        aria-hidden="true"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <ChalkGrain id={`${id}-chalk`} grain={props.board.grain} />
        </defs>
        {cells
          .filter((cell) => cell.text !== '')
          .map((cell) => {
            const at = center(cell.column, cell.row);
            const Draw = cell.draw;
            return (
              <g key={cell.slot} transform={`translate(${at.x} ${at.y}) scale(${scale})`}>
                <g filter={`url(#${id}-chalk)`}>
                  <rect x={-260} y={-150} width={520} height={300} fill="none" />
                  <Draw kit={kitFor(cell.slot, cell.text)} />
                </g>
              </g>
            );
          })}
        <g transform={`translate(${logoAt.x} ${logoAt.y}) scale(${scale})`}>
          <g filter={`url(#${id}-chalk)`}>
            <rect x={-200} y={-150} width={400} height={300} fill="none" />
            <LogoPlate
              kit={logoKit}
              box={box}
              showPlate={props.logoBadge.showPlate}
              hasLogo={logo !== null}
            />
          </g>
        </g>
      </svg>
      <LogoImage
        logo={logo}
        box={box}
        x={logoAt.x}
        y={logoAt.y}
        scale={scale}
        reveal={clamp01((logoKit.state.pop - 0.2) / 0.6)}
      />
    </AbsoluteFill>
  );
};

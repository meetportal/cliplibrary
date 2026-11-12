import { useId, useMemo } from 'react';
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ChalkBadgesReelProps } from '@/schemas';
import { BADGES, type BadgeKit, type ReelPalette } from './badges';
import { ReelBoard } from './board';
import { GrainFilter } from './chalk';
import { inkOn, liftOn, mixOklab } from './color';
import { makeMeasure, useReelFonts } from './fonts';
import {
  Caption,
  CENTER_X,
  EndCardText,
  LOGO_Y,
  LogoPlate,
  logoBox,
  logoReveal,
  Opener,
} from './sections';
import { GRID, gridStroke, isShown, SPOTLIGHT, spotlightStroke } from './timeline';
import { useReelLogo } from './use-logo';

const GRID_COLUMNS = [CENTER_X - 580, CENTER_X, CENTER_X + 580];
const GRID_ROWS = [420, 760];
const SPOTLIGHT_Y = 560;

const paletteOf = (colors: ChalkBadgesReelProps['colors']): ReelPalette => ({
  chalk: liftOn(colors.chalk, colors.board, 0.35),
  primary: colors.primary,
  primaryInk: inkOn(colors.primary, colors.ink, colors.chalk),
  primaryLine: liftOn(colors.primary, colors.board),
  secondary: colors.secondary,
  secondaryInk: inkOn(colors.secondary, colors.ink, colors.chalk),
  ribbon: colors.ribbon,
  ribbonInk: inkOn(colors.ribbon, colors.ink, colors.chalk),
  ribbonShade: mixOklab(colors.ribbon, colors.boardEdge, 0.35),
  accent: liftOn(colors.accent, colors.board),
  plate: colors.plate,
  shadow: colors.boardEdge,
});

export const ChalkBadgesReel = (props: ChalkBadgesReelProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const id = useId().replace(/:/g, '');
  const ready = useReelFonts();
  const measure = useMemo(() => makeMeasure(ready), [ready]);
  const logo = useReelLogo(props.logo);
  const palette = paletteOf(props.colors);
  const { motion, layout } = props;
  const kit = {
    prefix: id,
    frame,
    palette,
    measure,
    ornaments: motion.ornaments,
    twinkle: motion.twinkle,
  };
  const badgeKit = (index: number, stroke: BadgeKit['stroke'], key: string): BadgeKit => ({
    ...kit,
    id: `${id}-${key}`,
    text: props.words[index] ?? '',
    stroke,
  });
  const turn = (2 * Math.PI * frame) / Math.max(1, durationInFrames);
  const drift = props.board.lightDrift;
  const light = { x: width / 2 + (drift / 2) * Math.sin(turn), y: height * 0.44 };
  const box = logoBox(logo, layout.logoHeight);
  const reveal = logoReveal(frame, motion.eraseAtEnd);
  const spotlights = [props.spotlight.first, props.spotlight.second, props.spotlight.third];
  const gridOn = frame >= GRID.start - 2 && frame <= GRID.eraseStart + 40;
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {props.showBackground ? (
        <ReelBoard
          width={width}
          height={height}
          board={props.colors.board}
          edge={props.colors.boardEdge}
          grid={props.colors.grid}
          gridSize={props.board.gridSize}
          gridOpacity={props.board.gridOpacity}
          smudge={props.board.smudge}
          light={light}
          dustShift={drift * 1.6 * Math.sin(turn)}
          shadeShift={-drift * 1.1 * Math.cos(turn)}
        />
      ) : null}
      <svg
        aria-hidden="true"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
      >
        <defs>
          <GrainFilter id={`${id}-grain`} grain={props.board.grain} />
        </defs>
        {layout.showPlate && box !== null ? (
          <LogoPlate box={box} color={palette.plate} frame={frame} eraseAtEnd={motion.eraseAtEnd} />
        ) : null}
        <g filter={props.board.grain > 0 ? `url(#${id}-grain)` : undefined}>
          {frame < 90 ? (
            <Opener kit={kit} left={props.opener.left} right={props.opener.right} />
          ) : null}
          <Caption kit={kit} text={props.companyName} />
          {gridOn
            ? BADGES.map((Badge, index) => {
                const stroke = gridStroke(frame, index);
                const x = GRID_COLUMNS[index % 3] ?? CENTER_X;
                const y = GRID_ROWS[Math.floor(index / 3)] ?? SPOTLIGHT_Y;
                return isShown(stroke) ? (
                  <g
                    key={x * 10 + y}
                    transform={`translate(${x} ${y}) scale(${layout.badgeScale})`}
                  >
                    {Badge(badgeKit(index, stroke, `g${index}`))}
                  </g>
                ) : null;
              })
            : null}
          {spotlights.map((choice, slot) => {
            const stroke = spotlightStroke(frame, slot);
            const index = Math.min(BADGES.length, Math.max(1, Math.round(choice))) - 1;
            const Badge = BADGES[index];
            return Badge !== undefined && isShown(stroke) ? (
              <g
                key={`s${slot * 10 + index}`}
                transform={`translate(${CENTER_X} ${SPOTLIGHT_Y}) scale(${layout.spotlightScale})`}
              >
                {Badge(badgeKit(index, stroke, `s${slot}`))}
              </g>
            ) : null;
          })}
          {frame >= SPOTLIGHT.start + SPOTLIGHT.slot * 2 ? (
            <EndCardText
              kit={kit}
              endCard={props.endCard}
              scale={layout.headlineScale}
              eraseAtEnd={motion.eraseAtEnd}
            />
          ) : null}
        </g>
      </svg>
      {logo !== null && box !== null && reveal.opacity > 0.001 ? (
        <Img
          src={logo.src}
          style={{
            position: 'absolute',
            left: CENTER_X - box.width / 2,
            top: LOGO_Y - box.height / 2,
            width: box.width,
            height: box.height,
            objectFit: 'contain',
            opacity: reveal.opacity,
            transform: `scale(${reveal.scale.toFixed(4)})`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

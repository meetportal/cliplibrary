import { useMemo } from 'react';
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ChalkBadgeProps } from '@/schemas';
import { Badge } from './badge';
import { Board } from './board';
import { Caption } from './caption';
import { legibleOn, mixLab } from './color';
import { canvasMeasurer, SCRIPT_FACES, useFontsReady } from './fonts';
import { buildLayout } from './layout';
import { badgeState, LOCKUP_DROP } from './timeline';
import { useLogo } from './use-logo';
import { useWordImage } from './word-image';

const PUSH_REACH = 700;
const MIN_REACH = 260;

export const ChalkBadge = (props: ChalkBadgeProps) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const ready = useFontsReady(props.word.font);
  const logo = useLogo(props.logo);
  const layout = useMemo(
    () => buildLayout(props, canvasMeasurer(ready), logo, { x: width, y: height }),
    [props, ready, logo, width, height],
  );
  const word = useWordImage(
    ready,
    props.companyName,
    SCRIPT_FACES[props.word.font],
    layout.size,
    props.colors.chalk,
    layout.left,
    layout.baseline,
  );
  const state = badgeState(
    frame,
    durationInFrames,
    fps,
    props.motion.writeSeconds,
    props.motion.eraseAtEnd,
  );
  const sparkle = legibleOn(
    props.colors.primary,
    mixLab(props.colors.board, props.colors.boardEdge, 0.3),
    3,
  );
  const turn = (2 * Math.PI * frame) / durationInFrames;
  const light = {
    x: width / 2 + props.board.lightDrift * Math.sin(turn),
    y: height * 0.46 + props.board.lightDrift * (Math.cos(turn) - 1),
  };
  const focus = {
    x: (layout.left + layout.right) / 2 + 0.3 * layout.size,
    y: layout.baseline - 0.3 * layout.size,
  };
  const reach = Math.max(
    MIN_REACH,
    focus.x - (layout.left - 0.5 * layout.size),
    layout.right + layout.size - focus.x,
  );
  const scale = 1 + ((props.motion.push * PUSH_REACH) / reach) * state.push;
  const lockupShift = LOCKUP_DROP * (state.lockupExit - state.lockupSettle);
  const lockupScale = (1 - state.lockupSettle) * (1 - state.lockupExit);
  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      {props.showBackground ? (
        <Board
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
      <Caption
        text={props.tagline}
        size={layout.caption.size}
        top={layout.caption.y}
        tracking={props.caption.tracking}
        color={props.colors.chalk}
        typed={state.caption}
        erased={state.captionErase}
      />
      <Badge
        layout={layout}
        state={state}
        frame={frame}
        word={word}
        chalk={props.colors.chalk}
        sparkle={sparkle}
        showSwoosh={props.swoosh.show}
        showSparkles={props.sparkles.show}
        thickness={props.swoosh.thickness}
        twinkle={props.sparkles.twinkle}
        grain={props.board.grain}
        dust={props.board.dust}
        width={width}
        height={height}
        focus={focus}
        scale={scale}
      />
      {layout.plate !== null && layout.logo !== null && logo !== null && lockupScale > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: layout.plate.x,
            top: layout.plate.y,
            transform: `translate(0px, ${lockupShift.toFixed(3)}px) scale(${lockupScale.toFixed(6)})`,
            width: layout.plate.w,
            height: layout.plate.h,
            borderRadius: props.lockup.showPlate ? Math.min(28, layout.plate.h * 0.22) : 0,
            backgroundColor: props.lockup.showPlate ? props.colors.plate : 'transparent',
            boxShadow: props.lockup.showPlate
              ? `0 10px 28px rgba(0, 0, 0, ${(0.28 * (1 - state.lockupExit)).toFixed(3)})`
              : 'none',
          }}
        >
          <Img
            src={logo.src}
            style={{
              position: 'absolute',
              left: layout.logo.x - layout.plate.x,
              top: layout.logo.y - layout.plate.y,
              width: layout.logo.w,
              height: layout.logo.h,
              objectFit: 'contain',
            }}
          />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

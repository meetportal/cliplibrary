import { useMemo } from 'react';
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ChalkBadgeProps } from '@/schemas';
import { Badge } from './badge';
import { Board } from './board';
import { Caption } from './caption';
import { legibleOn, mixLab } from './color';
import { canvasMeasurer, SCRIPT_FACES, useFontsReady } from './fonts';
import { buildLayout } from './layout';
import { badgeState } from './timeline';
import { useLogo } from './use-logo';

export const ChalkBadge = (props: ChalkBadgeProps) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const ready = useFontsReady(props.word.font);
  const logo = useLogo(props.logo);
  const layout = useMemo(
    () => buildLayout(props, canvasMeasurer(ready), logo, { x: width, y: height }),
    [props, ready, logo, width, height],
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
  const lockupOpacity = state.lockup * (1 - state.erase);
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
        text={props.companyName}
        face={SCRIPT_FACES[props.word.font]}
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
      />
      {layout.plate !== null && layout.logo !== null && logo !== null && lockupOpacity > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: layout.plate.x,
            top: layout.plate.y + state.lockupRise,
            width: layout.plate.w,
            height: layout.plate.h,
            opacity: lockupOpacity,
            borderRadius: props.lockup.showPlate ? Math.min(28, layout.plate.h * 0.22) : 0,
            backgroundColor: props.lockup.showPlate ? props.colors.plate : 'transparent',
            boxShadow: props.lockup.showPlate ? '0 10px 28px rgba(0, 0, 0, 0.28)' : 'none',
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

import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ChalkTitleProps } from '@/schemas';
import { Board } from './board';
import { legibleOn, mixLab } from './color';
import { AMPERSAND_FACES, BYLINE_FACE, canvasMeasurer, SCRIPT_FACES, useFontsReady } from './fonts';
import { buildLayout } from './layout';
import {
  AMP_SOFT,
  Lettering,
  type LetteringState,
  softOf,
  WORD_SOFT,
  writeEdge,
} from './lettering';
import { buildTimeline, POP_EASE, progress } from './timeline';

export const ChalkTitle = (props: ChalkTitleProps) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const ready = useFontsReady(props.title.font, props.ampersand.font);
  const layout = useMemo(
    () => buildLayout(props, canvasMeasurer(ready), { x: width, y: height }),
    [props, ready, width, height],
  );
  const timeline = useMemo(
    () => buildTimeline(durationInFrames, fps, props.motion.writeSeconds, props.motion.eraseAtEnd),
    [durationInFrames, fps, props.motion.writeSeconds, props.motion.eraseAtEnd],
  );
  const erase = timeline.erase === null ? 0 : progress(frame, timeline.erase);
  const built = progress(frame, { from: timeline.byline.to, to: timeline.byline.to + 20 });
  const smearIn = timeline.erase === null ? 0 : 1 - progress(frame, timeline.smearFade);
  const state: LetteringState = {
    start: progress(frame, timeline.start),
    amp: progress(frame, timeline.amp),
    end: progress(frame, timeline.end),
    byline: progress(frame, timeline.byline),
    sparkles: timeline.sparkles.map((window) => progress(frame, window, POP_EASE)),
    twinkle: props.sparkles.twinkle * progress(frame, timeline.twinkle),
    erase,
    smear: props.motion.smear * (erase > 0 ? 1 : smearIn),
    tipDust: props.board.dust,
    airDust: props.board.dust * built,
  };
  const pieces = [
    { piece: layout.start, window: timeline.start, share: WORD_SOFT },
    { piece: layout.amp, window: timeline.amp, share: AMP_SOFT },
    { piece: layout.end, window: timeline.end, share: WORD_SOFT },
  ];
  const strokes = pieces.map(({ piece, window, share }) => ({
    box: piece.box,
    window,
    edgeAt: (at: number) =>
      writeEdge(piece, softOf(piece, share), progress(at, window)) - 0.5 * softOf(piece, share),
  }));
  const sparkle = legibleOn(
    props.colors.primary,
    mixLab(props.colors.board, props.colors.boardEdge, 0.3),
    3,
  );
  const turn = (2 * Math.PI * frame) / durationInFrames;
  const light = {
    x: width / 2 + props.board.lightDrift * Math.sin(turn),
    y: height * 0.46 + props.board.lightDrift * 0.6 * (Math.cos(turn) - 1),
  };
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
      <Lettering
        layout={layout}
        state={state}
        strokes={strokes}
        frame={frame}
        duration={durationInFrames}
        script={SCRIPT_FACES[props.title.font]}
        ampFace={AMPERSAND_FACES[props.ampersand.font]}
        bylineFace={BYLINE_FACE}
        tracking={props.byline.tracking}
        chalk={props.colors.chalk}
        sparkle={sparkle}
        dropLine={props.ampersand.dropLine}
        grain={props.board.grain}
        width={width}
        height={height}
      />
    </AbsoluteFill>
  );
};

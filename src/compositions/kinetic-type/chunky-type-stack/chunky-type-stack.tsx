import { useId, useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ChunkyTypeStackProps } from '@/schemas';
import { Board } from '../../kit/chalk-board';
import { accentColor } from './accent';
import { Ampersand } from './ampersand';
import { Brand } from './brand';
import { makeMeasurer, useStackFont } from './fonts';
import { Grain } from './grain';
import { buildLayout } from './layout';
import { Glyphs, type LetterState, Underline } from './letters';
import { buildTimeline, EASE_SINE, progress } from './timeline';

export const ChunkyTypeStack = (props: ChunkyTypeStackProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const id = useId().replace(/:/g, '');
  const ready = useStackFont();
  const layout = useMemo(
    () => buildLayout(props, makeMeasurer(ready), { width, height }),
    [props, ready, width, height],
  );
  const timeline = useMemo(
    () =>
      buildTimeline(
        layout.lines.map((line) => line.letters.length),
        layout.name.letters.length,
        durationInFrames,
        props.motion.typeFrames,
        props.motion.popFrames,
        { stack: layout.underline?.width ?? 0, name: layout.nameUnderline?.width ?? 0 },
      ),
    [layout, durationInFrames, props.motion.typeFrames, props.motion.popFrames],
  );
  const { colors } = props;
  const accent = accentColor(colors.primary, colors.background, colors.text);
  const nameStates: LetterState[] = timeline.nameIn.map((window, at) => {
    const leaving = progress(frame, timeline.nameOut[at] ?? window);
    return leaving < 1 ? { pop: 1, shrink: leaving } : { pop: progress(frame, window), shrink: 0 };
  });
  const barLeaving = progress(frame, timeline.nameUnderlineOut);
  const nameBar =
    barLeaving < 1
      ? { grow: 1, retract: barLeaving }
      : { grow: progress(frame, timeline.nameUnderlineIn), retract: 0 };
  const turn = 2 * Math.PI * progress(frame, { from: 0, to: timeline.settled }, EASE_SINE);
  const light = {
    x: width / 2 + props.motion.lightDrift * Math.sin(turn),
    y: height * 0.45 + props.motion.lightDrift * 0.6 * (Math.cos(turn) - 1),
  };
  const shadowSize = layout.lines[1]?.size ?? layout.name.size;
  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      {props.showBackground ? (
        <Board
          width={width}
          height={height}
          board={colors.background}
          edge={colors.backgroundEdge}
          grid={colors.grid}
          gridSize={96}
          gridOpacity={0.5}
          smudge={0.4}
          light={light}
        />
      ) : null}
      {props.showBackground ? (
        <Grain amount={props.motion.grain} width={width} height={height} />
      ) : null}
      <svg
        aria-hidden="true"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <filter id={`${id}-shadow`} x="-10%" y="-20%" width="120%" height="150%">
            <feDropShadow
              dx="0"
              dy={(shadowSize * 0.045).toFixed(2)}
              stdDeviation={(shadowSize * 0.035).toFixed(2)}
              floodColor={colors.shadow}
              floodOpacity="0.55"
            />
          </filter>
        </defs>
        <g filter={`url(#${id}-shadow)`}>
          {layout.lines.map((line, at) => {
            const typed = timeline.typeIn[at] ?? [];
            const gone = timeline.exit[at] ?? [];
            return (
              <Glyphs
                key={`line-${at}`}
                letters={line.letters}
                cap={layout.cap}
                fill={colors.text}
                states={typed.map((window, index) => ({
                  pop: progress(frame, window),
                  shrink: gone[index] === undefined ? 0 : progress(frame, gone[index]),
                }))}
              />
            );
          })}
          {layout.underline === null ? null : (
            <Underline
              bar={layout.underline}
              grow={progress(frame, timeline.underlineIn)}
              retract={progress(frame, timeline.underlineOut)}
              fill={accent}
            />
          )}
          {props.ampersand.show ? (
            <Ampersand
              x={layout.ampersand.x}
              centerY={layout.ampersand.baseline - (layout.cap * layout.ampersand.size) / 2}
              baseline={layout.ampersand.baseline}
              size={layout.ampersand.size}
              zoom={progress(frame, timeline.amp)}
              fill={accent}
            />
          ) : null}
          <Glyphs
            letters={layout.name.letters}
            states={nameStates}
            cap={layout.cap}
            fill={colors.text}
          />
          {layout.nameUnderline === null ? null : (
            <Underline
              bar={layout.nameUnderline}
              grow={nameBar.grow}
              retract={nameBar.retract}
              fill={accent}
            />
          )}
        </g>
      </svg>
      <Brand
        logo={props.logo}
        centerX={width / 2}
        centerY={props.brand.y}
        maxHeight={props.brand.logoHeight}
        maxWidth={props.brand.logoWidth}
        plate={props.brand.plate}
        surface={colors.surface}
        shadow={colors.shadow}
      />
    </AbsoluteFill>
  );
};

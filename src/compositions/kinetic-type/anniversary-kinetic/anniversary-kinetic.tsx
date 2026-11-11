import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { AnniversaryKineticProps } from '@/schemas';
import { ramp } from '../../kit/motion';
import { Backdrop } from './backdrop';
import { BeatText } from './beat-text';
import { inkOn, mix, readable } from './color';
import { EndCard, type EndInks } from './end-card';
import {
  BODY_FACE,
  type Face,
  MONO_FACE,
  NAME_FACE,
  VALUE_FACES,
  WIDE_FACE,
  WORD_FACES,
} from './fonts';
import { useMeasure } from './measure';
import type { Palette, Scene } from './scene';
import { Grain, Stars } from './textures';
import { type Beat, beatAt, buildTimeline, type Stage, stageAt, type Timeline } from './timeline';
import { useLogo } from './use-logo';

const stageColor = (props: AnniversaryKineticProps, stage: Stage): string => {
  const { colors } = props;
  return {
    dark: colors.background,
    deep: colors.deep,
    plum: colors.plum,
    surface: colors.surface,
  }[stage];
};

const stageOf = (timeline: Timeline, frame: number): Stage => {
  const index = beatAt(timeline, frame);
  const beat = timeline.beats[index];
  return beat === undefined ? 'surface' : stageAt(beat, frame - beat.start);
};

const paletteOn = (props: AnniversaryKineticProps, stage: Stage): Palette => {
  const { colors } = props;
  const fill = stageColor(props, stage);
  const toward = inkOn(fill, '#000000', '#ffffff');
  const surfaceInk = readable(
    colors.background,
    colors.surface,
    inkOn(colors.surface, '#000000', '#ffffff'),
    4.5,
  );
  const ink = stage === 'surface' ? surfaceInk : readable(colors.text, fill, toward, 4.5);
  return {
    ink,
    surfaceInk,
    accent: readable(colors.primary, fill, ink, 3),
    secondary: readable(colors.secondary, fill, ink, 3),
    highlight: readable(colors.highlight, fill, ink, 3),
  };
};

const faceFor = (props: AnniversaryKineticProps, beat: Beat): Face => {
  if (beat.font === 'wide') {
    return WIDE_FACE;
  }
  return beat.font === 'value' ? VALUE_FACES[props.type.valueFont] : WORD_FACES[props.type.font];
};

const backgroundAt = (props: AnniversaryKineticProps, beat: Beat | undefined, frame: number) => {
  if (beat?.kind === 'rise' && beat.stage === 'plum') {
    return mix(props.colors.plum, props.colors.background, ramp(frame - beat.start, 3, 10));
  }
  return stageColor(props, beat === undefined ? 'surface' : stageAt(beat, frame - beat.start));
};

export const AnniversaryKinetic = (props: AnniversaryKineticProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const measure = useMeasure([
    WORD_FACES[props.type.font],
    VALUE_FACES[props.type.valueFont],
    WIDE_FACE,
    NAME_FACE,
    MONO_FACE,
    BODY_FACE,
  ]);
  const logo = useLogo(props.logo);
  const timeline = buildTimeline(props, durationInFrames);
  const index = beatAt(timeline, frame);
  const beat = timeline.beats[index];
  const stage = stageOf(timeline, frame);
  const palette = paletteOn(props, stage);
  const surface = paletteOn(props, 'surface');
  const inks: EndInks = {
    surface: props.colors.surface,
    ink: surface.ink,
    accent: surface.accent,
    name: readable(props.colors.name, props.colors.surface, surface.ink, 4.5),
    muted: readable(props.colors.muted, props.colors.surface, surface.ink, 4.5),
  };
  const scene: Scene | null =
    beat === undefined
      ? null
      : {
          props,
          beat,
          local: frame - beat.start,
          length: beat.end - beat.start,
          width,
          height,
          face: faceFor(props, beat),
          size: beat.font === 'value' ? props.type.valueSize : props.type.size,
          measure,
          palette,
          onSurface: stage === 'surface',
        };
  return (
    <AbsoluteFill>
      {props.showBackground ? (
        <AbsoluteFill style={{ backgroundColor: backgroundAt(props, beat, frame) }}>
          <Stars
            count={props.effects.stars}
            color={palette.ink}
            frame={frame}
            width={width}
            height={height}
          />
          <Grain
            amount={props.effects.grain}
            color={palette.ink}
            frame={frame}
            width={width}
            height={height}
          />
        </AbsoluteFill>
      ) : null}
      {scene === null ? (
        <EndCard
          props={props}
          local={frame - timeline.endStart}
          width={width}
          height={height}
          measure={measure}
          logo={logo}
          inks={inks}
        />
      ) : (
        <>
          <Backdrop scene={scene} frame={frame} />
          <BeatText scene={scene} />
        </>
      )}
    </AbsoluteFill>
  );
};

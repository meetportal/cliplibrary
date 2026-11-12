import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import type { DoodleArrowsProps } from '@/schemas';
import { ramp } from '../../kit/motion';
import { useLogoBox } from '../../kit/use-logo-box';
import { HAND_FACE, useMeasure } from './fonts';
import { head, line, STRAIGHT_PATH, shaft, WAVY_PATH } from './geometry';
import { layoutNote, logoSize, NOTE_LEFT } from './layout';
import { Note } from './note';
import { paletteFor } from './palette';
import { Paper } from './paper';
import { PencilStroke } from './pencil';

const OPENING_DRAWN = 0.1;
const HEAD_FRAMES = 8;
const WRITE_SPAN = 30;
const UNDERLINE_FRAMES = 18;
const PEN = Easing.inOut(Easing.quad);
const FLICK = Easing.out(Easing.quad);

const timelineFor = (drawFrames: number) => {
  const straightStart = Math.round(drawFrames * 0.38);
  const straightEnd = Math.round(drawFrames * 1.2);
  const writeStart = Math.round(drawFrames * 0.9);
  const underlineStart = writeStart + WRITE_SPAN - 4;
  return {
    wavyEnd: drawFrames,
    wavyHeadEnd: drawFrames + 1 + HEAD_FRAMES,
    straightStart,
    straightEnd,
    straightHeadEnd: straightEnd + 1 + HEAD_FRAMES,
    writeStart,
    underlineStart,
    underlineEnd: underlineStart + UNDERLINE_FRAMES,
  };
};

export const DoodleArrows = (props: DoodleArrowsProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const measure = useMeasure();
  const logoBox = useLogoBox(props.logo);
  const palette = paletteFor(props.colors);
  const { arrows } = props;
  const timeline = timelineFor(arrows.drawFrames);
  const logo = logoSize(logoBox?.aspect ?? null, props.lockup.logoHeight, props.lockup.showPlate);
  const layout = layoutNote({
    headline: props.headline,
    name: props.companyName,
    measure,
    headlineSize: props.type.headlineSize,
    nameSize: props.type.nameSize,
    logo,
    underline: arrows.showUnderline,
  });
  const strokes = useMemo(() => {
    const wavy = shaft(WAVY_PATH, arrows.wobble, 1.7);
    const straight = shaft(STRAIGHT_PATH, arrows.wobble, 4.2);
    return {
      wavy,
      wavyHead: head(wavy, arrows.headSize),
      straight,
      straightHead: head(straight, arrows.headSize),
    };
  }, [arrows.wobble, arrows.headSize]);
  const lastLine = layout.lines.at(-1) ?? '';
  const underlineWidth = measure(lastLine, HAND_FACE) * layout.size;
  const underline =
    arrows.showUnderline && lastLine !== ''
      ? line(
          { x: NOTE_LEFT - 8, y: layout.underlineY + 3 },
          { x: NOTE_LEFT + underlineWidth + 10, y: layout.underlineY - 1 },
          3,
          arrows.wobble,
          7.3,
        )
      : null;
  const wavyProgress = OPENING_DRAWN + (1 - OPENING_DRAWN) * ramp(frame, 0, timeline.wavyEnd, PEN);
  const width = arrows.strokeWidth;
  return (
    <AbsoluteFill>
      {props.showBackground ? (
        <Paper
          palette={palette}
          showRules={props.paper.showRules}
          spacing={props.paper.ruleSpacing}
          drift={props.paper.lightDrift}
          loop={frame / durationInFrames}
        />
      ) : null}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', left: 0, top: 0 }}
      >
        <title>Doodle arrows</title>
        <PencilStroke
          shape={strokes.wavy}
          progress={wavyProgress}
          width={width}
          color={palette.pencil}
        />
        <PencilStroke
          shape={strokes.wavyHead}
          progress={ramp(frame, timeline.wavyEnd + 1, timeline.wavyHeadEnd, FLICK)}
          width={width}
          color={palette.pencil}
        />
        <PencilStroke
          shape={strokes.straight}
          progress={ramp(frame, timeline.straightStart, timeline.straightEnd, PEN)}
          width={width}
          color={palette.accent}
        />
        <PencilStroke
          shape={strokes.straightHead}
          progress={ramp(frame, timeline.straightEnd + 1, timeline.straightHeadEnd, FLICK)}
          width={width}
          color={palette.accent}
        />
        {underline === null ? null : (
          <PencilStroke
            shape={underline}
            progress={ramp(frame, timeline.underlineStart, timeline.underlineEnd, PEN)}
            width={width * 0.85}
            color={palette.accent}
          />
        )}
      </svg>
      <Note
        props={props}
        layout={layout}
        palette={palette}
        logoBox={logoBox}
        frame={frame}
        writeStart={timeline.writeStart}
        writeSpan={WRITE_SPAN}
      />
    </AbsoluteFill>
  );
};

import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { DoodleArrowsProps } from '@/schemas';
import { ramp } from '../../kit/motion';
import { useLogoBox } from '../../kit/use-logo-box';
import { HAND_FACE, useMeasure } from './fonts';
import { arrow, line, STRAIGHT_PATH, WAVY_PATH } from './geometry';
import { layoutNote, logoSize, NOTE_LEFT } from './layout';
import { Note } from './note';
import { paletteFor } from './palette';
import { Paper } from './paper';
import { PencilStroke } from './pencil';
import {
  erasing,
  lockupLift,
  PEN,
  PEN_START,
  pushAt,
  SOFT,
  TEXT_ERASE_FRAMES,
  timelineFor,
} from './timeline';

const LETTER_FRAMES = 9;
const PUSH_ORIGIN = '50% 50%';
const OVERSCAN = 0.004;

export const DoodleArrows = (props: DoodleArrowsProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const measure = useMeasure();
  const logoBox = useLogoBox(props.logo);
  const palette = paletteFor(props.colors);
  const { arrows, motion } = props;
  const timeline = timelineFor(arrows.drawFrames, durationInFrames);
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
  const boil = { amount: motion.boil, frame };
  const wavy = arrow(WAVY_PATH, arrows.wobble, 1.7, arrows.headSize, boil);
  const straight = arrow(STRAIGHT_PATH, arrows.wobble, 4.2, arrows.headSize, boil);
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
          boil,
        )
      : null;
  const wavyProgress = ramp(frame, 0, timeline.wavyEnd, PEN_START);
  const width = arrows.strokeWidth;
  const erase = (delay: number, frames?: number) =>
    erasing(frame, timeline, delay, motion.erase, frames);
  const lines = layout.lines.length;
  const scale = 1 + OVERSCAN + motion.push * pushAt(frame, durationInFrames);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill
        style={{ transform: `scale(${scale.toFixed(5)})`, transformOrigin: PUSH_ORIGIN }}
      >
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
            shape={wavy}
            progress={wavyProgress}
            erased={erase(0)}
            width={width}
            color={palette.pencil}
          />
          <PencilStroke
            shape={straight}
            progress={ramp(frame, timeline.straightStart, timeline.straightEnd, PEN)}
            erased={erase(3)}
            width={width}
            color={palette.accent}
          />
          {underline === null ? null : (
            <PencilStroke
              shape={underline}
              progress={ramp(frame, timeline.underlineStart, timeline.underlineEnd, PEN)}
              erased={erase(4 + lines * 2)}
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
          reveal={(index, total) => {
            const start = timeline.writeStart + (timeline.writeSpan * index) / total;
            return ramp(frame, start, start + LETTER_FRAMES, SOFT);
          }}
          erase={(row) => erase(4 + row * 2, TEXT_ERASE_FRAMES)}
          lift={lockupLift(frame, timeline, motion.lockupRise, motion.erase)}
          lineWidth={(text) => measure(text, HAND_FACE) * layout.size}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

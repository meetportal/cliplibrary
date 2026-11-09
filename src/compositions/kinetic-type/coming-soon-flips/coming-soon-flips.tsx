import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ComingSoonFlipsProps } from '@/schemas';
import { inkOn, withContrast } from './contrast';
import { FlipWord } from './flip-word';
import { type Face, flickerFace, NAME_FACES, TITLE_FACES, WORD_FACES } from './fonts';
import { Grain } from './grain';
import { lightAxis, litRegion, lockupLayout, titleLayout } from './layout';
import { beamShadow, LitWall, slatSpread, windowShadow } from './lit-wall';
import { useMeasure } from './measure';
import { cueAt, lightPose } from './timeline';
import { TrackedTitle } from './tracked-title';
import { useLogo } from './use-logo';

const PLATE_CONTRAST = 1.6;

const usedFaces = (props: ComingSoonFlipsProps): Face[] => {
  const main = WORD_FACES[props.type.font];
  return [
    main,
    ...props.type.flickerFonts.map((font) => flickerFace(font, main)),
    TITLE_FACES[props.title.font],
    NAME_FACES[props.lockup.nameFont],
  ];
};

export const ComingSoonFlips = (props: ComingSoonFlipsProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const size = { width, height };
  const faces = usedFaces(props);
  const measure = useMeasure(faces);
  const logo = useLogo(props.logo);
  const main = WORD_FACES[props.type.font];
  const titleFace = TITLE_FACES[props.title.font];
  const nameFace = NAME_FACES[props.lockup.nameFont];
  const { colors } = props;
  const lockup = lockupLayout(props, logo?.aspect ?? null, measure, nameFace, size);
  const title = titleLayout(props.title, measure, titleFace, size);
  const accent = withContrast(colors.primary, colors.background, colors.text);
  const brightPlate = withContrast(colors.primary, colors.background, colors.text, PLATE_CONTRAST);
  const cue = cueAt(props, frame, durationInFrames);
  const plate = (fill: string) =>
    props.showBackground ? <AbsoluteFill style={{ backgroundColor: fill }} /> : null;
  if (cue.kind === 'word') {
    const bright = cue.word.plate === 'primary';
    const ink = bright ? inkOn(brightPlate, colors.background, colors.text) : colors.text;
    return (
      <AbsoluteFill>
        {plate(bright ? brightPlate : colors.background)}
        <FlipWord
          props={props}
          word={cue.word}
          local={cue.local}
          length={cue.length}
          main={main}
          measure={measure}
          color={ink}
          barColor={bright ? ink : accent}
        />
        <Grain amount={props.grain} frame={frame} />
      </AbsoluteFill>
    );
  }
  const wall = (beam: string | null, window: string | null) => (
    <LitWall
      props={props}
      lockup={lockup}
      logoSrc={logo?.src ?? null}
      nameFace={nameFace}
      beam={beam}
      window={window}
    />
  );
  if (cue.kind === 'flash') {
    return (
      <AbsoluteFill>
        {plate(colors.background)}
        {wall(null, null)}
        <Grain amount={props.grain} frame={frame} />
      </AbsoluteFill>
    );
  }
  const region = litRegion(title.bounds, lockup.bounds, props.light.titleMargin, height);
  const axis = lightAxis(props.light.angle, lockup.bounds, region, slatSpread(props.light), size);
  const pose = lightPose(props.light, axis, cue.local);
  return (
    <AbsoluteFill>
      {plate(colors.background)}
      {wall(
        beamShadow(props.light, axis, pose, cue.local, colors.background),
        windowShadow(region, height, colors.background),
      )}
      <TrackedTitle
        title={props.title}
        lines={title}
        face={titleFace}
        measure={measure}
        local={cue.local}
        outlineColor={colors.text}
        solidColor={accent}
      />
      <Grain amount={props.grain} frame={frame} />
    </AbsoluteFill>
  );
};

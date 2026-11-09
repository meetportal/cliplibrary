import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { PillFanProps } from '@/schemas';
import { pixelTween } from '../../brand/dot-ring-logo-reveal/pixel-tween';
import { useLogo } from '../../brand/dot-ring-logo-reveal/use-logo';
import { ramp } from '../../kit/motion';
import { Backdrop } from './backdrop';
import { pillPalette } from './colors';
import { displayFace, textFace, useMeasure } from './fonts';
import { buildLayout, PHRASE_LINE_HEIGHT, phraseHeight } from './layout';
import { Lockup } from './lockup';
import { Pill } from './pill';
import { buildTimeline, clearAt, glideAt, poseFor, progressAt, SETTLE } from './timeline';

export const PillFan = (props: PillFanProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const measure = useMeasure([props.phrase.font, props.pills.font]);
  const logo = useLogo(props.logo);
  const aspect = logo?.aspect ?? null;
  const layout = useMemo(
    () => buildLayout(props, measure, aspect, { width, height }),
    [props, measure, aspect, width, height],
  );
  const line = useMemo(() => buildTimeline(props, durationInFrames), [props, durationInFrames]);
  const palette = useMemo(() => pillPalette(props), [props]);
  const progress = progressAt(frame, line);
  const clear = clearAt(frame, line);
  const { phrase } = layout;
  const phraseBox = phraseHeight(phrase);
  const rise = pixelTween(frame, [0, line.intro + 8], [phrase.size * 0.35, 0], SETTLE);
  const phraseFace = displayFace(props.phrase.font);
  const wordFace = textFace(props.pills.font);
  const glide = glideAt(frame, line, layout.endShift);
  const belowLine = props.brand.placement === 'below-line';
  const lockup = (
    <Lockup box={layout.lockup} logo={logo?.src ?? null} props={props} face={phraseFace} />
  );
  return (
    <AbsoluteFill>
      {props.showBackground ? <Backdrop frame={frame} props={props} /> : null}
      <AbsoluteFill style={{ transform: `translateY(${glide}px)` }}>
        {props.words.map((word, index) => {
          const pose = poseFor(progress - index, props, clear);
          return pose === null ? null : (
            <Pill
              key={`${index}-${word}`}
              word={word.trim()}
              length={layout.pills.lengths[index] ?? 0}
              pose={pose}
              layout={layout}
              palette={palette}
              props={props}
              face={wordFace}
            />
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: phrase.right,
            top: phrase.centerY - phraseBox / 2,
            height: phraseBox,
            textAlign: 'right',
            fontFamily: phraseFace.family,
            fontWeight: phraseFace.weight,
            fontSize: phrase.size,
            lineHeight: PHRASE_LINE_HEIGHT,
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
            color: props.colors.text,
            opacity: ramp(frame, 0, line.intro * 0.8),
            transformOrigin: 'right center',
            transform: `translateY(${rise}px) rotate(${props.phrase.tilt}deg)`,
          }}
        >
          {phrase.lines.map((text) => (
            <div key={text}>{text}</div>
          ))}
        </div>
        {belowLine ? lockup : null}
      </AbsoluteFill>
      {belowLine ? null : lockup}
    </AbsoluteFill>
  );
};

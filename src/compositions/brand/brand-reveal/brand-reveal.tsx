import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { BrandRevealProps } from '@/schemas';
import { usableImage, useLogoAspect } from '../app-icon-reveal/use-logo-aspect';
import { Backdrop } from './backdrop';
import { NameLetters, RisingLine } from './copy';
import { EYEBROW_FACE, NAME_FACES, TAGLINE_FACE, useFontReady, useTextWidth } from './fonts';
import { drawStretch, plateSize } from './geometry';
import { dotReach, Halo, haloReach } from './halo';
import { buildTimeline } from './timeline';

const TAGLINE_LEADING = 1.3;
const CAP_SHARE = 0.74;

export const BrandReveal = (props: BrandRevealProps) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const name = props.companyName.trim();
  const eyebrow = props.eyebrow.trim();
  const tagline = props.tagline.trim();
  const letters = [...name].filter((char) => char.trim() !== '').length;
  const logo = usableImage(props.logo) ? props.logo : null;
  const aspect = useLogoAspect(props.logo);
  const plate = plateSize(props.halo.size, aspect, props.halo.logoPadding, props.halo.widest);
  const stretch = drawStretch(plate);
  const line = useMemo(
    () => buildTimeline(props.timing, letters, stretch),
    [props.timing, letters, stretch],
  );
  const face = NAME_FACES[props.name.font];
  useFontReady(EYEBROW_FACE);
  useFontReady(TAGLINE_FACE);
  const widthPerSize = useTextWidth(name, face, props.name.tracking);
  const reach = haloReach(props);
  const markWidth = plate.width + 2 * reach;
  const markHeight = plate.height + 2 * reach;
  const gap = name === '' ? 0 : props.name.gap;
  const room = Math.max(0, props.name.maxWidth - markWidth - gap);
  const nameSize =
    widthPerSize > 0 ? Math.min(props.name.size, Math.floor(room / widthPerSize)) : props.name.size;
  const nameWidth = name === '' ? 0 : widthPerSize * nameSize;
  const rowWidth = markWidth + gap + nameWidth;
  const left = Math.round((width - rowWidth) / 2);
  const rowCenter = Math.round(height / 2 + props.layout.offsetY);
  const rowHalf = Math.max(markHeight / 2 + dotReach(props), (props.name.size * CAP_SHARE) / 2);
  const eyebrowTop = Math.round(
    rowCenter - rowHalf - props.eyebrowStyle.gap - props.eyebrowStyle.size,
  );
  const taglineTop = Math.round(rowCenter + rowHalf + props.taglineStyle.gap);
  const turn = (2 * Math.PI * frame) / durationInFrames;
  const driftX = props.layout.lightDrift * Math.sin(turn);
  const driftY = props.layout.lightDrift * 0.8 * (Math.cos(turn) - 1);
  return (
    <AbsoluteFill>
      {props.showBackground ? (
        <Backdrop
          center={props.colors.background}
          edge={props.colors.backgroundEdge}
          width={width}
          height={height}
          focusX={width / 2 + driftX}
          focusY={rowCenter + driftY}
        />
      ) : null}
      {eyebrow === '' ? null : (
        <RisingLine
          frame={frame}
          start={line.eyebrowStart}
          end={line.eyebrowEnd}
          rise={8}
          text={eyebrow}
          top={eyebrowTop}
          width={width}
          maxWidth={width - 160}
          size={props.eyebrowStyle.size}
          face={EYEBROW_FACE}
          tracking={props.eyebrowStyle.tracking}
          lineHeight={1}
          color={props.colors.eyebrow}
          upper
        />
      )}
      <Halo
        frame={frame}
        fps={fps}
        line={line}
        props={props}
        plate={plate}
        logo={logo}
        centerX={left + markWidth / 2}
        centerY={rowCenter}
      />
      {name === '' ? null : (
        <NameLetters
          frame={frame}
          line={line}
          text={name}
          left={left + markWidth + gap}
          top={Math.round(rowCenter - nameSize / 2)}
          size={nameSize}
          face={face}
          tracking={props.name.tracking}
          color={props.colors.text}
        />
      )}
      {tagline === '' ? null : (
        <RisingLine
          frame={frame}
          start={line.taglineStart}
          end={line.taglineEnd}
          rise={16}
          text={tagline}
          top={taglineTop}
          width={width}
          maxWidth={Math.min(width - 120, props.taglineStyle.maxWidth)}
          size={props.taglineStyle.size}
          face={TAGLINE_FACE}
          tracking={0}
          lineHeight={TAGLINE_LEADING}
          color={props.colors.tagline}
          upper={false}
        />
      )}
    </AbsoluteFill>
  );
};

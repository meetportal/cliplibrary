import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { BrandRevealProps } from '@/schemas';
import { usableImage, useLogoBox } from '../../kit/use-logo-box';
import { Backdrop } from './backdrop';
import { NameLetters, TextLine } from './copy';
import { EYEBROW_FACE, NAME_FACES, TAGLINE_FACE, useFontReady, useTextWidth } from './fonts';
import { drawStretch, plateSize } from './geometry';
import { dotReach, Halo, haloReach } from './halo';
import { usePixelQuantum } from './pixel-quantum';
import { buildTimeline, exitProgress, lineIn, pushScale } from './timeline';

const TAGLINE_LEADING = 1.3;
const PUSH_ROW = 1200;
const TAGLINE_RISE = 16;
const PUSH_BOOST = 2;
const PUSH_MARGIN = 80;
const CAP_SHARE = 0.74;

export const BrandReveal = (props: BrandRevealProps) => {
  const frame = useCurrentFrame();
  const quantum = usePixelQuantum();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const name = props.companyName.trim();
  const eyebrow = props.eyebrow.trim();
  const tagline = props.tagline.trim();
  const letters = [...name].filter((char) => char.trim() !== '').length;
  const logo = usableImage(props.logo) ? props.logo : null;
  const box = useLogoBox(props.logo);
  const aspect = box === null ? null : (box.aspect * box.h) / box.w;
  const plate = plateSize(props.halo.size, aspect, props.halo.logoPadding, props.halo.widest);
  const stretch = drawStretch(plate);
  const line = useMemo(
    () => buildTimeline(props.timing, letters, stretch, durationInFrames),
    [props.timing, letters, stretch, durationInFrames],
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
  const nameTop = Math.round(rowCenter - nameSize / 2);
  const rowHalf = Math.max(markHeight / 2 + dotReach(props), (props.name.size * CAP_SHARE) / 2);
  const taglineWidth = Math.min(width - 120, props.taglineStyle.maxWidth);
  const pushBoost = Math.min(
    PUSH_BOOST,
    Math.max(1 / PUSH_BOOST, PUSH_ROW / Math.max(1, rowWidth)),
  );
  const push = Math.max(
    0,
    Math.min(props.layout.pushIn * pushBoost, (width - PUSH_MARGIN) / Math.max(1, rowWidth) - 1),
  );
  const pushed = 1 + push;
  const eyebrowTop = Math.round(
    rowCenter - rowHalf * pushed - props.eyebrowStyle.gap - props.eyebrowStyle.size,
  );
  const taglineTop = Math.round(rowCenter + rowHalf * pushed + props.taglineStyle.gap);
  const turn = (2 * Math.PI * frame) / durationInFrames;
  const driftX = props.layout.lightDrift * Math.sin(turn);
  const driftY = props.layout.lightDrift * 0.8 * (Math.cos(turn) - 1);
  const exit = exitProgress(frame, line);
  const taglineIn = lineIn(frame, line.taglineStart, line.taglineEnd, TAGLINE_RISE, quantum);
  const scale = pushScale(frame, durationInFrames, push);
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
      <AbsoluteFill
        style={{
          opacity: props.showBackground ? 1 : 1 - exit,
          filter: exit > 0 ? `blur(${(props.timing.exitBlur * exit).toFixed(2)}px)` : undefined,
        }}
      >
        {eyebrow === '' ? null : (
          <TextLine
            offset={0}
            opacity={1}
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
        <AbsoluteFill
          style={{
            transform: scale === 1 ? undefined : `scale(${scale.toFixed(5)})`,
            transformOrigin: `${width / 2}px ${rowCenter}px`,
            willChange: 'transform',
          }}
        >
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
              top={nameTop}
              size={nameSize}
              face={face}
              tracking={props.name.tracking}
              color={props.colors.text}
              quantum={quantum}
            />
          )}
        </AbsoluteFill>
        {tagline === '' ? null : (
          <TextLine
            offset={taglineIn.offset}
            opacity={taglineIn.opacity}
            text={tagline}
            top={taglineTop}
            width={width}
            maxWidth={taglineWidth}
            size={props.taglineStyle.size}
            face={TAGLINE_FACE}
            tracking={0}
            lineHeight={TAGLINE_LEADING}
            color={props.colors.tagline}
            upper={false}
          />
        )}
      </AbsoluteFill>
      {props.showBackground && exit > 0 ? (
        <AbsoluteFill style={{ backgroundColor: props.colors.fade, opacity: exit }} />
      ) : null}
    </AbsoluteFill>
  );
};

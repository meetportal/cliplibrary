import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { AppIconRevealProps } from '@/schemas';
import { Backdrop } from './backdrop';
import { NAME_FACES, useNameWidth } from './fonts';
import { NameLine } from './name-line';
import { Tile } from './tile';
import { buildTimeline } from './timeline';
import { tileWidthFor, useLogoAspect } from './use-logo-aspect';

const LINE_HEIGHT = 1.25;

export const AppIconReveal = (props: AppIconRevealProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const name = props.companyName.trim();
  const letters = [...name].filter((char) => char.trim() !== '').length;
  const line = useMemo(() => buildTimeline(props.timing, letters), [props.timing, letters]);
  const aspect = useLogoAspect(props.logo);
  const tileWidth = tileWidthFor(props.tile.size, aspect, props.tile.widest);
  const face = NAME_FACES[props.name.font];
  const widthPerSize = useNameWidth(name, props.name.font, props.name.tracking);
  const nameSize =
    widthPerSize > 0
      ? Math.min(props.name.size, Math.floor(props.name.maxWidth / widthPerSize))
      : props.name.size;
  const lineHeight = props.name.size * LINE_HEIGHT;
  const block = props.tile.size + (name === '' ? 0 : props.name.gap + lineHeight);
  const top = height / 2 - block / 2 + props.layout.offsetY;
  const centerY = top + props.tile.size / 2;
  const nameTop =
    top + props.tile.size + props.name.gap + (lineHeight - nameSize * LINE_HEIGHT) / 2;
  return (
    <AbsoluteFill>
      {props.showBackground ? (
        <Backdrop
          center={props.colors.background}
          edge={props.colors.backgroundEdge}
          width={width}
          height={height}
          focusY={height / 2 + props.layout.offsetY}
        />
      ) : null}
      <Tile
        frame={frame}
        line={line}
        props={props}
        centerX={width / 2}
        centerY={centerY}
        tileWidth={tileWidth}
      />
      {name === '' ? null : (
        <NameLine
          frame={frame}
          line={line}
          text={name}
          top={Math.round(nameTop)}
          width={width}
          size={nameSize}
          family={face.family}
          weight={face.weight}
          tracking={props.name.tracking}
          color={props.colors.text}
        />
      )}
    </AbsoluteFill>
  );
};

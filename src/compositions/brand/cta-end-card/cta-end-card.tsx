import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { CtaEndCardProps } from '@/schemas';
import { usableImage, useLogoBox } from '../../kit/use-logo-box';
import { Backdrop } from './backdrop';
import { BODY_FACE, CAPTION_FACE, HEADLINE_FACES, type Measure, useWidths } from './fonts';
import { buildPalette } from './palette';
import { Button, LogoPlate, logoSize, type Reveal, Row, revealStyle } from './pieces';
import {
  buildBeats,
  ENTRANCE,
  enter,
  exitFade,
  pixelTween,
  sheenAt,
  underlineDraw,
} from './timeline';

const HEAD_LINE = 1.12;
const UNDERLINE_TOP = 1.2;

const fitSize = (size: number, maxWidth: number, widthPerSize: number) =>
  widthPerSize > 0 ? Math.min(size, Math.floor(maxWidth / widthPerSize)) : size;

export const CtaEndCard = (props: CtaEndCardProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const palette = useMemo(
    () => buildPalette(props.colors, props.motion.sheen),
    [props.colors, props.motion.sheen],
  );
  const beats = useMemo(
    () => buildBeats(props.motion, durationInFrames),
    [props.motion, durationInFrames],
  );
  const headFace = HEADLINE_FACES[props.type.font];
  const parts = [props.headline.lead, props.headline.name, props.headline.tail].map((part) =>
    part.trim(),
  );
  const headText = parts.filter((part) => part !== '').join(' ');
  const tagline = props.tagline.trim();
  const website = props.type.uppercaseWebsite
    ? props.website.trim().toUpperCase()
    : props.website.trim();
  const items = useMemo<Measure[]>(
    () => [
      { text: headText, face: headFace, tracking: 0 },
      { text: tagline, face: BODY_FACE, tracking: 0 },
      { text: website, face: CAPTION_FACE, tracking: props.type.websiteTracking },
      { text: parts[1] ?? '', face: headFace, tracking: 0 },
    ],
    [headText, headFace, tagline, website, props.type.websiteTracking, parts[1]],
  );
  const [headWidth = 0, tagWidth = 0, webWidth = 0, nameWidth = 0] = useWidths(items);
  const maxWidth = Math.min(props.type.maxWidth, width - 160);
  const headSize = fitSize(props.type.size, maxWidth, headWidth);
  const tagSize = fitSize(props.type.taglineSize, maxWidth * 0.86, tagWidth);
  const webSize = fitSize(props.type.websiteSize, maxWidth * 0.8, webWidth);
  const logoBox = useLogoBox(props.logo);
  const showLogo = usableImage(props.logo) && logoBox !== null;
  const logo =
    logoBox === null ? null : logoSize(logoBox, props.lockup.size, props.lockup.maxWidth);
  const pad = props.lockup.plate ? props.lockup.padding : 0;
  const space = props.layout.spacing;
  const underline = props.underline.show && parts[1] !== '';
  const rows = [
    {
      key: 'logo',
      show: showLogo && logo !== null,
      height: (logo?.height ?? 0) + pad * 2,
      gap: 50,
    },
    {
      key: 'headline',
      show: headText !== '',
      height: headSize * HEAD_LINE,
      gap: 32 + (underline ? props.underline.thickness + headSize * 0.08 : 0),
    },
    { key: 'tagline', show: tagline !== '', height: tagSize * 1.35, gap: 46 },
    { key: 'buttons', show: true, height: props.buttons.height, gap: 36 },
    { key: 'website', show: website !== '', height: webSize * 1.4, gap: 0 },
  ].filter((row) => row.show);
  const total = rows.reduce(
    (sum, row, at) => sum + row.height + (at < rows.length - 1 ? row.gap * space : 0),
    0,
  );
  const tops = new Map<string, number>();
  rows.reduce(
    (at, row) => {
      tops.set(row.key, at);
      return at + row.height + row.gap * space;
    },
    (height - total) / 2 + props.layout.offsetY,
  );
  const fade = exitFade(frame, beats);
  const reveal = (start: number): Reveal => {
    const opacity = enter(frame, start);
    return {
      opacity: opacity * fade,
      rise: pixelTween(frame, props.motion.rise, start, ENTRANCE),
    };
  };
  const draw = underlineDraw(frame, beats, nameWidth * headSize);
  const sheen = props.motion.sheen > 0 ? sheenAt(frame, beats) : null;
  const top = (key: string) => tops.get(key) ?? 0;
  return (
    <AbsoluteFill>
      {props.showBackground ? (
        <Backdrop
          center={palette.background}
          edge={palette.backgroundEdge}
          width={width}
          height={height}
          focusY={height / 2 + props.layout.offsetY}
          phase={frame / durationInFrames}
          drift={props.motion.drift}
        />
      ) : null}
      {showLogo && logo !== null && logoBox !== null ? (
        <Row top={top('logo')} height={logo.height + pad * 2} width={width}>
          <LogoPlate
            src={props.logo}
            box={logoBox}
            width={logo.width}
            height={logo.height}
            padding={pad}
            plate={props.lockup.plate}
            palette={palette}
          />
        </Row>
      ) : null}
      {headText === '' ? null : (
        <Row
          top={top('headline')}
          height={headSize * HEAD_LINE}
          width={width}
          style={{
            fontFamily: headFace.family,
            fontWeight: headFace.weight,
            fontSize: headSize,
            letterSpacing: `${headFace.tracking}em`,
            lineHeight: HEAD_LINE,
            color: palette.text,
            gap: '0.2em',
          }}
        >
          {parts.map((part, at) =>
            part === '' ? null : (
              <span
                key={['lead', 'name', 'tail'][at]}
                style={{
                  ...revealStyle(reveal(beats.head[at] ?? 0)),
                  display: 'inline-block',
                  position: 'relative',
                  color: at === 1 ? palette.accent : palette.text,
                }}
              >
                {part}
                {at === 1 && underline ? (
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: Math.round(headSize * UNDERLINE_TOP),
                      height: props.underline.thickness,
                      borderRadius: props.underline.thickness / 2,
                      backgroundColor: palette.accent,
                      transform: `scaleX(${draw.toFixed(4)})`,
                      transformOrigin: 'left center',
                      opacity: Math.min(1, draw * 5),
                    }}
                  />
                ) : null}
              </span>
            ),
          )}
        </Row>
      )}
      {tagline === '' ? null : (
        <Row
          top={top('tagline')}
          height={tagSize * 1.35}
          width={width}
          style={{
            ...revealStyle(reveal(beats.tagline)),
            fontFamily: BODY_FACE.family,
            fontWeight: BODY_FACE.weight,
            fontSize: tagSize,
            color: palette.muted,
          }}
        >
          {tagline}
        </Row>
      )}
      <Row
        top={top('buttons')}
        height={props.buttons.height}
        width={width}
        style={{ gap: props.buttons.gap }}
      >
        <Button
          caption={props.primaryButton.caption}
          label={props.primaryButton.label}
          height={props.buttons.height}
          labelSize={props.buttons.labelSize}
          fill={palette.buttonFill}
          ink={palette.buttonInk}
          edge={palette.buttonEdge}
          reveal={reveal(beats.primary)}
          sheen={sheen}
          sheenColor={palette.sheen}
        />
        {props.secondaryButton.show ? (
          <Button
            caption={props.secondaryButton.caption}
            label={props.secondaryButton.label}
            height={props.buttons.height}
            labelSize={props.buttons.labelSize}
            fill={palette.surface}
            ink={palette.surfaceInk}
            edge={palette.surfaceEdge}
            reveal={reveal(beats.secondary)}
            sheen={null}
            sheenColor={palette.sheen}
          />
        ) : null}
      </Row>
      {website === '' ? null : (
        <Row
          top={top('website')}
          height={webSize * 1.4}
          width={width}
          style={{
            ...revealStyle(reveal(beats.website)),
            fontFamily: CAPTION_FACE.family,
            fontWeight: CAPTION_FACE.weight,
            fontSize: webSize,
            letterSpacing: `${props.type.websiteTracking}em`,
            paddingLeft: `${props.type.websiteTracking}em`,
            color: palette.muted,
          }}
        >
          {website}
        </Row>
      )}
    </AbsoluteFill>
  );
};

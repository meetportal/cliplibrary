import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { CtaEndCardProps } from '@/schemas';
import { usableImage, useLogoBox } from '../../kit/use-logo-box';
import { Backdrop } from './backdrop';
import {
  BODY_FACE,
  CAPTION_FACE,
  HEADLINE_FACES,
  LABEL_FACE,
  type Measure,
  useWidths,
} from './fonts';
import { HEAD_LINE, HeadlineRow } from './headline';
import { buildPalette } from './palette';
import { Button, type ButtonText, LogoPlate, logoSize, type Reveal, Row, TextRow } from './pieces';
import {
  buildBeats,
  enter,
  exitFade,
  pushAmount,
  pushScale,
  rise,
  sheenAt,
  underlineDraw,
} from './timeline';

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
  const { lead, name, tail } = props.headline;
  const parts = useMemo(() => [lead.trim(), name.trim(), tail.trim()], [lead, name, tail]);
  const headText = parts.filter((part) => part !== '').join(' ');
  const tagline = props.tagline.trim();
  const website = props.type.uppercaseWebsite
    ? props.website.trim().toUpperCase()
    : props.website.trim();
  const primary = props.primaryButton;
  const secondary = props.secondaryButton;
  const items = useMemo<Measure[]>(
    () => [
      { text: headText, face: headFace, tracking: 0 },
      { text: tagline, face: BODY_FACE, tracking: 0 },
      { text: website, face: CAPTION_FACE, tracking: props.type.websiteTracking },
      ...parts.map((text) => ({ text, face: headFace, tracking: 0 })),
      ...[primary.caption, primary.label, secondary.caption, secondary.label].map((text, at) => ({
        text,
        face: at % 2 === 0 ? CAPTION_FACE : LABEL_FACE,
        tracking: 0,
      })),
    ],
    [
      headText,
      headFace,
      tagline,
      website,
      props.type.websiteTracking,
      parts,
      primary.caption,
      primary.label,
      secondary.caption,
      secondary.label,
    ],
  );
  const widths = useWidths(items);
  const [headWidth = 0, tagWidth = 0, webWidth = 0] = widths;
  const wordWidths = widths.slice(3, 6);
  const nameWidth = wordWidths[1] ?? 0;
  const buttonText = (button: typeof primary, at: number): ButtonText => ({
    caption: button.caption,
    label: button.label,
    captionWidth: widths[6 + at * 2] ?? 0,
    labelWidth: widths[7 + at * 2] ?? 0,
  });
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
  const reveal = (start: number): Reveal => ({
    opacity: enter(frame, start) * fade,
    rise: rise(frame, props.motion.rise, start),
  });
  const scale = pushScale(
    frame,
    beats,
    pushAmount(props.motion.push, Math.max(headWidth * headSize, tagWidth * tagSize), width),
  );
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
      <AbsoluteFill
        style={{
          transform: `scale(${scale.toFixed(5)})`,
          transformOrigin: `${width / 2}px ${(height + total) / 2 + props.layout.offsetY}px`,
          willChange: 'transform',
        }}
      >
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
          <HeadlineRow
            parts={parts}
            widths={wordWidths}
            reveals={beats.head.map(reveal)}
            top={top('headline')}
            width={width}
            size={headSize}
            face={headFace}
            palette={palette}
            underline={underline ? props.underline.thickness : 0}
            draw={draw}
          />
        )}
        <TextRow
          top={top('tagline')}
          width={width}
          reveal={reveal(beats.tagline)}
          look={{
            text: tagline,
            face: BODY_FACE,
            size: tagSize,
            tracking: 0,
            color: palette.muted,
            lineHeight: 1.35,
            width: tagWidth * tagSize,
          }}
        />
        <Row
          top={top('buttons')}
          height={props.buttons.height}
          width={width}
          style={{ gap: props.buttons.gap }}
        >
          <Button
            text={buttonText(primary, 0)}
            height={props.buttons.height}
            labelSize={props.buttons.labelSize}
            fill={palette.buttonFill}
            ink={palette.buttonInk}
            edge={palette.buttonEdge}
            reveal={reveal(beats.primary)}
            sheen={sheen}
            sheenColor={palette.sheen}
          />
          {secondary.show ? (
            <Button
              text={buttonText(secondary, 1)}
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
        <TextRow
          top={top('website')}
          width={width}
          reveal={reveal(beats.website)}
          indent={props.type.websiteTracking * webSize}
          look={{
            text: website,
            face: CAPTION_FACE,
            size: webSize,
            tracking: props.type.websiteTracking,
            color: palette.muted,
            lineHeight: 1.4,
            width: webWidth * webSize,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

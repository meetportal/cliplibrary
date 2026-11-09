import type { CSSProperties } from 'react';
import type { PhoneSpinInProps } from '@/schemas';
import { HeadlineLines, LINK_DECOR, LogoMark, logoSize, WebsiteLink } from './copy-parts';
import { fitText } from './fit-text';
import { HEADLINE_FACES, WEBSITE_FACE } from './fonts';
import { reveal } from './reveal';
import type { LogoState } from './use-logo';

const LINE_STAGGER = 4;
const EMERGE = 140;

export type PhoneBounds = { left: number; right: number };

type Columns = { copyX: number; copyWidth: number; logoEdge: number; logoRoom: number };

const columns = (props: PhoneSpinInProps, phone: PhoneBounds, frameWidth: number): Columns => {
  const { arrangement, textInset, textWidth, textGap } = props.layout;
  if (arrangement === 'split') {
    const copyX = Math.round(phone.right + textGap);
    const logoEdge = Math.round(phone.left - textGap);
    return {
      copyX,
      copyWidth: Math.max(160, Math.min(textWidth, frameWidth - textInset - copyX)),
      logoEdge,
      logoRoom: Math.max(80, logoEdge - textInset),
    };
  }
  if (arrangement === 'text-left') {
    const copyWidth = Math.max(160, Math.min(textWidth, phone.left - textGap - textInset));
    return { copyX: textInset, copyWidth, logoEdge: textInset, logoRoom: copyWidth };
  }
  const copyX = Math.round(phone.right + textGap);
  const copyWidth = Math.max(160, Math.min(textWidth, frameWidth - textInset - copyX));
  return { copyX, copyWidth, logoEdge: copyX, logoRoom: copyWidth };
};

const columnStyle = (left: number, width: number, align: 'flex-start' | 'flex-end') =>
  ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left,
    width,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: align,
  }) satisfies CSSProperties;

export const CopyLayer = ({
  props,
  frame,
  phone,
  frameWidth,
  logo,
  ready,
}: {
  props: PhoneSpinInProps;
  frame: number;
  phone: PhoneBounds;
  frameWidth: number;
  logo: LogoState;
  ready: boolean;
}) => {
  const { type, timing, colors, layout } = props;
  const split = layout.arrangement === 'split';
  const face = HEADLINE_FACES[type.font];
  const { copyX, copyWidth, logoEdge, logoRoom } = columns(props, phone, frameWidth);
  const fitted = fitText(props.headline, face, ready, {
    maxSize: type.headlineSize,
    maxLines: type.headlineLines,
    width: copyWidth,
  });
  const decor = LINK_DECOR[type.websiteStyle] * type.websiteSize;
  const link = fitText(props.website, WEBSITE_FACE, ready, {
    maxSize: type.websiteSize,
    maxLines: 1,
    width: Math.max(80, (split ? logoRoom : copyWidth) - decor),
  });
  const mark = logoSize(logo, props.logoBox.size, logoRoom - 2 * props.logoBox.padding);
  const logoStart = timing.textStart;
  const headStart = timing.textStart + timing.textStagger;
  const linkStart = headStart + timing.textStagger + LINE_STAGGER * (fitted.lines.length - 1);
  const axis = split ? 'x' : 'y';
  const lineStyles = fitted.lines.map((_line, index) =>
    reveal(
      frame,
      headStart + index * LINE_STAGGER,
      axis,
      split ? -EMERGE : 2 * Math.round(fitted.size * 0.2),
    ),
  );
  const logoReveal = reveal(frame, logoStart, axis, split ? EMERGE : 28);
  const linkReveal = reveal(frame, linkStart, axis, split ? EMERGE : 24);
  const gap = Math.max(28, Math.round(fitted.size * 0.5));
  const logoNode = (
    <LogoMark
      logo={logo}
      size={mark}
      box={props.logoBox}
      plateColor={colors.plate}
      style={logoReveal}
    />
  );
  const headline = (
    <HeadlineLines fitted={fitted} face={face} color={colors.headline} styles={lineStyles} />
  );
  const website = (
    <WebsiteLink
      text={props.website}
      size={link.size}
      face={WEBSITE_FACE}
      look={type.websiteStyle}
      colors={colors}
      style={linkReveal}
    />
  );
  const linkGap = <div style={{ height: Math.round(fitted.size * 0.55) }} />;
  if (split) {
    return (
      <>
        <div style={columnStyle(logoEdge - logoRoom, logoRoom, 'flex-end')}>
          {logoNode}
          {mark === null ? null : <div style={{ height: gap }} />}
          {website}
        </div>
        <div style={columnStyle(copyX, copyWidth, 'flex-start')}>{headline}</div>
      </>
    );
  }
  const content = Math.ceil(
    Math.max(
      fitted.width,
      link.width + LINK_DECOR[type.websiteStyle] * link.size,
      mark === null ? 0 : mark.width + 2 * (props.logoBox.plate ? props.logoBox.padding : 0),
    ),
  );
  const hugX =
    layout.arrangement === 'text-left'
      ? Math.max(layout.textInset, Math.round(phone.left - layout.textGap - content))
      : copyX;
  return (
    <div style={columnStyle(hugX, Math.max(content, 1), 'flex-start')}>
      {logoNode}
      {mark === null ? null : <div style={{ height: gap }} />}
      {headline}
      {linkGap}
      {website}
    </div>
  );
};

import type { CSSProperties } from 'react';
import { Img } from 'remotion';
import type { CrumpledPaperRevealProps } from '@/schemas';
import { resolveCustom } from '../../kit/resolve-custom';
import { type LogoBox, usableImage } from '../../kit/use-logo-box';
import { CAPS_FACE, HEADLINE_FACE } from './fonts';
import {
  CONTENT_WIDTH,
  HEADLINE_LEADING,
  NAME_TRACKING,
  type SheetLayout,
  TAGLINE_TRACKING,
} from './layout';
import { SHEET } from './mesh';
import type { Palette } from './palette';

const LOGO_MAX_WIDTH = 440;
const PLATE_PAD = 20;

export type CopyFade = { headline: number; logo: number; tagline: number; name: number };

const row = (top: number, opacity: number): CSSProperties => ({
  position: 'absolute',
  left: 0,
  top,
  width: SHEET.width,
  display: 'flex',
  justifyContent: 'center',
  opacity,
});

const caps = (size: number, tracking: number, color: string): CSSProperties => ({
  fontFamily: CAPS_FACE.family,
  fontWeight: CAPS_FACE.weight,
  fontSize: size,
  lineHeight: 1.2,
  letterSpacing: `${tracking}em`,
  paddingLeft: `${tracking}em`,
  color,
  whiteSpace: 'pre',
  textTransform: 'uppercase',
});

const LogoImage = ({ src, box, maxHeight }: { src: string; box: LogoBox; maxHeight: number }) => {
  const height = Math.min(maxHeight, LOGO_MAX_WIDTH / box.aspect);
  const width = height * box.aspect;
  const imageWidth = width / box.w;
  const imageHeight = height / box.h;
  return (
    <div style={{ width, height, overflow: 'hidden', position: 'relative' }}>
      <Img
        src={resolveCustom(src)}
        style={{
          position: 'absolute',
          left: -box.x * imageWidth,
          top: -box.y * imageHeight,
          width: imageWidth,
          height: imageHeight,
        }}
      />
    </div>
  );
};

export const SheetCopy = ({
  props,
  layout,
  palette,
  fade,
  headlineLines,
  logoBox,
}: {
  props: CrumpledPaperRevealProps;
  layout: SheetLayout;
  palette: Palette;
  fade: CopyFade;
  headlineLines: readonly string[];
  logoBox: LogoBox | null;
}) => {
  const { size } = layout.headline;
  const logoHeight = props.lockup.logoHeight;
  const showLogo = usableImage(props.logo) && logoBox !== null;
  const showTagline = props.tagline.trim() !== '';
  return (
    <>
      {showLogo && logoBox !== null ? (
        <div
          style={{ ...row(layout.logoTop, fade.logo), height: logoHeight, alignItems: 'center' }}
        >
          <div
            style={{
              padding: props.lockup.showPlate ? PLATE_PAD : 0,
              borderRadius: 22,
              background: props.lockup.showPlate ? props.colors.plate : 'transparent',
              display: 'flex',
            }}
          >
            <LogoImage src={props.logo} box={logoBox} maxHeight={logoHeight} />
          </div>
        </div>
      ) : null}
      {headlineLines.map((line, index) => (
        <div
          key={`${index}-${line}`}
          style={{
            ...row(Math.round(layout.headlineTop + index * size * HEADLINE_LEADING), fade.headline),
            fontFamily: HEADLINE_FACE.family,
            fontWeight: HEADLINE_FACE.weight,
            fontSize: size,
            lineHeight: HEADLINE_LEADING,
            letterSpacing: '-0.01em',
            color: palette.ink,
            whiteSpace: 'pre',
          }}
        >
          {line}
        </div>
      ))}
      {showTagline ? (
        <>
          <div style={row(layout.ruleTop, fade.tagline)}>
            <div
              style={{
                width: 96,
                height: 3,
                background: palette.accent,
                transform: `scaleX(${0.2 + 0.8 * fade.tagline})`,
              }}
            />
          </div>
          <div style={row(layout.taglineTop, fade.tagline)}>
            <div style={caps(layout.taglineSize, TAGLINE_TRACKING, palette.accent)}>
              {props.tagline}
            </div>
          </div>
        </>
      ) : null}
      <div style={row(layout.nameTop, fade.name)}>
        <div
          style={{
            ...caps(layout.nameSize, NAME_TRACKING, palette.ink),
            maxWidth: CONTENT_WIDTH + 40,
          }}
        >
          {props.companyName}
        </div>
      </div>
    </>
  );
};

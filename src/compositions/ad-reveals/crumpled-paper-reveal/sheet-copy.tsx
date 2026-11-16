import type { CSSProperties } from 'react';
import { Img } from 'remotion';
import type { CrumpledPaperRevealProps } from '@/schemas';
import { resolveCustom } from '../../kit/resolve-custom';
import { type LogoBox, usableImage } from '../../kit/use-logo-box';
import { CanvasLine, type LineStyle } from './canvas-line';
import { CAPS_FACE, HEADLINE_FACE } from './fonts';
import { HEADLINE_LEADING, NAME_TRACKING, type SheetLayout, TAGLINE_TRACKING } from './layout';
import { SHEET } from './mesh';
import type { Palette } from './palette';
import type { CopyState } from './timeline';

const LOGO_MAX_WIDTH = 440;
const PLATE_PAD = 20;
const RISE = 34;
const CAPS_LEADING = 1.2;

export type CopyFade = {
  headline: CopyState;
  logo: CopyState;
  tagline: CopyState;
  name: CopyState;
};

const motion = (top: number, state: CopyState): CSSProperties => ({
  top,
  opacity: state.opacity,
  transform: state.lift > 0 ? `translateY(${(state.lift * RISE).toFixed(3)}px)` : undefined,
});

const row = (top: number, state: CopyState): CSSProperties => ({
  position: 'absolute',
  left: 0,
  width: SHEET.width,
  display: 'flex',
  justifyContent: 'center',
  ...motion(top, state),
});

const capsLook = (size: number, tracking: number, color: string): LineStyle => ({
  face: CAPS_FACE,
  size,
  leading: CAPS_LEADING,
  tracking,
  color,
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
          maxWidth: 'none',
          maxHeight: 'none',
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
        <CanvasLine
          key={`${index}-${line}`}
          text={line}
          look={{
            face: HEADLINE_FACE,
            size,
            leading: HEADLINE_LEADING,
            tracking: -0.01,
            color: palette.ink,
          }}
          style={motion(
            Math.round(layout.headlineTop + index * size * HEADLINE_LEADING),
            fade.headline,
          )}
        />
      ))}
      {showTagline ? (
        <>
          <div style={row(layout.ruleTop, fade.tagline)}>
            <div
              style={{
                width: 96,
                height: 3,
                background: palette.accent,
                transform: `scaleX(${0.2 + 0.8 * fade.tagline.opacity})`,
              }}
            />
          </div>
          <CanvasLine
            text={props.tagline.toLocaleUpperCase()}
            look={capsLook(layout.taglineSize, TAGLINE_TRACKING, palette.accent)}
            style={motion(layout.taglineTop, fade.tagline)}
          />
        </>
      ) : null}
      <CanvasLine
        text={props.companyName.toLocaleUpperCase()}
        look={capsLook(layout.nameSize, NAME_TRACKING, palette.ink)}
        style={motion(layout.nameTop, fade.name)}
      />
    </>
  );
};

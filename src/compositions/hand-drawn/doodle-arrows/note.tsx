import { Img } from 'remotion';
import type { DoodleArrowsProps } from '@/schemas';
import { clamp01 } from '../../kit/motion';
import { resolveCustom } from '../../kit/resolve-custom';
import type { LogoBox } from '../../kit/use-logo-box';
import { HAND_FACE, NAME_FACE } from './fonts';
import { HEADLINE_LEADING, NOTE_LEFT, type NoteLayout, PLATE_PAD } from './layout';
import type { Palette } from './palette';

const LETTER_FADE = 5;

const Logo = ({
  src,
  box,
  layout,
  plate,
  plateColor,
}: {
  src: string;
  box: LogoBox;
  layout: NoteLayout;
  plate: boolean;
  plateColor: string;
}) => {
  if (layout.logo === null) {
    return null;
  }
  const pad = plate ? PLATE_PAD : 0;
  const width = layout.logo.width - pad * 2;
  const height = layout.logo.height - pad * 2;
  const imageWidth = width / box.w;
  const imageHeight = height / box.h;
  return (
    <div
      style={{
        position: 'absolute',
        left: NOTE_LEFT,
        top: Math.round(layout.lockupTop + (layout.rowHeight - layout.logo.height) / 2),
        width: layout.logo.width,
        height: layout.logo.height,
        borderRadius: 16,
        background: plate ? plateColor : 'transparent',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: pad,
          top: pad,
          width,
          height,
          overflow: 'hidden',
        }}
      >
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
    </div>
  );
};

export const Note = ({
  props,
  layout,
  palette,
  logoBox,
  frame,
  writeStart,
  writeSpan,
}: {
  props: DoodleArrowsProps;
  layout: NoteLayout;
  palette: Palette;
  logoBox: LogoBox | null;
  frame: number;
  writeStart: number;
  writeSpan: number;
}) => {
  const total = Math.max(
    1,
    layout.lines.reduce((sum, text) => sum + [...text].length, 0),
  );
  let index = 0;
  return (
    <>
      {layout.lines.map((text, row) => (
        <div
          key={`${row}-${text}`}
          style={{
            position: 'absolute',
            left: NOTE_LEFT,
            top: Math.round(layout.headlineTop + row * layout.size * HEADLINE_LEADING),
            fontFamily: HAND_FACE.family,
            fontWeight: HAND_FACE.weight,
            fontSize: layout.size,
            lineHeight: HEADLINE_LEADING,
            color: palette.ink,
            whiteSpace: 'pre',
          }}
        >
          {[...text].map((letter, at) => {
            const start = writeStart + (writeSpan * index) / total;
            index += 1;
            return (
              <span
                key={`${at}-${letter}`}
                style={{ opacity: clamp01((frame - start) / LETTER_FADE) }}
              >
                {letter}
              </span>
            );
          })}
        </div>
      ))}
      {logoBox === null ? null : (
        <Logo
          src={props.logo}
          box={logoBox}
          layout={layout}
          plate={props.lockup.showPlate}
          plateColor={props.colors.plate}
        />
      )}
      <div
        style={{
          position: 'absolute',
          left: NOTE_LEFT + layout.nameLeft,
          top: layout.lockupTop,
          height: layout.rowHeight,
          display: 'flex',
          alignItems: 'center',
          fontFamily: NAME_FACE.family,
          fontWeight: NAME_FACE.weight,
          fontSize: layout.nameSize,
          letterSpacing: '-0.01em',
          color: palette.ink,
          whiteSpace: 'pre',
        }}
      >
        {props.companyName}
      </div>
    </>
  );
};

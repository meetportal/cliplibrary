import { Img } from 'remotion';
import type { DoodleArrowsProps } from '@/schemas';
import { resolveCustom } from '../../kit/resolve-custom';
import type { LogoBox } from '../../kit/use-logo-box';
import { LineCanvas, NameCanvas } from './canvas-note';
import { HAND_FACE, NAME_FACE } from './fonts';
import { HEADLINE_LEADING, NOTE_LEFT, NOTE_WIDTH, type NoteLayout, PLATE_PAD } from './layout';
import type { Palette } from './palette';

const LETTER_RISE = 0.07;

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
  reveal,
  erase,
  lift,
  lineWidth,
}: {
  props: DoodleArrowsProps;
  layout: NoteLayout;
  palette: Palette;
  logoBox: LogoBox | null;
  reveal: (index: number, total: number) => number;
  erase: (row: number) => number;
  lift: number;
  lineWidth: (text: string) => number;
}) => {
  const total = Math.max(
    1,
    layout.lines.reduce((sum, text) => sum + [...text].length, 0),
  );
  let index = 0;
  return (
    <>
      {layout.lines.map((text, row) => {
        const letters = [...text].map((char) => {
          const letter = { char, reveal: reveal(index, total) };
          index += 1;
          return letter;
        });
        return (
          <LineCanvas
            key={`${row}-${text}`}
            left={NOTE_LEFT}
            top={layout.headlineTop + row * layout.size * HEADLINE_LEADING}
            width={lineWidth(text)}
            look={{
              letters,
              face: HAND_FACE,
              size: layout.size,
              leading: HEADLINE_LEADING,
              color: palette.ink,
              rise: layout.size * LETTER_RISE,
              erase: erase(row),
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          transform: `translateY(${lift.toFixed(3)}px)`,
        }}
      >
        {logoBox === null ? null : (
          <Logo
            src={props.logo}
            box={logoBox}
            layout={layout}
            plate={props.lockup.showPlate}
            plateColor={props.colors.plate}
          />
        )}
        <NameCanvas
          left={NOTE_LEFT + layout.nameLeft}
          top={layout.lockupTop}
          width={NOTE_WIDTH - layout.nameLeft}
          look={{
            text: props.companyName,
            face: NAME_FACE,
            size: layout.nameSize,
            color: palette.ink,
            height: layout.rowHeight,
          }}
        />
      </div>
    </>
  );
};

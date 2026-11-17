import { CanvasText } from './canvas-text';
import type { Face } from './fonts';
import type { Palette } from './palette';
import { type Reveal, Row, revealStyle } from './pieces';

export const HEAD_LINE = 1.12;
const HEAD_KEYS = ['lead', 'name', 'tail'];
const UNDERLINE_TOP = 1.2;
const WORD_GAP = 0.2;

export const HeadlineRow = ({
  parts,
  widths,
  reveals,
  top,
  width,
  size,
  face,
  palette,
  underline,
  draw,
}: {
  parts: readonly string[];
  widths: readonly number[];
  reveals: readonly Reveal[];
  top: number;
  width: number;
  size: number;
  face: Face;
  palette: Palette;
  underline: number;
  draw: number;
}) => (
  <Row top={top} height={size * HEAD_LINE} width={width} style={{ gap: size * WORD_GAP }}>
    {parts.map((part, at) =>
      part === '' ? null : (
        <div
          key={HEAD_KEYS[at]}
          style={{
            ...revealStyle(reveals[at] ?? { opacity: 1, rise: 0 }),
            position: 'relative',
          }}
        >
          <CanvasText
            look={{
              text: part,
              face,
              size,
              tracking: 0,
              color: at === 1 ? palette.accent : palette.text,
              lineHeight: HEAD_LINE,
              width: (widths[at] ?? 0) * size,
            }}
          />
          {at === 1 && underline > 0 ? (
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: Math.round(size * UNDERLINE_TOP),
                height: underline,
                borderRadius: underline / 2,
                backgroundColor: palette.accent,
                transform: `scaleX(${draw.toFixed(4)})`,
                transformOrigin: 'left center',
                opacity: Math.min(1, draw * 5),
              }}
            />
          ) : null}
        </div>
      ),
    )}
  </Row>
);

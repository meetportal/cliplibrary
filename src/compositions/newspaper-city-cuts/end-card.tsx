import { AbsoluteFill, useVideoConfig } from 'remotion';
import type { NewspaperCityCutsProps } from '@/schemas';
import { pixelTween, settle, smooth, tween } from '../promo/timing';
import { endCardFont, fittedFontSize, useEndCardFonts } from './end-card-fonts';
import { GEM_ASPECT, gemSvgPath } from './gem-mark';

const MARK_WIDTH = 156;
const MARK_STROKE = 5;
const WORDMARK_SIZE = 128;
const TAGLINE_SIZE = 50;
const WORDMARK_TRACKING = 0.2;
const TEXT_ROOM = 0.84;
const ENTRANCE_FRAMES = 26;
const FADE_FRAMES = 16;

const entrance = (frame: number, start: number, rise: number) => ({
  opacity: tween(frame, [start, start + FADE_FRAMES], [0, 1], smooth),
  transform: `translateY(${pixelTween(frame, [start, start + ENTRANCE_FRAMES], [rise, 0], settle)}px)`,
});

export const EndCard = ({
  endCard,
  frame,
}: {
  endCard: NewspaperCityCutsProps['endCard'];
  frame: number;
}) => {
  const { width } = useVideoConfig();
  const fontsReady = useEndCardFonts();
  const room = width * TEXT_ROOM;
  const start = endCard.cutFrame;
  const markWidth = MARK_WIDTH * endCard.markSize;
  const sizeFor = (text: string, size: number, style: string, tracking: number) =>
    fontsReady ? fittedFontSize(text, { size, style, tracking, room }) : size;
  const wordmarkSize = sizeFor(
    endCard.brand,
    WORDMARK_SIZE * endCard.wordmarkSize,
    'normal',
    WORDMARK_TRACKING,
  );
  const taglineSize = sizeFor(endCard.tagline, TAGLINE_SIZE * endCard.taglineSize, 'italic', 0);
  const markHeight = markWidth * GEM_ASPECT;
  const stroke = MARK_STROKE * endCard.markSize;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: endCard.background,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      {endCard.showMark ? (
        <svg
          width={markWidth + stroke * 2}
          height={markHeight + stroke * 2}
          viewBox={`${-stroke} ${-stroke} ${markWidth + stroke * 2} ${markHeight + stroke * 2}`}
          style={{ marginBottom: 44 * endCard.markSize, ...entrance(frame, start, 28) }}
          aria-hidden="true"
        >
          <path
            d={gemSvgPath(markWidth)}
            fill="none"
            stroke={endCard.markColor}
            strokeWidth={stroke}
            strokeLinejoin="miter"
          />
        </svg>
      ) : null}
      <div
        style={{
          fontFamily: endCardFont,
          fontWeight: 500,
          fontSize: wordmarkSize,
          lineHeight: 1,
          letterSpacing: `${WORDMARK_TRACKING}em`,
          paddingLeft: `${WORDMARK_TRACKING}em`,
          color: endCard.wordmarkColor,
          whiteSpace: 'pre',
          ...entrance(frame, start + endCard.wordmarkDelay, 44),
        }}
      >
        {endCard.brand}
      </div>
      <div
        style={{
          fontFamily: endCardFont,
          fontStyle: 'italic',
          fontWeight: 500,
          fontSize: taglineSize,
          lineHeight: 1.2,
          marginTop: 34 * endCard.taglineSize,
          color: endCard.taglineColor,
          whiteSpace: 'pre',
          ...entrance(frame, start + endCard.taglineDelay, 18),
        }}
      >
        {endCard.tagline}
      </div>
    </AbsoluteFill>
  );
};

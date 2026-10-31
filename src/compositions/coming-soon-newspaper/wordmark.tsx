import { AbsoluteFill, useVideoConfig } from 'remotion';
import type { ComingSoonNewspaperProps } from '@/schemas';
import { pixelTween, settle, smooth, tween } from '../promo/timing';
import { wordmarkFont } from './fonts';
import { useWordmarkScale, WORDMARK_RULE_WIDTH } from './wordmark-fit';

type Wordmark = ComingSoonNewspaperProps['wordmark'];

const Word = ({ text, size, wordmark }: { text: string; size: number; wordmark: Wordmark }) => (
  <span
    style={{
      fontFamily: wordmarkFont,
      fontWeight: 300,
      fontSize: size,
      lineHeight: 1,
      letterSpacing: `${wordmark.tracking}em`,
      marginRight: `${-wordmark.tracking}em`,
      color: wordmark.color,
      whiteSpace: 'pre',
    }}
  >
    {text}
  </span>
);

export const WordmarkOutro = ({ wordmark, frame }: { wordmark: Wordmark; frame: number }) => {
  const { width } = useVideoConfig();
  const scale = useWordmarkScale(wordmark, width);
  const range: [number, number] = [wordmark.start, wordmark.start + wordmark.fadeFrames];
  const opacity = tween(frame, range, [0, 1], smooth);
  const rise = pixelTween(frame, range, [wordmark.rise, 0], settle);
  if (opacity <= 0) {
    return null;
  }
  const size = wordmark.size * scale;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: wordmark.gap * scale,
          opacity,
          transform: `translateY(${wordmark.offsetY + rise}px)`,
        }}
      >
        {wordmark.brand.trim() === '' ? null : (
          <Word text={wordmark.brand} size={size} wordmark={wordmark} />
        )}
        {wordmark.ruleHeight > 0 ? (
          <div
            style={{
              width: WORDMARK_RULE_WIDTH,
              height: wordmark.ruleHeight * scale,
              backgroundColor: wordmark.ruleColor,
            }}
          />
        ) : null}
        {wordmark.second.trim() === '' ? null : (
          <Word text={wordmark.second} size={size * wordmark.secondSize} wordmark={wordmark} />
        )}
      </div>
    </AbsoluteFill>
  );
};

import type { GoldMonogramInviteProps } from '@/schemas';
import { fadeAway, goldText, riseIn } from './reveal';

interface QuoteWord {
  text: string;
  script: boolean;
  index: number;
}

const quoteLines = (text: string, phrase: string): QuoteWord[][] => {
  const lower = text.toLowerCase();
  const target = phrase.trim().toLowerCase();
  const phraseStart = target.length > 0 ? lower.indexOf(target) : -1;
  const phraseEnd = phraseStart + target.length;
  let offset = 0;
  let index = 0;
  return text.split('\n').map((line) => {
    const words: QuoteWord[] = [];
    let cursor = 0;
    for (const word of line.split(' ')) {
      const at = offset + cursor;
      cursor += word.length + 1;
      if (word.length === 0) {
        continue;
      }
      words.push({
        text: word,
        script: phraseStart >= 0 && at >= phraseStart && at < phraseEnd,
        index,
      });
      index += 1;
    }
    offset += line.length + 1;
    return words;
  });
};

export const Quote = ({
  frame,
  quote,
  gold,
  color,
  serif,
  script,
}: {
  frame: number;
  quote: GoldMonogramInviteProps['quote'];
  gold: GoldMonogramInviteProps['gold'];
  color: string;
  serif: string;
  script: string;
}) => {
  const exit = fadeAway(frame, quote.end, Math.round(quote.size * 0.25));
  if (exit.opacity <= 0) {
    return null;
  }
  const lines = quoteLines(quote.text, quote.scriptPhrase);
  const scriptSize = quote.size * quote.scriptScale;
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: quote.x,
        width: quote.width,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        opacity: exit.opacity,
        transform: `translateY(${exit.offset}px)`,
      }}
    >
      {lines.map((words, lineIndex) => (
        <div
          key={`${lineIndex}:${words.map((word) => word.text).join(' ')}`}
          style={{
            fontFamily: serif,
            fontSize: quote.size,
            fontWeight: 500,
            lineHeight: 1.32,
            color,
            whiteSpace: 'nowrap',
          }}
        >
          {words.map((word) => {
            const reveal = riseIn(
              frame,
              quote.start + word.index * quote.wordStagger,
              Math.round(quote.size * 0.42),
            );
            return (
              <span key={word.index}>
                <span
                  style={{
                    display: 'inline-block',
                    opacity: reveal.opacity,
                    transform: `translateY(${reveal.offset}px)`,
                    ...(word.script
                      ? {
                          fontFamily: script,
                          fontSize: scriptSize,
                          fontWeight: 400,
                          lineHeight: 1,
                          ...goldText(gold.light, gold.dark),
                        }
                      : {}),
                  }}
                >
                  {word.text}
                </span>{' '}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

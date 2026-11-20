import type { CSSProperties, ReactNode } from 'react';
import type { FitBlock, FitLine } from './copy-fit';
import { FRAME } from './swing';

type Inks = { text: string; accent: string };

const lineStyle = (block: FitBlock, line: FitLine, family: string): CSSProperties => ({
  position: 'absolute',
  left: 0,
  width: FRAME.width,
  top: line.y - block.lineHeight / 2,
  height: block.lineHeight,
  lineHeight: `${block.lineHeight}px`,
  fontFamily: family,
  fontWeight: line.weight,
  fontSize: block.size,
  textAlign: 'center',
  whiteSpace: 'pre',
});

const splitInitial = (text: string): [string, string] => {
  const [first = '', ...rest] = Array.from(text);
  return [first, rest.join('')];
};

const lineContent = (line: FitLine, inks: Inks, initial: boolean): ReactNode[] =>
  line.words.flatMap((word, at) => {
    const gap = at === 0 ? '' : ' ';
    if (initial && at === 0) {
      const [first, rest] = splitInitial(word.text);
      return [
        <span key="initial" style={{ color: inks.accent }}>
          {first}
        </span>,
        <span key="rest">{rest}</span>,
      ];
    }
    return [
      <span key={`${at}-${word.text}`} style={word.accent ? { color: inks.accent } : undefined}>
        {gap}
        {word.text}
      </span>,
    ];
  });

export const TextBlock = ({
  block,
  family,
  inks,
  accentInitial = false,
}: {
  block: FitBlock;
  family: string;
  inks: Inks;
  accentInitial?: boolean;
}) => (
  <>
    {block.lines.map((line, at) => (
      <div key={`${at}-${line.y}`} style={{ ...lineStyle(block, line, family), color: inks.text }}>
        {lineContent(line, inks, accentInitial && at === 0)}
      </div>
    ))}
  </>
);
